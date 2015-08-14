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
	if ((spin > 0) && (a > b))
	{
		return a + ((b + 2*Math.PI - a) * t); // counter clockwise
	}
	else if ((spin < 0) && (a < b))
	{
		return a + ((b - 2*Math.PI - a) * t); // clockwise
	}
	return a + ((b - a) * t);
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
	space.position.x = spriter.loadFloat(json, '@x', 0);
	space.position.y = spriter.loadFloat(json, '@y', 0);
	space.rotation.deg = spriter.loadFloat(json, '@angle', 0);
	space.scale.x = spriter.loadFloat(json, '@scale_x', 1);
	space.scale.y = spriter.loadFloat(json, '@scale_y', 1);
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
spriter.File = function ()
{
	var file = this;
	file.pivot = new spriter.Pivot();
}

/** @type {number} */
spriter.File.prototype.id = -1;
/** @type {string} */
spriter.File.prototype.name = "";
/** @type {number} */
spriter.File.prototype.width = 0;
/** @type {number} */
spriter.File.prototype.height = 0;
/** @type {spriter.Pivot} */
spriter.File.prototype.pivot;

/**
 * @return {spriter.File} 
 * @param {Object.<string,?>} json 
 */
spriter.File.prototype.load = function (json)
{
	var file = this;
	file.id = spriter.loadInt(json, '@id', -1);
	file.name = spriter.loadString(json, '@name', "");
	file.width = spriter.loadInt(json, '@width', 0);
	file.height = spriter.loadInt(json, '@height', 0);
	file.pivot.x = spriter.loadFloat(json, '@pivot_x', 0);
	file.pivot.y = spriter.loadFloat(json, '@pivot_y', 1);
	return file;
}

/**
 * @constructor
 */
spriter.Folder = function ()
{
	var folder = this;
	folder.file_array = [];
}

/** @type {number} */
spriter.Folder.prototype.id = -1;
/** @type {Array.<spriter.File>} */
spriter.Folder.prototype.file_array;

/**
 * @return {spriter.Folder} 
 * @param {Object.<string,?>} json 
 */
