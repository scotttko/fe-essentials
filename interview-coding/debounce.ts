// Higher-order function version
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Custom hook version
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

// setTimeout은 JS에서 어떻게 동작하는지
// => 1. setTimeout 혹은 비동기 함수는 JS엔진의 콜스택에 우선 쌓이게 되고, Web API 호출
//    2. Web API는 해당 함수를 콜백큐(태스크큐)에 추가
//    3. 이벤트 루프가 콜스택이 비었을때, 태스크 큐에 있는 함수를 콜 스택으로 이동시켜 실행
//    이때, 마이크로 태스크가 우선, 그 다음 매크로 태스크 함수

// setTimeout과 Promise.then()은 어떻게 다르게 동작하는지
// => setTimeout은 매크로태스크,
//    Promise.then()은 마이크로태스크 큐 (우선적으로 실행)

// 매크로테스크 큐와 마이크로태스트 큐의 차이
// => 매크로태스크: setTimeout, setInterval, requestAnimationFrame
//    마이크로태스크: Promise.then(), queueMicrotask, MutationObserver
