// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UserInfo = require("UserInfo");
let TexasUtils = require("TexasUtils");
let TexasConfig = require("TexasConfig");
let UIFrame = require("UIFrame");

let CMD = require("protocol_club");

let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {
        clubMagic: cc.Node,//俱乐部魔法表情面板

        playerController: cc.Node,//玩家容器

        sysMagic: cc.Node,//系统魔法表情


        itemFacePrefab:{//魔法表情预制
            default: null,
            type: cc.Prefab
        },

        magicFaceSpinList: { //互动表情骨骼动画列表//对应TexasClubMagicPanel的magicSpriteFrame
            default: [],
            type: sp.SkeletonData
        },

        magicFaceShaYuSpin: { //互动鲨鱼
            default: [],
            type: sp.SkeletonData
        },

        magicFaceJiaTeLinSpin: { //互动加特林
            default: [],
            type: sp.SkeletonData
        },



        _targetUserId: 0,//目标玩家id
        _isSameUser: false,
        // 移动配置：像素/秒，最小/最大时间（秒），以及每个表情 id 的时间系数（可选）
        moveSpeed: 600,
        minMoveTime: 0.08,
        maxMoveTime: 0.4,
        moveTimeById: { // 若指定则按 id 覆盖默认按距离计算的时间（系数乘以距离/base）
            default: [],
            type: [cc.Float]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.moveSpeed = 1200;
        this.maxMoveTime = 1;
    },

    start () {

    },

    // update (dt) {},

    

    _initMagicFace(isInit) {
        if (isInit) {
            this._stopUpdate();

            let clubMagicPanel = this._getClubMagicPanel();
            if (clubMagicPanel) {
                clubMagicPanel.onClickBtnClose();
                this._canClick = true
            }
        }

        // let magicFaceChild = this.node.children;
        // if (magicFaceChild && magicFaceChild.length>0) {
        //     for (let i=0; i<magicFaceChild.length; i++) {
        //         let child = magicFaceChild[i];

        //         if (child.name.toString()=="texasFace" || child.name.toString()=="shayu1" || child.name.toString()=="shayu2") {
        //             if (isInit) {
        //                 child.destroy();
        //             }
        //         }else {
        //             child.active = false;
        //         }
                
        //     }
        // }

        this.node.active = true;
    },

    //刷新魔法表情面板
    _updateMagicFacePanel(nUserId,nSeat,newSeat) {
        if (nSeat==newSeat) return;

        let info = UserInfo.getInfo();

        let faceStr = "magicSelf_" + nSeat;
        if (nUserId!=info.nUserID) {
            faceStr = "magic_" + nSeat;
        }

        let isShow = false;

        let magicFaceChild = this.node.children;
        if (magicFaceChild && magicFaceChild.length>0) {
            for (let i=0; i<magicFaceChild.length; i++) {
                let child = magicFaceChild[i];

                if (child.name.toString()==faceStr) {
                    if (child.active) {
                        isShow = true;
                    }

                    break;
                }

            }
        }

        if (isShow) {
            this._showMagicFacePanel(nUserId,newSeat);
        }
    },

    //隐藏魔法表情面板
    _hideMagicFacePanel(nUserId,nSeat) {
        this._setMagicFacePanel(nUserId,nSeat,false);
    },

    //显示魔法表情面板
    _showMagicFacePanel(nUserId,nSeat,data) {
        // let info = UserInfo.getInfo();
        // if(nUserId == info.nUserID){

        //     return
        // }
        this._initMagicFace();
        this._setMagicFacePanel(nUserId,nSeat,true,data);
    },

    //设置魔法表情面板
    _setMagicFacePanel(nUserId,nSeat,isShow,data) {
        let info = UserInfo.getInfo();

        if (TexasUtils._getClub()) {
            let clubMagicPanel = this._getClubMagicPanel();
            if (clubMagicPanel) {
                if (isShow) {
                    data.nSeat = nSeat;
                    clubMagicPanel._setMagic(data);
                    clubMagicPanel.setMagicPanel(nUserId);
                    clubMagicPanel.node.active = isShow;
                }else{
                    this._canClick = true
                }
            }
        }else {
            let faceStr = "magicSelf_" + nSeat;
            if (nUserId!=info.nUserID) {
                faceStr = "magic_" + nSeat;
            }
    
            let magicItem = this.node.getChildByName(faceStr); 
            if (magicItem) {
                magicItem.active = isShow;
    
                let texasMagicPanel = magicItem.getComponent("texasMagicPanel");
                if (isShow && texasMagicPanel) {
                    texasMagicPanel.setMagicPanel(nUserId);
                }
            }
        }
    },


    //播放表情，表情值只处理发起者
    _playerMagicFace(data){
        if (data) {
            let nSpeaker = data.nSpeaker;//聊天发起者座位号
            let nChatId = data.nChatId;//表情id
            let nTarget = data.nTarget;//聊天对象(对谁聊天)
            let TexasPlayerController = this.playerController.getComponent("TexasPlayerController");
            let startTexasPlayer = TexasPlayerController._getTexasPlayerBySitId(nSpeaker);//发起者玩家脚本
            if (!startTexasPlayer) {
                // UIFrame.showTips("");

                return;
            }
            let clubMagic = this._getClubMagicPanel();
            let magicList = clubMagic.getSkeletonList()
            
            let targetNode = startTexasPlayer.headBox;
            let face = cc.instantiate(clubMagic.selfMagicItem);
            face.name = "texasFace";
            face.active = true;
            face.parent = startTexasPlayer.node;
            face.x = targetNode.x;
            face.y = targetNode.y - 10;
            face.getChildByName("sprite").active = false;
            let spNode = face.getChildByName("spin");
            spNode.active = true
            let spine = spNode.getComponent(sp.Skeleton)
            spine.premultipliedAlpha = false;
            spine.skeletonData = magicList[nChatId];
            if(magicList[nChatId].name ==  "face7"){
                 face.y = targetNode.y + 23;
            }
            face.active = true;            
            spine.setAnimation(0,"animation", false);
            spine.setCompleteListener(function(){
                face.destroy();
            })
        }
        
    },

    //飞魔法表情
    _flyMagicFace(data) {
        let self = this;
        if (data) {
            let nSpeaker = data.nSpeaker;//聊天发起者座位号
            let nChatId = data.nChatId - 1;//表情id
            let nTarget = data.nTarget;//聊天对象(对谁聊天)
            let TexasPlayerController = this.playerController.getComponent("TexasPlayerController");
            let startTexasPlayer = TexasPlayerController._getTexasPlayerBySitId(nSpeaker);//发起者玩家脚本
            let targetTexasPlayer = TexasPlayerController._getTexasPlayerBySitId(nTarget);//目标玩家玩家脚本
         
            let clubMagicPanel = this._getClubMagicPanel();
            let startNode = startTexasPlayer ? startTexasPlayer.headBox : this.sysMagic;
            if(!targetTexasPlayer || !targetTexasPlayer.headBox){
                return
            }
            let targetNode = targetTexasPlayer.headBox;
            let face = cc.instantiate(self.itemFacePrefab);
            face.name = "texasFace" + nChatId;
            face.parent = this.node;
            let targetPos = TexasUtils._getNodePos(targetNode, face);
            let startPos = TexasUtils._getNodePos(startNode, face);
            face.position = startPos;
            let spineComp = face.getChildByName("spin");
            let faceSprite = face.getChildByName("icon");
            faceSprite.getComponent(cc.Sprite).spriteFrame = clubMagicPanel.magicSpriteFrame[nChatId];
            spineComp.getComponent(sp.Skeleton).skeletonData = this.magicFaceSpinList[nChatId];
            spineComp.active = false;
            faceSprite.active = false;
            face.active = true;
            let isMove = true; // 是否是移动动画
            switch (nChatId) {
                case 7:
                    isMove = false;
                    let startSpine = new cc.Node("shayuStart");
                    startSpine.parent = this.node;
                    startSpine.scale = 0.6
                    startPos.y -= 45
                    startSpine.position = startPos;
                    let startSkeleton = startSpine.addComponent(sp.Skeleton);
                    startSkeleton.skeletonData = this.magicFaceShaYuSpin[0];
                    startSkeleton.premultipliedAlpha = false;
                    let moveSpine = new cc.Node("shayuMove");
                    moveSpine.parent = this.node;
                    moveSpine.scale = 0.6
                    moveSpine.rotation = this.getAngle(startPos,targetPos) 
                    moveSpine.position = startPos;
                    let moveSkeleton = moveSpine.addComponent(sp.Skeleton);
                    moveSkeleton.skeletonData = this.magicFaceShaYuSpin[1];
                    moveSkeleton.premultipliedAlpha = false;
                    moveSpine.active = false;
                    let endSpine = new cc.Node("shayuEnd");
                    endSpine.parent = this.node;
                    targetPos.y -= 30
                    endSpine.scale = 0.4
                    endSpine.position = targetPos;
                    let endSkeleton = endSpine.addComponent(sp.Skeleton);
                    endSkeleton.skeletonData = this.magicFaceShaYuSpin[2];
                    endSkeleton.premultipliedAlpha = false;
                    endSpine.active = false;
                    startSkeleton.setAnimation(0, "animation", false);
                    setTimeout(() => {
                        if(face){
                            this._playAudio("shayu1",false)
                        }
                    }, 0.5 * 1000);
                    startSkeleton.setCompleteListener(() => {
                        startSpine.active = false;
                        moveSpine.active = true;
                        moveSkeleton.setAnimation(0, "animation", true);
                        cc.tween(moveSpine)
                            .to(0.8, { position: targetPos }, { easing: "sineInOut" })
                            .call(() => {
                                moveSkeleton.clearTracks();
                                moveSpine.active = false;
                                endSpine.active = true;
                                setTimeout(() => {
                                    if(face){
                                        this._playAudio("shayu2",false)
                                    }
                                }, 0.5 * 1000);
                                
                                endSkeleton.setAnimation(0, "animation", false);
                                endSkeleton.setCompleteListener(() => {
                                    if (endSkeleton) {
                                        endSpine.destroy();
                                    }
                                });
                            })
                            .start();
                    });
                    break;
                // 🔫 加特林动画（双节点同时）已删除加特林动画
                case 6:
                    isMove = false;
                    let startGun = new cc.Node("jiaTeLinStart");
                    startGun.parent = this.node;
                    startPos.y -= 20
                    startGun.position = startPos;
                    startGun.scale = 0.7;
                    let startGunSkeleton = startGun.addComponent(sp.Skeleton);
                    startGunSkeleton.skeletonData = this.magicFaceJiaTeLinSpin[0];
                    startGunSkeleton.premultipliedAlpha = false;
                    let endGun = new cc.Node("jiaTeLinEnd");
                    endGun.parent = this.node;
                    targetPos.y -= 410
                    endGun.position = targetPos;
                    endGun.scale = 0.5;
                    let endGunSkeleton = endGun.addComponent(sp.Skeleton);
                    endGunSkeleton.skeletonData = this.magicFaceJiaTeLinSpin[1];
                    endGunSkeleton.premultipliedAlpha = false;
                    startGunSkeleton.setAnimation(0, "animation", false);
                    endGunSkeleton.setAnimation(0, "animation", false);

                    this._playAudio("jiatelin",false)
                    startGunSkeleton.setCompleteListener(()=>{
                    if (startGun) {
                        startGun.destroy()
                    }
                    });
                    endGunSkeleton.setCompleteListener(()=>{
                        if (endGun) {
                            endGun.destroy();
                        }
                    });
                    break;
           
                default:
                    break;
            }

            if (!isMove) {
                return;
            }

            
            // 重新排列顺序：1番茄 2飞吻 3干怀 4炸弹 5抓鸡 6鲜花 7加特林 8鲨鱼 9摸头 10点赞 11吸烟
            let audioList = ["tomato","kiss","cheers","bomb","catchChicken","flower","jiatelin","shayu","nice","dianzan","smoke"]//音效名字
            let faceScaleList = [0.7,0.6,0.8,2,0.6,0.4,0.6,0.7,0.6,0.9,0.5]//节点缩放大小[对应nChatId]
            let moveY = [0,-10,-10,-20,-35,-10,-20,-45,-10,-25,-56] //节点Y移动
            targetPos.y += moveY[nChatId]
            // if (nChatId == 0) {  // 番茄：从旧3 → 新0
            //     targetPos.x -= 30
            // }
            spineComp.scale = faceScaleList[nChatId]
            
            faceSprite.active = true;
            // 计算移动时间：基于像素距离与 moveSpeed，且允许按 id 覆盖
            let moveTime = this._getMoveTime(startPos, targetPos, nChatId);
            let delayTime = 0.001;
            if(nChatId == 0){  // 番茄：从旧3 → 新0，先报音效后播放动画
                delayTime = 0.2
            }else if(nChatId == 10){  // 吸烟：从旧4 → 新10
                delayTime = 0.1
            }
            cc.tween(face).delay(delayTime)
                .call(()=>{
                    if(nChatId == 0){  // 番茄
                        this._playAudio(audioList[nChatId],false)
                    }else if(nChatId == 10){  // 吸烟
                        this._playAudio(audioList[nChatId],false)
                    }
                })
                .to(moveTime, { position: targetPos }, { easing: "sineInOut" })
                .call(()=>{
                    let time = 0
                    switch (nChatId) {
                        case 4:  // 抓鸡，原来旧0
                            time = 0.6
                            break;
                        case 1:  // 飞吻，原来旧2
                            time = 1
                            break;
                        case 2:  // 干怀，原来旧6
                            time = 0.2
                            break;
                        case 3:  // 炸弹，原来旧8
                            time = 0.3
                            break;
                        default:
                            break;
                    }
                    setTimeout(() => {
                        if(face && nChatId != 0  && nChatId != 10 ){  // 排除番茄(新0)和吸烟(新10)
                            this._playAudio(audioList[nChatId],false)
                        }
                        
                    }, time * 1000);
                    
                })
                .call(() => {
                    // 到达目标
                    faceSprite.active = false;
                    spineComp.active = true;
                    let spine = spineComp.getComponent(sp.Skeleton);
                    if (spine && spine.skeletonData) {
                        spine.premultipliedAlpha = false;
                        spine.setAnimation(0, "animation", false);
                        spine.setCompleteListener(() => {
                            if(face){
                                face.active = false;
                                face.destroy();
                            }
                        });
                    } else {
                        // 兜底：无 spine 动画时延时销毁
                        cc.tween(face)
                            .delay(0.5)
                            .call(() => {
                                if(face){
                                    face.active = false;
                                    face.destroy();
                                }
                            })
                            .start();
                    }
                })
                .start();

        }else {
            UIFrame.showTips("用户不存在");
        }
        
    },

    // 计算从 startPos 到 targetPos 的移动时间（秒）
    _getMoveTime(startPos, targetPos, nChatId) {
        // 计算欧氏距离
        let dx = targetPos.x - startPos.x;
        let dy = targetPos.y - startPos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // 如果为特定 id 指定了时间系数，则使用系数（系数代表时间比例，单位秒/像素）
        if (this.moveTimeById && this.moveTimeById.length > nChatId && this.moveTimeById[nChatId]) {
            // 系数 * 距离
            let t = Math.abs(this.moveTimeById[nChatId]) * dist;
            return Math.max(this.minMoveTime, Math.min(this.maxMoveTime, t));
        }

        // 否则按 moveSpeed（像素/秒）计算时间
        let t = dist / (this.moveSpeed || 600);
        // 限制到 min/max 范围
        t = Math.max(this.minMoveTime, Math.min(this.maxMoveTime, t));
        return t;
    },

    getAngle(startPos, targetPos) {
        let dx = targetPos.x - startPos.x;
        let dy = targetPos.y - startPos.y;
        let radian = Math.atan2(dy, dx);
        let angle = radian * 180 / Math.PI;
        angle = 90 - angle ;
        return angle;
    },


    _playAudio(audioName,isEmjAudio){
        let audioPath = isEmjAudio ? TexasMusicPath.TEXAS_EMJ_AUDIO_PATH : TexasMusicPath.TEXAS_MAGIC_AUDIO_PATH
        TexasUtils._playEffect( audioPath + audioName);
    },

    //检测是否在2s内对同一玩家使用
    _checkIsSameUser(targetId) {
        // let isSameUser = false;

        // if (targetId) {
        //     if (this._targetUserId==targetId) {//与上一次执行魔法表情玩家一样
        //         if (this._isSameUser) {//魔法表情对同一玩家冷却时间未到
        //             isSameUser = true;
        //         }
        //     }
        // }

        // if (!isSameUser) {
        //     this._stopUpdate();
        // }

        // this._isSameUser = isSameUser;
        // this._targetUserId = targetId;
    },

    //更新同一玩家冷却时间
    _setActionSchedule(time) {
        // if (time<=0) {//对同一玩家的魔法表情冷却时间结束
        //     this._stopUpdate();

        //     this._isSameUser = false;
        // }else {
        //     this.times = time;

        //     this._isSameUser = true;

        //     this._startUpdate();
        // }
    },

    //开始更新
    _startUpdate(){
        // this._stopUpdate();

        // cc.director.getScheduler().schedule(this._updateTime, this,1, false);
    },

    //暂停更新
    _stopUpdate(){
        // if(cc.director.getScheduler().isScheduled(this._updateTime, this)){
        //     cc.director.getScheduler().unschedule(this._updateTime, this);
        // }
    },

    _updateTime () {
        // this.times -= 1;
        // this._setActionSchedule(this.times);
    },

    _getClubMagicPanel() {
        let clubMagicPanel = null;

        if (this.clubMagic) {
            clubMagicPanel = this.clubMagic.getComponent("TexasClubMagicPanel");
        }

        return clubMagicPanel;
    },

    //更多信息
    onClickBtnMoreInfo(event,data) {
        let seat = Number(data);

        let TexasPlayerController = this.playerController.getComponent("TexasPlayerController");

        let texasPlayer = TexasPlayerController._getTexasPlayer(seat);//玩家脚本

        if (texasPlayer) {
            texasPlayer._getUserInfo();
        }
    },

    //关闭所有表情面板
    onClickBtnClose() {
        this._initMagicFace(true);
    },




// //标记玩家请求
// message ClubSMarkUserReq {
//     required int32 nUserId = 1;    // 目标玩家ID
//     optional string nText = 2;     //标记文本
//     optional int32 nColorId = 3;   //颜色下标
// }

    clubSMarkUserReq(userId, text,colorId){
         let params = {
            nUserId: userId,
            nText: text,
            nColorId: colorId,
            
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSMarkUserReq_CMD, params);
    }

});
