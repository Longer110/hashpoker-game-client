// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const i18n = require('i18n'); 
var ConfigGame = require("ConfigGame");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let GameInstance = require("init_game");
let LocalStorage = require("LocalStorage");

let TexasUtils = function (params) {
    
}

//牌
TexasUtils.prototype._getCardType = function (node,card,cardBack) {
    if (card) {
        let backNode = node.getChildByName("back");
        if (backNode) {
            backNode.active = false;
        }
        let x16 = 0x10;
        let x10 = x16.toString(10);//16进制转10进制

        let point = card%x10;//点数
        let flower = parseInt(card/x10);//花色

        // cc.log("_getCardType point,flower:",point,flower);

        // let frame = null;
        // if (this._getClub()) {
        //     frame = App.UIAtlasClub.getPokerDeZhouByDetail(point,flower);
        // }else if (this._getSkin(["default"])){
        //     frame = App.UIAtlasLive.getPokerDeZhouByDetail(point,flower,this._pokerAtlas);
        // }else{
        //     frame = App.UIAtlasLive.getPokerDeZhouByDetail(point,flower);
        // }

        // if(null!=frame){
        //     node.getComponent(cc.Sprite).spriteFrame = frame;
        // }

        let pokerSpriteData = App.UIAtlasClub.getPokerByDetail(point,flower);
        let pointNode = node.getChildByName("point");
        if (pointNode && pokerSpriteData) {
            pointNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.point;
            pointNode.active = true
        }

        let smallFlowerNode = node.getChildByName("smallFlower");
        if (smallFlowerNode && pokerSpriteData) {
            smallFlowerNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.flower;
            // smallFlowerNode.active = true
        }

        let bigFlowerNode = node.getChildByName("bigFlower");
        if (bigFlowerNode && pokerSpriteData) {
            bigFlowerNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.flower;
            bigFlowerNode.active = true
        }
    }else {
        let backNode = node.getChildByName("back");
        if (backNode) {
            backNode.active = true;
        }
        // if(cardBack){
        //     node.getComponent(cc.Sprite).spriteFrame = cardBack;
        // }else {
        //     let frame = null;
        //     if (this._getClub()) {
        //         frame = App.UIAtlasClub.getPokerDeZhou(0);
        //     }else if (this._getSkin(["default"])){
        //         frame = App.UIAtlasLive.getPokerDeZhou(0, "", this._pokerAtlas);
        //     }else{
        //         frame = App.UIAtlasLive.getPokerDeZhou(0);
        //     }
    
        //     if(null!=frame){
        //         node.getComponent(cc.Sprite).spriteFrame = frame;
        //     }
        // }
    }
},

//金币接口
TexasUtils.prototype._getGold = function (gold) {
    if (gold) {
        if(ConfigGame.ISLIVE){
            gold = Utils.convertNumberToStr2(Number(gold)) || "0";
        }else{
            gold = Utils.convertNumberToStr(Number(gold)) || "0";
        }
    
    }

    return gold;
}

//设置颜色
TexasUtils.prototype._setColor = function (node,color16) {
    if (!color16) {
        color16 = "#ffffff";
    }

    var color = cc.Color.BLACK;
    let curColor = color.fromHEX(color16);
    node.color = new cc.Color(curColor.r,curColor.g,curColor.b);
    node.active = true;
}

//俱乐部回放战绩
TexasUtils.prototype._getClubReback = function () {
    let clubReback = null;

    let playBackData = this._getClub() && app.club.getPlayBackData()?app.club.getPlayBackData():null;
    if (playBackData && playBackData.hasOwnProperty("sJson")) {
        clubReback = playBackData.sJson;
    }else if (this._clubReback){
        return this._clubReback;
    }

    return clubReback
}

TexasUtils.prototype._setClubReback = function (data) {
    this._clubReback = data;
}

