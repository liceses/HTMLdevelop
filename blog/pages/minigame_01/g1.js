config = {
    enable_dynamic_background : true,
    canvas_height:0.9,//相对父容器高度
    canvas_Width:0.9//相对父容器宽度
}


var Char_Rain = {
    isRaining:false,
    RainInternal :1,
    createRain: function() {
        Up_Alphabet = ['A','B','C','D','E','F','G'
            ,'H','I','J','K','L','M','N','O','P',
            'Q','R','S','T','U','V','W','X','Y',
            'Z','1','2','3','4','5','6','7','8','9','0']
        //更改上方数组，可更改字符的范围
        var pageWidth = window.innerWidth;
        var pageHeight = window.innerHeight;
        var BackGround = document.getElementById('background');
        //settings
        {
            var time_falling = '10s';//下落的时间，根据下落速度和字符生成的高度计算得出。设定此值无效
            var delay_falling = '50ms';//字符出现后在原高度停留的时间
            var speed_falling = 25;//字符下落的速度，单位px/s
            var num_fallingChars = 20;//无用变量，下落字符的数量不是确定的数字
            var interval_falling = 100;//生成下落字符的周期(时间间隔)
        
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
        
        this.RainInternal = setInterval(() => {
        falling_textcos();
        this.isRaining = true;
        
        return 'created a new falling char';
        }, interval_falling);
        
        function falling_textcos(x,y){
            let ele = document.createElement('div');
            ele.classList.add('textco');
            //在页面头部随机生成
            let r_left = (Math.floor((Math.random()*pageWidth)/16) -2) *16;
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
            ele.style.animationDelay = delay_falling;
            BackGround.appendChild(ele);
            //字母循环
            let i = Math.floor(Math.random()*25);
            ele.innerHTML = Up_Alphabet[(i +35)%36];//此处立刻赋值，而setInternal函数第一次执行是在设定的间隔后
            var char_internal = setInterval(() => {
                if(i< Up_Alphabet.length ) {
                    ele.textContent = Up_Alphabet[i];
                    i++;
                }
                else i=0;
            }, 500);
            ele.dataset.char_internal = char_internal;
            return  char_internal;

        }
        //落下后删除
        BackGround.addEventListener('animationend',function (event) {
            if(event.target && event.target.className == 'textco'){
                clearInterval(event.target.dataset.char_internal);
                event.target.remove();
            }
        });
        
    },
    endRain:function() {
        clearInterval(this.RainInternal);
        return 'ended';
    },
    updateRain:function () {
        this.endRain();
        this.createRain();
    }
}

//响应式
var media =  window.matchMedia('(max-width:600px)');
function ifEnableDynamicBackground() {
    if (media.matches){
        config.enable_dynamic_background = false;
        console.log('dynamic_background is disabled');
    }else{
        config.enable_dynamic_background = true;
        console.log('dynamic_background is enabled');
    }
    if(config.enable_dynamic_background && !(Char_Rain.isRaining)){
        Char_Rain.createRain();
        return true;
    }
}//字符动态下落背景：性能占用大
ifEnableDynamicBackground();





//
var mouseX_Canvas,mouseY_Canvas;//鼠标相对canvas位置
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
    //console.log(mouseX_Canvas,mouseY_Canvas);
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
//动态响应式
window.addEventListener('resize',function () {
    Height_GB = gamebox.offsetHeight;
    Width_GB = gamebox.offsetWidth;
    Render.setSize(render,Width_GB*config.canvas_Width,Width_GB*config.canvas_height);
    
})
//创建边界墙
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
//创建内容

var boxA = Bodies.rectangle(250,0,80,80);
var boxB = Bodies.rectangle(250,50,80,80,);
//var ground = Bodies.rectangle(200,450,810,60,{isStatic:true});
//创建视角固定器

var viewbox = Bodies.rectangle(render.options.width*0.5,render.options.height*0.5,100,100,{
    isStatic:true,
    collisionFilter:{
        category:0x0002,
        mask:0x0001
    },
    render:{
        visible : false
    }
}) 

Composite.add(engine.world,[boxA,boxB,viewbox]);
Composite.add(engine.world,[wall_left,wall_right,wall_bottom]);

Render.run(render);
var runner = Runner.create();

Runner.run(runner,engine);


