Up_Alphabet = ['A','B','C','D','E','F','G'
    ,'H','I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X','Y',
    'Z','1','2','3','4','5','6','7','8','9','0']
//勿更改上方数组，不可更改字符的范围
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
    var time_charSwitch = 5;//单位s
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
    console.log("falling_textcos done")
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
    {let i_char = Math.floor(Math.random()*35);
    //ele.style.setProperty('--char-switch',time_charSwitch + 's')
    for(let i = 0;i< Up_Alphabet.length ; i++){
        if(i_char<Up_Alphabet.length){
            ele.setAttribute('data-char${i}',Up_Alphabet[i_char]);
            console.log(ele.getAttribute('date-char${i}'))
            i_char++;
        }else{
            i_char = 0;
            ele.setAttribute('data-char'+i,Up_Alphabet[i_char]);
        }
    }
    //落下后删除
    ele.addEventListener('animationend',function () {
        ele.remove();
    })
    }
}

var gamebox = document.createElement('div');
