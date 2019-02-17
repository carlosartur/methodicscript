var fs = require('fs'),
    beautify = require('js-beautify').js,
    js_transpiled = [],
    current_visibility = '',
    is_comment = false,
    inside_string = false,
    block_stack = [],
    classes = {},
    spaces = [],
    poirot_reserved_words = ["method", "attr", "get", "set", "elseif", "is", "unless", "another", "from", "to", "step"],
    js_reserved_words = ["abstract", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue",,
        "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", 
        "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", 
        "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", 
        "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", 
        "while", "with"],
    specialFunctionsUtilized = [],
    current_class = '',
    current_attr = null,
    n_line;
String.prototype.replaceAll = function(search, replacement) {
    replacement = typeof replacement == "undefined" ? '' : replacement;
    var target = this;
    return target.split(search).join(replacement);
};

var openBlockRegex = {
    _public:    /public:/,
    _private:   /private:/,
    _static:    /static:/,
    _method:    /(method[\s]{1,}[\w]+[\s]{0,}?(\(([\w],?[\s]{0,}){0,}\)){0,}[\s]{0,}:)+/.t,
    _extends:   /^(extends )/,
    _const:     /(const [A-Z]{1,})/,
    _attr:      /(attr[\s]{1,}[\w]+[\s]{0,}?:?)+/,
    _set:       /(set)(\s){0,}?(:)/,
    _get:       /(get)(\s){0,}?(:)/,
    _elseunless:/(elseunless\s.{1,}:)/,
    _unless:    /(unless\s.{1,}:)/,
    _elseif:    /(elseif\s.{1,}:)/,
    _else:      /(else:)/,
    _if:        /(if\s.{1,}:)/,
    _switch:    /(switch\s.{1,}:)/,
    _case:      /(case\s.{1,}:)/,
    _default:   /(default:)/,
    _from:      /^(from).{1,}(step \d{1,}:)$/
};

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
        can_be_inside: ['public', 'private', 'static'],
        name_regex: /(attr (\w*))/i,
        params_regex: /(?<=\=).*$/,
        close: '',
        has_params: true
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
    },
    _if: {
        has_name: false,
        has_params: true,
        params_regex: /(?![if])(.{1,})(?<!:)/
    },
    _elseif: {
        has_name: false,
        has_params: true,
        params_regex: /(?![elseif])(.{1,})(?<!:)/
    },
    _unless: {
        has_name: false,
        has_params: true,
        params_regex: /(?![unless])(.{1,})(?<!:)/
    },
    _elseunless: {
        has_name: false,
        has_params: true,
        params_regex: /(?![elseunless])(.{1,})(?<!:)/
    },
    _else: {
        has_name: false
    },
    _switch: {
        has_name: false,
        has_params: true,
        params_regex: /(?![switch])(.{1,})(?<!:)/
    },
    _case: {
        has_name: false,
        has_params: true,
        params_regex: /(?![case])(.{1,})(?<!:)/,
        close: 'break;',
    },
    _default: {
        has_name: false,
        has_params: false,
        close: '',
    },
    _from: {
        has_name: false,
        has_params: true,
        params_regex: /(?![from])(.{1,})(?<!:)/,
    }
};

var specialFunctions = {
    trait : function trait(_class, ..._traits) {
        for(var _trait of _traits) {
            for (var a of Object.getOwnPropertyNames(_trait.prototype)) {
                 if (_class.prototype.hasOwnProperty(a)) {
                    continue;
                 }
                 _class.prototype[a] = _trait.prototype[a];
            }
        }
    }
}


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

