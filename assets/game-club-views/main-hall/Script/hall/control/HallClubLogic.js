
let HallClubCacheData = require("HallClubCacheData");
let LocalStorage = require("LocalStorage");
let clubGameConfig = require("clubGameConfig");
let CryptoJS = require('aes');
let core = require('core');

let HallClubLogic = cc.Class({
    extends: Object,

    ctor() {
    },

	//是否是俱乐部管理员
    isClubManager(){
		let playerData = HallClubCacheData.getPlayerData();
		if (!playerData){
			return false;
		}

        if (playerData.nIdentify == 10){
            return true;
        }

        return false;
    },

    //是否可以管理俱乐部牌局
    isCanMangeGame(){
		let playerData = HallClubCacheData.getPlayerData();

        if (!playerData || !playerData.sPower){
            return false;
        }

        let data = JSON.parse(playerData.sPower)
        for (let i = 0; i < data.length; i++) {
            if (data[i].nPowerType == 3 && data[i].isOpen){
                return true;
            }
            
        }

        return false;
    },

    //是否可以管理俱乐部币
    isCanManageMoney(){
		let playerData = HallClubCacheData.getPlayerData();
        if (!playerData || !playerData.sPower){
            return false;
        }

        let data = JSON.parse(playerData.sPower)
        for (let i = 0; i < data.length; i++) {
            if (data[i].nPowerType == 2 && data[i].isOpen){
                return true;
            }
            
        }

        return false;
    },

    //是否可以管理俱乐部成员
    isCanManageMember(){
		let playerData = HallClubCacheData.getPlayerData();
        if (!playerData || !playerData.sPower){
            return false;
        }
        
        let data = JSON.parse(playerData.sPower)
        for (let i = 0; i < data.length; i++) {
            if (data[i].nPowerType == 1 && data[i].isOpen){
                return true;
            }
            
        }

        return false;
    },

	//是否俱乐部创建者（主席）
	isClubCreator(){
		let playerData = HallClubCacheData.getPlayerData();
		if (!playerData){
			return false;
		}

        if (playerData.nIdentify == 1){
            return true;
        }

        return false;
    },


	//获取未处理的申请数量
    // type: 1: 申请增加俱乐部币 2： 申请退还俱乐部币 3：申请加入俱乐部 null: 总数
    getUnTreatedApplyCount(type){
		let curClubData = HallClubCacheData.getCurClubData();
        let count = 0;
        if (curClubData){
            if (!type){
                count += curClubData.nApplyJionCnt || 0;
                count += curClubData.nApplyAddGoldCnt || 0;
                count += curClubData.nApplyCutGoldCnt || 0;
            }else if (type == 1){
                count += curClubData.nApplyAddGoldCnt || 0;
            }else if (type == 2){
                count += curClubData.nApplyCutGoldCnt || 0;
            }else if (type == 3){
                count += curClubData.nApplyJionCnt || 0;
            }
           
        }

        return count;
    },

	//获取一个可以登录的俱乐部登录
    getCanLoginClubId(clubId){
		let clubList = HallClubCacheData.getClubList();
        if (!clubList || clubList.length == 0){
            return null;
        }

        for (let i = 0; i < clubList.length; i++) {
            if (clubList[i].nClubId != clubId){
                return clubList[i].nClubId;
            }
            
        }

        return null;
    },

	//获取玩家俱乐部数量(不包括大厅)
	getClubCount(){
		let clubList = HallClubCacheData.getClubList();
		if (!clubList || clubList.length == 0){
			return 0;
		}

		let count= 0;
		for (let i = 0; i < clubList.length; i++) {
			if (clubList[i].nClubId != 0){
				count += 1;
			}
			
		}

		return count;
	},

	//是否显示俱乐部
	isShowClub(){
		let clubData = HallClubCacheData.getCurClubData();
		if (!clubData || !clubData.sClubConfig){
			return false;
		}

		let config = JSON.parse(clubData.sClubConfig);
		if (config && config.IsOpenClub){
			return true;
		}
		
		return false;
	},

	//是否人数满了不给进入
	isPlayerFullCanEnterGame(){
		let clubData = HallClubCacheData.getCurClubData();
		if (!clubData || !clubData.sClubConfig){
			return true;
		}

		let config = JSON.parse(clubData.sClubConfig);
		if (config && config.IsManchu){
			return false;
		}
		
		return true;
	},

	getOpenGameId(){
		let clubData = HallClubCacheData.getCurClubData();
		if (!clubData || !clubData.sClubConfig){
			return;
		}

		let config = JSON.parse(clubData.sClubConfig);
		if (config && config.arrOpenGameId){
			return config.arrOpenGameId;
		}

		return;
		
	},

    isBlindPlayer(){
        return HallClubCacheData.getIsBlindPlayer();
    },

    //获取参数
    getQueryString(key, url){
        var value = "";
        ///获取当前页面的URL
        var sURL = url;
        ///URL中是否包含查询字符串
        if (sURL.indexOf("?") > 0)
        {
            //分解URL,第二的元素为完整的查询字符串
            var arrayParams = sURL.split("?");
            //分解查询字符串
            var arrayURLParams = arrayParams[1].split("&");
            //遍历分解后的键值对
            for (var i = 0; i < arrayURLParams.length; i++){
                //分解一个键值对
                var sParam = arrayURLParams[i].split("=");
                if ((sParam[0] == key) && (sParam[1] != "")){
                    //找到匹配的的键,且值不为空
                    value = sParam[1];
                    break;
                }
            }
        }
        
        return value;
    },

    getReConfig(language){
        let config = HallClubCacheData.getReConfig();
        if(config){
            if (config[language]){
                return config[language];
            }
        }
        return;
    },

    openCustomerService(userName, id){
        let language = LocalStorage.getSysLanguage();
        let url = clubGameConfig.CLUB_CUSTOM_SERVIES;
        if (language == "zh"){
            url = url + "zh-cn";
        }else if (language == "vi"){
            url = url + "vi";
        }else if (language == "zh_tw"){
            url = url + "zh-tw";
        }else{
            url = url + "en";
        }

        if (userName && id){
            let str = CryptoJS.encryptByECBAndIv(core.enc.Utf8.parse("memberName=" + userName + "(ID:" + id + ")"), "FYzCqFCgnvSzsUru4kufwS1InFtARY8W", "FYzCqFCgnvSzsUru");
            url = url + "&o=" + escape(str);
        }
        
        QYLogs.warn(url);
        cc.sys.openURL(encodeURI(url));
    },

    getTransferWay(){
        return HallClubCacheData.getTransferWay();
    }

});

let object = new HallClubLogic();
module.exports = object;