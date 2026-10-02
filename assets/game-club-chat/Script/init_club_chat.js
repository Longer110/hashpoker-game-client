let my = require("my");

class WrapperChat extends my.WrapperBase {
    bundleName = 'game-club-chat';
    key = "chat"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    constructor(options) {
        super(options);
    }

    _initLanguage(options) {
        if (this._langInited || CC_EDITOR) {
            return;
        }

        this._langInited = true;
        // let file = app.config.LANG + "_" + this.key;
        // let data = require(file);
        // cc.log("_initLanguage_initLanguage " + file)
        // my.i18n.init(app.config.LANG, data);

    }
    load(bundle) {
        super.load(bundle);
        cc.log("game-club-chat load")
        //this._initLanguage();
    }
    start(options) {
        cc.log("game-club-chat start")
        //super.start(options);
        //this._initLanguage();
    }

}

let instance = new WrapperChat(null);
my.wrapper.register(instance.bundleName, instance);

