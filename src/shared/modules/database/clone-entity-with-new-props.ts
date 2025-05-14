export function cloneEntityWithNewProps<T>(entity: T, attributes: Partial<T>): T {
  return Object.assign(
    new (entity as any).constructor(),
    entity,
    Object.fromEntries(Object.entries(attributes).filter(([_, value]) => value !== undefined)),
  );
}
