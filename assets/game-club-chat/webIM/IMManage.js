// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html.

class QYIMManage {

    constructor() {
        this._nim = null;
        this._callback = null;
        this._myInfo = null;
        this._isLogin = false;
        this._token = "";

        this._currentPlayAudio = null;
        this._playAudioPath = "";
    }


 

    setCallback(callback){
        this._callback = callback
    }

    onConnect(){
         //console.log('IM连接成功');
        this._isLogin = true
        this.loginSuccess();

    }

    onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
         //console.log('IM即将重连');

    
    }

    onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
         //console.log('IM丢失连接');
         //console.log(error);
        if (error) {
            if(!this._isLogin){
                this.loginFail(error.code)
            }else{
                switch (error.code) {
                    case 302:// 账号或者密码错误, 请跳转到登录页面并提示错误
                    case 417:// 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                    case 'kicked':// 被踢, 请提示错误后跳转到登录页面
                    {
                        this.logout();
                        break;
                    }
                    default:
                    break;
                }
            }
        }
    }

    onError(error) {
         //console.log('IM错误');
         //console.log(error);
    }

    onMyInfo(user) {

        this.myUser = user
        this.updateUserMessage([{
            avatar: user.avatar,
            account: user.account,
            name: user.nick,
            extension: user.custom,
        }]);
    }
    onUpdateMyInfo(user) {
        this.myUser = user
        this.updateUserMessage([{
            avatar: user.avatar,
            account: user.account,
            name: user.nick,
            extension: user.custom,
        }]);
    }

    onKick(error, obj) {
         //console.log('踢其它端' + (!error?'成功':'失败'));
         //console.log(error);
         //console.log(obj);
    }

    onLoginPortsChange(loginPorts) {
         //console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
        // let deviceIds = []
        // for(let i=0;i<loginPorts.length;i++){
        //     let tickData = loginPorts[i]
        //     deviceIds.push(tickData.deviceId)
        // }
        // if(this._nim){
        //     this._nim.kick({
        //         deviceIds: deviceIds,
        //         done: this.onKick.bind(this)
        //     });
        // }
    }

    onMsg(msg) {
         //console.log('收到消息', msg.scene, msg.type, msg);
        if(msg.scene == "team"){
            
            if(msg.type == "text"){

                this.updateTextMessage([msg]);
            }
              if(msg.type == "audio"){

                this.updateAudioMessage(msg);
            }

        }



    }

    onSessions(sessions) {
        if(this._nim){
            for(let i=0;i<sessions.length;i++){
                this._nim.deleteLocalSession({
                    id: sessions[i].id,
                    done: (error, obj)=>{
                         //console.log('删除本地会话' + (!error?'成功':'失败'));
                    }
                });
            }
        }
    }

    onSyncDone() {
         //console.log('同步完成');
    }

    //登陆
    login(appKey,account,token){

        if(!cc.sys.isBrowser){
             //console.log('不是浏览器，Web IM登陆失败');
            return
        }
        if(this._nim){
             //console.log('Web IM对象已经初始化，login失败');
            return
        }

         //console.log('IM登陆和初始化');
        this._isLogin = false
        this._nim = NIM.getInstance({
            debug: app.config.ISDEVELOP ? true:false,   // 是否开启日志，将其打印到console。集成开发阶段建议打开。
            appKey: appKey,
            account: account,
            token: token,
            needReconnect:true,
            quickReconnect:true,
            db:true, //若不要开启数据库请设置false。SDK默认为true。
            // privateConf: {}, // 私有化部署方案所需的配置

            autoMarkRead:true,

            onconnect: this.onConnect.bind(this),
            onwillreconnect: this.onWillReconnect.bind(this),
            ondisconnect: this.onDisconnect.bind(this),
            onerror: this.onError.bind(this),
            onmyinfo: this.onMyInfo.bind(this),
            onupdatemyinfo: this.onUpdateMyInfo.bind(this),
            onloginportschange: this.onLoginPortsChange.bind(this),

            onmsg: this.onMsg.bind(this),

            onsessions: this.onSessions.bind(this),

            onsyncdone: this.onSyncDone.bind(this),// 同步完成
        });

    }
    //登出
    logout(){

        if(!cc.sys.isBrowser){
             //console.log('不是浏览器，Web IM登出失败');
            return
        }
        if(!this._nim){
             //console.log('Web IM对象不存在，登出失败');
            return
        }

        if(this._nim){
            // 清除实例
            this._nim.destroy({
                done: (err)=>{
                     //console.log('IM实例已被完全清除')
                    this.logoutToGame();
                }
            })
            this._nim = null
            this._myInfo = null;
            this._isLogin = false
        }
    }

    //获取历史消息
    getHistoryMessage(account,startTime,endTime,num,type){
        if(!cc.sys.isBrowser){
             //console.log('不是浏览器，Web IM获取历史消息失败');
            return
        }
        if(!this._nim){
             //console.log('Web IM对象不存在，获取历史消息失败');
            return
        }

        this._nim.getHistoryMsgs({
            scene: 'team',
            to: account,
            beginTime:0,
            endTime:startTime,
            limit:num,
            reverse:false,
            asc:false,
            msgTypes:["text"], //"audio"
            done: (error, obj)=>{
                if(!error){
                    if (obj && obj.msgs && obj.msgs.length > 0) {
                        this.updateTextMessage(obj.msgs,true);
                    }
                }else{
                    this.updateHistoryMessageFail(error.code);
                }
            },
        });
    }


    //发送文本消息
    sendTextMessage(account,text){
        if(!cc.sys.isBrowser){
             //console.log('不是浏览器，Web IM发送文本消息失败');
            return
        }
        if(!this._nim){
             //console.log('Web IM对象不存在，发送文本消息失败');
            return
        }
        if(this._nim){
            this._nim.sendText({
                scene: 'team',
                to: account,
                text: text,
                done: (err, msg)=>{
                    if (err) {
                         //console.log('发送文本失败', err)
                        this.updateMessageFail(err.code);
                     } else {
                        this.updateTextMessage([msg]);
                         //console.log('发送消息成功，消息为: ', msg)
                     }
                },
              })
        }
    }


    //获取用户资料
    getUser(account){

        if(!cc.sys.isBrowser){
             //console.log('不是浏览器，Web IM获取用户资料失败');
            return
        }
        if(!this._nim){
             //console.log('Web IM对象不存在，获取用户资料失败');
            return
        }
        
        if(this._nim){
            this._nim.getUser({
                account: account,
                done: (error, user)=>{
                    if(!error){
                        this.updateUserMessage([{
                            avatar: user.avatar,
                            account: user.account,
                            name: user.nick,
                            extension: user.custom,
                        }]);
                    }else{
                        this.updateUserMessageFail(error.code);
                    }
                }
            });
        }
    }
    
    //登出转发给游戏层
    logoutToGame(){
        if(this._callback){
            this._callback({
                message_type:"logout",
                message_value:{
                }
            })
        }
    }

    //通知游戏层重连
    re_login(){
        if(this._callback){
            this._callback({
                message_type:"re_login",
                message_value:{
                }
            })
        }
    }

    //登陆成功发给游戏层
    loginSuccess(){

        if(this._callback){
            this._callback({
                message_type:"login_success",
            })
        }
    }

    //登陆失败
    loginFail(code){
        if(this._callback){
            this._callback({
                message_type:"login_fail",
                message_value:{
                    code:code,
                }
            })
        }
    }


    playAudio(data){
        // let path = this._nim.audioToMp3({url: msg.file.url})
            // let userIdSplit = msg.from.split("_")
            // let userId = userIdSplit[userIdSplit.length  - 1]
        let url = data.path;
        cc.assetManager.loadRemote(url,{ext: '.mp3'}, (err, audioClip)=>{
            // play audio clip
            if(!err){
                if(this._currentPlayAudio){
                    this.stopAudio()
                }

                let audioViewData = data
                this._currentPlayAudio = cc.audioEngine.play(audioClip,false,1);
                this.updateAudioStart(audioViewData);
                let self = this;
                cc.audioEngine.setFinishCallback(this._currentPlayAudio,()=>{
                    cc.log("语音播放结束")
                    self.updateAudioEnd(audioViewData);
                    self._currentPlayAudio = null
                });
            }else{
                cc.error(err)
            }
        });
    }

    stopAudio(){
        // if(this._currentPlayAudio){
        //     cc.audioEngine.stop(this._currentPlayAudio);
        //     this.updateAudioEnd(this._playAudioPath);
        //     this._currentPlayAudio = null
        //     this._playAudioPath = ""
        // }
    }

    //通知获取用户信息给游戏层
    updateUserMessage(datas){
        if(this._callback){
            this._callback({
                message_type:"user_message",
                message_values:datas,
            })
        }
    }

    //通知获取用户信息失败给游戏层
    updateUserMessageFail(code){
        if(this._callback){
            this._callback({
                message_type:"user_message_fail",
                message_value:{
                    code:code,
                }
            })
        }
    }

    //通知消息发送失败给游戏层
    updateMessageFail(code){
        if(this._callback){
            this._callback({
                message_type:"game_message_send_fail",
                message_value:{
                    code:code,
                }
            })
        }
    }

    //通知开始播放语音给游戏层
    updateAudioStart(data){
        if(this._callback){
            this._callback({
                message_type:"player_message_start",
                message_value:{
                    data:data,
                }
            })
        }
    }

    //通知播放语音结束给游戏层
    updateAudioEnd(data){
        if(this._callback){
            this._callback({
                message_type:"player_message_end",
                message_value:{
                    data:data,
                }
            })
        }
    }


    //通知文本消息给游戏层
    updateTextMessage(datas,isHistory){

        let arrs = []
        for(let i=0;i<datas.length;i++){
            let msg = datas[i]
            if(msg.type == "text"){//文本
                arrs.push({
                    message:msg.text,
                    uuid:msg.idServer,
                    time:msg.time,
                    sessionid:msg.to,
                    fromAccount:msg.from,
                    name:msg.fromNick,
                    isMyMessage:this.myUser.account == msg.from ? true:false,
                    type:"text",
                })
            }

            if(this._callback){
                this._callback({
                    message_type: isHistory ? "history_message":"game_message",
                    message_values:arrs,
                })
            }
        }
    }


    updateAudioMessage(datas){
        let msg = datas
        if(msg.type == "audio" && msg.from != this.myUser.account ){//语音
            let arrs = {
                message:msg.text,
                uuid:msg.idServer,
                time:msg.time,
                sessionid:msg.to,
                fromAccount:msg.from,
                name:msg.fromNick,
                isMyMessage:this.myUser.account == msg.from ? true:false,
                path:this._nim.audioToMp3({url: msg.file.url}),
                duration:msg.file.dur,
                ext:msg.file.ext,
                type:"audio",
            }
            // let path = this._nim.audioToMp3({url: msg.file.url})
            // let userIdSplit = msg.from.split("_")
            // let userId = userIdSplit[userIdSplit.length  - 1]

            this.playAudio(arrs)
        }

    }

    //通知获取历史消息失败给游戏层
    updateHistoryMessageFail(code){
        if(this._callback){
            this._callback({
                message_type:"history_message_fail",
                message_value:{
                    code:code,
                }
            })
        }
    }




    // 发送文件（语音）
    async sendAudioFile(account, file, duration = 0) {
        if (!this._nim) {
             //console.warn("IM 未初始化，无法发送语音");
            return;
        }

         //console.log("准备发送语音:", file);
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        // 模拟一个包含当前录音文件的 input
        Object.defineProperty(fileInput, 'files', {
            value: [file],
        });

        this._nim.sendFile({
            scene: "team",
            to: account,
            type: "audio",
            fileInput: fileInput,
            uploadprogress: function(obj) {
                 //console.log("上传进度:", obj.percentageText);
            },
            uploaddone: function(err, fileObj) {
                 //console.log("上传完成:", err || fileObj);
            },
            beforesend: function(msg) {
                 //console.log("正在发送语音消息 id=", msg.idClient);
            },
            done: function(err, msg) {
                if (err) {
                     //console.error("语音发送失败:", err);
                } else {
                     //console.log("语音发送成功:", msg);
                }
            },
        });
    }

}

var QYIMWeb = new QYIMManage();
export default QYIMWeb;