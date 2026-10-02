// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//我的 语言设置
let i18n = require("i18n");
let TAG = "my_language";
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let my = require("my");

cc.Class({
    extends: cc.Component,

    properties: {
        panelList: {
            default: [],
            type: cc.Node,
        },

        labelTip: cc.Label,

        curIndex: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        // this.labelTip.active = false;
        this.LANGUAGE_LIST = ["zh","en", "vi", "th", "kh", "id"] //["zh", "zh_tw", "en", "vi", "th", "kh", "id"]
        let language = app.storage.getItem("CLUB_LANGUAGE", "");
        let index = 1;
        if (language == "") {
            language = app.config.LANG;
        }
        for (let i = 0; i < this.LANGUAGE_LIST.length; i++) {
            if (this.LANGUAGE_LIST[i] == language) {
                index = i + 1;
                break
            }
        }

        this.setSelectPanel(index);

        //测试
        this.labelTip.lang = "LOGIN.CREATE_ACCOUNT";
    },

    // update (dt) {},

    onClickClose() {
        this.node.destroy();
    },

    onClickItem(event, data) {
        // if (!cc.sys.isNative){
        //     UIFrame.showTips(i18n.t("CLUB_HALL_TIP.WEB_NOT_SUPPORT"));
        //     return
        // }

        let num = Number(data);
        if (this.curIndex == num) {
            return
        }

        // this.labelTip.active = true;

        this.setSelectPanel(num)
        app.storage.setItem("CLUB_LANGUAGE", this.LANGUAGE_LIST[num - 1]);

        i18n.init(this.LANGUAGE_LIST[num - 1]);
        my.target.emit(my.event.UPDATE_LANGUAGE);

        this.scheduleOnce(() => {
            //app.audio.stopAll();
            // if (jsb) {
            //     jsb.fileUtils.purgeCachedEntries();
            //     cc.sys.restartVM();
            //     cc.game.restart();
            // }
        }, 1);

    },

    setSelectPanel(index) {
        for (let i = 0; i < this.panelList.length; i++) {
            let node = this.panelList[i];
            let tog = node.getComponent(cc.Toggle);
            let info = node.getChildByName("info")   
            if ((i + 1) == index) {
                tog.isChecked = true;
                info.color = new cc.Color(3,255,133)
            } else {
                tog.isChecked = false;
                info.color = new cc.Color(100,115,130)
            }
        }

        this.curIndex = index
    }
});
