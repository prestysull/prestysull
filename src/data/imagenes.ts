import {cmsContent} from '../lib/content.ts';
import {cmsAssetUrl} from '../lib/cms-media.ts';

const hero = cmsContent.media.hero.map((image) => ({...image, src: cmsAssetUrl(image.src)}));
export const images = {
  commerce: cmsAssetUrl(cmsContent.media.about.src),
  commerceAlt: cmsContent.media.about.alt,
  hero,
  logo: 'images/logo-original.jpeg',
};