//坐下
TexasUtils.prototype._getCanSitDown = function () {
    let TexasData = require("TexasData");

    let canSitDown = true;

    if (app.url.get("live")) return canSitDown;

    let tableInfo = TexasData._getTableInfo();
    let isOnlyPlayByIOS = tableInfo.isOnlyPlayByIOS;

    cc.log("isOnlyPlayByIOS,cc.sys.isMobile,cc.sys.os:",isOnlyPlayByIOS,cc.sys.isMobile,cc.sys.os);
    if (isOnlyPlayByIOS && cc.sys.isMobile) {
        if (cc.sys.os!=cc.sys.OS_IOS) {
            canSitDown = false;
        }
    }

    if (!canSitDown) {
        let UIFrame = require("UIFrame");
        let text = this._getText(159);
        UIFrame.showTips(text);
    }

    return canSitDown;
}

//游戏请求
TexasUtils.prototype._gameReqNotify = function (str,value,treaty,data) {
    cc.log("德州 str,value,treaty,data:",str,value,treaty,data);

    let MSG = require("Msg_Texas");
    let MsgManager = require("MsgManager");

    let nData = {
        str: str,
        value: value,
        treaty: treaty,
        nData: data,
    }

    MsgManager.fire(MSG.NOTIFY.NOTIFY_GAME_REQ, nData);
}


//数字num转保留tamp位小数
TexasUtils.prototype._tranfPointNumber = function (num,tamp = 2) {
    let currentNum = Number(num);
    let resultNum = currentNum
    if (tamp > 0){
        let basePow = 10 ** tamp
        if(num > 0) {
            resultNum = Math.floor(currentNum * basePow + 0.00001) / basePow
        }else if(num < 0){ 
            resultNum = Math.ceil(currentNum * basePow - 0.00001) / basePow
        }
    }else{
        resultNum = Math.floor(currentNum)
    }
    return resultNum
}

//保留两位小数
TexasUtils.prototype._saveTwoPoint = function (num) {
    return Utils.convertNumberToStr(num);

    // let currentNum = Number(num);
    // let preStr = "";
    // let str = "";
    // let offsex = 0.000001

    // if (currentNum) {
    //     if (currentNum < 0) {
    //         preStr = "-";
    //         currentNum = Math.abs(currentNum);
    //     }

    //     if (currentNum >= 10000000000) {
    //         str = Math.floor((currentNum / 100000000)) + i18n.t("COMMON.YI");
    //     }
    //     else if (currentNum >= 100000000) {
    //         let yi =  i18n.t("COMMON.YI")
    //         if (yi.indexOf("0") != -1) {
    //             str = parseFloat(Math.floor((currentNum / 100000000) * 10000)/100) + yi.substring(2,yi.length);
    //         }else{
    //             str = parseFloat(Math.floor((currentNum / 100000000) * 100) / 100) + i18n.t("COMMON.YI");
    //         }
    //     }
    //     else if (currentNum >= 10000000) {
    //         str = Math.floor((currentNum / 10000)) + i18n.t("COMMON.WAN");
    //     }
    //     else if (currentNum >= 1000000) {
    //         let wan =  i18n.t("COMMON.WAN")
    //         if (wan.indexOf("0") != -1) {
    //             str = parseFloat(Math.floor((currentNum / 10000) * 100)/10) + wan.substring(1,wan.length);
    //         }else{
    //             str = parseFloat(Math.floor((currentNum / 10000) * 10) / 10) + wan;
    //         }
    //     }
    //     // else if (currentNum >= 10000) {
    //     //     if(Math.floor(currentNum)!=Math.floor(currentNum+offsex)){
    //     //         cc.log("精度问题："+num)
    //     //     }
    //     //     currentNum = currentNum + offsex
    //     //     str = Math.floor(currentNum);
    //     // }
    //     else {
    //         if(Math.floor(currentNum)!=Math.floor(currentNum+offsex)){
    //             cc.log("精度问题："+num)
    //         }
    //         currentNum = currentNum + offsex
    //         currentNum = (Math.floor(currentNum * 10000) / 10000)
    //         if(currentNum === 0){
    //             preStr = ""
    //         }
    //         str = (currentNum).toString();
    //         if (str.indexOf(".") != -1) {
    //             str = parseFloat(str.substring(0, str.indexOf(".") + 3));
    //         }
    //         //str = parseFloat(Math.floor(currentNum * 100) / 100);
    //     }

    //     return preStr + str;
    // }

    // if (currentNum === 0) {
    //     str = currentNum.toString();
    // }

    // return preStr + str;
}

