/**
 * Copyright (c) Flyover Games, LLC 
 *  
 * Jason Andersen jgandersen@gmail.com 
 * Isaac Burns isaacburns@gmail.com 
 *  
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated 
 * documentation files (the "Software"), to deal in the Software 
 * without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to 
 * whom the Software is furnished to do so, subject to the 
 * following conditions: 
 *  
 * The above copyright notice and this permission notice shall 
 * be included in all copies or substantial portions of the 
 * Software. 
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 */

/**
 * A JavaScript API for the Spriter SCML animation data format.
 */
goog.provide('spriter');

/**
 * @return {boolean} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {boolean=} def 
 */
spriter.loadBool = function (json, key, def)
{
	var value = json[key];
	switch (typeof(value))
	{
	case 'string': return (value === 'true') ? true : false;
	case 'boolean': return value;
	default: return def || false;
	}
}

/**
 * @return {void} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {boolean} value 
 * @param {boolean=} def 
 */
spriter.saveBool = function (json, key, value, def)
{
	if ((typeof(def) !== 'boolean') || (value !== def))
	{
		json[key] = value;
	}
}

/**
 * @return {number} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {number=} def 
 */
spriter.loadFloat = function (json, key, def)
{
	var value = json[key];
	switch (typeof(value))
	{
	case 'string': return parseFloat(value);
	case 'number': return value;
	default: return def || 0;
	}
}

/**
 * @return {void} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {number} value 
 * @param {number=} def 
 */
spriter.saveFloat = function (json, key, value, def)
{
	if ((typeof(def) !== 'number') || (value !== def))
	{
		json[key] = value;
	}
}

/**
 * @return {number} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {number=} def 
 */
spriter.loadInt = function (json, key, def)
{
	var value = json[key];
	switch (typeof(value))
	{
	case 'string': return parseInt(value, 10);
	case 'number': return 0 | value;
	default: return def || 0;
	}
}

/**
 * @return {void} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {number} value 
 * @param {number=} def 
 */
spriter.saveInt = function (json, key, value, def)
{
	if ((typeof(def) !== 'number') || (value !== def))
	{
		json[key] = value;
	}
}

/**
 * @return {string} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {string=} def 
 */
spriter.loadString = function (json, key, def)
{
	var value = json[key];
	switch (typeof(value))
	{
	case 'string': return value;
	default: return def || "";
	}
}

/**
 * @return {void} 
 * @param {Object.<string,?>|Array.<?>} json 
 * @param {string|number} key 
 * @param {string} value 
 * @param {string=} def 
 */
spriter.saveString = function (json, key, value, def)
{
	if ((typeof(def) !== 'string') || (value !== def))
	{
		json[key] = value;
	}
}

/**
 * @return {Array}
 * @param {*} value 
 */
spriter.makeArray = function (value)
{
	if ((typeof(value) === 'object') && (typeof(value.length) === 'number')) // (Object.isArray(value))
	{
		return /** @type {Array} */ (value);
	}
	if (typeof(value) !== 'undefined')
	{
		return [ value ];
	}
	return [];
}

