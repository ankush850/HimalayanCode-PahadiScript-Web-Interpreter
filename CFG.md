# PahadiScript Context-Free Grammar (CFG)

This document contains the complete Context-Free Grammar (CFG) for PahadiScript, based on the LALR(1) parser rules.

**Legend:**
- **UPPERCASE:** Terminals (Tokens/Keywords like `SHURU`, `ID`, `NUMBER`, `PLUS`)
- **lowercase:** Non-Terminals (Grammar rules)
- **`ε` (Epsilon):** Empty string (nothing)

---

## 1. Program Structure

```text
program             -> opt_newlines translation_unit opt_newlines

translation_unit    -> ε 
                     | tu_item 
                     | translation_unit sep_plus tu_item

tu_item             -> function_decl 
                     | main_decl 
                     | struct_decl 
                     | statement

main_decl           -> SHURU block

function_decl       -> kaam_header block

kaam_header         -> KAAM KHALI ID LPAREN param_list RPAREN 
                     | KAAM ID LPAREN param_list RPAREN

struct_decl         -> DHANCHA ID LBRACE struct_inner RBRACE

struct_inner        -> opt_newlines struct_field_list opt_newlines

struct_field_list   -> struct_field 
                     | struct_field_list sep_plus struct_field

struct_field        -> type_spec ID

type_spec           -> ANK | NAAP | AKSHAR | ID

param_list          -> ε 
                     | param 
                     | param_list COMMA param

param               -> type_spec ID
```

---

## 2. Statements

```text
statement           -> assign_statement 
                     | le_decl 
                     | print_statement 
                     | sun_statement 
                     | if_statement 
                     | while_statement 
                     | for_statement 
                     | break_statement 
                     | continue_statement 
                     | return_statement 
                     | roko_statement 
                     | expr_statement

assign_statement    -> mutable ASSIGN expression

mutable             -> ID 
                     | mutable DOT ID

le_decl             -> LEDECL type_spec ID ASSIGN expression 
                     | LEDECL type_spec ID

print_statement     -> BOL expression

sun_statement       -> SUN ID

if_statement        -> AGAR expression block else_part

else_part           -> MAGAR block 
                     | ε

while_statement     -> JABTAK expression block

for_statement       -> PHIR LPAREN for_init SEMI for_cond SEMI for_step RPAREN block

for_init            -> assign_statement | le_decl | ε
for_cond            -> expression | ε
for_step            -> assign_statement | ε

break_statement     -> BAS opt_semi
continue_statement  -> CHALO opt_semi

return_statement    -> PAUCHA expression opt_semi 
                     | PAUCHA opt_semi

roko_statement      -> ROKO opt_semi

expr_statement      -> expression

block               -> LBRACE opt_newlines inner_statement_list opt_newlines RBRACE 
                     | LBRACE opt_newlines RBRACE

inner_statement_list-> ε 
                     | statement 
                     | inner_statement_list sep_plus statement 
                     | inner_statement_list sep_plus
```

---

## 3. Expressions (Maths & Logic)

```text
expression          -> expression PLUS unary_expr
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
                     | expression YA unary_expr
                     | unary_expr

unary_expr          -> MINUS unary_expr 
                     | NAHI unary_expr 
                     | postfix_expr

postfix_expr        -> postfix_expr LPAREN call_args RPAREN 
                     | postfix_expr DOT ID 
                     | primary_expr

primary_expr        -> LPAREN expression RPAREN 
                     | NUMBER 
                     | STRING 
                     | ID 
                     | SAHI 
                     | GALAT

call_args           -> ε 
                     | expr_list

expr_list           -> expression 
                     | expr_list COMMA expression
```

---

## 4. Separators & Utilities

```text
sep_plus            -> NEWLINE 
                     | SEMI 
                     | sep_plus NEWLINE 
                     | sep_plus SEMI

opt_newlines        -> NEWLINE opt_newlines 
                     | ε

opt_semi            -> SEMI 
                     | ε
```
