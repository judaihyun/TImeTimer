

var timeTimer = timeTimer || {};


document.addEventListener('DOMContentLoaded', ()=> {

    let radius = 150;
    var time = timeTimer();
    time.setDefaultTime(6);
    time.setRadius(radius);
    time.start();

},false);



timeTimer = function()
{

    const state    = Object.create(null),
          view     = Object.create(null),
          controls = Object.create(null),
          error = Object.create(null),
          ms = 1000;

    const CLOCKFACE_STROKE_STYLE = 'red',
          CLOCKFACE_CENTER_RADIUS =  5,
          CLOCKFACE_RADIUS = 120,
          CLOCKNUMBER_STROKE_STYLE = 'black',
          CLOCKNUMBER_TEXT_ALIGN = 'center',
          CLOCKNUMBER_RATIO = 0.13,
          TICK_SHORT_STROKE_STYLE = 'black',
          TICK_WIDTH = 10,

          ANGLE_DELTA = (Math.PI * 2) / 60,
          MAX_TIME_COUNT = 60;



view.create = radius =>
{
    view.radius = radius;

    view.canvas = elt('canvas', {id:'canvas', width:'350', height:'400'});
    view.circle = {
        x : view.canvas.width / 2,
        y : view.canvas.height / 2 + 0.5
    }

    if(view.ctx) delete view.ctx;
    view.ctx = view.canvas.getContext('2d')

    view.timeIndicator = elt('div', {id:'displayTime'});

    view.drawClockFace(); 

    view.drawTicks();

    view.drawClockNumber();

    view.drawDefaultInnerCircle();

    //view.drawGrid('gray', 10, 10);
    

    view.updateClockEvent = new Event('updateClock');
    document.addEventListener('updateClock',view.drawInnerCircle);

    /*
    const pos = document.getElementById('pos');
    view.canvas.addEventListener('mousedown',function(e){
    
    const tt = windowToCanvas(e.clientX, e.clientY);
        pos.innerText = tt.x + ',' +tt.y;
    },false);
    
    function windowToCanvas(x, y)
    {
        const bbox = view.canvas.getBoundingClientRect();
        return { x: x - bbox.left * (view.canvas.width / bbox.width),
        y: y - bbox.top * (view.canvas.height / bbox.height) };
    }
    */


    return elt(
        'div', { class:'mainLayout' }, view.canvas, view.timeIndicator
    );
}

view.drawGrid = (color, stepx, stepy) =>
{
    view.ctx.save();
    view.ctx.strokeStyle = color;
    view.ctx.lineWidth = 0.5;
    
    for(let i = stepx + 0.5; i < view.ctx.canvas.width; i += stepx)
    {
        view.ctx.beginPath();
        view.ctx.moveTo(i, 0);
        view.ctx.lineTo(i, view.ctx.canvas.height);
        view.ctx.stroke();
    }
   
    for(let i = stepy + 0.5; i < view.ctx.canvas.height; i += stepy)
    {
        view.ctx.beginPath();
        view.ctx.moveTo(0, i);
        view.ctx.lineTo(view.ctx.canvas.width, i);
        view.ctx.stroke();
    }
   

    view.ctx.restore();
}


view.drawClockFace = () =>
{
    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.strokeStyle = CLOCKFACE_STROKE_STYLE;
    view.ctx.arc(view.circle.x, view.circle.y,
         CLOCKFACE_RADIUS, 0, 360, false);
    view.ctx.stroke();

    view.ctx.beginPath();
    view.ctx.arc(view.circle.x, view.circle.y,
         CLOCKFACE_CENTER_RADIUS, 0, 360, false);
    view.ctx.fill();
    view.ctx.restore();
}

view.drawTicks = () =>
{
    const radius = CLOCKFACE_RADIUS,
        ANGLE_MAX = Math.PI * 2,
        ANGLE_DELTA = Math.PI / 30;  // tick angle (180도 / 갯수) == 1파이이므로

    view.ctx.save();
    for(let angle = 0, cnt = 0; angle < ANGLE_MAX;
                                angle += ANGLE_DELTA, cnt+=2)
    {
        view.drawTick(angle, radius, cnt);
    }
    view.ctx.restore();

}

view.drawTick = (angle, radius, cnt) =>
{
    //console.log('drawTick() - angle : ' + angle + ', radius : ' + radius + ', cnt : ' + cnt);
    let tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
    view.ctx.save();
    view.ctx.beginPath();
    let moveX = view.circle.x + Math.cos(angle) * (radius - tickWidth);
    let moveY = view.circle.y + Math.sin(angle) * (radius - tickWidth);

    let lineX = view.circle.x + Math.cos(angle) * (radius);
    let lineY = view.circle.y + Math.sin(angle) * (radius);

    //console.log('lineX : ' + lineX +', lineY : ' + lineY);
    //console.log('moveX : ' + moveX +', moveY : ' + moveY);

    view.ctx.moveTo(moveX, moveY);
    view.ctx.lineTo(lineX, lineY);

    view.ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
    view.ctx.stroke();
    view.ctx.restore();
}

view.drawDefaultInnerCircle = () =>
{
    console.log('drawDefaultInnerCircle - defaultTime : ' + state.defaultTime);
    let angle = ( Math.PI * 1.5) + ANGLE_DELTA * (state.defaultTime / ms);
    
    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.strokeStyle = 'blue';
    view.ctx.fillStyle = 'blue';
    console.log('angle : ' + angle);
    console.log('delta : ' + ANGLE_DELTA);
    view.ctx.moveTo(view.circle.x, view.circle.y);
    view.ctx.arc(view.circle.x, view.circle.y,
                 CLOCKFACE_RADIUS - TICK_WIDTH,
                 Math.PI * 1.5, angle);
    view.ctx.fill();
    view.ctx.restore(); 

}

view.drawInnerCircle = (evt) =>
{
    let angle = (Math.PI * 1.5) - ANGLE_DELTA * evt.detail;
    let degree = (180 / Math.PI) * angle;

    view.ctx.save();
    view.ctx.beginPath();
    view.ctx.fillStyle = 'rgba(255, 255, 255, .1)';
    //view.ctx.strokeStyle = 'rgba(255, 255, 255, .1)';
    view.ctx.moveTo(view.circle.x, view.circle.y);
    view.ctx.arc(view.circle.x, view.circle.y,
                 CLOCKFACE_RADIUS - TICK_WIDTH + 0.5,
                 Math.PI * 1.5, angle, true);
    //console.log('degree : ' + degree);
    //console.log(`angle : ${angle}, radius : ${CLOCKFACE_RADIUS - TICK_WIDTH}`);
    view.ctx.closePath();
    //view.ctx.stroke();
    view.ctx.fill();
    view.ctx.restore();
}

view.drawClockNumber = () =>
{
    let radius = view.radius - 10;
    view.ctx.save();
    view.ctx.translate(view.circle.x, view.circle.y);
    view.ctx.font = (radius * CLOCKNUMBER_RATIO) + "px arial";
    view.ctx.textBaseline = "middle";
    view.ctx.textAlign = CLOCKNUMBER_TEXT_ALIGN;
    view.ctx.strokeStyle = CLOCKNUMBER_STROKE_STYLE;

    let realNum = 0;
    for(let num = 0; num < 12; num++)
    {
        let ang = num * Math.PI / 6;
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

state.create = () =>
{
    state.timerId;
    state.isStart = false;

    state.restartEvent = new Event('restartEvent');
    document.addEventListener('restartEvent', state.restartEventProcess);
}


state.clearInterval = () =>
{
    clearInterval(state.timerId);
    state.endTime = state.defaultTime;
    //state.displayTime.innerHTML = state.defaultTime;
}

state.stopInterval = () =>
{
    clearInterval(state.timerId);
}

state.updateClock = elapseTime => 
{
    document.dispatchEvent(new CustomEvent('updateClock',
     { detail: (MAX_TIME_COUNT - Math.floor(elapseTime)) }));
}

state.interval = t_unit =>
{
    if(t_unit < 0) return;
    const adjustInterval = 1000;
    state.displayTime = document.getElementById('displayTime');
    let expectTime = Date.now() + t_unit;
    let elapseTime;

    console.time();
    state.timerId = setInterval(adjustTime, Math.max(0, adjustInterval - elapseTime));
    console.info(`state.interval() - activate ( t_unit : ${t_unit}, timerId : ${state.timerId} )`);

    function adjustTime()
    { 
        elapseTime = Date.now() - expectTime;
        state.endTime = Math.abs(elapseTime);
        let formattedTime = Math.abs(elapseTime) / 1000;
     //   state.displayTime.innerHTML = formattedTime;

        if(elapseTime > 0)
        {
            state.completed(formattedTime);
            return;
        } 
        elapseTime += adjustInterval;
        state.updateClock(formattedTime);
    }
}

state.completed = (formattedTime) =>
{
    console.info('state.completed() ');
    state.updateClock(formattedTime);
    //state.displayTime.innerHTML = formattedTime;
    console.timeEnd();
    state.endTime = state.defaultTime;
    state.imgToggle(state.restartBtn);
    state.clearInterval();
    state.stopEventProcess();
    view.drawDefaultInnerCircle();
}

state.imgToggle = function(ele)
{
    let currentStyle = ele.style;
    if(state.endTime > 0 && ele.className === "restart-btn"){
        currentStyle.visibility = 'visible';
        return; 
    }
    currentStyle.visibility = currentStyle.visibility == 'hidden' ? 'visible' : 'hidden';
}

state.restartEventProcess = () =>
{
    console.info(`restart Event - activate ( timer_id : ${state.timerId} , ${state.isStart} )`);
    if(state.isStart)
    {
        view.drawDefaultInnerCircle();
        state.imgToggle(state.restartBtn);
        state.imgToggle(state.stopButton);
        state.imgToggle(state.startButton);
        state.isStart = false;
        state.clearInterval();
    }
}

state.startEventProcess = () =>
{
    if(state.isStart) return;
    console.info('state.startEventProcess() - activate');
    state.interval(state.endTime);
    state.imgToggle(state.startButton);
    state.imgToggle(state.stopButton);
    state.imgToggle(state.restartBtn);
    state.isStart = true;
}

state.stopEventProcess = () =>
{
    console.log('clicked');
    if(!state.isStart) return;
    console.info('state.stopEventProcess() - activate ( timer_id : ' + state.timerId + ')');
    state.stopInterval();
    state.imgToggle(state.startButton);
    state.imgToggle(state.stopButton)
    state.isStart = false;
}

controls.start = () =>
{
    state.startButton = elt('img',{class:'start-btn',
                                   src:'images/startBtn.png',
                                   style:'visibility:visible;'});

    state.startButton.addEventListener('click', state.startEventProcess);
    return state.startButton;
}

controls.stop = () =>
{
    state.stopButton = elt('img',{class:'stop-btn',
                                  src: 'images/stopBtn.png',
                                  style:'visibility:hidden;'});

    state.stopButton.addEventListener('click', state.stopEventProcess);
    return state.stopButton;
}

controls.restart = () =>
{
    state.restartBtn = elt('img',{class:'restart-btn',
                                 src:'images/restartBtn.png',
                                 style:'visibility:hidden;'});

    state.restartBtn.addEventListener('click', function(){
        console.info('controls.restart() - restartBtn clicked');
        document.dispatchEvent(state.restartEvent);
    });

    return state.restartBtn;
}

error.validator = (value) =>
{
    if(typeof value === 'undefined' && !value 
    || Number.isNaN(value) || value < 0)
    {
        console.error('arguments is invaild or undefined');
        delete this;
        return;
    }
}

return{
    setDefaultTime : (defaultTime) =>
    {
        error.validator(defaultTime);
        defaultTime *= ms;
        state.defaultTime = defaultTime;
        state.endTime = defaultTime;
    },
    setRadius : (radius) =>
    {
        error.validator(radius);
        state.radius = radius;
    },
    start : () =>
    {
        error.validator(state.radius);
        error.validator(state.defaultTime);
        state.create();
        let viewPannel = view.create(state.radius);

        let toolbar = elt('div', {class:'toolbar'});
        for(let name in controls)
            toolbar.appendChild(controls[name]());

        viewPannel.appendChild(toolbar);

        document.body.insertBefore(viewPannel, document.body.firstChild);
        console.info(`initTimeTimer is completely initailized`);
    }
}

   

};




