from app.compiler.symbol_table import SymbolTable, Symbol
from typing import Optional

class ScopeManager:
    def __init__(self):
        self.current_scope = SymbolTable()

    def enter_scope(self):
        self.current_scope = SymbolTable(parent=self.current_scope)

    def exit_scope(self):
        if self.current_scope.parent is None:
            raise Exception("Cannot exit global scope")
        self.current_scope = self.current_scope.parent

    def define(self, symbol: Symbol) -> None:
        self.current_scope.define(symbol)

    def lookup(self, name: str) -> Optional[Symbol]:
        return self.current_scope.lookup(name)
