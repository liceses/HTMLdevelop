Up_Alphabet = ['A','B','C','D','E','F','G'
    ,'H','I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X','Y',
    'Z','1','2','3','4','5','6','7','8','9','0']
//更改上方数组，可更改字符的范围
var pageWidth = window.innerWidth;
var pageHeight = window.innerHeight;
var textcos =[];
var i_textco = 0;
var BackGround = document.getElementById('background');
//settings
{
    var time_falling = '10s';//下落的时间，根据下落速度和字符生成的高度计算得出。设定此值无效
    var dalay_falling = '50ms';//字符出现后在原高度停留的时间
    var speed_falling = 100;//字符下落的速度，单位px/s
    var num_fallingChars = 20;//无用变量，下落字符的数量不是确定的数字
    var interval_falling = 10;//生成下落字符的周期(时间间隔)

} 
window.addEventListener('resize',function () {
    pageWidth = window.innerWidth;
    pageHeight = window.innerHeight;
})
//生成字母

setInterval(() => {
    textcos[i_textco]= document.createElement('div');
    textcos[i_textco].classList.add('textco');
    falling_textcos(textcos[i_textco]);
    i_textco ++;
}, interval_falling);

function falling_textcos(ele){
    //在页面头部随机生成
    let r_left = (Math.floor((Math.random()*pageWidth)/16) -1) *16;
    //console.log(r_left);
    let r_top= Math.floor(Math.random() * pageHeight *0.9   + ele.offsetHeight);
    //console.log(r_top);
    ele.style.left = r_left + 'px';
    ele.style.top = r_top + 'px';
    //下落
    time_falling = (pageHeight - r_top)/speed_falling +'s';
    //console.log(time_falling);
    ele.style.animationDuration = time_falling;
    BackGround.appendChild(ele);
    //字母循环
    {let i = Math.floor(Math.random()*25);
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


var gamebox = document.createElement('div');
