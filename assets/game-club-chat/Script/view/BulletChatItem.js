// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');
let Utils = require("Utils")
let ChatMessageMgr = require("ChatMessageMgr");
let Base64 = require("base64");
let i18n = require("i18n");

let LocalStorage = require("LocalStorage")
let base64 = require('base64');

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if(!this._isFrist){
            // MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_USERINFO_UPDATE, this.userinfo_update, this);//早期消息插入
            this._isFrist = true
        }
    },

    //销毁场景
    onDestroy(){
        
        if(this._isFrist){
            this._isFrist = false
            // MsgManager.un(this.userinfo_update,this);
        }
    },

    //压出缓存池
    reuse(){
        if(!this._isFrist){
            // MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_USERINFO_UPDATE, this.userinfo_update, this);//早期消息插入
            this._isFrist = true
        }
    },

    //压入缓存池
    unuse(){
        if(this._isFrist){
            this._isFrist = false
            // MsgManager.un(this.userinfo_update,this);
        }
    },


    userinfo_update(data){

        if(this._data.fromAccount == data.account){
            cc.log("userinfo_update = ",data)
            this._data.userInfo = data
            let head = this.node.getChildByName("head");
            let vip_bg = head.getChildByName("vip_bg")
            if(this._data.userInfo && this._data.userInfo.isVip){
                vip_bg.active = true
            }else{
                vip_bg.active = false
            }

            if(head){
                head.active = true

                let head_mask = head.getChildByName("head_mask")
                let head_img = head_mask.getChildByName("head_img")
                if(head_img){
                    let headSprite = head_img.getComponent(cc.Sprite)
                    if(headSprite){
                        Utils.changeUserHead(headSprite,data.avatar)
                        //cc.log("userinfo_update data.avatar="+data.avatar)
                        head_img.active = true
                    }
                }
            }
        }

    },

    start () {

    },



    initTextAndEmoji(data,view){
        this._data = data
        this.view = view;


        let isEmoji = false
        let textStr = data.message.split('&avatar=')[0]
        if(textStr.indexOf("BTTPOKER") != -1){
            textStr = textStr.replace("BTTPOKER","");
        }
        textStr = base64.decode(textStr)
        let messageStr = ChatMessageMgr.getMessageText(textStr)
        if(messageStr.indexOf("@emoji") != -1){
            isEmoji = true
        }
        
        let name = this.node.getChildByName("name");
        let text = this.node.getChildByName("text");
        let head = this.node.getChildByName("head");
        let emoji = this.node.getChildByName("emoji");


        if(emoji){
            for(let i= (emoji.children.length-1);i >= 0;i--){
                let node = emoji.children[i]
                if(this.view){
                    this.view.recycleEmojiObj(node)
                }
            }
        }

        if(text){
            text.active = false
        }
        if(emoji){
            emoji.active = false
        }


        let barrage_type_1 = this.node.getChildByName("barrage_type_1");
        let barrage_type_2 = this.node.getChildByName("barrage_type_2");
        let barrage_type_3 = this.node.getChildByName("barrage_type_3");
        let vip_effect_1 = this.node.getChildByName("vip_effect_1");
        let vip_effect_2 = this.node.getChildByName("vip_effect_2");
        let type = "barrage_type_1"
        let offset = 20
        let itemW = 0
        let x = 0
        if(head){
            head.active = true
            itemW = itemW + head.width + offset
            x = head.x + head.width/2 + offset
            let head_mask = head.getChildByName("head_mask")
            let head_img = head_mask.getChildByName("head_img")
            let vip_bg = head.getChildByName("vip_bg")
            if(this._data.userInfo && this._data.userInfo.isVip){
                vip_bg.active = true
            }else{
                vip_bg.active = false
            }
            if(head_img){
                let headSprite = head_img.getComponent(cc.Sprite)
                if(headSprite){
                    if(this._data.userInfo){
                        Utils.changeUserHead(headSprite,this._data.userInfo.avatar)
                        head_img.active = true
                    }
                }
            }
        }

        if(name){
            name.active = true
            let nameLabel = name.getComponent(cc.Label)
            if(nameLabel){
                nameLabel.string = Utils.getShortText(data.name,10)+ " :"
                nameLabel._forceUpdateRenderData()
            }
            name.x = x + name.width/2
            itemW = itemW + name.width + offset
            x = x + name.width + offset

            let index = Math.floor(Math.random() * 5)
            let colors = []
            colors.push(cc.Color.BLACK.fromHEX("#FFFFFF"))
            colors.push(cc.Color.BLACK.fromHEX("#EE6BFE"))
            colors.push(cc.Color.BLACK.fromHEX("#FFC939"))
            colors.push(cc.Color.BLACK.fromHEX("#3BD3FF"))
            colors.push(cc.Color.BLACK.fromHEX("#FF9752"))
            name.color = colors[index]
    
        }


        if(!isEmoji){
            if(text){
                text.active = true
                let textLabel = text.getComponent(cc.Label)
                if(textLabel){
                    if(messageStr.indexOf("#@type") != -1){
                        let messages = messageStr.split("#@type")
                        messageStr = messages[0]
                        type = messages[1]
                    }
                    if(messageStr.indexOf("CHAT_BARRAGE_LIST.") != -1){
                        let messageStrTmp = i18n.t(messageStr)
                        if(messageStrTmp != messageStr){
                            messageStr = messageStrTmp
                        }
                    }
                    textLabel.string = messageStr
                    textLabel._forceUpdateRenderData()
                }
                text.x = x + text.width/2
                itemW = itemW + text.width + offset
            }
        }else{
            if(emoji){
                emoji.active = true
                if(messageStr.indexOf("#@type") != -1){
                    let messages = messageStr.split("#@type")
                    messageStr = messages[0]
                    type = messages[1]
                }
                if(messageStr.indexOf("@emoji") != -1){
                    let id = Number(messageStr.replace("@emoji",""))
                    if(id >= 0 && id < 20){
                        if(this.view){
                            let emojiAnimation = this.view.spawnEmojiObj(id)
                            if(emojiAnimation){
                                emojiAnimation.parent = emoji
                                emojiAnimation.x = 0
                                emojiAnimation.y = 0
                            }
                        }
                    }
                }

                emoji.x = x + 25
                emoji.y = 0
                itemW = itemW + 50 + offset
            }
        }
        

        if(type == "barrage_type_1"){
            text.color = cc.Color.BLACK.fromHEX("#FFFFFF")

            if(barrage_type_2){
                barrage_type_2.active = false
            }
            if(barrage_type_3){
                barrage_type_3.active = false
            }

            if(barrage_type_1){
                barrage_type_1.active = true
                barrage_type_1.width = itemW
            }
            if(vip_effect_1){
                vip_effect_1.active = false
            }
            if(vip_effect_2){
                vip_effect_2.active = false
            }
        }else if(type == "barrage_type_2"){
            text.color = cc.Color.BLACK.fromHEX("#FFB155")

            if(barrage_type_1){
                barrage_type_1.active = false
            }
            if(barrage_type_3){
                barrage_type_3.active = false
            }

            if(barrage_type_2){
                barrage_type_2.active = true
                barrage_type_2.width = itemW + 20
            }
            if(vip_effect_1){
                vip_effect_1.active = true
                vip_effect_1.x = itemW
            }
            if(vip_effect_2){
                vip_effect_2.active = false
            }

        }else if(type == "barrage_type_3"){
            text.color = cc.Color.BLACK.fromHEX("#55FFC1")
            if(barrage_type_1){
                barrage_type_1.active = false
            }
            if(barrage_type_2){
                barrage_type_2.active = false
            }

            if(barrage_type_3){
                barrage_type_3.active = true
                barrage_type_3.width = itemW
            }
            if(vip_effect_2){
                vip_effect_2.active = true
                vip_effect_2.x = itemW
            }
            if(vip_effect_1){
                vip_effect_1.active = false
            }
        }

        this.node.width = itemW
    },

    

    initAudio(data,view){
        this._data = data
        this.view = view;

        let name = this.node.getChildByName("name");
        let text = this.node.getChildByName("text");
        let head = this.node.getChildByName("head");
        let emoji = this.node.getChildByName("emoji");


        if(emoji){
            for(let i= (emoji.children.length-1);i >= 0;i--){
                let node = emoji.children[i]
                if(this.view){
                    this.view.recycleEmojiObj(node)
                }
            }
        }
        if(text){
            text.active = false
        }
        if(emoji){
            emoji.active = false
        }

        let barrage_type_1 = this.node.getChildByName("barrage_type_1");
        let barrage_type_2 = this.node.getChildByName("barrage_type_2");
        let barrage_type_3 = this.node.getChildByName("barrage_type_3");
        let vip_effect_1 = this.node.getChildByName("vip_effect_1");
        let vip_effect_2 = this.node.getChildByName("vip_effect_2");
        let offset = 20
        let itemW = 0
        let x = 0
        if(head){
            head.active = true
            itemW = itemW + head.width + offset
            x = head.x + head.width/2 + offset
            let head_mask = head.getChildByName("head_mask")
            let head_img = head_mask.getChildByName("head_img")
            let vip_bg = head.getChildByName("vip_bg")
            if(this._data.userInfo && this._data.userInfo.isVip){
                vip_bg.active = true
            }else{
                vip_bg.active = false
            }
            if(head_img){
                let headSprite = head_img.getComponent(cc.Sprite)
                if(headSprite){
                    if(this._data.userInfo){
                        Utils.changeUserHead(headSprite,this._data.userInfo.avatar)
                        head_img.active = true
                    }
                }
            }
        }

        if(name){
            name.active = true
            let nameLabel = name.getComponent(cc.Label)
            if(nameLabel){
                nameLabel.string = Utils.getShortText(data.name,10)
                nameLabel._forceUpdateRenderData()
            }
            name.x = x + name.width/2
            itemW = itemW + name.width + offset
            x = x + name.width + offset
            let index = Math.floor(Math.random() * 5)
            let colors = []
            colors.push(cc.Color.BLACK.fromHEX("#FFFFFF"))
            colors.push(cc.Color.BLACK.fromHEX("#EE6BFE"))
            colors.push(cc.Color.BLACK.fromHEX("#FFC939"))
            colors.push(cc.Color.BLACK.fromHEX("#3BD3FF"))
            colors.push(cc.Color.BLACK.fromHEX("#FF9752"))
            name.color = colors[index]
        }

        if(text){
            text.active = true
            let textLabel = text.getComponent(cc.Label)
            if(textLabel){
                textLabel.lang = "CHAT.AUDIO_TIPS";
                textLabel._forceUpdateRenderData()
            }
            text.x = x + text.width/2
            itemW = itemW + text.width + offset
            text.color = cc.Color.BLACK.fromHEX("#FFFFFF")
            if(barrage_type_2){
                barrage_type_2.active = false
            }
            if(barrage_type_3){
                barrage_type_3.active = false
            }
            if(barrage_type_1){
                barrage_type_1.active = true
                barrage_type_1.width = itemW
            }
            if(vip_effect_1){
                vip_effect_1.active = false
            }
            if(vip_effect_2){
                vip_effect_2.active = false
            }
        }
        this.node.width = itemW
    },

    // update (dt) {},
});
