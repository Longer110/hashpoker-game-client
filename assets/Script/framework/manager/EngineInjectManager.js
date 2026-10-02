// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 引擎注入管理
// ]]

require("my");

let SHOW_LOG = false;
    
let EngineInjectManager = function (params) {
    this.name = "EngineInjectManager";

    // cc.warn("TODO", "EngineInjectManager");
    // return;
    
    this._handleDownloader();
    this._handleEditBox();
    this._handleViewFrame();
    this._handleSpriteFrame();
    this._handleMeshBuffer();
    this._handleCCLabel();
    this._handleBlendFunc();
    this._handleCCInputManager();
    this._handleCCSys();
    this._handleMask();
    this._handleWidget();
    this._handleTextUtils();

}
EngineInjectManager.prototype.load = function (params) {
}
EngineInjectManager.prototype.destroy = function (params) {
}

EngineInjectManager.prototype._checkValid = function (params) {
    let valid = true;
    if(CC_EDITOR || !CC_BUILD || !cc.sys.isBrowser){
        valid = false;
    }
    return valid;
}

EngineInjectManager.prototype._isNativeBuild = function (params) {
    let valid = false;
    if(CC_BUILD && cc.sys.isNative){
        valid = true;
    }
    return valid;
}

EngineInjectManager.prototype._isBrowserBuild = function (params) {
    let valid = false;
    if(CC_BUILD && cc.sys.isBrowser){
        valid = true;
    }
    return valid;
}

//https://docs.cocos.com/creator/2.4/manual/zh/asset-manager/downloader-parser.html
//https://docs.cocos.com/creator/2.4/manual/zh/asset-manager/options.html
EngineInjectManager.prototype._handleDownloader = function () {
    if(!this._checkValid()) return;
    if(!this._isBrowserBuild()) return;

    // 扩展管线
    let handlePipe = false;
    handlePipe&&cc.assetManager.pipeline.insert(function (task, done) {
        var input = task.input;
        for (var i = 0; i < input.length; i++) {
            if (input[i].options.myParam === 'important') {
                cc.log(input[i].url);
            }
        }
        task.output = task.input;
        done();
    }, 1);

    let downloader = cc.assetManager.downloader;
    let parser = cc.assetManager.parser;
    
    // var downloadBlob = function (url, options, onComplete) {
    //     options.responseType = "blob";
    //     downloader.downloadFile(url, options, options.onFileProgress, onComplete);
    // };

    // var downloadJson = function (url, options, onComplete) {
    //     options.responseType = "json";
    //     downloader.downloadFile(url, options, options.onFileProgress, function (err, data) {
    //         if (!err && typeof data === 'string') {
    //             try {
    //                 data = JSON.parse(data);
    //             }
    //             catch (e) {
    //                 err = e;
    //             }
    //         }
    //         onComplete && onComplete(err, data);
    //     });
    // };

    // var downloadImage = function (url, options, onComplete) {
    //     // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
    //     var func = cc.capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP ? downloadBlob : downloader.downloadDomImage;
    //     func.apply(downloader, arguments);
    // };

    //自定义下载处理方法
    downloader.register({
        ".json": my.downloader.downloadJson.bind(my.downloader),
        ".png": my.downloader.downloadImage.bind(my.downloader),
        ".jpg": my.downloader.downloadImage.bind(my.downloader),
        ".zbin": my.downloader.downloadZbin.bind(my.downloader),
        "bundle": my.downloader.downloadBundle.bind(my.downloader),
    });

    // //自定义解析处理方法
    // parser.register('.myformat', function (file, options, callback) {
    //     // 解析下载回来的文件
    // });
}

