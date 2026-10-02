// // Learn cc.Class:
// //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// // Learn Attribute:
// //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// // [[
// //     * @Author:      wangb
// //     * @DateTime:    2018-07-18 10:05:23
// //     * @Description: 顶层UI触摸拦截控件
// // ]]

// let OPACITY_SPLASH = 120;

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // block: cc.BlockInputEvents,
//         _labelPanel: cc.Node,
//         _labelSprite: cc.Sprite,
//         _labelText: cc.Label,
//         _dotAnimation: false,
//         _textString: "",
//         _deltaTimeInterval: 0,
//         _callbackHandles: null,
//         _blockIndex: 0,
//     },

//     // LIFE-CYCLE CALLBACKS:

//     onLoad () {
//         this._init();
//     },

//     // start () {
//     // },

//     lateUpdate (dt) {
//         // if(this._nodeSplash && this._nodeSplash.active){
//         //     if(this._nodeSplash.opacity<OPACITY_SPLASH){
//         //         this._nodeSplash.opacity += 2;
//         //     }
//         // }
//         if(this._dotAnimation && this._labelPanel.active){
//             this._deltaTimeInterval += dt;

//             let text = [".","..","...","....",".....","......",];
//             let num = this._deltaTimeInterval * 1000 / 500;
//             let index = Math.floor(num)%text.length;
//             this._labelText.string = this._textString + " " + text[index%text.length];
//         };

//         if(this._callbackHandles && this._callbackHandles.length>0){
//             let array = this._callbackHandles;
//             for (let i = array.length-1; i >= 0; i--) {
//                 const handle = array[i];
//                 if(handle.timeout>0){
//                     handle.interval += dt;
//                     if(handle.interval>=handle.timeout){
//                         if(handle.callback){
//                             handle.callback()
//                         }
//                         this.hide(handle.blockIndex);
//                     }
//                 }
//             }
//         }
//     },

//     _init(){
//         this._callbackHandles = new Array;

//         this.node.setContentSize(cc.winSize);
//         this.addComponent(cc.BlockInputEvents);
//         let widget = this.addComponent(cc.Widget);
//         widget.isAlignBottom = true;
//         widget.isAlignLeft = true;
//         widget.isAlignTop = true;
//         widget.isAlignRight = true;
//         widget.left = 0;
//         widget.bottom = 0;
//         widget.top = 0;
//         widget.right = 0;
//         widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;

//         let self = this;
//         let nodeSplash = new cc.Node("[splash]");
//         this.node.addChild(nodeSplash, 1);
//         self._nodeSplash = nodeSplash;
//         nodeSplash.position = cc.Vec2.ZERO;
//         nodeSplash.color = cc.Color.BLACK;
//         nodeSplash.opacity = 0;
//         widget = nodeSplash.addComponent(cc.Widget);
//         widget.isAlignBottom = true;
//         widget.isAlignLeft = true;
//         widget.isAlignTop = true;
//         widget.isAlignRight = true;
//         widget.left = 0;
//         widget.bottom = 0;
//         widget.top = 0;
//         widget.right = 0;
//         widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
//         let splash = nodeSplash.addComponent(cc.Sprite);
//         cc.loader.loadRes("texture/splash", function (error, texture) {
//             if(!error){
//                 splash.spriteFrame = new cc.SpriteFrame(texture);
//             }
//         })

//         let nodeBG = new cc.Node("[bg]");
//         this.node.addChild(nodeBG, 10);
//         self._nodeBG = nodeBG;
//         nodeBG.active = false;
//         nodeBG.position = cc.Vec2.ZERO;
//         // let spriteBG = nodeBG.addComponent(cc.Sprite);
//         // cc.loader.loadRes("texture/block_bg", function (error, texture) {
//         //     if(!error){
//         //         spriteBG.spriteFrame = new cc.SpriteFrame(texture);
//         //     }
//         // })

