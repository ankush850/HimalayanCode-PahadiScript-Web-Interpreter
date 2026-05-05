from dataclasses import dataclass
from typing import Optional

@dataclass
class Symbol:
    name: str
    type_name: str
    is_function: bool = False
    is_struct: bool = False
    params: list[tuple[str, str]] | None = None
    fields: list[tuple[str, str]] | None = None

class SymbolTable:
    def __init__(self, parent: Optional['SymbolTable'] = None):
        self.symbols: dict[str, Symbol] = {}
        self.parent = parent

    def define(self, symbol: Symbol) -> None:
        if symbol.name in self.symbols:
            raise ValueError(f"'{symbol.name}' already created in the current scope")
        self.symbols[symbol.name] = symbol

    def lookup(self, name: str) -> Optional[Symbol]:
        if name in self.symbols:
            return self.symbols[name]
        if self.parent:
            return self.parent.lookup(name)
        return None
