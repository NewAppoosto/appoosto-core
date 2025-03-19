import { asyncHandler } from "./asyncHandler";

export function AsyncMethod() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return asyncHandler(originalMethod.bind(this))(...args);
    };

    return descriptor;
  };
}
