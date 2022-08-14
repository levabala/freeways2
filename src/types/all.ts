import { OpaqueNumber } from '../utils/OpaqueNumber';
import { OpaqueString } from '../utils/OpaqueString';

export type Cast<From, To> = (value: From) => To;
export const cast = <From, To>(value: From) => value as unknown as To;

export type Timestamp = OpaqueNumber<'Timestamp'>;
export const toTimestamp = cast as Cast<number, Timestamp>;

export type Duration = OpaqueNumber<'Duration'>;
export const toDuration = cast as Cast<number, Duration>;

export type Coordinate = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Velocity = {
  dx: number;
  dy: number;
};

export type Identified<Id> = {
  id: Id;
};

export type CellId = number;

export type InputId = number;
export type Input = Identified<InputId>;
export type OutputId = number;
export type Output = Identified<OutputId>;

export type TransputId = InputId | OutputId;
export type Transput = Input | Output;

export type TransputTypeInput = 0;
export type TransputTypeOutput = 1;
export type TransputType = TransputTypeInput | TransputTypeOutput;

export const TransputType = {
  Input: 0 as TransputTypeInput,
  Output: 1 as TransputTypeOutput
} as const;

export type CarId = number;
export type Car = Identified<CarId> & {
  inputId: InputId;
  outputId: OutputId;
};

/*
Cell value as number:

0                 0                 0 0 0 0           0 0 0                 0 0 0 0 0 0 0 0 0 0
has input/output  0/1 input/output  input/output id   occupied road levels  car id               

total: 1 + 1 + 4 + 3 + 10 = 19 bits
*/

export const BASE = 0b0_0_0000_000_0000000000;
export const CELL_LENGTH = 19;

export type Room = {
  size: Size;
  timestamp: Timestamp;
  cells: Uint32Array; // 2d array of cells
};