EngineInjectManager.prototype._handleEditBox = function () {
    if(!this._checkValid()) return;
    if(!this._isBrowserBuild()) return;

    let proto = cc.EditBox._ImplClass.prototype;
    let _updateInputType = proto._updateInputType;
    proto._updateInputType = function () {
        _updateInputType.call(this);

        let delegate = this._delegate,
            inputMode = delegate.inputMode,
            inputFlag = delegate.inputFlag,
            returnType = delegate.returnType,
            elem = this._elem;

        let InputFlag = cc.Enum({
            PASSWORD: 0,
        });

        // begin to updateInputType
        if (inputFlag === InputFlag.PASSWORD) {
            elem.type = 'password';
            elem.style.textTransform ='none'
            return;
        }

        return;
    }
}

EngineInjectManager.prototype._handleViewFrame = function (params) {
    if(!this._checkValid()) return;
    if(!this._isBrowserBuild()) return;

    if(!(cc.sys.isMobile && cc.sys.isBrowser && cc.sys.browserType===cc.sys.BROWSER_TYPE_SAFARI)){
        return;
    }

    let availWidth = function(frame){
        return cc.sys.isMobile ? window.innerWidth : frame.clientWidth;
    }
    let availHeight = function(frame){
        return cc.sys.isMobile ? window.innerHeight : frame.clientHeight;
    }
    
    let view = cc.view;
    view._initFrameSize = function () {
        var locFrameSize = this._frameSize;
        var w = availWidth(cc.game.frame);
        var h = availHeight(cc.game.frame);
        var isLandscape = w >= h;

        if (CC_EDITOR || !cc.sys.isMobile ||
            (isLandscape && this._orientation & cc.macro.ORIENTATION_LANDSCAPE) ||
            (!isLandscape && this._orientation & cc.macro.ORIENTATION_PORTRAIT)) {
            locFrameSize.width = w;
            locFrameSize.height = h;
            cc.game.container.style['-webkit-transform'] = 'rotate(0deg)';
            cc.game.container.style.transform = 'rotate(0deg)';
            this._isRotated = false;
        }
        else {
            locFrameSize.width = h;
            locFrameSize.height = w;
            cc.game.container.style['-webkit-transform'] = 'rotate(90deg)';
            cc.game.container.style.transform = 'rotate(90deg)';
            cc.game.container.style['-webkit-transform-origin'] = '0px 0px 0px';
            cc.game.container.style.transformOrigin = '0px 0px 0px';
            this._isRotated = true;
        }
        if (this._orientationChanging) {
            setTimeout(function () {
                cc.view._orientationChanging = false;
            }, 1000);
        }
    }.bind(view)
}

//https://forum.cocos.org/t/2-4-3/98921
//https://github.com/cocos-creator/engine/pull/7492
//https://forum.cocos.org/t/2-4-2-label-bmpfont-gl-one/96597
//https://github.com/cocos-creator-packages/adapters/pull/157
EngineInjectManager.prototype._handleCCLabel = function () {
    function deleteFromDynamicAtlas (comp, frame) {
        let dynamicAtlasManager = cc.dynamicAtlasManager;
        if (frame && !CC_TEST) {
            if (frame._original && dynamicAtlasManager) {
                dynamicAtlasManager.deleteAtlasSpriteFrame(frame);
                frame._resetDynamicAtlasFrame();
            }
        }
    }

    let _resetFrame = cc.Label.prototype._resetFrame;
    cc.Label.prototype._resetFrame = function () {
        if (this._frame && !(this.font instanceof cc.BitmapFont)) {
            deleteFromDynamicAtlas(this, this._frame);
            this._frame = null;
        }
    }
    if (!cc.sys.isNative){
        return;
    }

    let label_onEnable = cc.Label.prototype.onEnable;
    cc.Label.prototype.onEnable = function () {
        let filter = this.node.getComponent("UISpriteAlphaFilter");
        if(filter){
            this.srcBlendFactor = filter.srcBlendFactor;
            this.dstBlendFactor = filter.dstBlendFactor;
        }else{
            this.srcBlendFactor = cc.macro.BlendFactor.ONE;
            this.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
        }
       
        label_onEnable.call(this);
    }
}

