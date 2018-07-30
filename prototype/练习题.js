//原型作业题
function C1(name){
    if(name) this.name = name;
}
function C2(name){
    this.name =name;
}
function C3(name){
    this.name = name ||'join';
}
C1.prototype.name='Tom';
C2.prototype.name='Tom';
C3.prototype.name='Tom';
alert(new C1().name)+(new C2().name)+(new C3().name);
//alert()的返回值是undefined
//先弹出提示框，再计算undefined+undefined+'join'
//得到"NaNjoin"
//变种
var name = 'he';
function C1(name){
    if(name) this.name = name;
}
function C2(name){
    this.name =name;
}
function C3(name){
    this.name = name ||'join';
}
C1.prototype.name='Tom';
C2.prototype.name='Tom';
C3.prototype.name='Tom';
alert(new C1().name)+(new C2().name)+(new C3().name);
//如果有形参存在，函数内在进行形参赋值时，会将形参赋值为undefined
//函数内部在进行变量查找时，会优先找赋值为undefined的形参，而不是去上级作用域中查找
var bb = 1;
function myFun(bb){
    console.log(bb);
}
myFun();

//
function Fun(){
    this.a=0;
    this.b=function(){
        alert(this.a);
    }
}
Fun.prototype={
    b:function(){
        this.a=20;
        alert(this.a);
    },
    c:function(){
        this.a=30;
        alert(this.a)
    }
};
var my_fun=new Fun();
my_fun.b();//"0"
my_fun.c();//"30"
console.log(my_fun.constructor);


//
function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}

Foo.getName();//2
getName();//4
Foo().getName();//1
getName();//1
new Foo.getName();//2
new Foo().getName();//3
new new Foo().getName();//3

//
function Fn1() {
    this.x = 100;
    this.y = 200;
    this.getX = function () {
        console.log(this.x);
    }
}
Fn1.prototype.getX = function () {
    console.log(this.x);
};
Fn1.prototype.getY = function () {
    console.log(this.y);
};
var f1 = new Fn1;
var f2 = new Fn1;
console.log(f1.getX === f2.getX);//false
console.log(f1.getY === f2.getY);//true
console.log(f1.__proto__.getY === Fn1.prototype.getY);//true
console.log(f1.__proto__.getX === f2.getX);//false
console.log(f1.getX === Fn1.prototype.getX);//false
console.log(f1.getY === Fn1.prototype.getY);//true
console.log(f1.constructor);
//f Fn1(){
//     this.x = 100;
//     this.y = 200;
//     this.getX = function(){
//         console.log(this.x);
//     }
// }
console.log(Fn1.prototype.__proto__.constructor);
//f Object(){[native code]}
f1.getX();//100
f1.__proto__.getX();//undefined
f2.getY();//200
Fn1.prototype.getY();//undefined


//
var name = 'zhufengpeixun';
var Fn =function (name){
    var name = 'world';
    this.name = 'zhufeng';
    this.sex =function(){
        this.name = 'hello'
    }
};
var f1 = new Fn(name);
var f2 = new Fn('age');
console.log(f1.name);//'zhufeng'
console.log(f2.age);//undefined
f1.sex();//undefined
console.log(f1);
// {
//     name:'hello',
//     sex:function(){
//             this.name = 'hello';
//         }
// }
console.log(f1.sex === f2.sex);//false
console.log(Fn.name == f1.name);//false

//
function Fn2(){
    var a =1;
    this.a = a;
}
Fn2.prototype.say = function(){
    this.a = 2
};
Fn2.prototype = new Fn2;
console.log(f1);
f1.__proto__.b = function (){
    this.a = 3
};
var f1 = new Fn2;
console.log(f1.a);//1
console.log(f1.prototype);//undefined
console.log(f1.b);//undefined
f1.hasOwnProperty('b');//false
console.log('b' in f1);//true
console.log(f1.constructor == Fn2);//true
console.log(f1.constructor);
// f Fn2(){
//     var a =1;
//     this.a = a;
// }
//

//封装一个方法：实现数组shift方法，要求返回值是返回后的数组，原数组改变


var a =10;
function MyFn(){
    var a = 100;
    var b = 200;
    this.a = a;
}

MyFn.prototype = new MyFn();
var ob = new MyFn();
console.log(ob.b);
console.log(ob.a);
console.log(ob.constructor);



