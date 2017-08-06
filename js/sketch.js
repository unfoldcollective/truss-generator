var gui;
var showGUI = true;

var mouseDrag;

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

    mouseDrag = {
        x: 0,
        y: 0,
    };
}

function draw() {
    background(0);

    fill(0,255,0);
    sphere(5);
    fill(255);
    
    rotateY(map(mouseDrag.x, -0.5 * width, 0.5 * width, -0.5 * Math.PI, 0.5 * Math.PI));
    rotateX(map(mouseDrag.y, -0.5 * height, 0.5 * height, -0.5 * Math.PI, 0.5 * Math.PI));
    
    drawRoof();
}

function drawRoof() {
    _.range(0, roof_length, truss_step)
        .map(function(offset_z, index, array) {
            return {
                vertex_lists: calcTrussVertexLists_german(index/array.length),
                // vertex_lists: calcTrussVertexLists_triangle(index/array.length),
                offset_z: offset_z,
            };
        })
        .map(function(truss) {
            drawTruss(origin, truss.vertex_lists, truss.offset_z);
            return truss;
        })
        .map(function(truss) {
            return calcVertexLengths(truss.vertex_lists);
        })
        .map(function(vertex_lengths) {
            if (shouldLogLengths) {
                console.log(vertex_lengths);
            }
        });
    shouldLogLengths = false;
}

function calcTrussVertexLists_triangle(length_ratio) {
    var offset_cos = 1 * Math.PI;
    var offset_sin = 0 * Math.PI;

    wave_ratio_cos = Math.cos(length_ratio * 2 * Math.PI + offset_cos);
    wave_ratio_cos = map(wave_ratio_cos, -1, 1, 0, 1);
    wave_ratio_sin = Math.sin(length_ratio * 2 * Math.PI + offset_sin);
    wave_ratio_sin = map(wave_ratio_sin, -1, 1, 0, 1);

    var top_x = 0 + truss_width * wave_ratio_cos;
    var top_y = 0 - truss_min_height - truss_wave_height * wave_ratio_cos;

    return [
        [
            {   // lower left
                x: 0,
                y: 0,
            },
            {   // top
                x: top_x,
                y: top_y,
            },
            {   // lower right
                x: truss_width,
                y: 0,
            },
            {   // lower left
                x: 0,
                y: 0,
            },
        ],
    ];
}

function calcTrussVertexLists_german(length_ratio) {
    var offset_cos = 1 * Math.PI;
    var offset_sin = 0 * Math.PI;

    wave_ratio_cos = Math.cos(length_ratio * 2 * Math.PI + offset_cos);
    wave_ratio_cos = map(wave_ratio_cos, -1, 1, 0, 1);
    wave_ratio_sin = Math.sin(length_ratio * 2 * Math.PI + offset_sin);
    wave_ratio_sin = map(wave_ratio_sin, -1, 1, 0, 1);

    var top_x = 0 + truss_width * wave_ratio_cos;
    var top_y = 0 - truss_min_height - truss_wave_height * wave_ratio_cos;

    return [
        [
            {   // lower left
                x: 0,
                y: 0,
            },
            {   // top
                x: top_x,
                y: top_y,
            },
            {   // lower right
                x: truss_width,
                y: 0,
            },
        ],
        [
            {   // lower right
                x: truss_width,
                y: 0,
            },
            {   // upper left
                x: 0.5 * top_x,
                y: 0.5 * top_y,
            },
        ],
        [
            {   // lower left
                x: 0,
                y: 0,
            },
            {   // upper rigt
                x: top_x + 0.5 * (truss_width - top_x),
                y: 0.5 * top_y,
            },
        ],
    ];
}

function drawTruss(origin, truss_vertex_lists, offset_z) {
    truss_vertex_lists_3d = truss_vertex_lists.map(function(truss_vertex_list) {
            return truss_vertex_list.map(function(vertex) {
                return _.set(vertex, 'z', offset_z)
            });
        })
        .map(function(truss_vertex_list_3d) {
            draw_vertex_list(origin, truss_vertex_list_3d);
        });    
}

function draw_vertex_list(origin, vertex_list) {
    beginShape();
        for (var i = 0; i < vertex_list.length; i++) {
            vertex(
                origin.x + vertex_list[i].x,
                origin.y + vertex_list[i].y,
                origin.z + vertex_list[i].z,
            )
        }
    endShape();
}

function calcVertexLengths(truss_vertex_lists) {
    return truss_vertex_lists.map(function(truss_vertex_list) {
        return truss_vertex_list.map(function(vertex_cur, index, array) {
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
  else if (key === 'r') {
    resetRotation();
  }

  // uncomment to prevent any default behavior
  // return false;
}

function mouseDragged() {
    if (keyIsPressed && keyCode == SHIFT) {
        mouseDrag.x += mouseX - pmouseX;
        mouseDrag.y += mouseY - pmouseY;
    }
}

function toggleGUI() {
    gui.toggleVisibility()
    var instructions = document.querySelector("#instructions");
    instructions.style.display = instructions.style.display === 'none' ? '' : 'none';

    showGUI = !showGUI;
}

function resetRotation() {
    mouseDrag = {
        x: 0,
        y: 0,
    };
}