let my = require("my");
let app = require("App");
let AppComponent = require("AppComponent");
// let AppManager = require("AppManager");
// let BridgeController = require("BridgeController");

let LoginController = require("LoginController");
let NotifyLogin = require("NotifyLogin");
let ServerNet = require("config_server_net");
let ServerRecord = require("config_server_record");
let ServerStatis = require("config_server_statis");

let NotifyHall = require("NotifyHall");
let HallController = require("HallController");

class WrapperCommon extends my.WrapperBase {
    bundleName = "app-common";
    key = "common"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    constructor(options) {
        super(options);
    }

    _initLanguage(){
        // my.i18n.init(app.config.LANG, {});
    }
    load(bundle){
        super.load(bundle);

        //兼容旧框架
        app.home=app.login=app.hall = this;
        my.initResourceBundle(bundle, this);

        if(!CC_BUILD&&!CC_EDITOR){
            this._initLanguage();
        }
        
        app.addComponent(AppComponent);
        // app.addComponent(AppManager);
        // app.addComponent(ScreenResolution);
        // app.addComponent(BridgeController);

        this._initServer();
        let lc = App.addComponent(LoginController);
        lc.register();
        
        let nl = App.addComponent(NotifyLogin);
        nl.register();

        let nh = App.addComponent(NotifyHall);
        nh.register();
        
        this.ctrl = App.addComponent(HallController);
        this.ctrl.register();
    }
    _initUIManager(bundle){
        if(this.ui) return;

        this.ui = my.ui;
        this.ui.init(bundle, this);
    }
    start(options){
        super.start(options);
    }
    _initServer(){
        let server_net = new ServerNet();
        let server_record = new ServerRecord();
        let server_statis = new ServerStatis();
        app.server.set("net", server_net);          // 初始化游戏服配置
        app.server.set("record", server_record);    //初始化日志服配置
        app.server.set("statis", server_statis);    //初始化统计服配置

        if(app.config.IS_SOCKET){
            if(cc.sys.isNative){
                app.net.setSocketType(1)//原生socket
                app.record.setSocketType(1)
                app.statis.setSocketType(1)
            }
        }
        
        if(app.config.ENABLE_CHANNEL && window.ChannelConfig){
            let config = app.config;
            let channel = window.ChannelConfig;
            if(channel.SERVER_GAME instanceof Array){
                if(channel.SERVER_GAME.length>0){
                    //自定义游戏服
                    server_net.setServerList(channel.SERVER_GAME);

                    if(channel.SERVER_LOG instanceof Array && channel.SERVER_LOG.length>0){
                    }
                    else{
                        channel.SERVER_LOG = [channel.SERVER_GAME[0]];
                    }
                    //自定义日志服
                    server_record.setServerList(channel.SERVER_LOG);
                    
                    
                    if(channel.SERVER_STATISTICS instanceof Array && channel.SERVER_STATISTICS.length>0){
                    }
                    else{
                        channel.SERVER_STATISTICS = [channel.SERVER_LOG[0]];
                    }
                    //自定义统计服
                    server_statis.setServerList(channel.SERVER_STATISTICS);
                }
                else{
                    let msg = config.CUSTOM.ERROR_SERVER_GAME || "游戏服务器配置错误";
                     //console.error(msg);
                    if(window && window.alert){
                        window.alert(msg);
                    }
                }
            }
            else{
                let msg = config.CUSTOM.ERROR_SERVER_GAME || "游戏服务器配置错误";
                 //console.error(msg);
                if(window && window.alert){
                    window.alert(msg);
                }
            }
        }
        this._servers = server_net.getServerList();
        //游戏服
        if(app.config.AREA){
            this.updateGameServerByArea(app.config.AREA);
        }
        else{
            app.net.setServerList(this._servers);
        }
        // app.net.setAutoSwitchServer(false); //默认登录界面不需要自动切换网关
        //日志服
        // app.record.setServerList(server_record.getServerList());
        // let config_record = server_record.getRandomItem(); //随机一个日志服
        // app.record.connect(config_record); //开启日志服
        // //统计服
        // if(app.config.ENABLE_STATISTICS){
        //     app.statis.setServerList(server_statis.getServerList());
        //     let config_statis = server_statis.getRandomItem(); //随机一个统计服
        //     app.statis.connect(config_statis); //开启统计服
        // }
    }
    updateGameServerByArea(server_area){
        server_area = server_area || "";
        server_area = server_area.toLowerCase();
        
        let array = this._servers;
        let list = [];

        //如果不指定区域，则使用所有的
        if(server_area==""){
            list = array;
        }
        else{
            for (let index = 0; index < array.length; index++) {
                const item = array[index];
                let area = item.area || item.AREA || "";
                area = area.toLowerCase();
                //兼容旧列表(无area字段)
                if(area=="" || area==server_area){
                    list.push(item);
                }
            }
            if(list.length==0){
                cc.error("init_app_common:", `找不到 AREA=${server_area} 的服务器配置，使用所有的`);
                list = array;
            }
        }
        
        let server_net = app.server.get("net");
        server_net.setServerList(list);
        app.net.setServerList(list);
    }

    /*******************兼容旧框架*******************/
    _loadMainPackage(onComplete, options){
        onComplete&&onComplete(null, this.bundle);
    }
    loadHome(onComplete, options){
        options = options || {};
        options.sceneName = "main-home";
        this._loadMainPackage(onComplete, options);
        this.start(options);
    }
    loadLogin(onComplete, options){
        //直播平台非网页版，不能加载登录场景
        if(app.config.IS_LIVE_ONLY && !app.url.get("live") && !app.url.get("nomsg") && !app.config.IS_CLUB_ONLY){
             //console.log("直播平台非网页版，不能加载登录场景");
            let strText = my.i18n.t("COMMON.WEI_HU_TI_REN.3");
            let dotAnimation = true;
            let callback = null;
            let timeout = 60*10; //10分钟
            app.ui.showBlockText(strText, dotAnimation, callback, timeout);
            app.postMessage(app.bridge.EVENT.GAME_ERROR, {
                error: app.bridge.errorID(108),
            });
            return;
        }

         //console.log("加载登录场景");
        options = options || {};
        options.sceneName = "main-login";
        this._loadMainPackage(onComplete, options);
        this.start(options);
    }
    loadHall(onComplete, options){
        options = options || {};
        options.sceneName = "main-hall";
        //重置语言包
        // my.i18n.init(app.config.LANG, {});
        this._loadMainPackage(onComplete, options);

        //需要登录大厅
        if(options.autoLoginHall){
            cc.warn(this.bundleName, "start", options);
            this.ctrl.loginHall();
        }
        else{
            //清空当前子游戏数据
            cc.log("init_hall", "清空当前子游戏数据");
            app.user.clearGame();
            app.game.clearData();
            app.game.setGameID(-1);

            super.start(options);
        }
    }
    /*******************兼容旧框架*******************/
}

let instance = new WrapperCommon(null);
my.wrapper.register(instance.bundleName, instance);

