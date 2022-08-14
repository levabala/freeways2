export function createEnum<T extends ReadonlyArray<string>>(values: T) {
  type E = { [key in T[number]]: key };
  return values.reduce<E>((acc, val) => {
    acc[val] = val;

    return acc;
  }, {} as E);
}
