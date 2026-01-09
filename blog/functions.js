function ifHideMainContent() {
    if(pageYOffset == 0){
        var mainContent = document.getElementsByClassName('apage')[0];
        mainContent.style.display = 'none';
    };
}
function showMainContent() {
    var mainContent = document.getElementsByClassName('apage')[0];
    mainContent.style.display = 'block';
    mainContent.scrollIntoView({behavior: "smooth"});
}
function whenResize() {
    height = window.innerHeight;
    var x = document.getElementById('bar');
    //x.getElementsByTagName('h1')[0].innerHTML = height + 'px';
}
function toggleSidebar() {
    var sidebar = document.getElementById('bar');
    sidebar.style.width = '5.5cm';
    var bardes = document.querySelectorAll('#bar .menu-box span p')
    Array.from(bardes).forEach(function(element){
        element.style.opacity = '1';
    })
}
function sidebarTo2cm(){
        var sidebar = document.getElementById('bar');
        sidebar.style.width = '2cm';
        var bardes = document.querySelectorAll('#bar .menu-box span p')
        Array.from(bardes).forEach(function(element){
            element.style.opacity = '0';
        })
}

 
