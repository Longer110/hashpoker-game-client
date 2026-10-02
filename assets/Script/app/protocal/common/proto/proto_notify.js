/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.MagicFaceMsg = (function() {

    /**
     * Properties of a MagicFaceMsg.
     * @exports IMagicFaceMsg
     * @interface IMagicFaceMsg
     * @property {number} MagicFace MagicFaceMsg MagicFace
     * @property {number} NeedGold MagicFaceMsg NeedGold
     */

    /**
     * Constructs a new MagicFaceMsg.
     * @exports MagicFaceMsg
     * @classdesc Represents a MagicFaceMsg.
     * @implements IMagicFaceMsg
     * @constructor
     * @param {IMagicFaceMsg=} [properties] Properties to set
     */
    function MagicFaceMsg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MagicFaceMsg MagicFace.
     * @member {number} MagicFace
     * @memberof MagicFaceMsg
     * @instance
     */
    MagicFaceMsg.prototype.MagicFace = -1;

    /**
     * MagicFaceMsg NeedGold.
     * @member {number} NeedGold
     * @memberof MagicFaceMsg
     * @instance
     */
    MagicFaceMsg.prototype.NeedGold = -1;

    /**
     * Creates a new MagicFaceMsg instance using the specified properties.
     * @function create
     * @memberof MagicFaceMsg
     * @static
     * @param {IMagicFaceMsg=} [properties] Properties to set
     * @returns {MagicFaceMsg} MagicFaceMsg instance
     */
    MagicFaceMsg.create = function create(properties) {
        return new MagicFaceMsg(properties);
    };

    /**
     * Encodes the specified MagicFaceMsg message. Does not implicitly {@link MagicFaceMsg.verify|verify} messages.
     * @function encode
     * @memberof MagicFaceMsg
     * @static
     * @param {IMagicFaceMsg} message MagicFaceMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MagicFaceMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.MagicFace);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.NeedGold);
        return writer;
    };

    /**
     * Encodes the specified MagicFaceMsg message, length delimited. Does not implicitly {@link MagicFaceMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MagicFaceMsg
     * @static
     * @param {IMagicFaceMsg} message MagicFaceMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MagicFaceMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MagicFaceMsg message from the specified reader or buffer.
     * @function decode
     * @memberof MagicFaceMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MagicFaceMsg} MagicFaceMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MagicFaceMsg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MagicFaceMsg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.MagicFace = reader.int32();
                break;
            case 2:
                message.NeedGold = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("MagicFace"))
            throw $util.ProtocolError("missing required 'MagicFace'", { instance: message });
        if (!message.hasOwnProperty("NeedGold"))
            throw $util.ProtocolError("missing required 'NeedGold'", { instance: message });
        return message;
    };

    /**
     * Decodes a MagicFaceMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MagicFaceMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MagicFaceMsg} MagicFaceMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MagicFaceMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MagicFaceMsg message.
     * @function verify
     * @memberof MagicFaceMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MagicFaceMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.MagicFace))
            return "MagicFace: integer expected";
        if (!$util.isInteger(message.NeedGold))
            return "NeedGold: integer expected";
        return null;
    };

    /**
     * Creates a MagicFaceMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MagicFaceMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MagicFaceMsg} MagicFaceMsg
     */
    MagicFaceMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.MagicFaceMsg)
            return object;
        var message = new $root.MagicFaceMsg();
        if (object.MagicFace != null)
            message.MagicFace = object.MagicFace | 0;
        if (object.NeedGold != null)
            message.NeedGold = object.NeedGold | 0;
        return message;
    };

    /**
     * Creates a plain object from a MagicFaceMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MagicFaceMsg
     * @static
     * @param {MagicFaceMsg} message MagicFaceMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MagicFaceMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.MagicFace = -1;
            object.NeedGold = -1;
        }
        if (message.MagicFace != null && message.hasOwnProperty("MagicFace"))
            object.MagicFace = message.MagicFace;
        if (message.NeedGold != null && message.hasOwnProperty("NeedGold"))
            object.NeedGold = message.NeedGold;
        return object;
    };

    /**
     * Converts this MagicFaceMsg to JSON.
     * @function toJSON
     * @memberof MagicFaceMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MagicFaceMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MagicFaceMsg;
})();

$root.REQ_User_Msg = (function() {

    /**
     * Properties of a REQ_User_Msg.
     * @exports IREQ_User_Msg
     * @interface IREQ_User_Msg
     * @property {number} UserID REQ_User_Msg UserID
     */

    /**
     * Constructs a new REQ_User_Msg.
     * @exports REQ_User_Msg
     * @classdesc Represents a REQ_User_Msg.
     * @implements IREQ_User_Msg
     * @constructor
     * @param {IREQ_User_Msg=} [properties] Properties to set
     */
    function REQ_User_Msg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * REQ_User_Msg UserID.
     * @member {number} UserID
     * @memberof REQ_User_Msg
     * @instance
     */
    REQ_User_Msg.prototype.UserID = 0;

    /**
     * Creates a new REQ_User_Msg instance using the specified properties.
     * @function create
     * @memberof REQ_User_Msg
     * @static
     * @param {IREQ_User_Msg=} [properties] Properties to set
     * @returns {REQ_User_Msg} REQ_User_Msg instance
     */
    REQ_User_Msg.create = function create(properties) {
        return new REQ_User_Msg(properties);
    };

    /**
     * Encodes the specified REQ_User_Msg message. Does not implicitly {@link REQ_User_Msg.verify|verify} messages.
     * @function encode
     * @memberof REQ_User_Msg
     * @static
     * @param {IREQ_User_Msg} message REQ_User_Msg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REQ_User_Msg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.UserID);
        return writer;
    };

    /**
     * Encodes the specified REQ_User_Msg message, length delimited. Does not implicitly {@link REQ_User_Msg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof REQ_User_Msg
     * @static
     * @param {IREQ_User_Msg} message REQ_User_Msg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REQ_User_Msg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a REQ_User_Msg message from the specified reader or buffer.
     * @function decode
     * @memberof REQ_User_Msg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {REQ_User_Msg} REQ_User_Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REQ_User_Msg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.REQ_User_Msg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.UserID = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("UserID"))
            throw $util.ProtocolError("missing required 'UserID'", { instance: message });
        return message;
    };

    /**
     * Decodes a REQ_User_Msg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof REQ_User_Msg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {REQ_User_Msg} REQ_User_Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REQ_User_Msg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a REQ_User_Msg message.
     * @function verify
     * @memberof REQ_User_Msg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    REQ_User_Msg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.UserID))
            return "UserID: integer expected";
        return null;
    };

    /**
     * Creates a REQ_User_Msg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof REQ_User_Msg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {REQ_User_Msg} REQ_User_Msg
     */
    REQ_User_Msg.fromObject = function fromObject(object) {
        if (object instanceof $root.REQ_User_Msg)
            return object;
        var message = new $root.REQ_User_Msg();
        if (object.UserID != null)
            message.UserID = object.UserID | 0;
        return message;
    };

    /**
     * Creates a plain object from a REQ_User_Msg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof REQ_User_Msg
     * @static
     * @param {REQ_User_Msg} message REQ_User_Msg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    REQ_User_Msg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.UserID = 0;
        if (message.UserID != null && message.hasOwnProperty("UserID"))
            object.UserID = message.UserID;
        return object;
    };

    /**
     * Converts this REQ_User_Msg to JSON.
     * @function toJSON
     * @memberof REQ_User_Msg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    REQ_User_Msg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return REQ_User_Msg;
})();

$root.REP_User_Msg = (function() {

    /**
     * Properties of a REP_User_Msg.
     * @exports IREP_User_Msg
     * @interface IREP_User_Msg
     * @property {number} UserID REP_User_Msg UserID
     * @property {number} Sex REP_User_Msg Sex
     * @property {string} Name REP_User_Msg Name
     * @property {number} Gold REP_User_Msg Gold
     * @property {number} Sid REP_User_Msg Sid
     * @property {Array.<IMagicFaceMsg>|null} [tMagicFaceArr] REP_User_Msg tMagicFaceArr
     */

    /**
     * Constructs a new REP_User_Msg.
     * @exports REP_User_Msg
     * @classdesc Represents a REP_User_Msg.
     * @implements IREP_User_Msg
     * @constructor
     * @param {IREP_User_Msg=} [properties] Properties to set
     */
    function REP_User_Msg(properties) {
        this.tMagicFaceArr = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * REP_User_Msg UserID.
     * @member {number} UserID
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.UserID = -1;

    /**
     * REP_User_Msg Sex.
     * @member {number} Sex
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.Sex = -1;

    /**
     * REP_User_Msg Name.
     * @member {string} Name
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.Name = "";

    /**
     * REP_User_Msg Gold.
     * @member {number} Gold
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.Gold = 0;

    /**
     * REP_User_Msg Sid.
     * @member {number} Sid
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.Sid = 0;

    /**
     * REP_User_Msg tMagicFaceArr.
     * @member {Array.<IMagicFaceMsg>} tMagicFaceArr
     * @memberof REP_User_Msg
     * @instance
     */
    REP_User_Msg.prototype.tMagicFaceArr = $util.emptyArray;

    /**
     * Creates a new REP_User_Msg instance using the specified properties.
     * @function create
     * @memberof REP_User_Msg
     * @static
     * @param {IREP_User_Msg=} [properties] Properties to set
     * @returns {REP_User_Msg} REP_User_Msg instance
     */
    REP_User_Msg.create = function create(properties) {
        return new REP_User_Msg(properties);
    };

    /**
     * Encodes the specified REP_User_Msg message. Does not implicitly {@link REP_User_Msg.verify|verify} messages.
     * @function encode
     * @memberof REP_User_Msg
     * @static
     * @param {IREP_User_Msg} message REP_User_Msg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Msg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.UserID);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.Sex);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.Name);
        writer.uint32(/* id 4, wireType 1 =*/33).double(message.Gold);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.Sid);
        if (message.tMagicFaceArr != null && message.tMagicFaceArr.length)
            for (var i = 0; i < message.tMagicFaceArr.length; ++i)
                $root.MagicFaceMsg.encode(message.tMagicFaceArr[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified REP_User_Msg message, length delimited. Does not implicitly {@link REP_User_Msg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof REP_User_Msg
     * @static
     * @param {IREP_User_Msg} message REP_User_Msg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Msg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a REP_User_Msg message from the specified reader or buffer.
     * @function decode
     * @memberof REP_User_Msg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {REP_User_Msg} REP_User_Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Msg.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.REP_User_Msg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.UserID = reader.int32();
                break;
            case 2:
                message.Sex = reader.int32();
                break;
            case 3:
                message.Name = reader.string();
                break;
            case 4:
                message.Gold = reader.double();
                break;
            case 5:
                message.Sid = reader.int32();
                break;
            case 6:
                if (!(message.tMagicFaceArr && message.tMagicFaceArr.length))
                    message.tMagicFaceArr = [];
                message.tMagicFaceArr.push($root.MagicFaceMsg.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("UserID"))
            throw $util.ProtocolError("missing required 'UserID'", { instance: message });
        if (!message.hasOwnProperty("Sex"))
            throw $util.ProtocolError("missing required 'Sex'", { instance: message });
        if (!message.hasOwnProperty("Name"))
            throw $util.ProtocolError("missing required 'Name'", { instance: message });
        if (!message.hasOwnProperty("Gold"))
            throw $util.ProtocolError("missing required 'Gold'", { instance: message });
        if (!message.hasOwnProperty("Sid"))
            throw $util.ProtocolError("missing required 'Sid'", { instance: message });
        return message;
    };

    /**
     * Decodes a REP_User_Msg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof REP_User_Msg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {REP_User_Msg} REP_User_Msg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Msg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a REP_User_Msg message.
     * @function verify
     * @memberof REP_User_Msg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    REP_User_Msg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.UserID))
            return "UserID: integer expected";
        if (!$util.isInteger(message.Sex))
            return "Sex: integer expected";
        if (!$util.isString(message.Name))
            return "Name: string expected";
        if (typeof message.Gold !== "number")
            return "Gold: number expected";
        if (!$util.isInteger(message.Sid))
            return "Sid: integer expected";
        if (message.tMagicFaceArr != null && message.hasOwnProperty("tMagicFaceArr")) {
            if (!Array.isArray(message.tMagicFaceArr))
                return "tMagicFaceArr: array expected";
            for (var i = 0; i < message.tMagicFaceArr.length; ++i) {
                var error = $root.MagicFaceMsg.verify(message.tMagicFaceArr[i]);
                if (error)
                    return "tMagicFaceArr." + error;
            }
        }
        return null;
    };

    /**
     * Creates a REP_User_Msg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof REP_User_Msg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {REP_User_Msg} REP_User_Msg
     */
    REP_User_Msg.fromObject = function fromObject(object) {
        if (object instanceof $root.REP_User_Msg)
            return object;
        var message = new $root.REP_User_Msg();
        if (object.UserID != null)
            message.UserID = object.UserID | 0;
        if (object.Sex != null)
            message.Sex = object.Sex | 0;
        if (object.Name != null)
            message.Name = String(object.Name);
        if (object.Gold != null)
            message.Gold = Number(object.Gold);
        if (object.Sid != null)
            message.Sid = object.Sid | 0;
        if (object.tMagicFaceArr) {
            if (!Array.isArray(object.tMagicFaceArr))
                throw TypeError(".REP_User_Msg.tMagicFaceArr: array expected");
            message.tMagicFaceArr = [];
            for (var i = 0; i < object.tMagicFaceArr.length; ++i) {
                if (typeof object.tMagicFaceArr[i] !== "object")
                    throw TypeError(".REP_User_Msg.tMagicFaceArr: object expected");
                message.tMagicFaceArr[i] = $root.MagicFaceMsg.fromObject(object.tMagicFaceArr[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a REP_User_Msg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof REP_User_Msg
     * @static
     * @param {REP_User_Msg} message REP_User_Msg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    REP_User_Msg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.tMagicFaceArr = [];
        if (options.defaults) {
            object.UserID = -1;
            object.Sex = -1;
            object.Name = "";
            object.Gold = 0;
            object.Sid = 0;
        }
        if (message.UserID != null && message.hasOwnProperty("UserID"))
            object.UserID = message.UserID;
        if (message.Sex != null && message.hasOwnProperty("Sex"))
            object.Sex = message.Sex;
        if (message.Name != null && message.hasOwnProperty("Name"))
            object.Name = message.Name;
        if (message.Gold != null && message.hasOwnProperty("Gold"))
            object.Gold = options.json && !isFinite(message.Gold) ? String(message.Gold) : message.Gold;
        if (message.Sid != null && message.hasOwnProperty("Sid"))
            object.Sid = message.Sid;
        if (message.tMagicFaceArr && message.tMagicFaceArr.length) {
            object.tMagicFaceArr = [];
            for (var j = 0; j < message.tMagicFaceArr.length; ++j)
                object.tMagicFaceArr[j] = $root.MagicFaceMsg.toObject(message.tMagicFaceArr[j], options);
        }
        return object;
    };

    /**
     * Converts this REP_User_Msg to JSON.
     * @function toJSON
     * @memberof REP_User_Msg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    REP_User_Msg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return REP_User_Msg;
})();

$root.UserMagicFace = (function() {

    /**
     * Properties of a UserMagicFace.
     * @exports IUserMagicFace
     * @interface IUserMagicFace
     * @property {number} Sid UserMagicFace Sid
     * @property {number} MagicFace UserMagicFace MagicFace
     */

    /**
     * Constructs a new UserMagicFace.
     * @exports UserMagicFace
     * @classdesc Represents a UserMagicFace.
     * @implements IUserMagicFace
     * @constructor
     * @param {IUserMagicFace=} [properties] Properties to set
     */
    function UserMagicFace(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserMagicFace Sid.
     * @member {number} Sid
     * @memberof UserMagicFace
     * @instance
     */
    UserMagicFace.prototype.Sid = -1;

    /**
     * UserMagicFace MagicFace.
     * @member {number} MagicFace
     * @memberof UserMagicFace
     * @instance
     */
    UserMagicFace.prototype.MagicFace = -1;

    /**
     * Creates a new UserMagicFace instance using the specified properties.
     * @function create
     * @memberof UserMagicFace
     * @static
     * @param {IUserMagicFace=} [properties] Properties to set
     * @returns {UserMagicFace} UserMagicFace instance
     */
    UserMagicFace.create = function create(properties) {
        return new UserMagicFace(properties);
    };

    /**
     * Encodes the specified UserMagicFace message. Does not implicitly {@link UserMagicFace.verify|verify} messages.
     * @function encode
     * @memberof UserMagicFace
     * @static
     * @param {IUserMagicFace} message UserMagicFace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserMagicFace.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Sid);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.MagicFace);
        return writer;
    };

    /**
     * Encodes the specified UserMagicFace message, length delimited. Does not implicitly {@link UserMagicFace.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserMagicFace
     * @static
     * @param {IUserMagicFace} message UserMagicFace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserMagicFace.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserMagicFace message from the specified reader or buffer.
     * @function decode
     * @memberof UserMagicFace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserMagicFace} UserMagicFace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserMagicFace.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserMagicFace();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Sid = reader.int32();
                break;
            case 2:
                message.MagicFace = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Sid"))
            throw $util.ProtocolError("missing required 'Sid'", { instance: message });
        if (!message.hasOwnProperty("MagicFace"))
            throw $util.ProtocolError("missing required 'MagicFace'", { instance: message });
        return message;
    };

    /**
     * Decodes a UserMagicFace message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserMagicFace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserMagicFace} UserMagicFace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserMagicFace.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserMagicFace message.
     * @function verify
     * @memberof UserMagicFace
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserMagicFace.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Sid))
            return "Sid: integer expected";
        if (!$util.isInteger(message.MagicFace))
            return "MagicFace: integer expected";
        return null;
    };

    /**
     * Creates a UserMagicFace message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserMagicFace
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserMagicFace} UserMagicFace
     */
    UserMagicFace.fromObject = function fromObject(object) {
        if (object instanceof $root.UserMagicFace)
            return object;
        var message = new $root.UserMagicFace();
        if (object.Sid != null)
            message.Sid = object.Sid | 0;
        if (object.MagicFace != null)
            message.MagicFace = object.MagicFace | 0;
        return message;
    };

    /**
     * Creates a plain object from a UserMagicFace message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserMagicFace
     * @static
     * @param {UserMagicFace} message UserMagicFace
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserMagicFace.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Sid = -1;
            object.MagicFace = -1;
        }
        if (message.Sid != null && message.hasOwnProperty("Sid"))
            object.Sid = message.Sid;
        if (message.MagicFace != null && message.hasOwnProperty("MagicFace"))
            object.MagicFace = message.MagicFace;
        return object;
    };

    /**
     * Converts this UserMagicFace to JSON.
     * @function toJSON
     * @memberof UserMagicFace
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserMagicFace.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserMagicFace;
})();

$root.REQ_User_Face = (function() {

    /**
     * Properties of a REQ_User_Face.
     * @exports IREQ_User_Face
     * @interface IREQ_User_Face
     * @property {IUserMagicFace} tMagicFace REQ_User_Face tMagicFace
     */

    /**
     * Constructs a new REQ_User_Face.
     * @exports REQ_User_Face
     * @classdesc Represents a REQ_User_Face.
     * @implements IREQ_User_Face
     * @constructor
     * @param {IREQ_User_Face=} [properties] Properties to set
     */
    function REQ_User_Face(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * REQ_User_Face tMagicFace.
     * @member {IUserMagicFace} tMagicFace
     * @memberof REQ_User_Face
     * @instance
     */
    REQ_User_Face.prototype.tMagicFace = null;

    /**
     * Creates a new REQ_User_Face instance using the specified properties.
     * @function create
     * @memberof REQ_User_Face
     * @static
     * @param {IREQ_User_Face=} [properties] Properties to set
     * @returns {REQ_User_Face} REQ_User_Face instance
     */
    REQ_User_Face.create = function create(properties) {
        return new REQ_User_Face(properties);
    };

    /**
     * Encodes the specified REQ_User_Face message. Does not implicitly {@link REQ_User_Face.verify|verify} messages.
     * @function encode
     * @memberof REQ_User_Face
     * @static
     * @param {IREQ_User_Face} message REQ_User_Face message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REQ_User_Face.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        $root.UserMagicFace.encode(message.tMagicFace, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified REQ_User_Face message, length delimited. Does not implicitly {@link REQ_User_Face.verify|verify} messages.
     * @function encodeDelimited
     * @memberof REQ_User_Face
     * @static
     * @param {IREQ_User_Face} message REQ_User_Face message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REQ_User_Face.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a REQ_User_Face message from the specified reader or buffer.
     * @function decode
     * @memberof REQ_User_Face
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {REQ_User_Face} REQ_User_Face
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REQ_User_Face.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.REQ_User_Face();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.tMagicFace = $root.UserMagicFace.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("tMagicFace"))
            throw $util.ProtocolError("missing required 'tMagicFace'", { instance: message });
        return message;
    };

    /**
     * Decodes a REQ_User_Face message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof REQ_User_Face
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {REQ_User_Face} REQ_User_Face
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REQ_User_Face.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a REQ_User_Face message.
     * @function verify
     * @memberof REQ_User_Face
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    REQ_User_Face.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        {
            var error = $root.UserMagicFace.verify(message.tMagicFace);
            if (error)
                return "tMagicFace." + error;
        }
        return null;
    };

    /**
     * Creates a REQ_User_Face message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof REQ_User_Face
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {REQ_User_Face} REQ_User_Face
     */
    REQ_User_Face.fromObject = function fromObject(object) {
        if (object instanceof $root.REQ_User_Face)
            return object;
        var message = new $root.REQ_User_Face();
        if (object.tMagicFace != null) {
            if (typeof object.tMagicFace !== "object")
                throw TypeError(".REQ_User_Face.tMagicFace: object expected");
            message.tMagicFace = $root.UserMagicFace.fromObject(object.tMagicFace);
        }
        return message;
    };

    /**
     * Creates a plain object from a REQ_User_Face message. Also converts values to other types if specified.
     * @function toObject
     * @memberof REQ_User_Face
     * @static
     * @param {REQ_User_Face} message REQ_User_Face
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    REQ_User_Face.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.tMagicFace = null;
        if (message.tMagicFace != null && message.hasOwnProperty("tMagicFace"))
            object.tMagicFace = $root.UserMagicFace.toObject(message.tMagicFace, options);
        return object;
    };

    /**
     * Converts this REQ_User_Face to JSON.
     * @function toJSON
     * @memberof REQ_User_Face
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    REQ_User_Face.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return REQ_User_Face;
})();

$root.REP_User_Face = (function() {

    /**
     * Properties of a REP_User_Face.
     * @exports IREP_User_Face
     * @interface IREP_User_Face
     * @property {number} Result REP_User_Face Result
     */

    /**
     * Constructs a new REP_User_Face.
     * @exports REP_User_Face
     * @classdesc Represents a REP_User_Face.
     * @implements IREP_User_Face
     * @constructor
     * @param {IREP_User_Face=} [properties] Properties to set
     */
    function REP_User_Face(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * REP_User_Face Result.
     * @member {number} Result
     * @memberof REP_User_Face
     * @instance
     */
    REP_User_Face.prototype.Result = 0;

    /**
     * Creates a new REP_User_Face instance using the specified properties.
     * @function create
     * @memberof REP_User_Face
     * @static
     * @param {IREP_User_Face=} [properties] Properties to set
     * @returns {REP_User_Face} REP_User_Face instance
     */
    REP_User_Face.create = function create(properties) {
        return new REP_User_Face(properties);
    };

    /**
     * Encodes the specified REP_User_Face message. Does not implicitly {@link REP_User_Face.verify|verify} messages.
     * @function encode
     * @memberof REP_User_Face
     * @static
     * @param {IREP_User_Face} message REP_User_Face message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Face.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Result);
        return writer;
    };

    /**
     * Encodes the specified REP_User_Face message, length delimited. Does not implicitly {@link REP_User_Face.verify|verify} messages.
     * @function encodeDelimited
     * @memberof REP_User_Face
     * @static
     * @param {IREP_User_Face} message REP_User_Face message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Face.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a REP_User_Face message from the specified reader or buffer.
     * @function decode
     * @memberof REP_User_Face
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {REP_User_Face} REP_User_Face
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Face.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.REP_User_Face();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Result = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Result"))
            throw $util.ProtocolError("missing required 'Result'", { instance: message });
        return message;
    };

    /**
     * Decodes a REP_User_Face message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof REP_User_Face
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {REP_User_Face} REP_User_Face
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Face.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a REP_User_Face message.
     * @function verify
     * @memberof REP_User_Face
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    REP_User_Face.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Result))
            return "Result: integer expected";
        return null;
    };

    /**
     * Creates a REP_User_Face message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof REP_User_Face
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {REP_User_Face} REP_User_Face
     */
    REP_User_Face.fromObject = function fromObject(object) {
        if (object instanceof $root.REP_User_Face)
            return object;
        var message = new $root.REP_User_Face();
        if (object.Result != null)
            message.Result = object.Result | 0;
        return message;
    };

    /**
     * Creates a plain object from a REP_User_Face message. Also converts values to other types if specified.
     * @function toObject
     * @memberof REP_User_Face
     * @static
     * @param {REP_User_Face} message REP_User_Face
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    REP_User_Face.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.Result = 0;
        if (message.Result != null && message.hasOwnProperty("Result"))
            object.Result = message.Result;
        return object;
    };

    /**
     * Converts this REP_User_Face to JSON.
     * @function toJSON
     * @memberof REP_User_Face
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    REP_User_Face.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return REP_User_Face;
})();

$root.REP_User_Face_All = (function() {

    /**
     * Properties of a REP_User_Face_All.
     * @exports IREP_User_Face_All
     * @interface IREP_User_Face_All
     * @property {number} Sid REP_User_Face_All Sid
     * @property {number} SidTarget REP_User_Face_All SidTarget
     * @property {number} MagicFace REP_User_Face_All MagicFace
     */

    /**
     * Constructs a new REP_User_Face_All.
     * @exports REP_User_Face_All
     * @classdesc Represents a REP_User_Face_All.
     * @implements IREP_User_Face_All
     * @constructor
     * @param {IREP_User_Face_All=} [properties] Properties to set
     */
    function REP_User_Face_All(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * REP_User_Face_All Sid.
     * @member {number} Sid
     * @memberof REP_User_Face_All
     * @instance
     */
    REP_User_Face_All.prototype.Sid = 0;

    /**
     * REP_User_Face_All SidTarget.
     * @member {number} SidTarget
     * @memberof REP_User_Face_All
     * @instance
     */
    REP_User_Face_All.prototype.SidTarget = 0;

    /**
     * REP_User_Face_All MagicFace.
     * @member {number} MagicFace
     * @memberof REP_User_Face_All
     * @instance
     */
    REP_User_Face_All.prototype.MagicFace = 0;

    /**
     * Creates a new REP_User_Face_All instance using the specified properties.
     * @function create
     * @memberof REP_User_Face_All
     * @static
     * @param {IREP_User_Face_All=} [properties] Properties to set
     * @returns {REP_User_Face_All} REP_User_Face_All instance
     */
    REP_User_Face_All.create = function create(properties) {
        return new REP_User_Face_All(properties);
    };

    /**
     * Encodes the specified REP_User_Face_All message. Does not implicitly {@link REP_User_Face_All.verify|verify} messages.
     * @function encode
     * @memberof REP_User_Face_All
     * @static
     * @param {IREP_User_Face_All} message REP_User_Face_All message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Face_All.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Sid);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.SidTarget);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.MagicFace);
        return writer;
    };

    /**
     * Encodes the specified REP_User_Face_All message, length delimited. Does not implicitly {@link REP_User_Face_All.verify|verify} messages.
     * @function encodeDelimited
     * @memberof REP_User_Face_All
     * @static
     * @param {IREP_User_Face_All} message REP_User_Face_All message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    REP_User_Face_All.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a REP_User_Face_All message from the specified reader or buffer.
     * @function decode
     * @memberof REP_User_Face_All
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {REP_User_Face_All} REP_User_Face_All
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Face_All.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.REP_User_Face_All();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Sid = reader.int32();
                break;
            case 2:
                message.SidTarget = reader.int32();
                break;
            case 3:
                message.MagicFace = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Sid"))
            throw $util.ProtocolError("missing required 'Sid'", { instance: message });
        if (!message.hasOwnProperty("SidTarget"))
            throw $util.ProtocolError("missing required 'SidTarget'", { instance: message });
        if (!message.hasOwnProperty("MagicFace"))
            throw $util.ProtocolError("missing required 'MagicFace'", { instance: message });
        return message;
    };

    /**
     * Decodes a REP_User_Face_All message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof REP_User_Face_All
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {REP_User_Face_All} REP_User_Face_All
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    REP_User_Face_All.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a REP_User_Face_All message.
     * @function verify
     * @memberof REP_User_Face_All
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    REP_User_Face_All.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Sid))
            return "Sid: integer expected";
        if (!$util.isInteger(message.SidTarget))
            return "SidTarget: integer expected";
        if (!$util.isInteger(message.MagicFace))
            return "MagicFace: integer expected";
        return null;
    };

    /**
     * Creates a REP_User_Face_All message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof REP_User_Face_All
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {REP_User_Face_All} REP_User_Face_All
     */
    REP_User_Face_All.fromObject = function fromObject(object) {
        if (object instanceof $root.REP_User_Face_All)
            return object;
        var message = new $root.REP_User_Face_All();
        if (object.Sid != null)
            message.Sid = object.Sid | 0;
        if (object.SidTarget != null)
            message.SidTarget = object.SidTarget | 0;
        if (object.MagicFace != null)
            message.MagicFace = object.MagicFace | 0;
        return message;
    };

    /**
     * Creates a plain object from a REP_User_Face_All message. Also converts values to other types if specified.
     * @function toObject
     * @memberof REP_User_Face_All
     * @static
     * @param {REP_User_Face_All} message REP_User_Face_All
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    REP_User_Face_All.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Sid = 0;
            object.SidTarget = 0;
            object.MagicFace = 0;
        }
        if (message.Sid != null && message.hasOwnProperty("Sid"))
            object.Sid = message.Sid;
        if (message.SidTarget != null && message.hasOwnProperty("SidTarget"))
            object.SidTarget = message.SidTarget;
        if (message.MagicFace != null && message.hasOwnProperty("MagicFace"))
            object.MagicFace = message.MagicFace;
        return object;
    };

    /**
     * Converts this REP_User_Face_All to JSON.
     * @function toJSON
     * @memberof REP_User_Face_All
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    REP_User_Face_All.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return REP_User_Face_All;
})();

$root.NotifyCli_Proto = (function() {

    /**
     * Properties of a NotifyCli_Proto.
     * @exports INotifyCli_Proto
     * @interface INotifyCli_Proto
     * @property {number} Main_CMD NotifyCli_Proto Main_CMD
     * @property {number} RepeatLogonNotify_CMD NotifyCli_Proto RepeatLogonNotify_CMD
     * @property {number} PlayingNotify_CMD NotifyCli_Proto PlayingNotify_CMD
     */

    /**
     * Constructs a new NotifyCli_Proto.
     * @exports NotifyCli_Proto
     * @classdesc Represents a NotifyCli_Proto.
     * @implements INotifyCli_Proto
     * @constructor
     * @param {INotifyCli_Proto=} [properties] Properties to set
     */
    function NotifyCli_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NotifyCli_Proto Main_CMD.
     * @member {number} Main_CMD
     * @memberof NotifyCli_Proto
     * @instance
     */
    NotifyCli_Proto.prototype.Main_CMD = 1100;

    /**
     * NotifyCli_Proto RepeatLogonNotify_CMD.
     * @member {number} RepeatLogonNotify_CMD
     * @memberof NotifyCli_Proto
     * @instance
     */
    NotifyCli_Proto.prototype.RepeatLogonNotify_CMD = 1;

    /**
     * NotifyCli_Proto PlayingNotify_CMD.
     * @member {number} PlayingNotify_CMD
     * @memberof NotifyCli_Proto
     * @instance
     */
    NotifyCli_Proto.prototype.PlayingNotify_CMD = 2;

    /**
     * Creates a new NotifyCli_Proto instance using the specified properties.
     * @function create
     * @memberof NotifyCli_Proto
     * @static
     * @param {INotifyCli_Proto=} [properties] Properties to set
     * @returns {NotifyCli_Proto} NotifyCli_Proto instance
     */
    NotifyCli_Proto.create = function create(properties) {
        return new NotifyCli_Proto(properties);
    };

    /**
     * Encodes the specified NotifyCli_Proto message. Does not implicitly {@link NotifyCli_Proto.verify|verify} messages.
     * @function encode
     * @memberof NotifyCli_Proto
     * @static
     * @param {INotifyCli_Proto} message NotifyCli_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NotifyCli_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.RepeatLogonNotify_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.PlayingNotify_CMD);
        return writer;
    };

    /**
     * Encodes the specified NotifyCli_Proto message, length delimited. Does not implicitly {@link NotifyCli_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NotifyCli_Proto
     * @static
     * @param {INotifyCli_Proto} message NotifyCli_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NotifyCli_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NotifyCli_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof NotifyCli_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NotifyCli_Proto} NotifyCli_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NotifyCli_Proto.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyCli_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Main_CMD = reader.int32();
                break;
            case 2:
                message.RepeatLogonNotify_CMD = reader.int32();
                break;
            case 3:
                message.PlayingNotify_CMD = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("RepeatLogonNotify_CMD"))
            throw $util.ProtocolError("missing required 'RepeatLogonNotify_CMD'", { instance: message });
        if (!message.hasOwnProperty("PlayingNotify_CMD"))
            throw $util.ProtocolError("missing required 'PlayingNotify_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a NotifyCli_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NotifyCli_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NotifyCli_Proto} NotifyCli_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NotifyCli_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NotifyCli_Proto message.
     * @function verify
     * @memberof NotifyCli_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NotifyCli_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.RepeatLogonNotify_CMD))
            return "RepeatLogonNotify_CMD: integer expected";
        if (!$util.isInteger(message.PlayingNotify_CMD))
            return "PlayingNotify_CMD: integer expected";
        return null;
    };

    /**
     * Creates a NotifyCli_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NotifyCli_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NotifyCli_Proto} NotifyCli_Proto
     */
    NotifyCli_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.NotifyCli_Proto)
            return object;
        var message = new $root.NotifyCli_Proto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.RepeatLogonNotify_CMD != null)
            message.RepeatLogonNotify_CMD = object.RepeatLogonNotify_CMD | 0;
        if (object.PlayingNotify_CMD != null)
            message.PlayingNotify_CMD = object.PlayingNotify_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a NotifyCli_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NotifyCli_Proto
     * @static
     * @param {NotifyCli_Proto} message NotifyCli_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NotifyCli_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 1100;
            object.RepeatLogonNotify_CMD = 1;
            object.PlayingNotify_CMD = 2;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.RepeatLogonNotify_CMD != null && message.hasOwnProperty("RepeatLogonNotify_CMD"))
            object.RepeatLogonNotify_CMD = message.RepeatLogonNotify_CMD;
        if (message.PlayingNotify_CMD != null && message.hasOwnProperty("PlayingNotify_CMD"))
            object.PlayingNotify_CMD = message.PlayingNotify_CMD;
        return object;
    };

    /**
     * Converts this NotifyCli_Proto to JSON.
     * @function toJSON
     * @memberof NotifyCli_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NotifyCli_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NotifyCli_Proto;
})();

$root.RepeatLogonNotify = (function() {

    /**
     * Properties of a RepeatLogonNotify.
     * @exports IRepeatLogonNotify
     * @interface IRepeatLogonNotify
     * @property {number} nSecondsToClose RepeatLogonNotify nSecondsToClose
     */

    /**
     * Constructs a new RepeatLogonNotify.
     * @exports RepeatLogonNotify
     * @classdesc Represents a RepeatLogonNotify.
     * @implements IRepeatLogonNotify
     * @constructor
     * @param {IRepeatLogonNotify=} [properties] Properties to set
     */
    function RepeatLogonNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RepeatLogonNotify nSecondsToClose.
     * @member {number} nSecondsToClose
     * @memberof RepeatLogonNotify
     * @instance
     */
    RepeatLogonNotify.prototype.nSecondsToClose = 0;

    /**
     * Creates a new RepeatLogonNotify instance using the specified properties.
     * @function create
     * @memberof RepeatLogonNotify
     * @static
     * @param {IRepeatLogonNotify=} [properties] Properties to set
     * @returns {RepeatLogonNotify} RepeatLogonNotify instance
     */
    RepeatLogonNotify.create = function create(properties) {
        return new RepeatLogonNotify(properties);
    };

    /**
     * Encodes the specified RepeatLogonNotify message. Does not implicitly {@link RepeatLogonNotify.verify|verify} messages.
     * @function encode
     * @memberof RepeatLogonNotify
     * @static
     * @param {IRepeatLogonNotify} message RepeatLogonNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RepeatLogonNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nSecondsToClose);
        return writer;
    };

    /**
     * Encodes the specified RepeatLogonNotify message, length delimited. Does not implicitly {@link RepeatLogonNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RepeatLogonNotify
     * @static
     * @param {IRepeatLogonNotify} message RepeatLogonNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RepeatLogonNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RepeatLogonNotify message from the specified reader or buffer.
     * @function decode
     * @memberof RepeatLogonNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RepeatLogonNotify} RepeatLogonNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RepeatLogonNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RepeatLogonNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nSecondsToClose = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nSecondsToClose"))
            throw $util.ProtocolError("missing required 'nSecondsToClose'", { instance: message });
        return message;
    };

    /**
     * Decodes a RepeatLogonNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RepeatLogonNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RepeatLogonNotify} RepeatLogonNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RepeatLogonNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RepeatLogonNotify message.
     * @function verify
     * @memberof RepeatLogonNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RepeatLogonNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nSecondsToClose))
            return "nSecondsToClose: integer expected";
        return null;
    };

    /**
     * Creates a RepeatLogonNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RepeatLogonNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RepeatLogonNotify} RepeatLogonNotify
     */
    RepeatLogonNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.RepeatLogonNotify)
            return object;
        var message = new $root.RepeatLogonNotify();
        if (object.nSecondsToClose != null)
            message.nSecondsToClose = object.nSecondsToClose | 0;
        return message;
    };

    /**
     * Creates a plain object from a RepeatLogonNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RepeatLogonNotify
     * @static
     * @param {RepeatLogonNotify} message RepeatLogonNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RepeatLogonNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nSecondsToClose = 0;
        if (message.nSecondsToClose != null && message.hasOwnProperty("nSecondsToClose"))
            object.nSecondsToClose = message.nSecondsToClose;
        return object;
    };

    /**
     * Converts this RepeatLogonNotify to JSON.
     * @function toJSON
     * @memberof RepeatLogonNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RepeatLogonNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RepeatLogonNotify;
})();

$root.PlayingNotify = (function() {

    /**
     * Properties of a PlayingNotify.
     * @exports IPlayingNotify
     * @interface IPlayingNotify
     * @property {number} nGameId PlayingNotify nGameId
     * @property {number|null} [nRoomId] PlayingNotify nRoomId
     */

    /**
     * Constructs a new PlayingNotify.
     * @exports PlayingNotify
     * @classdesc Represents a PlayingNotify.
     * @implements IPlayingNotify
     * @constructor
     * @param {IPlayingNotify=} [properties] Properties to set
     */
    function PlayingNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PlayingNotify nGameId.
     * @member {number} nGameId
     * @memberof PlayingNotify
     * @instance
     */
    PlayingNotify.prototype.nGameId = 0;

    /**
     * PlayingNotify nRoomId.
     * @member {number} nRoomId
     * @memberof PlayingNotify
     * @instance
     */
    PlayingNotify.prototype.nRoomId = 0;

    /**
     * Creates a new PlayingNotify instance using the specified properties.
     * @function create
     * @memberof PlayingNotify
     * @static
     * @param {IPlayingNotify=} [properties] Properties to set
     * @returns {PlayingNotify} PlayingNotify instance
     */
    PlayingNotify.create = function create(properties) {
        return new PlayingNotify(properties);
    };

    /**
     * Encodes the specified PlayingNotify message. Does not implicitly {@link PlayingNotify.verify|verify} messages.
     * @function encode
     * @memberof PlayingNotify
     * @static
     * @param {IPlayingNotify} message PlayingNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayingNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRoomId);
        return writer;
    };

    /**
     * Encodes the specified PlayingNotify message, length delimited. Does not implicitly {@link PlayingNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PlayingNotify
     * @static
     * @param {IPlayingNotify} message PlayingNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayingNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PlayingNotify message from the specified reader or buffer.
     * @function decode
     * @memberof PlayingNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PlayingNotify} PlayingNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayingNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PlayingNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGameId = reader.int32();
                break;
            case 2:
                message.nRoomId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nGameId"))
            throw $util.ProtocolError("missing required 'nGameId'", { instance: message });
        return message;
    };

    /**
     * Decodes a PlayingNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PlayingNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PlayingNotify} PlayingNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayingNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PlayingNotify message.
     * @function verify
     * @memberof PlayingNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PlayingNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            if (!$util.isInteger(message.nRoomId))
                return "nRoomId: integer expected";
        return null;
    };

    /**
     * Creates a PlayingNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PlayingNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PlayingNotify} PlayingNotify
     */
    PlayingNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.PlayingNotify)
            return object;
        var message = new $root.PlayingNotify();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nRoomId != null)
            message.nRoomId = object.nRoomId | 0;
        return message;
    };

    /**
     * Creates a plain object from a PlayingNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PlayingNotify
     * @static
     * @param {PlayingNotify} message PlayingNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PlayingNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nGameId = 0;
            object.nRoomId = 0;
        }
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            object.nRoomId = message.nRoomId;
        return object;
    };

    /**
     * Converts this PlayingNotify to JSON.
     * @function toJSON
     * @memberof PlayingNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PlayingNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PlayingNotify;
})();

module.exports = $root;
