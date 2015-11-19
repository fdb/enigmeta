// Simple pixel font that becomes awesome.

function linePoint(t, x1, y1, x2, y2) {
  return [x1 + t * (x2 - x1),
          y1 + t * (y2 - y1)];
}

var SCALE = 20;

var gGlyphMap = {
  'A': [[0,0],[4,10],[8,0]],
  'B': [[0,0],[0,10],[5,10],[5,4],[7,4],[7,0]],
  'C': [[0,0],[0,10],[8,10],[8,6],[3,6],[3,4],[8,4],[8,0]],
  'D': [[0,0],[0,3],[2,3],[2,7],[0,7],[0,10],[8,10],[8,0]],
  'E': [[0,0],[0,3],[0,10],[8,10],[8,7],[3,7],[3,6],[5,6],[5,4],[3,4],[3,3],[8,3],[8,0]],
  'F': [[0,0],[0,3],[0,10],[8,10],[8,7],[3,7],[3,6],[5,6],[5,3],[3,3],[3,0]],
  'G': [[0,0],[0,3],[0,10],[8,10],[8,7],[3,7],[3,3],[5,3],[5,5],[8,5],[8,0]],
  'H': [[0,0],[0,3],[0,7],[0,10],[3,10],[3,7],[5,7],[5,10],[8,10],[8,0],[5,0],[5,3],[3,3],[3,0]],
  'I': [[2,0],[2,10],[5,10],[5,0]],
  'J': [[0,0],[0,3],[4,3],[4,10],[7,10],[7,0]],
  'K': [[0,0],[0,10],[3,10],[3,7],[5,10],[8,10],[5,5],[8,0],[5,0],[3,3],[3,0]],
  'L': [[0,0],[0,10],[3,10],[3,3],[7,3],[7,0]],
  'M': [[0,0],[0,10],[3,10],[4,8],[5,10],[8,10],[8,0],[5,0],[5,4],[4,3],[3,4],[3,0]],
  'N': [[0,0],[0,10],[3,10],[3,9],[5,7],[5,10],[8,10],[8,0],[5,0],[5,3],[3,5],[3,0]],
  'O': [[0,0],[0,10],[7,10],[7,0]],
  'P': [[0,0],[0,10],[7,10],[7,4],[3,4],[3,0]],
  'Q': [[0,0],[0,10],[7,10],[7,0],[6,0],[7,-1],[4,-1],[3,0]],
  'R': [[0,0],[0,10],[7,10],[7,4],[5,4],[7,0],[4,0],[3,2],[3,0]],
  'S': [[7,10],[7,7],[3,7],[3,6],[7,6],[7,0],[0,0],[0,3],[4,3],[4,4],[0,4],[0,10]],
  'T': [[2,0],[2,7],[0,7],[0,10],[7,10],[7,7],[5,7],[5,0]],
  'U': [[0,0],[0,10],[3,10],[3,3],[5,3],[5,10],[8,10],[8,0]],
  'V': [[0,10],[3,10],[4,6],[5,10],[8,10],[5,0],[3,0]],
  'W': [[0,10],[3,10],[4,6],[5,8],[6,6],[7,10],[10,10],[8,0],[6,0],[5,3],[4,0],[2,0]],
  'X': [[0,10],[3,10],[4,8],[5,10],[8,10],[5,5],[8,0],[5,0],[4,2],[3,0],[0,0],[3,5]],
  'Y': [[0,10],[3,10],[4,8],[5,10],[8,10],[5,5],[5,0],[3,0],[3,5]],
  'Z': [[0,10],[7,10],[7,7],[3,3],[7,3],[7,0],[0,0],[0,3],[4,7],[0,7]],
}


var gGlyph = 'A';
var gPoints = gGlyphMap[gGlyph];
var gPreviewText = 'HAMBURGEVONS';

var STATE_NORMAL = 'normal';
var STATE_DRAGGING = 'dragging';
var gState = STATE_NORMAL;
var OFFSET_X = 5 * SCALE;
var OFFSET_Y = 10 * SCALE;

var LETTER_WIDTH = 8 * SCALE;
var LETTER_HEIGHT = 10 * SCALE;

var gPointIndex = -1;
var POINT_DELTA = 10;

var canvas = document.getElementById('c');
var r = canvas.getBoundingClientRect();
canvas.width = r.width;
canvas.height = r.height;
var ctx = canvas.getContext('2d');
ctx.scale(1.0, -1.0);
ctx.translate(0, -canvas.height);

function findPointIndex(mx, my) {
  for (var i = gPoints.length - 1; i >= 0; i--) {
    var x = gPoints[i][0] * SCALE;
    var y = gPoints[i][1] * SCALE;
    if (Math.abs(mx - x) < POINT_DELTA && Math.abs(my - y) < POINT_DELTA) {
      return i;
    }
  }
  return -1;
}

