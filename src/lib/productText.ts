export const normalizeProductName = (name: string) =>
  name.replace(/\bJus Grenadie\b/gi, 'Jus Grenadia');

export const normalizeProductDescription = (description?: string) =>
  description?.replace(/\bGrenadie\b/gi, 'Grenadia');
