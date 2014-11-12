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
 * @param {string} value 
 * @param {boolean=} def 
 */
spriter.toBool = function (value, def)
{
	if (typeof(value) !== 'undefined')
	{
		return 'true' === value ? true : false;
	}
	return def || false;
}

/**
 * @return {number} 
 * @param {string} value 
 * @param {number=} def 
 */
spriter.toInt = function (value, def)
{
	if (typeof(value) !== 'undefined')
	{
		return parseInt(value, 10);
	}
	return def || 0;
}

/**
 * @return {number} 
 * @param {string} value 
 * @param {number=} def 
 */
spriter.toFloat = function (value, def)
{
	if (typeof(value) !== 'undefined')
	{
		return parseFloat(value);
	}
	return def || 0;
}

/**
 * @return {string} 
 * @param {string} value 
 * @param {string=} def 
 */
spriter.toString = function (value, def)
{
	if (typeof(value) !== 'undefined')
	{
		return value;
	}
	return def || "";
}

/**
 * @return {Array}
 * @param {*} value 
 * @param {Array=} def 
 */
spriter.toArray = function (value, def)
{
	if (value)
	{
		if (value.length)
		{
			return /** @type {Array} */ (value);
		}

		return [value];
	}

	return def || [];
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
		if (num <= 0)
		{
			return ((num + min) % (max - min)) - min;
		}
		else
		{
			return ((num - min) % (max - min)) + min;
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
spriter.tween = function (a, b, t)
{
	return a + ((b - a) * t);
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @param {number} spin
 */
spriter.tweenAngle = function (a, b, t, spin)
{
	if ((spin > 0) && (a > b))
	{
		return a + ((b + 360 - a) * t); // counter clockwise
	}
	else if ((spin < 0) && (a < b))
	{
		return a + ((b - 360 - a) * t); // clockwise
	}
	return a + ((b - a) * t);
}

/**
 * @return {void}
 * @param {spriter.bone|spriter.object} bone
 * @param {spriter.bone} parent_bone
 */
spriter.combineParent = function (bone, parent_bone)
{
	bone.x *= parent_bone.scale_x;
	bone.y *= parent_bone.scale_y;

	var rad = parent_bone.angle * Math.PI / 180;
	var rc = Math.cos(rad), rs = Math.sin(rad);
	var tx = bone.x, ty = bone.y;
	bone.x = tx*rc - ty*rs;
	bone.y = tx*rs + ty*rc;

	bone.x += parent_bone.x;
	bone.y += parent_bone.y;
	bone.angle += parent_bone.angle;
	bone.scale_x *= parent_bone.scale_x;
	bone.scale_y *= parent_bone.scale_y;
}

/**
 * @constructor
 */
spriter.file = function ()
{
}

/** @type {number} */
spriter.file.prototype.id = -1;
/** @type {string} */
spriter.file.prototype.name = "";
/** @type {number} */
spriter.file.prototype.width = 0;
/** @type {number} */
spriter.file.prototype.height = 0;
/** @type {number} */
spriter.file.prototype.pivot_x = 0;
/** @type {number} */
spriter.file.prototype.pivot_y = 1;

/**
 * @return {spriter.file} 
 * @param {*} json 
 */
spriter.file.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");
	this.width = spriter.toInt(json['@width'], 0);
	this.height = spriter.toInt(json['@height'], 0);
	this.pivot_x = spriter.toFloat(json['@pivot_x'], 0);
	this.pivot_y = spriter.toFloat(json['@pivot_y'], 1);
	//this.pivot_y = 0-(1-spriter.toFloat(json['@pivot_y'],1));
	return this;
}

/**
 * @constructor
 */
spriter.folder = function ()
{
}

/** @type {number} */
spriter.folder.prototype.id = -1;
/** @type {Array.< spriter.file >} */
spriter.folder.prototype.file_array = null;

/**
 * @return {spriter.folder} 
 * @param {*} json 
 */
spriter.folder.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.file_array = [];
	json.file = spriter.toArray(json.file);
	for (var file_idx = 0, file_len = json.file.length; file_idx < file_len; ++file_idx)
	{
		this.file_array.push(new spriter.file().load(json.file[file_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.bone = function ()
{
}

/** @type {number} */
spriter.bone.prototype.id = -1;
/** @type {number} */
spriter.bone.prototype.parent = -1;
/** @type {number} */
spriter.bone.prototype.x = 0;
/** @type {number} */
spriter.bone.prototype.y = 0;
/** @type {number} */
spriter.bone.prototype.angle = 0;
/** @type {number} */
spriter.bone.prototype.scale_x = 1;
/** @type {number} */
spriter.bone.prototype.scale_y = 1;

/**
 * @return {spriter.bone} 
 * @param {*} json 
 */
spriter.bone.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.parent = spriter.toInt(json['@parent'], -1);
	this.x = spriter.toFloat(json['@x'], 0);
	this.y = spriter.toFloat(json['@y'], 0);
	this.angle = spriter.toFloat(json['@angle'], 0);
	this.scale_x = spriter.toFloat(json['@scale_x'], 1);
	this.scale_y = spriter.toFloat(json['@scale_y'], 1);
	return this;
}

/**
 * @return {spriter.bone}
 * @param {spriter.bone=} other
 */
spriter.bone.prototype.clone = function (other)
{
	return (other || new spriter.bone()).copy(this);
}

/**
 * @return {spriter.bone}
 * @param {spriter.bone} other
 */
spriter.bone.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent = other.parent;
	this.x = other.x;
	this.y = other.y;
	this.angle = other.angle;
	this.scale_x = other.scale_x;
	this.scale_y = other.scale_y;
	return this;
}

/**
 * @return {void}
 * @param {spriter.bone} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.bone.prototype.tween = function (other, tween, spin)
{
	this.x = spriter.tween(this.x, other.x, tween);
	this.y = spriter.tween(this.y, other.y, tween);
	this.angle = spriter.tweenAngle(this.angle, other.angle, tween, spin);
	this.scale_x = spriter.tween(this.scale_x, other.scale_x, tween);
	this.scale_y = spriter.tween(this.scale_y, other.scale_y, tween);
}

/**
 * @constructor
 */
spriter.bone_ref = function ()
{
}

/** @type {number} */
spriter.bone_ref.prototype.id = -1;
/** @type {number} */
spriter.bone_ref.prototype.parent = -1;
/** @type {number} */
spriter.bone_ref.prototype.timeline = 0;
/** @type {number} */
spriter.bone_ref.prototype.key = 0;

/**
 * @return {spriter.bone_ref} 
 * @param {*} json 
 */
spriter.bone_ref.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.parent = spriter.toInt(json['@parent'], -1);
	this.timeline = spriter.toInt(json['@timeline'], 0);
	this.key = spriter.toInt(json['@key'], 0);
	return this;
}

/**
 * @return {spriter.bone_ref}
 * @param {spriter.bone_ref=} other
 */
spriter.bone_ref.prototype.clone = function (other)
{
	return (other || new spriter.bone_ref()).copy(this);
}

/**
 * @return {spriter.bone_ref}
 * @param {spriter.bone_ref} other
 */
spriter.bone_ref.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent = other.parent;
	this.timeline = other.timeline;
	this.key = other.key;
	return this;
}

/**
 * @constructor
 */
spriter.object = function ()
{
}

/** @type {number} */
spriter.object.prototype.id = -1;
/** @type {number} */
spriter.object.prototype.parent = -1;
/** @type {number} */
spriter.object.prototype.folder = 0;
/** @type {number} */
spriter.object.prototype.file = 0;
/** @type {number} */
spriter.object.prototype.x = 0;
/** @type {number} */
spriter.object.prototype.y = 0;
/** @type {number} */
spriter.object.prototype.angle = 0;
/** @type {number} */
spriter.object.prototype.scale_x = 1;
/** @type {number} */
spriter.object.prototype.scale_y = 1;
/** @type {number} */
spriter.object.prototype.pivot_x = 0;
/** @type {number} */
spriter.object.prototype.pivot_y = 1;
/** @type {number} */
spriter.object.prototype.z_index = 0;
/** @type {number} */
spriter.object.prototype.a = 1;

/**
 * @return {spriter.object} 
 * @param {*} json 
 */
spriter.object.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.parent = spriter.toInt(json['@parent'], -1);
	this.folder = spriter.toInt(json['@folder'], 0);
	this.file = spriter.toInt(json['@file'], 0);
	this.x = spriter.toFloat(json['@x'], 0);
	this.y = spriter.toFloat(json['@y'], 0);
	this.angle = spriter.toFloat(json['@angle'], 0);
	this.scale_x = spriter.toFloat(json['@scale_x'], 1);
	this.scale_y = spriter.toFloat(json['@scale_y'], 1);
	this.pivot_x = spriter.toFloat(json['@pivot_x'], 0);
	this.pivot_y = spriter.toFloat(json['@pivot_y'], 1);
	this.z_index = spriter.toInt(json['@z_index'], 0);
	this.a = spriter.toFloat(json['@a'], 1);
	return this;
}

/**
 * @return {spriter.object}
 * @param {spriter.object=} other
 */
spriter.object.prototype.clone = function (other)
{
	return (other || new spriter.object()).copy(this);
}

/**
 * @return {spriter.object}
 * @param {spriter.object} other
 */
spriter.object.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent = other.parent;
	this.folder = other.folder;
	this.file = other.file;
	this.x = other.x;
	this.y = other.y;
	this.angle = other.angle;
	this.scale_x = other.scale_x;
	this.scale_y = other.scale_y;
	this.pivot_x = other.pivot_x;
	this.pivot_y = other.pivot_y;
	this.z_index = other.z_index;
	this.a = other.a;
	return this;
}

