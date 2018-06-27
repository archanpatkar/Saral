const saral = require("./index");

let code =
[
    "begin",

    // ["print" , '"Testing Invoke"'],
    //
    // [ "defun" , "f1" , [],
    //     [ "begin",
    //         ["print" , '"Entering f1"'],
    //         [ "invoke" , ["lambda",["x","y"],["print", ["+","x","y"]]] , [10,20] ],
    //         ["print" , '"Leaving f1"']
    //     ]
    // ],
    //
    // ["f1"],
    //
    // ["define","i",0],
    //
    // ["print" , [ "+" , '"i = "' , "i" ] ],
    //
    // [ "while" , ["/=","i",10] ,
    //     [ "begin",
    //         [ "print",'"Hello"' ],
    //         [ "update" , "i" , ["++","i"] ]
    //     ]
    // ],
    //
    // ["define", "l1", ["list",10,20,30,40,50,60]],
    //
    // ["for", "i", "in", "l1",
    //   ["begin",
    //     ["print","i"]
    //   ]
    // ],
    //
    // ["define","i",50],
    //
    // [
    //   "if", ["=","i",50],
    //     ["print",'"SAME!"'],
    //   "else",
    //     ["print",'"NOT SAME!"']
    // ],

    ["define", "C1" ,
      [ "cluster" ,
        ["begin",
          ["define","v",10],
          ["defun","f1",["x","y"],
            ["begin",
              ["print",'"F2!"'],
              ["print",["+", '"X = "' , "x"]],
              ["print",["+", '"Y   = "' , "y"]]
            ]
          ]
        ]
      ]
    ],

    [ "print" ,  ["C1", "v"] ]

    // ["declu", "C1"
    //   ["begin",
    //     ["defun","f1",[]
    //       ["begin",
    //         ["print",'"F2!"']
    //       ]
    //     ]
    //   ]
    // ]

];

saral(code);
