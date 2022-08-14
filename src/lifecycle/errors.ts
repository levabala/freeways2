import { ValueOf } from '../utils';
import { createEnum } from '../utils/createEnum';

export const ErrorLifecycle = createEnum([
  'ERROR_ALREADY_HAS_TRANSPUT_OR_OUTPUT',
  'ERROR_ALREADY_HAS_NO_TRANSPUT_OR_OUTPUT',
  'ERROR_TRANSPUT_ID_IS_TOO_BIG',
  'ERROR_INVALID_COORD',
  'ERROR_TOO_HIGH_ROAD_LEVEL',
  'ERROR_ROAD_ALREADY_PLACED'
] as const);

export type ErrorLifecycleMap = typeof ErrorLifecycle;
export type ErrorLifecycle = ValueOf<ErrorLifecycleMap>;
