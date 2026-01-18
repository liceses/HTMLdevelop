
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
        score:0,
        gamestate:'stated',
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
            let fruitsTofall = [];
            let Engine = Matter.Engine,
                Render = Matter.Render,
                Runner = Matter.Runner,
                Bodies = Matter.Bodies,
                Composite = Matter.Composite,
                Common = Matter.Common,
                Vector = Matter.Vector,
                Detector = Matter.Detector,
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
            let fruit_collision = Detector.create();
            //创建边界墙
            let wall_left = Bodies.rectangle(0,render.options.height*0.5,15,render.options.height,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                },
                collisionFilter:{
                    category:0x0001,
                    mask:0x0001
                }
            })
            let wall_right = Bodies.rectangle(render.options.width,render.options.height*0.5,15,render.options.height,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                },
                collisionFilter:{
                    category:0x0001,
                    mask:0x0001
                }
            })
            let wall_bottom = Bodies.rectangle(render.options.width*0.5,render.options.height,render.options.width,15,{
                isStatic:true,
                render:{
                    fillStyle:"rgba(34, 255, 0, 0.5)"
                },
                collisionFilter:{
                    category:0x0001,
                    mask:0x0001
                }
            })
            //创建内容
            // 水果生成器
            /**
             * 
             * @param {number} fruit_Size 水果等级
             * @param {number} x 位置
             * @param {number} y 位置
             * @param {boolean} IfplusIndex 是否fruitIndex加1
             * @returns Body
             */
            let createAnewfruit = (fruit_Size,x,y,IfplusIndex=true)=> {
                let fruit_Scale = render.options.width/(5*204);
                //fruit_Scale = 0.5;
                let Radius_fruits = [26,40,54,60,76,92,97,130,154,154,204];
                let Mass_fruits = [1.5,4.0,1.50,1.00,1.50,2.50,2.00,1.000,1.500,4.000,4.000]
                let fruit; 
                if(fruit_Size<=12){
                    fruit =  Bodies.circle(x,y,Radius_fruits[fruit_Size-1]*fruit_Scale,{
                        label:'fruit',
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
                        label:'fruit',
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
                if (IfplusIndex){
                    this.fruitIndex += 1 ;
                }
                
                return fruit;
            }
            
            let getfruitSize = () =>{
                let fruit_Size = 1;
                if (this.fruitIndex<3){
                    fruit_Size = this.fruitIndex + 2;
                }else{
                    fruit_Size = Math.floor(Common.random(1,8));
                }
                ;
                return fruit_Size;
            }
            /**
             * 
             * @param {Matter.Body} body 
             */
            function getfruitSizeFromtexture(body){
                let texture= body.render.sprite.texture;
                //console.log(texture);
                let size = 1;
                for(let i = 2;i<13;i++){
                    if (texture == `./res/f${i}.png`){
                        //console.log(`./res/f${i}.png`);
                        size = i-1;
                    }
                }
                //console.log(size);
                return size;
            }
            
            //预先生成第一个水果
            
            fruitsTofall[this.fruitIndex + 1] = createAnewfruit(this.NextfruitSize = getfruitSize(),-500,0);
            Body.setStatic(fruitsTofall[this.fruitIndex],true);
            //实现水果跟随鼠标移动,点击释放,创建下一个
            let mouse_vector = Vector.create(mouseX_Canvas,mouseY_Canvas)
            let canvas_mousemove = (event)=> {
                mouseX_Canvas = event.offsetX;
                mouseY_Canvas = event.offsetY;
                mouse_vector.x = mouseX_Canvas;
                //mouse_vector.y =mouseY_Canvas;
                mouse_vector.y = this.gamesize.y*0.1;
                fruitsTofall[this.fruitIndex].collisionFilter.mask = 0x0000;
                Body.setPosition(fruitsTofall[this.fruitIndex],mouse_vector);
            }
            let canvas_click = ()=>{
                Body.setStatic(fruitsTofall[Game.fruit.fruitIndex],false);
                console.log('1',fruitsTofall[this.fruitIndex].collisionFilter)
                fruitsTofall[this.fruitIndex].collisionFilter.mask = 0x0001;
                console.log('2',fruitsTofall[this.fruitIndex].collisionFilter)
                fruitsTofall[this.fruitIndex + 1] = createAnewfruit(this.NextfruitSize = getfruitSize(),-500,100);//fruitIndex ++了
                Body.setStatic(fruitsTofall[this.fruitIndex],true);
                Composite.add(engine.world,fruitsTofall[this.fruitIndex])
            }
            canvas_GB.addEventListener('mousemove',canvas_mousemove)
            canvas_GB.addEventListener('click',canvas_click)
            //var ground = Bodies.rectangle(200,450,810,60,{isStatic:true});
            //创建视角固定器
            /**
             * 
             * @param {string} state win or lose
             */
            let end_game = (state)=>{
                canvas_GB.removeEventListener('mousemove',canvas_mousemove);
                canvas_GB.removeEventListener('click',canvas_click);
                if (state == 'win') {
                    this.gamestate = 'win';
                } else if (state = 'lose') {
                    this.gamestate == 'lose';
                }else{
                    this.gamestate = 'ended';
                }
                
            };
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
            //实现持续碰撞检测,发现相同fruitsize的fruit并消除;
            setInterval(() => {
                let active_fruit = Composite.allBodies(engine.world).filter(b=>b.label === 'fruit');
                active_fruit.forEach(element => {
                    let Y = element.position.y;
                    if (Y<=this.gamesize.y*0.05&&element.isStatic == false) {
                        end_game();
                    }
                });
                Detector.setBodies(fruit_collision,active_fruit);
                let collisions =  Detector.collisions(fruit_collision) ;
                collisions.forEach(element => {
                    let fruitA = element.bodyA;
                    let fruitB = element.bodyB;
                    let sizeA = getfruitSizeFromtexture(fruitA);
                    let sizeB = getfruitSizeFromtexture(fruitB);
                    //console.log(sizeB,sizeA);
                    if (sizeA == sizeB){//直接比较
                        this.score  += sizeA;
                        let newsize;
                        if (sizeA + 1<11&&sizeA + 1>0) {
                            newsize = sizeA + 1;
                            let newX = (fruitA.position.x + fruitB.position.x)/2;
                            let newy = (fruitA.position.y + fruitB.position.y)/2;
                            Composite.remove(engine.world,[fruitA,fruitB])
                            let synthesizedFruit = createAnewfruit(newsize,newX,newy,false);
                            Composite.add(engine.world,synthesizedFruit);
                        }else if (sizeA+1>11) {
                            end_game()
                        }else if (sizeA + 1 == 11) {
                            newsize = sizeA + 1;
                            let newX = (fruitA.position.x + fruitB.position.x)/2;
                            let newy = (fruitA.position.y + fruitB.position.y)/2;
                            Composite.remove(engine.world,[fruitA,fruitB])
                            let synthesizedFruit = createAnewfruit(newsize,newX,newy,false);
                            Composite.add(engine.world,synthesizedFruit);
                            end_game('win')
                        }

                    }
                });
            }, 50);
            //Composite.add(engine.world,[fruit_1])
            Composite.add(engine.world,[wall_left,wall_right,wall_bottom,viewbox]);
            fruitsTofall.forEach(element => {
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
var gamebox = document.getElementById('gamebox');
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

//创建score,gamestate,nextfruit


let score = document.getElementById('scorenum');

score.textContent = Game.fruit.score;
setInterval(() => {
    if (!(score.textContent ==Game.fruit.score)) {
        score.textContent = Game.fruit.score;
    }
    var nextfruitpic = document.getElementById('nextfruitpic');
    var NextfruitSize = Game.fruit.NextfruitSize;
    let fruit_Scale = gamewidth_shuold/(5*204);
    let Radius_fruits = [26,40,54,60,76,92,97,130,154,154,204];
    nextfruitpic.style.backgroundImage = `url('res/f${NextfruitSize+1}.png')`;
    
    nextfruitpic.style.height = Radius_fruits[NextfruitSize - 1]*2*fruit_Scale +'px';
    nextfruitpic.style.width = Radius_fruits[NextfruitSize - 1]*2*fruit_Scale +'px';

}, 50);
//下次预览


//创建游戏
Game.fruit.createGame(gamewidth_shuold,gameheight_shuold,canvas_GB);

window.addEventListener('resize',()=>{
    calcuGB_width();
})


