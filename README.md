# Saral
### A 3.9kB Interpreter for a `Embeddable`,`Transferable`,`Persistable`,`Compressible` Language
Saral is a LISP or WASM (WAT) like language which uses S - Expressions in a JSON format which leads Saral code to highly Transferable as JSON one of most famous option for data transfer after XML, Due to NoSQL Databases (Mongo DB) JSON can now also be persisted and There are now many compression libraries (JSONC,lzstring) available which can compress JSON upto 30% which makes Saral a universally embeddable language and its interpreter is 3.9kB.

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
