goog.provide('main');

main.start = function ()
{
	document.body.style.margin = '0px';
	document.body.style.border = '0px';
	document.body.style.padding = '0px';
	document.body.style.overflow = 'hidden';

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

	var camera_x = 0;
	var camera_y = canvas.height/2;
	var camera_zoom = 2;

	var render_debug_data = false;
	var render_debug_pose = false;

	canvas.addEventListener('click', function () { render_debug_pose = !render_debug_pose; }, false);

	var data = new spriter.Data();
	var pose = new spriter.Pose(data);
	var images = {};

	var anim_time = 0;
	var anim_rate = 1;
	var anim_repeat = 2;

	var file_path = "GreyGuy/";
	var file_scml_url = file_path + "player.scml";

	loadText(file_scml_url, function (err, text)
	{
		var parser = new DOMParser();
		var xml = parser.parseFromString(text, 'text/xml');
		var json_string = xml2json(xml, '\t');
		var json = JSON.parse(json_string);

		data.load(json);

		var entity_keys = pose.getEntityKeys();
		pose.setEntity(entity_keys[0]);
	
		var anim_keys = pose.getAnimKeys();
		pose.setAnim(anim_keys[0]);
	
		data.folder_array.forEach(function (folder)
		{
			folder.file_array.forEach(function (file)
			{
				var image_key = file.name;
				images[image_key] = loadImage(file_path + file.name, function (err, image) {});
			});
		});
	});

	var loop = function (time)
	{
		requestAnimationFrame(loop);

		var ctx = canvas.getContext('2d');

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		// origin at center, x right, y up
		ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2); ctx.scale(1, -1);
		
		ctx.translate(-camera_x, -camera_y);
		ctx.scale(camera_zoom, camera_zoom);
		ctx.lineWidth = 1 / camera_zoom;

		var dt = 1000 / 60; // ms

		pose.update(dt * anim_rate);

		anim_time += dt * anim_rate;

		var anim = pose.curAnim();
		if (anim && (anim_time >= (anim.length * anim_repeat)))
		{
			var anim_keys = pose.getAnimKeys();
			var anim_key = anim_keys[(anim_keys.indexOf(pose.getAnim()) + 1) % anim_keys.length];
			pose.setAnim(anim_key);
			pose.setTime(0);
			anim_time = 0;
		}

		pose.strike();

		if (render_debug_pose)
		{
			pose.bone_array.forEach(function (bone)
			{
				ctx.save();
				applySpace(ctx, bone.world_space);
				drawPoint(ctx);
				ctx.restore();
			});

			pose.object_array.forEach(function (object)
			{
				var folder = data.folder_array[object.folder_index];
				var file = folder.file_array[object.file_index];
				ctx.save();
				applySpace(ctx, object.world_space);
				ctx.strokeStyle = 'grey';
				ctx.strokeRect(-file.width/2, -file.height/2, file.width, file.height);
				ctx.restore();
			});
		}
		else
		{
			pose.object_array.forEach(function (object)
			{
				var folder = data.folder_array[object.folder_index];
				var file = folder.file_array[object.file_index];
				var image_key = file.name;
				var image = images[image_key];
				if (image && image.complete)
				{
					ctx.save();
					applySpace(ctx, object.world_space);
					ctx.globalAlpha = object.alpha;
					ctx.scale(1, -1); ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
					ctx.restore();
				}
			});
		}
	}

	requestAnimationFrame(loop);
}

function loadText (url, callback)
{
	var req = new XMLHttpRequest();
	if (url)
	{
		req.open("GET", url, true);
		req.responseType = 'text';
		req.addEventListener('error', function (event) { callback("error", null); }, false);
		req.addEventListener('abort', function (event) { callback("abort", null); }, false);
		req.addEventListener('load', function (event) { callback(null, req.response); }, false);
		req.send();
	}
	else
	{
		callback("error", null);
	}
	return req;
}

function loadImage (url, callback)
{
	var image = new Image();
	image.addEventListener('error', function (event) { callback("error", null); }, false);
	image.addEventListener('abort', function (event) { callback("abort", null); }, false);
	image.addEventListener('load', function (event) { callback(null, image); }, false);
	image.src = url;
	return image;	
}

function applySpace (ctx, space)
{
	ctx.translate(space.position.x, space.position.y);
	ctx.rotate(space.rotation.rad);
	ctx.scale(space.scale.x, space.scale.y);
}

function drawPoint (ctx, color, scale)
{
	scale = scale || 1;
	ctx.beginPath();
	ctx.arc(0, 0, 12*scale, 0, 2*Math.PI, false);
	ctx.strokeStyle = color || 'blue';
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(24*scale, 0);
	ctx.strokeStyle = 'red';
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 24*scale);
	ctx.strokeStyle = 'green';
	ctx.stroke();
}
