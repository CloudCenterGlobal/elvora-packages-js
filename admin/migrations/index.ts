import * as migration_20250410_115503 from './20250410_115503';
import * as migration_20250410_141354 from './20250410_141354';
import * as migration_20250410_143410 from './20250410_143410';
import * as migration_20250410_154933 from './20250410_154933';

export const migrations = [
  {
    up: migration_20250410_115503.up,
    down: migration_20250410_115503.down,
    name: '20250410_115503',
  },
  {
    up: migration_20250410_141354.up,
    down: migration_20250410_141354.down,
    name: '20250410_141354',
  },
  {
    up: migration_20250410_143410.up,
    down: migration_20250410_143410.down,
    name: '20250410_143410',
  },
  {
    up: migration_20250410_154933.up,
    down: migration_20250410_154933.down,
    name: '20250410_154933'
  },
];
