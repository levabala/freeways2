export type ValueOf<T> = T extends unknown[] ? T[number] : T[keyof T];
