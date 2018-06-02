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

    update(variable,value) {
        if (variable in this.env) {
            this.env[variable] = value;
            return this.env[variable];
        } else if (this.outer != null || this.outer != undefined) {
            return this.outer.update(variable,value);
        }
    }

    create(variable,value)
    {
        this.env[variable] = value;
    }
}


class JFunctor {
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

class JWhile {
    constructor(condition, body, env) {
        this.condition = condition;
        this.body = body;
        this.env = env;
    }

    execute() {
        const env = new Env(null, null, this.env, {});

        while(eval(this.condition, env) != false)
        {
            eval(this.body,env);
        }
        return;
    }
}

class JFor {
    constructor(varname, list , body, env) {
        this.varname = varname;
        this.list = list;
        this.body = body;
        this.env = env;
    }

    execute() {
        const env = new Env(null, null, this.env, {});
        env.create(this.varname,eval(0,env));
        for(let i of this.list.list)
        {
            env.update(this.varname,i);
            eval(this.body,env);
        }
        return;
    }
}

class JList {
    constructor(list) {
        this.list = list;
    }
}

class JIf {
    constructor(condition, body, env) {
        this.condition = condition;
        this.body = body;
        this.env = env;
    }

    execute() {
        const env = new Env(null, null, this.env, {});

        if(eval(this.condition, env) == true)
        {
            eval(this.body,env);
        }
        return;
    }
}

class JIfElse {
    constructor(condition, ifBody , elseBody , env) {
        this.condition = condition;
        this.ifBody = ifBody;
        this.elseBody = elseBody;
        this.env = env;
    }

    execute() {
        const env = new Env(null, null, this.env, {});

        if(eval(this.condition, env) == true)
        {
            eval(this.ifBody,env);
        }
        else
        {
            eval(this.elseBody,env);
        }
        return;
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
    } else if (value instanceof JList) {
        return true;
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
        return env.update(name,eval(value,env));
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
    } else if (code[0] == "while") {
        [_ , condition, body] = code;
        loop = new JWhile(condition, body, env);
        loop.execute();
        return;
    } else if (code[0] == "for") {
        [_ , varname , __ , list , body] = code;
        const jlist = eval(list,env);
        loop = new JFor(varname , jlist , body, env);
        loop.execute();
        return;
    } else if (code[0] == "lambda") {
        [_ , params, body] = code;
        return new JFunctor(params, body, env);
    } else if (code[0] == "defun") {
        [_ , name , params, body] = code;
        env.env[name] = new JFunctor(params, body, env);
        return env.env[name];
    } else if(code[0] == "invoke")
    {
        [ _ , func , args] = code;
        let evaled_params = [];
        for (let p of args) {
            evaled_params.push(eval(p, env));
        }
        lfunc = eval(func,env);
        return lfunc.execute(evaled_params);
    } else if(code[0] == "if" && code[3] == "else")
    {
        [ _ , condition , ifBlock , __ , elseBlock] = code;
        IFELSE = new JIfElse(condition, ifBlock, elseBlock , env);
        IFELSE.execute();
        return;
    } else if(code[0] == "if")
    {
        [ _ , condition , body] = code;
        IF = new JIf(condition, body, env);
        IF.execute();
        return;
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
        let [func, ...params] = code;
        let call = eval(func, env);
        let evaled_params = [];
        for (let p of params) {
            evaled_params.push(eval(p, env));
        }
        if (call instanceof JFunctor) {
            return call.execute(...evaled_params);
        }
        else if (call != undefined) {
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

function range(s = 0,e = 0,offset = 1)
{
    const r = [];
    for(let i = s; i < e; i = i + offset)
    {
        r.push(i);
    }
    return r;
}


const MAIN_ENV = new Env(null, null, null, {
    "print": print,
    "+": (x, y) => x + y,
    "++": (x) => x + 1,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "**": (x, y) => x ** y,
    "rem": (x, y) => x % y,
    "list": (...i) => new JList([...i]),
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

    [
      "if", ["=","i",50],
        ["print",'"SAME!"'],
      "else",
        ["print",'"NOT SAME!"']
    ]
];

eval(code,MAIN_ENV);
