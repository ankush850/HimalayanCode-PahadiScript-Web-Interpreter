"""PahadiScript parser and AST builder using PLY."""

import ply.yacc as yacc

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
    String,
    StructDefStmt,
    Sun,
    UnaryOp,
    While,
)
from app.compiler.lexer import lexer, tokens

precedence = (
    ("left", "YA"),
    ("left", "AUR"),
    ("nonassoc", "EQEQ", "NEQ", "LT", "GT", "LE", "GE"),
    ("left", "PLUS", "MINUS"),
    ("left", "MUL", "DIV", "MOD"),
    ("right", "NAHI", "UMINUS"),
)


def p_program(p):
    """program : opt_newlines translation_unit opt_newlines"""
    p[0] = Program(p[2])


def p_translation_unit_empty(p):
    """translation_unit : empty"""
    p[0] = []


def p_translation_unit_one(p):
    """translation_unit : tu_item"""
    p[0] = [p[1]]


def p_translation_unit_multi(p):
    """translation_unit : translation_unit sep_plus tu_item"""
    p[0] = p[1] + [p[3]]


def p_tu_function(p):
    """tu_item : function_decl"""
    p[0] = p[1]


def p_tu_main(p):
    """tu_item : main_decl"""
    p[0] = p[1]


def p_tu_struct(p):
    """tu_item : struct_decl"""
    p[0] = p[1]


def p_tu_stmt(p):
    """tu_item : statement"""
    p[0] = p[1]


def p_main_decl(p):
    """main_decl : SHURU block"""
    p[0] = MainBlock(p[2])


def p_function_decl(p):
    """function_decl : kaam_header block"""
    hdr = p[1]
    p[0] = FunctionDef(hdr["name"], hdr["params"], hdr["is_void"], p[2])


def p_kaam_header_void(p):
    """kaam_header : KAAM KHALI ID LPAREN param_list RPAREN"""
    p[0] = {"name": p[3], "params": p[5], "is_void": True}


def p_kaam_header_nonvoid(p):
    """kaam_header : KAAM ID LPAREN param_list RPAREN"""
    p[0] = {"name": p[2], "params": p[4], "is_void": False}


def p_param_list_empty(p):
    """param_list : empty"""
    p[0] = []


def p_param_list_one(p):
    """param_list : param"""
    p[0] = [p[1]]


def p_param_list_multi(p):
    """param_list : param_list COMMA param"""
    p[0] = p[1] + [p[3]]


def p_param(p):
    """param : type_spec ID"""
    p[0] = (p[1], p[2])


def p_type_kw_ank(p):
    """type_spec : ANK"""
    p[0] = "ank"


def p_type_kw_naap(p):
    """type_spec : NAAP"""
    p[0] = "naap"


def p_type_kw_akshar(p):
    """type_spec : AKSHAR"""
    p[0] = "akshar"


def p_type_struct(p):
    """type_spec : ID"""
    p[0] = p[1]


def p_struct_decl(p):
    """struct_decl : DHANCHA ID LBRACE struct_inner RBRACE"""
    p[0] = StructDefStmt(p[2], p[4])


def p_struct_inner(p):
    """struct_inner : opt_newlines struct_field_list opt_newlines"""
    p[0] = p[2]


def p_struct_fields_one(p):
    """struct_field_list : struct_field"""
    p[0] = [p[1]]


def p_struct_fields_multi(p):
    """struct_field_list : struct_field_list sep_plus struct_field"""
    p[0] = p[1] + [p[3]]


def p_struct_field(p):
    """struct_field : type_spec ID"""
    p[0] = (p[1], p[2])


def p_sep_plus_nl(p):
    """sep_plus : NEWLINE"""


def p_sep_plus_semi(p):
    """sep_plus : SEMI"""


def p_sep_plus_chain_nl(p):
    """sep_plus : sep_plus NEWLINE"""


def p_sep_plus_chain_semi(p):
    """sep_plus : sep_plus SEMI"""


def p_statement_assign(p):
    """statement : assign_statement"""
    p[0] = p[1]


