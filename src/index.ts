type EagerValue<T, P = never> = T extends (...args: infer A) => infer R
  ? (...args: A) => EagerValue<R>
  : T extends null
  ? EagerValue<NonNullable<T>, null>
  : T extends undefined
  ? EagerValue<NonNullable<T>, undefined>
  : {
      [key in Exclude<keyof T, 'then' | 'catch' | 'finally'>]: EagerValue<
        T[key]
      >
    } & Promise<T | P>

export function eager<T>(data: Promise<T>): EagerValue<T> {
  return new Proxy(() => data, {
    get(target, prop): any {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return (...args: any) => (target()[prop] as Function)(...args)
      }

      return eager<unknown>(
        target().then((data: any) => {
          if (data === null || typeof data === 'undefined') {
            return undefined
          }

          if (typeof data[prop] === 'function') {
            return (...args: any) => data[prop](...args)
          }

          return data[prop]
        }),
      )
    },
    apply(target, _thisArg, argArray) {
      return eager<unknown>(target().then((method: any) => method(...argArray)))
    },
  }) as EagerValue<T>
}