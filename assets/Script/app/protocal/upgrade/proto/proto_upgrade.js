/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Maintainer_Proto = (function() {

    /**
     * Properties of a Maintainer_Proto.
     * @exports IMaintainer_Proto
     * @interface IMaintainer_Proto
     * @property {number} Main_CMD Maintainer_Proto Main_CMD
     * @property {number} VersionInfoReq_CMD Maintainer_Proto VersionInfoReq_CMD
     * @property {number} VersionInfoRsp_CMD Maintainer_Proto VersionInfoRsp_CMD
     * @property {number} MaintenanceNotify_CMD Maintainer_Proto MaintenanceNotify_CMD
     * @property {number} KickOutNotify_CMD Maintainer_Proto KickOutNotify_CMD
     */

    /**
     * Constructs a new Maintainer_Proto.
     * @exports Maintainer_Proto
     * @classdesc Represents a Maintainer_Proto.
     * @implements IMaintainer_Proto
     * @constructor
     * @param {IMaintainer_Proto=} [properties] Properties to set
     */
    function Maintainer_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Maintainer_Proto Main_CMD.
     * @member {number} Main_CMD
     * @memberof Maintainer_Proto
     * @instance
     */
    Maintainer_Proto.prototype.Main_CMD = 1200;

    /**
     * Maintainer_Proto VersionInfoReq_CMD.
     * @member {number} VersionInfoReq_CMD
     * @memberof Maintainer_Proto
     * @instance
     */
    Maintainer_Proto.prototype.VersionInfoReq_CMD = 1;

    /**
     * Maintainer_Proto VersionInfoRsp_CMD.
     * @member {number} VersionInfoRsp_CMD
     * @memberof Maintainer_Proto
     * @instance
     */
    Maintainer_Proto.prototype.VersionInfoRsp_CMD = 2;

    /**
     * Maintainer_Proto MaintenanceNotify_CMD.
     * @member {number} MaintenanceNotify_CMD
     * @memberof Maintainer_Proto
     * @instance
     */
    Maintainer_Proto.prototype.MaintenanceNotify_CMD = 3;

    /**
     * Maintainer_Proto KickOutNotify_CMD.
     * @member {number} KickOutNotify_CMD
     * @memberof Maintainer_Proto
     * @instance
     */
    Maintainer_Proto.prototype.KickOutNotify_CMD = 5;

    /**
     * Creates a new Maintainer_Proto instance using the specified properties.
     * @function create
     * @memberof Maintainer_Proto
     * @static
     * @param {IMaintainer_Proto=} [properties] Properties to set
     * @returns {Maintainer_Proto} Maintainer_Proto instance
     */
    Maintainer_Proto.create = function create(properties) {
        return new Maintainer_Proto(properties);
    };

    /**
     * Encodes the specified Maintainer_Proto message. Does not implicitly {@link Maintainer_Proto.verify|verify} messages.
     * @function encode
     * @memberof Maintainer_Proto
     * @static
     * @param {IMaintainer_Proto} message Maintainer_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Maintainer_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.VersionInfoReq_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.VersionInfoRsp_CMD);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.MaintenanceNotify_CMD);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.KickOutNotify_CMD);
        return writer;
    };

    /**
     * Encodes the specified Maintainer_Proto message, length delimited. Does not implicitly {@link Maintainer_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Maintainer_Proto
     * @static
     * @param {IMaintainer_Proto} message Maintainer_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Maintainer_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Maintainer_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Maintainer_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Maintainer_Proto} Maintainer_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Maintainer_Proto.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Maintainer_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Main_CMD = reader.int32();
                break;
            case 2:
                message.VersionInfoReq_CMD = reader.int32();
                break;
            case 3:
                message.VersionInfoRsp_CMD = reader.int32();
                break;
            case 4:
                message.MaintenanceNotify_CMD = reader.int32();
                break;
            case 5:
                message.KickOutNotify_CMD = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("VersionInfoReq_CMD"))
            throw $util.ProtocolError("missing required 'VersionInfoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("VersionInfoRsp_CMD"))
            throw $util.ProtocolError("missing required 'VersionInfoRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("MaintenanceNotify_CMD"))
            throw $util.ProtocolError("missing required 'MaintenanceNotify_CMD'", { instance: message });
        if (!message.hasOwnProperty("KickOutNotify_CMD"))
            throw $util.ProtocolError("missing required 'KickOutNotify_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a Maintainer_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Maintainer_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Maintainer_Proto} Maintainer_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Maintainer_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Maintainer_Proto message.
     * @function verify
     * @memberof Maintainer_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Maintainer_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.VersionInfoReq_CMD))
            return "VersionInfoReq_CMD: integer expected";
        if (!$util.isInteger(message.VersionInfoRsp_CMD))
            return "VersionInfoRsp_CMD: integer expected";
        if (!$util.isInteger(message.MaintenanceNotify_CMD))
            return "MaintenanceNotify_CMD: integer expected";
        if (!$util.isInteger(message.KickOutNotify_CMD))
            return "KickOutNotify_CMD: integer expected";
        return null;
    };

    /**
     * Creates a Maintainer_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Maintainer_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Maintainer_Proto} Maintainer_Proto
     */
    Maintainer_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Maintainer_Proto)
            return object;
        var message = new $root.Maintainer_Proto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.VersionInfoReq_CMD != null)
            message.VersionInfoReq_CMD = object.VersionInfoReq_CMD | 0;
        if (object.VersionInfoRsp_CMD != null)
            message.VersionInfoRsp_CMD = object.VersionInfoRsp_CMD | 0;
        if (object.MaintenanceNotify_CMD != null)
            message.MaintenanceNotify_CMD = object.MaintenanceNotify_CMD | 0;
        if (object.KickOutNotify_CMD != null)
            message.KickOutNotify_CMD = object.KickOutNotify_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a Maintainer_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Maintainer_Proto
     * @static
     * @param {Maintainer_Proto} message Maintainer_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Maintainer_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 1200;
            object.VersionInfoReq_CMD = 1;
            object.VersionInfoRsp_CMD = 2;
            object.MaintenanceNotify_CMD = 3;
            object.KickOutNotify_CMD = 5;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.VersionInfoReq_CMD != null && message.hasOwnProperty("VersionInfoReq_CMD"))
            object.VersionInfoReq_CMD = message.VersionInfoReq_CMD;
        if (message.VersionInfoRsp_CMD != null && message.hasOwnProperty("VersionInfoRsp_CMD"))
            object.VersionInfoRsp_CMD = message.VersionInfoRsp_CMD;
        if (message.MaintenanceNotify_CMD != null && message.hasOwnProperty("MaintenanceNotify_CMD"))
            object.MaintenanceNotify_CMD = message.MaintenanceNotify_CMD;
        if (message.KickOutNotify_CMD != null && message.hasOwnProperty("KickOutNotify_CMD"))
            object.KickOutNotify_CMD = message.KickOutNotify_CMD;
        return object;
    };

    /**
     * Converts this Maintainer_Proto to JSON.
     * @function toJSON
     * @memberof Maintainer_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Maintainer_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Maintainer_Proto;
})();

$root.VersionInfoReq = (function() {

    /**
     * Properties of a VersionInfoReq.
     * @exports IVersionInfoReq
     * @interface IVersionInfoReq
     * @property {string} sPlatform VersionInfoReq sPlatform
     * @property {string} sChannel VersionInfoReq sChannel
     */

    /**
     * Constructs a new VersionInfoReq.
     * @exports VersionInfoReq
     * @classdesc Represents a VersionInfoReq.
     * @implements IVersionInfoReq
     * @constructor
     * @param {IVersionInfoReq=} [properties] Properties to set
     */
    function VersionInfoReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * VersionInfoReq sPlatform.
     * @member {string} sPlatform
     * @memberof VersionInfoReq
     * @instance
     */
    VersionInfoReq.prototype.sPlatform = "";

    /**
     * VersionInfoReq sChannel.
     * @member {string} sChannel
     * @memberof VersionInfoReq
     * @instance
     */
    VersionInfoReq.prototype.sChannel = "";

    /**
     * Creates a new VersionInfoReq instance using the specified properties.
     * @function create
     * @memberof VersionInfoReq
     * @static
     * @param {IVersionInfoReq=} [properties] Properties to set
     * @returns {VersionInfoReq} VersionInfoReq instance
     */
    VersionInfoReq.create = function create(properties) {
        return new VersionInfoReq(properties);
    };

    /**
     * Encodes the specified VersionInfoReq message. Does not implicitly {@link VersionInfoReq.verify|verify} messages.
     * @function encode
     * @memberof VersionInfoReq
     * @static
     * @param {IVersionInfoReq} message VersionInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VersionInfoReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPlatform);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sChannel);
        return writer;
    };

    /**
     * Encodes the specified VersionInfoReq message, length delimited. Does not implicitly {@link VersionInfoReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof VersionInfoReq
     * @static
     * @param {IVersionInfoReq} message VersionInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VersionInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a VersionInfoReq message from the specified reader or buffer.
     * @function decode
     * @memberof VersionInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {VersionInfoReq} VersionInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VersionInfoReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VersionInfoReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sPlatform = reader.string();
                break;
            case 2:
                message.sChannel = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sPlatform"))
            throw $util.ProtocolError("missing required 'sPlatform'", { instance: message });
        if (!message.hasOwnProperty("sChannel"))
            throw $util.ProtocolError("missing required 'sChannel'", { instance: message });
        return message;
    };

    /**
     * Decodes a VersionInfoReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof VersionInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {VersionInfoReq} VersionInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VersionInfoReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a VersionInfoReq message.
     * @function verify
     * @memberof VersionInfoReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    VersionInfoReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sPlatform))
            return "sPlatform: string expected";
        if (!$util.isString(message.sChannel))
            return "sChannel: string expected";
        return null;
    };

    /**
     * Creates a VersionInfoReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof VersionInfoReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {VersionInfoReq} VersionInfoReq
     */
    VersionInfoReq.fromObject = function fromObject(object) {
        if (object instanceof $root.VersionInfoReq)
            return object;
        var message = new $root.VersionInfoReq();
        if (object.sPlatform != null)
            message.sPlatform = String(object.sPlatform);
        if (object.sChannel != null)
            message.sChannel = String(object.sChannel);
        return message;
    };

    /**
     * Creates a plain object from a VersionInfoReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof VersionInfoReq
     * @static
     * @param {VersionInfoReq} message VersionInfoReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    VersionInfoReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sPlatform = "";
            object.sChannel = "";
        }
        if (message.sPlatform != null && message.hasOwnProperty("sPlatform"))
            object.sPlatform = message.sPlatform;
        if (message.sChannel != null && message.hasOwnProperty("sChannel"))
            object.sChannel = message.sChannel;
        return object;
    };

    /**
     * Converts this VersionInfoReq to JSON.
     * @function toJSON
     * @memberof VersionInfoReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    VersionInfoReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return VersionInfoReq;
})();

$root.VersionInfoRsp = (function() {

    /**
     * Properties of a VersionInfoRsp.
     * @exports IVersionInfoRsp
     * @interface IVersionInfoRsp
     * @property {number} nResult VersionInfoRsp nResult
     * @property {VersionInfoRsp.IVersionInfo|null} [tVersionInfo] VersionInfoRsp tVersionInfo
     */

    /**
     * Constructs a new VersionInfoRsp.
     * @exports VersionInfoRsp
     * @classdesc Represents a VersionInfoRsp.
     * @implements IVersionInfoRsp
     * @constructor
     * @param {IVersionInfoRsp=} [properties] Properties to set
     */
    function VersionInfoRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * VersionInfoRsp nResult.
     * @member {number} nResult
     * @memberof VersionInfoRsp
     * @instance
     */
    VersionInfoRsp.prototype.nResult = 0;

    /**
     * VersionInfoRsp tVersionInfo.
     * @member {VersionInfoRsp.IVersionInfo|null|undefined} tVersionInfo
     * @memberof VersionInfoRsp
     * @instance
     */
    VersionInfoRsp.prototype.tVersionInfo = null;

    /**
     * Creates a new VersionInfoRsp instance using the specified properties.
     * @function create
     * @memberof VersionInfoRsp
     * @static
     * @param {IVersionInfoRsp=} [properties] Properties to set
     * @returns {VersionInfoRsp} VersionInfoRsp instance
     */
    VersionInfoRsp.create = function create(properties) {
        return new VersionInfoRsp(properties);
    };

    /**
     * Encodes the specified VersionInfoRsp message. Does not implicitly {@link VersionInfoRsp.verify|verify} messages.
     * @function encode
     * @memberof VersionInfoRsp
     * @static
     * @param {IVersionInfoRsp} message VersionInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VersionInfoRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.tVersionInfo != null && Object.hasOwnProperty.call(message, "tVersionInfo"))
            $root.VersionInfoRsp.VersionInfo.encode(message.tVersionInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified VersionInfoRsp message, length delimited. Does not implicitly {@link VersionInfoRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof VersionInfoRsp
     * @static
     * @param {IVersionInfoRsp} message VersionInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VersionInfoRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a VersionInfoRsp message from the specified reader or buffer.
     * @function decode
     * @memberof VersionInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {VersionInfoRsp} VersionInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VersionInfoRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VersionInfoRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.tVersionInfo = $root.VersionInfoRsp.VersionInfo.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nResult"))
            throw $util.ProtocolError("missing required 'nResult'", { instance: message });
        return message;
    };

    /**
     * Decodes a VersionInfoRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof VersionInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {VersionInfoRsp} VersionInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VersionInfoRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a VersionInfoRsp message.
     * @function verify
     * @memberof VersionInfoRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    VersionInfoRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.tVersionInfo != null && message.hasOwnProperty("tVersionInfo")) {
            var error = $root.VersionInfoRsp.VersionInfo.verify(message.tVersionInfo);
            if (error)
                return "tVersionInfo." + error;
        }
        return null;
    };

    /**
     * Creates a VersionInfoRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof VersionInfoRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {VersionInfoRsp} VersionInfoRsp
     */
    VersionInfoRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.VersionInfoRsp)
            return object;
        var message = new $root.VersionInfoRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.tVersionInfo != null) {
            if (typeof object.tVersionInfo !== "object")
                throw TypeError(".VersionInfoRsp.tVersionInfo: object expected");
            message.tVersionInfo = $root.VersionInfoRsp.VersionInfo.fromObject(object.tVersionInfo);
        }
        return message;
    };

    /**
     * Creates a plain object from a VersionInfoRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof VersionInfoRsp
     * @static
     * @param {VersionInfoRsp} message VersionInfoRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    VersionInfoRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.tVersionInfo = null;
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.tVersionInfo != null && message.hasOwnProperty("tVersionInfo"))
            object.tVersionInfo = $root.VersionInfoRsp.VersionInfo.toObject(message.tVersionInfo, options);
        return object;
    };

    /**
     * Converts this VersionInfoRsp to JSON.
     * @function toJSON
     * @memberof VersionInfoRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    VersionInfoRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    VersionInfoRsp.VersionInfo = (function() {

        /**
         * Properties of a VersionInfo.
         * @memberof VersionInfoRsp
         * @interface IVersionInfo
         * @property {string} sVersion VersionInfo sVersion
         * @property {string} sDownloadurl VersionInfo sDownloadurl
         * @property {string} sAppurl VersionInfo sAppurl
         * @property {string} sConfigUrl VersionInfo sConfigUrl
         * @property {string} sConfigVersion VersionInfo sConfigVersion
         */

        /**
         * Constructs a new VersionInfo.
         * @memberof VersionInfoRsp
         * @classdesc Represents a VersionInfo.
         * @implements IVersionInfo
         * @constructor
         * @param {VersionInfoRsp.IVersionInfo=} [properties] Properties to set
         */
        function VersionInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VersionInfo sVersion.
         * @member {string} sVersion
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         */
        VersionInfo.prototype.sVersion = "";

        /**
         * VersionInfo sDownloadurl.
         * @member {string} sDownloadurl
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         */
        VersionInfo.prototype.sDownloadurl = "";

        /**
         * VersionInfo sAppurl.
         * @member {string} sAppurl
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         */
        VersionInfo.prototype.sAppurl = "";

        /**
         * VersionInfo sConfigUrl.
         * @member {string} sConfigUrl
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         */
        VersionInfo.prototype.sConfigUrl = "";

        /**
         * VersionInfo sConfigVersion.
         * @member {string} sConfigVersion
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         */
        VersionInfo.prototype.sConfigVersion = "";

        /**
         * Creates a new VersionInfo instance using the specified properties.
         * @function create
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {VersionInfoRsp.IVersionInfo=} [properties] Properties to set
         * @returns {VersionInfoRsp.VersionInfo} VersionInfo instance
         */
        VersionInfo.create = function create(properties) {
            return new VersionInfo(properties);
        };

        /**
         * Encodes the specified VersionInfo message. Does not implicitly {@link VersionInfoRsp.VersionInfo.verify|verify} messages.
         * @function encode
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {VersionInfoRsp.IVersionInfo} message VersionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VersionInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sVersion);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sDownloadurl);
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sAppurl);
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sConfigUrl);
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sConfigVersion);
            return writer;
        };

        /**
         * Encodes the specified VersionInfo message, length delimited. Does not implicitly {@link VersionInfoRsp.VersionInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {VersionInfoRsp.IVersionInfo} message VersionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VersionInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VersionInfo message from the specified reader or buffer.
         * @function decode
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VersionInfoRsp.VersionInfo} VersionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VersionInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VersionInfoRsp.VersionInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sVersion = reader.string();
                    break;
                case 2:
                    message.sDownloadurl = reader.string();
                    break;
                case 3:
                    message.sAppurl = reader.string();
                    break;
                case 4:
                    message.sConfigUrl = reader.string();
                    break;
                case 5:
                    message.sConfigVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sVersion"))
                throw $util.ProtocolError("missing required 'sVersion'", { instance: message });
            if (!message.hasOwnProperty("sDownloadurl"))
                throw $util.ProtocolError("missing required 'sDownloadurl'", { instance: message });
            if (!message.hasOwnProperty("sAppurl"))
                throw $util.ProtocolError("missing required 'sAppurl'", { instance: message });
            if (!message.hasOwnProperty("sConfigUrl"))
                throw $util.ProtocolError("missing required 'sConfigUrl'", { instance: message });
            if (!message.hasOwnProperty("sConfigVersion"))
                throw $util.ProtocolError("missing required 'sConfigVersion'", { instance: message });
            return message;
        };

        /**
         * Decodes a VersionInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VersionInfoRsp.VersionInfo} VersionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VersionInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VersionInfo message.
         * @function verify
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VersionInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sVersion))
                return "sVersion: string expected";
            if (!$util.isString(message.sDownloadurl))
                return "sDownloadurl: string expected";
            if (!$util.isString(message.sAppurl))
                return "sAppurl: string expected";
            if (!$util.isString(message.sConfigUrl))
                return "sConfigUrl: string expected";
            if (!$util.isString(message.sConfigVersion))
                return "sConfigVersion: string expected";
            return null;
        };

        /**
         * Creates a VersionInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VersionInfoRsp.VersionInfo} VersionInfo
         */
        VersionInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.VersionInfoRsp.VersionInfo)
                return object;
            var message = new $root.VersionInfoRsp.VersionInfo();
            if (object.sVersion != null)
                message.sVersion = String(object.sVersion);
            if (object.sDownloadurl != null)
                message.sDownloadurl = String(object.sDownloadurl);
            if (object.sAppurl != null)
                message.sAppurl = String(object.sAppurl);
            if (object.sConfigUrl != null)
                message.sConfigUrl = String(object.sConfigUrl);
            if (object.sConfigVersion != null)
                message.sConfigVersion = String(object.sConfigVersion);
            return message;
        };

        /**
         * Creates a plain object from a VersionInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VersionInfoRsp.VersionInfo
         * @static
         * @param {VersionInfoRsp.VersionInfo} message VersionInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VersionInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sVersion = "";
                object.sDownloadurl = "";
                object.sAppurl = "";
                object.sConfigUrl = "";
                object.sConfigVersion = "";
            }
            if (message.sVersion != null && message.hasOwnProperty("sVersion"))
                object.sVersion = message.sVersion;
            if (message.sDownloadurl != null && message.hasOwnProperty("sDownloadurl"))
                object.sDownloadurl = message.sDownloadurl;
            if (message.sAppurl != null && message.hasOwnProperty("sAppurl"))
                object.sAppurl = message.sAppurl;
            if (message.sConfigUrl != null && message.hasOwnProperty("sConfigUrl"))
                object.sConfigUrl = message.sConfigUrl;
            if (message.sConfigVersion != null && message.hasOwnProperty("sConfigVersion"))
                object.sConfigVersion = message.sConfigVersion;
            return object;
        };

        /**
         * Converts this VersionInfo to JSON.
         * @function toJSON
         * @memberof VersionInfoRsp.VersionInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VersionInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return VersionInfo;
    })();

    return VersionInfoRsp;
})();

$root.MaintenanceNotify = (function() {

    /**
     * Properties of a MaintenanceNotify.
     * @exports IMaintenanceNotify
     * @interface IMaintenanceNotify
     * @property {string} sTimeStart MaintenanceNotify sTimeStart
     * @property {string} sTimeEnd MaintenanceNotify sTimeEnd
     * @property {number|null} [nStartTimestamp] MaintenanceNotify nStartTimestamp
     * @property {number|null} [nEndTimestamp] MaintenanceNotify nEndTimestamp
     */

    /**
     * Constructs a new MaintenanceNotify.
     * @exports MaintenanceNotify
     * @classdesc Represents a MaintenanceNotify.
     * @implements IMaintenanceNotify
     * @constructor
     * @param {IMaintenanceNotify=} [properties] Properties to set
     */
    function MaintenanceNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MaintenanceNotify sTimeStart.
     * @member {string} sTimeStart
     * @memberof MaintenanceNotify
     * @instance
     */
    MaintenanceNotify.prototype.sTimeStart = "";

    /**
     * MaintenanceNotify sTimeEnd.
     * @member {string} sTimeEnd
     * @memberof MaintenanceNotify
     * @instance
     */
    MaintenanceNotify.prototype.sTimeEnd = "";

    /**
     * MaintenanceNotify nStartTimestamp.
     * @member {number} nStartTimestamp
     * @memberof MaintenanceNotify
     * @instance
     */
    MaintenanceNotify.prototype.nStartTimestamp = 0;

    /**
     * MaintenanceNotify nEndTimestamp.
     * @member {number} nEndTimestamp
     * @memberof MaintenanceNotify
     * @instance
     */
    MaintenanceNotify.prototype.nEndTimestamp = 0;

    /**
     * Creates a new MaintenanceNotify instance using the specified properties.
     * @function create
     * @memberof MaintenanceNotify
     * @static
     * @param {IMaintenanceNotify=} [properties] Properties to set
     * @returns {MaintenanceNotify} MaintenanceNotify instance
     */
    MaintenanceNotify.create = function create(properties) {
        return new MaintenanceNotify(properties);
    };

    /**
     * Encodes the specified MaintenanceNotify message. Does not implicitly {@link MaintenanceNotify.verify|verify} messages.
     * @function encode
     * @memberof MaintenanceNotify
     * @static
     * @param {IMaintenanceNotify} message MaintenanceNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MaintenanceNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTimeStart);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTimeEnd);
        if (message.nStartTimestamp != null && Object.hasOwnProperty.call(message, "nStartTimestamp"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nStartTimestamp);
        if (message.nEndTimestamp != null && Object.hasOwnProperty.call(message, "nEndTimestamp"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nEndTimestamp);
        return writer;
    };

    /**
     * Encodes the specified MaintenanceNotify message, length delimited. Does not implicitly {@link MaintenanceNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MaintenanceNotify
     * @static
     * @param {IMaintenanceNotify} message MaintenanceNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MaintenanceNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MaintenanceNotify message from the specified reader or buffer.
     * @function decode
     * @memberof MaintenanceNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MaintenanceNotify} MaintenanceNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MaintenanceNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MaintenanceNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sTimeStart = reader.string();
                break;
            case 2:
                message.sTimeEnd = reader.string();
                break;
            case 3:
                message.nStartTimestamp = reader.int32();
                break;
            case 4:
                message.nEndTimestamp = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sTimeStart"))
            throw $util.ProtocolError("missing required 'sTimeStart'", { instance: message });
        if (!message.hasOwnProperty("sTimeEnd"))
            throw $util.ProtocolError("missing required 'sTimeEnd'", { instance: message });
        return message;
    };

    /**
     * Decodes a MaintenanceNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MaintenanceNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MaintenanceNotify} MaintenanceNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MaintenanceNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MaintenanceNotify message.
     * @function verify
     * @memberof MaintenanceNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MaintenanceNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sTimeStart))
            return "sTimeStart: string expected";
        if (!$util.isString(message.sTimeEnd))
            return "sTimeEnd: string expected";
        if (message.nStartTimestamp != null && message.hasOwnProperty("nStartTimestamp"))
            if (!$util.isInteger(message.nStartTimestamp))
                return "nStartTimestamp: integer expected";
        if (message.nEndTimestamp != null && message.hasOwnProperty("nEndTimestamp"))
            if (!$util.isInteger(message.nEndTimestamp))
                return "nEndTimestamp: integer expected";
        return null;
    };

    /**
     * Creates a MaintenanceNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MaintenanceNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MaintenanceNotify} MaintenanceNotify
     */
    MaintenanceNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.MaintenanceNotify)
            return object;
        var message = new $root.MaintenanceNotify();
        if (object.sTimeStart != null)
            message.sTimeStart = String(object.sTimeStart);
        if (object.sTimeEnd != null)
            message.sTimeEnd = String(object.sTimeEnd);
        if (object.nStartTimestamp != null)
            message.nStartTimestamp = object.nStartTimestamp | 0;
        if (object.nEndTimestamp != null)
            message.nEndTimestamp = object.nEndTimestamp | 0;
        return message;
    };

    /**
     * Creates a plain object from a MaintenanceNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MaintenanceNotify
     * @static
     * @param {MaintenanceNotify} message MaintenanceNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MaintenanceNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sTimeStart = "";
            object.sTimeEnd = "";
            object.nStartTimestamp = 0;
            object.nEndTimestamp = 0;
        }
        if (message.sTimeStart != null && message.hasOwnProperty("sTimeStart"))
            object.sTimeStart = message.sTimeStart;
        if (message.sTimeEnd != null && message.hasOwnProperty("sTimeEnd"))
            object.sTimeEnd = message.sTimeEnd;
        if (message.nStartTimestamp != null && message.hasOwnProperty("nStartTimestamp"))
            object.nStartTimestamp = message.nStartTimestamp;
        if (message.nEndTimestamp != null && message.hasOwnProperty("nEndTimestamp"))
            object.nEndTimestamp = message.nEndTimestamp;
        return object;
    };

    /**
     * Converts this MaintenanceNotify to JSON.
     * @function toJSON
     * @memberof MaintenanceNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MaintenanceNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MaintenanceNotify;
})();

$root.KickOutNotify = (function() {

    /**
     * Properties of a KickOutNotify.
     * @exports IKickOutNotify
     * @interface IKickOutNotify
     * @property {string} sTips KickOutNotify sTips
     * @property {number} nToWhere KickOutNotify nToWhere
     */

    /**
     * Constructs a new KickOutNotify.
     * @exports KickOutNotify
     * @classdesc Represents a KickOutNotify.
     * @implements IKickOutNotify
     * @constructor
     * @param {IKickOutNotify=} [properties] Properties to set
     */
    function KickOutNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KickOutNotify sTips.
     * @member {string} sTips
     * @memberof KickOutNotify
     * @instance
     */
    KickOutNotify.prototype.sTips = "";

    /**
     * KickOutNotify nToWhere.
     * @member {number} nToWhere
     * @memberof KickOutNotify
     * @instance
     */
    KickOutNotify.prototype.nToWhere = 0;

    /**
     * Creates a new KickOutNotify instance using the specified properties.
     * @function create
     * @memberof KickOutNotify
     * @static
     * @param {IKickOutNotify=} [properties] Properties to set
     * @returns {KickOutNotify} KickOutNotify instance
     */
    KickOutNotify.create = function create(properties) {
        return new KickOutNotify(properties);
    };

    /**
     * Encodes the specified KickOutNotify message. Does not implicitly {@link KickOutNotify.verify|verify} messages.
     * @function encode
     * @memberof KickOutNotify
     * @static
     * @param {IKickOutNotify} message KickOutNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KickOutNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTips);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nToWhere);
        return writer;
    };

    /**
     * Encodes the specified KickOutNotify message, length delimited. Does not implicitly {@link KickOutNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KickOutNotify
     * @static
     * @param {IKickOutNotify} message KickOutNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KickOutNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KickOutNotify message from the specified reader or buffer.
     * @function decode
     * @memberof KickOutNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KickOutNotify} KickOutNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KickOutNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KickOutNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sTips = reader.string();
                break;
            case 2:
                message.nToWhere = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sTips"))
            throw $util.ProtocolError("missing required 'sTips'", { instance: message });
        if (!message.hasOwnProperty("nToWhere"))
            throw $util.ProtocolError("missing required 'nToWhere'", { instance: message });
        return message;
    };

    /**
     * Decodes a KickOutNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KickOutNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KickOutNotify} KickOutNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KickOutNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KickOutNotify message.
     * @function verify
     * @memberof KickOutNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KickOutNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sTips))
            return "sTips: string expected";
        if (!$util.isInteger(message.nToWhere))
            return "nToWhere: integer expected";
        return null;
    };

    /**
     * Creates a KickOutNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KickOutNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KickOutNotify} KickOutNotify
     */
    KickOutNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.KickOutNotify)
            return object;
        var message = new $root.KickOutNotify();
        if (object.sTips != null)
            message.sTips = String(object.sTips);
        if (object.nToWhere != null)
            message.nToWhere = object.nToWhere | 0;
        return message;
    };

    /**
     * Creates a plain object from a KickOutNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KickOutNotify
     * @static
     * @param {KickOutNotify} message KickOutNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KickOutNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sTips = "";
            object.nToWhere = 0;
        }
        if (message.sTips != null && message.hasOwnProperty("sTips"))
            object.sTips = message.sTips;
        if (message.nToWhere != null && message.hasOwnProperty("nToWhere"))
            object.nToWhere = message.nToWhere;
        return object;
    };

    /**
     * Converts this KickOutNotify to JSON.
     * @function toJSON
     * @memberof KickOutNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KickOutNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KickOutNotify;
})();

module.exports = $root;