spriter.Folder.prototype.load = function (json)
{
	var folder = this;
	folder.id = spriter.loadInt(json, '@id', -1);
	folder.file_array.length = 0;
	json.file = spriter.makeArray(json.file);
	json.file.forEach(function (file)
	{
		folder.file_array.push(new spriter.File().load(file));
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

/** @type {number} */
spriter.Bone.prototype.id = -1;
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
	this.id = spriter.loadInt(json, '@id', -1);
	this.parent_index = spriter.loadInt(json, '@parent', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	return this;
}

/**
 * @return {spriter.Bone}
 * @param {spriter.Bone=} other
 */
spriter.Bone.prototype.clone = function (other)
{
	return (other || new spriter.Bone()).copy(this);
}

/**
 * @return {spriter.Bone}
 * @param {spriter.Bone} other
 */
spriter.Bone.prototype.copy = function (other)
{
	this.id = other.id;
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
 */
spriter.BoneRef = function ()
{
}

/** @type {number} */
spriter.BoneRef.prototype.id = -1;
/** @type {number} */
spriter.BoneRef.prototype.parent_index = -1;
/** @type {number} */
spriter.BoneRef.prototype.timeline_index = -1;
/** @type {number} */
spriter.BoneRef.prototype.keyframe_index = -1;

/**
 * @return {spriter.BoneRef} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneRef.prototype.load = function (json)
{
	this.id = spriter.loadInt(json, '@id', -1);
	this.parent_index = spriter.loadInt(json, '@parent', -1);
	this.timeline_index = spriter.loadInt(json, '@timeline', -1);
	this.keyframe_index = spriter.loadInt(json, '@key', -1);
	return this;
}

/**
 * @return {spriter.BoneRef}
 * @param {spriter.BoneRef=} other
 */
spriter.BoneRef.prototype.clone = function (other)
{
	return (other || new spriter.BoneRef()).copy(this);
}

/**
 * @return {spriter.BoneRef}
 * @param {spriter.BoneRef} other
 */
spriter.BoneRef.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent_index = other.parent_index;
	this.timeline_index = other.timeline_index;
	this.keyframe_index = other.keyframe_index;
	return this;
}

/**
 * @constructor
 */
spriter.Object = function ()
{
	this.local_space = new spriter.Space();
	this.world_space = new spriter.Space();
	this.pivot = new spriter.Pivot();
}

/** @type {number} */
spriter.Object.prototype.id = -1;
/** @type {number} */
spriter.Object.prototype.parent_index = -1;
/** @type {number} */
spriter.Object.prototype.folder_index = -1;
/** @type {number} */
spriter.Object.prototype.file_index = -1;
/** @type {spriter.Space} */
spriter.Object.prototype.local_space;
/** @type {spriter.Space} */
spriter.Object.prototype.world_space;
/** @type {boolean} */
spriter.Object.prototype.default_pivot = false;
/** @type {spriter.Pivot} */
spriter.Object.prototype.pivot;
/** @type {number} */
spriter.Object.prototype.z_index = 0;
/** @type {number} */
spriter.Object.prototype.alpha = 1;

/**
 * @return {spriter.Object} 
 * @param {Object.<string,?>} json 
 */
spriter.Object.prototype.load = function (json)
{
	this.id = spriter.loadInt(json, '@id', -1);
	this.parent_index = spriter.loadInt(json, '@parent', -1);
	this.folder_index = spriter.loadInt(json, '@folder', -1);
	this.file_index = spriter.loadInt(json, '@file', -1);
	this.local_space.load(json);
	this.world_space.copy(this.local_space);
	if ((typeof(json['@pivot_x']) !== 'undefined') || 
		(typeof(json['@pivot_y']) !== 'undefined'))
	{
		this.pivot.x = spriter.loadFloat(json, '@pivot_x', 0);
		this.pivot.y = spriter.loadFloat(json, '@pivot_y', 1);
	}
	else
	{
		this.default_pivot = true;
	}
	this.z_index = spriter.loadInt(json, '@z_index', 0);
	this.alpha = spriter.loadFloat(json, '@a', 1);
	return this;
}

/**
 * @return {spriter.Object}
 * @param {spriter.Object=} other
 */
spriter.Object.prototype.clone = function (other)
{
	return (other || new spriter.Object()).copy(this);
}

/**
 * @return {spriter.Object}
 * @param {spriter.Object} other
 */
spriter.Object.prototype.copy = function (other)
{
	this.id = other.id;
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
 * @param {spriter.Object} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.Object.prototype.tween = function (other, tween, spin)
{
	spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
	spriter.Vector.tween(this.pivot, other.pivot, tween, this.pivot);
	this.alpha = spriter.tween(this.alpha, other.alpha, tween);
}

/**
 * @constructor
 */
spriter.ObjectRef = function ()
{
}

/** @type {number} */
spriter.ObjectRef.prototype.id = -1;
/** @type {number} */
spriter.ObjectRef.prototype.parent_index = -1;
/** @type {number} */
spriter.ObjectRef.prototype.timeline_index = -1;
/** @type {number} */
spriter.ObjectRef.prototype.keyframe_index = -1;
/** @type {number} */
spriter.ObjectRef.prototype.z_index = 0;

/**
 * @return {spriter.ObjectRef} 
 * @param {Object.<string,?>} json 
 */
spriter.ObjectRef.prototype.load = function (json)
{
	this.id = spriter.loadInt(json ,'@id', -1);
	this.parent_index = spriter.loadInt(json, '@parent', -1);
	this.timeline_index = spriter.loadInt(json, '@timeline', -1);
	this.keyframe_index = spriter.loadInt(json, '@key', -1);
	this.z_index = spriter.loadInt(json, '@z_index', 0);
	return this;
}

/**
 * @return {spriter.ObjectRef}
 * @param {spriter.ObjectRef=} other
 */
spriter.ObjectRef.prototype.clone = function (other)
{
	return (other || new spriter.ObjectRef()).copy(this);
}

/**
 * @return {spriter.ObjectRef}
 * @param {spriter.ObjectRef} other
 */
spriter.ObjectRef.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent_index = other.parent_index;
	this.timeline_index = other.timeline_index;
	this.keyframe_index = other.keyframe_index;
	this.z_index = other.z_index;
	return this;
}

/**
 * @constructor
 */
spriter.Keyframe = function ()
{
}

/** @type {number} */
spriter.Keyframe.prototype.id = -1;
/** @type {number} */
spriter.Keyframe.prototype.time = 0;

/**
 * @return {spriter.Keyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.Keyframe.prototype.load = function (json)
{
	this.id = spriter.loadInt(json, '@id', -1);
	this.time = spriter.loadInt(json, '@time', 0);
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
 * @extends {spriter.Keyframe}
 */
spriter.MainlineKeyframe = function ()
{
	goog.base(this);
}

goog.inherits(spriter.MainlineKeyframe, spriter.Keyframe);

/** @type {Array.<spriter.Bone|spriter.BoneRef>} */
spriter.MainlineKeyframe.prototype.bone_array = null;
/** @type {Array.<spriter.Object|spriter.ObjectRef>} */
spriter.MainlineKeyframe.prototype.object_array = null;

/**
 * @return {spriter.MainlineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.MainlineKeyframe.prototype.load = function (json)
{
	var mainline_keyframe = this;

	goog.base(this, 'load', json)

	// combine bones and bone_refs into one array and sort by id
	mainline_keyframe.bone_array = [];

	json.bone = spriter.makeArray(json.bone);
	json.bone.forEach(function (bone_json)
	{
		mainline_keyframe.bone_array.push(new spriter.Bone().load(bone_json));
	});
	
	json.bone_ref = spriter.makeArray(json.bone_ref);
	json.bone_ref.forEach(function (bone_ref_json)
	{
		mainline_keyframe.bone_array.push(new spriter.BoneRef().load(bone_ref_json));
	});
	
	mainline_keyframe.bone_array = mainline_keyframe.bone_array.sort(function (a, b) { return a.id - b.id; });

	// combine objects and object_refs into one array and sort by id
	mainline_keyframe.object_array = [];
	
	json.object = spriter.makeArray(json.object);
	json.object.forEach(function (object_json)
	{
		mainline_keyframe.object_array.push(new spriter.Object().load(object_json));
	});
	
	json.object_ref = spriter.makeArray(json.object_ref);
	json.object_ref.forEach(function (object_ref_json)
	{
		mainline_keyframe.object_array.push(new spriter.ObjectRef().load(object_ref_json));
	});
	
	mainline_keyframe.object_array = mainline_keyframe.object_array.sort(function (a, b) { return a.id - b.id; });

	return mainline_keyframe;
}

/**
 * @constructor
 */
spriter.Mainline = function ()
{
}

/** @type {Array.<spriter.MainlineKeyframe>} */
spriter.Mainline.prototype.keyframe_array = null;

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
}

goog.inherits(spriter.TimelineKeyframe, spriter.Keyframe);

/** @type {string} */
spriter.TimelineKeyframe.prototype.type = "";
/** @type {number} */
spriter.TimelineKeyframe.prototype.spin = 1; // 1: counter-clockwise, -1: clockwise
/** @type {number} */
spriter.TimelineKeyframe.prototype.curve = 1; // 0: instant, 1: linear, 2: quadratic, 3: cubic
/** @type {number} */
spriter.TimelineKeyframe.prototype.c1 = 0;
/** @type {number} */
spriter.TimelineKeyframe.prototype.c2 = 0;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.TimelineKeyframe.prototype.load = function (json)
{
	this.id = spriter.loadInt(json, '@id', -1);
	this.time = spriter.loadInt(json, '@time', 0);
	this.spin = spriter.loadInt(json, '@spin', 1);
	this.curve = spriter.loadInt(json, '@curve_type', 1);
	this.c1 = spriter.loadInt(json, '@c1', 0);
	this.c2 = spriter.loadInt(json, '@c2', 0);
	return this;
}

spriter.TimelineKeyframe.prototype.evaluateCurve = function (time, time1, time2)
{
	var timeline_keyframe = this;
	if (time1 === time2) { return 0; }
	if (timeline_keyframe.curve === 0) { return 0; } // instant
	var tween = (time - time1) / (time2 - time1);
	if (timeline_keyframe.curve === 1) { return tween; } // linear
	if (timeline_keyframe.curve === 2) { return spriter.interpolateQuadratic(0.0, timeline_keyframe.c1, 1.0, tween); }
	if (timeline_keyframe.curve === 3) { return spriter.interpolateCubic(0.0, timeline_keyframe.c1, timeline_keyframe.c2, 1.0, tween); }
	return 0;
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

/** @type {spriter.Bone} */
spriter.BoneTimelineKeyframe.prototype.bone = null;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.BoneTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.bone = new spriter.Bone().load(json.bone || {});
	return this;
}

/**
 * @constructor
 * @extends {spriter.TimelineKeyframe}
 */
spriter.ObjectTimelineKeyframe = function ()
{
	goog.base(this, 'object');
}

goog.inherits(spriter.ObjectTimelineKeyframe, spriter.TimelineKeyframe);

/** @type {spriter.Object} */
spriter.ObjectTimelineKeyframe.prototype.object = null;

/**
 * @return {spriter.TimelineKeyframe} 
 * @param {Object.<string,?>} json 
 */
spriter.ObjectTimelineKeyframe.prototype.load = function (json)
{
	goog.base(this, 'load', json);
	this.object = new spriter.Object().load(json.object || {});
	return this;
}

/**
 * @constructor
 */
spriter.Timeline = function ()
{
}

/** @type {number} */
spriter.Timeline.prototype.id = -1;
/** @type {string} */
spriter.Timeline.prototype.name = "";
/** @type {string} */
spriter.Timeline.prototype.type = "";
/** @type {number} */
spriter.Timeline.prototype.index = -1;

/** @type {Array.<spriter.TimelineKeyframe>} */
spriter.Timeline.prototype.keyframe_array = null;

/**
 * @return {spriter.Timeline} 
 * @param {Object.<string,?>} json 
 */
spriter.Timeline.prototype.load = function (json)
{
	var timeline = this;

	timeline.id = spriter.loadInt(json, '@id', -1);
	timeline.name = spriter.loadString(json, '@name', "");
	timeline.type = spriter.loadString(json, '@object_type', "sprite");
	timeline.index = spriter.loadInt(json, '@obj', -1);

	timeline.keyframe_array = [];
	json.key = spriter.makeArray(json.key);
	switch (timeline.type)
	{
	case 'sprite':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.ObjectTimelineKeyframe().load(key_json));
		});
		break;
	case 'bone':
		json.key.forEach(function (key_json)
		{
			timeline.keyframe_array.push(new spriter.BoneTimelineKeyframe().load(key_json));
		});
		break;
	case 'box':
	case 'point':
	case 'sound':
	case 'entity':
	case 'variable':
	default:
		console.log("TODO: spriter.Timeline::load", timeline.type);
		break;
	}
	timeline.keyframe_array = timeline.keyframe_array.sort(spriter.Keyframe.compare);

	return timeline;
}

