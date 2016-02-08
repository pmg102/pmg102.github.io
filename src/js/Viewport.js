export default class Viewport {
  constructor(w, h, player, canvas) {
    this.w = w;
    this.h = h;
    this.player = player;
    this.x = 0;
    this.y = 0;
    this.player0 = {
      x: this.player.x,
      y: this.player.y
    };
  }

  constrainX(dx) {
    const half = canvas.width / 2;
    const _dx = dx + this.player0.x;

    if (_dx < half) {
      return 0;
    }
    else if (_dx > this.w - half) {
      return this.w - canvas.width;
    }
    else {
      return _dx - half;
    }
  }

  constrainY(dy) {
    const half = canvas.height / 2;
    const _dy = dy + this.player0.y;
    
    if (_dy > this.h - half) {
      return this.h - canvas.height;
    }
    else {
      return _dy - half;
    }
  }

  applyTo(ctx) {
    const dx = this.constrainX(this.player.x - this.player0.x);
    const dy = this.constrainY(this.player.y - this.player0.y);

    ctx.translate(-dx, -dy);
  }
}
