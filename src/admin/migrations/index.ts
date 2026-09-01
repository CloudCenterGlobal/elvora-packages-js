import * as migration_20250410_115503 from './20250410_115503';
import * as migration_20250410_141354 from './20250410_141354';
import * as migration_20250410_143410 from './20250410_143410';
import * as migration_20250410_154933 from './20250410_154933';
import * as migration_20250411_095307 from './20250411_095307';
import * as migration_20250411_144921 from './20250411_144921';
import * as migration_20250603_133335 from './20250603_133335';
import * as migration_20251218_073912 from './20251218_073912';
import * as migration_20260831_195022_forms_referrals from './20260831_195022_forms_referrals';
import * as migration_20260901_121804_forms_callbacks from './20260901_121804_forms_callbacks';
import * as migration_20260901_130036_forms_home_enquiries from './20260901_130036_forms_home_enquiries';

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
    name: '20250411_144921',
  },
  {
    up: migration_20250603_133335.up,
    down: migration_20250603_133335.down,
    name: '20250603_133335',
  },
  {
    up: migration_20251218_073912.up,
    down: migration_20251218_073912.down,
    name: '20251218_073912',
  },
  {
    up: migration_20260831_195022_forms_referrals.up,
    down: migration_20260831_195022_forms_referrals.down,
    name: '20260831_195022_forms_referrals',
  },
  {
    up: migration_20260901_121804_forms_callbacks.up,
    down: migration_20260901_121804_forms_callbacks.down,
    name: '20260901_121804_forms_callbacks',
  },
  {
    up: migration_20260901_130036_forms_home_enquiries.up,
    down: migration_20260901_130036_forms_home_enquiries.down,
    name: '20260901_130036_forms_home_enquiries'
  },
];
