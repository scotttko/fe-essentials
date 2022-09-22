const person = {
  name: "Sang Won Ko",
  age: 26,
  getAge() {
    return this.age;
  },
};

person.age;
person.getAge(); //getAge의 소유자는 person -> this 접근 가능

const age = person.getAge;
age(); //getAge의 소유자 없음 -> this.age undefined

// 컨텍스트: 실행컨텍스트(기본), 렉시컬 컨텍스트 2가지

// 실행 컨텍스트 (호출하는 맥락)
// 실행 - 어떤 객체의 메소드에 접근한다
// 호출하는 맥락 상 소유자 확인

age.call(person); //call으로 호출하여 컨텍스트 지정 가능

class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
    this.getAge = this.getAge.bind(this); //컨텍스트 고정
  }

  getAge() {
    return this.age;
  }

  getName = () => this.name; //lexical context로 컨텍스트 고정
}

const p1 = new Person("Sang Won Ko", 26);

p1.getAge();

const myAge = p1.getAge;
myAge();

// lexical context (어휘 맥락)
// 코드 자체에서 this 확인 가능 (어휘적으로 고정)
// => arrow function 사용
p1.getName();
const x = p1.getName;
x();
