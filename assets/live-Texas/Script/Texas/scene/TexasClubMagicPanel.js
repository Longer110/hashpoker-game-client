// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let TexasUtils = require("TexasUtils");

let texasMagicPanel = require("texasMagicPanel");
let TexasData = require("TexasData");
let ChatMessageMgr = require("ChatMessageMgr");
let CMD = require("protocol_texas");
let UIFrame = require("UIFrame");
let UIDialog = require("UIDialog");

const HEADCOLORLIST =  [ "#3A4652" , "#F41E41","#FF772B","#FAD553","#42D577","#22B1EA","#6B5EFF","#C44CEF" ]
cc.Class({
    extends: texasMagicPanel,

    properties: {
        panel: cc.Node,//节点

        spriteHead: cc.Sprite,//头像

        nScrollView1: cc.Node,//互动魔法表情



        nScrollView2: cc.Node,//自己发送聊天表情
        sName: cc.Label,//姓名
        sId: cc.Label,//id
        // sPersonalSign: cc.Label,//个性签名
        // nHePai: cc.Label,//和牌率
        nTanPaiRate: cc.Label,//摊牌率
        nAllHandCount: cc.Label,//总手数数目
        nShoujunyingli: cc.Label,//总手数数目
        sInPoolNum: cc.Label,//入池率数目
        sAddBetNum: cc.Label,//翻前加注率数目

        selfMagicItem: cc.Node,//自己发送聊天表情元素

        transferPrefab: {
            default: null,
            type: cc.Prefab
        },

        skeletonList: { //表情骨骼动画列表
            default: [],
            type: sp.SkeletonData
        },

        skeletonImgList: { //表情图片列表对应表情骨骼动画列表
            default: [],
            type: cc.SpriteFrame
        },
        _userInfo:null,
        

        skeletonList: { //表情骨骼动画列表
            default: [],
            type: sp.SkeletonData
        },

        magicSpriteFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
         _canClick: true,//1s重复点击判断

        _maskUserId:0,
        _maskUserText:"",
        _maskUserColorId:0,
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let HallClubCacheData = require("HallClubCacheData");
        if(HallClubCacheData && HallClubCacheData.getClubConfig()){ 
            let open = HallClubCacheData.getClubConfig();
            TexasData._setClubConfig(open);
        }else {
            this.getClubConfig();
        }
    },

    

    getSkeletonList(){
        return this.skeletonList;
    },

    // update (dt) {},

    //设置魔法表情面板
    setMagicPanel(targetID) {
        cc.log("设置魔法表情面板:",targetID, TexasData._getMagicGoldList());

        let info = UserInfo.getInfo();

        if (targetID) {
            this.scontent.destroyAllChildren(false);
            let magicList = TexasData._getMagicGoldList();
            for (let i = 0; i < magicList.length; i++) {
                const element = magicList[i];
                if(element.nCost < 0){ 
                    continue;
                }
                let facePrefab = cc.instantiate(this.itemFacePrefab);
                facePrefab.name = "Magic" + i
                this.scontent.addChild(facePrefab);           
                let magicFace = facePrefab.getComponent("texasMagicFaceItem");
                magicFace.createMagicFace(this,element,targetID);
            }

            if (TexasUtils._getSkin(["c"])) {
                this.scontent.active = info.nUserID!=targetID?true:false;
            }

        }



        this.initSelfMagicPanel(targetID);
       
    },


    initSelfMagicPanel(targetID){
        this.selfMagicItem.active = false;
        this.nScrollView2.getChildByName("view").getChildByName("content").destroyAllChildren(false);
        for (let i = 0; i < this.skeletonImgList.length ; i++) {
            let clone = cc.instantiate(this.selfMagicItem);
            clone.name = "biaoqing" + i
            this.nScrollView2.getChildByName("view").getChildByName("content").addChild(clone); 
            clone.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.skeletonImgList[i];
            clone.getChildByName("sprite").active = true;
            clone.getChildByName("spin").active = false;
            clone.active = true;

            clone.on(cc.Node.EventType.TOUCH_END, (event) => {
                this.onClickMagic(i ,targetID);
            }, this);
        }


    },

    onClickMagic(index, targetID){ 
        if (!this._canClick) {
            UIFrame.showTips("操作过于频繁，请稍后再试");
            return;
        }
        this._canClick = false;
        this.scheduleOnce(() => {
            this._canClick = true;
        }, 1);

        let data = {
            nChatId: index,//表情id
            nTarget: targetID,//聊天对象
            nType: 1,
        }
        TexasUtils._gameReqNotify("发送表情", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouChatReq_CMD, data);
    },





    _setMagic(data) {
        this._userInfo = data;
        let info = UserInfo.getInfo();
        let isSelf = data.nUserId == info.nUserID;
        this.nScrollView1.active = !isSelf;
        this.nScrollView2.active = isSelf;
        this.panel.getChildByName("info").getChildByName("soundsBtn").active = !isSelf;
        this.panel.getChildByName("info").getChildByName("transferBtn").active = !isSelf;
        this.panel.getChildByName("NoteEditBoxBg").active = !isSelf
        Utils.changeUserHead(this.spriteHead,data.sFaceId);//玩家头像
        // TexasUtils._setColor(this.spriteHead.node.getChildByName("box"), "#3A4652");//头像框颜色
        let editBox = this.panel.getChildByName("NoteEditBoxBg").getChildByName("NoteEditBox").getComponent(cc.EditBox)
        editBox.string = data.nMarkText.length > 0 ? data.nMarkText : ""

        this._maskUserText = editBox.string
        this._maskUserId = data.nUserId
        this._maskUserColorId = data.nMarkColorId 

        let colorList = this.panel.getChildByName("colorList")
        for (let index = 0; index < colorList.children.length; index++) {
            const item = colorList.children[index];
            item.getChildByName("select").active = (index+1) == data.nMarkColorId ? true : false
        }
        this._selectUserMaskColor =  data.nMarkColorId 
        let headBox = this.panel.getChildByName("info").getChildByName("box")
        let color = HEADCOLORLIST[data.nMarkColorId]
        TexasUtils._setColor(headBox,color);

        this.sName.string = Utils.getShortText(Base64.decode(data.sName), 12);//玩家名
        this.sId.string = "ID:" + data.nUserId;//id
        // this.sPersonalSign.string = data.sSigna==""?TexasUtils._getText(156):data.sSigna;//个性签名
        this.sInPoolNum.string = TexasUtils._saveTwoPoint(data.nInpoolRate) + "%";//入池率数目
        this.sAddBetNum.string = TexasUtils._saveTwoPoint(data.nBFlopRaiseRate) + "%";//翻前加注率数目
        this.nAllHandCount.string = TexasUtils._saveTwoPoint(data.nPlayCount);//总手数数目

        // this.nHePai.string = TexasUtils._saveTwoPoint(data.nAllInAndWinRate);//和牌率
        this.nTanPaiRate.string = TexasUtils._saveTwoPoint(data.nTanPaiRate) + "%";//摊牌率
        this.nShoujunyingli.string = TexasUtils._saveTwoPoint(data.nHandProfit || 0);//手均盈利
        // this.sAllInNum.string = TexasUtils._saveTwoPoint(data.nAllInAndWinRate) + "%";//AllIn胜率数目

        this.setPlayerVideoStatus()

        //设置转币按钮状态
        let isInTable = TexasData._getSelfIsInTable();
        if(!isInTable){
            this.panel.getChildByName("info").getChildByName("transferBtn").getComponent(cc.Button).interactable = false;
            this.panel.getChildByName("info").getChildByName("transferBtn").opacity = 120;
        }else{
            this.panel.getChildByName("info").getChildByName("transferBtn").getComponent(cc.Button).interactable = true;
            this.panel.getChildByName("info").getChildByName("transferBtn").opacity = 255;
        }
        
    },


    onClickBtnClose(event) {
        this._canClick = true
        this.node.active = false;
        this.hideColorView()
        if(event){ //手动点击关闭 请求
            this.magicFaceController.getComponent("TexasMagicFaceController").clubSMarkUserReq(this._maskUserId,this._maskUserText,this._maskUserColorId);
        }
    },


    onClickCopyBtn() {
        cc.log("复制ID", this.sId.string);
        Utils.copyToClipBoard(this.sId.string)
    },

    onClickUnAudioBtn() {
        if(!ChatMessageMgr.voiceMgr){
            UIFrame.showTips('请先坐下');
            return
        }
        let isOpen = ChatMessageMgr.getOtherPlayerVideo(this._userInfo.nUserId);
        ChatMessageMgr.setOtherPlayerVideo(this._userInfo.nUserId , !isOpen);
        this.setPlayerVideoStatus();
    },

    setPlayerVideoStatus(){
        let isOpen = ChatMessageMgr.getOtherPlayerVideo(this._userInfo.nUserId);
        this.panel.getChildByName("info").getChildByName("soundsBtn").getChildByName("unSounds").active = !isOpen;
    },

    onClickBtnTransfer() {
        let transferOpen = TexasData._getClubConfig();
        if(transferOpen && transferOpen.open === 0){
            UIFrame.showTips('暂未开启红包功能');
            return
        }

        // if(!this.checkEmailAndPayPassword()) {
        //     return
        // }
        let node = this.node.getChildByName("HallClubTransfer")
        if(!node){
            node = cc.instantiate(this.transferPrefab);
            this.node.addChild(node,0,"HallClubTransfer");
        }
        
        let component = node.getComponent("HallClubTransfer");
        if (component){
            let params = {
                nToUserId: this._userInfo.nUserId,
                sToName: Base64.decode(this._userInfo.sName),
                sToFaceId: this._userInfo.sFaceId,
                nClubId: 0,
                nMaxCount: TexasData._getBalance(),
                nMyUserId: UserInfo._info.nUserID,
            }
            component.init(params);
        }
    },

    showColorView(){
        
        this.panel.getChildByName("colorList").active = true
        let noteEditBox = this.panel.getChildByName("NoteEditBoxBg").getChildByName("NoteEditBox")
        noteEditBox.getChildByName("bbg1").active = true
        // noteEditBox.getChildByName("bbg").active = false
        noteEditBox.getChildByName("mask").active = false
    },


    hideColorView(){
        this.panel.getChildByName("colorList").active = false
        let noteEditBox = this.panel.getChildByName("NoteEditBoxBg").getChildByName("NoteEditBox")
        noteEditBox.getChildByName("bbg1").active = false
        // noteEditBox.getChildByName("bbg").active = true
        noteEditBox.getChildByName("mask").active = true
    },


    onClickColorBtn(event){
        if(Number(event.target.name)  ==  this._maskUserColorId - 1){
            return
        }
        let colorList = this.panel.getChildByName("colorList")
        let idx = 0
        for (let index = 0; index < colorList.children.length; index++) {
            const colorItem = colorList.children[index];
            if(Number(event.target.name) == index){
                colorItem.getChildByName("select").active = true
                idx = index + 1
            }else{
                colorItem.getChildByName("select").active = false
            }
        }
        this._maskUserColorId = idx
        let headBox = this.panel.getChildByName("info").getChildByName("box")
        let color = HEADCOLORLIST[idx]
        TexasUtils._setColor(headBox,color);
    },

        
    checkEmailAndPayPassword() {
        let info = UserInfo.getInfo()
        let state = true
        let type = 0
        if(!info.sMail && info.nOpenProtection != 1) {
            type = 3
            state = false
            
        }else if(!info.sMail) {
            type = 1
            state = false
            
        }else if(info.nOpenProtection != 1) {
            type = 2
            state = false
        }

        if(!state) {
            let path = "popup/transferTips/texasTransferTips";
            let parent = cc.director.getScene().getChildByName("Canvas").getChildByName("LayerView");
            app.texas.ui.loadPopup(path, function (component) {
                parent.addChild(component.node, 1024);
                component.setData(type);
            }.bind(this));
        }

        return state
    },


    //获取俱乐部配置
    getClubConfig(){
        let CMDclub = require("protocol_club");
        let params = {}

        app.net.send(CMDclub.GAME_CLUB.value, CMDclub.GAME_CLUB.ClubSGetClubConfigReq_CMD, params);
    },


    onClickEditBoxEnd(event){
        this._maskUserText = event.string
    }

});
