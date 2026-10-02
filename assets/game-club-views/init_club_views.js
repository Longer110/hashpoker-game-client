let my = require("my");
let app = require("App");
let HallClubExternal = require("HallClubExternal");

// let AppComponent = require("AppComponent");
let AppManager = require("AppManager");
// // let ScreenResolution = require("ScreenResolution");

class WrapperClubViews extends my.WrapperBase {
    bundleName = 'game-club-views';
    key = "ClubViews"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    constructor(options) {
        super(options);
    }

    _initLanguage(){
        if (this._langInited || CC_EDITOR) {
            return;
        }

        this._langInited = true;

        // let file = app.config.LANG + "_" + "club_hall";
        // let data = require(file);
        // my.i18n.init(app.config.LANG, data);
    }

    load(bundle){
        super.load(bundle);
    
        // app.addComponent(AppComponent);
        let manager = app.addComponent(AppManager);
        manager.register();
        // // app.addComponent(ScreenResolution);
        app.club = app.addComponent(HallClubExternal);
        app.club.init();
    }
    start(options){
        super.start(options);
    }
}

let instance = new WrapperClubViews(null);
my.wrapper.register(instance.bundleName, instance);

