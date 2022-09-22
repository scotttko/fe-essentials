const c1 = {
  name: "C1",
  color: "red",
};

const c2 = {
  name: "C2",
  width: 300,
};

const c3 = {
  name: "C3",
  height: 100,
};

// prototype chaining: 모든 객체는 Object라는 최상위 객체를 가리킨다
console.log(c1.toString());
c1.__proto__ = c2;
// c3.__proto__ = c2;

console.log(c1);
console.log(c2);
console.log(c3);

//c1의 width 찾음 -> 없으면 c1의 프로토타입이 가리키는 c2에서 width 찾음
console.log(c1.width);

//활용법: 재활용
// 공통적으로 사용되는 데이터와 메소드는 상위 객체에 포함시키고 프로토타입 연결해서 사용

//함수의 프로토타입
function Foo(name) {
  this.name = name;
  // this.__proto__ = Foo.prototype
}

Foo.prototype.lastName = "WooWa";

const f = new Foo("Sang Won Ko");
console.log(f.name);
console.log(f.lastName);

// => new 연산자를 통해서 함수의 인스턴스 객체를 만들면 프로토타입 연결을 훨씬더 간편하게 할수 있음
