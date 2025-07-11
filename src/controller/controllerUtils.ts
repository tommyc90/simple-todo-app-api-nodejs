import { ResourceNotFoundError } from '../error/ResourceNotFoundError.js';

export function assertResourceFound<T>(value: T | null, resourceName?: string): T {
  if (value == null) {
    throw new ResourceNotFoundError(`${resourceName ?? 'Resource'} not found`);
  }
  return value;
}
