// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-11-16 10:05:23
//     * @Description: 微信接口
// ]]

// let App = require("App");
let MsgManager = require("MsgManager");
let APPMSG = require("Msg");
// let ConfigShare = require("ConfigShare");

let KEY = {
	Level: "LEVEL",
	Data: "DATA",
};
let MSG = {
	CleanSubContext: "CleanSubContext",		//清空子域
	FetchFriendData: "Fetch_Friend_Data", 	//好友关卡数据排行
	FetchFriendLevel: "Fetch_Friend_Level", //好友关卡进度排行

	FetchGroupData: "Fetch_Group_Data", 	//群成员关卡数据排行
	FetchGroupLevel: "Fetch_Group_Level", 	//群成员关卡进度排行
		
	FetchWroldLevel: "Fetch_Wrold_Level",	//查看世界排行榜
	FetchFriendNext: "Fetch_Friend_Next",   //超越下一关好友
	FetchFriendStage: "Fetch_Friend_Stage", //同一关卡难度内通关好友
};
let QUERY = {
	KeyShareToGroup: "share_to_group",	//是 key1=val1&key2=val2 的格式
	KeyHelpToPassed: "help_to_passed",
};

let WXSDK = function(){
	this.KEY = KEY;
	this.MSG = MSG;
	this.QUERY = QUERY;
	this._btnLogin = null;
	this._nodeClone = null;
	this._loginCallback = null;
	this._shakeEnabled = true;

	this._switchConfig = null;	//审核开关

	this._thirdSdk = require("WXThirdSdk");
	// this._thirdSdk = null;

	this._initSwitchConfig();
	this._initWXMenu();
};

WXSDK.isValid = function () {
	let valid = false;
	if(cc.sys.platform === cc.sys.WECHAT_GAME && typeof window["wx"] === "object"){
		valid = true;
	}

	return valid;
}

WXSDK.prototype.isValid = function () {
	return WXSDK.isValid();
}

//nodeClone 为 cc.Node，
//后面会以传入的节点大小、位置等创建微信登录按钮
WXSDK.prototype.init = function (nodeClone) {
	if(typeof nodeClone != "object"){
		cc.error("传入节点为空！");
	}
	this._nodeClone = nodeClone;
}

//微信登录
//loginCallback = function(success, data){}
WXSDK.prototype.login = function (loginCallback) {
	let self = this;

	this._loginCallback = function (success, data) {
		let handle = self._callThirdSdk("handleLogin", function (res) {
			if(loginCallback){
				loginCallback(success, res);
			}
		});

		if(handle){}
		else{
			if(loginCallback){
				loginCallback(success, data);
			}
		}	
	}

	if(!WXSDK.isValid()){
		self._loginCallback(true);
		return;
	}

	self._checkPermission(function (success) {
		if(success){
			self._login();
		}
		else{
			self._createLoginButton();
		}
	});
}

//向子域发送消息
WXSDK.prototype.postMessage = function (msg, data=null, dataEx=null) {
	if(!WXSDK.isValid()){
		return;
	}

	let openDataContext = wx.getOpenDataContext();
	openDataContext.postMessage({
		msg: msg,
		data: data,
		dataEx: dataEx,
	});
}

//获取当前时间是本年第几周(以周一为每周的第一天)
WXSDK.prototype._getWeekOfYear = function() {
	var today = new Date();
	var firstDay = new Date(today.getFullYear(), 0, 1);
	var dayOfWeek = firstDay.getDay();
	var spendDay = 1;
	if (dayOfWeek != 0) {
		spendDay = 7 - dayOfWeek + 1;
	}
	firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
	var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
	var result = Math.ceil(d / 7) + 1;
	var weekTime = today.getFullYear() + "" + result;
	return weekTime;
}

// 上传关卡数据
WXSDK.prototype.uploadLevelData = function(level, data) {
	if(!WXSDK.isValid()){
		return;
	}

	level = level.toString()
	if(!data){
		data = {};
	}


	let weekTime = this._getWeekOfYear();
	let value = {
		level: level,
		data: data,
		timestamp: weekTime,	//添加时间戳做周排行榜
	}
	let self = this;
	let KVDataList = [{ key: self.KEY.Data+level, value: JSON.stringify(value) }];
	cc.log("uploadLevelScore KVDataList:", KVDataList);
	wx.setUserCloudStorage({
		KVDataList: KVDataList,
		success: (res) => {
			console.log("uploadLevelScore success:res=>", res)
		},
		fail: (res) => {
			console.log("uploadLevelScore fail:res=>", res)
		}
	})
}

