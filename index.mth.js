/**
 *Comentários de múltiplas linhas, documentações
 */
//comentários de linhas simples
class Colour extends Object { //public
    echoColour() {
        return this.__echoColour.apply(this, arguments);
    }
    __echoColour() {
        echo(this.__colour)
        return this;
    } // method //method

    //static
    static get DEFAULT_COLOUR() {
        return "#FFF"
    }
    static set DEFAULT_COLOUR(value) {
        throw new Error("DEFAULT_COLOUR is a class constant, and can't have his value changed to " + value)
    }
    //const
    static getDefaultColour() {
        return Colour.DEFAULT_COLOUR
        return null
    } //method

    //private

    /**
     *Shape class, parent abstract class
     */
    get colour() {
        throw new Error("colour is a private attribute, it's value can't be get outside it's class")
    }
    set colour(val) {
        throw new Error("colour is a private attribute, it's value can't be changed outside it's class")
    }

    constructor() {
        super();
        this.__set_defaults();

    }
    __set_defaults() {
        this.__colour = null;
    }
} //class  //class Colour
//abstract
class Shape extends Object {
    //public
    /**
     *@attribute area
     */

    /**
     *echos area
     */
    get area() {
        return this.__area;
    }
    set area(val) {
        this.__area = val;
    }
    echoArea() {
        return this.__echoArea.apply(this, arguments);
    }
    __echoArea() {
        echo(this.__area)
        return this;
    } // method //method

    constructor() {
        super();
        this.__set_defaults();

        if (new.target === Shape) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    __set_defaults() {
        this.__area = 0;
    }
} //class  //class Shape
class Circle extends Shape {
    //traits Colour
    //public

    get area() {
        return (this.__radius ** 2) * Math.PI
    } //get
    set area(val) {
        this.__area = val;
    }
    constructor(radius) {
        super();
        this.__set_defaults();
        this.__radius = radius
    }

    //private

    get radius() {
        throw new Error("radius is a private attribute, it's value can't be get outside it's class")
    }
    set radius(val) {
        throw new Error("radius is a private attribute, it's value can't be changed outside it's class")
    }

    __set_defaults() {
        this.__area = null;
        this.__radius = 0;
    }
} //class 
trait(Circle, Colour) //class Circle
class Rectangle extends Shape {
    //traits Colour
    //public
    constructor(width, height) {
        super();
        this.__set_defaults();
        this.__width = width
        this.__height = height
    }

    //private

    get area() {
        return this.__width * this.__height
    } //get
    set area(val) {
        throw new Error("area is a private attribute, it's value can't be changed outside it's class")
    }

    get width() {
        return this.__width
    } //get
    set width(width) {
        this.__width = width
    } //set


    get height() {
        return this.__height
    } //get
    set height(height) {
        this.__height = height
    } //set


    __set_defaults() {
        this.__area = null;
        this.__width = 0;
        this.__height = 0;
    }
} //class 
trait(Rectangle, Colour) //class Rectangle
class Square extends Rectangle {
    //traits Colour
    //public
    constructor(side) {
        super();
        this.__set_defaults();
        this.__width = this.__height = side
    }

    __set_defaults() {}
} //class 
trait(Square, Colour) //class Square
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
//abstract
class Kinds extends Object {
    //public
    helloWorld() {
        return this.__helloWorld.apply(this, arguments);
    }
    __helloWorld() {
        echo('Hello World')
        return this;
    } // method //method

    constructor() {
        super();
        this.__set_defaults();

        if (new.target === Kinds) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    __set_defaults() {}
} //class  //class Kinds
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
        super.constructor()
        this.__setParamsAsAttrs(name, height, color, foot_number, size)
        //se não houver um return, é a mesma coisa que "return this". se não tiver parametro nenhum, parenteses são opcionais
    }
    bla() {
        return this.__bla.apply(this, arguments);
    }
    __bla() {
        echo(this.__name)
        //valor padrão de parametro
        return this;
    } // method //method
    blaWorldDefaultParams() {
        return this.__blaWorldDefaultParams.apply(this, arguments);
    }
    __blaWorldDefaultParams(worldILive) {
        worldILive = typeof worldILive !== 'undefined' ? worldILive : "Earth";
        //interpolação de strings, valores com ${valor} e métodos ou códigos com ${código}
        echo(`Hello, ${worldILive}, I am ${this.__name}`)
        echo(`${ 2 + 2 }`)
        return true
        return this;
    } // method //methodwithdefaultparams
    blaWorld2() {
        return this.__blaWorld2.apply(this, arguments);
    }
    __blaWorld2(worldILive, worldYouLive) {
        echo(`Hello, ${worldILive}, I am ${this.__name}`)
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
        echo(`Hello, ${worldILive}, I am ${this.__name}`)
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
    echo(1)
} //if
else if (100 > 200) {
    echo(2)
} //elseif
else if (!(1000 < 2000)) {
    echo(4)
} //elseunless
else {
    echo(3)
} //else
if (!(1 == 2)) {
    echo('oi')
    //switch - não usar break, não é necessário.
} //unless
switch (value) {
    case 1:
        echo('is 1')
        break; //case
    case 2:
        echo('is 2')
        break; //case
    default:
        echo('is another')
        /**
         *laços de repetição
         */
        //for classico
        //default
} //switch
for (var index = 0; index <= 100; index += (2)) {
    echo(index)
    //foreach & arrays & dictionaries
} //from
list = [1, 2, 3, 4]
dict = {
    abc: 'abc',
    123: '123',
}
for (var index in list) {
    var val = list[index]
    echo(`${val} is position ${index} in list`)
} //foreach
for (var index in dict) {
    var val = dict[index]
    echo(`${val} is position ${index} in dict`)
    //while
} //foreach
while (cond) {
    echo('oi')
    //do while
} //while
do {
    echo('oi')

} while (cond);
//functions fora das classes, se não tiver return, retornará null

function test(firstProp, secondProp) {
    secondProp = typeof secondProp !== 'undefined' ? secondProp : 1;
    return firstProp * secondProp
    return null;
} // function //functionwithdefaultparams
try {
    echo('hello')
} catch (exp) {
    if (exp instanceof TypeError) {
        echo('TypeError')
    } else
    if (exp instanceof ExampleExeption) {
        echo('ExampleExeption')
    } else {
        echo('Any other exeption')
    }
} finally {
    echo('finally')
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