/**
 * @return {void}
 * @param {spriter.object} other
 * @param {number} tween
 * @param {number} spin
 */
spriter.object.prototype.tween = function (other, tween, spin)
{
	this.x = spriter.tween(this.x, other.x, tween);
	this.y = spriter.tween(this.y, other.y, tween);
	this.angle = spriter.tweenAngle(this.angle, other.angle, tween, spin);
	this.scale_x = spriter.tween(this.scale_x, other.scale_x, tween);
	this.scale_y = spriter.tween(this.scale_y, other.scale_y, tween);
	this.pivot_x = spriter.tween(this.pivot_x, other.pivot_x, tween);
	this.pivot_y = spriter.tween(this.pivot_y, other.pivot_y, tween);
	this.a = spriter.tween(this.a, other.a, tween);
}

/**
 * @constructor
 */
spriter.object_ref = function ()
{
}

/** @type {number} */
spriter.object_ref.prototype.id = -1;
/** @type {number} */
spriter.object_ref.prototype.parent = -1;
/** @type {number} */
spriter.object_ref.prototype.timeline = 0;
/** @type {number} */
spriter.object_ref.prototype.key = 0;
/** @type {number} */
spriter.object_ref.prototype.z_index = 0;

/**
 * @return {spriter.object_ref} 
 * @param {*} json 
 */
