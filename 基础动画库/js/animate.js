(function () {
    //utils工具
    let utils = (function () {

        /*
        * 获取元素的css属性
        * @param ele {object} 要获取属性的元素
        * @param attr {string} 要获取的属性
        * */
        function getCss(ele, attr) {
            //定义一个变量，保存要获取的属性的值
            let attrValue;
            //getComputedStyle方法不兼容早期浏览器
            if ('getComputedStyle' in window) {
                attrValue = window.getComputedStyle(ele)[attr];
            } else {
                //ie6-8中，[element].currentStyle获取经过计算的样式
                attrValue = ele.currentStyle[attr];
            }
            let reg = /^-?(\d|[1-9]\d+)(\.\d+)?(px|pt|em|rem)$/i;
            if (reg.test(attrValue)) {
                // 如果校验通过的话，我们把单位去掉，且转成数字
                attrValue = parseFloat(attrValue);
            }
            //返回获取到的属性值，其中有单位的会被去单位
            return attrValue;
        }

        /*
        * 使用ele.style设置元素的行内属性
        * @ele {obj} 要设置属性的元素
        * @attr {string} 要设置的属性，js中的css属性没有连字符，采用驼峰命名
        * @value {} 属性值
        * */
        function setCss(ele, attr, value) {
            //透明度opacity属性设置
            if (attr === 'opacity') {
                ele.style[attr] = value;
                //在IE下对透明度的设置
                ele.style['filter'] = 'alpha(opacity=' + value * 100 + ')';
            }
            //浮动float属性的设置
            if (attr === 'float') {
                //在IE下对float的设置
                ele.style['cssFloat'] = value;
                ele.style['styleFloat'] = value;
            }
            //确保对宽高等有单位的属性赋值时带上单位
            let reg = /^width|height|fontsize|top|right|bottom|left|((margin|padding|border)(Top|Right|Bottom|Left)?)$/;
            if (reg.test(attr)) {
                //如果参数value是一个数字，则加上px为单位
                if (!isNaN(value)) {
                    value += 'px';
                }
            }
            ele.style[attr] = value;
        }

        /*
        * 批量设置元素的属性
        * @param ele {object} 要设置属性的元素
        * @param valueObj {object} 要设置的一系列的属性和属性值
        * */
        function setGroupCss(ele, valueObj) {
            //先检测valueObj是不是一个对象
            if (Object.prototype.toString.call(valueObj) === '[object Object]') {
                //遍历valueObj中的键值对，然后调用setCss方法
                for (let attr in valueObj) {
                    if (valueObj.hasOwnProperty(attr)) {
                        setCss(ele, attr, valueObj[attr]);
                    }
                }
            }
        }

        /*
            * css
            * 通过css方法可以给元素设置样式
            * 如果传的参数是三个参数，我们给元素直接设置样式
            * 如果传的参数是二个参数，判断第二个参数是否是一个对象，如果是对象，就批量给当前元素设置，如果不是对象，就获取到当前元素的样式
            *
            *
            * */

        function css(...arg) {
            if (arg.length === 3) {
                setCss(...arg)
            } else if (arg.length === 2) {
                if (arg[1] instanceof Object) {
                    setGroupCss(...arg) //继续让该形参展开，执行setGroupCss方法
                } else {
                    return getCss(...arg) //如果第二个参数不是对象，我们调用getCss方法，将返回值return出来
                }
            }
        }

        //return方法集合
        return {
            getCss,
            setCss,
            setGroupCss,
            css,
        }
    })();

    //动画公式
    let effect = {
        linear: (time, duration, change, originValue) => time / duration * change + originValue,
    };

    /*
    * 动画函数singlePropertyAnimate(),指定持续时间的动画
    * @param ele {object} 发生动画的页面元素
    * @param target {object} 一个对象，用来定义动画完成时的各属性值
    * @param duration {number} 动画持续的总时间，单位为毫秒
    * */
    window.animate = function animate(ele, target, duration) {
        //动画已经运行的时间，由定时器控制累加
        let time = 0;

        //定义一个根据动画运行时间，计算元素当前属性值的函数
        function computedAttributeByTime(time) {
            //定义一个对象保存动画属性初始值
            let originValue = {};
            //定义一个对象保存动画属性的总变化量
            let change = {};
            //定义一个对象保存元素当前时间的属性值
            let current = {};
            //获取元素当前的初始属性属性值，要获取的属性值的个数，由动画完成时的属性值个数决定
            for (let attr in target) {
                //只需要对象自身属性，不需要继承属性
                if (target.hasOwnProperty(attr)) {
                    //将动画要改变的属性的初始值直接获取到
                    originValue[attr] = utils.getCss(ele, attr);
                    //计算出动画各属性的总变化量
                    change[attr] = target[attr] - originValue[attr];
                    //根据时间计算元素现在各属性的值
                    current[attr] = effect.linear(time, duration, change[attr], originValue[attr]);
                }
            }
            //返回保存元素当前属性值的对象
            return current;
        }

        //控制动画的定时器，主要控制了动画的运行时间
        let animateTimer = setInterval(() => {
            time += 17;
            //临界判断
            if (time >= duration) {
                //1.直接设置到动画完成时的状态
                utils.setGroupCss(ele, target);
                //2.清除定时器
                clearInterval(animateTimer);
                //3.return，后面代码不执行
                return;
            }
            //根据已运行的时间，计算出元素现在的属性值
            let current = computedAttributeByTime(time);
            //设置元素的属性值
            utils.setGroupCss(ele, current);

        }, 17)
    }
})();

