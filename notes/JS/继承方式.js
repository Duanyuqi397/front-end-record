//原型链继承
function Parent(){
    this.names = ['hhahhahahha','qqqqq'];
}

function Son(){

}

Son.prototype = new Parent();

const child1 = new Son();
child1.names.push('wwww');
console.log(child1.names);//[ 'hhahhahahha', 'qqqqq', 'wwww' ]

const child2 = new Son();
console.log(child2.names);//[ 'hhahhahahha', 'qqqqq', 'wwww' ]

//原型链继承时，引用类型的属性会被所有实例共享，而且创建实例的时候不能传参

//构造函数继承
function Construct(name){
    this.name = name;
}

function Sub(name){
    //重点在这
    Construct.call(this,name);
}

const sub1 = new Sub('1');//1
console.log(sub1.name);

const sub2 = new Sub('2');//2
console.log(sub2.name);

//构造函数继承，避免了引用类型属性被实例共享的缺点，也可以传参，但是方法是在构造函数中定义，每次创建实例都会创建一次方法

//组合继承
function P(name){
    this.name = name;
    this.colors = ['red','yellow'];
}

P.prototype.getName = function(){
    return this.name;
}

function S(name,age){
    P.call(this,name);
    this.age = age;
}

S.prototype = new P();//原型链继承
S.prototype.construct = S;//因为继承之后construct也会使用P的，所以这里需要修改回来

const s1 = new S('qq',18);
s1.colors.push('blue');
console.log(s1.name,s1.age,s1.colors);//qq 18 [ 'red', 'yellow', 'blue' ]

const s2 = new S('ww',23);
console.log(s2.name,s2.age,s2.colors);//ww 23 [ 'red', 'yellow' ]

//集合了两种方式的优点