/**
 * @constructor
 */
spriter.Animation = function ()
{
}

/** @type {number} */
spriter.Animation.prototype.id = -1;
/** @type {string} */
spriter.Animation.prototype.name = "";
/** @type {number} */
spriter.Animation.prototype.length = 0;
/** @type {string} */
spriter.Animation.prototype.looping = "true"; // "true", "false" or "ping_pong"
/** @type {number} */
spriter.Animation.prototype.loop_to = 0;
/** @type {spriter.Mainline} */
spriter.Animation.prototype.mainline = null;
/** @type {Array.<spriter.Timeline>} */
spriter.Animation.prototype.timeline_array = null;
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

	anim.id = spriter.loadInt(json, '@id', -1);
	anim.name = spriter.loadString(json, '@name', "");
	anim.length = spriter.loadInt(json, '@length', 0);
	anim.looping = spriter.loadString(json, '@looping', "true");
	anim.loop_to = spriter.loadInt(json, '@loop_to', 0);

	json.mainline = json.mainline || {};
	anim.mainline = new spriter.Mainline().load(json.mainline);

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
 */
spriter.Entity = function ()
{
}

/** @type {number} */
spriter.Entity.prototype.id = -1;
/** @type {string} */
spriter.Entity.prototype.name = "";
/** @type {Object.<string,spriter.Animation>} */
spriter.Entity.prototype.animation_map = null;
/** @type {Array.<string>} */
spriter.Entity.prototype.animation_keys = null;

