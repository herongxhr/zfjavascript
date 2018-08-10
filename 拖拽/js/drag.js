$(function () {
    //获取要操作的元素
    let $dialogMark = $('.dialog-mark'),
        $dialogBox = $('.dialog-box'),
        $boxTitle = $dialogBox.find('.title'),
        $closeBtn = $dialogBox.find('i');

    //1.先让模态框在屏幕中间
    //获取一屏幕的宽高及模态框的宽高
    let winW = document.documentElement.clientWidth;
    let winH = document.documentElement.clientHeight;
    let boxW = $dialogBox[0].offsetWidth;
    let boxH = $dialogBox[0].offsetHeight;
    //设置模态框的top及left
    $dialogBox.css({
        top: (winH - boxH) / 2,
        left: (winW - boxW) / 2
    });

    //2.点击关闭按钮让模态框消失
    $closeBtn.on('click', function () {
        //fadeOut是jquery中的渐隐动画
        $dialogBox.stop().fadeOut(500, () => {
            $dialogMark.css('display', 'none');
        })
    });

    //3.实现拖拽效果
    /*
    * 思路：
    * A：鼠标在H3中按下（mouse-down）证明拖拽开始
    * B：鼠标在H3中移动（mouse-move）让盒子也跟着移动
    * C：鼠标在H3上松开（mouse-up）拖拽结束，此时我们在H3中移动，不做任何处理
    * */
    //鼠标移动处理的事情
    let dragStart = function dragStart(ev) {
        //this->H3
        this.startX = ev.clientX;
        this.startY = ev.clientY;
        this.startT = parseFloat($dialogBox.css('top'));
        this.startL = parseFloat($dialogBox.css('left'));
        //只有鼠标按下后才会给move行为绑定方法（在H3中移动鼠标才会让其做一些事情）
        $boxTitle.on('mousemove',dragMove);

    };

    //鼠标移动处理的事情
    let dragMove = function dragMove(ev) {
        //随时根据鼠标的当前位置，减去起始的鼠标位置，计算出鼠标的偏移值，用偏移值加上盒子的起始位置，算出盒子的当前位置
        //解构赋值
        let {startX, startY, startL, startT} = this;
        let curL = ev.clientX - startX + startL+'px';
        let curT = ev.clientY - startY + startT+'px';
        $dialogBox.css({
            left:curL,
            top:curT,
        })

    };

    //鼠标离开处理的事情
    let dragEnd = function dragEnd() {
        //手指在H3中抬起，证明结束拖拽，我们把给move绑定的方法我也会去，这样让鼠标再运动的时候，例子也不会处理
        $boxTitle.off('mousemove', dragMove);
    };

    //鼠标按下时
    $boxTitle.mousedown(dragStart);

    //鼠标松开时
    $boxTitle.mouseup(dragEnd);
});