/**
 * @return {number} 
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 */
spriter.wrap = function (num, min, max)
{
	if (min < max)
	{
		if (num < min)
		{
			return max - ((min - num) % (max - min));
		}
		else
		{
			return min + ((num - min) % (max - min));
		}
	}
	else if (min === max)
	{
		return min;
	}
	else
	{
		return num;
	}
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
spriter.interpolateLinear = function (a, b, t)
{
	return a + ((b - a) * t);
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} t
 */
spriter.interpolateQuadratic = function (a, b, c, t)
{
	return spriter.interpolateLinear(spriter.interpolateLinear(a,b,t),spriter.interpolateLinear(b,c,t),t);
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} t
 */
spriter.interpolateCubic = function (a, b, c, d, t)
{
	return spriter.interpolateLinear(spriter.interpolateQuadratic(a,b,c,t),spriter.interpolateQuadratic(b,c,d,t),t);
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} t
 */
spriter.interpolateQuartic = function (a, b, c, d, e, t)
{
	return spriter.interpolateLinear(spriter.interpolateCubic(a,b,c,d,t),spriter.interpolateCubic(b,c,d,e,t),t);
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 * @param {number} t
 */
spriter.interpolateQuintic = function (a, b, c, d, e, f, t)
{
	return spriter.interpolateLinear(spriter.interpolateQuartic(a,b,c,d,e,t),spriter.interpolateQuartic(b,c,d,e,f,t),t);
}

/**
 * @return {number}
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} t
 */
spriter.interpolateBezier = function (x1, y1, x2, y2, t)
{
	function SampleCurve(a, b, c, t)
	{
		return ((a * t + b) * t + c) * t;
	}

	function SampleCurveDerivativeX(ax, bx, cx, t)
	{
		return (3.0 * ax * t + 2.0 * bx) * t + cx;
	}

	function SolveEpsilon(duration)
	{
		return 1.0 / (200.0 * duration);
	}

	function Solve(ax, bx, cx, ay, by, cy, x, epsilon)
	{
		return SampleCurve(ay, by, cy, SolveCurveX(ax, bx, cx, x, epsilon));
	}

	function SolveCurveX(ax, bx, cx, x, epsilon)
	{
		var t0;
		var t1;
		var t2;
		var x2;
		var d2;
		var i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++)
		{
			x2 = SampleCurve(ax, bx, cx, t2) - x;
			if (Math.abs(x2) < epsilon) return t2;

			d2 = SampleCurveDerivativeX(ax, bx, cx, t2);
			if (Math.abs(d2) < epsilon) break;

			t2 = t2 - x2 / d2;
		}

		// Fall back to the bisection method for reliability.
		t0 = 0.0;
		t1 = 1.0;
		t2 = x;

		if (t2 < t0) return t0;
		if (t2 > t1) return t1;

		while (t0 < t1)
		{
			x2 = SampleCurve(ax, bx, cx, t2);
			if (Math.abs(x2 - x) < epsilon) return t2;
			if (x > x2) t0 = t2;
			else t1 = t2;
			t2 = (t1 - t0) * 0.5 + t0;
		}

		return t2; // Failure.
	}

	var duration = 1;
	var cx = 3.0 * x1;
	var bx = 3.0 * (x2 - x1) - cx;
	var ax = 1.0 - cx - bx;
	var cy = 3.0 * y1;
	var by = 3.0 * (y2 - y1) - cy;
	var ay = 1.0 - cy - by;

	return Solve(ax, bx, cx, ay, by, cy, t, SolveEpsilon(duration));
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
spriter.tween = function (a, b, t)
{
	return a + ((b - a) * t);
}

/**
 * @return {number} 
 * @param {number} angle 
 */
spriter.wrapAngleRadians = function (angle)
{
	if (angle <= 0)
	{
		return ((angle - Math.PI) % (2*Math.PI)) + Math.PI;
	}
	else
	{
		return ((angle + Math.PI) % (2*Math.PI)) - Math.PI;
	}
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @param {number} spin
 */
spriter.tweenAngleRadians = function (a, b, t, spin)
{
	if (spin === 0)
	{
		return a;
	}
	else if (spin > 0)
	{
		if ((b - a) < 0)
		{
			b += 2*Math.PI;
		}
	}
	else if (spin < 0)
	{
		if ((b - a) > 0)
		{
			b -= 2*Math.PI;
		}
	}

	return spriter.wrapAngleRadians(a + (spriter.wrapAngleRadians(b - a) * t));
}

/**
 * @constructor 
 * @param {number=} rad 
 */
spriter.Angle = function (rad)
{
	this.rad = rad || 0;
}

Object.defineProperty(spriter.Angle.prototype, 'deg', 
{
	/** @this {spriter.Angle} */
	get: function () { return this.rad * 180 / Math.PI; },
	/** @this {spriter.Angle} */
	set: function (value) { this.rad = value * Math.PI / 180; }
});

Object.defineProperty(spriter.Angle.prototype, 'cos', 
{
	/** @this {spriter.Angle} */
	get: function () { return Math.cos(this.rad); }
});

Object.defineProperty(spriter.Angle.prototype, 'sin', 
{
	/** @this {spriter.Angle} */
	get: function () { return Math.sin(this.rad); }
});

/**
 * @return {spriter.Angle}
 */
spriter.Angle.prototype.selfIdentity = function ()
{
	this.rad = 0;
	return this;
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} other 
 */
spriter.Angle.prototype.copy = function (other)
{
	this.rad = other.rad;
	return this;
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} a 
 * @param {spriter.Angle} b 
 * @param {spriter.Angle=} out 
 */
spriter.Angle.add = function (a, b, out)
{
	out = out || new spriter.Angle();
	out.rad = spine.wrapAngleRadians(a.rad + b.rad);
	return out;
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} other 
 * @param {spriter.Angle=} out 
 */
spriter.Angle.prototype.add = function (other, out)
{
	return spriter.Angle.add(this, other, out);
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} other 
 */
spriter.Angle.prototype.selfAdd = function (other)
{
	return spriter.Angle.add(this, other, this);
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} a 
 * @param {spriter.Angle} b 
 * @param {number} pct 
 * @param {number} spin 
 * @param {spriter.Angle=} out 
 */
spriter.Angle.tween = function (a, b, pct, spin, out)
{
	out = out || new spriter.Angle();
	out.rad = spriter.tweenAngleRadians(a.rad, b.rad, pct, spin);
	return out;
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} other 
 * @param {number} pct 
 * @param {number} spin 
 * @param {spriter.Angle=} out 
 */
spriter.Angle.prototype.tween = function (other, pct, spin, out)
{
	return spriter.Angle.tween(this, other, pct, spin, out);
}

/**
 * @return {spriter.Angle}
 * @param {spriter.Angle} other 
 * @param {number} pct 
 * @param {number} spin 
 */
spriter.Angle.prototype.selfTween = function (other, pct, spin)
{
	return spriter.Angle.tween(this, other, pct, spin, this);
}

/**
 * @constructor 
 * @param {number=} x 
 * @param {number=} y 
 */
spriter.Vector = function (x, y)
{
	this.x = x || 0;
	this.y = y || 0;
}

/** @type {number} */
spriter.Vector.prototype.x = 0;
/** @type {number} */
spriter.Vector.prototype.y = 0;

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} other 
 */
spriter.Vector.prototype.copy = function (other)
{
	this.x = other.x;
	this.y = other.y;
	return this;
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} a 
 * @param {spriter.Vector} b 
 * @param {spriter.Vector=} out 
 */
spriter.Vector.add = function (a, b, out)
{
	out = out || new spriter.Vector();
	out.x = a.x + b.x;
	out.y = a.y + b.y;
	return out;
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} other 
 * @param {spriter.Vector=} out 
 */
spriter.Vector.prototype.add = function (other, out)
{
	return spriter.Vector.add(this, other, out);
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} other 
 */
spriter.Vector.prototype.selfAdd = function (other)
{
	//return spriter.Vector.add(this, other, this);
	this.x += other.x;
	this.y += other.y;
	return this;
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} a 
 * @param {spriter.Vector} b 
 * @param {number} pct 
 * @param {spriter.Vector=} out 
 */
spriter.Vector.tween = function (a, b, pct, out)
{
	out = out || new spriter.Vector();
	out.x = spriter.tween(a.x, b.x, pct);
	out.y = spriter.tween(a.y, b.y, pct);
	return out;
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} other 
 * @param {number} pct 
 * @param {spriter.Vector=} out 
 */
spriter.Vector.prototype.tween = function (other, pct, out)
{
	return spriter.Vector.tween(this, other, pct, out);
}

/**
 * @return {spriter.Vector}
 * @param {spriter.Vector} other 
 * @param {number} pct 
 */
spriter.Vector.prototype.selfTween = function (other, pct)
{
	return spriter.Vector.tween(this, other, pct, this);
}

/**
 * @constructor 
 * @extends {spriter.Vector} 
 */
spriter.Position = function ()
{
	goog.base(this, 0, 0);
}

goog.inherits(spriter.Position, spriter.Vector);

/**
 * @constructor 
 * @extends {spriter.Angle} 
 */
spriter.Rotation = function ()
{
	goog.base(this, 0);
}

goog.inherits(spriter.Rotation, spriter.Angle);

/**
 * @constructor 
 * @extends {spriter.Vector} 
 */
spriter.Scale = function ()
{
	goog.base(this, 1, 1);
}

goog.inherits(spriter.Scale, spriter.Vector);

/**
 * @return {spriter.Scale}
 */
spriter.Scale.prototype.selfIdentity = function ()
{
	this.x = 1;
	this.y = 1;
	return this;
}

/**
 * @constructor 
 * @extends {spriter.Vector} 
 */
spriter.Pivot = function ()
{
	goog.base(this, 0, 1);
}

goog.inherits(spriter.Pivot, spriter.Vector);

/**
 * @return {spriter.Pivot}
 */
spriter.Pivot.prototype.selfIdentity = function ()
{
	this.x = 0;
	this.y = 1;
	return this;
}

/**
 * @constructor 
 */
spriter.Space = function ()
{
	var space = this;
	space.position = new spriter.Position();
	space.rotation = new spriter.Rotation();
	space.scale = new spriter.Scale();
}

/** @type {spriter.Position} */
spriter.Space.prototype.position;
/** @type {spriter.Rotation} */
spriter.Space.prototype.rotation;
/** @type {spriter.Scale} */
spriter.Space.prototype.scale;

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} other 
 */
spriter.Space.prototype.copy = function (other)
{
	var space = this;
	space.position.copy(other.position);
	space.rotation.copy(other.rotation);
	space.scale.copy(other.scale);
	return space;
}

/**
 * @return {spriter.Space} 
 * @param {Object.<string,?>} json 
 */
spriter.Space.prototype.load = function (json)
{
	var space = this;
	space.position.x = spriter.loadFloat(json, 'x', 0);
	space.position.y = spriter.loadFloat(json, 'y', 0);
	space.rotation.deg = spriter.loadFloat(json, 'angle', 0);
	space.scale.x = spriter.loadFloat(json, 'scale_x', 1);
	space.scale.y = spriter.loadFloat(json, 'scale_y', 1);
	return space;
}

/**
 * @return {boolean} 
 * @param {spriter.Space} a 
 * @param {spriter.Space} b 
 * @param {number=} epsilon 
 */
spriter.Space.equal = function (a, b, epsilon)
{
	epsilon = epsilon || 1e-6;
	if (Math.abs(a.position.x - b.position.x) > epsilon) { return false; }
	if (Math.abs(a.position.y - b.position.y) > epsilon) { return false; }
	if (Math.abs(a.rotation.rad - b.rotation.rad) > epsilon) { return false; }
	if (Math.abs(a.scale.x - b.scale.x) > epsilon) { return false; }
	if (Math.abs(a.scale.y - b.scale.y) > epsilon) { return false; }
	return true;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space=} out 
 */
spriter.Space.identity = function (out)
{
	out = out || new spriter.Space();
	out.position.x = 0;
	out.position.y = 0;
	out.rotation.rad = 0;
	out.scale.x = 1;
	out.scale.y = 1;
	return out;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} space 
 * @param {number} x 
 * @param {number} y 
 */
spriter.Space.translate = function (space, x, y)
{
	x *= space.scale.x;
	y *= space.scale.y;
	var rad = space.rotation.rad;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	space.position.x += tx;
	space.position.y += ty;
	return space;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} space 
 * @param {number} rad 
 */
spriter.Space.rotate = function (space, rad)
{
	space.rotation.rad = spriter.wrapAngleRadians(space.rotation.rad + rad);
	return space;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} space 
 * @param {number} x 
 * @param {number} y 
 */
spriter.Space.scale = function (space, x, y)
{
	space.scale.x *= x;
	space.scale.y *= y;
	return space;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} space 
 * @param {spriter.Space=} out 
 */
spriter.Space.invert = function (space, out)
{
	// invert
	// out.sca = space.sca.inv();
	// out.rot = space.rot.inv();
	// out.pos = space.pos.neg().rotate(space.rot.inv()).mul(space.sca.inv());

	out = out || new spriter.Space();
	var inv_scale_x = 1 / space.scale.x;
	var inv_scale_y = 1 / space.scale.y;
	var inv_rotation = -space.rotation.rad;
	var inv_x = -space.position.x;
	var inv_y = -space.position.y;
	out.scale.x = inv_scale_x;
	out.scale.y = inv_scale_y;
	out.rotation.rad = inv_rotation;
	var x = inv_x;
	var y = inv_y;
	var rad = inv_rotation;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	out.position.x = tx * inv_scale_x;
	out.position.y = ty * inv_scale_y;
	return out;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} a 
 * @param {spriter.Space} b 
 * @param {spriter.Space=} out 
 */
spriter.Space.combine = function (a, b, out)
{
	// combine
	// out.pos = b.pos.mul(a.sca).rotate(a.rot).add(a.pos);
	// out.rot = b.rot.mul(a.rot);
	// out.sca = b.sca.mul(a.sca);

	out = out || new spriter.Space();
	var x = b.position.x * a.scale.x;
	var y = b.position.y * a.scale.y;
	var rad = a.rotation.rad;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	out.position.x = tx + a.position.x;
	out.position.y = ty + a.position.y;
	if ((a.scale.x * a.scale.y) < 0)
	{
		out.rotation.rad = spriter.wrapAngleRadians(a.rotation.rad - b.rotation.rad);
	}
	else
	{
		out.rotation.rad = spriter.wrapAngleRadians(b.rotation.rad + a.rotation.rad);
	}
	out.scale.x = b.scale.x * a.scale.x;
	out.scale.y = b.scale.y * a.scale.y;
	return out;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} ab 
 * @param {spriter.Space} a 
 * @param {spriter.Space=} out 
 */
spriter.Space.extract = function (ab, a, out)
{
	// extract
	// out.sca = ab.sca.mul(a.sca.inv());
	// out.rot = ab.rot.mul(a.rot.inv());
	// out.pos = ab.pos.add(a.pos.neg()).rotate(a.rot.inv()).mul(a.sca.inv());

	out = out || new spriter.Space();
	out.scale.x = ab.scale.x / a.scale.x;
	out.scale.y = ab.scale.y / a.scale.y;
	if ((a.scale.x * a.scale.y) < 0)
	{
		out.rotation.rad = spriter.wrapAngleRadians(a.rotation.rad + ab.rotation.rad);
	}
	else
	{
		out.rotation.rad = spriter.wrapAngleRadians(ab.rotation.rad - a.rotation.rad);
	}
	var x = ab.position.x - a.position.x;
	var y = ab.position.y - a.position.y;
	var rad = -a.rotation.rad;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	out.position.x = tx / a.scale.x;
	out.position.y = ty / a.scale.y;
	return out;
}

/**
 * @return {spriter.Vector} 
 * @param {spriter.Space} space 
 * @param {spriter.Vector} v 
 * @param {spriter.Vector=} out 
 */
spriter.Space.transform = function (space, v, out)
{
	out = out || new spriter.Vector();
	var x = v.x * space.scale.x;
	var y = v.y * space.scale.y;
	var rad = space.rotation.rad;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	out.x = tx + space.position.x;
	out.y = ty + space.position.y;
	return out;
}

/**
 * @return {spriter.Vector} 
 * @param {spriter.Space} space 
 * @param {spriter.Vector} v 
 * @param {spriter.Vector=} out 
 */
spriter.Space.untransform = function (space, v, out)
{
	out = out || new spriter.Vector();
	var x = v.x - space.position.x;
	var y = v.y - space.position.y;
	var rad = -space.rotation.rad;
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var tx = c*x - s*y;
	var ty = s*x + c*y;
	out.x = tx / space.scale.x;
	out.y = ty / space.scale.y;
	return out;
}

/**
 * @return {spriter.Space} 
 * @param {spriter.Space} a 
 * @param {spriter.Space} b 
 * @param {number} tween
 * @param {number} spin
 * @param {spriter.Space=} out 
 */
spriter.Space.tween = function (a, b, tween, spin, out)
{
	out.position.x = spriter.tween(a.position.x, b.position.x, tween);
	out.position.y = spriter.tween(a.position.y, b.position.y, tween);
	out.rotation.rad = spriter.tweenAngleRadians(a.rotation.rad, b.rotation.rad, tween, spin);
	out.scale.x = spriter.tween(a.scale.x, b.scale.x, tween);
	out.scale.y = spriter.tween(a.scale.y, b.scale.y, tween);
	return out;
}

/**
 * @constructor
 */
spriter.Element = function ()
{
}

/** @type {number} */
spriter.Element.prototype.id = -1;
/** @type {string} */
spriter.Element.prototype.name = "";

/**
 * @return {spriter.Element} 
 * @param {Object.<string,?>} json 
 */
spriter.Element.prototype.load = function (json)
{
	this.id = spriter.loadInt(json, 'id', -1);
	this.name = spriter.loadString(json, 'name', "");
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 * @param {string} type
 */
spriter.File = function (type)
{
	goog.base(this);
	this.type = type;
}

goog.inherits(spriter.File, spriter.Element);

/** @type {string} */
spriter.File.prototype.type = "unknown";

/**
 * @return {spriter.File} 
 * @param {Object.<string,?>} json 
 */
spriter.File.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	//var type = spriter.loadString(json, 'type', "image");
	//if (this.type !== type) throw new Error();
	return this;
}

/**
 * @constructor
 * @extends {spriter.File}
 */
spriter.ImageFile = function ()
{
	var file = this;
	goog.base(this, 'image');
	file.pivot = new spriter.Pivot();
}

goog.inherits(spriter.ImageFile, spriter.File);

/** @type {number} */
spriter.ImageFile.prototype.width = 0;
/** @type {number} */
spriter.ImageFile.prototype.height = 0;
/** @type {spriter.Pivot} */
spriter.ImageFile.prototype.pivot;

/**
 * @return {spriter.ImageFile} 
 * @param {Object.<string,?>} json 
 */
spriter.ImageFile.prototype.load = function (json)
{
	var file = this;
	goog.base(this, 'load', json);
	file.width = spriter.loadInt(json, 'width', 0);
	file.height = spriter.loadInt(json, 'height', 0);
	file.pivot.x = spriter.loadFloat(json, 'pivot_x', 0);
	file.pivot.y = spriter.loadFloat(json, 'pivot_y', 1);
	return file;
}

/**
 * @constructor
 * @extends {spriter.File}
 */
spriter.SoundFile = function ()
{
	goog.base(this, 'sound');
}

goog.inherits(spriter.SoundFile, spriter.File);

/**
 * @return {spriter.File} 
 * @param {Object.<string,?>} json 
 */
spriter.SoundFile.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Folder = function ()
{
	var folder = this;
	goog.base(this);
	folder.file_array = [];
}

goog.inherits(spriter.Folder, spriter.Element);

/** @type {Array.<spriter.File>} */
spriter.Folder.prototype.file_array;

/**
 * @return {spriter.Folder} 
 * @param {Object.<string,?>} json 
 */
spriter.Folder.prototype.load = function (json)
{
	var folder = this;
	goog.base(this, 'load', json);
	folder.file_array = [];
	json.file = spriter.makeArray(json.file);
	json.file.forEach(function (file_json)
	{
		switch (file_json.type)
		{
		case 'image':
		default:
			folder.file_array.push(new spriter.ImageFile().load(file_json));
			break;
		case 'sound':
			folder.file_array.push(new spriter.SoundFile().load(file_json));
			break;
		}
	});
	return folder;
}

/**
 * @constructor
 */
spriter.Bone = function ()
{
	var bone = this;
	bone.local_space = new spriter.Space();
	bone.world_space = new spriter.Space();
}

/** @type {string} */
spriter.Bone.prototype.name = "";
/** @type {number} */
spriter.Bone.prototype.parent_index = -1;
/** @type {spriter.Space} */
spriter.Bone.prototype.local_space;
/** @type {spriter.Space} */
spriter.Bone.prototype.world_space;

/**
 * @return {spriter.Bone} 
 * @param {Object.<string,?>} json 
 */
spriter.Bone.prototype.load = function (json)
{
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	return this;
}

/**
 * @return {spriter.Bone}
 * @param {spriter.Bone} other
 */
spriter.Bone.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	return this;
}

