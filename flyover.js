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

var fo = fo || {};

fo.v2 = function (x, y)
{
	this.x = x || 0;
	this.y = y || 0;
}

fo.v2.ZERO = new fo.v2();

fo.v2.prototype.makeZero = function ()
{
	this.x = 0;
	this.y = 0;
	return this;
}

fo.v2.prototype.selfTranslate = function (x, y)
{
	this.x += x;
	this.y += y;
	return this;
}

fo.v2.prototype.selfRotate = function (c, s)
{
	var x = this.x, y = this.y;
	this.x = x*c - y*s;
	this.y = x*s + y*c;
	return this;
}

fo.v2.prototype.selfRotateRadians = function (rad)
{
	return this.selfRotate(Math.cos(rad), Math.sin(rad));
}

fo.v2.prototype.selfRotateDegrees = function (deg)
{
	return this.selfRotateRadians(deg * Math.PI / 180);
}

fo.v2.prototype.selfScale = function (x, y)
{
	this.x *= x;
	this.y *= y;
	return this;
}

fo.m3x2 = function ()
{
	this.a_x = 1; this.b_x = 0; this.c_x = 0;
	this.a_y = 0; this.b_y = 1; this.c_y = 0;
}

fo.m3x2.IDENTITY = new fo.m3x2();

fo.m3x2.prototype.makeIdentity = function ()
{
	this.a_x = 1; this.b_x = 0; this.c_x = 0;
	this.a_y = 0; this.b_y = 1; this.c_y = 0;
	return this;
}

fo.m3x2.prototype.selfTranslate = function (x, y)
{
	this.c_x += this.a_x * x + this.b_x * y;
	this.c_y += this.a_y * x + this.b_y * y;
	return this;
}

fo.m3x2.prototype.selfRotate = function (c, s)
{
	var A_a_x = this.a_x, A_a_y = this.a_y;
	var A_b_x = this.b_x, A_b_y = this.b_y;
	var B_a_x = c, B_a_y = s;
	var B_b_x = -s, B_b_y = c;
	this.a_x = A_a_x * B_a_x + A_b_x * B_a_y;
	this.a_y = A_a_y * B_a_x + A_b_y * B_a_y;
	this.b_x = A_a_x * B_b_x + A_b_x * B_b_y;
	this.b_y = A_a_y * B_b_x + A_b_y * B_b_y;
	return this;
}

fo.m3x2.prototype.selfRotateRadians = function (rad)
{
	return this.selfRotate(Math.cos(rad), Math.sin(rad));
}

fo.m3x2.prototype.selfRotateDegrees = function (deg)
{
	return this.selfRotateRadians(deg * Math.PI / 180);
}

fo.m3x2.prototype.selfScale = function (x, y)
{
	this.a_x *= x; this.a_y *= x;
	this.b_x *= y; this.b_y *= y;
	return this;
}

fo.m3x2.prototype.applyVector = function (v, out)
{
	var v_x = v.x, v_y = v.y;
	out.x = this.a_x * v_x + this.b_x * v_y + this.c_x;
	out.y = this.a_y * v_x + this.b_y * v_y + this.c_y;
	return out;
}