// 上传关卡进度
WXSDK.prototype.uploadLevel = function(level){
	if(!WXSDK.isValid()){
		return;
	}

	level = level.toString()

	let weekTime = this._getWeekOfYear();
	let value = {
		level: level,
		timestamp: weekTime,	//添加时间戳做周排行榜
	}

	let self = this;
	let KVDataList = [{ key: self.KEY.Level, value: JSON.stringify(value) }];
	cc.log("uploadLevel KVDataList:", KVDataList);
	wx.setUserCloudStorage({
		KVDataList: KVDataList,
		success: (res) => {
			console.log("uploadLevel success:res=>", res)
		},
		fail: (res) => {
			console.log("uploadLevel fail:res=>", res)
		}
	})
}

//删除微信数据
WXSDK.prototype.removeUserKey = function(key_or_keys) {
	if(!WXSDK.isValid()){
		return;
	}

	let self = this;
	if(typeof(key_or_keys)==="string"){
		key_or_keys = [key_or_keys]
	}
	wx.removeUserCloudStorage({
		keyList: key_or_keys,
		success: (res) => {
			console.log("removeUserKey success:res=>", res)
		},
		fail: (res) => {
			console.log("removeUserKey fail:res=>", res)
		}
	})
}

//删除关卡数据
WXSDK.prototype.removeLevelData = function(maxLevel) {
	if(!WXSDK.isValid()){
		return;
	}

	if(!maxLevel) maxLevel = 1;
	let key_or_keys = [];
	for (let i = maxLevel; i > 0; i--) {
		let key = this.KEY.Data + i;
		key_or_keys.push(key);
	}
	wx.removeUserCloudStorage({
		keyList: key_or_keys,
		success: (res) => {
			console.log("removeLevelScore success:res=>", res)
		},
		fail: (res) => {
			console.log("removeLevelScore fail:res=>", res)
		}
	})
}

//删除关卡进度
WXSDK.prototype.removeLevel = function() {
	if(!WXSDK.isValid()){
		return;
	}

	let key_or_keys = [this.KEY.Level]
	wx.removeUserCloudStorage({
		keyList: key_or_keys,
		success: (res) => {
			console.log("removeLevel success:res=>", res)
		},
		fail: (res) => {
			console.log("removeLevel fail:res=>", res)
		}
	})
}

/* args:{
			title: string
			imageUrl: string
			query: string
			success: func
			fail: func
		}
*/
// 分享
WXSDK.prototype.share = function(args) {
	args = args || {};
	if(!WXSDK.isValid()){
		if(args.success){
			args.success()
		}
		return;
	}

	args.title = args.title || ConfigShare.DEFAULT.title;
	args.imageUrl = args.imageUrl || ConfigShare.DEFAULT.imageUrl;

	args.query = args.query || ConfigShare.DEFAULT.query;

	cc.log("wx.share:", args);
	
	if(this._callThirdSdk("handleShareAppMessage", args)){
		return;
	}

	let _shareAppMessage = wx.aldShareAppMessage ? wx.aldShareAppMessage : wx.shareAppMessage;
	_shareAppMessage.call(wx, {
		title: args.title,
		// imageUrl: "res/raw-assets/res/shengming.25929.png",
		imageUrl: args.imageUrl,
		query: args.query,
		success: (res) => {
			console.log("success:", res)
			// if(args.success){
			// 	args.success(res)
			// }
		},
		fail: res => {
			console.log("fail:", res)
			if(args.fail){
				args.fail(res)
			}
		},
		complete: (res) => {
			console.log("complete:", res)
			if(args.complete){
				args.complete(res)
			}
		},
	})

	App.showBlock("", false, function () {
		console.log("[WXSDK] share: HideBlock");
	}, 1);

	let date = new Date();
	let begin = date.getTime(); //返回从 1970 年 1 月 1 日至今的毫秒数
		
	let node = App.getInstance().node;
	node.runAction(cc.sequence(
		cc.delayTime(0.5),
		cc.callFunc(function () {
			let now = new Date();
			let end = now.getTime();
			let delta = end - begin;
			let res = {};
			console.log("[share]:", delta);

			//3秒以上才算成功
			if(delta>3*1000){
				if(args.success){
					args.success(res)
				}
			}
			else{
				if(args.fail){
					args.fail(res);
				}
				App.showTips("分享失败");
			}
		}, App.getInstance())
	))
}

