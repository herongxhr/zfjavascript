function formatTime(time){
    // 丢弃小数部分,保留整数部分
    // parseInt(5/2)

    // 向上取整,有小数就整数部分加1
    // Math.ceil(5/2)

    // 四舍五入
    // Math.round(5/2)

    // 向下取整
    //Math.floor(5/2)

    let getMinute = parseInt(time/60);
    let getSecond = time%60;
}