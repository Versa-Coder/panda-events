type errType = { error: boolean; message: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallBack = (...args: any) => any;

import { PandaEvents, pandaEvents } from "..";

//jest.setTimeout(50000);
function doTest(ev: PandaEvents) {
  describe(">> Testing pandaEvents", () => {
    const evtIdReg = /^[0-9]+@(.*)/gi;

    const testFn = function (a: number, b: number): number {
      return a + b;
    };

    function errFn() {
      throw { error: true, message: "Hi, this is an error 😜" };
    }

    const ignoreNewListenersList = [
      "onceTest",
      "rmTest",
      "testErrHandler",
      "offTest",
      "testRemoval",
      "testDifferent",
    ];

    test(">> Create listener and emit events (Focused on 'on' method)", (done) => {
      let count = 0;

      ev.on("newListener", (evtName: string, fn: CallBack) => {
        ++count;

        if (ignoreNewListenersList.includes(evtName)) {
          done();
        } else if (evtName === "Test" && testFn === fn) {
          const val = fn(2, 6);
          expect(val === 8).toBeTruthy();
          done();
        } else {
          done({ message: "Event name did not match", evtName, fn, count });
        }
      });

      const evtId = ev.on("Test", testFn);
      expect(evtId).toMatch(evtIdReg);
    });

    test(">> Once method", (done) => {
      const evtId = ev.once("onceTest", (a, b) => {
        if (evtIdReg.test(evtId)) {
          const sum = testFn(a as number, b as number);
          console.log(a, b, sum);
          expect(sum).toBe(6);
          done();
        } else {
          console.log(evtIdReg.test(evtId), evtId);
          done({ message: "Unwanted Event id for once", evtId });
        }
      });

      setTimeout(() => {
        ev.emit("onceTest", 2, 4);
      }, 200);
    });

    test(">> removeListenerById", (done) => {
      const evtId = ev.on("rmTest", () => {
        //TODO removal code here
        done({ message: "Listener still listing after deletion" });
      });

      ev.removeListenerById(evtId);
      ev.emit("rmTest");
      setTimeout(() => {
        done();
      }, 200);
    });

    test(">> Handling errors", (done) => {
      const evtName = "testErrHandler";
      ev.on("error", (error: errType, _evtName: string) => {
        if (_evtName === evtName && error.error && error.message) {
          done();
        } else {
          done({ message: "Failed to detect error", evtName, _evtName, error });
        }
      });

      ev.on(evtName, errFn);
      setTimeout(() => {
        ev.emit(evtName);
      }, 20);
    });

    test(">> Off and removeEventListener", (done) => {
      const evtName = "offTest";

      const fn = () => {
        console.log("Hi");
        done({ message: "Off and removeEventListener did not work properly" });
      };

      ev.on(evtName, fn);
      ev.off(evtName, fn);

      ev.emit(evtName);

      setTimeout(() => {
        done();
      }, 200);
    });

    test(">> Capture removal of event listener", (done) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const fn = function () {};
      const evt = "testRemoval";

      ev.on("removeListener", (evtName: string, listener: CallBack) => {
        if (ignoreNewListenersList.includes(evtName)) {
          done();
        } else if (listener === fn && evtName === evt) {
          done();
        } else {
          done({
            message: "Unable to remove listener",
            listener,
            evtName,
            evt,
            fn: fn.toString(),
          });
        }
      });

      ev.on(evt, fn);
      setTimeout(() => {
        ev.removeEventListener(evt, fn);
      }, 200);
    });
  });
}

doTest(pandaEvents());
doTest(new PandaEvents({ global: false }));
