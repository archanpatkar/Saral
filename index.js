class Env {
    constructor(params, args, outer = null, obj = null) {
        if (obj == null) {
            this.env = {};
            for (let i in args) {
                this.env[params[i]] = args[i];
            }
        } else {
            this.env = obj;
        }
        this.outer = outer;
    }

    find(variable) {
        if (variable in this.env) {
            return this;
        } else if (this.outer != null || this.outer != undefined) {
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

    execute(args) {
        const env = new Env(this.params, args, this.env, null);    
        return eval(this.body, env);
    }
}

let keywords = ["begin", "lambda", "if", "set!"];

function isPrimitive(value) {
    if (typeof value == "number") {
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
    if (code === undefined) return;
    if (!Array.isArray(code) && isPrimitive(code)) {
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
        return env.find(code).env[code];
    } else if (code[0] == "define") {
        let [define, name, value] = code;
        env.env[name] = eval(value, env);
        return env.env[name];
    } else if (code[0] == "update") {
        let [update, name, value] = code;
        if (name in env.env) {
            env.env[name] = eval(value, env);
        } else {
            throw Error(`Variable ${name} is not Defined`);
        }
        return env.env[name];
    } else if (code[0] == "begin") {
        let [begin, ...block] = code;
        let out = [];
        for (let exp of block) {
            const o = eval(exp, env);
            if (o != undefined) {
                out.push(o);
            }
        }
        return out[out.length - 1];
    } else if (code[0] == "lambda") {
        [_ , params, body] = code;
        return new LFunction(params, body, env);
    }
    else if(code[0] == "invoke")
    {
        [ _ , func , args] = code;
        let evaled_params = [];
        for (let p of args) {
            evaled_params.push(eval(p, env));
        }
        lfunc = eval(func,env);
        return lfunc.execute(evaled_params);
    }
    //else if (code[0] == "return") {
    //     console.log("In Return!");
    //     if (code.length == 1) {
    //         return;
    //     } else {
    //         console.log("Return with Expression");
    //         let [ret, exp] = code;
    //         console.log(code);
    //         console.log(exp);
    //         return eval(exp, env);
    //     }
    //}
    else {
        let [method, ...params] = code;
        let call = eval(method, env);
        let evaled_params = [];
        for (let p of params) {
            evaled_params.push(eval(p, env));
        }
        if (call instanceof LFunction) {
            return call.execute(...evaled_params);
        } else if (call != undefined) {
            return call(...evaled_params);
        }
    }
}

function print(string) {
    console.log(string);
}

function min(x, y) {
    if (x > y) {
        return y;
    } else if (x < y) {
        return x;
    } else if (x == y) {
        return x;
    }
}


function max(x, y) {
    if (x > y) {
        return x;
    } else if (x < y) {
        return y;
    } else if (x == y) {
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
    "rem": (x, y) => x % y,
    "list": (...i) => [...i],
    "=": (x, y) => x == y,
    "/=": (x, y) => x != y,
    ">": (x, y) => x > y,
    "<": (x, y) => x < y,
    ">=": (x, y) => x >= y,
    "<=": (x, y) => x <= y,
    "min": min,
    "max": max,
    "and": (x, y) => x && y,
    "or": (x, y) => x || y,
    "not": (x) => !x
});


let testinginvoke = [ 
    "begin",

    ["print" , '"Testing Invoke"'],

    [
        "define", "f1", [
            "lambda", [],
                [ "begin",
                    ["print" , '"Entering f1"'],
                    [ "invoke" , ["lambda",["x","y"],["print", ["+","x","y"]]] , [10,20] ],
                    ["print" , '"Leaving f1"']
                ]
        ]       
    ],

    ["f1"]

];

eval(testinginvoke,env);