export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context = this;

    const later = function (): void {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
}