/**
 * @return {void}
 * @param {spriter.Bone} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.Bone.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
}

/**
 * @return {spriter.Space}
 * @param {spriter.Bone} bone 
 * @param {Array.<spriter.Bone>} bones 
 * @param {spriter.Space=} out 
 */
spriter.Bone.flatten = function (bone, bones, out)
{
	out = out || new spriter.Space();

	var parent_bone = bones[bone.parent_index];
	if (parent_bone)
	{
		spriter.Bone.flatten(parent_bone, bones, out);
	}
	else
	{
		spriter.Space.identity(out);
	}

	spriter.Space.combine(out, bone.local_space, out);

	return out;
}

/**
 * @constructor
 * @param {string} type
 */
spriter.Object = function (type)
{
	this.type = type;
}

/** @type {string} */
spriter.Object.prototype.type = "unknown";
/** @type {string} */
spriter.Object.prototype.name = "";

/**
 * @return {spriter.Object} 
 * @param {Object.<string,?>} json 
 */
spriter.Object.prototype.load = function (json)
{
	//var type = spriter.loadString(json, 'type', "sprite");
	//if (this.type !== type) throw new Error();
	return this;
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.SpriteObject = function ()
{
	goog.base(this, 'sprite');
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
	this.pivot = new spriter.Pivot();
}

goog.inherits(spriter.SpriteObject, spriter.Object);

/** @type {number} */
spriter.SpriteObject.prototype.parent_index = -1;
/** @type {number} */
spriter.SpriteObject.prototype.folder_index = -1;
/** @type {number} */
spriter.SpriteObject.prototype.file_index = -1;
/** @type {spriter.Space} */
spriter.SpriteObject.prototype.local_space;
/** @type {spriter.Space} */
spriter.SpriteObject.prototype.world_space;
/** @type {boolean} */
spriter.SpriteObject.prototype.default_pivot = false;
/** @type {spriter.Pivot} */
spriter.SpriteObject.prototype.pivot;
/** @type {number} */
spriter.SpriteObject.prototype.z_index = 0;
/** @type {number} */
spriter.SpriteObject.prototype.alpha = 1.0;

/**
 * @return {spriter.SpriteObject} 
 * @param {Object.<string,?>} json 
 */
spriter.SpriteObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.folder_index = spriter.loadInt(json, 'folder', -1);
	this.file_index = spriter.loadInt(json, 'file', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	if ((typeof(json['pivot_x']) !== 'undefined') || 
		(typeof(json['pivot_y']) !== 'undefined'))
	{
		this.pivot.x = spriter.loadFloat(json, 'pivot_x', 0);
		this.pivot.y = spriter.loadFloat(json, 'pivot_y', 1);
	}
	else
	{
		this.default_pivot = true;
	}
	this.z_index = spriter.loadInt(json, 'z_index', 0);
	this.alpha = spriter.loadFloat(json, 'a', 1.0);
	return this;
}

/**
 * @return {spriter.SpriteObject}
 * @param {spriter.SpriteObject} other
 */
spriter.SpriteObject.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.folder_index = other.folder_index;
	this.file_index = other.file_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	this.default_pivot = other.default_pivot;
	this.pivot.copy(other.pivot);
	this.z_index = other.z_index;
	this.alpha = other.alpha;
	return this;
}

/**
 * @return {void}
 * @param {spriter.SpriteObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.SpriteObject.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
	spriter.Vector.tween(this.pivot, other.pivot, tween, this.pivot);
	this.alpha = spriter.tween(this.alpha, other.alpha, tween);
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.BoneObject = function ()
{
	goog.base(this, 'bone');
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
}

goog.inherits(spriter.BoneObject, spriter.Object);

/** @type {number} */
spriter.BoneObject.prototype.parent_index = -1;
/** @type {spriter.Space} */
spriter.BoneObject.prototype.local_space;
/** @type {spriter.Space} */
spriter.BoneObject.prototype.world_space;

/**
 * @return {spriter.BoneObject} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	return this;
}

/**
 * @return {spriter.BoneObject}
 * @param {spriter.BoneObject} other
 */
spriter.BoneObject.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.BoxObject = function ()
{
	goog.base(this, 'box');
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
	this.pivot = new spriter.Pivot();
}

goog.inherits(spriter.BoxObject, spriter.Object);

/** @type {number} */
spriter.BoxObject.prototype.parent_index = -1;
/** @type {spriter.Space} */
spriter.BoxObject.prototype.local_space;
/** @type {spriter.Space} */
spriter.BoxObject.prototype.world_space;
/** @type {spriter.Pivot} */
spriter.BoxObject.prototype.pivot;

