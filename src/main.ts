console.log('this is freeways2!');

import { sum } from './lifecycle/all';
import { toDuration, toTimestamp } from './types';

console.log(sum(toTimestamp(1), toDuration(2)));
