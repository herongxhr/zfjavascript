var utils = (function () {
    // offset方法
    // 求当前元素距离body的偏移量
    function offset(ele) {
        let L = ele.offsetLeft;
        let T = ele.offsetTop;
        let parent = ele.offsetParent;
        while(parent){
            L+=parent.offsetLeft;
            T+=parent.offsetTop;
            L+=parent.clientLeft;
            T+=parent.clientTop;
            parent = parent.offsetParent
        }
        return {left:L,top:T}
    }
    // win
    // 求出当前可视区域的html或者body的属性【13个js盒子模型】也可以进行修改
    function win(attr,value) {
        if(value==undefined){
            return document.documentElement[attr]|| document.body[attr]
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    /*
    * getCss
    * 获取当前元素的样式
    *
    * */
    function getCss(ele,attr) {
        // window.getComputedStyle(ele)[attr];
        // 通过这种方式获取到的值，它是一个带单位的字符串
        // 我们需要将这个值去掉单位，以及将字符串变成数字，这样我们再js中会非常方便进行运算
        if('getComputedStyle' in window){
            let val = window.getComputedStyle(ele)[attr];
            // 通过这种方式，我们获取到的属性值，有可能是‘red’ 或者其他不是数字的字符串
            // 我们需要进行校验，判断这个值是一个数字且带单位；
            let reg = /^-?(\d+|[1-9]\d+)(\.\d+)?(px|pt|em|rem)$/i;
            if(reg.test(val)){
                // 如果校验通过的话，我们把单位去掉，且转成数字
                val = parseFloat(val)
            }
            return val
        }
    }
    function getCss(ele,attr){
        // getComputedStyle(元素，元素伪类【一般情况下不写或者写null都可以】)【元素样式上的属性名】 这个方法是用来获取当前元素设置的样式，这个样式是浏览器已经成功渲染出来的样式
        // 在ie6-8下不兼容，xxx.currentStyle //
        if('getComputedStyle' in window){
            // 通过in方法来判断当前属性是否在这个对象中，如果在，证明当前浏览器是标准浏览器，可以用；
            var val = window.getComputedStyle(ele)[attr];// 它的返回值是一个对象
            var reg = /^-?([1-9]\d+|\d+)(\.\d+)?(px|pt|em|rem)?$/i;
            //'12.5px' 'red' 'url(..)' '100%'
            if(reg.test(val)){
                val = parseFloat(val) // 去掉后面的单位，将字符串转成数字
            }
        }
        return val
    }
    /*
    * 设置当前元素的样式
    * 参数：当前元素 当前的样式 样式的值
    * 返回值：没有
    * */
    function setCss(ele,attr,value) {
        var reg = /^width|height|fontSize|(margin|padding)?(top|left|bottom|right)$/i;
        // 我们创建的这个正则，是匹配可以设置数值的属性
        if(reg.test(attr)){
            // 判断当前传的值有没有添加px属性，如果没有，我们手动给这个值添加上px属性，如果有可以不管
            /px/.test(value)?null:value+='px'
        }
        // 最后我们将这个属性和属性值设置给当前的元素
        ele.style[attr]=value;
    }
    /*
    * 批量给元素设置属性
    * 参数：当前元素，对象
    * 返回值：没有
    * */
    function setGroupCss(ele,obj) {
        // 检测obj是一个对象,我们通过Object上的一个方法来检测
        if(Object.prototype.toString.call(obj) == '[object Object]'){
            for(var key in obj){
                // 通过for in循环可以便利到obj上的公有属性和私有属性，但是公有属性对于样式设置没有意义，我们需要通过hasOwnProperty，这个方法找到它的私有属性，进行赋值
                if(obj.hasOwnProperty(key)){
                    // 在这里我们可以通过写的setCss方法来给元素赋值
                    setCss(ele,key,obj[key])
                }
            }
        }
    }

    /**
     * Generates an OpenSSH fingerprint from an ssh public key.
     *
     * @param {String} key an OpenSSH public key.
     * @return {String} key fingerprint.
     * @throws {TypeError} on bad input.
     * @throws {Error} if what you passed doesn't look like an ssh public key.
     */
    /*
    * 将三个方法合并为css一个方法
    * 如果传的参数是三个参数，我们给元素直接设置样式
    * 如果传的参数是二个参数，判断第二个参数是否是一个对象，如果是对象，就批量给当前元素设置，如果不是对象，就获取到当前元素的样式
    * @param {}
    * @return {}
    */

    function css(...arg) {
        // if(arguments.length===3){
        //     setCss(arguments[0],arguments[1],arguments[2])
        // }else{
        //     if(arguments[1] instanceof Object){
        //         setGroupCss(arguments[0],arguments[1])
        //     }else{
        //         return getCss(arguments[0],arguments[1])
        //     }
        // }
        // 通过判断arg的length的长度，来决定是否调用哪个方法，如果长度为3的话，我们调用setCss方法（ary[0],arg[1],arg[2]）
        // 剩余运算符拿到的值，再通过...变成扩展运算符（‘属性0’，‘属性1’，‘属性2’）
        if(arg.length===3){
            setCss(...arg)
        }else if(arg.length===2){
            if(arg[1] instanceof Object){
                setGroupCss(...arg) //继续让该形参展开，执行setGroupCss方法
            }else{
                return getCss(...arg) //如果第二个参数不是对象，我们调用getCss方法，将返回值return出来
            }
        }
    }

    /*
    * 类数组转数组
    *
    * */
    function toArray(ary) {
        return  [].slice.call(ary)
        // return  [...ary]
    }

    /*
    * 获取随机数的方法
    *
    * */
    // 获取随机数 Math.round(Math.random()*(m-n)+n)
    function getRandom(n,m) {
        n=Number(n);
        m=Number(m);
        if(!isNaN(n)&& !isNaN(m)){
            // 如果m小于n的话怎么办
            if(n>m){
                [n,m] = [m,n]
            }
            return Math.round(Math.random()*(m-n)+n)
        }
    }


    return {
        win,
        offset,
        getCss,
        setCss,
        setGroupCss,
        css,
        toArray,
        getRandom,
    }
})();