var blockFactory = (type, name, params) => {
    switch (type) {
        case "class":
            return new _class(type, name, params);
        case "method":
            return new _method(type, name, params);
        case "public":
        case "private":
        case "static":
            return new _visibility(type);
        case "attr":
            return new _attr(type, name, params);
        case "const":
            return new _const(type, name, params);
        case "set":
        case "get":
            return new _setter_n_getter(type, params);
        case "if":
        case "elseif":
        case "unless":
        case "else":
        case "elseunless":
        case "switch":
        case "case":
        case "default":
            return new _conditionals(type, params)
        case "from":
            return new _loop(type, params)
        default:
            return new Block(type, params);
    }
}
class Block {
    constructor (type, params) {
        this.type = type;
        this.attrs = [];
        
        var block_props = kinds_of_blocks.hasOwnProperty(`_${this.type}`) ? kinds_of_blocks[`_${this.type}`] : kinds_of_blocks['_defaults'];
        this.setBlockProps(block_props);
        this.params = this.has_params ? (typeof params == 'undefined' ? '' : this.setParams(params)) : '';
    }

    setBlockProps(block_props) {
        this.can_be_child = block_props.hasOwnProperty('can_be_child') ? block_props.can_be_child : kinds_of_blocks['_defaults']['can_be_child'];
        this.must_be_child = block_props.hasOwnProperty('must_be_child') ? block_props.must_be_child : kinds_of_blocks['_defaults']['must_be_child'];
        this.can_be_inside = block_props.hasOwnProperty('can_be_inside') ? block_props.can_be_inside : kinds_of_blocks['_defaults']['can_be_inside'];
        this._close = block_props.hasOwnProperty('close') ? block_props.close : kinds_of_blocks['_defaults']['close'];
        if (this.type == 'method' && current_visibility == 'static') {
            this._close = "return null }";
        }
        this.has_params = block_props.hasOwnProperty('has_params') ? block_props.has_params : kinds_of_blocks['_defaults']['has_params'];
    }

    /**
     * Close this block
     */
    close () {
        if (this.name == 'constructor') {
            return '}';
        }
        return `${this._close} //${this.type}`;
    }

    /**
     * Open this block
     * @param {numeric} number_line 
     * @param {string} line 
     */
    open (number_line, line) {
        number_line = typeof number_line == 'undefined' ? -1 : number_line;
        line = typeof line == 'undefined' ? '' : line;
        switch (this.type) {
            default:
                throw new Error(`Block ${this.type} doesn't exist. On line ${parseInt(number_line) + 1}`);
        }
    }

    /**
     * Returns true if the codeblock is in correct place
     * @param {numeric} number_line 
     */
    verifyCorrectPlace() {
        var father_block = block_stack[block_stack.length - 2];
        if (!this.can_be_child && father_block) {
            throw new Error(`${this.type} can't be inside of ${father_block.type}. On line ${parseInt(n_line) + 1}`);
        }
        if (this.must_be_child) {
            var must_be_inside_of = this.can_be_inside.length > 1 ? `one of this: ${this.can_be_inside.join()}` : `of ${this.can_be_inside[0]}`;
            if (!father_block) {
                throw new Error(`${this.type} can't be alone, it must be inside ${must_be_inside_of}. On line ${parseInt(n_line) + 1}`);
            }
            if (this.can_be_inside.indexOf(father_block.type) == -1) {
                throw new Error(`${this.type} can't be inside ${father_block.type}, it must be inside ${must_be_inside_of}. On line ${parseInt(n_line) + 1}`);
            }
        }
    }

    /**
     * Returns if this block is a class block
     */
    isClass () { 
        return false;
    }
    
