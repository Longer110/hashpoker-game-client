let UIBase = require("UIBase");
let UIFrame = require("UIFrame");
let ConfigGame = require("ConfigGame");
let LocalStorage = require("LocalStorage");
let Utils = require("Utils");
let Msg = require("Msg");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasBase = require("TexasBase");
let TexasUtils = require("TexasUtils");
// let UINoticeData = require("UINoticeData");
let UserInfo = require("UserInfo");
const i18n = require('i18n'); 

let my = require("my");

cc.Class({
    extends: TexasBase,

    properties: {
        voiceNode: cc.Node,
        musicForbit: {
            default: null,
            type: cc.Node,
        },
        soundForbit: {
            default: null,
            type: cc.Node,
        },
        slider_music: {
            default: null,
            type: cc.Node,
        },
        slider_sound: {
            default: null,
            type: cc.Node,
        },
        label_version: {
            default: null,
            type: cc.Label,
        },

        titleText: cc.Label,//系统设置
        voiceText: cc.Label,//语音
        musicText: cc.Label,//音乐
        soundText: cc.Label,//音效
        version: cc.Label,//版本号
    },

    onLoad () {
        this.initSetting();
        
        MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._isShowWindow, this);
    },

    onDestroy(){
        MsgManager.un(this._isShowWindow);
    },

    onStart() {
      
    },

    //初始化界面
    _initPanel() {

    },

    initUI(data){
        this.data = data;
        this.initChat();
    },

    //初始化设置
    initSetting() {
        if (this.titleText) {
            this.titleText.string = TexasUtils._getText(35);
        }

        if (this.version) {
            let gameVersion = app.game.getGame()?"-" + app.game.getGame().getVersion():"";
            this.version.string = i18n.t("COMMON.BAN_BEN_NUMBER") + app.config.VERSION + gameVersion;
        }

        if (TexasUtils._getSkin(["default","d"])) {
            let voiceClose = this.voiceNode.getChildByName("voiceClose");//关闭语音
            let voiceOpen = this.voiceNode.getChildByName("voiceOpen");//开启语音
    
            //设置麦克风
            let systemVoice = app.storage.getItem("Texas_system_voice","off");
            if(systemVoice=="on"){
                voiceClose.active = false;
                voiceOpen.active = true;
            }else{
                voiceClose.active = true;
                voiceOpen.active = false;
            } 

            this.voiceText.string = TexasUtils._getText(46);//语音
            this.musicText.string = TexasUtils._getText(47);//音乐
        }

        if (this.soundText) {
            this.soundText.string = TexasUtils._getText(48);//音效
        }
        
        Utils.getNodes(this.node)
        //设置版本号
        // this.label_version.string = i18n.t("COMMON.DANG_QIAN_BAN_BEN") + ConfigGame.VERSION;
        // if(ConfigGame.ENABLE_CHANNEL){
        //     this.label_version.node.active = !!ConfigGame.CUSTOM.ENABLE_SHOW_VERSION;
        // }else{
        //     this.label_version.node.active = true
        // }

        this.refreshVolume();
        this.node.bg.active = true;
    },

    //点击
    onBtnClicked: function (event) {
        if (event.target.name == "btn_exit" || event.target.name == "block") {
            MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

            //关闭界面
            // this.close();
            this.node.active = false;
            MsgManager.fire(MSG.NOTIFY.NOTIFY_SHOW_ROOM_CONFIG);
        }
        else if (event.target.name == "btn_musicMute") {
            if (this._isMusic) {
                this._tempMusicVolume = app.audio.getMusicVolume();
                //音乐静音
                LocalStorage.setMusicVolume(0);
            }

            if (!this._isMusic) {
                if (!this._tempMusicVolume || this._tempMusicVolume <= 0) {
                    LocalStorage.setMusicVolume(0.5);
                }
                else {
                    LocalStorage.setMusicVolume(this._tempMusicVolume);
                }
            }
            this.refreshVolume();
        }
        else if (event.target.name == "btn_soundMute") {
            if (this._isEffect) {
                this._tempEffectVolume = app.audio.getEffectsVolume();
                //音效静音
                LocalStorage.setEffectVolume(0);
            }
            if (!this._isEffect) {
                if (!this._tempEffectVolume || this._tempEffectVolume <= 0) {
                    LocalStorage.setEffectVolume(0.5);
                }
                else {
                    LocalStorage.setEffectVolume(this._tempEffectVolume);
                }
            }
            this.refreshVolume();
        }
    },

    //设置音量
    onClickBtnVoice() {
        let open = this.voiceNode.getChildByName("voiceOpen");
        let bOpen = !open.active;
        let value = bOpen?"on":"off";
        TexasUtils.toggleSystemVoice(bOpen,value);

        let voiceClose = this.voiceNode.getChildByName("voiceClose");//关闭语音
        let voiceOpen = this.voiceNode.getChildByName("voiceOpen");//开启语音
        if(bOpen){
            voiceClose.active = false;
            voiceOpen.active = true;
        }else{
            voiceClose.active = true;
            voiceOpen.active = false;
        } 
    },

    //滑动
    onSlidered: function (slider) {
        if (slider.node.name == "slider_music") {
            //设置音乐音量            
            LocalStorage.setMusicVolume(slider.progress);
        }
        if (slider.node.name == "slider_sound") {
            //设置音效音量
            LocalStorage.setEffectVolume(slider.progress);
        }
        this.refreshVolume();
    },

    //刷新音量
    refreshVolume: function () {
        cc.log("refreshVolume app.audio.getMusicVolume(),app.audio.getEffectsVolume():",app.audio.getMusicVolume(),app.audio.getEffectsVolume());
        cc.log("refreshVolume this.slider_music.width,this.slider_sound.width:",this.slider_music.width,this.slider_sound.width);
        let musicWidth = this.slider_music.width * app.audio.getMusicVolume();
        this.slider_music.getComponent(cc.Slider).progress = app.audio.getMusicVolume();
        this.slider_music.getChildByName("progress").width = musicWidth;

        

        let effectWidth = this.slider_sound.width * app.audio.getEffectsVolume();
        this.slider_sound.getComponent(cc.Slider).progress = app.audio.getEffectsVolume();
        this.slider_sound.getChildByName("progress").width = effectWidth;

        if (app.audio.getMusicVolume() <= 0) {
            this.musicForbit.active = true;
            this._isMusic = false;
        }
        else {
            this.musicForbit.active = false;
            this._isMusic = true;
        }

        if (app.audio.getEffectsVolume() <= 0) {
            this.soundForbit.active = true;
            this._isEffect = false;
        }
        else {
            this.soundForbit.active = false;
            this._isEffect = true;
        }
    },

    //显示界面后调用
    onShow(){
        this._super();
    },
    //关闭界面后调用
    onClose(){
        this._super();
    },

    //是否显示弹窗
    _isShowWindow(data) {
        cc.log("是否显示设置弹窗 data:",data);
        
        let nRlt = data.nRlt;
        if (nRlt==0) {
            // this.close();
            this.node.active = false;
        }
    },
});
