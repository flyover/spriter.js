/**
 * Copyright (c) 2012 Flyover Games, LLC 
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
var spriter = spriter || {};

/**
 * @return {boolean} 
 * @param {string} value 
 * @param {boolean=} def 
 */
spriter.toBool = function (value, def)
{
	if (value !== undefined)
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
	if (value !== undefined)
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
	if (value !== undefined)
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
	if (value !== undefined)
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
			return /** @type {Array} */ value;
		}

		return [value];
	}

	return def || [];
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
	/** @type {number} */
	this.id = -1;
	/** @type {string} */
	this.name = "";
	/** @type {number} */
	this.width = 0;
	/** @type {number} */
	this.height = 0;
}

/**
 * @return {spriter.file} 
 * @param {Object} json 
 */
spriter.file.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");
	this.width = spriter.toInt(json['@width'], 0);
	this.height = spriter.toInt(json['@height'], 0);
	return this;
}

/**
 * @constructor
 */
spriter.folder = function ()
{
	/** @type {number} */
	this.id = -1;
	/** @type {Array.<spriter.file>} */
	this.file_array = null;
}

/**
 * @return {spriter.folder} 
 * @param {Object} json 
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
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.parent = -1;
	/** @type {number} */
	this.x = 0;
	/** @type {number} */
	this.y = 0;
	/** @type {number} */
	this.angle = 0;
	/** @type {number} */
	this.scale_x = 1;
	/** @type {number} */
	this.scale_y = 1;
}

/**
 * @return {spriter.bone} 
 * @param {Object} json 
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
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.parent = -1;
	/** @type {number} */
	this.timeline = 0;
	/** @type {number} */
	this.key = 0;
}

/**
 * @return {spriter.bone_ref} 
 * @param {Object} json 
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
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.parent = -1;
	/** @type {number} */
	this.folder = 0;
	/** @type {number} */
	this.file = 0;
	/** @type {number} */
	this.x = 0;
	/** @type {number} */
	this.y = 0;
	/** @type {number} */
	this.angle = 0;
	/** @type {number} */
	this.scale_x = 1;
	/** @type {number} */
	this.scale_y = 1;
	/** @type {number} */
	this.pivot_x = 0;
	/** @type {number} */
	this.pivot_y = 1;
	/** @type {number} */
	this.z_index = 0;
	/** @type {number} */
	this.a = 1;
}

/**
 * @return {spriter.object} 
 * @param {Object} json 
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
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.parent = -1;
	/** @type {number} */
	this.timeline = 0;
	/** @type {number} */
	this.key = 0;
	/** @type {number} */
	this.z_index = 0;
}

/**
 * @return {spriter.object_ref} 
 * @param {Object} json 
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
 */
spriter.mainline_key = function ()
{
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.time = 0;
	/** @type {Array.<spriter.bone|spriter.bone_ref>} */
	this.bone_array = null;
	/** @type {Array.<spriter.object|spriter.object_ref>} */
	this.object_array = null;
}

/**
 * @return {spriter.mainline_key} 
 * @param {Object} json 
 */
spriter.mainline_key.prototype.load = function (json)
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
	/** @type {Array.<spriter.mainline_key>} */
	this.key_array = null;
}

/**
 * @return {spriter.mainline} 
 * @param {Object} json 
 */
