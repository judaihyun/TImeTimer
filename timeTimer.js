
'use strict'

var timeTimer = timeTimer || {};

document.addEventListener('DOMContentLoaded', function(){

    var timerObj = new timeTimer();
    timerObj.initTimeTimer(170, 170, 150);

    /*

    document.body.addEventListener('mousemove', function(e){
        var xpos = e.x + document.body.scrollLeft - 2;
        var ypos = e.y + document.body.scrollTop - 2;
        console.log(xpos + ',' + ypos);
    },false);

    */

},false);

timeTimer = function()
{

    var state    = Object.create(null);
    var view     = Object.create(null);
    var controls = Object.create(null);


view.create = function(x, y, radius)
{
    view.x = x;
    view.y = y;
    view.radius = radius;

    view.canvas = elt('canvas', {id:'canvas', width:'350', height:'400'});

    if(view.ctx) delete view.ctx;
    view.ctx = view.canvas.getContext('2d')

    view.timeDiv = elt('div', {id:'displayTime'});

    view.drawClockFace(); 

    view.drawSecondHand();

    view.drawClockNumber();


    return elt(
        'div', { class:'mainLayout' }, view.canvas, view.timeDiv
    );
}


view.drawClockFace = function()
{
    view.ctx.beginPath();
    view.ctx.strokeStyle = 'red';
    //arc(x, y, radius, startAngle, endAngle, anti)
    view.ctx.arc(view.x, view.y, 120, 0, 360, false);
    view.ctx.stroke();

    view.ctx.beginPath();
    view.ctx.arc(view.x, view.y, 5, 0, 360, false);
    view.ctx.fill();
}

view.drawSecondHand = function()
{

    var num, ang;
    var radius = view.radius;
    var realNum = 0;
    view.ctx.beginPath();
    view.ctx.strokeStyle = 'black';
    view.ctx.lineWidth = 2.5;
   
    for(num = 0; num < 12; num++)
    {
      ang = num * Math.PI / 6;
    
      realNum += 5;
    }
}

view.drawClockNumber = function()
{
    var ang;
    var num;
    var radius = view.radius;
    view.ctx.translate(view.x, view.y);
    view.ctx.font = radius*0.15 + "px arial";
    view.ctx.textBaseline="middle";
    view.ctx.textAlign="center";
    view.ctx.strokeStyle = 'black';
    console.log('radius : ' + radius);
    var realNum = 0;
    for(num = 0; num < 12; num++)
    {
    
        ang = num * Math.PI / 6;
        view.ctx.rotate(ang);
        view.ctx.translate(0, -radius);
        view.ctx.rotate(-ang);

        view.ctx.moveTo(0, 30);
        view.ctx.rotate(ang);
        view.ctx.lineTo(0, 50);
        view.ctx.rotate(-ang);
        view.ctx.stroke();

        view.ctx.fillText(realNum.toString(), 0, 0);
        view.ctx.rotate(ang);
        view.ctx.translate(0, radius);
        view.ctx.rotate(-ang);
        realNum += 5;
    }
}

state.create = function(_endTime)
{
    state.timerId;
    state.isStart = false;
    state.defaultTime = _endTime;
    state.endTime = _endTime;
    state.startStopButton;
    state.restartBtn;

    state.restartEvent = new Event('trigger');
    document.addEventListener('trigger',function(){
        console.warn('trigger Event - activate ( timer_id : ' + state.timerId + ')');
        if(state.isStart){
            clearInterval(state.timerId);
            state.interval(state.defaultTime);
            state.restartBtn.style.visibility = 'hidden';
        }else{
            state.restartBtn.style.visibility = 'visible';
            clearInterval(state.timerId);
        }
    },false);
}

state.startEventProcess = function()
{
    console.warn('state.startEventProcess() - activate');
    state.interval(state.endTime);
    state.startStopButton.innerHTML = 'STOP';
    state.restartBtn.style.visibility = 'visible';
    state.isStart = true;
}

state.stopEventProcess = function()
{
    console.warn('state.stopEventProcess() - activate ( timer_id : ' + state.timerId + ')');
    clearInterval(state.timerId);
    state.startStopButton.innerHTML = 'START';
    state.isStart = false;
}

state.interval = function(t_unit)
{
    console.warn('state.interval() - activate ( t_unit : ' + t_unit + ')');
    if(t_unit < 0) return;
    const adjustInterval = 10;
    var displayTime = document.getElementById('displayTime');
    var expectTime = Date.now() + t_unit;
    var elapseTime;
    console.time();
    state.timerId = setInterval(adjustTime, Math.max(0, adjustInterval - elapseTime));
    console.warn('state.interval() - timerId ( ' + state.timerId + ')');
    function adjustTime()
    { 
        elapseTime = Date.now() - expectTime;
        state.endTime = Math.abs(elapseTime);
        var temp = Math.abs(elapseTime) / 1000;
        displayTime.innerHTML = temp;
        if(elapseTime > 0)
        {
            displayTime.innerHTML = temp;
            console.timeEnd();
            state.endTime = state.defaultTime;
            clearInterval(state.timerId);
            return;
        } 
        elapseTime += adjustInterval;
    }
}


controls.startAndStop = function(){
    state.startStopButton = elt('button',{type:'button', id:'switch'},'START');
    state.startStopButton.addEventListener('click', function(){
    console.warn('controls.startAndStop() - startStopButton clicked');

        if(!state.isStart)
        {
            state.startEventProcess();
        }else{
            state.stopEventProcess(); 
        }

        //document.dispatchEvent(state.restartEvent);
    });
    return state.startStopButton;
}

controls.restart = function(){
    state.restartBtn = elt('button',{type:'button', id:'restart'},'RESTART');
    state.restartBtn.style.visibility = 'hidden';

    state.restartBtn.addEventListener('click', function(){
        console.warn('controls.restart() - restartBtn clicked');
        document.dispatchEvent(state.restartEvent);
    });
    
    return state.restartBtn;
}

return{
    
    initTimeTimer : function(x, y, radius)
    {
        var ms = 1000;
        var viewPannel = view.create(x, y, radius);

        state.create(60 * ms);

        var toolbar = elt('div', {class:'toolbar'});
        for(var name in controls)
            toolbar.appendChild(controls[name]());
        
        viewPannel.appendChild(toolbar);

        document.body.appendChild(viewPannel);
    }
}

};



