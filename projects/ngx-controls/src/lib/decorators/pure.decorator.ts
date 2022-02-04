import { memoize } from "lodash-es";

/**
 * Caches result of the pure function based on provided input parameters.
 *
 * @param keySelector Cache key selector for complex objects.
 * @example (user: User) => user.id
 * @returns Function with cache middleware
 */
export function Pure(keySelector?: (...args: any[]) => any) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    if (typeof descriptor.value !== "function") {
      throw new Error("Pure decorator can be applied only to pure methods");
    }

    descriptor.value = memoize(descriptor.value, keySelector);

    return descriptor;
  };
}
