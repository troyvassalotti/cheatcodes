var l = Object.defineProperty;
var b = (n, t, e) => t in n ? l(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var i = (n, t, e) => (b(n, typeof t != "symbol" ? t + "" : t, e), e);
const r = {
  codes: {
    konami: "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a Enter",
    starpower: "7 1 7 0 7 2 7 3 6"
  },
  confettiOptions: {
    disableForReducedMotion: !0,
    spread: 360,
    startVelocity: 30,
    ticks: 60,
    zIndex: 0
  },
  duration: 10,
  packages: {
    confetti: "https://cdn.skypack.dev/canvas-confetti@1.6.0"
  },
  timeLimit: 1e3
};
var d = /* @__PURE__ */ ((n) => (n.Keyboard = "keyboard", n.Gamepad = "gamepad", n))(d || {});
const p = "gamepadconnected", y = "gamepaddisconnected", u = "keydown";
class k {
  constructor(t = r.codes.konami, e = d.Keyboard, a = r.timeLimit, o = r.duration, s = r.confettiOptions) {
    i(this, "pattern");
    i(this, "eventType");
    i(this, "timeLimit");
    i(this, "duration");
    i(this, "confettiOptions");
    i(this, "gamepads", {});
    i(this, "buttonState", {});
    i(this, "entries", []);
    i(this, "lastEntryTime", this.now);
    i(this, "timer", 0);
    this.pattern = t, this.eventType = e, this.timeLimit = a, this.duration = o, this.confettiOptions = s, this.gamepadConnected = this.gamepadConnected.bind(this), this.init = this.init.bind(this);
  }
  get now() {
    return Date.now();
  }
  get currentCode() {
    return this.entries.join(" ");
  }
  get gamepadIndexes() {
    return Object.keys(this.gamepads);
  }
  get connectedGamepads() {
    return navigator.getGamepads();
  }
  checkTime() {
    this.now - this.lastEntryTime > this.timeLimit && (this.entries = []);
  }
  checkCode(t) {
    const { key: e } = t;
    this.entries.push(e), this.lastEntryTime = this.now, this.currentCode === this.pattern && this.loadConfetti();
  }
  gamepadConnected(t) {
    const { gamepad: e } = t;
    console.info(
      "Gamepad connected at index %d: %s. %d buttons, %d axes. Are you ready to rock?",
      e.index,
      e.id,
      e.buttons.length,
      e.axes.length
    ), this.gamepads[e.index] = !0, this.readGamepadValues();
  }
  gamepadDisconnected(t) {
    const { gamepad: e } = t;
    console.info(
      "Gamepad disconnected from index %d: %s",
      e.index,
      e.id
    ), delete this.gamepads[e.index];
  }
  buttonPressed(t) {
    this.checkTime(), this.entries.push(t), this.lastEntryTime = this.now, this.currentCode === this.pattern && this.loadConfetti();
  }
  readGamepadValues() {
    this.gamepadIndexes.forEach((t, e) => {
      if (!t || !this.connectedGamepads || !this.connectedGamepads[e])
        return;
      const { buttons: a } = this.connectedGamepads[e];
      a.forEach((o, s) => {
        o.pressed ? this.buttonState[s] || (this.buttonState[s] = !0, this.buttonPressed(s)) : delete this.buttonState[s];
      });
    }), this.gamepadIndexes.length > 0 && window.requestAnimationFrame(this.readGamepadValues);
  }
  loadConfetti() {
    import(r.packages.confetti).then((t) => {
      const { default: e } = t, a = this.duration * 1e3, o = this.now + a;
      this.timer = window.setInterval(
        () => this.fireConfetti(e, a, o),
        250
      );
    });
  }
  fireConfetti(t, e, a) {
    const o = a - this.now;
    o <= 0 && clearInterval(this.timer);
    const s = 50 * (o / e), c = (m, w) => Math.random() * (w - m) + m, h = () => Math.random() - 0.2, f = {
      particleCount: s,
      origin: {
        x: c(0.1, 0.3),
        y: h()
      }
    }, g = {
      particleCount: s,
      origin: {
        x: c(0.7, 0.9),
        y: h()
      }
    };
    t(Object.assign({}, this.confettiOptions, f)), t(Object.assign({}, this.confettiOptions, g)), this.destroy();
  }
  init(t) {
    this.checkTime(), this.checkCode(t);
  }
  listen() {
    switch (this.eventType) {
      case d.Gamepad:
        window.addEventListener(p, this.gamepadConnected), window.addEventListener(y, this.gamepadDisconnected);
        break;
      case d.Keyboard:
      default:
        document.addEventListener(u, this.init);
        break;
    }
  }
  destroy() {
    switch (this.eventType) {
      case d.Gamepad:
        window.removeEventListener(p, this.gamepadConnected);
        break;
      case d.Keyboard:
      default:
        document.removeEventListener(u, this.init);
        break;
    }
  }
}
export {
  k as default
};
