import ply.lex as lex

reserved = {
    # Spec keywords (+ legacy aliases)
    "shuru": "SHURU",
    "le": "LEDECL",
    "ank": "ANK",
    "naap": "NAAP",
    "akshar": "AKSHAR",
    "bol": "BOL",
    "sun": "SUN",
    "agar": "AGAR",
    "magar": "MAGAR",
    "warna": "MAGAR",
    "phir": "PHIR",
    "jabtak": "JABTAK",
    "bas": "BAS",
    "chalo": "CHALO",
    "kaam": "KAAM",
    "paucha": "PAUCHA",
    "sahi": "SAHI",
    "galat": "GALAT",
    "sach": "SAHI",
    "jhooth": "GALAT",
    "khali": "KHALI",
    "roko": "ROKO",
    "dhancha": "DHANCHA",
    "aur": "AUR",
    "ya": "YA",
    "nahi": "NAHI",
    "batao": "BOL",
}

tokens = (
    "NUMBER",
    "STRING",
    "ID",
    "PLUS",
    "MINUS",
    "MUL",
    "DIV",
    "MOD",
    "EQEQ",
    "NEQ",
    "LT",
    "GT",
    "LE",
    "GE",
    "ASSIGN",
    "LPAREN",
    "RPAREN",
    "LBRACE",
    "RBRACE",
    "COMMA",
    "SEMI",
    "DOT",
    "NEWLINE",
) + tuple(sorted(set(reserved.values())))

t_PLUS = r"\+"
t_MINUS = r"-"
t_MUL = r"\*"
t_DIV = r"/"
t_MOD = r"%"
t_EQEQ = r"=="
t_NEQ = r"!="
t_LE = r"<="
t_GE = r">="
t_LT = r"<"
t_GT = r">"
t_ASSIGN = r"="
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_LBRACE = r"\{"
t_RBRACE = r"\}"
t_COMMA = r","
t_SEMI = r";"
t_DOT = r"\."


def t_NUMBER(t):
    r"\d+(\.\d+)?"
    if "." in t.value:
        t.value = float(t.value)
    else:
        t.value = int(t.value)
    return t


def t_STRING(t):
    r'"([^"\\]|\\.)*"'
    inner = t.value[1:-1]
    t.value = bytes(inner, "utf-8").decode("unicode_escape")
    return t


def t_ID(t):
    r"[A-Za-z_][A-Za-z0-9_]*"
    t.type = reserved.get(t.value, "ID")
    return t


def t_NEWLINE(t):
    r"\n+"
    t.lexer.lineno += len(t.value)
    return t


t_ignore = " \t\r"
t_ignore_COMMENT = r"\#.*"


def t_error(t):
    raise SyntaxError(f"Illegal character {t.value[0]!r} at line {t.lexer.lineno}")


lexer = lex.lex()


def tokenize(source: str):
    lexer.lineno = 1
    lexer.input(source)
    out = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        out.append(tok)
    return out
