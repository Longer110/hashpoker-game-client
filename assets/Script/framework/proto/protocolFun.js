/*
网络解析函数定义   字节序用小端
*/
let CONFIG = require("config_frameworks");
var MAX_BUFFER_LENGTH = CONFIG.MAX_BUFFER_LENGTH;


function ProtocolDataPool(){
}
ProtocolDataPool._pool = new Array;
ProtocolDataPool.reuse = function () {
    let data = null;
    if(ProtocolDataPool._pool.length>0){
        data = ProtocolDataPool._pool.shift();
    }
    else{
        data = new ProtocolData();
    }
    return data;
}
ProtocolDataPool.unuse = function (data) {
    data.clear();
    ProtocolDataPool._pool.push(data);
}

function ProtocolData() {
    this.uint8NetVersion = 0;
    this.uint8CheckCode = 0;
    this.uint16PacketSize = 0;
    this.uint16MainCmd = 0;
    this.uint16SubCmd = 0;
    this.uint16Position = 0;
    this.uint16Length = 0;
    this._buffer = new ArrayBuffer(MAX_BUFFER_LENGTH);
    this._dataView = new DataView(this._buffer);
    this.buffer = this._buffer;
    this.dataView = this._dataView;

    this.clear = function () {
        this.uint8NetVersion = 0;
        this.uint8CheckCode = 0;
        this.uint16PacketSize = 0;
        this.uint16MainCmd = 0;
        this.uint16SubCmd = 0;
        this.uint16Position = 0;
        this.uint16Length = 0;

        //TODO reset this.buffer and this.dataView
        this.buffer = this._buffer;
        this.dataView = this._dataView;
    }
    
    this.setCmd = function (mainCmd, subCmd) {
        this.uint16MainCmd = mainCmd;
        this.uint16SubCmd = subCmd;
    };
    this.getMainCommand = function () {
        return this.uint16MainCmd;
    };
    this.getSubCommand = function () {
        return this.uint16SubCmd;
    };
    this.getPacketSize = function () {
        return this.uint16PacketSize;
    };
    this.getBufferLength = function () {
        return this.dataView.byteLength;
    };
    this.getBuffer = function () {
        // //console.log("getBuffer uint16Position = ", this.uint16Position);
        let packSize = new Uint16Array(this.buffer, 2, 1);
        packSize[0] = this.uint16Position;
        var data = this.buffer.slice(0, this.uint16Position); // 从0 - 9 不包括 10;
        //  //console.debug("ProtocolData","buffer byteLength=%d", data.byteLength);
        //  //console.debug("ProtocolData", "buffer length=%d", data.length);
        return data;
    };
    this.getBufferQySocketData = function () {
        if (this.uint16Position <= 0) {
            return null;
        }
        var data = this.buffer.slice(0, this.uint16Position); // 从0 - 9 不包括 10;
        //  //console.debug("ProtocolData", "getBufferQySocketData byteLength=%d", data.byteLength);
        return data;
    };
    this.writeHead = function () {
        this.dataView.setUint8(this.uint16Position, this.uint8NetVersion, true);
        this.uint16Position = this.uint16Position + 1;
        this.dataView.setUint8(this.uint16Position, this.uint8CheckCode, true);
        this.uint16Position = this.uint16Position + 1;
        this.dataView.setUint16(this.uint16Position, this.uint16PacketSize, true);
        this.uint16Position = this.uint16Position + 2;
        this.dataView.setUint16(this.uint16Position, this.uint16MainCmd, true);
        this.uint16Position = this.uint16Position + 2;
        this.dataView.setUint16(this.uint16Position, this.uint16SubCmd, true);
        this.uint16Position = this.uint16Position + 2;
    };
    this.writeUint8 = function (vaule, order) {
        if (order == null) {
            order = true;
        }
        this.checkByteLength();
        this.dataView.setUint8(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 1;
    };
    this.writeInt8 = function (vaule) {
        this.dataView.setInt8(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 1;
    };
    this.writeUint16 = function (vaule) {
        this.dataView.setUint16(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 2;
    };
    this.writeInt16 = function (vaule) {
        this.dataView.setInt16(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 2;
    };
    this.writeUint32 = function (vaule) {
        this.dataView.setUint32(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 4;
    };
    this.writeInt32 = function (vaule) {
        this.dataView.setInt32(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 4;
    };
    this.writeUint64 = function (vaule) {
        this.dataView.setUint64(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 8;
    };
    this.writeInt64 = function (vaule) {
        this.dataView.setInt64(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 8;
    };
    this.writeFloat32 = function (vaule) {
        this.dataView.setFloat32(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 4;
    };
    this.writeFloat64 = function (vaule) {
        this.dataView.setFloat64(this.uint16Position, vaule, true);
        this.uint16Position = this.uint16Position + 8;
    };
    this.writeString = function (vaule) {
        let str = writeUTF8(vaule);
        var length = str.length;
        this.writeUint16(length);
        for (let index = 0; index < length; index++) {
            this.writeUint8(str[index]);
        }
    };
    this.writeBufferData = function (vaule) {
        if (vaule) {
            var length = vaule.length;
            this.writeUint16(length);
            //  //console.log("writeBufferData length=", this.uint16Position,length);
            for (let index = 0; index < length; index++) {
                this.writeUint8(vaule[index]);
            }
        }  
    };
    this.writeBufferDataQySocket = function (vaule) {
        if (vaule) {
            var length = vaule.length;
            for (let index = 0; index < length; index++) {
                this.writeUint8(vaule[index]);
            }
        }
    };
    this.checkByteLength = function () {
        let maxLength = this.dataView.byteLength;
        if (this.uint16Position >= maxLength) {
             //console.error("checkByteLength",this.uint16Position, maxLength);
        }
    };
    this.setBuffer = function (buffer) {
        this.buffer = buffer;
        this.uint16Position = 0;
        this.dataView = new DataView(this.buffer);
    };
    this.readHead = function () {
        //  //console.log("readHead this.uint16Position = ", this.uint16Position);
        this.uint8NetVersion = this.dataView.getUint8(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 1;
        this.uint8CheckCode = this.dataView.getUint8(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 1;
        this.uint16PacketSize = this.dataView.getUint16(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 2;
        this.uint16MainCmd = this.dataView.getUint16(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 2;
        this.uint16SubCmd = this.dataView.getUint16(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 2;
        // //console.log("leave readHead this.uint16Position = ", this.uint16Position);
    };
    this.readUint8 = function () {
        //  //console.log("leave readUint8 this.uint16Position = ", this.uint16Position);
        var vaule = this.dataView.getUint8(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 1;
        //  //console.log("leave readUint8 this.uint16Position = ", this.uint16Position);
        //  //console.log("vaule = ", vaule);
        return vaule;
    };
    this.readInt8 = function () {
        var vaule = this.dataView.getInt8(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 1;
        return vaule;
    };
    this.readUint16 = function () {
        var vaule = this.dataView.getUint16(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 2;
        return vaule;
    };
    this.readInt16 = function () {
        var vaule = this.dataView.getInt16(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 2;
        return vaule;
    };
    this.readUint32 = function () {
        var vaule = this.dataView.getUint32(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 4;
        return vaule;
    };
    this.readUint32Array = function () {
        var length = this.readInt8();
        var value = [];
        for (let i = 0; i < length; i++) {
            value[i] = this.readUint32();
        }
        return value;
    };
    this.readInt32 = function () {
        var vaule = this.dataView.getInt32(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 4;
        return vaule;
    };
    this.readUint64 = function () {
        var vaule = this.dataView.getUint64(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 8;
        return vaule;
    };
    this.readInt64 = function () {
        var vaule = this.dataView.getInt64(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 8;
        return vaule;
    };
    this.readFloat32 = function () {
        var vaule = this.dataView.getFloat32(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 4;
        return vaule;
    };
    this.readFloat64 = function () {
        var vaule = this.dataView.getFloat64(this.uint16Position, true);
        this.uint16Position = this.uint16Position + 8;
        return vaule;
    };
    this.readByteArray = function () {
        var length = this.readInt8();
        var value = [];
        for (let i = 0; i < length; i++) {
            value[i] = this.readInt8();
        }
        return value;
    };
    this.readString = function () {
        var len = this.readUint16();
        var str = new Uint8Array(len);
        for (let index = 0; index < len; index++) {
            str[index] = this.readUint8();
        }
        let str16 = readUTF8(str);
        // //console.log("str16= ", str16);
        return str16;
    };
    this._readBuffer = function () {
        var length = this.readUint16();
        if (length > 0) {
            var str = new Uint8Array(length);
            for (let index = 0; index < length; index++) {
                str[index] = this.readUint8();
            }
            return str;
        }
        return "";
    };
    this.readBufferData = function () {
        let str = null;
        let maxLength = this.dataView.byteLength;
        if (maxLength <= this.uint16Position)
        {
            // QYLogs.log("ProtocolFun","readBufferData 长度超出了最大长度 出错 maxLength=" + maxLength);
        }else{
            str = this._readBuffer();
        }
        return str;
    };
    this.readBufferDataQySocket = function () {
        // var maxLength = this.dataView.byteLength;
        // if (maxLength <= this.uint16Position) {
        //     QYLogs.log("ProtocolFun","11readBufferData 长度超出了最大长度 出错");
        //     return "";
        // }
        // var length = this.readUint16();
        // if (length > 0) {
        //     var str = new Uint8Array(length);
        //     for (let index = 0; index < length; index++) {
        //         str[index] = this.readUint8();
        //     }
        //     return str;
        // }
        // return "";
        return this.readBufferData();
    };
   
};



var writeUTF8 = function (utf16Str) {
    // var back = [];
    // var byteSize = 0;
    // for (var i = 0; i < str.length; i++) {
    //     var code = str.charCodeAt(i);
    //     if (0x00 <= code && code <= 0x7f) {
    //         byteSize += 1;
    //         back.push(code);
    //     } else if (0x80 <= code && code <= 0x7ff) {
    //         byteSize += 2;
    //         back.push((192 | (31 & (code >> 6))));
    //         back.push((128 | (63 & code)))
    //     } else if ((0x800 <= code && code <= 0xd7ff)
    //         || (0xe000 <= code && code <= 0xffff)) {
    //         byteSize += 3;
    //         back.push((224 | (15 & (code >> 12))));
    //         back.push((128 | (63 & (code >> 6))));
    //         back.push((128 | (63 & code)))
    //     }
    // }
    // for (i = 0; i < back.length; i++) {
    //     back[i] &= 0xff;
    // }
    // if (isGetBytes) {
    //     return back
    // }
    // if (byteSize <= 0xff) {
    //     return [0, byteSize].concat(back);
    // } else {
    //     return [byteSize >> 8, byteSize & 0xff].concat(back);
    // }
    // var code = encodeURI(str);
    // var codeList = code.split('%');
    // codeList = codeList.map(item => parseInt(item, 16));
    // return codeList;
    var utf8Arr = [];
    var byteSize = 0;
    for (var i = 0; i < utf16Str.length; i++) {
        //获取字符Unicode码值
        var code = utf16Str.charCodeAt(i);

        //如果码值是1个字节的范围，则直接写入
        if (code >= 0x00 && code <= 0x7f) {
            byteSize += 1;
            utf8Arr.push(code);

            //如果码值是2个字节以上的范围，则按规则进行填充补码转换
        } else if (code >= 0x80 && code <= 0x7ff) {
            byteSize += 2;
            utf8Arr.push((192 | (31 & (code >> 6))));
            utf8Arr.push((128 | (63 & code)))
        } else if ((code >= 0x800 && code <= 0xd7ff)
            || (code >= 0xe000 && code <= 0xffff)) {
            byteSize += 3;
            utf8Arr.push((224 | (15 & (code >> 12))));
            utf8Arr.push((128 | (63 & (code >> 6))));
            utf8Arr.push((128 | (63 & code)))
        } else if (code >= 0x10000 && code <= 0x10ffff) {
            byteSize += 4;
            utf8Arr.push((240 | (7 & (code >> 18))));
            utf8Arr.push((128 | (63 & (code >> 12))));
            utf8Arr.push((128 | (63 & (code >> 6))));
            utf8Arr.push((128 | (63 & code)))
        }
    }


    return utf8Arr
}
var readUTF8 = function (utf8Arr) {
    // if (typeof arr === 'string') {
    //     return arr;
    // }
    // var UTF = '', _arr = this.init(arr);
    // for (var i = 0; i < _arr.length; i++) {
    //     var one = _arr[i].toString(2),
    //         v = one.match(/^1+?(?=0)/);
    //     if (v && one.length == 8) {
    //         var bytesLength = v[0].length;
    //         var store = _arr[i].toString(2).slice(7 - bytesLength);
    //         for (var st = 1; st < bytesLength; st++) {
    //             store += _arr[st + i].toString(2).slice(2)
    //         }
    //         UTF += String.fromCharCode(parseInt(store, 2));
    //         i += bytesLength - 1
    //     } else {
    //         UTF += String.fromCharCode(_arr[i])
    //     }
    // }
    // return UTF
    // var code = arr.map(item => '%' + item.toString(16)).join('');

    // return decodeURI(code);

    var utf16Str = '';
    for (var i = 0; i < utf8Arr.length; i++) {
        //每个字节都转换为2进制字符串进行判断
        var one = utf8Arr[i].toString(2);

        //正则表达式判断该字节是否符合>=2个1和1个0的情况
        var v = one.match(/^1+?(?=0)/);

        //多个字节编码
        if (v && one.length == 8) {
            //获取该编码是多少个字节长度
            var bytesLength = v[0].length;

            //首个字节中的数据,因为首字节有效数据长度为8位减去1个0位，再减去bytesLength位的剩余位数
            var store = utf8Arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                //后面剩余字节中的数据，因为后面字节都是10xxxxxxx，所以slice中的2指的是去除10
                store += utf8Arr[st + i].toString(2).slice(2)
            }

            //转换为Unicode码值
            utf16Str += String.fromCharCode(parseInt(store, 2));

            //调整剩余字节数
            i += bytesLength - 1
        } else {
            //单个字节编码，和Unicode码值一致，直接将该字节转换为UTF-16
            utf16Str += String.fromCharCode(utf8Arr[i])
        }
    }

    return utf16Str


}
var ProtocolFun = {
    setSendData: function (buffer, mainCmd, subCmd, qySocket) {
        if(mainCmd==0 && subCmd==0){
            //  //console.debug("ProtocolFun","setSendData mainCmd = ", mainCmd);
            //  //console.debug("ProtocolFun","setSendData subCmd = ", subCmd);
        }
        else{
            // QYLogs.log("ProtocolFun","setSendData mainCmd = ", mainCmd);
            // QYLogs.log("ProtocolFun","setSendData subCmd = ", subCmd);
        }
        
        var sendData = ProtocolDataPool.reuse();
        let result = null;
        if (!qySocket) {
            sendData.uint16MainCmd = mainCmd;
            sendData.uint16SubCmd = subCmd;
            sendData.writeHead();
            sendData.writeBufferData(buffer)
            result = sendData.getBuffer()
        }else{
            sendData.writeBufferDataQySocket(buffer)
            result = sendData.getBufferQySocketData()
        }
        
        ProtocolDataPool.unuse(sendData);
        return result;
    },

    setReceiveData: function (buffer, protocolMap, skipHead) {
        // QYLogs.log("ProtocolFun", "setReceiveData buffer byteLength = ", buffer.byteLength);
        
        var receiveData = ProtocolDataPool.reuse();
        let mainCmd = 0;
        let subCmd = 0;
        let packetSize = 0;
        let isPacketSizeSame = true;
        let protobufData = null;
        if (skipHead) {
            mainCmd = skipHead.mainCmd;
            subCmd = skipHead.subCmd;
            if (buffer && buffer.byteLength > 0 ) {
                receiveData.setBuffer(buffer);
                protobufData = receiveData.readBufferData();
            } 
        }else{
            receiveData.setBuffer(buffer);
            receiveData.readHead();
            mainCmd = receiveData.getMainCommand();
            subCmd = receiveData.getSubCommand();
            // let netVersion = receiveData.getNetVersion();
            // let checkCode = receiveData.getCheckCode();
            packetSize = receiveData.getPacketSize();
            protobufData = receiveData.readBufferData();

            let bufferLength = receiveData.getBufferLength();
            if ( packetSize != bufferLength) {
                isPacketSizeSame = false;
                QYLogs.log("ProtocolFun [ERROR]", "接入的数据与包头的数据不相等，是否存在粘包情况 bufferLength=" + bufferLength + "packetSize=" + packetSize);
            }
        }
    
        ProtocolDataPool.unuse(receiveData);
        
        //过滤心跳消息打印
        if(mainCmd==0 && mainCmd==0){
            //  //console.debug("ProtocolFun","setReceiveData mainCmd = ", mainCmd);
            //  //console.debug("ProtocolFun","setReceiveData subCmd = ", subCmd);
        }
        else{
            QYLogs.log("ProtocolFun","setReceiveData mainCmd = ", mainCmd);
            QYLogs.log("ProtocolFun","setReceiveData subCmd = ", subCmd);
        }
        
        let mapMain = protocolMap.get(mainCmd);
        let subFunc = null;
        if (mapMain) {
            subFunc = mapMain.get(subCmd);
        }

        let data = {};
        if (!subFunc) {
            return { data: {}, msg: "", mainCmd: mainCmd, subCmd: subCmd, packetSize: packetSize };
        }
        
        let response = subFunc(protobufData);
        data = response.data;
        let msg = response.msg;

        return { data: data, msg: msg, mainCmd: mainCmd, subCmd: subCmd, packetSize: packetSize };
    },
    test(data) {
         //console.log("test come on");
         //console.log(data);
    },
    printData(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                 //console.log("%s=%s", key, element);
            }
        }
    },
};
module.exports = ProtocolFun;