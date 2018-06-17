const logico = require("./index");

let code =
[
    "begin",

    ["print" , '"Testing Invoke"'],

    [ "defun" , "f1" , [],
        [ "begin",
            ["print" , '"Entering f1"'],
            [ "invoke" , ["lambda",["x","y"],["print", ["+","x","y"]]] , [10,20] ],
            ["print" , '"Leaving f1"']
        ]
    ],

    ["f1"],

    ["define","i",0],

    ["print" , [ "+" , '"i = "' , "i" ] ],

    [ "while" , ["/=","i",10] ,
        [ "begin",
            [ "print",'"Hello"' ],
            [ "update" , "i" , ["++","i"] ]
        ]
    ],

    ["define", "l1", ["list",10,20,30,40,50,60]],

    ["for", "i", "in", "l1",
      ["begin",
        ["print","i"]
      ]
    ],

    ["define","i",50],

    [
      "if", ["=","i",50],
        ["print",'"SAME!"'],
      "else",
        ["print",'"NOT SAME!"']
    ]

];

logico(code);
