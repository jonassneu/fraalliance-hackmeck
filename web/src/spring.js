// Springs parameterised the way Apple does it: damping ratio (1 = no overshoot) and response (seconds, not a
// duration). Retargeting keeps the current value and velocity, so every animation is interruptible.
export class Spring {
  constructor(value = 0, { damping = 1, response = 0.4 } = {}) {
    this.x = value;
    this.v = 0;
    this.target = value;
    this.params(damping, response);
  }
  params(damping, response) {
    this.damping = damping;
    this.response = response;
    this.k = (2 * Math.PI / response) ** 2;
    this.c = 4 * Math.PI * damping / response;
    return this;
  }
  to(target, { velocity, damping, response } = {}) {
    if (damping !== undefined || response !== undefined) this.params(damping ?? this.damping, response ?? this.response);
    if (velocity !== undefined) this.v = velocity;
    this.target = target;
    return this;
  }
  jump(value) {
    this.x = this.target = value;
    this.v = 0;
    return this;
  }
  step(dt) {
    let n = Math.max(1, Math.ceil(dt * 240));
    const h = dt / n;
    while (n--) {
      this.v += (-this.k * (this.x - this.target) - this.c * this.v) * h;
      this.x += this.v * h;
    }
    const scale = Math.max(1, Math.abs(this.target));
    if (Math.abs(this.x - this.target) < 1e-4 * scale && Math.abs(this.v) < 1e-3 * scale) this.jump(this.target);
    return this.x;
  }
  get resting() {
    return this.x === this.target && this.v === 0;
  }
}

// X, Y and Z as independent springs (a single spring on a 3D distance desyncs the axes)
export class Spring3 {
  constructor(opts) {
    this.s = [new Spring(0, opts), new Spring(0, opts), new Spring(0, opts)];
  }
  jump(v) {
    this.s[0].jump(v.x); this.s[1].jump(v.y); this.s[2].jump(v.z);
    return this;
  }
  to(v, opts) {
    this.s[0].to(v.x, opts); this.s[1].to(v.y, opts); this.s[2].to(v.z, opts);
    return this;
  }
  step(dt, out) {
    out.set(this.s[0].step(dt), this.s[1].step(dt), this.s[2].step(dt));
    return out;
  }
  get resting() {
    return this.s.every(s => s.resting);
  }
}

// where a flick comes to rest (Apple's scroll-deceleration projection), velocity in px/s
export const project = (velocity, rate = 0.998) => (velocity / 1000) * rate / (1 - rate);

// progressive resistance past a boundary
export const rubberband = (overshoot, dimension, c = 0.55) => (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
