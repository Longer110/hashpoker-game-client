//俱乐部大厅缓存数据
let i18n = require("i18n");
let Base64 = require("base64");

let HallClubCacheData = cc.Class({
    extends: Object,

    ctor() {
        this.initData();
    },

    initData() {
        this._clubList = null;
        this._playerData = [];
        this._curLoginClub = null;
        this._curClubData = {};
        this._playBackData = {};
        this._changeClubCount = 0;
        this._gameConfig = null;
        this._gameTemplateConfig = null;

        this._coinConfig = null
        this._tgServernConfig = ""
    },

    //玩家俱乐部列表
    setClubList(data) {
        this._clubList = data;
        if (this._clubList) {
            //大厅放在最前面
            this._clubList.sort(function (a, b) {
                let aId = a.nClubId == 0 ? 2 : 1;
                let bId = b.nClubId == 0 ? 2 : 1;
                return bId - aId;
            })
        }
    },

    //获取玩家俱乐部列表
    getClubList() {
        if (this._clubList) {
            for (let i = 0; i < this._clubList.length; i++) {
                if (this._clubList[i].nClubId == 0) {
                    //大厅
                    this._clubList[i].sClubName = i18n.t("CLUB_HALL.HALL");
                }

            }
        }

        return this._clubList;
    },

    //设置当前俱乐部信息
    setCurClubData(data) {
        this._curClubData = data;
        this._playerData = data.tMyself;

    },

    getCurClubData() {
        return this._curClubData;
    },


    getPlayerData() {
        return this._playerData;
    },

    setCurLoginClub(id) {
        this._curLoginClub = id;
    },

    getCurLoginClub() {
        return this._curLoginClub;
    },

    //俱乐部场景信息修改
    sceneChange(data) {
        if (this._curClubData.nClubId == data.nClubId) {
            for (var key in this._curClubData) {
                if (data.hasOwnProperty(key)) {
                    this._curClubData[key] = data[key];
                }
            }
        }

        if (!this._clubList || this._clubList.length == 0) {
            return;
        }

        if (data.sClubName) {
            for (let i = 0; i < this._clubList.length; i++) {
                if (this._clubList[i].nClubId == data.nClubId) {
                    this._clubList[i].sClubName = data.sClubName;
                    break;
                }

            }
        }

    },

    //俱乐部个人信息变化
    userInfoChange(data) {
        if (this._playerData.nClubId == data.nClubId) {
            for (var key in this._playerData) {
                if (data.hasOwnProperty(key)) {
                    this._playerData[key] = data[key];
                    this._curClubData.tMyself[key] = data[key];
                }
            }
        }

    },

    playerGoldChange(nGold) {
        if (!this._playerData) {
            return;
        }

        this._playerData.nGold += nGold;
    },


    //保存牌局回放数据
    savePlayBackData(data) {
        this._playBackData = data;
    },

    getPlayBackData() {
        return this._playBackData;
    },

    //踢出俱乐部
    kickOutClub(nClubId) {
        for (let i = 0; i < this._clubList.length; i++) {
            if (this._clubList[i].nClubId == nClubId) {
                this._clubList.splice(i, 1);
                break;
            }

        }
    },

    setChangeClubCount(count) {
        this._changeClubCount = count;
    },

    getChangeClubCount() {
        return this._changeClubCount;
    },

    changeHead(sFaceId) {
        if (this._playerData) {
            this._playerData.sFaceId = sFaceId;
        }

        if (this._curClubData) {
            this._curClubData.tMyself.sFaceId = sFaceId;
        }
    },

    setCreateGameConfig(data) {
        if (!this._gameConfig) {
            this._gameConfig = {};
        }
        if (data.nGameId) {
            this._gameConfig[data.nGameId] = data;
        } else {
            this._gameConfig[125] = data;
        }

    },

    getCreateGameConfig(gameId) {
        if (!this._gameConfig) {
            return;
        }

        return this._gameConfig[gameId];
    },

    setIsBlindPlayer(bBlind) {
        this._isBlindPlayer = bBlind;
    },

    getIsBlindPlayer() {
        return this._isBlindPlayer;
    },

    setReConfig(data) {
        let tmp = Base64.decode(data);
        this._reConfig = JSON.parse(tmp);
    },

    getReConfig() {
        return this._reConfig;
    },

    //re and wid config
    setTransferWay(data) {
        this._transferWay = data;
    },

    getTransferWay() {
        return this._transferWay;
    },
    //内部转币开关
    setClubConfig(transferOpen) {
        this._transferOpen = transferOpen;
    },

    getClubConfig() {
        return this._transferOpen;
    },




    // "{\"transferOpen\":{\"open\":1},\"costConfigs\":{\"open\":0,\"Hash\":8877,\"TouTouKan\":1377,\"FaFaKan\":7777}}"
    //设置所有花费配置
    setClubCoinConfig(config) {
        this._coinConfig = config;
    },


    getClubCoinConfig() {
        return this._coinConfig;
    },

    setClubTGServerConfig(config) {
        this._tgServernConfig = config.tgLink;

    },


    getClubTGServerConfig() {

        return this._tgServernConfig ? this._tgServernConfig : "https://t.me/kkpoker_vip";
    },

    _getNodeGlobal() {
        try {
            if (typeof globalThis === "object" && globalThis) {
                return globalThis;
            }
        } catch (e) {}
        try {
            if (typeof window === "object" && window) {
                return window;
            }
        } catch (e) {}
        try {
            if (typeof self === "object" && self) {
                return self;
            }
        } catch (e) {}
        return null;
    },

    _hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    _isNodeBufferAvailable() {
        var g = this._getNodeGlobal();
        if (!g) {
            return false;
        }
        try {
            if (typeof g["Buffer"] === "function") {
                return true;
            }
        } catch (e) {}
        try {
            var runtimeKey = "proc" + "ess";
            if (this._hasOwn(g, runtimeKey)) {
                var runtime = g[runtimeKey];
                if (runtime && typeof runtime === "object") {
                    var versions = runtime["versions"];
                    if (versions && typeof versions === "object" && versions["node"]) {
                        return true;
                    }
                }
            }
        } catch (e) {}
        return false;
    },

    safeDecodeBase64(str) {
        if (!str || str === "") return "";
        try {
            let decoded = Base64.decode(str);
            if (decoded) return decoded;
        } catch (e) {}
        try {
            if (typeof atob === "function") {
                return decodeURIComponent(escape(atob(str)));
            }
        } catch (e) {}
        try {
            if (this._isNodeBufferAvailable()) {
                var g = this._getNodeGlobal();
                var BufferCtor = g && g["Buffer"];
                if (typeof BufferCtor === "function") {
                    var b;
                    if (typeof BufferCtor.from === "function") {
                        b = BufferCtor.from(str, "base64");
                    } else {
                        b = new BufferCtor(str, "base64");
                    }
                    return b.toString("utf8");
                }
            }
        } catch (e) {}
        return str;
    },

    _looksLikeBase64Encoded(str) {
        if (!str || typeof str !== "string") return false;
        if (str.length === 0) return false;
        if (/[\u4e00-\u9fa5]/.test(str)) return false;
        if (/[ \t\n\r]/.test(str)) return false;
        try {
            let decoded = Base64.decode(str);
            if (!decoded || decoded.length === 0) return false;
            if (decoded === str) return false;
            if (/[\u4e00-\u9fa5]/.test(decoded)) return true;
            if (/^[A-Za-z0-9_\- @#$%^&*()+=,.!?/\\|'"<>{}\[\];:~`]+$/.test(decoded)) return true;
            return false;
        } catch (e) {
            return false;
        }
    },

    mapRestClubItemToWs(restItem) {
        if (!restItem) return null;
        let wsItem = {};
        let _pick = function(){
            for (let i = 0; i < arguments.length; i++) {
                let k = arguments[i];
                if (restItem[k] !== undefined && restItem[k] !== null) return restItem[k];
            }
            return undefined;
        };
        wsItem.nClubId = _pick("clubId","ClubId","nClubId","club_id","id") || 0;
        let rawName = _pick("clubName","ClubName","sClubName","club_name","name");
        if (typeof rawName === "string" && rawName.length > 0) {
            try {
                let isB64 = this._looksLikeBase64Encoded(rawName);
                if (isB64) {
                    let decoded = this.safeDecodeBase64(rawName);
                    wsItem.sClubName = Base64.encode(decoded || rawName);
                    wsItem._clubNamePlain = decoded || rawName;
                } else {
                    wsItem.sClubName = Base64.encode(String(rawName));
                    wsItem._clubNamePlain = String(rawName);
                }
            } catch (e) {
                try {
                    wsItem.sClubName = Base64.encode(String(rawName));
                    wsItem._clubNamePlain = String(rawName);
                } catch (e2) {
                    wsItem.sClubName = "";
                    wsItem._clubNamePlain = "";
                }
            }
        } else {
            let fallbackName = "俱乐部" + (wsItem.nClubId || "");
            wsItem.sClubName = Base64.encode(fallbackName);
            wsItem._clubNamePlain = fallbackName;
        }
        let rawMaster = _pick("masterName","MasterName","sMasterName","master_name","master","OwnerName","owner_name");
        if (typeof rawMaster === "string" && rawMaster.length > 0) {
            try {
                let isB64 = this._looksLikeBase64Encoded(rawMaster);
                if (isB64) {
                    let decoded = this.safeDecodeBase64(rawMaster);
                    wsItem.sMasterName = Base64.encode(decoded || rawMaster);
                    wsItem._masterNamePlain = decoded || rawMaster;
                } else {
                    wsItem.sMasterName = Base64.encode(String(rawMaster));
                    wsItem._masterNamePlain = String(rawMaster);
                }
            } catch (e) {
                try {
                    wsItem.sMasterName = Base64.encode(String(rawMaster));
                    wsItem._masterNamePlain = String(rawMaster);
                } catch (e2) {
                    wsItem.sMasterName = "";
                    wsItem._masterNamePlain = "";
                }
            }
        } else {
            wsItem.sMasterName = "";
            wsItem._masterNamePlain = "";
        }
        wsItem.nMasterId = _pick("masterId","MasterId","nMasterId","master_id","owner_id","OwnerId") || 0;
        wsItem.sFaceId = _pick("avatar","Avatar","logo","Logo","clubLogo","ClubLogo","logoUrl","LogoUrl","sFaceId","FaceId","faceId") || "";
        wsItem.Avatar = wsItem.sFaceId;
        wsItem.nUserCnt = _pick("memberCount","MemberCount","nUserCnt","member_count","memberCnt") || 0;
        wsItem.nMaxUserCnt = _pick("maxUserCnt","MaxMemberCount","nMaxUserCnt","max_member_count","maxMemberCount") || 999;
        wsItem._isFull = (wsItem.nMaxUserCnt && wsItem.nUserCnt >= wsItem.nMaxUserCnt) ? true : false;
        wsItem.InviteCode = _pick("InviteCode","sInviteCode","invite_code","inviteCode") || "";
        wsItem.GroupId = _pick("groupId","GroupId","nGroupId","group_id","hallId","HallId") || 0;
        wsItem.CanApply = _pick("canApply","CanApply","can_apply");
        if (wsItem.CanApply === undefined || wsItem.CanApply === null) wsItem.CanApply = 0;
        wsItem.CanSearch = _pick("canSearch","CanSearch","can_search");
        if (wsItem.CanSearch === undefined || wsItem.CanSearch === null) wsItem.CanSearch = 0;
        wsItem._joinedRaw = _pick("joined","_joined","isMember","is_member");
        wsItem.nStatus = _pick("status","nStatus","_status");
        if (wsItem.nStatus === undefined || wsItem.nStatus === null) wsItem.nStatus = 0;
        if (wsItem._joinedRaw === true) wsItem.nStatus = 2;
        else if (restItem.applied === true) wsItem.nStatus = Math.max(wsItem.nStatus, 1);
        if (wsItem.nStatus === 0) {
            if (wsItem._isFull) wsItem.nStatus = 4;
            else if (wsItem.CanApply === 1) wsItem.nStatus = 3;
        }
        wsItem._restRaw = restItem;
        return wsItem;
    },

    mapMyClubInfoRsp(rsp) {
        if (!rsp) return null;
        let out = {};
        let d = rsp.data || rsp;
        let _pick = function(obj){
            for (let i = 1; i < arguments.length; i++) {
                let k = arguments[i];
                if (obj[k] !== undefined && obj[k] !== null) return obj[k];
            }
            return undefined;
        };
        out.state = _pick(d, "state") || "none";
        out.inClub = _pick(d, "inClub","in_club") ? true : false;
        out.hallId = _pick(d, "hallId","HallId","hall_id") || 0;
        out.userId = _pick(d, "userId","UserId","user_id") || 0;
        out.myIdentify = _pick(d, "myIdentify","MyIdentify","my_identify") || 0;
        out.myIdentity = _pick(d, "myIdentity","MyIdentity","my_identity") || "";
        out.club = null;
        let clubRaw = _pick(d, "club","Club");
        if (clubRaw && typeof clubRaw === "object") {
            out.club = this.mapRestClubItemToWs(clubRaw);
            if (!out.club.ClubId) out.club.ClubId = _pick(clubRaw,"ClubId","nClubId","club_id") || 0;
            if (!out.club.GroupId) out.club.GroupId = _pick(clubRaw,"GroupId","groupId") || 0;
        }
        return out;
    },

    mapJoinClubRsp(rsp) {
        if (!rsp) return null;
        var d = rsp.data || rsp;
        var out = {};
        var _pick = function(obj){
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (obj[k] !== undefined && obj[k] !== null) return obj[k];
            }
            return undefined;
        };
        out.joined = _pick(d, "joined") === true ? true : false;
        out.clubId = _pick(d, "clubId","ClubId","nClubId") || 0;
        out.userId = _pick(d, "userId","UserId") || 0;
        out.memberCount = _pick(d, "memberCount","MemberCount","member_count","nUserCnt") || 0;
        out.myIdentify = _pick(d, "myIdentify","MyIdentify") || 0;
        out.myIdentity = _pick(d, "myIdentity","MyIdentity") || "";
        out.club = null;
        var clubRaw = _pick(d, "club","Club");
        if (clubRaw && typeof clubRaw === "object") {
            out.club = this.mapRestClubItemToWs(clubRaw);
            if (!out.clubId && out.club) {
                out.clubId = out.club.nClubId || out.club.ClubId || 0;
            }
        }
        return out;
    },

    setRecommendClubList(data) {
        this._recommendClubList = data || [];
    },

    getRecommendClubList() {
        return this._recommendClubList || [];
    },

    setSearchedClubList(data) {
        this._searchedClubList = data || [];
    },

    getSearchedClubList() {
        return this._searchedClubList || [];
    },

});

let object = new HallClubCacheData();
module.exports = object;
