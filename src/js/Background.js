import grid from './grid.json';

/*
 * Read map from grid
 * Map sprite indices against kinds of object: background, solid
 * During Animator.update():
   - check for collision between active objects and background by:
     > computing grid cells player intersects
     > checking those cells for solid objects
     > if intersecting, move player out and reset speed*accel to 0
 * During Animator.render():
   - first, render correct section of background
   - next render active objects (player, monsters, coins etc)
 */

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default class Background {
  constructor() {
    this.grid = grid;
    this.img = new Image();
    this.img.src = './images/sprites.png';
    this.img.onload = () => { this.cellSize = this.img.width; };
    this.magFactor = 4;
  }

  getCell(y, x) {
    if (!this.grid[y] || !this.grid[y][x]) return '0';

    return CHARS.indexOf(this.grid[y][x])
  }

  detectCollisions(sprites) {
    let { cellSize, magFactor } = this;
    if (!cellSize) return;
    cellSize *= magFactor;

    sprites.forEach(sprite => {
      // Which cells does this sprite intersect?
      console.log(sprite.x);
      console.log(sprite.x / cellSize);
      console.log(Math.floor(sprite.x / cellSize));

      const minx = Math.floor(sprite.x / cellSize),
        maxx = Math.floor((sprite.x + sprite.width) / cellSize),
        miny = Math.floor(sprite.y / cellSize),
        maxy = Math.floor((sprite.y + sprite.height) / cellSize);
      // Are any of them solid?
      // If so - set location to above/below and speed to 0 and accel to 0 if above
      console.log(minx, maxx, miny, maxy);
      for (var x=minx; x<=maxx; x++) {
        for (var y=miny; y<=maxy; y++) {
          var spriteIdx = this.getCell(y, x);
          if ([8, 9, 13, 14, 21, 30, 31, 34, 35, 39, 43, 49].indexOf(spriteIdx) > -1) {
            console.log('colide');
            sprite.dx = sprite.dy = sprite.ddx = sprite.ddy = 0;
          }
        }
      }
    });
  }

  render(ctx) {
    const { cellSize, magFactor } = this;
    if (!cellSize) return;
    ctx.imageSmoothingEnabled = false;

    for (var x=0; x<this.grid[0].length; x++) {
      for (var y=0; y<this.grid.length; y++) {
        var spriteIdx = this.getCell(y, x);
        if (spriteIdx > 0) {
          ctx.drawImage(this.img,
            0, spriteIdx * cellSize, cellSize, cellSize,
            (x * cellSize) * magFactor, (y * cellSize) * magFactor, cellSize * magFactor, cellSize * magFactor);
        }
      }
    }
  }
}
