[![CircleCI](https://circleci.com/gh/8fit/detox-jest-spy.svg?style=svg)](https://circleci.com/gh/8fit/detox-jest-spy)

## The problem

The detox framework allows us to orchestrate the application interaction, and to make [assertions](https://github.com/wix/Detox/blob/master/docs/APIRef.Expect.md) on the state of the interface.

As part of our testing strategy, we sometimes want to test certain critical side effects, such as analytics events being fired correctly as a result of interacting with the interface. Since detox is a greybox testing framework we're able to make some small changes to make this possible.

This library assumes jest as the test runner, but the same thing should work in the same manner for mocha.

## Approach

We use [Detox mocking](https://github.com/wix/Detox/blob/master/docs/Guide.Mocking.md) to replace certain objects or functions with proxies that will track calls and inform the spy server. The spy server parleys this information into calls on jest Mocks, which can then be used for assertions within the Detox test context.

![detox jest spy](https://user-images.githubusercontent.com/520550/51997761-a5c0c580-24b7-11e9-838f-6b3d54ad6f9c.png)

## Usage

The first thing we'll do is use Detox mocking to replace a file with the detox proxy implementation.

For example if you have a file such that

```js
// analytics.js

export default {
  trackAction: () => {
    /* the usual implementation */
  },
  trackScreen: () => {
    /* the usual implementation */
  }
};
```

We'll add a file alongside it with the `.e2e.js` extension.

```js
// analytics.e2e.js
import { getProxy } from "detox-jest-spy/dist/client";

export default getProxy("Analytics");
```

Ensure you add `RN_SRC_EXT` to your build commands as indicated in the docs.

In your detox test file

```js
// myfeature.smoke.spec.js

import { start, stop, getSpy } from "detox-jest-spy";

beforeAll(() => {
  start(); // start the detox-jest-spy server
});

afterAll(() => {
  stop();
});

it("does somethin", async () => {
  // perform the usual detox orchetration
  await this.getElementById("myid").tap();

  getSpy("Analytics.trackAction", { id: "myid" });
});
```
