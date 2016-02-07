import Sprite from './Sprite';
import Player from './Player';
import Land from './Land';
import Animator from './Animator';

const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const player = new Player({x: 100, y: 500, width: 20, height: 20, color: '#a04'});

new Land({x: 0, y: 520, width: 768, height: 576, color: '#4a0'});
new Land({x: 200, y: 300, width: 100, height: 30, color: '#4a0'});


const animator = new Animator(canvas, Sprite.objects);
animator.start();

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

const KEY      = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

function onkey(ev, key, down) {
  console.log(key);
  switch(key) {
    case KEY.LEFT:  player.dx = down ? -200 : 0; ev.preventDefault(); return false;
    case KEY.RIGHT: player.dx = down ? 200 : 0; ev.preventDefault(); return false;
    case KEY.SPACE: if (down) player.dy = -1000; player.ddy = 2000; ev.preventDefault(); return false;
    case KEY.ENTER: if (down) { animator.running ? animator.stop() : animator.start(); } ev.preventDefault(); return false;
  }
}
