import { configure, track } from "../client";

(global as any).fetch = jest.fn();

describe("Client", () => {
  afterEach(() => {
    (fetch as jest.Mock).mockReset();
  });
  describe("configure", () => {
    test("saves config", () => {
      configure({ server: "https://test-server.com" });
      track("test", []);

      expect(fetch).toBeCalledWith("https://test-server.com/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          call: "test",
          arguments: []
        })
      });
    });
  });
});
