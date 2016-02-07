import Sprite from './Sprite';

export default class Land extends Sprite {
  constructor(cfg) {
    super(cfg);
  }

  collideWith(other) {
  	if (other.collideWithLand) {
  		other.collideWithLand(this);
  	}
  }
}
