export function defaultDict<T>(factory: () => T) {
  return new Proxy<Record<string, T>>(
    {},
    {
      get(target, prop: string) {
        if (!(prop in target)) {
          target[prop] = factory()
        }
        return target[prop]
      },
    },
  )
}
