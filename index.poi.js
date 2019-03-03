/**
 *Comentários de múltiplas linhas, documentações
 */
//comentários de linhas simples
//abstract
class Living extends Object {
    constructor() {
        super();
        this.__set_defaults();

        if (new.target === Living) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    __set_defaults() {}
} //class  //class Living
//sempre primeira linha não comentário, se não hover, vai extender classe object
class Animal extends Living {
    /**
     *traits: não existem traits em si, aqui devem ser usadas classes que serão usadas como se fossem traits.
     *A ordem de chamada é a ordem de importancia, ou seja, se "Planets" tiver um método com o nome igual a "Kinds",
     *esse será desconsiderado em favor do método de "Kinds", porque "Kinds" foi chamada primeiro. Caso o método exista na própria classe,
     *ele não será sobrescrito por trait.
     */
    //traits Kinds, Planets, Live
    /**
     *atributos públicos: internamente a única diferença entre os atributos públicos e privados é que
     *atributos públicos a linguagem gera um getter e um setter padrão,
     *e atributo privado, o getter e o setter tem que ser gerados manualmente, como no exemplo abaixo.
     *o transpiler vai sempre renomear todos os atributos como "__nome_do_atributo"
     *constantes devem ser sempre publicas, e a única diferença para outras variáveis é que o seu setter dispara um erro.
     */
    //public
    //getters e setters

    get name() {
        return this.__name
    } //get
    set name(value) {
        this.__name = value
        //valor padrão
    } //set


    //valor padrão, getters e setters
    get height() {
        return this.__height;
    }
    set height(val) {
        this.__height = val;
    }

    get color() {
        return this.__color
    } //get
    set color(value) {
        this.__color = value
        //construtor padrão, se não for setado, será assim: os parametros serão recebidos em ordem que aparecem na classe, e serão setados conforme passados
    } //set

    constructor(name, height, color, foot_number, size) {
        super();
        this.__set_defaults();
        this.__setParamsAsAttrs(name, height, color, foot_number, size)
        super.constructor()
        //se não houver um return, é a mesma coisa que "return this". se não tiver parametro nenhum, parenteses são opcionais
    }
    bla() {
        return this.__bla.apply(this, arguments);
    }
    __bla() {
        print(this.__name)
        //valor padrão de parametro
        return this;
    } // method //method
    blaWorldDefaultParams() {
        return this.__blaWorldDefaultParams.apply(this, arguments);
    }
    __blaWorldDefaultParams(worldILive) {
        worldILive = typeof worldILive !== 'undefined' ? worldILive : "Earth";
        //interpolação de strings, valores com ${valor} e métodos ou códigos com ${código}
        print(`Hello, ${worldILive}, I am ${this.__name}`)
        print(`${ 2 + 2 }`)
        return true
        return this;
    } // method //methodwithdefaultparams
    blaWorld2() {
        return this.__blaWorld2.apply(this, arguments);
    }
    __blaWorld2(worldILive, worldYouLive) {
        print(`Hello, ${worldILive}, I am ${this.__name}`)
        return true
        return this;
    } // method //method

    //private

    get foot_number() {
        return this.__foot_number / 2
    } //get
    set foot_number(value) {
        this.__foot_number * 2
        //totalmente privado, só acessível pelo próprio objeto
    } //set


    get size() {
        throw new Error("size is a private attribute, it's value can't be get outside it's class")
    }
    set size(val) {
        throw new Error("size is a private attribute, it's value can't be changed outside it's class")
    }
    privateMethod() {
        throw new Error('Trying to access a private method privateMethod.');
    }
    __privateMethod(worldILive, worldYouLive) {
        print(`Hello, ${worldILive}, I am ${this.__name}`)
        return true
        return this;
    } // method //method

    //static
    static get KINGDOM() {
        return "Animalia"
    }
    static set KINGDOM(value) {
        throw new Error("KINGDOM is a class constant, and can't have his value changed to " + value)
    }
    //static methods returns null if there's not a return statement
    //const
    static staticMethod() {
        return true
        //fora da classe, algumas coisas mudam
        return null
    } //method

    __set_defaults() {
        this.__name = null;
        this.__height = 125;
        this.__color = "brown";
        this.__foot_number = null;
        this.__size = null;
    }
} //class 
trait(Animal, Kinds, Planets, Live) //class Animal
var x = new Animal('Rex', 120, 'brown', 4, 150)
//tipos primitivos, apenas booleanos, numeros e strings
var y = 123.123,
    z = 'Abc',
    a = false
//instruções de mais de uma linha seguem forma do javascript
y =
    new Animal('Rex', 120, 'brown', 4, 150)
//if e else
if (1 == 2) {
    print(1)
} //if
else if (100 > 200) {
    print(2)
} //elseif
else if (!(1000 < 2000)) {
    print(4)
} //elseunless
else {
    print(3)
} //else
if (!(1 == 2)) {
    print('oi')
    //switch - não usar break, não é necessário.
} //unless
switch (value) {
    case 1:
        print('is 1')
        break; //case
    case 2:
        print('is 2')
        break; //case
    default:
        print('is another')
        /**
         *laços de repetição
         */
        //for classico
        //default
} //switch
for (var index = 0; index <= 100; index += (2)) {
    print(index)
    //foreach & arrays & dictionaries
} //from
list = [1, 2, 3, 4]
dict = {
    abc: 'abc',
    123: '123',
}
for (var index in list) {
    var val = list[index]
    print(`${val} is position ${index} in list`)
} //foreach
for (var index in dict) {
    var val = dict[index]
    print(`${val} is position ${index} in dict`)
    //while
} //foreach
while (cond) {
    print('oi')
    //do while
} //while
do {
    print('oi')

} while (cond);
//functions fora das classes, se não tiver return, retornará null

function test(fistProp, secondProp) {
    secondProp = typeof secondProp !== 'undefined' ? secondProp : false;
    return firstProp * secondProp
    return null;
} // function //functionwithdefaultparams
function trait(_class, ..._traits) {
    for (var _trait of _traits) {
        for (var a of Object.getOwnPropertyNames(_trait.prototype)) {
            if (_class.prototype.hasOwnProperty(a)) {
                continue;
            }
            _class.prototype[a] = _trait.prototype[a];
        }
    }
}