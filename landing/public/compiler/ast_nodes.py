class ASTNode:
    pass


class Program(ASTNode):
    """Top-level mix of declarations, main (shuru), and loose statements."""

    def __init__(self, items: list["ASTNode"]):
        self.items = items


class Statement(ASTNode):
    pass


class Expr(ASTNode):
    pass


class Number(Expr):
    def __init__(self, value: float):
        self.value = value


class String(Expr):
    def __init__(self, value: str):
        self.value = value


class Name(Expr):
    def __init__(self, id: str):
        self.id = id


class Bool(Expr):
    def __init__(self, value: bool):
        self.value = value


class BinOp(Expr):
    def __init__(self, op: str, left: Expr, right: Expr):
        self.op = op
        self.left = left
        self.right = right


class UnaryOp(Expr):
    def __init__(self, op: str, operand: Expr):
        self.op = op
        self.operand = operand


class Call(Expr):
    def __init__(self, name: str, args: list[Expr]):
        self.name = name
        self.args = args


class Member(Expr):
    """Field access: obj.field"""

    def __init__(self, obj: Expr, field: str):
        self.obj = obj
        self.field = field


class Block(Statement):
    def __init__(self, statements: list[Statement]):
        self.statements = statements


class Assign(Statement):
    def __init__(self, target: Expr, expr: Expr):
        self.target = target
        self.expr = expr


class LeDecl(Statement):
    """le type name [= expr]"""

    def __init__(self, type_name: str, name: str, init: Expr | None):
        self.type_name = type_name
        self.name = name
        self.init = init


class Print(Statement):
    def __init__(self, expr: Expr):
        self.expr = expr


class Sun(Statement):
    """sun id — read one line into variable."""

    def __init__(self, name: str):
        self.name = name


class If(Statement):
    def __init__(self, condition: Expr, then_block: Block, else_block: Block | None):
        self.condition = condition
        self.then_block = then_block
        self.else_block = else_block


class While(Statement):
    def __init__(self, condition: Expr, body: Block):
        self.condition = condition
        self.body = body


class For(Statement):
    def __init__(self, init: Statement | None, cond: Expr | None, step: "Assign | None", body: Block):
        self.init = init
        self.cond = cond
        self.step = step
        self.body = body


class Break(Statement):
    pass


class Continue(Statement):
    pass


class Return(Statement):
    def __init__(self, expr: Expr | None):
        self.expr = expr


class Roko(Statement):
    """Terminate the whole program."""

    pass


class ExprStmt(Statement):
    """Expression used as a statement (e.g. calls)."""

    def __init__(self, expr: Expr):
        self.expr = expr


class FunctionDef(Statement):
    def __init__(self, name: str, params: list[tuple[str, str]], is_void: bool, body: Block):
        self.name = name
        self.params = params  # (type_name, arg_name)
        self.is_void = is_void
        self.body = body


class MainBlock(Statement):
    def __init__(self, body: Block):
        self.body = body


class StructDefStmt(Statement):
    def __init__(self, name: str, fields: list[tuple[str, str]]):
        self.name = name
        self.fields = fields  # (type_name, field_name)
