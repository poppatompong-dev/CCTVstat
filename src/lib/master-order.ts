export function moveMasterId(ids: number[], activeId: number, overId: number) {
  if (activeId === overId) return [...ids];

  const fromIndex = ids.indexOf(activeId);
  const toIndex = ids.indexOf(overId);
  if (fromIndex < 0 || toIndex < 0) return [...ids];

  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function normalizeMasterOrder(existingIds: number[], orderedIds: number[]) {
  const expectedIds = new Set(existingIds);
  const orderedIdSet = new Set(orderedIds);
  const isCompleteOrder =
    orderedIds.length === existingIds.length &&
    orderedIdSet.size === orderedIds.length &&
    orderedIds.every((id) => expectedIds.has(id));

  if (!isCompleteOrder) {
    throw new Error("Order must contain every master item exactly once");
  }

  return orderedIds.map((id, index) => ({ id, sortOrder: index + 1 }));
}

export function nextMasterSortOrder(sortOrders: number[]) {
  return sortOrders.length ? Math.max(...sortOrders) + 1 : 1;
}

export function hasCanonicalMasterOrder(sortOrders: number[]) {
  return sortOrders.every((sortOrder, index) => sortOrder === index + 1);
}