/**
 * @return {spriter.BoxObject} 
 * @param {Object.<string,?>} json 
 */
spriter.BoxObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	this.pivot.x = spriter.loadFloat(json, 'pivot_x', 0);
	this.pivot.y = spriter.loadFloat(json, 'pivot_y', 1);
	return this;
}

/**
 * @return {spriter.BoxObject}
 * @param {spriter.BoxObject} other
 */
spriter.BoxObject.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	this.pivot.copy(other.pivot);
	return this;
}

/**
 * @return {void}
 * @param {spriter.BoxObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.BoxObject.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
	//spriter.Vector.tween(this.pivot, other.pivot, tween, this.pivot);
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.PointObject = function ()
{
	goog.base(this, 'point');
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
}

goog.inherits(spriter.PointObject, spriter.Object);

/** @type {number} */
spriter.PointObject.prototype.parent_index = -1;
/** @type {spriter.Space} */
spriter.PointObject.prototype.local_space;
/** @type {spriter.Space} */
spriter.PointObject.prototype.world_space;

/**
 * @return {spriter.PointObject} 
 * @param {Object.<string,?>} json 
 */
spriter.PointObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	return this;
}

/**
 * @return {spriter.PointObject}
 * @param {spriter.PointObject} other
 */
spriter.PointObject.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	return this;
}

/**
 * @return {void}
 * @param {spriter.PointObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.PointObject.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.SoundObject = function ()
{
	goog.base(this, 'sound');
}

goog.inherits(spriter.SoundObject, spriter.Object);

/** @type {number} */
spriter.SoundObject.prototype.folder_index = -1;
/** @type {number} */
spriter.SoundObject.prototype.file_index = -1;
/** @type {boolean} */
spriter.SoundObject.prototype.trigger = false;
/** @type {number} */
spriter.SoundObject.prototype.volume = 1.0;
/** @type {number} */
spriter.SoundObject.prototype.panning = 0.0;

/**
 * @return {spriter.SoundObject} 
 * @param {Object.<string,?>} json 
 */
spriter.SoundObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.folder_index = spriter.loadInt(json, 'folder', -1);
	this.file_index = spriter.loadInt(json, 'file', -1);
	this.trigger = spriter.loadBool(json, 'trigger', false);
	this.volume = spriter.loadFloat(json, 'volume', 1.0);
	this.panning = spriter.loadFloat(json, 'panning', 0.0);
	return this;
}

/**
 * @return {spriter.SoundObject}
 * @param {spriter.SoundObject} other
 */
spriter.SoundObject.prototype.copy = function (other)
{
	this.folder_index = other.folder_index;
	this.file_index = other.file_index;
	this.trigger = other.trigger;
	this.volume = other.volume;
	this.panning = other.panning;
	return this;
}

/**
 * @return {void}
 * @param {spriter.SoundObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.SoundObject.prototype.tween = function (other, tween, spin)
{
	this.volume = spriter.tween(this.volume, other.volume, tween);
	this.panning = spriter.tween(this.panning, other.panning, tween);
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.EntityObject = function ()
{
	goog.base(this, 'entity');
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
}

goog.inherits(spriter.EntityObject, spriter.Object);

/** @type {number} */
spriter.EntityObject.prototype.parent_index = -1;
/** @type {spriter.Space} */
spriter.EntityObject.prototype.local_space;
/** @type {spriter.Space} */
spriter.EntityObject.prototype.world_space;
/** @type {number} */
spriter.EntityObject.prototype.entity_index = -1;
/** @type {number} */
spriter.EntityObject.prototype.animation_index = -1;
/** @type {number} */
spriter.EntityObject.prototype.animation_time = 0.0;
/** @type {spriter.Pose} */
spriter.EntityObject.prototype.pose;

/**
 * @return {spriter.EntityObject} 
 * @param {Object.<string,?>} json 
 */
spriter.EntityObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	this.entity_index = spriter.loadInt(json, 'entity', -1);
	this.animation_index = spriter.loadInt(json, 'animation', -1);
	this.animation_time = spriter.loadFloat(json, 't', 0.0);
	return this;
}

/**
 * @return {spriter.EntityObject}
 * @param {spriter.EntityObject} other
 */
spriter.EntityObject.prototype.copy = function (other)
{
	this.parent_index = other.parent_index;
	this.local_space.copy(other.local_space);
	this.world_space.copy(other.world_space);
	this.entity_index = other.entity_index;
	this.animation_index = other.animation_index;
	this.animation_time = other.animation_time;
	return this;
}

/**
 * @return {void}
 * @param {spriter.EntityObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.EntityObject.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
	this.animation_time = spriter.tween(this.animation_time, other.animation_time, tween);
}

/**
 * @constructor
 * @extends {spriter.Object}
 */
spriter.VariableObject = function ()
{
	goog.base(this, 'variable');
}

goog.inherits(spriter.VariableObject, spriter.Object);

/**
 * @return {spriter.VariableObject} 
 * @param {Object.<string,?>} json 
 */
spriter.VariableObject.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	return this;
}

/**
 * @return {spriter.VariableObject}
 * @param {spriter.VariableObject} other
 */
spriter.VariableObject.prototype.copy = function (other)
{
	return this;
}

/**
 * @return {void}
 * @param {spriter.VariableObject} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.VariableObject.prototype.tween = function (other, tween, spin)
{
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Ref = function ()
{
	goog.base(this);
}

goog.inherits(spriter.Ref, spriter.Element);

/** @type {number} */
spriter.Ref.prototype.parent_index = -1;
/** @type {number} */
spriter.Ref.prototype.timeline_index = -1;
/** @type {number} */
spriter.Ref.prototype.keyframe_index = -1;

/**
 * @return {spriter.Ref} 
 * @param {Object.<string,?>} json 
 */
spriter.Ref.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.parent_index = spriter.loadInt(json, 'parent', -1);
	this.timeline_index = spriter.loadInt(json, 'timeline', -1);
	this.keyframe_index = spriter.loadInt(json, 'key', -1);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Ref}
 */
spriter.BoneRef = function ()
{
	goog.base(this);
}

goog.inherits(spriter.BoneRef, spriter.Ref);

/**
 * @return {spriter.BoneRef} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneRef.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Ref}
 */
spriter.ObjectRef = function ()
{
	goog.base(this);
}

goog.inherits(spriter.ObjectRef, spriter.Ref);

/** @type {number} */
spriter.ObjectRef.prototype.z_index = 0;

/**
 * @return {spriter.ObjectRef} 
 * @param {Object.<string,?>} json 
 */
spriter.ObjectRef.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.z_index = spriter.loadInt(json, 'z_index', 0);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Keyframe = function ()
{
	goog.base(this);
}

goog.inherits(spriter.Keyframe, spriter.Element);

/** @type {number} */
spriter.Keyframe.prototype.time = 0;

/**
 * @return {spriter.Keyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.Keyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.time = spriter.loadInt(json, 'time', 0);
	return this;
}

/**
 * @return {number} 
 * @param {Array.<spriter.Keyframe>} array 
 * @param {number} time 
 */
spriter.Keyframe.find = function (array, time)
{
	if (array.length <= 0) { return -1; }
	if (time < array[0].time) { return -1; }
	var last = array.length - 1;
	if (time >= array[last].time) { return last; }
	var lo = 0;
	var hi = last;
	if (hi === 0) { return 0; }
	var current = hi >> 1;
	while (true)
	{
		if (array[current + 1].time <= time) { lo = current + 1; } else { hi = current; }
		if (lo === hi) { return lo; }
		current = (lo + hi) >> 1;
	}
}

/**
 * @return {number} 
 * @param {spriter.Keyframe} a 
 * @param {spriter.Keyframe} b 
 */
spriter.Keyframe.compare = function (a, b)
{
	return a.time - b.time;
}

/**
 * @constructor
 */
spriter.Curve = function ()
{
}

spriter.Curve.prototype.type = "linear";
spriter.Curve.prototype.c1 = 0.0;
spriter.Curve.prototype.c2 = 0.0;
spriter.Curve.prototype.c3 = 0.0;
spriter.Curve.prototype.c4 = 0.0;

/**
 * @return {spriter.Curve} 
 * @param {Object.<string,?>} json 
 */
spriter.Curve.prototype.load = function (json)
{
	this.type = spriter.loadString(json, 'curve_type', "linear");
	this.c1 = spriter.loadFloat(json, 'c1', 0.0);
	this.c2 = spriter.loadFloat(json, 'c2', 0.0);
	this.c3 = spriter.loadFloat(json, 'c3', 0.0);
	this.c4 = spriter.loadFloat(json, 'c4', 0.0);
	return this;
}

spriter.Curve.prototype.evaluate = function (t)
{
	switch (this.type)
	{
	case "instant": return 0;
	case "linear": return t;
	case "quadratic": return spriter.interpolateQuadratic(0.0, this.c1, 1.0, t);
	case "cubic": return spriter.interpolateCubic(0.0, this.c1, this.c2, 1.0, t);
	case "quartic": return spriter.interpolateQuartic(0.0, this.c1, this.c2, this.c3, 1.0, t);
	case "quintic": return spriter.interpolateQuintic(0.0, this.c1, this.c2, this.c3, this.c4, 1.0, t);
	case "bezier": return spriter.interpolateBezier(this.c1, this.c2, this.c3, this.c4, t);
	}
	return 0;
}

/**
 * @constructor
 * @extends {spriter.Keyframe}
 */
spriter.MainlineKeyframe = function ()
{
	goog.base(this);
	this.curve = new spriter.Curve();
}

goog.inherits(spriter.MainlineKeyframe, spriter.Keyframe);

