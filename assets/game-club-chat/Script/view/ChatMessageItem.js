// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let ChatMessageMgr = require("ChatMessageMgr");
let base64 = require("base64");
let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');
let i18n = require("i18n");
let Utils = require("Utils")

let LocalStorage = require("LocalStorage")


var MessageTypeEnum = {
    TEXT: "text",
    AUDIO: "audio",
    IMAGE: "image",
    TIME: "time",
}




cc.Class({
    extends: cc.Component,

    properties: {
        
        right_message:cc.Node,//右边消息
        left_message:cc.Node,//左边消息
        center_message:cc.Node,//中间消息


    },


    onLoad () {

        if(!this._isFrist){
            MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_UPDATE, this.update_message, this);//早期消息插入
            // MsgManager.on(CHAT_MSG.NOTIFY.AUDIO_PLAY_START, this.audio_play_start, this);//语音播放开始
            // MsgManager.on(CHAT_MSG.NOTIFY.AUDIO_PLAY_END, this.audio_play_end, this);//语音播放结束
            this._isFrist = true
        }
        
    },

    //销毁场景
    onDestroy(){
        
        if(this._isFrist){
            this._isFrist = false
            MsgManager.un(this.update_message,this);
            // MsgManager.un(this.audio_play_start,this);
            // MsgManager.un(this.audio_play_end,this);
        }


    },

    audio_play_start(data){
        if(this._data && this._data.uuid == data.uuid){
            this._data = data
            this.updateUI(data)

            let audio_icon = null
            if(data.isMyMessage){//右边
                let frame = this.right_message.getChildByName("frame")
                if(frame){
                    audio_icon = frame.getChildByName("audio_icon")
                }
            }else{//左边
                let frame = this.left_message.getChildByName("frame")
                if(frame){
                    audio_icon = frame.getChildByName("audio_icon")
                }
            }

            if(audio_icon){
                let animation = audio_icon.getComponent(cc.Animation);
                if(cc.isValid(animation)){
                    animation.play("audio_play");
                }
            }
        }
    },


  

    audio_play_end(data){
        if(this._data && this._data.uuid == data.uuid){
            this._data = data
            this.updateUI(data)

            let audio_icon = null
            if(data.isMyMessage){//右边
                let frame = this.right_message.getChildByName("frame")
                if(frame){
                    audio_icon = frame.getChildByName("audio_icon")
                }
            }else{//左边
                let frame = this.left_message.getChildByName("frame")
                if(frame){
                    audio_icon = frame.getChildByName("audio_icon")
                }
            }

            if(audio_icon){
                let animation = audio_icon.getComponent(cc.Animation);
                if(cc.isValid(animation)){
                    animation.stop();
                    animation.setCurrentTime(0)
                }
            }
        }
    },

    update_message(data){

        if(this._data && this._data.uuid == data.uuid){
            this._data = data
            this.updateUI(data)
        }

    },

    //压出缓存池
    reuse(){
        if(!this._isFrist){
            MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_UPDATE, this.update_message, this);//早期消息插入
            // MsgManager.on(CHAT_MSG.NOTIFY.AUDIO_PLAY_START, this.audio_play_start, this);//语音播放开始
            // MsgManager.on(CHAT_MSG.NOTIFY.AUDIO_PLAY_END, this.audio_play_end, this);//语音播放结束
            this._isFrist = true
        }
    },


    //压入缓存池
    unuse(){
        if(this._isFrist){
            this._isFrist = false
            MsgManager.un(this.update_message,this);
            // MsgManager.un(this.audio_play_start,this);
            // MsgManager.un(this.audio_play_end,this);
        }
        this._data = null
        if(this.right_message){
            this.right_message.active = false
            //let name = this.right_message.getChildByName("name")
            let frame = this.right_message.getChildByName("frame")
            let unread_dot_audio = this.right_message.getChildByName("unread_dot_audio")
            let image_icon = this.right_message.getChildByName("image_icon")
            //if(name){name.active = false}
            if(frame){frame.active = false}
            if(unread_dot_audio){unread_dot_audio.active = false}
            if(image_icon){image_icon.active = false}
        }
        if(this.left_message){
            this.left_message.active = false
            //let name = this.left_message.getChildByName("name")
            let frame = this.left_message.getChildByName("frame")
            let unread_dot_audio = this.left_message.getChildByName("unread_dot_audio")
            let image_icon = this.left_message.getChildByName("image_icon")
            //if(name){name.active = false}
            if(frame){frame.active = false}
            if(unread_dot_audio){unread_dot_audio.active = false}
            if(image_icon){image_icon.active = false}
        }

        if(this.center_message){
            this.center_message.active = false
            let time = this.center_message.getChildByName("time")
            if(time){time.active = false}
        }
    },


    init(data,view){

        this.view = view;
        if(this._data && this._data.uuid == data.uuid){
            return
        }
        this._data = data
        this.isPlayAudio = false
        this.updateUI(data)
       
    },


    updateUI(data){
        cc.log("test  --- ==== update UI == ---- ", data)
        this.reset();
        if(data.type == MessageTypeEnum.TEXT){//文本消息

            let textStr = data.message.split('&avatar=')[0]
            if(textStr.indexOf("BTTPOKER") != -1){
                textStr = textStr.replace("BTTPOKER","");
            }
            textStr = base64.decode(textStr)
            let messageStr = ChatMessageMgr.getMessageText(textStr)
            if(messageStr.indexOf("@emoji") != -1){
                if(data.isMyMessage){//右边
                    this.loadRightEmojiMessage()
                }else{//左边
                    this.loadLeftEmojiMessage()
                }
            }else{
                if(data.isMyMessage){//右边
                    this.loadRightTextMessage()
                }else{//左边
                    this.loadLeftTextMessage()
                }
            }
            this._data.isRead = true
        }else if(data.type == MessageTypeEnum.TIME){//时间消息
            this.loadTimeMessage()
            this._data.isRead = true
        }else if(data.type == MessageTypeEnum.AUDIO){//语音消息

            if(data.isMyMessage){//右边
                this._data.isRead = true
                this.loadRightAudioMessage()
            }else{//左边
                this.loadLeftAudioMessage()
            }
        }else if(data.type == MessageTypeEnum.IMAGE){//图片
            if(data.isMyMessage){//右边
                this.loadRightImageMessage()
            }else{//左边
                this.loadLeftImageMessage()
            }
            this._data.isRead = true
        }
    },



    resetFrame(node){
        if(node){
            let message_text = node.getChildByName("message_text")
            if(message_text){
                message_text.active = false
            }
            let name = node.getChildByName("name")
            if(name){
                name.active = false
            }

            let emoji = node.getChildByName("emoji")
            if(emoji){
                for(let i= (emoji.children.length-1);i >= 0;i--){
                    let node = emoji.children[i]
                    if(this.view){
                        this.view.recycleEmojiObj(node)
                    }
                }
                emoji.active = false
            }
            
            let audio_text = node.getChildByName("audio_text")
            if(audio_text){
                audio_text.active = false
            }
            let audio_icon = node.getChildByName("audio_icon")
            if(audio_icon){
                let animation = audio_icon.getComponent(cc.Animation);
                if(cc.isValid(animation)){
                    animation.setCurrentTime(0)
                    animation.stop();
                }
                audio_icon.active = false
            }
        }  
    },
    resetLeftAndRight(node){
        //let name = node.getChildByName("name")
        let frame = node.getChildByName("frame")
        let unread_dot_audio = node.getChildByName("unread_dot_audio")
        let image_icon = node.getChildByName("image_icon")
        // if(name){
        //     name.active = false
        // }
        if(frame){
            this.resetFrame(frame);
            frame.active = false
        }
        if(unread_dot_audio){
            unread_dot_audio.active = false
        }
        if(image_icon){
            image_icon.active = false
            let name = image_icon.getChildByName("name")
            if(name){
                name.active = false
            }
        }
    },
    reset(){
        if(this.left_message){
            this.resetLeftAndRight(this.left_message);
            this.left_message.active = false
        }
        if(this.center_message){
            this.center_message.active = false
        }
        if(this.right_message){
            this.resetLeftAndRight(this.right_message);
            this.right_message.active = false
        }
    },

    initTextMessage(nameText,messageText,frame){
        if(this._data.isMyMessage){
            nameText.string = Utils.getShortText(this._data.name,24)
        }else{
            nameText.string = Utils.getShortText(this._data.name,24)
        }
       
        nameText._forceUpdateRenderData()

        let frame_text_width_offset = 30;
        let frame_width = frame.parent.width - 190
        let maxTextWidth = frame_width - frame_text_width_offset
        let messageNode = messageText.node
        messageNode.width = maxTextWidth
        messageNode.x = 0

        let btn = frame.getComponent(cc.Button)
        if(btn){
            btn.interactable = false
        }

        let textStr = this._data.message.split('&avatar=')[0]
        if(textStr.indexOf("BTTPOKER") != -1){
            textStr = textStr.replace("BTTPOKER","");
        }
        textStr = base64.decode(textStr)
        let messageStr = ChatMessageMgr.getMessageText(textStr)

        if(messageStr.indexOf("#@type") != -1){
            let messages = messageStr.split("#@type")
            messageStr = messages[0]
        }

        if(messageStr.indexOf("CHAT_BARRAGE_LIST.") != -1){
            let messageStrTmp = i18n.t(messageStr)
            if(messageStrTmp != messageStr){
                messageStr = messageStrTmp
            }
        }
        
        messageText.overflow = cc.Label.Overflow.RESIZE_HEIGHT
        messageText.string = messageStr
        let fontSize = messageText.fontSize
        let line_feed_size =  fontSize * 2
        messageText._forceUpdateRenderData()
        cc.log('test node === ===== ', this.node.width, this.node.height)
        if(messageNode.height < line_feed_size){//没有换行

            messageText.overflow = cc.Label.Overflow.NONE
            messageText.string = messageStr
            messageText._forceUpdateRenderData()

            frame.width = messageNode.width + frame_text_width_offset
            frame.height = 80
            frame.y = 40
            this.node.height = 140

        }else{//已经换行了
            frame.width = frame_width
            frame.height = messageNode.height + 30
            frame.y = (messageNode.height + 70) / 2 - 30
            this.node.height = messageNode.height + 70
        }

    },

    initAudioMessage(name,audio_icon,frame){

        let frame_width = 100
        let nameText =  name.getComponent(cc.Label)
        if(nameText){

            if(this._data.isMyMessage){
                nameText.string = Utils.getShortText(this._data.name,24)
            }else{
                nameText.string = Utils.getShortText(this._data.name,24)
            }
            nameText._forceUpdateRenderData()
            frame_width = frame.parent.width - 100
        }
    
        let offset_w = (frame_width - (frame_width/3) - 100)/60
        let width = 100;
        width = width +  Math.floor(this._data.duration/1000) * offset_w

        frame.width = width

        let btn = frame.getComponent(cc.Button)
        if(btn){
            btn.interactable = true
        }
        
        frame.height = 50
        frame.y = -10
        this.node.height = 100

        if(this._data.isMyMessage){//右边
            audio_icon.x = width/2 - audio_icon.width - 20
        }else{//左边
            audio_icon.x = -(width/2 - audio_icon.width - 20)
        }


    },
    
    //复制消息
    onClickCopyMessage() {
        let textStr = this._data.message.split('&avatar=')[0]
        if(textStr.indexOf("BTTPOKER") != -1){
            textStr = textStr.replace("BTTPOKER","");
        }
        textStr = base64.decode(textStr)
        let messageStr = ChatMessageMgr.getMessageText(textStr)
        
        this.view.copyMessageToEdit(messageStr)
    },

    loadRightTextMessage(){
        this.node.x = 0
        if(this.right_message){
            this.right_message.active = true
            let frame = this.right_message.getChildByName("frame")
            if(frame){
                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                }
                frame.active = true
                //设置头像
                let headNode = frame.getChildByName('head').getChildByName('img')
                cc.log('test 测试数据  ： ', this._data.message, this._data.message.split('&avatar='))
                let avatar = this._data.avatar ? this._data.avatar : this._data.message.split('&avatar=')[1]
                this.setHeadImage(headNode.getComponent(cc.Sprite), avatar ? avatar : '2')

                let message_text = frame.getChildByName("message_text")
                if(message_text){
                    message_text.active = true
                }
                this.initTextMessage(name.getComponent(cc.Label),message_text.getComponent(cc.Label),frame)
            }
        }
    },

    loadLeftTextMessage(){
        this.node.x = 0
        if(this.left_message){
            this.left_message.active = true
            
            let frame = this.left_message.getChildByName("frame")
            
            if(frame){
                frame.active = true

                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                }
                //设置头像
                let headNode = frame.getChildByName('head').getChildByName('img')
                cc.log('test 测试数据  ： ', this._data.message, this._data.message.split('&avatar='))
                let avatar = this._data.avatar ? this._data.avatar : this._data.message.split('&avatar=')[1]
                this.setHeadImage(headNode.getComponent(cc.Sprite), avatar ? avatar : '2')

                let message_text = frame.getChildByName("message_text")
                if(message_text){
                    message_text.active = true
                }
                this.initTextMessage(name.getComponent(cc.Label),message_text.getComponent(cc.Label),frame)
            }
        }
    },

    loadRightEmojiMessage(){
        this.node.x = 0
        if(this.right_message){
            this.right_message.active = true
            let frame = this.right_message.getChildByName("frame")
            if(frame){
                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                    name.getComponent(cc.Label).string = Utils.getShortText(this._data.name,24)
                    name.getComponent(cc.Label)._forceUpdateRenderData()
                }
                frame.active = true
                frame.width = 120
                frame.height = 100
                frame.y = -10
                this.node.height = 150
                

                let emoji = frame.getChildByName("emoji")
                if(emoji){
                    emoji.active = true;
                }
                let textStr = this._data.message
                if(textStr.indexOf("BTTPOKER") != -1){
                    textStr = textStr.replace("BTTPOKER","");
                }
                textStr = base64.decode(textStr)
                let messageStr = ChatMessageMgr.getMessageText(textStr)
                if(messageStr.indexOf("#@type") != -1){
                    let messages = messageStr.split("#@type")
                    messageStr = messages[0]
                }
                if(messageStr.indexOf("@emoji") != -1){
                    let id = Number(messageStr.replace("@emoji",""))
                    if(id >= 0 && id < 20){
                        if(emoji){

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
                }

            }
        }
    },

    loadLeftEmojiMessage(){
        this.node.x = 0
        if(this.left_message){
            this.left_message.active = true
            let frame = this.left_message.getChildByName("frame")
            if(frame){
                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                    name.getComponent(cc.Label).string = Utils.getShortText(this._data.name,24)
                    name.getComponent(cc.Label)._forceUpdateRenderData()
                }
                frame.active = true
                frame.width = 120
                frame.height = 100
                frame.y = -10
                this.node.height = 150

                let emoji = frame.getChildByName("emoji")
                if(emoji){
                    emoji.active = true;
                }
                let textStr = this._data.message
                if(textStr.indexOf("BTTPOKER") != -1){
                    textStr = textStr.replace("BTTPOKER","");
                }
                textStr = base64.decode(textStr)
                let messageStr = ChatMessageMgr.getMessageText(textStr)
                if(messageStr.indexOf("#@type") != -1){
                    let messages = messageStr.split("#@type")
                    messageStr = messages[0]
                }
                if(messageStr.indexOf("@emoji") != -1){
                    let id = Number(messageStr.replace("@emoji",""))
                    if(id >= 0 && id < 20){
                        if(emoji){
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
                }
            }
        }
    },

    loadRightAudioMessage(){
        this.node.x = 0
        if(this.right_message){
            this.right_message.active = true
           
            let frame = this.right_message.getChildByName("frame")
            let unread_dot_audio = this.right_message.getChildByName("unread_dot_audio")
            if(unread_dot_audio){
                if(this._data.isRead){
                    unread_dot_audio.active = false
                }else{
                    unread_dot_audio.active = true
                }
            }
            
            if(frame){
                frame.active = true

                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                }
                let audio_text = frame.getChildByName("audio_text")
                if(audio_text){
                    audio_text.active = true
                    audio_text.getComponent(cc.Label).string = Math.round(this._data.duration/1000) +'"';
                    audio_text.x = - 10
                }
                let audio_icon = frame.getChildByName("audio_icon")
                if(audio_icon){
                    audio_icon.active = true
                }
                this.initAudioMessage(name,audio_icon,frame);
            }
        }
    },
    loadLeftAudioMessage(){
        this.node.x = 0
        if(this.left_message){
            this.left_message.active = true
           
            let frame = this.left_message.getChildByName("frame")
            let unread_dot_audio = this.left_message.getChildByName("unread_dot_audio")
            if(unread_dot_audio){
                if(this._data.isRead){
                    unread_dot_audio.active = false
                }else{
                    unread_dot_audio.active = true
                }
            }
            
            if(frame){
                frame.active = true

                let name = frame.getChildByName("name")
                if(name){
                    name.active = true
                }

                let audio_text = frame.getChildByName("audio_text")
                if(audio_text){
                    audio_text.active = true
                    audio_text.getComponent(cc.Label).string =  Math.round(this._data.duration/1000)+'"';
                    audio_text.x = 10
                }
                let audio_icon = frame.getChildByName("audio_icon")
                if(audio_icon){
                    audio_icon.active = true
                }
                this.initAudioMessage(name,audio_icon,frame);
            }
        }
    },

    loadLeftImageMessage(){
        this.node.x = 0
        if(this.left_message){
            this.left_message.active = true
            let image_icon = this.left_message.getChildByName("image_icon")
            if(image_icon){
                image_icon.active = false
                let name = image_icon.getChildByName("name")
                if(name){
                    name.active = true
                    let nameText = name.getComponent(cc.Label)
                    if(nameText){
                        nameText.string =  Utils.getShortText(this._data.name,24)
                        nameText._forceUpdateRenderData()
                    }
                }
                let imageSprite = image_icon.getComponent(cc.Sprite)
                if(imageSprite){
                    if(this._data.path && this._data.path != ""){

                        let path = this._data.path
                        let ext = this._data.ext ? "."+this._data.ext:"";
                        path.replace("."+ext,"");
                        if(imageSprite.userPath != path){
                            cc.assetManager.loadRemote(path, {ext:ext},(err, texture)=>{
                                cc.log("load path err = "+err)
                                if(!err){

                                    if(this._data.type == MessageTypeEnum.IMAGE && path == this._data.path){//图片
                                        image_icon.active = true
                                        let spriteFrame = new cc.SpriteFrame(texture);
                                        let size = spriteFrame.getOriginalSize()
                                        let height = 200
                                        let scale = height/size.height
                                        let width = size.width * scale
                                        imageSprite.spriteFrame = spriteFrame;

                                        image_icon.setContentSize(width,height)
                                        image_icon.y = - 10
                                        imageSprite.userPath = path
                                    }
                                }
                            });


                        }else{
                            image_icon.active = true
                        }
                    }else{
                        imageSprite.spriteFrame = null
                        imageSprite.userPath = ""
                    }
                }
            }
            this.node.height = 200 + 50
        }
    },

    loadRightImageMessage(){
        this.node.x = 0
        if(this.right_message){
            this.right_message.active = true
           
            let image_icon = this.right_message.getChildByName("image_icon")
            

            if(image_icon){
                image_icon.active = false

                let name = image_icon.getChildByName("name")
                if(name){
                    name.active = true
                    let nameText = name.getComponent(cc.Label)
                    if(nameText){
                        nameText.string = Utils.getShortText(this._data.name,24)
                        nameText._forceUpdateRenderData()
                    }
                }
                let imageSprite = image_icon.getComponent(cc.Sprite)
                if(imageSprite){
                    if(this._data.path && this._data.path != ""){

                        let path = this._data.path
                        let ext = this._data.ext ? "."+this._data.ext:"";
                        path.replace("."+ext,"");
                        if(imageSprite.userPath != path){
                            cc.assetManager.loadRemote(path, {ext:ext},(err, texture)=>{
                                cc.log("load path err = "+err)
                                if(!err){

                                    if(this._data.type == MessageTypeEnum.IMAGE && path == this._data.path){//图片
                                        image_icon.active = true
                                        let spriteFrame = new cc.SpriteFrame(texture);
                                        let size = spriteFrame.getOriginalSize()
                                        let height = 200
                                        let scale = height/size.height
                                        let width = size.width * scale
                                        imageSprite.spriteFrame = spriteFrame;

                                        image_icon.setContentSize(width,height)
                                        image_icon.y = -10
                                        imageSprite.userPath = path
                                    }
                                }
                            });
                        }else{
                            image_icon.active = true
                        }
                    }else{
                        imageSprite.spriteFrame = null
                        imageSprite.userPath = ""
                        //image_icon.setContentSize(2,height)
                    }
                }
            }

            this.node.height = 200 + 50
        }
    },

    loadTimeMessage(){
        if(this.center_message){
            this.center_message.active = true
            let time = this.center_message.getChildByName("time")
            if(time){
                time.active = true
                time.getComponent(cc.Label).string = this._data.message
            }
        }
    },

    onClickAudio(){
        cc.log("点击播放语音 path = " + this._data.path)
        this.isPlayAudio = true


        if(this._data.path && this._data.path != ""){

            if(this._data.isRead){
                ChatMessageMgr.playAudio(this._data.path)
            }else{
                ChatMessageMgr.autoPlayAudio(this._data.path)
                //this._data.isRead = true
                //this.updateUI(this._data)
            }
        }

    },

    setHeadImage(target, headStr) {
        cc.log('test headImg: ', headStr)
        Utils.changeUserHead(target, headStr, app.ClubAssets);
    }


});
