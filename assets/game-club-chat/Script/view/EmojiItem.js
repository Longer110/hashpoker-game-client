// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let ChatMessageMgr = require("ChatMessageMgr");

let LocalStorage = require("LocalStorage")

cc.Class({
    extends: cc.Component,

    properties: {
        emojiImgArrs: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '表情图片资源列表',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(data){
        this._data = data;

        for(let i=0;i<6;i++){
            let name = "emoji_"+i
            let emoji = this.node.getChildByName(name)
            if(emoji){
                if(this._data.length > i){
                    emoji.active = true
                    let img = emoji.getChildByName("img")
                    if(img){
                        this.loadImg(img,"emoji_img_"+this._data[i].id);
                    }
                }else{
                    emoji.active = false
                }
            }
        }
    },

    onClickEmoji(event,custom){

        let index = Number(custom)
        cc.log("onClickEmoji = "+index)

        if(this._data.length > index){
            let id = this._data[index].id
            cc.log("onClickEmoji id = "+id)
            let type = LocalStorage.getItem("barrage_type","barrage_type_1")
            ChatMessageMgr.sendMessage("@emoji"+id+"#@type"+type,type)
        }
    },

    loadImg(node,key){
        if(!cc.isValid(node)){
            return
        }
        for(let i=0;i<this.emojiImgArrs.length;i++){
            //更新图标
            if(this.emojiImgArrs[i]!=null)
            {
                if(this.emojiImgArrs[i].name === key){
                    let sprite = node.getComponent(cc.Sprite);
                    sprite.spriteFrame = this.emojiImgArrs[i];
                }
            }
        }
    },
});
