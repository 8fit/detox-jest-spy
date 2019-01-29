import { start, stop, getSpy } from "../server";
import fetch from "node-fetch";

describe("Server", () => {
  describe("state", () => {
    it("does not start twice", () => {
      expect(() => {
        start();
        start();
      }).toThrow();
      stop();
    });

    it("does not stop twice", () => {
      expect(() => {
        stop();
      }).toThrow();
    });

    it("getSpy is not available if the server is not started", () => {
      expect(() => {
        getSpy("foo");
      }).toThrow();

      start();
      expect(() => {
        getSpy("foo");
      }).not.toThrow();

      stop();
    });
  });

  describe("/track", () => {
    beforeAll(() => {
      start();
    });

    afterAll(() => {
      stop();
    });

    it("proxies calls to the jest mocks", async () => {
      const spy = getSpy("test");

      await fetch("http://localhost:62556/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          call: "test",
          arguments: [1, "2", { obj: 3 }]
        })
      });

      expect(spy).toBeCalledWith(1, "2", { obj: 3 });
    });
  });
});
