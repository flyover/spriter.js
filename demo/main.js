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
	canvas.style.position = 'absolute';
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	
	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');

	window.addEventListener('resize', function ()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = canvas.width + 'px';
		canvas.style.height = canvas.height + 'px';
	});

	var canvas_gl = document.createElement('canvas');
	canvas_gl.width = window.innerWidth;
	canvas_gl.height = window.innerHeight;
	canvas_gl.style.position = 'absolute';
	canvas_gl.style.width = canvas_gl.width + 'px';
	canvas_gl.style.height = canvas_gl.height + 'px';
	canvas_gl.style.zIndex = -1; // behind 2D context canvas

	document.body.appendChild(canvas_gl);

	var gl = canvas_gl.getContext('webgl') || canvas_gl.getContext('experimental-webgl');

	window.addEventListener('resize', function ()
	{
		canvas_gl.width = window.innerWidth;
		canvas_gl.height = window.innerHeight;
		canvas_gl.style.width = canvas_gl.width + 'px';
		canvas_gl.style.height = canvas_gl.height + 'px';
	});

	if (gl)
	{
		var gl_projection = mat3x3Identity(new Float32Array(9));
		var gl_modelview = mat3x3Identity(new Float32Array(9));
		var gl_color = vec4Identity(new Float32Array(4));
		var gl_shader_vs_src = 
		[
			"precision mediump int;",
			"precision mediump float;",
			"uniform mat3 uProjection;",
			"uniform mat3 uModelview;",
			"attribute vec4 aVertex;", // [ x, y, u, v ]
			"varying vec2 vTextureCoord;",
			"void main(void) {",
			" vTextureCoord = aVertex.zw;",
			" gl_Position = vec4(uProjection * uModelview * vec3(aVertex.xy, 1.0), 1.0);",
			"}"
		];
		var gl_shader_fs_src = 
		[
			"precision mediump int;",
			"precision mediump float;",
			"uniform sampler2D uSampler;",
			"uniform vec4 uColor;",
			"varying vec2 vTextureCoord;",
			"void main(void) {",
			" gl_FragColor = uColor * texture2D(uSampler, vTextureCoord);",
			"}"
		];
		var gl_shader = glMakeShader(gl, gl_shader_vs_src, gl_shader_fs_src);
		var gl_vertex_array = 
		[ // x,  y, u, v
			-1, -1, 0, 1, 
			+1, -1, 1, 1, 
			+1, +1, 1, 0, 
			-1, +1, 0, 0
		];
		var gl_vertex = glMakeVertex(gl, new Float32Array(gl_vertex_array), 4, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
	}

	var camera_x = 0;
	var camera_y = canvas.height/2;
	var camera_zoom = 2;

	var render_debug_data = false;
	var render_debug_pose = false;

	canvas.addEventListener('click', function () { render_debug_pose = !render_debug_pose; }, false);

	var data = new spriter.Data();
	var pose = new spriter.Pose(data);
	var images = {};
	var gl_textures = {};

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
				images[image_key] = loadImage(file_path + file.name, function (err, image)
				{
					if (gl)
					{
						var gl_texture = gl_textures[image_key] = gl.createTexture();
						gl.bindTexture(gl.TEXTURE_2D, gl_texture);
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					}
				});
			});
		});
	});

	var prev_time = 0;

	var loop = function (time)
	{
		requestAnimationFrame(loop);

		var dt = time - (prev_time || time); prev_time = time; // ms

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

		if (ctx)
		{
			ctx.setTransform(1, 0, 0, 1, 0, 0);

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			
			// origin at center, x right, y up
			ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2); ctx.scale(1, -1);
			
			ctx.translate(-camera_x, -camera_y);
			ctx.scale(camera_zoom, camera_zoom);
			ctx.lineWidth = 1 / camera_zoom;
		}

		if (gl)
		{
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			mat3x3Identity(gl_projection);
			mat3x3Ortho(gl_projection, -canvas_gl.width/2, canvas_gl.width/2, -canvas_gl.height/2, canvas_gl.height/2);
			mat3x3Translate(gl_projection, -camera_x, -camera_y);
			mat3x3Scale(gl_projection, camera_zoom, camera_zoom);
		}

		if (render_debug_pose)
		{
			if (ctx)
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
		}
		else
		{
			if (gl)
			{
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				pose.object_array.forEach(function (object)
				{
					var folder = data.folder_array[object.folder_index];
					var file = folder.file_array[object.file_index];
					var image_key = file.name;
					var image = images[image_key];
					var gl_texture = gl_textures[image_key];
					if (image && image.complete && gl_texture)
					{
						mat3x3Identity(gl_modelview);
						mat3x3ApplySpace(gl_modelview, object.world_space);
						mat3x3Scale(gl_modelview, file.width/2, file.height/2);
						vec4Identity(gl_color); gl_color[3] = object.alpha;
						gl.useProgram(gl_shader.program);
						gl.uniformMatrix3fv(gl_shader.uniforms['uProjection'], false, gl_projection);
						gl.uniformMatrix3fv(gl_shader.uniforms['uModelview'], false, gl_modelview);
						gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, gl_texture);
						gl.uniform1i(gl_shader.uniforms['uSampler'], 0);
						gl.bindBuffer(gl.ARRAY_BUFFER, gl_vertex.buffer);
						gl.vertexAttribPointer(gl_shader.attribs['aVertex'], gl_vertex.size, gl_vertex.type, false, 0, 0);
						gl.enableVertexAttribArray(gl_shader.attribs['aVertex']);
						gl.drawArrays(gl.TRIANGLE_FAN, 0, gl_vertex.count);
					}
				});
			}
			else if (ctx)
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

