let musicRender = (function () {
    let $headerBox = $('.header-box');
    let $contentBox = $('.content-box');
    let $footerBox = $('.footer-box');
    let musicAudio = $('#musicAudio')[0];
    let $playBtn = $headerBox.find('.playBtn');
    let $already = $footerBox.find('.already');
    let $duration = $footerBox.find('.duration');
    let $current = $footerBox.find('.current');


    //计算content区域的高度
    let computeContentHeight = function computeContentHeight() {
        let winH = document.documentElement.clientHeight;
        let font = parseFloat(document.documentElement.style.fontSize);
        $contentBox.css({
            height: winH - $headerBox[0].offsetHeight - $footerBox[0].offsetHeight - 0.8 * font
        })
    };

    //获取歌词
    let queryLyric = function queryLyric() {
        return new Promise(resolve => {
            $.ajax({
                url: 'json/lyric.json',
                dataType: 'json',
                success: resolve,
            })

        })
    };

    //绑定歌词到页面
    let bindHtml = function bindHtml(lyricAry) {
        //获取歌词容器
        let $wrapper = $contentBox.find('.wrapper');
        let $lyricList = null;
        let str = ``;
        lyricAry.forEach(item => {
            let {minutes, seconds, content} = item;
            //数据绑定的时候把歌词对应的分和秒设置为自定义属性存储起来，后期需要使用直接调用
            str += `<p data-minutes="${minutes}" data-second="${seconds}">${content}</p>`;
        });
        $wrapper.html(str);
        //先把歌词保留下来，以后要用
        $lyricList = $wrapper.find('p');
    };

    //开始播放
    let $plan = $.Callbacks();
    let playRun = function playRun() {
        musicAudio.play();
        musicAudio.addEventListener('canplay', $plan.fire);
    };

    //控制暂停和播放
    $plan.add(() => {
        //播放按钮显示
        $playBtn.css('display', 'block').addClass('move');

        $playBtn.tap(() => {
            if (musicAudio.paused) {
                musicAudio.play();
                $playBtn.addClass('move');
                return;
            }
            //当前是播放状态
            musicAudio.pause();
            $playBtn.removeClass('move');
        })

    });

    //控制进度条
    let autoTimer = null;
    $plan.add(() => {
        //获取视频总时间
        let duration = musicAudio.duration;
        //按格式显示总时长
        $duration.html(computeTime(duration));
        autoTimer = setInterval(() => {
            let currentTime = musicAudio.currentTime;
            //如果已经播放完
            if(currentTime>=duration){
                clearInterval(autoTimer);
                $already.css('width','100%');
                musicAudio.pause();
                $playBtn.removeClass('move');
                return;
            }
            $already.html(computeTime(currentTime));
            $current.css('width',currentTime/duration*100 + '%');
        }, 1000)
    });

    //计算时间
    let computeTime = function computeTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.round(time - minutes * 60);
        //    不足两们数加0
        minutes < 10 ? minutes = '0' + minutes : null;
        seconds < 10 ? seconds = '0' + seconds : null;
        return `${minutes}:${seconds}`;
    };
    return {
        init: function () {
            computeContentHeight();
            let promise = queryLyric();
            promise.then(result => {
                let {lyric = ''} = result;
                let obj = {32: '', 40: '(', 41: ')', 45: '-'};
                //替换掉歌词中除分秒以外的特殊字符
                lyric = lyric.replace(/&#(\d+);/g, (...arg) => {
                    let [item, num] = arg;
                    item = obj[num] || item;
                    return item;
                });
                //上一个then方法中返回的结果会作为下一下then实参传递进去
                return lyric;
            }).then(lyric => {
                let lyricAry = [];
                //正则中的‘]’不需要转义
                let reg = /\[(\d+)&#58;(\d+)&#46;\d+]([^&#]+)(&#10;)?/g;
                //let reg1 = /\[(\d+)&#58;(\d+)&#46;(?:\d+)]([^&#]+)(?:&#10;)/g;
                lyric.replace(reg, (...arg) => {
                    let [, minutes, seconds, content] = arg;
                    lyricAry.push({
                        minutes,
                        seconds,
                        content
                    });
                });
                return lyricAry;
            }).then(bindHtml).then(playRun);
        }
    }
})
();
musicRender.init();
