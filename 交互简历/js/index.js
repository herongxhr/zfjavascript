let loadingRender = (function(){
    let $loadingBox = $('.loading-box');
    let $current = $loadingBox.find('.current');
    let imgData =[];

    //用来加载图片的
    let run = function run(callback){
        let n = 0;
        let len = imgData.length;
        imgData.forEach(item =>{
            let tempImg = new Image();
            tempImg.onload = ()=>{
              tempImg = null;
              $current.css('width',++n/len*100+'%');

            };
            tempImg.src = item;

            //加载完成
            if(n === len){
                callback && callback();
            }
        })

    };

    //max-delay：设置最长等待时间（假设10S,到达10S我们看加载多少，如果已经达到了90%以上，我们就可以正常访问内容了，如果不足这个比例，直接提示用户当前网络不佳，稍后重试。
    let delayTimer = null;
    let maxDelay = function maxDelay(callback){
        delayTimer = settimeout(()=>{
            if(n/len >= 0.9){
                callback && callback();
                return;
        }
        alert('非常遗憾，当前您的网络状况不佳，请稍后再试');
        },10000);



    };

    //完成
    let done = function done() {
        //停留一秒钟再移除进入下一环节
        let timer = setTimeout(()=>{
            $loadingBox.remove();
        },1500)
    };

    return {
        init:function () {
            run();
        }
    }
})();

loadingRender.init();