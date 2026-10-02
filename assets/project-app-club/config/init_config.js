// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 原生库项目配置
// ]]


let ConfigGameDefault = require("ConfigGameDefault");
let ConfigEnvDefault = require("ConfigEnvDefault");
require("ConfigGame");

let ConfigGame = {
    //新游戏开发时，大厅可增加测试游戏配置
    TEST_GAME_ITEM: [
    ],
}

let ConfigEnv = {

}

//遍历覆盖默认属性
for (const key in ConfigEnv) {
    ConfigEnvDefault[key] = ConfigEnv[key];
}
for (const key in ConfigGame) {
    if(key=="TEST_GAME_ITEM"){
        ConfigGameDefault[key] = ConfigGame[key].concat(ConfigGameDefault[key]);
    }
    else{
        ConfigGameDefault[key] = ConfigGame[key];
    }
}