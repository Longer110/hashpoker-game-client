require("ConfigGame");
let my = require("my");
let AppMain = require("AppMain");

class App extends AppMain {
    name = "App";
    static default = null;
    static create() {
        if(window.logTimestamp){
            window.initTimestamp();
            window.logTimestamp("App.js 'create'");
        }
        else{
            window.logTimestamp = ()=>{};
            window.logTimestamp = ()=>{};
             //console.log("App.js 'create'");
        }

        if (!App.default) {
            App.default = new App();
        }
        return App.default;
    }

    run(callback){
        super.run(callback);
    }

    initAppBridge(){
        app.bridgeController.initAppBridge();
    }

    launchSubgame(event, onLoad, onLaunch){
        let self = this;

        
        window.logTimestamp("App.js 'launch' start");

        if(my.bundle.isMainBundleInited()){
            my.bundle.initAllMainBundleLang(()=>{
                self.onLaunchSubgame(event, onLaunch);
            })
            return;
        }
    }
    onLaunchSubgame(event, onLaunch){
        window.logTimestamp("App.js 'launch' complete");

        let self = this;
        app.manager.setGameEnvInited();
        app.manager.invoke(()=>{
            window.logTimestamp("App.js manager.invode && 'loadExternal' start");

            let data = event.data || {};
            let item = self.bridgeController.getGameItem(data.gameid);
            self.bridgeController.loadExternal(item, event, function (error) {
                window.logTimestamp("App.js 'loadExternal' complete");

                onLaunch&&onLaunch();
            });
        })
    }

    onPreload(){
        if(app.manager&&app.manager.isGameEnvInited()){
            super.onPreload();
            return;
        }

        let self = this;

        let options = {
            autoPreload: true,
            autoStart: false,
        }

        window.logTimestamp("App.js 'onPreload' start");

        my.res.loadPackages(["app-common"],options,(error)=>{

            my.update.checkMainVersion(()=>{
                //加载直播公共包
                my.res.loadPackages(["game-club-assets", "game-club-views","game-club-chat"], options, (error) => {
                    let id = setInterval(() => {
                        window.logTimestamp("App.js 'onPreload' complete");

                        if(self.isLoaded()){
                            clearInterval(id);
                            super.onPreload();
                        }
                    }, 20);
                })
            });
            
        })
    }

    onStart(){
        super.onStart();

        if(app.manager&&app.manager.isGameEnvInited()){
            return;
        }
        
        window.logTimestamp("App.js 'onStart' ");

        // app.DEV_GAME_ID = my.url.get("dev_game_id");
        // if(app.DEV_GAME_ID){
        //     // app.user.setInfo({
        //     //     nUserID: 13027106,
        //     // })
        //     my.res.loadPackages(['live-niuniu'], {
        //         autoPreload: false,
        //         autoStart: false,
        //         nGameId: app.DEV_GAME_ID,
        //     }, (error)=>{
        //         app.game.setGame(app.niuniu);
        //         app.niuniu._initLanguage({
        //             sGamePath: "niuniu"
        //         })
        //         cc.director.loadScene("niuniu_c")
        //     })
        //     return;
        // }

        app.initAppBridge();

        let manager = app.getComponent("AppManager");
        if(manager){
            manager?.invoke();
        }
        else{
            my.res.loadLogin();
        }
    }
}

let app = App.create();

window["app"] = app;
//暂时兼容旧代码
window["App"] = app;

module.exports = app;