//检测账号登录
TexasUtils.prototype._checkAccount = function () {
    let valid = UserInfo.isLogin();
    valid = valid && !UserInfo.isViewer();

    return valid;
}

//获得对应皮肤
TexasUtils.prototype._getSkin = function (arry) {
    let curSkin = app.config.SKIN;

    let isTrueSkin = false;

    if (arry && arry.length>0) {
        for (let i=0; i<arry.length; i++) {
            let skin = arry[i];

            if (curSkin===skin) {
                isTrueSkin = true;

                break;
            }
        }
    }

    //cc.log("获得对应皮肤:",curSkin,arry,isTrueSkin);

    return isTrueSkin;
}

//获得魔法表情名称
TexasUtils.prototype._getMagicFaceName = function (MagicFace) {
    let faceName = "tomato";//番茄
    if (MagicFace==2) {
        faceName = "kiss";//飞吻
    }else if (MagicFace==3) {
        faceName = "cheers";//干杯
    }else if (MagicFace==4) {
        faceName = "bomb";//炸弹
    }else if (MagicFace==5) {
        faceName = "catchChicken";//捉鸡
    }else if (MagicFace==6) {
        faceName = "rose";//鲜花
    }else if (MagicFace == 7){
        faceName = "jiatelin"; //加特林
    }else if (MagicFace == 8){
        faceName = "shayu"; //鲨鱼
    }else if (MagicFace == 9){
        faceName = "motou"; //摸头
    }else if (MagicFace == 10){
        faceName = "dianzan"; //点赞
    }else if (MagicFace == 11){
        faceName = "huojian"; //火箭
    }

    return faceName;
}

//资源数组
TexasUtils.prototype._getSpriteFrameArry = function (atlas,key) {
    let frames = [];

    var sprites = atlas.getSpriteFrames();
    for(let i=0;i<sprites.length;i++){
        let name = sprites[i].name;
        if (name.indexOf(key)!=-1) {//包含字符串
            frames.push(sprites[i]);
        }
    }

    let rankFrames = [];
    for (let k=0; k<frames.length; k++) {
        let keyItem = key + "_" + k;

        for (let j=0; j<frames.length; j++) {
            let framesItem = frames[j];

            if (keyItem==framesItem.name) {
                if (this._getClub() && key=="cheers") {
                    if (k>=8) {
                        continue;
                    }
                }

                rankFrames.push(framesItem);

                break;
            }
        }
    }

    return rankFrames;
}

//资源
TexasUtils.prototype._getSpriteFrame = function (atlas,node,str) {
    node.active = false;
    
    let spriteFrame = atlas.getSpriteFrame(str+"");
    if(spriteFrame){
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        node.active = true;
    }
}

//俱乐部
TexasUtils.prototype._getClub = function () {
    let club = app.config.IS_CLUB_ONLY?true:false;
   
    return club;
}

//俱乐部牌桌玩家位置
TexasUtils.prototype._getClubPlayerPos = function (num) {
    let arry = [1,2,3,4,5,6,7,8,9];
    if (this._getClub()) {
        if (num==1) {
            arry = [1];
        }else if (num==2) {
            arry = [1,3];
        }else if (num==3) {
            arry = [1,4,7];
        }else if (num==4) {
            arry = [1,3,5,8];
        }else if (num==5) {
            arry = [1,3,5,6,8];
        }else if (num==6) {
            arry = [1,2,4,5,7,9];
        }else if (num==7) {
            arry = [1,2,4,5,6,7,9];
        }else if (num==8) {
            arry = [1,2,3,4,5,7,8,9];
        }
    }

    return arry;
}

