var loadText = function (url, callback)
{
	var req = new XMLHttpRequest();
	req.responseType = 'text';
	req.open("GET", url, true);
	req.addEventListener('error', function (event) {}, false);
	req.addEventListener('abort', function (event) {}, false);
	req.addEventListener('load', function (event) { callback(req.response); }, false);
	req.send();
	return req;
}

var loadImage = function (url, callback)
{
	var image = new Image();
	image.addEventListener('error', function (event) {}, false);
	image.addEventListener('abort', function (event) {}, false);
	image.addEventListener('load', function (event) { callback(image); }, false);
	image.src = url;
	return image;	
}

goog.provide('main');

main.start = function ()
{
	var spriter_data = new spriter.data();
	var spriter_pose = new spriter.pose(spriter_data);
	var images = {};

	loadText("GreyGuy/player.scml", function (text)
	{
		var parser = new DOMParser();
		var spriter_doc = parser.parseFromString(text, 'text/xml');
		var spriter_json_string = xml2json(spriter_doc, '\t');
		var spriter_json = JSON.parse(spriter_json_string);

		spriter_data.load(spriter_json);

		var entity_keys = []; for (entity_key in spriter_pose.getEntities()) { entity_keys.push(entity_key); }
		spriter_pose.setEntity(entity_keys[0]);
	
		var anim_keys = []; for (anim_key in spriter_pose.getAnims()) { anim_keys.push(anim_key); }
		spriter_pose.setAnim(anim_keys[0]);
	
		var next_anim = function ()
		{
			var index = anim_keys.indexOf(spriter_pose.getAnim());
			spriter_pose.setAnim(anim_keys[(index + 1) % anim_keys.length]);
			spriter_pose.setTime(0);
			setTimeout(next_anim, spriter_pose.curAnim().length);
		}
		next_anim();

		for (var folder_idx = 0; folder_idx < spriter_data.folder_array.length; ++folder_idx)
		{
			var folder = spriter_data.folder_array[folder_idx];
			for (var file_idx = 0; file_idx < folder.file_array.length; ++file_idx)
			{
				var file = folder.file_array[file_idx];
				var image_key = file.name;
				images[image_key] = loadImage("GreyGuy/" + file.name, function (image) {});
			}
		}
	});

	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	
	document.body.appendChild(canvas);

	window.addEventListener('resize', function ()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = canvas.width + 'px';
		canvas.style.height = canvas.height + 'px';
	});

	var loop = function (time)
	{
		requestAnimationFrame(loop);

		var ctx = canvas.getContext('2d');

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		// origin at center, x right, y up
		ctx.translate(ctx.canvas.width/2, ctx.canvas.height*2/3); ctx.scale(1, -1);
		
		var dt = 1000 / 60; // ms

		spriter_pose.update(dt);

		spriter_pose.strike();

		var bone_array = spriter_pose.tweened_bone_array;
		var folder_array = spriter_data.folder_array;
		var object_array = spriter_pose.tweened_object_array;

		var world_bone_array = [];

		for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
		{
			var bone = bone_array[bone_idx];

			var world_bone = world_bone_array[bone_idx] = bone.clone();

			if (bone.parent >= 0)
			{
				spriter.combineParent(world_bone, world_bone_array[bone.parent]);
			}
		}

		var world_object_array = [];

		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			var world_object = world_object_array[object_idx] = object.clone();

			if (object.parent >= 0)
			{
				spriter.combineParent(world_object, world_bone_array[object.parent]);
			}
		}

		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			var world_object = world_object_array[object_idx];

			var image = images[file.name];

			ctx.save();
			ctx.translate(world_object.x, world_object.y);
			ctx.rotate(world_object.angle * Math.PI / 180);
			ctx.scale(world_object.scale_x, world_object.scale_y);
			ctx.translate((0.5 - object.pivot_x) * file.width, (0.5 - object.pivot_y) * file.height);
			ctx.scale(1, -1); ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
			ctx.restore();
		}
	}

	requestAnimationFrame(loop);
}
