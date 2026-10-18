export const simulator = {
  minimumCapitalCents: 50000, technicalCapitalLimitCents: 100000000,
  rates: [15, 16, 17, 18, 20], defaultRate: 18, insurancePercent: 1,
  defaultCapital: '500', defaultCount: 4,
  minimumInstallments: null as number | null,
  saturdayIsBusinessDay: null as boolean | null,
  localHolidays: [] as string[],
  warning: 'Simulación referencial. Los montos, tasas, plazos y condiciones finales están sujetos a evaluación y aprobación de Prestysull.',
  installmentNotice: 'El mínimo de cuotas está pendiente de confirmación. Las opciones son escenarios de cálculo, no plazos comerciales aprobados.',
  calendarNotice: 'Fechas referenciales: se cuentan intervalos desde el desembolso y se traslada cada vencimiento no hábil. Falta confirmar si un traslado modifica las cuotas siguientes y la política de sábados.',
};
