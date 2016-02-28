import Sprite from './Sprite';
import Player from './Player';
import Viewport from './Viewport';
import Land from './Land';
import Animator from './Animator';
import Background from './Background';


const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const player = new Player({x: 100, y: 484, width: 48, height: 48, src: './images/mario.png'});

const viewport = new Viewport(10000, 576, player, canvas);

new Land({x: 0, y: 512, width: 10000, height: 576, color: '#4a0'});
new Land({x: 160, y: 352, width: 32, height: 32, color: '#4a0'});
new Land({x: 32, y: 448, width: 64, height: 64, color: '#4a0'});
new Land({x: 704, y: 352, width: 32, height: 32, color: '#4a0'});
new Land({x: 864, y: 448, width: 64, height: 64, color: '#4a0'});

const background = new Background();

const animator = new Animator(canvas, Sprite.objects, background, viewport);
animator.start();

// TODO:
// * key states should be stored into a dict in onkey, dict passed to objects in update for them to respond (ie player)

document.addEventListener('keydown', function(ev) { onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { onkey(ev, ev.keyCode, false); }, false);

document.getElementById('left').addEventListener('mousedown', ev => onkey(ev, KEY.LEFT, true), false);
document.getElementById('left').addEventListener('mouseup', ev => onkey(ev, KEY.LEFT, false), false);
document.getElementById('right').addEventListener('mousedown', ev => onkey(ev, KEY.RIGHT, true), false);
document.getElementById('right').addEventListener('mouseup', ev => onkey(ev, KEY.RIGHT, false), false);
document.getElementById('left').addEventListener('touchstart', ev => onkey(ev, KEY.LEFT, true), false);
document.getElementById('left').addEventListener('touchend', ev => onkey(ev, KEY.LEFT, false), false);
document.getElementById('right').addEventListener('touchstart', ev => onkey(ev, KEY.RIGHT, true), false);
document.getElementById('right').addEventListener('touchend', ev => onkey(ev, KEY.RIGHT, false), false);

const KEY      = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

function onkey(ev, key, down) {
  console.log(key);
  switch(key) {
    case KEY.LEFT:
      if (down) {
        player.dx = player.dx > 0 ? 0 : -500;
      }
      else {
        player.dx = player.dx < 0 ? 0 : 500;
      }
      return;
    case KEY.RIGHT:
      if (down) {
        player.dx = player.dx < 0 ? 0 : 500;
      }
      else {
        player.dx = player.dx > 0 ? 0 : -500;
      }
      return;
    case KEY.SPACE:
      if (down) player.dy = -1000;
      player.ddy = 2000;
      return;

    case KEY.ENTER:
      if (down) {
        animator.running ? animator.stop() : animator.start();
      }
      return;
  }
}
