import {cmsContent} from '../lib/content.ts';

export const loans = {
  semanal: {
    ...cmsContent.loans.semanal,
    days: 7, maxInstallments: 8, icon: 'store',
  },
  catorcenal: {
    ...cmsContent.loans.catorcenal,
    days: 14, maxInstallments: 4, icon: 'briefcase',
  },
} as const;
export type LoanMode = keyof typeof loans;
const processIcons = ['chat', 'search', 'sliders', 'chart', 'document', 'pin'] as const;
export const processSteps = cmsContent.loans.process.map((step, index) => ({...step, icon: processIcons[index]}));
