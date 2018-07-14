# Saral
### A Lisp like Language which uses S - Expressions ( JSON based ).
Its Syntax is in JSON, It can be used as a Compilation Target Language or Intermediate Representation Language (IR).

## Features
1. Variables
2. Functions
3. Lambdas
4. Higher Order Functions
5. Iterations
6. Clusters

## Example
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

## Use Case
### The T - diagram or [Tombstone diagram](https://en.wikipedia.org/wiki/Tombstone_diagram),
#### 1. where S is any Source Language,
#### 2. where I is any Implementation Language,
#### 3. where the Target Language will be JSON / JISP

#### JISP is inspired by [jsonic](https://github.com/zaach/jsonic)
