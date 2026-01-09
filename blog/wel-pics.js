
//原生实现mainpage的welcome图片轮播
var pics = [
  "resource/wel1.png","resource/wel2.png","resource/wel3.jpg","resource/wel4.jpg","resource/wel5.png"
];//图片数组

//创建按钮组
if(welcomeConfig.welpicdisplay == 'dot'){
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
    //箭头模式未实现
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
//设置初始图片 
pic_mid.style.backgroundImage = 'url(' + pics[active_index] + ')';
pic_back.style.backgroundImage = 'url(' + pics[(active_index + 1) % pics.length] + ')';
pic_element.appendChild(pic_back);
pic_element.appendChild(pic_front);
pic_element.appendChild(pic_mid);


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


if(welcomeConfig.welpicdisplay === "dot") {
    swi_buts[active_index].style.opacity = '1'; //设置初始按钮样式
    autoSlideDot();
    //按钮点击事件处理
    swi_buts.forEach(function(element, index){
    element.addEventListener('click', function(){
        ifonclick = 1;
        //clearInterval(autoSlideInterval); //点击按钮时清除自动轮播
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
            
        }, 1000);
        pic_mid.style.transition = 'opacity 0.3s ease-in-out';
        pic_mid.offsetHeight; //触发重绘
        //autoSlide(); //重新启动自动轮播
        return active_index, ifonclick;
    });
});    
}
if(welcomeConfig.welpicdisplay === "arrow") {
    //箭头模式未实现
}
//按钮点击事件绑定

