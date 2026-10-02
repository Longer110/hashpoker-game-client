// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 公共全局工具类
// ]]

let i18n = require("i18n");
let LocalStorage = require("StorageManager").default;
let UrlUtil = require("UrlUtil").default;
let WrapperManager = require("WrapperManager").default;
let SDKPlatform = require("SDKPlatform");
let UIFrame = require("UIFrame");

let UtilManager = {
    //返回 [min, max] 之间的随机整数
    randomInt(max, min) {
        if (null == min) min = 0;

        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    //四舍五入
    mathRound(value) {
        // let result = Math.round(value);

        //保留3位小数
        let result = Math.round(value * 100) / 100;

        return result;
    },

    /**
     * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
     * @param  func 需要执行的函数
     * @param  wait 延迟执行时间（毫秒）
     * @param  immediate---true 表立即执行，false 表非立即执行
     **/
    debounce(func, wait = 200, immediate = false) {
        let timeout = 0;
        let context = null;
        return function () {
            let args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    //金币数值转换
    // convertNumberToStr2_bac(num) {

    //     let currentNum = Number(num);
    //     let preStr = "";
    //     let str = "";
    //     if (currentNum) {
    //         if (currentNum < 0) {
    //             preStr = "-";
    //             currentNum = Math.abs(currentNum);
    //         }

    //         if (currentNum >= 10000000000) {
    //             str = (currentNum / 100000000).toFixed(0) + "亿";
    //         } else if (currentNum >= 1000000000) {
    //             str = ((currentNum / 10000000) / 10).toFixed(1) + "亿";
    //         } else if (currentNum >= 100000000) {
    //             str = ((currentNum / 1000000) / 100).toFixed(1) + "亿";
    //         } else if (currentNum >= 1000000) {
    //             str = ((currentNum / 10000)).toFixed(0) + "万";
    //         } else if (currentNum >= 100000) {
    //             str = ((currentNum / 1000) / 10).toFixed(1) + "万";
    //         } else if (currentNum >= 10000) {
    //             str = ((currentNum / 100) / 100).toFixed(2) + "万";
    //         } else {
    //             str = currentNum.toFixed(0);
    //         }
    //         return preStr + str;
    //     }
    //     if (currentNum === 0) {
    //         str = currentNum.toString();
    //     }
    //     return preStr + str;
    // },

    //货币类型用“千万亿 KM”进行区分
    convertNumberToStr(num) {

        if (app.user && app.user.getInfo().nGoldConvertType == 0) {
            return this.convertNumberToStr5(num);
        }

        if (app.config.IS_SHOW_GOLD_CHANGE_MODE_2) {
            if (app.config.IS_CLUB_ONLY) {
                return this.convertNumberToStr4(num);
            }
            return this.convertNumberToStr3(num)
        }

        let currentNum = Number(num);
        let preStr = "";
        let str = "";
        let offsex = 0.000001

        if (currentNum) {
            if (currentNum < 0) {
                preStr = "-";
                currentNum = Math.abs(currentNum);
            }

            if (currentNum >= 10000000000) {
                str = Math.floor((currentNum / 100000000)) + i18n.t("COMMON.YI");
            }
            else if (currentNum >= 100000000) {
                let yi = i18n.t("COMMON.YI")
                if (yi.indexOf("0") != -1) {
                    str = parseFloat(Math.floor((currentNum / 100000000) * 10000) / 100) + yi.substring(2, yi.length);
                } else {
                    str = parseFloat(Math.floor((currentNum / 100000000) * 100) / 100) + i18n.t("COMMON.YI");
                }
            }
            else if (currentNum >= 10000000) {
                str = Math.floor((currentNum / 10000)) + i18n.t("COMMON.WAN");
            }
            else if (currentNum >= 1000000) {
                let wan = i18n.t("COMMON.WAN")
                if (wan.indexOf("0") != -1) {
                    str = parseFloat(Math.floor((currentNum / 10000) * 100) / 10) + wan.substring(1, wan.length);
                } else {
                    str = parseFloat(Math.floor((currentNum / 10000) * 10) / 10) + wan;
                }
            }
            else if (currentNum >= 10000) {
                if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                    cc.log("精度问题：" + num)
                }
                currentNum = currentNum + offsex
                str = Math.floor(currentNum);
            }
            else {
                if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                    cc.log("精度问题：" + num)
                }
                currentNum = currentNum + offsex
                currentNum = (Math.floor(currentNum * 10000) / 10000)

                str = (currentNum).toString();
                if (str.indexOf(".") != -1) {
                    str = parseFloat(str.substring(0, str.indexOf(".") + 3));
                    str = Number(str)
                }
            }

            if (str === "0" || str === 0) {
                preStr = ""
            }
            return preStr + str;
        }

        if (currentNum === 0) {
            str = currentNum.toString();
        }
        if (str === "0" || str === 0) {
            preStr = ""
        }

        return preStr + str;
    },


    //货币类型用“,”进行区分 isUseComma: true的时候使用逗号
    convertNumberToStr2(num, isUseComma) {

        if (app.user && app.user.getInfo().nGoldConvertType == 0) {
            return this.convertNumberToStr5(num);
        }

        if (app.config.IS_SHOW_GOLD_CHANGE_MODE_2 && !isUseComma) {
            if (app.config.IS_CLUB_ONLY) {
                return this.convertNumberToStr4(num);
            }
            return this.convertNumberToStr3(num)
        }

        let currentNum = Number(num);
        let preStr = "";
        let str = "";
        let offsex = 0.000001
        if (currentNum) {
            if (currentNum < 0) {
                preStr = "-";
                currentNum = Math.abs(currentNum);
            }
            if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                cc.log("精度问题：" + num)
            }
            currentNum = currentNum + offsex
            currentNum = (Math.floor(currentNum * 10000) / 10000)
            if (currentNum === 0) {
                preStr = ""
            }

            let floatStr = ""
            let currentStr = (currentNum).toString();
            str = currentStr
            if (str.indexOf(".") != -1) {
                str = str.substring(0, str.indexOf("."))
                if (app.config.IS_SHOW_FLOAT) {//金币转换保留2位小数( 如果第二位小数为0，那么只显示一位小数)
                    let two = currentStr.substring(currentStr.indexOf(".") + 2, currentStr.indexOf(".") + 3)
                    let one = currentStr.substring(currentStr.indexOf(".") + 1, currentStr.indexOf(".") + 2)
                    if (two === "0") {
                        if (one === "0") {
                            floatStr = ""
                        } else {
                            floatStr = currentStr.substring(currentStr.indexOf("."), currentStr.indexOf(".") + 2)
                        }
                    } else {
                        floatStr = currentStr.substring(currentStr.indexOf("."), currentStr.indexOf(".") + 3)
                    }
                }
            }


            if (str === "0" && floatStr === "") {
                preStr = ""
            }

            let strArr = str.split("")
            let count = 0
            str = ""
            for (let i = strArr.length - 1; i >= 0; i--) {
                count++
                if (count === 3 && i != 0) {
                    count = 0
                    str = "," + strArr[i] + str
                } else {
                    str = strArr[i] + str
                }
            }
            return preStr + str + floatStr;
        }

        if (currentNum === 0) {
            str = currentNum.toString();
        }

        return preStr + str;
    },

    //货币类型用“KMB”进行区分
    convertNumberToStr3(num) {
        let currentNum = Number(num);
        let preStr = "";
        let str = "";
        let offsex = 0.000001
        if (currentNum) {
            if (currentNum < 0) {
                preStr = "-";
                currentNum = Math.abs(currentNum);
            }
            if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                //console.log("精度问题："+num)
            }
            currentNum = currentNum + offsex
            currentNum = (Math.floor(currentNum * 10000) / 10000)
            if (currentNum === 0) {
                preStr = ""
            }
            let floatStr = ""
            let company = ""
            let currentStr = (currentNum).toString();
            str = currentStr
            let two = null
            let one = null
            if (str.indexOf(".") != -1) {
                str = str.substring(0, str.indexOf("."))
                two = currentStr.substring(currentStr.indexOf(".") + 2, currentStr.indexOf(".") + 3)
                one = currentStr.substring(currentStr.indexOf(".") + 1, currentStr.indexOf(".") + 2)
            }

            if (currentNum >= 1000) {
                let len = str.length
                let offsetCompany = 0
                if (currentNum >= 1000000000) {
                    offsetCompany = 9
                    company = "B"
                } else if (currentNum >= 1000000) {
                    offsetCompany = 6
                    company = "M"
                } else {
                    offsetCompany = 3
                    company = "K"
                }
                if (len < 0) {
                    len = 0
                }
                let offsetNum = len - offsetCompany
                let integerValue = str.substring(0, offsetNum)
                two = currentStr.substring(offsetNum + 1, offsetNum + 2)
                one = currentStr.substring(offsetNum, offsetNum + 1)
                str = integerValue
            }
            if (one == "0" || !one) {
                if (two == "0" || !two) {
                    floatStr = ""
                } else {
                    floatStr = "." + one + two
                }
            } else {
                if (two == "0" || !two) {
                    floatStr = "." + one + "0"
                } else {
                    floatStr = "." + one + two
                }
            }
            if (str === "0" && floatStr === "") {
                preStr = ""
            }
            return preStr + Number(str + floatStr) + company
        }

        if (currentNum === 0) {
            str = currentNum.toString();
        }
        return preStr + str;
    },

    //俱乐部类型
    convertNumberToStr4(num) {
        let currentNum = Number(num);
        let preStr = "";
        let str = "";
        let offsex = 0.000001
        if (currentNum) {
            if (currentNum < 0) {
                preStr = "-";
                currentNum = Math.abs(currentNum);
            }
            if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                //console.log("精度问题："+num)
            }
            currentNum = currentNum + offsex
            currentNum = (Math.floor(currentNum * 10000) / 10000)
            if (currentNum === 0) {
                preStr = ""
            }
            let floatStr = ""
            let company = ""
            let currentStr = (currentNum).toString();
            str = currentStr
            let two = null
            let one = null
            if (str.indexOf(".") != -1) {
                str = str.substring(0, str.indexOf("."))
                two = currentStr.substring(currentStr.indexOf(".") + 2, currentStr.indexOf(".") + 3)
                one = currentStr.substring(currentStr.indexOf(".") + 1, currentStr.indexOf(".") + 2)
            }

            if (currentNum >= 100000) {
                let len = str.length
                let offsetCompany = 0
                if (currentNum >= 100000000000) {
                    offsetCompany = 9
                    company = "B"
                } else if (currentNum >= 100000000) {
                    offsetCompany = 6
                    company = "M"
                } else {
                    offsetCompany = 3
                    company = "K"
                }
                if (len < 0) {
                    len = 0
                }
                let offsetNum = len - offsetCompany
                let integerValue = str.substring(0, offsetNum)
                two = currentStr.substring(offsetNum + 1, offsetNum + 2)
                one = currentStr.substring(offsetNum, offsetNum + 1)
                str = integerValue
            }
            if (one == "0" || !one) {
                if (two == "0" || !two) {
                    floatStr = ""
                } else {
                    floatStr = "." + one + two
                }
            } else {
                if (two == "0" || !two) {
                    floatStr = "." + one + "0"
                } else {
                    floatStr = "." + one + two
                }
            }
            if (str === "0" && floatStr === "") {
                preStr = ""
            }
            return preStr + Number(str + floatStr) + company
        }

        if (currentNum === 0) {
            str = currentNum.toString();
        }
        return preStr + str;
    },


    //原始数值，保留两位小数
    convertNumberToStr5(num) {
        let currentNum = Number(num);
        let preStr = "";
        let str = "";
        let offsex = 0.000001
        if (currentNum) {
            if (currentNum < 0) {
                preStr = "-";
                currentNum = Math.abs(currentNum);
            }
            if (Math.floor(currentNum) != Math.floor(currentNum + offsex)) {
                //console.log("精度问题："+num)
            }
            currentNum = currentNum + offsex
            currentNum = (Math.floor(currentNum * 10000) / 10000)
            if (currentNum === 0) {
                preStr = ""
            }
            let floatStr = ""
            let currentStr = (currentNum).toString();
            str = currentStr
            let two = null
            let one = null
            if (str.indexOf(".") != -1) {
                str = str.substring(0, str.indexOf("."))
                two = currentStr.substring(currentStr.indexOf(".") + 2, currentStr.indexOf(".") + 3)
                one = currentStr.substring(currentStr.indexOf(".") + 1, currentStr.indexOf(".") + 2)
            }

            if (one == "0" || !one) {
                if (two == "0" || !two) {
                    floatStr = ""
                } else {
                    floatStr = "." + one + two
                }
            } else {
                if (two == "0" || !two) {
                    floatStr = "." + one + "0"
                } else {
                    floatStr = "." + one + two
                }
            }
            if (str === "0" && floatStr === "") {
                preStr = ""
            }
            return preStr + Number(str + floatStr)
        }

        if (currentNum === 0) {
            str = currentNum.toString();
        }
        return preStr + str;
    },

    //筹码金币数值转换
    convertChipNumberToStr(num) {

        if (app.config.IS_SHOW_GOLD_CHANGE_MODE_2) {
            if (app.config.IS_CLUB_ONLY) {
                return this.convertNumberToStr4(num);
            }
            return this.convertNumberToStr3(num)
        }


        let currentNum = Number(num);
        let str = "";
        if (currentNum >= 1000000) {
            str = currentNum / 1000000 + "M";
        }
        else if (currentNum >= 1000) {
            str = currentNum / 1000 + "K";
        }
        else if (currentNum > 0 && currentNum < 1000) {
            str = currentNum.toString();
        }
        return str;
    },


    /**
     这个可以指定长度和基数。比如
        // 8 character ID (base=2)
        createUUID(8, 2) // "01001010"
        // 8 character ID (base=10)
        createUUID(8, 10) // "47473046"
        // 8 character ID (base=16)
        createUUID(8, 16) // "098F4D35"
     */
    createUUID(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        }
        else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    //获取当前时间是本年第几周(以周一为每周的第一天)
    getWeekOfYear() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1);
        var dayOfWeek = firstDay.getDay();
        var spendDay = 1;
        if (dayOfWeek != 0) {
            spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
        var result = Math.ceil(d / 7) + 1;
        var weekTime = today.getFullYear() + "" + result;
        return weekTime;
    },

    //计算2的N次方
    calc2sqrtN(value) {
        let count = 0;
        let num = value;

        while ((num % 2) >= 0) {

            num = num / 2;

            if (num === 0) {
                count++;
                return count;
            } else if (num < 1) {
                return count;
            }
            count++;
        }

        return count;

    },

    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    getDayMothYear(timestamp) {
        let date = null;
        if (Number(timestamp)) {
            date = new Date(Number(timestamp));
        }
        else {
            date = new Date();
        }
        let year = date.getFullYear().toString();
        let moth = date.getMonth() + 1;
        if (moth < 10) {
            moth = "0" + moth.toString();
        }
        else {
            moth = moth.toString();
        }
        let day = date.getDate();
        if (day < 10) {
            day = "0" + day.toString();
        }
        else {
            day = day.toString();
        }
        let today = year + moth + day; //年月日
        return today;
    },

    formatTime(input_time) {
        input_time = Number(input_time);
        if (!input_time) {
            return input_time;
        }

        if ((input_time + "").length == 10) {
            input_time = input_time * 1000;
        }
        var date = new Date(input_time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;

        let timestamp = y + '-' + m + '-' + d + '#' + h + ':' + minute + ':' + second;

        return timestamp;
    },

    //扩展formatTime的方法只返回时分秒
    formatTimeOnlyHMS(time) {
        // let input_time = time * 1000
        // input_time = Number(input_time);
        // if(!input_time){
        //     return input_time;
        // }

        // if((input_time+"").length == 10){
        //     input_time = input_time * 1000;
        // }
        // var date = new Date(input_time);
        // var h = date.getHours();
        // h = h < 10 ? ('0' + h) : h;
        // var minute = date.getMinutes();
        // var second = date.getSeconds();
        // minute = minute < 10 ? ('0' + minute) : minute;
        // second = second < 10 ? ('0' + second) : second;

        // let timestamp =  h + ':' + minute + ':' + second;
        // return timestamp;

        return this.formatTimeOnlyHMS3(time, isSecond)
    },

    //扩展formatTime的方法只返回时分秒，默认单位秒
    formatTimeOnlyHMS2(input_time, isSecond = true) {
        // input_time = Number(input_time);
        // if(!input_time){
        //     return input_time;
        // }
        // if(isSecond) {
        //     input_time = input_time * 1000;
        // }
        // var date = new Date(input_time);
        // var h = date.getHours();
        // h = h < 10 ? ('0' + h) : h;
        // var minute = date.getMinutes();
        // var second = date.getSeconds();
        // minute = minute < 10 ? ('0' + minute) : minute;
        // second = second < 10 ? ('0' + second) : second;

        // let timestamp =  h + ':' + minute + ':' + second;
        // return timestamp;
        return this.formatTimeOnlyHMS3(input_time, isSecond)
    },


    // 扩展 formatTimeOnlyHMS3 —— 按 60分60秒计算，不受时区影响
    formatTimeOnlyHMS3(input_time, isSecond = true) {
        input_time = Number(input_time);
        if (!input_time && input_time !== 0) {
            return input_time;
        }
        if (!isSecond) {
            input_time = input_time / 1000;
        }

        // 计算小时、分钟、秒
        let h = Math.floor(input_time / 3600);
        let m = Math.floor((input_time % 3600) / 60);
        let s = Math.floor(input_time % 60);

        // 格式化补零
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        return `${h}:${m}:${s}`;
    },


    timestampToTime(timestamp) {

        timestamp = Number(timestamp);
        if (!timestamp) {
            return timestamp;
        }

        if ((timestamp + "").length == 10) {
            timestamp = timestamp * 1000;
        }
        let date = new Date(timestamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    },

    timestampToTime2(timestamp) {
        timestamp = Number(timestamp);
        if (!timestamp) {
            return timestamp;
        }

        if ((timestamp + "").length == 10) {
            timestamp = timestamp * 1000;
        }
        let date = new Date(timestamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    },

    trim(text) {
        if (typeof text != "string") {
            if (typeof text == "number") {
                return text;
            }
            return "";
        }

        return text.replace(/(^\s*)|(\s*$)/g, "")
    },
    trimLeft(text) {
        if (typeof text != "string") {
            if (typeof text == "number") {
                return text;
            }
            return "";
        }

        return text.replace(/(^\s*)/g, "");
    },
    trimRight(text) {
        if (typeof text != "string") {
            if (typeof text == "number") {
                return text;
            }
            return "";
        }

        return text.replace(/(\s*$)/g, "");
    },

    clone(obj) {

        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Array || obj instanceof Object) {
            var copy = (obj instanceof Array) ? [] : {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        return obj

    },

    //用replaceValue全文替换original中的replaceKey
    replaceAll(original, replaceKey, replaceValue) {
        if (typeof original != "string") return "";

        let result = original.replace(new RegExp(replaceKey, 'g'), replaceValue);

        return result;
    },

    //超过 text 字符串 nMaxCount 长度, 用“...”替换尾部 
    getShortText(text, nMaxCount, dlength = ".") {
        var returnValue = '';
        var byteValLen = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(/[^\x00-\xff]/)) {
                byteValLen += 2; // 中文
            } else {
                byteValLen += 1; // 英文
            }
            if (byteValLen > nMaxCount) {
                returnValue += dlength;
                break;
            }
            returnValue += text[i];
        }
        return returnValue;
    },


    //关键文字的隐信息
    getTextMask(text, start = 3, end = 3) {
        if (text.length < 2) return text
        if (text.length <= start + 1) return text.slice(0, 1) + '***'
        if (text.length <= start + end) return text.slice(0, start) + '***' + text.slice(-1)
        return text.slice(0, start) + '***' + text.slice(-end)
    },

    //复制到剪贴板
    copyToClipBoard(str) {
        let flag = false;
        if (cc.sys.isNative) {
            //原生自己实现
            SDKPlatform.copyToClipboard(str)

            return flag;
        }
        else if (cc.sys.isBrowser || cc.sys.platform === cc.sys.WECHAT_GAME && typeof window["wx"] === "object") {
            var textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                flag = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (flag) {
                    //console.debug("复制到剪贴板成功:" + str);
                    UIFrame.showTips("复制成功")
                }
                else {
                    cc.log("复制到剪贴板失败");
                }

            } catch (err) {
                flag = false;
                cc.log("复制到剪贴板失败");
            }
            return flag;
        }
    },
    //获取机器型号
    getMachineModels() {
        if (cc.sys.isNative) {
            return SDKPlatform.getDeviceModel();
        } else {

        }
        return "";
    },
    //获取操作系统
    getSystemVersion() {
        if (cc.sys.isNative) {
            return SDKPlatform.getSystemVersion();

        } else {
            return cc.sys.browserType;
        }
    },
    

    //获取机器码id
    getDevicesId() {
        let key = "user_devicesid";
        let devicesId = LocalStorage.getItem(key, "");
        if (devicesId && devicesId != "") {
            cc.log("user_devicesid=", devicesId)
            return devicesId;
        }

        if (cc.sys.isNative) {
            devicesId = SDKPlatform.getDevicesId();
        }
        if (!devicesId || devicesId == "") {

            devicesId = Date.now() + "" + UtilManager.createUUID(10, 16);
        }

        LocalStorage.setItem(key, devicesId);
        return devicesId;
    },

    getNodes(root) {

        function getNode(parent) {
            if (parent && parent.childrenCount <= 0) {
                return
            }
            let children = parent.children;
            for (let i = 0; i < children.length; ++i) {
                let node = children[i]
                let attrs = {};
                attrs[node.name] = node
                root.attr(attrs);
                getNode(node)
            }
        }
        getNode(root)
    },
    //将传入的 skin_in 转换为游戏内部的 skin 标志 
    converSkin(skin_in, skin_map) {
        let skin_out = skin_map[skin_in];
        if (!skin_out) {
            skin_out = skin_in;
        }
        return skin_out;
    },
    // //检查皮肤有效性
    // checkSkinValue(skin_in, skins){
    //     if(!skins){
    //         cc.error("TODO", "Utils.checkSkinValue");
    //     }
    //     return this.checkValid(skin_in, skins);
    // },
    checkValid(key, values) {
        values = values || [];
        let valid = false;
        if (typeof key == 'string') {
            for (let index = 0; index < values.length; index++) {
                let value = values[index];
                if (key == value) {
                    valid = true;
                    break;
                }
            }
        }
        return valid;
    },

    //根据子游戏有效皮肤和多语言更新全局配置
    updateSkinAndLangBySubgameID(gameid) {
        app.config.SKIN = this.getSubgameValidSkin(gameid, app.config.SKIN);
        app.config.LANG = this.getSubgameValidLang(gameid, app.config.LANG);
    },
    //获取子游戏有效皮肤
    getSubgameValidSkin(gameid, skin) {
        let valid = this.checkSubgameValidSkin(gameid, skin);
        let value = skin;
        if (!valid) {
            value = this.getSubgameSkinDefault(gameid);
            cc.warn(`[${gameid}]子游戏不支持皮肤 ${skin} , 默认值 ${value}`)
        }
        return value;
    },
    //获取子游戏有效语言
    getSubgameValidLang(gameid, lang) {
        let valid = this.checkSubgameValidLang(gameid, lang);
        let value = lang;
        if (!valid) {
            value = this.getSubgameLangDefault(gameid);
            cc.warn(`[${gameid}]子游戏不支持语言 ${lang} , 默认值 ${value}`)
        }
        return value;
    },

    /**
     * 判断当前子游戏是否支持该语言包
     */
    checkSubgameValidLang(gameid, lang) {
        let valid = true;
        let all = this.getSubgameLangAll(gameid) || [];
        let index = all.findIndex(item => item == lang);
        if (index < 0) {
            valid = false;
        }
        return valid;
    },
    /**
     * 判断当前子游戏是否支持该皮肤
     */
    checkSubgameValidSkin(gameid, skin) {
        let valid = true;
        let all = this.getSubgameSkinAll(gameid) || [];
        let index = all.findIndex(item => item == skin);
        if (index < 0) {
            valid = false;
        }
        return valid;
    },

    //获取子游戏默认使用的语言（当子游戏不支持全局的多语言时，使用此指定的语言）
    getSubgameLangDefault(gameid) {
        let configs = app.config.SUBGAME_CONFIG || {};
        let config = configs[gameid] || {};
        let object = config.LANG || {};
        let value = object.DEFAULT;
        if (typeof value == 'function') {
            value = value();
        }
        value = value || app.config.LANG_DEFAULT;
        return value;
    },
    //获取子游戏支持的所有多语言
    getSubgameLangAll(gameid) {
        let configs = app.config.SUBGAME_CONFIG || {};
        let config = configs[gameid] || {};
        let object = config.LANG || {};
        let value = object.ALL;
        if (typeof value == 'function') {
            value = value(app.config.SKIN);
        }
        value = value || app.config.LANGALL;
        if (typeof value == 'string') {
            value = [value];
        }
        return value;
    },
    //获取子游戏默认使用的皮肤（当子游戏不支持全局的皮肤时，使用此指定的皮肤）
    getSubgameSkinDefault(gameid) {
        let configs = app.config.SUBGAME_CONFIG || {};
        let config = configs[gameid] || {};
        let object = config.SKIN || {};
        let value = object.DEFAULT;
        if (typeof value == 'function') {
            value = value();
        }
        value = value || app.config.SKIN_DEFAULT;
        return value;
    },
    //获取子游戏支持的所有皮肤
    getSubgameSkinAll(gameid) {
        let configs = app.config.SUBGAME_CONFIG || {};
        let config = configs[gameid] || {};
        let object = config.SKIN || {};
        let value = object.ALL;
        if (typeof value == 'function') {
            value = value();
        }
        value = value || app.config.SKINALL;
        if (typeof value == 'string') {
            value = [value];
        }
        return value;
    },

    getSkinValue() {
        cc.errorID(1400, `Utils.` + `getSkinValue()`, "app.config.SKIN");
        return app.config.SKIN;

        // let ConfigGame = require("ConfigGame");
        // let skins = ConfigGame.SKINALL || [];
        // let value = UtilManager.getQueryString("skin");
        // value = UtilManager.converSkin(value);
        // let target_skin = "";
        // if(typeof value == 'string'){
        //     if(UtilManager.checkSkinValue(value)){
        //         target_skin = value;
        //     }
        // }
        // if(!target_skin){
        //     target_skin = ConfigGame.SKIN;
        // }
        // return target_skin;
    },

    //获取皮肤资源路径，如果对应皮肤下的资源不存在，则使用默认资源
    getSkinPath(path, bundleName) {
        cc.errorID(1400, `Utils.` + `getSkinPath()`, "app.wrapper.get(bundle_name).path(url)");
        return path;

        // let resources = "resources/"
        // let prefix = "skin_default/";
        // let value = UtilManager.getSkinValue();
        // let skin = "skin_" + value + "/";
        // if(!bundleName){
        //     bundleName = "main-common"
        // }
        // let bundle = cc.assetManager.getBundle(bundleName);
        // if(!bundle){
        //     cc.error("UtilManager", "未找到对应bundle. name="+bundleName);
        //     return path;
        // }
        // //TODO
        // // cc.warn("TODO", "Utils.getSkinPath");
        // let target = resources+skin+path;
        // if(bundle.getInfoWithPath(target)){
        //     path = target;
        // }
        // else{
        //     path = resources + prefix + path;
        // }

        // return path;
    },

    // 获取玩家头像
    changeUserHead(headSprite, headURL, wrapper, callBack) {
        let self = this;
        // 测试用SVG
        // headURL = "http://192.168.31.173:8060/testt.svg" 
        // headURL = "https://res.hashpoker.vip/icon/rSyIyocmeKH40F3fc2OC5-EWVWntyXu2pX8KOmDcmybk3vbBs7zNR9Yr_gUMvXFg.svg";

        if (!wrapper) {
            wrapper = app.config.IS_LIVE_ONLY ? app.LiveAssets : app.SetAssets;
            if (app.config.IS_CLUB_ONLY) {
                wrapper = app.ClubAssets;
            }
        }

        let url = "game/head/1";
        let target = headSprite;

        // 本地头像逻辑
        if (!headURL.startsWith("http")) {
            let lastPart = Number(headURL.split("/").pop());
            if (isNaN(lastPart) || lastPart < 0 || lastPart > app.UIAtlasClub.atlasUserHead.getSpriteFrames().length) {
                headURL = "1";
            }

            if (headURL !== "1") {
                url = wrapper.path(headURL, null, "main-common/resources/");
            }

            let spriteFrame = wrapper.getUserHead(url, target);
            if (self._checkIsCircle(target)) {
                self.setSpriteShader(target, spriteFrame);
            }

            target.tmpId = null;
            if (callBack) callBack();
            return;
        }

        // 网络头像逻辑
        url = headURL;

        if (target && target.tmpId !== url) {
            target.node.active = false;
        } else if (target.tmpId && target.spriteFrame != null) {
            return;
        }
        target.tmpId = url;

        // 圆形材质加载
        // if (!self._checkIsCircle(target)) {
        //      let wrapper = app.ClubViews;
        //     let path = "circle_avatar";
        //     path = wrapper.path(path,null,"main-hall/resources/headShare/");

        //     app.ClubViews.bundle.load(
        //         path,
        //         cc.Material,
        //         (err, material) => {
        //             if (!err && cc.isValid(target)) {
        //                 target.setMaterial(0, material);
        //                 cc.log("UtilManager", "已替换为圆形头像材质 circle_avatar.mtl");
        //             } else if (err) {
        //                 cc.log("UtilManager", "加载 circle_avatar.mtl 失败：", err);
        //             }
        //         }
        //     );
        // }

        const isSvg = url.toLowerCase().endsWith(".svg");

        if (isSvg) {
            // SVG 网络头像加载
            fetch(url)
                .then(res => res.text())
                .then(svgText => {
                    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
                    const objectUrl = URL.createObjectURL(svgBlob);
                    const img = new Image();

                    img.onload = () => {
                        if (!cc.isValid(target) || target.tmpId !== url) {
                            URL.revokeObjectURL(objectUrl);
                            return;
                        }

                        const texture = new cc.Texture2D();
                        texture.initWithElement(img);
                        texture.handleLoadedTexture();

                        const spriteFrame = new cc.SpriteFrame(texture);
                        target.spriteFrame = spriteFrame;

                        if (self._checkIsCircle(target)) {
                            // texture.packable = false;
                            // self.setSpriteShader(target, spriteFrame);
                        }

                        target.node.active = true;
                        URL.revokeObjectURL(objectUrl);
                        if (callBack) callBack();
                    };

                    img.onerror = (err) => {
                        cc.error("UtilManager", "加载 SVG 失败: " + url, err);
                        URL.revokeObjectURL(objectUrl);
                        if (callBack) callBack(err);
                    };

                    img.src = objectUrl;
                })
                .catch(err => {
                    cc.error("UtilManager", "fetch SVG 失败: " + url, err);
                    if (callBack) callBack(err);
                });
        } else {
            // 普通 PNG / JPG 网络头像
            cc.loader.load({ url: url }, function (error, texture) {
                if (error) {
                    cc.error("UtilManager", "加载头像出错: url=" + url, error);
                    if (callBack) callBack(error);
                    return;
                }

                if (cc.isValid(target) && target.tmpId === url) {
                    const spriteFrame = new cc.SpriteFrame(texture);
                    target.spriteFrame = spriteFrame;

                    if (self._checkIsCircle(target)) {
                        // texture.packable = false;
                        // self.setSpriteShader(target, spriteFrame);
                    }

                    target.node.active = true;
                    if (callBack) callBack();
                }
            });
        }
    },


    //检测是否圆形头像
    _checkIsCircle(target) {
        if (!target.getMaterial(0) || !target.getMaterial(0).name) return false;
        //不要打印 material 对象
        // cc.log("_checkIsCircle target.getMaterial(0),target.getMaterial(0).name:",target.getMaterial(0),target.getMaterial(0).name);

        let name = target.getMaterial(0).name;

        let isCircle = true;
        if (name.indexOf("circle_avatar") < 0) {
            isCircle = false;
        }

        return isCircle;
    },

    setSpriteShader(target, spriteFrame) {
        if (cc.isValid(target)) {
            let frame = spriteFrame;
            let uv = frame.uv;
            let l = 0, r = 0, b = 1, t = 1;
            if (uv.length > 0) {
                l = uv[0];
                t = uv[5];
                r = uv[6];
                b = uv[3];
            }
            let u_uvOffset = new cc.Vec4(l, t, r, b);
            let u_uvRotated = frame.isRotated() ? 1.0 : 0.0;
            target.getMaterial(0).setProperty("u_uvOffset", u_uvOffset);
            target.getMaterial(0).setProperty("u_uvRotated", u_uvRotated);
        }
    },

    //直播头像
    changeUserHeadLive(headSprite, headURL) {
        return this.changeUserHead(headSprite, headURL, app.LiveAssets);
    },

    //合集头像
    changeUserHeadSet(headSprite, headURL) {
        return this.changeUserHead(headSprite, headURL, app.SetAssets);
    },


    //检测空格
    checkSpace(str) {
        cc.log("checkSpace str:", str);

        if (!str) return;

        let newStr = "";

        if (typeof str == 'string') {//字符串类型检测
            for (let i = 0; i < str.length; i++) {
                let strItem = str[i];

                if (strItem == " ") {//空格
                    strItem = "*";
                }

                newStr = newStr + strItem;

            }
        }

        return newStr;
    },

    //检测emoji表情
    checkEmojiCharacter(substring) {
        cc.log("checkEmoji substring:", substring);

        if (!substring) return;

        let str = substring.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.]/g, "*");
        return str;
    },

    //检测字节数
    checkUtf8Strlen(str) {
        if (!str || typeof str != 'string') return;

        var cnt = 0;
        for (let i = 0; i < str.length; i++) {
            var value = str.charCodeAt(i);
            if (value < 0x080) {
                cnt += 1;
            }
            else if (value < 0x0800) {
                cnt += 2;
            }
            else {
                cnt += 3;
            }
        }
        return cnt;
    },



    //判断字符串是否包含空格
    hasBlankCharacter(str) {
        if (!str || typeof str != 'string') return;

        return str.indexOf(" ") != -1;
    },

    //判断字符串是否包含emoji表情
    hasEmojiCharacter(str) {
        for (let i = 0; i < str.length; i++) {
            let hs = str.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (str.length > 1) {
                    let ls = str.charCodeAt(i + 1);
                    let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (str.length > 1) {
                let ls = str.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                    return true;
                }
            }
        }
    },

    //判断账号是否包含数字、英文大小写字母以外的字符
    judgeAccountCharacters(str) {
        var r = /^[a-zA-Z0-9]+$/g;
        return !(r.test(str));
    },

    //判断字符串是否是纯数字（）
    isNumber(val) {
        var regPos = /^-[0-9]*[1-9][0-9]*$/; //负整数
        var regNeg = /^[0-9]*[1-9][0-9]*$/; //正整数
        if (regPos.test(val) || regNeg.test(val)) {
            return true
        } else {
            return false
        }
    },


    //判断密码是否包含数字、英文大小写字母、特殊字符以外的字符
    judgePasswordCharacters(str) {
        var r = /^[a-zA-Z0-9~!@#$%^&*()_+`\-={}:";'<>?,.\/\[\]\|\\]+$/g;
        return !(r.test(str));
    },

    urlAppendTimestamp(url) {
        if (!url || typeof url !== 'string') return url;

        if (url.indexOf('?_v=') >= 0 || url.indexOf('&_v=') >= 0
            || url.indexOf('?v=') >= 0 || url.indexOf('&v=') >= 0) {
            return url;
        }

        var lowerUrl = url.toLowerCase();
        if (lowerUrl.endsWith('.js') || lowerUrl.endsWith('.css')
            || lowerUrl.endsWith('.png') || lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')
            || lowerUrl.endsWith('.json') || lowerUrl.endsWith('.webp') || lowerUrl.endsWith('.gif')
            || lowerUrl.endsWith('.mp3') || lowerUrl.endsWith('.wav') || lowerUrl.endsWith('.fnt')
            || lowerUrl.endsWith('.plist') || lowerUrl.endsWith('.zbin')) {
            return url;
        }

        if (url.indexOf("?") >= 0) {
            url += '&_t=' + (new Date() - 0);
        } else {
            url += '?_t=' + (new Date() - 0);
        }

        return url;
    },


    //处理EditBox 浏览器显示数字小数点是最后一位不合规的情况
    _fixNumericEditBox(editBox) {
        let impl = editBox._impl;
        if (!impl || !impl._elem) return;
        const elem = impl._elem;
        elem.setAttribute('inputmode', 'decimal');
        elem.addEventListener('input', (e) => {
            let val = e.target.value;
            // 只保留数字与一个小数点
            if (!/^\d*\.?\d*$/.test(val)) {
                val = val.replace(/[^0-9.]/g, '');
                const firstDot = val.indexOf('.');
                if (firstDot !== -1) {
                    val = val.substring(0, firstDot + 1) + val.substring(firstDot + 1).replace(/\./g, '');
                }

                e.target.value = val;
            }
            if (editBox.string !== val) {
                editBox.string = val;
            }
        });
    },

    //处理EditBox 浏览器显示数字，不带小数点
    _fixNumericEditBox2(editBox) {
        let impl = editBox._impl;
        if (!impl || !impl._elem) return;
        const elem = impl._elem;
        elem.setAttribute('inputmode', 'decimal');
        elem.addEventListener('input', (e) => {
            let val = e.target.value;
            // 只保留数字与一个小数点
            if (!/^\d*?\d*$/.test(val)) {
                val = val.replace(/[^0-9]/g, '');
                e.target.value = val;
            }
            if (editBox.string !== val) {
                editBox.string = val;
            }
        });
    },

    // //加载远程客户端版本，与本地版本作对比
    // loadVersion(callback) {
    //     let pathname = window.location.pathname;
    //     if(pathname.length>1){
    //         let index = pathname.lastIndexOf('/');
    //         if(index>=0){
    //             pathname = pathname.substring(0, index+1);
    //         }
    //     }
    //     var url = window.location.origin + pathname + "public/version.json";

    //     UtilManager.loadRemoteData('GET', url, callback);
    // },

    //加载网关列表
    loadGatewayList(url, callback) {
        cc.warn("TODO", "Utils.loadGatewayList");
        // let LocalStorage = require("LocalStorage");
        // let count = 0;
        // let cb = function (error, responseText) {
        //     count++;
        //     if(error){
        //         QYLogs.error("App", "获取网关列表失败.count="+count, error);
        //         if(count<3){//试三次
        //             UtilManager.loadRemoteData('POST', url, cb);
        //         }
        //         else{
        //             callback(error, responseText);
        //         }
        //         return;
        //     }
        //     else{
        //         let list = JSON.parse(responseText.toUpperCase());
        //         let gateway = {
        //             timestamp: Date.now(),
        //             list: list,
        //         }
        //         LocalStorage.setGatewayList(gateway);
        //         callback(error, gateway);
        //         return;
        //     }
        // }
        // UtilManager.loadRemoteData('POST', url, cb);
    },

    //加载远程web数据
    loadRemoteData(method, url, callback) {
        url = UtilManager.urlAppendTimestamp(url);

        var xhr = cc.loader.getXMLHttpRequest(),
            errInfo = 'Load ' + url + ' failed!',
            navigator = window.navigator;
        xhr.open(method, url, true);
        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            // IE-specific logic here
            xhr.setRequestHeader('Accept-Charset', 'utf-8');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        callback(null, xhr.responseText);
                    }
                    else {
                        callback({ status: xhr.status, errorMessage: errInfo });
                    }
                }
            };
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        callback(null, xhr.responseText);
                    }
                    else {
                        callback({ status: xhr.status, errorMessage: errInfo });
                    }
                }
            };
            xhr.onerror = function () {
                callback({ status: xhr.status, errorMessage: errInfo });
            };
        }
        xhr.send(null);
    },

    loadZipData(subgame, callback) {
        if (!cc.sys.isBrowser || !CC_BUILD) return;

        if (window.loadZipData) {
            if (cc.loader.downloader._subpackages && cc.loader.downloader._subpackages[subgame]) {
                var skin = UtilManager.getSkinValue();
                var file_asset = "raw-assets-" + subgame + '-skin_' + skin + '.png';
                window.loadZipData(file_asset, callback);
            }
        }
    },

    loadSubpackage(subgame, callback) {
        if (!cc.sys.isBrowser || !CC_BUILD) return;

        if (cc.loader.downloader._subpackages && cc.loader.downloader._subpackages[subgame]) {
            let pac = cc.loader.downloader._subpackages[subgame];

            if (pac.loaded) {
                callback(null);
            }
            else {
                if (window.loadZipScript) {
                    var file_asset = "sub-" + subgame;
                    window.loadZipScript(file_asset, function (success) {
                        if (success) {
                            pac.loaded = true;
                            callback(null);
                        }
                        else {
                            cc.game.config['noCache'] = true;
                            cc.loader.downloader.loadSubpackage(subgame, function (error) {
                                callback(error);
                            });
                            cc.game.config['noCache'] = false;
                        }
                    }, 'index.js', true);
                }
            }
        }
    },

    //获取URL上的参数
    getQueryString(name) {
        cc.errorID(1400, `Utils.` + `getQueryString()`, "app.url.get(xxx)");
        return UrlUtil.get(name);

        // if(!cc.sys.isBrowser || !name) return null;

        // name = name.toLowerCase();
        // var search = window.location.search.toLowerCase();
        // search = search.replace(new RegExp("%23", 'g'), "#");
        // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        // var r = search.substr(1).match(reg); 
        // if (r != null) return unescape(r[2]); return null;
    },

    //将传入的 lang_in 转换为游戏内部的 lang 标志 
    converLanguage(lang_in, lang_all) {
        var lang_out = lang_in;
        if (!lang_in) {
            return lang_out;
        }

        var lang_backup = lang_in;
        lang_in = lang_in.toLowerCase();
        lang_in = lang_in.replace(new RegExp("-", 'g'), "_");
        if (lang_in == 'zh_hk') {//香港繁体使用台湾繁体代替
            lang_in = 'zh_tw';
        }
        if (lang_in == 'vi_vn' || lang_in == 'vn') {//越南语
            lang_in = 'vi';
        }
        var find = false;
        for (var i in lang_all) {
            if (lang_all[i] == lang_in) {
                lang_out = lang_in;
                find = true;
                break;
            }
        }
        if (!find) {
            var lang_array = lang_in.split("_");
            if (lang_array.length >= 2) {
                lang_in = lang_array[0];
                for (var i in lang_all) {
                    if (lang_all[i] == lang_in) {
                        lang_out = lang_in;
                        find = true;
                        break;
                    }
                }
            }
        }
        if (!find) {
            //console.warn("invalid language: " + lang_backup);
        }
        return lang_out;
    },

    //获取userAgent，用于埋点数据统计
    getUserAgent() {
        if (cc.sys.isBrowser) {
            return window.navigator.userAgent;
        }

        return "";
    },

    getDeviceByUserAgent() {
        const ua = navigator.userAgent;
        let deviceName = "PC/Mac Web"

        const isAndroid = /Android/i.test(ua);
        const isAndroidPhone = isAndroid && /Mobile/i.test(ua);
        const isAndroidTablet = isAndroid && !/Mobile/i.test(ua);

        const isiPhone = /iPhone/i.test(ua);
        const isiPad =
            /iPad/i.test(ua) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);


        if (isAndroid) {
            deviceName = "Android"
            if (isAndroidPhone) {
                deviceName = 'Android Phone';
            } else if (isAndroidTablet) {
                deviceName = 'Android Pad';
            }
        }

        if (isiPhone) {
            deviceName = 'iPhone';
        }

        if (isiPad) {
            deviceName = 'iPad';
        }

        return deviceName;

    },



    getBundleNameByGamePath(sGamePath, isLive) {
        if (!sGamePath) {
            return "";
        }

        let bundleName = sGamePath;
        let prefix_live = "live-";
        let prefix_sets = "set-";
        if (app.config.IS_LIVE_ONLY) {
            if (app.config.IS_NATIVE_LIB) {
                if (isLive) {
                    if (sGamePath.indexOf(prefix_live) < 0) {
                        bundleName = prefix_live + sGamePath;
                    }
                }
                else {
                    if (sGamePath.indexOf(prefix_sets) < 0) {
                        bundleName = prefix_sets + sGamePath;
                    }
                }
            }
            else {
                if (isLive === false) {
                    if (sGamePath.indexOf(prefix_sets) < 0) {
                        bundleName = prefix_sets + sGamePath;
                    }
                }
                else {
                    if (sGamePath.indexOf(prefix_live) < 0) {
                        bundleName = prefix_live + sGamePath;
                    }
                }
            }
        }
        else {
            if (sGamePath.indexOf(prefix_sets) < 0) {
                bundleName = prefix_sets + sGamePath;
            }
        }

        return bundleName;
    },

    getSceneNameByGamePath(sGamePath) {
        if (!sGamePath) {
            return "";
        }

        let sceneName = sGamePath;
        let prefix_live = "live-";
        let prefix_sets = "set-";
        if (sGamePath.indexOf(prefix_live) >= 0) {
            sceneName = sGamePath.substr(prefix_live.length);
        }
        else if (sGamePath.indexOf(prefix_sets) >= 0) {
            sceneName = sGamePath.substr(prefix_sets.length);
        }

        return sceneName;
    },

    loadByVersion(version, pathURL) {
        return
        var url = pathURL || (window.location.origin + window.location.pathname);
        var _noCacheRex = /\?/;
        var prefix = '&';
        var key = '_vt_';
        // var url_version = app.url.get("v");
        // if(url_version){
        key = 'v';
        // }

        var value = '' + version;
        var name = key;

        // var search = window.location.search.toLowerCase();  //不能转小写，tableid大小写敏感
        var search = window.location.search;
        search = search.replace(new RegExp("%22", 'g'), "\"")
        // search = search.replace(new RegExp("%23", 'g'), "#"); //因最后要赋值给window.location.href，这里不能替换为#
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = search.substr(1).match(reg);
        if (r != null) {
            var querystring = key + '=' + unescape(r[2]);
            var replace_value = key + '=' + value;
            search = search.replace(querystring, replace_value);
        }
        else {
            if (_noCacheRex.test(search)) {
                prefix = '&';
            }
            else {
                prefix = '?';
            }
            search += prefix + key + '=' + value;
        }
        window.location.href = url + search;
    },

    //设置经验等级配置
    setLevelConfig(data) {
        this._levelConfig = {};
        for (let i = 0; i < data.length; i++) {
            this._levelConfig[data[i].nLevel] = data[i].nExp;
        }
    },

    //计算出当前等级
    calcCurLevel(exp) {
        //当前等级
        let currentExp = exp
        let curLevel = 1;
        let levelsConfig = this.getLevelsConfig();
        for (let key in levelsConfig) {

            if (currentExp >= levelsConfig[key]) {
                currentExp = currentExp - levelsConfig[key]
                curLevel = Number(key);
            } else {
                break
            }

        }

        return curLevel;
    },

    /**
     * 牌桌配置信息整合
     * @param {*} text 前置文本
     * @param {*} smallBlind 小盲
     * @param {*} bigBlind 大盲
     * @param {*} zhuaTou 抓头
     * @param {*} preAnte 前注
     * @param {*} preAnteOdd 庄家前注倍数
     */
    showClubTableInfo(text, smallBlind, bigBlind, zhuaTou, preAnte, preAnteOdd, gameId) {
        // //短牌不显示抓头,后续功能添加
        // if (gameId == 175) {
        //     zhuaTou = 0
        // }
        if (Number(smallBlind) > 0 && Number(bigBlind) > 0) {
            let str = text ? text + ' ' : '';
            str += smallBlind + '/' + bigBlind
            let zT = zhuaTou ? '/' + zhuaTou : ''
            let pT = preAnte ? `(${preAnte})` : ''
            return str + zT + pT
        } else if (preAnte) {
            let preAnteDeblue = !preAnteOdd ? preAnte * 2 : preAnte * preAnteOdd
            preAnteDeblue = Math.round(Math.floor(preAnteDeblue * 10000) / 100) / 100
            return `${text ? text + ' ' : text}${preAnte}/${preAnteDeblue}`
        }
    },

    //计算出当前经验
    calcCurCurrentExp(exp) {
        //当前等级
        let currentExp = exp
        let levelsConfig = this.getLevelsConfig();
        for (let key in levelsConfig) {

            if (currentExp >= levelsConfig[key]) {
                currentExp = currentExp - levelsConfig[key]
            }
            else {
                break;
            }

        }

        return Number(currentExp);
    },

    //获取等级经验配置
    getLevelsConfig() {
        //返回配置对象，如果为空则返回空对象
        return this._levelConfig ? this._levelConfig : {};
    },

    //原生库项目动态改变横竖屏
    setOrientation(isLandscape) {
        if (app.config.IS_CLUB_ONLY) {
            return;
        }

        if (!app.config.IS_LIVE_ONLY) {
            return;
        }

        if (cc.sys.isNative) {
            return;
        }

        if (this._setOrientation) {
            my.target.off(my.event.RESIZE, this._setOrientation, this);
        }
        // this._setOrientation = function () {
        //     //当设置为强制横屏 或 默认不是自动旋转时才处理，避免直播平台全屏/半屏切换时横竖屏闪动
        //     if(isLandscape || cc.view._orientation!=cc.macro.ORIENTATION_AUTO){
        //         let orientation = isLandscape ? cc.macro.ORIENTATION_LANDSCAPE : cc.macro.ORIENTATION_PORTRAIT;
        //         //非网页版才处理
        //         if(!my.url.get("live")){
        //             let winSize = {width: cc.game.frame.clientWidth, height: cc.game.frame.clientHeight}
        //             //app 设置的宽大于高时，保持竖屏显示
        //             if(winSize.width > winSize.height){
        //                 orientation = isLandscape ? cc.macro.ORIENTATION_PORTRAIT : cc.macro.ORIENTATION_LANDSCAPE;
        //             }
        //         }
        //         cc.view.setOrientation(orientation);

        //     }
        // }

        // this._setOrientation();
        my.target.emit(my.event.RESIZE);
        my.target.on(my.event.RESIZE, this._setOrientation, this);

    },

    //UTC时间转本地时间
    getLocalDateFromUTCDate(utcDateStr) {
        var date1 = new Date();
        var offsetMinute = date1.getTimezoneOffset();
        var offsetHours = offsetMinute / 60;
        var date2 = new Date(utcDateStr);
        date2.setHours(date2.getHours() - offsetHours);
        return date2;
    },

    //界面按钮绑定点击音效
    addClickSoundToNode(node) {
        if (!node) {
            return;
        }
        const buttons = node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];
            const node = btn.node;
            if (!node) continue;
            if (node.getComponent("UISound")) continue;
            node.addComponent("UISound");
            let nodeName = (node.name || "").toLowerCase();
            if (nodeName.indexOf("close") >= 0 || nodeName.indexOf("return") >= 0) {
                var nodeUISound = node.getComponent("UISound");
                if (nodeUISound) nodeUISound.clickEffect = "button/close";
            }
        }

    },


    openTelegramLink(url) {
        let telegramWebApp = window.Telegram && window.Telegram.WebApp;
        if (telegramWebApp) {
            telegramWebApp.openTelegramLink(url);
        } else {
            cc.sys.openURL(url);
        }

    },

    /**
     * 把一组 label 节点按指定间距放到目标节点的后面。
     * - 默认在水平方向向右依次排列：target -> spacing -> label1 -> spacing -> label2 ...
     * - 支持方向：水平('horizontal') 或 垂直('vertical')；以及具体方向 'right'|'left'|'down'|'up'
     * - 如果 label 的父节点与 target 不同，会把 label 重新设置到 target.parent 下并保留世界坐标不变（然后再按规则排列）。
     *
     * @param {cc.Node} targetNode 目标节点（参考节点）
     * @param {Array<cc.Node>} labelNodes 待排列的节点数组（将按顺序排列）
     * @param {number} spacing 间距（像素），默认为 10，表示 target 与第一个 label 以及相邻 label 之间的距离
     * @param {Object} options 可选项：{ orientation: 'horizontal'|'vertical', direction: 'right'|'left'|'down'|'up', align: 'center'|'top'|'bottom' }
     * @returns {boolean} 返回 true 表示成功，false 表示参数错误
     *
     * 示例：
     * UtilManager.placeLabelsAfterNode(myIconNode, [label1, label2], 8, { orientation: 'horizontal', direction: 'right' });
     */
    placeLabelsAfterNode(targetNode, labelNodes, spacing = 10, options = {}) {
        if (!targetNode || !labelNodes || !Array.isArray(labelNodes) || labelNodes.length === 0) return false;

        const orientation = options.orientation || 'horizontal'; // 'horizontal'|'vertical'
        const direction = options.direction || (orientation === 'horizontal' ? 'right' : 'down');
        const align = options.align || 'center'; // only used for cross-axis alignment

        const parent = targetNode.parent;
        if (!parent) return false; // 需要一个共同的父节点来排列

        // helper：重新设置父节点并保留世界位置
        const reparentKeepWorld = function (node, newParent) {
            if (!node || !newParent) return;
            try {
                const world = node.convertToWorldSpaceAR(cc.v2(0, 0));
                node.parent = newParent;
                node.setPosition(newParent.convertToNodeSpaceAR(world));
            } catch (e) {
                // 如果失败，直接设置父节点（容错）
                node.parent = newParent;
            }
        };

        // 简化：去掉对 target 边界的计算，位置基准改为 target 的世界坐标（父坐标系中的 x/y）
        // 水平排列时保持 y 与 target 一致；垂直排列时保持 x 与 target 一致。
        const baseX = targetNode.x;
        const baseY = targetNode.y;
        if (orientation === 'horizontal') {
            if (direction === 'right') {
                // 从 target 的右侧开始放置，按 spacing 连续排列（以 target.x 为基准）
                let curLeft = baseX + spacing;
                for (let i = 0; i < labelNodes.length; i++) {
                    const lbl = labelNodes[i];
                    if (!lbl) continue;
                    if (lbl.parent !== parent) reparentKeepWorld(lbl, parent);
                    const lw = (lbl.width || lbl.getContentSize().width || 0);
                    // 计算 label 的 x，使其左边等于 curLeft
                    const lx = curLeft + (lbl.anchorX || 0) * lw;
                    // cross-axis 对齐：y 坐标一致为基准，可选择偏移 top/bottom（这里简单用 baseY）
                    let ly = baseY;
                    if (align === 'top') {
                        ly = baseY + (lbl.height || lbl.getContentSize().height || 0) / 2;
                    } else if (align === 'bottom') {
                        ly = baseY - (lbl.height || lbl.getContentSize().height || 0) / 2;
                    }
                    lbl.setPosition(lx, ly);
                    curLeft += lw + spacing;
                }
            } else if (direction === 'left') {
                // 从 target 的左侧向左排（逆序）
                let curRight = baseX - spacing;
                for (let i = 0; i < labelNodes.length; i++) {
                    const lbl = labelNodes[i];
                    if (!lbl) continue;
                    if (lbl.parent !== parent) reparentKeepWorld(lbl, parent);
                    const lw = (lbl.width || lbl.getContentSize().width || 0);
                    // 计算 label 的 x，使其右边等于 curRight
                    const lx = curRight - (1 - (lbl.anchorX || 0)) * lw;
                    let ly = baseY;
                    if (align === 'top') {
                        ly = baseY + (lbl.height || lbl.getContentSize().height || 0) / 2;
                    } else if (align === 'bottom') {
                        ly = baseY - (lbl.height || lbl.getContentSize().height || 0) / 2;
                    }
                    lbl.setPosition(lx, ly);
                    curRight -= lw + spacing;
                }
            }
        } else { // vertical
            if (direction === 'down') {
                // 从 target 底部向下排列（以 baseY 为基准）
                let curTop = baseY - spacing; // start below target
                for (let i = 0; i < labelNodes.length; i++) {
                    const lbl = labelNodes[i];
                    if (!lbl) continue;
                    if (lbl.parent !== parent) reparentKeepWorld(lbl, parent);
                    const lh = (lbl.height || lbl.getContentSize().height || 0);
                    // 计算 label 的 y，使其顶部等于 curTop
                    const ly = curTop - (1 - (lbl.anchorY || 0)) * lh;
                    let lx = baseX;
                    if (align === 'left') {
                        lx = baseX - (lbl.width || lbl.getContentSize().width || 0) / 2;
                    } else if (align === 'right') {
                        lx = baseX + (lbl.width || lbl.getContentSize().width || 0) / 2;
                    }
                    lbl.setPosition(lx, ly);
                    curTop -= lh + spacing;
                }
            } else if (direction === 'up') {
                // 从 target 顶部向上排列（以 baseY 为基准）
                let curBottom = baseY + spacing; // start above target
                for (let i = 0; i < labelNodes.length; i++) {
                    const lbl = labelNodes[i];
                    if (!lbl) continue;
                    if (lbl.parent !== parent) reparentKeepWorld(lbl, parent);
                    const lh = (lbl.height || lbl.getContentSize().height || 0);
                    // 计算 label 的 y，使其底部等于 curBottom
                    const ly = curBottom + (lbl.anchorY || 0) * lh;
                    let lx = baseX;
                    if (align === 'left') {
                        lx = baseX - (lbl.width || lbl.getContentSize().width || 0) / 2;
                    } else if (align === 'right') {
                        lx = baseX + (lbl.width || lbl.getContentSize().width || 0) / 2;
                    }
                    lbl.setPosition(lx, ly);
                    curBottom += lh + spacing;
                }
            }
        }

        return true;
    },
};

UtilManager.default = UtilManager;
module.exports = UtilManager;