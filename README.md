# 🏔️ HimalayanCode: PahadiScript Web Interpreter

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-green)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0%2B-yellow)](https://sqlite.org)
[![PLY](https://img.shields.io/badge/PLY-3.11-orange)](https://www.dabeaz.com/ply/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/yourusername/HimalayanCode/releases)
[![HimalayanCode](https://img.shields.io/badge/HimalayanCode-PahadiScript_Web_Interpreter-2ea44f)](https://github.com/yourusername/HimalayanCode)
[![Web Ready](https://img.shields.io/badge/Web-Ready-orange)](https://yourusername.github.io/HimalayanCode/)

A web-based interpreter for the PahadiScript programming language, inspired by Himalayan coding traditions.

> **Code in the language of the mountains** - A complete web-based interpreter for PahadiScript, a Himalayan-inspired programming language.
---

![Alt text](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/DFA.png)

## 1 Problem Statement
Many students enter engineering without having Computer Science as a subject in their school education. In Class 12, a large number of students choose other optional subjects instead of Computer Science. As a result, when they start their first year of engineering, they face difficulty in understanding basic programming concepts, especially in languages like C.

These students often struggle with syntax, logic building, and implementation because everything is new to them. The use of English keywords in programming languages adds another level of difficulty, making it harder for them to learn quickly and confidently. This gap affects their ability to build a strong foundation in programming during the early stages of their engineering journey. 

To solve this problem, PahadiScript is introduced as a beginner-friendly programming language that uses simple Hindi-based keywords. It allows students to write code in a more familiar language, helping them understand concepts more easily. The main goal is to support students who are new to programming so they can build their basics in the first and second year of engineering and improve their overall learning experience.

## 2 Need of the Project
1. Many students enter engineering without any programming background, making basic concepts hard to understand.
2. English-based syntax creates an extra barrier for students who are more comfortable with Hindi.
3. Beginners struggle to focus on logic because they get stuck in learning complex syntax.
4. A simple Hindi-based language helps students learn programming concepts easily and build a strong foundation.

---

## 3 Main Objective

The main objective of this project is to design and develop a simple, beginner-friendly programming language called PahadiScript that uses Hindi-based keywords to make learning programming easier. It aims to help students who do not have a Computer Science background understand basic programming concepts like variables, conditions, and loops without struggling with complex English syntax.

Another objective is to apply compiler design concepts such as lexical analysis, syntax parsing, and execution in a practical way by building a working web-based interpreter. This project also focuses on creating an interactive platform where users can write, run, and understand code easily, helping them build a strong foundation for further learning in engineering.

### 3.2 Specific Objectives
- To design a simple programming language using Hindi-based keywords for better understanding.
- To implement lexical analysis using PLY for tokenizing the input code.
- To develop a parser that checks syntax and handles basic programming structures like loops and conditions.
- To build an execution system (interpreter/VM) that runs PahadiScript programs correctly.
- To create a web-based interface where users can write and execute code easily.
- To help beginners understand core programming concepts like variables, loops, and functions in a simple way.
---
## LEVEL 0 DFD 
![Alt text](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/lvl_0_%20DFD.png)

## LEVEL 1 DFD 
![Alt text](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/Lvl_1_DFD.png)


## 4. System Architecture

 ![Alt text](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/sys%20Arch.png)
    


## 5 Tools and Technologies Used

| Component | Technology Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Fetch API |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **Compiler Core** | Python (Custom-built Tokenizer, Parser, AST, CodeGen) |
| **Optimizer** | Python AST Traversal (Constant Folding, Dead Code Elimination) |
| **API Design** | RESTful APIs with FastAPI, CORS Middleware |
| **IDE / Editor** | Visual Studio Code |
| **Version Control** | Git |

## 🗣️ Language Specification (Keywords)

PahadiScript consists of 20 reserved keywords that map to standard C-style operations:

| Keyword | C Equivalent | Purpose |
| :--- | :--- | :--- |
| `shuru` | `main` | Entry point of the script |
| `le` | `var/auto` | General variable declaration |
| `ank` | `int` | Integer data type |
| `naap` | `float` | Floating point data type |
| `akshar` | `char` | Character data type |
| `bol` | `printf` | Standard output |
| `sun` | `scanf` | Standard input |
| `agar` | `if` | Conditional branch |
| `magar` | `else` | Alternative branch |
| `phir` | `for` | Iterative loop |
| `jabtak` | `while` | Conditional loop |
| `bas` | `break` | Terminate loop |
| `chalo` | `continue` | Skip iteration |
| `kaam` | `function` | Function definition |
| `paucha` | `return` | Return value from function |
| `sahi` | `true` | Boolean True |
| `galat` | `false` | Boolean False |
| `khali` | `void` | Null/No return type |
| `roko` | `exit` | Terminate program execution |
| `dhancha` | `struct` | Custom data structure |

---

## Work Flow 
![Alt text](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/WorkFlow.png)

## 🚀 Getting Started (Running Instructions)

Follow these steps to set up and run the PahadiScript Web Interpreter on your local machine.

### Prerequisites
- Python 3.8 or higher installed on your system.
- Git (optional, for cloning the repository).

### Installation & Setup

1. **Clone the Repository** (or download the source code):
   ```bash
   git clone https://github.com/yourusername/HimalayanCode.git
   cd HimalayanCode
   ```

2. **Create a Virtual Environment** (Recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**:
   - On **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - On **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies**:
   Install all the required packages from `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the Database**:
   Set up the local SQLite database for the project:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Running the Application

1. **Start the Server**:
   You can run the application using Python directly:
   ```bash
   python wsgi.py
   ```
   *Alternatively, you can run it via Flask:*
   ```bash
   flask run
   ```

2. **Access the Web Interface**:
   Once the server is running, open your web browser and navigate to:
   ```
   http://127.0.0.0:5000
   ```
   *(Or whatever port is displayed in your terminal)*

You are now ready to write, run, and experiment with PahadiScript!
