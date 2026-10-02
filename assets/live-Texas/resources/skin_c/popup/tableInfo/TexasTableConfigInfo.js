// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasData = require("TexasData");
let UIFrame = require("UIFrame");
let Base64 = require("base64");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        roomName: cc.Label,
        roomId: cc.Label,
        buyLabel: cc.Label,
        betLabel: cc.Label,
        seatLabel: cc.Label,
        timeLabel: cc.Label,
        insureLabel: cc.Label,
        takeInLimit: cc.Label,
        startLabel: cc.Label,
        poolRateLabel: cc.Label,
        zhuotouLabel: cc.Label,
        betTitle: cc.Label,
        tipsNode: cc.Node,
        tipsText: cc.Label,
        tipsTitle: cc.Label,
        shoushuLabel: cc.Label,
        //撤码
        tabkeOut: cc.Label,
        //输钱上限
        loseMax: cc.Label,
        //看公牌
        publicCards: cc.Label,
        //看手牌
        handCards: cc.Label,
        //切牌
        cutCards: cc.Label,
        //延迟看牌
        delayLookCards: cc.Label,
        //实时音频
        realTimeAudio: cc.Label,
        //gps
        gps: cc.Label,

        _data: null,
        _showTips: false,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.tipsNode.active = false
        this.init()
    },

    init() {
        let info = TexasData._getTableInfo()
        cc.log('test tabel info ', info)
        if (info) {
            this.roomName.string = Utils.getShortText(Base64.decode(info.sTableName), 20)
            this.roomId.string = TexasData._getCurTableId()
            this.betLabel.string = Utils.showClubTableInfo('', info.nSmallBlind, info.nBigBlind, info.nZhuaTou, info.nPreAnte, info.preAnteOdd, info.nGameId)
            this.betTitle.string = info.nSmallBlind == 0 && info.nBigBlind == 0 ? '前注' : '盲注'

            this.buyLabel.string = info.nBuyMin + '-' + info.nBuyMax
            this.startLabel.string = TexasData._getAutoStartNum()
            this.seatLabel.string = TexasData._getMaxTableSeat()
            this.timeLabel.string = Math.round(Math.floor(TexasData._getKeepTime() / 3600 * 10000) / 1000) / 10 + 'h'

            if (info.nPoolEntryRate) {
                let text = info.nPoolEntryRate + ""
                if (info.nPoolEntryRateHands) {
                    text = text + '%(' + info.nPoolEntryRateHands + '手内不受限制' + ')'
                }
                this.poolRateLabel.string = text
            } else if (info.nPoolEntryRate === 0) {
                this.poolRateLabel.string = '无限制'
            } else {
                this.content.getChildByName('poolRate').active = false
            }

            if (info.isForceBlind) {
                this.zhuotouLabel.string = info.isForceBlind ? '已开启' : '未开启'
                this.content.getChildByName('zhuotou').active = true
            } else {
                this.content.getChildByName('zhuotou').active = false
            }

            if (info.nInsureMode > 0) {
                this.insureLabel.string = info.nInsureMode > 0 ? "已开启" : '未开启'
                this.content.getChildByName('insure').active = true
            } else {
                this.content.getChildByName('insure').active = false
            }
            //手数限制
            if (info.nPoolHands) {
                this.shoushuLabel.string = info.nPoolHands
                this.content.getChildByName('shoushu').active = true
            } else {
                this.content.getChildByName('shoushu').active = false
            }


            //补码上限
            if (info.nTakeInLimit) {
                this.takeInLimit.string = info.nTakeInLimit
                this.content.getChildByName('takeInLimit').active = true
            } else {
                this.content.getChildByName('takeInLimit').active = false
            }

            //撤码
            if (info.isTabkeOut) {
                this.tabkeOut.string = Math.round(Math.floor(info.nBuyMin * info.nTabkeOutOdd * 10000) / 100) / 100
                this.content.getChildByName('tabkeOut').active = true
            } else {
                this.content.getChildByName('tabkeOut').active = false
            }

            //输钱上限
            if (info.nLoseMaxAmount) {
                this.loseMax.string = info.nLoseMaxAmount
                this.content.getChildByName('loseMax').active = true
            } else {
                this.content.getChildByName('loseMax').active = false
            }

            //付费看公牌、手牌、切牌
            let tableCost = JSON.parse(info.nTableCost || '[]')
            for (let i = 0; i < tableCost.length; i++) {
                let cost = tableCost[i]
                if (cost.nId == 1) {//看公牌
                    if (cost.open == 1) {
                        this.publicCards.string = cost.nCost + 'USDT'
                        this.content.getChildByName('publicCards').active = true
                    } else {
                        this.content.getChildByName('publicCards').active = false
                    }
                } else if (cost.nId == 2) {//看手牌
                    if (cost.open == 1) {
                        this.handCards.string = cost.nCost + 'USDT'
                        this.content.getChildByName('handCards').active = true
                    } else {
                        this.content.getChildByName('handCards').active = false
                    }
                } else if (cost.nId == 3) {//切牌
                    if (cost.open == 1) {
                        this.cutCards.string = cost.nCost + 'USDT'
                        this.content.getChildByName('cutCards').active = true
                    } else {
                        this.content.getChildByName('cutCards').active = false
                    }
                }
            }
            //延迟看牌
            if (info.isDelayLook) {
                this.delayLookCards.string = '已开启'
                this.content.getChildByName('delayLookCards').active = true
            } else {
                this.content.getChildByName('delayLookCards').active = false
            }

            //实时语音
            if (info.isVideoFee) {
                this.realTimeAudio.string = "免费"
                // this.realTimeAudio.string = info.nVideoFee + ' USDT/人/分钟'
                this.content.getChildByName('realTimeAudio').active = true
            } else {
                this.content.getChildByName('realTimeAudio').active = false
            }


            //gps
            if (info.isGPSLimit) {
                this.gps.string = '已开启'
                this.content.getChildByName('gps').active = true
            } else {
                this.content.getChildByName('gps').active = false
            }
        }
    },

    onClickClose() {
        this.node.destroy()
    },

    onClickCopy() {
        Utils.copyToClipBoard(TexasData._getCurTableId())
    },

    onClickShowTips(event, customEventData) {
        let text = ''
        let title = ''
        switch (customEventData) {
            case 'lose':
                title = '止损上限'
                text = '当玩家在牌桌上输钱超过设定值时，将无法继续游戏。'
                break
            case 'zhuotou':
                title = '强抓'
                text = '开启强制抓头时，默认强制1位玩家抓，牌桌至少有3位玩家时才会触发该功能。'
                break
            case 'cut':
                title = '付费切牌'
                text = '支持玩家付费主动切牌，每手牌结束时优先付费申请切牌的玩家将获得下一手牌的主动切牌权。'
                break
            case 'look':
                title = '延迟看牌'
                text = '为了一定程度防止伙牌，设置翻前轮到自己行动时才能看牌。'
                break
            case 'audio':
                title = '实时语音'
                text = '开启实时语音后，每分钟 以0.002 USDT 的价格收费。平台将以分钟为单位从您的资产账户中扣款，余额不足时将停止实时语音服务。'
                break
            case 'shoushu':
                title = "手数限制",
                    text = "本房间需达到指定的有效手数方可入座，未达标的玩家无法坐下。"
                break
            case 'buma':
                title = "补码上限",
                    text = "为防止筹码压制，可设置补码上限，开启后桌上筹码不得因买入而超过该上限"
                break
        }
        this._showTips = !this._showTips
        this.tipsNode.active = this._showTips
        this.tipsText.string = text
        this.tipsTitle.string = title
    }

    // update (dt) {},
});
