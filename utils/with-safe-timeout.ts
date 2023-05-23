/**
 * This function will ensure that the promise finishes before or at specified
 * ms.
 * @param request - given promise to race against
 * @param ms - milliseconds to timeout
 * @returns
 */
export const withSafeTimeout = <T>(request: PromiseLike<T>, ms: number) => {
  return Promise.race([
    new Promise<T>((resolve, reject) => {
      setTimeout(() => reject(), ms);
    }),
    request,
  ]);
};
