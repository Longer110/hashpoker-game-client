// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");
let CMD = require("protocol_texas");
let MSG = require("Msg_Texas");
let Utils = require("Utils");
let Base64 = require("base64");
let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo")
let MsgManager = require("MsgManager");

cc.Class({
    extends: cc.Component,

    properties: {
        panel1: cc.Node,
        panel2: cc.Node,

        nInfo1: cc.Node,
        nInfo2: cc.Node,
        nInfo3: cc.Node,
        nInfo4: cc.Node,

        poolNodes: {
            default: [],
            type: cc.Node,
        },

        arrow: cc.Sprite,

        sureBtn: cc.Node,
        sureBtnGrey: cc.Node,

        cancelBtn: cc.Node,
        cancelBtnGrey: cc.Node,

        sTitle: cc.Label,//低水保险
        sTime: cc.Label,//时间
        sCommonCards: cc.Label,//公共牌
        sOtherCards: cc.Label,//其他手牌
        sOuts: cc.RichText,//outs
        sCards: cc.RichText,//剩余牌
        sOdds: cc.RichText,//赔率
        sCanPut: cc.Label,//可投保池
        sPool: cc.Label,//底池
        sPut: cc.Label,//投入
        sBao: cc.Label,//baofei
        sPei: cc.Label,//赔付
        sSureBao: cc.Label,//确定保单
        sSelect: cc.Label,//选择投保方案
        sUnBuy: cc.Label,//不买
        sBuy: cc.Label,//购买

        arrowSpriteFrame: {//箭头
            default: [],
            type: cc.SpriteFrame
        },

        poolSpriteFrame: {//奖池
            default: [],
            type: cc.SpriteFrame
        },

        itemInfoPrefab:{
            default: null,
            type: cc.Prefab
        },
        
        pokerBack: cc.SpriteFrame,//卡背
        poolNode: cc.Node,

        sTime2: cc.Label,
        breakBuy: cc.Node, //保本btn节点
        allBtn: cc.Node, //满池btn节点

        btnRight: cc.Node, //向右
        btnLeft: cc.Node, //向左

        poolCount: cc.Node, //总投保金额
        sAddTime1: cc.Node,//增加考虑时间
        sAddTime2: cc.Node,//增加考虑时间按钮

        _buyPool: -1,//购买的池
        _nOdds: 1,//赔率
        _arrOdds: [],//赔率表
        _arrInsurancePlan: [],//投保方案
        _tPool: null,//可投保池,底池,投入
        _insureMode: 1,//1:传统保险 2:低水保险

        _isMustBuy: false,//是否必须购买保险(true时，保险玩家必须购买所有outs保险)
        
        _downMenu: false,//下拉
        _poolIndex: 5,
        _downPosY: null,
        _startPosY: null,
        _maxPoolIndex: 0,
        _data: null,
        _panelIndex: 0,
        _insureIndex: 0,
        _selectInsure: null,
        _curInsureData: null,
        _planQuickBuy: null, //快捷购买数据
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._selectInsure = {}
        this._curInsureData = {}
        this._planQuickBuy = {}
        this._maxPoolIndex = 0
        this._poolIndex = 0
        let layout = this.nInfo4.getChildByName("layout");
        this.poolPosArr = []
        if(layout) {
            for (let i = 1; i <= 5; i++) {
                let pos = layout.getChildByName('insure' + i).getPosition();
                this.poolPosArr.push(pos)
            }
        }
        if(this.poolNode) {
            this.poolNode.parent.on(cc.Node.EventType.TOUCH_START,this.ontTouchStart,this);
            this.poolNode.parent.on(cc.Node.EventType.TOUCH_END,this.ontToucheEnd,this);
            this.poolNode.parent.on(cc.Node.EventType.TOUCH_MOVE,this.ontTouchMove,this);
            // this.poolNode.on(cc.Node.EventType.TOUCH_START,this.ontTouchStart,this);
            // this.poolNode.on(cc.Node.EventType.TOUCH_END,this.ontToucheEnd,this);
            // this.poolNode.on(cc.Node.EventType.TOUCH_MOVE,this.ontTouchMove,this);
        }
        this.tweenAni()
        // MsgManager.on(MSG.ClubTexas.DelayRsp_CMD, this._onRepDelayed, this);//延时回复
    },


    tweenAni() {
        let iconLeft = this.btnLeft.getChildByName("icon");
        let iconRight = this.btnRight.getChildByName("icon");

        cc.Tween.stopAllByTarget(iconLeft);
        cc.Tween.stopAllByTarget(iconRight);

        const breathTween = (movePos) => {
            return cc.tween()
                .to(0.5, { x: movePos }, { easing: 'sineOut' })
                .to(0.5, { x: 0 }, { easing: 'sineIn' });
        };

        // 左 icon 播放无限循环动画
        cc.tween(iconLeft)
            .repeatForever(breathTween(-15).clone())
            .start();

        // 右 icon 播放相同动画（反方向，保持对称）
        cc.tween(iconRight)
            .repeatForever(breathTween(15).clone())
            .start();
    },


    start () {
        // this.sTitle.string = TexasUtils._getText(131);//低水保险
        this.sCommonCards.string = TexasUtils._getText(133);//公共牌
        this.sSelect.string = TexasUtils._getText(143);//选择投保方案
        this.sUnBuy.string = TexasUtils._getText(147);//不买
        this.sBuy.string = TexasUtils._getText(148);//购买
        this.showAddTime(true);
    },

    // update (dt) {},

    onDestroy() {
        // MsgManager.un(this._onRepDelayed);//延时回复
    },

    _setInsure(data) {
        this._data = data
        this._selectInsure = {}
        if(this._data.arrInsurPanelData && this._data.arrInsurPanelData.length > 1) {
            this._insureIndex = 0
            this._panelIndex = 0
            this.setShowPanel(0)
            this._setPanelView()
        }else if(this._data.arrInsurPanelData && this._data.arrInsurPanelData.length > 0){
            this._panelIndex = 0
            this._insureIndex = -1
            this.setShowPanel(1)
            let insure = this._data.arrInsurPanelData[0]
            this._setInsureDetail(insure)
        }
        this._setTimeSchedule(data.nSeconds);
    },

    _setPanelView() {
        if(this._data.arrInsurPanelData.length < 3) {
            this.poolNodes[2].active = false
        }else {
            this.poolNodes[2].active = true
        }
        let gold = TexasData._getBalance()
        
        for (let index = 0; index < this._data.arrInsurPanelData.length; index++) {
            const element = this._data.arrInsurPanelData[index];
            let plan = element.arrInsurancePlan
            const item = this.poolNodes[index]
            
            if(plan[plan.length - 1].nCosts > gold) {

                cc.log('test 触发不足购买 分池  , ', this._data.arrInsurPanelData.length)
                //只有一个分池能买，直接分池详情
                if(this._data.arrInsurPanelData.length < 3) {
                    this._panelIndex = 0
                    this._insureIndex = -1
                    this.setShowPanel(1)
                    let insure = index == 0 ? this._data.arrInsurPanelData[1]: this._data.arrInsurPanelData[0]
                    this._setInsureDetail(insure)
                    return
                }

                item.getComponent(cc.Button).enadled = false
                item.getChildByName('info').opacity = 50
                item.getChildByName('info').getChildByName('btnTips').active = false
                item.getChildByName('tb_009').active = true
            }
            
            item.getChildByName('info').getChildByName('poolId').getComponent(cc.Label).string = element.tPool.nPoolId
            item.getChildByName('info').getChildByName('poolNum').getComponent(cc.Label).string = element.tPool.nPool
            item.getChildByName('info').getChildByName('paishuNum').getComponent(cc.Label).string = element.tRemaining.arrOuts.length
            item.getChildByName('info').getChildByName('piefuNum').getComponent(cc.Label).string = element.tRemaining.nOdds
            
        }
        this._planQuickBuy = this.getAllPoolConsts(this._data.arrInsurPanelData, gold)
        cc.log('test 保险金额数据 ：',this._planQuickBuy, gold, UserInfo.getInfo().nGold)
        if(this._planQuickBuy) {
            this.breakBuy.getChildByName("num").getComponent(cc.Label).string = this.getNumberOneDecimal(this._planQuickBuy.countBreak)
            this.allBtn.getChildByName("num").getComponent(cc.Label).string = this.getNumberOneDecimal(this._planQuickBuy.countAll)
            this.breakBuy.getChildByName("text").getComponent(cc.Label).string = this.getInsurePlanText(this._planQuickBuy.idBreak)
            this.allBtn.getChildByName("text").getComponent(cc.Label).string = this.getInsurePlanText(this._planQuickBuy.idAll)
            if(this._planQuickBuy.isNotBuyBreak) {
                this.allBtn.getChildByName('bg').color = new cc.Color(126, 126, 126)
                this.breakBuy.getChildByName('bg').color = new cc.Color(126, 126, 126)
                this.allBtn.getComponent(cc.Button).enadled = true
                this.breakBuy.getComponent(cc.Button).enadled = true
            }else if(this._planQuickBuy.isNotBuyAll) {
                this.allBtn.getChildByName('bg').color = new cc.Color(126, 126, 126)
                this.allBtn.getComponent(cc.Button).enadled = true
            }
            
        }
        
        //设置自己的手牌
        let card1 = this.panel1.getChildByName("card1")
        let card2 = this.panel1.getChildByName("card2")
        this._setPanelUserCard(card1, card2, this._data.arrRelevantUser)
    },

    //设置保险界面详情
    _setInsureDetail(data) {
        if (!data) return;
        cc.log('test ---=== 设置 保险界面详情 =--= ', data, this._selectInsure)
        this._curInsureData = data;

        this.setArrowShow()
        this._selectInsure[this._insureIndex] = data.tPool

        this._insureMode = data.nInsureMode;
        this.sTitle.string = data.nInsureMode==1?TexasUtils._getText(124):TexasUtils._getText(131);//传统、低水保险
        this.sOtherCards.node.active = data.nInsureMode==1?false:true;

        if (data.hasOwnProperty("isMustBuy")) {//是否必须购买保险(true时，保险玩家必须购买所有outs保险)
            this._isMustBuy = data.isMustBuy;
        }

        this.cancelBtn.active = true;
        this.cancelBtnGrey.active = false;

        this._arrOdds = [];
        if (data.arrOddsList) {
            this._arrOdds = Utils.clone(data.arrOddsList);
        }

        let arrRelevantUser = data.arrRelevantUser;//与保险相关的玩家显示

        let arrCommunityCards = data.arrCommunityCards;//公共牌

        let arrOuts = [];
        let arrCard = [];


        if (data.hasOwnProperty("tElseUserHoleCard")) {
            let tElseUserHoleCard = data.tElseUserHoleCard;//其他玩家手牌
            arrOuts = tElseUserHoleCard.arrOuts;//占outs的手牌(高亮显示)
            arrCard = tElseUserHoleCard.arrCard;//其它手牌
        }

        let tRemaining = data.tRemaining;//剩余outs,牌堆剩余多少张牌,赔率
        let arrOut = tRemaining.arrOuts;//剩余outs
        let nPileCnt = Number(tRemaining.nPileCnt);//牌堆剩余牌数量
        this._nOdds = tRemaining.nOdds;//赔率

        this._tPool = data.tPool;//可投保池,底池,投入
        let nInsurePool = Number(this._tPool.nInsurePool);//可投保池
        let nPool = Number(this._tPool.nPool);//底池
        let nInvest = Number(this._tPool.nInvest);//投入

        this._arrInsurancePlan = Utils.clone(data.arrInsurancePlan);//投保方案
        // this._arrInsurancePlan = this._arrInsurancePlan.sort((a, b) => {
        //     return b.nCosts - a.nCosts
        // })

        this._buyPool = -1;
        let card1 = this.panel2.getChildByName("card1")
        let card2 = this.panel2.getChildByName("card2")
        this._setPanelUserCard(card1, card2, arrRelevantUser)
        this.nInfo4.getChildByName("poolId").getComponent(cc.Label).string = this._curInsureData.tPool.nPoolId
        this.nInfo4.getChildByName("poolGold").getComponent(cc.Label).string = this._curInsureData.tPool.nPool

        this.sTime.string = "";//时间
        this.sOuts.string = "<color=#ffffff>" + "成牌 " + "</color>" + "<color=#FAD553>" + arrOut.length + "</color>";//outs
        this.sCards.string = "<color=#ffffff>" + TexasUtils._getText(138) + "</color><color=#FAD553>" + nPileCnt + "</color><color=#ffffff>" + TexasUtils._getText(167) + "</color>";//剩余牌
        // this.sOdds.string = "<color=#ffffff>" + TexasUtils._getText(139) + "</color><color=#F9D354>" + "1-" + TexasUtils._saveTwoPoint(Number(this._nOdds)) + "</color>";//赔率
        this.sOdds.string =  "<color=#ffffff>" +"赔率"  + "</color>" + "<color=#FAD553>" +  TexasUtils._saveTwoPoint(Number(this._nOdds)) + "</color>";//赔率

        this.sOtherCards.string = TexasUtils._getText(136,arrOuts.length);//其他手牌
        // this.sCanPut.string = TexasUtils._getText(140,nInsurePool);//可投保池
        this.sCanPut.string = nInsurePool + "";//可投保池
        // this.sPool.string = TexasUtils._getText(141,nPool);//底池
        // this.sPut.string = TexasUtils._getText(142,nInvest);//投入
        this.sPut.string = nInvest + ""; 
        this.sBao.string = 0 + "";
        this.sPei.string = 0 + "";
        this.sSureBao.string = "";
        this.arrow.spriteFrame = this.arrowSpriteFrame[0];
        this.arrow.node.active = false
        this._downMenu = false;

        this.sureBtn.active = true;
        this.sureBtnGrey.active = false;

        let userId = UserInfo.getInfo().nUserID
        let relevantUser = arrRelevantUser.filter(item => item.nUserId != userId)
        
        for (let i=1; i<=3; i++) {
            let players = this.nInfo1.getChildByName("player" + i);
            let player = players.getChildByName("player"); 
            // let nullSeat = players.getChildByName("nullSeat");

            let name = player.getChildByName("name").getComponent(cc.Label);
            let layout = player.getChildByName("layout");
            // let label = player.getChildByName("label").getComponent(cc.Label);

            this._setUserCards(layout);

            player.active = false;
            // nullSeat.active = true;

            for (let j=0; j<relevantUser.length; j++) {
                let info = relevantUser[j];
                let nUserId = info.nUserId;//玩家id
                let sName = info.sName;//玩家昵称
                let arrHoleCards = info.arrHoleCards;//底牌
                let nOuts = Number(info.nOuts);//-1:保险购买中, >0:OUTS数量, 其它:无意义

                if (i-1==j) {
                    name.string = Utils.getShortText(Base64.decode(sName), 12);//玩家名
                    // label.string = nOuts>=0?TexasUtils._getText(135,nOuts):TexasUtils._getText(134);//保险购买中
                    // let color = nOuts>=0?"#ffffff":"#ff3737";
                    // TexasUtils._setColor(label.node,color);te
                    
                    this._setUserCards(layout,arrHoleCards);
                    player.active = true;
                    // nullSeat.active = false;

                    break;
                }
            }
        }

        let commonCards = this.nInfo1.getChildByName("commonCards");//公共牌
        let layout = commonCards.getChildByName("layout");
        for (let i=1; i<=5; i++) {
            let card = layout.getChildByName("card" + i);
            card.active = false;

            for (let j=0; j<arrCommunityCards.length; j++) {
                let commonCard = arrCommunityCards[j];

                if (i-1==j) {
                    TexasUtils._getCardType(card,commonCard);
                    card.active = true;

                    break;
                }
            }
        }
        
        for (let i=1; i<=2; i++) {
            let layouts = this.nInfo2.getChildByName("layout" + i);

            layouts.active = false;
            let layoutChild = layouts.children;

            let arry = i==1?Utils.clone(arrOuts):Utils.clone(arrCard);
            for (let j=0; j<arry.length; j++) {
                let cardItem = arry[j];

                for (let k=0; k<layoutChild.length; k++) {
                    let child = layoutChild[k];
    
                    if (j==k) {
                        TexasUtils._getCardType(child,cardItem);
                        child.opacity = 255;
                        child.active = true;

                        break;
                    }
                }
                layouts.active = true;
            }
        }
        
        this.nInfo3.destroyAllChildren();
        for (let i=0; i<arrOut.length; i++) {
            let cardItem = arrOut[i];

            let item = cc.instantiate(this.itemInfoPrefab);
            item.parent = this.nInfo3;
            let texasInsureCardItem = item.getComponent("texasInsureCardItem");
            texasInsureCardItem._createInsureCardItem(this,data,cardItem,this.pokerBack);
            item.active = true;
        }

        this.arrow.node.active = false;
        if (arrOut.length<=10) {
            this.arrow.node.active = false;
        }

        this._setCards(true);

        this._setInsurPlan();

    },

    _setInsurPlan() {
        this._maxPoolIndex = 0
        this._poolIndex = 0
        let gold = TexasData._getBalance()
        let arrInsurancePlan = Utils.clone(this._arrInsurancePlan);
        let layouts = this.nInfo4.getChildByName("layout");
        let coutCosts = this.getSelectCosts()
        cc.log('test -0== ==-- 当前 保险面板 ', this._arrInsurancePlan)
        for (let k=0; k<arrInsurancePlan.length; k++) {
            let insure = layouts.getChildByName("insure" + (k + 1));
            if(!insure) break
            let plan = arrInsurancePlan[k];
            let nPlanId = Number(plan.nPlanId);//投保方案 0:(保本),1:(满池),2:(1/2底池),3:(1/3底池),5:(1/5底池),8:(1/8底池)
            let nCosts = Number(plan.nCosts);//方案所需金币

            let text = this.getInsurePlanText(nPlanId)
           
            //缓存分池滑动参数
            this._arrInsurancePlan[k].planName = text
            if(this._selectInsure[this._insureIndex].poolIndex === 0 || this._selectInsure[this._insureIndex].poolIndex > 0){
                this._maxPoolIndex = this._selectInsure[this._insureIndex].maxPoolIndex
                this._poolIndex = this._selectInsure[this._insureIndex].poolIndex
                cc.log('tset 已选择的 滑动数据 ', gold, coutCosts, nCosts, ' ==== poolIndex / maxIndex =' , this._poolIndex, this._maxPoolIndex)

                if(k < this._maxPoolIndex) {
                    this._setPool(insure, text, nCosts, true);
                }else {
                    this._setPool(insure, text, nCosts, false);
                }
            }else {
                cc.log('tset 设置 滑动数据 ', gold, coutCosts, nCosts, this._poolIndex)
                if(gold < coutCosts + nCosts) {
                    this._maxPoolIndex = k + 1
                    this._poolIndex = k + 1
                    this._setPool(insure, text, nCosts, true);
                }else {
                    this._setPool(insure, text, nCosts, false);
                }
                
            }
        }
        this._selectInsure[this._insureIndex].maxPoolIndex = this._maxPoolIndex
        this._selectInsure[this._insureIndex].poolIndex = this._poolIndex
        this._setPoolActive(this._poolIndex, true)
    },
    
    _setUserCards(layout,cards) {
        for (let i=1; i<=4; i++) {
            let card = layout.getChildByName("card" + i);
            card.active = false;

            if (cards) {
                for (let j=0; j<cards.length; j++) {
                    let cardItem = cards[j];

                    if (i-1==j) {
                        TexasUtils._getCardType(card,cardItem);
                        card.active = true;

                        break;
                    }
                }
            }
        }

        if (cards) {
            let len = cards.length;
            
            layout.getComponent(cc.Layout).spacingX = len==2?3:-37;
        }
    },

    _setPool(target, text, costs, notIndex) {
        let def = target.getChildByName('default')
        def.getChildByName('Number').getComponent(cc.Label).string = costs
        def.getChildByName('Label').getComponent(cc.Label).string = text

        if(notIndex) {
            target.getChildByName('tb_009').active = true
            def.getChildByName('Number').color = new cc.Color('#65778B')
        }else {
            target.getChildByName('tb_009').active = false
            def.getChildByName('Number').color = new cc.Color(232, 223, 209)
        }
    },

    _setPoolActive(index, isInit) {
        try {
             cc.log('test 更新节点数据 ==== -- ', index, this._arrInsurancePlan, this._selectInsure)
             if(!this._arrInsurancePlan[index] || !this._selectInsure[this._insureIndex]) {
                return
             }
            this._poolIndex = index
            let costs = this._arrInsurancePlan[index].nCosts
            let text = this._arrInsurancePlan[index].planName
            let planId = this._arrInsurancePlan[index].nPlanId

            this._selectInsure[this._insureIndex].poolIndex = index
            
            //设置选择方案的保险金额
            this._selectInsure[this._insureIndex].nPlanId = planId
            this._selectInsure[this._insureIndex].nCosts = costs
            let otherCosts = 0
            let countText = ''
            //获取其它已选择的保险方案
            for (const key in this._selectInsure) {
                if (!Object.hasOwn(this._selectInsure, key)) continue;
                const element = this._selectInsure[key];
                if(element.nCosts) {
                    otherCosts = Math.round(Math.floor((otherCosts + element.nCosts) * 10000) / 1000) / 10 
                    countText += element.nCosts + '+'
                }
            }
            cc.log('test 选择保险方案 -== ', this._selectInsure)
            // this._buyPool = this._arrInsurancePlan[index].nPlanId
            this.poolNode.setPosition(this.poolPosArr[index])
            this.poolNode.getChildByName('Number').getComponent(cc.Label).string = costs
            this.poolNode.getChildByName('Label').getComponent(cc.Label).string = text
            this.sPei.string = Math.floor(Math.round(this._nOdds * otherCosts * 10000) / 1000) / 10 + "";
            this.sBao.string = otherCosts + "";
            this.sSureBao.string = otherCosts + "";
            
            if(this._insureIndex == -1) {
                this.poolCount.active = false
            }else if(costs < otherCosts){
                this.poolCount.active = true
                countText = countText.slice(0, countText.length - 1)
                this.poolCount.getChildByName("countNum").getComponent(cc.Label).string = `${countText} = ${otherCosts}`
            }else {
                this.poolCount.active = true
                this.poolCount.getChildByName("countNum").getComponent(cc.Label).string = otherCosts
            }
            
            let layout = this.nInfo4.getChildByName("layout");
            if(layout) {
                for (let i = 1; i <= 5; i++) {
                    let insure = layout.getChildByName('insure' + i);
                    if(i == index + 1) {
                        insure.getChildByName('default').getChildByName('Number').active = false
                    }else {
                        insure.getChildByName('default').getChildByName('Number').active = true
                    }
                }
            }
            if(!isInit) {
                this.poolNode.getComponent('UISound')._onClick()
            }
        } catch (error) {
            
        }
       
    },

    _setPanelUserCard(card1Node, card2Node, cardData) { 
        let user = UserInfo.getInfo()
        for (let i = 0; i < cardData.length; i++) {
            const element = cardData[i];
            cc.log('test --=== 设置手牌 --== ', element, user.nUserID)
            if(element.nUserId == user.nUserID) {
                TexasUtils._getCardType(card1Node, element.arrHoleCards[0])
                TexasUtils._getCardType(card2Node, element.arrHoleCards[1])
                break
            }
        }
    },

    _setCards(visible) {
        let nInfo3 = this.nInfo3.children;
        for (let j=0; j<nInfo3.length; j++) {
            let child = nInfo3[j];

            if (j>10) {
                child.active = visible;
            }else {
                child.active = true;
            }
        }
    },

    _getCount(cards) {
        let count = 0;
        let cardArry = [];

        let nInfo3 = this.nInfo3.children;
        for (let j=0; j<nInfo3.length; j++) {
            let child = nInfo3[j];

            let texasInsureCardItem = child.getComponent("texasInsureCardItem");
            if (texasInsureCardItem._getIcon()) {
                count++;
                cardArry.push(texasInsureCardItem._getCard());
            }
        }

        if (cards) {
            return cardArry;
        }else {
            return count;
        }
    },

    //更新同一玩家冷却时间
    _setTimeSchedule(time) {
        if (time<=0) {
            this.onClose();
        }else {
            this.times = time;
            this.sTime2.string = "" + time
            this.sTime.string = "" + time;//时间
            // if(this._panelIndex == 1) {
            //     this.sTime2.string = "" + time
            // }else {
            //     this.sTime.string = "" + time;//时间
            // }
            this._startUpdate();
        }
    },

    //开始更新
    _startUpdate(){
        this._stopUpdate();

        cc.director.getScheduler().schedule(this._updateTime, this,1, false);
    },

    //暂停更新
    _stopUpdate(){
        if(cc.director.getScheduler().isScheduled(this._updateTime, this)){
            cc.director.getScheduler().unschedule(this._updateTime, this);
        }
    },

    _updateTime () {
        this.times -= 1;
        this._setTimeSchedule(this.times);
    },

    //下拉菜单
    onClickBtnDownMenu() {
        this._downMenu = !this._downMenu;
        this.arrow.spriteFrame = !this._downMenu?this.arrowSpriteFrame[0]:this.arrowSpriteFrame[1];
        this._setCards(this._downMenu);
    },


    //不买
    onClickBtnCancel() {
        this._selectInsure = {}

        if(this._insureIndex != -1) {
            this.setShowPanel(0)
            this.sTime2.string = "" + this.times
            this.sTime.string = "" + this.times;//时间
        }else {
            this.OnClickDontBuy()
        }
    },

    //购买
    onClickBtnBuy() {
        let buys = []
        for (const key in this._selectInsure) {
            if (!Object.hasOwn(this._selectInsure, key)) continue;
            
            const element = this._selectInsure[key];
            buys.push(
                {
                    nPlanId: element.nPlanId,
                    nPoolId: element.nPoolId,
                }
            )
            
        }
        let data = {
            nBuy: buys
        }
        
        let nStr = "购买保险请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.InsurBuyReq_CMD, data);
    },

    ontTouchStart(event) {
        this._downPosY = 0
        this._startPosY = event.getLocationInView().y
    },

    ontToucheEnd(event) {
        this._downPosY = 0
        this._startPosY = null
    },


    ontTouchMove(event) {
        // cc.log('test  --== move:: ', this._startPosY, event.getLocationInView().y, this._downPosY)
        let last = event.getLocationInView().y
        if(this._startPosY) {
            this._downPosY += last - this._startPosY
            if(Math.abs(this._downPosY) >= 95) {
                if(this._startPosY < last) {
                    this._poolIndex ++
                    this._poolIndex = this._poolIndex >= 4 ? 4 : this._poolIndex
                }else {
                    this._poolIndex --
                    this._poolIndex = this._poolIndex <= this._maxPoolIndex ? this._maxPoolIndex : this._poolIndex
                }
                this._downPosY = 0
                this._setPoolActive(this._poolIndex)
            }
            this._startPosY = last
        }
    },

    onClickBtnAddTimes(){
        //防止多次点击
        if(this._isClickAddTime) return
        this._isClickAddTime = true
        this.scheduleOnce(()=>{
            this._isClickAddTime = false
        }, 0.2)
        // UIFrame.showTips("暂时不能购买");
        let param = {
            isInsure: true,
        }
        let nStr = "保险延时请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.DelayReq_CMD, param);
        
    },

    //保险延时回复
    _onRepDelayed(msgData) {
        let nType = msgData.isInsure;
        if (nType && msgData.nRlt == 0) {//是保险延时消息
            TexasData._setInsureDelayCost(msgData.nDelayCost);
            this._setTimeSchedule(msgData.nOpLong);
            this.showAddTime(true);
        }else if(nType && msgData.nRlt != 0) {//保险延时失败
            if(msgData.nRlt == 1) {//金币不足
                UIFrame.showTips(TexasUtils._getText(11));
            }
        }
    },

    showAddTime(state) {
        let cost = TexasData._getInsureDelayCost();
        if (state && cost != null && cost != undefined && cost >= 0) {
            this.sAddTime1.active = true;
            this.sAddTime2.active = true;
            if(cost > 0) { 
                this.sAddTime1.getChildByName('free').active = false;
                this.sAddTime2.getChildByName('free').active = false;
                this.sAddTime1.getChildByName('gold').active = true;
                this.sAddTime2.getChildByName('gold').active = true;
                this.sAddTime1.getChildByName('gold').getChildByName('text').getComponent(cc.Label).string = cost;
                this.sAddTime2.getChildByName('gold').getChildByName('text').getComponent(cc.Label).string = cost;//花费
            }else {         
                this.sAddTime1.getChildByName('free').active = true;
                this.sAddTime2.getChildByName('free').active = true;
                this.sAddTime1.getChildByName('gold').active = false;
                this.sAddTime2.getChildByName('gold').active = false;
            }
            
        }else {
            this.sAddTime1.active = false;
            this.sAddTime2.active = false;
        }
    },


    OnClickBtnRight() {
        this._poolIndex = 2
        let add = this._insureIndex + 1
        if(add > this._data.arrInsurPanelData.length - 1) add = this._data.arrInsurPanelData.length - 1
        let insure = this._data.arrInsurPanelData[add]
        //已经选择的分池，不进行金额检查
        if(this._selectInsure[this._insureIndex]) {
            this._insureIndex = add
            this._setInsureDetail(insure)
            return
        }

        let countCosts = this.getSelectCosts()
        let achieve = this.checkPoolCreditLimit(insure.arrInsurancePlan, countCosts, TexasData._getBalance())
        cc.log('test 0-- -=-=-= 向右 == == ', countCosts, achieve)
        if(achieve) {
            this._insureIndex = add
            this._setInsureDetail(insure)
        }else {
            UIFrame.showTips('您的余额不够下个保险！')
        }
    },

    OnClickBtnLeft() {
        this._poolIndex = 2
        let add = this._insureIndex - 1
        if(add <= 0) add = 0
        let insure = this._data.arrInsurPanelData[add]
        //已经选择的分池，不进行金额检查
        if(this._selectInsure[this._insureIndex]) {
            this._insureIndex = add
            this._setInsureDetail(insure)
            return
        }

        let countCosts = this.getSelectCosts()
        let achieve = this.checkPoolCreditLimit(insure.arrInsurancePlan, countCosts, TexasData._getBalance())
        cc.log('test 0-- -=-=-= 向左 == == ', countCosts, achieve)
        if(achieve) {
            this._insureIndex = add
            this._setInsureDetail(insure)
        }else {
            UIFrame.showTips('您的余额不够买下个保险！')
        }
    },

    //不买
    OnClickDontBuy() {
        let data = {
            nPlanId: -1
        }

        let nStr = "保险不买请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.InsurBuyReq_CMD, data);
    },

    OnClickEnterPanel2(event, customData) {
        this._panelIndex = 1
        this.setShowPanel(1)
        if(customData) {
            this._insureIndex = Number(customData) - 1
        }else {
            this._insureIndex = 0
        }
        this.sTime2.string = "" + this.times
        this.sTime.string = "" + this.times;//时间
        let insure = this._data.arrInsurPanelData[this._insureIndex]
        this._setInsureDetail(insure)
    },

    //打开聊天室
    OnClickToChat() {
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SHOW_CHAT, null)
    },

    //购买保本保险
    OnClickBuyBreakEvent() {
        cc.log('test 购买保本保险 ', this._planQuickBuy)
        if(this._planQuickBuy && this._planQuickBuy.countBreak) {
            let data = {
                nPlanId: Number(this._planQuickBuy.idBreak) + 100,
            }
            
            let nStr = "购买保险请求";
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.InsurBuyReq_CMD, data);
        }

    },

    //购买满池保险
    OnClickAllMax() {
        cc.log('test 购买保本保险 ', this._planQuickBuy)
        if(this._planQuickBuy && this._planQuickBuy.countAll) {
            let data = {
                nPlanId: Number(this._planQuickBuy.idAll) + 100,
            }
            
            let nStr = "购买保险请求";
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.InsurBuyReq_CMD, data);
        }
    },

    //检测单个分池保险
    checkPoolCreditLimit(plan, start, balance) {
        for (let index = 0; index < plan.length; index++) {
            const element = plan[index];
            let count = element.nCosts + start
            if(count >= balance){
                return false
            }
        }
        return true
    },

    //累计所有分池保险金额
    getAllPoolConsts(insureData, balance) {
        let planTotalArr = []
        let planIdArr = {}
        let length = insureData[0].arrInsurancePlan.length
        for (let i = length - 1; i >= 0; i--) {
            for (let j = 0; j < insureData.length; j++) {
                const plan = insureData[j].arrInsurancePlan[i]
                if(i == length - 1 && plan.nCosts > balance) {
                    break
                }
                if(planIdArr[plan.nPlanId]) {
                    planIdArr[plan.nPlanId] = planIdArr[plan.nPlanId] + plan.nCosts
                }else {
                    planIdArr[plan.nPlanId] = plan.nCosts
                }
            }
        }

        for (const key in planIdArr) {
            if (!Object.hasOwn(planIdArr, key)) continue;
            
            const element = planIdArr[key];
            
            planTotalArr.push({
                count: element,
                id: key
            })
        }

        planTotalArr.sort((a, b) => {
            return a.count - b.count
        })

        for (let index = 0; index < planTotalArr.length; index++) {
            const element = planTotalArr[index];
            if(element.count > balance) {
                if(index > 1) {
                    return {
                        countAll: planTotalArr[index - 1].count,
                        idAll: planTotalArr[index - 1].id,
                        countBreak: planTotalArr[index - 2].count,
                        idBreak: planTotalArr[index - 2].id,
                    }
                }else if(index > 0){
                    return {
                        countAll: planTotalArr[1].count,
                        idAll: planTotalArr[1].id,
                        countBreak: planTotalArr[0].count,
                        idBreak: planTotalArr[0].id,
                        isNotBuyAll: true,
                    }
                }else {
                    return {
                        countAll: planTotalArr[1].count,
                        idAll: planTotalArr[1].id,
                        countBreak: planTotalArr[0].count,
                        idBreak: planTotalArr[0].id,
                        isNotBuyBreak: true,
                    }
                }
            }
            if(index == planTotalArr.length - 1) {
                return {
                    countAll: planTotalArr[planTotalArr.length - 1].count,
                    idAll: planTotalArr[planTotalArr.length - 1].id,
                    countBreak: planTotalArr[planTotalArr.length - 2].count,
                    idBreak: planTotalArr[planTotalArr.length - 2].id,
                }
            }
        }
    },

    getSelectCosts()  {
        let coutCosts = 0
        for (const key in this._selectInsure) {
            if (!Object.hasOwn(this._selectInsure, key)) continue;
            const element = this._selectInsure[key];
            if(element.nCosts) {
                coutCosts += element.nCosts
            }
        }
        return coutCosts
    },


    setArrowShow() {
        if(this._insureIndex == -1) {
            this.btnLeft.active = false
            this.btnRight.active = false
        }else {
            this.btnLeft.active = this._insureIndex != 0
            this.btnRight.active = this._insureIndex < this._data.arrInsurPanelData.length - 1
        }
    },
    
    setShowPanel(index) {
        this.panel1.active = index == 0
        this.panel2.active = index == 1
    },

    getInsurePlanText(nPlanId) {
        let text = TexasUtils._getText(146);
        if(nPlanId == 1) {
            text = TexasUtils._getText(145);
        }else if(nPlanId == 2) {
            text = TexasUtils._getText(144,2);
        }else if(nPlanId == 3) {
            text = TexasUtils._getText(223);
        }else if(nPlanId == 5) {
            text = TexasUtils._getText(144,4);
        }else if(nPlanId == 8) {
            text = TexasUtils._getText(144,8);
        }
        return text
    },

    getNumberOneDecimal(num) {
        return Math.round(Math.floor(Number(num) * 10000) / 1000) / 10
    },

    onClose() {
        this._stopUpdate();

        this.sTime.string = "0";//时间
        this.sTime2.string = "0"
        this.node.destroy();
    },
    
});
