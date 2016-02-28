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
    this.img.onload = () => { this.isReady = true; };
  }

  getCell(y, x) {
    if (!this.grid[y] || !this.grid[y][x]) return '0';

    return CHARS.indexOf(this.grid[y][x])
  }

  detectCollisions(sprites) {
    sprites.forEach(each => {
      // Which cells does this sprite intersect?
      // Are any of them solid?
      // If so - set location to above/below and speed to 0 and accel to 0 if above
    });
  }

  render(ctx) {
    if (!this.isReady) return;
    ctx.imageSmoothingEnabled= false;

    for (var x=0; x<this.grid[0].length; x++) {
      for (var y=0; y<this.grid.length; y++) {
        var spriteIdx = this.getCell(y, x);
        if (spriteIdx > 0) {
          ctx.drawImage(this.img,
            0, 8 * spriteIdx, 8, 8,
            (x * 8) * 4, (y * 8) * 4, 8 * 4, 8 * 4);
        }
      }
    }
  }
}