/** @type {spriter.Curve} */
spriter.MainlineKeyframe.prototype.curve;
/** @type {Array.<spriter.BoneRef>} */
spriter.MainlineKeyframe.prototype.bone_ref_array;
/** @type {Array.<spriter.ObjectRef>} */
spriter.MainlineKeyframe.prototype.object_ref_array;

/**
 * @return {spriter.MainlineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.MainlineKeyframe.prototype.load = function (json)
{
	var mainline_keyframe = this;

	goog.base(this, 'load', json);

	mainline_keyframe.curve.load(json);

	mainline_keyframe.bone_ref_array = [];
	json.bone_ref = spriter.makeArray(json.bone_ref);
	json.bone_ref.forEach(function (bone_ref_json)
	{
		mainline_keyframe.bone_ref_array.push(new spriter.BoneRef().load(bone_ref_json));
	});
	mainline_keyframe.bone_ref_array = mainline_keyframe.bone_ref_array.sort(function (a, b) { return a.id - b.id; });

	mainline_keyframe.object_ref_array = [];
	json.object_ref = spriter.makeArray(json.object_ref);
	json.object_ref.forEach(function (object_ref_json)
	{
		mainline_keyframe.object_ref_array.push(new spriter.ObjectRef().load(object_ref_json));
	});
	mainline_keyframe.object_ref_array = mainline_keyframe.object_ref_array.sort(function (a, b) { return a.id - b.id; });

	return mainline_keyframe;
}

/**
 * @constructor
 */
spriter.Mainline = function ()
{
}

/** @type {Array.<spriter.MainlineKeyframe>} */
spriter.Mainline.prototype.keyframe_array;

/**
 * @return {spriter.Mainline} 
 * @param {Object.<string,?>} json 
 */
spriter.Mainline.prototype.load = function (json)
{
	var mainline = this;

	mainline.keyframe_array = [];
	json.key = spriter.makeArray(json.key);
	json.key.forEach(function (key_json)
	{
		mainline.keyframe_array.push(new spriter.MainlineKeyframe().load(key_json));
	});
	mainline.keyframe_array = mainline.keyframe_array.sort(spriter.Keyframe.compare);

	return mainline;
}

/**
 * @constructor
 * @extends {spriter.Keyframe}
 * @param {string} type
 */
spriter.TimelineKeyframe = function (type)
{
	goog.base(this);
	this.type = type;
	this.curve = new spriter.Curve();
}

goog.inherits(spriter.TimelineKeyframe, spriter.Keyframe);

/** @type {string} */
spriter.TimelineKeyframe.prototype.type = "unknown";
/** @type {number} */
spriter.TimelineKeyframe.prototype.spin = 1; // 1: counter-clockwise, -1: clockwise
/** @type {spriter.Curve} */
spriter.TimelineKeyframe.prototype.curve;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.TimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json)
	//var type = spriter.loadString(json, 'type', "sprite");
	//if (this.type !== type) throw new Error();
	this.spin = spriter.loadInt(json, 'spin', 1);
	this.curve.load(json);
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.SpriteTimelineKeyframe = function ()
{
	goog.base(this, 'sprite');
}

goog.inherits(spriter.SpriteTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.SpriteObject} */
spriter.SpriteTimelineKeyframe.prototype.sprite;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.SpriteTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.sprite = new spriter.SpriteObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.BoneTimelineKeyframe = function ()
{
	goog.base(this, 'bone');
}

goog.inherits(spriter.BoneTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.BoneObject} */
spriter.BoneTimelineKeyframe.prototype.bone;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.bone = new spriter.BoneObject().load(json.bone || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.BoxTimelineKeyframe = function ()
{
	goog.base(this, 'box');
}

goog.inherits(spriter.BoxTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.BoxObject} */
spriter.BoxTimelineKeyframe.prototype.box;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.BoxTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.box = new spriter.BoxObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.PointTimelineKeyframe = function ()
{
	goog.base(this, 'point');
}

goog.inherits(spriter.PointTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.PointObject} */
spriter.PointTimelineKeyframe.prototype.point;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.PointTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.point = new spriter.PointObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.SoundTimelineKeyframe = function ()
{
	goog.base(this, 'sound');
}

goog.inherits(spriter.SoundTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.SoundObject} */
spriter.SoundTimelineKeyframe.prototype.sound;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.SoundTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.sound = new spriter.SoundObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.EntityTimelineKeyframe = function ()
{
	goog.base(this, 'entity');
}

goog.inherits(spriter.EntityTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.EntityObject} */
spriter.EntityTimelineKeyframe.prototype.entity;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.EntityTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.entity = new spriter.EntityObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.VariableTimelineKeyframe = function ()
{
	goog.base(this, 'variable');
}

goog.inherits(spriter.VariableTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.VariableObject} */
spriter.VariableTimelineKeyframe.prototype.variable;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.VariableTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.variable = new spriter.VariableObject().load(json.object || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Timeline = function ()
{
	goog.base(this);
}

goog.inherits(spriter.Timeline, spriter.Element);

/** @type {string} */
spriter.Timeline.prototype.type = "sprite";
/** @type {number} */
spriter.Timeline.prototype.object_index = -1;
/** @type {Array.<spriter.TimelineKeyframe>} */
spriter.Timeline.prototype.keyframe_array;

/**
 * @return {spriter.Timeline} 
 * @param {Object.<string,?>} json 
 */
spriter.Timeline.prototype.load = function (json)
{
	var timeline = this;

	goog.base(this, 'load', json);

	timeline.type = spriter.loadString(json, 'object_type', "sprite");
	timeline.object_index = spriter.loadInt(json, 'obj', -1);

	timeline.keyframe_array = [];
	json.key = spriter.makeArray(json.key);
	switch (timeline.type)
	{
	case 'sprite':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.SpriteTimelineKeyframe().load(key_json));
		});
		break;
	case 'bone':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.BoneTimelineKeyframe().load(key_json));
		});
		break;
	case 'box':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.BoxTimelineKeyframe().load(key_json));
		});
		break;
	case 'point':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.PointTimelineKeyframe().load(key_json));
		});
		break;
	case 'sound':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.SoundTimelineKeyframe().load(key_json));
		});
		break;
	case 'entity':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.EntityTimelineKeyframe().load(key_json));
		});
		break;
	case 'variable':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.VariableTimelineKeyframe().load(key_json));
		});
		break;
	default:
		console.log("TODO: spriter.Timeline::load", timeline.type, json.key);
		break;
	}
	timeline.keyframe_array = timeline.keyframe_array.sort(spriter.Keyframe.compare);

	return timeline;
}

/**
 * @constructor
 * @extends {spriter.Element}
 * @param {string} type
 */
spriter.VarDef = function (type)
{
	goog.base(this);
	this.type = type;
}

goog.inherits(spriter.VarDef, spriter.Element);

/** @type {string} */
spriter.VarDef.prototype.type = "unknown";

/**
 * @return {spriter.VarDef} 
 * @param {Object.<string,?>} json 
 */
spriter.VarDef.prototype.load = function (json)
{
	var var_def = this;
	goog.base(this, 'load', json);
	return this;
}

/**
 * @constructor
 * @extends {spriter.VarDef}
 */
spriter.IntVarDef = function ()
{
	goog.base(this, 'int');
}

goog.inherits(spriter.IntVarDef, spriter.VarDef);

/** @type {number} */
spriter.IntVarDef.prototype.default_value = 0;
/** @type {number} */
spriter.IntVarDef.prototype.value = 0;

/**
 * @return {spriter.IntVarDef} 
 * @param {Object.<string,?>} json 
 */
spriter.IntVarDef.prototype.load = function (json)
{
	var var_def = this;
	goog.base(this, 'load', json);
	var_def.value = var_def.default_value = spriter.loadInt(json, 'default_value', 0);
	return this;
}

/**
 * @constructor
 * @extends {spriter.VarDef}
 */
spriter.FloatVarDef = function ()
{
	goog.base(this, 'float');
}

goog.inherits(spriter.FloatVarDef, spriter.VarDef);

/** @type {number} */
spriter.FloatVarDef.prototype.default_value = 0.0;
/** @type {number} */
spriter.FloatVarDef.prototype.value = 0.0;

/**
 * @return {spriter.FloatVarDef} 
 * @param {Object.<string,?>} json 
 */
spriter.FloatVarDef.prototype.load = function (json)
{
	var var_def = this;
	goog.base(this, 'load', json);
	var_def.value = var_def.default_value = spriter.loadFloat(json, 'default_value', 0.0);
	return this;
}

/**
 * @constructor
 * @extends {spriter.VarDef}
 */
spriter.StringVarDef = function ()
{
	goog.base(this, 'string');
}

goog.inherits(spriter.StringVarDef, spriter.VarDef);

/** @type {string} */
spriter.StringVarDef.prototype.default_value = "";
/** @type {string} */
spriter.StringVarDef.prototype.value = "";

/**
 * @return {spriter.StringVarDef} 
 * @param {Object.<string,?>} json 
 */
