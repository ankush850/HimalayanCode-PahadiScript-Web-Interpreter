import sys
import json
import os

# Ensure we can import from the app directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.compiler.interpreter import execute

def main():
    try:
        input_data = json.loads(sys.stdin.read())
        code = input_data.get("code", "")
        stdin_text = input_data.get("stdin", None)
        success, out, err = execute(code, stdin_text=stdin_text)
        print(json.dumps({
            "ok": success,
            "output": out,
            "error": err
        }))
    except Exception as e:
        print(json.dumps({
            "ok": False,
            "output": "",
            "error": f"Internal runner error: {str(e)}"
        }))

if __name__ == "__main__":
    main()
