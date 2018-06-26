const saral = require("./index");

test('Raincheck', () => {
  const Code = ["print" , '"Hello World!"'];
  saral(Code);
});

test('Compund Statments using Begin Block', () => {
  const Code = [ "begin",
                  ["print" , '"Entering Begin"'],
                  ["print" , '"Leaving Begin"']
               ];
  saral(Code);
});

test('Variable Decleration', () => {
  const Code = ["define", "i", 10];
  saral(Code);
});

test('Accessing Variable', () => {
  const Code = ["print", "i"];
  saral(Code);
});


test('Updating Variable', () => {
  const Code = [ "begin",
                  ["update" , "i", 20],
                  ["print" , "i"]
               ];
  saral(Code);
});

test('Repetation using While Loop', () => {
  const Code = [ "begin",
                  ["define" , "i", 0],
                  [ "while" , ["/=","i",10] ,
                      [ "begin",
                          [ "print",'"Hello"' ],
                          [ "update" , "i" , ["++","i"] ]
                      ]
                  ]
               ];
  saral(Code);
});
