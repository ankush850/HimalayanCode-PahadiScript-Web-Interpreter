# 🏔️ HimalayanCode<sup>®</sup>: PahadiScript Web Interpreter

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-green)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-19.0%2B-cyan)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0%2B-yellow)](https://sqlite.org)
[![PLY](https://img.shields.io/badge/PLY-3.11-orange)](https://www.dabeaz.com/ply/)

A web-based interpreter for the PahadiScript programming language, featuring a premium React-based compiler IDE and execution environment.

> **Code in the language of the mountains** - A complete web-based IDE and interpreter for PahadiScript, a Himalayan-inspired programming language.

---

![System DFA Diagram](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/DFA.png)

## 1. Problem Statement
Many students enter engineering without having Computer Science as a subject in their school education. In Class 12, a large number of students choose other optional subjects instead of Computer Science. As a result, when they start their first year of engineering, they face difficulty in understanding basic programming concepts, especially in languages like C.

These students often struggle with syntax, logic building, and implementation because everything is new to them. The use of English keywords in programming languages adds another level of difficulty, making it harder for them to learn quickly and confidently. This gap affects their ability to build a strong foundation in programming during the early stages of their engineering journey. 

To solve this problem, PahadiScript is introduced as a beginner-friendly programming language that uses simple Hindi-based keywords. It allows students to write code in a more familiar language, helping them understand concepts more easily. The main goal is to support students who are new to programming so they can build their basics in the first and second year of engineering and improve their overall learning experience.

## 2. Need of the Project
1. Many students enter engineering without any programming background, making basic concepts hard to understand.
2. English-based syntax creates an extra barrier for students who are more comfortable with Hindi.
3. Beginners struggle to focus on logic because they get stuck in learning complex syntax.
4. A simple Hindi-based language helps students learn programming concepts easily and build a strong foundation.

---

## 3. Objectives

### 3.1 Main Objective
The main objective of this project is to design and develop a simple, beginner-friendly programming language called PahadiScript that uses Hindi-based keywords to make learning programming easier. It aims to help students who do not have a Computer Science background understand basic programming concepts like variables, conditions, and loops without struggling with complex English syntax.

Another objective is to apply compiler design concepts such as lexical analysis, syntax parsing, and execution in a practical way by building a working web-based interpreter. This project also focuses on creating an interactive platform where users can write, run, and understand code easily, helping them build a strong foundation for further learning in engineering.

### 3.2 Specific Objectives
- To design a simple programming language using Hindi-based keywords for better understanding.
- To implement lexical analysis using PLY for tokenizing the input code.
- To develop a parser that checks syntax and handles basic programming structures like loops and conditions.
- To build an execution system (interpreter/VM) that runs PahadiScript programs correctly.
- To create an interactive React-based web interface where users can write and execute code easily.
- To provide compile metrics dashboards and compiler execution history.

---

## 4. Architectural Design Diagrams

### Level 0 DFD
![Level 0 DFD](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/lvl_0_%20DFD.png)

### Level 1 DFD
![Level 1 DFD](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/Lvl_1_DFD.png)

### System Architecture
![System Architecture](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/sys%20Arch.png)

---

## 5. Tools and Technologies Used

| Component | Technology Used |
| :--- | :--- |
| **Frontend** | React 19 (Vite), TypeScript, Tailwind CSS v4, CodeMirror (Code Editor), Chart.js |
| **Backend** | Python 3.11+, Flask, Flask-SQLAlchemy, SQLite (Default), PostgreSQL |
| **Compiler Core** | Python, PLY (Lex/Yacc Lexer and Parser) |
| **API Design** | RESTful APIs with Flask and Flask-Limiter (Rate Limiting) |
| **Styling Aesthetics** | Premium Glassmorphism UI, Cinematic Looping Video Background, Responsive Layouts |
| **IDE / Editor** | Visual Studio Code |
| **Version Control** | Git |

---

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
![Work Flow](https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter/blob/ad4ba8af48c936f8590e9fd0dbf7c65ec084cbde/Assests/WorkFlow.png)

---

## 🚀 Getting Started (Running Instructions)

Follow these steps to set up and run the PahadiScript Web IDE locally in development mode.

### Prerequisites
- Python 3.11 or higher installed on your system.
- Node.js v18+ and npm installed on your system.
- Git.

### 1. Backend Setup & Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter.git
   cd HimalayanCode-PahadiScript-Web-Interpreter
   ```

2. **Create a Virtual Environment**:
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

4. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the Flask Backend Server**:
   ```bash
   python run.py
   ```
   *The Flask API will run on `http://127.0.0.1:5000`.*

---

### 2. Frontend Setup & Run

1. **Open a new terminal session**, navigate to the `landing` directory:
   ```bash
   cd landing
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *The Vite development server will run on `http://localhost:5173`.*

---

### 3. Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```
- In development mode, Vite will automatically proxy all `/api/*` requests to the Flask server at `http://127.0.0.1:5000`.
- Write your code using Hindi keywords, execute it, check analytics metrics in the Dashboard, or view execution histories!
