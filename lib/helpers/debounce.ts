// debounce.ts
/*
  @param : fn => the function to convert
  @param : time => the time delay for debounce
*/
export const debounce = (fn: (...args: any) => any, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