    /**
     * Returns if is a valid codeblock name
     * @param {string} name 
     */
    validName (name, regex, regexName) {
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
            _const: {
                _retex: /^[A-Z_]+((\d)|([A-Z0-9]+))*$/,
                _name: 'SNAKE_CASE_ALL_UPERCASE.'
            }
        };
        if (!name.match(regex)) {
            throw new Error(`${error_name} ${this.type} must have name written on ${regexName}`);
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

class _class extends Block {
    constructor(type, name, params) {
        super(type, params);
        this.name = this.validName(name, /^(([A-Z])(\d)|([A-Z][a-z0-9]+))*([A-Z])?$/, 'CamelCase with leading uppercase.');
        this.attrs = [];
        this._constructor = false;
        this.methods = [];

        this.parent = 'Object';
        this.opened = false;
        this.traits = [];
        this.defaults = {};
        this.abstract = false;
        current_class = this;
        classes[class_name] = _class;
    }

    close() {
        var ret = '';
        var traits_code = '';
        if (!this._constructor) {
            ret += this.getConstructor();
        }
        if (this.traits.length) {
            traits_code += `
            trait(${this.name}, ${this.traits.join(',')})`;
            // this.traits.forEach(element => {
            //     traits_code += `trait(${})`;
            // });
        }
        ret += "__set_defaults(){";
        for (var i in this.defaults) {
            ret += `this.__${i} = ${this.defaults[i]};`;
        }
        ret += "}";
        current_visibility = '';
        return `${ret} ${this._close} ${traits_code} //${this.type} ${this.name}`;
    }

    isClass () { 
        return true;
    }

    open (number_line, line) {
        number_line = typeof number_line == 'undefined' ? -1 : number_line;
        line = typeof line == 'undefined' ? '' : line;
        try {
            if(!this.opened) {
                this.verifyCorrectPlace(number_line);
            }
        } catch (e) {
            throw e;
        }
        this.opened = true;
        return `class ${this.name} extends ${this.parent} {`;
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
        if (this.abstract) {
            block += `
                if (new.target === ${this.name}) {
                    throw new TypeError("Cannot construct Abstract instances directly");
                }`;
        }
        this._constructor = `constructor(${this.attrs.join(', ')}) {
            super();
            this.__set_defaults();
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
     * set default of a attr
     */
    setDefault(name, val) {
        this.defaults[name] = val;
    }
}

class _method extends Block {
    constructor (type, name, params) {
        super(type, params);
        this.name = this.validName(name, /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/, 'camelCase with leading lowercase.');
    }

    open (number_line) {
        this.verifyCorrectPlace(number_line);
        var ret = '';
        if (!current_class.opened) {
            ret += current_class.open();
        }
        if (this.name == 'constructor') {
            if (current_class.abstract) {
                throw new Error(`A abstract class can't have a constructor method. On line ${number_line}`);
            }
            current_class._constructor = true;
            return `${ret} constructor(${this.params}) { super(); this.__set_defaults();`;
        }
        switch (current_visibility) {
            case "public":
                var getter = `${this.name}() { return this.__${this.name}.apply(this, arguments); }`;
                break;
            case "private":
                var getter = `${this.name}() { throw new Error('Trying to access a private method ${this.name}.'); }`;
                break;
            case "static":
                return `${ret} static ${this.name}(${this.params}) {`;
        }
        return `${ret} ${getter}
                ${current_visibility == "static" ? "static" : ''} __${this.name}(${this.params}) {`
    }
}

class _visibility extends Block {
    constructor(type) {
        super(type, null);
        current_visibility = type;
    }
    open() {
        var ret = '';
        if (!current_class.opened) {
            ret += current_class.open();
        }
        current_visibility = this.type;
        return `${ret} //${this.type}`;
    }

    close() {
        current_visibility = false;
        super.close();
    }
}

class _attr extends Block {
    constructor(type, name, params) {
        super(type, params);
        this.name = this.validName(name, /^[a-z_]+((\d)|([a-z0-9]+))*$/, 'snake_case_all_lowercase.');
        switch(current_visibility) {
            case 'public':
                this.setter = `set ${this.name}(val) { this.__${this.name} = val; }`;
                this.getter = `get ${this.name}() { return this.__${this.name}; }`;
                break;
            case 'private':
                this.setter = `set ${this.name}(val) { throw new Error("${this.name} is a private attribute, it's value can't be changed outside it's class") }`;
                this.getter = `get ${this.name}() { throw new Error("${this.name} is a private attribute, it's value can't be get outside it's class") }`;
                break;
            case 'static':
                this.setter = `static set ${this.name}(val) { ${current_class.name}.__${this.name} = val; }`;
                this.getter = `static get ${this.name}() { return ${current_class.name}.__${this.name}; }`;
                break;
        }
        params = params.replace(/:$/, '');
        current_class.setDefault(this.name, (params ? params : "null"));
        current_attr = this;
    }
    open() {
        return '';
    }
    close() {
        var ret = '';
        if (this.getter) {
            ret += this.getter;
        }
        if (this.setter) {
            ret += this.setter;
        }
        return ret;
    }
}

