export const PROJECT_TYPES = [
  { value: 'landing', label: 'Landing page' },
  { value: 'institucional', label: 'Sitio institucional' },
  { value: 'app-web', label: 'Aplicación web a medida' },
  { value: 'no-se', label: 'No estoy seguro' },
] as const;

export const BUDGETS = [
  { value: 'menos-500', label: 'Menos de USD 500' },
  { value: '500-1500', label: 'USD 500–1.500' },
  { value: '1500-4000', label: 'USD 1.500–4.000' },
  { value: 'mas-4000', label: 'Más de USD 4.000' },
  { value: 'a-definir', label: 'A definir' },
] as const;

export const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((o) => o.value) as [
  (typeof PROJECT_TYPES)[number]['value'],
  ...(typeof PROJECT_TYPES)[number]['value'][],
];

export const BUDGET_VALUES = BUDGETS.map((o) => o.value) as [
  (typeof BUDGETS)[number]['value'],
  ...(typeof BUDGETS)[number]['value'][],
];
