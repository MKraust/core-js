export function HandleErrorDecorator<T, R extends() => T, E extends Error>(handler: (error: E) => void, defaultValueConstructor: R | void) {
  return function (target: object, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await original.apply(this, args)
      } catch (error: unknown) {
        handler(error as E)

        if (defaultValueConstructor) {
          return defaultValueConstructor()
        }
      }

      return null
    }

    return descriptor
  }
}
