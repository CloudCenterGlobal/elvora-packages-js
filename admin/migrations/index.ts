import * as migration_20250128_132845 from './20250128_132845';
import * as migration_20250205_121628_job from './20250205_121628_job';
import * as migration_20250404_094920 from './20250404_094920';
import * as migration_20250404_145209 from './20250404_145209';
import * as migration_20250404_163006 from './20250404_163006';
import * as migration_20250408_120827 from './20250408_120827';

export const migrations = [
  {
    up: migration_20250128_132845.up,
    down: migration_20250128_132845.down,
    name: '20250128_132845',
  },
  {
    up: migration_20250205_121628_job.up,
    down: migration_20250205_121628_job.down,
    name: '20250205_121628_job',
  },
  {
    up: migration_20250404_094920.up,
    down: migration_20250404_094920.down,
    name: '20250404_094920',
  },
  {
    up: migration_20250404_145209.up,
    down: migration_20250404_145209.down,
    name: '20250404_145209',
  },
  {
    up: migration_20250404_163006.up,
    down: migration_20250404_163006.down,
    name: '20250404_163006',
  },
  {
    up: migration_20250408_120827.up,
    down: migration_20250408_120827.down,
    name: '20250408_120827'
  },
];
