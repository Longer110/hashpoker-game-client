// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 全局消息通知中心
// ]]

let NotifyEvent = require("NotifyEvent");

class NotifyCenter extends cc.EventTarget {
    static target = null;
    static event = NotifyEvent;
    name = "NotifyCenter";
    constructor(options) {
        super();
        this.load();
    }
    load(){
        
    }
    destroy(){

    }
}

NotifyCenter.target = new NotifyCenter();
module.exports = NotifyCenter;