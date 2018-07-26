# Saral
### A Lisp like Language which uses S - Expressions ( JSON based ).
Its Syntax is in JSON, It can be used as a Compilation Target Language or Intermediate Representation Language (IR).

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