spriter.StringVarDef.prototype.load = function (json)
{
	var var_def = this;
	goog.base(this, 'load', json);
	var_def.value = var_def.default_value = spriter.loadString(json, 'default_value', "");
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 * @param {string} type
 */
spriter.ObjInfo = function (type)
{
	goog.base(this);
	this.type = type;
}

goog.inherits(spriter.ObjInfo, spriter.Element);

/** @type {string} */
spriter.ObjInfo.prototype.type = "unknown";
/** @type {Array.<spriter.VarDef>} */
spriter.ObjInfo.prototype.var_def_array;

/**
 * @return {spriter.ObjInfo} 
 * @param {Object.<string,?>} json 
 */
spriter.ObjInfo.prototype.load = function (json)
{
	var obj_info = this;

	goog.base(this, 'load', json);

	//var type = spriter.loadString(json, 'type', "unknown");
	//if (this.type !== type) throw new Error();

	this.var_def_array = [];
	json.var_defs = spriter.makeArray(json.var_defs);
	json.var_defs.forEach(function (var_defs_json)
	{
		switch (var_defs_json.type)
		{
		case 'int':
			obj_info.var_def_array.push(new spriter.IntVarDef().load(var_defs_json));
			break;
		case 'float':
			obj_info.var_def_array.push(new spriter.FloatVarDef().load(var_defs_json));
			break;
		case 'string':
			obj_info.var_def_array.push(new spriter.StringVarDef().load(var_defs_json));
			break;
		default:
			console.log("TODO: spriter.Entity.load", var_defs_json.type, var_defs_json);
			obj_info.var_def_array.push(new spriter.VarDef(var_defs_json.type).load(var_defs_json));
			break;
		}
	});

	return this;
}

/**
 * @constructor
 */
spriter.SpriteFrame = function ()
{
}

/** @type {number} */
spriter.SpriteFrame.prototype.folder_index = -1;
/** @type {number} */
spriter.SpriteFrame.prototype.file_index = -1;

/**
 * @return {spriter.SpriteFrame} 
 * @param {Object.<string,?>} json 
 */
spriter.SpriteFrame.prototype.load = function (json)
{
	this.folder_index = spriter.loadInt(json, 'folder', -1);
	this.file_index = spriter.loadInt(json, 'file', -1);
	return this;
}

/**
 * @constructor
 * @extends {spriter.ObjInfo}
 */
spriter.SpriteObjInfo = function ()
{
	goog.base(this, 'sprite');
}

goog.inherits(spriter.SpriteObjInfo, spriter.ObjInfo);

/** @type {Array.<spriter.SpriteFrame>} */
spriter.SpriteObjInfo.prototype.sprite_frame_array;

/**
 * @return {spriter.SpriteObjInfo} 
 * @param {Object.<string,?>} json 
 */
spriter.SpriteObjInfo.prototype.load = function (json)
{
	var obj_info = this;

	goog.base(this, 'load', json);

	obj_info.sprite_frame_array = [];
	json.frames = spriter.makeArray(json.frames);
	json.frames.forEach(function (frames_json)
	{
		obj_info.sprite_frame_array.push(new spriter.SpriteFrame().load(frames_json));
	});

	return this;
}

/**
 * @constructor
 * @extends {spriter.ObjInfo}
 */
spriter.BoneObjInfo = function ()
{
	goog.base(this, 'bone');
}

goog.inherits(spriter.BoneObjInfo, spriter.ObjInfo);

/** @type {number} */
spriter.BoneObjInfo.prototype.w = 0.0;
/** @type {number} */
spriter.BoneObjInfo.prototype.h = 0.0;

/**
 * @return {spriter.BoneObjInfo} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneObjInfo.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.w = spriter.loadFloat(json, 'w', 0.0);
	this.h = spriter.loadFloat(json, 'h', 0.0);
	return this;
}

/**
 * @constructor
 * @extends {spriter.ObjInfo}
 */
spriter.BoxObjInfo = function ()
{
	goog.base(this, 'box');
}

goog.inherits(spriter.BoxObjInfo, spriter.ObjInfo);

/** @type {number} */
spriter.BoxObjInfo.prototype.w = 0.0;
/** @type {number} */
spriter.BoxObjInfo.prototype.h = 0.0;

/**
 * @return {spriter.BoxObjInfo} 
 * @param {Object.<string,?>} json 
 */
spriter.BoxObjInfo.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.w = spriter.loadFloat(json, 'w', 0.0);
	this.h = spriter.loadFloat(json, 'h', 0.0);
	return this;
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Animation = function ()
{
	goog.base(this);
}

goog.inherits(spriter.Animation, spriter.Element);

/** @type {number} */
spriter.Animation.prototype.length = 0;
/** @type {string} */
spriter.Animation.prototype.looping = "true"; // "true", "false" or "ping_pong"
/** @type {number} */
spriter.Animation.prototype.loop_to = 0;
/** @type {spriter.Mainline} */
spriter.Animation.prototype.mainline;
/** @type {Array.<spriter.Timeline>} */
spriter.Animation.prototype.timeline_array;
/** @type {number} */
spriter.Animation.prototype.min_time = 0;
/** @type {number} */
spriter.Animation.prototype.max_time = 0;

/**
 * @return {spriter.Animation} 
 * @param {Object.<string,?>} json 
 */
spriter.Animation.prototype.load = function (json)
{
	var anim = this;

	goog.base(this, 'load', json);

	anim.length = spriter.loadInt(json, 'length', 0);
	anim.looping = spriter.loadString(json, 'looping', "true");
	anim.loop_to = spriter.loadInt(json, 'loop_to', 0);

	anim.mainline = new spriter.Mainline().load(json.mainline || {});

	anim.timeline_array = [];
	json.timeline = spriter.makeArray(json.timeline);
	json.timeline.forEach(function (timeline_json)
	{
		anim.timeline_array.push(new spriter.Timeline().load(timeline_json));
	});

	anim.min_time = 0;
	anim.max_time = anim.length;

	return anim;
}

/**
 * @constructor
 * @extends {spriter.Element}
 */
spriter.Entity = function ()
{
	goog.base(this);
}

goog.inherits(spriter.Entity, spriter.Element);

/** @type {Array.<spriter.VarDef>} */
spriter.Entity.prototype.var_def_array;
/** @type {Object.<string,spriter.ObjInfo>} */
spriter.Entity.prototype.obj_info_map;
/** @type {Array.<string>} */
spriter.Entity.prototype.obj_info_keys;
/** @type {Object.<string,spriter.Animation>} */
spriter.Entity.prototype.animation_map;
/** @type {Array.<string>} */
spriter.Entity.prototype.animation_keys;

/**
 * @return {spriter.Entity} 
 * @param {Object.<string,?>} json 
 */
spriter.Entity.prototype.load = function (json)
{
	var entity = this;

	goog.base(this, 'load', json);

	entity.var_def_array = [];
	json.var_defs = spriter.makeArray(json.var_defs);
	json.var_defs.forEach(function (var_defs_json)
	{
		switch (var_defs_json.type)
		{
		case 'int':
			entity.var_def_array.push(new spriter.IntVarDef().load(var_defs_json));
			break;
		case 'float':
			entity.var_def_array.push(new spriter.FloatVarDef().load(var_defs_json));
			break;
		case 'string':
			entity.var_def_array.push(new spriter.StringVarDef().load(var_defs_json));
			break;
		default:
			console.log("TODO: spriter.Entity.load", var_defs_json.type, var_defs_json);
			entity.var_def_array.push(new spriter.VarDef(var_defs_json.type).load(var_defs_json));
			break;
		}
	});

	entity.obj_info_map = {};
	entity.obj_info_keys = [];
	json.obj_info = spriter.makeArray(json.obj_info);
	json.obj_info.forEach(function (obj_info_json)
	{
		switch (obj_info_json.type)
		{
		case 'sprite':
			var obj_info = new spriter.SpriteObjInfo().load(obj_info_json);
			break;
		case 'bone':
			var obj_info = new spriter.BoneObjInfo().load(obj_info_json);
			break;
		case 'box':
			var obj_info = new spriter.BoxObjInfo().load(obj_info_json);
			break;
		case 'point':
		case 'sound':
		case 'entity':
		case 'variable':
		default:
			console.log("TODO: spriter.Entity.load", obj_info_json.type, obj_info_json);
			var obj_info = new spriter.ObjInfo(obj_info_json.type).load(obj_info_json);
			break;
		}
		entity.obj_info_map[obj_info.name] = obj_info;
		entity.obj_info_keys.push(obj_info.name);
	});

	entity.animation_map = {};
	entity.animation_keys = [];
	json.animation = spriter.makeArray(json.animation);
	json.animation.forEach(function (animation_json)
	{
		var animation = new spriter.Animation().load(animation_json);
		entity.animation_map[animation.name] = animation;
		entity.animation_keys.push(animation.name);
	});

	return entity;
}

/**
 * @constructor
 */
spriter.Data = function ()
{
	var data = this;

	data.folder_array = [];
	data.entity_map = {};
	data.entity_keys = [];
}

/** @type {Array.<spriter.Folder>} */
spriter.Data.prototype.folder_array;

/** @type {Object.<string,spriter.Entity>} */
spriter.Data.prototype.entity_map;
/** @type {Array.<string>} */
spriter.Data.prototype.entity_keys;

/**
 * @return {spriter.Data} 
 * @param {?} json 
 */
spriter.Data.prototype.load = function (json)
{
	var data = this;

	json = json || {};

	var scon_version = spriter.loadString(json, 'scon_version', "");
	var generator = spriter.loadString(json, 'generator', "");
	var generator_version = spriter.loadString(json, 'generator_version', "");

	data.folder_array = [];
	json.folder = spriter.makeArray(json.folder);
	json.folder.forEach(function (folder_json)
	{
		data.folder_array.push(new spriter.Folder().load(folder_json));
	});

	data.entity_map = {};
	data.entity_keys = [];
	json.entity = spriter.makeArray(json.entity);
	json.entity.forEach(function (entity_json)
	{
		var entity = new spriter.Entity().load(entity_json);
		data.entity_map[entity.name] = entity;
		data.entity_keys.push(entity.name);
	});

	// patch spriter.Object::pivot

	data.entity_keys.forEach(function (entity_key)
	{
		var entity = data.entity_map[entity_key];

		entity.animation_keys.forEach(function (animation_key)
		{
			var animation = entity.animation_map[animation_key];

			animation.timeline_array.forEach(function (timeline)
			{
				timeline.keyframe_array.forEach(function (timeline_keyframe)
				{
					if (timeline_keyframe instanceof spriter.SpriteTimelineKeyframe)
					{
						var sprite = timeline_keyframe.sprite;
						if (sprite.default_pivot)
						{
							var folder = data.folder_array[sprite.folder_index];
							var file = folder && folder.file_array[sprite.file_index];
							if (file)
							{
								sprite.pivot.copy(file.pivot);
							}
						}
					}
				});
			});
		});
	});
	
	return data;
}

/**
 * @return {Object.<string, spriter.Entity>} 
 */
spriter.Data.prototype.getEntities = function ()
{
	return this.entity_map;
}

/**
 * @return {Array.<string>} 
 */
spriter.Data.prototype.getEntityKeys = function ()
{
	return this.entity_keys;
}

/**
 * @return {Object.<string, spriter.Animation>} 
 * @param {string} entity_key 
 */
spriter.Data.prototype.getAnims = function (entity_key)
{
	var entity = this.entity_map && this.entity_map[entity_key];
	if (entity)
	{
		return entity.animation_map;
	}
	return {};
}

/**
 * @return {Array.<string>} 
 * @param {string} entity_key 
 */
spriter.Data.prototype.getAnimKeys = function (entity_key)
{
	var entity = this.entity_map && this.entity_map[entity_key];
	if (entity)
	{
		return entity.animation_keys;
	}
	return [];
}

/**
 * @constructor 
 * @param {spriter.Data=} data 
 */
spriter.Pose = function (data)
{
	this.data = data || null;

	this.bone_array = [];
	this.object_array = [];
}

/** @type {spriter.Data} */
spriter.Pose.prototype.data;

/** @type {string} */
spriter.Pose.prototype.entity_key = "";
/** @type {string} */
spriter.Pose.prototype.anim_key = "";
/** @type {number} */
spriter.Pose.prototype.time = 0;
/** @type {number} */
spriter.Pose.prototype.elapsed_time = 0;

/** @type {boolean} */
spriter.Pose.prototype.dirty = true;

/** @type {Array.<spriter.Bone>} */
spriter.Pose.prototype.bone_array;

/** @type {Array.<spriter.Object>} */
spriter.Pose.prototype.object_array;

/**
 * @return {Object.<string, spriter.Entity>} 
 */
spriter.Pose.prototype.getEntities = function ()
{
	if (this.data)
	{
		return this.data.getEntities();
	}
	return null;
}

/**
 * @return {Array.<string>} 
 */
spriter.Pose.prototype.getEntityKeys = function ()
{
	if (this.data)
	{
		return this.data.getEntityKeys();
	}
	return null;
}

/**
 * @return {spriter.Entity} 
 */
spriter.Pose.prototype.curEntity = function ()
{
	var entity_map = this.data.entity_map;
	return entity_map && entity_map[this.entity_key];
}

/**
 * @return {string}
 */
spriter.Pose.prototype.getEntity = function ()
{
	return this.entity_key;
}

/**
 * @return {void}
 * @param {string} entity_key
 */
spriter.Pose.prototype.setEntity = function (entity_key)
{
	if (this.entity_key !== entity_key)
	{
		this.entity_key = entity_key;
		this.anim_key = "";
		this.time = 0;
		this.dirty = true;
		this.bone_array = [];
		this.object_array = [];
	}
}

/**
 * @return {Object.<string, spriter.Animation>} 
 */
spriter.Pose.prototype.getAnims = function ()
{
	if (this.data)
	{
		return this.data.getAnims(this.entity_key);
	}
	return null;
}

/**
 * @return {Object.<string>} 
 */
spriter.Pose.prototype.getAnimKeys = function ()
{
	if (this.data)
	{
		return this.data.getAnimKeys(this.entity_key);
	}
	return null;
}

/**
 * @return {spriter.Animation} 
 */
spriter.Pose.prototype.curAnim = function ()
{
	var anims = this.getAnims();
	return anims && anims[this.anim_key];
}

/**
 * @return {number} 
 */
spriter.Pose.prototype.curAnimLength = function ()
{
	var pose = this;
	var data = pose.data;
	var entity = data && data.entity_map[pose.entity_key];
	var anim = entity && entity.animation_map[pose.anim_key];
	return (anim && anim.length) || 0;
}

/**
 * @return {string}
 */
spriter.Pose.prototype.getAnim = function ()
{
	return this.anim_key;
}

/**
 * @return {void} 
 * @param {string} anim_key
 */
spriter.Pose.prototype.setAnim = function (anim_key)
{
	if (this.anim_key !== anim_key)
	{
		this.anim_key = anim_key;
		var anim = this.curAnim();
		if (anim)
		{
			this.time = spriter.wrap(this.time, anim.min_time, anim.max_time);
		}
		this.elapsed_time = 0;
		this.dirty = true;
	}
}

/**
 * @return {number}
 */
spriter.Pose.prototype.getTime = function ()
{
	return this.time;
}

/**
 * @return {void} 
 * @param {number} time 
 */
spriter.Pose.prototype.setTime = function (time)
{
	var anim = this.curAnim();
	if (anim)
	{
		time = spriter.wrap(time, anim.min_time, anim.max_time);
	}

	if (this.time !== time)
	{
		this.time = time;
		this.elapsed_time = 0;
		this.dirty = true;
	}
}

/**
 * @return {void}
 * @param {number} elapsed_time
 */
spriter.Pose.prototype.update = function (elapsed_time)
{
	var pose = this;
	pose.elapsed_time += elapsed_time;
	pose.dirty = true;
}

/**
 * @return {void}
 */
spriter.Pose.prototype.strike = function ()
{
	var pose = this;
	if (!pose.dirty) { return; }
	pose.dirty = false;

	var entity = pose.curEntity();

	var anim = pose.curAnim();

	var prev_time = pose.time;
	var elapsed_time = pose.elapsed_time;

	pose.time = pose.time + pose.elapsed_time; // accumulate elapsed time
	pose.elapsed_time = 0; // reset elapsed time for next strike

	var wrapped_min = false;
	var wrapped_max = false;
	if (anim)
	{
		wrapped_min = (elapsed_time < 0) && (pose.time <= anim.min_time);
		wrapped_max = (elapsed_time > 0) && (pose.time >= anim.max_time);
		pose.time = spriter.wrap(pose.time, anim.min_time, anim.max_time);
	}

	var time = pose.time;

	if (anim)
	{
		var mainline_keyframe_array = anim.mainline.keyframe_array;
		var mainline_keyframe_index1 = spriter.Keyframe.find(mainline_keyframe_array, time);
		var mainline_keyframe_index2 = (mainline_keyframe_index1 + 1) % mainline_keyframe_array.length;
		var mainline_keyframe1 = mainline_keyframe_array[mainline_keyframe_index1];
		var mainline_keyframe2 = mainline_keyframe_array[mainline_keyframe_index2];
		var mainline_time1 = mainline_keyframe1.time;
		var mainline_time2 = mainline_keyframe2.time;
		if (mainline_time2 < mainline_time1) { mainline_time2 = anim.length; }
		var mainline_time = time;
		if (mainline_time1 !== mainline_time2)
		{
			var mainline_tween = (time - mainline_time1) / (mainline_time2 - mainline_time1);
			mainline_tween = mainline_keyframe1.curve.evaluate(mainline_tween);
			mainline_time = spriter.tween(mainline_time1, mainline_time2, mainline_tween);
		}

		var timeline_array = anim.timeline_array;

		var data_bone_array = mainline_keyframe1.bone_ref_array;
		var pose_bone_array = pose.bone_array;

		data_bone_array.forEach(function (data_bone, bone_index)
		{
			var timeline_index = data_bone.timeline_index;
			var timeline = timeline_array[timeline_index];
			var timeline_keyframe_array = timeline.keyframe_array;
			var keyframe_index1 = data_bone.keyframe_index;
			var keyframe_index2 = (keyframe_index1 + 1) % timeline_keyframe_array.length;
			var timeline_keyframe1 = timeline_keyframe_array[keyframe_index1];
			var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
			var time1 = timeline_keyframe1.time;
			var time2 = timeline_keyframe2.time;
			if (time2 < time1) { time2 = anim.length; }
			var tween = 0.0;
			if (time1 !== time2)
			{
				tween = (mainline_time - time1) / (time2 - time1);
				tween = timeline_keyframe1.curve.evaluate(tween);
			}

			var pose_bone = pose_bone_array[bone_index] = (pose_bone_array[bone_index] || new spriter.Bone());
			pose_bone.copy(timeline_keyframe1.bone).tween(timeline_keyframe2.bone, tween, timeline_keyframe1.spin);
			pose_bone.name = timeline.name; // set name from timeline
			pose_bone.parent_index = data_bone.parent_index; // set parent from bone_ref
		});

		// clamp output bone array
		pose_bone_array.length = data_bone_array.length;

		// compute bone world space
		pose_bone_array.forEach(function (bone)
		{
			var parent_bone = pose_bone_array[bone.parent_index];
			if (parent_bone)
			{
				spriter.Space.combine(parent_bone.world_space, bone.local_space, bone.world_space);
			}
			else
			{
				bone.world_space.copy(bone.local_space);
			}
		});

		var data_object_array = mainline_keyframe1.object_ref_array;
		var pose_object_array = pose.object_array;

		data_object_array.forEach(function (data_object, object_index)
		{
			var timeline_index = data_object.timeline_index;
			var timeline = timeline_array[timeline_index];
			var timeline_keyframe_array = timeline.keyframe_array;
			var keyframe_index1 = data_object.keyframe_index;
			var keyframe_index2 = (keyframe_index1 + 1) % timeline_keyframe_array.length;
			var timeline_keyframe1 = timeline_keyframe_array[keyframe_index1];
			var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
			var time1 = timeline_keyframe1.time;
			var time2 = timeline_keyframe2.time;
			if (time2 < time1) { time2 = anim.length; }
			var tween = 0.0;
			if (time1 !== time2)
			{
				tween = (mainline_time - time1) / (time2 - time1);
				tween = timeline_keyframe1.curve.evaluate(tween);
			}

			switch (timeline.type)
			{
			case 'sprite':
				var pose_sprite = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.SpriteObject());
				pose_sprite.copy(timeline_keyframe1.sprite).tween(timeline_keyframe2.sprite, tween, timeline_keyframe1.spin);
				pose_sprite.name = timeline.name; // set name from timeline
				pose_sprite.parent_index = data_object.parent_index; // set parent from object_ref
				break;
			case 'bone':
				var pose_bone = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.BoneObject());
				pose_bone.copy(timeline_keyframe1.bone).tween(timeline_keyframe2.bone, tween, timeline_keyframe1.spin);
				pose_bone.name = timeline.name; // set name from timeline
				pose_bone.parent_index = data_object.parent_index; // set parent from object_ref
				break;
			case 'box':
				var pose_box = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.BoxObject());
				pose_box.copy(timeline_keyframe1.box).tween(timeline_keyframe2.box, tween, timeline_keyframe1.spin);
				pose_box.name = timeline.name; // set name from timeline
				pose_box.parent_index = data_object.parent_index; // set parent from object_ref
				break;
			case 'point':
				var pose_point = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.PointObject());
				pose_point.copy(timeline_keyframe1.point).tween(timeline_keyframe2.point, tween, timeline_keyframe1.spin);
				pose_point.name = timeline.name;
				pose_point.parent_index = data_object.parent_index; // set parent from object_ref
				break;
			case 'sound':
				var pose_sound = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.SoundObject());
				pose_sound.copy(timeline_keyframe1.sound).tween(timeline_keyframe2.sound, tween, timeline_keyframe1.spin);
				pose_sound.name = timeline.name;
				break;
			case 'entity':
				var pose_entity = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.EntityObject());
				pose_entity.copy(timeline_keyframe1.entity).tween(timeline_keyframe2.entity, tween, timeline_keyframe1.spin);
				pose_entity.name = timeline.name;
				pose_entity.parent_index = data_object.parent_index; // set parent from object_ref
				break;
			case 'variable':
				var pose_variable = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.VariableObject());
				pose_variable.name = timeline.name;
				pose_variable.copy(timeline_keyframe1.variable).tween(timeline_keyframe2.variable, tween, timeline_keyframe1.spin);
				break;
			default:
				throw new Error(timeline.type);
			}
		});

		// clamp output object array
		pose_object_array.length = data_object_array.length;

		pose_object_array.forEach(function (object)
		{
			switch (object.type)
			{
			case 'sprite':
				var bone = pose_bone_array[object.parent_index];
				if (bone)
				{
					spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				}
				else
				{
					object.world_space.copy(object.local_space);
				}
				var folder = pose.data.folder_array[object.folder_index];
				var file = folder && folder.file_array[object.file_index];
				if (file)
				{
					var offset_x = (0.5 - object.pivot.x) * file.width;
					var offset_y = (0.5 - object.pivot.y) * file.height;
					spriter.Space.translate(object.world_space, offset_x, offset_y);
				}
				break;
			case 'bone':
				var bone = pose_bone_array[object.parent_index];
				if (bone)
				{
					spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				}
				else
				{
					object.world_space.copy(object.local_space);
				}
				break;
			case 'box':
				var bone = pose_bone_array[object.parent_index];
				if (bone)
				{
					spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				}
				else
				{
					object.world_space.copy(object.local_space);
				}
				var box_info = entity.obj_info_map[object.name];
				if (box_info)
				{
					var offset_x = (0.5 - object.pivot.x) * box_info.w;
					var offset_y = (0.5 - object.pivot.y) * box_info.h;
					spriter.Space.translate(object.world_space, offset_x, offset_y);
				}
				break;
			case 'point':
				var bone = pose_bone_array[object.parent_index];
				if (bone)
				{
					spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				}
				else
				{
					object.world_space.copy(object.local_space);
				}
				break;
			case 'sound':
				break;
			case 'entity':
				var bone = pose_bone_array[object.parent_index];
				if (bone)
				{
					spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				}
				else
				{
					object.world_space.copy(object.local_space);
				}
				var sub_pose = object.pose = object.pose || new spriter.Pose(pose.data);
				var sub_entity_key = sub_pose.data.entity_keys[object.entity_index];
				if (sub_entity_key !== sub_pose.getEntity())
				{
					sub_pose.setEntity(sub_entity_key);
				}
				var sub_entity = sub_pose.curEntity();
				var sub_anim_key = sub_entity.animation_keys[object.animation_index];
				if (sub_anim_key !== sub_pose.getAnim())
				{
					sub_pose.setAnim(sub_anim_key);
					var anim_length = sub_pose.curAnimLength();
					var sub_time = object.animation_time * anim_length;
					sub_pose.setTime(sub_time);
				}
				else
				{
					var anim_length = sub_pose.curAnimLength();
					var sub_time = object.animation_time * anim_length;
					var sub_dt = sub_time - sub_pose.getTime();
					sub_pose.update(sub_dt);
				}
				sub_pose.strike();
				break;
			case 'variable':
				break;
			default:
				throw new Error(object.type);
			}
		});
	}
}

