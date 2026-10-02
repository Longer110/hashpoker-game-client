// class AppExternalManager {
//     static default = null;
//     static create(){
//         if(!AppExternalManager.default){
//             AppExternalManager.default = new AppExternalManager();
//         }
//         return AppExternalManager.default;
//     }

//     tag = "AppExternalManager";
//     _activeItem = null;
//     _mapExternal = new Map(); //{key, {target, events[]}}

//     getItem(external_name){
//         return this._mapExternal.get(external_name);
//     }
//     setItem(external_name, item){
//         this._mapExternal.set(external_name, item);
//     }

//     resetExternal(){
//         this._activeItem = null;
//     }
//     loadExternal(external_name, event){
//         cc.warn(this.tag, "开始加载扩展包主入口. bundle-name="+external_name);
//         let item = this.getItem(external_name);
//         if(!item){
//             item = {
//                 target: null,
//                 events: [],
//             }
//             this.setItem(external_name, item);
//         }
        
//         item.events.push(event);
//         this._activeItem = item;

//         let self = this;
//         let options = {};
//         if(!item.target){
//             cc.assetManager.loadBundle(external_name, function onComplete(error, bundle) {
//                 if(error){
//                     cc.error(self.tag, "加载扩展包出错：", error);
//                     self.resetExternal();
//                     return;
//                 }

//                 let AppExternal = item.target = window[external_name];

//                 AppExternal.initNative({
//                     manager: self,
//                     game: app.game,
//                     app: app,
//                     bridge: app.bridge,
//                 });
//                 AppExternal.onLoad(options, (error)=>{
//                     if(error){
//                         cc.error(self.tag, "加载扩展包内部出错：", error);
//                         self.resetExternal();
//                         return;
//                     }

//                     self.onLoadExternal(external_name);
//                 });
//             });
//         }
//         else{
//             self.onLoadExternal(external_name);
//         }
//     }

//     isValid(){
//         return !!this._activeItem;
//     }

//     /**
//      * 模拟消息驱动
//      */
//     postMessage(eventString){
//         let event = JSON.parse(eventString);
//         cc.warn(this.tag, "模拟消息驱动", event);
//         if(event.msg == app.bridge.EVENT.SUBGAME_EXIT_START){
//             this.resetExternal();
//             app.game.exitToHall();
//             return;
//         }
//         app.postMessage(event);
//     }

//     /**
//      * 模拟消息驱动
//      */
//     onMessage(event){
//         if(!this.isValid()){
//             cc.warn(this.tag, "扩展包未加载", event);
//             return;
//         }

//         let item = this._activeItem;
//         if(item.target){
//             cc.warn(this.tag, "onMessage", event)
//             item.target.onMessage(JSON.stringify(event));
//         }
//         else{
//             item.events.push(event);
//         }
//     }

//     onLoadExternal(external_name){
//         cc.warn(this.tag, "扩展包加载完成. name="+external_name);

//         let item = this.getItem(external_name);
//         //处理已收到的消息
//         let array = [].concat(item.events);
//         for (let index = 0; index < array.length; index++) {
//             const event = array[index];
//             this.onMessage(event);
//         }
//         if(array.length!=item.events.length){
//             cc.error(this.tag, "消息处理出错", array.length, item.events.length);
//         }
//         item.events.length = 0;
//     }

// }

// let instance = AppExternalManager.create();
// export default instance;