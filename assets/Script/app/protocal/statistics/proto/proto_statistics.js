/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.BurProto = (function() {

    /**
     * Properties of a BurProto.
     * @exports IBurProto
     * @interface IBurProto
     * @property {number} Main_CMD BurProto Main_CMD
     * @property {number} Bur_UserInfoReq_CMD BurProto Bur_UserInfoReq_CMD
     * @property {number} Bur_UserInfoRsp_CMD BurProto Bur_UserInfoRsp_CMD
     */

    /**
     * Constructs a new BurProto.
     * @exports BurProto
     * @classdesc Represents a BurProto.
     * @implements IBurProto
     * @constructor
     * @param {IBurProto=} [properties] Properties to set
     */
    function BurProto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BurProto Main_CMD.
     * @member {number} Main_CMD
     * @memberof BurProto
     * @instance
     */
    BurProto.prototype.Main_CMD = 2101;

    /**
     * BurProto Bur_UserInfoReq_CMD.
     * @member {number} Bur_UserInfoReq_CMD
     * @memberof BurProto
     * @instance
     */
    BurProto.prototype.Bur_UserInfoReq_CMD = 1;

    /**
     * BurProto Bur_UserInfoRsp_CMD.
     * @member {number} Bur_UserInfoRsp_CMD
     * @memberof BurProto
     * @instance
     */
    BurProto.prototype.Bur_UserInfoRsp_CMD = 2;

    /**
     * Creates a new BurProto instance using the specified properties.
     * @function create
     * @memberof BurProto
     * @static
     * @param {IBurProto=} [properties] Properties to set
     * @returns {BurProto} BurProto instance
     */
    BurProto.create = function create(properties) {
        return new BurProto(properties);
    };

    /**
     * Encodes the specified BurProto message. Does not implicitly {@link BurProto.verify|verify} messages.
     * @function encode
     * @memberof BurProto
     * @static
     * @param {IBurProto} message BurProto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BurProto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.Bur_UserInfoReq_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.Bur_UserInfoRsp_CMD);
        return writer;
    };

    /**
     * Encodes the specified BurProto message, length delimited. Does not implicitly {@link BurProto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BurProto
     * @static
     * @param {IBurProto} message BurProto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BurProto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BurProto message from the specified reader or buffer.
     * @function decode
     * @memberof BurProto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BurProto} BurProto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BurProto.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BurProto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Main_CMD = reader.int32();
                break;
            case 2:
                message.Bur_UserInfoReq_CMD = reader.int32();
                break;
            case 3:
                message.Bur_UserInfoRsp_CMD = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("Bur_UserInfoReq_CMD"))
            throw $util.ProtocolError("missing required 'Bur_UserInfoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("Bur_UserInfoRsp_CMD"))
            throw $util.ProtocolError("missing required 'Bur_UserInfoRsp_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a BurProto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BurProto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BurProto} BurProto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BurProto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BurProto message.
     * @function verify
     * @memberof BurProto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BurProto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.Bur_UserInfoReq_CMD))
            return "Bur_UserInfoReq_CMD: integer expected";
        if (!$util.isInteger(message.Bur_UserInfoRsp_CMD))
            return "Bur_UserInfoRsp_CMD: integer expected";
        return null;
    };

    /**
     * Creates a BurProto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BurProto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BurProto} BurProto
     */
    BurProto.fromObject = function fromObject(object) {
        if (object instanceof $root.BurProto)
            return object;
        var message = new $root.BurProto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.Bur_UserInfoReq_CMD != null)
            message.Bur_UserInfoReq_CMD = object.Bur_UserInfoReq_CMD | 0;
        if (object.Bur_UserInfoRsp_CMD != null)
            message.Bur_UserInfoRsp_CMD = object.Bur_UserInfoRsp_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a BurProto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BurProto
     * @static
     * @param {BurProto} message BurProto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BurProto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 2101;
            object.Bur_UserInfoReq_CMD = 1;
            object.Bur_UserInfoRsp_CMD = 2;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.Bur_UserInfoReq_CMD != null && message.hasOwnProperty("Bur_UserInfoReq_CMD"))
            object.Bur_UserInfoReq_CMD = message.Bur_UserInfoReq_CMD;
        if (message.Bur_UserInfoRsp_CMD != null && message.hasOwnProperty("Bur_UserInfoRsp_CMD"))
            object.Bur_UserInfoRsp_CMD = message.Bur_UserInfoRsp_CMD;
        return object;
    };

    /**
     * Converts this BurProto to JSON.
     * @function toJSON
     * @memberof BurProto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BurProto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BurProto;
})();

$root.Bur_UserInfoREQ = (function() {

    /**
     * Properties of a Bur_UserInfoREQ.
     * @exports IBur_UserInfoREQ
     * @interface IBur_UserInfoREQ
     * @property {string|null} [tBuildUserData] Bur_UserInfoREQ tBuildUserData
     */

    /**
     * Constructs a new Bur_UserInfoREQ.
     * @exports Bur_UserInfoREQ
     * @classdesc Represents a Bur_UserInfoREQ.
     * @implements IBur_UserInfoREQ
     * @constructor
     * @param {IBur_UserInfoREQ=} [properties] Properties to set
     */
    function Bur_UserInfoREQ(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Bur_UserInfoREQ tBuildUserData.
     * @member {string} tBuildUserData
     * @memberof Bur_UserInfoREQ
     * @instance
     */
    Bur_UserInfoREQ.prototype.tBuildUserData = "";

    /**
     * Creates a new Bur_UserInfoREQ instance using the specified properties.
     * @function create
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {IBur_UserInfoREQ=} [properties] Properties to set
     * @returns {Bur_UserInfoREQ} Bur_UserInfoREQ instance
     */
    Bur_UserInfoREQ.create = function create(properties) {
        return new Bur_UserInfoREQ(properties);
    };

    /**
     * Encodes the specified Bur_UserInfoREQ message. Does not implicitly {@link Bur_UserInfoREQ.verify|verify} messages.
     * @function encode
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {IBur_UserInfoREQ} message Bur_UserInfoREQ message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bur_UserInfoREQ.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tBuildUserData != null && message.hasOwnProperty("tBuildUserData"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.tBuildUserData);
        return writer;
    };

    /**
     * Encodes the specified Bur_UserInfoREQ message, length delimited. Does not implicitly {@link Bur_UserInfoREQ.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {IBur_UserInfoREQ} message Bur_UserInfoREQ message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bur_UserInfoREQ.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Bur_UserInfoREQ message from the specified reader or buffer.
     * @function decode
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Bur_UserInfoREQ} Bur_UserInfoREQ
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bur_UserInfoREQ.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Bur_UserInfoREQ();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.tBuildUserData = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Bur_UserInfoREQ message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Bur_UserInfoREQ} Bur_UserInfoREQ
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bur_UserInfoREQ.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Bur_UserInfoREQ message.
     * @function verify
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Bur_UserInfoREQ.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.tBuildUserData != null && message.hasOwnProperty("tBuildUserData"))
            if (!$util.isString(message.tBuildUserData))
                return "tBuildUserData: string expected";
        return null;
    };

    /**
     * Creates a Bur_UserInfoREQ message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Bur_UserInfoREQ} Bur_UserInfoREQ
     */
    Bur_UserInfoREQ.fromObject = function fromObject(object) {
        if (object instanceof $root.Bur_UserInfoREQ)
            return object;
        var message = new $root.Bur_UserInfoREQ();
        if (object.tBuildUserData != null)
            message.tBuildUserData = String(object.tBuildUserData);
        return message;
    };

    /**
     * Creates a plain object from a Bur_UserInfoREQ message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Bur_UserInfoREQ
     * @static
     * @param {Bur_UserInfoREQ} message Bur_UserInfoREQ
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Bur_UserInfoREQ.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.tBuildUserData = "";
        if (message.tBuildUserData != null && message.hasOwnProperty("tBuildUserData"))
            object.tBuildUserData = message.tBuildUserData;
        return object;
    };

    /**
     * Converts this Bur_UserInfoREQ to JSON.
     * @function toJSON
     * @memberof Bur_UserInfoREQ
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Bur_UserInfoREQ.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Bur_UserInfoREQ;
})();

$root.Bur_UserInfoRSP = (function() {

    /**
     * Properties of a Bur_UserInfoRSP.
     * @exports IBur_UserInfoRSP
     * @interface IBur_UserInfoRSP
     * @property {number|null} [nResult] Bur_UserInfoRSP nResult
     * @property {string|null} [sFReport] Bur_UserInfoRSP sFReport
     */

    /**
     * Constructs a new Bur_UserInfoRSP.
     * @exports Bur_UserInfoRSP
     * @classdesc Represents a Bur_UserInfoRSP.
     * @implements IBur_UserInfoRSP
     * @constructor
     * @param {IBur_UserInfoRSP=} [properties] Properties to set
     */
    function Bur_UserInfoRSP(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Bur_UserInfoRSP nResult.
     * @member {number} nResult
     * @memberof Bur_UserInfoRSP
     * @instance
     */
    Bur_UserInfoRSP.prototype.nResult = -99;

    /**
     * Bur_UserInfoRSP sFReport.
     * @member {string} sFReport
     * @memberof Bur_UserInfoRSP
     * @instance
     */
    Bur_UserInfoRSP.prototype.sFReport = "";

    /**
     * Creates a new Bur_UserInfoRSP instance using the specified properties.
     * @function create
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {IBur_UserInfoRSP=} [properties] Properties to set
     * @returns {Bur_UserInfoRSP} Bur_UserInfoRSP instance
     */
    Bur_UserInfoRSP.create = function create(properties) {
        return new Bur_UserInfoRSP(properties);
    };

    /**
     * Encodes the specified Bur_UserInfoRSP message. Does not implicitly {@link Bur_UserInfoRSP.verify|verify} messages.
     * @function encode
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {IBur_UserInfoRSP} message Bur_UserInfoRSP message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bur_UserInfoRSP.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.sFReport != null && message.hasOwnProperty("sFReport"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sFReport);
        return writer;
    };

    /**
     * Encodes the specified Bur_UserInfoRSP message, length delimited. Does not implicitly {@link Bur_UserInfoRSP.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {IBur_UserInfoRSP} message Bur_UserInfoRSP message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bur_UserInfoRSP.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Bur_UserInfoRSP message from the specified reader or buffer.
     * @function decode
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Bur_UserInfoRSP} Bur_UserInfoRSP
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bur_UserInfoRSP.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Bur_UserInfoRSP();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.sFReport = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Bur_UserInfoRSP message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Bur_UserInfoRSP} Bur_UserInfoRSP
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bur_UserInfoRSP.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Bur_UserInfoRSP message.
     * @function verify
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Bur_UserInfoRSP.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            if (!$util.isInteger(message.nResult))
                return "nResult: integer expected";
        if (message.sFReport != null && message.hasOwnProperty("sFReport"))
            if (!$util.isString(message.sFReport))
                return "sFReport: string expected";
        return null;
    };

    /**
     * Creates a Bur_UserInfoRSP message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Bur_UserInfoRSP} Bur_UserInfoRSP
     */
    Bur_UserInfoRSP.fromObject = function fromObject(object) {
        if (object instanceof $root.Bur_UserInfoRSP)
            return object;
        var message = new $root.Bur_UserInfoRSP();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.sFReport != null)
            message.sFReport = String(object.sFReport);
        return message;
    };

    /**
     * Creates a plain object from a Bur_UserInfoRSP message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Bur_UserInfoRSP
     * @static
     * @param {Bur_UserInfoRSP} message Bur_UserInfoRSP
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Bur_UserInfoRSP.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = -99;
            object.sFReport = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.sFReport != null && message.hasOwnProperty("sFReport"))
            object.sFReport = message.sFReport;
        return object;
    };

    /**
     * Converts this Bur_UserInfoRSP to JSON.
     * @function toJSON
     * @memberof Bur_UserInfoRSP
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Bur_UserInfoRSP.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Bur_UserInfoRSP;
})();

module.exports = $root;