/**
 * @return {void}
 */
spriter.deprecated = function ()
{
	//console.log("deprecated");
}

/**
 * @return {void}
 * @param {spriter.Bone} bone
 * @param {spriter.Bone} parent_bone
 */
spriter.combineParent = function (bone, parent_bone)
{
	spriter.deprecated();
	spriter.Space.combine(parent_bone.world_space, bone.local_space, bone.local_space);
}

Object.defineProperty(spriter, 'file', { get: function () { spriter.deprecated(); return spriter.File; } });

Object.defineProperty(spriter, 'folder', { get: function () { spriter.deprecated(); return spriter.Folder; } });

Object.defineProperty(spriter, 'bone', { get: function () { spriter.deprecated(); return spriter.Bone; } });
Object.defineProperty(spriter.Bone.prototype, 'parent', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.parent_index; } });
Object.defineProperty(spriter.Bone.prototype, 'x', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.local_space.position.x; }, set: /** @this {spriter.Bone} */ function (value) { spriter.deprecated(); this.local_space.position.x = value; } });
Object.defineProperty(spriter.Bone.prototype, 'y', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.local_space.position.y; }, set: /** @this {spriter.Bone} */ function (value) { spriter.deprecated(); this.local_space.position.y = value; } });
Object.defineProperty(spriter.Bone.prototype, 'angle', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.local_space.rotation.deg; }, set: /** @this {spriter.Bone} */ function (value) { spriter.deprecated(); this.local_space.rotation.deg = value; } });
Object.defineProperty(spriter.Bone.prototype, 'scale_x', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.local_space.scale.x; }, set: /** @this {spriter.Bone} */ function (value) { spriter.deprecated(); this.local_space.scale.x = value; } });
Object.defineProperty(spriter.Bone.prototype, 'scale_y', { get: /** @this {spriter.Bone} */ function () { spriter.deprecated(); return this.local_space.scale.y; }, set: /** @this {spriter.Bone} */ function (value) { spriter.deprecated(); this.local_space.scale.y = value; } });

