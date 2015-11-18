spriter.js
==========

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=isaacburns&url=https://github.com/flyover/spriter.js&title=spriter.js&language=JavaScript&tags=github&category=software) [![PayPal donate button](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=H9KUEZTZHHTXQ&lc=US&item_name=spriter.js&currency_code=USD&bn=PP-DonationsBF:btn_donate_SM.gif:NonHosted "Donate to this project using Paypal")

A JavaScript API for the Spriter SCML/SCON animation data format.

https://cdn.rawgit.com/flyover/spriter.js/master/demo/index.html

## Supported Features
* Basic animations
* Bone animations
* All curve types (Instant, Linear, Quadratic, Cubic, Quartic, Quintic, Bezier)
* Points
* Collision Rectangles
* SubEntities
* Events
* Sounds
* Variables
* Tags
* Character maps

## How to use it

In the initialization:
```
var scon = JSON.parse(scon_text); // read and parse SCON file
var data = new spriter.Data().load(scon); // create and load Spriter data from SCON file
var pose = new spriter.Pose(data); // create Spriter pose and attach data
pose.setEntity("player"); // set entity by name
pose.setAnim("idle"); // set animation by name
```
In the animation loop:
```
var dt = 1000 / 60; // time step in milliseconds
pose.update(dt); // accumulate time
pose.strike(); // process time slice
```
Refer to the demo for how to draw images, play sounds and respond to events.
