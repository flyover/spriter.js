// shim: window.requestAnimationFrame window.cancelAnimationFrame
/* scope */ ;(function ()
{
	var vendors = ['ms', 'Moz', 'Webkit', 'O'];

	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i)
	{
		window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
	{
		var lastTime = 0;
		window.requestAnimationFrame = function (callback, element)
		{
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	}

	if (!window.cancelAnimationFrame)
	{
		window.cancelAnimationFrame = function (id)
		{
			window.clearTimeout(id);
		}
	}
}
/* scope */ )();

