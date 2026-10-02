// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let DynamicListView = require("DynamicListBottomToTop");
let ChatMessageMgr = require("ChatMessageMgr");

let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');

let i18n = require("i18n");

let LocalStorage = require("LocalStorage")
let Base64 = require('base64');
let UserInfo = require("UserInfo");
let Utils = require("Utils");

LocalStorage.setItem("bullet_chat_off",true)


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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        btn_barrage:cc.Node,//发弹幕按钮
        btn_record:cc.Node,//聊天记录按钮
        btn_emoji:cc.Node,//表情按钮
       
        res_array: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '图片资源列表',
        },

        text_layer:cc.Node,//文本层
        btn_chat_audio:cc.Node,//语音按钮
        btn_barrage_off:cc.Node,//发弹幕开关按钮


        barrage_scrollview: {
            default: null,
            type: cc.ScrollView
        },
        barrage_mask: {
            default: null,
            type: cc.Node
        },
        barrage_content: {
            default: null,
            type: cc.Node
        },

        barrage_item: {
            default: null,
            type: cc.Node
        },

        emoji_scrollview: {
            default: null,
            type: cc.ScrollView
        },
        emoji_mask: {
            default: null,
            type: cc.Node
        },
        emoji_content: {
            default: null,
            type: cc.Node
        },
        emoji_item: {
            default: null,
            type: cc.Node
        },


        chatRecord_scrollview: {
            default: null,
            type: cc.ScrollView
        },
        chatRecord_mask: {
            default: null,
            type: cc.Node
        },
        chatRecord_content: {
            default: null,
            type: cc.Node
        },

        chatRecord_item: {
            default: null,
            type: cc.Node
        },
        btn_new_message: {
            default: null,
            type: cc.Node
        },

        input_editbox: {
            default: null,
            type: cc.EditBox
        },

        barrageType_default: {
            default: null,
            type: cc.Node
        },

        barrageTypes: {
            default: [],
            type: cc.Node,
            tooltip: '弹幕类型列表',
        },

        emojiPrefabArrs: {
            default: [],
            type: cc.Prefab,
            tooltip: '表情资源列表',
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._curretTimeStr = null
        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
            //window.addEventListener("resize", this._onResizedCallback, false);
        }
        else {
           // cc.view.on("canvas-resize", this._onResized, this);
        }

        this.initList();
        this._onResized();

    },

    start () {
        this.message_reset()
    },

    initBarrageTypes(){



        let datas = ChatMessageMgr.getCfgjson();

        if(this.barrageTypes){

            for(let i=0;i<this.barrageTypes.length;i++){
                let barrage_toggle = this.barrageTypes[i]
                if(barrage_toggle){
                    let layout = barrage_toggle.getChildByName("layout")
                    if(layout){
                        let barrage_gold = layout.getChildByName("barrage_gold")
                        let gold_img = layout.getChildByName("gold_img")

                        if(datas.length > i){
                            if(datas[i].nCost > 0){
                                if(barrage_gold){
                                    barrage_gold.active = true
                                    barrage_gold.getComponent(cc.Label).string = datas[i].nCost + ""
                                    
                                }
                                if(gold_img){
                                    gold_img.active = true
                                }
                            }else{
                                if(barrage_gold){

                                    barrage_gold.getComponent(cc.Label).string = ""
                                    barrage_gold.active = false
                                }
                                if(gold_img){
                                    gold_img.active = false
                                }
                            }
                        }else{
                            if(barrage_gold){
                                barrage_gold.getComponent(cc.Label).string = ""
                                barrage_gold.active = false
                            }
                            if(gold_img){
                                gold_img.active = false
                            }
                        }
                    }
                }
            }
        }

    },




    _onResized() {

        
        // this._barrage_open = LocalStorage.getItem("bullet_chat_off",false)
        // //弹幕开关
        // if(!this._barrage_open){
        //     this.btn_barrage_off.getChildByName("img").active = false

        // }else{
        //     this.btn_barrage_off.getChildByName("img").active = true
        // }

        if(this.barrageType_default){
            this.selectBarrageType(this.barrageType_default)
        }

        if(!this._isInit){
            MsgManager.on(CHAT_MSG.NOTIFY.OLD_MESSAGE_ADD, this.old_message_add, this);//早期消息插入
            MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_ADD, this.message_add, this);//消息插入
            MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_UPDATE, this.update_message, this);//早期消息插入
            MsgManager.on(CHAT_MSG.NOTIFY.MESSAGE_RESET, this.message_reset, this);//早期消息插入

            MsgManager.on(CHAT_MSG.NOTIFY.INIT_BARRAGE, this.initBarrageTypes, this);//早期消息插入
            this._isInit = true
        }

        this.initTextLayer()
        this.initBarrageTypes();
     
        if(this._barrageListView){

            if(this.barrage_scrollview){
                this.barrage_scrollview.node.getComponent(cc.Widget).updateAlignment();
            }

            //设置数据
            this._barrageListView.reset_size(this.barrage_scrollview.node.width,this.barrage_scrollview.node.height);
        }

        if(this._emojiListView){
            if(this.emoji_scrollview){
                this.emoji_scrollview.node.getComponent(cc.Widget).updateAlignment();
            }
            //设置数据
            this._emojiListView.reset_size(this.emoji_scrollview.node.width,this.emoji_scrollview.node.height);
        }
        
        if(this._chatRecordListView){

            if(this.chatRecord_scrollview){
                this.chatRecord_scrollview.node.getComponent(cc.Widget).updateAlignment();
            }
            //设置数据
            this._chatRecordListView.reset_size(this.chatRecord_scrollview.node.width,this.chatRecord_scrollview.node.height);
        }

        //数据刷新
        let barrageDatas = []
        // for(let i=0;i<6;i++){
        //     let langStr = "CHAT_BARRAGE_LIST."+i
        //     barrageDatas.push({
        //         text:i18n.t(langStr),
        //         langStr:langStr,
        //     })
        // }

        let emojiDatas = []
        // for(let i=0;i<20;i++){
        //     emojiDatas.push({
        //         id:i,
        //     })
        // }

        // this.setBarrageData(barrageDatas);
        this.setChatRecordData(ChatMessageMgr.getMessages());
        // this.setEmojiData(emojiDatas);
        this.onSelectRecordLayer();
        // if(this.isBarrageLayer == null){
        //     this.isBarrageLayer = true
        // }
        // if(this.isRecordLayer == null){
        //     this.isRecordLayer = false
        // }
        // if(this.isBarrageLayer){
        //     this.onSelectBarrageLayer();
        // }else if(this.isRecordLayer){
        //     this.onSelectRecordLayer();
        // }else{
        //     this.onSelectEmojiLayer();
        // }
        
    },


    loadImg(node,key){
        if(!cc.isValid(node)){
            return
        }
        for(let i=0;i<this.res_array.length;i++){
            //更新图标
            if(this.res_array[i]!=null)
            {
                if(this.res_array[i].name === key){
                    let sprite = node.getComponent(cc.Sprite);
                    sprite.spriteFrame = this.res_array[i];
                }
            }
        }

    },


    message_reset(data){
        this.setChatRecordData([]);
        ChatMessageMgr.clearMessage()

        if(ChatMessageMgr.isLogin()){
            let time = new Date().getTime();
            if(String(time).length < 13){
                time = time * 1000
            }
            ChatMessageMgr.getHistoryMessage(time,0,20,1);
        }
        this.scheduleOnce(function() {
             this.setChatRecordData(ChatMessageMgr.getMessages());
        }, 0);

    },

    old_message_add(data){
        cc.log('test --== 聊天室消息 ==--- old : ', data)
        this.addfirstRecordData(data);
    },

    message_add(data){
        cc.log('test --== 聊天室消息 ==-- new : ', data)
        this.appendRecordData(data)
    },

    update_message(data){

        // if(this._chatMessageList){
        //     for(let i = this._chatMessageList.length - 1;i >= 0;i--){
        //         let message = this._chatMessageList[i]
        //         if(message && message.uuid && data.uuid == message.uuid){
        //             message.message = data.message
        //             message.path = data.path
        //             message.ext = data.ext
        //             message.duration = data.duration
        //         }
        //     }
        // }

    },

    onEnable(){
        if(this._chatRecordListView) {
            // 确保在界面启用时下一帧滚动到底部，避免布局未完成时无效
            this.scheduleOnce(function() {
                if(this._chatRecordListView && this._chatRecordListView.scrollview){
                    this._chatRecordListView.scrollview.scrollToBottom(0);
                }
            }, 0);
        }
        //发弹幕栏按钮
        if(this.btn_barrage){
            this.btn_barrage.on(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_barrage.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }
        //历史记录栏按钮
        if(this.btn_record){
            this.btn_record.on(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_record.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }
        //表情栏按钮
        if(this.btn_emoji){
            this.btn_emoji.on(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_emoji.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }

        if(this.btn_chat_audio){
            this.btn_chat_audio.on(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_chat_audio.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }
    },
    onDisable(){

        //发弹幕栏按钮
        if(this.btn_barrage){
            this.btn_barrage.off(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_barrage.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }

        //历史记录栏按钮
        if(this.btn_record){
            this.btn_record.off(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_record.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }

        //表情栏按钮
        if(this.btn_emoji){
            this.btn_emoji.off(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_emoji.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }

        if(this.btn_chat_audio){
            this.btn_chat_audio.off(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_chat_audio.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
        }
    },

    onDestroy(){

        if (cc.sys.isMobile) {
            if(this._onResizedCallback){
               // window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
            //cc.view.off('canvas-resize', this._onResized);
        }

        ChatMessageMgr.clearMessage()
        
        if(ChatMessageMgr.isRecording()){
            ChatMessageMgr.recordingCanceling()
        }

        ChatMessageMgr.exitChat()

        if(this._barrageListView){
            this._barrageListView.destroy();
        }
        if(this._chatRecordListView){
            this._chatRecordListView.destroy();
        }


        if(this._isInit){
          
            MsgManager.un(this.old_message_add,this);
            MsgManager.un(this.message_add,this);
            MsgManager.un(this.update_message,this);
            MsgManager.un(this.message_reset,this);
     
            MsgManager.un(this.initBarrageTypes,this);
        }

    },



    //初始化滚动列表
    initList() {
        
        if(!this._barrageListView){
            //item模板预制件，key为字符串名称，node为预制件
            let templates = [
                { key: "item1", node: this.barrage_item },
            ];
            //调用构造函数，传入构造参数
            this._barrageListView = new DynamicListView({
                scrollview: this.barrage_scrollview,
                mask: this.barrage_mask,
                content: this.barrage_content,
                item_templates: templates,
                cb_host: this,
                //设置item的回调方法
                item_setter: this.item_setter_list_barrage,
                scroll_to_end_cb: this.scroll_to_end_cb_barrage,
                scroll_to_top_cb: this.on_scroll_to_top_cb_barrage,
                gap_y: 10,
                gap_x: 0,
                auto_scrolling: false, //插入数据时自动滚动到末尾
                //滚动方向，1为垂直，2为水平
                direction: 1,
            });
            this.barrage_item.active = false

            //this.barrage_scrollview.inertia = false;
        }

        if(!this._emojiListView){
            //item模板预制件，key为字符串名称，node为预制件
            let templates = [
                { key: "item1", node: this.emoji_item },
            ];
            this._emojiListView = new DynamicListView({
                scrollview: this.emoji_scrollview,
                mask: this.emoji_mask,
                content: this.emoji_content,
                item_templates: templates,
                cb_host: this,
                //设置item的回调方法
                item_setter: this.item_setter_list_emoji,
                gap_y: 10,
                gap_x: 0,
                auto_scrolling: true, //插入数据时自动滚动到末尾
                //滚动方向，1为垂直，2为水平
                direction: 1,
            });
            this.emoji_item.active = false

            //this.barrage_scrollview.inertia = false;
        }

        
        if(!this._chatRecordListView){
            //item模板预制件，key为字符串名称，node为预制件
            let templates = [
                { key: "item1", node: this.chatRecord_item },
            ];
            //调用构造函数，传入构造参数
            this._chatRecordListView = new DynamicListView({
                scrollview: this.chatRecord_scrollview,
                mask: this.chatRecord_mask,
                content: this.chatRecord_content,
                item_templates: templates,
                cb_host: this,
                //设置item的回调方法
                item_setter: this.item_setter_list_chatRecord,
                scroll_to_top_cb: this.on_scroll_to_top_chatRecord,
                scrolling_to_cb: this.on_scrolling_to_chat, //滚动回调
                gap_y: 10,
                gap_x: 0,
                auto_scrolling: true, //插入数据时自动滚动到末尾
                //滚动方向，1为垂直，2为水平
                direction: 1,
            });
            //开启惯性
            //this.chatRecord_scrollview.inertia = false;

            
            //this.chatRecord_item.active = false
        }

    },


    setBarrageData(dataArr) {

        if(!dataArr){
            return
        }
    
        let array = []
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            array.push(Data);
        }

        if(this._barrageListView){
            //设置数据
            this._barrageListView.set_data(array);

        }

    },



    item_setter_list_barrage(node, name, data, index) {
        if(cc.isValid(node)){
            node.x = 0
            let item = node.getComponent("BarrageItem");
            item.init(data);
        }
        return [node.width, node.height];
    },

    //滚动到末尾时的回调方法
    scroll_to_end_cb_barrage(dataArr) {
        cc.log("scroll_to_end_cb_barrage")
        return;
    },

    on_scroll_to_top_cb_barrage(dataArr){
        cc.log("on_scroll_to_top_cb_barrage")

    },


    setChatRecordData(dataArr) {

        if(!dataArr){
            return
        }

        let array = []
        if(this._curretTimeStr == null){
            this._curretTimeStr = ""
        }

        if(dataArr.length > 0){
            this.firstData = dataArr[0]
            this._isLast = false
        }else{
            this._isLast = true
        }

        //this._chatMessageList = dataArr
    
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let message = dataArr[i]
            // let timeStr = this.getDayByTime(message.time)
            // cc.log("timeStr = "+timeStr)
            // if(timeStr != this._curretTimeStr){
            //     this._curretTimeStr = timeStr;
            //     let timeData = {
            //         key: "item1",
            //         data: {
            //             message:this._curretTimeStr,
            //             type:"time",
            //             uuid:this._curretTimeStr,
            //         }
            //     }
            //     array.push(timeData);
            // }

            let Data = {
                key: "item1",
                data: message
            }
            array.push(Data);
        }
        if(this._chatRecordListView){
            //设置数据

            this._chatRecordListView.auto_scrolling = true
            this._chatRecordListView.set_data(array,array.length-1);

        }

        this._chat_new_message_num = 0
        if(this.btn_new_message && this.btn_new_message.active){
            this.btn_new_message.active = false
        }

    },


    addfirstRecordData(dataArr){
        if(!dataArr){
            return
        }



        // if(!this._chatMessageList){
        //     this._chatMessageList = dataArr
        // }else{
        //     this._chatMessageList.splice(0, 0, ...dataArr);
        // }
        

        let array = []

        if(this._curretTimeStr == null){
            this._curretTimeStr = ""
        }


        if(dataArr.length > 0){
            this.firstData = dataArr[0]
            this._isLast = false
        }else{
            this._isLast = true
        }
        
    
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let message = dataArr[i]
            // let timeStr = this.getDayByTime(message.time)
            // if(timeStr != this._curretTimeStr){
            //     this._curretTimeStr = timeStr;
            //     let timeData = {
            //         key: "item1",
            //         data: {
            //             message:this._curretTimeStr,
            //             type:"time",
            //             uuid:this._curretTimeStr,
            //         }
            //     }
            //     array.push(timeData);
            // }
            let Data = {
                key: "item1",
                data: message
            }
            array.push(Data);
        }
        if(this._chatRecordListView){
            //设置数据
            this._chatRecordListView.append_data(array);
        }
    },

    appendRecordData(dataArr){
        if(!dataArr){
            return
        }


        // if(!this._chatMessageList){
        //     this._chatMessageList = dataArr
        // }else{
        //     this._chatMessageList.splice(this._chatMessageList.length, 0, ...dataArr);
        // }


        if(!this.isBottomToChat()){
            if(this._chat_new_message_num == null){
                this._chat_new_message_num = 0
            }
            this._chat_new_message_num = this._chat_new_message_num + dataArr.length
        }else{
            this._chat_new_message_num = 0
        }

        this.update_new_message_ui()
        

        let array = []
        if(this._curretTimeStr == null){
            this._curretTimeStr = ""
        }
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let message = dataArr[i]
            // let timeStr = this.getDayByTime(message.time)
            // if(timeStr != this._curretTimeStr){
            //     this._curretTimeStr = timeStr;
            //     let timeData = {
            //         key: "item1",
            //         data: {
            //             message:this._curretTimeStr,
            //             type:"time",
            //             uuid:this._curretTimeStr,
            //         }
            //     }
            //     array.push(timeData);
            // }
            let Data = {
                key: "item1",
                data: message
            }
            array.push(Data);
        }
        if(this._chatRecordListView){
            //设置数据
            this._chatRecordListView.addfirst(array);
        }
    },

    getDayByTime(time){
        let _time = time
        if(String(time).length >= 13){
            _time = time
        }else{
            _time = time * 1000
        }

        let date = new Date(_time)
        let Y = date.getFullYear();
        let Mon = date.getMonth()+1;
        let Day = date.getDate();
        let H = date.getHours();
        let Min = date.getMinutes();
        let S = date.getSeconds();



        let nowDate =new Date()
        let nowY = nowDate.getFullYear();
        let nowMon = nowDate.getMonth()+1;
        let nowDay = nowDate.getDate();
        let nowH = nowDate.getHours();
        let nowMin = nowDate.getMinutes();
        let nowS = nowDate.getSeconds();

        let weekday = ["", "", "", "", "", "", ""];
        for(let i=0;i<7;i++){
            weekday[i] = i18n.t("CHAT.DAY_"+i)
        }
        let zuotian =  i18n.t("CHAT.YESTERDAY");
        let xingqi = weekday[date.getDay()]
        if(Y == nowY && Mon == nowMon && (nowDay - Day) < 7){
            
            if(H < 10){
                H = "0"+H
            }
            if(Min < 10){
                Min = "0"+Min
            }
            if(nowDay == Day){
                return `${H}:${Min}`;
            }else if((nowDay - Day) == 1){
                return `${zuotian} ${H}:${Min}`;
            }else{
                return `${xingqi} ${H}:${Min}`;
            }
        }else{

            if(Mon < 10){
                Mon = "0"+Mon
            }
            if(Day < 10){
                Day = "0"+Day
            }
            if(Y == nowY){
                return `${Mon}-${Day}`;
            }else{
                return `${Y}-${Mon}-${Day}`;
            }
        }
    },


    on_scrolling_to_chat(){
        this.update_new_message_ui()
    },



    update_new_message_ui(){
        if(!this.isBottomToChat() && this._chat_new_message_num && this._chat_new_message_num > 0){
            if(this.btn_new_message){
                if(!this.btn_new_message.active){
                    this.btn_new_message.active = true
                    if(this._chatRecordListView){
                        this._chatRecordListView.auto_scrolling = false
                    }
                }
                let new_message_tip = this.btn_new_message.getChildByName("new_message_tip")
                
                let txt = i18n.t("CHAT.CHAT_TIPS")
                if(new_message_tip){
                    new_message_tip.getComponent(cc.Label).string = txt.replace(/\[XX]/g,this._chat_new_message_num);
                }
            }
        }else{
            if(this.btn_new_message && this.btn_new_message.active){
                this.btn_new_message.active = false
                if(this._chatRecordListView){
                    this._chatRecordListView.auto_scrolling = true
                }
                this._chat_new_message_num = 0
            }
        }
    },

    isBottomToChat(){
        let offset = this.chatRecord_scrollview.getScrollOffset();
        let offsetMax = this.chatRecord_scrollview.getMaxScrollOffset();

        if(offset.y < (offsetMax.y - 200)){
            return false
        }
        return true

    },

    item_setter_list_chatRecord(node, name, data, index) {

        if(cc.isValid(node)){
            let item = node.getComponent("ChatMessageItem");
            item.init(data,this);
        }
        return [node.width, node.height];
    },


    //滚动到末尾时的回调方法
    on_scroll_to_top_chatRecord(dataArr) {
        
        cc.log("on_scroll_to_top_chatRecord")

        if(this.isBottomToChat()){
            return
        }

        if(this._isLast) return;
        if(this.firstData){
            ChatMessageMgr.getHistoryMessage(this.firstData.time,0,10,1)
        }

        return;
    },

    setEmojiData(dataArr) {

        if(!dataArr){
            return
        }

        let allData = [];
        let allSetData = []
        allSetData = this.splitArr(dataArr,6);
        //对数据进行包装
        for (let i = 0; i < allSetData.length; i++) {
            let newData = {
                key: "item1",
                data: allSetData[i]
            }
            allData.push(newData);
        }
        if(this._emojiListView){
            //设置数据
            this._emojiListView.set_data(allData);
        }
    },

    //将一个数组分割为多个数组   arr:要分割的原始数组  subArrLength：子数组长度
    splitArr(arr, subArrLength) {
        let index = 0;
        let newArr = [];
        while (index < arr.length) {
            newArr.push(arr.slice(index, index += subArrLength));
        }
        return newArr;
    },

    item_setter_list_emoji(node, name, data, index) {

        if(cc.isValid(node)){
            let item = node.getComponent("EmojiItem");
            item.init(data);
        }
        
        return [node.width, node.height];
    },


    ontTouchStartCallback(event){
        

        if(event && event.target && event.target.getComponent(cc.Button) &&
         !(event.target.getComponent(cc.Button).interactable)){
            return
        }
        if(event && event.target && event.target.name == "btn_barrage"){
            this.selectBarrage();
        }
        if(event && event.target && event.target.name == "btn_record"){
            this.selectRecord();
        }
        if(event && event.target && event.target.name == "btn_emoji"){
            this.selectEmoji();
        }

        if(event && event.target && event.target.name == "btn_chat_audio"){

            this.openAudio();
        }
    },

    ontTouchCancelCallback(event){

        if(event && event.target && event.target.getComponent(cc.Button) &&
        !(event.target.getComponent(cc.Button).interactable)){
           return
       }
        if(event && event.target && event.target.name == "btn_barrage"){
            this.unselectBarrage()
        }
        if(event && event.target && event.target.name == "btn_record"){
            this.unselectRecord()
        }
        if(event && event.target && event.target.name == "btn_emoji"){
            this.unselectEmoji();
        }

        if(event && event.target && event.target.name == "btn_chat_audio"){

            let startPos = event.getStartLocation()
            let currentPos = event.getLocation()

            if(currentPos.y > (startPos.y + 100)){
                this.cancelingAudio();
            }else{
                this.closeAudio();   
            }

            
        }
    },

    //复制消息到输入框
    copyMessageToEdit(message) {
        Utils.copyToClipBoard(message);
        this.input_editbox.string = message
    },

    onClickBarrage(event,custom){
        cc.log("onClickBarrage")
        this.onSelectBarrageLayer()
    },

    onClickRecord(event,custom){
        cc.log("onClickRecord")
        this.onSelectRecordLayer()
    },

    onClickEmoji(event,custom){
        cc.log("onClickEmoji")
        this.onSelectEmojiLayer()
    },

    onClickAudio(event,custom){
        this.closeAudio();
    },

    onClickSendChat() {
        if(this.input_editbox.string) {
            ChatMessageMgr.sendMessageForNim(this.input_editbox.string, '&avatar=' + UserInfo.getInfo().strHeadUrl)
            this.input_editbox.string = ''
        }
    },

    onClickBarrageOff(event,custom){
       
        // if(this._barrage_open){
        //     this._barrage_open = false

        //     this.btn_barrage_off.getChildByName("img").active = false
        //     LocalStorage.setItem("bullet_chat_off",false)
        // }else{
        //     this._barrage_open = true
        //     this.btn_barrage_off.getChildByName("img").active = true
        //     LocalStorage.setItem("bullet_chat_off",true)
        // }
    },


    openAudio(){
        cc.log("开始录音")
        ChatMessageMgr.startRecorder(1)
    },
    closeAudio(){
        cc.log("结束录音")
        ChatMessageMgr.recordingComplete()
    },

    cancelingAudio(){
        cc.log("取消录音")
        ChatMessageMgr.recordingCanceling()
    },



    onClickEditingDidBegan(editBox,custom){
        cc.log("onClickEditingDidBegan")
        // let TEXT_LABEL_CUSTOM = editBox.node.getChildByName("TEXT_LABEL_CUSTOM")
        // if(TEXT_LABEL_CUSTOM){
        //     TEXT_LABEL_CUSTOM.active =true
        //     TEXT_LABEL_CUSTOM.getComponent(cc.Label).string =  editBox.string.length + "/" + editBox.maxLength
        // }
    },

    onClickEditingTextChanged(text,editBox,custom){
        cc.log("onClickEditingTextChanged")
        // let TEXT_LABEL_CUSTOM = editBox.node.getChildByName("TEXT_LABEL_CUSTOM")
        // if(TEXT_LABEL_CUSTOM){
        //     TEXT_LABEL_CUSTOM.active =true
        //     TEXT_LABEL_CUSTOM.getComponent(cc.Label).string =  editBox.string.length + "/" + editBox.maxLength
        // }
    },

    onClickEditingDidEnded(editBox,custom){
        cc.log("onClickEditingDidEnded string= "+editBox.string)

        // if(editBox.string != ""){
        //     let type = LocalStorage.getItem("barrage_type","barrage_type_1")
        //     ChatMessageMgr.sendMessage(editBox.string + "#@type"+type,type)
        //     editBox.string = ""
        // }

        // let TEXT_LABEL_CUSTOM = editBox.node.getChildByName("TEXT_LABEL_CUSTOM")
        // if(TEXT_LABEL_CUSTOM){
        //     TEXT_LABEL_CUSTOM.active =true
        //     TEXT_LABEL_CUSTOM.getComponent(cc.Label).string =  editBox.string.length + "/" + editBox.maxLength
        // }
    },



    selectBarrageType(node){
        if(this._barrageType){
            let layout = this._barrageType.getChildByName("layout")
            if(layout){
                let barrage_info = layout.getChildByName("barrage_info")
                if(barrage_info){
                    barrage_info.color = cc.Color.BLACK.fromHEX("#D1D0D5")
                }
            }
        }
        this._barrageType = node
        if(node){
            let layout = node.getChildByName("layout")
            if(layout){
                let barrage_info = layout.getChildByName("barrage_info")
                if(barrage_info){
                    barrage_info.color = cc.Color.BLACK.fromHEX("#E3C7A2")
                }
            }

            let type = "barrage_type_1"
            if(node.name == "barrage_toggle_1"){
                type = "barrage_type_1"
            }else if(node.name == "barrage_toggle_2"){
                type = "barrage_type_2"
            }else if(node.name == "barrage_toggle_3"){
                type = "barrage_type_3"
            }
            LocalStorage.setItem("barrage_type",type)
        }
    },

    selectBarrage(){

        let barrage_text = this.btn_barrage ? this.btn_barrage.getChildByName("barrage_text"):null;
        if(barrage_text){
            barrage_text.color = cc.Color.BLACK.fromHEX("#E3C7A2")
        }
    },

    unselectBarrage(){
       
        let barrage_text = this.btn_barrage ? this.btn_barrage.getChildByName("barrage_text"):null;
        if(barrage_text){
            barrage_text.color = cc.Color.BLACK.fromHEX("#C5C4C9")
        }
    },

    selectRecord(){
        let record_text = this.btn_record ? this.btn_record.getChildByName("record_text"):null;
        if(record_text){
            record_text.color = cc.Color.BLACK.fromHEX("#E3C7A2")
        }
    },

    unselectRecord(){
        let record_text = this.btn_record ? this.btn_record.getChildByName("record_text"):null;
        if(record_text){
            record_text.color = cc.Color.BLACK.fromHEX("#C5C4C9")
        }
    },

    selectEmoji(){
        let emoji_text = this.btn_emoji ? this.btn_emoji.getChildByName("emoji_text"):null;
        if(emoji_text){
            emoji_text.color = cc.Color.BLACK.fromHEX("#E3C7A2")
        }
    },

    unselectEmoji(){
        let emoji_text = this.btn_emoji ? this.btn_emoji.getChildByName("emoji_text"):null;
        if(emoji_text){
            emoji_text.color = cc.Color.BLACK.fromHEX("#C5C4C9")
        }
    },
    

    onSelectBarrageLayer(){

        this.isBarrageLayer = true
        this.isRecordLayer = false
        if(this.btn_barrage){
            this.btn_barrage.getComponent(cc.Button).interactable = false
        }
        if(this.btn_record){
            this.btn_record.getComponent(cc.Button).interactable = true
        }
        if(this.btn_emoji){
            this.btn_emoji.getComponent(cc.Button).interactable = true
        }
        this.unselectRecord()
        this.unselectEmoji()
        this.selectBarrage();

        if(this.barrage_scrollview){
            this.barrage_scrollview.node.active = true
        }
        if(this.chatRecord_scrollview){
            this.chatRecord_scrollview.node.active = false
        }
        if(this.emoji_scrollview){
            this.emoji_scrollview.node.active = false
        }
     
    },

    onSelectRecordLayer(){


        this.isBarrageLayer = false
        this.isRecordLayer = true
        if(this.btn_barrage){
            this.btn_barrage.getComponent(cc.Button).interactable = true
        }
        if(this.btn_record){
            this.btn_record.getComponent(cc.Button).interactable = false
        }
        if(this.btn_emoji){
            this.btn_emoji.getComponent(cc.Button).interactable = true
        }

        this.unselectBarrage()
        this.unselectEmoji()
        this.selectRecord();

        if(this.barrage_scrollview){
            this.barrage_scrollview.node.active = false
        }

        if(this.chatRecord_scrollview){
            this.chatRecord_scrollview.node.active = true
        }
        if(this.emoji_scrollview){
            this.emoji_scrollview.node.active = false
        }

    },


    onSelectEmojiLayer(){

        this.isBarrageLayer = false
        this.isRecordLayer = false

        if(this.btn_barrage){
            this.btn_barrage.getComponent(cc.Button).interactable = true
        }
        if(this.btn_record){
            this.btn_record.getComponent(cc.Button).interactable = true
        }
        if(this.btn_emoji){
            this.btn_emoji.getComponent(cc.Button).interactable = false
        }

        this.unselectBarrage()
        this.unselectRecord()
        this.selectEmoji();

        if(this.barrage_scrollview){
            this.barrage_scrollview.node.active = false
        }
        if(this.chatRecord_scrollview){
            this.chatRecord_scrollview.node.active = false
        }
        if(this.emoji_scrollview){
            this.emoji_scrollview.node.active = true
        }

    },


    initTextLayer(){
      
        //文本初始化、按钮位置调整等
        if(this.btn_barrage){
            this.btn_barrage.active = true
            let barrage_text = this.btn_barrage.getChildByName("barrage_text")
            if(barrage_text){
                barrage_text.getComponent(cc.Label).lang = "CHAT.BARRAGE_TEXT";
                barrage_text.active = true
            }
        }

        if(this.btn_record){
            this.btn_record.active = true
            let record_text = this.btn_record.getChildByName("record_text")
            if(record_text){
                record_text.getComponent(cc.Label).lang = "CHAT.RECORD_TEXT";
                record_text.active = true
            }
        }

        if(this.btn_emoji){
            this.btn_emoji.active = true
            let emoji_text = this.btn_emoji.getChildByName("emoji_text")
            if(emoji_text){
                emoji_text.getComponent(cc.Label).lang = "CHAT.EMOTE_TEXT";
                emoji_text.active = true
            }
        }

        if(this.input_editbox){
            this.input_editbox.placeholder = i18n.t("CHAT.IN_PUT_TEXT")
            this.input_editbox.maxLength = 250
            // let TEXT_LABEL_CUSTOM = this.input_editbox.node.getChildByName("TEXT_LABEL_CUSTOM")
            // if(TEXT_LABEL_CUSTOM){
            //     TEXT_LABEL_CUSTOM.getComponent(cc.Label).string = "0"+"/"+this.input_editbox.maxLength
            // }
            
        }
    },


    onClickImage(event,custom){
        cc.log("图片")
        ChatMessageMgr.sendImageMessage(1)
    },

    onClickBarrageType(event,custom){
        cc.log("弹幕类型")
        //ChatMessageMgr.sendImageMessage(1)
        this.selectBarrageType(event.node)
    },

    onClickJumpToNewChatMessage(event,custom){
        cc.log("跳转聊天最新消息")

        if(this._chatRecordListView){
            this._chat_new_message_num = 0
            if(this.btn_new_message && this.btn_new_message.active){
                this.btn_new_message.active = false
                if(this._chatRecordListView){
                    this._chatRecordListView.auto_scrolling = true
                }
            }
            this._chatRecordListView.scroll_to_end();
            this._chatRecordListView.on_scrolling();
        }
    },


    show(){
        this.node.active = true
    },
    hide(){
        this.node.active = false
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

});