function vec4Identity (v)
{
	v[0] = v[1] = v[2] = v[3] = 1.0;
	return v;
}

function mat3x3Identity (m)
{
	m[1] = m[2] = m[3] = 
	m[5] = m[6] = m[7] = 0.0;
	m[0] = m[4] = m[8] = 1.0;
	return m;
}

function mat3x3Ortho (m, l, r, b, t)
{
	var lr = 1 / (l - r);
	var bt = 1 / (b - t);
	m[0] *= -2 * lr;
	m[4] *= -2 * bt;
	m[6] += (l + r) * lr;
	m[7] += (t + b) * bt;
	return m;
}

function mat3x3Translate (m, x, y)
{
	m[6] += m[0] * x + m[3] * y;
	m[7] += m[1] * x + m[4] * y;
	return m;
}

function mat3x3Rotate (m, angle)
{
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var m0 = m[0], m1 = m[1];
	var m3 = m[3], m4 = m[4];
	m[0] = m0 * c + m3 * s;
	m[1] = m1 * c + m4 * s;
	m[3] = m3 * c - m0 * s;
	m[4] = m4 * c - m1 * s;
	return m;
}

function mat3x3Scale (m, x, y)
{
	m[0] *= x; m[1] *= x; m[2] *= x;
	m[3] *= y; m[4] *= y; m[5] *= y;
	return m;
}

function mat3x3ApplySpace (m, space)
{
	mat3x3Translate(m, space.position.x, space.position.y);
	mat3x3Rotate(m, space.rotation.rad);
	mat3x3Scale(m, space.scale.x, space.scale.y);
	return m;
}

function glCompileShader (gl, src, type)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src.join('\n'));
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.log(src);
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		shader = null;
	}
	return shader;
}

function glLinkProgram (gl, vs, fs)
{
	var program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.log("could not link shader program");
		gl.detachShader(program, vs);
		gl.detachShader(program, fs);
		gl.deleteProgram(program);
		program = null;
	}
	return program;
}

function glGetUniforms (gl, program, uniforms)
{
	var count = /** @type {number} */ (gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS));
	for (var i = 0; i < count; ++i)
	{
		var uniform = gl.getActiveUniform(program, i);
		uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);
	}
	return uniforms;
}

function glGetAttribs (gl, program, attribs)
{
	var count = /** @type {number} */ (gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES));
	for (var i = 0; i < count; ++i)
	{
		var attrib = gl.getActiveAttrib(program, i);
		attribs[attrib.name] = gl.getAttribLocation(program, attrib.name);
	}
	return attribs;
}

function glMakeShader (gl, vs_src, fs_src)
{
	var shader = {};
	shader.vs_src = vs_src;
	shader.fs_src = fs_src;
	shader.vs = glCompileShader(gl, shader.vs_src, gl.VERTEX_SHADER);
	shader.fs = glCompileShader(gl, shader.fs_src, gl.FRAGMENT_SHADER);
	shader.program = glLinkProgram(gl, shader.vs, shader.fs);
	shader.uniforms = glGetUniforms(gl, shader.program, {});
	shader.attribs = glGetAttribs(gl, shader.program, {});
	return shader;
}

function glMakeVertex (gl, type_array, size, buffer_type, buffer_draw)
{
	var vertex = {};
	if (type_array instanceof Float32Array) { vertex.type = gl.FLOAT; }
	else if (type_array instanceof Int8Array) { vertex.type = gl.CHAR; }
	else if (type_array instanceof Uint8Array) { vertex.type = gl.UNSIGNED_CHAR; }
	else if (type_array instanceof Int16Array) { vertex.type = gl.SHORT; }
	else if (type_array instanceof Uint16Array) { vertex.type = gl.UNSIGNED_SHORT; }
	else if (type_array instanceof Int32Array) { vertex.type = gl.INT; }
	else if (type_array instanceof Uint32Array) { vertex.type = gl.UNSIGNED_INT; }
	else { throw new Error(); }
	vertex.size = size;
	vertex.count = type_array.length / vertex.size;
	vertex.type_array = type_array;
	vertex.buffer = gl.createBuffer();
	gl.bindBuffer(buffer_type, vertex.buffer);
	gl.bufferData(buffer_type, vertex.type_array, buffer_draw);
	return vertex;
}