//查看好友排行
WXSDK.prototype.showFriendRanking = function (level, callback) {
	let self = this;

	// level = level || 1;
	// let data = {
	// 	keyList: [self.KEY.Data + level],
	// }
	let data = {
		keyList: [self.KEY.Level],
	}
	self.postMessage(self.MSG.FetchFriendLevel, data);
	if(null!=callback){
		callback();
	}
}
//查看世界排行
WXSDK.prototype.showWorldRanking = function (dataEx, callback) {
	let self = this;

	// level = level || 1;
	// let data = {
	// 	keyList: [self.KEY.Data + level],
	// }
	let data = {
		keyList: [self.KEY.Level],
	}
	self.postMessage(self.MSG.FetchWroldLevel, data, dataEx);
	if(null!=callback){
		callback();
	}
}
//查看群排行
WXSDK.prototype.showGroupRanking = function (args, callback) {
	if(!WXSDK.isValid()){
		if(null!=callback){
			callback();
		}
		return;
	}

	let self = this;
	args = args || {};
	args.query = args.query || (self.QUERY.KeyShareToGroup + "=" + self.QUERY.KeyShareToGroup);

	args.success = function (res) {
		if(res.shareTickets && res.shareTickets.length > 0){
			let level = args.level || 1;
			let data = {
				// keyList: [self.KEY.Data + level],
				keyList: [self.KEY.Level],
				shareTicket: res.shareTickets[0],
			}
			
			self.postMessage(self.MSG.FetchGroupLevel, data);

			if(null!=callback){
				callback();
			}
		}
		else{
			if(null!=callback){
				callback();
			}
		}
	};
	args.fail = function (res) {
		App.showTips("获取群排行榜失败!");
		console.log("[showGroupRanking] fail", res);		
	};
	args.complete = function (res) {
	};

	if(args.shareTicket){
		let res = {
			shareTickets: [args.shareTicket],
		};
		args.success(res);
		return;
	}
	
	self.share(args);
}

//下关最近好友
WXSDK.prototype.showNextLevelFriend = function (params, callback) {
	if(!WXSDK.isValid()){
		if(null!=callback){
			callback();
		}
		return;
	}

	let self = this;
	let data = {
		keyList: [self.KEY.Level],
	}
	self.postMessage(self.MSG.FetchFriendNext, data);
	if(null!=callback){
		callback();
	}
}

//同一关卡难度内通关好友
WXSDK.prototype.showStageLevelFriend = function (params, callback) {
	if(!WXSDK.isValid()){
		if(null!=callback){
			callback();
		}
		return;
	}

	let self = this;
	let data = {
		keyList: [self.KEY.Level],
	}
	self.postMessage(self.MSG.FetchFriendStage, data);
	if(null!=callback){
		callback();
	}
}

//发送清空子域消息，子域接收到该消息后自己处理
WXSDK.prototype.cleanSubContext = function (){
	console.log("[WXSDK]: cleanSubContext");
	
	if(!WXSDK.isValid()){
		return;
	}

	let self = this;
	let data = {
	}
	self.postMessage(self.MSG.CleanSubContext, data);
}

/* args:{
			title: string
			imageUrl: string
			query: string
			success: func
			fail: func
			userid: number
			level: number
			nickname: string
		}
*/
//求助好友通关
WXSDK.prototype.shareToHelp = function (args) {
	args = args || {};
	if(!WXSDK.isValid()){
		if(args.success){
			args.success()
		}
		return;
	}

	let self = this;
	args = args || {};
	let query = self.QUERY.KeyHelpToPassed + "=" + self.QUERY.KeyHelpToPassed;
	let title = args.title || ConfigShare.HELP.title;
	let imageUrl = args.imageUrl || ConfigShare.HELP.imageUrl;
	if(args.userid && args.level && args.nickname && args.headurl){
		query = query + "&userid=" + args.userid + "&level=" + args.level + "&nickname=" + args.nickname + "&headurl=" + args.headurl;
		title = "快来帮助" + args.nickname + "通过第" + args.level + "关!";
	}
	args.query = args.query || query;
	args.title = args.title || title;
	args.imageUrl = args.imageUrl || imageUrl;

	self.share(args);
}

