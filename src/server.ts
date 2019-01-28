import connect from "connect";
import http from "http";
import bodyParser from "body-parser";

interface Options {
  port: number;
}

const defaultOptions: Options = {
  port: 62556
};

export default class DetoxJestSpy {
  options = defaultOptions;
  server?: http.Server;

  configure(options: Options) {
    this.options = Object.assign(this.options, options);
    return this;
  }

  startServer() {
    var app = connect();
    app.use(bodyParser.json());

    app.use("/track", (req: any, res: any) => {
      console.log("Track detox-jest-spy", req.body);

      const spy = this.getSpy(req.body.call); // TODO validate req.body
      spy.apply(undefined, req.body.arguments || []);
      res.end();
    });

    this.server = http.createServer(app);
    this.server.listen(this.options!.port);
    console.log("Starting detox-jest-spy server", this.options);
    return this;
  }

  closeServer() {
    console.log("Stopping detox-jest-spy server");
    this.server!.close();
  }

  private spies = new Map();
  getSpy(name: string) {
    if (!this.spies.has(name)) {
      this.spies.set(name, jest.fn());
    }
    return this.spies.get(name);
  }

  // singleton
  private static instance?: DetoxJestSpy;
  static getInstance() {
    if (!this.instance) {
      this.instance = new DetoxJestSpy();
    }
    return this.instance;
  }
}
