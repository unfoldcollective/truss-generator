var gui;

var truss_width         = 200;
var truss_widthMin      = -200;
var truss_widthMax      = 1000;
var truss_widthStep     = 1;
var truss_length        = 1500;
var truss_lengthMin     = -200;
var truss_lengthMax     = 3000;
var truss_lengthStep    = 10;
var truss_height        = 250;
var truss_heightMin     = -250;
var truss_heightMax     = 250;
var truss_heightStep    = 1;
var truss_top_ratio     = 0.5;
var truss_top_ratioMin  = -1;
var truss_top_ratioMax  = 2;
var truss_top_ratioStep = 0.01;
var truss_step          = 100;
var truss_stepMin       = 0;
var truss_stepMax       = 1000;
var truss_stepStep      = 10;

function setup() {
    console.log('hello')
    createCanvas(windowWidth, windowHeight, WEBGL);
    fill(255);
    gui  = createGui('Truss');
    gui.addGlobals(
        'truss_width',
        'truss_length',
        'truss_height',
        'truss_top_ratio',
        'truss_step',
    );
}

function draw() {
    background(0);
    drawRoof();
}

function drawRoof() {
    var origin = {
        x: - truss_width * 0.5,
        y: truss_height * 0.5,
        z: - truss_length * (2/3),
    };

    _.range(0, truss_length, truss_step)
        .map(function(value) {
            drawTruss(origin, value);
            return value;
        });
}

function drawTruss(origin, offset_z) {
    beginShape();
        vertex(origin.x,origin.y,origin.z + offset_z);             // lower left
        vertex(origin.x+truss_width,origin.y,origin.z + offset_z); // lower right
        vertex(origin.x+truss_width*truss_top_ratio,origin.y-truss_height,origin.z + offset_z); // top
        vertex(origin.x,origin.y,origin.z + offset_z);             // lower left
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