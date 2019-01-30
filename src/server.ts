import connect from "connect";
import http from "http";
import bodyParser from "body-parser";

interface Options {
  port?: number;
}

interface State {
  server: http.Server;
  spies: Map<string, jest.Mock>;
}

const defaultOptions: Options = {
  port: 62556
};

// all state is contained in this variable
let state: State | undefined;

export function start(startOptions: Options = {}) {
  if (state) {
    throw new Error("Server is already started");
  }

  const options = Object.assign({}, defaultOptions, startOptions);

  var app = connect();
  app.use(bodyParser.json());

  app.use("/track", (req: any, res: any) => {
    const spy = getSpy(req.body.call);
    spy.apply(undefined, req.body.arguments || []);
    res.end();
  });

  const server = http.createServer(app);
  server.listen(options.port);

  state = {
    server,
    spies: new Map()
  };

  console.log("Starting detox-jest-spy server", options);
}

export function stop() {
  if (!state) {
    throw new Error("Server is already stopped");
  }
  state.server.close();
  state = undefined;
}

export function getSpy(name: string) {
  if (!state) {
    throw new Error("Server is not started");
  }
  if (!state.spies.has(name)) {
    state.spies.set(name, jest.fn());
  }
  return state.spies.get(name) as jest.Mock;
}
