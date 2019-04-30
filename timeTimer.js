
'use strict'

var timeTimer = timeTimer || {};

document.addEventListener('DOMContentLoaded', function(){

    var myWindow = new timeTimer();
    myWindow.initTimeTimer(170, 170, 150);

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

    view.timeDiv = elt('div', {id:'time'});

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

    state.restartEvent = new Event('trigger');
}

state.interval = function(t_unit)
{
    if(t_unit < 0) return;
    const adjustInterval = 10;
    var dd = document.getElementById('time');
    var expectTime = Date.now() + t_unit;
    var elapseTime;
    console.time();
    state.timerId = setInterval(adjustTime, Math.max(0, adjustInterval - elapseTime));

    function adjustTime()
    { 
        elapseTime = Date.now() - expectTime;
        state.endTime = Math.abs(elapseTime);
        var temp = Math.abs(elapseTime) / 1000;
        dd.innerHTML = temp;
        if(elapseTime > 0)
        {
            dd.innerHTML = temp;
            console.timeEnd();
            state.endTime = state.defaultTime;
            clearInterval(state.timerId);
            return;
        } 
        elapseTime += adjustInterval;
    }
}

state.btnTrigger = (function()
{
    document.addEventListener('trigger',function(){
        alert('t');
    },false);
})();

controls.startAndStop = function(){
    var button = elt('button',{type:'button', id:'switch'},'START');
    button.addEventListener('click', function(){
        if(!state.isStart)
        {
            document.dispatchEvent(state.restartEvent);
            state.isStart = true;
            button.innerHTML = 'STOP';
            state.interval(state.endTime);
        }else{
            clearInterval(state.timerId);
            button.innerHTML = 'START';
            state.isStart = false;
        }
    })
    return button;
}

controls.restart = function(){
    var button = elt('button',{type:'button', id:'restart'},'RESTART');

    /*
    button.addEventListener('click', function(){
        clearInterval(state.timerId);
        state.interval(state.defaultTime);
    })
    */
    return button;
}

return{
    
    initTimeTimer : function(x, y, radius)
    {
        var ms = 1000;
        var viewPannel = view.create(x, y, radius);

        state.create(6 * ms);

        var toolbar = elt('div', {class:'toolbar'});
        for(var name in controls)
            toolbar.appendChild(controls[name]());
        
        viewPannel.appendChild(toolbar);

        document.body.appendChild(viewPannel);
    }
}

};