//         let labelPanel = new cc.Node("labelPanel");
//         let sprite = labelPanel.addComponent(cc.Sprite);
//         sprite.type = cc.Sprite.Type.SLICED;
//         sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
//         labelPanel.active = false;
//         cc.loader.loadRes("texture/block", function (error, texture) {
//             if(!error){
//                 sprite.spriteFrame = new cc.SpriteFrame(texture);
//             }
//             self._labelSprite = sprite;
//             if(self._textString){
//                 labelPanel.active = true;
//             }
//         })
//         this.node.addChild(labelPanel, 11);
//         labelPanel.position = cc.Vec2.ZERO;

//         let labelText = new cc.Node("labelText");
//         labelPanel.addChild(labelText);
//         labelText.position = cc.Vec2.ZERO;
//         labelText.color = cc.Color.WHITE;
//         // labelText.color = cc.Color.WHITE.fromHEX("50468b");
//         let label = labelText.addComponent(cc.Label)
//         label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
//         label.verticalAlign = cc.Label.VerticalAlign.CENTER;
//         // label.overflow = cc.Label.Overflow.NONE;
//         label.node.anchorX = 0;
        
//         label.fontSize = 36;
//         label.fontFamily = "Microsoft YaHei";
//         this._labelPanel = labelPanel;
//         this._labelText = label;

//         let index = this.show();
//         this.hide(index);
//     },

//     show(callback, timeout){
//         this._blockIndex++;
//         let nextIndex = this._blockIndex;

//         //默认10秒超时
//         if(!timeout){
//             timeout = callback ? 10 : 120;
//         }
//         this._callbackHandles.push(
//             {
//                 blockIndex: nextIndex,
//                 interval: 0,
//                 timeout: timeout,
//                 callback: callback,
//             }
//         )

//         this._invoke();
        
//         return nextIndex;
//     },

//     hide(blockIndex){
//         if(typeof blockIndex!="number")
//         {
//             //无效的索引
//              //console.error("[UIBlock]hide error: invalid index", blockIndex);
//             return;
//         }
//         if(blockIndex<=0){
//             return;
//         }

//         if(this._callbackHandles.length>0){
//             let array = this._callbackHandles;
//             for (let i = array.length-1; i >= 0; i--) {
//                 const handle = array[i];
//                 if(handle.blockIndex==blockIndex){
//                     this._callbackHandles.splice(i, 1);
//                     break;
//                 }
//             }
//         }
//         else{
//              //console.debug("UIBlock: 调用[hide]方法次数多于调用[show]");
//         }
//         this._invoke();
//     },

//     showTextBG(visible){
//         if(this._nodeBG){
//             this._nodeBG.active = visible;
//         }
//         if(this._nodeSplash){
//             this._nodeSplash.active = !visible;
//         }
//     },
    
//     clear(){
//         this._callbackHandles = new Array;
//         this._invoke();
//     },

//     setText(text, dotAnimation){
//         if(!text) text = "";
//         if(text==""){
//             this._labelPanel.active = false;
//             // if(this._nodeBG && this._nodeSplash){
//             //     this._nodeBG.active = false;
//             //     this._nodeSplash.active = false;
//             // }
//         } 
//         else if(null!=this._labelSprite){
//             this._labelPanel.active = true;
//             // if(this._nodeBG && this._nodeSplash){
//             //     this._nodeBG.active = true;
//             //     this._nodeSplash.active = true;
//             // }
//         } 
        
//         this._dotAnimation = !!dotAnimation;
//         this._textString = text;

//         this._labelText.string = text;
//         this._labelText._forceUpdateRenderData();
//         let size = this._labelText.node.getContentSize();
//         this._labelText.node.x = -size.width/2;
//         size = cc.size(size.width+300, size.height+20);
//         this._labelText.node.parent.setContentSize(size);
//     },

//     _invoke(){
//         this._deltaTimeInterval = 0;
//         let visible = this._callbackHandles.length>0 ? true : false;
//         this.node.active = visible;
//         // this._labelPanel.active = visible;

//         // if(!visible){
//         //     this.showTextBG(false);
//         //     if(this._nodeSplash){
//         //         this._nodeSplash.opacity = 0;
//         //     }
//         // }
//     },
// });
