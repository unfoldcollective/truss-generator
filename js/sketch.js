var gui;

var truss_width         = 300;
var truss_widthMin      = -200;
var truss_widthMax      = 1000;
var truss_widthStep     = 1;
var truss_height        = 150;
var truss_heightMin     = -250;
var truss_heightMax     = 500;
var truss_heightStep    = 1;
var truss_top_ratio     = 0.5;
var truss_top_ratioMin  = -1;
var truss_top_ratioMax  = 2;
var truss_top_ratioStep = 0.01;
var truss_step          = 50;
var truss_stepMin       = 10;
var truss_stepMax       = 1000;
var truss_stepStep      = 10;

var roof_length        = 500;
var roof_lengthMin     = -200;
var roof_lengthMax     = 3000;
var roof_lengthStep    = 10;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fill(255);
    gui  = createGui('Truss');
    gui.addGlobals(
        'truss_width',
        'roof_length',
        'truss_height',
        'truss_top_ratio',
        'truss_step',
    );
}

function draw() {
    background(0);

    fill(0,255,0);
    sphere(5);
    fill(255);
    
    rotateZ(map(mouseX, 0, width, -0.5 * Math.PI, 0.5 * Math.PI));
    rotateX(map(mouseY, 0, height, -0.5 * Math.PI, 0.5 * Math.PI));
    
    drawRoof();
}

function drawRoof() {
    var origin = {
        x: - truss_width * 0.5,
        y: truss_height * 1,
        z: - roof_length * 0.5,
    };

    _.range(0, roof_length, truss_step)
        .map(function(offset_z, index, array) {
            var truss_vertices = calcTrussVertices(index/array.length);
            drawTruss(origin, truss_vertices, offset_z);
            return offset_z;
        });
}

function calcTrussVertices(length_ratio) {
    var offset_cos = 1 * Math.PI;
    var offset_sin = 0 * Math.PI;

    wave_ratio_cos = Math.cos(length_ratio * 2 * Math.PI + offset_cos);
    wave_ratio_cos = map(wave_ratio_cos, -1, 1, 0, 1);
    wave_ratio_sin = Math.sin(length_ratio * 2 * Math.PI + offset_sin);
    wave_ratio_sin = map(wave_ratio_sin, -1, 1, 0, 1);

    return [
        {   // lower left
            x: 0,
            y: 0,
        },
        {   // lower right
            x: 0 + truss_width,
            y: 0,
        },
        {   // top
            x: 0 + truss_width * wave_ratio_cos,
            y: 0 - truss_height * wave_ratio_cos - 100,
        },
    ];
}

function drawTruss(origin, truss_vertices, offset_z) {
    beginShape();
    for (var i = 0; i < truss_vertices.length; i++) {
        vertex(
            origin.x + truss_vertices[i].x,
            origin.y + truss_vertices[i].y,
            origin.z + offset_z,
        )
    }
    // first vertex to complete loop
    vertex(
        origin.x + truss_vertices[0].x,
        origin.y + truss_vertices[0].y,
        origin.z + offset_z,
    )
    endShape();
}

// event handlers
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() {
  if (key === 'g') {
    toggleGUIs();
  }
  // uncomment to prevent any default behavior
  // return false;
}

function toggleGUIs() {
    guis.map(value => value.toggleVisibility() );
}