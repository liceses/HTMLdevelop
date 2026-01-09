
//原生实现mainpage的welcome图片轮播
var pics = [
  "resource/wel1.png","resource/wel2.png","resource/wel3.jpg","resource/wel4.jpg","resource/wel5.png"
];//图片数组


if(welcomeConfig.welpicdisplay == 'dot'){
    //圆点模式
    console.log("Dot mode");
    //创建按钮组
    var swi_buts = [document.createElement('div'),document.createElement('div'),document.createElement('div'),document.createElement('div'),document.createElement('div')];
    swi_buts.forEach(function(element, index){
    element.className = 'pic-s-buttons';
    //设置按钮样式
    {
    element.style.opacity = '0.5';
    element.style.transition = 'width 0.1s ease-in-out,border-radius 0.1s ease-in-out,opacity 0.3s ease-in-out';
    element.style.width = '20px';
    element.style.height = '20px';
    element.style.margin = '0 auto';
    element.style.borderRadius = '50%';
    element.style.backgroundColor = 'white';
    element.style.cursor = 'pointer';
    }
    //将按钮添加到按钮组容器中
    document.getElementsByClassName('pic-switch')[0].appendChild(element);
    //按钮悬停效果
    element.addEventListener("mouseover", function() {
    element.style.transition = 'all 0.1s ease-in-out';
    element.style.width = '30px';
    element.style.borderRadius = '10px';
    element.style.opacity = '1';
    });
    //按钮移出效果
    element.addEventListener("mouseout", function() {
    if (element.style.opacity == '1' && swi_buts.indexOf(element) != active_index) {
        element.style.transition = 'all 0.3s ease-in-out';
        element.style.width = '20px';
        element.style.borderRadius = '50%';
        element.style.opacity = '0.5';
}else if (swi_buts.indexOf(element) == active_index) {
        element.style.transition = 'all 0.3s ease-in-out';
        element.style.width = '20px';
        element.style.borderRadius = '50%';
        element.style.opacity = '1';
}
    });

});
}else if(welcomeConfig.welpicdisplay == 'arrow'){
    //箭头模式
    console.log("Arrow mode");
    var swi_arrows = [document.createElement('img'),document.createElement('img')]; //创建左右箭头元素
    //设置箭头样式
    swi_arrows[0].src = 'https://icons.iconarchive.com/icons/iconsmind/outline/128/Arrow-Left-2-icon.png';
    swi_arrows[1].src = 'https://icons.iconarchive.com/icons/iconsmind/outline/128/Arrow-Right-2-icon.png';
    swi_arrows[0].style.animationName = 'arrow-breathing_left';
    swi_arrows[1].style.animationName = 'arrow-breathing_right';
    swi_arrows.forEach(function(element, index){
        //设置箭头样式
        element.className = 'pic-s-arrows';
        element.style.width = '48px';
        element.style.height = '36px';
        element.style.position = 'relative';
        element.style.margin = '0 auto';
        element.style.top = '50%';
        element.style.opacity = '0.7';
        element.style.filter = 'invert(100%)';
        //element.style.transform = 'translateY(-50%)';
        element.style.cursor = 'pointer';

        //设置箭头动画
        element.style.animationDuration = '2s';
        element.style.animationIterationCount = 'infinite';
        element.style.transition = 'opacity 0.3s ease-in-out';

        //箭头悬停效果
        element.addEventListener("mouseover", function() {
            i_arrow = swi_arrows.indexOf(element);
            swi_arrows[1 - i_arrow].style.animationPlayState = 'paused'; //暂停另一个箭头的动画
            element.style.animationPlayState = 'paused';
            element.style.opacity = '1';
            element.style.transform = 'scale(1.5)';
        });
        //箭头移出效果
        element.addEventListener("mouseout", function() {
            i_arrow = swi_arrows.indexOf(element);
            swi_arrows[1 - i_arrow].style.animationPlayState = 'running'; //暂停另一个箭头的动画
            element.style.animationPlayState = 'running';
            element.style.opacity = '0.7';
            element.style.transform = 'scale(1)';
        });

        //将箭头添加到按钮组容器中
        document.getElementsByClassName('pic-switch')[0].appendChild(element);
    });
}
// var swi_but =document.getElementsByClassName("pic-s-buttons"); //获取按钮组

