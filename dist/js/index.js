(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animator = function () {
  function Animator(canvas, objects, background, viewport) {
    _classCallCheck(this, Animator);

    this.sprites = objects;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.background = background;
    this.viewport = viewport;

    this.fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  }

  _createClass(Animator, [{
    key: 'update',
    value: function update(dt) {
      this.sprites.forEach(function (each) {
        return each.update(dt);
      });
      this.background.detectCollisions(this.sprites);
    }
  }, {
    key: 'clearCanvas',
    value: function clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      this.ctx.restore();
      this.clearCanvas();
      this.ctx.save();
      this.viewport.applyTo(this.ctx);
      this.background.render(this.ctx);
      this.sprites.forEach(function (each) {
        return each.render(_this.ctx, _this.dt);
      });
    }
  }, {
    key: 'frame',
    value: function frame() {
      var _this2 = this;

      if (!this.running) return;
      this.fpsmeter.tickStart();
      this.now = (0, _utils.timestamp)();
      this.update(Math.min(1, (this.now - this.last) / 1000));
      this.render();
      this.last = this.now;
      this.fpsmeter.tick();
      requestAnimationFrame(function () {
        return _this2.frame();
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
      this.last = this.now = (0, _utils.timestamp)();
      this.frame();
    }
  }]);

  return Animator;
}();

exports.default = Animator;

},{"./utils":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _grid = require('./grid.json');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

var Background = function () {
  function Background() {
    var _this = this;

    _classCallCheck(this, Background);

    this.grid = _grid2.default;
    this.img = new Image();
    this.img.src = './images/sprites.png';
    this.img.onload = function () {
      _this.isReady = true;
    };
  }

  _createClass(Background, [{
    key: 'getCell',
    value: function getCell(y, x) {
      if (!this.grid[y] || !this.grid[y][x]) return '0';

      return CHARS.indexOf(this.grid[y][x]);
    }
  }, {
    key: 'detectCollisions',
    value: function detectCollisions(sprites) {
      sprites.forEach(function (each) {
        // Which cells does this sprite intersect?
        // Are any of them solid?
        // If so - set location to above/below and speed to 0 and accel to 0 if above
      });
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      if (!this.isReady) return;
      ctx.imageSmoothingEnabled = false;

      for (var x = 0; x < this.grid[0].length; x++) {
        for (var y = 0; y < this.grid.length; y++) {
          var spriteIdx = this.getCell(y, x);
          if (spriteIdx > 0) {
            ctx.drawImage(this.img, 0, 8 * spriteIdx, 8, 8, x * 8 * 4, y * 8 * 4, 8 * 4, 8 * 4);
          }
        }
      }
    }
  }]);

  return Background;
}();

exports.default = Background;

},{"./grid.json":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.globalAlpha = 0.2;
      _get(Object.getPrototypeOf(Land.prototype), 'render', this).call(this, ctx);
      ctx.globalAlpha = 1;
    }
  }]);

  return Land;
}(_Sprite3.default);

