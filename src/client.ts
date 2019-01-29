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
