goog.provide('main');

goog.require('spriter');
goog.require('atlas');
goog.require('renderCtx2D');
goog.require('renderWebGL');

main.start = function ()
{
	document.body.style.margin = '0px';
	document.body.style.border = '0px';
	document.body.style.padding = '0px';
	document.body.style.overflow = 'hidden';
	document.body.style.fontFamily = '"PT Sans",Arial,"Helvetica Neue",Helvetica,Tahoma,sans-serif';

	var controls = document.createElement('div');
	controls.style.position = 'absolute';
	document.body.appendChild(controls);

	var add_checkbox_control = function (text, checked, callback)
	{
		var control = document.createElement('div');
		var input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = checked;
		input.addEventListener('click', function () { callback(this.checked); }, false);
		control.appendChild(input);
		var label = document.createElement('label');
		label.innerHTML = text;
		control.appendChild(label);
		controls.appendChild(control);
	}

	var messages = document.createElement('div');
	messages.style.position = 'absolute';
	messages.style.left = '0px';
	messages.style.right = '0px';
	messages.style.bottom = '0px';
	messages.style.textAlign = 'center';
	messages.style.zIndex = -1; // behind controls
	document.body.appendChild(messages);

	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = 'absolute';
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	canvas.style.zIndex = -1; // behind controls
	
	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');

	window.addEventListener('resize', function ()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = canvas.width + 'px';
		canvas.style.height = canvas.height + 'px';
	});

	var render_ctx2d = new renderCtx2D(ctx);

	var canvas_gl = document.createElement('canvas');
	canvas_gl.width = window.innerWidth;
	canvas_gl.height = window.innerHeight;
	canvas_gl.style.position = 'absolute';
	canvas_gl.style.width = canvas_gl.width + 'px';
	canvas_gl.style.height = canvas_gl.height + 'px';
	canvas_gl.style.zIndex = -2; // behind 2D context canvas

	document.body.appendChild(canvas_gl);

	var gl = canvas_gl.getContext('webgl') || canvas_gl.getContext('experimental-webgl');

	window.addEventListener('resize', function ()
	{
		canvas_gl.width = window.innerWidth;
		canvas_gl.height = window.innerHeight;
		canvas_gl.style.width = canvas_gl.width + 'px';
		canvas_gl.style.height = canvas_gl.height + 'px';
	});

	var render_webgl = new renderWebGL(gl);

	var camera_x = 0;
	var camera_y = 0;
	var camera_zoom = 1;

	var enable_render_webgl = !!gl;
	var enable_render_ctx2d = !!ctx && !enable_render_webgl;

	add_checkbox_control("GL", enable_render_webgl, function (checked) { enable_render_webgl = checked; });
	add_checkbox_control("2D", enable_render_ctx2d, function (checked) { enable_render_ctx2d = checked; });

	var enable_render_debug_pose = false;

	add_checkbox_control("2D Debug Pose", enable_render_debug_pose, function (checked) { enable_render_debug_pose = checked; });

	var spriter_pose = null;
	var atlas_data = null;

	var anim_time = 0;
	var anim_length = 0;
	var anim_rate = 1;
	var anim_repeat = 2;

	var loadFile = function (file, callback)
	{
		render_ctx2d.dropPose(spriter_pose, atlas_data);
		render_webgl.dropPose(spriter_pose, atlas_data);

		spriter_pose = null;
		atlas_data = null;

		var file_path = file.path;
		var file_scon_url = file_path + file.scon_url;
		var file_atlas_url = (file.atlas_url)?(file_path + file.atlas_url):("");

		loadText(file_scon_url, function (err, text)
		{
			if (err)
			{
				callback();
				return;
			}

			//var parser = new DOMParser();
			//var xml = parser.parseFromString(text, 'text/xml');
			//var json_text = xml2json(xml, '\t');

			spriter_pose = new spriter.Pose(new spriter.Data().load(JSON.parse(text)));

			loadText(file_atlas_url, function (err, atlas_text)
			{
				var images = {};

				var counter = 0;
				var counter_inc = function () { counter++; }
				var counter_dec = function ()
				{
					if (--counter === 0)
					{
						render_ctx2d.loadPose(spriter_pose, atlas_data, images);
						render_webgl.loadPose(spriter_pose, atlas_data, images);
						callback();
					}
				}

				counter_inc();

				if (!err && atlas_text)
				{
					atlas_data = new atlas.Data().importTpsText(atlas_text);

					// load atlas page images
					var dir_path = file_atlas_url.slice(0, file_atlas_url.lastIndexOf('/'));
					atlas_data.pages.forEach(function (page)
					{
						var image_key = page.name;
						var image_url = dir_path + "/" + image_key;
						counter_inc();
						var image = images[image_key] = loadImage(image_url, (function (page) { return function (err, image)
						{
							if (err)
							{
								console.log("error loading:", image.src);
							}
							page.w = page.w || image.width;
							page.h = page.h || image.height;
							counter_dec();
						}})(page));
					});
				}
				else
				{
					spriter_pose.data.folder_array.forEach(function (folder)
					{
						folder.file_array.forEach(function (file)
						{
							var image_key = file.name;
							counter_inc();
							var image = images[image_key] = loadImage(file_path + file.name, function (err, image)
							{
								if (err)
								{
									console.log("error loading:", image.src);
								}
								counter_dec();
							});
						});
					});
				}

				counter_dec();
			});
		});
	}

	var files = [];

	var add_file = function (path, scon_url, atlas_url)
	{
		var file = {};
		file.path = path;
		file.scon_url = scon_url;
		file.atlas_url = atlas_url || "";
		files.push(file);
	}

	add_file("GreyGuy/", "player.scon", "player.tps.json");
	//add_file("https://raw.githubusercontent.com/treefortress/SpriterAS/master/demo/src/assets/spriter/brawler/", "brawler.scml");
	//add_file("https://raw.githubusercontent.com/treefortress/SpriterAS/master/demo/src/assets/spriter/imp/", "imp.scml");
	//add_file("https://raw.githubusercontent.com/treefortress/SpriterAS/master/demo/src/assets/spriter/mage/", "mage.scml");
	//add_file("https://raw.githubusercontent.com/treefortress/SpriterAS/master/demo/src/assets/spriter/orc/", "orc.scml");
	//add_file("https://raw.githubusercontent.com/Malhavok/Spriter2Unity/master/examples/Crabby/Spriter/", "Crabby.scml");

	var file_index = 0;
	var entity_index = 0;
	var anim_index = 0;

	var loading = false;

	var file = files[file_index];
	messages.innerHTML = "loading";
	loading = true; loadFile(file, function ()
	{
		loading = false;
		var entity_keys = spriter_pose.getEntityKeys();
		spriter_pose.setEntity(entity_keys[entity_index = 0]);
		var anim_keys = spriter_pose.getAnimKeys();
		spriter_pose.setAnim(anim_keys[anim_index = 0]);
		spriter_pose.setTime(anim_time = 0);
		anim_length = spriter_pose.curAnimLength() || 1000;
	});

	var prev_time = 0;

	var loop = function (time)
	{
		requestAnimationFrame(loop);

		var dt = time - (prev_time || time); prev_time = time; // ms

		if (!loading)
		{
			spriter_pose.update(dt * anim_rate);

			anim_time += dt * anim_rate;

			if (anim_time >= (anim_length * anim_repeat))
			{
				var anim_keys = spriter_pose.getAnimKeys();
				if (++anim_index >= anim_keys.length)
				{
					anim_index = 0;
					var entity_keys = spriter_pose.getEntityKeys();
					if (++entity_index >= entity_keys.length)
					{
						entity_index = 0;
						if (files.length > 1)
						{
							if (++file_index >= files.length)
							{
								file_index = 0;
							}
							file = files[file_index];
							messages.innerHTML = "loading";
							loading = true; loadFile(file, function ()
							{
								loading = false;
								var entity_keys = spriter_pose.getEntityKeys();
								spriter_pose.setEntity(entity_keys[entity_index = 0]);
								var anim_keys = spriter_pose.getAnimKeys();
								spriter_pose.setAnim(anim_keys[anim_index = 0]);
								spriter_pose.setTime(anim_time = 0);
								anim_length = spriter_pose.curAnimLength() || 1000;
							});
							return;
						}
					}
					spriter_pose.setEntity(entity_keys[entity_index]);
				}
				spriter_pose.setAnim(anim_keys[anim_index]);
				spriter_pose.setTime(anim_time = 0);
				anim_length = spriter_pose.curAnimLength() || 1000;
			}

			var entity_keys = spriter_pose.getEntityKeys();
			var anim_keys = spriter_pose.getAnimKeys();
			messages.innerHTML = "entity: " + entity_keys[entity_index] + ", anim: " + anim_keys[anim_index] + "<br>" + file.path + file.scon_url;
		}

		if (ctx)
		{
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}

		if (gl)
		{
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		if (loading) { return; }

		spriter_pose.strike();

		if (ctx)
		{
			// origin at center, x right, y up
			ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2); ctx.scale(1, -1);

			if (enable_render_ctx2d && enable_render_webgl)
			{
				ctx.translate(-ctx.canvas.width/4, 0);
			}

			ctx.translate(-camera_x, -camera_y);
			ctx.scale(camera_zoom, camera_zoom);
			ctx.lineWidth = 1 / camera_zoom;

			if (enable_render_ctx2d)
			{
				render_ctx2d.drawPose(spriter_pose, atlas_data);
			}

			if (enable_render_debug_pose)
			{
				render_ctx2d.drawDebugPose(spriter_pose, atlas_data);
			}
		}

		if (gl)
		{
			var gl_projection = render_webgl.gl_projection;
			mat3x3Identity(gl_projection);
			mat3x3Ortho(gl_projection, -gl.canvas.width/2, gl.canvas.width/2, -gl.canvas.height/2, gl.canvas.height/2);

			if (enable_render_ctx2d && enable_render_webgl)
			{
				mat3x3Translate(gl_projection, gl.canvas.width/4, 0);
			}

			mat3x3Translate(gl_projection, -camera_x, -camera_y);
			mat3x3Scale(gl_projection, camera_zoom, camera_zoom);

			if (enable_render_webgl)
			{
				render_webgl.drawPose(spriter_pose, atlas_data);
			}
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
		req.addEventListener('load', function (event)
		{
			if (req.status === 200)
			{
				callback(null, req.response);
			}
			else
			{
				callback(req.response, null);
			}
		},
		false);
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
	image.crossOrigin = "Anonymous";
	image.addEventListener('error', function (event) { callback("error", null); }, false);
	image.addEventListener('abort', function (event) { callback("abort", null); }, false);
	image.addEventListener('load', function (event) { callback(null, image); }, false);
	image.src = url;
	return image;	
}
