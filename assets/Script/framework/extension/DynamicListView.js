//滚动方向
var ScrollDirection = cc.Enum({
    Vertical: 1,
    Horizontal: 2
});

/*
构造参数格式
Params = {
     scrollview: cc.ScrollView;
     mask: cc.Node;
     content: cc.Node;
     item_templates: ScrollItemTemplate[];
     direction?: ScrollDirection;
     width?: number;
     height?: number;
     gap_x?: number;
     gap_y?: number;
     cb_host?: any;                                                                           //回调函数host
     item_setter: (item: cc.Node, key: string, data: any, index: number) => [number, number]; //item更新setter，返回item节点的宽度和高度
     recycle_cb?: (item: cc.Node, key: string) => void;                                       //回收时的回调
     scroll_to_end_cb?: () => void;                                                           //滚动到尽头的回调
     auto_scrolling?: boolean;                                                                //append时自动滚动到尽头
 }

每个item的类型格式
item = {
    x: number;
    y: number;
    width: number;
    height: number;
    data: ScrollItemData;
    node: cc.Node;
}

传入的item的类型格式
ScrollItemData = {
    key: string; //节点名称
    data: any;
}

创建item的模板的类型格式
ScrollItemTemplate = {
    key: string; //节点名称
    node: cc.Prefab; //作为模板的节点
}
*/
cc.Class({
    extends: Object,

    ctor() {

        //构造参数
        let params = arguments[0];

        //scrollView组件
        this.scrollview = params.scrollview;
        //遮罩
        this.mask = params.mask;
        //用于滚动的容器
        this.content = params.content;
        //节点映射
        this.node_pools = new Map();
        //item模板映射
        this.item_templates = new Map();

        params.item_templates.forEach((tpl) => {
            tpl.node.active = true;
            this.item_templates.set(tpl.key, tpl.node);
        });

        //滚动方向
        this.dir = params.direction || ScrollDirection.Vertical;
        //可见区域的宽度
        this.width = params.width || this.mask.width;
        //可见区域的高度
        this.height = params.height || this.mask.height;
        //左右间隔
        this.gap_x = params.gap_x || 0;
        //上下间隔
        this.gap_y = params.gap_y || 0;
        //回调对象
        this.cb_host = params.cb_host;
        //item设置方法
        this.item_setter = params.item_setter;
        //回收回调
        this.recycle_cb = params.recycle_cb;
        //滚动到末端回调
        this.scroll_to_end_cb = params.scroll_to_end_cb;

        //滚动到顶端回调
        this.scroll_to_top_cb = params.scroll_to_top_cb;

        //滚动过程回调
        this.scrolling_to_cb = params.scrolling_to_cb;

        //自动滚动
        this.auto_scrolling = params.auto_scrolling || false;

        //ItemData数组
        this.items = null;
        //开始索引
        this.start_index = null;
        //结束索引
        this.stop_index = null;

        //如果为垂直滚动则设置容器的宽度为遮罩的宽度，如果为水平滚动则设置容器的高度为遮罩的高度
        if (this.dir == ScrollDirection.Vertical) {
            this.content.width = this.width;
        }
        else {
            this.content.height = this.height;
        }

        //设置遮罩大小
        this.mask.setContentSize(this.width, this.height);
        if (!this.mask.getComponent(cc.Mask)) {
            this.mask.addComponent(cc.Mask);
        }

        //设置scrollView组件属性     
        this.scrollview.node.setContentSize(this.width, this.height);
        this.scrollview.vertical = this.dir == ScrollDirection.Vertical;
        this.scrollview.horizontal = this.dir == ScrollDirection.Horizontal;
        //开启惯性
        this.scrollview.inertia = true;
        //滚动行为是否会屏蔽子节点注册的触摸事件
        this.scrollview.cancelInnerEvents = true;

        //注册事件
        this.scrollview.node.on("scrolling", this.on_scrolling, this);
        this.scrollview.node.on("scroll-to-bottom", this.on_scroll_to_end, this);
        this.scrollview.node.on("scroll-to-right", this.on_scroll_to_end, this);

        this.scrollview.node.on("scroll-to-top", this.on_scroll_to_top, this);
        this.scrollview.node.on("scroll-to-left", this.on_scroll_to_top, this);
    },

    //滚到末尾
    on_scroll_to_end: function () {
        if (!this.items || this.items.length <= 0) {
            return;
        }

        //执行回调
        if (this.scroll_to_end_cb) {
            this.scroll_to_end_cb.call(this.cb_host, this.items.slice(-1));
        }
    },

    //滚到顶部
    on_scroll_to_top: function () {

        if (!this.items || this.items.length <= 0) {
            return;
        }


        //执行回调
        if (this.scroll_to_top_cb) {
            this.scroll_to_top_cb.call(this.cb_host, this.items.slice(0));
        }
    },



    //滚动中
    on_scrolling: function () {


        if (!this.items || this.items.length <= 0) {
            return;
        }


        //执行回调
        if (this.scrolling_to_cb) {
            this.scrolling_to_cb.call(this.cb_host);
        }


        //垂直方向
        if (this.dir == ScrollDirection.Vertical) {
            //容器的位置
            let posy = this.content.y;

            let top = this.mask.height - this.mask.height * this.mask.anchorY

            //已经拖到顶部
            if (posy < top) {
                posy = top;
            }
            //已经拖到底部
            if (posy > this.content.height - this.height + top) {
                posy = this.content.height - this.height + top;
            }

            //开始索引
            let start = 0;
            //结束索引
            let stop = this.items.length - 1;
            //可见区域内第一个item的位置
            let viewport_start = -posy + top;
            //可见区域内最后一个item的位置
            let viewport_stop = viewport_start - this.height;
            //获取在可视区域内的item起始索引
            while (start < stop && this.items[start].y - this.items[start].height > viewport_start + this.items[start].height * 0.5) {
                start++;
            }
            while (stop > 0 && this.items[stop].y + this.items[start].height < viewport_stop - this.items[stop].height * 0.5) {
                stop--;
            }

            if (start != this.start_index || stop != this.stop_index) {
                this.start_index = start;
                this.stop_index = stop;
                //cc.log("render_from:", start, stop);

                this.render_items();
            }
        }
        else {
            let posx = this.content.x;
            if (posx > -(this.mask.width * this.mask.anchorX)) {
                posx = -(this.mask.width * this.mask.anchorX);
            }
            if (posx < -(this.content.width - this.width) - this.mask.width * this.mask.anchorX) {
                posx = -(this.content.width - this.width) - this.mask.width * this.mask.anchorX;
            }
            let start = 0;
            let stop = this.items.length - 1;

            let viewport_start = -posx - this.mask.width * this.mask.anchorX;
            let viewport_stop = viewport_start + this.width;
            while (start < stop && this.items[start].x + this.items[start].width < viewport_start - this.items[start].width * 0.5) {
                start++;
            }
            while (stop > 0 && this.items[stop].x - this.items[stop].width > viewport_stop + this.items[stop].width * 0.5) {
                stop--;
            }
            if (start != this.start_index || stop != this.stop_index) {
                this.start_index = start;
                this.stop_index = stop;
                //cc.log("render_from", start, stop);
                this.render_items();

            }
        }

    },

    clear_items: function () {
        if (this.items) {
            this.items.forEach((item) => {
                this.recycle_item(item);
            });
            this.items = [];
        }
    },

    recycle_item: function (item) {

        if (item.node && cc.isValid(item.node)) {
            let pools = this.node_pools.get(item.data.key);
            if (!pools) {
                //pools = [];
                pools = new cc.NodePool();
                this.node_pools.set(item.data.key, pools);
            }
            //pools.push(item.node);
            pools.put(item.node);

            if (this.recycle_cb) {
                this.recycle_cb.call(this.cb_host, item.node, item.data.key);
            }

            //item.node.destroy();
            item.node = null;
        }
    },

    spawn_node: function (key) {
        let node = null;
        let pools = this.node_pools.get(key);

        if (!pools) {
            pools = new cc.NodePool();
            this.node_pools.set(key, pools);
        }
        node = (pools.get() || cc.instantiate(this.item_templates.get(key)));
        node.active = true;

        // if (pools != null && pools.length > 0) {
        //     node = pools.pop();            
        // }
        // else {
        //     node = cc.instantiate(this.item_templates.get(key));
        //     node.active = true;
        //     //cc.log("spawn_noe, key=", key);
        // }

        node.parent = this.content;

        return node;
    },

    //刷新items
    render_items: function () {
        let item = null;
        //回收可视区域外item
        for (let i = 0; i < this.start_index; i++) {
            item = this.items[i];
            if (item.node) {
                this.recycle_item(item);
            }
        }

        //回收可视区域外item
        for (let i = this.items.length - 1; i > this.stop_index; i--) {
            item = this.items[i];
            if (item.node) {
                this.recycle_item(item);
            }
        }

        for (let i = this.start_index; i <= this.stop_index; i++) {
            item = this.items[i];
            if (!item.node) {
                item.node = this.spawn_node(item.data.key);
                this.item_setter.call(this.cb_host, item.node, item.data.key, item.data.data, i);
            } else {
                this.item_setter.call(this.cb_host, item.node, item.data.key, item.data.data, i);
            }
            item.node.setPosition(item.x, item.y);
        }

    },

    pack_item: function (index, data) {
        let node = this.spawn_node(data.key);

        let [width, height] = this.item_setter.call(this.cb_host, node, data.key, data.data, index, true);
        let item = { x: 0, y: 0, width: width, height: height, data: data, node: node };

        this.recycle_item(item);
        return item;
    },

    //布局item，根据尺寸计算各个item的位置
    layout_items: function (start) {
        if (this.items.length <= 0) {
            return;
        }

        //开始坐标
        let start_pos = 0;

        //如果不是从第一个开始
        if (start > 0) {
            let prev_item = this.items[start - 1];
            if (this.dir == ScrollDirection.Vertical) {
                start_pos = prev_item.y - prev_item.height * 0.5 - this.gap_y;
            }
            else {
                start_pos = prev_item.x + prev_item.width * 0.5 + this.gap_x;
            }
        }

        for (let index = start, stop = this.items.length; index < stop; index++) {
            let item = this.items[index];
            if (this.dir == ScrollDirection.Vertical) {
                item.x = 0;

                start_pos -= item.height * 0.5;
                item.y = start_pos;
                start_pos -= item.height * 0.5 + this.gap_y;
            }
            else {
                item.y = 0;

                start_pos += item.width * 0.5;
                item.x = start_pos;
                start_pos += item.width * 0.5 + this.gap_x;
            }
        }

    },

    resize_content: function () {
        if (this.items.length <= 0) {
            this.content.height = this.height;
            this.content.width = this.width;
            return;
        }

        let last_item = this.items[this.items.length - 1];
        if (this.dir == ScrollDirection.Vertical) {
            this.content.height = Math.max(this.height, last_item.height * 0.5 - last_item.y);
        }
        else {
            this.content.width = Math.max(this.width, last_item.x + last_item.width * 0.5);
        }
    },

    set_data: function (datas, start_index) {
        this.clear_items();
        this.items = [];
        datas.forEach((data, index) => {
            let item = this.pack_item(index, data);
            this.items.push(item);
        });
        this.layout_items(0);
        this.resize_content();


        this.start_index = -1
        this.stop_index = -1;
        if (this.dir == ScrollDirection.Vertical) {
            this.content.anchorX = 0.5;
            this.content.anchorY = 1;
            //调整容器的位置

            let offset = this.mask.height - this.mask.height * this.mask.anchorY;
            this.content.y = offset
            if (start_index && start_index > 0 && start_index < this.items.length) {
                this.start_index = start_index;
                let item = this.items[start_index]
                let y = Math.abs(item.y)
                let bottom = this.content.height - this.height + offset;
                if (y > (offset - item.height)) {
                    let offsetY = y + offset - item.height / 2
                    if (offsetY > bottom) {
                        this.content.y = bottom
                    } else {
                        this.content.y = offsetY
                    }
                }
            }
        }
        else {
            this.content.anchorX = 0;
            this.content.anchorY = 0.5;
            //调整容器的位置
            let offset = (this.mask.width * this.mask.anchorX);
            this.content.x = -offset
            if (start_index && start_index > 0 && start_index < this.items.length) {
                this.start_index = start_index;
                let item = this.items[start_index]
                let x = Math.abs(item.x)
                let max = this.content.width - this.width + offset
                if (x > offset) {
                    let offsetX = x + offset - item.width / 2
                    if (offsetX > max) {
                        if (offsetX > 0) {
                            this.content.x = -max
                        } else {
                            this.content.x = 0
                        }
                    } else {
                        if (offsetX > 0) {
                            this.content.x = -offsetX
                        } else {
                            this.content.x = 0
                        }
                    }
                }
            }
        }

        if (this.items.length > 0) {
            this.on_scrolling();
        }
    },

    insert_data: function (index, datas) {
        if (datas.length == 0) {
            //cc.log("nothing to insert");
            return;
        }

        if (!this.items) {
            this.items = [];
        }

        if (index < 0 || index > this.items.length) {
            cc.warn("invalid index", index);
            return;
        }

        let isJump = false


        let is_append = index == this.items.length;
        let items = [];
        datas.forEach((data, index) => {
            let item = this.pack_item(index, data);
            items.push(item);
        });


        if (index < this.items.length) {
            isJump = true
        }

        this.items.splice(index, 0, ...items);
        this.layout_items(index);
        this.resize_content();

        if (this.dir == ScrollDirection.Vertical) {
            if (this.content.height <= this.height) {
                isJump = false
            }
        }
        else {
            if (this.content.width <= this.width) {
                isJump = false
            }
        }

        this.start_index = -1;
        this.stop_index = -1;

        if (isJump) {

            let width = 0
            let height = 0
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                width = width + item.width
                height = height + item.height
            }

            if (this.dir == ScrollDirection.Vertical) {
                this.content.y = this.content.y + height
            }
            else {
                this.content.x = this.content.x - width
            }
        }

        if (this.auto_scrolling && is_append) {
            if (this.scrollview && !this.scrollview.isScrolling() && !this.scrollview.isAutoScrolling()) {
                this.scroll_to_end();
            }
        }

        this.on_scrolling();
    },

    delete_item: function (index) {
        if (index == null || index == undefined) {
            return;
        }

        if (index < 0 || index > this.items.length) {
            cc.warn("delete invalid index", index);
            return;
        }

        for (let i = 0; i < this.items.length; i++) {
            if (i == index) {
                let item = this.items[i];
                if (item.node) {
                    this.recycle_item(item);
                }

                this.items.splice(i, 1);
                break;
            }

        }

        this.layout_items(index);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;

        //if (this.auto_scrolling && is_append) {
        //this.scroll_to_end();
        //}
        this.on_scrolling();
    },


    addfirst: function (datas) {
        if (!this.items) {
            this.items = [];
        }
        this.insert_data(0, datas);
    },

    append_data: function (datas) {
        if (!this.items) {
            this.items = [];
        }
        this.insert_data(this.items.length, datas);
    },

    scroll_to_end: function () {
        if (this.dir == ScrollDirection.Vertical) {
            this.scrollview.scrollToBottom();
        }
        else {
            this.scrollview.scrollToRight();
        }
    },

    reset_size(width, height) {
        this.width = width;
        this.height = height;
        this.mask.setContentSize(this.width, this.height);
        this.scrollview.node.setContentSize(this.width, this.height);

        if (this.items && this.items.length > 0) {
            this.resize_content();
            this.on_scrolling();
        }
    },

    render_one_item: function (callBack) {
        for (let i = this.start_index; i <= this.stop_index; i++) {
            let item = this.items[i];
            if (callBack(item.data.data)) {
                this.item_setter.call(this.cb_host, item.node, item.data.key, item.data.data, i);
                break;
            }
        }
    },

    destroy: function () {
        this.clear_items();
        this.node_pools.forEach((pools, key) => {
            // pools.forEach((node) => {
            //     node.destroy();
            // });
            pools.clear();
        });
        this.node_pools = null;
        this.items = null;

        if (cc.isValid(this.scrollview.node)) {
            this.scrollview.node.off("scrolling", this.on_scrolling, this);
            this.scrollview.node.off("scroll-to-bottom", this.on_scroll_to_end, this);
            this.scrollview.node.off("scroll-to-right", this.on_scroll_to_end, this);

            this.scrollview.node.on("scroll-to-top", this.on_scroll_to_top, this);
            this.scrollview.node.on("scroll-to-left", this.on_scroll_to_top, this);
        }
    },

});