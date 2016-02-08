import { timestamp } from './utils';

export default class Animator {
  constructor(canvas, objects, viewport) {
    this.sprites = objects;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewport = viewport;

    this.fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  }

  update(dt) {
    this.sprites.forEach(each => each.update(dt));
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.ctx.restore();
    this.clearCanvas();
    this.ctx.save();
    this.viewport.applyTo(this.ctx);
    this.sprites.forEach(each => each.render(this.ctx, this.dt));
  }

  frame() {
    if (!this.running) return;
    this.fpsmeter.tickStart();
    this.now = timestamp();
    this.update(Math.min(1, (this.now - this.last) / 1000));
    this.render();
    this.last = this.now;
    this.fpsmeter.tick();
    requestAnimationFrame(() => this.frame(), this.canvas);
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.last = this.now = timestamp();
    this.frame();
  }
}