//筹码转换
TexasUtils.prototype._changeChipByConfig = function (count) {
    count = parseInt(count);

    if (count<=1) return [1];

    let arry = [];

    //筹码配置
    let chipConfig = [1,5,10,50,100,500,1000,5000,10000,50000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000];
    let maxChipCount = chipConfig[0];

    let len = chipConfig.length;
    maxChipCount = Number(chipConfig[len-1]);
    if (count>=maxChipCount) {
        count = maxChipCount;
    }
    
    let chipData = this._createChipData(chipConfig,count,arry);

    cc.log("筹码值数组:",Utils.clone(chipData));

    let indexData = [];
    if (chipData && chipData.length>0) {
        for (let i=0; i<chipData.length; i++) {
            let chip = chipData[i];

            for (let j=0; j<chipConfig.length; j++) {
                let config = chipConfig[j];

                if (Number(chip)==Number(config)) {
                    indexData.push(j+1);
                    
                    break;
                }

            }

        }

    }

    cc.log("筹码索引:",Utils.clone(indexData));
    indexData = indexData.length<=0?[1]:indexData;

    if (indexData.length>10) {
        for(let i = indexData.length - 1; i >= 0; i--){
            if (i>9) {
                indexData.splice(i,1)
            }
        }
        cc.log("筹码索引2:",Utils.clone(indexData));
    }
    
    indexData.sort(function(a,b){//从大到小排列
        return b - a;
    });

    return indexData;
}

//构建筹码数据
TexasUtils.prototype._createChipData = function (config,count,arry) {
    let len = config.length;
    let maxCount = config[0];

    if (count<=config[0]) {//筹码值区间在筹码表第一个值之内取第一个值
        if (arry.length<=0) {
            arry = [config[0]];
        }else {
            arry.push(config[0]);

            return arry;
        }
    }else if(count<=Number(config[len-1])) {//筹码值在筹码表范围内
        for (let i=0; i<len; i++) {
            let chip = config[i];

            if (count>=chip) {
                maxCount = chip;
            }
        }
    }else {//筹码值超过筹码表
        maxCount = config[len-1];
    }

    let intCount = parseInt(count/Number(maxCount));
    for (let i=0; i<intCount; i++) {
        arry.push(maxCount);
    }
    let sum = count - (Number(intCount) * Number(maxCount));
    if (Number(sum)>0) {
        return this._createChipData(config,sum,arry);
    }else {
        return arry;
    }
}

//刷新方形进度条
TexasUtils.prototype._refreshParticle = function (square,progress,fillRange) {
    let W = square.width / 2 - 1;
    let H = square.height / 2 - 1;
    let A = Math.atan(W / H)

    let x = 0;
    let y = 0;

    let PI = Math.PI;
    let cur_fill = 1 - fillRange;
    let a = PI * 2 * cur_fill;

    if (a >= 0 && a <= A) {
        y= H
        x= y * Math.abs(Math.tan(a))
    }else if (a > A && a <= PI/2) {
        x = W
        y = x / Math.abs(Math.tan(a))
    }else if (a > PI/2 && a <= PI - A) {
        x = W
        y = -x / Math.abs(Math.tan(a))
    }else if (a > PI - A && a <= PI) {
        y = -H
        x = -y * Math.abs(Math.tan(a))
    }else if (a > PI && a <= PI + A) {
        y = -H
        x = y * Math.abs(Math.tan(a))
    }else if (a > PI + A && a <= 3/2 * PI) {
        x = -W
        y = x / Math.abs(Math.tan(a))
    }else if (a > 3/2 * PI && a <= 2 * PI - A) {
        x = -W
        y = -x / Math.abs(Math.tan(a))
    }else if (a > 2 * PI - A && a <= 2 * PI) {
        y= H
        x = -y * Math.abs(Math.tan(a))
    }
    
    progress.x = square.x + x - 1;
    progress.y = square.y + y; 
}

