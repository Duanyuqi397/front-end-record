//new

function myNew(){
    const o = new Object();
    const FunctionConstructor = [].shift.call(arguments);//拿到构造函数

    o.__proto__ = FunctionConstructor.prototype;//绑定原型
    const res = FunctionConstructor.apply(o,arguments);
    return typeof res === 'object' ? res : o;
}

function Player(name){
    this.name = name;
}

const p = myNew(Player,"hhhhhh");
console.log(p);

// function Person(name) {
//     this.name = name;
//   }
  
// Person.prototype.constructor = Person

// let p = new Person("123");
// console.log(p.name);
