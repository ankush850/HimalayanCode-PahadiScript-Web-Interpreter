from __future__ import annotations

from dataclasses import dataclass, field
from io import StringIO
from typing import Any, TextIO

from app.compiler.ast_nodes import (
    Assign,
    BinOp,
    Block,
    Bool,
    Break,
    Call,
    Continue,
    ExprStmt,
    For,
    FunctionDef,
    If,
    LeDecl,
    MainBlock,
    Member,
    Name,
    Number,
    Print,
    Program,
    Return,
    Roko,
    Statement,
    String,
    StructDefStmt,
    Sun,
    UnaryOp,
    While,
)

MAX_LOOP_ITERATIONS = 100_000


class InterpreterError(Exception):
    pass


class ReturnSignal(Exception):
    __slots__ = ("value",)

    def __init__(self, value: Any):
        self.value = value


class BreakSignal(Exception):
    pass


class ContinueSignal(Exception):
    pass


class RokoSignal(Exception):
    pass


@dataclass
class Frame:
    locals: dict[str, Any] = field(default_factory=dict)


class Interpreter:
    def __init__(
        self,
        stdout: TextIO | None = None,
        stdin_lines: list[str] | None = None,
        timeout_seconds: float = 2.0,
    ):
        self.stdout = stdout or StringIO()
        self.stdin_lines = stdin_lines or []
        self.functions: dict[str, FunctionDef] = {}
        self.struct_defs: dict[str, list[tuple[str, str]]] = {}
        self.frames: list[Frame] = [Frame()]
        self._loop_iterations = 0
        self.timeout_seconds = timeout_seconds
        self._start_time = 0.0

    @property
    def env(self) -> dict[str, Any]:
        return self.frames[-1].locals

    def run(self, program: Program) -> str:
        import time
        self._start_time = time.time()
        self._loop_iterations = 0
        try:
            for item in program.items:
                if isinstance(item, FunctionDef):
                    if item.name in self.functions:
                        raise InterpreterError(f"duplicate kaam {item.name!r}")
                    self.functions[item.name] = item
                elif isinstance(item, StructDefStmt):
                    if item.name in self.struct_defs:
                        raise InterpreterError(f"duplicate dhancha {item.name!r}")
                    self.struct_defs[item.name] = item.fields
                elif isinstance(item, MainBlock):
                    self._exec_block(item.body)
                else:
                    self._exec_statement(item)
            return self.stdout.getvalue() if hasattr(self.stdout, "getvalue") else ""
        except RokoSignal:
            return self.stdout.getvalue() if hasattr(self.stdout, "getvalue") else ""

    def _push_frame(self) -> None:
        self.frames.append(Frame())

    def _pop_frame(self) -> None:
        if len(self.frames) <= 1:
            raise InterpreterError("internal error: frame underflow")
        self.frames.pop()

    def _lookup_var(self, name: str) -> Any:
        for fr in reversed(self.frames):
            if name in fr.locals:
                return fr.locals[name]
        raise InterpreterError(f"unknown name {name!r}")

    def _set_var(self, name: str, value: Any) -> None:
        for fr in reversed(self.frames):
            if name in fr.locals:
                fr.locals[name] = value
                return
        self.env[name] = value

    def _default_for_type(self, type_name: str) -> Any:
        if type_name == "ank":
            return 0
        if type_name == "naap":
            return 0.0
        if type_name == "akshar":
            return ""
        if type_name in self.struct_defs:
            return self._alloc_struct(type_name)
        raise InterpreterError(f"unknown type {type_name!r}")

    def _alloc_struct(self, struct_name: str) -> dict[str, Any]:
        fields = self.struct_defs[struct_name]
        obj: dict[str, Any] = {"__struct__": struct_name}
        for t, fname in fields:
            obj[fname] = self._default_for_type(t)
        return obj

    def _coerce_param(self, type_name: str, value: Any) -> Any:
        if type_name == "ank":
            if isinstance(value, bool):
                raise InterpreterError("ank cannot be boolean")
            return int(value)
        if type_name == "naap":
            if isinstance(value, bool):
                raise InterpreterError("naap cannot be boolean")
            return float(value)
        if type_name == "akshar":
            if isinstance(value, str) and len(value) >= 1:
                return value[0]
            if isinstance(value, (int, float)):
                return chr(int(value) % 256)
            raise InterpreterError("akshar expects string or number")
        if type_name in self.struct_defs:
            if not isinstance(value, dict) or value.get("__struct__") != type_name:
                raise InterpreterError(f"expected dhancha {type_name}")
            return {k: v for k, v in value.items()}
        raise InterpreterError(f"unknown param type {type_name!r}")

    def _resolve_assign_target(self, target: Any) -> tuple[Any, str | None]:
        """Returns (container dict or None, field_name or variable name)."""
        if isinstance(target, Name):
            return (None, target.id)
        if isinstance(target, Member):
            base = self._eval(target.obj)
            if not isinstance(base, dict) or "__struct__" not in base:
                raise InterpreterError("member assign needs dhancha value")
            return (base, target.field)
        raise InterpreterError("invalid assignment target")

    def _assign_target(self, target: Any, value: Any) -> None:
        container, name = self._resolve_assign_target(target)
        if container is None:
            assert name is not None
            self._set_var(name, value)
        else:
            assert name is not None
            if name not in container or name == "__struct__":
                raise InterpreterError(f"unknown field {name!r}")
            container[name] = value

    def _exec_statement(self, stmt: Statement) -> None:
        import time
        if time.time() - self._start_time > self.timeout_seconds:
            raise InterpreterError(f"execution timeout exceeded ({self.timeout_seconds}s)")

        if isinstance(stmt, Assign):
            self._assign_target(stmt.target, self._eval(stmt.expr))
        elif isinstance(stmt, LeDecl):
            if stmt.init is not None:
                val = self._eval(stmt.init)
                val = self._coerce_decl(stmt.type_name, val)
                self.env[stmt.name] = val
            else:
                self.env[stmt.name] = self._default_for_type(stmt.type_name)
        elif isinstance(stmt, Print):
            val = self._eval(stmt.expr)
            self.stdout.write(self._stringify(val) + "\n")
        elif isinstance(stmt, Sun):
            if not self.stdin_lines:
                raise InterpreterError("sun: no input lines left")
            raw = self.stdin_lines.pop(0).rstrip("\r\n")
            try:
                if "." in raw:
                    num = float(raw)
                else:
                    num = int(raw)
                self._set_var(stmt.name, num)
            except ValueError:
                self._set_var(stmt.name, raw)
        elif isinstance(stmt, If):
            cond = self._eval(stmt.condition)
            if not isinstance(cond, (bool, int, float, str)):
                raise InterpreterError("agar condition type not supported")
            truth = self._truthy(cond)
            block = stmt.then_block if truth else stmt.else_block
            if block is not None:
                self._exec_block(block)
        elif isinstance(stmt, While):
            while self._truthy(self._eval(stmt.condition)):
                self._loop_iterations += 1
                if self._loop_iterations > MAX_LOOP_ITERATIONS:
                    raise InterpreterError(f"jabtak exceeded {MAX_LOOP_ITERATIONS} iterations")
                try:
                    self._exec_block(stmt.body)
                except ContinueSignal:
                    continue
                except BreakSignal:
                    break
        elif isinstance(stmt, For):
            self._push_frame()
            try:
                if stmt.init:
                    self._exec_statement(stmt.init)
                while True:
                    if stmt.cond is not None and not self._truthy(self._eval(stmt.cond)):
                        break
                    self._loop_iterations += 1
                    if self._loop_iterations > MAX_LOOP_ITERATIONS:
                        raise InterpreterError(f"phir exceeded {MAX_LOOP_ITERATIONS} iterations")
                    try:
                        self._exec_block(stmt.body)
                    except ContinueSignal:
                        pass
                    except BreakSignal:
                        break
                    if stmt.step:
                        self._exec_statement(stmt.step)
            finally:
                self._pop_frame()
        elif isinstance(stmt, Break):
            raise BreakSignal()
        elif isinstance(stmt, Continue):
            raise ContinueSignal()
        elif isinstance(stmt, Return):
            if len(self.frames) <= 1:
                raise InterpreterError("paucha outside kaam")
            raise ReturnSignal(self._eval(stmt.expr) if stmt.expr is not None else None)
        elif isinstance(stmt, Roko):
            raise RokoSignal()
        elif isinstance(stmt, ExprStmt):
            self._eval(stmt.expr)
        elif isinstance(stmt, Block):
            self._exec_block(stmt)
        elif isinstance(stmt, (FunctionDef, StructDefStmt, MainBlock)):
            raise InterpreterError("internal error: definition not hoisted")
        else:
            raise InterpreterError(f"unsupported statement: {type(stmt).__name__}")

    def _coerce_decl(self, type_name: str, value: Any) -> Any:
        return self._coerce_param(type_name, value)

    def _exec_block(self, block: Block) -> None:
        self._push_frame()
        try:
            for s in block.statements:
                self._exec_statement(s)
        finally:
            self._pop_frame()

    def _truthy(self, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, (int, float)):
            return v != 0
        if isinstance(v, str):
            return len(v) > 0
        return bool(v)

    def _stringify(self, v: Any) -> str:
        if isinstance(v, bool):
            return "sahi" if v else "galat"
        if isinstance(v, float) and v == int(v):
            return str(int(v))
        return str(v)

    def _eval(self, node: Any) -> Any:
        if isinstance(node, Number):
            return node.value
        if isinstance(node, String):
            return node.value
        if isinstance(node, Bool):
            return node.value
        if isinstance(node, Name):
            return self._lookup_var(node.id)
        if isinstance(node, UnaryOp):
            v = self._eval(node.operand)
            if node.op == "-":
                self._expect_number(v, "unary minus")
                return -v
            if node.op == "!":
                return not self._truthy(v)
        if isinstance(node, BinOp):
            return self._eval_binop(node)
        if isinstance(node, Call):
            return self._call(node.name, [self._eval(a) for a in node.args])
        if isinstance(node, Member):
            base = self._eval(node.obj)
            if not isinstance(base, dict) or "__struct__" not in base:
                raise InterpreterError("member access on non-dhancha")
            if node.field not in base:
                raise InterpreterError(f"unknown field {node.field!r}")
            return base[node.field]
        raise InterpreterError(f"unsupported expression: {type(node).__name__}")

    def _expect_number(self, v: Any, ctx: str) -> float:
        if not isinstance(v, (int, float)):
            raise InterpreterError(f"{ctx} expects a number")
        return float(v)

    def _eval_binop(self, node: BinOp) -> Any:
        op = node.op
        left = self._eval(node.left)
        right = self._eval(node.right)

        if op == "AUR":
            return self._truthy(left) and self._truthy(right)
        if op == "YA":
            return self._truthy(left) or self._truthy(right)

        if op in ("EQEQ", "NEQ", "LT", "GT", "LE", "GE"):
            return self._cmp(op, left, right)

        self._expect_number(left, "arithmetic")
        self._expect_number(right, "arithmetic")
        if op == "PLUS":
            res = left + right
            if isinstance(res, str) and len(res) > 50_000:
                raise InterpreterError("string length exceeded maximum limit")
            return res
        if op == "MINUS":
            return left - right
        if op == "MUL":
            res = left * right
            if isinstance(res, str) and len(res) > 50_000:
                raise InterpreterError("string length exceeded maximum limit")
            return res
        if op == "DIV":
            if right == 0:
                raise InterpreterError("division by zero")
            return left / right
        if op == "MOD":
            if right == 0:
                raise InterpreterError("modulo by zero")
            return int(left) % int(right)
        raise InterpreterError(f"unknown operator {op!r}")

    def _cmp(self, op: str, left: Any, right: Any) -> bool:
        if type(left) != type(right) and not (
            isinstance(left, (int, float)) and isinstance(right, (int, float))
        ):
            raise InterpreterError("comparison requires compatible types")
        if op == "EQEQ":
            return left == right
        if op == "NEQ":
            return left != right
        if not isinstance(left, (int, float, str)) or not isinstance(right, (int, float, str)):
            raise InterpreterError("ordering comparison not supported for this type")
        if op == "LT":
            return left < right
        if op == "GT":
            return left > right
        if op == "LE":
            return left <= right
        if op == "GE":
            return left >= right
        raise InterpreterError(f"unknown comparison {op!r}")

    def _call(self, name: str, args: list[Any]) -> Any:
        fn = self.functions.get(name)
        if not fn:
            raise InterpreterError(f"unknown kaam {name!r}")
        if len(fn.params) != len(args):
            raise InterpreterError(f"{name} expects {len(fn.params)} arguments, got {len(args)}")
        bound = [self._coerce_param(t, v) for (t, _), v in zip(fn.params, args)]
        self._push_frame()
        ret_val: Any | None = None
        returned = False
        try:
            for (t, pname), val in zip(fn.params, bound):
                self.env[pname] = val
            for st in fn.body.statements:
                self._exec_statement(st)
        except ReturnSignal as ret:
            ret_val = ret.value
            returned = True
        finally:
            self._pop_frame()
        return ret_val if returned else None


def execute(source: str, stdin_text: str | None = None, timeout_seconds: float = 2.0) -> tuple[bool, str, str | None]:
    """
    Parse and run PahadiScript source.
    stdin_text: optional multi-line string consumed by sun statements line-by-line.
    """
    from app.compiler.parser import parse
    from app.compiler.semantic_checker import check_semantics, SemanticError

    lines = []
    if stdin_text:
        lines = stdin_text.splitlines()

    buf = StringIO()
    try:
        ast = parse(source)
        if ast is None:
            return False, "", "Parse failed (unknown syntax error)"
        
        # Check semantics before executing (Jay's Memory Tracker)
        check_semantics(ast)
        
        interp = Interpreter(stdout=buf, stdin_lines=lines, timeout_seconds=timeout_seconds)
        interp.run(ast)
        return True, buf.getvalue(), None
    except SyntaxError as e:
        return False, "", str(e)
    except SemanticError as e:
        return False, "", f"Semantic error: {e}"
    except InterpreterError as e:
        return False, buf.getvalue(), str(e)
    except ZeroDivisionError:
        return False, buf.getvalue(), "division by zero"
    except Exception as e:
        return False, buf.getvalue(), f"runtime error: {e}"