EngineInjectManager.prototype._handleSpriteFrame = function () {
    // if(!this._checkValid()) return;
    // if(!this._isBrowserBuild()) return;
    if(this._checkValid()){
        const isIOS14Device = (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX) && cc.sys.isBrowser && /(OS 1[4-9])|(Version\/1[4-9])/.test(window.navigator.userAgent);
        let SizeMode = cc.Sprite.SizeMode;
        let sprite_onEnable = cc.Sprite.prototype.onEnable;
        cc.Sprite.prototype.onEnable = function () {
            if(my.env.get("USE_PremultiplyAlpha")){
                let filter = this.node.getComponent("UISpriteAlphaFilter");
                if(filter){
                    this.srcBlendFactor = filter.srcBlendFactor;
                    this.dstBlendFactor = filter.dstBlendFactor;
                    if(this.spriteFrame&&this.spriteFrame._texture){
                        this.spriteFrame._texture.setPremultiplyAlpha(filter.premultiplyAlpha);
                    }
                }
                else{
                    this.srcBlendFactor = cc.macro.BlendFactor.ONE;
                    this.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
                }
            }

            //ios 14 修改混合模式BUG
            if(isIOS14Device && this.srcBlendFactor == cc.macro.BlendFactor.SRC_ALPHA && this.dstBlendFactor == cc.macro.BlendFactor.DST_ALPHA){
                this.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
                this.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
            }

            sprite_onEnable.call(this);
        }
    }
    

    let proto = cc.SpriteFrame.prototype;
    let _textureLoadedCallback = proto._textureLoadedCallback;
    let self = this;
    proto._textureLoadedCallback = function () {
        let texture = this._texture;
        if(texture){
            let item = my.res.getLangItemByUrl(texture.nativeUrl);
            if(!item){
                item = my.res.getLangItemByUUID(texture._uuid);
            }
            if(item){
                if(!item.json && !item.fnt){
                    this.setOriginalSize(cc.size(texture.width, texture.height));
                    this.setRect(cc.rect(0, 0, texture.width, texture.height));
                }
                else if(item.fnt){
                    // this.setRect(cc.rect(0, 0, texture.width, texture.height));
                }
            } 
            if(my.env.get("USE_PremultiplyAlpha") && self._checkValid()){
                texture.setPremultiplyAlpha(true);
            }
        }
        return _textureLoadedCallback.call(this);
    }

    // let _checkRect = proto._checkRect;
    // proto._checkRect = function (texture) {
    //     let item = my.res.getLangItemByUrl(texture.url);
    //     if(!item){
    //         item = my.res.getLangItemByUUID(texture._uuid);
    //     }
    //     if(item){
    //         let sprite = this._sprite;
    //         // if(this._isSingleFrame || this._isBmfont){
    //         //     this.setOriginalSize(cc.size(texture.width, texture.height));
    //         //     this.setRect(cc.rect(0, 0, texture.width, texture.height));
    //         // }
    //         if(this._sprite){
    //             if (SizeMode.TRIMMED === sprite._sizeMode) {
    //                 // var size = this.getOriginalSize()
    //                 var rect = this.getRect();
    //                 var size = cc.size(rect.width, rect.height);
    //                 if(sprite.node){
    //                     sprite.node.setContentSize(size);
    //                 }
    //             }
    //             else /*if (SizeMode.RAW === sprite._sizeMode)*/ {
    //                 var size = this.getOriginalSize();
    //                 if(sprite.node){
    //                     sprite.node.setContentSize(size);
    //                 }
    //             }
    //         }
    //     }
    //     return _checkRect.call(this, texture);
    // }

    // let _deserialize = proto._deserialize;
    // proto._deserialize = function (data, handle) {
    //     SHOW_LOG&&cc.error("deserialize: ", data, handle);

    //     this._isBmfont = undefined;
    //     let result = my.res.getSpriteData(data.texture, data.name);
    //     let jsonData = data;
    //     if(result){
    //         if(result.jsonData){
    //             jsonData = result.jsonData;
    //             jsonData.texture = data.texture;
    //             jsonData.name = data.name;
    //         }
    //         else{
    //             this._isSingleFrame = true;
    //         }
    //         if(result.fnt){
    //             this._isSingleFrame = false;
    //             this._isBmfont = true;

    //             let fntData = my.res.getLangFontDataByUUID(result.fnt);
    //             if(fntData){
    //                 let config = JSON.parse(fntData);
    //                 jsonData.originalSize = [config.width, config.height];
    //                 jsonData.rect = [0, 0, config.width, config.height];
    //                 jsonData.offset = [0, 0];
    //                 jsonData.capInsets = [0, 0, 0, 0];
    //             }
    //         }

    //         // if(handle.customEnv && handle.customEnv._owner instanceof cc.Sprite){
    //         //     this._sprite = handle.customEnv._owner; 
    //         // }
    //         // else if(handle.customEnv && handle.customEnv._owner && handle.customEnv._owner._fntConfig){
    //         //     this._isSingleFrame = false;
    //         //     if(result.fnt){
    //         //         let config = JSON.parse(result.fnt);
    //         //         handle.customEnv._owner._fntConfig = config;
    //         //         jsonData.originalSize = [config.width, config.height];
    //         //         jsonData.rect = [0, 0, config.width, config.height];
    //         //         jsonData.offset = [0, 0];
    //         //     }
    //         // }
    //     }
    //     return _deserialize.call(this, jsonData, handle);
    // }
}


