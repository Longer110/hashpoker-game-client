// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Base64 = require("base64");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let AppBridge = require("AppBridge");
let LocalStorage = require("LocalStorage");
let MsgManager = require("MsgManager");
let UIFrame = require("UIFrame");
let TopNotificationItem = require("TopNotificationItem");

/**
 * 邀请弹窗类（继承自 TopNotificationItem）
 * 显示好友邀请加入游戏的弹窗
 * 
 * 使用示例：
 * let TopNotificationManager = require("TopNotificationManager");
 * let manager = TopNotificationManager.getInstance();
 * 
 * let inviteData = {
 *     sName: "...",
 *     sTableName: "...",
 *     nTakeInMin: 100,
 *     nSmallBlind: 1,
 *     nBigBlind: 2,
 *     // ...其他字段
 * };
 * 
 * manager.show('invite', inviteData, {
 *     prefab: invitePrefab,
 *     duration: 10,
 *     onClose: (data) => { console.log('邀请已关闭', data); }
 * });
 */

cc.Class({
    extends: TopNotificationItem,

    properties: {
        // 邀请相关 UI
        title: cc.RichText,
        roomName: cc.Label,
        minBuy: cc.Label,
        blind: cc.Label,
    },

    onLoad() {
        if (this.content) {
            this.content.active = false;
        }

        this._data = null;
        this._schedule = null;
        this._remainTime = 0;
        this._totalTime = 10;  // 默认显示时间 10 秒
        this._isShowing = false;
        this._callback = null;
        this._manager = null;
        this.nameColor = '#FAD553';
        this.tipsColor = '#65778B';
    },

    /**
     * 初始化 UI 内容
     * 由基类 show() 方法调用
     */
    _initUI() {
        if (!this._data) return;
        // 显示房间名称
        if (this.roomName) {
            let name = Base64.decode(this._data.sTableName);
            name = name.split("-")[0] || name;
            this.roomName.string = name;
        }

        // 显示邀请人信息
        if (this.title) {
            let inviterName = Utils.getShortText(Base64.decode(this._data.sName), 12);
            let text = `<color=${this.nameColor}>${inviterName}</color>邀请你加入游戏`;
            this.title.string = text;
        }

        // 显示最小买入
        if (this.minBuy) {
            this.minBuy.string = this._data.nTakeInMin || 0;
        }

        // 显示盲注信息
        if (this.blind) {
            let blindStr = Utils.showClubTableInfo(
                '',
                this._data.nSmallBlind,
                this._data.nBigBlind,
                this._data.nZhuaTou,
                this._data.nPreAnte,
                this._data.preAnteOdd,
                this._data.nGameId
            );
            this.blind.string = blindStr;
        }

        // 初始化倒计时显示
        if (this.countdownLabel && this._totalTime) {
            this.countdownLabel.string = this._totalTime + 'S';
        }
    },

    /**
     * 确认邀请 - 进入游戏
     */
    onClickConfirm() {
        try {
            let CMD = require("protocol_club");
            let TexasData = require("TexasData");

            // 检查是否已在其他牌局中
            if (!TexasData || TexasData._getSelfIsInTable()) {
                UIFrame.showTips("您还有未完牌局!");
                return;
            }
            let callBack = (password) => {
                // 发送接受邀请请求
                let params = {
                    nUserId: this._data.nUserId,
                    nRlt: 0,
                };
                app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSInvitedPlayGameReq_CMD, params);

                // 进入游戏
                this._enterGame(password);

                // 关闭弹窗
                this.hide();
            };
            let userInfo = UserInfo.getInfo();
            if (this._data.nIsPerson == 1 && this._data.nUserId != userInfo.nUserID) {
                UIFrame.showInputRoomPassword(null, { callBack: callBack.bind(this), sTableId: this._data.sTableId });
            } else {
                callBack.call(this, "");
            }



        } catch (error) {
            cc.error('邀请确认错误:', error);
        }
    },

    /**
     * 拒绝邀请
     */
    onClickCancel() {
        try {
            let CMD = require("protocol_club");

            // 发送拒绝邀请请求
            let params = {
                nUserId: this._data.nUserId,
                nRlt: 1,
            };
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSInvitedPlayGameReq_CMD, params);

        } catch (error) {
            cc.error('邀请拒绝错误:', error);
        }

        // 关闭弹窗
        this.hide();
    },

    /**
     * 进入游戏
     * @private
     */
    _enterGame(password) {
        try {
            // 退出当前牌局
            let CMDTexas = require("protocol_texas");
            app.net.send(CMDTexas.ClubTexas.value, CMDTexas.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});

            // 准备进入邀请的牌局参数
            let appkey = app.url.get("appkey");
            if (!appkey) {
                appkey = AppBridge.CLIENT_KEY;
            }

            let token = UserInfo.getInfo().token;
            let loginType = UserInfo.getLoginType();
            let viewer = 0;
            let anchor = 0;

            if (UserInfo.isViewer()) {
                viewer = 1;
                token = "";
            }

            if (app.getIsAnchor()) {
                anchor = 1;
            }

            let lang = app.config.LANGTEST || LocalStorage.getSysLanguage();
            app.config.LANGTEST = undefined;

            let skin = app.config.SKIN;

            // 发送进入子游戏消息
            let params = {
                msg: AppBridge.EVENT.SUBGAME_ENTER_START,
                key: appkey,
                data: {
                    token: token,
                    gameid: this._data.nGameId,
                    tableid: this._data.sTableId,
                    lang: lang,
                    skin: skin,
                    viewer: viewer,
                    anchor: anchor,
                    loginType: loginType,
                    nPass: password || "",
                }
            };

            MsgManager.fire("message", { data: JSON.stringify(params) });

        } catch (error) {
            cc.error('进入游戏错误:', error);
            UIFrame.showTips("进入游戏失败，请重试");
        }
    },

    /**
     * 重置组件状态（对象池复用时调用）
     */
    reset() {
        // 清理额外的状态
    }
});
