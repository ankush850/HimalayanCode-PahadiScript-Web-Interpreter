def are_types_compatible(expected: str, actual: str) -> bool:
    """Check if 'actual' type can be assigned to 'expected' type."""
    if expected == actual:
        return True
    if expected == "naap" and actual == "ank":
        return True  # integers can be cast to floats implicitly
    if expected == "akshar" and actual in ["ank", "naap"]:
        return True  # numbers can be converted to strings implicitly
    return False

def get_binop_type(op: str, left_type: str, right_type: str) -> str:
    """Determine the return type of a binary operation."""
    if op in ("EQEQ", "NEQ", "LT", "GT", "LE", "GE", "AUR", "YA"):
        return "bool"
    if left_type == "naap" or right_type == "naap":
        return "naap"
    if left_type == "akshar" or right_type == "akshar":
        return "akshar" # string concatenation potentially
    return "ank"
