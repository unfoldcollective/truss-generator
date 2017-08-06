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
var truss_step          = 100;
var truss_stepMin       = 10;
var truss_stepMax       = 1000;
var truss_stepStep      = 10;

var roof_length        = 1500;
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
            drawTruss(origin, offset_z, index/array.length);
            return offset_z;
        });
}

function drawTruss(origin, offset_z, ratio) {
    var offset_cos = 1 * Math.PI;
    var offset_sin = 0 * Math.PI;

    wave_ratio_cos = Math.cos(ratio * 2 * Math.PI + offset_cos);
    wave_ratio_cos = map(wave_ratio_cos, -1, 1, 0, 1);
    
    wave_ratio_sin = Math.sin(ratio * 2 * Math.PI + offset_sin);
    wave_ratio_sin = map(wave_ratio_sin, -1, 1, 0, 1);

    beginShape();
        vertex( // lower left
            origin.x,
            origin.y,
            origin.z + offset_z
        );
        vertex( // lower right
            origin.x + truss_width,
            origin.y,
            origin.z + offset_z
        );
        vertex( // top
            origin.x + truss_width * wave_ratio_cos,
            origin.y - truss_height * wave_ratio_cos - 100,
            origin.z + offset_z
        );
        vertex( // lower left
            origin.x,
            origin.y,
            origin.z + offset_z
        );
    endShape();

    fill(0,255,0);
    sphere(5);
    fill(255);
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