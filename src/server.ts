import connect from "connect";
import http from "http";
import bodyParser from "body-parser";

interface Options {
  port?: number;
}

const defaultOptions: Options = {
  port: 62556
};

// all state is captured in these two variables
let server: http.Server | null = null;
let spies = new Map();

export function start(startOptions: Options = {}) {
  if (server) {
    throw new Error("Server is already started");
  }

  const options = Object.assign({}, defaultOptions, startOptions);

  var app = connect();
  app.use(bodyParser.json());

  app.use("/track", (req: any, res: any) => {
    console.log("Track detox-jest-spy", req.body);

    const spy = getSpy(req.body.call); // TODO validate req.body
    spy.apply(undefined, req.body.arguments || []);
    res.end();
  });

  server = http.createServer(app);
  server.listen(options.port);
  console.log("Starting detox-jest-spy server", options);
}

export function stop() {
  if (!server) {
    throw new Error("Server is already stopped");
  }
  server.close();
  server = null;
  spies.clear();
}

export function getSpy(name: string) {
  if (!spies.has(name)) {
    spies.set(name, jest.fn());
  }
  return spies.get(name);
}
