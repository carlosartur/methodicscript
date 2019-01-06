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

var poirot_reserved_words = ["method", "attr", "get", "set", "elseif", "is", "ifnot", "another", "from", "to", "step"];
var kinds_of_blocks = {
    _defaults: {
        can_be_child: true,
        must_be_child: false,
        can_be_inside: [],
        close: '}',
        name_regex: /[\w]/,
        params_regex: /(\(([\w],?[\s]{0,}){0,}\)){0,}/,
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
        can_be_inside: ['public', 'private']
    },
    _method: {
        must_be_child: true,
        can_be_inside: ['public', 'private'],
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
        can_be_inside: ['public']
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
        this.has_params = this.block_props.hasOwnProperty('has_params') ? this.block_props.has_params : kinds_of_blocks['_defaults']['has_params'];
        
        this.params = this.has_params ? (typeof params == 'undefined' ? '' : this.setParams(params)) : '';
    }

    /**
     * Close this block
     */
    close () {
        var ret = '';
        if (this.type == 'class') {
            if (!this._constructor) {
                ret += this.getConstructor();
            }
            current_visibility = '';
        }
        if (this.name == 'constructor') {
            return '}';
        }
        return `${ret} ${this._close} //${this.type} ${this.name}`;
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
            this.verifyCorrectPlace(number_line);
        } catch (e) {
            throw e;
        }

        switch (this.type) {
            case 'class':
                return `class ${class_name} {`;
            case 'private':
            case 'public':
            case 'static':
                current_visibility = this.type;
                return '';
            case 'method':
                if (this.name == 'constructor') {
                    //is inside public (-2) and class (-3)
                    var father_block = block_stack[block_stack.length - 3];
                    father_block._constructor = true;
                    return `constructor(${this.params}) {`;
                }
                var getter = current_visibility == "public" ? `${this.name}() {
                    this.__${this.name}.apply(this, arguments);
                }` : `${this.name}() { throw new Error('Trying to access a private method ${this.name}.'); }`;
                return `${getter}
                __${this.name}(${this.params}) {`
            default:
                throw new Error(`Block ${this.type} doesn't exist. On line ${number_line + 1}`);
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
        console.log(name);
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
                _regex : /^(([A-Z])(\d)|([A-Z][a-z0-9]+))*([A-Z])?$/,
                _name : 'CamelCase with leading uppercase.'
            },
            _method: {
                _regex : /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/,
                _name : 'camelCase with leading lowercase.'
            },
            _attr: {
                _regex : /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/,
                _name : 'snake_case.'
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
     * @param {*} params 
     */
    setParams(params) {
        console.log(params);
    }
}

fs.readFile('index.poi', 'UTF-8', (err, contents) => {
    let file = contents.split('\n');
    lineToLineTranspiller(file);
});

var n_line;
var lineToLineTranspiller = (file) => {
    var current_class = '';
    var current_method = '';
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
            bruteline(line);
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
        }

        if (/private:/.test(line)) {
            openBlock(line, 'private');
        }

        if (/(method[\s]{1,}[\w]+[\s]{0,}?(\(([\w],?[\s]{0,}){0,}\)){0,}[\s]{0,}:)+/.test(line)) {  
            openBlock(line, 'method');
        }
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
    js_transpiled.push(is_comment ? '*/' : '/*');
    is_comment = !is_comment;
};

var bruteline = (line) => {
    js_transpiled.push(line);
};

var openClass = (line) => {
    class_name = line.match(/(class (\w*))/i)[2];
    var _class = new Block('class', class_name);
    block_stack.push(_class);
    classes[class_name] = _class;

    js_transpiled.push(_class.open(n_line));
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
            params = line.match(regexParams)[2];
        }
    }
    var _block = new Block(block_type, name, params);
    block_stack.push(_block);
    js_transpiled.push(_block.open(n_line, line));
};
