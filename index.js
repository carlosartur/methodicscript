var fs = require('fs');

var js_transpiled = [];

var is_comment = false;
var inside_string = false;
var block_stack = [];
var classes = {};
var kinds_of_blocks = {
    _defaults: {
        can_be_child: true,
        must_be_child: false,
        can_be_inside: [],
        close: '}'
    },
    _class: {
        can_be_child: false,
        close: '} //class',
    },
    _attr: {
        must_be_child: true,
        can_be_inside: ['_class', '_public', '_private']
    },
    _method: {
        must_be_child: true,
        can_be_inside: ['_class', '_public', '_private']
    },
    _private: {
        must_be_child: true,
        can_be_inside: ['_class'],
        close: ''
    },
    _public: {
        must_be_child: true,
        can_be_inside: ['_class'],
        close: ''
    },
    _get: {
        must_be_child: true,
        can_be_inside: ['_attr']
    },
    _set: {
        must_be_child: true,
        can_be_inside: ['_attr']
    },
    _const: {
        must_be_child: true,
        can_be_inside: ['_public']
    },
    _static: {
        must_be_child: true,
        can_be_inside: ['_class'],
        close: ''
    }
};


class Block {
    constructor (type, name) {
        this.name = typeof name == 'undefined' ? '' : name;
        this.type = type;
        this.attrs = [];
        this._constructor = false;
        this.methods = [];

        this.block_props = kinds_of_blocks.hasOwnProperty(`_${this.type}`) ? kinds_of_blocks[`_${this.type}`] : kinds_of_blocks['_defaults'];
        
        this.can_be_child = this.block_props.hasOwnProperty('can_be_child') ? this.block_props.can_be_child : kinds_of_blocks['_defaults']['can_be_child'];
        this.must_be_child = this.block_props.hasOwnProperty('must_be_child') ? this.block_props.must_be_child : kinds_of_blocks['_defaults']['must_be_child'];
        this.can_be_inside = this.block_props.hasOwnProperty('can_be_inside') ? this.block_props.can_be_inside : kinds_of_blocks['_defaults']['can_be_inside'];
        this._close = this.block_props.hasOwnProperty('close') ? this.block_props.close : kinds_of_blocks['_defaults']['close'];
    }

    close () {
        var ret = '';
        if (this.type == 'class') {
            ret += this.getConstructor();
        }
        return `${ret} ${this._close} //${this.type} ${this.name}`;
    }
    open (line) {
        line = typeof line == 'undefined' ? -1 : line;
        switch (this.type) {
            case 'class':
                return `class ${class_name} {`;
            default:
                throw new Error(`Block code type not defined. On line ${line}`);
        }
    }

    isClass () { 
        return this.type == 'class';
    }

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

    getConstructor () {
        if(!this._constructor) {
            this.setConstructor();
        }
        return this._constructor;
    }
}

fs.readFile('index.poi', 'UTF-8', (err, contents) => {
    let file = contents.split('\n');
    lineToLineTranspiller(file);
});
var n_line;
var lineToLineTranspiller = (file) => {
    var spaces = [];
    var current_class = '';
    var current_method = '';
    for (n_line in file) {
        let line = file[n_line];

        spaces.push(line.search(/\S/));
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
        if (spaces[spaces.length - 1] > spaces[spaces.length - 2]) {
            closeBlock();
        }
        
        if (/(class[\s]{1,}[\w]+[\s]{0,}?:)+/.test(line)) {    
            openClass(line);
            continue;
        }

        if (/public:/.test(line)) {

        }
    }
    fs.writeFile('index.poi.js', js_transpiled.join('\n'), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

};

var closeBlock = () => {
    let block_closed = block_stack.pop();
    if (block_closed) {
        try {
            js_transpiled.push(block_closed.close());
        } catch (e) {
            console.log(block_stack, e, n_line);
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

    js_transpiled.push(_class.open());
    return class_name;
};

var openBlock = (line, block_type) => {
    var _block = new Block(block_type);
    block_stack.push(_block);
};
