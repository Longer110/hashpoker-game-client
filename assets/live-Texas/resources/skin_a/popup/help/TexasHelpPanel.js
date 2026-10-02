let keyMatchArry = [
    {key:"playIntroduce", data:0},//玩法介绍
    {key:"pokerExplain", data:1},//牌型说明
    {key:"pokerSize", data:2},//牌型大小
    {key:"settle", data:3},//结算计分
    {key:"pairUpSize", data:4},//对牌大小
    {key:"pairUpExplain", data:5},//对牌说明
    {key:"onePokerSize", data:6},//单牌大小
    {key:"pokerCompare", data:7},//牌型比较
    {key:"calculateLost", data:8},//计算失分
    {key:"betWay", data:9},//下注方式
]

let UIBase = require("UIBase");
let LocalStorage = require("LocalStorage");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasBase = require("TexasBase");
let TexasUtils = require("TexasUtils");
const i18n = require('i18n'); 

let ImgUrl = "popup/help/";//图片路径前缀

cc.Class({
    extends: TexasBase,

    properties: {
        ncontent: cc.Node,

        nMenu: cc.Node,

        sRule: cc.Label,

        menuScrollView: cc.ScrollView, 
        scrollView: cc.ScrollView,
        scontent: cc.Node,

        listImgNode:{
            default: null,
            type: cc.Prefab
        },

        listMenuNode:{//菜单列表
            default: null,
            type: cc.Prefab
        },
        LanAtlas:{//中英文资源
            default:null,
            type:cc.SpriteAtlas,
        },
        unLanAtlas:{//背景资源
            default:null,
            type:cc.SpriteAtlas,
        },

        //自定义布局回调
        _layoutCallback: null,

        _isCanClickItem: true,
        _isNewSkin: false,
    },

    onLoad () {
        MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._isShowWindow, this);
    },

    onDestroy(){
        MsgManager.un(this._isShowWindow);
    },

    onStart() {

    },

    onEnable(){
        if(cc.isValid(this.scrollView)){
            App.setAppSlideable(false);
        }
    },
    onDisable(){
        if(cc.isValid(this.scrollView)){
            App.setAppSlideable(true);   
        }
    },

    setHelpMenu(num) {

    },
    reuse(args){
        this._super();
    },
    unuse(){
        this._super();

        this._layoutCallback = null;
    },

    _setHelpPanel() {
        if (!TexasUtils._getSkin(["c"])) return;

        if (this.sRule) {
            this.sRule.string = TexasUtils._getText(130);
        }

        this._setMenu(0);
    },

    _setMenu(menu) {
        let nGameId = app.game.getGame().getSubGameID();
        let gameName = i18n.t("HALL_CLUB_HELP_GAME_NAME." + nGameId);

        for (let i=0; i<=1; i++) {
            let btn = this.nMenu.getChildByName("btn" + i);

            let label = btn.getComponent(cc.Label);


            if (i==0) {//玩法规则
                label.string = gameName;
            }else {//保险规则
                label.string = TexasUtils._getText(163);
            }

            let color = menu==i?"#00FF86":"#E8DFD1";

            TexasUtils._setColor(label.node,color);
        }

        let arrow0 = this.nMenu.getChildByName("btn0").getChildByName("arrow");
        let arrow1 = this.nMenu.getChildByName("btn1").getChildByName("arrow");

        // let pos = menu == 0?arrow0:arrow1;
        arrow0.active = menu == 0
        arrow1.active = menu != 0
        // arrow.stopAllActions();
        // var arrowMove = cc.moveTo(0.3,pos.x,pos.y);
        // arrow.runAction(arrowMove);

        if (menu==0) {
            this._setImg(nGameId);
        }else {
            this._setImg("0", 'odds' + nGameId);
        }
    },

    _setImg(img, odds) {
        if (!this.scontent) return;

        this.scrollView.scrollToTop(0.1);
        let imgContainer = this.scontent; 

        for(var i in imgContainer.children){//隐藏所有列表菜单
            let imgContainerItem = imgContainer.children[i];

            imgContainerItem.active = false;
            if (img==imgContainerItem.name.toString()) {
                imgContainerItem.active = true;
            }
            if(odds == imgContainerItem.name.toString()){
                imgContainerItem.active = true;
            }
        }
    },

    //帮助数据
    setData(data) {
        if (TexasUtils._getSkin(["c"])) return;

        this.helpData = data;
        this._isCanClickItem = true;

        this._isNewSkin = true;
        
        this.initChat();
        this.initHelp(data,this.LanAtlas,this.unLanAtlas);

        if (!this._isNewSkin) {
            let cellContainer = this.menuScrollView.content; 

            for(var i in cellContainer.children){//隐藏所有列表菜单
                let cellContainerItem = cellContainer.children[i];
    
                let toggle = cellContainerItem.getComponent(cc.Toggle);
                if (toggle) {
                    cellContainerItem.active = false;
                }
            }
        }

        let curCellContainer = this.menuScrollView.content;
        for(var key in this.helpData){//显示对应列表菜单
            for(var i in curCellContainer.children){
                let cellContainerItem = curCellContainer.children[i];
    
                let toggle = cellContainerItem.getComponent(cc.Toggle);
                if (toggle) {
                    if (String(cellContainerItem.name)==String(key)) {
                        cellContainerItem.active = true;

                        break;
                    }
    
                }
            }
        }

        this.selectFirstMenu();
    },  

    //初始化帮助
    initHelp(data,zhAtlas,unZhAtlas) {
        if (data && zhAtlas && unZhAtlas) {
            let array = this.ncontent.getChildByName("bg").children;
            if (array && array.length>0) {
                this.itemName = "texas";
                // let nGameList = app.game.getGameList();
                // for (let i=0; i<nGameList.length; i++) {
                //     if (nGameList[i].nGameId==app.game.getGameID()) {
                //         this.itemName = nGameList[i].sGamePath;
        
                //         break;
                //     }
                // }
                // if (this.itemName=="brzhajinhua") {
                //     this.itemName = "zhajinhua";
                // }
                
                let menuContent = this.menuScrollView.content;
                menuContent.destroyAllChildren();
                this.menuScrollView.scrollToTop(0.1);
                let group = menuContent.getComponent(cc.ToggleContainer);
                for(var key in data){//构建菜单列表
                    let menuPrefab = cc.instantiate(this.listMenuNode);
                    menuPrefab.name = key;
                    let toggle = menuPrefab.getComponent(cc.Toggle);
                    if (toggle!=null) {
                        menuContent.addChild(menuPrefab);           
                        let menuItem = menuPrefab.getComponent("TexasHelpPanelMenuItem");
                        menuItem.createMenuItem(this,keyMatchArry,key,this.itemName,zhAtlas,unZhAtlas);
                    }
                }
                let meunChildCount = menuContent.children.length;
                if (meunChildCount<=1) {
                    this._isCanClickItem = false;
                }
            }
        }

    },

    //设置自定义布局回调
    setLayoutCallBack(callBack) {
        this._layoutCallback = callBack;
    },
    
    //选择第一个菜单
    selectFirstMenu() {
        let cellContainer = this.menuScrollView.content;
        for(var i in cellContainer.children){
            let toggle = cellContainer.children[i].getComponent(cc.Toggle);
            if (toggle && toggle.node.active) {
                toggle.isChecked = true;
                let data = this.getDataByName(toggle.node.name);
                if (data>=0) {
                    let event = "toggle" + i;
                    this.onClickToggle(event,data);
                    this.currentMenuToggle = toggle
                    break;
                }
            }
        }
    },

    getDataByName(name) {
        let data = null;

        if (name) {
            for (let i=0; i<keyMatchArry.length; i++) {
                let arryItem = keyMatchArry[i];

                if (arryItem.key==name) {
                    data = arryItem.data;
                        
                    break;
                }
            }
        }

        return data;
    },

    updataHelpList(data) {
        if (!data) return;

        let checkImg = this.checkIsUseImg(data);
        let viewList = this.scrollView;
        if (!checkImg.isUseImg) {//不使用图片
            if (viewList) {
                this.scrollView.getComponent("DynamicScrollView").enabled = true;
                let dys = viewList.getComponent("DynamicScrollView");
                dys.init(data);
            }
        }else {//使用图片
            if (this.scrollView) {
                this.scrollView.getComponent("DynamicScrollView").enabled = false;
            }

            let contentList = this._isNewSkin?viewList.content:this.scontent;

            let prefab = cc.instantiate(this.listImgNode);
            prefab.parent = contentList;
            let subSession = prefab.getComponent("TexasHelpPanelImgItem");
            subSession.init(checkImg.ImgUrl);
        }

    },

    //检测资源图片是否存在
    checkIsUseImg(data) {
        let checkIsImg = new Object();
        checkIsImg.isUseImg = false;

        for (let i=0; i<data.length; i++) {
            let dataItem = data[i];
            if (typeof dataItem == 'string') {//是否为字符串
                if (dataItem.indexOf(ImgUrl)!=-1) {//包含字符串
                    checkIsImg.isUseImg = true;
                    checkIsImg.ImgUrl = dataItem;
                }
                
            }
        }

        return checkIsImg;
    },
    
    //左侧按钮
    onClickToggle(event,data) {
        let num = Number(data);

        let viewList = this.scrollView;

        viewList.content.destroyAllChildren();
        viewList.scrollToTop(0.1);
        switch(num) {
            case 0:
                this.updataHelpList(this.helpData.playIntroduce);//玩法介绍
                break;
            case 1:
                this.updataHelpList(this.helpData.pokerExplain);//牌型说明
                break;
            case 2:
                this.updataHelpList(this.helpData.pokerSize);//牌型大小
                break;
            case 3:
                this.updataHelpList(this.helpData.settle);//结算
                break;
            case 4:
                this.updataHelpList(this.helpData.pairUpSize);//对牌大小
                break;
            case 5:
                this.updataHelpList(this.helpData.pairUpExplain);//对牌说明
                break;
            case 6:
                this.updataHelpList(this.helpData.onePokerSize);//单牌大小
                break;
            case 7:
                this.updataHelpList(this.helpData.pokerCompare);//牌型比较
                break;
            case 8:
                this.updataHelpList(this.helpData.calculateLost);//计算失分
                break;
            case 9:
                this.updataHelpList(this.helpData.betWay);//下注方式
                break;
            default:
                break;
        };
    },

    updateListView(node,data){
        let itemPrefab = node.getComponent("TexasHelpPanelItem");
        itemPrefab.setControl(this);
        itemPrefab.createHelpItem(data);
    },

    createNodeCallback(parent, data){
        if(this._layoutCallback){
            return this._layoutCallback(parent, data);
        }
        else{
            return new cc.Node();
        }
    },


    loadResByPath(node,path){

        if(!node){return}

        let wrapper = app.game.getGame();
        wrapper.bundle.load(path, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                 //console.error(error);
                return;
            }
            if(spriteFrame){
                let sprite = node.getComponent(cc.Sprite)
                if(sprite){
                    sprite.spriteFrame = spriteFrame
                }
            }
        })

    },

    //点击菜单
    onClickBtnMenu(event, data) {
        data = Number(data);

        this._setMenu(data);
    },

    //关闭弹窗
    onClickBtnClose() {
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

        // this.close();
        this.node.active = false;

        MsgManager.fire(MSG.NOTIFY.NOTIFY_SHOW_ROOM_CONFIG);
    },

    //是否显示弹窗
    _isShowWindow(data) {
        let nRlt = data.nRlt;
        if (nRlt==0) {
            // this.close();
            this.node.active = false;
        }
    },

});
