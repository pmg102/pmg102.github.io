
export default class Sprite {
  constructor(cfg) {
    this.t = 0;
    this.x = cfg.x || 0;
    this.y = cfg.y || 0;
    this.dx = cfg.dx || 0;
    this.dy = cfg.dy || 0;
    this.ddx = cfg.ddx || 0;
    this.ddy = cfg.ddy || 0;
    this.color = cfg.color || '#fff';
    this.height = cfg.height || 1;
    this.width = cfg.width || 1;
    this.lifetime = cfg.lifetime;
    this.direction = 1;

    Sprite.objects.push(this);

    if (cfg.src) {
      this.img = new Image();
      this.img.src = cfg.src;
    }
  }

  _intersect(other) {
    return !(((this.x + this.width - 1) < other.x) ||
     ((other.x + other.width - 1) < this.x) ||
     ((this.y + this.height - 1) < other.y) ||
     ((other.y + other.height - 1) < this.y));
  }

  update(dt) {
    this.x  = this.x  + (dt * this.dx);
    this.y  = this.y  + (dt * this.dy);
    this.dx = this.dx + (dt * this.ddx);
    this.dy = this.dy + (dt * this.ddy);
    if (this.dx > 0) this.direction = 1;
    else if (this.dx < 0) this.direction = -1;

    this.t += dt;
    if (this.lifetime && this.t > this.lifetime) {
      delete Sprite.objects[Sprite.objects.indexOf(this)];
    }

    Sprite.objects
      .filter(each =>
        this._intersect(each)
      ).forEach(other => {
        this.collideWith(other);
      });
  }

  render(ctx) {
    if (!this.img) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }

    let frame = 1;
    if (this.direction === 1) frame = 2;

    if (this.dx !== 0) {
      const step = this.dy === 0 ? parseInt(this.x / 36) % 2 : 1;
      frame > 1 ? frame+=step : frame-=step;
    }

    ctx.drawImage(this.img,
        12 + (frame * 30), 61, 12, 12,
        this.x, this.y, this.width, this.height
      );
  }

  collideWith(other) {
    // Override in derived class
  }
}

Sprite.objects = [];
