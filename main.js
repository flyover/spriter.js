/**
 * Copyright (c) 2012 Flyover Games, LLC 
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
 * @return {void}
 */
var main = function ()
{
	var directions_div = document.body.appendChild(document.createElement('div'));
	var file_input_div = document.body.appendChild(document.createElement('div'));
	var canvas_div = document.body.appendChild(document.createElement('div'));
	var info_div = document.body.appendChild(document.createElement('div'));
	var control_div = document.body.appendChild(document.createElement('div'));

	directions_div.innerHTML = "Drag a Spriter SCML file and associated image directories to canvas.";

	canvas_div.style.display = 'inline-block';

	var canvas_w = 640;
	var canvas_h = 480;

	var camera_x = 0;
	var camera_y = 0;
	var camera_angle = 0;
	var camera_scale = 1;

	var set_camera = function (pose)
	{
		var extent = get_pose_extent(pose);
		for (var i = 0, ict = pose.getNumAnims(); i < ict; ++i)
		{
			pose.setAnim(i);
			/* 
			// get extent for each millisecond 
			for (var t = 0, tct = pose.getAnimLength(); t < tct; ++t)
			{
				pose.setTime(t);
				extent = get_pose_extent(pose, extent);
			}
			*/
			// get extent for each keyframe
			for (var k = 0, kct = pose.getNumAnimKeys(); k < kct; ++k)
			{
				pose.setKey(k);
				extent = get_pose_extent(pose, extent);
			}
		}
		pose.setAnim(0);
		camera_x = (extent.max.x + extent.min.x) / 2;
		camera_y = (extent.max.y + extent.min.y) / 2;
		var scale_x = canvas_w / (extent.max.x - extent.min.x);
		var scale_y = canvas_h / (extent.max.y - extent.min.y);
		camera_scale = 1 / Math.min(scale_x, scale_y);
		camera_scale *= 1.1;
	}

	info_div.innerHTML = "Animation Name: ";

	var pose = new spriter.pose();

	//var url = "test/test.scml";
	var url = "rapido/rapido.scml";

	info_div.innerHTML = "Loading...";
	var data = new spriter.data();
	data.loadFromURL(url, function ()
	{
		pose = new spriter.pose(data);
		set_camera(pose);
		info_div.innerHTML = "Animation Name: " + pose.getAnimName();
	});

	file_input_div.style.display = 'none';
	var file_input = file_input_div.appendChild(document.createElement('input'));
	file_input.type = 'file';
	file_input.directory = file_input.webkitdirectory = "directory";
	var file_label = file_input_div.appendChild(document.createElement('span'));
	file_label.innerHTML = "Drag SCML file parent directory to the file input.";
	file_input.addEventListener('change', function (e)
	{
		var input_files = e.target.files;

		for (var input_file_idx = 0, input_files_len = input_files.length; input_file_idx < input_files_len; ++input_file_idx)
		{
			var input_file = input_files[input_file_idx];
			var ext = input_file.name.split('.').pop();
			if (ext.toLowerCase() != 'scml')
			{
				continue;
			}

			file_label.innerHTML = input_file.name;
			info_div.innerHTML = "Loading...";
			var data = new spriter.data();
			data.loadFromFileList(input_file, input_files, (function (data) { return function ()
			{
				pose = new spriter.pose(data);
				set_camera(pose);
				info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
			})(data));

			break;
		}
	}, 
	false);

	canvas_div.addEventListener('drop', function (e)
	{
		e.preventDefault();

		var items = e.dataTransfer.items;
		for (var i = 0, ct = items.length; i < ct; ++i)
		{
			var entry = items[i].webkitGetAsEntry();
			if (!entry.isFile)
			{
				continue;
			}
			var ext = entry.name.split('.').pop();
			if (ext.toLowerCase() != 'scml')
			{
				continue;
			}

			file_label.innerHTML = entry.name;
			info_div.innerHTML = "Loading...";
			var data = new spriter.data();
			data.loadFromFileEntry(entry, (function (data) { return function ()
			{
				pose = new spriter.pose(data);
				set_camera(pose);
				info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
			})(data));

			break;
		}
	},
	false);

	var cursor_x = 0;
	var cursor_y = 0;
	var cursor_down = false;
	var cursor_down_x = 0;
	var cursor_down_y = 0;

	canvas_div.addEventListener('mousedown', function (e)
	{
		cursor_down = true;
		cursor_down_x = e.offsetX;
		cursor_down_y = e.offsetY;
	}, 
	false);
	canvas_div.addEventListener('mouseup', function (e)
	{
		cursor_down = false;
	}, 
	false);
	canvas_div.addEventListener('mousemove', function (e)
	{
		cursor_x = e.offsetX;
		cursor_y = e.offsetY;

		if (cursor_down)
		{
			var dx = cursor_x - cursor_down_x;
			var dy = cursor_y - cursor_down_y;

			dy = -dy;

			dx *= camera_scale;
			dy *= camera_scale;

			var rad = camera_angle * Math.PI / 180;
			var rc = Math.cos(rad), rs = Math.sin(rad);
			var tx = dx, ty = dy;
			dx = tx*rc - ty*rs;
			dy = tx*rs + ty*rc;

			camera_x -= dx;
			camera_y -= dy;

			cursor_down_x = cursor_x;
			cursor_down_y = cursor_y;
		}
	},
	false);
	canvas_div.addEventListener('mousewheel', function (e)
	{
		if (e.wheelDelta < 0)
		{
			camera_scale *= 1.1;
			camera_scale = Math.min(camera_scale, 100);
		}
		else if (e.wheelDelta > 0)
		{
			camera_scale *= 0.9;
			camera_scale = Math.max(camera_scale, 0.01);
		}
	}, 
	false);

	var canvas_2d = canvas_div.appendChild(document.createElement('canvas'));
	canvas_2d.style.border = '1px solid black';
	canvas_2d.width = canvas_w;
	canvas_2d.height = canvas_h;
	var view_2d = new fo.view_2d(canvas_2d);

	var canvas_gl = canvas_div.appendChild(document.createElement('canvas'));
	canvas_gl.style.border = '1px solid black';
	canvas_gl.width = canvas_w;
	canvas_gl.height = canvas_h;
	var view_gl = new fo.view_gl(canvas_gl);

	var time_scale = 0.25;

	var slider_label = control_div.appendChild(document.createElement('span'));
	var slider = control_div.appendChild(document.createElement('input'));
	var slider_value = control_div.appendChild(document.createElement('span'));
	slider_label.innerHTML = "Time Scale: ";
	slider.type = 'range';
	slider.min = -2.0;
	slider.max = 2.0;
	slider.step = 0.01;
	slider.value = time_scale;
	slider_value.innerHTML = time_scale;
	slider.addEventListener('change', function (e)
	{
		time_scale = parseFloat(e.target.value);
		slider_value.innerHTML = time_scale.toFixed(2);
	}, 
	false);

	var debug_draw = false;

	var checkbox = control_div.appendChild(document.createElement('input'));
	var checkbox_label = control_div.appendChild(document.createElement('span'));
	checkbox.type = 'checkbox';
	checkbox.checked = debug_draw;
	checkbox_label.innerHTML = "Debug Draw";
	checkbox.addEventListener('change', function (e)
	{
		debug_draw = e.target.checked;
	}, 
	false);

	var update = function (tick)
	{
		var anim_time = tick.elapsed_time * time_scale;

		if (pose.getNumAnims() > 1)
		{
			if ((pose.getTime() + anim_time) < 0)
			{
				pose.setPrevAnim();
				info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
			if ((pose.getTime() + anim_time) >= pose.getAnimLength())
			{
				pose.setNextAnim();
				info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
		}

		pose.update(anim_time);
	}

	var draw_2d = function ()
	{
		var ctx_2d = view_2d.ctx_2d;

		if (ctx_2d)
		{
			ctx_2d.clearRect(0, 0, ctx_2d.canvas.width, ctx_2d.canvas.height);

			ctx_2d.save();

				// 0,0 at center, x right, y up
				ctx_2d.translate(ctx_2d.canvas.width / 2, ctx_2d.canvas.height / 2);
				ctx_2d.scale(1, -1);

				// apply camera
				ctx_2d.scale(1 / camera_scale, 1 / camera_scale);
				ctx_2d.rotate(-camera_angle * Math.PI / 180);
				ctx_2d.translate(-camera_x, -camera_y);

				if (debug_draw)
				{
					view_2d.debug_draw_pose_2d(pose);

					var extent = get_pose_extent(pose);
					ctx_2d.lineWidth = 4;
					ctx_2d.lineCap = 'round';
					ctx_2d.strokeStyle = 'blue';
					ctx_2d.strokeRect(
						extent.min.x, extent.min.y, 
						extent.max.x - extent.min.x, 
						extent.max.y - extent.min.y);
				}
				else
				{
					view_2d.draw_pose_2d(pose);
				}

			ctx_2d.restore();
		}
	}

	var draw_gl = function ()
	{
		var ctx_gl = view_gl.ctx_gl;

		if (ctx_gl)
		{
			ctx_gl.clear(ctx_gl.COLOR_BUFFER_BIT | ctx_gl.DEPTH_BUFFER_BIT);

			// apply camera
			var camera_mtx = new fo.m3x2();
			camera_mtx.selfScale(1 / camera_scale, 1 / camera_scale);
			camera_mtx.selfRotateDegrees(-camera_angle);
			camera_mtx.selfTranslate(-camera_x, -camera_y);
			view_gl.load_camera_mtx(camera_mtx);

			view_gl.draw_pose_gl(pose);

			ctx_gl.flush();
		}
	}

	var tick = new Object();
	tick.frame = 0;
	tick.time = 0;
	tick.time_last = 0;
	tick.elapsed_time = 0;

	var loop = function (time)
	{
		window.requestAnimationFrame(loop, null);

		++tick.frame;
		tick.time = time;

		tick.elapsed_time = Math.min(tick.time - tick.time_last, 50);

		update(tick);

		draw_2d();

		draw_gl();
	}

	tick.time_last = new Date().getTime();
	loop(tick.time_last);
}

/**
 * @return {object} 
 * @param {spriter.pose} pose 
 * @param {object=} extent 
 */
var get_pose_extent = function (pose, extent)
{
	extent = extent || { min: { x: 1, y: 1 }, max: { x: -1, y: -1 } };

	var bound = function (v)
	{
		if (extent.min.x > extent.max.x)
		{
			extent.min.x = extent.max.x = v.x;
			extent.min.y = extent.max.y = v.y;
		}
		else
		{
			extent.min.x = Math.min(extent.min.x, v.x);
			extent.max.x = Math.max(extent.max.x, v.x);
			extent.min.y = Math.min(extent.min.y, v.y);
			extent.max.y = Math.max(extent.max.y, v.y);
		}
	}

	var mtx = new fo.m3x2();
	var ll = new fo.v2(-1, -1);
	var lr = new fo.v2( 1, -1);
	var ul = new fo.v2(-1,  1);
	var ur = new fo.v2( 1,  1);
	var tv = new fo.v2(0, 0);

	pose.strike();

	if (pose.m_data && pose.m_data.folder_array)
	{
		var folder_array = pose.m_data.folder_array;
		var object_array = pose.m_tweened_object_array;
		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			mtx.makeIdentity();

			// apply object transform
			mtx.selfTranslate(object.x, object.y);
			mtx.selfRotateDegrees(object.angle);
			mtx.selfScale(object.scale_x, object.scale_y);

			// image extents
			var ex = 0.5 * file.width;
			var ey = 0.5 * file.height;
			mtx.selfScale(ex, ey);

			// local pivot in unit (-1 to +1) coordinates
			var lpx = (object.pivot_x * 2) - 1;
			var lpy = (object.pivot_y * 2) - 1;
			mtx.selfTranslate(-lpx, -lpy);

			bound(mtx.applyVector(ul, tv));
			bound(mtx.applyVector(ur, tv));
			bound(mtx.applyVector(lr, tv));
			bound(mtx.applyVector(ll, tv));
		}
	}

	return extent;
}

var fo = fo || {};

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas_2d 
 */
fo.view_2d = function (canvas_2d)
{
	this.ctx_2d = canvas_2d.getContext('2d');
}

/**
 * @return {void} 
 * @param {spriter.pose} pose 
 */
fo.view_2d.prototype.debug_draw_pose_2d = function (pose)
{
	var ctx_2d = this.ctx_2d;

	pose.strike();

	if (pose.m_data && pose.m_data.folder_array)
	{
		// draw objects
		var folder_array = pose.m_data.folder_array;
		var object_array = pose.m_tweened_object_array;
		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			ctx_2d.save();

				// apply object transform
				ctx_2d.translate(object.x, object.y);
				ctx_2d.rotate(object.angle * Math.PI / 180);
				ctx_2d.scale(object.scale_x, object.scale_y);

				// image extents
				var ex = 0.5 * file.width;
				var ey = 0.5 * file.height;
				//ctx_2d.scale(ex, ey);

				// local pivot in unit (-1 to +1) coordinates
				var lpx = (object.pivot_x * 2) - 1;
				var lpy = (object.pivot_y * 2) - 1;
				//ctx_2d.translate(-lpx, -lpy);
				ctx_2d.translate(-lpx*ex, -lpy*ey);

				ctx_2d.scale(1, -1); // -y for canvas space

				ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
				//ctx_2d.fillRect(-1, -1, 2, 2);
				ctx_2d.fillRect(-ex, -ey, 2*ex, 2*ey);

				ctx_2d.beginPath();
				ctx_2d.moveTo(0, 0);
				ctx_2d.lineTo(32, 0);
				ctx_2d.lineWidth = 2;
				ctx_2d.lineCap = 'round';
				ctx_2d.strokeStyle = 'rgba(127,0,0,0.5)';
				ctx_2d.stroke();

				ctx_2d.beginPath();
				ctx_2d.moveTo(0, 0);
				ctx_2d.lineTo(0, -32);
				ctx_2d.lineWidth = 2;
				ctx_2d.lineCap = 'round';
				ctx_2d.strokeStyle = 'rgba(0,127,0,0.5)';
				ctx_2d.stroke();

			ctx_2d.restore();
		}

		// draw bone hierarchy
		var bone_array = pose.m_tweened_bone_array;
		for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
		{
			var bone = bone_array[bone_idx];

			var parent_index = bone.parent;
			if (parent_index >= 0)
			{
				var parent_bone = bone_array[parent_index];

				ctx_2d.save();

					ctx_2d.beginPath();
					ctx_2d.moveTo(bone.x, bone.y);
					ctx_2d.lineTo(parent_bone.x, parent_bone.y);
					ctx_2d.lineWidth = 2;
					ctx_2d.lineCap = 'round';
					ctx_2d.strokeStyle = 'grey';
					ctx_2d.stroke();

				ctx_2d.restore();
			}
		}

		// draw bones
		var bone_array = pose.m_tweened_bone_array;
		for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
		{
			var bone = bone_array[bone_idx];

			ctx_2d.save();

				// apply bone transform
				ctx_2d.translate(bone.x, bone.y);
				ctx_2d.rotate(bone.angle * Math.PI / 180);

				ctx_2d.beginPath();
				ctx_2d.moveTo(0, 0);
				ctx_2d.lineTo(bone.scale_x * 32, 0);
				ctx_2d.lineWidth = 2;
				ctx_2d.lineCap = 'round';
				ctx_2d.strokeStyle = 'red';
				ctx_2d.stroke();

				ctx_2d.beginPath();
				ctx_2d.moveTo(0, 0);
				ctx_2d.lineTo(0, bone.scale_y * 32);
				ctx_2d.lineWidth = 2;
				ctx_2d.lineCap = 'round';
				ctx_2d.strokeStyle = 'green';
				ctx_2d.stroke();

			ctx_2d.restore();
		}
	}
}

/**
 * @return {void} 
 * @param {spriter.pose} pose 
 */
fo.view_2d.prototype.draw_pose_2d = function (pose)
{
	var ctx_2d = this.ctx_2d;

	pose.strike();

	if (pose.m_data && pose.m_data.folder_array)
	{
		var folder_array = pose.m_data.folder_array;
		var object_array = pose.m_tweened_object_array;
		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			ctx_2d.save();

				// apply object transform
				ctx_2d.translate(object.x, object.y);
				ctx_2d.rotate(object.angle * Math.PI / 180);
				ctx_2d.scale(object.scale_x, object.scale_y);

				// image extents
				var ex = 0.5 * file.width;
				var ey = 0.5 * file.height;
				//ctx_2d.scale(ex, ey);

				// local pivot in unit (-1 to +1) coordinates
				var lpx = (object.pivot_x * 2) - 1;
				var lpy = (object.pivot_y * 2) - 1;
				//ctx_2d.translate(-lpx, -lpy);
				ctx_2d.translate(-lpx*ex, -lpy*ey);

				if (file.image && !file.image.hidden)
				{
					ctx_2d.scale(1, -1); // -y for canvas space

					ctx_2d.globalAlpha = object.a;

					//ctx_2d.drawImage(file.image, -1, -1, 2, 2);
					ctx_2d.drawImage(file.image, -ex, -ey, 2*ex, 2*ey);
				}
				else
				{
					ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
					//ctx_2d.fillRect(-1, -1, 2, 2);
					ctx_2d.fillRect(-ex, -ey, 2*ex, 2*ey);
				}

			ctx_2d.restore();
		}
	}
}

var fo = fo || {};

/**
 * @constructor 
 * @param {HTMLCanvasElement} canvas_gl 
 */
fo.view_gl = function (canvas_gl)
{
	var opt_gl = {};

	var ctx_gl = canvas_gl.getContext('webgl', opt_gl);
	ctx_gl = ctx_gl || canvas_gl.getContext('experimental-webgl', opt_gl);
	ctx_gl = ctx_gl || canvas_gl.getContext('webkit-3d', opt_gl);
	ctx_gl = ctx_gl || canvas_gl.getContext('moz-webgl', opt_gl);
	this.ctx_gl = ctx_gl;

	if (!ctx_gl)
	{
		canvas_gl.style.backgroundColor = 'rgba(127,0,0,1.0)';
	}

	if (ctx_gl)
	{
		//window.console.log(ctx_gl.getSupportedExtensions());

		if (!ctx_gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc') && 
			!ctx_gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc'))
		{
			window.console.log("No WebGL Compressed Texture S3TC");
		}
	}

	if (ctx_gl)
	{
		ctx_gl.clearColor(0.0, 0.0, 0.0, 0.0);
		ctx_gl.clearDepth(1.0);

		ctx_gl.depthFunc(ctx_gl.LEQUAL);
		ctx_gl.enable(ctx_gl.DEPTH_TEST);

		//ctx_gl.alphaTest(ctx_gl.GREATER, 0.5);
		//ctx_gl.enable(ctx_gl.ALPHA_TEST);

		ctx_gl.blendFunc(ctx_gl.ONE, ctx_gl.ONE_MINUS_SRC_ALPHA);
		ctx_gl.enable(ctx_gl.BLEND);

		ctx_gl.viewport(0, 0, ctx_gl.canvas.width, ctx_gl.canvas.height);

		// matrices
		var uMatrixP = this.uMatrixP = new Float32Array(16); // projection matrix
		var uMatrixC = this.uMatrixC = new Float32Array(16); // camera matrix
		var uMatrixM = this.uMatrixM = new Float32Array(16); // modelview matrix

		var uGlobalAlpha = this.uGlobalAlpha = new Float32Array(1);

		var mtx = new fo.m3x2();
		mtx.selfScale(2 / ctx_gl.canvas.width, 2 / ctx_gl.canvas.height);
		this.load_projection_mtx(mtx);

		this.load_camera_mtx(fo.m3x2.IDENTITY);

		this.load_modelview_mtx(fo.m3x2.IDENTITY);

		var compile_shader = function (src, type)
		{
			var shader = ctx_gl.createShader(type);
			ctx_gl.shaderSource(shader, src);
			ctx_gl.compileShader(shader);
			if (!ctx_gl.getShaderParameter(shader, ctx_gl.COMPILE_STATUS))
			{
				window.console.log(ctx_gl.getShaderInfoLog(shader));
				ctx_gl.deleteShader(shader);
				shader = null;
			}
			return shader;
		}

		// vertex shader
		var vs_src = "";
		vs_src += "uniform mat4 uMatrixP;";
		vs_src += "uniform mat4 uMatrixC;";
		vs_src += "uniform mat4 uMatrixM;";
		vs_src += "attribute vec3 aVertexPosition;";
		vs_src += "attribute vec4 aVertexColor;";
		vs_src += "attribute vec2 aVertexTexCoord;";
		vs_src += "varying vec4 vColor;";
		vs_src += "varying vec2 vTexCoord;";
		vs_src += "void main(void) {";
		vs_src += " gl_Position = uMatrixP * uMatrixC * uMatrixM * vec4(aVertexPosition, 1.0);";
		vs_src += " vColor = aVertexColor;";
		vs_src += " vTexCoord = aVertexTexCoord;";
		vs_src += "}";
		var vs = compile_shader(vs_src, ctx_gl.VERTEX_SHADER);

		// fragment shader
		var fs_src = "";
		fs_src += "precision mediump float;";
		fs_src += "uniform float uGlobalAlpha;";
		fs_src += "uniform sampler2D uSampler;";
		fs_src += "varying vec4 vColor;";
		fs_src += "varying vec2 vTexCoord;";
		fs_src += "void main(void) {";
		fs_src += " gl_FragColor = texture2D(uSampler, vTexCoord.st);";
		fs_src += " gl_FragColor *= uGlobalAlpha;";
		fs_src += "}";
		var fs = compile_shader(fs_src, ctx_gl.FRAGMENT_SHADER);

		var link_program = function (vs, fs)
		{
			var program = ctx_gl.createProgram();
			ctx_gl.attachShader(program, vs);
			ctx_gl.attachShader(program, fs);
			ctx_gl.linkProgram(program);
			if (!ctx_gl.getProgramParameter(program, ctx_gl.LINK_STATUS))
			{
				window.console.log("could not link shader program");
				ctx_gl.deleteProgram(program);
				program = null;
			}
			return program;
		}

		// shader program
		var program = this.program = link_program(vs, fs);

		program.uMatrixP = ctx_gl.getUniformLocation(program, "uMatrixP");
		program.uMatrixC = ctx_gl.getUniformLocation(program, "uMatrixC");
		program.uMatrixM = ctx_gl.getUniformLocation(program, "uMatrixM");

		program.uGlobalAlpha = ctx_gl.getUniformLocation(program, "uGlobalAlpha");
		program.uSampler = ctx_gl.getUniformLocation(program, "uSampler");

		program.aVertexPosition = ctx_gl.getAttribLocation(program, "aVertexPosition");
		program.aVertexColor = ctx_gl.getAttribLocation(program, "aVertexColor");
		program.aVertexTexCoord = ctx_gl.getAttribLocation(program, "aVertexTexCoord");

		// vertex position buffer
		var vertex_position_array = 
		[
			-1.0, -1.0, 0.0, // tl
			-1.0,  1.0, 0.0, // bl
			 1.0,  1.0, 0.0, // br
			 1.0, -1.0, 0.0  // tr
		];  
		var vertex_position_buffer = this.vertex_position_buffer = ctx_gl.createBuffer();
		ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, vertex_position_buffer);
		ctx_gl.bufferData(ctx_gl.ARRAY_BUFFER, new Float32Array(vertex_position_array), ctx_gl.STATIC_DRAW);
		vertex_position_buffer.itemType = ctx_gl.FLOAT;
		vertex_position_buffer.itemSize = 3; // floats per position
		vertex_position_buffer.numItems = vertex_position_array.length / vertex_position_buffer.itemSize;

		// vertex color buffer
		var vertex_color_array = 
		[
			1.0, 0.0, 0.0, 0.5, // tl
			0.0, 1.0, 0.0, 0.5, // bl
			0.0, 0.0, 1.0, 0.5, // br
			1.0, 1.0, 1.0, 0.5  // tr
		];  
		var vertex_color_buffer = this.vertex_color_buffer = ctx_gl.createBuffer();
		ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, vertex_color_buffer);
		ctx_gl.bufferData(ctx_gl.ARRAY_BUFFER, new Float32Array(vertex_color_array), ctx_gl.STATIC_DRAW);
		vertex_color_buffer.itemType = ctx_gl.FLOAT;
		vertex_color_buffer.itemSize = 4; // floats per color
		vertex_color_buffer.numItems = vertex_color_array.length / vertex_color_buffer.itemSize;

		// vertex texture coordinate buffer
		var vertex_texcoord_array = 
		[
			0.0, 0.0, // tl
			0.0, 1.0, // bl
			1.0, 1.0, // br
			1.0, 0.0  // tr
		];  
		var vertex_texcoord_buffer = this.vertex_texcoord_buffer = ctx_gl.createBuffer();
		ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, vertex_texcoord_buffer);
		ctx_gl.bufferData(ctx_gl.ARRAY_BUFFER, new Float32Array(vertex_texcoord_array), ctx_gl.STATIC_DRAW);
		vertex_texcoord_buffer.itemType = ctx_gl.FLOAT;
		vertex_texcoord_buffer.itemSize = 2; // floats per texture coordinate
		vertex_texcoord_buffer.numItems = vertex_texcoord_array.length / vertex_texcoord_buffer.itemSize;

		// vertex index buffer
		var vertex_index_array = 
		[
			0, 1, 2, 3
		];
		var vertex_index_buffer = this.vertex_index_buffer = ctx_gl.createBuffer();
		ctx_gl.bindBuffer(ctx_gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
		ctx_gl.bufferData(ctx_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertex_index_array), ctx_gl.STATIC_DRAW);
		vertex_index_buffer.itemType = ctx_gl.UNSIGNED_SHORT;
		vertex_index_buffer.itemSize = 1; // unsigned short per index
		vertex_index_buffer.numItems = vertex_index_array.length / vertex_index_buffer.itemSize;
	}
}