//获取启动参数
WXSDK.prototype.handleLaunch = function () {
	if(!WXSDK.isValid()){
		return null;
	}

	//https://developers.weixin.qq.com/minigame/dev/api/wx.getLaunchOptionsSync.html
	let res = wx.getLaunchOptionsSync()
	return res;
}

WXSDK.prototype.setShakeEnabled = function (enabled) {
	this._shakeEnabled = !!enabled;
}

//微信手机震动
WXSDK.prototype.shake = function (long) {
	if(!WXSDK.isValid() || !this._shakeEnabled){
		return;
	}

	if(long){
		wx.vibrateLong();	//长振动
	}
	else{
		wx.vibrateShort();	//短振动
	}
}

WXSDK.prototype.aldSendEvent = function (eventName, eventValue) {
	console.log("aldSendEvent", eventName, eventValue);

	if(!WXSDK.isValid()){
		return;
	}
	if(!wx.aldSendEvent){
		return;
	}

	wx.aldSendEvent(eventName, eventValue);
}

/**
//关卡开始 http://doc.aldwx.com/aldwx/src/game.html
args = {
	stageId : "1",     //关卡ID 该字段必传
	stageName : "第一关", //关卡名称  该字段必传
	userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
}
*/
WXSDK.prototype.stageOnStart = function (args) {
	console.log("stageOnStart", args);

	if(!WXSDK.isValid()){
		return;
	}
	if(!wx.aldStage || !wx.aldStage.onStart){
		this.aldSendEvent("stageOnStart", args);
		return;
	}

	if(!args) return;

	//关卡开始
	wx.aldStage.onStart(args);
}

/**
  //关卡中 http://doc.aldwx.com/aldwx/src/game.html
  args = {
		stageId : "1",     //关卡ID 该字段必传
		stageName : "第一关", //关卡名称  该字段必传
		userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
		event : "payStart",  //发起支付 关卡进行中，用户触发的操作    该字段必传
		params : {    //参数
			itemName : "火力增强",  //购买商品名称  该字段必传
			itemCount : 5,        //购买商品数量  可选，默认1
			itemMoney : 20        // 购买商品金额  可选 默认0
			desc : "武器库-商店购买"  //商品描述   可选
		}
	}
 */
WXSDK.prototype.stageOnRunning = function (args) {
	console.log("stageOnRunning", args);

	if(!WXSDK.isValid()){
		return;
	}
	if(!wx.aldStage || !wx.aldStage.onRunning){
		if(args.params && typeof args.params == "object"){
			args.params = JSON.stringify(args.params);
			args = {
				params: args.params,
			}
		}
		this.aldSendEvent("stageOnRunning", args);
		return;
	}

	if(!args) return;

	//关卡中
	wx.aldStage.onRunning(args);
}

/**
 //关卡完成 http://doc.aldwx.com/aldwx/src/game.html
 args = {
		stageId : "1",    //关卡ID 该字段必传
		stageName : "第一关", //关卡名称  该字段必传
		userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M",  //用户ID 可选
		event : "complete",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
		params : {
			desc : "关卡完成"   //描述
		}
	}
 */
WXSDK.prototype.stageOnEnd = function (args) {
	console.log("stageOnEnd", args);

	if(!WXSDK.isValid()){
		return;
	}
	if(!wx.aldStage || !wx.aldStage.onEnd){
		if(args.params && typeof args.params == "object"){
			args.params = JSON.stringify(args.params);
			args = {
				params: args.params,
			}
		}
		this.aldSendEvent("stageOnEnd", args);
		return;
	}

	if(!args) return;

	//关卡完成
	wx.aldStage.onEnd(args);
}

