function getYesterdayDate(): string {
    const today: Date = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
}

type DebounceFunction<T extends (...args: unknown[]) => void> = (...args: Parameters<T>) => void;

const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): DebounceFunction<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
};

export default debounce;


export { getYesterdayDate, debounce };