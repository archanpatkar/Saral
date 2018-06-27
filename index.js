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
        // console.log("Inside Functor");
        // console.log(this.params);
        // console.log(args);
        return Eval(this.body, env);
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

        while(Eval(this.condition, env) != false)
        {
            Eval(this.body,env);
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
        env.create(this.varname,Eval(0,env));
        for(let i of this.list.list)
        {
            env.update(this.varname,i);
            Eval(this.body,env);
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

        if(Eval(this.condition, env) == true)
        {
            Eval(this.body,env);
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

        if(Eval(this.condition, env) == true)
        {
            Eval(this.ifBody,env);
        }
        else
        {
            Eval(this.elseBody,env);
        }
        return;
    }
}


class JCluster
{
  constructor(body,env)
  {
    this.body = body;
    this.env = new Env(null,null,env,{});
    Eval(body,this.env);
  }

  find(e)
  {
    // TODO: A Wrapper which adds additional layer of encapsulation
    // which facilitates data hiding
  }
}

let keywords = [
  "begin", "lambda",
  "if","else",
  "define", "update",
  "while", "for",
  "defun","cluster",
  "declu", "invoke",
  "export"
];

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

function Eval(code, env) {
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
        const out = env.find(code).env[code];
        return env.find(code).env[code];
    } else if (code[0] == "define") {
        let [define, name, value] = code;
        env.env[name] = Eval(value, env);
        return env.env[name];
    } else if (code[0] == "update") {
        let [update, name, value] = code;
        return env.update(name,Eval(value,env));
    } else if (code[0] == "begin") {
        let [begin, ...block] = code;
        let out = [];
        for (let exp of block) {
            const o = Eval(exp, env);
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
        const jlist = Eval(list,env);
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
    } else if(code[0] == "invoke") {
        [ _ , func , args] = code;
        let Evaled_params = [];
        for (let p of args) {
            Evaled_params.push(Eval(p, env));
        }
        lfunc = Eval(func,env);
        return lfunc.execute(Evaled_params);
    } else if(code[0] == "if" && code[3] == "else") {
        [ _ , condition , ifBlock , __ , elseBlock] = code;
        IFELSE = new JIfElse(condition, ifBlock, elseBlock , env);
        IFELSE.execute();
        return;
    } else if(code[0] == "if") {
        [ _ , condition , body] = code;
        IF = new JIf(condition, body, env);
        IF.execute();
        return;
    } else if(code[0] == "export") {

    }
    else if(code[0] == "cluster") {
        [ _ , body ] = code;
        return new JCluster(body, env);
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
    //         return Eval(exp, env);
    //     }
    //}
    else {
        let [func, ...params] = code;
        let call = Eval(func, env);
        if (call instanceof JCluster) {
            // const out = ;
            // console.log(call);
            // console.log("AST");
            // console.log(params);
            // console.log("Inside Cluster")
            // console.log(out);
            // console.log(call.env.find(...params).env[params[0]]);
            return Eval(...params,call.env);
        }
        let Evaled_params = [];
        for (let p of params) {
            Evaled_params.push(Eval(p, env));
        }
        // console.log(call);
        // console.log(Evaled_params);
        // console.log(env);
        if (call instanceof JFunctor) {
            return call.execute(Evaled_params);
        }
        else if (call != undefined) {
            return call(...Evaled_params);
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
    return new JList(r);
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
    "table": (...i) => new JTable([...i]),
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
    "not": (x) => !x,
    "range":range
});

function iEval(code)
{
  Eval(code,MAIN_ENV);
}


// export
module.exports = iEval;
