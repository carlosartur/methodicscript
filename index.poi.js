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

    get name() {} //get
    set name(value) {
        //valor padrão
    } //set


    //valor padrão, getters e setters
    get height() {
        return this.__height;
    }
    set height(val) {
        this.__height = val;
    }

    get color() {} //get
    set color(value) {
        //construtor padrão, se não for setado, será assim: os parametros serão recebidos em ordem que aparecem na classe, e serão setados conforme passados
    } //set

    //se não houver um return, é a mesma coisa que "return this". se não tiver parametro nenhum, parenteses são opcionais
    //valor padrão de parametro
    //interpolação de strings, valores com ${valor} e métodos ou códigos com ${código}

    //private

    get foot_number() {} //get
    set foot_number(value) {
        //totalmente privado, só acessível pelo próprio objeto
    } //set


    get size() {
        throw new Error("size is a private attribute, it's value can't be get outside it's class")
    }
    set size(val) {
        throw new Error("size is a private attribute, it's value can't be changed outside it's class")
    }

    //static
    static get KINGDOM() {
        return "Animalia"
    }
    static set KINGDOM(value) {
        throw new Error("KINGDOM is a class constant, and can't have his value changed to " + value)
    }
    //static methods returns null if there's not a return statement
    //const
    //fora da classe, algumas coisas mudam

    constructor() {
        super();
        this.__set_defaults();

    }
    __set_defaults() {
        this.__name = null;
        this.__height = 125;
        this.__color = "brown";
        this.__foot_number = null;
        this.__size = null;
    }
} //class 
trait(Animal, Kinds, Planets, Live) //class Animal
//tipos primitivos, apenas booleanos, numeros e strings
//instruções de mais de uma linha seguem forma do javascript
//if e else
if (1 == 2) {} //if
else if (100 > 200) {} //elseif
else if (!(1000 < 2000)) {} //elseunless
else {} //else
if (!(1 == 2)) {
    //switch - não usar break, não é necessário.
} //unless
switch (value) {
    case 1:
        break; //case
    case 2:
        break; //case
    default:
        /**
         *laços de repetição
         */
        //for classico
        //default
} //switch

//foreach & arrays & dictionaries
} //from
//while
//do while
//functions fora das classes, se não tiver return, retornará null
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