//获取广告配置
WXSDK.prototype.getTigerList = function (arrayTigerPositionIds, callback) {
	if(!WXSDK.isValid()){
		if(callback){
			callback();
		}
		return;
	}

	this._callThirdSdk("handleGetTigerList", arrayTigerPositionIds, callback);
}

//全屏广告
WXSDK.prototype.showFullScreenAD = function (callback) {
	if(!WXSDK.isValid()){
		if(callback){
			callback();
		}
		return;
	}

	this._callThirdSdk("handleShowFullScreenAD", callback);
}

//浮动广告
WXSDK.prototype.showFlotingAD = function (callback) {
	if(!WXSDK.isValid()){
		if(callback){
			callback();
		}
		return;
	}

	this._callThirdSdk("handleShowFlotingAD", callback);
}

//审核开关
WXSDK.prototype.getGameSwitchConfig = function (callback) {
	if(!WXSDK.isValid()){
		if(callback){
			callback(this._switchConfig);
		}
		return;
	}

	if(this._switchConfig){
		if(callback){
			callback(this._switchConfig);
		}
	}
	else{
		this._initSwitchConfig(callback);
	}
}

// 触发SDK的广告的点击事件
WXSDK.prototype.navigateToMiniProgram = function (adConfig, callback) {
	if(!WXSDK.isValid()){
		if(callback){
			callback(null);
		}
		return;
	}

	this._callThirdSdk("handleNavigateToMiniProgram", adConfig, callback);
}

WXSDK.prototype.showBanner = function (args) {
    if(!WXSDK.isValid()){
		return;
	}

	this._callThirdSdk("handleShowBanner", args);
}

WXSDK.prototype.hideBanner = function () {
    if(!WXSDK.isValid()){
		return;
	}

	this._callThirdSdk("handleHideBanner");
}

WXSDK.prototype.showRewardedVideo = function (args) {
    if(!WXSDK.isValid()){
		let max = 100;
		let min = 0;
		let num = Math.floor(Math.random()*(max-min+1) + min);
		let isEnded = num > 50;
		if(isEnded){
			if(args.success){
                args.success({});
            }
		}
		else{
			if(args.fail){
                args.fail({});
            }
		}
		return;
	}

	this._callThirdSdk("handleShowRewardedVideo", args);
}

WXSDK.prototype.hideRewardedVideo = function () {
    if(!WXSDK.isValid()){
		return;
	}

	this._callThirdSdk("handleHideRewardedVideo");
}

WXSDK.prototype._initSwitchConfig = function (callback) {
	if(!WXSDK.isValid()){
		return;
	}

	let self = this;
	let handle = this._callThirdSdk("handleGetGameSwitchConfig", function (res) {
		console.log("_initSwitchConfig", res);
		self._switchConfig = res;
		if(callback){
			callback(self._switchConfig);
		}
	});
	if(handle){}
	else{
		if(callback){
			callback(self._switchConfig);
		}
	}
}

WXSDK.prototype._initWXMenu = function () {
	if(!WXSDK.isValid()){
		return;
	}

	wx.showShareMenu({
		withShareTicket: true
	})    

	wx.onHide(function (params) {
		console.log("[WXSDK]:", "onHide");
		MsgManager.fire(APPMSG.ENGINE.GAME_EVENT_HIDE, params);
		MsgManager.fire(APPMSG.ENGINE.WX_EVENT_HIDE, params);
	})

	wx.onShow(function (params) {
		console.log("[WXSDK]:", "onShow", params);
		MsgManager.fire(APPMSG.ENGINE.GAME_EVENT_SHOW);
		MsgManager.fire(APPMSG.ENGINE.WX_EVENT_SHOW, params);
	}.bind(this))

	if(this._callThirdSdk("handleOnShareAppMessage")){
		return;
	}

	let _onShareAppMessage = wx.aldOnShareAppMessage ? wx.aldOnShareAppMessage : wx.onShareAppMessage;
	_onShareAppMessage.call(wx, function () {
		return {
			title: ConfigShare.DEFAULT.title,
			imageUrl: ConfigShare.DEFAULT.imageUrl,
			query: ConfigShare.DEFAULT.query,
			success: (res) => {
				console.log("success:", res)
				// if(args.success){
				// 	args.success(res)
				// }
			},
			fail: res => {
				console.log("fail:", res)
				// if(args.fail){
				// 	args.fail(res)
				// }
			}
		}
	})
}

