// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let AppWebApi = require("AppWebApi");
let Utils = require("Utils");
let i18n = require("i18n");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        itemList: {
            default: [],
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    init(){
        let self = this;
        let callBack = function(error, data){
            if (!data || error){
                return;
            }

            let configArray = JSON.parse(data);
            if(!self.itemList){
                return;
            }
            
            for (let i = 0; i < configArray.length; i++) {
                let item = self.itemList[i];
                let tmpArray = configArray[i];
                if (item){
                    item.active = true;
                    let name = item.getChildByName("name");
                    if(name){
                        name.getComponent(cc.Label).string = tmpArray.name;
                    }

                    let account = item.getChildByName("account");
                    if(account){
                        account.getComponent(cc.Label).string = tmpArray.phone;
                    }

                    let imgIcon = item.getChildByName("imgIcon");
                    if(imgIcon){
                        self._loadImg(tmpArray.icon, imgIcon.getComponent(cc.Sprite));
                    }

                    let btn_copy = item.getChildByName("btn_copy");
                    if (btn_copy){
                        let call = btn_copy.getComponent(cc.Button).clickEvents[0]
                        if(call){
                            call.customEventData = tmpArray;
                        }
                    }
                }
                
            }
        }

        let lang = LocalStorage.getSysLanguage()
        AppWebApi.getCustomerInfo({lang:lang}, callBack)
    },

    _loadImg(url, spriteNode){
        if(!url){
            return;
        }
        spriteNode.node.active = false;
        cc.assetManager.loadRemote(url, function (error, texture) { 
            if (cc.isValid(spriteNode)){
                spriteNode.node.active = true;
            }
            if(error) {
                QYLogs.error("HallCustomerInfo", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(spriteNode)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    spriteNode.spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickCopy(event, customEventData){
        let result = Utils.copyToClipBoard(customEventData.phone);
        // if(result || cc.sys.isNative){
        //     UIFrame.showTips(i18n.t("CLUB_HALL_TIP.COPY_LINK_SUCCESS"));
        // }else{
        //     UIFrame.showTips(i18n.t("CLUB_HALL_TIP.COPY_LINK_FAIL"));
        // }  
    }
});