EngineInjectManager.prototype._handleMeshBuffer = function(){

    if(!cc.sys.isBrowser) return;

    const isIOS14Device = (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX) && cc.sys.isBrowser && /(OS 1[4-9])|(Version\/1[4-9])/.test(window.navigator.userAgent);
    if (isIOS14Device) {
        cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
            if (this.vertexOffset + vertexCount > 65535) {
                this.uploadData();
                this._batcher._flush();
            }
        }
        cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
            this.uploadData();
            this.switchBuffer();
        }  
    }
}


EngineInjectManager.prototype._handleBlendFunc = function(){

    cc.BlendFunc.prototype._updateMaterialBlendFunc = function (material) {

        material.setBlend(
            true,
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor,
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor
        );

        if (CC_JSB) {
            RenderComponent.prototype.markForRender.call(this, true);
        }
    }
    
}

EngineInjectManager.prototype._handleMask = function () {

    
    let setSpriteFrame = cc.Mask.prototype.setSpriteFrame;
    cc.Mask.prototype.setSpriteFrame = function (value){
        let lastSprite = this._spriteFrame;
        if (lastSprite) {
            lastSprite.off('load', this.setVertsDirty, this);
        }
        setSpriteFrame.call(this);
    }

    let onEnable = cc.Mask.prototype.onEnable;
    cc.Mask.prototype.onEnable = function () {

        onEnable.call(this);
        if (this._spriteFrame) {
            this._spriteFrame.once('load', this.setVertsDirty, this);
        }
    }

    let onDestroy = cc.Mask.prototype.onDestroy;
    cc.Mask.prototype.onDestroy = function () {

        onDestroy.call(this);
        if (this._spriteFrame) {
            this._spriteFrame.off('load', this.setVertsDirty, this);
        }
    }
    
}



EngineInjectManager.prototype._handleWidget = function () {

    let onEnable = cc.Widget.prototype.onEnable;
    cc.Widget.prototype.onEnable = function (){
        onEnable.call(this);

        if(this.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE){
            let sprite = this.node.getComponent(cc.Sprite)
            if(sprite && sprite.spriteFrame){
                let newTexture = sprite.spriteFrame.getTexture();
                if (newTexture && !newTexture.loaded) {
                    this.node.once(cc.Node.EventType.SIZE_CHANGED, this.updateAlignment, this);
                }
            }
        }
    }

    let onDisable = cc.Widget.prototype.onDisable;
    cc.Widget.prototype.onDisable = function (){
        onDisable.call(this);

        if(this.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE){
            let sprite = this.node.getComponent(cc.Sprite)
            if(sprite){
                this.node.off(cc.Node.EventType.SIZE_CHANGED, this.updateAlignment, this);
            }
        }
    }

    
}

