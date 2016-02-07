goog.provide('RenderCtx2D');

/**
 * @constructor
 * @param {CanvasRenderingContext2D} ctx
 */
RenderCtx2D = function(ctx) {
  var render = this;
  render.ctx = ctx;
  render.images = {};
  render.skin_info_map = {};
  render.region_vertex_position = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]); // [ x, y ]
  render.region_vertex_texcoord = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]); // [ u, v ]
  render.region_vertex_triangle = new Uint16Array([0, 1, 2, 0, 2, 3]); // [ i0, i1, i2 ]
}

/**
 * @return {void}
 * @param {spriter.Pose} spriter_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.dropPose = function(spriter_pose, atlas_data) {
  var render = this;
  render.images = {};
  render.skin_info_map = {};
}

/**
 * @return {void}
 * @param {spriter.Pose} spriter_pose
 * @param {atlas.Data} atlas_data
 * @param {Object.<string,HTMLImageElement>} images
 */
RenderCtx2D.prototype.loadPose = function(spriter_pose, atlas_data, images) {
  var render = this;

  render.images = images;
}

/**
 * @return {void}
 * @param {spriter.Pose} spriter_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.drawPose = function(spriter_pose, atlas_data) {
  var render = this;
  var ctx = render.ctx;

  var images = render.images;

  var positions = render.region_vertex_position;
  var texcoords = render.region_vertex_texcoord;
  var triangles = render.region_vertex_triangle;

  spriter_pose.object_array.forEach(function(object) {
    switch (object.type) {
      case 'sprite':
        var folder = spriter_pose.data.folder_array[object.folder_index];
        if (!folder) {
          return;
        }
        var file = folder.file_array[object.file_index];
        if (!file) {
          return;
        }
        var site = atlas_data && atlas_data.sites[file.name];
        var page = site && site.page;
        var image_key = (page && page.name) || file.name;
        var image = images[image_key];
        if (image && image.complete) {
          ctx.save();
          ctxApplySpace(ctx, object.world_space);
          ctx.scale(file.width / 2, file.height / 2);
          ctxApplyAtlasSitePosition(ctx, site);
          ctx.globalAlpha *= object.alpha;
          ctxDrawImageMesh(ctx, triangles, positions, texcoords, image, site, page);
          ctx.restore();
        }
        break;
      case 'entity':
        ctx.save();
        ctxApplySpace(ctx, object.world_space);
        render.drawPose(object.pose, atlas_data); // recursive
        ctx.restore();
        break;
    }
  });
}

/**
 * @return {void}
 * @param {spriter.Pose} spriter_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.drawDebugPose = function(spriter_pose, atlas_data) {
  var render = this;
  var ctx = render.ctx;

  var images = render.images;

  var positions = render.region_vertex_position;
  var triangles = render.region_vertex_triangle;

  spriter_pose.bone_array.forEach(function(bone) {
    ctx.save();
    ctxApplySpace(ctx, bone.world_space);
    ctxDrawPoint(ctx);
    var entity = spriter_pose.data.entity_map[spriter_pose.entity_key];
    var bone_info = entity.obj_info_map[bone.name];
    if (bone_info) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(bone_info.h / 2, -bone_info.h / 2);
      ctx.lineTo(bone_info.w, 0);
      ctx.lineTo(bone_info.h / 2, bone_info.h / 2);
      ctx.closePath();
      ctx.strokeStyle = 'cyan';
      ctx.stroke();
    }
    ctx.restore();
  });

  spriter_pose.object_array.forEach(function(object) {
    switch (object.type) {
      case 'sprite':
        var folder = spriter_pose.data.folder_array[object.folder_index];
        if (!folder) {
          return;
        }
        var file = folder.file_array[object.file_index];
        if (!file) {
          return;
        }
        var site = atlas_data && atlas_data.sites[file.name];
        var page = site && site.page;
        var image_key = (page && page.name) || file.name;
        var image = images[image_key];
        ctx.save();
        ctxApplySpace(ctx, object.world_space);
        ctx.scale(file.width / 2, file.height / 2);
        ctx.lineWidth = 1 / Math.min(file.width / 2, file.height / 2);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, triangles, positions);
        ctx.restore();
        break;
      case 'bone':
        ctx.save();
        ctxApplySpace(ctx, object.world_space);
        var entity = spriter_pose.data.entity_map[spriter_pose.entity_key];
        var bone_info = entity.obj_info_map[object.name];
        if (bone_info) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(bone_info.h / 2, -bone_info.h / 2);
          ctx.lineTo(bone_info.w, 0);
          ctx.lineTo(bone_info.h / 2, bone_info.h / 2);
          ctx.closePath();
          ctx.strokeStyle = 'cyan';
          ctx.stroke();
        }
        ctx.restore();
        break;
      case 'box':
        var entity = spriter_pose.data.entity_map[spriter_pose.entity_key];
        var box_info = entity.obj_info_map[object.name];
        if (box_info) {
          ctx.save();
          ctxApplySpace(ctx, object.world_space);
          ctx.beginPath();
          ctx.rect(-box_info.w / 2, -box_info.h / 2, box_info.w, box_info.h);
          ctx.strokeStyle = 'magenta';
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 'point':
        ctx.save();
        ctxApplySpace(ctx, object.world_space);
        ctxDrawPoint(ctx);
        ctx.restore();
        break;
      case 'sound':
        break;
      case 'entity':
        ctx.save();
        ctxApplySpace(ctx, object.world_space);
        ctxDrawPoint(ctx);
        render.drawDebugPose(object.pose, atlas_data); // recursive
        ctx.restore();
        break;
      case 'variable':
        break;
    }
  });
}

function ctxApplySpace(ctx, space) {
  if (space) {
    ctx.translate(space.position.x, space.position.y);
    ctx.rotate(space.rotation.rad);
    ctx.scale(space.scale.x, space.scale.y);
  }
}

function ctxApplyAtlasSitePosition(ctx, site) {
  if (site) {
    ctx.scale(1 / site.original_w, 1 / site.original_h);
    ctx.translate(2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
    ctx.scale(site.w, site.h);
  }
}

function ctxDrawCircle(ctx, color, scale) {
  scale = scale || 1;
  ctx.beginPath();
  ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color || 'grey';
  ctx.stroke();
}

function ctxDrawPoint(ctx, color, scale) {
  scale = scale || 1;
  ctx.beginPath();
  ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color || 'blue';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(24 * scale, 0);
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 24 * scale);
  ctx.strokeStyle = 'green';
  ctx.stroke();
}

function ctxDrawMesh(ctx, triangles, positions, stroke_style, fill_style) {
  ctx.beginPath();
  for (var index = 0; index < triangles.length;) {
    var triangle = triangles[index++] * 2;
    var x0 = positions[triangle],
      y0 = positions[triangle + 1];
    var triangle = triangles[index++] * 2;
    var x1 = positions[triangle],
      y1 = positions[triangle + 1];
    var triangle = triangles[index++] * 2;
    var x2 = positions[triangle],
      y2 = positions[triangle + 1];
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
  }
  if (fill_style) {
    ctx.fillStyle = fill_style;
    ctx.fill();
  }
  ctx.strokeStyle = stroke_style || 'grey';
  ctx.stroke();
}

function ctxDrawImageMesh(ctx, triangles, positions, texcoords, image, site, page) {
  var site_texmatrix = new Float32Array(9);
  var site_texcoord = new Float32Array(2);
  mat3x3Identity(site_texmatrix);
  mat3x3Scale(site_texmatrix, image.width, image.height);
  mat3x3ApplyAtlasPageTexcoord(site_texmatrix, page);
  mat3x3ApplyAtlasSiteTexcoord(site_texmatrix, site);

  /// http://www.irrlicht3d.org/pivot/entry.php?id=1329
  for (var index = 0; index < triangles.length;) {
    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x0 = position[0],
      y0 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u0 = texcoord[0],
      v0 = texcoord[1];

    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x1 = position[0],
      y1 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u1 = texcoord[0],
      v1 = texcoord[1];

    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x2 = position[0],
      y2 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u2 = texcoord[0],
      v2 = texcoord[1];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    x1 -= x0;
    y1 -= y0;
    x2 -= x0;
    y2 -= y0;
    u1 -= u0;
    v1 -= v0;
    u2 -= u0;
    v2 -= v0;
    var id = 1 / (u1 * v2 - u2 * v1);
    var a = id * (v2 * x1 - v1 * x2);
    var b = id * (v2 * y1 - v1 * y2);
    var c = id * (u1 * x2 - u2 * x1);
    var d = id * (u1 * y2 - u2 * y1);
    var e = x0 - (a * u0 + c * v0);
    var f = y0 - (b * u0 + d * v0);
    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }
}
