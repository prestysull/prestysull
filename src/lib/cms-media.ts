import {pathUrl} from './links.ts';

export function cmsAssetUrl(path: string): string {
  if (!/^\/uploads\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(path) || path.includes('..') || path.includes('//')) {
    throw new Error('La imagen debe estar dentro de /uploads/');
  }
  return pathUrl(path);
}
