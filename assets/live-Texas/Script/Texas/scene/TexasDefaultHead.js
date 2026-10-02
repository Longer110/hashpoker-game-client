// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UserInfo = require("UserInfo");
let TexasUtils = require("TexasUtils");
let CMD = require("protocol_texas");
let UIFrame = require("UIFrame");
let TexasPlayerController = require("TexasPlayerController");

cc.Class({
    extends: cc.Component,

    properties: {
        point: cc.Animation,
        sitidText: cc.Label,

        TexasPlayerController: TexasPlayerController,
        _nSitid: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.nullSeat.string = TexasUtils._getText(50);
    },

    // update (dt) {},

    _setPoint(visible) {
        let info = UserInfo.getInfo();

        let selfSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);

        this.point.stop('pointAnim');
        this.point.setCurrentTime(0);

        if (selfSitId) {//自己在牌桌
            this.point.node.active = false;
        } else {
            if (visible) {
                this.point.play("pointAnim");
            }

            this.point.node.active = visible;
        }
    },

    //设置服务端位置
    _setSitid(num) {
        this._nSitid = num;
        this.sitidText.string = num;
        this.sitidText.node.active = false;
    },

    //默认头像
    onClickBtnDefault(event) {
        let info = UserInfo.getInfo();

        let playBackData = TexasUtils._getClubReback();
        if (TexasUtils._getSkin(["c"]) && playBackData) {
            return;
        }

        let target = event.target;
        let lock = target.getChildByName("lock");
        let nullSeat = target.getChildByName("nullSeat");

        if (lock.active) return;

        let selfSitId = this.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (selfSitId) {
            // let text = TexasUtils._getText(57);
            // UIFrame.showTips(text);
            //打开邀请好友界面
            this.openInviteFriends();
            return;
        }

        if (!App.checkAccount()) {
            cc.log("-----------------------------------------------------------------------------------------德州 游客账号不可坐下");

            return;
        }

        if (!lock.active && nullSeat.active) {
            let reqSitid = this._nSitid;

            let data = {
                nPos: reqSitid,
            }

            let nStr = "坐下请求";
            if (TexasUtils._getClub()) {
                TexasUtils._getLongAndLatitude(function (longitude, latitude) {
                    if (longitude && latitude) {
                        let tGps = {
                            nLongitude: longitude,
                            nLatitude: latitude,
                        }

                        data.tGps = tGps;
                    }

                    if (TexasUtils._getCanSitDown()) {
                        // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data)

                        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                    }
                });
            } else {
                // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data)
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
            }
        }
    },

    openInviteFriends() {
        let path = 'popup/friends/TexasInviteFriends'
        app.texas.ui.loadPopup(path, function (component) {
            let parent = this.getAddNode();
            parent.addChild(component.node, 1024);
            component.setData(1);
        }.bind(this));
    },

    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("LayerView")
    },
});
