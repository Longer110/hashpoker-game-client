let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let HALL_CMD = require("protocol_hall");
let HALL_MSG = require("Msg_hall");
let Utils = require("Utils");
let Base64 = require("base64");


cc.Class({
    extends: cc.Component,

    properties: {
        headerNode: {
            default: null,
            type: cc.Node
        },
        selectMethod: {
            default: null,
            type: cc.Node
        },
        mainNode: {
            default: null,
            type: cc.Node
        },
        selectHostNetPrefab: {
            default: null,
            type: cc.Prefab
        },
        goldEdit: cc.EditBox,
        prefabPassword: cc.Prefab,
        maxGold: cc.Label,
        rates: cc.Label,
        minGold: cc.Label,
        prefabBill: cc.Prefab,
        bindEmail: cc.Prefab,
        payPassword: cc.Prefab,
        urlEidit: cc.EditBox,

        _maxGold: 0,
        _minGold: 0,
        _amount: 0,
        _fee: 0,
        _minWithdrawalAmount: 0,
        _gameRechargePrefab: null,
        _isLoadingRechargeView: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.selectIndex = 0;
        this.arrAddressList = [];
        let info = UserInfo.getInfo();
        if(info.nOpenProtection != 1) {
            UIFrame.showTips('您尚未设置支付密码，为保障资金安全，建议您尽快去设置！');
        }
        this.regiester(); 
        this.getWithdrawalInfo();
        Utils._fixNumericEditBox(this.goldEdit)
    },

    onDestroy() {
        MsgManager.un(this._onAccountWithdrawalRsp);
        MsgManager.un(this._onGetWithdrawalInfoRsp);
    },

    regiester(){
        MsgManager.on(HALL_MSG.AccountWithdrawalRsp_CMD, this._onAccountWithdrawalRsp, this);
        MsgManager.on(HALL_MSG.AccountWithdrawalViewRsp_CMD, this._onGetWithdrawalInfoRsp, this);
    },

    //获取提现信息
    getWithdrawalInfo() {
        let urlStr = this.urlEidit.string;
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(HALL_CMD.Main_CMD.value, HALL_CMD.Main_CMD.AccountWithdrawalViewReq_CMD, params);
    },

    //获取提现信息返回
    _onGetWithdrawalInfoRsp(msg) {
        // message OneWithdrawWViewInfo{
        // required string strMainNet = 1;      	//  主网类型
        // required int32  nRate = 2;      		//  手续费：客户端/100
        // required int32  nMinTopupMoney = 3;  	//  最小提现额
        // required string  strTime = 4;  			//  提现确认时间
        // }
        // repeated OneWithdrawWViewInfo arrWithdrawList = 1;  //   返回地址信息
        if (msg) {
            this.withDrawalInfo = msg || {};
            this.arrAddressList = this.withDrawalInfo.arrWithdrawList || [];
            this.setData()
        }
    },


    //提现返回
    _onAccountWithdrawalRsp(msg) {
        this._maxGold = UserInfo.getInfo().nGold
        this.maxGold.string = this._maxGold
        if (msg.nCode == 0) {
            // UIFrame.showTips("提现申请已提交，请等待审核："+ (msg.strRemark || ""));
            localStorage.setItem('withdrawalUrl', this.urlEidit.string);
            this.OnClickClose();
        }else {
            UIFrame.showTips("提现申请失败："+ (msg.strRemark || ""));
        }

    },

    // update (dt) {},
    setData() {
        if(this.arrAddressList && this.arrAddressList[this.selectIndex]) {
            let item = this.arrAddressList[this.selectIndex];

            this._maxGold = UserInfo.getInfo().nGold
            this._minGold = item.nMinTopupMoney/100 || 0
            this.rates.string = item.strRate +" USDT"
            this.maxGold.string = this._maxGold
            this.minGold.string = this._minGold
            this._fee = Number(item.strRate) || 0; //手续费
            this._minWithdrawalAmount = this._minGold + this._fee; //最低提现金额
            this.initView()
        }

    }, 
    initView(){
        // this.selectMethod.active = true
        this.headerNode.active = true
        this.mainNode.active = true
        this.urlEidit.string = localStorage.getItem('withdrawalUrl') || '';
        this.initHostNetUI();
        
    },
    initHostNetUI() {
        let contentNode = this.node.getChildByName("bg").getChildByName("mainView").getChildByName("view").getChildByName("content");
        let selectHostNet = contentNode.getChildByName("toggles").getChildByName("selectHostNet");
        let netNode = selectHostNet.getChildByName("name");
        let selectData = this.arrAddressList[this.selectIndex] || {}; 
        netNode.getComponent(cc.Label).string = selectData.strMainNet;
        let timeNode = contentNode.getChildByName("Time").getChildByName("value");
        timeNode.getComponent(cc.Label).string = selectData.strTime;
    },

    OnClickClose(){
        this.node.destroy();
    },

    OnClickLianShangTiBi(){
        this.selectMethod.active = false
        this.headerNode.active = true
        this.mainNode.active = true
    },

    //最大金额
    OnClickMaxGold() {
        this.goldEdit.string = this._maxGold
        this._amount = this._maxGold
    },

    onClickSureBtn(){
        // this.OnClickClose();
        if(!this._amount) {
            UIFrame.showTips('请输入提币金额！')
            return
        }
        if(this._amount < this._minWithdrawalAmount) {
            UIFrame.showTips(`单笔最低提现金额为${this._minWithdrawalAmount}，请重新输入！`)
            return
        }
        let urlStr = this.urlEidit.string;
        if(!urlStr || urlStr.trim() === '') {
            UIFrame.showTips('请输入提币地址！')
            return
        }

        //未设置支付密码，直接转币
        let info = UserInfo.getInfo();
        if(info.nOpenProtection != 1) {
            this.onInputPayPassword(null);
            return;
        }

        if(this.prefabPassword) {
            let obj = cc.instantiate(this.prefabPassword)
            this.node.addChild(obj)
            obj.getComponent('HallMyInputPayPassword').setData(this)
        }


        
    },


    OnEditingEnded(event, customEventData) {
        let num = event.string
        if(customEventData === "Amount") {
            if(num) {
                
                if(Number(num) <= this._minGold) {
                    this._amount = this._minGold
                    
                }else if(Number(num) <= this._maxGold) {
                    this._amount = Number(num)
                }else {
                    this._amount = this._maxGold
                }
                this._amount = this._amount.toFixed(1);
                this.goldEdit.string = this._amount
            }
        }else{
            this.urlEidit.string = num;
        }

    },

    //支付密码确定回调
    onInputPayPassword(password) {
        //TODO : 获取节点信息 发送提币请求，关闭页面
        this.goToWithdrawal(password)
    },

    goToWithdrawal(password) {
        let urlStr = this.urlEidit.string;

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            fAmount: this._amount ,
            strURL: urlStr,
            remark: "",
            strmainNet: this.arrAddressList[this.selectIndex] ? this.arrAddressList[this.selectIndex].strMainNet : "",
        }
        if(password) params.strPwd = Base64.encode(password);
        app.net.send(HALL_CMD.Main_CMD.value, HALL_CMD.Main_CMD.AccountWithdrawalReq_CMD, params);
    },

    //账单记录
    OnClickToRecord() {
        let prefab = this.prefabBill
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            node.getComponent('HallMyBill').init(null, 1)
        }
        // this.createGameRechargeView();
    },

    createGameRechargeView() {
        //加载GameRechargeView预制体，并创建GameRechargeView
        let addRechargeView = () => {
            let parent = this.getAddNode();
            if (!parent) {
                cc.warn("HallWithCash:createGameRechargeView 获取父节点失败");
                return;
            }
            let node = cc.instantiate(this._gameRechargePrefab);
            parent.addChild(node, 1024);
        };
        if (this._gameRechargePrefab) {
            addRechargeView();
            return;
        }
        if (this._isLoadingRechargeView) {
            return;
        }
        let wrapper = app.ClubViews;
        if (!wrapper || !wrapper.bundle) {
            cc.warn("HallWithCash:createGameRechargeView ClubViews bundle 未就绪");
            return;
        }
        this._isLoadingRechargeView = true;
        let path = "main-hall/Script/hall/view/game/GameRechargeView";
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            this._isLoadingRechargeView = false;
            if (error) {
                cc.error("HallWithCash:createGameRechargeView 加载预制体失败", error);
                return;
            }
            this._gameRechargePrefab = prefab;
            if (!cc.isValid(this.node)) {
                return;
            }
            addRechargeView();
        }.bind(this));
    },
    
    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
    },

    OnClickNeiBuZhuangBi(){
        UIFrame.showTips("暂未开启");
    },


    OnClickHostNet(){
        if (this.arrAddressList && this.arrAddressList.length > 0) {
            let hostNetNode = this.addUI(this.selectHostNetPrefab)
            let dataItem = {}
            let listData = []
            for (let index = 0; index < this.arrAddressList.length; index++) {
                let item = this.arrAddressList[index];
                dataItem.name = item.strMainNet || "";
                dataItem.count =  index;
                dataItem.minCoin =  item.nMinTopupMoney/100 || 1;
                dataItem.open =  true;
                dataItem.strContractAddres = item.strContractAddres || "";
                dataItem.nInputCompileTime = item.strRate;
                dataItem.nOutputCompileTime = item.nOutputCompileTime || 0;
                listData.push(dataItem);
                
            }

            // TODO ：请求数据。打开界面
            let component = hostNetNode.getComponent("selectHostNetPanel");
            if (component) {
                component.updateView({data:listData,selectIndex:this.selectIndex,title:"选择主网",selectType:2}, this.updateHotNetText.bind(this));
            }
        };
    },

    updateHotNetText(index){
        this.selectIndex = index;
        this.setData();
    },

    addUI(prefab){
        let node = cc.instantiate(prefab);
        this.node.addChild(node);
        return node;
    },
});
