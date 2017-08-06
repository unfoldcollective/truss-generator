var gui;
var showGUI = true;

var truss_width           = 250;
var truss_widthMin        = -200;
var truss_widthMax        = 1000;
var truss_widthStep       = 10;

var truss_wave_height     = 65;
var truss_wave_heightMin  = 0;
var truss_wave_heightMax  = 300;
var truss_wave_heightStep = 5;

var truss_min_height      = 100;
var truss_min_heightMin   = 0;
var truss_min_heightMax   = 300;
var truss_min_heightStep  = 5;

var truss_step            = 100;
var truss_stepMin         = 10;
var truss_stepMax         = 1000;
var truss_stepStep        = 10;

var roof_length           = 1500;
var roof_lengthMin        = -200;
var roof_lengthMax        = 3000;
var roof_lengthStep       = 100;

var shouldLogLengths      = false;

var origin = {
    x: - truss_width * 0.5,
    y: truss_wave_height * 1,
    z: - roof_length * 0.5,
};

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fill(255);
    gui  = createGui('Truss');
    gui.addGlobals(
        'truss_width',
        'roof_length',
        'truss_wave_height',
        'truss_min_height',
        'truss_step',
    );
}

function draw() {
    background(0);

    fill(0,255,0);
    sphere(5);
    fill(255);
    
    if (mouseIsPressed && keyIsPressed) {
        rotateZ(map(mouseX, 0, width, -0.5 * Math.PI, 0.5 * Math.PI));
        rotateX(map(mouseY, 0, height, -0.5 * Math.PI, 0.5 * Math.PI));
    }
    
    drawRoof();
}

function drawRoof() {
    _.range(0, roof_length, truss_step)
        .map(function(offset_z, index, array) {
            return {
                vertices: calcTrussVertices(index/array.length),
                offset_z: offset_z,
            };
        })
        .map(function(truss) {
            drawTruss(origin, truss.vertices, truss.offset_z);
            return truss;
        })
        .map(function(truss) {
            return calcVertexLengths(truss.vertices);
        })
        .map(function(vertex_lengths) {
            if (shouldLogLengths) {
                console.log(vertex_lengths);
            }
        });
    shouldLogLengths = false;
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
            y: 0 - truss_wave_height * wave_ratio_cos - truss_min_height,
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

function calcVertexLengths(truss_vertices) {
    return truss_vertices.map(function(vertex_cur, index, array) {
        if (index == array.length - 1) {
            var vertex_next = array[0]
        }
        else {
            var vertex_next = array[index + 1]   
        }
        return dist(
            vertex_cur.x, vertex_cur.y,
            vertex_next.x, vertex_next.y
        );
    });
}

// event handlers
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() {
  if (key === 'g') {
    toggleGUI();
  }
  else if (key === 'l') {
    shouldLogLengths = true;
  }

  // uncomment to prevent any default behavior
  // return false;
}

function toggleGUI() {
    gui.toggleVisibility()
    var instructions = document.querySelector("#instructions");
    instructions.style.display = instructions.style.display === 'none' ? '' : 'none';

    showGUI = !showGUI;
}