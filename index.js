var fs = require('fs'),
    beautify = require('js-beautify').js,
    js_transpiled = [],
    current_visibility = '',
    is_comment = false,
    inside_string = false,
    block_stack = [],
    classes = {},
    spaces = [],
    js_reserved_words = ["abstract", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue",,
        "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", 
        "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", 
        "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", 
        "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", 
        "while", "with"];

String.prototype.replaceAll = function(search, replacement) {
    replacement = typeof replacement == "undefined" ? '' : replacement;
    var target = this;
    return target.split(search).join(replacement);
};

var poirot_reserved_words = ["method", "attr", "get", "set", "elseif", "is", "ifnot", "another", "from", "to", "step"];
var kinds_of_blocks = {
    _defaults: {
        can_be_child: true,
        must_be_child: false,
        can_be_inside: [],
        close: '}',
        name_regex: /[\w]/,
        params_regex: /(\(([\w][\s]?[=]?[\s\S]{0,}?,?[\s]{0,}){0,}\))/,
        has_name: true,
        has_params: false
    },
    _class: {
        can_be_child: false,
        close: '} //class',
        name_regex: /(class (\w*))/i,
    },
    _attr: {
        must_be_child: true,
        can_be_inside: ['public', 'private', 'static']
    },
    _method: {
        must_be_child: true,
        can_be_inside: ['public', 'private', 'static'],
        close: 'return this;}// method',
        name_regex: /(method (\w*))/i,
        has_params: true
    },
    _private: {
        must_be_child: true,
        can_be_inside: ['class'],
        close: '',
        has_name: false
    },
    _public: {
        must_be_child: true,
        can_be_inside: ['class'],
        close: '',
        has_name: false
    },
    _static: {
        must_be_child: true,
        can_be_inside: ['class'],
        close: '',
        has_name: false
    },
    _get: {
        must_be_child: true,
        can_be_inside: ['attr'],
        has_name: false
    },
    _set: {
        must_be_child: true,
        can_be_inside: ['attr'],
        has_name: false,
        has_params: true
    },
    _const: {
        must_be_child: true,
        can_be_inside: ['static'],
        name_regex: /(const (\w*))/i,
        params_regex: /(?<=\=).*$/,
        has_params: true,
        close: ''
    },
    _static: {
        must_be_child: true,
        can_be_inside: ['class'],
        close: '',
        has_name: false,
    }
};

var print = function () {
    switch (arguments.length) {
        case 0:
            console.log();
            return;
        case 1:
            console.log(arguments[0]);
            return;
        default:
            let args = [...arguments];
            console.log(args);
            return;
    }
}

class Block {
    constructor (type, name, params) {
        this.type = type;
        this.name = typeof name == 'undefined' ? '' : this.validName(name);
        this.attrs = [];
        this._constructor = false;
        this.methods = [];

        this.block_props = kinds_of_blocks.hasOwnProperty(`_${this.type}`) ? kinds_of_blocks[`_${this.type}`] : kinds_of_blocks['_defaults'];
        
        this.can_be_child = this.block_props.hasOwnProperty('can_be_child') ? this.block_props.can_be_child : kinds_of_blocks['_defaults']['can_be_child'];
        this.must_be_child = this.block_props.hasOwnProperty('must_be_child') ? this.block_props.must_be_child : kinds_of_blocks['_defaults']['must_be_child'];
        this.can_be_inside = this.block_props.hasOwnProperty('can_be_inside') ? this.block_props.can_be_inside : kinds_of_blocks['_defaults']['can_be_inside'];
        this._close = this.block_props.hasOwnProperty('close') ? this.block_props.close : kinds_of_blocks['_defaults']['close'];
        if (this.type == 'method' && current_visibility == 'static') {
            this._close = "return null }";
        }
        this.has_params = this.block_props.hasOwnProperty('has_params') ? this.block_props.has_params : kinds_of_blocks['_defaults']['has_params'];
        this.params = this.has_params ? (typeof params == 'undefined' ? '' : this.setParams(params)) : '';
        this.parent = 'Object';
        this.opened = false;
        this.traits = [];
    }

    /**
     * Close this block
     */
    close () {
        var ret = '';
        var traits_code = '';
        if (this.type == 'class') {
            if (!this._constructor) {
                ret += this.getConstructor();
            }
            if (this.traits) {
                this.traits.forEach(element => {
                    traits_code += `
                    for (var i of Object.getOwnPropertyNames(${element}.prototype)) {
                        if (${this.name}.prototype.hasOwnProperty(i)) {
                          continue;
                        }
                        ${this.name}.prototype[i] = ${element}.prototype[i];
                    }`;
                });
            }
            current_visibility = '';
        }
        if (this.name == 'constructor') {
            return '}';
        }
        return `${ret} ${this._close} ${traits_code} //${this.type} ${this.name}`;
    }

