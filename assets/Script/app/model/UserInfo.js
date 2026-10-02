// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Base64 = require("base64");
// let LocalStorage = require("LocalStorage");

//登录方式
let ELoginType = cc.Enum({
    NONE: 0,    //未授权，不能登录
    ACCOUNT: 1, //账号登录
    GUEST: 2,   //游客登录
    TOKEN: 3,   //token登录
    VIEWER: 4,  //观众登录
    PHONE: 5,  //手机登录
    MAILBOX: 6,  //邮箱登录
    TELEGRAM: 7,  //tg登录
});

let INFO = cc.Class({
    extends: Object,

    properties: {
        nUserID: 0,
        strName: "",
        nGold: 0,
        nSex:0,
        token: "",
        gameid: "",
        tableid: "",
        loginType: ELoginType.NONE,
        boolHasLogined: false,  //账号是否已登录
        boolHallLogined: false, //大厅是否已登录
        

        __strNickName: "[null]",
        strNickName: {
            set(value){
                this.__strNickName = value;
            },
            get(){
                return this.__strNickName;
            }
        },

        strNickNameBase64: {
            set(value){
                let result = Base64.decode(value);
                if (result==value) {
                    QYLogs.error("UserInfo", "昵称base64解码失败: value="+value);
                }
                if(result!=this.strNickName){
                    this.strNickName = result;
                }
            },
            get(){
                let result = Base64.encode(this.strNickName);
                if (result==this.strNickName) {
                    QYLogs.error("UserInfo", "昵称base64编码失败: value="+this.strNickName);
                }
                return result;
            },
        },
        
        strHeadUrl: "1",
        nVisitor:2,
        nClubId: 0, //俱乐部id
        sMail: '', //绑定邮箱
        nOpenProtection: null, //是否有设置交易密码 0 未设置，1 已设置
        nGoldConvertType:1,//金币转换类型
        nCreateTime : "", // 创建时间
        nLoginCount: 0,  //登录次数
        nFreeCount: 0,   //免费改名次数
        nPrice: 0,       //改名价格
    },

    ctor(){
        // this.nUserID = Number(Utils.randomInt(9, 1) + "" + Utils.createUUID(5, 10));
    },
});

let UserInfo = cc.Class({
    extends: Object,

    properties: {
        _info: null,
    },

    ctor(){
        this._info = new INFO();
        this.ELoginType = ELoginType;
    },

    //账号是否已登录
    isLogin(){
        let info = this.getInfo();
        if(info.boolHasLogined && !info.boolHallLogined){
            cc.log("[WARN] UserInfo isLogin: 账号已登录，但还没登录大厅");
        }
        let result = info.boolHasLogined && info.boolHallLogined;
        return result;
    },
    isViewer(){
        return this.getLoginType()==ELoginType.VIEWER;
    },
    isGuest(){
        return this.getLoginType()==ELoginType.GUEST;
    },
    isAccount(){
        return this.getLoginType()==ELoginType.ACCOUNT;
    },
    isToken(){
        return this.getLoginType()==ELoginType.TOKEN;
    },
    getLoginType(){
        return this.getInfo().loginType;
    },
    clearGame(){
        this.setInfo({
            gameid: "",
            tableid: "",
        });
    },

    //获取用户数据
    getInfo(){
        return this._info;
    },
    setInfo(objInfo){
        cc.log(' ----- 设置 UserInfo ---- ', objInfo)
        if(typeof(objInfo) != "object") return;
        for (const key in objInfo) {
            if(this._info[key] !== undefined ){
                const element = objInfo[key];
                if((typeof this._info[key]) !== typeof element){
                    //gameid目前为number和string都可以兼容，先去掉warn
                    key!="gameid"&&cc.warn("TYPE ERROR--> key:[" + key + "], type:" + (typeof this._info[key]) + "!=" + (typeof element) );
                }
                this._info[key] = element;
            }
            else{
                cc.error("UserInfo", "属性未定义: key="+key);
            }
        }
    },
    
    //读取本地数据
    getLocalItem(key, defaultValue){
        return app.storage.getUserItem(this.getInfo().nUserID, key, defaultValue);
    },
    setLocalItem(key, value){
        return app.storage.setUserItem(this.getInfo().nUserID, key, value);
    },
});

let object = new UserInfo();
module.exports = object;
