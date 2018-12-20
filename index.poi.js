/*
Comentários de múltiplas linhas, documentações
*/
//comentários de linhas simples
class Animal {
//sempre primeira linha não comentário, se não hover, vai extender classe object
/*
traits: não existem traits em si, aqui devem ser usadas classes que serão usadas como se fossem traits.
As últimas chamadas sempre sobrescrevem os métodos e atributos das anteriores, caso nomes coincidam, e nunca sobrescrevem da classe mãe
*/
/*
atributos públicos: internamente a única diferença entre os atributos públicos e privados é que
atributos públicos a linguagem gera um getter e um setter padrão,
e atributo privado, o getter e o setter tem que ser gerados manualmente, como no exemplo abaixo.
o transpiler vai sempre renomear todos os atributos como "attr_nome_do_atributo"
constantes devem ser sempre publicas, e a única diferença para outras variáveis é que o seu setter dispara um erro.
*/
constructor() {
            
        } } //class //class Animal
//getters e setters
//valor padrão
//valor padrão, getters e setters
//construtor padrão, se não for setado, será assim: os parametros serão recebidos em ordem que aparecem na classe, e serão setados conforme passados
//se não houver um return, é a mesma coisa que "return this". se não tiver parametro nenhum, parenteses são opcionais
//valor padrão de parametro
//interpolação de strings, valores com $val{valor} e métodos ou códigos com $eval{código}
//attr size totalmente privado, só acessível pelo próprio objeto
//fora da classe, algumas coisas mudam
//tipos primitivos, apenas booleanos, numeros e strings
//instruções de mais de uma linha devem ter contrabarra no fim de cada linha, exceto na última
//if e else
//switch - não usar break, não é necessário.
/*
laços de repetição
*/
//for
//foreach & arrays & dictionaries
//while
//do while
//functions fora das classes, se não tiver return, retornará null