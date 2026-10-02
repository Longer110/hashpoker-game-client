
let i18n = require('i18n');
let my = require("my");

Reflect.defineProperty(cc.Label.prototype, "lang", {
    get: function () {
        return this.langKey;
    },
    set: function (v) {
        if (v && v.indexOf(".") > 0) {
            //多语言的key
            let langVal = i18n.t(v);
            //  //console.log(`多语言key【${v}】 => 【${langVal}】`);
            if (langVal != v) {
                this.langKey = v;
                this.string = langVal;

                //  //console.log(`-------语言事件: ${this.langEvent}`);
                if (!this.langEvent) {
                    this.langEvent = true;
                    //添加监听事件,更新文本
                    //  //console.log(`-------注册语言: ${v}`);
                    my.target.on(my.event.UPDATE_LANGUAGE, this._onChangeLanguage, this);
                }

                return;
            }
             //console.error(`多语言key值:[ ${v} ] 未找到对应的配置`);
        }

        this.string = v;
        this.langKey = null;
    }
});


if (!CC_EDITOR) {
    cc.Label.prototype._onChangeLanguage = function () {
        //  //console.log(`语言切换: ${this.langKey}`);
        this.lang = this.langKey;
    }

    /**@description 强制label在当前帧进行绘制 */
    cc.Label.prototype.forceDoLayout = function () {
        //2.2.0
        if (this._forceUpdateRenderData) {
            this._forceUpdateRenderData();
        }
        //2.2.0以下版本
        else if (this._updateRenderData) {
            this._updateRenderData(true);
        }
    }

    let __label_onDestroy__ = cc.Label.prototype.onDestroy;
    cc.Label.prototype.onDestroy = function () {
        if (this.langEvent) {
            //  //console.log(`-------销毁语言：${this.langEvent}`);
            my.target.targetOff(this);
        }
        this.langKey = null;
        this.langEvent = false;
        __label_onDestroy__ && __label_onDestroy__.call(this);
    }

    // let __label_onEnable__ = cc.Label.prototype.onEnable;
    // cc.Label.prototype.onEnable = function () {
    //     this._changeLanguageString(newKey);

    //     __label_onEnable__ && __label_onEnable__.call(this);
    // }

    // let __label_onDisable__ = cc.Label.prototype.onDisable;
    // cc.Label.prototype.onDisable = function () {
    //     if (this.langEvent) {
    //         this.langEvent = false
    //         EventDispatcher.getInstance().removeTarget(this)
    //     }
    //     __label_onDisable__ && __label_onDisable__.call(this);
    // }
}
