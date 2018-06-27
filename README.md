# SARAL ( JSON based List Processing )
### A Lisp like Language which uses S - Expressions.
### Its Syntax is in JSON.
### It can be used as a Compilation Target Language or Intermediate Representation Language (IR).

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

#### <img src="./T-Diagram-JISP.svg" style="height:10em;width:10em"/>

#### JISP is inspired by [jsonic](https://github.com/zaach/jsonic)
