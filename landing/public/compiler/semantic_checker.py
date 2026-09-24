from app.compiler.ast_nodes import (
    ASTNode, Assign, BinOp, Block, Bool, Break, Call, Continue, Expr, ExprStmt,
    For, FunctionDef, If, LeDecl, MainBlock, Member, Name, Number, Print,
    Program, Return, Roko, Statement, String, StructDefStmt, Sun, UnaryOp, While
)
from app.compiler.scope import ScopeManager
from app.compiler.symbol_table import Symbol
from app.compiler.type_checker import are_types_compatible, get_binop_type

class SemanticError(Exception):
    pass

class SemanticChecker:
    def __init__(self):
        self.scope = ScopeManager()

    def check(self, node: ASTNode) -> None:
        if isinstance(node, Program):
            # First pass: Hoist functions and structs to the global scope
            for item in node.items:
                if isinstance(item, FunctionDef):
                    try:
                        self.scope.define(Symbol(item.name, "kaam", is_function=True, params=item.params))
                    except ValueError as e:
                        raise SemanticError(str(e))
                elif isinstance(item, StructDefStmt):
                    try:
                        self.scope.define(Symbol(item.name, "dhancha", is_struct=True, fields=item.fields))
                    except ValueError as e:
                        raise SemanticError(str(e))
            
            # Second pass: check inside functions and the main blocks
            for item in node.items:
                self.check(item)
                
        elif isinstance(node, Block):
            self.scope.enter_scope()
            for stmt in node.statements:
                self.check(stmt)
            self.scope.exit_scope()
            
        elif isinstance(node, MainBlock):
            self.check(node.body)
            
        elif isinstance(node, FunctionDef):
            self.scope.enter_scope()
            for t_name, p_name in node.params:
                try:
                    self.scope.define(Symbol(p_name, t_name))
                except ValueError:
                    raise SemanticError(f"Duplicate parameter '{p_name}' in function '{node.name}'")
            self.check(node.body)
            self.scope.exit_scope()
            
        elif isinstance(node, StructDefStmt):
            pass # Already hoisted in Program
            
        elif isinstance(node, LeDecl):
            if node.init:
                init_type = self.get_expr_type(node.init)
                if init_type != 'unknown' and not are_types_compatible(node.type_name, init_type):
                    raise SemanticError(f"Can't put '{init_type}' in '{node.type_name}' variable '{node.name}'")
            try:
                self.scope.define(Symbol(node.name, node.type_name))
            except ValueError as e:
                raise SemanticError(str(e))
                
        elif isinstance(node, Assign):
            target = node.target
            if isinstance(target, Name):
                sym = self.scope.lookup(target.id)
                if not sym:
                    raise SemanticError(f"Variable '{target.id}' not found!")
                expr_type = self.get_expr_type(node.expr)
                if expr_type != 'unknown' and not are_types_compatible(sym.type_name, expr_type):
                    raise SemanticError(f"Can't put '{expr_type}' in '{sym.type_name}' variable '{target.id}'")
            elif isinstance(target, Member):
                self.check(target.obj)
            self.check(node.expr)
            
        elif isinstance(node, Print):
            self.check(node.expr)
            
        elif isinstance(node, Sun):
            sym = self.scope.lookup(node.name)
            if not sym:
                raise SemanticError(f"Variable '{node.name}' not found!")
                
        elif isinstance(node, If):
            self.check(node.condition)
            self.check(node.then_block)
            if node.else_block:
                self.check(node.else_block)
                
        elif isinstance(node, While):
            self.check(node.condition)
            self.check(node.body)
            
        elif isinstance(node, For):
            self.scope.enter_scope()
            if node.init:
                self.check(node.init)
            if node.cond:
                self.check(node.cond)
            if node.step:
                self.check(node.step)
            self.check(node.body)
            self.scope.exit_scope()
            
        elif isinstance(node, Return):
            if node.expr:
                self.check(node.expr)
                
        elif isinstance(node, ExprStmt):
            self.check(node.expr)
            
        elif isinstance(node, (Break, Continue, Roko)):
            pass

    def get_expr_type(self, node: Expr) -> str:
        if isinstance(node, Number):
            return "ank" if node.value == int(node.value) else "naap"
        if isinstance(node, String):
            return "akshar"
        if isinstance(node, Bool):
            return "bool"
        if isinstance(node, Name):
            sym = self.scope.lookup(node.id)
            if not sym:
                raise SemanticError(f"Variable '{node.id}' not found!")
            return sym.type_name
        if isinstance(node, BinOp):
            left_type = self.get_expr_type(node.left)
            right_type = self.get_expr_type(node.right)
            return get_binop_type(node.op, left_type, right_type)
        if isinstance(node, UnaryOp):
            return self.get_expr_type(node.operand)
        if isinstance(node, Call):
            sym = self.scope.lookup(node.name)
            if not sym or not sym.is_function:
                raise SemanticError(f"Function '{node.name}' not found!")
            for arg in node.args:
                self.check(arg)
            return "unknown" # Could be void or a specific type, unknown for simplicity
        if isinstance(node, Member):
            obj_type = self.get_expr_type(node.obj)
            sym = self.scope.lookup(obj_type)
            if not sym or not sym.is_struct:
                return "unknown"
            for t_name, f_name in sym.fields:
                if f_name == node.field:
                    return t_name
            raise SemanticError(f"Unknown field '{node.field}' on struct '{obj_type}'")
        return "unknown"
        
def check_semantics(ast: Program) -> None:
    checker = SemanticChecker()
    checker.check(ast)
