let Obj = cc.Class({
    extends: cc.Component,

    statics: {
        //存放控件的键值对
        Container: {},

        //存放事件的数组
        _EventList: [],

        //注册事件(通过节点直接进行注册，而不是通过Button、Slider、Toggle组件)
        EventListener: function (widgetName, enentType, callback, obj) {
            if (Obj.Container.hasOwnProperty(widgetName)) {
                let arr = [widgetName, enentType, callback, obj];
                Obj._EventList.push(arr);

                Obj.Container[widgetName].on(enentType, callback, obj);
            }
        },

        /////通过Button、Slider、Toggle组件进行注册
        /////////////////////////////////////////
        addClickEvent: function (widgetName, target, component, handler) {
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target;
            eventHandler.component = component;
            eventHandler.handler = handler;

            var clickEvents = Obj.Container[widgetName].getComponent(cc.Button).clickEvents;
            clickEvents.push(eventHandler);
        },
        addSlideEvent: function (widgetName, target, component, handler) {
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target;
            eventHandler.component = component;
            eventHandler.handler = handler;

            var slideEvents = Obj.Container[widgetName].getComponent(cc.Slider).slideEvents;
            slideEvents.push(eventHandler);
        },
        addToggleEvent: function (widgetName, target, component, handler) {
            var checkEventHandler = new cc.Component.EventHandler();
            checkEventHandler.target = target;
            checkEventHandler.component = component;
            checkEventHandler.handler = handler;

            var checkEvents = Obj.Container[widgetName].getComponent(cc.Toggle).checkEvents;
            checkEvents.push(checkEventHandler);
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        if (!Obj.Container.hasOwnProperty(this.node.name)) {
            Obj.Container[this.node.name] = this.node;
        }
    },

    onDestroy() {
        //解绑当前节点的点击事件
        let array = Obj._EventList;
        for (let index = array.length - 1; index >= 0; index--) {
            if (array[index][0] == this.node.name) {
                let element = array.splice(index, 1)[0];
                Obj.Container[element[0]].off(element[1], element[2], element[3]);
            }
        }

        //删除当前节点的键值对
        delete Obj.Container[this.node.name];
    }

});