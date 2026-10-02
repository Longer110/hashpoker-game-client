// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let i18n = require("i18n");
let SDKPlatform = require("SDKPlatform");

cc.Class({
    extends: cc.Component,

    properties: {
        sharePanel: cc.Node,
        shareTip: cc.Node,

        content: cc.Node,
        item: cc.Node,
        menu: cc.Node,

        iconList: {
            default: [],
            type: cc.SpriteFrame,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    //shareType: 1:分享文本 2： 分享图片
    init(shareType, text, imgPath, callBack){
        this._shareType = shareType;
        this._text = text;
        this._imgPath = imgPath;
        this._callBack = callBack;
        this.initUI();
    },

    initUI(){
        let layout = this.content.getComponent(cc.Layout);
        if (!app.config.IS_SHOW_APP_SHARE || !cc.sys.isNative){
            if (layout){
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            }
        }else{
            if (layout){
                layout.resizeMode = cc.Layout.ResizeMode.NONE;
            }
        }

        let node = cc.instantiate(this.content);
        node.active = true;
        let num = 0;
        
        for (let i = 0; i < this.iconList.length; i++) {
            if (!app.config.IS_SHOW_APP_SHARE || !cc.sys.isNative){
                if (i != this.iconList.length - 1){
                    continue;
                }
            }
            if (cc.sys.os==cc.sys.OS_IOS){
                if (i == 3 || i == 7 || i == 6){
                    //苹果不显示instagram、微信和qq分享
                    continue;
                }
            }
            let item = cc.instantiate(this.item);
            let icon = item.getChildByName("icon");
            icon.getComponent(cc.Sprite).spriteFrame = this.iconList[i];

            let name = item.getChildByName("name").getComponent(cc.Label);
            name.lang = "CLUB_SHARE_APP." + i;
            item.active = true;

            let button = item.getComponent(cc.Button);
            button.node.off(cc.Node.EventType.TOUCH_END);
            button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.onClickShareOperate(node, i);
            }.bind(this));


            if (num < 4){
                node.addChild(item);
                num ++;
            }else{
                this.menu.addChild(node);
                node = cc.instantiate(this.content);
                node.active = true;
                node.addChild(item);
                num = 1;
            }

            if (i == this.iconList.length - 1){
                this.menu.addChild(node);
            }
            
        }
    },

    //显示或者隐藏分享界面
    showSharePane(isShow){
        this.sharePanel.active = isShow;
    },

    //点击关闭分享界面
    onCloseSharePanel(){
        this.node.destroy();
    },

    //点击分享按钮操作
    onClickShareOperate(event, customEventData){
        let index = Number(customEventData);

        if (index == 11){
            //复制链接
            Utils.copyToClipBoard(this._text)
            this.showShareTip(true);
            this.showSharePane(false);
        }else{
            this.shareText(index);
        }
    },

    showShareTip(isShow){
        if (isShow){
            this.shareTip.active = true;
            this.scheduleOnce(function(){
                this.shareTip.active = false;
                this.onCloseSharePanel();
            }.bind(this), 2)
        }else{
            this.shareTip.active = false;
        }
    },

    shareText(index){
        SDKPlatform.shareText(this._text, index);
    }
});