// Execute all moveTo / lineTo instructions but don't fill / stroke the path yet.
// Note that the caller has to call beginPath.
function addGlyphPath(ctx, points, x, y, scale) {
  var x1 = x + points[0][0] * scale;
  var y1 = y + points[0][1]  * scale;
  ctx.moveTo(x1, y1);

  var x2;
  var y2;

  for (var i = 1; i < points.length; i++) {
    x2 = x + points[i][0]  * scale;
    y2 = y + points[i][1]  * scale;
    ctx.lineTo(x2, y2);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  for (var x = 0; x < canvas.width; x += SCALE) {
    ctx.moveTo(x - 0.5, 0);
    ctx.lineTo(x - 0.5, canvas.height);
  }
  for (var y = 0; y < canvas.height; y += SCALE) {
    ctx.moveTo(0, y - 0.5);
    ctx.lineTo(canvas.width, y - 0.5);
  }
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#333366';
  ctx.stroke();

  // Draw grid bounds
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(OFFSET_X, 0);
  ctx.lineTo(OFFSET_X, canvas.height);
  ctx.moveTo(0, OFFSET_Y);
  ctx.lineTo(canvas.width, OFFSET_Y);

  ctx.moveTo(OFFSET_X + LETTER_WIDTH, 0);
  ctx.lineTo(OFFSET_X + LETTER_WIDTH, canvas.height);
  ctx.moveTo(0, OFFSET_Y + LETTER_HEIGHT);
  ctx.lineTo(canvas.width, OFFSET_Y + LETTER_HEIGHT);
  ctx.stroke();

  // Draw letter
  ctx.beginPath();
  addGlyphPath(ctx, gPoints, OFFSET_X, OFFSET_Y, SCALE);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#669';
  ctx.stroke();

  // Draw closing segment differently.
  ctx.beginPath();
  var firstPoint = gPoints[0];
  var lastPoint = gPoints[gPoints.length - 1];
  ctx.moveTo(OFFSET_X + lastPoint[0] * SCALE, OFFSET_Y + lastPoint[1] * SCALE);
  ctx.lineTo(OFFSET_X + firstPoint[0] * SCALE, OFFSET_Y + firstPoint[1] * SCALE);
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#88b';
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw small dots where the points are.
  for (var i = 0; i < gPoints.length; i++) {
    var x = OFFSET_X + gPoints[i][0]  * SCALE;
    var y = OFFSET_Y + gPoints[i][1]  * SCALE;
    ctx.fillStyle = '#cde';
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }

  // Draw selected point
  if (gPointIndex >= 0) {
    var x = OFFSET_X + gPoints[gPointIndex][0] * SCALE;
    var y = OFFSET_Y + gPoints[gPointIndex][1] * SCALE;
    ctx.fillStyle = '#6666ff';
    ctx.fillRect(x - 6, y - 6, 12, 12);
  }

  drawPreview();
}

function drawPreview() {
  var c = document.getElementById('preview');
  var r = c.getBoundingClientRect();
  c.width = r.width;
  c.height = r.height;
  var ctx = c.getContext('2d');
  ctx.save();
  ctx.scale(1.0, -1.0);
  ctx.translate(0, -c.height);

  var x = 10;
  var y = 10;
  var previewScale = 8;
  ctx.beginPath();
  for (var i = 0; i < gPreviewText.length; i++) {
    var c = gPreviewText[i]; 
    c = c.toUpperCase();  
    var points = gGlyphMap[c];
    if (points) {
      addGlyphPath(ctx, points, x, y, previewScale);
      ctx.closePath();
      x += (getGlyphWidth(points) + 1) * previewScale;      
    } else {
      x += 7 * previewScale;
    }
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#669';
  ctx.stroke();
  // ctx.fillStyle = 'rgb(215, 241, 255)';
  // ctx.fill();
  ctx.restore();
}

function getMousePosition(e) {
  var r = canvas.getBoundingClientRect();
  return {
    x: e.clientX - r.left,
    y: e.clientY - r.top
  };
}


function onMouseMove(e) {
  var pos = getMousePosition(e);
  var mx = pos.x - OFFSET_X;
  var my = (canvas.height - pos.y) - OFFSET_Y;
  if (gState === STATE_NORMAL) {
    gPointIndex = findPointIndex(mx, my);
  } else if (gState === STATE_DRAGGING) {
    var newX = Math.round(mx / SCALE);
    var newY = Math.round(my / SCALE);
    gPoints[gPointIndex] = [newX, newY];
  }
  //ctx.fillRect(mx-2, my-2, 4, 4);
  draw();
    drawGlyphList();

}

function onMouseDown(e) {
  if (gPointIndex >= 0) {
    if (e.shiftKey) {
      gPoints.splice(gPointIndex, 1);
      gPointIndex = -1;
      draw();
    } else {
      gState = STATE_DRAGGING;
    }
  }
}

function onMouseUp(e) {
  gState = STATE_NORMAL;
  dumpGlyphMap();
}

function dumpGlyphMap() {
  var code =  document.getElementById('code');
  var json = 'var gGlyphMap = {\n';
  var characters = Object.keys(gGlyphMap);
  for (var i = 0; i < characters.length; i++) {
    var c = characters[i];
    var glyph = gGlyphMap[c];
    json += '  \'' + c + '\': ' + JSON.stringify(glyph) + ',\n';
  }
  json += '}\n'

  code.value = json;
}

// Look at all X values in the glyph and find the widest one.
function getGlyphWidth(points) {
  return points.reduce(function(w, b) {
    return Math.max(w, b[0]);
  }, 0);
}

function downloadFont() {
    // Convert the glyphs to an opentype font.
    var otGlyphs = [];
    otGlyphs.push(new opentype.Glyph({
        name: '.notdef',
        unicode: 0,
        path: new opentype.Path()
    }));
    var keys = Object.keys(gGlyphMap);
    var glyphScale = Math.floor(1024 / 10); // units per em / max width of the glyphs
    for (var i = 0; i < keys.length; i += 1) {
        var c = keys[i];
        var points = gGlyphMap[keys[i]];
        var p = new opentype.Path();
        for (var j = 0; j < points.length; j++) {
          if (j === 0) {
            p.moveTo(points[j][0] * glyphScale, points[j][1] * glyphScale);
          } else {
            p.lineTo(points[j][0] * glyphScale, points[j][1] * glyphScale);
          }
        }
        p.close();

        var newGlyph = new opentype.Glyph({name: c, unicode: c.charCodeAt(0)});
        newGlyph.advanceWidth = getGlyphWidth(points) * glyphScale;
        newGlyph.path = p;
        otGlyphs.push(newGlyph);
    }
    var oFont = new opentype.Font({
      familyName: 'Blocky',
      styleName: 'Regular',
      unitsPerEm: 1024,
      glyphs: otGlyphs
    });
    console.log(oFont.toTables());
    oFont.download();
}

function onAddPoint() {
  var newX = Math.floor(Math.random() * 8);
  var newY = Math.floor(Math.random() * 8);
  gPoints.push([newX, newY]);
  dumpGlyphMap();
  draw();
}


function onRemovePoint() {
  delete gPoints.pop();
  dumpGlyphMap();
  draw();
}

function packValues() {
    var s = '';
    for (var i = 0; i < arguments.length; i += 1) {
        var v = arguments[i];
        if (v >= 0 && i > 0) {
            s += ' ';
        }

        s += floatToString(v);
    }

    return s;
}

function toPathData(points, scale) {
  var d = '';
  for (var i = 0; i < points.length; i += 1) {
    if (i === 0) {
      d += 'M';
    } else {
      d += 'L';
    }
    d += points[i][0] * scale;
    d += ' ';
    d += (10-points[i][1]) * scale;
  }
  d += 'Z';
  return d;
}

function onSelectGlyph(e) {
  var target = e.target;
  if (!target.getAttribute('data-character')) {
    target = target.parentNode;
  }
  gGlyph = target.getAttribute('data-character');
  gPoints = gGlyphMap[gGlyph];
  drawGlyphList();
  draw();
}

function drawGlyphList() {
  var container = document.getElementById('glyph-list');
  container.innerHTML = '';
  var characters = Object.keys(gGlyphMap);
  for (var i = 0; i < characters.length; i++) {
    var c = characters[i];
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var d = toPathData(gGlyphMap[c], 7);
    svg.innerHTML = '<path transform="translate(10, 10)" fill="rgb(26, 70, 102)" stroke-width="2" stroke="rgb(215, 241, 255)" d="' + d + '"/>';
    container.appendChild(svg);
    svg.setAttribute('data-character', c);
    if (gGlyph === c) {
      svg.classList.add('active');
    }
    svg.addEventListener('click', onSelectGlyph);
  }
}

function onChangePreviewText(e) {
  gPreviewText = e.target.value;
  drawPreview();
}


// Mouse move
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
document.getElementById('add-point').addEventListener('click', onAddPoint);
document.getElementById('remove-point').addEventListener('click', onRemovePoint);
document.getElementById('download-font').addEventListener('click', downloadFont);
document.getElementById('preview-text-field').addEventListener('input', onChangePreviewText);

drawGlyphList();
draw();
dumpGlyphMap();
