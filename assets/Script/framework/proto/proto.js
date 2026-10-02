/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Log_Proto = (function() {

    /**
     * Properties of a Log_Proto.
     * @exports ILog_Proto
     * @interface ILog_Proto
     * @property {number} Main_CMD Log_Proto Main_CMD
     * @property {number} LogFileCreateReq_CMD Log_Proto LogFileCreateReq_CMD
     * @property {number} LogFileCreateRsp_CMD Log_Proto LogFileCreateRsp_CMD
     * @property {number} LogWriteReq_CMD Log_Proto LogWriteReq_CMD
     * @property {number} LineCheckReq_CMD Log_Proto LineCheckReq_CMD
     * @property {number} LineCheckRsp_CMD Log_Proto LineCheckRsp_CMD
     */

    /**
     * Constructs a new Log_Proto.
     * @exports Log_Proto
     * @classdesc Represents a Log_Proto.
     * @implements ILog_Proto
     * @constructor
     * @param {ILog_Proto=} [properties] Properties to set
     */
    function Log_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Log_Proto Main_CMD.
     * @member {number} Main_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.Main_CMD = 1300;

    /**
     * Log_Proto LogFileCreateReq_CMD.
     * @member {number} LogFileCreateReq_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.LogFileCreateReq_CMD = 5;

    /**
     * Log_Proto LogFileCreateRsp_CMD.
     * @member {number} LogFileCreateRsp_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.LogFileCreateRsp_CMD = 6;

    /**
     * Log_Proto LogWriteReq_CMD.
     * @member {number} LogWriteReq_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.LogWriteReq_CMD = 4;

    /**
     * Log_Proto LineCheckReq_CMD.
     * @member {number} LineCheckReq_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.LineCheckReq_CMD = 7;

    /**
     * Log_Proto LineCheckRsp_CMD.
     * @member {number} LineCheckRsp_CMD
     * @memberof Log_Proto
     * @instance
     */
    Log_Proto.prototype.LineCheckRsp_CMD = 8;

    /**
     * Creates a new Log_Proto instance using the specified properties.
     * @function create
     * @memberof Log_Proto
     * @static
     * @param {ILog_Proto=} [properties] Properties to set
     * @returns {Log_Proto} Log_Proto instance
     */
    Log_Proto.create = function create(properties) {
        return new Log_Proto(properties);
    };

    /**
     * Encodes the specified Log_Proto message. Does not implicitly {@link Log_Proto.verify|verify} messages.
     * @function encode
     * @memberof Log_Proto
     * @static
     * @param {ILog_Proto} message Log_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Log_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.LogFileCreateReq_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.LogFileCreateRsp_CMD);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.LogWriteReq_CMD);
        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.LineCheckReq_CMD);
        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.LineCheckRsp_CMD);
        return writer;
    };

    /**
     * Encodes the specified Log_Proto message, length delimited. Does not implicitly {@link Log_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Log_Proto
     * @static
     * @param {ILog_Proto} message Log_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Log_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Log_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Log_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Log_Proto} Log_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Log_Proto.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Log_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Main_CMD = reader.int32();
                break;
            case 2:
                message.LogFileCreateReq_CMD = reader.int32();
                break;
            case 3:
                message.LogFileCreateRsp_CMD = reader.int32();
                break;
            case 4:
                message.LogWriteReq_CMD = reader.int32();
                break;
            case 7:
                message.LineCheckReq_CMD = reader.int32();
                break;
            case 8:
                message.LineCheckRsp_CMD = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogFileCreateReq_CMD"))
            throw $util.ProtocolError("missing required 'LogFileCreateReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogFileCreateRsp_CMD"))
            throw $util.ProtocolError("missing required 'LogFileCreateRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogWriteReq_CMD"))
            throw $util.ProtocolError("missing required 'LogWriteReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LineCheckReq_CMD"))
            throw $util.ProtocolError("missing required 'LineCheckReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LineCheckRsp_CMD"))
            throw $util.ProtocolError("missing required 'LineCheckRsp_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a Log_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Log_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Log_Proto} Log_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Log_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Log_Proto message.
     * @function verify
     * @memberof Log_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Log_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.LogFileCreateReq_CMD))
            return "LogFileCreateReq_CMD: integer expected";
        if (!$util.isInteger(message.LogFileCreateRsp_CMD))
            return "LogFileCreateRsp_CMD: integer expected";
        if (!$util.isInteger(message.LogWriteReq_CMD))
            return "LogWriteReq_CMD: integer expected";
        if (!$util.isInteger(message.LineCheckReq_CMD))
            return "LineCheckReq_CMD: integer expected";
        if (!$util.isInteger(message.LineCheckRsp_CMD))
            return "LineCheckRsp_CMD: integer expected";
        return null;
    };

    /**
     * Creates a Log_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Log_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Log_Proto} Log_Proto
     */
    Log_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Log_Proto)
            return object;
        var message = new $root.Log_Proto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.LogFileCreateReq_CMD != null)
            message.LogFileCreateReq_CMD = object.LogFileCreateReq_CMD | 0;
        if (object.LogFileCreateRsp_CMD != null)
            message.LogFileCreateRsp_CMD = object.LogFileCreateRsp_CMD | 0;
        if (object.LogWriteReq_CMD != null)
            message.LogWriteReq_CMD = object.LogWriteReq_CMD | 0;
        if (object.LineCheckReq_CMD != null)
            message.LineCheckReq_CMD = object.LineCheckReq_CMD | 0;
        if (object.LineCheckRsp_CMD != null)
            message.LineCheckRsp_CMD = object.LineCheckRsp_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a Log_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Log_Proto
     * @static
     * @param {Log_Proto} message Log_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Log_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 1300;
            object.LogFileCreateReq_CMD = 5;
            object.LogFileCreateRsp_CMD = 6;
            object.LogWriteReq_CMD = 4;
            object.LineCheckReq_CMD = 7;
            object.LineCheckRsp_CMD = 8;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.LogFileCreateReq_CMD != null && message.hasOwnProperty("LogFileCreateReq_CMD"))
            object.LogFileCreateReq_CMD = message.LogFileCreateReq_CMD;
        if (message.LogFileCreateRsp_CMD != null && message.hasOwnProperty("LogFileCreateRsp_CMD"))
            object.LogFileCreateRsp_CMD = message.LogFileCreateRsp_CMD;
        if (message.LogWriteReq_CMD != null && message.hasOwnProperty("LogWriteReq_CMD"))
            object.LogWriteReq_CMD = message.LogWriteReq_CMD;
        if (message.LineCheckReq_CMD != null && message.hasOwnProperty("LineCheckReq_CMD"))
            object.LineCheckReq_CMD = message.LineCheckReq_CMD;
        if (message.LineCheckRsp_CMD != null && message.hasOwnProperty("LineCheckRsp_CMD"))
            object.LineCheckRsp_CMD = message.LineCheckRsp_CMD;
        return object;
    };

    /**
     * Converts this Log_Proto to JSON.
     * @function toJSON
     * @memberof Log_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Log_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Log_Proto;
})();

$root.LogFileCreateReq = (function() {

    /**
     * Properties of a LogFileCreateReq.
     * @exports ILogFileCreateReq
     * @interface ILogFileCreateReq
     * @property {string} sFileName LogFileCreateReq sFileName
     */

    /**
     * Constructs a new LogFileCreateReq.
     * @exports LogFileCreateReq
     * @classdesc Represents a LogFileCreateReq.
     * @implements ILogFileCreateReq
     * @constructor
     * @param {ILogFileCreateReq=} [properties] Properties to set
     */
    function LogFileCreateReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogFileCreateReq sFileName.
     * @member {string} sFileName
     * @memberof LogFileCreateReq
     * @instance
     */
    LogFileCreateReq.prototype.sFileName = "";

    /**
     * Creates a new LogFileCreateReq instance using the specified properties.
     * @function create
     * @memberof LogFileCreateReq
     * @static
     * @param {ILogFileCreateReq=} [properties] Properties to set
     * @returns {LogFileCreateReq} LogFileCreateReq instance
     */
    LogFileCreateReq.create = function create(properties) {
        return new LogFileCreateReq(properties);
    };

    /**
     * Encodes the specified LogFileCreateReq message. Does not implicitly {@link LogFileCreateReq.verify|verify} messages.
     * @function encode
     * @memberof LogFileCreateReq
     * @static
     * @param {ILogFileCreateReq} message LogFileCreateReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogFileCreateReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sFileName);
        return writer;
    };

    /**
     * Encodes the specified LogFileCreateReq message, length delimited. Does not implicitly {@link LogFileCreateReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogFileCreateReq
     * @static
     * @param {ILogFileCreateReq} message LogFileCreateReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogFileCreateReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogFileCreateReq message from the specified reader or buffer.
     * @function decode
     * @memberof LogFileCreateReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogFileCreateReq} LogFileCreateReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogFileCreateReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogFileCreateReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sFileName = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sFileName"))
            throw $util.ProtocolError("missing required 'sFileName'", { instance: message });
        return message;
    };

    /**
     * Decodes a LogFileCreateReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogFileCreateReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogFileCreateReq} LogFileCreateReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogFileCreateReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogFileCreateReq message.
     * @function verify
     * @memberof LogFileCreateReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogFileCreateReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sFileName))
            return "sFileName: string expected";
        return null;
    };

    /**
     * Creates a LogFileCreateReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogFileCreateReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogFileCreateReq} LogFileCreateReq
     */
    LogFileCreateReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LogFileCreateReq)
            return object;
        var message = new $root.LogFileCreateReq();
        if (object.sFileName != null)
            message.sFileName = String(object.sFileName);
        return message;
    };

    /**
     * Creates a plain object from a LogFileCreateReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogFileCreateReq
     * @static
     * @param {LogFileCreateReq} message LogFileCreateReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogFileCreateReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sFileName = "";
        if (message.sFileName != null && message.hasOwnProperty("sFileName"))
            object.sFileName = message.sFileName;
        return object;
    };

    /**
     * Converts this LogFileCreateReq to JSON.
     * @function toJSON
     * @memberof LogFileCreateReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogFileCreateReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogFileCreateReq;
})();

$root.LogFileCreateRsp = (function() {

    /**
     * Properties of a LogFileCreateRsp.
     * @exports ILogFileCreateRsp
     * @interface ILogFileCreateRsp
     * @property {number} nResult LogFileCreateRsp nResult
     */

    /**
     * Constructs a new LogFileCreateRsp.
     * @exports LogFileCreateRsp
     * @classdesc Represents a LogFileCreateRsp.
     * @implements ILogFileCreateRsp
     * @constructor
     * @param {ILogFileCreateRsp=} [properties] Properties to set
     */
    function LogFileCreateRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogFileCreateRsp nResult.
     * @member {number} nResult
     * @memberof LogFileCreateRsp
     * @instance
     */
    LogFileCreateRsp.prototype.nResult = 0;

    /**
     * Creates a new LogFileCreateRsp instance using the specified properties.
     * @function create
     * @memberof LogFileCreateRsp
     * @static
     * @param {ILogFileCreateRsp=} [properties] Properties to set
     * @returns {LogFileCreateRsp} LogFileCreateRsp instance
     */
    LogFileCreateRsp.create = function create(properties) {
        return new LogFileCreateRsp(properties);
    };

    /**
     * Encodes the specified LogFileCreateRsp message. Does not implicitly {@link LogFileCreateRsp.verify|verify} messages.
     * @function encode
     * @memberof LogFileCreateRsp
     * @static
     * @param {ILogFileCreateRsp} message LogFileCreateRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogFileCreateRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        return writer;
    };

    /**
     * Encodes the specified LogFileCreateRsp message, length delimited. Does not implicitly {@link LogFileCreateRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogFileCreateRsp
     * @static
     * @param {ILogFileCreateRsp} message LogFileCreateRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogFileCreateRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogFileCreateRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LogFileCreateRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogFileCreateRsp} LogFileCreateRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogFileCreateRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogFileCreateRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
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
     * Decodes a LogFileCreateRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogFileCreateRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogFileCreateRsp} LogFileCreateRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogFileCreateRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogFileCreateRsp message.
     * @function verify
     * @memberof LogFileCreateRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogFileCreateRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        return null;
    };

    /**
     * Creates a LogFileCreateRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogFileCreateRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogFileCreateRsp} LogFileCreateRsp
     */
    LogFileCreateRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LogFileCreateRsp)
            return object;
        var message = new $root.LogFileCreateRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        return message;
    };

    /**
     * Creates a plain object from a LogFileCreateRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogFileCreateRsp
     * @static
     * @param {LogFileCreateRsp} message LogFileCreateRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogFileCreateRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nResult = 0;
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        return object;
    };

    /**
     * Converts this LogFileCreateRsp to JSON.
     * @function toJSON
     * @memberof LogFileCreateRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogFileCreateRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogFileCreateRsp;
})();

$root.LogWriteReq = (function() {

    /**
     * Properties of a LogWriteReq.
     * @exports ILogWriteReq
     * @interface ILogWriteReq
     * @property {string} sText LogWriteReq sText
     */

    /**
     * Constructs a new LogWriteReq.
     * @exports LogWriteReq
     * @classdesc Represents a LogWriteReq.
     * @implements ILogWriteReq
     * @constructor
     * @param {ILogWriteReq=} [properties] Properties to set
     */
    function LogWriteReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogWriteReq sText.
     * @member {string} sText
     * @memberof LogWriteReq
     * @instance
     */
    LogWriteReq.prototype.sText = "";

    /**
     * Creates a new LogWriteReq instance using the specified properties.
     * @function create
     * @memberof LogWriteReq
     * @static
     * @param {ILogWriteReq=} [properties] Properties to set
     * @returns {LogWriteReq} LogWriteReq instance
     */
    LogWriteReq.create = function create(properties) {
        return new LogWriteReq(properties);
    };

    /**
     * Encodes the specified LogWriteReq message. Does not implicitly {@link LogWriteReq.verify|verify} messages.
     * @function encode
     * @memberof LogWriteReq
     * @static
     * @param {ILogWriteReq} message LogWriteReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogWriteReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sText);
        return writer;
    };

    /**
     * Encodes the specified LogWriteReq message, length delimited. Does not implicitly {@link LogWriteReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogWriteReq
     * @static
     * @param {ILogWriteReq} message LogWriteReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogWriteReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogWriteReq message from the specified reader or buffer.
     * @function decode
     * @memberof LogWriteReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogWriteReq} LogWriteReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogWriteReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogWriteReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.sText = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sText"))
            throw $util.ProtocolError("missing required 'sText'", { instance: message });
        return message;
    };

    /**
     * Decodes a LogWriteReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogWriteReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogWriteReq} LogWriteReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogWriteReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogWriteReq message.
     * @function verify
     * @memberof LogWriteReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogWriteReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sText))
            return "sText: string expected";
        return null;
    };

    /**
     * Creates a LogWriteReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogWriteReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogWriteReq} LogWriteReq
     */
    LogWriteReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LogWriteReq)
            return object;
        var message = new $root.LogWriteReq();
        if (object.sText != null)
            message.sText = String(object.sText);
        return message;
    };

    /**
     * Creates a plain object from a LogWriteReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogWriteReq
     * @static
     * @param {LogWriteReq} message LogWriteReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogWriteReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sText = "";
        if (message.sText != null && message.hasOwnProperty("sText"))
            object.sText = message.sText;
        return object;
    };

    /**
     * Converts this LogWriteReq to JSON.
     * @function toJSON
     * @memberof LogWriteReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogWriteReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogWriteReq;
})();

$root.LineInfo = (function() {

    /**
     * Properties of a LineInfo.
     * @exports ILineInfo
     * @interface ILineInfo
     * @property {number|null} [nTimeDiffer] LineInfo nTimeDiffer
     * @property {string} sLineName LineInfo sLineName
     */

    /**
     * Constructs a new LineInfo.
     * @exports LineInfo
     * @classdesc Represents a LineInfo.
     * @implements ILineInfo
     * @constructor
     * @param {ILineInfo=} [properties] Properties to set
     */
    function LineInfo(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LineInfo nTimeDiffer.
     * @member {number} nTimeDiffer
     * @memberof LineInfo
     * @instance
     */
    LineInfo.prototype.nTimeDiffer = 0;

    /**
     * LineInfo sLineName.
     * @member {string} sLineName
     * @memberof LineInfo
     * @instance
     */
    LineInfo.prototype.sLineName = "";

    /**
     * Creates a new LineInfo instance using the specified properties.
     * @function create
     * @memberof LineInfo
     * @static
     * @param {ILineInfo=} [properties] Properties to set
     * @returns {LineInfo} LineInfo instance
     */
    LineInfo.create = function create(properties) {
        return new LineInfo(properties);
    };

    /**
     * Encodes the specified LineInfo message. Does not implicitly {@link LineInfo.verify|verify} messages.
     * @function encode
     * @memberof LineInfo
     * @static
     * @param {ILineInfo} message LineInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineInfo.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nTimeDiffer != null && Object.hasOwnProperty.call(message, "nTimeDiffer"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nTimeDiffer);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sLineName);
        return writer;
    };

    /**
     * Encodes the specified LineInfo message, length delimited. Does not implicitly {@link LineInfo.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LineInfo
     * @static
     * @param {ILineInfo} message LineInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineInfo.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LineInfo message from the specified reader or buffer.
     * @function decode
     * @memberof LineInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LineInfo} LineInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineInfo.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LineInfo();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nTimeDiffer = reader.int32();
                break;
            case 2:
                message.sLineName = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sLineName"))
            throw $util.ProtocolError("missing required 'sLineName'", { instance: message });
        return message;
    };

    /**
     * Decodes a LineInfo message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LineInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LineInfo} LineInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineInfo.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LineInfo message.
     * @function verify
     * @memberof LineInfo
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LineInfo.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nTimeDiffer != null && message.hasOwnProperty("nTimeDiffer"))
            if (!$util.isInteger(message.nTimeDiffer))
                return "nTimeDiffer: integer expected";
        if (!$util.isString(message.sLineName))
            return "sLineName: string expected";
        return null;
    };

    /**
     * Creates a LineInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LineInfo
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LineInfo} LineInfo
     */
    LineInfo.fromObject = function fromObject(object) {
        if (object instanceof $root.LineInfo)
            return object;
        var message = new $root.LineInfo();
        if (object.nTimeDiffer != null)
            message.nTimeDiffer = object.nTimeDiffer | 0;
        if (object.sLineName != null)
            message.sLineName = String(object.sLineName);
        return message;
    };

    /**
     * Creates a plain object from a LineInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LineInfo
     * @static
     * @param {LineInfo} message LineInfo
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LineInfo.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nTimeDiffer = 0;
            object.sLineName = "";
        }
        if (message.nTimeDiffer != null && message.hasOwnProperty("nTimeDiffer"))
            object.nTimeDiffer = message.nTimeDiffer;
        if (message.sLineName != null && message.hasOwnProperty("sLineName"))
            object.sLineName = message.sLineName;
        return object;
    };

    /**
     * Converts this LineInfo to JSON.
     * @function toJSON
     * @memberof LineInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LineInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LineInfo;
})();

$root.LineCheckReq = (function() {

    /**
     * Properties of a LineCheckReq.
     * @exports ILineCheckReq
     * @interface ILineCheckReq
     * @property {number} nType LineCheckReq nType
     * @property {number} nUserId LineCheckReq nUserId
     * @property {number|null} [nSendTime] LineCheckReq nSendTime
     * @property {Array.<ILineInfo>|null} [arrLineInfo] LineCheckReq arrLineInfo
     */

    /**
     * Constructs a new LineCheckReq.
     * @exports LineCheckReq
     * @classdesc Represents a LineCheckReq.
     * @implements ILineCheckReq
     * @constructor
     * @param {ILineCheckReq=} [properties] Properties to set
     */
    function LineCheckReq(properties) {
        this.arrLineInfo = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LineCheckReq nType.
     * @member {number} nType
     * @memberof LineCheckReq
     * @instance
     */
    LineCheckReq.prototype.nType = 0;

    /**
     * LineCheckReq nUserId.
     * @member {number} nUserId
     * @memberof LineCheckReq
     * @instance
     */
    LineCheckReq.prototype.nUserId = 0;

    /**
     * LineCheckReq nSendTime.
     * @member {number} nSendTime
     * @memberof LineCheckReq
     * @instance
     */
    LineCheckReq.prototype.nSendTime = 0;

    /**
     * LineCheckReq arrLineInfo.
     * @member {Array.<ILineInfo>} arrLineInfo
     * @memberof LineCheckReq
     * @instance
     */
    LineCheckReq.prototype.arrLineInfo = $util.emptyArray;

    /**
     * Creates a new LineCheckReq instance using the specified properties.
     * @function create
     * @memberof LineCheckReq
     * @static
     * @param {ILineCheckReq=} [properties] Properties to set
     * @returns {LineCheckReq} LineCheckReq instance
     */
    LineCheckReq.create = function create(properties) {
        return new LineCheckReq(properties);
    };

    /**
     * Encodes the specified LineCheckReq message. Does not implicitly {@link LineCheckReq.verify|verify} messages.
     * @function encode
     * @memberof LineCheckReq
     * @static
     * @param {ILineCheckReq} message LineCheckReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineCheckReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nType);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nUserId);
        if (message.nSendTime != null && Object.hasOwnProperty.call(message, "nSendTime"))
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.nSendTime);
        if (message.arrLineInfo != null && message.arrLineInfo.length)
            for (var i = 0; i < message.arrLineInfo.length; ++i)
                $root.LineInfo.encode(message.arrLineInfo[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified LineCheckReq message, length delimited. Does not implicitly {@link LineCheckReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LineCheckReq
     * @static
     * @param {ILineCheckReq} message LineCheckReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineCheckReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LineCheckReq message from the specified reader or buffer.
     * @function decode
     * @memberof LineCheckReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LineCheckReq} LineCheckReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineCheckReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LineCheckReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nType = reader.int32();
                break;
            case 2:
                message.nUserId = reader.int32();
                break;
            case 3:
                message.nSendTime = reader.double();
                break;
            case 4:
                if (!(message.arrLineInfo && message.arrLineInfo.length))
                    message.arrLineInfo = [];
                message.arrLineInfo.push($root.LineInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        return message;
    };

    /**
     * Decodes a LineCheckReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LineCheckReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LineCheckReq} LineCheckReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineCheckReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LineCheckReq message.
     * @function verify
     * @memberof LineCheckReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LineCheckReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (message.nSendTime != null && message.hasOwnProperty("nSendTime"))
            if (typeof message.nSendTime !== "number")
                return "nSendTime: number expected";
        if (message.arrLineInfo != null && message.hasOwnProperty("arrLineInfo")) {
            if (!Array.isArray(message.arrLineInfo))
                return "arrLineInfo: array expected";
            for (var i = 0; i < message.arrLineInfo.length; ++i) {
                var error = $root.LineInfo.verify(message.arrLineInfo[i]);
                if (error)
                    return "arrLineInfo." + error;
            }
        }
        return null;
    };

    /**
     * Creates a LineCheckReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LineCheckReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LineCheckReq} LineCheckReq
     */
    LineCheckReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LineCheckReq)
            return object;
        var message = new $root.LineCheckReq();
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nSendTime != null)
            message.nSendTime = Number(object.nSendTime);
        if (object.arrLineInfo) {
            if (!Array.isArray(object.arrLineInfo))
                throw TypeError(".LineCheckReq.arrLineInfo: array expected");
            message.arrLineInfo = [];
            for (var i = 0; i < object.arrLineInfo.length; ++i) {
                if (typeof object.arrLineInfo[i] !== "object")
                    throw TypeError(".LineCheckReq.arrLineInfo: object expected");
                message.arrLineInfo[i] = $root.LineInfo.fromObject(object.arrLineInfo[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a LineCheckReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LineCheckReq
     * @static
     * @param {LineCheckReq} message LineCheckReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LineCheckReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrLineInfo = [];
        if (options.defaults) {
            object.nType = 0;
            object.nUserId = 0;
            object.nSendTime = 0;
        }
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nSendTime != null && message.hasOwnProperty("nSendTime"))
            object.nSendTime = options.json && !isFinite(message.nSendTime) ? String(message.nSendTime) : message.nSendTime;
        if (message.arrLineInfo && message.arrLineInfo.length) {
            object.arrLineInfo = [];
            for (var j = 0; j < message.arrLineInfo.length; ++j)
                object.arrLineInfo[j] = $root.LineInfo.toObject(message.arrLineInfo[j], options);
        }
        return object;
    };

    /**
     * Converts this LineCheckReq to JSON.
     * @function toJSON
     * @memberof LineCheckReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LineCheckReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LineCheckReq;
})();

$root.LineCheckRsp = (function() {

    /**
     * Properties of a LineCheckRsp.
     * @exports ILineCheckRsp
     * @interface ILineCheckRsp
     * @property {number|null} [nType] LineCheckRsp nType
     * @property {number|null} [nSendTime] LineCheckRsp nSendTime
     */

    /**
     * Constructs a new LineCheckRsp.
     * @exports LineCheckRsp
     * @classdesc Represents a LineCheckRsp.
     * @implements ILineCheckRsp
     * @constructor
     * @param {ILineCheckRsp=} [properties] Properties to set
     */
    function LineCheckRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LineCheckRsp nType.
     * @member {number} nType
     * @memberof LineCheckRsp
     * @instance
     */
    LineCheckRsp.prototype.nType = 0;

    /**
     * LineCheckRsp nSendTime.
     * @member {number} nSendTime
     * @memberof LineCheckRsp
     * @instance
     */
    LineCheckRsp.prototype.nSendTime = 0;

    /**
     * Creates a new LineCheckRsp instance using the specified properties.
     * @function create
     * @memberof LineCheckRsp
     * @static
     * @param {ILineCheckRsp=} [properties] Properties to set
     * @returns {LineCheckRsp} LineCheckRsp instance
     */
    LineCheckRsp.create = function create(properties) {
        return new LineCheckRsp(properties);
    };

    /**
     * Encodes the specified LineCheckRsp message. Does not implicitly {@link LineCheckRsp.verify|verify} messages.
     * @function encode
     * @memberof LineCheckRsp
     * @static
     * @param {ILineCheckRsp} message LineCheckRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineCheckRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nType);
        if (message.nSendTime != null && Object.hasOwnProperty.call(message, "nSendTime"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.nSendTime);
        return writer;
    };

    /**
     * Encodes the specified LineCheckRsp message, length delimited. Does not implicitly {@link LineCheckRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LineCheckRsp
     * @static
     * @param {ILineCheckRsp} message LineCheckRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LineCheckRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LineCheckRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LineCheckRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LineCheckRsp} LineCheckRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineCheckRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LineCheckRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nType = reader.int32();
                break;
            case 2:
                message.nSendTime = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LineCheckRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LineCheckRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LineCheckRsp} LineCheckRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LineCheckRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LineCheckRsp message.
     * @function verify
     * @memberof LineCheckRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LineCheckRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (message.nSendTime != null && message.hasOwnProperty("nSendTime"))
            if (typeof message.nSendTime !== "number")
                return "nSendTime: number expected";
        return null;
    };

    /**
     * Creates a LineCheckRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LineCheckRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LineCheckRsp} LineCheckRsp
     */
    LineCheckRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LineCheckRsp)
            return object;
        var message = new $root.LineCheckRsp();
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nSendTime != null)
            message.nSendTime = Number(object.nSendTime);
        return message;
    };

    /**
     * Creates a plain object from a LineCheckRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LineCheckRsp
     * @static
     * @param {LineCheckRsp} message LineCheckRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LineCheckRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nType = 0;
            object.nSendTime = 0;
        }
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nSendTime != null && message.hasOwnProperty("nSendTime"))
            object.nSendTime = options.json && !isFinite(message.nSendTime) ? String(message.nSendTime) : message.nSendTime;
        return object;
    };

    /**
     * Converts this LineCheckRsp to JSON.
     * @function toJSON
     * @memberof LineCheckRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LineCheckRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LineCheckRsp;
})();

$root.Person = (function() {

    /**
     * Properties of a Person.
     * @exports IPerson
     * @interface IPerson
     * @property {string} name Person name
     * @property {number} id Person id
     * @property {string|null} [email] Person email
     * @property {Array.<Person.IPhoneNumber>|null} [phone] Person phone
     */

    /**
     * Constructs a new Person.
     * @exports Person
     * @classdesc Represents a Person.
     * @implements IPerson
     * @constructor
     * @param {IPerson=} [properties] Properties to set
     */
    function Person(properties) {
        this.phone = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Person name.
     * @member {string} name
     * @memberof Person
     * @instance
     */
    Person.prototype.name = "";

    /**
     * Person id.
     * @member {number} id
     * @memberof Person
     * @instance
     */
    Person.prototype.id = 0;

    /**
     * Person email.
     * @member {string} email
     * @memberof Person
     * @instance
     */
    Person.prototype.email = "";

    /**
     * Person phone.
     * @member {Array.<Person.IPhoneNumber>} phone
     * @memberof Person
     * @instance
     */
    Person.prototype.phone = $util.emptyArray;

    /**
     * Creates a new Person instance using the specified properties.
     * @function create
     * @memberof Person
     * @static
     * @param {IPerson=} [properties] Properties to set
     * @returns {Person} Person instance
     */
    Person.create = function create(properties) {
        return new Person(properties);
    };

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @function encode
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.id);
        if (message.email != null && Object.hasOwnProperty.call(message, "email"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.email);
        if (message.phone != null && message.phone.length)
            for (var i = 0; i < message.phone.length; ++i)
                $root.Person.PhoneNumber.encode(message.phone[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Person message, length delimited. Does not implicitly {@link Person.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @function decode
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Person();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.id = reader.int32();
                break;
            case 3:
                message.email = reader.string();
                break;
            case 4:
                if (!(message.phone && message.phone.length))
                    message.phone = [];
                message.phone.push($root.Person.PhoneNumber.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("name"))
            throw $util.ProtocolError("missing required 'name'", { instance: message });
        if (!message.hasOwnProperty("id"))
            throw $util.ProtocolError("missing required 'id'", { instance: message });
        return message;
    };

    /**
     * Decodes a Person message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Person message.
     * @function verify
     * @memberof Person
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Person.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.name))
            return "name: string expected";
        if (!$util.isInteger(message.id))
            return "id: integer expected";
        if (message.email != null && message.hasOwnProperty("email"))
            if (!$util.isString(message.email))
                return "email: string expected";
        if (message.phone != null && message.hasOwnProperty("phone")) {
            if (!Array.isArray(message.phone))
                return "phone: array expected";
            for (var i = 0; i < message.phone.length; ++i) {
                var error = $root.Person.PhoneNumber.verify(message.phone[i]);
                if (error)
                    return "phone." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Person message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Person
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Person} Person
     */
    Person.fromObject = function fromObject(object) {
        if (object instanceof $root.Person)
            return object;
        var message = new $root.Person();
        if (object.name != null)
            message.name = String(object.name);
        if (object.id != null)
            message.id = object.id | 0;
        if (object.email != null)
            message.email = String(object.email);
        if (object.phone) {
            if (!Array.isArray(object.phone))
                throw TypeError(".Person.phone: array expected");
            message.phone = [];
            for (var i = 0; i < object.phone.length; ++i) {
                if (typeof object.phone[i] !== "object")
                    throw TypeError(".Person.phone: object expected");
                message.phone[i] = $root.Person.PhoneNumber.fromObject(object.phone[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Person message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Person
     * @static
     * @param {Person} message Person
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Person.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.phone = [];
        if (options.defaults) {
            object.name = "";
            object.id = 0;
            object.email = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.email != null && message.hasOwnProperty("email"))
            object.email = message.email;
        if (message.phone && message.phone.length) {
            object.phone = [];
            for (var j = 0; j < message.phone.length; ++j)
                object.phone[j] = $root.Person.PhoneNumber.toObject(message.phone[j], options);
        }
        return object;
    };

    /**
     * Converts this Person to JSON.
     * @function toJSON
     * @memberof Person
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Person.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * PhoneType enum.
     * @name Person.PhoneType
     * @enum {number}
     * @property {number} MOBILE=0 MOBILE value
     * @property {number} HOME=1 HOME value
     * @property {number} WORK=2 WORK value
     */
    Person.PhoneType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "MOBILE"] = 0;
        values[valuesById[1] = "HOME"] = 1;
        values[valuesById[2] = "WORK"] = 2;
        return values;
    })();

    Person.PhoneNumber = (function() {

        /**
         * Properties of a PhoneNumber.
         * @memberof Person
         * @interface IPhoneNumber
         * @property {string} number PhoneNumber number
         * @property {Person.PhoneType|null} [type] PhoneNumber type
         */

        /**
         * Constructs a new PhoneNumber.
         * @memberof Person
         * @classdesc Represents a PhoneNumber.
         * @implements IPhoneNumber
         * @constructor
         * @param {Person.IPhoneNumber=} [properties] Properties to set
         */
        function PhoneNumber(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PhoneNumber number.
         * @member {string} number
         * @memberof Person.PhoneNumber
         * @instance
         */
        PhoneNumber.prototype.number = "";

        /**
         * PhoneNumber type.
         * @member {Person.PhoneType} type
         * @memberof Person.PhoneNumber
         * @instance
         */
        PhoneNumber.prototype.type = 1;

        /**
         * Creates a new PhoneNumber instance using the specified properties.
         * @function create
         * @memberof Person.PhoneNumber
         * @static
         * @param {Person.IPhoneNumber=} [properties] Properties to set
         * @returns {Person.PhoneNumber} PhoneNumber instance
         */
        PhoneNumber.create = function create(properties) {
            return new PhoneNumber(properties);
        };

        /**
         * Encodes the specified PhoneNumber message. Does not implicitly {@link Person.PhoneNumber.verify|verify} messages.
         * @function encode
         * @memberof Person.PhoneNumber
         * @static
         * @param {Person.IPhoneNumber} message PhoneNumber message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PhoneNumber.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.number);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            return writer;
        };

        /**
         * Encodes the specified PhoneNumber message, length delimited. Does not implicitly {@link Person.PhoneNumber.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Person.PhoneNumber
         * @static
         * @param {Person.IPhoneNumber} message PhoneNumber message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PhoneNumber.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PhoneNumber message from the specified reader or buffer.
         * @function decode
         * @memberof Person.PhoneNumber
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Person.PhoneNumber} PhoneNumber
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PhoneNumber.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Person.PhoneNumber();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.number = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("number"))
                throw $util.ProtocolError("missing required 'number'", { instance: message });
            return message;
        };

        /**
         * Decodes a PhoneNumber message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Person.PhoneNumber
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Person.PhoneNumber} PhoneNumber
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PhoneNumber.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PhoneNumber message.
         * @function verify
         * @memberof Person.PhoneNumber
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PhoneNumber.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.number))
                return "number: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a PhoneNumber message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Person.PhoneNumber
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Person.PhoneNumber} PhoneNumber
         */
        PhoneNumber.fromObject = function fromObject(object) {
            if (object instanceof $root.Person.PhoneNumber)
                return object;
            var message = new $root.Person.PhoneNumber();
            if (object.number != null)
                message.number = String(object.number);
            switch (object.type) {
            case "MOBILE":
            case 0:
                message.type = 0;
                break;
            case "HOME":
            case 1:
                message.type = 1;
                break;
            case "WORK":
            case 2:
                message.type = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PhoneNumber message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Person.PhoneNumber
         * @static
         * @param {Person.PhoneNumber} message PhoneNumber
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PhoneNumber.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.number = "";
                object.type = options.enums === String ? "HOME" : 1;
            }
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.Person.PhoneType[message.type] : message.type;
            return object;
        };

        /**
         * Converts this PhoneNumber to JSON.
         * @function toJSON
         * @memberof Person.PhoneNumber
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PhoneNumber.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PhoneNumber;
    })();

    return Person;
})();

module.exports = $root;
