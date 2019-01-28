const DEFAULT_OPTIONS = {
  server: "http://localhost:62556"
};

interface Options {
  server: string;
}

export default class Client {
  options: Options = DEFAULT_OPTIONS;
  configure(options: Options) {
    Object.assign(this.options, options);
    return this;
  }

  track(name: string, args: any[] = []) {
    fetch(`${this.options!.server}/track`, {
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

  // singleton
  private static instance?: Client;
  static getInstance() {
    if (!this.instance) {
      this.instance = new Client();
    }
    return this.instance;
  }
}
