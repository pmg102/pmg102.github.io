(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fps = 60,
    STEP = 1 / fps;

var Animator = function () {
  function Animator(canvas, objects) {
    _classCallCheck(this, Animator);

    this.sprites = objects;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  }

  _createClass(Animator, [{
    key: 'update',
    value: function update() {
      var _this = this;

      this.sprites.forEach(function (each) {
        return each.update(_this.dt);
      });
    }
  }, {
    key: 'clearCanvas',
    value: function clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.clearCanvas();
      this.sprites.forEach(function (each) {
        return each.render(_this2.ctx, _this2.dt);
      });
    }
  }, {
    key: 'frame',
    value: function frame() {
      var _this3 = this;

      if (!this.running) return;
      this.fpsmeter.tickStart();
      this.now = (0, _utils.timestamp)();
      this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
      while (this.dt > STEP) {
        this.dt -= STEP;
        this.update(STEP);
      }
      this.render();
      this.last = this.now;
      this.fpsmeter.tick();
      requestAnimationFrame(function () {
        return _this3.frame();
      }, this.canvas);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.running = false;
    }
  }, {
    key: 'start',
    value: function start() {
      this.running = true;
      this.dt = 0;
      this.last = this.now = (0, _utils.timestamp)();
      this.frame();
    }
  }]);

  return Animator;
}();

exports.default = Animator;

},{"./utils":6}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sprite2 = require('./Sprite');

var _Sprite3 = _interopRequireDefault(_Sprite2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Land = function (_Sprite) {
  _inherits(Land, _Sprite);

  function Land(cfg) {
    _classCallCheck(this, Land);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Land).call(this, cfg));
  }

  _createClass(Land, [{
    key: 'collideWith',
    value: function collideWith(other) {
      if (other.collideWithLand) {
        other.collideWithLand(this);
      }
    }
  }]);

  return Land;
}(_Sprite3.default);

exports.default = Land;

},{"./Sprite":4}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sprite2 = require('./Sprite');

var _Sprite3 = _interopRequireDefault(_Sprite2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_Sprite) {
  _inherits(Player, _Sprite);

  function Player(cfg) {
    _classCallCheck(this, Player);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, cfg));
  }

  _createClass(Player, [{
    key: 'collideWithLand',
    value: function collideWithLand(land) {
      this.y = land.y - this.height;
      this.dy = 0;
    }
  }]);

  return Player;
}(_Sprite3.default);

exports.default = Player;

},{"./Sprite":4}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function () {
  function Sprite(cfg) {
    _classCallCheck(this, Sprite);

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

    Sprite.objects.push(this);
  }

  _createClass(Sprite, [{
    key: '_intersect',
    value: function _intersect(other) {
      return !(this.x + this.width - 1 < other.x || other.x + other.width - 1 < this.x || this.y + this.height - 1 < other.y || other.y + other.height - 1 < this.y);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var _this = this;

      this.x = this.x + dt * this.dx;
      this.y = this.y + dt * this.dy;
      this.dx = this.dx + dt * this.ddx;
      this.dy = this.dy + dt * this.ddy;

      this.t += dt;
      if (this.lifetime && this.t > this.lifetime) {
        delete Sprite.objects[Sprite.objects.indexOf(this)];
      }

      Sprite.objects.filter(function (each) {
        return _this._intersect(each);
      }).forEach(function (other) {
        _this.collideWith(other);
      });
    }
  }, {
    key: 'render',
    value: function render(ctx, dt) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + this.dx * dt, this.y + this.dy * dt, this.width, this.height);
    }
  }, {
    key: 'collideWith',
    value: function collideWith(other) {
      // Override in derived class   
    }
  }]);

  return Sprite;
}();

exports.default = Sprite;

Sprite.objects = [];

},{}],5:[function(require,module,exports){
'use strict';

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _Land = require('./Land');

var _Land2 = _interopRequireDefault(_Land);

var _Animator = require('./Animator');

var _Animator2 = _interopRequireDefault(_Animator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var player = new _Player2.default({ x: 100, y: 500, width: 20, height: 20, color: '#a04' });

new _Land2.default({ x: 0, y: 520, width: 768, height: 576, color: '#4a0' });
new _Land2.default({ x: 200, y: 300, width: 100, height: 30, color: '#4a0' });

var animator = new _Animator2.default(canvas, _Sprite2.default.objects);
animator.start();

document.addEventListener('keydown', function (ev) {
  return onkey(ev, ev.keyCode, true);
}, false);
document.addEventListener('keyup', function (ev) {
  return onkey(ev, ev.keyCode, false);
}, false);

var KEY = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

function onkey(ev, key, down) {
  console.log(key);
  switch (key) {
    case KEY.LEFT:
      player.dx = down ? -200 : 0;ev.preventDefault();return false;
    case KEY.RIGHT:
      player.dx = down ? 200 : 0;ev.preventDefault();return false;
    case KEY.SPACE:
      if (down) player.dy = -1000;player.ddy = 2000;ev.preventDefault();return false;
    case KEY.ENTER:
      if (down) {
        animator.running ? animator.stop() : animator.start();
      }ev.preventDefault();return false;
  }
}

},{"./Animator":1,"./Land":2,"./Player":3,"./Sprite":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestamp = timestamp;
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

},{}]},{},[5]);