spriter.mainline.prototype.load = function (json)
{
	this.key_array = [];
	json.key = spriter.toArray(json.key);
	for (var key_idx = 0, key_len = json.key.length; key_idx < key_len; ++key_idx)
	{
		this.key_array.push(new spriter.mainline_key().load(json.key[key_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.timeline_key = function ()
{
	/** @type {number} */
	this.id = -1;
	/** @type {number} */
	this.time = 0;
	/** @type {number} */
	this.spin = 1; // 1: counter-clockwise, -1: clockwise
	/** @type {spriter.bone} */
	this.bone = null;
	/** @type {spriter.object} */
	this.object = null;
}

/**
 * @return {spriter.timeline_key} 
 * @param {Object} json 
 */
spriter.timeline_key.prototype.load = function (json)
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
	/** @type {number} */
	this.id = -1;
	/** @type {string} */
	this.name = "";

	/** @type {Array.<spriter.timeline_key>} */
	this.key_array = null;
}

/**
 * @return {spriter.timeline} 
 * @param {Object} json 
 */
spriter.timeline.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");

	this.key_array = [];
	json.key = spriter.toArray(json.key);
	for (var key_idx = 0, key_len = json.key.length; key_idx < key_len; ++key_idx)
	{
		this.key_array.push(new spriter.timeline_key().load(json.key[key_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.animation = function ()
{
	/** @type {number} */
	this.id = -1;
	/** @type {string} */
	this.name = "";
	/** @type {number} */
	this.length = 0;
	/** @type {string} */
	this.looping = "true"; // "true", "false" or "ping_pong"
	/** @type {number} */
	this.loop_to = 0;
	/** @type {spriter.mainline} */
	this.mainline = null;
	/** @type {Array.<spriter.timeline>} */
	this.timeline_array = null;
}

/**
 * @return {spriter.animation} 
 * @param {Object} json 
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

	return this;
}

/**
 * @constructor
 */
spriter.entity = function ()
{
	/** @type {number} */
	this.id = -1;
	/** @type {string} */
	this.name = "";
	/** @type {Array.<spriter.animation>} */
	this.animation_array = null;
}

/**
 * @return {spriter.entity} 
 * @param {Object} json 
 */
spriter.entity.prototype.load = function (json)
{
	this.id = spriter.toInt(json['@id'], -1);
	this.name = spriter.toString(json['@name'], "");

	this.animation_array = [];
	json.animation = spriter.toArray(json.animation);
	for (var animation_idx = 0, animation_len = json.animation.length; animation_idx < animation_len; ++animation_idx)
	{
		this.animation_array.push(new spriter.animation().load(json.animation[animation_idx]));
	}

	return this;
}

/**
 * @constructor
 */
spriter.data = function ()
{
	/** @type {Array.<spriter.folder>} */
	this.folder_array = null;

	/** @type {Array.<spriter.entity>} */
	this.entity_array = null;
}

/**
 * @return {spriter.data} 
 * @param {Object} json 
 */
spriter.data.prototype.load = function (json)
{
	this.folder_array = [];
	json.folder = spriter.toArray(json.folder);
	for (var folder_idx = 0, folder_len = json.folder.length; folder_idx < folder_len; ++folder_idx)
	{
		this.folder_array.push(new spriter.folder().load(json.folder[folder_idx]));
	}

	this.entity_array = [];
	json.entity = spriter.toArray(json.entity);
	for (var entity_idx = 0; entity_idx < json.entity.length; ++entity_idx)
	{
		this.entity_array.push(new spriter.entity().load(json.entity[entity_idx]));
	}

	return this;
}

/**
 * @return {void} 
 * @param {string} scml 
 */
spriter.data.prototype.parseSCML = function (scml)
{
	var dom_parser = new DOMParser();
	var xml_object = dom_parser.parseFromString(scml, "text/xml");
	var json_string = xml2json(xml_object, "  ");
	var json = /** @type {Object} */ window.JSON.parse(json_string);
	if (json.spriter_data)
	{
		this.load(json.spriter_data);
	}
}

/**
 * @return {void} 
 * @param {string} scml 
 */
spriter.data.prototype.loadFromXmlObject = function (xml_object)
{
	var json_string = xml2json(xml_object, "  ");
	var json = /** @type {Object} */ window.JSON.parse(json_string);
	if (json.spriter_data)
	{
		this.load(json.spriter_data);
	}
};

spriter.data.prototype.prepareImages = function (url, inc_count, dec_count)
{
	var that = this;

	inc_count = inc_count || function(){};
	dec_count = dec_count || function(){};

	var base_path = url.slice(0, url.lastIndexOf('/'));
	var folder_array = that.folder_array;
	for (var folder_idx = 0, folder_len = folder_array.length; folder_idx < folder_len; ++folder_idx)
	{
		var folder = folder_array[folder_idx];
		var file_array = folder.file_array;
		for (var file_idx = 0, file_len = file_array.length; file_idx < file_len; ++file_idx)
		{
			var file = file_array[file_idx];

			inc_count(); // texture_file
			var image = file.image = new Image();
			image.hidden = true;
			image.addEventListener('load', (function (file) { return function (e)
			{
				file.width = file.width || e.target.width;
				file.height = file.height || e.target.height;
				e.target.hidden = false;
				dec_count(); // texture_file
			}
			})(file), false);
			image.addEventListener('error', function (e) { dec_count(); }, false); // texture_file
			image.addEventListener('abort', function (e) { dec_count(); }, false); // texture_file
			image.src = base_path + '/' + file.name;
		}
	}
};

/**
 * @return {void}
 * @param {string} url
 * @param {function()} callback
 */
spriter.data.prototype.loadFromURL = function (url, callback)
{
	var that = this;

	var count = 0;
	var inc_count = function () { count++; }
	var dec_count = function () { if (--count == 0) { callback(); } }

	inc_count(); // url

	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.addEventListener('readystatechange', function (e)
	{
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304)
		{
			return;
		}

		that.parseSCML(req.responseText);

		// load texture files from url

		that.prepareImages(url, inc_count, dec_count);

		dec_count(); // url
	}, 
	false);
	if (req.readyState == 4)
	{
		return;
	}
	req.send(false);
}

/**
 * @return {void}
 * @param {File} input_file
 * @param {FileList} input_files
 * @param {function()} callback
 */
spriter.data.prototype.loadFromFileList = function (input_file, input_files, callback)
{
	var that = this;

	var count = 0;
	var inc_count = function () { count++; }
	var dec_count = function () { if (--count == 0) { callback(); } }

	inc_count(); // input_file

	var file_reader = new FileReader();
	file_reader.addEventListener('load', function (e)
	{
		that.parseSCML(e.target.result);

		// load texture files from file list

		var find_file = function (input_files, texture_name)
		{
			var name = texture_name.toLowerCase() + '$'; // match at end of line only
			for (var idx = 0, len = input_files.length; idx < len; ++idx)
			{
				var input_file = input_files[idx];
				input_file.webkitRelativePath = input_file.webkitRelativePath || "";
				var path = input_file.webkitRelativePath;
				if (path && path.toLowerCase().match(name))
				{
					return input_file;
				}
			}
			return null;
		}

		var folder_array = that.folder_array;
		for (var folder_idx = 0, folder_len = folder_array.length; folder_idx < folder_len; ++folder_idx)
		{
			var folder = folder_array[folder_idx];
			var file_array = folder.file_array;
			for (var file_idx = 0, file_len = file_array.length; file_idx < file_len; ++file_idx)
			{
				var file = file_array[file_idx];
				var texture_file = find_file(input_files, file.name);
				if (texture_file)
				{
					inc_count(); // texture_file
					var texture_file_reader = new FileReader();
					texture_file_reader.addEventListener('load', (function (file) { return function (e)
					{
						var image = file.image = new Image();
						image.hidden = true;
						image.addEventListener('load', function (e)
						{
							file.width = file.width || e.target.width;
							file.height = file.height || e.target.height;
							e.target.hidden = false;
							dec_count(); // texture_file
						},
						false);
						image.addEventListener('error', function (e) { dec_count(); }, false); // texture_file
						image.addEventListener('abort', function (e) { dec_count(); }, false); // texture_file
						image.src = e.target.result;
					}
					})(file), false);
					texture_file_reader.readAsDataURL(texture_file);
				}
			}
		}

		dec_count(); // input_file
	},
	false);
	file_reader.readAsText(input_file);
}

/**
 * @return {void}
 * @param {FileEntry} entry
 * @param {function()} callback
 */
spriter.data.prototype.loadFromFileEntry = function (entry, callback)
{
	var that = this;

	var count = 0;
	var inc_count = function () { count++; }
	var dec_count = function () { if (--count == 0) { callback(); } }

	inc_count(); // entry

	entry.file(function (file)
	{
		var reader = new FileReader();
		reader.addEventListener('load', function (e)
		{
			that.parseSCML(e.target.result);

			// load textures from file entry filesystem root

			var folder_array = that.folder_array;
			for (var folder_idx = 0, folder_len = folder_array.length; folder_idx < folder_len; ++folder_idx)
			{
				var folder = folder_array[folder_idx];
				var file_array = folder.file_array;
				for (var file_idx = 0, file_len = file_array.length; file_idx < file_len; ++file_idx)
				{
					var file = file_array[file_idx];
					inc_count(); // texture_entry
					entry.filesystem.root.getFile(file.name, {}, 
					(function (file) { return function(texture_entry)
					{
						inc_count(); // texture_file
						texture_entry.file(function (texture_file)
						{
							var texture_file_reader = new FileReader();
							texture_file_reader.addEventListener('load', function (e)
							{
								var image = file.image = new Image();
								image.hidden = true;
								image.addEventListener('load', function (e)
								{
									file.width = file.width || e.target.width;
									file.height = file.height || e.target.height;
									e.target.hidden = false;
									dec_count(); // texture_file
								},
								false);
								image.addEventListener('error', function (e) { dec_count(); }, false); // texture_file
								image.addEventListener('abort', function (e) { dec_count(); }, false); // texture_file
								image.src = e.target.result;
							},
							false);
							texture_file_reader.readAsDataURL(texture_file);
						}, 
						function ()
						{
							dec_count(); // texture_file
						});
						dec_count(); // texture_entry
					}
					})(file), 
					(function (file) { return function (e)
					{
						window.console.log("error code: " + e.code + ", could not load texture: " + file.name);
						dec_count(); // texture_entry
					}
					})(file));
				}
			}
			dec_count(); // entry
		},
		false);
		reader.readAsText(file);
	});
}

/**
 * @return {number}
 */
spriter.data.prototype.getNumEntities = function ()
{
	var entity_array = this.entity_array;
	if (entity_array)
	{
		return entity_array.length;
	}
	return 0;
}

/**
 * @return {string}
 * @param {number} entity_index
 */
spriter.data.prototype.getEntityName = function (entity_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		return entity.name;
	}
	return "";
}

/**
 * @return {number} 
 * @param {number} entity_index 
 */
spriter.data.prototype.getNumAnims = function (entity_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		var animation_array = entity.animation_array;
		if (animation_array)
		{
			return animation_array.length;
		}
	}
	return 0;
}

/**
 * @return {string} 
 * @param {number} entity_index 
 * @param {number} anim_index 
 */
spriter.data.prototype.getAnimName = function (entity_index, anim_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		var animation_array = entity.animation_array;
		if (animation_array && (anim_index < animation_array.length))
		{
			var anim = animation_array[anim_index];
			return anim.name;
		}
	}
	return "";
}

/**
 * @return {number} 
 * @param {number} entity_index 
 * @param {number} anim_index 
 */
spriter.data.prototype.getAnimLength = function (entity_index, anim_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		var animation_array = entity.animation_array;
		if (animation_array && (anim_index < animation_array.length))
		{
			var anim = animation_array[anim_index];
			return anim.length;
		}
	}
	return -1;
}

/**
 * @return {number} 
 * @param {number} entity_index 
 * @param {number} anim_index 
 */
spriter.data.prototype.getNumAnimKeys = function (entity_index, anim_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		var animation_array = entity.animation_array;
		if (animation_array && (anim_index < animation_array.length))
		{
			var anim = animation_array[anim_index];
			return anim.mainline.key_array.length;
		}
	}
	return 0;
}

/**
 * @return {number} 
 * @param {number} entity_index 
 * @param {number} anim_index 
 * @param {number} key_index 
 */
spriter.data.prototype.getAnimKeyTime = function (entity_index, anim_index, key_index)
{
	var entity_array = this.entity_array;
	if (entity_array && (entity_index < entity_array.length))
	{
		var entity = entity_array[entity_index];
		var animation_array = entity.animation_array;
		if (animation_array && (anim_index < animation_array.length))
		{
			var anim = animation_array[anim_index];
			var key_array = anim.mainline.key_array;
			if (key_array && (key_index < key_array.length))
			{
				return key_array[key_index].time;
			}
		}
	}
	return 0;
}

/**
 * @constructor 
 * @param {spriter.data=} data 
 */
spriter.pose = function (data)
{
	/** @type {spriter.data} */
	this.m_data = data || null;

	/** @type {number} */
	this.m_entity_index = 0;
	/** @type {number} */
	this.m_anim_index = 0;
	/** @type {number} */
	this.m_time = 0;

	/** @type {boolean} */
	this.m_dirty = true;

	/** @type {number} */
	this.m_mainline_key_index = 0;

	/** @type {Array.<spriter.bone>} */
	this.m_tweened_bone_array = [];

	/** @type {Array.<spriter.object>} */
	this.m_tweened_object_array = [];

	this.isLooping = true;
}

/**
 * @return {number}
 */
spriter.pose.prototype.getNumEntities = function ()
{
	if (this.m_data)
	{
		return this.m_data.getNumEntities();
	}

	return 0;
}

/**
 * @return {number}
 */
spriter.pose.prototype.getEntity = function ()
{
	return this.m_entity_index;
}

/**
 * @return {void}
 * @param {number|string} entity_id
 */
spriter.pose.prototype.setEntity = function (entity_id)
{
	var num_entities = this.getNumEntities();

	if (isFinite(entity_id))
	{
		// set entity by index
		if (entity_id < num_entities)
		{
			this.m_entity_index = /** @type {number} */ entity_id;
			this.m_anim_index = 0;
			this.m_time = 0;
			this.m_dirty = true;
		}
	}
	else
	{
		// set entity by name
		for (var entity_idx = 0; entity_idx < num_entities; ++entity_idx)
		{
			if (entity_id == this.getEntityName(entity_idx))
			{
				this.m_entity_index = entity_idx;
				this.m_anim_index = 0;
				this.m_time = 0;
				this.m_dirty = true;
				break;
			}
		}
	}
}

/**
 * @return {string}
 * @param {number=} entity_index
 */
spriter.pose.prototype.getEntityName = function (entity_index)
{
	entity_index = (entity_index !== undefined)?(entity_index):(this.m_entity_index);
	if (this.m_data)
	{
		return this.m_data.getEntityName(entity_index);
	}
	return "";
}

/**
 * @return {number} 
 * @param {number=} entity_index
 */
spriter.pose.prototype.getNumAnims = function (entity_index)
{
	entity_index = (entity_index !== undefined)?(entity_index):(this.m_entity_index);
	if (this.m_data)
	{
		return this.m_data.getNumAnims(entity_index);
	}
	return 0;
}

/**
 * @return {number}
 */
spriter.pose.prototype.getAnim = function ()
{
	return this.m_anim_index;
}

/**
 * @return {void} 
 * @param {number|string} anim_id
 */
spriter.pose.prototype.setAnim = function (anim_id)
{
	if (isFinite(anim_id))
	{
		// set animation by index
		if ((0 <= anim_id) && (anim_id < this.getNumAnims()))
		{
			this.m_anim_index = /** @type {number} */ anim_id;
			this.m_time = 0;
			this.m_dirty = true;
		}
	}
	else
	{
		// set animation by name
		for (var anim_idx = 0, anim_len = this.getNumAnims(); anim_idx < anim_len; ++anim_idx)
		{
			if (anim_id == this.getAnimName(anim_idx))
			{
				this.m_anim_index = anim_idx;
				this.m_time = 0;
				this.m_dirty = true;
				break;
			}
		}
	}
}

/**
 * @return {void}
 */
spriter.pose.prototype.setNextAnim = function ()
{
	var num_anims = this.getNumAnims();
	if (num_anims > 1)
	{
		this.setAnim((this.getAnim() + 1) % num_anims);
	}
}

/**
 * @return {void}
 */
spriter.pose.prototype.setPrevAnim = function ()
{
	var num_anims = this.getNumAnims();
	if (num_anims > 1)
	{
		this.setAnim((this.getAnim() + num_anims - 1) % num_anims);
	}
}

/**
 * @return {string} 
 * @param {number=} anim_index 
 */
spriter.pose.prototype.getAnimName = function (anim_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	if (this.m_data)
	{
		return this.m_data.getAnimName(entity_index, anim_index);
	}
	return "";
}

/**
 * @return {number} 
 * @param {number=} anim_index 
 */
spriter.pose.prototype.getAnimLength = function (anim_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	if (this.m_data)
	{
		return this.m_data.getAnimLength(entity_index, anim_index);
	}
	return -1;
}

/**
 * @return {number} 
 * @param {number=} anim_index 
 */
spriter.pose.prototype.getNumAnimKeys = function (anim_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	if (this.m_data)
	{
		return this.m_data.getNumAnimKeys(entity_index, anim_index);
	}
	return 0;
}

/**
 * @return {number} 
 * @param {number=} anim_index 
 */
spriter.pose.prototype.getAnimKeyTime = function (anim_index, key_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	if (this.m_data)
	{
		return this.m_data.getAnimKeyTime(entity_index, anim_index, key_index);
	}
	return 0;
}

/**
 * @return {number}
 * @param {number=} anim_index 
 */
spriter.pose.prototype.getNumAnimKeys = function (anim_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	if (this.m_data)
	{
		return this.m_data.getNumAnimKeys(entity_index, anim_index);
	}
	return 0;
}

/**
 * @return {number} 
 * @param {number=} anim_index 
 * @param {number=} key_index 
 */
spriter.pose.prototype.getAnimKeyTime = function (anim_index, key_index)
{
	var entity_index = this.m_entity_index;
	anim_index = (anim_index !== undefined)?(anim_index):(this.m_anim_index);
	key_index = (key_index !== undefined)?(key_index):(this.m_mainline_key_index);
	if (this.m_data)
	{
		return this.m_data.getAnimKeyTime(entity_index, anim_index, key_index);
	}
	return 0;
}

/**
 * @return {number}
 */
spriter.pose.prototype.getTime = function ()
{
	return this.m_time;
}

/**
 * @return {void} 
 * @param {number} time 
 */
spriter.pose.prototype.setTime = function (time)
{
	if (this.m_time != time)
	{
		this.m_time = time;
		this.m_dirty = true;
	}
}

/**
 * @return {number}
 */
spriter.pose.prototype.getKey = function ()
{
	return this.m_mainline_key_index;
}

/**
 * @return {void} 
 * @param {number} key_index 
 */
spriter.pose.prototype.setKey = function (key_index)
{
	if (this.m_mainline_key_index != key_index)
	{
		this.m_time = this.getAnimKeyTime(this.m_anim_index, key_index);
		this.m_dirty = true;
	}
}

/**
 * @return {void}
 * @param {number} elapsed_time
 */
spriter.pose.prototype.update = function (elapsed_time)
{
	var anim_length = this.getAnimLength();

	if (anim_length > 0)
	{
		this.m_time += elapsed_time;

		while (this.m_time < 0) { this.m_time += anim_length; }
		if (this.isLooping) {
			if (this.m_time >= anim_length) { this.m_time = 0; }
		} else {
			if (this.m_time >= anim_length) { this.m_time = anim_length; }
		}

		this.m_dirty = true;
	}
}

/**
 * @return {void}
 */
spriter.pose.prototype.strike = function ()
{
	if (!this.m_dirty) { return; }
	this.m_dirty = false;

	if (this.m_data && this.m_data.entity_array)
	{
		var entity_array = this.m_data.entity_array;
		var entity = entity_array[this.m_entity_index];
		var animation_array = entity.animation_array;
		var animation = animation_array[this.m_anim_index];
		var mainline = animation.mainline;
		var mainline_key_array = mainline.key_array;

		// find key frame based on requested time
		var tween_time = this.m_time;
		var mainline_key_index = 0;
		for (; mainline_key_index < mainline_key_array.length; ++mainline_key_index)
		{
			var mainline_key = mainline_key_array[mainline_key_index];
			if (tween_time < mainline_key.time) { break; }
		}
		if (mainline_key_index > 0) { mainline_key_index--; } // back up one
		this.m_mainline_key_index = mainline_key_index;

		var mainline_key = mainline_key_array[this.m_mainline_key_index];
		var timeline_array = animation.timeline_array;

		var bone_array = mainline_key.bone_array;
		var tweened_bone_array = this.m_tweened_bone_array;

		for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
		{
			var tweened_bone = tweened_bone_array[bone_idx] = (tweened_bone_array[bone_idx] || new spriter.bone());

			var bone = bone_array[bone_idx];
			var timeline_index = bone.timeline;

			if (timeline_index !== undefined)
			{
				// bone is a spriter.bone_ref, dereference
				var key_index = bone.key;
				var timeline = timeline_array[timeline_index];
				var timeline_key_array = timeline.key_array;
				var timeline_key = timeline_key_array[key_index];

				var time1 = timeline_key.time;
				var bone1 = timeline_key.bone;
				tweened_bone.copy(bone1);
				tweened_bone.parent = bone.parent; // set parent from bone_ref

				// see if there's something to tween with
				var timeline_key2 = timeline_key_array[key_index + 1];
				if (timeline_key2 !== undefined)
				{
					var time2 = timeline_key2.time;
					var bone2 = timeline_key2.bone;
					var tween = (tween_time - time1) / (time2 - time1);
					tweened_bone.tween(bone2, tween, timeline_key.spin);
				}
			}
			else
			{
				// bone is a spriter.bone, copy
				bone = /** @type {spriter.bone} */ bone;
				tweened_bone.copy(bone);
			}

			// see if there's a parent transform
			var parent_index = bone.parent;
			if (parent_index >= 0)
			{
				spriter.combineParent(tweened_bone, tweened_bone_array[parent_index]);
			}
		}

		// clamp output bone array
		if (tweened_bone_array.length > bone_array.length)
		{
			tweened_bone_array.length = bone_array.length;
		}

		var object_array = mainline_key.object_array;
		var tweened_object_array = this.m_tweened_object_array;

		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var tweened_object = tweened_object_array[object_idx] = (tweened_object_array[object_idx] || new spriter.object());

			var object = object_array[object_idx];
			var timeline_index = object.timeline;

			if (timeline_index !== undefined)
			{
				// object is a spriter.object_ref, dereference
				var key_index = object.key;
				var timeline = timeline_array[timeline_index];
				var timeline_key_array = timeline.key_array;
				var timeline_key = timeline_key_array[key_index];

				var time1 = timeline_key.time;
				var object1 = timeline_key.object;
				tweened_object.copy(object1);
				tweened_object.parent = object.parent; // set parent from object_ref

				// see if there's something to tween with
				var timeline_key2 = timeline_key_array[key_index + 1];
				if (timeline_key2 !== undefined)
				{
					var time2 = timeline_key2.time;
					var object2 = timeline_key2.object;
					var tween = (tween_time - time1) / (time2 - time1);
					tweened_object.tween(object2, tween, timeline_key.spin);
				}
			}
			else
			{
				// object is a spriter.object, copy
				object = /** @type {spriter.object} */ object;
				tweened_object.copy(object);
			}

			// see if there's a parent transform
			var parent_index = object.parent;
			if (parent_index >= 0)
			{
				spriter.combineParent(tweened_object, tweened_bone_array[parent_index]);
			}
		}

		// clamp output object array
		if (tweened_object_array.length > object_array.length)
		{
			tweened_object_array.length = object_array.length;
		}
	}
}

