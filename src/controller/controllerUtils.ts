import { FastifyRequest } from 'fastify';
import { ResourceNotFoundError } from '../error/ResourceNotFoundError.js';
import { ResourceNotOwnedError } from '../error/ResourceNotOwnedError.js';
import { JWTPayload } from './userController.js';

export function assertResourceFound<T>(value: T | null, resourceName?: string): T {
  if (value == null) {
    throw new ResourceNotFoundError(`${resourceName ?? 'Resource'} not found`);
  }
  return value;
}

export function assertResourceOwned(resourceUserId: string, authUserId: string) {
  if (resourceUserId !== authUserId) {
    throw new ResourceNotOwnedError();
  }
}

export function getUserIdFromRequest(request: FastifyRequest): string {
  const jwtUser = request.user as JWTPayload;
  return jwtUser.userId;
}
