// let my = require("my");
// let app = require("App");

// let AppComponent = require("AppComponent");
// let AppManager = require("AppManager");
// // let ScreenResolution = require("ScreenResolution");

// class WrapperCommon extends my.WrapperBase {
//     bundleName = my.wrapper.COMMON;
//     key = "main_common"; //bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
//     constructor(options) {
//         super(options);
//     }

//     _initLanguage(){
//         my.i18n.init(app.config.LANG, {});
//     }
//     load(bundle){
//         super.load(app.LiveAssets.bundle);
        
//         if(!CC_BUILD&&!CC_EDITOR){
//             my.i18n.init(app.config.LANG, {});
//         }
        
//         app.addComponent(AppComponent);
//         app.addComponent(AppManager);
//         // app.addComponent(ScreenResolution);
//     }
//     start(options){
//         super.start(options);
//     }
//     //获取当前皮肤对应的资源路径
//     path(url, skin_value, pathResources) {
//         if(!pathResources){
//             pathResources = "main-common/resources/"
//         }
//         return super.path(url, skin_value, pathResources);
//     }
// }

// let instance = new WrapperCommon(null);
// my.wrapper.register(instance.bundleName, instance);

