
let ConfigServer = {
    // QYSOCKET: cc.sys.isNative,
    // CONFIG:{
    //     ["DEV"]: {
    //         NAME: "内测服",
    //         HEAD: "ws",
    //         HOST: "192.168.0.221",
    //         PORT: 50108,
    //     },
    //     ["DEV_QYSOCKET"]: {
    //         NAME: "内测服",
    //         HEAD: "",
    //         HOST: "192.168.0.221",
    //         PORT: 50100,
    //     },
    //     ["RELEASE"]: {
    //         NAME: "正式服",
    //         HEAD: "wss",
    //         HOST: "sportcarsocket.qygaming.com",
    //         PORT: 85,
    //     },
    // },
}

// if (ConfigServer.QYSOCKET) {
//     ConfigServer.SERVER = ConfigServer.CONFIG["DEV_QYSOCKET"];
// }else{
//     ConfigServer.SERVER = ConfigServer.CONFIG["DEV"];
// }


module.exports = ConfigServer;