//适配泰文、越南文、高棉语范围
EngineInjectManager.prototype._handleTextUtils = function () {
    //\u0E00-\u0E7F 泰文范围
    //\u1780-\u17FF 高棉语范围
    cc.textUtils.label_wordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё\u0E00-\u0E7F\u1780-\u17FF]+|\S)/;
    cc.textUtils.label_lastWordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё\u0E00-\u0E7F\u1780-\u17FF]+|\S)$/;
    cc.textUtils.label_lastEnglish = /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế\u0E00-\u0E7F\u1780-\u17FF]+$/;
    cc.textUtils.label_firstEnglish = /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế\u0E00-\u0E7F\u1780-\u17FF]/;
}







//https://blog.csdn.net/jipengx/article/details/112467402
//cocos Pc触摸屏端发布 浏览器不支持 touchmove 事件
EngineInjectManager.prototype._handleCCSys = function () {
    if(!this._isBrowserBuild()){
        return;
    }
    let capabilities = cc.sys.capabilities;
    capabilities["touches"] = true;
}

// app 嵌入 h5 游戏时，app 界面可滑动切换直播间
EngineInjectManager.prototype._handleCCInputManager = function () {
    if(!this._isBrowserBuild()){
        return;
    }
    
    let sys = cc.sys;
    let eventManager = cc.internal.eventManager;
    let inputManager = cc.internal.inputManager;
    //以下从 CCInputManager.js 复制修改
    inputManager.registerSystemEvent = function (element) {
        if(this._isRegisterEvent) return;

        this._glView = cc.view;
        let selfPointer = this;
        let canvasBoundingRect = this._canvasBoundingRect;

        window.addEventListener('resize', this._updateCanvasBoundingRect.bind(this));

        let prohibition = sys.isMobile;
        let supportMouse = ('mouse' in sys.capabilities);
        let supportTouches = ('touches' in sys.capabilities);

        if (supportMouse) {
            //HACK
            //  - At the same time to trigger the ontouch event and onmouse event
            //  - The function will execute 2 times
            //The known browser:
            //  liebiao
            //  miui
            //  WECHAT
            if (!prohibition) {
                window.addEventListener('mousedown', function () {
                    selfPointer._mousePressed = true;
                }, false);

                window.addEventListener('mouseup', function (event) {
                    if (!selfPointer._mousePressed)
                        return;
                    
                    selfPointer._mousePressed = false;

                    let location = selfPointer.getPointByEvent(event, canvasBoundingRect);
                    if (!cc.rect(canvasBoundingRect.left, canvasBoundingRect.top, canvasBoundingRect.width, canvasBoundingRect.height).contains(location)){
                        selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);

                        let mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, cc.Event.EventMouse.UP);
                        mouseEvent.setButton(event.button);
                        eventManager.dispatchEvent(mouseEvent);
                    }
                }, false);
            }

            // register canvas mouse event
            let EventMouse = cc.Event.EventMouse;
            let _mouseEventsOnElement = [
                !prohibition && ["mousedown", EventMouse.DOWN, function (event, mouseEvent, location, canvasBoundingRect) {
                    selfPointer._mousePressed = true;
                    selfPointer.handleTouchesBegin([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
                    element.focus();
                }],
                !prohibition && ["mouseup", EventMouse.UP, function (event, mouseEvent, location, canvasBoundingRect) {
                    selfPointer._mousePressed = false;
                    selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
                }],
                !prohibition && ["mousemove", EventMouse.MOVE, function (event, mouseEvent, location, canvasBoundingRect) {
                    selfPointer.handleTouchesMove([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
                    if (!selfPointer._mousePressed) {
                        mouseEvent.setButton(null);
                    }
                }],
                ["mousewheel", EventMouse.SCROLL, function (event, mouseEvent) {
                    mouseEvent.setScrollData(0, event.wheelDelta);
                }],
                /* firefox fix */
                ["DOMMouseScroll", EventMouse.SCROLL, function (event, mouseEvent) {
                    mouseEvent.setScrollData(0, event.detail * -120);
                }]
            ];
            for (let i = 0; i < _mouseEventsOnElement.length; ++i) {
                let entry = _mouseEventsOnElement[i];
                if (entry) {
                    let name = entry[0];
                    let type = entry[1];
                    let handler = entry[2];
                    element.addEventListener(name, function (event) {
                        let location = selfPointer.getPointByEvent(event, canvasBoundingRect);
                        let mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, type);
                        mouseEvent.setButton(event.button);

                        handler(event, mouseEvent, location, canvasBoundingRect);

                        eventManager.dispatchEvent(mouseEvent);
                        event.stopPropagation();
                        event.cancelable && event.preventDefault();

                    }, false);
                }
            }
        }

        if (window.navigator.msPointerEnabled) {
            let _pointerEventsMap = {
                "MSPointerDown"     : selfPointer.handleTouchesBegin,
                "MSPointerMove"     : selfPointer.handleTouchesMove,
                "MSPointerUp"       : selfPointer.handleTouchesEnd,
                "MSPointerCancel"   : selfPointer.handleTouchesCancel
            };
            for (let eventName in _pointerEventsMap) {
                let touchEvent = _pointerEventsMap[eventName];
                element.addEventListener(eventName, function (event){
                    let documentElement = document.documentElement;
                    canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - documentElement.scrollLeft;
                    canvasBoundingRect.adjustedTop = canvasBoundingRect.top - documentElement.scrollTop;

                    touchEvent.call(selfPointer, [selfPointer.getTouchByXY(event.clientX, event.clientY, canvasBoundingRect)]);
                    event.stopPropagation();
                }, false);
            }
        }

        //register touch event
        if (supportTouches) {
            let _touchEventsMap = {
                "touchstart": function (touchesToHandle) {
                    selfPointer.handleTouchesBegin(touchesToHandle);
                    element.focus();
                },
                "touchmove": function (touchesToHandle) {
                    selfPointer.handleTouchesMove(touchesToHandle);
                },
                "touchend": function (touchesToHandle) {
                    selfPointer.handleTouchesEnd(touchesToHandle);
                },
                "touchcancel": function (touchesToHandle) {
                    selfPointer.handleTouchesCancel(touchesToHandle);
                }
            };

            let registerTouchEvent = function (eventName) {
                let handler = _touchEventsMap[eventName];
                element.addEventListener(eventName, (function(event) {
                    if (!event.changedTouches) return;
                    let body = document.body;

                    canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - (body.scrollLeft || window.scrollX || 0);
                    canvasBoundingRect.adjustedTop = canvasBoundingRect.top - (body.scrollTop || window.scrollY || 0);
                    handler(selfPointer.getTouchesByEvent(event, canvasBoundingRect));
                    event.stopPropagation();

                    //增加 cc.__disablePreventDefault ，表示禁止默认动作
                    !cc.__disablePreventDefault && event.cancelable && event.preventDefault();
                   
                }), false);
            };
            for (let eventName in _touchEventsMap) {
                registerTouchEvent(eventName);
            }
        }

        this._registerKeyboardEvent();

        this._isRegisterEvent = true;
    }
}

if(!CC_EDITOR){
    /*@__DROP_PURE_EXPORT__*/

    let EnumIndex = 0;
    const File = cc.Enum({
        Version: 0,
        Context: 0,

        SharedUuids: ++EnumIndex,
        SharedStrings: ++EnumIndex,
        SharedClasses: ++EnumIndex,
        SharedMasks: ++EnumIndex,

        Instances: ++EnumIndex, //5
        InstanceTypes: ++EnumIndex,

        Refs: ++EnumIndex,

        DependObjs: ++EnumIndex,
        DependKeys: ++EnumIndex,
        DependUuidIndices: ++EnumIndex, //10

        ARRAY_LENGTH: ++EnumIndex,
    })
    
    let deserialize = cc.deserialize;
    cc.deserialize = function (params) {
        let data = arguments[0];
        let details = arguments[1];
        let options = arguments[2];

        if(data instanceof Array){
            if(SHOW_LOG){
                let object = null;
                try {
                    object = JSON.stringify(data);
                    object = JSON.parse(object);
                } catch (error) {
                    cc.error("error: ", error);
                }
                cc.warn("object: ", object);
            }
            
            let DependUuidIndices = data[File.DependUuidIndices];
            let DependKeys = data[File.DependKeys];
            let SharedUuids = data[File.SharedUuids];
            let SharedStrings = data[File.SharedStrings];
            let Instances = data[File.Instances];
            if(!(DependUuidIndices instanceof Array)){
                DependUuidIndices = [];
            }
            if(!(DependKeys instanceof Array)){
                DependKeys = [];
            }
            if(!(SharedUuids instanceof Array)){
                SharedUuids = [];
            }
            if(!(SharedStrings instanceof Array)){
                SharedStrings = [];
            }
            if(!(Instances instanceof Array)){
                Instances = [];
            }
            let uuidIndex = DependUuidIndices[0];
            let uuid = SharedUuids[uuidIndex];
            let keyIndex = DependKeys[0];
            let key = SharedStrings[keyIndex];
            let instance = Instances[0];
            
            SHOW_LOG&&cc.warn("instance: ", uuid, key, instance);

            if(typeof uuid == 'string'
            //  && uuid.length == 9
             ){
                if(instance 
                    // && (key == "_textureSetter")
                    ){
                    let result = my.res.getSpriteData(uuid, instance.name);
                    if(result){
                        if(result.jsonData){
                            // instance.texture = uuid;

                            for (const key in result.jsonData) {
                                const value = result.jsonData[key];
                                instance[key] = value;
                            }
                        }
                        else if(result.fnt){
                            let fntData = my.res.getLangFontDataByUUID(result.fnt);
                            if(result.uuid==uuid){
                                if(fntData){
                                    let fntConfig = JSON.parse(fntData);
                                    if(typeof instance == 'object' && !(instance instanceof Array)){
                                        instance.capInsets = [0, 0, 0, 0];
                                        instance.offset = [0, 0];
                                        instance.originalSize = [fntConfig.width, fntConfig.height];
                                        instance.rect = [0, 0, fntConfig.width, fntConfig.height];
                                    }
                                }
                                SHOW_LOG&&cc.error("result.uuid：", fntData);
                            }
                            else if(result.fnt==uuid){
                                if(fntData){
                                    let fntConfig = JSON.parse(fntData);
                                    if(instance instanceof Array){
                                        for (let index = 0; index < instance.length; index++) {
                                            let element = instance[index];
                                            if(typeof element == 'object' && element.atlasName){
                                                for (const key in fntConfig) {
                                                    const value = fntConfig[key];
                                                    element[key] = value;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                SHOW_LOG&&cc.error("result.fnt：", fntData);
                            }
                        }
                    }
                }
            }
        }

        SHOW_LOG&&cc.error("__type__: ", data, details, options);

        return deserialize.apply(cc, arguments);
    }
    cc.deserialize.Details = deserialize.Details;
    cc.deserialize.reportMissingClass = deserialize.reportMissingClass;
}

my.register("inject", new EngineInjectManager(null));