class _const extends Block {
    constructor(type, name, params) {
        super(type, params);
        this.name = this.validName(name, /^[A-Z_]+((\d)|([A-Z0-9]+))*$/, 'SNAKE_CASE_ALL_UPPERCASE.');
    }
    open() {
        return `static get ${this.name} () {return ${this.params}} 
                static set ${this.name} (value) {throw new Error("${this.name} is a class constant, and can't have his value changed to " + value)}`;
    }
}

class _setter_n_getter extends Block {
    constructor(type, params) {
        super(type, params);
        if (type == "set") {
            current_attr.setter = false;
        }
        if (type == "get") {
            current_attr.getter = false;
        }
    }
    open() {
        return `${current_visibility == 'static' ? 'static' : ''} ${this.type} ${current_attr.name} (${this.params}) {`;
    }
}

class _conditionals extends Block {
    constructor(type, params) {
        super(type, params);
        this.openStartList = {
            _if : `if(`,
            _unless : `if(!(`,
            _elseif : `else if(`,
            _else : `else {`,
            _elseunless : `else if(!(`,
            _switch: `switch (`,
            _case: `case `,
            _default: `default:`,
        };
        this.openFinishList = {
            _if : `) {`,
            _unless : `)) {`,
            _elseif : `) {`,
            _else : ``,
            _elseunless : `)) {`,
            _switch : `) {`,
            _case: `:`,
            _default: '',
        };
        this.openStart = this.openStartList[`_${this.type}`];
        this.openFinish = this.openFinishList[`_${this.type}`];
    }
    open() {
        return `${this.openStart}${this.params}${this.openFinish}`;
    }
}

class _loop extends Block {
    constructor(type, params) {
        super(type, params);
        if (this.type == "from") {
            this.defineTo()
        }
        console.log(this);
    }

    open() {
        
    }
}

fs.readFile('index.poi', 'UTF-8', (err, contents) => {
    let file = contents.split('\n');
    lineToLineTranspiller(file);
});

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

        if (/^(extends )/.test(line)) {
            current_class.parent = line.replace(/^(extends )/g, '');
            openClass(line);
            continue;
        }

        if (/^(traits )/.test(line)) {
            js_transpiled.push(`//${line}`);
            current_class.traits = line.replace(/^(traits )/g, '').split(',');
            specialFunctionsUtilized.push('trait')
            continue;
        }
        
        if (/abstract/.test(line)) {
            js_transpiled.push(`//${line}`);
            current_class.abstract = true;
            openClass(line);
            continue;
        }

        var is_block = false;
        for (var i in openBlockRegex) {
            var bl_type = i.replaceAll('_'),
                bl_regex = openBlockRegex[i];
            if (bl_regex && bl_regex.test(line)) {
                is_block = true;
                openBlock(line, bl_type);
                break;
            }
        }

        if (is_block) {
            continue;
        }
        //bruteline(line);
    }
    for (var index in specialFunctionsUtilized) {
        js_transpiled.push(specialFunctions[specialFunctionsUtilized[index]])
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
    var _class = blockFactory('class', class_name, null);
    block_stack.push(_class);
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
    var _block = blockFactory(block_type, name, params);
    block_stack.push(_block);
    if (_block.type == "attr") {
        current_attr = _block;
    }
    js_transpiled.push(_block.open(n_line, line));
};