/**
 * @return {void} 
 * @param {Float32Array} dst 
 * @param {fo.m3x2} mtx 
 */
var set_a16_from_m3x2 = function (dst, src)
{
	dst[ 0] = src.a_x; dst[ 1] = src.a_y; dst[ 2] = 0; dst[ 3] = 0; // col 0
	dst[ 4] = src.b_x; dst[ 5] = src.b_y; dst[ 6] = 0; dst[ 7] = 0; // col 1
	dst[ 8] = 0;       dst[ 9] = 0;       dst[10] = 1; dst[11] = 0; // col 2
	dst[12] = src.c_x; dst[13] = src.c_y; dst[14] = 0; dst[15] = 1; // col 3
}

/**
 * @return {void} 
 * @param {fo.m3x2} mtx 
 */
fo.view_gl.prototype.load_projection_mtx = function (mtx)
{
	set_a16_from_m3x2(this.uMatrixP, mtx);
}

/**
 * @return {void} 
 * @param {fo.m3x2} mtx 
 */
fo.view_gl.prototype.load_camera_mtx = function (mtx)
{
	set_a16_from_m3x2(this.uMatrixC, mtx);
}

/**
 * @return {void} 
 * @param {fo.m3x2} mtx 
 */
fo.view_gl.prototype.load_modelview_mtx = function (mtx)
{
	set_a16_from_m3x2(this.uMatrixM, mtx);
}

