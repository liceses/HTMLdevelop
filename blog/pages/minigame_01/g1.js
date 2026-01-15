
config = {
    enable_dynamic_background : true,
}

function sleep(ms) {
    const date = Date.now();
    let currentDate = Date.now();
    do {
        currentDate = Date.now();
    }while(currentDate - date < ms);
}
var Char_Rain = {
    isRaining:false,
    RainInternal :1,
    createRain: function() {
        var Up_Alphabet = ['A','B','C','D','E','F','G'
            ,'H','I','J','K','L','M','N','O','P',
            'Q','R','S','T','U','V','W','X','Y',
            'Z','1','2','3','4','5','6','7','8','9','0']
            //更改上方数组，可更改字符的范围
        var BackGround = document.getElementById('background');
        var parentWidth = BackGround.offsetWidth;
        var parentHeight = BackGround.offsetHeight;
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
            parentWidth = BackGround.offsetWidth;
            parentHeight = window.innerHeight;
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
            let r_left = (Math.floor((Math.random()*parentWidth)/16) -2) *16;
            //console.log(r_left);
            let r_top= Math.floor(Math.random() * parentHeight *0.9   + ele.offsetHeight);
            //console.log(r_top);
            if (x === undefined) {
                ele.style.left = r_left + 'px';
            }else{
                ele.style.left = x + 'px';
            }
            if (y === undefined) {
                ele.style.top = r_top + 'px';
                //下落
                time_falling = (parentHeight - r_top - 25)/speed_falling +'s';
            }else{
                ele.style.top = y + 'px';
                time_falling = (parentHeight - y - 25)/speed_falling +'s';
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
var Game = {
    fruit:{
        gamesize:{x:400,y:400},
        gamecanvas:canvas_GB,
        NextfruitSize:1,
        fruitIndex:-1,
        /**
         * 
         * @param {number} sizeXpara 
         * @param {number} sizeYpara
         * @param {HTMLCanvasElement} canvaspara 
         */
        createGame : function (sizeXpara,sizeYpara,canvaspara) {
            this.gamesize.x = sizeXpara;
            this.gamesize.y = sizeYpara;
            this.gamecanvas = canvaspara;
            let fruits = [];
            let Engine = Matter.Engine,
                Render = Matter.Render,
                Runner = Matter.Runner,
                Bodies = Matter.Bodies,
                Composite = Matter.Composite,
                Common = Matter.Common,
                Vector = Matter.Vector,
                Body = Matter.Body;
            let engine = Engine.create();
            let runner = Runner.create();
            let render = Render.create({
                canvas : this.gamecanvas,
                engine : engine,
                options:{
                    height : this.gamesize.y,
                    width : this.gamesize.x,
                    wireframes: false,
                    background : 'white'
                    
                }
            
            });
            //创建边界墙
            let wall_left = Bodies.rectangle(0,render.options.height*0.5,15,render.options.height,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                }
            })
            let wall_right = Bodies.rectangle(render.options.width,render.options.height*0.5,15,render.options.height,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                }
            })
            let wall_bottom = Bodies.rectangle(render.options.width*0.5,render.options.height,render.options.width,15,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                }
            })
            //创建内容
            // 水果生成器
            /**
             * 
             * @param {number} fruit_Size 
             * @param {number} x 
             * @param {number} y 
             * @returns Body
             */
            let createAnewfruit = (fruit_Size,x,y)=> {
                let fruit_Scale = render.options.width/(5*204);
                //fruit_Scale = 0.5;
                let Radius_fruits = [26,40,54,60,76,92,97,130,154,154,204];
                let Mass_fruits = [1.5,4.0,1.50,1.00,1.50,2.50,2.00,1.000,1.500,4.000]
                let fruit; 
                if(fruit_Size<=12){
                    fruit =  Bodies.circle(x,y,Radius_fruits[fruit_Size-1]*fruit_Scale,{
                        render:{
                            sprite:{
                                texture:`./res/f${fruit_Size+1}.png`,
                                xScale:fruit_Scale,
                                yScale:fruit_Scale
                            }
                        },
                        
                    })
                    //console.log(Radius_fruits[fruit_Size-1]*fruit_Scale);
                }else{
                    fruit =  Bodies.circle(x,y,Radius_fruits[0]*fruit_Scale,{
                        render:{
                            sprite:{
                                texture:`./res/f2.png`,
                                xScale:fruit_Scale,
                                yScale:fruit_Scale
                            }
                        },
                        
                    })
                }
                Body.setMass(fruit,Mass_fruits[fruit_Size-1]);
                console.log(fruit,'created');
                this.fruitIndex += 1 ;
                return fruit;
            }
            
            this.fruitIndex = 0;
            let getfruitSize = () =>{
                let fruit_Size = 1;
                if (this.fruitIndex<4){
                    fruit_Size = this.fruitIndex + 1;
                }else{
                    fruit_Size = Math.floor(Common.random(1,8));
                }
                ;
                return fruit_Size;
            }
            //预先生成两个水果
            fruits[this.fruitIndex + 1] = createAnewfruit(getfruitSize(),-500,0);
            Body.setStatic(fruits[this.fruitIndex],true);
            fruits[this.fruitIndex + 1] = createAnewfruit(getfruitSize(),-500,0);
            Body.setStatic(fruits[this.fruitIndex],true);
            let mouse_vector = Vector.create(mouseX_Canvas,mouseY_Canvas)
            canvas_GB.addEventListener('mousemove',async (event)=> {
                mouseX_Canvas = event.offsetX;
                mouseY_Canvas = event.offsetY;
                mouse_vector.x = mouseX_Canvas;
                mouse_vector.y = this.gamesize.y*0.1;
                Body.setPosition(fruits[this.fruitIndex-1],mouse_vector)

            })
            canvas_GB.addEventListener('click',()=>{
                Body.setStatic(fruits[Game.fruit.fruitIndex - 1],false)
                setTimeout(() => {
                    fruits[this.fruitIndex + 1] = createAnewfruit(getfruitSize(),-500,0);
                    Body.setStatic(fruits[this.fruitIndex],true);
                    Composite.add(engine.world,fruits[this.fruitIndex])
                }, 100);
            })
            //var ground = Bodies.rectangle(200,450,810,60,{isStatic:true});
            //创建视角固定器
            
            let viewbox = Bodies.rectangle(render.options.width*0.5,render.options.height*0.5,render.options.width,render.options.height,{
                isStatic:true,
                collisionFilter:{
                    category:0x0002,
                    mask:0x0002
                },
                render:{
                    visible : false
                }
            }) 
            render.bounds = viewbox;
            
            //Composite.add(engine.world,[fruit_1])
            Composite.add(engine.world,[wall_left,wall_right,wall_bottom,viewbox]);
            fruits.forEach(element => {
                Composite.add(engine.world,[element])
            });
            Render.run(render);
            Runner.run(runner,engine);
            }
    }
}
//响应式
var media =  window.matchMedia('(max-width:600px)');
function ifPhone() {
    if (media.matches){
        config.enable_dynamic_background = false;
        if(Char_Rain.isRaining){
            Char_Rain.endRain()
        }
        console.log('dynamic_background is disabled');
    }else{
        config.enable_dynamic_background = true;
        console.log('dynamic_background is enabled');
        
        if(config.enable_dynamic_background && !(Char_Rain.isRaining)){
            Char_Rain.createRain();
            return true;
        }
    }

}//字符动态下落背景：性能占用大

