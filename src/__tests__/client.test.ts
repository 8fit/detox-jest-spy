import { configure, track, getProxy } from "../client";

(global as any).fetch = jest.fn();

describe("Client", () => {
  afterEach(() => {
    (fetch as jest.Mock).mockReset();
  });
  describe("configure", () => {
    it("saves config", () => {
      configure({ server: "https://test-server.com" });
      track("test", []);

      expect(fetch).toBeCalledWith(
        "https://test-server.com/track",
        expect.objectContaining({})
      );
    });
  });

  describe("track", () => {
    it("calls fetch", () => {
      track("test", [1, "2", { obj: 3 }]);

      expect(fetch).toBeCalledWith(
        expect.stringContaining("http"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            call: "test",
            arguments: [1, "2", { obj: 3 }]
          })
        })
      );
    });
  });
  describe("getProxy", () => {
    it("calls fetch", () => {
      getProxy("Analytics").trackScreen("MyScreen", { id: 4 });

      expect(fetch).toBeCalledWith(
        expect.stringContaining("http"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            call: "Analytics.trackScreen",
            arguments: ["MyScreen", { id: 4 }]
          })
        })
      );
    });
  });
});