//提示
TexasUtils.prototype._getText = function (index,gold) {
    let TexasData = require("TexasData");
    let currency = TexasData._getCurrency();//获得当前所用币种
    if (this._getSkin(["c"]) && Number(currency)!=1) {
        if (index==6) {
            index = 89;
        }else if (index==8) {
            index = 90;
        }else if (index==11) {
            index = 91;
        }else if (index==49) {
            index = 92;
        }else if (index==74) {
            index = 93;
        }
    }

    let text = i18n.t("gameTip." + index);
    if (Number(gold)>=0) {
        gold = this._saveTwoPoint(gold);

        text = text.replace(/\[XXX\]/g, gold);
    }

    return text;
},

//处理返回的保险数据
TexasUtils.prototype.handleInsureData = function(data) {
    if(!data || data.length === 0) return []
    let insure = []
    let userInsure = {}
    //userId对应数据 {id: []}
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let userArr = userInsure[element.nInsurUserId]
        element.arrInsurancePlan = element.arrInsurancePlan.sort((a, b) => {
            return b.nCosts - a.nCosts
        })
        if(userArr) {
            userArr.push(element)
        }else {
            userInsure[element.nInsurUserId] = [element]
        }
    }
    //处理 insure =[ {arrInsurPanelData: []}]
    for (const key in userInsure) {
        if (!Object.hasOwn(userInsure, key)) continue;
        const element = userInsure[key];
        let item = {}
        for (let j = 0; j < element.length; j++) {
            const element2 = element[j];
            if(j == 0) {
                item = element2
                item.arrInsurPanelData = [element2]
            }else {
                item.arrInsurPanelData.push(element2)
            }
        }
        insure.push(item)
    }

    return insure
},

//播放音乐
TexasUtils.prototype._playEffect = function (path,isChinese) {
    if (isChinese) {
        if (app.config.LANG == "en" || app.config.LANG == "th" || app.config.LANG == "vi") return;
    }

    return app.texas.audio.playEffect(path);
}

//将当前节点坐标位置转换为目标节点父节点下的坐标位置
TexasUtils.prototype._getNodePos = function (curNode, targetNode) {
    let worldPos = curNode.parent.convertToWorldSpaceAR(curNode.position);
    let pos = targetNode.parent.convertToNodeSpaceAR(worldPos);

    return pos;
}

TexasUtils.prototype._setDzFrameRate = function(frameRate){
    if (this._getClub()){
        cc.game.setFrameRate(60);
    }else{
        cc.game.setFrameRate(frameRate);
    }
    
},

//获得经纬度
TexasUtils.prototype._getLongAndLatitude = function (callback) {
    if (!window['qygameengine']) {
        callback();

        return;
    }

    if(window['qygameengine'] && qygameengine.MessageManager){
        qygameengine.MessageManager.getInstance().setOtherCallback((json)=>{
            if(typeof json == 'string'){
                try {
                    let data = JSON.parse(json);
                    if(data.key == "GET_LOCATION"){
                        if (data.result=="success") {
                            let longitude = data.longitude;//精度
                            let latitude = data.latitude;//纬度
                            LocalStorage.setItem("CLUB_LONGITUDE_AND_LATITUDE", JSON.stringify({nLongitude: longitude, nLatitude: latitude}));
                            callback(longitude,latitude);
                        }else {
                            callback();
                        }
                    }
                    cc.log("setOtherCallback data = ",data)
                } catch (error) {
                    cc.error("qygameengine.MessageManager.setOtherCallback " + error);
                }
            }
        });
    }
    //获取精度纬度
    if(window['qygameengine'] && qygameengine.PlatformCommon){
        let location = qygameengine.PlatformCommon.getLocation(1)
    }
}