Object.defineProperty(spriter, 'object', { get: function () { spriter.deprecated(); return spriter.Object; } });
Object.defineProperty(spriter.Object.prototype, 'parent', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.parent_index; } });
Object.defineProperty(spriter.Object.prototype, 'folder', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.folder_index; } });
Object.defineProperty(spriter.Object.prototype, 'file', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.file_index; } });
Object.defineProperty(spriter.Object.prototype, 'x', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.local_space.position.x; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.local_space.position.x = value; } });
Object.defineProperty(spriter.Object.prototype, 'y', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.local_space.position.y; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.local_space.position.y = value; } });
Object.defineProperty(spriter.Object.prototype, 'angle', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.local_space.rotation.deg; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.local_space.rotation.deg = value; } });
Object.defineProperty(spriter.Object.prototype, 'scale_x', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.local_space.scale.x; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.local_space.scale.x = value; } });
Object.defineProperty(spriter.Object.prototype, 'scale_y', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.local_space.scale.y; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.local_space.scale.y = value; } });
Object.defineProperty(spriter.Object.prototype, 'pivot_x', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.pivot.x; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.pivot.x = value; } });
Object.defineProperty(spriter.Object.prototype, 'pivot_y', { get: /** @this {spriter.Object} */ function () { spriter.deprecated(); return this.pivot.y; }, set: /** @this {spriter.Object} */ function (value) { spriter.deprecated(); this.pivot.y = value; } });

Object.defineProperty(spriter, 'data', { get: function () { spriter.deprecated(); return spriter.Data; } });

Object.defineProperty(spriter, 'pose', { get: function () { spriter.deprecated(); return spriter.Pose; } });
Object.defineProperty(spriter.Pose.prototype, 'tweened_bone_array', { get: /** @this {spriter.Pose} */ function () { spriter.deprecated(); return this.bone_array; } });
Object.defineProperty(spriter.Pose.prototype, 'tweened_object_array', { get: /** @this {spriter.Pose} */ function () { spriter.deprecated(); return this.object_array; } });
