var Game = {
    Gfruit:{
        gamesize:{x:400,y:400},
        gamecanvas:HTMLCanvasElement,
        gamebackground:'white',
        timer:{
            t:0,
            Time_interval:'' ,
            startTimer:function(){
                this.Time_interval = setInterval(() => {
                    this.t++;
                }, 1000);
            },
            endTimer:function(){
                clearInterval(this.Time_interval);
            }
        },
        score:0,
        /**
         * 
         * @param {number} sizeXpara 
         * @param {number} sizeYpara 
         * @param {HTMLCanvasElement} canvaspara 
         */
        initGame:function(sizeXpara,sizeYpara,canvaspara){
            console.log()
            this.gamesize.x = sizeXpara;
            this.gamesize.y = sizeYpara;
            this.gamecanvas = canvaspara;
            this.physical.engine = Matter.Engine.create();
            this.physical.runner = Matter.Runner.create();
            this.physical.render = Matter.Render.create({
                canvas : this.gamecanvas,
                engine : this.physical.engine,
                options:{
                    height : this.gamesize.y,
                    width : this.gamesize.x,
                    wireframes: false,
                    background : this.gamebackground
                }
            });
        },
        startGame:function (params) {
            this.timer.startTimer();
            //启动计时器
            let Engine = Matter.Engine,
                Render = Matter.Render,
                Runner = Matter.Runner,
                Bodies = Matter.Bodies,
                Composite = Matter.Composite,
                Common = Matter.Common,
                Vector = Matter.Vector,
                Detector = Matter.Detector,
                Body = Matter.Body;
            let render = this.physical.render,
                runner = this.physical.runner,
                engine = this.physical.engine
            //初始化物理引擎
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
            //创建游戏边界实体
            Composite.add(engine.world,[wall_left,wall_right,wall_bottom]);

        },
        
        physical:{
            engine:Matter.Engine,
            runner:Matter.Runner,
            render:Matter.Render,
        },
        ingame:{
            NextfruitSize:1,
            fruitsNum:0,
            Afruit:{
                body:Matter.Body,
                size:1
            },
            fruits:[],
        },

    }
}


var can = document.getElementById('canvans1');

Game.Gfruit.initGame(400,400,can);
Game.Gfruit.startGame();