//是否比赛牌桌
TexasUtils.prototype._isMatchTable = function () {
    let TexasData = require("TexasData")
    
    let tableType = TexasData.getMatchType();
    if (tableType && tableType == 10){
        return true;
    }

    return false;
}

TexasUtils.prototype.setPokerAtlas = function(atlas){
    this._pokerAtlas = atlas;
}


/****************************************app接口****************************************/
/**
 * 获取牌桌信息后调用此消息获取牌桌用户mic配置，传入需要获取mic开关的userid列表
 * 注：通过监听 app.native.on(app.bridge.ACTION.APP_ACTION_MIC_STATUS, callback, target) 接收结果
 */
TexasUtils.prototype.getMicStatus = function (arry) {
    cc.warn("-------------------------------------------------------------------------------APP 获取牌桌用户mic配置",arry);
    if (arry.length > 0 && app.native.getMicStatus){
        app.native.getMicStatus(arry);
    }
}

 /**
 * 1 询问退出子游戏
 * 主播身份点击退出按钮通知APP弹出提示：是否结束直播；用户点击通知APP直接退出直播间
 */
TexasUtils.prototype.toggleExitGame = function () {
    cc.warn("-------------------------------------------------------------------------------APP 通知APP直接退出直播间");
    if (this._getSkin(["b"])) {
        // app.game.exitToHall();
        app.game.getGame().enterRoomView();
    }else if (this._getSkin(["c"])) {
        app.game.exitToHall();
    }else {
        if (app.game.getGame()) {
            let data = app.game.getGame().getSubGameData();
            let gameId = data.nGameId || 0;
            app.native.toggleExitGame(gameId);
        }
    }
}

//开关麦克风
TexasUtils.prototype.micSwitch = function (isOpen,sShopAcc) {
    cc.warn("-------------------------------------------------------------------------------APP 开关麦克风:",isOpen,sShopAcc);
    let switchs = isOpen?"on":"off";
    app.storage.setItem("Texas_mike", switchs);
    app.native.toggleMic(isOpen);
    app.native.setMicStatus(sShopAcc, isOpen);
}

//开启/关闭整个房间的语音
TexasUtils.prototype.toggleRoomVoice = function (isOpen,value) {
    cc.warn("-------------------------------------------------------------------------------APP 开启/关闭整个房间的语音:",isOpen,value);
    app.native.toggleRoomVoice(isOpen);
    app.storage.setItem("Texas_room_voice",value);
}

//开启/关闭礼物特效
TexasUtils.prototype.toggleGiftEffect = function (isOpen,value) {
    cc.warn("-------------------------------------------------------------------------------APP 开启/关闭礼物特效:",isOpen,value);
    app.native.toggleGiftEffect(isOpen);
    app.storage.setItem("Texas_gift_effect",value);
}

//开启/关闭设置的语音
TexasUtils.prototype.toggleSystemVoice = function (isOpen,value) {
    cc.warn("-------------------------------------------------------------------------------APP 开启/关闭设置的语音:",isOpen,value);
    app.native.toggleSystemVoice(isOpen);
    app.storage.setItem("Texas_system_voice",value);
}

//打赏
TexasUtils.prototype.toggleReward = function (sShopAcc, sName) {
    cc.warn("-------------------------------------------------------------------------------APP 打赏:",sShopAcc, sName);
    app.native.toggleReward(sShopAcc, sName);
}

//打开兑换窗口
TexasUtils.prototype.toggleExchange = function () {
    cc.warn("-------------------------------------------------------------------------------APP 打开兑换窗口");
    app.native.toggleExchange();
}

//打开在线用户列表
TexasUtils.prototype.toggleOnlinePlayer = function () {
    cc.warn("-------------------------------------------------------------------------------APP 打开在线用户列表");
    app.native.toggleOnlinePlayer();
}