/**
 * @return {spriter.Entity} 
 * @param {Object.<string,?>} json 
 */
spriter.Entity.prototype.load = function (json)
{
	var entity = this;

	entity.id = spriter.loadInt(json, '@id', -1);
	entity.name = spriter.loadString(json, '@name', "");

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
}

/** @type {Array.<spriter.Folder>} */
spriter.Data.prototype.folder_array = null;

/** @type {Object.<string,spriter.Entity>} */
spriter.Data.prototype.entity_map = null;
/** @type {Array.<string>} */
spriter.Data.prototype.entity_keys = null;

/**
 * @return {spriter.Data} 
 * @param {?} json 
 */
spriter.Data.prototype.load = function (json)
{
	var data = this;

	json.spriter_data = json.spriter_data || {};

	var scml_version = spriter.loadString(json.spriter_data, '@scml_version', "");
	var generator = spriter.loadString(json.spriter_data, '@generator', "");
	var generator_version = spriter.loadString(json.spriter_data, '@generator_version', "");

	data.folder_array = [];
	json.spriter_data.folder = spriter.makeArray(json.spriter_data.folder);
	json.spriter_data.folder.forEach(function (folder)
	{
		data.folder_array.push(new spriter.Folder().load(folder));
	});

	data.entity_map = {};
	data.entity_keys = [];
	json.spriter_data.entity = spriter.makeArray(json.spriter_data.entity);
	json.spriter_data.entity.forEach(function (entity_json)
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

			animation.mainline.keyframe_array.forEach(function (mainline_keyframe)
			{
				mainline_keyframe.object_array.forEach(function (object)
				{
					if (object instanceof spriter.Object)
					{
						if (object.default_pivot)
						{
							var folder = data.folder_array[object.folder_index];
							var file = folder.file_array[object.file_index];
							object.pivot.copy(file.pivot);
						}
					}
				});
			});

			animation.timeline_array.forEach(function (timeline)
			{
				timeline.keyframe_array.forEach(function (timeline_keyframe)
				{
					if (timeline_keyframe instanceof spriter.ObjectTimelineKeyframe)
					{
						var object = timeline_keyframe.object;
						if (object.default_pivot)
						{
							var folder = data.folder_array[object.folder_index];
							var file = folder.file_array[object.file_index];
							object.pivot.copy(file.pivot);
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
	return null;
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
	return null;
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
	this.setTime(this.getTime() + elapsed_time);
}

/**
 * @return {void}
 */
spriter.Pose.prototype.strike = function ()
{
	var pose = this;
	if (!pose.dirty) { return; }
	pose.dirty = false;

	var anim = pose.curAnim();

	var time = pose.time;
	var elapsed_time = pose.elapsed_time;

	pose.elapsed_time = 0; // reset elapsed time for next update

	if (anim)
	{
		var mainline_keyframe_array = anim.mainline.keyframe_array;
		var mainline_keyframe_index = spriter.Keyframe.find(mainline_keyframe_array, time);
		var mainline_keyframe = mainline_keyframe_array[mainline_keyframe_index];

		var timeline_array = anim.timeline_array;

		var data_bone_array = mainline_keyframe.bone_array;
		var pose_bone_array = pose.bone_array;

		data_bone_array.forEach(function (data_bone, bone_index)
		{
			var pose_bone = pose_bone_array[bone_index] = (pose_bone_array[bone_index] || new spriter.Bone());

			if (data_bone instanceof spriter.BoneRef)
			{
				// bone is a spriter.BoneRef, dereference
				var timeline_index = data_bone.timeline_index;
				var keyframe_index = data_bone.keyframe_index;
				var timeline = timeline_array[timeline_index];
				var timeline_keyframe_array = timeline.keyframe_array;
				var timeline_keyframe = timeline_keyframe_array[keyframe_index];

				var time1 = timeline_keyframe.time;
				var bone1 = timeline_keyframe.bone;
				pose_bone.copy(bone1);
				pose_bone.parent_index = data_bone.parent_index; // set parent from bone_ref

				// see if there's something to tween with
				var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
				if (keyframe_index !== keyframe_index2)
				{
					var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
					var time2 = timeline_keyframe2.time;
					if (time2 < time1) { time2 = anim.length; }
					var bone2 = timeline_keyframe2.bone;

					var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
					pose_bone.tween(bone2, tween, timeline_keyframe.spin);
				}
			}
			else if (data_bone instanceof spriter.Bone)
			{
				// bone is a spriter.Bone, copy
				pose_bone.copy(data_bone);
			}
			else
			{
				throw new Error();
			}
		});

		// clamp output bone array
		pose_bone_array.length = data_bone_array.length;

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

		var data_object_array = mainline_keyframe.object_array;
		var pose_object_array = pose.object_array;

		data_object_array.forEach(function (data_object, object_index)
		{
			var pose_object = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.Object());

			if (data_object instanceof spriter.ObjectRef)
			{
				// object is a spriter.ObjectRef, dereference
				var timeline_index = data_object.timeline_index;
				var keyframe_index = data_object.keyframe_index;
				var timeline = timeline_array[timeline_index];
				var timeline_keyframe_array = timeline.keyframe_array;
				var timeline_keyframe = timeline_keyframe_array[keyframe_index];

				var time1 = timeline_keyframe.time;
				var object1 = timeline_keyframe.object;

				pose_object.copy(object1);
				pose_object.parent_index = data_object.parent_index; // set parent from object_ref

				// see if there's something to tween with
				var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
				if (keyframe_index !== keyframe_index2)
				{
					var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
					var time2 = timeline_keyframe2.time;
					if (time2 < time1) { time2 = anim.length; }
					var object2 = timeline_keyframe2.object;

					var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
					pose_object.tween(object2, tween, timeline_keyframe.spin);
				}
			}
			else if (data_object instanceof spriter.Object)
			{
				// object is a spriter.Object, copy
				pose_object.copy(data_object);
			}
			else
			{
				throw new Error();
			}
		});

		// clamp output object array
		pose_object_array.length = data_object_array.length;

		pose_object_array.forEach(function (object)
		{
			var bone = pose_bone_array[object.parent_index];
			if (bone)
			{
				spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
				var folder = pose.data.folder_array[object.folder_index];
				var file = folder.file_array[object.file_index];
				var offset_x = (0.5 - object.pivot.x) * file.width;
				var offset_y = (0.5 - object.pivot.y) * file.height;
				spriter.Space.translate(object.world_space, offset_x, offset_y);
			}
			else
			{
				object.world_space.copy(object.local_space);
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
