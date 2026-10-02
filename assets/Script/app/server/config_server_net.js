// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 项目服务器配置
// ]]

let my = require("my");

let server_config = {
  brower: {
    //合集
    sets: {
      //开发（内测）环境
      DEV: [
        {
          NAME: "jh",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 40104,
        },
        {
          NAME: "rh",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 40600,
        },
        {
          NAME: "cj",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 40705,
        },
        {
          NAME: "xh",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 20031,
        },
        {
          NAME: "内测1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "内测2",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "压测1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
      ],
      //发布（封测）环境
      RELEASE: [
        {
          NAME: "外网1",
          HEAD: "ws",
          HOST: "120.79.78.20",
          PORT: 10210,
        },
        {
          NAME: "外网2",
          HEAD: "ws",
          HOST: "120.79.78.20",
          PORT: 10211,
        },
      ],
      //模拟客户封测服
      CLIENT: [
        {
          NAME: "客户1",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11011,
        },
        {
          NAME: "客户2",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11012,
        },
      ],
      //模拟客户公测服
      PUBLIC: [
        {
          NAME: "公测1",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11011,
        },
        {
          NAME: "公测2",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11012,
        },
      ],
    },
    //直播
    live: {
      //开发（内测）环境
      DEV: [
          {
            NAME: "lianzi-ip",
            HEAD: "ws",
            HOST: "15.165.39.0",
            PORT: 50043,
          },
          {
            NAME: "huigong-ip",
            HEAD: "ws",
            HOST: "95.41.20.95",
            PORT: 50043,
          },
          {
            NAME: "lianzi-域名",
            HEAD: "wss",
            HOST: "game-api.hashpoker.vip",
            PORT: 443,
          },
          {
            NAME: "huigong-域名",
            HEAD: "ws",
            HOST: "95.41.20.95",
            PORT: 50043,
          },
      ],
      //发布（封测）环境 120.77.215.13
      RELEASE: [
        {
          NAME: "外网1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "外网2",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
      ],
      //模拟客户封测服
      CLIENT: [
        {
          NAME: "客户1",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11011,
        },
        {
          NAME: "客户2",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11012,
        },
      ],
      //模拟客户公测服
      PUBLIC: [
        {
          NAME: "公测1",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11011,
        },
        {
          NAME: "公测2",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11012,
        },
      ],
    },
  },
  //原生平台
  native: {
    sets: {
      //开发（内测）环境
      DEV: [
        {
          NAME: "jh",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40103,
        },
        {
          NAME: "rh",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40601,
        },
        {
          NAME: "cj",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40704,
        },
        {
          NAME: "xh",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 20031,
        },
        {
          NAME: "内测1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "内测2",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
      ],
      //发布（封测）环境
      RELEASE: [
        {
          NAME: "外网1",
          HEAD: "ws",
          HOST: "120.79.78.20",
          PORT: 10212,
        },
        {
          NAME: "外网2",
          HEAD: "ws",
          HOST: "120.79.78.20",
          PORT: 10213,
        },
      ],
      //模拟客户封测服
      CLIENT: [
        {
          NAME: "客户1",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11011,
        },
        {
          NAME: "客户2",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11012,
        },
      ],
      //模拟客户公测服
      PUBLIC: [
        {
          NAME: "公测1",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11011,
        },
        {
          NAME: "公测2",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11012,
        },
      ],
    },
    live: {
      //开发（内测）环境
      DEV: [
        {
          NAME: "jh",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40103,
        },
        {
          NAME: "rh",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40601,
        },
        {
          NAME: "cj",
          HEAD: "",
          HOST: "154.204.32.108",
          PORT: 40704,
        },
        {
          NAME: "xh",
          HEAD: "ws",
          HOST: "154.204.32.108",
          PORT: 20031,
        },
        {
          NAME: "内测1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "内测2",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
      ],
      //发布（封测）环境
      RELEASE: [
        {
          NAME: "外网1",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
        {
          NAME: "外网2",
          HEAD: "ws",
          HOST: "192.168.31.90",
          PORT: 50043,
        },
      ],
      //模拟客户封测服
      CLIENT: [
        {
          NAME: "客户1",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11011,
        },
        {
          NAME: "客户2",
          HEAD: "ws",
          HOST: "192.168.0.194",
          PORT: 11012,
        },
      ],
      //模拟客户公测服
      PUBLIC: [
        {
          NAME: "公测1",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11011,
        },
        {
          NAME: "公测2",
          HEAD: "ws",
          HOST: "192.168.0.234",
          PORT: 11012,
        },
      ],
    },
  },
};
class ServerNet extends my.ServerBase {
  static _default = server_config;
  _configs = null;
  constructor() {
    super();

    let app = window.app;
    let configs = server_config;
    let fallbackConfigs = null;

    if (app.config.IS_SOCKET) {
      //原生/浏览器
      configs = (cc.sys.isNative ? configs["native"] : configs["brower"]) || {};
    } else {
      configs = configs["brower"];
    }

    //直播/合集
    configs = (app.config.ISLIVE ? configs["live"] : configs["sets"]) || {};

    if (app.url.get("client") == 1) {
      //模拟客户封测服
      configs = configs["CLIENT"];
    } else if (app.url.get("public") == 1) {
      //模拟客户公测服
      configs = configs["PUBLIC"];
    } else {
      if (app.config.ISDEVELOP) {
        //开发（内测）环境
        configs = configs["DEV"];
      } else {
        //发布（封测）环境
        configs = configs["RELEASE"];
      }
    }
    if (!configs || !(configs instanceof Array)) {
      fallbackConfigs = [
        {
          NAME: "官方默认",
          HEAD: "wss",
          HOST: "game-api.hashpoker.vip",
          PORT: 443,
        }
      ];
      cc.warn("ServerNet: 服务器配置无效，使用默认兜底配置");
    }
    this.setServerList(configs || fallbackConfigs);
  }
}

module.exports = ServerNet;
