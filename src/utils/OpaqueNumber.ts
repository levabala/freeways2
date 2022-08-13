export declare class OpaqueNumber<T extends string> extends Number {
  /** This helps typescript distinguish different opaque string types. */
  protected readonly __opaqueNumber: T;
  /** This object is already a string, but calling this makes method
   * makes typescript recognize it as such. */
  valueOf(): number;
}
