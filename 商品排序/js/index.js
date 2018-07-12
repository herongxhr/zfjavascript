//1.获取要操作的元素
let header = document.getElementsByClassName('header')[0];
let btnList = document.getElementsByTagName('a');
let myDiv = document.getElementById('box');

//2.通过ajax获取要操作的数据
//创建一个ajax对象
let xhr = new XMLHttpRequest();
let data = null;
//打开一个请求连接（请求方式，请求地址，是否异步请求）
xhr.open('get', 'json/product.json', false);
//监听xhr的准备状态，当状态码变成200，准备状态变成4【准备结束】的时候，证明请求成功
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        data = utils.toJSON(xhr.responseText);
    }
};
//发送ajax请求，参数没有
xhr.send();
console.log(data);

//3.将数据绑定到页面中
function bindHtml() {
    let str = '';
    //循环遍历data数据，将数据通过字符串模板绑定到页面上
    data.forEach(item => {
        str += `<li>
                <img src="${item.img}" alt="">
                <span>${item.title}</span>
                <span>${item.time}</span>
                <span>热度：${item.hot}</span>
                <span>￥：${item.price}</span>
            </li>`
    });
    myDiv.innerHTML = str;
}

bindHtml();
//4.绑定点击事件，实现sort排序
for (let i = 0; i < btnList.length; i++) {
    btnList[i].flag = -1;//1升序，-1降序
    btnList[i].onclick = function () {
        let value = this.getAttribute('attrName');
        this.flag *= -1;
        sortAll.call(this, value);
        arrowColor.call(this);
        clearArrow.call(this);
    }
}
console.log(btnList);

function sortAll(value) {
    data.sort((a, b) => {
        //判断value和time是否相等，如果相等直接使用new Date的方式进行相减达到排序效果，如果不相等直接属性名对应属性值进行相减排序。最后乘以this.flag。
        if (value === 'time') {
            return (new Date(a[value]) - new Date(b[value])) * this.flag;
        } else {
            return (a[value] - b[value]) * this.flag;
        }

    });
    bindHtml();
}

function arrowColor() {
    //拿到当前a标签下的两个子元素节点，利用索引来表示，一个是up箭头，一个是down箭头
    let up = this.children[0];
    let down = this.children[1];
    //利用this.flag的值来表示是升序还是降序，如果是升序，给up标签添加一个类名bg，如果是降序，给down元素添加一个bg类名
    if (this.flag > 0) {
        up.classList.add('bg');
        down.classList.remove('bg');
    } else {
        up.classList.remove('bg');
        down.classList.add('bg');
    }
}

//当选择某种排序方式后，另外的排序方式的箭头颜色指示必须清空
function clearArrow() {
    for (let i = 0; i < btnList.length; i++) {
        if (btnList[i] !== this) {
            btnList[i].children[0].classList.remove('bg');
            btnList[i].children[1].classList.remove('bg');
            //为了让每次点击的时候，其它元素都恢复到默认的升序，我们在清空其它元素状态的时候，给其它元素的flag值都赋值为-1，这样再点击的时候，就可以默认升序
            btnList[i].flag = -1;
        }

    }
}