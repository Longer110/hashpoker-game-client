
import IMManage from "./IMManage";

class IMMessageManager {
    constructor() {
        this._callback = null;
        this._isInit = false;
        this._isLogin = false;
        this._isRecording = false;
        this._recorder = null;
        this._chunks = [];
        this._mediaStream = null;
        this._appKey = "";
        this._maxRecordTime = 60;
    }

    /** 初始化 IM SDK */
    init(appKey) {
         //console.log("IMMessageManager 初始化:", appKey);
        this._isInit = true;
        this._appKey = appKey;

        // 设置回调：桥接到游戏层
        IMManage.setCallback((data) => {
            if (this._callback) {
                this._callback(JSON.stringify(data));
            }
        });

        this._sendCallback({ message_type: "im_init" });
    }

    /** 设置游戏层回调 */
    setCallback(cb) {
        this._callback = cb;
    }

    /** 登录 */
    login(account, token) {
        if (!this._isInit) {
             //console.warn("IM 未初始化");
            return;
        }
         //console.log("IMMessageManager 登录:", account);
        IMManage.login(this._appKey, account, token);
        this._isLogin = true;
    }

    /** 登出 */
    logout() {
        IMManage.logout();
        this._isLogin = false;
        this._sendCallback({ message_type: "logout" });
    }

    /** 发送文本消息 */
    sendMessage(sessionId, text) {
        if (!this._isLogin) {
             //console.warn("未登录，无法发送消息");
            return;
        }
        IMManage.sendTextMessage(sessionId, text);
    }

    /** 开始录音 */
//    async startRecorder(tid, type = 1, maxDuration = 60) {
//         if (!this._isInit) return;
//         if (!this._isLogin) {
//              //console.warn("未登录，无法发送消息");
//             return;
//         }
//         try {
//             const stream = await this.getMicrophoneStream();
//             this._audioChunks = [];
//             this_mediaStream = stream;
//             this._mediaRecorder = new MediaRecorder(this_mediaStream);

//             this._mediaRecorder.ondataavailable = (e) => {
//                 if (e.data.size > 0) this._audioChunks.push(e.data);
//             };

//             this._mediaRecorder.onstart = () => {
//                 this._sendCallback({ message_type: "record_message_start", message_value: { tid, type } });
//             };

//             this._mediaRecorder.start();
//             this._timer = setTimeout(() => this.recordingComplete(), maxDuration * 1000);

//         } catch (err) {
//             this._sendCallback({ message_type: "record_message_end", message_value: { error: err.message } });
//              //console.error("录音失败:", err);
//         }
//     }

    async startRecorder(tid, type = 1, maxDuration = 60) {
        if (!this._isInit || !this._isLogin) {
             //console.warn("未初始化或未登录，无法录音");
            return;
        }
        return;
        try {
            const stream = await this.getMicrophoneStream();
            this._audioChunks = [];
            this_mediaStream = stream;
            this._tid = tid;
            this._isRecording = true;

            this._mediaRecorder = new MediaRecorder(stream);

            this._mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this._audioChunks.push(e.data);
            };

            this._mediaRecorder.onstart = () => {
                this._sendCallback({ message_type: "record_message_start", message_value: { tid, type } });
            };

            this._mediaRecorder.onstop = async () => {
                const blob = new Blob(this._audioChunks, { type: "audio/webm" });
                const duration = await this._getBlobDuration(blob);
                const file = new File([blob], `voice_${Date.now()}.webm`, { type: "audio/webm" });


                 //console.log("录音文件类型:", file.type, "大小:", file.size, "是否 File:", file instanceof File);

                this._sendCallback({ message_type: "record_message_end" });
                IMManage.sendAudioFile(tid, file, "audio", duration);
            };

            this._mediaRecorder.start();
            this._timer = setTimeout(() => this.recordingComplete(), maxDuration * 1000);
        } catch (err) {
             //console.error("录音失败:", err);
            this._sendCallback({ message_type: "record_message_end", message_value: { error: err.message } });
            if (this_mediaStream) this_mediaStream.getTracks().forEach(t => t.stop());
        }
    }
    

    isRecording(){
        return this._isRecording;
    }


    isPlayingAudio(){
        return this._isRecording;
    }
    

    /** 完成录音并发送语音 */
    // recordingComplete() {
    //     if (!this._isRecording) return;
    //     this._isRecording = false;

    //     if (this._recorder && this._recorder.state !== "inactive") {
    //         this._recorder.stop();
    //         this._recorder.onstop = async () => {
    //             const blob = new Blob(this._chunks, { type: "audio/webm" });
    //             const duration = await this._getBlobDuration(blob);
    //              //console.log("录音完成，准备发送语音，时长:", duration.toFixed(1), "s");

    //             this._sendCallback({ message_type: "record_message_end" });

    //             // 发送语音
    //             const file = new File([blob], "voice_" + Date.now() + ".webm", { type: "audio/webm" });
    //             IMManage.sendFile(this._tid, file, "audio", duration);
    //         };
    //     }

    //     if (this._mediaStream) {
    //         this._mediaStream.getTracks().forEach((t) => t.stop());
    //     }
    // }

    recordingComplete() {
        if (!this._isRecording) return;
        this._isRecording = false;

        clearTimeout(this._timer);
        this._timer = null

        if (this._mediaRecorder && this._mediaRecorder.state !== "inactive") {
            this._mediaRecorder.stop();
        }

        if (this_mediaStream) {
            this_mediaStream.getTracks().forEach(t => t.stop());
        }
    }

    /** 取消录音 */
    recordingCanceling() {
        if (!this._isRecording) return;
        this._isRecording = false;
        if (this._recorder && this._recorder.state !== "inactive") {
            this._recorder.stop();
        }
        if (this._mediaStream) {
            this._mediaStream.getTracks().forEach((t) => t.stop());
        }
        clearTimeout(this._timer);
        this._timer = null
        this._sendCallback({ message_type: "record_message_end" });
    }

    /** 播放语音 */
    playAudio(filePath) {
        if (!filePath) return;
         //console.log("播放语音:", filePath);
        IMManage.playAudio(filePath);
    }

    /** 停止播放语音 */
    stopAudio() {
        IMManage.stopAudio();
    }

    /** 获取 Blob 音频时长 */
    async _getBlobDuration(blob) {
        return new Promise((resolve) => {
            const tempAudio = document.createElement("audio");
            tempAudio.src = URL.createObjectURL(blob);
            tempAudio.addEventListener("loadedmetadata", () => {
                resolve(tempAudio.duration || 0);
            });
        });
    }

    /** 工具函数：统一向游戏层派发 */
    _sendCallback(data) {
        if (this._callback) {
            this._callback(JSON.stringify(data));
        }
    }



    ///麦克风权限******************************************
      async ensureMicrophonePermission() {
        // TG Mini App 或普通浏览器统一处理
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
             //console.error('当前环境不支持录音');
            throw new Error("当前环境不支持录音");
        }

        // 浏览器 Permissions API 检查
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: 'microphone' });
                if (status.state === 'granted') {
                    return true;
                } else if (status.state === 'prompt') {
                    // 后续 getUserMedia 会弹出权限请求
                    return true;
                } else {
                     //console.error('麦克风权限被拒绝');
                }
            } catch (e) {
                 //console.error('Permissions API 查询失败，直接请求麦克风', e);
                return true;
            }
        }
        return true;
    }

    // 获取麦克风流
    async getMicrophoneStream() {
        await this.ensureMicrophonePermission();
        return await navigator.mediaDevices.getUserMedia({ audio: true });
    }
}
var imMessageManager = new IMMessageManager();
module.exports = imMessageManager;