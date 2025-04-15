import * as migration_20250410_115503 from './20250410_115503';
import * as migration_20250410_141354 from './20250410_141354';
import * as migration_20250410_143410 from './20250410_143410';
import * as migration_20250410_154933 from './20250410_154933';
import * as migration_20250411_095307 from './20250411_095307';
import * as migration_20250411_144921 from './20250411_144921';

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
    name: '20250410_154933',
  },
  {
    up: migration_20250411_095307.up,
    down: migration_20250411_095307.down,
    name: '20250411_095307',
  },
  {
    up: migration_20250411_144921.up,
    down: migration_20250411_144921.down,
    name: '20250411_144921'
  },
];