    /**
     * Open this block
     * @param {numeric} number_line 
     * @param {string} line 
     */
    open (number_line, line) {
        number_line = typeof number_line == 'undefined' ? -1 : number_line;
        line = typeof line == 'undefined' ? '' : line;
        try {
            if(!(this.isClass() && !this.opened)) {
                this.verifyCorrectPlace(number_line);
            }
        } catch (e) {
            throw e;
        }
        var ret = '';
        switch (this.type) {
            case 'class':
                this.opened = true;
                return `class ${class_name} extends ${this.parent} {`;
            case 'private':
            case 'public':
            case 'static':
                if (!current_class.opened) {
                    ret += current_class.open();
                }
                current_visibility = this.type;
                return `${ret} //${this.type}`;
            case 'method':
                if (!current_class.opened) {
                    ret += current_class.open();
                }
                if (this.name == 'constructor') {
                    current_class._constructor = true;
                    return `${ret} constructor(${this.params}) { super();`;
                }
                switch (current_visibility) {
                    case "public":
                        var getter = `${this.name}() { this.__${this.name}.apply(this, arguments); }`;
                        break;
                    case "private":
                        var getter = `${this.name}() { throw new Error('Trying to access a private method ${this.name}.'); }`;
                        break;
                    case "static":
                        return `${ret} static ${this.name}(${this.params}) {`;
                }
                return `${ret} ${getter}
                ${current_visibility == "static" ? "static" : ''} __${this.name}(${this.params}) {`
            case 'const':
                return `static get ${this.name} () {return ${this.params}} 
                        static set ${this.name} (value) {throw new Error("${this.name} is a class constant, and can't have his value changed to " + value)}`;
            default:
                throw new Error(`Block ${this.type} doesn't exist. On line ${parseInt(number_line) + 1}`);
        }
    }

    /**
     * Returns true if the codeblock is in correct place
     * @param {numeric} number_line 
     */
    verifyCorrectPlace(number_line) {
        var father_block = block_stack[block_stack.length - 2];
        if (!this.can_be_child && father_block) {
            throw new Error(`${this.type} can't be inside of ${father_block.type}. On line ${number_line + 1}`);
        }
        if (this.must_be_child) {
            var must_be_inside_of = this.can_be_inside.length > 1 ? `one of this: ${this.can_be_inside.join()}` : `of ${this.can_be_inside[0]}`;
            if (!father_block) {
                throw new Error(`${this.type} can't be alone, it must be inside ${must_be_inside_of}. On line ${number_line + 1}`);
            }
            if (this.can_be_inside.indexOf(father_block.type) == -1) {
                throw new Error(`${this.type} can't be inside ${father_block.type}, it must be inside ${must_be_inside_of}. On line ${number_line + 1}`);
            }
        }
    }

    /**
     * Returns if this block is a class block
     */
    isClass () { 
        return this.type == 'class';
    }
    
    /**
     * Set constructor
     * @param {Block} block 
     */
    setConstructor (block) {
        block = typeof block == 'undefined' ? '' : block;        
        if (!this.isClass()) {
            return false;
        }
        if (block) {
            this._constructor = block;
            return this;
        }
        for (var i in this.attrs) {
            block += `this.${this.attrs[i]} typeof ${this.attrs[i]} == 'undefined' ? null : ${this.attrs[i]};`;
        }
        this._constructor = `constructor(${this.attrs.join(', ')}) {
            ${block}
        }`;
        this.methods[0] = this._constructor;
    }

    /**
     * Get constructor
     */
    getConstructor () {
        if(!this._constructor) {
            this.setConstructor();
        }
        return this._constructor;
    }

    /**
     * Returns if is a valid codeblock name
     * @param {string} name 
     */
    validName (name) {
        var error_name = `Bad programming pratice error on line ${n_line * 1 + 1}.`;
        if (name == undefined) {
            throw new Error(`${error_name} Names can't be undefined. Please fix it before trying compile again.`);            
        }
        if (name.length < 3) {
            throw new Error(`${error_name} Names can't have less than 3 chars. Please fix it before trying compile again.`);
        }
        if (js_reserved_words.indexOf(name) != -1 || poirot_reserved_words.indexOf(name) != -1) {
            throw new Error(`${error_name} Invalid name, ${name} is a reserved JS or poirot word. Please fix it before trying compile again.`);
        }
        var regexNameOf = {
            _class : {
                _regex: /^(([A-Z])(\d)|([A-Z][a-z0-9]+))*([A-Z])?$/,
                _name: 'CamelCase with leading uppercase.'
            },
            _method: {
                _regex: /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/,
                _name: 'camelCase with leading lowercase.'
            },
            _attr: {
                _regex: /^[a-z_]+((\d)|([a-z0-9]+))*$/,
                _name: 'snake_case_all_lowercase.'
            },
            _const: {
                _retex: /^[A-Z_]+((\d)|([A-Z0-9]+))*$/,
                _name: 'SNAKE_CASE_ALL_UPERCASE.'
            }
        };
        if (regexNameOf.hasOwnProperty(`_${this.type}`)) {
            return name;
        }
        var validationObj = regexNameOf[`_${this.type}`];
        if (!name.match(validationObj._regex)) {
            throw new Error(`${error_name} ${this.type} must have name written on ${validationObj._name}`);
        }
        return name;
    }

