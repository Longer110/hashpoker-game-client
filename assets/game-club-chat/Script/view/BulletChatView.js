// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');

let LocalStorage = require("LocalStorage")


let emoji_prefab_arry = [
    "bishi",
    "bizui",
    "feiwen",
    "haixiu",
    "huaixiao",
    "jingya",
    "kelian",
    "ku",
    "meitoujing",
    "aotu",
    "se",
    "shengqi",
    "tanqi",
    "taoqi",
    "touxiao",
    "weixiao",
    "weiqu",
    "xiaorong",
    "yun",
    "zhuai",
];


cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Node
        },
        row:2,
        
        emojiPrefabArrs: {
            default: [],
            type: cc.Prefab,
            tooltip: '表情资源列表',
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if(!this._bulletChats){
            this._bulletChats = new Map();
            for(let i=0;i<this.row;i++){
                if(!this._bulletChats.has(i)){//当前存在
                    let array = new Array()
                    this._bulletChats.set(i,array);
                }
            }
        }

        if(!this._isFrist){
            // MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_ADD, this.addBulletChat, this);//消息插入
            this._node_pool = new cc.NodePool();
            this.bullet_chat_datas = []
            this._isFrist = true
        }

    },

    //销毁场景
    onDestroy(){
        
        if(this._isFrist){
            this._isFrist = false
            MsgManager.un(this.addBulletChat,this);
            if(this._node_pool){
                this._node_pool.clear();
            }
        }
    },


    start () {

    },


    createItem(){
        if(this._node_pool){
            if(this._node_pool.size()==0){
                return cc.instantiate(this.item);
            }else{
                return this._node_pool.get();
            }
        }
        return null
    },



    addItem(datas){

        this._barrage_open = LocalStorage.getItem("bullet_chat_off",true)
        if(!this._barrage_open){
            if(this.bullet_chat_datas){
                this.bullet_chat_datas = []
            }
            return
        }
        
        
        let width = cc.winSize.width;
        let offsetH = 50
        for (let i = 0; i < datas.length; i++) {
            let message = datas[i]
            if(message.type == "text" || message.type == "audio"){//文本消息 或者 语音消息
                if(this.row > 0){
                    let currentRow = 0
                    let isRandom = true
                    if(this._bulletChats){
                        for(let i=0;i<this.row;i++){
                            let bullect_chats = this._bulletChats.get(i)
                            if(bullect_chats.length == 0){
                                currentRow = i
                                isRandom = false
                                break
                            }
                        }
                    }
                    if(isRandom){
                        //当前插入第一行
                        currentRow = Math.floor(Math.random() * this.row);
                    }
                    let bullet_chats = this._bulletChats.get(currentRow)
                    let startX = 0
                    let currentOffset = 100
                    let y = offsetH + this.item.height * currentRow +  this.item.height/2
                    if(bullet_chats.length <= 0){
                        startX = width/2
                    }else{
                        let item = bullet_chats[bullet_chats.length - 1]
                        let cuurentX = item.x + item.width
                        if(cuurentX > width/2){
                            startX = item.x + item.width + currentOffset
                        }else{
                            startX = width/2 + currentOffset
                        }
                    }
                    let bulletChatNode = this.createItem();
                    if(bulletChatNode){
                        bulletChatNode.parent = this.node
                        bulletChatNode.active = true
                        bulletChatNode.x = startX
                        bulletChatNode.y = -y
                        let BulletChatItem = bulletChatNode.getComponent("BulletChatItem")
                        if(BulletChatItem){
                            if(message.type == "text"){
                                BulletChatItem.initTextAndEmoji(message,this)
                            }else if(message.type == "audio"){
                                BulletChatItem.initAudio(message,this)
                            }
                        }
                        bullet_chats.push(bulletChatNode)
                    }
                }
            }
        }
    },

    addBulletChat(datas){


        this._barrage_open = LocalStorage.getItem("bullet_chat_off",true)
        if(!this._barrage_open){
            if(this.bullet_chat_datas){
                this.bullet_chat_datas = []
            }
            return
        }

        let num = 0
        for(let i=0;i<this.row;i++){
            let bullect_chats = this._bulletChats.get(i)
            num = num + bullect_chats.length
        }
        if(num <= 10){
            this.addItem(datas)
        }else{
            this.bullet_chat_datas.splice(this.bullet_chat_datas.length, 0, ...datas);
        }
    },

    update(dt){
        if(this._bulletChats){
            for(let i=0;i<this.row;i++){
                let bullect_chats = this._bulletChats.get(i)
                for(let k = 0;k< bullect_chats.length;k++){
                    let item = bullect_chats[k]
                    if(item){
                        let offset = item.x + item.width
                        if(offset < (-cc.winSize.width/2)){
                            bullect_chats.splice(k,1)
                            k = k - 1

                            if(this._node_pool){
                                this._node_pool.put(item)
                            }else{
                                item.destroy();
                            }
                            if(this.bullet_chat_datas.length > 0){
                                this.addItem(this.bullet_chat_datas.splice(0,1));
                            }
                        }else{
                            item.x = cc.misc.lerp(item.x,(item.x-350*dt),0.5);
                        }
                    }
                }
            }
        }
    },


    getEmojiAnimation(key){

        let emojiNode = null
        for(let i=0;i<this.emojiPrefabArrs.length;i++){
            //更新图标
            if(this.emojiPrefabArrs[i]!=null)
            {
                if(this.emojiPrefabArrs[i].name === key){
                    emojiNode = cc.instantiate(this.emojiPrefabArrs[i])
                    break
                }
            }
        }
        return emojiNode;
    },


    //生成物体
    spawnEmojiObj(id) {

        if(!this.allPools){
            //游戏用到的所有对象池Map
            this.allPools = new Map();
        }
        let name = emoji_prefab_arry[id]
        let node = null;
        let pools = this.allPools.get(name);
        if (!pools) {
            pools = new cc.NodePool();
            this.allPools.set(name, pools);
        }
        node = pools.get()
        if(!node){
            node = this.getEmojiAnimation(name)
        }

        if(node){
            node.active = true
        }
        return node;
    },

    //回收物体
    recycleEmojiObj(node) {
        if (node && cc.isValid(node)) {
            if(!this.allPools){
                //游戏用到的所有对象池Map
                this.allPools = new Map();
            }
            let pools = this.allPools.get(node.name);
            if (!pools) {
                pools = new cc.NodePool();
                this.allPools.set(node.name, pools);
            }
            pools.put(node);
        }
    },


    // update (dt) {},
});
