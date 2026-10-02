// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let object = cc.Class({
    statics: {
        // PJTABLEINFO: [10,10,100,500,1000],

        TEXASMUSICPATH: {//游戏音效路径
            TEXAS_MUSIC_PATH: "texas/game/",//其他音效
            TEXAS_MAGIC_AUDIO_PATH: "texas/game/magicAudio/",//互动音效
            TEXAS_EMJ_AUDIO_PATH: "texas/game/emjAudio/",//表情音效
        },

        TEXASSPINE: {//德州游戏骨骼动画
            TEXAS_SPINE_DAIJI: "daiji",//待机
            TEXAS_SPINE_FEIWEN: "feiwen",//飞吻
            TEXAS_SPINE_LIAOTOUFA: "liaotoufa",//撩头发
            TEXAS_SPINE_QIAOZHUO: "qiaozhuo",//敲桌
        },
    },
});

module.exports = object;