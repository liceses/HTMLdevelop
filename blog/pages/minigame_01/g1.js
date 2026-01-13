config = {
    enable_dynamic_background : true,
    canvas_height:0.9,//相对父容器高度
    canvas_Width:0.9//相对父容器宽度
}
//字符动态下落背景：性能占用大
if(config.enable_dynamic_background){
    Up_Alphabet = ['A','B','C','D','E','F','G'
        ,'H','I','J','K','L','M','N','O','P',
        'Q','R','S','T','U','V','W','X','Y',
        'Z','1','2','3','4','5','6','7','8','9','0']
    //更改上方数组，可更改字符的范围
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    var textcos =[];
    var i_textco = 0;
    var textco_click = [];
    var i_textco_click = 0 ;
    var BackGround = document.getElementById('background');
    //settings
    {
        var time_falling = '10s';//下落的时间，根据下落速度和字符生成的高度计算得出。设定此值无效
        var dalay_falling = '50ms';//字符出现后在原高度停留的时间
        var speed_falling = 50;//字符下落的速度，单位px/s
        var num_fallingChars = 20;//无用变量，下落字符的数量不是确定的数字
        var interval_falling = 50;//生成下落字符的周期(时间间隔)
    
    } 
    //更新窗口尺寸
    window.addEventListener('resize',function () {
        pageWidth = window.innerWidth;
        pageHeight = window.innerHeight;
    })
    //点击生成字符
    BackGround.addEventListener('click',function (event) {
        let top_textco = event.clientY;
        let left_textco = event.clientX;
        falling_textcos(left_textco,top_textco);
    })
    
    
    
    //生成字母
    
    setInterval(() => {
    falling_textcos();
    }, interval_falling);
    
    function falling_textcos(x,y){
        let ele = document.createElement('div');
        ele.classList.add('textco');
        //在页面头部随机生成
        let r_left = (Math.floor((Math.random()*pageWidth)/16) -1) *16;
        //console.log(r_left);
        let r_top= Math.floor(Math.random() * pageHeight *0.9   + ele.offsetHeight);
        //console.log(r_top);
        if (x === undefined) {
            ele.style.left = r_left + 'px';
        }else{
            ele.style.left = x + 'px';
        }
        if (y === undefined) {
            ele.style.top = r_top + 'px';
            //下落
            time_falling = (pageHeight - r_top)/speed_falling +'s';
        }else{
            ele.style.top = y + 'px';
            time_falling = (pageHeight - y)/speed_falling +'s';
        }
        
        //console.log(time_falling);
        ele.style.animationDuration = time_falling;
        BackGround.appendChild(ele);
        //字母循环
        {let i = Math.floor(Math.random()*25);
        ele.innerHTML = Up_Alphabet[(i +35)%36];//此处立刻赋值，而setInternal函数第一次执行是在设定的间隔后
        setInterval(() => {
            if(i< Up_Alphabet.length ) {
                ele.innerHTML = Up_Alphabet[i];
                i++;
            }
            else i=0;
        }, 500);}
        //落下后删除
        ele.addEventListener('animationend',function () {
            ele.remove();
        })
    }
    
}

//
var mouseX_Canvas,mouseY_Canvas;
var gamebox = document.createElement('div');
gamebox.id = 'gamebox';
var main = document.getElementsByTagName('main')[0];
main.appendChild(gamebox);

var Height_GB = gamebox.offsetHeight;
var Width_GB = gamebox.offsetWidth;

var canvas_GB = document.createElement('canvas');
canvas_GB.id = 'canvas_GB';
canvas_GB.width = Width_GB*0.9 +'px';
canvas_GB.height = Width_GB*0.9 +'px';
gamebox.appendChild(canvas_GB);

console.log(Width_GB*0.9);
canvas_GB.addEventListener('mousemove',function (event) {
    mouseX_Canvas = event.offsetX;
    mouseY_Canvas = event.offsetY;
    console.log(mouseX_Canvas,mouseY_Canvas);
})


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
var engine = Engine.create();
var render = Render.create({
    canvas : canvas_GB,
    engine : engine,
    options:{
        height : Width_GB*config.canvas_height,
        width : Width_GB*config.canvas_Width,
        wireframes: false,
        background : 'white'
    }

});

var wall_left = Bodies.rectangle(0,render.options.height*0.5,15,render.options.height,{
    isStatic:true,
    render:{
        fillStyle:"rgba(34, 255, 0, 0.5)"
    }
})
var wall_right = Bodies.rectangle(render.options.width,render.options.height*0.5,15,render.options.height,{
    isStatic:true,
    render:{
        fillStyle:"rgba(34, 255, 0, 0.5)"
    }
})
var wall_bottom = Bodies.rectangle(render.options.width*0.5,render.options.height,render.options.width,15,{
    isStatic:true,
    render:{
        fillStyle:"rgba(34, 255, 0, 0.5)"
    }
})

var boxA = Bodies.rectangle(10,0,80,80);
var boxB = Bodies.rectangle(250,50,80,80);
var ground = Bodies.rectangle(200,450,810,60,{isStatic:true});

Composite.add(engine.world,[boxA,boxB]);
Composite.add(engine.world,[wall_left,wall_right,wall_bottom,]);

Render.run(render);
var runner = Runner.create();

Runner.run(runner,engine);
 


