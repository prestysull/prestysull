export const loans = {
  semanal: {
    name: 'Préstamo semanal', audience: 'Para comerciantes y emprendedores',
    title: 'Tu negocio tiene ritmo. Tu préstamo también.',
    description: 'Conoce una alternativa de financiamiento para tu negocio, con pagos cada 7 días y una propuesta según tu evaluación.',
    short: 'Para esa mercadería, herramienta o siguiente paso que tienes en mente.',
    days: 7, maxInstallments: 8, icon: 'store',
    requirements: ['DNI vigente', 'Recibo de servicios', 'Constancia de negocio activo'],
  },
  catorcenal: {
    name: 'Préstamo catorcenal', audience: 'Para trabajadores dependientes',
    title: 'Trabajas por tus metas. Hablemos de tu próximo paso.',
    description: 'Una modalidad para trabajadores dependientes, con pagos cada 14 días. El monto y las condiciones se determinan según tu capacidad de pago.',
    short: 'Una alternativa para tus planes, con pagos cada 14 días.',
    days: 14, maxInstallments: 4, icon: 'briefcase',
    requirements: ['DNI vigente', 'Recibo de servicios (agua, luz o gas)', 'Constancia de ingresos'],
  },
} as const;
export type LoanMode = keyof typeof loans;
export const processSteps = [
  {title:'Conversemos sobre tu meta',text:'Solicita una evaluación por WhatsApp. Cuéntanos qué modalidad te interesa.',icon:'chat'},
  {title:'Revisamos el punto de partida',text:'Prestysull realiza un filtro inicial para continuar con la evaluación.',icon:'search'},
  {title:'Escuchamos lo que necesitas',text:'Si superas el filtro, se consideran el monto, la tasa y el plazo solicitados.',icon:'sliders'},
  {title:'Evaluamos tu capacidad de pago',text:'Se revisa tu capacidad real de pago antes de determinar una propuesta.',icon:'chart'},
  {title:'Definimos una propuesta',text:'El monto y las condiciones se plantean de acuerdo con el resultado de la evaluación.',icon:'document'},
  {title:'Formalizamos en nuestra oficina',text:'Si se aprueba, acudes a la oficina para formalizar y firmar el desembolso.',icon:'pin'},
];
