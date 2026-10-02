var UIFrame = require("UIFrame");

var HallClubJoin = cc.Class({
    extends: cc.Component,

    onLoad: function() {
        this._data = null;
        this._submitting = false;
        this._editBox = null;
        this._countLabel = null;
        this._submitLabel = null;
    },

    init: function(data) {
        this._data = data || {};

        var titleNode = cc.find("root/top/titleName", this.node);
        var nameNode = cc.find("root/clubInput/clubName", this.node);
        var countNode = cc.find("root/clubInput/clubNameCnt", this.node);
        var editNode = cc.find("root/clubInput/clubEditBox", this.node);
        var submitNode = cc.find("root/btn_create", this.node);
        var submitLabelNode = cc.find("root/btn_create/Background/Label", this.node);
        var closeNode = cc.find("root/top/btn_back", this.node);
        var maskNode = cc.find("root/btn_bg", this.node);
        var backgroundNode = this.node.getChildByName("bg");

        this._setLabel(titleNode, "加入俱乐部");
        this._setLabel(nameNode, "邀请码");
        this._setLabel(submitLabelNode, "加入");
        this._countLabel = countNode ? countNode.getComponent(cc.Label) : null;
        this._submitLabel = submitLabelNode ? submitLabelNode.getComponent(cc.Label) : null;
        this._applyVisualStyle({
            titleNode: titleNode,
            nameNode: nameNode,
            countNode: countNode,
            editNode: editNode,
            submitNode: submitNode,
            submitLabelNode: submitLabelNode,
            closeNode: closeNode,
            backgroundNode: backgroundNode
        });

        if (editNode) {
            this._editBox = editNode.getComponent(cc.EditBox);
            if (this._editBox) {
                this._editBox.string = "";
                this._editBox.placeholder = "请输入8位邀请码";
                this._editBox.maxLength = 8;
                this._editBox.inputMode = cc.EditBox.InputMode.SINGLE_LINE;
                editNode.on("text-changed", this._onTextChanged, this);
            }
        }

        this._bindButton(submitNode, this.onClickCreateClub);
        this._bindButton(closeNode, this.onClickBg);
        this._bindButton(maskNode, this.onClickBg);
        this._updateCount();

        var self = this;
        this.scheduleOnce(function() {
            self._alignFullscreenEdges();
            if (self._editBox && cc.isValid(self.node)) {
                self._editBox.focus();
            }
        }, 0.05);
    },

    _applyVisualStyle: function(nodes) {
        this._alignFullscreenEdges(nodes.backgroundNode, nodes.closeNode);

        var titleLabel = nodes.titleNode ? nodes.titleNode.getComponent(cc.Label) : null;
        if (nodes.titleNode) {
            nodes.titleNode.setPosition(0, 0);
            nodes.titleNode.setContentSize(320, 90);
        }
        if (titleLabel) {
            titleLabel.fontSize = 42;
            titleLabel.lineHeight = 58;
            titleLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            titleLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
        }

        if (nodes.closeNode) {
            nodes.closeNode.setPosition(nodes.closeNode.x, 0);
            nodes.closeNode.setContentSize(92, 92);
            var closeIcon = nodes.closeNode.getChildByName("sp");
            if (closeIcon) {
                closeIcon.setPosition(0, 0);
                closeIcon.setContentSize(58, 58);
            }
        }

        var inputWrap = cc.find("root/clubInput", this.node);
        if (inputWrap) inputWrap.setPosition(0, 385);

        var nameLabel = nodes.nameNode ? nodes.nameNode.getComponent(cc.Label) : null;
        if (nodes.nameNode) {
            nodes.nameNode.setPosition(-252, 118);
            nodes.nameNode.setContentSize(250, 62);
        }
        if (nameLabel) {
            nameLabel.fontSize = 40;
            nameLabel.lineHeight = 52;
        }

        if (nodes.countNode) {
            nodes.countNode.setPosition(300, 118);
            nodes.countNode.setContentSize(110, 54);
        }
        if (this._countLabel) {
            this._countLabel.fontSize = 34;
            this._countLabel.lineHeight = 44;
            this._countLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
            this._countLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
        }

        if (nodes.editNode) {
            nodes.editNode.setContentSize(710, 138);
            var inputBg = nodes.editNode.getChildByName("BACKGROUND_SPRITE");
            if (inputBg) inputBg.setContentSize(710, 138);
            var editBox = nodes.editNode.getComponent(cc.EditBox);
            if (editBox && editBox.textLabel) {
                var textNode = editBox.textLabel.node;
                var textWidget = textNode.getComponent(cc.Widget);
                if (textWidget) textWidget.enabled = false;
                textNode.setAnchorPoint(0.5, 0.5);
                textNode.setPosition(0, 0);
                textNode.setContentSize(650, 108);
                editBox.textLabel.fontSize = 40;
                editBox.textLabel.lineHeight = 52;
                editBox.textLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                editBox.textLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
                editBox.textLabel.node.color = cc.color(245, 248, 255, 255);
            }
            if (editBox && editBox.placeholderLabel) {
                var placeholderNode = editBox.placeholderLabel.node;
                var placeholderWidget = placeholderNode.getComponent(cc.Widget);
                if (placeholderWidget) placeholderWidget.enabled = false;
                placeholderNode.setAnchorPoint(0.5, 0.5);
                placeholderNode.setPosition(0, 0);
                placeholderNode.setContentSize(650, 108);
                editBox.placeholderLabel.fontSize = 36;
                editBox.placeholderLabel.lineHeight = 48;
                editBox.placeholderLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                editBox.placeholderLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
                editBox.placeholderLabel.node.color = cc.color(150, 158, 176, 255);
            }
        }

        if (nodes.submitNode) {
            nodes.submitNode.setPosition(0, -220);
            nodes.submitNode.setContentSize(680, 108);
            var button = nodes.submitNode.getComponent(cc.Button);
            if (button) {
                button.transition = cc.Button.Transition.SCALE;
                button.zoomScale = 0.97;
                button.duration = 0.08;
            }
            var buttonBg = nodes.submitNode.getChildByName("Background");
            if (buttonBg) {
                buttonBg.setContentSize(680, 108);
                buttonBg.color = cc.color(108, 226, 169, 255);
            }
            if (!nodes.submitNode.getChildByName("_join_highlight")) {
                var highlight = new cc.Node("_join_highlight");
                highlight.setPosition(0, 0);
                highlight.setContentSize(680, 108);
                var graphics = highlight.addComponent(cc.Graphics);
                graphics.lineWidth = 2;
                graphics.strokeColor = cc.color(255, 255, 255, 60);
                graphics.moveTo(-286, 37);
                graphics.lineTo(286, 37);
                graphics.stroke();
                nodes.submitNode.addChild(highlight, 2);
            }
        }

        if (nodes.submitLabelNode) {
            nodes.submitLabelNode.setPosition(0, -2);
            nodes.submitLabelNode.setContentSize(220, 56);
        }
        if (this._submitLabel) {
            this._submitLabel.fontSize = 36;
            this._submitLabel.lineHeight = 48;
            this._submitLabel.node.color = cc.color(255, 255, 255, 255);
            var outline = this._submitLabel.node.getComponent(cc.LabelOutline);
            if (!outline) outline = this._submitLabel.node.addComponent(cc.LabelOutline);
            outline.color = cc.color(18, 104, 68, 150);
            outline.width = 1;
        }
    },

    _alignFullscreenEdges: function(backgroundNode, closeNode) {
        var rootNode = cc.find("root", this.node);
        var topNode = cc.find("root/top", this.node);
        backgroundNode = backgroundNode || this.node.getChildByName("bg");
        closeNode = closeNode || cc.find("root/top/btn_back", this.node);

        var rootWidget = rootNode ? rootNode.getComponent(cc.Widget) : null;
        var topWidget = topNode ? topNode.getComponent(cc.Widget) : null;
        var backgroundWidget = backgroundNode ? backgroundNode.getComponent(cc.Widget) : null;
        if (rootWidget) rootWidget.updateAlignment();
        if (topNode) topNode.setContentSize(topNode.width, 124);
        if (topWidget) {
            topWidget.isAlignTop = true;
            topWidget.isAlignBottom = false;
            topWidget.isAlignLeft = true;
            topWidget.isAlignRight = true;
            topWidget.top = 0;
            topWidget.left = 0;
            topWidget.right = 0;
            topWidget.updateAlignment();
        }

        if (backgroundWidget) {
            backgroundWidget.isAlignTop = true;
            backgroundWidget.isAlignBottom = true;
            backgroundWidget.isAlignLeft = true;
            backgroundWidget.isAlignRight = true;
            backgroundWidget.top = 0;
            backgroundWidget.bottom = 0;
            backgroundWidget.left = 0;
            backgroundWidget.right = 0;
            backgroundWidget.updateAlignment();
        }

        if (closeNode && topNode) {
            var leftMargin = 14;
            closeNode.x = -topNode.width / 2 + leftMargin + closeNode.width / 2;
        }
    },

    _setLabel: function(node, text) {
        if (!node) return;
        var label = node.getComponent(cc.Label);
        if (label) label.string = text;
    },

    _bindButton: function(node, handler) {
        if (!node) return;
        var button = node.getComponent(cc.Button);
        if (button) button.clickEvents = [];
        node.off(cc.Node.EventType.TOUCH_END);
        node.on(cc.Node.EventType.TOUCH_END, handler, this);
    },

    _onTextChanged: function() {
        if (!this._editBox) return;
        var value = String(this._editBox.string || "").replace(/\s/g, "").toUpperCase();
        if (value !== this._editBox.string) {
            this._editBox.string = value;
        }
        this._updateCount();
    },

    _updateCount: function() {
        if (!this._countLabel) return;
        var length = this._editBox ? String(this._editBox.string || "").length : 0;
        this._countLabel.string = length + "/8";
    },

    _setSubmitting: function(submitting) {
        this._submitting = submitting;
        var submitNode = cc.find("root/btn_create", this.node);
        var button = submitNode ? submitNode.getComponent(cc.Button) : null;
        if (button) button.interactable = !submitting;
        if (this._submitLabel) this._submitLabel.string = submitting ? "加入中..." : "加入";
    },

    onClickCreateClub: function() {
        if (this._submitting || !this._editBox) return;

        var code = String(this._editBox.string || "").replace(/\s/g, "").toUpperCase();
        this._editBox.string = code;
        this._updateCount();
        if (code.length !== 8) {
            UIFrame.showTips("邀请码格式错误：请输入8位字符");
            this._editBox.focus();
            return;
        }
        if (!/^[A-HJ-KM-NP-Z2-9]{8}$/.test(code)) {
            UIFrame.showTips("邀请码格式错误：不能包含 0、O、1、I、L");
            this._editBox.focus();
            return;
        }
        if (!this._data || typeof this._data.callBack !== "function") return;

        this._setSubmitting(true);
        var self = this;
        this._data.callBack(code, function(success) {
            if (!cc.isValid(self.node)) return;
            if (success) {
                self.closeUI();
                return;
            }
            self._setSubmitting(false);
            if (self._editBox) self._editBox.focus();
        });
    },

    onClickBg: function() {
        if (!this._submitting) this.closeUI();
    },

    closeUI: function() {
        if (this._data && typeof this._data.closeCallBack === "function") {
            this._data.closeCallBack();
        }
        if (cc.isValid(this.node)) this.node.destroy();
    },

    onDestroy: function() {
        var editNode = cc.find("root/clubInput/clubEditBox", this.node);
        if (editNode) editNode.off("text-changed", this._onTextChanged, this);
    }
});

module.exports = HallClubJoin;
