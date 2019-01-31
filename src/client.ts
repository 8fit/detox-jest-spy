import { Platform } from "react-native";
interface Options {
  server?: string;
}
const DEFAULT_OPTIONS: Options = {
  server: Platform.select({
    ios: "http://localhost:62556",
    android: "http://10.0.2.2:62556"
  })
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
      get: (target, prop) => {
        return (...args: any[]) => {
          track(`${name}.${prop.toString()}`, args);
        };
      }
    }
  ) as any;
}
