interface Options {
  server?: string;
}
const DEFAULT_OPTIONS: Options = {
  server: "http://localhost:62556"
};

// state
let options = Object.assign({}, DEFAULT_OPTIONS);

export function configure(configOptions: Options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, configOptions);
}

/**
 * Sends a call to the spy server
 * @param name
 * @param args
 */
export function track(name: string, args: any[] = []) {
  return fetch(`${options.server}/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      call: name,
      arguments: args
    })
  });
}

/**
 * Returns a object that will track any method invocations
 * @param name label of the proxy object
 *
 * eg: getProxy('Amplitude').trackScreen('MyScreen')
 */
export function getProxy(name: string) {
  return new Proxy(
    {},
    {
      get: (target, prop, args) => {
        return () => {
          track(`${name}.${prop.toString()}`, args);
        };
      }
    }
  ) as any;
}
