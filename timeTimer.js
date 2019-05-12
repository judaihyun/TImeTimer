
'use strict'

var timeTimer = timeTimer || {};


function starter()
{
    var timerObj = new timeTimer();
    timerObj.initTimeTimer(150);
}


document.addEventListener('DOMContentLoaded',function(){

   
timeTimer = function()
{

    var state    = Object.create(null);
    var view     = Object.create(null);
    var controls = Object.create(null);

    var CLOCKFACE_STROKE_STYLE = 'red',
        CLOCKFACE_CENTER_RADIUS =  5,
        CLOCKFACE_RADIUS = 120,
        CLOCKNUMBER_STROKE_STYLE = 'black',
        CLOCKNUMBER_TEXT_ALIGN = 'center',
        TICK_SHORT_STROKE_STYLE = 'black',
        TICK_WIDTH = 10,

        MAX_TIME_COUNT = 60;



view.create = function(radius)
{
    view.radius = radius;

    view.canvas = elt('canvas', {id:'canvas', width:'350', height:'400'});
    view.circle = {
        x : this.canvas.width / 2,
        y : this.canvas.height / 2
    }

    if(view.ctx) delete view.ctx;
    view.ctx = view.canvas.getContext('2d')

    view.timeDiv = elt('div', {id:'displayTime'});

    view.drawClockFace(); 

    view.drawTicks();

    view.drawClockNumber();

    view.drawDefaultInnerCircle();

    view.updateClockEvent = new Event('updateClock');
    document.addEventListener('updateClock',view.drawInnerCircle);




    var pos = document.getElementById('pos');
    view.canvas.addEventListener('mousedown',function(e){
    
    var tt = windowToCanvas(e.clientX, e.clientY);
        pos.innerText = tt.x + ',' +tt.y;
    },false);
    
    function windowToCanvas(x, y)
    {
    var bbox = view.canvas.getBoundingClientRect();
    return { x: x - bbox.left * (view.canvas.width / bbox.width),
      y: y - bbox.top * (view.canvas.height / bbox.height) };
    }




    return elt(
        'div', { class:'mainLayout' }, view.canvas, view.timeDiv
    );
}


view.drawClockFace = function()
{
    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.strokeStyle = CLOCKFACE_STROKE_STYLE;
    //arc(x, y, radius, startAngle, endAngle, anti)
    view.ctx.arc(view.circle.x, view.circle.y,
         CLOCKFACE_RADIUS, 0, 360, false);
    view.ctx.stroke();

    view.ctx.beginPath();
    view.ctx.arc(view.circle.x, view.circle.y,
         CLOCKFACE_CENTER_RADIUS, 0, 360, false);
    view.ctx.fill();
    view.ctx.restore();
}



view.drawTicks = function()
{
    var radius = CLOCKFACE_RADIUS,
        ANGLE_MAX = Math.PI * 2,
        ANGLE_DELTA = Math.PI / 30,  // tick angle (180도 / 갯수) == 1파이이므로
        TICK_WIDTH;

    //console.log(`drawTicks() - radius : ${radius}, angleMax : ${ANGLE_MAX}, angleDelta : ${ANGLE_DELTA}`);

    view.ctx.save();
    for(var angle = 0, cnt = 0; angle < ANGLE_MAX;
                                angle += ANGLE_DELTA, cnt+=2)
    {
        view.drawTick(angle, radius, cnt);
    }
    view.ctx.restore();

}

view.drawTick = function(angle, radius, cnt)
{
    //console.log('drawTick() - angle : ' + angle + ', radius : ' + radius + ', cnt : ' + cnt);
    var tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
    view.ctx.save();
    view.ctx.beginPath();
    var moveX = view.circle.x + Math.cos(angle) * (radius - tickWidth);
    var moveY = view.circle.y + Math.sin(angle) * (radius - tickWidth);

    var lineX = view.circle.x + Math.cos(angle) * (radius);
    var lineY = view.circle.y + Math.sin(angle) * (radius);

    //console.log('lineX : ' + lineX +', lineY : ' + lineY);
    //console.log('moveX : ' + moveX +', moveY : ' + moveY);

    view.ctx.moveTo(moveX, moveY);
    view.ctx.lineTo(lineX, lineY);

    view.ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
    view.ctx.stroke();
    view.ctx.restore();
}
view.drawDefaultInnerCircle = function()
{
    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.strokeStyle = 'blue';
    view.ctx.fillStyle = 'blue';
    view.ctx.arc(view.circle.x, view.circle.y,
                 CLOCKFACE_RADIUS - TICK_WIDTH,
                 0, Math.PI * 2);
    view.ctx.fill();
    view.ctx.restore(); 
}

view.drawInnerCircle = function(e)
{
    //console.log(e.detail);
    var ANGLE_DELTA = (Math.PI * 2) / 60;
    var angle = (Math.PI * 1.5) - ANGLE_DELTA * e.detail;
    var degree = (180/Math.PI) * angle;
    
    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.strokeStyle = 'white';
    view.ctx.fillStyle = 'white';
    view.ctx.moveTo(view.circle.x, view.circle.y);
    view.ctx.arc(view.circle.x, view.circle.y,
                 CLOCKFACE_RADIUS - TICK_WIDTH,
                 Math.PI * 1.5, angle, true);
    console.log('degree : ' + degree);
    console.log(`angle : ${angle}, radius : ${CLOCKFACE_RADIUS - TICK_WIDTH}`);
    view.ctx.fill();
    view.ctx.restore();
}

view.drawClockNumber = function()
{
    var ang;
    var num;
    var radius = view.radius;
    view.ctx.save();
    view.ctx.translate(view.circle.x, view.circle.y);
    view.ctx.font = radius*0.15 + "px arial";
    view.ctx.textBaseline = "middle";
    view.ctx.textAlign = CLOCKNUMBER_TEXT_ALIGN;
    view.ctx.strokeStyle = CLOCKNUMBER_STROKE_STYLE;
    console.log('radius : ' + radius);
    var realNum = 0;
    for(num = 0; num < 12; num++)
    {
    
        ang = num * Math.PI / 6;
        view.ctx.rotate(ang);
        view.ctx.translate(0, -radius);
        view.ctx.rotate(-ang);

        view.ctx.fillText(realNum.toString(), 0, 0);
        view.ctx.rotate(ang);
        view.ctx.translate(0, radius);
        view.ctx.rotate(-ang);
        realNum += 5;
    }
    view.ctx.restore();
}

state.create = function(_endTime)
{
    state.timerId;
    state.isStart = false;
    state.defaultTime = _endTime;
    state.endTime = _endTime;
    state.startStopButton;
    state.restartBtn;

    state.restartEvent = new Event('resTrigger');
    document.addEventListener('resTrigger',resTrigger);
   
}

 
function resTrigger()
{
    console.info(`resTrigger Event - activate ( timer_id : ${state.timerId} , ${state.isStart} )`);
    if(state.isStart){
        clearInterval(state.timerId);
        state.restartBtn.style.visibility = 'hidden';
        state.displayTime.innerHTML = state.defaultTime;
        state.startStopButton.innerHTML = 'START';
        state.isStart = false
    }else{
        state.restartBtn.style.visibility = 'visible';
        clearInterval(state.timerId);
        state.displayTime.innerHTML = state.defaultTime;
    }
}
state.updateClock = function(elapseTime)
{
    /*
    document.dispatchEvent(view.updateClockEvent,
       {detail: elapseTime} );
       */
    document.dispatchEvent(new CustomEvent('updateClock',
     { detail: (MAX_TIME_COUNT - Math.floor(elapseTime)) }));

}

state.interval = function(t_unit)
{
    if(t_unit < 0) return;
    const adjustInterval = 10;
    state.displayTime = document.getElementById('displayTime');
    var expectTime = Date.now() + t_unit;
    var elapseTime;
    console.time();
    state.timerId = setInterval(adjustTime, Math.max(0, adjustInterval - elapseTime));
    console.info(`state.interval() - activate ( t_unit : ${t_unit}, timerId : ${state.timerId} )`);
    function adjustTime()
    { 
        elapseTime = Date.now() - expectTime;
        state.endTime = Math.abs(elapseTime);
        var temp = Math.abs(elapseTime) / 1000;
        state.updateClock(temp);
        state.displayTime.innerHTML = temp;

        if(elapseTime > 0)
        {
            state.updateClock(temp);
            state.displayTime.innerHTML = temp;
            console.timeEnd();
            state.endTime = state.defaultTime;
            clearInterval(state.timerId);
            return;
        } 
        elapseTime += adjustInterval;
    }
}

state.startEventProcess = function()
{
    console.info('state.startEventProcess() - activate');
    state.interval(state.endTime);
    state.startStopButton.innerHTML = 'STOP';
    state.restartBtn.style.visibility = 'visible';
    state.isStart = true;
}

state.stopEventProcess = function()
{
    console.info('state.stopEventProcess() - activate ( timer_id : ' + state.timerId + ')');
    clearInterval(state.timerId);
    state.startStopButton.innerHTML = 'START';
    state.isStart = false;
}

controls.startAndStop = function(){
    state.startStopButton = elt('button',{type:'button', id:'switch'},'START');
    state.startStopButton.addEventListener('click', function(){
    console.info('controls.startAndStop() - startStopButton clicked');

        if(!state.isStart)
        {
            state.startEventProcess();
        }else{
            state.stopEventProcess(); 
        }

    });
    return state.startStopButton;
}

controls.restart = function(){
    state.restartBtn = elt('button',{type:'button', id:'restart'},'RESTART');
    state.restartBtn.style.visibility = 'hidden';

    state.restartBtn.addEventListener('click', function(){
        console.info('controls.restart() - restartBtn clicked');
        document.dispatchEvent(state.restartEvent);
    });

    return state.restartBtn;
}

return{
    initTimeTimer : function(radius)
    {
        console.info(`initTimeTimer is activated `);
        var ms = 1000;

        var viewPannel = view.create(radius);

        state.create(60 * ms);

        var toolbar = elt('div', {class:'toolbar'});
        for(var name in controls)
            toolbar.appendChild(controls[name]());

        viewPannel.appendChild(toolbar);

      //document.body.appendChild(viewPannel);
        
        document.body.insertBefore(viewPannel, document.body.firstChild);
    }
}

   

};


starter();

},false);
