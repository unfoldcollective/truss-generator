var showGUI = true;

var controlKit;
var truss_params;
var roof_params;

var mouseDrag;
var shouldLogLengths      = false;

var origin;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fill(255);

    // init ControlKit
    truss_params = {
        width: 250,
        width_range: [0,1000],
        min_height: 100,
        min_height_range: [0,300],
        wave_height: 65,
        wave_height_range: [0,300],
    }
    roof_params = {
        length: 1500,
        length_range: [0, 3000],
        step: 100,
        step_range: [10, 300],
    }
    controlKit = new ControlKit();
    controlKit.addPanel({
        label: "Truss Parameters",
        })
        .addGroup()
            .addSlider(truss_params, 'width',       'width_range')
            .addSlider(truss_params, 'min_height',  'min_height_range')
            .addSlider(truss_params, 'wave_height', 'wave_height_range')
        .addGroup()
            .addSlider(roof_params,  'length',      'length_range')
            .addSlider(roof_params,  'step',        'step_range')

    // set start params
    origin = {
        x: - truss_params.width * 0.5,
        y: truss_params.wave_height * 1,
        z: - roof_params.length * 0.5,
    };

    mouseDrag = {
        x: 0,
        y: 0,
    };
}

function draw() {
    background(0);

    // fill(0,255,0);
    // sphere(5);
    // fill(255);
    
    rotateY(map(mouseDrag.x, -0.5 * width, 0.5 * width, -0.5 * Math.PI, 0.5 * Math.PI));
    rotateX(map(mouseDrag.y, -0.5 * height, 0.5 * height, -0.5 * Math.PI, 0.5 * Math.PI));
    
    drawRoof();
}

function drawRoof() {
    _.range(0, roof_params.length, roof_params.step)
        .map(function(offset_z, index, array) {
            return {
                vertex_lists: calcTrussVertexLists_scissor(index/array.length),
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

    var top_x = 0 + truss_params.width * wave_ratio_cos;
    var top_y = 0 - truss_params.min_height - truss_params.wave_height * wave_ratio_cos;

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
                x: truss_params.width,
                y: 0,
            },
            {   // lower left
                x: 0,
                y: 0,
            },
        ],
    ];
}

function calcTrussVertexLists_scissor(length_ratio) {
    var offset_cos = 1 * Math.PI;
    var offset_sin = 0 * Math.PI;

    wave_ratio_cos = Math.cos(length_ratio * 2 * Math.PI + offset_cos);
    wave_ratio_cos = map(wave_ratio_cos, -1, 1, 0, 1);
    wave_ratio_sin = Math.sin(length_ratio * 2 * Math.PI + offset_sin);
    wave_ratio_sin = map(wave_ratio_sin, -1, 1, 0, 1);

    var top_x = 0 + truss_params.width * wave_ratio_cos;
    var top_y = 0 - truss_params.min_height - truss_params.wave_height * wave_ratio_cos;

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
                x: truss_params.width,
                y: 0,
            },
        ],
        [
            {   // lower right
                x: truss_params.width,
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
                x: top_x + 0.5 * (truss_params.width - top_x),
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
    var instructionsElem = document.querySelector("#instructions");
    var controlKitElem   = document.querySelector("#controlKit");
    instructionsElem.style.display = instructionsElem.style.display === 'none' ? '' : 'none';
    controlKitElem.style.display   = controlKitElem.style.display === 'none' ? '' : 'none';
    showGUI = !showGUI;
}

function resetRotation() {
    mouseDrag = {
        x: 0,
        y: 0,
    };
}