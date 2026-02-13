# Vimes Grammar (EBNF)

This document defines the complete grammar for the Vimes programming language.
It is the authoritative reference for all parser and interpreter behavior.

Whitespace is insignificant except where required to separate tokens.
Braces and semicolons define structure; indentation has no meaning.

---

## 1. Lexical Structure

### 1.1 Identifiers

letter ::= [a-zA-Z]
digit ::= [0-9]

### 1.2 Literals

IntLiteral ::= digit+
BoolLiteral ::= "true"|"false"

### 1.3 Keywords


### 1.4 Operators

/ % * +
-

### 1.5 Punctuation

( )

---

## 2. Types

---

## 3. Expressions

Expression ::=
IntLiteral
| BoolLiteral

--- 

## 4. Blocks

### 4.1 Statements

Statement ::= ExprStatement ";"

### 4.2 Expression Statements

ExprStmt ::= Expression

---

## 5. Unary and Binary Operators

### 5.1 Unary

UnaryExpr ::= ("-") Expression

### 5.2 Binary

BinaryExpr ::= Expression Operator Expression
Operator ::= "+" | "-" | "*" | "/" | "%"

Operator precedence and associativity are defined in the implementation.

---

## 6. Program Structure

Program ::= (Statement)*

A program consists of zero or more top-level function definitions or statements.

---

# End of Grammar
