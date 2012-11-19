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

var main = function ()
{
	var file_input_div = document.body.appendChild(document.createElement('div'));
	var canvas_div = document.body.appendChild(document.createElement('div'));
	var info_div = document.body.appendChild(document.createElement('div'));
	var control_div = document.body.appendChild(document.createElement('div'));

	var canvas_w = 640;
	var canvas_h = 480;

	var camera_x = 0;
	var camera_y = 0;
	var camera_zoom = 1;

	var set_camera = function (pose)
	{
		var extent = pose.getExtents();
		camera_x = (extent.max.x + extent.min.x) / 2;
		camera_y = (extent.max.y + extent.min.y) / 2;
		var scale_x = canvas_w / (extent.max.x - extent.min.x);
		var scale_y = canvas_h / (extent.max.y - extent.min.y);
		camera_zoom = 1.1 / Math.min(scale_x, scale_y);
	}

	info_div.innerHTML = "Animation Name: ";

	var pose = new spriter.pose();

	info_div.innerHTML = "Loading...";
	//var url = "test/test.scml";
	var url = "rapido/rapido.scml";
	var data = new spriter.data();
	data.loadFromURL(url, function ()
	{
		pose = new spriter.pose(data);
		info_div.innerHTML = "Animation Name: " + pose.getAnimName();
		set_camera(pose);
	});

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
				info_div.innerHTML = "Animation Name: " + pose.getAnimName();
				set_camera(pose);
			}
			})(data));

			break;
		}
	}, 
	false);

	var canvas = canvas_div.appendChild(document.createElement('canvas'));
	canvas.style.border = '1px solid black';
	canvas.width = canvas_w;
	canvas.height = canvas_h;
	var ctx_2d = canvas.getContext('2d');

	var cursor_x = 0;
	var cursor_y = 0;
	var cursor_down = false;
	var cursor_down_x = 0;
	var cursor_down_y = 0;

	canvas.addEventListener('mousedown', function (e)
	{
		cursor_down = true;
		cursor_down_x = e.offsetX;
		cursor_down_y = e.offsetY;
	}, 
	false);
	canvas.addEventListener('mouseup', function (e)
	{
		cursor_down = false;
	}, 
	false);
	canvas.addEventListener('mousemove', function (e)
	{
		cursor_x = e.offsetX;
		cursor_y = e.offsetY;

		if (cursor_down)
		{
			camera_x -= camera_zoom * (cursor_x - cursor_down_x);
			camera_y -= -camera_zoom * (cursor_y - cursor_down_y);
			cursor_down_x = cursor_x;
			cursor_down_y = cursor_y;
		}
	},
	false);
	canvas.addEventListener('mousewheel', function (e)
	{
		if (e.wheelDelta < 0)
		{
			camera_zoom *= 1.1;
		}
		else if (e.wheelDelta > 0)
		{
			camera_zoom *= 0.9;
		}
	}, 
	false);

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
		slider_value.innerHTML = time_scale;
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

		ctx_2d.clearRect(0, 0, ctx_2d.canvas.width, ctx_2d.canvas.height);

		ctx_2d.save();

			// 0,0 at center, x right, y up
			ctx_2d.translate(ctx_2d.canvas.width / 2, ctx_2d.canvas.height / 2);
			ctx_2d.scale(1, -1);

			// apply camera
			ctx_2d.scale(1/camera_zoom, 1/camera_zoom);
			ctx_2d.translate(-camera_x, -camera_y);

			if (debug_draw)
			{
				pose.drawDebug(ctx_2d);

				var extent = pose.getExtents();
				ctx_2d.strokeStyle = 'blue';
				ctx_2d.strokeRect(
					extent.min.x, extent.min.y, 
					extent.max.x - extent.min.x, 
					extent.max.y - extent.min.y);
			}
			else
			{
				pose.draw(ctx_2d);
			}

		ctx_2d.restore();
	}

	tick.time_last = new Date().getTime();
	loop(tick.time_last);
}

