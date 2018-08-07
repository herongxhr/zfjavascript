//获取元素
//获取列表容器ul
let list = document.getElementById('list');

//新建一个xhr对象
let xhr = new XMLHttpRequest();
let data = null;

xhr.open('get', 'data/newList.json', false);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200/*/^2\d{2}$/.test(xhr.status)*/) {
        data = JSON.parse(xhr.responseText);
    }
};

xhr.send();
bindHtml();

//获取浏览器窗口高度
let winH = utils.win('clientHeight');
window.onscroll = function () {
    let winS = utils.win('scrollTop');
    let lazyImgs = document.getElementsByTagName('img');
    //console.log(lazyImgs);
    for (let i = 0; i < lazyImgs.length; i++) {
        let curImg = lazyImgs[i];
        curImgS = utils.offset(curImg).top;
        if (winS + winH > curImgS + curImg.offsetHeight) {
            lazyLoadingImg(curImg);
        }
    }
};


function bindHtml() {
    //定义变量存储
    let str = '';
    data.forEach((item) => {
        str += `<li>
                    <img src="img/default.jpg" pic="${item.img}" alt="">
                     <div>
                         <h3>${item.title}</h3>
                         <p>${item.desc}</p>
                     </div>
                </li>`

    });
    list.innerHTML = str;
}

function lazyLoadingImg(img) {
    let testImg = new Image();
    testImg.src = img.getAttribute('pic');
    testImg.onload = function () {
        img.src = this.src;
        //console.log('in here');
        fadeIn(img);
        testImg = null;
    }
}

function fadeIn(img) {
    console.log('here');
    let opa = utils.css(img, 'opacity');
    console.log(opa);
    let timer = setInterval(() => {
        opa += 0.2;
        utils.css(img, 'opacity', opa);
        if (opa >= 1) {
            utils.css(img,'opacity',1);
            clearInterval(timer);
        }
    }, 300);

}