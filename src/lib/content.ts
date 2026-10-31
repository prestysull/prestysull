import {z} from 'astro/zod';
import homeValue from '../content/cms/home.json' with {type: 'json'};
import companyValue from '../content/cms/company.json' with {type: 'json'};
import contactValue from '../content/cms/contact.json' with {type: 'json'};
import loansValue from '../content/cms/loans.json' with {type: 'json'};
import faqValue from '../content/cms/faq.json' with {type: 'json'};
import mediaValue from '../content/cms/media.json' with {type: 'json'};
import videosValue from '../content/cms/videos.json' with {type: 'json'};

const text = z.string().trim().min(1).max(2_000);
const shortText = z.string().trim().min(1).max(300);
const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', 'debe usar HTTPS');
const mediaPath = z.string().refine(
  (value) => /^\/uploads\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value) && !value.includes('..') && !value.includes('//'),
  'debe ser una ruta segura dentro de /uploads/',
);
const optionalMediaPath = z.preprocess((value) => value === '' || value === null ? undefined : value, mediaPath.optional());

export const cmsImageSchema = z.object({
  src: mediaPath,
  alt: shortText,
  label: shortText,
}).strict();

export const cmsVideoSchema = z.object({
  visible: z.boolean(),
  platform: shortText,
  title: shortText,
  description: z.string().trim().max(600).default(''),
  url: httpsUrl,
  thumbnail: optionalMediaPath,
}).strict();

const loanCopySchema = z.object({
  name: shortText,
  audience: shortText,
  title: shortText,
  description: text,
  short: text,
  requirements: z.array(shortText).min(1).max(10),
}).strict();

export const homeSchema = z.object({
  heroEyebrow: shortText,
  heroTrust: shortText,
  loans: z.object({eyebrow: shortText, title: shortText, titleAccent: shortText, description: text, footnote: text}).strict(),
  process: z.object({eyebrow: shortText, title: shortText, titleAccent: shortText, description: text, disclaimer: shortText}).strict(),
  simulator: z.object({eyebrow: shortText, title: shortText, titleAccent: shortText, description: text, button: shortText, privacy: shortText}).strict(),
  about: z.object({eyebrow: shortText, photoLabel: shortText, link: shortText}).strict(),
  faq: z.object({eyebrow: shortText, title: shortText, titleAccent: shortText, description: text, link: shortText}).strict(),
}).strict();

export const companySchema = z.object({
  name: shortText,
  tagline: shortText,
  heroLines: z.tuple([shortText, shortText, shortText]),
  intro: text,
  about: text,
  localTitle: shortText,
  page: z.object({
    eyebrow: shortText,
    title: shortText,
    titleAccent: shortText,
    sectionTitle: shortText,
    sectionTitleAccent: shortText,
    sectionDescription: text,
  }).strict(),
  demo: z.tuple([
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
  ]),
}).strict();

export const contactSchema = z.object({
  phone: z.string().trim().regex(/^[0-9 +().-]{7,20}$/),
  whatsapp: z.string().regex(/^\d{9,15}$/),
  address: shortText,
  street: shortText,
  locality: shortText,
  region: shortText,
  country: z.string().regex(/^[A-Z]{2}$/),
  city: shortText,
  coverage: shortText,
  hours: shortText,
  days: shortText,
  facebook: httpsUrl,
  tiktok: httpsUrl,
  map: httpsUrl.refine((value) => {
    const hostname = new URL(value).hostname;
    return hostname === 'maps.app.goo.gl' || hostname === 'www.google.com' || hostname === 'google.com';
  }, 'debe ser un enlace de Google Maps'),
  page: z.object({
    eyebrow: shortText,
    title: shortText,
    titleAccent: shortText,
    intro: text,
    whatsappTitle: shortText,
    hoursTitle: shortText,
    socialTitle: shortText,
    officeLabel: shortText,
    mapsButton: shortText,
    mapNote: text,
  }).strict(),
  band: z.object({
    eyebrow: shortText,
    title: shortText,
    titleAccent: shortText,
    locationTitle: shortText,
    locationLink: shortText,
  }).strict(),
  messages: z.object({general: text, semanal: text, catorcenal: text, simulador: text}).strict(),
}).strict();

export const loansSchema = z.object({
  semanal: loanCopySchema,
  catorcenal: loanCopySchema,
  overview: z.object({eyebrow: shortText, title: shortText, titleAccent: shortText, description: text, simulatorButton: shortText}).strict(),
  detail: z.object({backLink: shortText, requirementsEyebrow: shortText, requirementsTitle: shortText, requirementsTitleAccent: shortText, simulatorLink: shortText, requirementsDisclaimer: text}).strict(),
  process: z.tuple([
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
    z.object({title: shortText, text}).strict(),
  ]),
}).strict();

export const faqSchema = z.object({items: z.array(z.object({q: shortText, a: text}).strict()).max(20)}).strict();
export const mediaSchema = z.object({hero: z.tuple([cmsImageSchema, cmsImageSchema, cmsImageSchema]), about: cmsImageSchema}).strict();
export const videosSchema = z.object({enabled: z.boolean(), title: shortText, intro: text, items: z.array(cmsVideoSchema).max(12)}).strict();

export const sectionSchemas = {
  home: homeSchema,
  company: companySchema,
  contact: contactSchema,
  loans: loansSchema,
  faq: faqSchema,
  media: mediaSchema,
  videos: videosSchema,
};

export type CmsSectionName = keyof typeof sectionSchemas;
export type CmsContent = {[K in CmsSectionName]: z.infer<(typeof sectionSchemas)[K]>};
export type CmsImage = z.infer<typeof cmsImageSchema>;
export type CmsVideo = z.infer<typeof cmsVideoSchema>;

export function selectVisibleVideos(content: CmsContent['videos']): CmsVideo[] {
  return content.enabled ? content.items.filter((item) => item.visible) : [];
}

export function validateCmsSection<K extends CmsSectionName>(name: K, value: unknown): CmsContent[K] {
  const result = sectionSchemas[name].safeParse(value);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`).join('; ');
    throw new Error(`Contenido CMS inválido en ${name}: ${details}`);
  }
  return result.data as CmsContent[K];
}

export const cmsContent: CmsContent = {
  home: validateCmsSection('home', homeValue),
  company: validateCmsSection('company', companyValue),
  contact: validateCmsSection('contact', contactValue),
  loans: validateCmsSection('loans', loansValue),
  faq: validateCmsSection('faq', faqValue),
  media: validateCmsSection('media', mediaValue),
  videos: validateCmsSection('videos', videosValue),
};