//在线客服，点击唤起QQ
TexasUtils.prototype.toggleOnlineService = function () {
    cc.warn("-------------------------------------------------------------------------------APP 在线客服，点击唤起QQ");
    app.native.toggleOnlineService();
}

//贡献榜（点击打开/关闭APP的贡献榜列表）
TexasUtils.prototype.toggleGongXianBang = function () {
    cc.warn("-------------------------------------------------------------------------------APP 贡献榜");
    app.native.toggleGongXianBang();
}

//屏蔽消息
TexasUtils.prototype.shieldRewardMessage = function () {
    cc.warn("-------------------------------------------------------------------------------APP 屏蔽消息");
    app.native.shieldRewardMessage();
}

//打开管理列表
TexasUtils.prototype.manageList = function () {
    cc.warn("-------------------------------------------------------------------------------APP 打开管理列表");
    app.native.manageList();
}

//打开管理规则
TexasUtils.prototype.manageRule = function () {
    cc.warn("-------------------------------------------------------------------------------APP 打开管理规则");
    app.native.manageRule();
}

//打开管理功能
TexasUtils.prototype.manageFunction = function () {
    cc.warn("-------------------------------------------------------------------------------APP 打开管理功能");
    app.native.manageFunction();
}

//邀请好友
TexasUtils.prototype.inviteFriends = function () {
    cc.warn("-------------------------------------------------------------------------------APP 邀请好友");
    app.native.inviteFriends();
}

//申请列表
TexasUtils.prototype.applyList = function () {
    cc.warn("-------------------------------------------------------------------------------APP 申请列表");
    app.native.applyList();
}

//分享
TexasUtils.prototype.share = function () {
    cc.warn("-------------------------------------------------------------------------------APP 分享");
    app.native.share();
}

//用户信息弹窗(点击主播头像与PK用户头像需通知APP唤起用户信息弹窗) 
TexasUtils.prototype.toggleUserInfo = function (sShopAcc,name) {
    cc.warn("-------------------------------------------------------------------------------APP 用户信息弹窗:",sShopAcc,name);
    app.native.toggleUserInfo(sShopAcc,name);
}

//用户上桌
TexasUtils.prototype.tableUserSitdown = function (sShopAcc,isPlaying) {
    cc.warn("-------------------------------------------------------------------------------APP 用户上桌:",sShopAcc,isPlaying);
    if (sShopAcc) {
        app.native.tableUserSitdown(sShopAcc);

        // if (isPlaying) {
        //     this.updateUserStatus("playing");
        // }
    }

}

//用户下桌
TexasUtils.prototype.tableUserStandup = function (sShopAcc) {
    cc.warn("-------------------------------------------------------------------------------APP 用户下桌:",sShopAcc);
    if (sShopAcc) {
        app.native.tableUserStandup(sShopAcc);
        // this.updateUserStatus("idle");
    }
}

//当前玩家游戏状态更新 ['idle' , 'playing']
TexasUtils.prototype.updateUserStatus = function (state) {
    cc.warn("-------------------------------------------------------------------------------APP 当前玩家游戏状态更新:",state);
    app.native.updateUserStatus(state);
}

//当前游戏状态更新 ["idle", "playing"]
TexasUtils.prototype.updateGameStatus = function (state) {
    cc.warn("-------------------------------------------------------------------------------APP 当前游戏状态更新:",state);
    app.native.updateGameStatus(state);
}

//通知 app 打开充值界面
TexasUtils.prototype.toggleRecharge = function (callback,tryGame) {
    cc.warn("-------------------------------------------------------------------------------APP 通知打开充值界面");
    if (!callback) return;

    if (!tryGame) {
        let result = app.native.invokeFunction("toggleRecharge", -1);
        if(result.success && result.data){
            return;
        }
    }
    
    callback();
}

let object = new TexasUtils();

module.exports = object; 