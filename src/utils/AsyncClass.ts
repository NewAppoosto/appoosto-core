import { asyncHandler } from "./asyncHandler";

function AsyncClass() {
  return function (target: any) {
    // Get all methods of the class
    const methods = Object.getOwnPropertyNames(target.prototype);

    methods.forEach((method) => {
      // Skip constructor
      if (method === "constructor") return;

      const descriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        method
      );
      if (descriptor && typeof descriptor.value === "function") {
        // Wrap the method with asyncHandler
        target.prototype[method] = asyncHandler(descriptor.value);
      }
    });

    return target;
  };
}
