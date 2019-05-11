
var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d'),

CENTROID_RADIUS = 10,
CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
CENTROID_FILL_STYLE   = 'rgba(80, 190, 240)',

RING_INNER_RADIUS = 35,
RING_OUTER_RADIUS = 55,

ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
ANNOTATIONS_TEXT_SIZE = 12,

TICK_WIDTH = 10,
TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

GUIDEWIRE_STROKE_STYLE = 'goldenrod',
GUIDEWIRE_FILL_STYLE = 'rgba(250, 250, 0, 0.6)',

circle = { x: canvas.width/2,
           y: canvas.height/2,
           radius: 150
         };

// Functions..........................................................
var pos = document.getElementById('pos');
canvas.addEventListener('mousedown',function(e){

var tt = windowToCanvas(e.clientX, e.clientY);
pos.innerText = tt.x + ',' +tt.y;
},false);

function windowToCanvas(x, y)
{
var bbox = canvas.getBoundingClientRect();
return { x: x - bbox.left * (canvas.width / bbox.width),
  y: y - bbox.top * (canvas.height / bbox.height) };
}


function drawGrid(color, stepx, stepy) {
context.save()

context.shadowColor = undefined;
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;

context.strokeStyle = color;
context.fillStyle = '#ffffff';
context.lineWidth = 0.5;
context.fillRect(0, 0, context.canvas.width,
                      context.canvas.height);

for (var i = stepx + 0.5;
        i < context.canvas.width; i += stepx) {
 context.beginPath();
 context.moveTo(i, 0);
 context.lineTo(i, context.canvas.height);
 context.stroke();
}

for (var i = stepy + 0.5;
        i < context.canvas.height; i += stepy) {
 context.beginPath();
 context.moveTo(0, i);
 context.lineTo(context.canvas.width, i);
 context.stroke();
}

context.restore();
}

function drawDial() {
var loc = {x: circle.x, y: circle.y};

drawCentroid(); // 기준 원
drawCentroidGuidewire(loc); //시침

drawRing();
//drawTickInnerCircle();
drawTicks();
drawAnnotations();
}

function drawCentroid() {
context.beginPath();
context.save();
context.strokeStyle = CENTROID_STROKE_STYLE;
context.fillStyle = CENTROID_FILL_STYLE;
context.arc(circle.x, circle.y,
           CENTROID_RADIUS, 0, Math.PI*2);
context.stroke();
context.fill();
context.restore();
}

function drawCentroidGuidewire(loc) {
var angle = -Math.PI/4,
   radius, endpt;

radius = circle.radius + RING_OUTER_RADIUS;

if (loc.x >= circle.x) {
  endpt = { x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
  };
}
else {
  endpt = { x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
  };
}

context.save();

context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
context.fillStyle = GUIDEWIRE_FILL_STYLE;

context.beginPath();
context.moveTo(circle.x, circle.y);
context.lineTo(endpt.x, endpt.y);
context.stroke();

context.beginPath();
context.strokeStyle = TICK_LONG_STROKE_STYLE;
context.arc(endpt.x, endpt.y, 5, 0, Math.PI*2, false);
context.fill();
context.stroke();

context.restore();
}

function drawRing() {
drawRingOuterCircle();

context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
context.arc(circle.x, circle.y,
           circle.radius + RING_INNER_RADIUS,
           0, Math.PI*2, false);

context.fillStyle = 'rgba(100, 140, 230, 0.1)';
context.fill();
context.stroke();
}

function drawRingOuterCircle() {
context.shadowColor = 'rgba(0, 0, 0, 0.7)';
context.shadowOffsetX = 3,
context.shadowOffsetY = 3,
context.shadowBlur = 6,
context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
context.beginPath();
context.arc(circle.x, circle.y, circle.radius +
           RING_OUTER_RADIUS, 0, Math.PI*2, true);
context.stroke();
}

function drawTickInnerCircle() {
context.save();
context.beginPath();
context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
context.arc(circle.x, circle.y,
           circle.radius + RING_INNER_RADIUS - TICK_WIDTH,
           0, Math.PI*2, false);
context.stroke();
context.restore();
}



function drawTicks() {
var radius = circle.radius + RING_INNER_RADIUS,
   ANGLE_MAX = 2*Math.PI,
   ANGLE_DELTA = Math.PI/64,
   tickWidth;
console.log(`drawTicks() - radius : ${radius}, angleMax : ${ANGLE_MAX}, angleDelta : ${ANGLE_DELTA}`);
//radius : 185, angleMax : 6.283185307179586, angleDelta : 0.04908738521234052
context.save();
for (var angle = 0, cnt = 0; angle < ANGLE_MAX;
                            angle += ANGLE_DELTA, cnt+=2) {
  drawTick(angle, radius, cnt); 
}

context.restore();
}

function drawTick(angle, radius, cnt) {
var count = 0;
return function(angle,radius,cnt){
  console.log('drawTick() - angle : ' + angle + ', radius : ' + radius + ', cnt : ' + cnt);
  // TICK_WIDTH = 10, RADIUS = 185, x = 325, y = 225
  var tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH/2;
  context.beginPath();
  var moveX = circle.x + Math.cos(angle) * (radius - tickWidth);
  var moveY = circle.y + Math.sin(angle) * (radius - tickWidth);
  console.log('moveX : ' + moveX +', moveY : ' + moveY);
  context.moveTo(moveX, moveY);

  var lineX = circle.x + Math.cos(angle) * (radius);
  var lineY = circle.y + Math.sin(angle) * (radius);
  console.log('lineX : ' + lineX +', lineY : ' + lineY);
  context.lineTo(lineX, lineY);

  context.strokeStyle = TICK_SHORT_STROKE_STYLE;
  context.stroke();
  return count++;
}
}

function drawAnnotations() {
var radius = circle.radius + RING_INNER_RADIUS;

context.save();
context.fillStyle = ANNOTATIONS_FILL_STYLE;
context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica'; 

for (var angle=0; angle < 2*Math.PI; angle += Math.PI/8) {
  context.beginPath();
  context.fillText((angle * 180 / Math.PI).toFixed(0),
     circle.x + Math.cos(angle) * (radius - TICK_WIDTH*2),
     circle.y - Math.sin(angle) * (radius - TICK_WIDTH*2));
}
context.restore();
}

// Initialization....................................................

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';
drawGrid('lightgray', 10, 10);
drawDial();

context.beginPath();
context.strokeStyle = 'red';
context.moveTo(503.0517717936606,251.4114854019651);
context.lineTo(507.9976543434845,252.14513777424193);
context.stroke();
