(function () {

    if (!cc || !cc.director) {
        console.error("TimeScale plugin: cc.director not found");
        return;
    }

    var director = cc.director;

    var TimeScale = {
        _scale: 1,
        _originCalc: null,

        /** 初始化（自动调用一次即可） */
        init: function () {
            if (this._originCalc) return;

            this._originCalc = director.calculateDeltaTime;

            director.calculateDeltaTime = function (now) {
                if (!now) now = performance.now();

                var dt = (now - this._lastUpdate) / 1000;

                // 防止切后台 dt 过大
                if (dt > 1 / 10) dt = 1 / 10;

                dt *= TimeScale._scale;

                this._deltaTime = dt;
                this._lastUpdate = now;
            };

            cc.log("[TimeScale] initialized");
        },

        /** 设置倍速 */
        setTimeScale: function (scale) {
            this._scale = Math.max(0, scale);
        },

        /** 获取当前倍速 */
        getTimeScale: function () {
            return this._scale;
        },

        /** 恢复引擎原逻辑（一般不用） */
        reset: function () {
            if (this._originCalc) {
                director.calculateDeltaTime = this._originCalc;
                this._originCalc = null;
            }
            this._scale = 1;
        }
    };

    // 挂到全局，方便使用（类似 Unity 的 Time）
    window.TimeScale = TimeScale;

    // 自动初始化
    TimeScale.init();

})();
