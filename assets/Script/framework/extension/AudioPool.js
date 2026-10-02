// if(!CC_EDITOR){
//     cc.errorID(1400,  "require(\"AudioPool\")", "app.audio");
// }

let AudioManager = require("AudioManager");

let AudioPool = AudioManager.default;
module.exports = AudioPool;