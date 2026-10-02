//layout布局方向
let DIRECTION = cc.Enum({
    Vertical: 1,
    Horizontal: 2
});

cc.Class({
    extends: Object,

    ctor() {
        //构造参数
        let params = arguments[0];

        //容器节点
        this.content = params.content;
        //预制体
        this.itemPrefab = params.itemPrefab;
        //回调对象
        this.cb_host = params.cb_host;
        //item设置方法
        this.item_setter = params.item_setter;
        //末页回调
        this.page_to_end_cb = params.page_to_end_cb;
        //底部页数索引label
        this.indexLabel = params.indexLabel || null;
        //向前翻页
        this.btnPageUp = params.btnPageUp;
        //向后翻页
        this.btnPageDown = params.btnPageDown;
        //layout布局方向
        this.direction = params.direction || DIRECTION.Vertical;
        


        //数据数组最大长度
        this.maxArrayLength = params.maxArrayLength || 0

        //data数据数组
        this.items = null;
        //当前索引
        this.curIndex = 0;

        //注册事件
        this.btnPageUp.on(cc.Node.EventType.TOUCH_START, this.pageUp, this);
        this.btnPageDown.on(cc.Node.EventType.TOUCH_START, this.pageDown, this);

        //生成item节点
        this.createItems();
    },

    destroy() {
        this.items = null;

        //取消注册事件
        if (cc.isValid(this.btnPageUp)) {
            this.btnPageUp.off(cc.Node.EventType.TOUCH_START, this.pageUp, this);
        }
        if (cc.isValid(this.btnPageDown)) {
            this.btnPageDown.off(cc.Node.EventType.TOUCH_START, this.pageDown, this);
        }
    },


    set_maxlength(length){
        this.maxArrayLength = length
        
        this.refreshIndexLabel();
    },

    set_data(datas,isNotReset) {
        this.items = datas;
        if(!isNotReset){
            this.curIndex = 0;
        }
        
        this.splitItems();
        this.refreshCurPage();
    },

  

    append_data(datas) {
        if (!this.items) {
            this.items = [];
        }
        this.insert_data(this.items.length, datas);

        //重新刷新界面
        this.splitItems();
        this.refreshCurPage();
    },

    //界面大小变化，重新刷新界面
    reset_size() {
        this.splitItems();
        this.refreshCurPage();
    },

    insert_data(index, datas) {
        if (datas.length == 0) {
            return;
        }

        if (!this.items) {
            this.items = [];
        }

        if (index < 0 || index > this.items.length) {
            cc.warn("无效索引", index);
            return;
        }

        let _items = datas;
        this.items.splice(index, 0, ..._items);
    },

    //生成item节点，放入content中
    createItems() {
        //每页显示item个数
        let count = this.getPerPageCount();

        let nodeArr = this.content.children;
        let offsetCount = count - nodeArr.length
        if (offsetCount > 0) {
            for (let i = 0; i < offsetCount; i++) {
                let itemNode = cc.instantiate(this.itemPrefab);
                itemNode.active = false;
                itemNode.parent = this.content;
            }
        } else {
            offsetCount = Math.abs(offsetCount)
            for (let i = (nodeArr.length - 1); i >= 0; i--) {
                if (offsetCount > 0) {
                    --offsetCount
                    nodeArr[i].destroy()
                } else {
                    break
                }
            }
        }
    },

    //根据content高度及item预制体高度，计算出每页显示item个数
    getPerPageCount() {

        if (this.itemPrefab.data) {
            if (this.direction == DIRECTION.Vertical) {
                let layout = this.content.getComponent(cc.Layout);
                if(layout){
                    return Math.floor((this.content.height - layout.paddingTop - layout.paddingBottom) / (this.itemPrefab.data.height + layout.spacingY));
                }
                return Math.floor(this.content.height / this.itemPrefab.data.height);
            }
            else {
                let layout = this.content.getComponent(cc.Layout);
                if(layout){
                    return Math.floor((this.content.width - layout.paddingLeft- layout.paddingRight) / (this.itemPrefab.data.width + layout.spacingX));
                }
                return Math.floor(this.content.width / this.itemPrefab.data.width );
            }
        }
        else {
            if (this.direction == DIRECTION.Vertical) {
                let layout = this.content.getComponent(cc.Layout);
                if(layout){
                    return Math.floor((this.content.height - layout.paddingTop - layout.paddingBottom) / (this.itemPrefab.height + layout.spacingY));
                }
                return Math.floor(this.content.height / this.itemPrefab.height);
            }
            else {
                let layout = this.content.getComponent(cc.Layout);
                if(layout){
                    return Math.floor((this.content.width - layout.paddingLeft- layout.paddingRight) / (this.itemPrefab.width + layout.spacingX));
                }
                return Math.floor(this.content.width / this.itemPrefab.width );
            }
    
        }
    },

    //拆分为多个数组
    splitItems() {
        this.createItems();
        if (!this.items) return;
        this.pageArr = [];
        let num = this.getPerPageCount();
        for (let i = 0; i < this.items.length; i += num) {
            this.pageArr.push(this.items.slice(i, i + num));
        }
    },

    //获取总页数
    getTotalPage() {
        return this.pageArr ? this.pageArr.length : 0;
    },

    //向前翻页
    pageUp() {
        if (this.curIndex > 0) {
            this.curIndex -= 1;
            this.refreshCurPage();
        }
    },


    //向后翻页
    pageDown() {
        if (this.curIndex < this.getTotalPage() - 1) {
            this.curIndex += 1;
            this.refreshCurPage();

            if (this.curIndex >= this.getTotalPage() - 1) {
                if (this.page_to_end_cb) {
                    this.page_to_end_cb.call(this.cb_host, this.items.slice(-1));
                }
            }
        }
        else {
            //回调
            if (this.page_to_end_cb) {
                this.page_to_end_cb.call(this.cb_host, this.items.slice(-1));
            }
        }
    },

    setIndex(index){
        
        if (index < this.getTotalPage()) {
            this.curIndex = index;
            this.refreshCurPage();
        }
    },

    //刷新当前页数据
    refreshCurPage() {
        if (this.curIndex <= 0) {
            this.curIndex = 0;
        }
        if (this.curIndex >= this.getTotalPage()) {
            this.curIndex = this.getTotalPage() - 1;
        }

        //先隐藏所有节点
        let nodeArr = this.content.children;
        for (let i = 0; i < nodeArr.length; i++) {
            nodeArr[i].active = false;
        }

        if (this.getTotalPage() == 0) {
            this.setIndicatorEnabled(true);
            this.refreshIndexLabel();
            return;
        }
        else {
            this.setIndicatorEnabled(true);
        }

        //每页个数
        let num = this.getPerPageCount();
        let arr = this.pageArr[this.curIndex];
        for (let i = 0; i < arr.length; i++) {
            this.item_setter.call(this.cb_host, nodeArr[i], arr[i], this.curIndex * num + i);
            nodeArr[i].active = true;
        }

        this.refreshIndexLabel();
    },

    //刷新底部页数索引
    refreshIndexLabel() {
        if (this.indexLabel) {
            if(this.getTotalPage() == 0){
                this.indexLabel.string = "1/1"
            }else{
                if(this.maxArrayLength == 0){
                    this.indexLabel.string = (this.curIndex + 1) + "/" + this.getTotalPage();
                }else{
                    let totalPage = Math.ceil(this.maxArrayLength/this.getPerPageCount())
                    this.indexLabel.string = (this.curIndex + 1) + "/" + totalPage;
                }
            }
        }
    },

    //设置底部指示器显隐
    setIndicatorEnabled(state) {
        this.btnPageUp.active = state;
        this.btnPageDown.active = state;
        if (this.indexLabel) {
            this.indexLabel.node.active = state;
        }
    },

});