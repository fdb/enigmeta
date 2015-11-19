
var FONT_MAP = {
    'Fira Sans': ['fonts/FiraSans-Regular.otf', 'fonts/FiraSans-Bold.otf'],
    'Roboto Slab': ['fonts/RobotoSlab-Regular.ttf', 'fonts/RobotoSlab-Bold.ttf'],
    'Roboto': ['fonts/Roboto-Regular.ttf', 'fonts/Roboto-Bold.ttf'],
    'Open Sans': ['fonts/OpenSans-Regular.ttf', 'fonts/OpenSans-Bold.ttf'],
    'Bebas Neue': ['fonts/BebasNeue-Regular.otf', 'fonts/BebasNeue-Bold.otf'],
    'Quicksand': ['fonts/Quicksand-Regular.otf', 'fonts/Quicksand-Bold.otf']
};

var gT = 0.5;
var gText = 'hamburgevons';
var gAPathSVG = document.getElementById('path-a');
var gBPathSVG = document.getElementById('path-b');

var gOutPathSVG = document.getElementById('path-out');
var gAFont, gBFont;
var gAPath, gBPath;
var gOutPath;

function mix(a, b, t) {
    return a * (1 - t) + b * t;
}

function onChangeSlider(e) {
    gT = parseFloat(e.target.value);
    generateText();
}

function onChangeText(e) {
    gText = e.target.value;
    updateText();
    generateText();

}

function updateText() {
    gAPath = gAFont.getPath(gText, 30, 100, 72);
    gBPath = gBFont.getPath(gText, 30, 100, 72);
    //console.assert(gAPath.commands.length === gBPath.commands.length);

    gAPathSVG.innerHTML = gAPath.toSVG();
    gBPathSVG.innerHTML = gBPath.toSVG();    
}

function init(aFont, bFont) {
    gAFont = aFont;
    gBFont = bFont;
}

function generateText() {
    var dPath = new opentype.Path();

    // Since we don't care if the fonts match or not, we just take the shortest command list of the two.
    var aLength = gAPath.commands.length;
    var bLength = gBPath.commands.length;
    var commandsLength = Math.min(aLength, bLength);


    for (var i = 0; i < commandsLength; i++) {
        var aCommand = gAPath.commands[i];
        var bCommand = gBPath.commands[i];
        //console.assert(aCommand.type === bCommand.type, 'Command %d is not equal: %s vs %s', i, aCommand.type, bCommand.type);
        var aType = aCommand.type;
        var bType = bCommand.type;

        var POINTS_MAP = {'Z': 0, 'M': 1, 'L': 1, 'Q': 2, 'C': 3};
        var aPointCount = POINTS_MAP[aCommand.type];
        var bPointCount = POINTS_MAP[bCommand.type];
        var pointCount = Math.min(aPointCount, bPointCount);
        var type;
        if (aPointCount < bPointCount) {
            type = aCommand.type;
        } else {
            type = bCommand.type;
        }


        var dCommand = {type: type};
        if (type === 'M' || type === 'L' ||
            type === 'Q' || type === 'C') {
            dCommand.x = mix(aCommand.x, bCommand.x, gT);
            dCommand.y = mix(aCommand.y, bCommand.y, gT);
        }
        if (type === 'Q' || type === 'C') {
            dCommand.x1 = mix(aCommand.x1, bCommand.x1, gT);
            dCommand.y1 = mix(aCommand.y1, bCommand.y1, gT);
        }
        if (type === 'C') {
            dCommand.x2 = mix(aCommand.x2, bCommand.x2, gT);
            dCommand.y2 = mix(aCommand.y2, bCommand.y2, gT);
        }

        dPath.commands.push(dCommand);

    }
    gOutPath = dPath.toSVG();
    gOutPathSVG.innerHTML = '<g transform="translate(0,0) scale(2.0)">' + gOutPath + '</g>';

}

function onResize() {
    drawArrows();
}

function drawArrows() {

    function roadPath(x1, y1, x2, y2) {
        var cy = mix(y1, y2, 0.5);
        var p = new opentype.Path();
        p.moveTo(x1, y1);
        p.lineTo(x1, cy);
        p.lineTo(x2, cy);
        p.lineTo(x2, y2);
        return '<path d="' + p.toPathData() + '" style="fill: none;stroke-width: 5; stroke: #aaa"/>';
    }

    function arrowPath(x, y, width, height) {
        var p = new opentype.Path();
        p.moveTo(x, y);
        p.lineTo(x - width, y - height);
        p.lineTo(x + width, y - height);
        return '<path d="' + p.toPathData() + '" style="fill: #aaa"/>';

    }

    var svg = document.getElementById('arrows');
    var r = svg.getBoundingClientRect();
    var cx = r.width / 2;
    var p1 = roadPath(cx / 2, 0, cx, r.height - 5);
    var p2 = roadPath(cx + (cx / 2), 0, cx, r.height - 5);
    var pa = arrowPath(cx, r.height, 10, 10);

    svg.innerHTML = p1 + p2 + pa;
}

function onDownloadButtonClicked(e) {
    e.preventDefault();
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
    svg += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 400" xmlns:xlink="http://www.w3.org/1999/xlink">\n';
    svg += gOutPath + '\n';
    svg += '</svg>\n';
    var fileName = 'custom-font.svg';
    var blob = new Blob([svg], {type: 'octet/stream'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    return false;
}

function onChangeFont(e) {
    var fontName = e.target.value;
    var fontPair = FONT_MAP[fontName];
    loadFonts(fontPair[0], fontPair[1]);
}

document.getElementById('t-slider').addEventListener('input', onChangeSlider);
document.getElementById('text-field').addEventListener('input', onChangeText);
document.getElementById('download-button').addEventListener('click', onDownloadButtonClicked);
document.getElementById('font-select').addEventListener('change', onChangeFont);

function loadFonts(aFile, bFile) {
    opentype.load(aFile, function(err, aFont) {
        if (err) {
            console.error(err);
        } else {
            opentype.load(bFile, function(err, bFont) {
                if (err) {
                    console.error(err);
                } else {
                    init(aFont, bFont);
                    updateText();
                    generateText();
                }
            });
        }
    });

}

window.addEventListener('resize', onResize);

drawArrows();
var fontPair = FONT_MAP['Fira Sans'];
loadFonts(fontPair[0], fontPair[1]);