WXSDK.prototype._login = function(){
	let self = this;
	wx.login({
		success: function(resLogin){
			wx.getUserInfo({
				withCredentials:true,
				success: function (res) {
					if(self._btnLogin){
						self._btnLogin.hide();
					}
					res.code = resLogin.code;
					self._loginCallback(true, res);
				},

				fail: function (res) {
					if(self._btnLogin){
						self._btnLogin.show();
					}
					else{
						self._createLoginButton();
					}
					self._loginCallback(false, res);
					App.showTips("获取用户信息失败:" + res.errMsg);
				},

				complete: function (res) {
					console.log("[ wx.getUserInfo ] complete:", res);   
				}
			});
		},
		fail: function(resLogin){
			if(self._btnLogin){
				self._btnLogin.show();
			}
			else{
				self._createLoginButton();
			}
			self._loginCallback(false, res);
			App.showTips("微信登录失败:" + resLogin.errMsg);
		},
		complete: function (resLogin) {
			console.log("[ wx.login ] complete:", resLogin);   
		}
	});
}

//检查授权
WXSDK.prototype._checkPermission = function(callback){
	if(!WXSDK.isValid()){
		callback(true);
		return;
	}

	wx.getSetting({
		success: function(res) {
			if (res.authSetting['scope.userInfo']) {
				callback(true);
			}else{
				callback(false);
			}
		},
		fail: function (res) {
			callback(false);
		},
		complete: function (res) {
			cc.log("[ wx.getSetting ] complete:", res);   
		}
	});
};

WXSDK.prototype._createLoginButton = function () {
	let self = this;

	if(self._btnLogin){
		self._btnLogin.show();
		return;
	}

	let size = cc.view.getFrameSize();
	let btnWidth = 150;
	let btnHeight = 52;
	let btnLeft = 0;
	let btnTop = 0;
	if(null!=self._nodeClone){
		let posWorld = self._nodeClone.parent.convertToWorldSpaceAR(self._nodeClone.position);

		let scaleX = size.width/cc.winSize.width;
		let scaleY = size.height/cc.winSize.height;
		let posX = posWorld.x * scaleX;
		let posY = posWorld.y * scaleY;

		btnWidth = self._nodeClone.width * scaleX;
		btnHeight = self._nodeClone.height * scaleY;
		btnLeft = posX - btnWidth/2;
		btnTop = size.height - posY - btnHeight/2;
	}
	let button = wx.createUserInfoButton({
		withCredentials:true,
		lang: 'zh_CN',
		type: 'text',
		text: '获取用户信息',
		// type: 'image',
		// image:"res/login_btn_login5.png",
		style: {
			left: btnLeft,
			top: btnTop,
			width: btnWidth,
			height: btnHeight,
			lineHeight: 40,
			backgroundColor: '#ff000000',
			color: '#ffffff00',
			textAlign: 'center',
			fontSize: 16,
			borderRadius: 4
		}
	})
	button.onTap(function(res){
		let success = true;
		// iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
		if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
			success = false;
		}
		self._onClickLoginButtonCallback(success, res);
		return;
	})

	self._btnLogin = button;
}

WXSDK.prototype._onClickLoginButtonCallback = function (success, res) {
	if(success){
		App.showTips("成功授权，点击开始游戏");
		this._login();
	}
	else{
		App.showTips("拒绝授权，无法开始游戏");
	}
	this._callThirdSdk("hanldeClickLoginButtonCallback", res);
}

WXSDK.prototype._callThirdSdk = function () {
	if(!WXSDK.isValid()){
		return false;
	}

	var args = Array.prototype.slice.call(arguments);
	var funcName = args.shift();
	let handled = false;
	if(this._thirdSdk && funcName){
		if(this._thirdSdk[funcName]){
			handled = true;
			this._thirdSdk[funcName].apply(this._thirdSdk, args);
		}
		else{
			console.warn("[CallThirdSdk] function is null: ", funcName);
		}
	}

	return handled;
}

let object = new WXSDK();
module.exports = object;
