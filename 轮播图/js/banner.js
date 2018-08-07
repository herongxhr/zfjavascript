let bannerRender = (function () {
    //获取元素
    let container = document.getElementById('container');
    let wrapper = container.querySelector('.wrapper');
    let focus = container.querySelector('.focus');
    let arrowLeft = container.querySelector('.arrowLeft');
    let arrowRight = container.querySelector('.arrowRight');
    let slideList = null;
    let focusList = null;

    //轮播图运动的基础参数
    //记录当前展示图片的索引
    let stepIndex = 0;
    //自动轮播的计时器
    let autoTimer = null;
    //切换图片的时间间隔
    let interval = 3000;

    //控制轮播图的运动
    /*
    * 索引1，展示第二张，left值为-1000
    * 索引2，展示第三张，left值为-2000
    * wrapper的left值其实就是-indexIndex*1000
    *
    *
    * */
    let autoMove = function autoMove(){
        stepIndex++;
        if(stepIndex >= slideList.length){
            stepIndex = 0;
        }
        //基于自主封装的animate实现动画
        //200是从当前切换到下一张动画的时间
        //Interval是间隔多久切换一次
        animate(wrapper,{
            left:-stepIndex*1000
        },200);
        utils.setCss(wrapper,'left',-stepIndex*1000);
    };



    //获取数据
    let queryData = function queryData() {
        return new Promise((resolve, reject) => {
            let data = null;
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'json/banner.json', 'ture');
            //第三个参数不写或者写true都是异步编程
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                    let data = JSON.parse(xhr.responseText);
                    console.log(data);
                    //将获取到的结果传出去
                    resolve(data);
                }
            };
            xhr.send();
        });
    };

    //数据绑定
    let bindHtml = function blindHtml(data) {
        let strSlide = ``;
        let strFocus = ``;
        data.forEach((item, index) => {
            //解构的时候，如果当前返回的数据中没有img，我们可以让其等于默认图片
            let {img = 'img/banner1.jpg', desc = '珠峰培训'} = item;
            strSlide += `<div class="slide">
            <img src="${img}" alt="${desc}">
            </div>`;
            strFocus += `<li class="${index === 0 ? 'active' : '' }"
            </li>`;
        });

        wrapper.innerHTML = strSlide;
        focus.innerHTML = strFocus;

        //获取所有的slide和li
        slideList = wrapper.querySelectorAll('.slide');
        focusList = focus.querySelectorAll('li');

        //根据slide个数动态计算wrapper的宽度
        utils.setCss(wrapper, 'width', slideList.length * 1000);
    };

    return {
        init: function () {
            let promise = queryData();
            promise.then(bindHtml).then(()=>{
                //开启定时器驱动的自动轮播
                autoTimer = setInterval(autoMove, interval)
            });
        }
    }
})();

bannerRender.init();