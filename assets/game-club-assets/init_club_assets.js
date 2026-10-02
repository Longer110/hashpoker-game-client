let my = require("my");
let app = require("App");

class WrapperClubAssets extends my.WrapperBase {
    bundleName = 'game-club-assets';
    key = "ClubAssets"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    constructor(options) {
        super(options);
    }

    onCreate(callback) {
        let onComplete = function (error) {
            callback && callback(error);
        }
        this._loadUIAtlas(onComplete);
    }

    _initLanguage() {
        if (this._langInited) {
            return;
        }

        this._langInited = true;
    }

    load(bundle) {
        super.load(bundle);
    }
    start(options) {
        super.start(options);
    }

    _loadUIAtlas(callback) {
        let path = "prefab/UIAtlasClub";
        let wrapper = this;//my.wrapper.getCommon();
        path = wrapper.path(path, null, "main-common/resources/");
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (error) {
                 //console.error(error);
            }
            else {
                let node = cc.instantiate(prefab);
                node.name = "[UIAtlasClub]";
                app.UIAtlasClub = node.getComponent("UIAtlasClub");
                app.addRoot(node);
            }
            callback(error);
        });
    }
    getUserHead(url, target) {
        return app.UIAtlasClub.getUserHead(url, target);
    }
}

let instance = new WrapperClubAssets(null);
my.wrapper.register(instance.bundleName, instance);

