/*
Comentários de múltiplas linhas, documentações
*/
//comentários de linhas simples
//sempre primeira linha não comentário, se não hover, vai extender classe object
class Animal extends Living {
    /*
    traits: não existem traits em si, aqui devem ser usadas classes que serão usadas como se fossem traits.
    As últimas chamadas sempre sobrescrevem os métodos e atributos das anteriores, caso nomes coincidam, e nunca sobrescrevem da classe mãe
    */
    /*
    atributos públicos: internamente a única diferença entre os atributos públicos e privados é que
    atributos públicos a linguagem gera um getter e um setter padrão,
    e atributo privado, o getter e o setter tem que ser gerados manualmente, como no exemplo abaixo.
    o transpiler vai sempre renomear todos os atributos como "__nome_do_atributo"
    constantes devem ser sempre publicas, e a única diferença para outras variáveis é que o seu setter dispara um erro.
    */
    //public
    //getters e setters
    //valor padrão
    //valor padrão, getters e setters
    //construtor padrão, se não for setado, será assim: os parametros serão recebidos em ordem que aparecem na classe, e serão setados conforme passados
    constructor(name, height, color, foot_number, size) {
        super();
        //se não houver um return, é a mesma coisa que "return this". se não tiver parametro nenhum, parenteses são opcionais
    }
    bla() {
        this.__bla.apply(this, arguments);
    }
    __bla() {
        //valor padrão de parametro
        return this;
    } // method  //method bla
    //interpolação de strings, valores com $val{valor} e métodos ou códigos com $eval{código}
    blaWorld2() {
        this.__blaWorld2.apply(this, arguments);
    }
    __blaWorld2(worldILive, worldYouLive) {
        return this;
    } // method  //method blaWorld2
    //public 
    //private
    //attr size totalmente privado, só acessível pelo próprio objeto
    privateMethod() {
        throw new Error('Trying to access a private method privateMethod.');
    }
    __privateMethod(worldILive, worldYouLive) {
        return this;
    } // method  //method privateMethod
    //private 
    //static
    //static methods returns null if there's not a return statement
    static staticMethod() {
        //fora da classe, algumas coisas mudam
        return null
    } //method staticMethod
    //static 
} //class 
for (var i of Object.getOwnPropertyNames(Kinds.prototype)) {
    if (Animal.prototype.hasOwnProperty(i)) {
        continue;
    }
    Animal.prototype[i] = Kinds.prototype[i];
}
for (var i of Object.getOwnPropertyNames(Planets.prototype)) {
    if (Animal.prototype.hasOwnProperty(i)) {
        continue;
    }
    Animal.prototype[i] = Planets.prototype[i];
}
for (var i of Object.getOwnPropertyNames(Live.prototype)) {
    if (Animal.prototype.hasOwnProperty(i)) {
        continue;
    }
    Animal.prototype[i] = Live.prototype[i];
} //class Animal
//tipos primitivos, apenas booleanos, numeros e strings
//instruções de mais de uma linha seguem forma do javascript
//if e else
//switch - não usar break, não é necessário.
/*
laços de repetição
*/
//for classico
//foreach & arrays & dictionaries
//while
//do while
//functions fora das classes, se não tiver return, retornará null