spriter.object_ref.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.parent = spriter.toInt(json['@parent'], -1);
	this.timeline = spriter.toInt(json['@timeline'], 0);
	this.key = spriter.toInt(json['@key'], 0);
	this.z_index = spriter.toInt(json['@z_index'], 0);
	return this;
}

/**
 * @return {spriter.object_ref}
 * @param {spriter.object_ref=} other
 */
spriter.object_ref.prototype.clone = function (other)
{
	return (other || new spriter.object_ref()).copy(this);
}

/**
 * @return {spriter.object_ref}
 * @param {spriter.object_ref} other
 */
spriter.object_ref.prototype.copy = function (other)
{
	this.id = other.id;
	this.parent = other.parent;
	this.timeline = other.timeline;
	this.key = other.key;
	this.z_index = other.z_index;
	return this;
}

/**
 * @constructor
 * @param {number=} time 
 */
spriter.keyframe = function (time)
{
	this.time = time || 0;
}

/** @type {number} */
spriter.keyframe.prototype.time = 0;

/**
 * @return {spriter.keyframe} 
 * @param {*} json 
 */
spriter.keyframe.prototype.load = function (json)
{
	this.time = spriter.toInt(json['@time'], 0);
	return this;
}

/**
 * @return {number} 
 * @param {Array.< spriter.keyframe >} array 
 * @param {number} time 
 */
spriter.keyframe.find = function (array, time)
{
	if (array.length <= 0) { return -1; }
	if (time < array[0].time) { return -1; }
	var last = array.length - 1;
	if (time >= array[last].time) { return last; }
	var lo = 0;
	var hi = last;
	if (hi == 0) { return 0; }
	var current = hi >> 1;
	while (true)
	{
		if (array[current + 1].time <= time) { lo = current + 1; } else { hi = current; }
		if (lo == hi) { return lo; }
		current = (lo + hi) >> 1;
	}
}