var active_index = 0; //当前显示图片的索引
var ifonclick = 0; //按钮点击标志



var pic_element = document.getElementsByClassName('pic')[0]; //获取图片元素
var pic_front = document.createElement('div'); //创建前景图片元素
pic_front.className = 'pic-front';
var pic_back = document.createElement('div'); //创建背景图片元素
pic_back.className = 'pic-back';
var pic_mid = document.createElement('div'); //创建中间图片元素
pic_mid.className = 'pic-mid';



//初始化图片元素样式
{
pic_mid.style.height = '100vh';
pic_mid.style.backgroundSize = 'cover';
pic_mid.style.backgroundPosition = 'center';
pic_front.style.height = '100vh';
pic_back.style.height = '100vh';
pic_front.style.backgroundSize = 'cover';
pic_back.style.backgroundSize = 'cover';
pic_front.style.backgroundPosition = 'center';
pic_back.style.backgroundPosition = 'center';
pic_front.style.opacity = '0';
pic_back.style.opacity = '0';
pic_mid.style.opacity = '1';
pic_mid.style.position = 'absolute';
pic_front.style.position = 'absolute';
pic_back.style.position = 'absolute';
pic_mid.style.top = '0';
pic_front.style.top = '0';
pic_back.style.top = '0';
pic_mid.style.left = '0';
pic_front.style.left = '0';
pic_back.style.left = '0';
pic_mid.style.width = '100%';
pic_front.style.width = '100%';
pic_back.style.width = '100%';
pic_mid.style.transition = 'opacity 0.3s ease-in-out';
pic_front.style.transition = 'opacity 0.3s ease-in-out';
pic_back.style.transition = 'opacity 0.3s ease-in-out';
pic_mid.style.zIndex = '3';
pic_front.style.zIndex = '2';
pic_back.style.zIndex = '1';
}
//设置初始图片 
{
pic_front.style.backgroundImage = 'url(' + pics[(active_index - 1 + pics.length) % pics.length] + ')';
pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
pic_back.style.backgroundImage = 'url(' + pics[(active_index + 1) % pics.length] + ')';
pic_element.appendChild(pic_back);
pic_element.appendChild(pic_front);
pic_element.appendChild(pic_mid);
}

//自动轮播功能
function autoSlideDot() {
   var autoSlideInterval =  setInterval(function(){
      if (ifonclick === 1) {
          ifonclick = 0;
          return;
      }else{
      pic_mid.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
      pic_front.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
      pic_back.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
      pic_back.offsetHeight; //触发重绘
      pic_front.offsetHeight; //触发重绘
      pic_mid.offsetHeight; //触发重绘
      var next_index = active_index +1;
      if(next_index >= pics.length) next_index = 0;
      swi_buts[active_index].style.opacity = '0.5'; //重置上一个按钮样式
      swi_buts[next_index].style.opacity = '1';
      pic_back.style.backgroundImage = 'url(' + pics[next_index] + ')';
      pic_back.style.opacity = '1';
      pic_mid.style.opacity = '0';
      active_index = next_index;
      setTimeout(function(){
          pic_mid.style.transition = 'none';
          pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
          pic_mid.style.opacity = '1';
          pic_back.style.opacity = '0';
      }, 500);
      pic_mid.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
      console.log(pic_mid.style.transition);
      pic_mid.offsetHeight; //触发重绘
      }

  }, welcomeConfig.welpicdelay);
  return autoSlideInterval;
}

