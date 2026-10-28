export const GALLERY_BATCH_SIZES = Object.freeze([9, 12, 12, 12]);
export const normalizeKitchenValue = value => String(value ?? '').trim().toLowerCase();

export function filterKitchenDesigns(designs, state) {
  return designs.filter(item =>
    (state.layout === 'all' || normalizeKitchenValue(item.layout) === normalizeKitchenValue(state.layout)) &&
    (state.category === 'all' || normalizeKitchenValue(item.category) === normalizeKitchenValue(state.category)) &&
    (state.series === 'all' || normalizeKitchenValue(item.series) === normalizeKitchenValue(state.series))
  ).sort((a, b) => Number(a.id) - Number(b.id));
}

export function partitionKitchenDesigns(items) {
  let start = 0;
  const groups = GALLERY_BATCH_SIZES.map(size => {
    const group = items.slice(start, start + size);
    start += size;
    return group;
  });
  groups.push(items.slice(start));
  return groups;
}

export function getKitchenSpecification(item, ...labels) {
  const specs = Array.isArray(item.specifications) ? item.specifications : [];
  for (const label of labels) {
    const match = specs.find(spec => normalizeKitchenValue(spec.label).replace(/:$/, '') === normalizeKitchenValue(label));
    const value = match?.value ?? item[label];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}