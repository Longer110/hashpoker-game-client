
let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');

let UIFrame = require("UIFrame");
export default class VideoChatManager {
    constructor() {
        this.appKey = "";
        this.uid = null;
        this.roomId = null;
        this.token = null;
        this.client = null;
        this.isPermissionSure = false; //判断是否加入语聊房间（没有权限会加入失败）
        this.localStream = null;
        this.remoteStreams = {};
        this.micEnabled = false; // 自己麦克风状态 true:开 false:闭
        this.speakingMap = {}; // { uid: volume }
        this.onSpeakingUpdate = null; // 外部回调: (speakingUsers) => {}
        this.isSpeaking = false; // 检测自己是否在说话
        this.speakingThreshold = 5; // 设置音量阈值，用于判断是否在说话
        this.lastConfig = null;  //记录初始化参数，如果加入失败重新加入使用
        this._initing = false; //是否正在初始化

    }

    /**
     * 初始化语音通话
     * @param {Object} options { appKey, uid, roomId, token }
     */
    async init(options) {
        this.lastConfig = options;

        if (!window.NERTC) return;

        if (this._initing) {
            console.warn('[NERTC] init already in progress');
            return;
        }
        this._initing = true;

        const support = await NERTC.checkSystemRequirements();
        if (!support) return;

        let stream; 

        try {
            if (!this.client) {
                this.client = NERTC.createClient({
                    appkey: options.appKey,
                    debug: false
                });
                this._bindClientEvents();
            }

            // 防止重复 join
            if (this.joined) {
                await this.leaveRoom();
            }

            await this.client.join({
                channelName: options.roomId,
                uid: options.uid,
                token: options.token
            });
            this.joined = true;

            const microphones = await this.checkMicPermission();
            stream = NERTC.createStream({
                uid: options.uid,
                audio: true,
                video: false,
                microphoneId: microphones?.microphoneId
            });

            await stream.init();              // ⚠️ 真正申请权限
            await this.client.publish(stream);

            this.localStream = stream;
            this.setMuteSelf(false);
            this.setAudioPermission(true);

        } catch (err) {
            console.error('[NERTC] init error:', err);

            // init 失败，立刻释放临时流
            if (stream) {
                try { stream.close(); } catch (e) { }
            }

            if (/Permission denied/i.test(err.toString()) || /denied permission/i.test(err.toString())) {
                this.setAudioPermission(false);
            }
            if (this.joined) {
                await this.leaveRoom();
            }
            UIFrame.showTips("聊天语音未正常开启")
        } finally {
            this._initing = false;
        }
    }

    getAudioPermission() {
        return this.isPermissionSure
    }

    setAudioPermission(bo) {
        this.isPermissionSure = bo
    }


    /**
  * 实时检测自身麦克风音量（是否在说话）
  * @returns {Promise<void>}
  */
    async checkSelfAudioVolume() {

        // 防止重复创建
        if (this._audioContext) return;

        // 1. 获取麦克风流
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 2. AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        // 3. Analyser
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.fftSize);

        this._audioContext = audioContext;
        this._audioStream = stream;
        this._audioAnalyser = analyser;
        this._audioDataArray = dataArray;

        // 状态
        this._isSelfSpeaking = false;
        this._lastSpeakTime = 0;

        const threshold = 0.03;     // 说话阈值（可调）
        const silenceDelay = 300;   // 静音判定延迟 ms

        const detect = () => {
            if (!this._audioAnalyser) return;

            analyser.getByteTimeDomainData(dataArray);
            // 4. 计算 RMS 音量
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const v = (dataArray[i] - 128) / 128;
                sum += v * v;
            }
            let rms = Math.sqrt(sum / dataArray.length);
            const now = Date.now();
            if (rms > threshold) {
                this._lastSpeakTime = now;
                if (!this._isSelfSpeaking) {
                    this._isSelfSpeaking = true;
                    let mute = this.getMuteSelf()
                    if (!mute) {
                        rms = 0;
                    }
                    MsgManager.fire(CHAT_MSG.NOTIFY.VIDEO_PLAY_SELF_AUDIO, rms)
                }
            } else {
                if (this._isSelfSpeaking && now - this._lastSpeakTime > silenceDelay) {
                    this._isSelfSpeaking = false;
                    // cc.log("停止说话");
                    MsgManager.fire(CHAT_MSG.NOTIFY.VIDEO_PLAY_SELF_AUDIO, 0)
                }
            }

