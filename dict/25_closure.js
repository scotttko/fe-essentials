// 함수 호출 시 1씩 증가하는 숫자를 리턴

let saveNumber = 1; //어디서나 접근가능

function increment() {
  //클로저: 함수 안쪽에서 함수가 만들어질때 그 함수 바깥함수의 변수에 접근하게 되면
  //접근한 변수를 클로저라는 공간에 저장, 호출되었을 때 저장된 값을 유지하면서 반환
  let saveNumber = 1;

  return function () {
    return saveNumber++;
  };
}

const inc = increment();
console.log(inc());
console.log(inc());

saveNumber = 200; //saveNumber 보호 안됨

console.log(inc());

//클로저의 장점
// 함수가 리턴되어도 특정 값을 보호하면서 계속 사용할 수 있다
// 보호했기 때문에 바깥에서는 해당 변수에 접근할수 있는 방법이 없다 => 내부 함수에서만 접근할수 있다

//타입스크립트에서는 private을 통해 값을 보호할수 있음
