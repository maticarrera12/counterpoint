export const PROJECT_TYPES = [
  { value: 'landing', label: 'Landing page' },
  { value: 'institucional', label: 'Sitio institucional' },
  { value: 'rediseno', label: 'Rediseño web' },
  { value: 'no-se', label: 'No estoy seguro' },
] as const;

export const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((o) => o.value) as [
  (typeof PROJECT_TYPES)[number]['value'],
  ...(typeof PROJECT_TYPES)[number]['value'][],
];
