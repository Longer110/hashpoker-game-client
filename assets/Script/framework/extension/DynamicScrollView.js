// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;

//滚动方向
let EScrollDirection= cc.Enum({
    left_right: 0,
    top_botton: 1, //下拉
});


/*
onScrollCallbackEvents

回调用来刷新界面
示例 function(node,data){

},

*/

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        //滚动方向
        showAction: {
            default: EScrollDirection.left_right,
            type: cc.Enum(EScrollDirection),
        },

        //动态调用回调
        onScrollCallbackEvents: {
            default: [],
            type: cc.Component.EventHandler
        },
        object: cc.Node,
        dynamicNum:5,

        //滚动到尾部回调
        onScrollEndCallbackEvents: {
            default: [],
            type: cc.Component.EventHandler
        },
        _data:[],
        _dynamicNumDelayed:1,
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        //this.initList();
        
        if(!this.allPools){
            //游戏用到的所有对象池Map
            this.allPools = new Map();
        }

        this._onResized();
    },
    onDestroy () {
        if(this.allPools){
            //清理对象池
            this.allPools.forEach((pool, key) => {
                pool.clear();
            });
            this.allPools = null;
        }
    },

 

    _onResized(){
       
        //this.event_update_opacity();
    },

    onEnable(){
        if(cc.isValid(this.scrollView)){
            this.scrollView.node.on("scroll-to-bottom", this.on_scroll_to_end, this);
            this.scrollView.node.on("scroll-to-right", this.on_scroll_to_end, this);
            this.scrollView.node.on("scroll-to-top", this.on_scroll_to_top, this);
            this.scrollView.node.on("scroll-to-left", this.on_scroll_to_top, this);
            this.scrollView.node.on("scrolling", this.on_scrolling, this);
            
        }
    },
    onDisable(){
        if(cc.isValid(this.scrollView)){
            this.scrollView.node.off("scroll-to-bottom", this.on_scroll_to_end, this);
            this.scrollView.node.off("scroll-to-right", this.on_scroll_to_end, this);
            this.scrollView.node.off("scroll-to-top", this.on_scroll_to_top, this);
            this.scrollView.node.off("scroll-to-left", this.on_scroll_to_top, this);
            this.scrollView.node.off("scrolling", this.on_scrolling, this);
        }
    },

    on_scrolling(){

        // if(this.scrollView){
        //     this.scrollView.content.x = Math.round(this.scrollView.content.x)
        //     this.scrollView.content.y = Math.round(this.scrollView.content.y)
        // }

    },

    on_scroll_to_end(event){

        cc.log("dynamicScrollView:on_scroll_to_end---");
        this.scrollViewCallback(event);

        if(this._data==null ||this._data === "undefined" || this._data.length <=0) return;
        if(this.onScrollEndCallbackEvents){
            if(this._currentNum >= this._data.length){
                if(this.scrollView.content.children.length > 0){
                    let index = this.scrollView.content.children.length - 1
                    cc.Component.EventHandler.emitEvents(this.onScrollEndCallbackEvents,this.scrollView.content.children[index],this._data[this._data.length - 1]);
                }
            }
        }
    },

    isReadyNodes(){
        if(this._currentNum >= this._data.length){
            return true
        }else{
            return false
        }
    },

    on_scroll_to_top(event){
        cc.log("dynamicScrollView:on_scroll_to_top---");
        this.scrollViewCallback(event);
    },

    scrollViewCallback(event){
        cc.log("dynamicScrollView:scrollViewCallback---");
        if(this._data==null ||this._data === "undefined" || this._data.length <=0) return;
        if(this._currentNum < this._data.length){
            this.updateListView();
        }
    },

    init(arrayData){
        if (arrayData instanceof Array){
            this._data = arrayData;
            this._currentNum = 0;
            this.updateListView();
        }else{
            this._currentNum = 0;
            this.clearScrollView();
            cc.warn("dynamicScrollView init data is error"); 
        }
    },

    append_data(datas) {
        if(!this._data) {
            this._data = [];
        }
        if(datas instanceof Array){
            if(this._data.length == 0){
                this._currentNum = 0;
            }
            this._data.splice(this._data.length, 0, ...datas);
            this.updateListView();
        } 
    },

    deleteItemByData(data){
        for(let i=(this._data.length-1);i>=0;i--){
            let itemData = this._data[i]
            if(itemData == data){
                this._data.splice(i, 1);
                if(this.scrollView.content.children.length > i){
                    let node = this.scrollView.content.children[i]
                    if(node){
                        this.recycleObj(node)
                    }
                }
            }
        }

        if(this.scrollView && this.scrollView.content){
            let layout = this.scrollView.content.getComponent(cc.Layout)
            if(layout){
                layout.updateLayout();
            }
        }
    },


    //生成物体
    spawnObj() {

        if(!this.object){
            return null
        }

        if(!this.allPools){
            //游戏用到的所有对象池Map
            this.allPools = new Map();
        }

        let node = null;
        let pools = this.allPools.get(this.object.name);
        if (!pools) {
            pools = new cc.NodePool();
            this.allPools.set(this.object.name, pools);
        }
        node = (pools.get() || cc.instantiate(this.object));
        node.active = true;
        node.opacity = 255
        return node;
    },

    //回收物体
    recycleObj(node) {
        
        if (node && cc.isValid(node)) {

            if(!this.allPools){
                //游戏用到的所有对象池Map
                this.allPools = new Map();
            }
            
            let pools = this.allPools.get(node.name);
            if (!pools) {
                pools = new cc.NodePool();
                this.allPools.set(node.name, pools);
            }
            node.opacity = 0
            pools.put(node);
        }
    },


    clearScrollView(){

        if(!this.scrollView){
            return
        }
        let startIndex = this.scrollView.content.children.length - 1
        for(let i=startIndex;i >= 0;i--){
            let node = this.scrollView.content.children[i]
            this.recycleObj(node)
        }

    },


    updateListView(isDelayed){
       
        if(this._currentNum === 0){
            this._startIndex = 0
            this._endIndex = 0
            this.clearScrollView();
            this.scrollView.content.width = this.scrollView.node.width
            this.scrollView.content.height = this.scrollView.node.height
            this.scrollView.stopAutoScroll()
            if(this.showAction == EScrollDirection.top_botton){
                this.scrollView.scrollToTop(0);
            }else{
                this.scrollView.scrollToLeft(0);
            }
        }
        if(this._data.length <= 0){
            cc.log("updateListView data is nil");
            this._startIndex = 0
            this._endIndex = 0
            this._currentNum = 0
            return;
        }

        let createNum = this.dynamicNum;
        if(isDelayed){
            createNum = this._dynamicNumDelayed;
        }
        let endNum = this._data.length;
        if(cc.isValid(this.object)){
            //刷新现有的
            let num = 0;
            for(let k=0;k<this._currentNum;k++){
                let node = this.scrollView.content.children[k]
                if(cc.isValid(node)){
                    if(num >= endNum){
                        this.recycleObj(node)
                        this._currentNum--;
                    }else{
                        if(this._check_collision(node)){
                            if(node.opacity <= 0){
                                node.opacity = 255
                                if(this.onScrollCallbackEvents){
                                    if(k < this._data.length){
                                        cc.Component.EventHandler.emitEvents(this.onScrollCallbackEvents,node,this._data[k]);
                                    }
                                }
                            }
                        }
                    }
                    num++;
                }
            }
            //创建不存在的
            for(let i=0;i<createNum;i++){
                if(this._currentNum < endNum){
                    if(this.object){
                        let prefab = this.spawnObj()
                        if(prefab){
                            this.scrollView.content.addChild(prefab);
                            if(this.onScrollCallbackEvents){
                                if(this._currentNum < this._data.length){
                                    cc.Component.EventHandler.emitEvents(this.onScrollCallbackEvents,prefab,this._data[this._currentNum]);
                                }
                            }
                            if(this._check_collision(prefab)){
                                prefab.opacity = 255
                            }else{
                                prefab.opacity = 0
                            }
                            this._currentNum++;
                        }
                    }
                }
            }

            if(this.scrollView && this.scrollView.content){
                let layout = this.scrollView.content.getComponent(cc.Layout)
                if(layout){
                    layout.updateLayout();
                }
            }
            if(this.showAction == EScrollDirection.top_botton){
                if(this.scrollView.content.height <= this.scrollView.node.height){
                    if(this._currentNum < endNum){
                        this.scheduleOnce(function () {
                            this.updateListView();
                        },0);
                        return
                    }
                }
            }
            if(this.showAction == EScrollDirection.left_right){
                if(this.scrollView.content.width <= this.scrollView.node.width){
                    if(this._currentNum < endNum){
                        this.scheduleOnce(function () {
                            this.updateListView();
                        },0);
                        return
                    }
                }
            }
            this.scheduleOnce(function () {
                this.event_update_opacity();
            },0);
        } 
    },
    updateShowItem(){
        if(this.scrollView && this.scrollView.content){
            let layout = this.scrollView.content.getComponent(cc.Layout)
            if(layout){
                layout.updateLayout();
            }
        }
        this.event_update_opacity()
        let childs = this.scrollView.content.children
        for(let k=this._startIndex;k <= this._endIndex;k++){
            let v1_o = childs[k]
            if(v1_o){
                if(this.onScrollCallbackEvents){
                    if(k < this._data.length){
                        cc.Component.EventHandler.emitEvents(this.onScrollCallbackEvents,v1_o,this._data[k]);
                    }
                }
            }
        }
    },

    getDatas(){
        return this._data
    },

    /* ***************功能函数*************** */
    /**获取在世界坐标系下的节点包围盒(不包含自身激活的子节点范围) */
    _get_bounding_box_to_world(node_o_){
        let w_n = node_o_._contentSize.width;
        let h_n = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n, 
            -node_o_._anchorPoint.y * h_n, 
            w_n, 
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    },
    /**检测碰撞 */
    _check_collision(node_o_){
        let rect1_o = this._get_bounding_box_to_world(this.scrollView.content.parent);
        let rect2_o = this._get_bounding_box_to_world(node_o_);
        // ------------------保险范围
        rect1_o.width += rect1_o.width * 0.5;
        rect1_o.height += rect1_o.height * 0.5;
        rect1_o.x -= rect1_o.width * 0.25;
        rect1_o.y -= rect1_o.height * 0.25;
        return rect1_o.intersects(rect2_o);
    },
    /*
     *判断节点是否显示或者隐藏 
     */
    update_start_node(index){
        let childs = this.scrollView.content.children
        if(index >= 0 && index < childs.length){
            let node = childs[index]
            if(cc.isValid(node)){
                if(this._check_collision(node)){
                    node.opacity = 255
                    this._startIndex = index
                    if(this.onScrollCallbackEvents){
                        if(index < this._data.length){
                            cc.Component.EventHandler.emitEvents(this.onScrollCallbackEvents,node,this._data[index]);
                        }
                    }
                }else{
                    node.opacity = 0
                }
            }
        }
    },
    update_end_node(index){
        let childs = this.scrollView.content.children
        if(index >= 0 && index < childs.length){
            let node = childs[index]
            if(cc.isValid(node)){
                if(this._check_collision(node)){
                    node.opacity = 255
                    this._endIndex = index
                    if(this.onScrollCallbackEvents){
                        if(index < this._data.length){
                            cc.Component.EventHandler.emitEvents(this.onScrollCallbackEvents,node,this._data[index]);
                        }
                    }
                }else{
                    node.opacity = 0
                }
            }
        }
    },
    /* ***************自定义事件*************** */
    event_update_opacity(){

        let childs = this.scrollView.content.children
        if(childs.length <= 0){
            return
        }

        if(this._startIndex && this._startIndex >= childs.length){
            this._startIndex = childs.length - 1
        }
        if(this._startIndex == null){
            this._startIndex = 0
        }
        //开始下标
        let node = childs[this._startIndex]
        if(cc.isValid(node)){
            if(this._check_collision(node)){
                node.opacity = 255
                let index = this._startIndex
                while (index >= 0 && index == this._startIndex) {
                    index = index - 1
                    this.update_start_node(index);
                }
            }else{
                node.opacity = 0
                let index = this._startIndex + 1
                let isShow = false
                while (index < childs.length && index != this._startIndex) {
                    this.update_start_node(index);
                    if(index == this._startIndex){
                        index = this._startIndex
                        isShow = true
                    }else{
                        index = index + 1
                    }
                }
                if(!isShow){
                    index = this._startIndex - 1
                    while (index >= 0) {
                        this.update_start_node(index);
                        if(index == this._startIndex){
                            isShow = true
                            index = index - 1
                        }else{
                            if(isShow){
                                index = -1
                            }else{
                                index = index - 1
                            }
                        }
                    }
                }
            }
        }
        if(this._endIndex && this._endIndex >= childs.length){
            this._endIndex = childs.length - 1
        }
        if(this._endIndex == null){
            this._endIndex = this._startIndex
        }
        //结束下标
        node = childs[this._endIndex]
        if(cc.isValid(node)){
            if(this._check_collision(node)){
                node.opacity = 255
                let index = this._endIndex + 1
                while (index < childs.length && index != this._endIndex) {
                    this.update_end_node(index);
                    if(index == this._endIndex){
                        index = index + 1
                    }else{
                        index = this._endIndex
                    }
                }
            }else{
                node.opacity = 0
                let index = this._endIndex - 1
                let isShow = false
                while (index >= 0) {
                    this.update_end_node(index);
                    if(index == this._endIndex){
                        index = -1
                        isShow = true
                    }else{
                        index = index - 1
                    }
                }
                if(!isShow){
                    let index = this._endIndex + 1
                    while (index < childs.length && index != this._endIndex) {
                        this.update_end_node(index);
                        if(index == this._endIndex){
                            index = index + 1
                            isShow = true
                        }else{
                            if(isShow){
                                index = this._endIndex
                            }else{
                                index = index + 1
                            }
                        }
                    }
                }
            }
        }
    },

    update (dt) {

        if(this._data==null ||this._data === "undefined" || this._data.length <=0) return;

        this.event_update_opacity()

        if(this._currentNum < this._data.length){
            if(!this.scrollView.isScrolling() && !this.scrollView.isAutoScrolling()){
                if(this.delayedTime == null){
                    this.delayedTime = 0
                }
                this.delayedTime += dt
                if(this.delayedTime >= 0.1){
                    this.updateListView(true);
                    this.delayedTime = 0
                }
            }else{
                this.delayedTime =0
            }
    
        }
        
    },
});