/**
 * @constructor
 */
spriter.mainline_keyframe = function ()
{
}

/** @type {number} */
spriter.mainline_keyframe.prototype.id = -1;
/** @type {number} */
spriter.mainline_keyframe.prototype.time = 0;
/** @type {Array.< spriter.bone|spriter.bone_ref >} */
spriter.mainline_keyframe.prototype.bone_array = null;
/** @type {Array.< spriter.object|spriter.object_ref >} */
spriter.mainline_keyframe.prototype.object_array = null;

/**
 * @return {spriter.mainline_keyframe} 
 * @param {*} json 
 */
spriter.mainline_keyframe.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.time = spriter.toInt(json['@time'], 0);

	// combine bones and bone_refs into one array and sort by id
	this.bone_array = [];
	json.bone = spriter.toArray(json.bone);
	for (var bone_idx = 0, bone_len = json.bone.length; bone_idx < bone_len; ++bone_idx)
	{
		this.bone_array.push(new spriter.bone().load(json.bone[bone_idx]));
	}
	json.bone_ref = spriter.toArray(json.bone_ref);
	for (var bone_ref_idx = 0, bone_ref_len = json.bone_ref.length; bone_ref_idx < bone_ref_len; ++bone_ref_idx)
	{
		this.bone_array.push(new spriter.bone_ref().load(json.bone_ref[bone_ref_idx]));
	}
	this.bone_array.sort(function (a, b) { return a.id - b.id; });

	// combine objects and object_refs into one array and sort by id
	this.object_array = [];
	json.object = spriter.toArray(json.object);
	for (var object_idx = 0, object_len = json.object.length; object_idx < object_len; ++object_idx)
	{
		this.object_array.push(new spriter.object().load(json.object[object_idx]));
	}
	json.object_ref = spriter.toArray(json.object_ref);
	for (var object_ref_idx = 0, object_ref_len = json.object_ref.length; object_ref_idx < object_ref_len; ++object_ref_idx)
	{
		this.object_array.push(new spriter.object_ref().load(json.object_ref[object_ref_idx]));
	}
	this.object_array.sort(function (a, b) { return a.id - b.id; });

	return this;
}

/**
 * @constructor
 */
spriter.mainline = function ()
{
}

/** @type {Array.< spriter.mainline_keyframe >} */
spriter.mainline.prototype.keyframe_array = null;

/**
 * @return {spriter.mainline} 
 * @param {*} json 
 */
