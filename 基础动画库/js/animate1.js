//animate动画库
;(function () {
    let utils = (function () {
        //获取css样式
        function getCss(ele, attr) {
            // window.getComputedStyle(ele)[attr];
            // 通过这种方式获取到的值，它是一个带单位的字符串
            // 我们需要将这个值去掉单位，以及将字符串变成数字，这样我们再js中会非常方便进行运算
            let val = null;
            if ('getComputedStyle' in window) {
                val = window.getComputedStyle(ele)[attr];
            } else {
                //ie6-8中，[element].currentStyle获取经过计算的样式
                val = ele.currentStyle[attr];
            }
            // 通过这种方式，我们获取到的属性值，有可能是‘red’ 或者其他不是数字的字符串
            // 我们需要进行校验，判断这个值是一个数字且带单位；
            let reg = /^-?(\d|[1-9]\d+)(\.\d+)?(px|pt|em|rem)$/i;
            //let reg = /^-?(\d+|[1-9]\d+)(\.\d+)?(px|pt|em|rem)$/i;
            if (reg.test(val)) {
                // 如果校验通过的话，我们把单位去掉，且转成数字
                val = parseFloat(val);
            }
            return val;
        }

        /*
       * 设置当前元素的样式
       * 参数：当前元素 当前的样式 样式的值
       * 返回值：没有
       * */
        function setCss(ele, attr, value) {
            if (attr === "opacity") {
                ele.style["opacity"] = value;
                // 在IE下对透明度的设置
                ele.style["filter"] = "alpha(opacity=" + value * 100 + ")";
            }

            if (attr === "float") {
                //在IE下对浮动的设置
                ele.style["cssFloat"] = value;
                ele.style["styleFloat"] = value;
            }
            // 确保对宽高margin,padding赋值带单位
            let reg = /^width|height|top|left|bottom|right|((border|margin|padding)(Top|Bottom|Left|Right)?)$/;
            // 取匹配要修改的属性是以上几种
            if (reg.test(attr)) {
                // 判断当前的值是否带有单位，如果没有，进行拼接
                if (!isNaN(value)) {
                    value += "px";
                }
            }
            ele.style[attr] = value;
        }


        /*
            * 批量给元素设置属性
            * 参数：当前元素，对象
            * 返回值：没有
            * */
        function setGroupCss(ele, obj) {
            // 检测obj是一个对象,我们通过Object上的一个方法来检测
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                for (let key in obj) {
                    // 通过for in循环可以便利到obj上的公有属性和私有属性，但是公有属性对于样式设置没有意义，我们需要通过hasOwnProperty，这个方法找到它的私有属性，进行赋值
                    if (obj.hasOwnProperty(key)) {
                        // 在这里我们可以通过写的setCss方法来给元素赋值
                        setCss(ele, key, obj[key])
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

        return {
            getCss,
            setCss,
            setGroupCss,
            css
        };
    })();


//effect:准备运动的公式
    let effect = {
        //匀速运动公式
        linear: (time, duration, change, beginPosition) => time / duration * change + beginPosition,

    };

    /*封装动画库
    /*
    * @param ele {object} 要设置动画的元素
    * @param target {object} 动画选项
    * @param duration {number} 动画的时间
    */
    window.animate = function (ele, target = {}, duration = 1000) {
        //初始化动画时间
        let time = 0;

        //计算当前位置
        function computeCurPosition(time) {
            //起始值
            let begin = {};
            //总运动值
            let change = {};
            //当前位置
            let curPosition = {};
            //遍历target中的动画选项
            for (let attr in target) {
                if (target.hasOwnProperty(attr)) {
                    //基于target计算出begin和change
                    begin[attr] = utils.getCss(ele, attr);
                    change[attr] = target[attr] - begin[attr];
                    curPosition[attr] = effect.linear(time, duration, change[attr], begin[attr]);
                }
            }
            //返回根据时间计算出的当前位置值
            return curPosition;
        }

        //实现动画
        //在给当前元素设置新的动画之前，先清空原有正在运行的动画（防止多动画共存，把动画的返回值赋值给当前元素的自定义属性，这样只要元素不变，我们不管啥时候在哪执行都可以清除元素的动画）
        clearInterval(ele.animateTimer);
        ele.animateTimer = setInterval(() => {
            time += 17;
            //边界判断
            if (time >= duration) {
                //直接设置到目标位置
                utils.setCss(ele, target);
                clearInterval(ele.animateTimer);
                return;
            }
            //根据时间获取当前位置
            let curPosition = computeCurPosition(time);
            //设置元素的当前位置的各属性
            for (let attr in curPosition) {
                if (curPosition.hasOwnProperty(attr)) {
                    utils.setCss(ele, attr, curPosition[attr])
                }
            }
        }, 17);
    };
})();
