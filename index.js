class Env {
    constructor(params, args, outer = null, obj = null) {
        if (obj == null) {
            this.env = {};
            for (let param in args) {
                this.env[params[param]] = args[param];
            }
        } else {
            this.env = obj;
        }
        // console.log("Outer = " + outer)
        this.outer = outer;
    }

    find(variable) {
        if (variable in this.env) {
            return this;
        } else {
            //   console.log("Searching in Closure");
            //   console.log(this.outer.find(variable))
            return this.outer.find(variable);
        }
    }
}


class LFunction {
    constructor(params, body, env) {
        this.params = params;
        this.body = body;
        this.env = env;
    }

    execute(...params) {
        // console.log("Entering Execute");
        // console.log("Params = " +  params);
        const env = new Env(this.params, [...params], this.env, null);
        // console.log(this.env);
        // console.log(env);
        // console.log("Leaving Execute");
        return eval(this.body, env);
    }
}

let keywords = ["begin", "lambda", "if", "set!"];

function isPrimitive(value) {
    if (typeof value == "number") {
        // console.log("Value : " +  value);
        return true;
    } else if (typeof value == "boolean") {
        return true;
    } else if (typeof value == "string") {
        let isString = false;
        const output_string = [];
        value = value.trim();
        value = value.split("");
        if (value[0] == '"') {
            value.shift();
            while (value[0] != '"') {
                value.shift();
            }
            if (value[0] == '"') isString = true;
        }
        return isString;
    } else {
        return false;
    }
}

function eval(code, env) {
    // console.log("Each => ")
    // console.log(code)
    // console.log("Each Type => " + typeof code)
    if (code === undefined) return;
    if (!Array.isArray(code) && isPrimitive(code)) {
        // console.log("Is Primitive Value : " + code)
        if (typeof code == "string") {
            const output_string = [];
            code = code.trim();
            code = code.split("");
            if (code[0] == '"') {
                code.shift();
                while (code[0] != '"') {
                    output_string.push(code.shift());
                }
                if (code[0] == '"') isString = true;
            }
            return output_string.join("");
        }
        return code;
    } else if (!Array.isArray(code) && !(code in keywords)) {
        // console.log(env.find("print").env["print"]);
        return env.find(code).env[code];
    } else if (code[0] == "define") {
        let [define, name, value] = code;
        // console.log(value);
        // console.log("Creating Variable " + name + " : " + value)
        env.env[name] = eval(value, env);
        // console.log("After Evaling the Value");
        // console.log(env.env[name])
        return env.env[name];
    } else if (code[0] == "begin") {
        // console.log("In Begin");
        let [begin, ...block] = code;
        let out = [];
        // console.log("Before Loop");
        for (let exp of block) {
            // console.log("In Loop");
            // console.log("Current Expression = " + exp);
            out.push(eval(exp, env));
        }
        // console.log("After Loop");
        // console.log("Execution Evaluated To : " + out)
        return out[out.length - 1];
    } else if (code[0] == "lambda") {
        [_, params, ...body] = code;
        //   console.log(env);
        return new LFunction(params, body, env);
    } else {
        let [method, ...params] = code;
        // console.log("Method : " + method);
        // console.log("Params : " + params);
        let call = eval(method, env);
        let evaled_params = [];
        for (let p of params) {
            evaled_params.push(eval(p, env));
        }
        // console.log(env);
        // console.log(method);
        // console.log(call);
        if (call instanceof LFunction) {
            return call.execute(...evaled_params);
        } else if (call != undefined) {
            //    console.log("Inside Else") 
            //    console.log(call);
            //    console.log(evaled_params);
            return call(...evaled_params);
        }
    }
}

function print(string) {
    console.log(string);
}

function min(x,y) 
{
    if(x > y)
    {
        return y;
    }
    else if(x < y)
    {
        return x;
    }
    else if(x == y)
    {
        return x;
    }
}


function max(x,y) 
{
    if(x > y)
    {
        return x;
    }
    else if(x < y)
    {
        return y;
    }
    else if(x == y)
    {
        return x;
    }
}


const env = new Env(null, null, null, {
    "print": print,
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "**": (x, y) => x ** y,
    "rem": (x,y) => x % y,
    "list": (...i) => [...i],
    "=":(x,y) => x == y,
    "/=": (x,y) => x != y,
    ">": (x,y) => x > y,
    "<": (x,y) => x < y,
    ">=": (x,y) => x >= y,
    "<=": (x,y) => x <= y,
    "min": min,
    "max": max,
    "and": (x,y) => x && y,
    "or": (x,y) => x || y,
    "not": (x) => !x
});


// ["begin", ["**", 10, 2]],
// ["begin", ' "hello" '],
// ["begin", ["define", "i", 10]],
// ["list", 10, 20, 30, 40, 50],
// ["begin", ["define", "j", 100],
//     ["print", "j"]
// ]


let codes = [
    [
        "begin", 
        
        [
            "define", "f1", 
                ["lambda", [],
                    ["print", '"F1 !!!!"']
                ]
        ], 
        
        ["f1"]
    ]
];

for (let e in codes) {
    eval(codes[e], env);
}

// New Feautures to be added
// Selections
// Update Variables
// Iterations
