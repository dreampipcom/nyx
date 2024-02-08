// debounce.ts
/*
  @param : fn => the function to convert
  @param : time => the time delay for debounce
*/
export const debounce = (fn, delay) => {
  let timer = null

  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}