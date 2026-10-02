// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const UIListView = require("UIListView");
const dev = console;

let data_index = 0;
let scale_fator = 5;
let speed_fator = 0.4;

cc.Class({
    extends: cc.Component,
    properties: {
        listView: {
            default: null,
            type: UIListView,
        },
        avatar1SF: {
            default: null,
            type: cc.SpriteFrame,
        },
        avatar2SF: {
            default: null,
            type: cc.SpriteFrame,
        },
        bubble1SF: {
            default: null,
            type: cc.SpriteFrame,
        },
        bubble2SF: {
            default: null,
            type: cc.SpriteFrame,
        },

        labelVersion: {
            default: null,
            type: cc.Label,
        },
        labelScale: {
            default: null,
            type: cc.Label,
        },
        labelBrake: {
            default: null,
            type: cc.Label,
        },
        labelSpeed: {
            default: null,
            type: cc.Label,
        },
        editInsertIndex: {
            default: null,
            type: cc.EditBox,
        },
        sliderBrake: {
            default: null,
            type: cc.Slider,
        },
        sliderScale: {
            default: null,
            type: cc.Slider,
        },
        sliderSpeed: {
            default: null,
            type: cc.Slider,
        },
        sliderInsert: {
            default: null,
            type: cc.Slider,
        },
        version: "0.0.1",
        _data: null,
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.labelVersion.string = this.version;
        // let winSize = cc.winSize;
        // let scaleX = winSize.width/this.listView.node.width;
        // let scaleY = winSize.height/this.listView.node.height;
        // let scale = Math.min(scaleX, scaleY);
        // this.listView.node.scale = scaleX;
        //  //console.warn("s: ", scaleX)
    },

    start () {
        this.init();
    },

    // update (dt) {}

    init(){
        let data = this._data = this.createData();
        this.listView.init(this, data);
      
        this.sliderBrake.progress = this.listView.scroll.brake;
        this.labelBrake.string = this.listView.scroll.brake;

        let scale = this.listView.getEasingScale();
        this.labelScale.string = scale;
        this.sliderScale.progress = (scale - 1.0) * scale_fator;

        scale = this.listView.getSpeedScale();
        this.labelSpeed.string = scale;
        this.sliderSpeed.progress = (scale - 1.0) * speed_fator;

        // this.onHandleSpeed(this.sliderBrake);
        // this.onHandleSpeed(this.sliderScale);
        // this.onHandleSpeed(this.sliderSpeed);

        this.listView.scroll._onInitialVelocity = (velocity, brake)=>{
            // dev.log("_onInitialVelocity", velocity, brake);

            this.sliderBrake.progress = brake;
            this.labelBrake.string = brake;
        }

        let index = 0;
        this.editInsertIndex.string = index+"";
        this.sliderInsert.progress = index / this.listView.getAllData().length;
    },

    onClickDebug(){
        let stats = cc.debug.isDisplayStats();
        let show = !stats;
        cc.debug.setDisplayStats(show);
    },
    onClickAddHead(){
        let data = [];
        //增加多少条数据
        let count = 1;
        for (let index = 0; index < count; index++) {
            data.push({
                index: ++data_index,
            })
        }
        this.listView.frontData(data);
        this.listView.scroll.scrollToTop(0.5);
    },
    onClickAddTail(){
        let data = [];
        //增加多少条数据
        let count = 1;
        for (let index = 0; index < count; index++) {
            data.push({
                index: ++data_index,
            })
        }
        this.listView.appendData(data);
        this.listView.scroll.scrollToBottom(0.5);
    },
    onClickInsert(){
        let data = [];
        //插入多少条数据
        let count = 1;
        for (let index = 0; index < count; index++) {
            data.push({
                index: ++data_index,
            })
        }
        let index = Number(this.editInsertIndex.string);
        this.listView.insertData(data, index);
        // this.listView.scroll.scrollToBottom(0.5);
    },
    onClickRemove(){
        let index = Number(this.editInsertIndex.string);
        this.listView.removeData(index);
    },
    onHandleSlider(slider){
        // dev.log("a, b", slider.progress);
        let progress = Number(slider.progress.toFixed(2));
        this.listView.scroll.brake = progress;
        this.labelBrake.string = progress;
    },

    onHandleScale(slider){
        // dev.log("a, b", slider.progress);

        let progress = Number((1 + slider.progress/scale_fator).toFixed(2));
        this.listView.setEasingScale(progress);
        this.labelScale.string = progress;
    },

    onHandleSpeed(slider){
        // dev.log("a, b", slider.progress);

        let progress = Number((1 + slider.progress/speed_fator).toFixed(2));
        this.listView.setSpeedScale(progress);
        this.labelSpeed.string = progress;
    },

    onHandleInsert(slider){
        // dev.log("a, b", slider.progress);

        let progress = Math.floor(slider.progress * (this.listView.getAllData().length-1));
        this.editInsertIndex.string = progress+"";
    },
    onEditTextChange(text, target){
        let index = Number(text);
        if(typeof index != 'number'){
            dev.error("必须输入数字");
            return;
        }
        if(index>=this.listView.getAllData().length){
            index = this.listView.getAllData().length - 1;
            this.editInsertIndex.string = index;
        }
        let progress = index / this.listView.getAllData().length;
        this.sliderInsert.progress = progress;
    },
    _updateInsertProgress(){
        let index = Number(this.editInsertIndex.string);
        let progress = index / this.listView.getAllData().length;
        if(progress>1){
            progress = 1;
            this.editInsertIndex.string = this.listView.getAllData().length - 1;
        }
        this.sliderInsert.progress = progress;
    },

    // doInstantiateCell(index: number, data: any): UIListCell{
    //     let node = new Node();
    //     let sprite = node.addComponent(Sprite);
    //     let flag = index%2==0?true:false;
    //     sprite.spriteFrame = flag ? this.bubble1SF : this.bubble2SF;
    //     let cell = node.addComponent(UIListCell);
        
    //     node.width = 200;
    //     node.height = 200;

    //     return cell;
    // }
    // doRemoveCell(cell: UIListCell){
    //     cell.node.destroy();
    //     return true;
    // }

    // onCreateCell(cell: UIListCell){
    //     this._initGridCell(cell);
    // }
    
    /**
     * 
     * @param {UIListCell} cell 
     */
    onAttachCell(cell){
        // dev.log("onAttachCell", cell.getIndex());
    },
    /**
     * 
     * @param {UIListCell} cell 
     */
    onClickCell(cell){
        dev.log("onClickCell", cell.getIndex(), cell);
    },
    /**
     * 
     * @param {UIListCell} cell 
     */
    onSelectCell(cell){
        // cell.as(Sprite).enabled = true;
    },
    /**
     * 
     * @param {UIListCell} cell 
     */
    unSelectCell(cell){
        // cell.as(Sprite).enabled = false;
    },
    
    onRefreshStart(){
        setTimeout(() => {
            let data = null;
            const maxNum = 20;
            let num = Math.floor(Math.random()*maxNum);
            dev.warn("random="+num);
            if(false && num<maxNum/2){
                let msg = "模拟无数据返回";
                dev.warn(msg);
                this.listView.onRefreshFinish(data);
                // my.ui.toast(msg);
            }
            else{
                dev.warn("模拟刷新数据");
                data = this._data = this.createData();
                this.listView.onRefreshFinish(data);
            }
            this._updateInsertProgress();
        }, 1500);
    },
    
    onLoadMoreStart(){
        setTimeout(() => {
            let data = null;
            const maxNum = 20;
            let num = Math.floor(Math.random()*maxNum);
            dev.warn("random="+num);
            if(false && num<maxNum/2){
                let msg = "模拟无更多数据";
                dev.warn(msg);
                this.listView.onLoadMoreFinish(data);
                // my.ui.toast(msg);
            }
            else{
                dev.warn("模拟加载更多数据");
                data = this.createData(true);
                this.listView.onLoadMoreFinish(data);
            }
            this._updateInsertProgress();
        }, 1500);
    },

    createData(isLoadMore = false){
        // let temp = [];
        // for(let i=0; i<30; i++){
        //     temp.push({
        //         index: i+1,
        //     })
        // }
        // return temp;

        let data = [];

        // if(isLoadMore){
        //     return data;
        // }

        // if(this.listView.isGridLayout){
            let num = 50;
            let num_more = 100;
            if(cc.sys.isNative){
                num = 200;
                num_more = 200;
            }
            if(isLoadMore){
                num = 10 + Math.floor(Math.random()*num_more);
            }
            for(let i=0; i<num; i++){
                data.push({
                    index: ++data_index,
                })
            }
            return data;
        // }


        data = [
            {
                type: 3,
                text: '8月30日 1:37'
            },
            {
                type: 1,
                text: '烧吧，升起<color=#cc6600>糜烂</color>的烟。\n抽吧，吐出全身的疲惫。'
            },
            {
                type: 2,
                text: '遗忘，那些琐碎的一切。\n迷惘，在自己<color=#cc6600>虚空</color>的世界。'
            },
            {
                type: 3,
                text: '昨天 3:17'
            },
            {
                type: 1,
                text: '一起做个<color=#cc6600>拜金主义</color>的毒虫。'
            },
            {
                type: 2,
                text: '用<color=#cc6600>消费</color>麻醉自己。'
            },
            {
                type: 1,
                text: '用称作<color=#cc6600>物质欲望</color>的<color=#cc6600>针头</color>。'
            },
            {
                type: 2,
                text: '注射<color=#cc6600>贪婪</color>和<color=#cc6600>权力</color>。'
            },
            {
                type: 3,
                text: '14:55'
            },
            {
                type: 1,
                text: '<color=#cc6600>磨碎中下阶级的粉末，\n化成高纯度的上流。</color>'
            },
            {
                type: 1,
                text: '渴望金字塔顶端的堕落<color=#cc6600>失心疯</color>，\n的你和我。'
            },
            {
                type: 2,
                text: '的你和我。'
            },
            {
                type: 3,
                text: '23:56'
            },
            {
                type: 2,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 1,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 2,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 1,
                text: '<color=#cc6600>拜金主义</color>的毒虫——！'
            },
            {
                type: 1,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 2,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 1,
                text: '<color=#cc6600>拜金主义</color>——！'
            },
            {
                type: 2,
                text: '<color=#cc6600>拜金主义</color>的<color=#ff0000><size=28>毒虫</size></color>——！'
            },
            {
                type: 1,
                text: '烧吧，升起<color=#cc6600>糜烂</color>的烟。\n抽吧，吐出全身的疲惫。'
            },
            {
                type: 3,
                text: '老破麻 - 毒虫'
            },
            {
                type: 2,
                text: '谢谢观赏<img src="37"/><img src="37"/><img src="37"/>'
            },
            {
                type: 2,
                text: '上面的文字摘自一首摇滚歌曲——<color=#cc6600>《毒虫》</color>，创作乐队：<color=#cc6600>老破麻</color>。'
            },
            {
                type: 2,
                text: 'emmmm...我觉得写的很好，唱的也很好。'
            },
            {
                type: 2,
                text: '<color=#ff0000><size=28>墙裂推荐</size></color>！！！'
            },
            {
                type: 1,
                text: '嗯，<color=#cc6600>老破麻</color>是一支台湾乐队，目前还很小众。'
            },
            {
                type: 1,
                text: '但绝对是<color=#ff0000><size=28>宝藏乐队</size></color>！<img src="42"/><img src="42"/><img src="42"/>'
            },
            {
                type: 2,
                text: '是的没错，他们的风格囊括了<color=#cc6600>摇滚</color>、<color=#cc6600>金属</color>、<color=#cc6600>核</color>，甚至是<color=#cc6600>BossaNova</color>。'
            },
            {
                type: 2,
                text: '借用<color=#cc6600>张亚东</color>老师的一句经典台词：非常好——<img src="15"/><img src="15"/><img src="15"/>'
            },
            {
                type: 2,
                text: '好了，我们说一下这个组件<img src="22"/><img src="22"/>'
            },
            {
                type: 1,
                text: '说毛线，有毛线好说啊，那么简单谁不会用啊！<img src="20"/><img src="20"/>'
            },
            {
                type: 2,
                text: 'okok...<img src="53"/><img src="53"/>'
            },
            {
                type: 2,
                text: '有问题可以去我们团队的Github提Issues。<img src="39"/><img src="39"/><img src="39"/>'
            },
            {
                type: 2,
                text: '链接：\n<u><color=#cc6600>https://github.com/gh-kL/cocoscreator-list</color></u>'
            },
            {
                type: 1,
                text: '团你妹夫！就一破组件<img src="20"/><img src="20"/>还团队呢我去'
            },
            {
                type: 2,
                text: '。。。'
            },
            {
                type: 2,
                text: '别戳穿我嘛<img src="27"/><img src="27"/>'
            },
            {
                type: 1,
                text: '我tm<img src="39"/><img src="39"/>'
            },
            {
                type: 2,
                text: '我希望这个组件大家用了之后会觉得<color=#cc6600>真香</color>，而不是<color=#cc6600>真臭</color><img src="37"/><img src="37"/><img src="37"/>'
            },
            {
                type: 1,
                text: '我跟你说就你这破组件吃枣药丸<img src="32"/><img src="32"/>'
            },
            {
                type: 2,
                text: '狗头保命<img src="58"/><img src="58"/><img src="58"/>'
            },
            {
                type: 1,
                text: '走你！<img src="55"/><img src="55"/><img src="55"/>'
            },
            {
                type: 2,
                text: '再见了您嘞~<img src="29"/><img src="29"/><img src="29"/>'
            },
        ];

        
        return data;
    },
})
