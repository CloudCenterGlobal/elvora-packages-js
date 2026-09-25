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
import * as migration_20260910_074416_forms_property_partners from './20260910_074416_forms_property_partners';
import * as migration_20260922_082455_payload_3_90_upgrade from './20260922_082455_payload_3_90_upgrade';
import * as migration_20260922_135007_blogs_eyebrow_optional_author_drop_tags from './20260922_135007_blogs_eyebrow_optional_author_drop_tags';
import * as migration_20260922_135441_blogs_add_gallery from './20260922_135441_blogs_add_gallery';
import * as migration_20260924_122358_blog_images_add_blur_data from './20260924_122358_blog_images_add_blur_data';
import * as migration_20260925_112552_homepage_settings_global from './20260925_112552_homepage_settings_global';

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
    up: migration_20260910_074416_forms_property_partners.up,
    down: migration_20260910_074416_forms_property_partners.down,
    name: '20260910_074416_forms_property_partners',
  },
  {
    up: migration_20260922_082455_payload_3_90_upgrade.up,
    down: migration_20260922_082455_payload_3_90_upgrade.down,
    name: '20260922_082455_payload_3_90_upgrade',
  },
  {
    up: migration_20260922_135007_blogs_eyebrow_optional_author_drop_tags.up,
    down: migration_20260922_135007_blogs_eyebrow_optional_author_drop_tags.down,
    name: '20260922_135007_blogs_eyebrow_optional_author_drop_tags',
  },
  {
    up: migration_20260922_135441_blogs_add_gallery.up,
    down: migration_20260922_135441_blogs_add_gallery.down,
    name: '20260922_135441_blogs_add_gallery',
  },
  {
    up: migration_20260924_122358_blog_images_add_blur_data.up,
    down: migration_20260924_122358_blog_images_add_blur_data.down,
    name: '20260924_122358_blog_images_add_blur_data',
  },
  {
    up: migration_20260925_112552_homepage_settings_global.up,
    down: migration_20260925_112552_homepage_settings_global.down,
    name: '20260925_112552_homepage_settings_global'
  },
];