            requestAnimationFrame(detect);
        };

        detect();
    }


    /**
     * 手动检查麦克风权限 （加入语聊房间）
     */
    async _checkAudioPermission() {
        if (this.isPermissionSure) {
            return true;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            this.isPermissionSure = false;
            throw new Error("getUserMedia not supported");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        stream.getTracks().forEach(t => t.stop());

        this.isPermissionSure = true;

        return true;
    }





    /**
     * 绑定客户端事件
     */
    _bindClientEvents() {
        const self = this;
        this.client.on("stream-added", (evt) => {

            const remoteStream = evt.stream;
            remoteStream.setSubscribeConfig({
                audio: true,//订阅麦克风音频
                audioSlave: false,//订阅音频辅流
                video: false,//订阅视频
                screenShare: false,//订阅屏幕共享
                // highOrLow: NERTC.STREAM_TYPE.HIGH,//订阅大流
            })
            const uid = remoteStream.getId();
            //console.log(`[NERTC] 检测到远端用户 ${uid} 发布流`);
            self.client.subscribe(remoteStream);

        });

        this.client.on("stream-subscribed", (evt) => {
            const remoteStream = evt.stream;
            const uid = remoteStream.getId();
            self.remoteStreams[uid] = remoteStream;
            //console.log(`[NERTC] 已订阅远端音频流: ${uid}`);
            remoteStream.play();

            // remoteStream.play({ muted: false });
        });

        this.client.on("peer-leave", (evt) => {
            const uid = evt.uid;
            //console.log(`[NERTC] 用户 ${uid} 离开`);
            if (self.remoteStreams[uid]) {
                self.remoteStreams[uid].stop();
                delete self.remoteStreams[uid];
            }
            delete self.speakingMap[uid];
            if (self.remoteMuteState[uid]) {
                delete self.remoteMuteState[uid];
            }
            self._notifySpeakingUpdate();
        });

        // 🎤 音量检测 远端（核心）
        this.client.on("volume-indicator", (volumes) => {
            // volumes = [{uid, volume}]
            volumes.forEach(item => {
                self.speakingMap[item.uid] = item.level;
                //console.log(`用户ID: ${item.uid}, 音量: ${item.level}`);
            });
            self._notifySpeakingUpdate();
        });



        this.client.on("connection-state-change", (state) => {
            //console.log("[NERTC] 网络状态变化:", state);
        });

        this.client.on("error", (err) => {
            //console.error("[NERTC] 错误:", err);
        });
    }

    /**
     * 通知外部谁在说话
     */
    _notifySpeakingUpdate() {
        if (typeof this.onSpeakingUpdate === "function") {
            // 筛选音量大于阈值的用户，认为在说话
            const speakingUsers = Object.keys(this.speakingMap)
                .filter(uid => this.speakingMap[uid] > this.speakingThreshold); // 音量 > 5 认为在说话
            this.onSpeakingUpdate(speakingUsers);
        }
    }

    /**
     * 获取自己麦克风状态
     */
    getMuteSelf() {
        console.log("[NERTC] 获取自己麦克风状态：" + this.micEnabled);
        return this.micEnabled;
    }

    /**
     * 静音 / 取消静音自己
     */
    setMuteSelf(isMuted) {
        if (!this.localStream) return;
        if (!isMuted) {
            this.localStream.muteAudio();
            this.micEnabled = false;
            console.log("[NERTC] 已关闭自己麦克风");
        } else {
            this.localStream.unmuteAudio();
            this.micEnabled = true;
            console.log("[NERTC] 已开启自己麦克风");
        }
    }



    remoteMuteState = {};//记录是否静音了远端用户
    getRemoteMuteState(uid) {
        if (this.remoteMuteState.hasOwnProperty(uid)) {
            return false;
        }
        return true;
    }

    // 静音 / 取消静音远端用户
    setMuteRemote(uid, isOpen) {
        let remoteStream = this.remoteStreams[uid];
        if (!remoteStream) {
            //console.warn(`[NERTC] 未找到远端用户 ${uid} 的流`);
            return;
        }

        try {
            if (!isOpen) {
                remoteStream.muteAudio();
                this.remoteMuteState[uid] = "";//仅添加Key值判断，value无所谓
                //console.log(`[NERTC] 静音远端用户 ${uid}`);
            } else {
                remoteStream.unmuteAudio();
                delete this.remoteMuteState[uid];
                //console.log(`[NERTC] 取消静音远端用户 ${uid}`);
            }
        } catch (e) {
            //console.error(`[NERTC] 设置远端用户 ${uid} 静音失败:`, e);
        }
    }

    async leaveClientRoom() {
        // 停止所有远端音频
        if (this.remoteStreams) {
            Object.values(this.remoteStreams).forEach(stream => {
                try {
                    stream.stop();
                } catch (e) { }
            });
            this.remoteStreams = {};
        }

       
    }


    /**
     * 离开语音房间
     */
    async leaveRoom() {
        try {
            await this.leaveClientRoom();
            if (this.client && this.joined) {
                await this.client.leave();
            }
           
            if (this.localStream) {
                this.localStream.close();
                this.localStream = null;
            }
            this.remoteStreams = {};
            this.speakingMap = {};
            this.joined = false
            //console.log("[NERTC] 已离开语音房间");
        } catch (err) {
            //console.error("[NERTC] 离开房间失败:", err);
        }

        this.setAudioPermission(false);
    }

    // 重连调用
    async reconnect() {
        // try {
        //     await this.init(this.lastConfig);
        // } catch (err) {
        //     //console.error("重连失败", err);
        // }
    }

    // 检测到麦克风
    async checkMicPermission() {
        try {
            const devices = await NERTC.getMicrophones();
            if (devices.length === 0) {
                //console.warn("未检测到麦克风设备");
                return null
            }
            return devices[0]
        } catch (err) {
            //console.error("检测麦克风权限失败", err);
            return null
        }
    }
}