function autoSlideArrow() {
    setInterval(function(){
       if (ifonclick === 1) {
           ifonclick = 0;
       }else{
            active_index = (active_index + 1) % pics.length;

        pic_mid.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_back.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_mid.offsetHeight; //触发重绘
        pic_back.offsetHeight; //触发重绘  
        pic_back.style.transition = 'none';
        pic_back.style.opacity = '1';
        pic_mid.style.opacity = '0';
        setTimeout(() => {
            pic_mid.style.transition = 'none';
            pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
            pic_mid.style.opacity = '1';
            pic_back.style.opacity = '0';
            pic_back.style.backgroundImage = 'url(' + pics[(active_index + 1) % pics.length] + ')';
            pic_front.style.backgroundImage = 'url(' + pics[(active_index - 1 + pics.length) % pics.length] + ')';
            ifonclick = 0;
        }, welcomeConfig.welpictransition + 100);
       }
   }, welcomeConfig.welpicdelay);
}
//按钮点击事件处理
if(welcomeConfig.welpicdisplay === "dot") {
    swi_buts[active_index].style.opacity = '1'; //设置初始按钮样式
    autoSlideDot();
    //按钮点击事件处理
    swi_buts.forEach(function(element, index){
    element.addEventListener('click', function(){
        if(ifonclick === 1) {setTimeout(function(){ifonclick = 0;}, 500); return;}//`防止多次点击
        else{
            ifonclick = 1;
            index = Array.prototype.indexOf.call(swi_buts, this);
            if(index === active_index) return; //点击当前按钮不做任何操作
            swi_buts[active_index].style.opacity = '0.5'; //重置上一个按钮样式
            swi_buts[index].style.opacity = '1';
            pic_mid.style.opacity = '0';
            pic_back.style.backgroundImage = 'url(' + pics[index] + ')';
            pic_back.style.opacity = '1';
            active_index = index;
            setTimeout(function(){
                pic_mid.style.transition = 'none';
                pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
                pic_mid.style.opacity = '1';
                pic_back.style.opacity = '0';
                ifonclick = 0;
            }, 500);
            pic_mid.style.transition = 'opacity 0.3s ease-in-out';
            pic_mid.offsetHeight; //触发重绘
            
            //autoSlide(); //重新启动自动轮播
            
        }
        
        

    });
});    
}
if(welcomeConfig.welpicdisplay === "arrow") {
    autoSlideArrow();
    swi_arrows[0].addEventListener('click', function(){
        //左箭头点击事件处理
        if(ifonclick === 1) return;
        else{
            ifonclick = 1;
            
        active_index = (active_index - 1 + pics.length) % pics.length;

        pic_mid.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_front.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_mid.offsetHeight; //触发重绘
        pic_front.offsetHeight; //触发重绘


        pic_front.style.transition = 'none';
        pic_front.style.opacity = '1';
        pic_mid.style.opacity = '0';
        setTimeout(() => {
            pic_mid.style.transition = 'none';
            pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
            pic_mid.style.opacity = '1';

            pic_front.style.opacity = '0';
            pic_front.style.backgroundImage = 'url(' + pics[(active_index - 1 + pics.length) % pics.length] + ')';
            pic_back.style.backgroundImage = 'url(' + pics[(active_index + 1) % pics.length] + ')';
            ifonclick = 0;
        }, welcomeConfig.welpictransition + 100);
        
        
        }
        

        
    });

    swi_arrows[1].addEventListener('click', function(){
        //右箭头点击事件处理
        if(ifonclick === 1) return;
        else{
            ifonclick = 1;
        active_index = (active_index + 1) % pics.length;

        pic_mid.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_back.style.transition = 'opacity ' + welcomeConfig.welpictransition + 'ms ease-in-out';
        pic_mid.offsetHeight; //触发重绘
        pic_back.offsetHeight; //触发重绘  
        pic_back.style.transition = 'none';
        pic_back.style.opacity = '1';
        pic_mid.style.opacity = '0';
        setTimeout(() => {
            pic_mid.style.transition = 'none';
            pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
            pic_mid.style.opacity = '1';
            pic_back.style.opacity = '0';
            pic_back.style.backgroundImage = 'url(' + pics[(active_index + 1) % pics.length] + ')';
            pic_front.style.backgroundImage = 'url(' + pics[(active_index - 1 + pics.length) % pics.length] + ')';
            ifonclick = 0;
        }, welcomeConfig.welpictransition + 100);
        
        
        }
        
    });
    
}

