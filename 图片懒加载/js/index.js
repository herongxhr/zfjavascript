//获取元素
let box = document.getElementById('box');
let img = document.getElementById('img');

//盒子本身高度
let boxH = box.offsetHeight;
//盒子距离body的高度
let boxT = utils.offset(box).top;
let winH = utils.win('clientHeight');

window.onscroll = function () {
    //实时获取浏览器划过高度
    let winS = utils.win('scrollTop');
    //判断浏览器窗口的高度+浏览器划过的高度>盒子本身的高度【需求：浏览器划过一半的时候，让盒子进行显示】+盒子距离body的偏移量
    if (winH + winS > boxH / 2 + boxT) {
        console.log('jiazaile');
        lazyLoadingImg();
    }

};

function lazyLoadingImg() {
    //我们需要创建一个图片，进行试错，试着加载这个图片，如果图片加载成功，我们再把图片上的正确地址赋值给真实的img图片
    let newImg = new Image();
    //通过getAttribute方法拿到图片上的pic属性
    //并把属性名对应的属性值赋值给当前的新图片
    newImg.src = img.getAttribute('pic');
    //我们让新图片试着加载，如果html结构加载成功，我们就执行这个函数
    newImg.onload = function () {
        img.src = this.src;
        //让图片淡入显示
        fadeIn(img);
    };
    // 当新图片加载不成功，执行的方法
    newImg.onerror = function () {
        img.src = 'img/error.jpg';
    }
}

function fadeIn(ele) {
    // 获取到元素已生效的样式
    let opacity = utils.css(ele,'opacity');
    // 设置一个定时器，实现透明度从0到1的过程
    let timer = setInterval(()=>{
        // 定时器执行的时候，每次执行都让该图片元素的基础上加上0.05的透明度
        utils.css(ele,'opacity',opacity+=0.05);
        // 当图片元素的透明度变成1的时候，我们让定时器停止，透明度设置为1
        if(utils.css(ele,'opacity')>=1){
            clearInterval(timer);
            utils.css(ele,'opacity',1)
        }
    },200)
}

