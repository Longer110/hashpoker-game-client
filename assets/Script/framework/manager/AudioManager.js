// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 音频管理
// ]]

let EnvironmentManager = require("EnvironmentManager");
let env = EnvironmentManager.default;

let INTERRUPTED = false;
let RUN_ON_BACKGROUND = false;
let TIMEOUT_LOAD_EFFECT = 500;
let TIMEOUT_LOAD_MUSIC = 3000;
let AUDIO_CONTEXT_STATE = "null";
let array_delta_time = [];

var bStopedMusic = false
var bStopedEffect = false

var effectVolume = 1;
var musicVolume = 1;

let path_empyt_audio = "common/empty";

let GLOBAL_MUSIC_AUDIO = {};
let AudioManager = function (bundle, wrapper) {
    this.name = "AudioManager";

    this._wrapper = wrapper;
    this._bundle = bundle;
    this._mapClip = new Map;
    this._arrPreload = new Array;
    this._loading = false;


    this._listCallback = [];
    this._resetCurrentMusic();
    this.init(bundle, wrapper);
}

let proto = AudioManager.prototype;

proto.load = function (params) {
}
proto.destroy = function (params) {
    //TODO
    for (const key in this._mapClip) {
        let clip = this._mapClip.get(key);
        clip.decRef();
    }
    
    this._mapClip = null;
    this._arrPreload.length = 0;
}

proto.init = function (bundle, wrapper) {
    this._wrapper = wrapper;
    this._bundle = bundle;
}

