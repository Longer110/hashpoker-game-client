
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    onLoad() {


        this._isIOS = UIFrame.isOpenInIosWebview();
        UIFrame.showTips("是ios web 端 : " + this._isIOS)

        if (this._isIOS) {
            this._patchWebEditBoxIOS();
        }
    },

    _patchWebEditBoxIOS() {

        let originalHeight = window.innerHeight;
        let keyboardVisible = false;

        // ----------- IOS 键盘弹出 -------------
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                let timer = null;

                const waitKeyboard = () => {
                    // 键盘弹出时 innerHeight 变小超过 100px
                    if (Math.abs(window.innerHeight - originalHeight) > 100) {
                        keyboardVisible = true;

                        if (timer) clearTimeout(timer);
                        this._refreshAllEditBox();
                    } else {
                        timer = setTimeout(waitKeyboard, 100);
                    }
                };

                setTimeout(waitKeyboard, 100);
            }
        });

        // ----------- IOS 键盘收起（先不立即刷新） -------------
        document.addEventListener('focusout', () => {
            keyboardVisible = false;
        });

        // ----------- 关键：视图恢复时机 -------------
        // iOS 键盘收起时会触发 resize，但 canvas 恢复需要延迟
        window.addEventListener('resize', () => {
            // 键盘收起后才执行
            if (!keyboardVisible) {
                setTimeout(() => {
                    this._refreshAllEditBox();
                }, 150);   // 150ms 是最稳的
            }
        });
    },


    // =============== 刷新所有 EditBox 的位置（关键） =================
    _refreshAllEditBox() {

        const editBoxes = cc.find('Canvas').getComponentsInChildren(cc.EditBox);
        const dpr = window.devicePixelRatio || 1;

        editBoxes.forEach(editBox => {

            if (!editBox || !editBox.node) return;

            // ---- 更新 Widget ----
            let w = editBox.node.getComponent(cc.Widget);
            if (w) w.updateAlignment();

            editBox.node.getComponentsInChildren(cc.Widget).forEach(childW => {
                if (childW.updateAlignment) childW.updateAlignment();
            });

            // ---- 转换坐标：世界 -> 屏幕 ----
            let worldPos = editBox.node.convertToWorldSpaceAR(cc.v2());
            let screenPos = cc.Camera.main.getWorldToScreenPoint(worldPos);

            let width = editBox.node.width;
            let height = editBox.node.height;
            let scale = editBox.node.scale;

            let impl = editBox._impl;
            if (!impl || !impl._DOMInput) return;

            // ---- 手动更新 DOM input 位置（正确处理 DPR） ----
            impl._DOMInput.style.transform =
                `translate(${(screenPos.x - width / 2) / dpr}px, ${(screenPos.y - height / 2) / dpr}px) scale(${scale})`;
        });
    },

});