spriter.mainline.prototype.load = function (json)
{
	this.keyframe_array = [];
	json.key = spriter.toArray(json.key);
	for (var key_idx = 0, key_len = json.key.length; key_idx < key_len; ++key_idx)
	{
		this.keyframe_array.push(new spriter.mainline_keyframe().load(json.key[key_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.timeline_keyframe = function ()
{
}

/** @type {number} */
spriter.timeline_keyframe.prototype.id = -1;
/** @type {number} */
spriter.timeline_keyframe.prototype.time = 0;
/** @type {number} */
spriter.timeline_keyframe.prototype.spin = 1; // 1: counter-clockwise, -1: clockwise
/** @type {spriter.bone} */
spriter.timeline_keyframe.prototype.bone = null;
/** @type {spriter.object} */
spriter.timeline_keyframe.prototype.object = null;

/**
 * @return {spriter.timeline_keyframe} 
 * @param {*} json 
 */
spriter.timeline_keyframe.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.time = spriter.toInt(json['@time'], 0);
	this.spin = spriter.toInt(json['@spin'], 1);

	var bone = json.bone;
	// if bone is all defaults this happens
	if ((0 === bone) || (null === bone))
	{
		bone = {};
	}
	if (bone)
	{
		this.bone = new spriter.bone().load(bone);
	}

	var object = json.object;
	// if object is all defaults this happens
	if ((0 === object) || (null === object))
	{
		object = {};
	}
	if (object)
	{
		this.object = new spriter.object().load(object);
	}

	return this;
}

/**
 * @constructor
 */
spriter.timeline = function ()
{
}

/** @type {number} */
spriter.timeline.prototype.id = -1;
/** @type {string} */
spriter.timeline.prototype.name = "";

/** @type {Array.< spriter.timeline_keyframe >} */
spriter.timeline.prototype.keyframe_array = null;

/**
 * @return {spriter.timeline} 
 * @param {*} json 
 */
spriter.timeline.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");

	this.keyframe_array = [];
	json.key = spriter.toArray(json.key);
	for (var key_idx = 0, key_len = json.key.length; key_idx < key_len; ++key_idx)
	{
		this.keyframe_array.push(new spriter.timeline_keyframe().load(json.key[key_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.animation = function ()
{
}

/** @type {number} */
spriter.animation.prototype.id = -1;
/** @type {string} */
spriter.animation.prototype.name = "";
/** @type {number} */
spriter.animation.prototype.length = 0;
/** @type {string} */
spriter.animation.prototype.looping = "true"; // "true", "false" or "ping_pong"
/** @type {number} */
spriter.animation.prototype.loop_to = 0;
/** @type {spriter.mainline} */
spriter.animation.prototype.mainline = null;
/** @type {Array.< spriter.timeline >} */
spriter.animation.prototype.timeline_array = null;
/** @type {number} */
spriter.animation.prototype.min_time = 0;
/** @type {number} */
spriter.animation.prototype.max_time = 0;

/**
 * @return {spriter.animation} 
 * @param {*} json 
 */
spriter.animation.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");
	this.length = spriter.toInt(json['@length'], 0);
	this.looping = spriter.toString(json['@looping'], "true");
	this.loop_to = spriter.toInt(json['@loop_to'], 0);

	json.mainline = json.mainline || {};
	this.mainline = new spriter.mainline().load(json.mainline);

	this.timeline_array = [];
	json.timeline = spriter.toArray(json.timeline);
	for (var timeline_idx = 0, timeline_len = json.timeline.length; timeline_idx < timeline_len; ++timeline_idx)
	{
		this.timeline_array.push(new spriter.timeline().load(json.timeline[timeline_idx]));
	}

	this.min_time = 0;
	this.max_time = this.length;

	return this;
}

/**
 * @constructor
 */
spriter.entity = function ()
{
}

/** @type {number} */
spriter.entity.prototype.id = -1;
/** @type {string} */
spriter.entity.prototype.name = "";
/** @type {Array.< spriter.animation >} */
spriter.entity.prototype.animation_array = null;
/** @type {Object.< string, spriter.animation >} */
spriter.entity.prototype.animation_map = null;

/**
 * @return {spriter.entity} 
 * @param {*} json 
 */
spriter.entity.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");

	this.animation_array = [];
	this.animation_map = {};
	json.animation = spriter.toArray(json.animation);
	for (var animation_idx = 0, animation_len = json.animation.length; animation_idx < animation_len; ++animation_idx)
	{
		var animation = new spriter.animation().load(json.animation[animation_idx]);
		this.animation_array.push(animation);
		this.animation_map[animation.name] = animation;
	}

	return this;
}

/**
 * @constructor
 */
spriter.data = function ()
{
}

/** @type {Array.< spriter.folder >} */
spriter.data.prototype.folder_array = null;

/** @type {Array.< spriter.entity >} */
spriter.data.prototype.entity_array = null;
/** @type {Object.< string,spriter.entity >} */
spriter.data.prototype.entity_map = null;

/**
 * @return {spriter.data} 
 * @param {*} json 
 */
spriter.data.prototype.load = function (json)
{
	json.spriter_data = json.spriter_data || {};

	this.folder_array = [];
	json.spriter_data.folder = spriter.toArray(json.spriter_data.folder);
	for (var folder_idx = 0, folder_len = json.spriter_data.folder.length; folder_idx < folder_len; ++folder_idx)
	{
		this.folder_array.push(new spriter.folder().load(json.spriter_data.folder[folder_idx]));
	}

	this.entity_array = [];
	this.entity_map = {};
	json.spriter_data.entity = spriter.toArray(json.spriter_data.entity);
	for (var entity_idx = 0; entity_idx < json.spriter_data.entity.length; ++entity_idx)
	{
		var entity = new spriter.entity().load(json.spriter_data.entity[entity_idx]);
		this.entity_array.push(entity);
		this.entity_map[entity.name] = entity;
	}

	return this;
}

/**
 * @return {Object.< string, spriter.entity >} 
 */
spriter.data.prototype.getEntities = function ()
{
	return this.entity_map;
}

/**
 * @return {Object.< string, spriter.animation >} 
 * @param {string} entity_key 
 */
spriter.data.prototype.getAnims = function (entity_key)
{
	var entity = this.entity_map && this.entity_map[entity_key];
	if (entity)
	{
		return entity.animation_map;
	}
	return null;
}

/**
 * @constructor 
 * @param {spriter.data=} data 
 */
spriter.pose = function (data)
{
	this.data = data || null;

	this.tweened_bone_array = [];
	this.tweened_object_array = [];
}

/** @type {spriter.data} */
spriter.pose.prototype.data;

/** @type {string} */
spriter.pose.prototype.current_entity_key = "";
/** @type {string} */
spriter.pose.prototype.current_anim_key = "";
/** @type {number} */
spriter.pose.prototype.time = 0;
/** @type {number} */
spriter.pose.prototype.elapsed_time = 0;

/** @type {boolean} */
spriter.pose.prototype.dirty = true;

/** @type {Array.< spriter.bone >} */
spriter.pose.prototype.tweened_bone_array;

/** @type {Array.< spriter.object >} */
spriter.pose.prototype.tweened_object_array;

/**
 * @return {Object.< string, spriter.entity >} 
 */
spriter.pose.prototype.getEntities = function ()
{
	if (this.data)
	{
		return this.data.getEntities();
	}
	return null;
}

/**
 * @return {spriter.entity} 
 */
spriter.pose.prototype.curEntity = function ()
{
	var entity_map = this.data.entity_map;
	return entity_map && entity_map[this.current_entity_key];
}

/**
 * @return {string}
 */
spriter.pose.prototype.getEntity = function ()
{
	return this.current_entity_key;
}

/**
 * @return {void}
 * @param {string} entity_key
 */
spriter.pose.prototype.setEntity = function (entity_key)
{
	if (this.current_entity_key != entity_key)
	{
		this.current_entity_key = entity_key;
		this.current_anim_key = "";
		this.time = 0;
		this.dirty = true;
	}
}

/**
 * @return {Object.< string, spriter.animation >} 
 */
spriter.pose.prototype.getAnims = function ()
{
	if (this.data)
	{
		return this.data.getAnims(this.current_entity_key);
	}
	return null;
}

/**
 * @return {spriter.animation} 
 */
spriter.pose.prototype.curAnim = function ()
{
	var anims = this.getAnims();
	return anims && anims[this.current_anim_key];
}

/**
 * @return {string}
 */
spriter.pose.prototype.getAnim = function ()
{
	return this.current_anim_key;
}

/**
 * @return {void} 
 * @param {string} anim_key
 */
spriter.pose.prototype.setAnim = function (anim_key)
{
	if (this.current_anim_key != anim_key)
	{
		this.current_anim_key = anim_key;
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
spriter.pose.prototype.getTime = function ()
{
	return this.time;
}

/**
 * @return {void} 
 * @param {number} time 
 */
spriter.pose.prototype.setTime = function (time)
{
	var anim = this.curAnim();
	if (anim)
	{
		time = spriter.wrap(time, anim.min_time, anim.max_time);
	}

	if (this.time != time)
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
spriter.pose.prototype.update = function (elapsed_time)
{
	this.setTime(this.getTime() + elapsed_time);
}

/**
 * @return {void}
 */
spriter.pose.prototype.strike = function ()
{
	if (!this.dirty) { return; }
	this.dirty = false;

	var entity = this.curEntity();
	var anim = this.curAnim();

	var time = this.time;
	var elapsed_time = this.elapsed_time;

	this.elapsed_time = 0; // reset elapsed time for next update

	if (entity && anim)
	{
		var mainline = anim.mainline;
		var mainline_keyframe_array = mainline.keyframe_array;

		// find key frame based on requested time
		var mainline_keyframe_idx = spriter.keyframe.find(/** @type {Array.< spriter.keyframe >} */ (mainline_keyframe_array), time);

		var mainline_keyframe = mainline_keyframe_array[mainline_keyframe_idx];
		var timeline_array = anim.timeline_array;

		var bone_array = mainline_keyframe.bone_array;
		var tweened_bone_array = this.tweened_bone_array;

		for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
		{
			var tweened_bone = tweened_bone_array[bone_idx] = (tweened_bone_array[bone_idx] || new spriter.bone());

			var bone = bone_array[bone_idx];
			var timeline_index = bone.timeline;

			if (typeof(timeline_index) !== 'undefined')
			{
				// bone is a spriter.bone_ref, dereference
				var keyframe_idx = bone.key;
				var timeline = timeline_array[timeline_index];
				var timeline_keyframeframe_array = timeline.keyframe_array;
				var timeline_keyframe = timeline_keyframeframe_array[keyframe_idx];

				var time1 = timeline_keyframe.time;
				var bone1 = timeline_keyframe.bone;
				tweened_bone.copy(bone1);
				tweened_bone.parent = bone.parent; // set parent from bone_ref

				// see if there's something to tween with
				var keyframe_idx2 = (keyframe_idx + 1) % timeline_keyframeframe_array.length;
				if (keyframe_idx != keyframe_idx2)
				{
					var timeline_keyframe2 = timeline_keyframeframe_array[keyframe_idx2];
					var time2 = timeline_keyframe2.time;
					if (time2 < time1) { time2 = anim.length; }
					var bone2 = timeline_keyframe2.bone;
					var tween = (time - time1) / (time2 - time1);
					tweened_bone.tween(bone2, tween, timeline_keyframe.spin);
				}
			}
			else
			{
				// bone is a spriter.bone, copy
				bone = /** @type {spriter.bone} */ (bone);
				tweened_bone.copy(bone);
			}

///			// see if there's a parent transform
///			var parent_index = bone.parent;
///			if (parent_index >= 0)
///			{
///				spriter.combineParent(tweened_bone, tweened_bone_array[parent_index]);
///			}
		}

		// clamp output bone array
		if (tweened_bone_array.length > bone_array.length)
		{
			tweened_bone_array.length = bone_array.length;
		}

		var object_array = mainline_keyframe.object_array;
		var tweened_object_array = this.tweened_object_array;

		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var tweened_object = tweened_object_array[object_idx] = (tweened_object_array[object_idx] || new spriter.object());

			var object = object_array[object_idx];
			var timeline_index = object.timeline;

			if (typeof(timeline_index) !== 'undefined')
			{
				// object is a spriter.object_ref, dereference
				var keyframe_idx = object.key;
				var timeline = timeline_array[timeline_index];
				var timeline_keyframeframe_array = timeline.keyframe_array;
				var timeline_keyframe = timeline_keyframeframe_array[keyframe_idx];

				var time1 = timeline_keyframe.time;
				var object1 = timeline_keyframe.object;

				// hack: patch file pivot
				var file1 = this.data.folder_array[object1.folder].file_array[object1.file];
				if (object1.pivot_x == 0) { object1.pivot_x = file1.pivot_x; }
				if (object1.pivot_y == 1) { object1.pivot_y = file1.pivot_y; }

				tweened_object.copy(object1);
				tweened_object.parent = object.parent; // set parent from object_ref

				// see if there's something to tween with
				var keyframe_idx2 = (keyframe_idx + 1) % timeline_keyframeframe_array.length;
				if (keyframe_idx != keyframe_idx2)
				{
					var timeline_keyframe2 = timeline_keyframeframe_array[keyframe_idx2];
					var time2 = timeline_keyframe2.time;
					if (time2 < time1) { time2 = anim.length; }
					var object2 = timeline_keyframe2.object;

					// hack: patch file pivot
					var file2 = this.data.folder_array[object2.folder].file_array[object2.file];
					if (object2.pivot_x == 0) { object2.pivot_x = file2.pivot_x; }
					if (object2.pivot_y == 1) { object2.pivot_y = file2.pivot_y; }

					var tween = (time - time1) / (time2 - time1);
					tweened_object.tween(object2, tween, timeline_keyframe.spin);
				}
			}
			else
			{
				// object is a spriter.object, copy
				object = /** @type {spriter.object} */ (object);
				tweened_object.copy(object);
			}

///			// see if there's a parent transform
///			var parent_index = object.parent;
///			if (parent_index >= 0)
///			{
///				spriter.combineParent(tweened_object, tweened_bone_array[parent_index]);
///			}
		}

		// clamp output object array
		if (tweened_object_array.length > object_array.length)
		{
			tweened_object_array.length = object_array.length;
		}
	}
}

