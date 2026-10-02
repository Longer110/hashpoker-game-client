let my = require("my");
let app = require("App");

class WrapperLiveAssets extends my.WrapperBase {
    bundleName = 'game-live-assets';
    key = "LiveAssets"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    constructor(options) {
        super(options);
    }

    onCreate(callback){
        let onComplete = function (error) {
            callback&&callback(error);
        }
        this._loadUIAtlas(onComplete);
    }

    _initLanguage(){
    }
    load(bundle){
        super.load(bundle);
    }
    start(options){
        super.start(options);
    }

    _loadUIAtlas(callback) {
        let path = "prefab/UIAtlasLive";
        let wrapper = this;//my.wrapper.getCommon();
        path = wrapper.path(path, null, "main-common/resources/");
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (error) {
                cc.error("UIAtlasLive 加载失败：", error);
            }
            else{
                let node = cc.instantiate(prefab);
                node.name = "[UIAtlasLive]";
                app.UIAtlasLive = node.getComponent("UIAtlasLive");
                app.addRoot(node);
            }
            callback(error);
        });
    }
    getUserHead(url, target){
        return app.UIAtlasLive.getUserHead(url, target);
    }
}

let instance = new WrapperLiveAssets(null);
my.wrapper.register(instance.bundleName, instance);