def p_statement_le(p):
    """statement : le_decl"""
    p[0] = p[1]


def p_statement_print(p):
    """statement : print_statement"""
    p[0] = p[1]


def p_statement_sun(p):
    """statement : sun_statement"""
    p[0] = p[1]


def p_statement_if(p):
    """statement : if_statement"""
    p[0] = p[1]


def p_statement_while(p):
    """statement : while_statement"""
    p[0] = p[1]


def p_statement_for(p):
    """statement : for_statement"""
    p[0] = p[1]


def p_statement_break(p):
    """statement : break_statement"""
    p[0] = p[1]


def p_statement_continue(p):
    """statement : continue_statement"""
    p[0] = p[1]


def p_statement_return(p):
    """statement : return_statement"""
    p[0] = p[1]


def p_statement_roko(p):
    """statement : roko_statement"""
    p[0] = p[1]


def p_statement_expr(p):
    """statement : expr_statement"""
    p[0] = p[1]


def p_assign_statement(p):
    """assign_statement : mutable ASSIGN expression"""
    p[0] = Assign(p[1], p[3])


def p_mutable_id(p):
    """mutable : ID"""
    p[0] = Name(p[1])


def p_mutable_dot(p):
    """mutable : mutable DOT ID"""
    p[0] = Member(p[1], p[3])


def p_le_decl_init(p):
    """le_decl : LEDECL type_spec ID ASSIGN expression"""
    p[0] = LeDecl(p[2], p[3], p[5])


def p_le_decl_default(p):
    """le_decl : LEDECL type_spec ID"""
    p[0] = LeDecl(p[2], p[3], None)


def p_print_statement(p):
    """print_statement : BOL expression"""
    p[0] = Print(p[2])


def p_sun_statement(p):
    """sun_statement : SUN ID"""
    p[0] = Sun(p[2])


def p_if_statement(p):
    """if_statement : AGAR expression block else_part"""
    p[0] = If(p[2], p[3], p[4])


def p_else_part_maggar(p):
    """else_part : MAGAR block"""
    p[0] = p[2]


def p_else_part_empty(p):
    """else_part : empty"""
    p[0] = None


def p_while_statement(p):
    """while_statement : JABTAK expression block"""
    p[0] = While(p[2], p[3])


def p_for_statement(p):
    """for_statement : PHIR LPAREN for_init SEMI for_cond SEMI for_step RPAREN block"""
    step = p[7]
    if step is not None and not isinstance(step, Assign):
        raise SyntaxError("phir step must be assignment")
    p[0] = For(p[3], p[5], step, p[9])


def p_for_init_assign(p):
    """for_init : assign_statement"""
    p[0] = p[1]


def p_for_init_le(p):
    """for_init : le_decl"""
    p[0] = p[1]


def p_for_init_empty(p):
    """for_init : empty"""
    p[0] = None


def p_for_cond_expr(p):
    """for_cond : expression"""
    p[0] = p[1]


def p_for_cond_empty(p):
    """for_cond : empty"""
    p[0] = None


def p_for_step_assign(p):
    """for_step : assign_statement"""
    p[0] = p[1]


def p_for_step_empty(p):
    """for_step : empty"""
    p[0] = None


def p_break_statement(p):
    """break_statement : BAS opt_semi"""
    p[0] = Break()


def p_continue_statement(p):
    """continue_statement : CHALO opt_semi"""
    p[0] = Continue()


def p_return_statement_val(p):
    """return_statement : PAUCHA expression opt_semi"""
    p[0] = Return(p[2])


def p_return_statement_void(p):
    """return_statement : PAUCHA opt_semi"""
    p[0] = Return(None)


def p_roko_statement(p):
    """roko_statement : ROKO opt_semi"""
    p[0] = Roko()


def p_expr_statement(p):
    """expr_statement : expression"""
    p[0] = ExprStmt(p[1])


def p_opt_semi_semi(p):
    """opt_semi : SEMI"""
    pass


def p_opt_semi_empty(p):
    """opt_semi : empty"""
    pass


