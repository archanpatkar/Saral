# Saral
### A 3.9kB Interpreter for a `Embeddable`,`Transferable`,`Persistable`,`Compressible` Language
Saral is a **LISP** or **WASM (WAT)** like language which uses *S - Expressions* in a **JSON** format. This leads Saral code to highly **transferable** as JSON one of most famous option for **data transfer** after XML, Due to *NoSQL Databases* (Mongo DB) JSON can now also be **persisted**. There are many *compression libraries* (JSONC,lzstring) available which can **compress** JSON upto **30%** which makes Saral a *universally* **embeddable** language and its **interpreter** is just **3.9kB**. Saral provides *minimal* **error checking** so the **responsibility** of the **Developer** increases because Saral Interpreter may **fail** *silently*.

Just as **Lambda Calculus** and **Functional Programming** paradigms brought the concept of **Logic as a Value** in a similar fashion **Saral** is pushing the concept of **Logic as Data** which leads to interesting applications. Treating **Logic as Data** suddenly makes it consumable by *Data Analysis Algorithms*,*Machine Learning and Deep Learning Algorithms*,*Compression Algorithms*. **Logic as Data** also potentially provides the means to use *Neural Networks* to **Optimize** and **Generate** **Saral** code

Saral is inspired by [jsonic](https://github.com/zaach/jsonic).

## Features
1. Variables
2. Functions
3. Lambdas
4. Higher Order Functions
5. Iterations
6. Selections

## Example Code
```
[
    [
        "begin", 
        
        [
            "define", "f1", 
                ["lambda", [],
                    ["print", ' "F1 !!!!" ']
                ]
        ], 
        
        ["f1"]
    ]
]
```