proto.resumeContent = function (params) {
    let self = this;
    let timestart = Date.now();
    let context = null;
    if(cc.sys.__audioSupport){
        context = cc.sys.__audioSupport.context;
    }
    if(!context){
        cc.warn("AudioManager", "context is null!")
        return;
    }

    let timeend = Date.now();
    let deltaTime = timeend - timestart;
    timestart = timeend;
    array_delta_time.push(deltaTime);
    if(array_delta_time.length>5){
        array_delta_time.shift();
    }
    let sum = 0;
    for (let index = 0; index < array_delta_time.length; index++) {
        const element = array_delta_time[index];
        sum += element;
    }
    deltaTime = sum/array_delta_time.length;
    
    let e = context;
    if("suspended" === e.state){
        // if(GLOBAL_MUSIC_AUDIO.path && GLOBAL_MUSIC_AUDIO.path!=""){
            if(AUDIO_CONTEXT_STATE!=e.state){
                cc.warn("AudioManager", "state suspended=true, isRunOnBackground=" + App.isRunOnBackground);
                AUDIO_CONTEXT_STATE = e.state;
            }
            if(e.resume){
                e.resume().then(function () {
                    if(AUDIO_CONTEXT_STATE!="resume"){
                        cc.warn("AudioManager", "state resume=true, isRunOnBackground=" + App.isRunOnBackground);
                        AUDIO_CONTEXT_STATE = "resume";
                    }
                });
            }
        // }
    }
    else if("interrupted" === e.state){
        let newcontext = new(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        if(newcontext){
            context = newcontext;
            cc.sys.__audioSupport.context = context;
            e = newcontext;
        }
        else{
            cc.warn("AudioManager", "new context error!")
            if(e.resume){
                e.resume();
                cc.log("AudioManager","e.resume")
            }            
        }
    
        INTERRUPTED = true;
        if(GLOBAL_MUSIC_AUDIO.path && GLOBAL_MUSIC_AUDIO.path!=""){
            self.playMusic(GLOBAL_MUSIC_AUDIO.path);
        }
        if(AUDIO_CONTEXT_STATE!=e.state){
            cc.warn("AudioManager", "state interrupted=true, isRunOnBackground=" + App.isRunOnBackground);
            AUDIO_CONTEXT_STATE = e.state;
        }
    }
    else if("running" === e.state){
        AUDIO_CONTEXT_STATE = e.state;

        // if(INTERRUPTED){
        //     INTERRUPTED = false;
        //     RUN_ON_BACKGROUND = false;
        //     self.resumeMusic();
        //     self.resumeAllEffects();
        //     cc.warn("AudioManager", "state running=true, isRunOnBackground=" + App.isRunOnBackground);
        // }
        // //暂定为是在后台运行
        // else if(deltaTime>800){
        //     if(!RUN_ON_BACKGROUND && !App.isRunOnBackground){
        //         RUN_ON_BACKGROUND = true;
        //         cc.warn("AudioManager", "超时暂定为后台运行, isRunOnBackground=" + App.isRunOnBackground, deltaTime);
        //         self.pauseMusic();
        //         self.pauseAllEffects();
        //     }
        // }
        // else{
        //     if(RUN_ON_BACKGROUND){
        //         cc.warn("AudioManager", "定时恢复为前台运行, isRunOnBackground=" + App.isRunOnBackground, deltaTime);
        //         self.resumeMusic();
        //         self.resumeAllEffects();
        //     }
        //     RUN_ON_BACKGROUND = false;
        // }
    }
}

proto.checkInterrupted = function (params) {
    return; //新引擎先不开启这段代码，试试背景音乐会不会有异常

    if(!(cc.sys.isMobile && cc.sys.isBrowser)){
        return;
    }
    
    let self = this;
    setInterval(function () {
        self.resumeContent();
    }, 100)
}
proto.isTheSameMusic = function(path){
    let flag = false;
    if(GLOBAL_MUSIC_AUDIO && GLOBAL_MUSIC_AUDIO.path==path){
        if(GLOBAL_MUSIC_AUDIO.id!=-1){
            flag = true;
        }
    }
    return flag;
},
proto.playMusic = function(path, loop){
    if(env.get("IS_LIVE_ONLY")){ //直播平台默认不播背景音乐
        let subgame = app.game.getGame();
        if(subgame && subgame.canPlayMusic()){
        }
        else{
            return;
        }
    }

    this._resetCurrentMusic();
    GLOBAL_MUSIC_AUDIO.path = path;

    bStopedMusic = false;

    if(null==loop){
        loop = true;
    } 
    let audio = {id:-1, path:""};
    if(musicVolume===0){
        // return audio;
    }

    return this._play(true, path, loop, audio);
}

proto.playEffect = function (path, loop) {
    let audio = {id:-1, path:""};
    if(bStopedEffect ||effectVolume===0){
        return audio;
    }
    
    let context = cc.sys.__audioSupport&&cc.sys.__audioSupport.context || {};
    if ((!context.state || context.state === "suspended") && context.currentTime === 0) {
        cc.log("suspended path:", path);
        return audio;
    }

    return this._play(false, path, loop, audio);
}

proto.playEmpty = function () {
    let path = path_empyt_audio;
    let loop = false;
    let audio = {id:-1, path:""};

    return this._play(false, path, loop, audio);
}

proto.stopMusic = function () {
    // if(env.get("IS_LIVE_ONLY")){ //直播平台不播背景音乐
    //     return;
    // }

    cc.log("AudioManager", "背景音乐停止", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = true;
    cc.audioEngine.stopMusic();
    this._resetCurrentMusic();
}
proto.pauseMusic = function () {
    cc.log("AudioManager", "背景音乐暂停", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = true;
    return cc.audioEngine.pauseMusic();
}

proto.resumeMusic = function () {
    cc.log("AudioManager", "背景音乐恢复", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = false;
    cc.audioEngine.resumeMusic();
    this._resumeCurrentMusic();
}

//重新播放因异步加载完成但未播放的背景音乐
proto._resumeCurrentMusic = function () {
    if(GLOBAL_MUSIC_AUDIO.id==-1 && GLOBAL_MUSIC_AUDIO.path!=""){
        this.playMusic(GLOBAL_MUSIC_AUDIO.path);
    }
}

proto._resetCurrentMusic = function () {
    GLOBAL_MUSIC_AUDIO = {id:-1, path:""};
}

proto.stopEffect = function (audioID) {
    // this._bStopedEffect = true;
    if(typeof audioID == "object"){
        audioID = audioID.id;
    }
    return cc.audioEngine.stopEffect(audioID);
}

proto.pauseEffect = function (audioID) {
    // this._bStopedEffect = true;
    if(typeof audioID == "object"){
        audioID = audioID.id;
    }
    return cc.audioEngine.pauseEffect(audioID);
}

proto.pauseAllEffects = function () {
    bStopedEffect = true;
    cc.audioEngine.pauseAllEffects();
}


proto.stopAllEffects = function () {
    bStopedEffect = true;
    cc.audioEngine.stopAllEffects();
}


proto.resumeEffect = function (audioID) {
    // this._bStopedEffect = false;
    if(typeof audioID == "object"){
        audioID = audioID.id;
    }
    cc.audioEngine.resumeEffect(audioID);
}

proto.resumeAllEffects = function () {
    bStopedEffect = false;
    cc.audioEngine.resumeAllEffects();
}

proto.pauseAll = function () {
    cc.log("AudioManager", "背景音乐暂停 2", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = true;
    bStopedEffect = true;
    cc.audioEngine.pauseAll();
}

proto.resumeAll = function () {
    cc.log("AudioManager", "背景音乐恢复 2", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = false;
    bStopedEffect = false;
    cc.audioEngine.resumeAll();
    this._resumeCurrentMusic();
}

proto.stopAll = function () {
    cc.log("AudioManager", "背景音乐停止 2", GLOBAL_MUSIC_AUDIO.path);
    bStopedMusic = true;
    bStopedEffect = true;
    this._resetCurrentMusic();
    cc.audioEngine.stopAll();
}

proto.getMusicVolume = function () {
    return cc.audioEngine.getMusicVolume();
}

proto.getEffectsVolume = function () {
    return cc.audioEngine.getEffectsVolume();
}

proto.setMusicVolume = function (volume) {
    musicVolume = volume;
    return cc.audioEngine.setMusicVolume(volume);
}

proto.setEffectsVolume = function (volume) {
    effectVolume = volume;
    return cc.audioEngine.setEffectsVolume(volume);
}

proto.isLoaded = function () {
    let finish = (!this._loading && this._arrPreload.length==0) ? true : false;
    return finish;
}

proto.preload = function (array, callback) {
    if(typeof array == "string"){
        array = [array];
    }
    for (let i = 0; i < array.length; i++) {
        const path = array[i];
        let url = this._rawUrl(path);
        let clipCache = this._mapClip.get(url);
        if(!clipCache){
            let find = false;
            for (let j = 0; j < this._arrPreload.length; j++) {
                const element = this._arrPreload[j];
                if(element==url){
                    find = true;
                    break;
                }
            }
            if(!find){
                this._arrPreload.push(url);
            }
        }
    }
    
    if(callback){
        this._listCallback.push(callback);
    }
    if(this._loading){
        return;
    }
    else if(this._arrPreload.length==0){
        this._onLoadFinish();
        return;
    }

    this._loading = true;
    this._loadNextClip();
}

proto._loadNextClip = function () {
    if(this._arrPreload.length==0){
        this._loading = false;
        this._onLoadFinish();
        return;
    } 

    let url = this._arrPreload[0];
    let clipCache = this._mapClip.get(url);
    if(!clipCache){
        this._loadClip(url, function (clip) {
            this._arrPreload.shift();
            this._loadNextClip();
        }.bind(this))
    }
    else{
        this._arrPreload.shift();
        this._loadNextClip();
    }
}

proto._onLoadFinish = function(){
    let array = this._listCallback;
    for (let index = 0; index < array.length; index++) {
        const callback = array[index];
        callback();
    }
    this._listCallback = [];
}

proto._play = function(isMusic, path, loop, audio){
    let self = this;
    if(cc.game.isPaused()){
        cc.log("AudioManager", "_play:pause");
        return
    }

    let url = self._rawUrl(path);
    let clipCache = self._mapClip.get(url);
    let timestart = Date.now();
    // cc.log("AudioManager", "_play：" + url);
    let _handler = function(clip) {
        
        // cc.log("AudioManager", "_playHandler：" + url);
        if(isMusic){
            audio.id = cc.audioEngine.playMusic(clip, loop);
            GLOBAL_MUSIC_AUDIO.id = audio.id;
        }
        else{
            audio.id = cc.audioEngine.playEffect(clip, loop);
        }
        audio.path = url;
    }
    if(clipCache){
        _handler(clipCache);
    }
    else{
       
        self._loadClip(url, function (clip) {
            if(!clip) return;
    
            let timeend = Date.now();
            let deltaTime = timeend - timestart;
            let timeout = isMusic ? TIMEOUT_LOAD_MUSIC : TIMEOUT_LOAD_EFFECT;
            let skip = false;
            if(deltaTime>timeout){
                if(isMusic){
                    //相同的背景音乐且未播放
                    if(path==GLOBAL_MUSIC_AUDIO.path && GLOBAL_MUSIC_AUDIO.id==-1){
                    }
                    else{
                        skip = true;
                    }
                }
                else{
                    skip = true;
                }
            }
            if(skip){
                cc.warn("AudioManager", "加载音频耗时：" + deltaTime + "(ms)", url);
            }
            else if(isMusic && bStopedMusic){
                cc.warn("AudioManager", "已停止播放背景音乐：_bStopedMusic=", bStopedMusic);
            }
            else{
                cc.log("AudioManager", "加载音频到播放耗时：" + deltaTime + "(ms)", url);
                _handler(clip);
            }
        })
    }
    return audio;
}

proto._loadClip = function (url, callback) {
    let self = this;
    let timestart = Date.now();
    if(!this._bundle){
        this._bundle = cc.resources;
        if(!this._bundle){
            cc.warn("AudioManager", "当前项目assets目录下不存在resources目录");
            return;
        }
    }
    this._bundle.load(url, cc.AudioClip, 
        function progressCallback(params) {
            // cc.log("progerss:", arguments);
        },
        function completeCallback(err, clip) {
            if(!err){
                clip.addRef();
                self._mapClip.set(url, clip);
                if(null!=callback){
                    callback(clip);
                }
            }
            else{
                let timeend = Date.now();
                let deltaTime = timeend - timestart;
                cc.warn("AudioManager", "加载音频出错：time=" + deltaTime + "(ms), url="+url, err);
                if(null!=callback){
                    callback(null);
                }
            }
        }
    );
}

proto._rawUrl = function(path){
    path = "audio/" + path;
    return path;
    // return cc.url.raw("resources/" + path);
}

AudioManager.default = new AudioManager(null);
module.exports = AudioManager;