def p_block_nonempty(p):
    """block : LBRACE opt_newlines inner_statement_list opt_newlines RBRACE"""
    p[0] = Block(p[3])


def p_block_empty(p):
    """block : LBRACE opt_newlines RBRACE"""
    p[0] = Block([])


def p_inner_statement_list_empty(p):
    """inner_statement_list : empty"""
    p[0] = []


def p_inner_statement_list_one(p):
    """inner_statement_list : statement"""
    p[0] = [p[1]]


def p_inner_statement_list_multi(p):
    """inner_statement_list : inner_statement_list sep_plus statement"""
    p[0] = p[1] + [p[3]]


def p_inner_statement_list_trailing_sep(p):
    """inner_statement_list : inner_statement_list sep_plus"""
    p[0] = p[1]


def p_opt_newlines_some(p):
    """opt_newlines : NEWLINE opt_newlines"""
    p[0] = None


def p_opt_newlines_empty(p):
    """opt_newlines : empty"""
    p[0] = None


def p_empty(p):
    """empty :"""
    pass


def p_expression_binop(p):
    """expression : expression PLUS unary_expr
    | expression MINUS unary_expr
    | expression MUL unary_expr
    | expression DIV unary_expr
    | expression MOD unary_expr
    | expression EQEQ unary_expr
    | expression NEQ unary_expr
    | expression LT unary_expr
    | expression GT unary_expr
    | expression LE unary_expr
    | expression GE unary_expr
    | expression AUR unary_expr
    | expression YA unary_expr"""
    p[0] = BinOp(p.slice[2].type, p[1], p[3])


def p_expression_unary_fallback(p):
    """expression : unary_expr"""
    p[0] = p[1]


def p_unary_minus(p):
    """unary_expr : MINUS unary_expr %prec UMINUS"""
    p[0] = UnaryOp("-", p[2])


def p_unary_not(p):
    """unary_expr : NAHI unary_expr"""
    p[0] = UnaryOp("!", p[2])


def p_unary_postfix(p):
    """unary_expr : postfix_expr"""
    p[0] = p[1]


def p_postfix_call(p):
    """postfix_expr : postfix_expr LPAREN call_args RPAREN"""
    pe = p[1]
    args = p[3]
    if isinstance(pe, Name):
        p[0] = Call(pe.id, args)
    else:
        raise SyntaxError("call target must be a simple name")


def p_postfix_member(p):
    """postfix_expr : postfix_expr DOT ID"""
    p[0] = Member(p[1], p[3])


def p_postfix_primary(p):
    """postfix_expr : primary_expr"""
    p[0] = p[1]


def p_primary_paren(p):
    """primary_expr : LPAREN expression RPAREN"""
    p[0] = p[2]


def p_primary_number(p):
    """primary_expr : NUMBER"""
    v = p[1]
    p[0] = Number(float(v)) if isinstance(v, int) else Number(v)


def p_primary_string(p):
    """primary_expr : STRING"""
    p[0] = String(p[1])


def p_primary_name(p):
    """primary_expr : ID"""
    p[0] = Name(p[1])


def p_primary_true(p):
    """primary_expr : SAHI"""
    p[0] = Bool(True)


def p_primary_false(p):
    """primary_expr : GALAT"""
    p[0] = Bool(False)


def p_call_args_empty(p):
    """call_args : empty"""
    p[0] = []


def p_call_args_list(p):
    """call_args : expr_list"""
    p[0] = p[1]


def p_expr_list_one(p):
    """expr_list : expression"""
    p[0] = [p[1]]


def p_expr_list_more(p):
    """expr_list : expr_list COMMA expression"""
    p[0] = p[1] + [p[3]]


def p_error(p):
    if p:
        raise SyntaxError(f"Syntax error at token {p.type!r} ({p.value!r}), line {p.lineno}")
    raise SyntaxError("Syntax error: unexpected end of input")


parser = yacc.yacc(debug=False, write_tables=False)


def parse(source: str):
    lexer.lineno = 1
    ast = parser.parse(source, lexer=lexer)
    return ast
