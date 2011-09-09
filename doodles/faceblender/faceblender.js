(function() {
  var BLOCK_HEIGHT, BLOCK_WIDTH, GRID_HEIGHT, GRID_WIDTH, draw, drawBlock, gBlocks, gCtx, gCurrentImage, gImageLoadCount, gImageNames, gImages, gMouseDown, getRelativePosition, loadedImage, main, requestAnimFrame, setCurrentFace, update;
  BLOCK_WIDTH = 50;
  BLOCK_HEIGHT = 30;
  GRID_WIDTH = BLOCK_WIDTH / 2;
  GRID_HEIGHT = BLOCK_HEIGHT / 2;
  gBlocks = [];
  gCtx = null;
  gMouseDown = false;
  gCurrentImage = 1;
  gImageNames = ['face1.jpg', 'face2.jpg', 'face3.jpg', 'face4.jpg'];
  gImages = [];
  gImageLoadCount = 0;
  requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
    return window.setTimeout(callback, 1000 / 60);
  };
  setCurrentFace = function(index) {
    $('#faces button').removeClass('current');
    $('#faces button[data-face-index=' + index + ']').addClass('current');
    return gCurrentImage = index;
  };
  $('#faces button').mousedown(function(e) {
    return setCurrentFace(parseInt($(this).attr('data-face-index')));
  });
  drawBlock = function(x, y) {
    if (gMouseDown) {
      return gBlocks.push({
        ox: x,
        oy: y,
        x: x,
        y: y,
        c: gCurrentImage
      });
    }
  };
  update = function() {
    var block, dx, dy, _i, _len;
    requestAnimFrame(update);
    for (_i = 0, _len = gBlocks.length; _i < _len; _i++) {
      block = gBlocks[_i];
      dx = block.x - (Math.round(block.x / GRID_WIDTH) * GRID_WIDTH);
      dy = block.y - (Math.round(block.y / GRID_HEIGHT) * GRID_HEIGHT);
      block.x -= dx / 20;
      block.y -= dy / 20;
    }
    return draw();
  };
  getRelativePosition = function(e) {
    var x, y;
    if (e.layerX) {
      x = e.layerX;
      y = e.layerY;
    } else if (e.offsetX) {
      x = e.offsetX;
      y = e.offsetY;
    }
    return {
      x: x,
      y: y
    };
  };
  draw = function() {
    var block, image, sHeight, sWidth, sx, sy, x, y, _i, _len, _results;
    gCtx.fillStyle = '#000';
    gCtx.fillRect(0, 0, 400, 600);
    _results = [];
    for (_i = 0, _len = gBlocks.length; _i < _len; _i++) {
      block = gBlocks[_i];
      sx = 0;
      sy = 0;
      sWidth = BLOCK_WIDTH;
      sHeight = BLOCK_HEIGHT;
      x = (block.c * 2) + block.x - BLOCK_WIDTH / 2;
      y = (block.c * 2) + block.y - BLOCK_HEIGHT / 2;
      image = gImages[block.c];
      _results.push(gCtx.drawImage(image, block.ox, block.oy, BLOCK_WIDTH, BLOCK_HEIGHT, x, y, BLOCK_WIDTH, BLOCK_HEIGHT));
    }
    return _results;
  };
  loadedImage = function() {
    gImageLoadCount += 1;
    if (gImageLoadCount >= gImageNames.length) return requestAnimFrame(update);
  };
  main = function() {
    var doodleCanvas, imageName, img, index, _len, _results;
    doodleCanvas = document.getElementById('doodle');
    gCtx = doodleCanvas.getContext('2d');
    $('#doodle').mousedown(function(e) {
      gMouseDown = true;
      return e.preventDefault();
    }).mousemove(function(e) {
      var pos;
      pos = getRelativePosition(e);
      if (gMouseDown) drawBlock(pos.x, pos.y);
      return e.preventDefault();
    }).mouseup(function(e) {
      return gMouseDown = false;
    }).mouseleave(function(e) {
      return gMouseDown = false;
    });
    $(document).keypress(function(e) {
      var char;
      char = String.fromCharCode(e.which);
      if (('1' <= char && char <= '4')) return setCurrentFace(parseInt(char) - 1);
    });
    setCurrentFace(0);
    _results = [];
    for (index = 0, _len = gImageNames.length; index < _len; index++) {
      imageName = gImageNames[index];
      img = new Image();
      img.src = imageName;
      img.onload = function() {
        return loadedImage();
      };
      _results.push(gImages.push(img));
    }
    return _results;
  };
  main();
}).call(this);
