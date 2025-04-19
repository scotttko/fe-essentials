// Throttle with Date.now()
// leading execution: 함수 호출 시 먼저 한번 실행
function throttleWithDate<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCalled = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCalled >= delay) {
      lastCalled = now;
      func(...args);
    }
  };
}

//Throttle with setTimeout
// trailing execution: delay 후 첫번째 실행
function throttleWithTimeout<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (!timeoutId) {
      return;
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}