exports.default = Land;

},{"./Sprite":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

},{"./Sprite":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    this.direction = 1;

    Sprite.objects.push(this);

    if (cfg.src) {
      this.img = new Image();
      this.img.src = cfg.src;
    }
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
      if (this.dx > 0) this.direction = 1;else if (this.dx < 0) this.direction = -1;

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
    value: function render(ctx) {
      if (!this.img) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        return;
      }

      var frame = 1;
      if (this.direction === 1) frame = 2;

      if (this.dx !== 0) {
        var step = this.dy === 0 ? parseInt(this.x / 36) % 2 : 1;
        frame > 1 ? frame += step : frame -= step;
      }

      ctx.drawImage(this.img, 12 + frame * 30, 61, 12, 12, this.x, this.y, this.width, this.height);
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Viewport = function () {
  function Viewport(w, h, player, canvas) {
    _classCallCheck(this, Viewport);

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

  _createClass(Viewport, [{
    key: "constrainX",
    value: function constrainX(dx) {
      var half = canvas.width / 2;
      var _dx = dx + this.player0.x;

      if (_dx < half) {
        return 0;
      } else if (_dx > this.w - half) {
        return this.w - canvas.width;
      } else {
        return _dx - half;
      }
    }
  }, {
    key: "constrainY",
    value: function constrainY(dy) {
      var half = canvas.height / 2;
      var _dy = dy + this.player0.y;

      if (_dy > this.h - half) {
        return this.h - canvas.height;
      } else {
        return _dy - half;
      }
    }
  }, {
    key: "applyTo",
    value: function applyTo(ctx) {
      var dx = this.constrainX(this.player.x - this.player0.x);
      var dy = this.constrainY(this.player.y - this.player0.y);

      ctx.translate(-dx, -dy);
    }
  }]);

  return Viewport;
}();

exports.default = Viewport;

},{}],7:[function(require,module,exports){
module.exports=[
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000002",
  "33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333330000000000000000004",
  "00000000000056567000000000000000000000000000000000005656700000000000000000000000000000000000000000000000000000005656700000000000880000000567000000000000565670000000000000000000000000000000000000000000000000000000000000000000000000005656700000000000000000000000056700000000009900000000000000abbc000de",
  "00000000000fghghi0000000000000000000056700000000000fghghi000000000000000000000000000000j00000000000000000000000fghghi0000000000000000000fghi00000000000fghghi00000000000000000000567000000000000000000000000000000000000056700000000000fghghi00000000000000000000000fghi0000000009990j00000000000000000000d",
  "000000000000000000000000000000000000fghi0000000000000000000000000000000000000000000k000j0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fghi000000000000000000000000000000000000fghi000000000000000000000000000000000000000000000000000099990000000000000000000000d",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000llllll0j0000000m00000000000000000000000000000000no00000000000000000000000000000000000000000000p0000000000000000000000000000000000000000000000000000000000000000000000000000no00000000000000no00999990j00000000000000000000d",
  "000000000000000000000000000000000080000000000000000000000000000000000000000000000000000j000000080000000000000000000000000000008888880000000000000000000000000000000000000000008000000000000000000000000000000000000000800000000000000000000000000000000000n00o00000q000000n00o999999000000000rsst000000000d",
  "00000000no00000000000000000000000000000000000000no000000000000000008l8l8000000uv0000000j00000000000000000000no0000000000000000n0000o0000000000000000no00000000000000000000000000000000000008l8l8000000uv0000000000000000000000000000no0000000000000000000n0000o00lll00000n00099999990j0000000www0000000000d",
  "0000000n00o00000000000x0000000000no000000000000n00o000000000000000000000000000yz0000000j0000000000000000000n00o00000000000000n000000o00000000000000n00o0000000000000000000000no00000000000000000000000yz0000000000000no000000000000n00o00000000000000000n000000o00000000n00000joj0j00000000000000000000000d",
  "000008n0000o000000000080000000ABn00o0000000008n0000o00000000000000000000000000yz0000000j000000000000000008n0000o000000000000n00000000o000000000008n0000o000000000080000000ABn00o0000000000000000000000yz0080000000ABn00o0000000008n0000o000000000000000n00000000o000000n0009999999990j00000000000000000000d",
  "00000n000000o00000000000000000Cn0000o00000000n000000o00000000no0no000000000000yz00800000000000lll00000000n000000o0000000000nDDDDDDDDDDo0000000000n000000o00000000000000000Cn0000o0000no0no000000000000yz0000000000Cn0000o00000000n000000o000000000AB00n000EF00000o0000n00099999999990000000000000000000000d",
  "00non0000AB00o0000000000000000G000990o0000non0000AB00o000000CHHHHHHHHHHHHHHHHHHH000AB00000000000000000non0000AB00o00000000n000000000000oAB0000non0000AB00o0000000000000000G000990o00CHHHHHHHHHHHHHHHHHHH0000000000G000990o0000non0000AB00o000000ABCnon0000IJK00999999n0000j0j0j999990j00000000000000000000d",
  "0uv0o00ABC0000o000000000000uvnC0009900o00uv0o00ABC0000o00000C11111111111111111110ABC00000000000000000uv0o00ABC0000o000000n000000000000ABL0000uv0o00ABC0000o000000000000uvnC0009900o0C11111111111111111110000000uvnC0009900o00uv0o00ABC0000o00000C0G00o0000999999999990009999999999990000000000000000000000d",
  "nyz00o0C0C00000o00000000000yz0C00099000onyz00o0C0C00000o0000C11111111111111111110C0C0000000000000000nyz00o0C0C00000o0000n0000000000000C0Co00nyz00o0C0C00000o00000000000yz0C00099000oC11111111111111111110000000yz0C00099000onyz00o0C0C00000o0000CnC000o00099999999999009999999999999o0000000000000000000002",
  "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH1111111111111111111HHHHHHHHHMCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHM0HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH1111111111111111111HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHM0CHHHHHHHHHHHMCHHHHHHHHHHHHHHHHH0000000000000000004",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNMCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNM0NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNM0CNNNNNNNNNNNMCNNNNNNNNNNNNNNNNNdededededededededed",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO00000000000000000000OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO00000000000000000000OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000DDDDDDDDDDD000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000DDDDDDDDDDDDDDyzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000D0000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000D0000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000Dj0j0j0j0j0jPQRzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000D00000000000STUzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000D00DDDDDDDDDDDDDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000D00000000000000DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000jjjjjj000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000DD0000000000000DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0000Dj0j0j0j0j0j00DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000jjjjjj000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0000D0000000000000DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000000000000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0000DDDDDDDDDDDD00DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD00000jjjjjj000000yzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000000000000000000DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0000DDDDDDDD000PQRzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0j0j0j0j0j0j0j0j0jDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD0000DDDDDDDD000STUzOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD000000000000000000DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOODDDDDDDDDDDDDDDDDDDDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOODDDDDDDDDDDDDDDDDDDDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
]

},{}],8:[function(require,module,exports){
'use strict';

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _Viewport = require('./Viewport');

var _Viewport2 = _interopRequireDefault(_Viewport);

var _Land = require('./Land');

var _Land2 = _interopRequireDefault(_Land);

var _Animator = require('./Animator');

var _Animator2 = _interopRequireDefault(_Animator);

var _Background = require('./Background');

var _Background2 = _interopRequireDefault(_Background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var player = new _Player2.default({ x: 100, y: 484, width: 48, height: 48, src: './images/mario.png' });

var viewport = new _Viewport2.default(10000, 576, player, canvas);

new _Land2.default({ x: 0, y: 512, width: 10000, height: 576, color: '#4a0' });
new _Land2.default({ x: 160, y: 352, width: 32, height: 32, color: '#4a0' });
new _Land2.default({ x: 32, y: 448, width: 64, height: 64, color: '#4a0' });
new _Land2.default({ x: 704, y: 352, width: 32, height: 32, color: '#4a0' });
new _Land2.default({ x: 864, y: 448, width: 64, height: 64, color: '#4a0' });

var background = new _Background2.default();

var animator = new _Animator2.default(canvas, _Sprite2.default.objects, background, viewport);
animator.start();

// TODO:
// * key states should be stored into a dict in onkey, dict passed to objects in update for them to respond (ie player)

document.addEventListener('keydown', function (ev) {
  onkey(ev, ev.keyCode, true);
}, false);
document.addEventListener('keyup', function (ev) {
  onkey(ev, ev.keyCode, false);
}, false);

document.getElementById('left').addEventListener('mousedown', function (ev) {
  return onkey(ev, KEY.LEFT, true);
}, false);
document.getElementById('left').addEventListener('mouseup', function (ev) {
  return onkey(ev, KEY.LEFT, false);
}, false);
document.getElementById('right').addEventListener('mousedown', function (ev) {
  return onkey(ev, KEY.RIGHT, true);
}, false);
document.getElementById('right').addEventListener('mouseup', function (ev) {
  return onkey(ev, KEY.RIGHT, false);
}, false);
document.getElementById('jump').addEventListener('mousedown', function (ev) {
  return onkey(ev, KEY.SPACE, true);
}, false);
document.getElementById('jump').addEventListener('mouseup', function (ev) {
  return onkey(ev, KEY.SPACE, false);
}, false);
document.getElementById('left').addEventListener('touchstart', function (ev) {
  return onkey(ev, KEY.LEFT, true);
}, false);
document.getElementById('left').addEventListener('touchend', function (ev) {
  return onkey(ev, KEY.LEFT, false);
}, false);
document.getElementById('right').addEventListener('touchstart', function (ev) {
  return onkey(ev, KEY.RIGHT, true);
}, false);
document.getElementById('right').addEventListener('touchend', function (ev) {
  return onkey(ev, KEY.RIGHT, false);
}, false);
document.getElementById('jump').addEventListener('touchstart', function (ev) {
  return onkey(ev, KEY.SPACE, true);
}, false);
document.getElementById('jump').addEventListener('touchend', function (ev) {
  return onkey(ev, KEY.SPACE, false);
}, false);

var KEY = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

function onkey(ev, key, down) {
  console.log(key);
  switch (key) {
    case KEY.LEFT:
      if (down) {
        player.dx = player.dx > 0 ? 0 : -500;
      } else {
        player.dx = player.dx < 0 ? 0 : 500;
      }
      return;
    case KEY.RIGHT:
      if (down) {
        player.dx = player.dx < 0 ? 0 : 500;
      } else {
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

},{"./Animator":1,"./Background":2,"./Land":3,"./Player":4,"./Sprite":5,"./Viewport":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestamp = timestamp;
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

},{}]},{},[8]);