/**
 * @return {void} 
 * @param {spriter.pose} pose 
 */
fo.view_gl.prototype.draw_pose_gl = function (pose)
{
	var ctx_gl = this.ctx_gl;

	pose.strike();

	var mtx = new fo.m3x2();

	if (pose.m_data && pose.m_data.folder_array)
	{
		var folder_array = pose.m_data.folder_array;
		var object_array = pose.m_tweened_object_array;
		for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
		{
			var object = object_array[object_idx];
			var folder = folder_array[object.folder];
			var file = folder.file_array[object.file];

			mtx.makeIdentity();

			// apply object transform
			mtx.selfTranslate(object.x, object.y);
			mtx.selfRotateDegrees(object.angle);
			mtx.selfScale(object.scale_x, object.scale_y);

			// image extents
			var ex = 0.5 * file.width;
			var ey = 0.5 * file.height;
			mtx.selfScale(ex, ey);

			// local pivot in unit (-1 to +1) coordinates
			var lpx = (object.pivot_x * 2) - 1;
			var lpy = (object.pivot_y * 2) - 1;
			mtx.selfTranslate(-lpx, -lpy);

			this.load_modelview_mtx(mtx);

			this.uGlobalAlpha[0] = object.a;

			if (!file.texture && file.image && !file.image.hidden)
			{
				file.texture = ctx_gl.createTexture();
				ctx_gl.bindTexture(ctx_gl.TEXTURE_2D, file.texture);
				ctx_gl.pixelStorei(ctx_gl.UNPACK_FLIP_Y_WEBGL, true);
				ctx_gl.pixelStorei(ctx_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				ctx_gl.texImage2D(ctx_gl.TEXTURE_2D, 0, ctx_gl.RGBA, ctx_gl.RGBA, ctx_gl.UNSIGNED_BYTE, file.image);
				ctx_gl.texParameteri(ctx_gl.TEXTURE_2D, ctx_gl.TEXTURE_MAG_FILTER, ctx_gl.LINEAR);
				ctx_gl.texParameteri(ctx_gl.TEXTURE_2D, ctx_gl.TEXTURE_MIN_FILTER, ctx_gl.LINEAR);
				ctx_gl.texParameteri(ctx_gl.TEXTURE_2D, ctx_gl.TEXTURE_WRAP_S, ctx_gl.CLAMP_TO_EDGE);
				ctx_gl.texParameteri(ctx_gl.TEXTURE_2D, ctx_gl.TEXTURE_WRAP_T, ctx_gl.CLAMP_TO_EDGE);
				ctx_gl.bindTexture(ctx_gl.TEXTURE_2D, null);
			}

			if (file.texture)
			{
				var program = this.program;

				ctx_gl.useProgram(program);

				ctx_gl.uniformMatrix4fv(program.uMatrixP, false, this.uMatrixP);
				ctx_gl.uniformMatrix4fv(program.uMatrixC, false, this.uMatrixC);
				ctx_gl.uniformMatrix4fv(program.uMatrixM, false, this.uMatrixM);

				ctx_gl.uniform1fv(program.uGlobalAlpha, this.uGlobalAlpha);

				ctx_gl.activeTexture(ctx_gl.TEXTURE0);
				ctx_gl.bindTexture(ctx_gl.TEXTURE_2D, file.texture);
				ctx_gl.uniform1i(program.uSampler, 0);

				ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, this.vertex_position_buffer);
				ctx_gl.vertexAttribPointer(program.aVertexPosition, this.vertex_position_buffer.itemSize, this.vertex_position_buffer.itemType, false, 0, 0);
				ctx_gl.enableVertexAttribArray(program.aVertexPosition);

				ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, this.vertex_color_buffer);
				ctx_gl.vertexAttribPointer(program.aVertexColor, this.vertex_color_buffer.itemSize, this.vertex_color_buffer.itemType, false, 0, 0);
				ctx_gl.enableVertexAttribArray(program.aVertexColor);

				ctx_gl.bindBuffer(ctx_gl.ARRAY_BUFFER, this.vertex_texcoord_buffer);
				ctx_gl.vertexAttribPointer(program.aVertexTexCoord, this.vertex_texcoord_buffer.itemSize, this.vertex_texcoord_buffer.itemType, false, 0, 0);
				ctx_gl.enableVertexAttribArray(program.aVertexTexCoord);

				ctx_gl.bindBuffer(ctx_gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
				ctx_gl.drawElements(ctx_gl.TRIANGLE_FAN, this.vertex_index_buffer.numItems, this.vertex_index_buffer.itemType, 0);
			}
		}
	}
}
