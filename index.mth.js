function echo() {
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
function echo() {
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
class BlockFactory extends Object { //static
    /**
     *Returns new block
     *@method build
     *@param string type
     *@param string name
     *@param string params
     *@returns Block
     */
    static build(type, name = '', params = '') {
        let type_block_function = {
            blockClass: ['class'],
            blockMethodDefaultParams: ['methodwithdefaultparams', 'functionwithdefaultparams'],
            blockMethod: ["method", "function"],
            blockVisibility: ["public", "private", "static"],
            blockAttr: ['attr'],
            blockConst: ['const'],
            blockSetterAndGetter: ["set", "get"],
            blockConditional: ["if", "elseif", "unless", "else", "elseunless", "switch", "", "default"],
            blockLoop: ["from", "foreach", "while", "repeat"],
            blockErrorHandling: ["try", "catch", "is", "finally", "another"]
        }
        for (var met in type_block_function) {
            var types = type_block_function[met]
            if (types.includestype) {
                return BlockFactory[`${met}`](type, name, params)
            } //if
        } //foreach
        throw new SintaxError("Can't identify code block type")
        /**
         *@method blockClass
         */
        return this;
    } // method //methodwithdefaultparams
    static blockClass(type, name, params) {
        return new ClassBlock(type)
        /**
         *@method blockMethodDefaultParams
         */
        return null
    } //method
    static blockMethodDefaultParams(type, name, params) {
        let methodObj = new MethodBlock(type, name, params)
        methodObj.hasDefaultParams()
        return methodObj
        /**
         *@method blockMethod
         */
        return null
    } //method
    static blockMethod(type, name, params) {
        return new MethodBlock(type, name, params)
        /**
         *@method blockVisibility
         */
        return null
    } //method
    static blockVisibility(type, name, params) {
        return new VisibilityBlock(type)
        /**
         *@method blockAttr
         */
        return null
    } //method
    static blockAttr(type, name, params) {
        return new AttrBlock(type, name, params)
        /**
         *@method blockConst
         */
        return null
    } //method
    static blockConst(type, name, params) {
        return new ConstBlock(type, name, params)
        /**
         *@method blockSetterAndGetter
         */
        return null
    } //method
    static blockSetterAndGetter(type, name, params) {
        return new GetterAndSetterBlock(type, params)
        /**
         *@method blockConditional
         */
        return null
    } //method
    static blockConditional(type, name, params) {
        return new ConditionalsBlock(type, params)
        /**
         *@method blockLoop
         */
        return null
    } //method
    static blockLoop(type, name, params) {
        return new LoopBlock(type, params)
        /**
         *@method blockErrorHandling
         */
        return null
    } //method
    static blockErrorHandling(type, name, params) {
        return new ErrorHandlingBlock(type, params)
        return null
    } //method

    constructor() {
        super();
        this.__set_defaults();

    }
    __set_defaults() {}
} //class  //class BlockFactory
class AttrBlock extends Block {
    //public
    /**
     *@method constructor
     *@param String type
     *@param String name
     *@param String params
     */
    constructor(type, name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        switch (current_visibility) {
            case 'public':
                this.__setter = `set ${this.__name}(val) { this.____${this.__name} = val; }`
                this.__getter = `get ${this.__name}() { return this.____${this.__name}; }`
                break; //case
            case 'private':
                this.__setter = `set ${this.__name}(val) { throw new Error("${this.__name} is a private attribute, it's value can't be changed outside it's class") }`;
                this.__getter = `get ${this.__name}() { throw new Error("${this.__name} is a private attribute, it's value can't be get outside it's class") }`;
                break; //case
            case 'static':
                this.__setter = `static set ${this.__name}(val) { ${current_class.name}.__${this.__name} = val; }`;
                this.__getter = `static get ${this.__name}() { return ${current_class.name}.__${this.__name}; }`;
                break; //case
        } //switch
        params = params.replace(/:$/, '')
        current_class.setDefault(this.__name, (params ? params : "null"))
        current_attr = this
        /**
         *Retuns blank
         *@method open
         */
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return ''
        /**
         *Returns js getters and setters of the attr
         *@method close
         */
        return this;
    } // method //method
    close() {
        return this.__close.apply(this, arguments);
    }
    __close() {
        var ret = ''
        if this.__getter
        ret += this.__getter
        if this.__setter
        ret += this.__setter
        return ret
        return this;
    } // method //method

    //private
    /**
     *@attr setter
     */

    /**
     *@attr getter
     */
    get setter() {
        throw new Error("setter is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set setter(val) {
        throw new Error("setter is a private attribute, it's value can't be changed outside it's class");
    }

    get getter() {
        throw new Error("getter is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set getter(val) {
        throw new Error("getter is a private attribute, it's value can't be changed outside it's class");
    }

    __set_defaults() {
        this.__setter = null;
        this.__getter = null;
    }
} //class  //class AttrBlock
class ClassBlock extends Block {
    //public
    /**
     *@method constructor
     *@param string name
     *@param string params
     */
    constructor(name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(Block.CLASS_BLOCK_TYPE_NAME, params)
        this.__name = this.__validName(name, /^(([A-Z])(\d)|([A-Z][a-z0-9]+))*([A-Z])?$/, 'CamelCase with leading uppercase.')
        current_class = this
        classes[class_name] = this
        /**
         *Closes class, with traits and setDefaults
         *@returns string
         */
    }
    close() {
        return this.__close.apply(this, arguments);
    }
    __close() {
        var ret = '';
        var traits_code = '';
        ret += this.__constructor_method;
        if (this.traits.length) {
            traits_code += `trait(${this.__name}, ${this.__traits.join(',')});`
        } //if
        ret += this.__defaultsMethod
        current_visibility = '';
        return `${ret} ${this.___close} ${traits_code} //${this.__type} ${this.__name}`;
        /**
         *Opens class, verifying if it extends something, traits something
         *@param numeric number_line default -1
         *@param string line default ''
         *@returns string
         */
        return this;
    } // method //method
    open() {
        return this.__open.apply(this, arguments);
    }
    __open(number_line, line) {
        number_line = typeof number_line !== 'undefined' ? number_line : -1;
        line = typeof line !== 'undefined' ? line : '';
        try {
            if (!(this.opened)) {
                this.__verifyCorrectPlace(number_line)
            } //unless
        } catch (exception) {
            throw exception
        }
        this.__opened = true
        return `class ${this.__name} extends ${this.__parent} {`
        /**
         *Add class attrs to class
         *@param string name
         *@param any val
         */
        return this;
    } // method //methodwithdefaultparams
    addDefault() {
        return this.__addDefault.apply(this, arguments);
    }
    __addDefault(name, val) {
        this.__defaults[name] = val
        return this;
    } // method //method

    //private
    /**
     *@attr attrs
     */

    /**
     *@attr methods
     */
    get attrs() {
        throw new Error("attrs is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set attrs(val) {
        throw new Error("attrs is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr parent
     */
    get methods() {
        throw new Error("methods is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set methods(val) {
        throw new Error("methods is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr opened
     */
    get parent() {
        throw new Error("parent is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set parent(val) {
        throw new Error("parent is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr traits
     */
    get opened() {
        throw new Error("opened is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set opened(val) {
        throw new Error("opened is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr defaults
     */
    get traits() {
        throw new Error("traits is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set traits(val) {
        throw new Error("traits is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr is_abstract
     */
    get defaults() {
        throw new Error("defaults is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set defaults(val) {
        throw new Error("defaults is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr defaultsMethod
     */
    get is_abstract() {
        throw new Error("is_abstract is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set is_abstract(val) {
        throw new Error("is_abstract is a private attribute, it's value can't be changed outside it's class");
    }

    get defaults_method() {
        if (!(this.defaults_method)) {
            this.__defaults_method = "__set_defaults(){"
            for (var index in this.defaults) {
                var def = this.defaults[index]
                this.__defaults_method += `this.____${index} = ${def};`
            } //foreach
            this.__defaults_method += "}"
        } //unless
        return this.__defaults_method
        /**
         *@attr constructor_method
         */
    } //get
    set defaults_method(val) {
        throw new Error("defaults_method is a private attribute, it's value can't be changed outside it's class");
    }

    get constructor_method() {
        if (!(this.isClass)) {
            return false
        } //unless
        if (!(this.constructor_method)) {
            this.__buildConstructor()
        } //unless
        return this.__constructor_method
        /**
         *@method buildConstructor
         *@param string block default ''
         */
    } //get
    set constructor_method(val) {
        throw new Error("constructor_method is a private attribute, it's value can't be changed outside it's class");
    }
    buildConstructor() {
        throw new Error('Trying to access a private method buildConstructor.');
    }
    __buildConstructor(block) {
        block = typeof block !== 'undefined' ? block : '';
        if (!(this.isClass)) {
            return false
        } //unless
        if (block) {
            this.__constructor = block
            return this.__constructor
        } //if
        for (var index in this.attrs) {
            var val = this.attrs[index]
            block += `this.__${val} typeof ${val} == 'undefined' ? null : ${val};`
        } //foreach
        if (this.is_abstract) {
            block += `if (new.target === ${this.__name}) {throw new TypeError("Cannot construct Abstract instances directly");}`
        } //if
        this.__constructor_method = `constructor(${this.__attrs.join(', ')}) {
super();
this.____set_defaults();
${block}
}`;
        this.__methods.unshift(this.__constructor_method);
        return this;
    } // method //methodwithdefaultparams

    __set_defaults() {
        this.__attrs = [];
        this.__methods = [];
        this.__parent = 'Object';
        this.__opened = false;
        this.__traits = [];
        this.__defaults = {};
        this.__is_abstract = false;
        this.__defaults_method = null;
        this.__constructor_method = false;
    }
} //class  //class ClassBlock
class ConstBlock extends Block {
    //public
    constructor(type, name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        this.__name = this.__validName(name, /^[A-Z_]+((\d)|([A-Z0-9]+))*$/, 'SNAKE_CASE_ALL_UPPERCASE.')
        /**
         *Opens a CONST block
         *@returns string
         */
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return `static get ${this.__name} () {return ${this.__params}}
static set ${this.__name} (value) {throw new Error("${this.__name} is a class constant, and can't have his value changed to " + value)}`
        return this;
    } // method //method

    __set_defaults() {}
} //class  //class ConstBlock
class ConditionalsBlock extends Block {
    //public
    /**
     *@method constructor
     *@param string type
     *@param string name
     *@param string params
     */
    constructor(type, name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        /**
         *Returns block open
         *@method open
         */
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return `${this.__open_start}${this.__params}${this.__open_finish}`;
        return this;
    } // method //method

    //private
    /**
     *@attr open_start_if
     */

    /**
     *@attr open_start_unless
     */
    get open_start_if() {
        throw new Error("open_start_if is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_if(val) {
        throw new Error("open_start_if is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_elseif
     */
    get open_start_unless() {
        throw new Error("open_start_unless is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_unless(val) {
        throw new Error("open_start_unless is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_else
     */
    get open_start_elseif() {
        throw new Error("open_start_elseif is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_elseif(val) {
        throw new Error("open_start_elseif is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_elseunless
     */
    get open_start_else() {
        throw new Error("open_start_else is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_else(val) {
        throw new Error("open_start_else is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_switch
     */
    get open_start_elseunless() {
        throw new Error("open_start_elseunless is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_elseunless(val) {
        throw new Error("open_start_elseunless is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_case
     */
    get open_start_switch() {
        throw new Error("open_start_switch is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_switch(val) {
        throw new Error("open_start_switch is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start_default
     */
    get open_start_case() {
        throw new Error("open_start_case is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_case(val) {
        throw new Error("open_start_case is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_if
     */
    get open_start_default() {
        throw new Error("open_start_default is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_start_default(val) {
        throw new Error("open_start_default is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_unless
     */
    get open_finish_if() {
        throw new Error("open_finish_if is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_if(val) {
        throw new Error("open_finish_if is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_elseif
     */
    get open_finish_unless() {
        throw new Error("open_finish_unless is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_unless(val) {
        throw new Error("open_finish_unless is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_else
     */
    get open_finish_elseif() {
        throw new Error("open_finish_elseif is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_elseif(val) {
        throw new Error("open_finish_elseif is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_elseunless
     */
    get open_finish_else() {
        throw new Error("open_finish_else is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_else(val) {
        throw new Error("open_finish_else is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_switch
     */
    get open_finish_elseunless() {
        throw new Error("open_finish_elseunless is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_elseunless(val) {
        throw new Error("open_finish_elseunless is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_case
     */
    get open_finish_switch() {
        throw new Error("open_finish_switch is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_switch(val) {
        throw new Error("open_finish_switch is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_finish_default
     */
    get open_finish_case() {
        throw new Error("open_finish_case is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_case(val) {
        throw new Error("open_finish_case is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_start
     */
    get open_finish_default() {
        throw new Error("open_finish_default is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finish_default(val) {
        throw new Error("open_finish_default is a private attribute, it's value can't be changed outside it's class");
    }

    get open_start() {
        this[`open_start_${this.__type}`]
        /**
         *@attr open_finish
         */
    } //get
    set open_start(val) {
        throw new Error("open_start is a private attribute, it's value can't be changed outside it's class");
    }

    get open_finish() {
        this[`open_finish_${this.__type}`]
    } //get
    set open_finish(val) {
        throw new Error("open_finish is a private attribute, it's value can't be changed outside it's class");
    }

    __set_defaults() {
        this.__open_start_if = `if`;
        this.__open_start_unless = `if!`;
        this.__open_start_elseif = `else if`;
        this.__open_start_else = `else {`;
        this.__open_start_elseunless = `else if!`;
        this.__open_start_switch = `switch `;
        this.__open_start_case = `case `;
        this.__open_start_default = `default:`;
        this.__open_finish_if = ` {`;
        this.__open_finish_unless = ` {`;
        this.__open_finish_elseif = ` {`;
        this.__open_finish_else = ``;
        this.__open_finish_elseunless = ` {`;
        this.__open_finish_switch = ` {`;
        this.__open_finish_case = `:`;
        this.__open_finish_default = null;
        this.__open_start = null;
        this.__open_finish = null;
    }
} //class  //class ConditionalsBlock
class ErrorHandlingBlock extends Block {
    //public
    /**
     *@method constructor
     *@param string type
     *@param string params
     */
    constructor(type, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        if (!(type == 'is')) {
            current_error_handling = this
            /**
             *@attr bool has_is_inside
             */
        } //unless
    }

    /**
     *@method open
     *@returns string
     */
    get has_is_inside() {
        return this.__has_is_inside;
    }
    set has_is_inside(val) {
        this.__has_is_inside = val;
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return this[`open_${this.__type}`]
        return this;
    } // method //method

    //private
    /**
     *@attr string open_is
     */

    get open_is() {
        current_error_handling.has_is_inside = true;
        return this.__open_is
        /**
         *@attr string open_catch
         */
    } //get
    set open_is(val) {
        throw new Error("open_is is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr string open_try
     */
    get open_catch() {
        throw new Error("open_catch is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_catch(val) {
        throw new Error("open_catch is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr string open_finally
     */
    get open_try() {
        throw new Error("open_try is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_try(val) {
        throw new Error("open_try is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr string open_another
     */
    get open_finally() {
        throw new Error("open_finally is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_finally(val) {
        throw new Error("open_finally is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@method close
     *@returns String
     */
    get open_another() {
        throw new Error("open_another is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_another(val) {
        throw new Error("open_another is a private attribute, it's value can't be changed outside it's class");
    }
    close() {
        throw new Error('Trying to access a private method close.');
    }
    __close() {
        return `${this.___close}`
        return this;
    } // method //method

    __set_defaults() {
        this.__has_is_inside = false;
        this.__open_is = `if ${current_error_handling.params} instanceof ${this.params} {`;
        this.__open_catch = `catch ${this.params} {`;
        this.__open_try = 'try {';
        this.__open_finally = 'finally {';
        this.__open_another = ' {';
    }
} //class  //class ErrorHandlingBlock
class GetterAndSetterBlock extends Block {
    //public
    constructor(type, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        if (type == "set") {
            current_attr.setter = false
        } //if
        if (type == "get") {
            current_attr.getter = false
            /**
             *Opens a CONST block
             *@returns string
             */
        } //if
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return `${current_visibility == 'static' ? 'static' : ''} ${this.__type} ${current_attr.name} (${this.__params}) {`
        return this;
    } // method //method

    __set_defaults() {}
} //class  //class GetterAndSetterBlock
class LoopBlock extends Block {
    //public
    /**
     *@method constructor
     *@param string type
     *@param string name
     *@param string params
     */
    constructor(type, name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        if (this.type == "repeat") {
            inside_do = true
            /**
             *@method open
             */
        } //if
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        return this[`open_${this.__type}`]
        /**
         *@method close
         */
        return this;
    } // method //method
    close() {
        return this.__close.apply(this, arguments);
    }
    __close() {
        if (this.type == "repeat" || this.is_closing_of_repeat) {
            return ''
        } //if
        return super.close()
        return this;
    } // method //method

    //private
    /**
     *@attr boolean is_closing_of_repeat
     */

    /**
     *@attr open_repeat
     */
    get is_closing_of_repeat() {
        throw new Error("is_closing_of_repeat is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set is_closing_of_repeat(val) {
        throw new Error("is_closing_of_repeat is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr open_while
     */
    get open_repeat() {
        throw new Error("open_repeat is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set open_repeat(val) {
        throw new Error("open_repeat is a private attribute, it's value can't be changed outside it's class");
    }

    get open_while() {
        var str_return = `${inside_do ? '}' : ''} while(${this.__params}) ${inside_do ? ';' : '{'}`
        this.__is_closing_of_repeat = inside_do
        inside_do = !inside_do
        return str_return
        /**
         *@attr open_foreach
         */
    } //get
    set open_while(val) {
        throw new Error("open_while is a private attribute, it's value can't be changed outside it's class");
    }

    get open_foreach() {
        return `for (var ${this.__indexVar} in ${this.__interatorVar}) { var ${this.__aliasVar} = ${this.__interatorVar}[${this.__indexVar}]`
        /**
         *@attr open_from
         */
    } //get
    set open_foreach(val) {
        throw new Error("open_foreach is a private attribute, it's value can't be changed outside it's class");
    }

    get open_from() {
        var operator = this.__step_ < 0 ? ">=" : "<="
        return `for (var ${this.__from_}; ${this.__indexVar} ${operator} ${this.__to_}; ${this.__indexVar} += (${this.__step_}) ) {`
        /**
         *@attr to_
         */
    } //get
    set open_from(val) {
        throw new Error("open_from is a private attribute, it's value can't be changed outside it's class");
    }

    get to_() {
        if (!(this.to_)) {
            this.__to_ = this.__params
                .match(/(to (.){1,}(step))/)
                .shift()
                .replace('to', '')
                .replace('step', '')
        } //unless
        return this.__to_
        /**
         *@attr from_
         */
    } //get
    set to_(val) {
        throw new Error("to_ is a private attribute, it's value can't be changed outside it's class");
    }

    get from_() {
        if (!(this.from_)) {
            this.__from_ = this.__params
                .match(/(.{1,}\d{1,} (to))/)
                .shift()
                .replace(' to', '')
                .replace('from ', '')
        } //unless
        return this.__from_
        /**
         *@attr index_var
         */
    } //get
    set from_(val) {
        throw new Error("from_ is a private attribute, it's value can't be changed outside it's class");
    }

    get index_var() {
        if (!(this.index_var)) {
            if (this.type == 'from') {
                this.__index_var = this.__params
                    .match(/( \w{3,})/)
                    .shift()
                    .replace('from ', '')
            } //if
            else if (this.type == 'foreach') {
                this.__index_var = this.__params
                    .match(/((.)*(in))/)
                    .shift()
                    .replace('in ', '')
                    .trim()
                    .split(' ')[0]
            } //elseif
            else {
                throw new SyntaxError(`Loop type detection error. Type ${this.__type}. In line ${n_line}`)
            } //else
        } //unless
        return this.__index_var
        /**
         *@attr interator_var
         */
    } //get
    set index_var(val) {
        throw new Error("index_var is a private attribute, it's value can't be changed outside it's class");
    }

    get interator_var() {
        if (!(this.interator_var)) {
            this.__interator_var = this.__params
                .match(/(in (.)*(as))/)
                .shift()
                .replace(' as', '')
                .replace('in ', '')
        } //unless
        return this.__interator_var
        /**
         *@attr interator_var
         */
    } //get
    set interator_var(val) {
        throw new Error("interator_var is a private attribute, it's value can't be changed outside it's class");
    }

    get alias_var() {
        if (!(this.alias_var)) {
            this.__alias_var = this.__params
                .match(/(as (.)*)/)
                .shift()
                .replace('as ', '')
        } //unless
        return this.__alias_var
        /**
         *@attr interator_var
         */
    } //get
    set alias_var(val) {
        throw new Error("alias_var is a private attribute, it's value can't be changed outside it's class");
    }

    get step_() {
        if (!(this.step_)) {
            this.__step_ = this.__params
                .match(/((step)\s{1,}-?\d{1,})/)
                .shift()
                .replace('step ', '')
        } //unless
        return this.__step_
    } //get
    set step_(val) {
        throw new Error("step_ is a private attribute, it's value can't be changed outside it's class");
    }

    __set_defaults() {
        this.__is_closing_of_repeat = false;
        this.__open_repeat = "do {";
        this.__open_while = null;
        this.__open_foreach = null;
        this.__open_from = null;
        this.__to_ = null;
        this.__from_ = null;
        this.__index_var = null;
        this.__interator_var = null;
        this.__alias_var = null;
        this.__step_ = null;
    }
} //class  //class LoopBlock
class MethodBlock extends Block {
    //public
    constructor(type, name, params) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type, params)
        this.__name = this.__validName(name, /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/, 'camelCase with leading lowercase.');
        this.__is_function = this.__type.indexOf('function') != -1;
        /**
         *Opens method block
         *@param numeric number_line
         *@returns string
         */
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open(number_line) {
        this.__verifyCorrectPlace(number_line)
        var ret = ''
        if (!(current_class.opened)) {
            ret += current_class.open()
        } //unless
        if (this.name == 'constructor') {
            return this.__openConstructor(ret)
        } //if
        switch (current_visibility) {
            case "public":
                var getter = `${this.__name}() { return this.____${this.__name}.apply(this, arguments); }`;
                break; //case
            case "private":
                var getter = `${this.__name}() { throw new Error('Trying to access a private method ${this.__name}.'); }`;
                break; //case
            case "static":
                return `${ret} static ${this.__name}(${this.__params}) {`;
                break; //case
        } //switch
        let default_params_lines = this.__defaultValuesParams()
        if (this.is_function) {
            return `function ${this.__name}(${this.__params}) { ${default_params_lines}`
        } //if
        return `${ret} ${getter}
${current_visibility == "static" ? "static" : ''} __${this.__name}(${this.__params}) { ${default_params_lines}`
        /**
         *Set has default params as true
         *@method hasDefaultParams
         */
        return this;
    } // method //method
    hasDefaultParams() {
        return this.__hasDefaultParams.apply(this, arguments);
    }
    __hasDefaultParams() {
        this.__has_default_params = true
        return this;
    } // method //method

    //private
    /**
     *@attr has_default_params
     */

    /**
     *@attr has_default_params
     */
    get has_default_params() {
        throw new Error("has_default_params is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set has_default_params(val) {
        throw new Error("has_default_params is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr has_default_params
     */
    get is_function() {
        throw new Error("is_function is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set is_function(val) {
        throw new Error("is_function is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *Opens a constructor method
     *@param string ret
     */
    get has_default_params() {
        throw new Error("has_default_params is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set has_default_params(val) {
        throw new Error("has_default_params is a private attribute, it's value can't be changed outside it's class");
    }
    openConstructor() {
        throw new Error('Trying to access a private method openConstructor.');
    }
    __openConstructor(ret) {
        if (current_class.abstract) {
            throw new Error(`A abstract class can't have a constructor method. On line ${number_line}`)
        } //if
        current_class._constructor = true
        return `${ret} constructor(${this.__params}) { super(); this.____set_defaults();`
        /**
         *Set defaults params values
         *@returns string
         */
        return this;
    } // method //method
    defaultValuesParams() {
        throw new Error('Trying to access a private method defaultValuesParams.');
    }
    __defaultValuesParams() {
        if (!(this.has_default_params)) {
            return ''
        } //unless
        let splited_params = this.__params.split(',').map(function(item) {
            let attr_n_value = item.split('=')
            return {
                attr: attr_n_value[0].trim(),
                value: attr_n_value.length > 1 ? attr_n_value[1].trim() : null
            }
        })
        let str_return = '',
            params_names = []
        for (var index in this.defaults) {
            var splited_params_item = this.defaults[index]
            params_names.push(splited_params_item.attr)
            if (!(splited_params_item.value)) {
                continue
            } //unless
            str_return += `${splited_params_item.attr} = typeof ${splited_params_item.attr} !== 'undefined' ? ${splited_params_item.attr} : ${splited_params_item.value};`
        } //foreach
        this.__params = params_names.join(', ')
        return str_return
        return this;
    } // method //method

    __set_defaults() {
        this.__has_default_params = false;
        this.__is_function = null;
    }
} //class  //class MethodBlock
class VisibilityBlock extends Block {
    //public
    /**
     *@method constructor
     *@param String type
     */
    constructor(type) {
        super();
        this.__set_defaults();
        this.__configureBlockProps(type)
        current_visibility = type
        /**
         *@method open
         */
    }
    open() {
        return this.__open.apply(this, arguments);
    }
    __open() {
        var ret = ''
        if (!(current_class.opened)) {
            ret += current_class.open()
        } //unless
        current_visibility = this.__type
        return `${ret} //${this.__type}`
        /**
         *@method close
         */
        return this;
    } // method //method
    close() {
        return this.__close.apply(this, arguments);
    }
    __close() {
        current_visibility = false
        super.close()
        return this;
    } // method //method

    __set_defaults() {}
} //class  //class VisibilityBlock
/**
 *Class Block
 */
//abstract
class Block extends Object {
    //static
    /**
     *@const CONSTRUCTOR_METHOD_NAME
     */
    static get CONSTRUCTOR_METHOD_NAME() {
        return 'constructor'
    }
    static set CONSTRUCTOR_METHOD_NAME(value) {
        throw new Error("CONSTRUCTOR_METHOD_NAME is a class constant, and can't have his value changed to " + value)
    }
    /**
     *@const CLASS_BLOCK_TYPE_NAME
     */
    //const
    static get CLASS_BLOCK_TYPE_NAME() {
        return 'class'
    }
    static set CLASS_BLOCK_TYPE_NAME(value) {
        throw new Error("CLASS_BLOCK_TYPE_NAME is a class constant, and can't have his value changed to " + value)
    }
    //const

    //public
    /**
     *@method configureBlockProps
     *@returns this
     */
    configureBlockProps() {
        return this.__configureBlockProps.apply(this, arguments);
    }
    __configureBlockProps(type, params) {
        params = typeof params !== 'undefined' ? params : '';
        this.__type = type
        this.__block_props = kinds_of_blocks.hasOwnProperty(`_${this.__type}`) ? kinds_of_blocks[`_${this.__type}`] : kinds_of_blocks['_defaults']
        this.__can_be_child = this.__block_props.hasOwnProperty('can_be_child') ? block_props.can_be_child : kinds_of_blocks['_defaults']['can_be_child']
        this.__must_be_child = this.__block_props.hasOwnProperty('must_be_child') ? block_props.must_be_child : kinds_of_blocks['_defaults']['must_be_child']
        this.__can_be_inside = this.__block_props.hasOwnProperty('can_be_inside') ? block_props.can_be_inside : kinds_of_blocks['_defaults']['can_be_inside']
        this.__close_code = this.__block_props.hasOwnProperty('close') ? block_props.close : kinds_of_blocks['_defaults']['close']
        if (this.type == 'method' && current_visibility == 'static') {
            this.__close_code = "return null }"
        } //if
        this.__has_params = this.__block_props.hasOwnProperty('has_params') ? block_props.has_params : kinds_of_blocks['_defaults']['has_params']
        this.__params = this.__has_params && params ? this.__setParams(params) : ''
        /**
         *@method close returns string
         */
        return this;
    } // method //methodwithdefaultparams
    close() {
        return this.__close.apply(this, arguments);
    }
    __close() {
        if (this.name == Block.CONSTRUCTOR_METHOD_NAME) {
            return '}'
        } //if
        return `${this.___close} //${this.__type}`
        /**
         *@method open
         *@param {numeric} number_line
         *@param {string} line
         */
        return this;
    } // method //method
    open() {
        return this.__open.apply(this, arguments);
    }
    __open(number_line, line) {
        throw new SyntaxError(`Block ${this.__type} doesn't exist. On line ${parseInt(number_line) + 1}`);
        /**
         *@method verifyCorrectPlace
         */
        return this;
    } // method //method
    verifyCorrectPlace() {
        return this.__verifyCorrectPlace.apply(this, arguments);
    }
    __verifyCorrectPlace(number_line) {
        var fatherBlock = blockStack[blockStack.length - 2];
        if (fatherBlock && fatherBlock.name && this.type == "class" && fatherBlock.name == this.name) {
            return true
        } //if
        if (!(this.can_be_child && fatherBlock)) {
            throw new SyntaxError(`${this.__type} can't be inside of ${fatherBlock.type}. On line ${parseInt(n_line) + 1}`)
        } //unless
        if (this.must_be_child) {
            var must_be_inside_of = this.__can_be_inside.length > 1 ? `one of this: ${this.__can_be_inside.join()}` : `of ${this.__can_be_inside[0]}`
            if (!(fatherBlock)) {
                throw new SyntaxError(`${this.__type} can't be alone, it must be inside ${must_be_inside_of}. On line ${parseInt(n_line) + 1}`)
            } //unless
            if (this.can_be_inside.indexOffatherBlock.type == -1) {
                throw new SyntaxError(`${this.__type} can't be inside ${fatherBlock.type}, it must be inside ${must_be_inside_of}. On line ${parseInt(n_line) + 1}`)
                /**
                 *@method isClass
                 *@retuns boolean
                 */
            } //if
        } //if
        return this;
    } // method //method
    isClass() {
        return this.__isClass.apply(this, arguments);
    }
    __isClass() {
        return this.__type === Block.CLASS_BLOCK_TYPE_NAME
        /**
         *Returns if is a valid codeblock name
         *@method validName
         *@param String name
         *@param RegExp regex
         *@param String regexName
         */
        return this;
    } // method //method
    validName() {
        return this.__validName.apply(this, arguments);
    }
    __validName(name, regex, regexName) {
        var error_name = `Bad programming pratice error on line ${n_line * 1 + 1}.`
        var regexNameOf = {
            _const: {
                _retex: /^[A-Z_]+((\d)|([A-Z0-9]+))*$/,
                _name: 'SNAKE_CASE_ALL_UPERCASE.'
            }
        }
        if (name == undefined) {
            throw new SyntaxError(`${error_name} Names can't be undefined. Please fix it before trying compile again.`);
        } //if
        if (name.length < 3) {
            throw new SyntaxError(`${error_name} Names can't have less than 3 chars. Please fix it before trying compile again.`);
        } //if
        if (js_reserved_words.indexOfname != -1 || methodic_reserved_words.indexOfname != -1) {
            throw new SyntaxError(`${error_name} Invalid name, ${name} is a reserved JS or MTHS word. Please fix it before trying compile again.`);
        } //if
        if (!(name.matchregex)) {
            throw new SyntaxError(`${error_name} ${this.__type} must have name written on ${regexName}`);
        } //unless
        return name;
        /**
         *@param String params
         */
        return this;
    } // method //method
    setParams() {
        return this.__setParams.apply(this, arguments);
    }
    __setParams(params) {
        return params.replaceAll(',', ', ');
        return this;
    } // method //method

    //private
    /**
     *@attr string
     */

    /**
     *@attr string
     */
    get type() {
        throw new Error("type is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set type(val) {
        throw new Error("type is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr boolean
     */
    get block_props() {
        throw new Error("block_props is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set block_props(val) {
        throw new Error("block_props is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr boolean
     */
    get can_be_child() {
        throw new Error("can_be_child is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set can_be_child(val) {
        throw new Error("can_be_child is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr array
     */
    get must_be_child() {
        throw new Error("must_be_child is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set must_be_child(val) {
        throw new Error("must_be_child is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr string
     */
    get can_be_inside() {
        throw new Error("can_be_inside is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set can_be_inside(val) {
        throw new Error("can_be_inside is a private attribute, it's value can't be changed outside it's class");
    }

    /**
     *@attr string
     */
    get close_code() {
        throw new Error("close_code is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set close_code(val) {
        throw new Error("close_code is a private attribute, it's value can't be changed outside it's class");
    }

    get has_params() {
        throw new Error("has_params is a private attribute, it's value can't be get outside it's class");
        return undefined;
    }
    set has_params(val) {
        throw new Error("has_params is a private attribute, it's value can't be changed outside it's class");
    }

    constructor() {
        super();
        this.__set_defaults();

        if (new.target === Block) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    __set_defaults() {
        this.__type = null;
        this.__block_props = null;
        this.__can_be_child = null;
        this.__must_be_child = null;
        this.__can_be_inside = null;
        this.__close_code = null;
        this.__has_params = null;
    }
} //class  //class Block
