let AppWebApi = {
    host(){
        let _host = ""; 
        if(app.config.WEBAPI_HOST_TEST&&app.config.WEBAPI_HOST_TEST!=""){
            _host = app.config.WEBAPI_HOST_TEST;
        }
        else{
            if(app.config.ENABLE_CHANNEL && app.config.GATEWEBAPI_URL!=""){
                _host = app.config.GATEWEBAPI_URL;
            }
            else if(app.config.ISDEVELOP){
                _host = "https://platform.deaizhou.com";
            }
            else{
                if(my.url.get("client")==1){
                    _host = "http://platform.deaizhou.com"; 
                }
                else{
                    _host = "https://platform.deaizhou.com";
                }
            }
        }
        
        return _host;
    },

    getToken(account, callback){
        let method = "GET";
        let url = this.host() + `/TextAPI/LoginAsync?UserAcounts=${account}`;
    },
    getTableID(account, gameid, callback){
        let method = "GET";
        let url = this.host() + `/TextAPI/CreateGameTableAsync?UserID=${account}&GameID=${gameid}`;
        this.requestRemoteData(method, url, callback, 2);
    },
    closeTable(account, gameid, tableid, callback){
        let method = "GET";
        let url = this.host() + `/TextAPI/CloseGameTableAsync?UserID=${account}&GameID=${gameid}&TableID=${tableid}`;
        this.requestRemoteData(method, url, callback, 3);
    },
    createAccount(account, nickname, callback) {
        let method = "POST";
        let url = this.host() + `/TextAPI/RegistAsync?UserID=${account}&NickName=${nickname}&Channel=default`;
        this.requestRemoteData(method, url, callback, 4);
    },
    getLivePlayer(callback){
        let method = "POST";
        let url = this.host() + `/TextAPI/GetGameTableAsync`;
        this.requestRemoteData(method, url, callback, 5);
    },

    requestRemoteData(method, url, callback, requestId){
        if(app.config.ENABLE_CHANNEL && this.host() === "" && window && window.alert){
            let msg = app.config.CUSTOM.ERROR_SERVER_WEBAPI;
            window.alert(msg);
            return
        }

        var xhr = new XMLHttpRequest(),
            errInfo = 'Load ' + url + ' failed!';
        xhr.open(method, url, true);
        if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
        xhr.onload = function () {
            if(xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    callback(null, xhr.response);
                }
                else {
                    callback({status:xhr.status, errorMessage:errInfo});
                }
            }
        };
        xhr.onerror = function(){
            callback({status:xhr.status, errorMessage:errInfo});
        };
        
        xhr.send(null);
    },

    changeGold(account,OrderNumber,gold,callback){
        if(this.host()!="https://platform.deaizhou.com"){
            return
        }

        let method = "GET";
        let url = this.host() + `/TextAPI/TransferAsync?UserID=${account}&serialNo=${OrderNumber}&Amount=${gold}`;
        this.requestRemoteData(method, url, callback, 6);
    },
    
    getVersion(callback){
        let method = "GET";
        let url = this.host() + `/TextAPI/GetVersion`;
        this.requestRemoteData(method, url, callback, 7);
    },

    getModeVersion(data,callback){
        let method = "GET";
        let url = this.getModelVersionURL(data);
        app.storage.setBundleConfigURL(url);
        this.requestRemoteData(method, url, callback, 8);
    },
    getModelVersionURL(data){
        let host = "http://192.168.31.90:3990"
        let LocalStorage = require("LocalStorage");
        let serverConfig = LocalStorage.getDEVServer();
        if(serverConfig)
        {
            host = "http://" + serverConfig.HOST + ":3990"
        }
        if(app.config.ENABLE_CHANNEL && app.config.GATEWEBAPI_URL!=""){
            host = app.config.GATEWEBAPI_URL;
        }
        
        let url = host + `/API/Version?Platform=${data.platform}`;
        if(data.gamecode){
            url += `&GameCode=${data.gamecode}`
        }
        return url;
    },

    getGamePlayBackData(data,callback){
        let method = "GET";
        let url = this.getPlayBackURL(data);
        this.requestRemoteData(method, url, callback, 9);
    },
    getPlayBackURL(data){
        let host = "https://platform.deaizhou.com"
        if(app.config.ENABLE_CHANNEL && app.config.GATEWEBAPI_URL!=""){
            host = app.config.GATEWEBAPI_URL;
        }
        
        let url = host + "/GetPaiJu?";
        if(data.paijuid){
            url += `&PaiJuId=${data.paijuid}`
        }
        return url;
    },

    getShareGameURL(){
        let url = "https://platform.deaizhou.com/club/game.html";

        if(window.ChannelConfig && window.ChannelConfig.SERVER_SHARE_GAME && window.ChannelConfig.SERVER_SHARE_GAME.length > 0){
            let item = window.ChannelConfig.SERVER_SHARE_GAME[0];
            url = item.HEAD+"://"+item.HOST;
        }
        return url;
    },

    getCustomerInfo(data, callback){
        let method = "GET";
        let url = "https://platform.deaizhou.com/api/ImageFileManage/UploadImage";
        if(window.ChannelConfig && window.ChannelConfig.SERVER_UPLOAD_HEAD && window.ChannelConfig.SERVER_UPLOAD_HEAD.length > 0){
            let item = window.ChannelConfig.SERVER_UPLOAD_HEAD[0];
            url = item.HEAD+"://"+item.HOST;
        }
        url = url.replace("UploadImage", "Contact");
        if (data && data.lang){
            url = url + "?langCode=" + data.lang;
        }
        this.requestRemoteData(method, url, callback, 10);
    },

    _restErrLog(msg){
        try { QYLogs.error("AppWebApi", "[REST-token] " + msg); } catch (e) {
            try { console.error("[AppWebApi][REST-token] " + msg); } catch (e2) {}
        }
    },

    setRestToken(token){
        try {
            if (!token || typeof token !== "string" || token.length === 0) return;
            if (!this._isGameJwt(token)) {
                this._restErrLog("setRestToken 忽略非JWT token（len=" + token.length + " segments=" + token.split(".").length + " prefix=" + token.substring(0, 20) + "...）。按文档 §1.2：Type=3令牌登录返回的是WS重连令牌，不是游戏JWT，调API会 code:7。");
                return;
            }
            this._cachedRestToken = token;
            this._restErrLog("setRestToken 成功（JWT已校验） len=" + token.length + " segments=3 prefix=" + token.substring(0, 8) + "...");
        } catch (e) {
            this._restErrLog("setRestToken 异常: " + e.message);
        }
    },

    getCachedRestToken(){
        try {
            if (this._cachedRestToken && typeof this._cachedRestToken === "string" && this._cachedRestToken.length > 0 && this._isGameJwt(this._cachedRestToken)) {
                return this._cachedRestToken;
            }
        } catch (e) {}
        return "";
    },

    _isGameJwt(token){
        if (!token || typeof token !== "string") return false;
        if (token.length < 30 || token.length > 5000) return false;
        let parts = token.split(".");
        if (parts.length !== 3) return false;
        if (parts[0].length === 0 || parts[1].length === 0 || parts[2].length === 0) return false;
        let h = parts[0];
        if (!/^[A-Za-z0-9_\-]+$/.test(h)) return false;
        return true;
    },

    _getTokenViaOfficialFallback(){
        let TAG = "REST-token";
        let foundToken = "";
        try {
            let LocalStorage = require("LocalStorage");
            let UserKey = require("UserKey");
            let storage = app && app.storage ? app.storage : null;
            let candidates = [];
            try {
                if (UserKey && UserKey.COMMON && UserKey.COMMON.TEMP_TOKEN) candidates.push(UserKey.COMMON.TEMP_TOKEN);
            } catch (e) {}
            try {
                if (UserKey && UserKey.KEY && UserKey.KEY.TEMP_TOKEN) candidates.push(UserKey.KEY.TEMP_TOKEN);
            } catch (e) {}
            candidates.push("TEMP_TOKEN");
            for (let i = 0; i < candidates.length; i++) {
                if (foundToken && foundToken.length > 0) break;
                let tempKey = candidates[i];
                let tempObj = null;
                try {
                    if (storage && typeof storage.getItem === "function") tempObj = storage.getItem(tempKey, null);
                } catch (e) {}
                if (!tempObj) {
                    try {
                        if (LocalStorage && typeof LocalStorage.getItem === "function") tempObj = LocalStorage.getItem(tempKey, null);
                    } catch (e) {}
                }
                if (!tempObj) {
                    try {
                        if (cc && cc.sys && cc.sys.localStorage) {
                            let raw = cc.sys.localStorage.getItem(tempKey);
                            if (raw && raw.length > 0 && raw.charAt(0) === "{") tempObj = JSON.parse(raw);
                        }
                    } catch (e) {}
                }
                if (!tempObj && typeof window !== "undefined") {
                    try {
                        if (window.localStorage) {
                            let raw = window.localStorage.getItem(tempKey);
                            if (raw && raw.length > 0 && raw.charAt(0) === "{") tempObj = JSON.parse(raw);
                        }
                    } catch (e) {}
                }
                if (tempObj && typeof tempObj === "object") {
                    for (let k in tempObj) {
                        if (tempObj.hasOwnProperty(k) && tempObj[k]) {
                            let maybeToken = "";
                            if (typeof tempObj[k] === "string") maybeToken = tempObj[k];
                            else if (typeof tempObj[k] === "object") {
                                maybeToken = tempObj[k].sToken || tempObj[k].token || tempObj[k].gameToken || tempObj[k].webToken || tempObj[k].x_token || tempObj[k].xToken || "";
                            }
                            if (maybeToken && typeof maybeToken === "string" && maybeToken.length > 10 && maybeToken.length < 5000) {
                                foundToken = maybeToken;
                                this._restErrLog("_getTokenViaOfficialFallback hit storage KEY=" + tempKey + " k=" + k + " len=" + foundToken.length + " prefix=" + foundToken.substring(0, 8) + "...");
                                break;
                            }
                        }
                    }
                }
            }
            if (!foundToken || foundToken.length === 0) {
                try {
                    let adminKey = "ADMIN_X_TOKEN";
                    if (typeof ADMIN_X_TOKEN !== "undefined" && ADMIN_X_TOKEN && typeof ADMIN_X_TOKEN === "string" && ADMIN_X_TOKEN.length > 10) {
                        foundToken = ADMIN_X_TOKEN;
                        this._restErrLog("_getTokenViaOfficialFallback hit ADMIN_X_TOKEN global len=" + foundToken.length);
                    }
                    if ((!foundToken || foundToken.length === 0) && storage && typeof storage.getItem === "function") {
                        let t = storage.getItem(adminKey, "");
                        if (t && typeof t === "string" && t.length > 10) {
                            foundToken = t;
                            this._restErrLog("_getTokenViaOfficialFallback hit storage.ADMIN_X_TOKEN len=" + foundToken.length);
                        }
                    }
                    if ((!foundToken || foundToken.length === 0) && LocalStorage && typeof LocalStorage.getItem === "function") {
                        let t = LocalStorage.getItem(adminKey, "");
                        if (t && typeof t === "string" && t.length > 10) {
                            foundToken = t;
                            this._restErrLog("_getTokenViaOfficialFallback hit LocalStorage.ADMIN_X_TOKEN len=" + foundToken.length);
                        }
                    }
                } catch (e) {}
            }
        } catch (eBig) {
            this._restErrLog("_getTokenViaOfficialFallback 异常: " + eBig.message + " " + (eBig.stack || "").substring(0, 200));
        }
        return foundToken;
    },

    restHost(){
        let _host = "https://game-api.hashpoker.vip";
        if(app.config.WEBAPI_HOST_TEST && app.config.WEBAPI_HOST_TEST != ""){
            _host = app.config.WEBAPI_HOST_TEST;
            if(!/^https?:\/\//.test(_host)){
                _host = "https://" + _host;
            }
        }
        else if(app.config.ENABLE_CHANNEL && app.config.GATEWEBAPI_URL != ""){
            _host = app.config.GATEWEBAPI_URL;
        }
        if(_host.endsWith("/")){
            _host = _host.slice(0, -1);
        }
        return _host;
    },

    _getClubToken(){
        let UserInfo = require("UserInfo");
        let LocalStorage = require("LocalStorage");
        let storage = app && app.storage ? app.storage : null;
        let token = "";
        let userInfoObj = null;
        try {
            userInfoObj = UserInfo.getInfo();
        } catch (e) { userInfoObj = {}; }

        try {
            let cached = this.getCachedRestToken();
            if (cached && typeof cached === "string" && cached.length > 10) {
                this._restErrLog("L0 setRestToken内存缓存命中（JWT校验通过） len=" + cached.length + " prefix=" + cached.substring(0,8) + "...");
                return cached;
            }
        } catch (e) {}

        try {
            if (userInfoObj) {
                let urlToken = "";
                if (userInfoObj.token && typeof userInfoObj.token === "string" && userInfoObj.token.length > 0) {
                    urlToken = userInfoObj.token;
                }
                let rupToken = "";
                if (urlToken.length > 0 && storage && typeof storage.getToken === "function") {
                    let t = storage.getToken(urlToken);
                    if (t && typeof t === "string" && t.length > 10) rupToken = t;
                }
                if (!rupToken || rupToken.length === 0) {
                    let t = userInfoObj["sToken"];
                    if (t && typeof t === "string" && t.length > 10) rupToken = t;
                }
                let rupIsJwt = rupToken.length > 0 && this._isGameJwt(rupToken);
                let urlIsJwt = urlToken.length > 0 && this._isGameJwt(urlToken);
                if (rupIsJwt) {
                    token = rupToken;
                    this._restErrLog("L1-OK ★Rup_Logon.sToken 是游戏JWT（3段）★ 命中 len=" + token.length + " prefix=" + token.substring(0,8) + "...");
                } else if (urlIsJwt) {
                    token = urlToken;
                    if (rupToken.length > 0 && !rupIsJwt) {
                        this._restErrLog("L1-FALLBACK 文档 §1.2 命中：Rup_Logon.sToken 不是JWT（segments=" + rupToken.split(".").length + " 是Type=3 WS重连令牌） → 降级用 URL ?token=（它是平台签的游戏JWT） len=" + token.length + " prefix=" + token.substring(0,8) + "...");
                    } else {
                        this._restErrLog("L1 用 URL ?token=（平台签游戏JWT） len=" + token.length + " prefix=" + token.substring(0,8) + "...");
                    }
                } else if (rupToken.length > 0) {
                    this._restErrLog("L1 ★Rup_Logon.sToken 不是有效JWT，且 URL ?token= 也非JWT，仍取 Rup 结果作为最后一次尝试（可能非JWT接口） segments_rup=" + rupToken.split(".").length + " segments_url=" + (urlToken||"").split(".").length);
                    token = rupToken;
                }
            }
            if (token && token.length > 0) {
                if (this._isGameJwt(token)) {
                    try { this.setRestToken(token); } catch (e) {}
                }
                return token;
            }
        } catch (e) {
            this._restErrLog("L1 Rup_Logon.sToken / URL ?token= 获取异常: " + e.message);
        }

        try {
            let UserKey = require("UserKey");
            let candidates = [];
            try {
                if (UserKey && UserKey.COMMON && UserKey.COMMON.TEMP_TOKEN) candidates.push(UserKey.COMMON.TEMP_TOKEN);
            } catch (e) {}
            try {
                if (UserKey && UserKey.KEY && UserKey.KEY.TEMP_TOKEN) candidates.push(UserKey.KEY.TEMP_TOKEN);
            } catch (e) {}
            candidates.push("TEMP_TOKEN");
            for (let ci = 0; ci < candidates.length; ci++) {
                if (token && token.length > 0) break;
                let tempKey = candidates[ci];
                let tempObj = null;
                try { if (storage && typeof storage.getItem === "function") tempObj = storage.getItem(tempKey, null); } catch (e) {}
                if (!tempObj) { try { if (LocalStorage && typeof LocalStorage.getItem === "function") tempObj = LocalStorage.getItem(tempKey, null); } catch (e) {} }
                if (!tempObj) { try { if (cc && cc.sys && cc.sys.localStorage) { let raw = cc.sys.localStorage.getItem(tempKey); if (raw && raw.length > 0 && raw.charAt(0) === "{") tempObj = JSON.parse(raw); } } catch (e) {} }
                if (!tempObj && typeof window !== "undefined") { try { if (window.localStorage) { let raw = window.localStorage.getItem(tempKey); if (raw && raw.length > 0 && raw.charAt(0) === "{") tempObj = JSON.parse(raw); } } catch (e) {} }
                if (tempObj && typeof tempObj === "object") {
                    for (let k in tempObj) {
                        if (tempObj.hasOwnProperty(k) && tempObj[k]) {
                            let v = tempObj[k];
                            let gt = "";
                            if (typeof v === "object") {
                                gt = v.sToken || v.token || v.xToken || v.webToken || v.accessToken || "";
                                if (!this._isGameJwt(gt)) {
                                    let gt2 = v.gameToken || v.GameToken || v.sGameToken || v.xGameToken || v.dzGameToken || v.game_token || "";
                                    if (this._isGameJwt(gt2)) gt = gt2;
                                }
                            } else if (typeof v === "string") {
                                gt = v;
                            }
                            if (gt && typeof gt === "string" && gt.length > 10 && this._isGameJwt(gt)) {
                                token = gt;
                                this._restErrLog("L2 TEMP_TOKEN[" + tempKey + "].k=" + (k ? k.substring(0,8) : "") + "... 命中（JWT校验通过） len=" + token.length + " prefix=" + token.substring(0,8) + "...");
                                break;
                            }
                        }
                    }
                }
            }
            if (token && token.length > 0) {
                try { this.setRestToken(token); } catch (e) {}
                return token;
            }
        } catch (e) {
            this._restErrLog("L2 TEMP_TOKEN遍历异常: " + e.message);
        }

        try {
            let keyCandidates = [];
            try { if (userInfoObj && userInfoObj.nUserID) keyCandidates.push(String(userInfoObj.nUserID)); } catch (e) {}
            try { if (userInfoObj && userInfoObj.userId) keyCandidates.push(String(userInfoObj.userId)); } catch (e) {}
            try { if (userInfoObj && userInfoObj.sUserId) keyCandidates.push(String(userInfoObj.sUserId)); } catch (e) {}
            for (let i = 0; i < keyCandidates.length; i++) {
                if (token && token.length > 0) break;
                let k = keyCandidates[i];
                if (!k || k.length === 0) continue;
                try {
                    if (storage && typeof storage.getToken === "function") {
                        let t = storage.getToken(k);
                        if (t && typeof t === "string" && t.length > 10 && this._isGameJwt(t)) {
                            token = t;
                            this._restErrLog("L3 app.storage.getToken(UserId='" + k + "') 命中（JWT校验） len=" + token.length + " prefix=" + token.substring(0,8) + "...");
                        }
                    }
                } catch (e) {}
            }
            if (token && token.length > 0) {
                try { this.setRestToken(token); } catch (e) {}
                return token;
            }
        } catch (e) {}

        try {
            if (typeof ADMIN_X_TOKEN !== "undefined" && ADMIN_X_TOKEN && typeof ADMIN_X_TOKEN === "string") {
                token = ADMIN_X_TOKEN;
                this._restErrLog("L4 全局 ADMIN_X_TOKEN 命中（可能是后台x-token，非游戏JWT） len=" + token.length);
                try { if (this._isGameJwt(token)) this.setRestToken(token); } catch (e) {}
                return token;
            }
        } catch (e) {}

        try {
            if (typeof window !== "undefined") {
                let windowKeys = ["TEMP_TOKEN", "GAME_TOKEN", "ADMIN_X_TOKEN", "TOKEN"];
                for (let i = 0; i < windowKeys.length; i++) {
                    if (token && token.length > 0) break;
                    let key = windowKeys[i];
                    try {
                        if (typeof window[key] !== "undefined" && window[key] && typeof window[key] === "string" && window[key].length > 10) {
                            let t = window[key];
                            if (this._isGameJwt(t)) {
                                token = t;
                                this._restErrLog("L5 window." + key + " 命中（JWT校验） len=" + token.length);
                            } else if (!token || token.length === 0) {
                                token = t;
                                this._restErrLog("L5 window." + key + " 非JWT兜底命中（最后尝试） len=" + token.length);
                            }
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}
        if (token && token.length > 0) {
            if (this._isGameJwt(token)) {
                try { this.setRestToken(token); } catch (e) {}
            }
            return token;
        }

        try {
            if (userInfoObj && userInfoObj.token && typeof userInfoObj.token === "string" && userInfoObj.token.length > 10) {
                token = userInfoObj.token;
                this._restErrLog("L6 最终兜底：URL ?token= len=" + token.length + " segments=" + token.split(".").length + " prefix=" + token.substring(0,8) + "...");
                try { if (this._isGameJwt(token)) this.setRestToken(token); } catch (e) {}
                return token;
            }
        } catch (e) {}

        this._restErrLog("!!! 所有兜底层级均未获取到可用游戏JWT！按文档 §1.1 自检：Rup_Logon.sToken 必须是3段JWT（eyJ.payload.signature），或 URL ?token= 必须为平台签游戏JWT");
        try {
            let info = UserInfo.getInfo();
            let keys = Object.keys(info || {});
            let log = [];
            let rupLog = "";
            try {
                if (info && info.token && storage && storage.getToken) {
                    let r = storage.getToken(info.token);
                    rupLog = " Rup_Logon.sToken(len=" + (r?r.length:0) + " segments=" + ((r||"").split(".").length) + ")";
                }
            } catch (e) {}
            for (let i = 0; i < keys.length; i++) {
                let k = keys[i];
                let v = info[k];
                let type = typeof v;
                if (type === "string" && v.length > 0) {
                    log.push(k + "(" + v.length + " seg=" + v.split(".").length + "):" + v.substring(0, Math.min(6, v.length)) + "...");
                } else if (type === "number") {
                    log.push(k + "=" + v);
                } else if (type === "boolean") {
                    log.push(k + "=" + v);
                }
            }
            this._restErrLog("  UserInfo 字段: " + log.join(", ") + rupLog);
            this._restErrLog("  判定方法（文档 §1.1）：sToken.split('.').length === 3 才能调 API，否则就是 WS 短线重连令牌 sToken_<ts>_<rand>");
        } catch (e3) {}
        return "";
    },

    requestRest(method, path, body, callback){
        let token = this._getClubToken();
        let segCount = token ? token.split(".").length : 0;
        let isJwt3 = (segCount === 3);
        try { QYLogs.error("AppWebApi", "[REST token 注入最终结果] len=" + (token ? token.length : 0) + " segments=" + segCount + (isJwt3 ? " ✅JWT3段" : (segCount===1 ? " ⚠️单段(WS重连令牌必code7)" : "")) + " prefix=" + (token ? token.substring(0, 8) + "..." : "EMPTY")); } catch (e) {}
        if (!token || token.length === 0) {
            try { QYLogs.error("AppWebApi", "[REST token 注入] ★★取不到 token★★ 请求仍发送但服务端会返回 code:7 未登录"); } catch (e) {}
        }
        if (!isJwt3 && token && token.length > 0) {
            try { QYLogs.error("AppWebApi", "[REST WARN] 最终token不是3段JWT(段数=" + segCount + ")！按文档 §1.1/§1.2，Type=3 令牌登录返回的是 sToken_<ts>_<rand> 这种Redis重连令牌，调 REST 必 code:7。服务端会尝试从 ?token= 取第二个位置验签通过即可。"); } catch (e) {}
        }
        let fullUrl = this.restHost() + path;
        try {
            if (token && token.length > 0) {
                let hasQ = fullUrl.indexOf("?") >= 0;
                if (hasQ) fullUrl += "&token=" + encodeURIComponent(token);
                else fullUrl += "?token=" + encodeURIComponent(token);
            }
        } catch (e) {}
        try { QYLogs.error("AppWebApi", "[REST " + method + "] ★发起HTTP请求★ fullUrl=" + fullUrl + "（文档 §1.1 双位置取第一个能验签：5个Header + ?token=）"); } catch (e) {}

        if(app.config.ENABLE_CHANNEL && this.restHost() === "" && window && window.alert){
            let msg = app.config.CUSTOM.ERROR_SERVER_WEBAPI;
            try { window.alert(msg); } catch (e) {}
            if(callback) callback({status:-1, errorMessage:msg}, null);
            return;
        }

        let xhr = null;
        try {
            if (typeof XMLHttpRequest !== "undefined") {
                xhr = new XMLHttpRequest();
            }
        } catch (e1) {}
        if (!xhr) {
            try {
                if (typeof cc !== "undefined" && cc.loader && typeof cc.loader.getXMLHttpRequest === "function") {
                    xhr = cc.loader.getXMLHttpRequest();
                }
            } catch (e2) {}
        }
        if (!xhr) {
            try {
                if (typeof window !== "undefined" && typeof window.XMLHttpRequest !== "undefined") {
                    xhr = new window.XMLHttpRequest();
                }
            } catch (e3) {}
        }
        if (!xhr) {
            if (callback) callback({status:-2, errorMessage:"XMLHttpRequest unavailable"}, null);
            return;
        }

        let errInfo = "[REST] " + method + " " + fullUrl + " failed!";
        try {
            xhr.open(method, fullUrl, true);
            if (xhr.overrideMimeType) xhr.overrideMimeType('application/json; charset=utf-8');
        } catch (eOpen) {
            if (callback) callback({status:-3, errorMessage:"xhr.open exception: " + eOpen.message}, null);
            return;
        }
        try {
            xhr.setRequestHeader('Content-Type', 'application/json');
        } catch (eH1) {}
        if(token && token.length > 0){
            let headersToSet = [
                {name:"x-game-token", value:token},
                {name:"X-Game-Token", value:token},
                {name:"x-token", value:token},
                {name:"X-Token", value:token},
                {name:"Authorization", value:"Bearer " + token}
            ];
            for (let hi = 0; hi < headersToSet.length; hi++) {
                let h = headersToSet[hi];
                try { xhr.setRequestHeader(h.name, h.value); } catch (eHSet) {}
            }
        }

        let callbackFired = false;
        let fireCb = function(err, data) {
            if (callbackFired) return;
            callbackFired = true;
            if (callback) callback(err, data);
        };

        if (typeof xhr.addEventListener === "function") {
            xhr.addEventListener("load", function() {
                try { QYLogs.error("AppWebApi", "[REST resp] ★返回★ status=" + xhr.status + " len=" + (xhr.responseText ? xhr.responseText.length : 0) + " body=" + (xhr.responseText ? xhr.responseText.substring(0, 400) : "null")); } catch (e) {}
                if (xhr.status === 200 || xhr.status === 0) {
                    let parsed = null;
                    let err = null;
                    try {
                        if (xhr.responseText) parsed = JSON.parse(xhr.responseText);
                    } catch (e) {
                        err = {status:xhr.status, errorMessage:"JSON parse error: " + e.message, raw:xhr.responseText};
                    }
                    fireCb(err, parsed);
                } else {
                    fireCb({status:xhr.status, errorMessage:errInfo, raw:xhr.responseText}, null);
                }
            });
            xhr.addEventListener("error", function() {
                try { QYLogs.error("AppWebApi", "[REST onerror] network error status=" + xhr.status); } catch (e) {}
                fireCb({status:xhr.status, errorMessage:errInfo, raw:"network error"}, null);
            });
            xhr.addEventListener("abort", function() {
                fireCb({status:-4, errorMessage:errInfo + " abort", raw:"abort"}, null);
            });
            xhr.addEventListener("timeout", function() {
                fireCb({status:-5, errorMessage:errInfo + " timeout", raw:"timeout"}, null);
            });
        } else {
            xhr.onload = function(){
                if(xhr.readyState === 4){
                    if (xhr.status === 200 || xhr.status === 0){
                        let parsed = null;
                        let err = null;
                        try{
                            if(xhr.responseText) parsed = JSON.parse(xhr.responseText);
                        }catch(e){
                            err = {status:xhr.status, errorMessage:"JSON parse error: " + e.message, raw:xhr.responseText};
                        }
                        fireCb(err, parsed);
                    }else{
                        fireCb({status:xhr.status, errorMessage:errInfo, raw:xhr.responseText}, null);
                    }
                }
            };
            xhr.onerror = function(){
                fireCb({status:xhr.status, errorMessage:errInfo, raw:"network error"}, null);
            };
        }

        let sendBody = null;
        if(body !== null && body !== undefined){
            sendBody = (typeof body === "string") ? body : JSON.stringify(body);
        }
        try {
            xhr.send(sendBody);
        } catch (eSend) {
            fireCb({status:-6, errorMessage:"xhr.send exception: " + eSend.message}, null);
        }
    },

    getClubList(data, callback){
        let params = data || {};
        let path = "/api/club/getClubListForClient";
        let query = [];
        let pageV = (params.page !== undefined && params.page !== null) ? params.page : 1;
        let pageSizeV = (params.pageSize !== undefined && params.pageSize !== null) ? params.pageSize : 20;
        if (typeof pageSizeV === "number") {
            if (pageSizeV > 100) pageSizeV = 100;
        }
        query.push("page=" + pageV);
        query.push("pageSize=" + pageSizeV);
        if (params.keyword && String(params.keyword).length > 0) {
            query.push("keyword=" + encodeURIComponent(String(params.keyword)));
        }
        path += "?" + query.join("&");
        this.requestRest("GET", path, null, callback);
    },

    searchClub(data, callback){
        let params = data || {};
        let path = "/api/club/getClubListForClient";
        let query = [];
        let pageV = (params.page !== undefined && params.page !== null) ? params.page : 1;
        let pageSizeV = (params.pageSize !== undefined && params.pageSize !== null) ? params.pageSize : 20;
        if (typeof pageSizeV === "number") {
            if (pageSizeV > 100) pageSizeV = 100;
        }
        query.push("page=" + pageV);
        query.push("pageSize=" + pageSizeV);
        let kw = params.keyword || params.clubName || params.inviteCode || "";
        if (kw && String(kw).length > 0) {
            query.push("keyword=" + encodeURIComponent(String(kw)));
        }
        path += "?" + query.join("&");
        this.requestRest("GET", path, null, callback);
    },

    joinClubByInviteCode(inviteCode, callback){
        var path = "/api/club/joinClubByInviteCode";
        var code = String(inviteCode || "").replace(/\s/g, "").toUpperCase();
        var body = { inviteCode: code };
        this.requestRest("POST", path, body, callback);
    },

    getMyClubInfo(callback){
        let path = "/api/club/getMyClubInfo";
        this.requestRest("GET", path, null, callback);
    },

    getAllActivityData(callback){
        var path = "/api/activity/getAllActivityData";
        this.requestRest("GET", path, null, function(err, resp){
            if (err) {
                callback(err, null);
                return;
            }
            var data = null;
            if (resp) {
                if (resp.code !== undefined && resp.code !== 0 && resp.code !== 200) {
                    callback({status: resp.code, errorMessage: resp.message || resp.msg || "getAllActivityData failed"}, null);
                    return;
                }
                data = resp.data !== undefined ? resp.data : resp;
            }
            callback(null, data);
        });
    },

}

module.exports = AppWebApi;
