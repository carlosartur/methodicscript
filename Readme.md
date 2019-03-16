# methodicscript

A language that transpiles to JS. It's goal is make JS OO code more easy to do and to organize.

## Inspiration
It's based on Typescript, Coffescript, JavaScript(version ECMASCRIPT 6), Python, Ruby and PHP. My goal doing this transpiler is study REGEX, how transpillers work, and JS to node.js, and make a more simplier way of doing class-oriented code best pratices to run inside node.js or browsers. 

## Examples
1. Comments
```coffeescript
#one-line comment

###
Multi-line comment
###
```
2. Classes, attributes, methods and visibilities.

    a. Classes can be abstract
    
    b. Methods are defined with the keyword "method"
    
    c. Attributes are defined with the keyword "attr"
    
    d. Attributes are a code block, and it's getters and setters must be inside it.
    
    e. You can make methods as getters and setters outside attr code block, but you must to name it properly by yourself.
    
    f. Class, const, attr and methods names must have more than 3 chars. Constants must have it's name written in ALL_UPPERCASE_SNAKECASE, classes with UpperCaseLeadingCamelCase, attrs with all_lowercase_snakecase and methods with lowerCaseLeadingCamelCase.
    
    g. Public and private methods outside getters and setters, return object instance ("return this") by default.
    Static methods returns null by defult. There's no "return void" methods. A method always returns something, even null.

    h. Traits is a way of importing methods from another classes, emulating multiple inheritance. Constructors are never imported from traits, neither already existing methods and attributes.

    i. Interfaces do not yet exist. Can or not be implemented in future versions.


```coffeescript
class Colour:
    public:
        method echoColour:
            echo(this.colour)
    static:
        const DEFAULT_COLOUR = "#FFF"
        method getDefaultColour:
            return Colour.DEFAULT_COLOUR
    private:
        attr colour


###
Shape class, parent abstract class
###
class Shape:
    abstract
    public:
        ###
        @attribute area
        ###
        attr area = 0
        
        ###
        echos area
        ###
        method echoArea:
            echo(this.area)
            
class Circle:
    extends Shape
    traits Colour
    public:
        attr area:
            get: method
                return (this.radius ** 2) * Math.PI 
        method constructor(radius):
            this.radius = radius
        
    private:
        attr radius = 0

class Rectangle:
    extends Shape
    traits Colour
    public:
        method constructor(width, height):
            this.width = width
            this.height = height
    private:
        attr area:
            get: method
                return this.width * this.height
        attr width = 0:
            get: method
                return this.width
            set: method(width)
                this.width = width
        attr height = 0:
            get: method
                return this.height
            set: method(height)
                this.height = height

class Square:
    extends Rectangle
    traits Colour
    public:
        method constructor(side):
            this.width = this.height = side
```

3. Conditionals
```coffeescript
#if, else, unless and elseunless
if 1 == 2:
    echo(1)
elseif 100 > 200:
    echo(2)
elseunless 1000 < 2000:
    echo(4)
else:
    echo(3)

unless 1 == 2:
    echo('Hello')

#switch - "break" is not necessary
switch value:
    case 1:
        echo('is 1')
    case 2:
        echo('is 2')
    default:
        echo('is another')
```

4. Loops
```coffeescript
list = [1, 2, 3, 4]
dict = {
    abc:  'abc',
    123: '123',
}
#classic for
from index = 0 to 100 step 2:
    echo(index)
    
for index in list as val:
    echo(`${val} is position ${index} in list`)

for index in dict as val:
    echo(`${val} is position ${index} in dict`)

#while
index = 0
while index < 100:
    echo('Hello while')
    index++
    
#do-while equivalent
repeat:
    echo('Hello')
    index--
while index > 0:
```

5. Error handling
```coffeescript
try:
    echo('hello')
catch exp:
    is TypeError:
        echo('TypeError')
    is ExampleExeption:
        echo('ExampleExeption')
    another:
        echo('Any other exeption')
finally:
    echo('finally')
```

6. Functions outside classes
```coffeescript
function test(firstProp, secondProp = 1):
    return firstProp * secondProp
```