    /**
     * 
     * @param String params 
     */
    setParams(params) {
        return params.replaceAll(',', ', ');
    }
}

fs.readFile('index.poi', 'UTF-8', (err, contents) => {
    let file = contents.split('\n');
    lineToLineTranspiller(file);
});

var current_class = '';
var current_method = '';
var n_line;
var lineToLineTranspiller = (file) => {
    for (n_line in file) {
        let line = file[n_line];
        let line_spaces = line.search(/\S/);
        if (line_spaces % 4 != 0 && line_spaces != -1) {
            throw Error(`Indentation must have a multiple of four spaces. On line ${n_line}, found ${line_spaces}`);
        }

        line = line.trim();
        
        //line is empty
        if (line.length === 0) {
            continue;
        }

        //line is comment
        if (/([#][^#])+/g.test(line)) {
            oneLineComment(line);
            continue;
        }
        if (/([###])+/g.test(line)) {
            comment(line);
            continue;
        }
        if (is_comment) {
            bruteline(" *" + line);
            continue;
        }

        //blocks of code
        spaces.push(line_spaces / 4);
        closeBlock(line_spaces / 4);
        
        if (/(class[\s]{1,}[\w]+[\s]{0,}?:)+/.test(line)) {    
            openClass(line);
            continue;
        }

        if (/public:/.test(line)) {
            openBlock(line, 'public');
            continue;
        }

        if (/private:/.test(line)) {
            openBlock(line, 'private');
            continue;
        }

        if (/static:/.test(line)) {
            openBlock(line, 'static');
            continue;
        }

        if (/(method[\s]{1,}[\w]+[\s]{0,}?(\(([\w],?[\s]{0,}){0,}\)){0,}[\s]{0,}:)+/.test(line)) {  
            openBlock(line, 'method');
            continue;
        }

        if (/^(extends )/.test(line)) {
            current_class.parent = line.replace(/^(extends )/g, '');
            openClass(line);
            continue;
        }

        if (/^(traits )/.test(line)) {
            js_transpiled.push(`//${line}`);
            current_class.traits = line.replace(/^(traits )/g, '').split(',');
            continue;
        }

        if (/(const [A-Z]{1,})/.test(line)) {
            openBlock(line, 'const');
            continue;
        }
        //bruteline(line);
    }

    var final_compilled_js = beautify(js_transpiled.join('\n'), { indent_size: 4, space_in_empty_paren: true });
    fs.writeFile('index.poi.js', final_compilled_js, function (err) {
        if (err) throw err;
        print('Saved!');
    });

};

var closeBlock = (new_stack_size) => {
    while (block_stack.length > new_stack_size) {
        let block_closed = block_stack.pop();
        if (block_closed) {
            try {
                js_transpiled.push(block_closed.close());
            } catch (e) {
                print(block_stack, e, n_line);
            }
        }
    }
};

var oneLineComment = (line) => {
    js_transpiled.push(`//${line.replace(/([#])+/, '')}`);
};

var comment = () => {
    js_transpiled.push(is_comment ? '*/' : '/**');
    is_comment = !is_comment;
};

var bruteline = (line) => {
    js_transpiled.push(line);
};

var openClass = (line) => {
    if (current_class && !current_class.opened) {
        js_transpiled.push(current_class.open(n_line));
        return current_class.name;
    } 
    class_name = line.match(/(class (\w*))/i)[2];
    var _class = new Block('class', class_name);
    block_stack.push(_class);
    classes[class_name] = _class;
    current_class = _class;
    //js_transpiled.push(_class.open(n_line));
    return class_name;
};

var openBlock = (line, block_type) => {
    closeBlock(spaces[spaces.length - 1]);
    var name = undefined, params = undefined;
    if (kinds_of_blocks.hasOwnProperty(`_${block_type}`)) {
        kind_block = kinds_of_blocks[`_${block_type}`];
        var has_name = kind_block.hasOwnProperty('has_name') ? kind_block.has_name : kinds_of_blocks._defaults.has_name;
        var has_params = kind_block.hasOwnProperty('has_params') ? kind_block.has_params : kinds_of_blocks._defaults.has_params;
        if (has_name) {
            var regexName = kind_block.hasOwnProperty('name_regex') ? kind_block.name_regex : kinds_of_blocks._defaults.name_regex;
            name = line.match(regexName)[2];
        }
        if (has_params) {
            var regexParams = kind_block.hasOwnProperty('params_regex') ? kind_block.params_regex : kinds_of_blocks._defaults.params_regex;
            params_match = line.match(regexParams);
            params = '';
            if (params_match) {
                params = params_match[1] ? params_match[1] : params_match[0];
                params = params.replaceAll('(').replaceAll(')');
            }
        }
    }
    var _block = new Block(block_type, name, params);
    block_stack.push(_block);
    js_transpiled.push(_block.open(n_line, line));
};
