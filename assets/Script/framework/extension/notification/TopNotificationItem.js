/**
 * 顶部通知弹窗基类
 * 支持队列显示、独立倒计时、动画效果
 * 
 * 使用方式：
 * 1. 继承此类实现具体的弹窗类型
 * 2. 重写 _initUI() 和 onDestroy() 方法
 * 3. 通过 TopNotificationManager 管理弹窗队列
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // 弹窗容器
        content: cc.Node,
        // 倒计时显示标签
        countdownLabel: cc.Label,
        // 每个弹窗类型可以指定不同的预制体
        itemPrefab: cc.Prefab,
    },

    onLoad() {
        if (this.content) {
            this.content.active = false;
        }
        
        this._data = null;
        this._schedule = null;
        this._remainTime = 0;
        this._totalTime = 10;  // 默认显示时间 10 秒
        this._isShowing = false;
        this._callback = null;
        this._manager = null;
    },

    /**
     * 设置弹窗数据
     * @param {Object} data - 弹窗数据
     * @param {number} duration - 显示时长(秒)，默认 10
     * @param {Function} onClose - 关闭回调
     * @param {Object} manager - 弹窗管理器引用
     */
    setData(data, duration, onClose, manager) {
        this._data = data;
        this._totalTime = duration || 10;
        this._remainTime = this._totalTime;
        this._callback = onClose;
        this._manager = manager;
        
        this._initUI();
    },

    /**
     * 显示弹窗（带动画）
     * @param {cc.Vec2} startPos - 起始位置（屏幕外）
     * @param {cc.Vec2} endPos - 结束位置（显示位置）
     * @param {number} duration - 动画时长
     */
    show(startPos, endPos, duration) {
        if (this._isShowing) return;
        
        this._isShowing = true;
        
        if (this.content) {
            this.content.active = true;
            this.content.position = startPos || cc.v2(0, 300);
            
            let seq = cc.sequence(
                cc.moveTo(duration || 0.3, endPos || cc.v2(0, 0)),
                cc.callFunc(() => {
                    
                }, this)
            );
            this.content.runAction(seq);
            this._startCountdown();
        }
    },

    /**
     * 隐藏弹窗（带动画）
     * @param {number} duration - 动画时长
     */
    hide(duration) {
        this._stopCountdown();
        
        if (this.content) {
            let seq = cc.sequence(
                cc.moveTo(duration || 0.3, cc.v2(0, 300)),
                cc.callFunc(() => {
                    this._isShowing = false;
                    this.content.active = false;
                    
                    // 触发关闭回调
                    if (this._callback) {
                        this._callback(this._data);
                    }
                }, this)
            );
            this.content.runAction(seq);
        }
    },

    /**
     * 初始化 UI（由子类实现）
     * 子类应该在此方法中设置具体的 UI 内容
     */
    _initUI() {
        // 由子类实现
        cc.warn("TopNotificationItem: _initUI() not implemented in subclass");
    },

    /**
     * 启动倒计时
     */
    _startCountdown() {
        this._stopCountdown();
        
        this._schedule = () => {
            this._remainTime--;
            this._updateCountdownDisplay();
            
            if (this._remainTime <= 0) {
                this._stopCountdown();
                this.hide();
            }
        };
        
        this.schedule(this._schedule, 1);
    },

    /**
     * 停止倒计时
     */
    _stopCountdown() {
        if (this._schedule) {
            this.unschedule(this._schedule);
            this._schedule = null;
        }
    },

    /**
     * 更新倒计时显示
     */
    _updateCountdownDisplay() {
        if (this.countdownLabel) {
            this.countdownLabel.string = this._remainTime + 'S';
        }
    },

    /**
     * 重置弹窗状态（用于对象池复用）
     */
    reset() {
        this._stopCountdown();
        this._isShowing = false;
        this._data = null;
        this._callback = null;
        this._manager = null;
        this._remainTime = 0;
        
        if (this.content) {
            this.content.active = false;
            this.content.stopAllActions();
        }
    },

    onDestroy() {
        this._stopCountdown();
    }
});