ifPhone();





//定义
var mouseX_Canvas,mouseY_Canvas;//鼠标相对canvas位置
//创建gamebox
var gamebox = document.createElement('div');
gamebox.id = 'gamebox';
var main = document.getElementsByTagName('main')[0];
main.appendChild(gamebox);
var Height_GB = gamebox.offsetHeight;
var Width_GB = gamebox.offsetWidth;
var gamewidth_shuold = Width_GB*0.9;
var gameheight_shuold = Height_GB*0.7;
calcuGB_width();

function calcuGB_width() {
    Width_GB = gamebox.offsetWidth;
    
        
        let WdH = window.innerWidth/window.innerHeight;
        if(WdH>=0.95&&WdH<=1.05){
            gamebox.style.width = '80%';
        }else if(WdH<0.95){
            gamebox.style.width = '100%';
        }else if (WdH>1.05&&WdH<=1.5) {
            gamebox.style.width = `${(WdH**2)*(400/9)+WdH*(-1820/9) + (730/3)}%`
        }else if(WdH>1.5){
            gamebox.style.width = '40%'
        }


}


//创建canvas
var canvas_GB = document.createElement('canvas');
canvas_GB.id = 'canvas_GB';
canvas_GB.width = gamewidth_shuold +'px';
canvas_GB.height = gameheight_shuold +'px';
gamebox.appendChild(canvas_GB);
//获取相对于canvas的鼠标位置



//下次预览

let NextfruitImg = document.createElement('div');
NextfruitImg.id = 'NextfruitImg';

gamebox.appendChild(NextfruitImg);

//确定游戏尺寸
//根据

//创建游戏
Game.fruit.createGame(gamewidth_shuold,gameheight_shuold,canvas_GB);

window.addEventListener('resize',()=>{
    calcuGB_width();
})


