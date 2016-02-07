import Sprite from './Sprite';

export default class Player extends Sprite {
  constructor(cfg) {
    super(cfg);
  }

  collideWithLand(land) {
    this.y = land.y - this.height;
    this.dy = 0;
  }
}
