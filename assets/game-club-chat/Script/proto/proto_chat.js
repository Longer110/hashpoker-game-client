    /*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Chat_Proto = (function() {

    /**
     * Properties of a Chat_Proto.
     * @exports IChat_Proto
     * @interface IChat_Proto
     * @property {number} Main_CMD Chat_Proto Main_CMD
     * @property {number} ChatLogonReq_CMD Chat_Proto ChatLogonReq_CMD
     * @property {number} ChatLogonRsp_CMD Chat_Proto ChatLogonRsp_CMD
     * @property {number} ChatBackToLobbyReq_CMD Chat_Proto ChatBackToLobbyReq_CMD
     * @property {number} ChatNotify_CMD Chat_Proto ChatNotify_CMD
     * @property {number} ChatChangeReq_CMD Chat_Proto ChatChangeReq_CMD
     * @property {number} ChatChangeRsp_CMD Chat_Proto ChatChangeRsp_CMD
     * @property {number} LogonZhiBoReq_CMD Chat_Proto LogonZhiBoReq_CMD
     * @property {number} LogonZhiBoRsp_CMD Chat_Proto LogonZhiBoRsp_CMD
     * @property {number} ZhiBoChatReq_CMD Chat_Proto ZhiBoChatReq_CMD
     * @property {number} ZhiBoChatRsp_CMD Chat_Proto ZhiBoChatRsp_CMD
     * @property {number} ClubChatAppKeyReq_CMD Chat_Proto ClubChatAppKeyReq_CMD
     * @property {number} ClubChatAppKeyRsp_CMD Chat_Proto ClubChatAppKeyRsp_CMD
     * @property {number} ChatVedioLogonReq_CMD Chat_Proto ChatVedioLogonReq_CMD
     * @property {number} ChatVedioLogonRsp_CMD Chat_Proto ChatVedioLogonRsp_CMD
     */

    /**
     * Constructs a new Chat_Proto.
     * @exports Chat_Proto
     * @classdesc Represents a Chat_Proto.
     * @implements IChat_Proto
     * @constructor
     * @param {IChat_Proto=} [properties] Properties to set
     */
    function Chat_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Chat_Proto Main_CMD.
     * @member {number} Main_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.Main_CMD = 110;

    /**
     * Chat_Proto ChatLogonReq_CMD.
     * @member {number} ChatLogonReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatLogonReq_CMD = 2;

    /**
     * Chat_Proto ChatLogonRsp_CMD.
     * @member {number} ChatLogonRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatLogonRsp_CMD = 3;

    /**
     * Chat_Proto ChatBackToLobbyReq_CMD.
     * @member {number} ChatBackToLobbyReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatBackToLobbyReq_CMD = 4;

    /**
     * Chat_Proto ChatNotify_CMD.
     * @member {number} ChatNotify_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatNotify_CMD = 5;

    /**
     * Chat_Proto ChatChangeReq_CMD.
     * @member {number} ChatChangeReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatChangeReq_CMD = 6;

    /**
     * Chat_Proto ChatChangeRsp_CMD.
     * @member {number} ChatChangeRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatChangeRsp_CMD = 7;

    /**
     * Chat_Proto LogonZhiBoReq_CMD.
     * @member {number} LogonZhiBoReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.LogonZhiBoReq_CMD = 8;

    /**
     * Chat_Proto LogonZhiBoRsp_CMD.
     * @member {number} LogonZhiBoRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.LogonZhiBoRsp_CMD = 9;

    /**
     * Chat_Proto ZhiBoChatReq_CMD.
     * @member {number} ZhiBoChatReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ZhiBoChatReq_CMD = 10;

    /**
     * Chat_Proto ZhiBoChatRsp_CMD.
     * @member {number} ZhiBoChatRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ZhiBoChatRsp_CMD = 11;

    /**
     * Chat_Proto ClubChatAppKeyReq_CMD.
     * @member {number} ClubChatAppKeyReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ClubChatAppKeyReq_CMD = 12;

    /**
     * Chat_Proto ClubChatAppKeyRsp_CMD.
     * @member {number} ClubChatAppKeyRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ClubChatAppKeyRsp_CMD = 13;

    /**
     * Chat_Proto ChatVedioLogonReq_CMD.
     * @member {number} ChatVedioLogonReq_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatVedioLogonReq_CMD = 14;

    /**
     * Chat_Proto ChatVedioLogonRsp_CMD.
     * @member {number} ChatVedioLogonRsp_CMD
     * @memberof Chat_Proto
     * @instance
     */
    Chat_Proto.prototype.ChatVedioLogonRsp_CMD = 15;

    /**
     * Creates a new Chat_Proto instance using the specified properties.
     * @function create
     * @memberof Chat_Proto
     * @static
     * @param {IChat_Proto=} [properties] Properties to set
     * @returns {Chat_Proto} Chat_Proto instance
     */
    Chat_Proto.create = function create(properties) {
        return new Chat_Proto(properties);
    };

    /**
     * Encodes the specified Chat_Proto message. Does not implicitly {@link Chat_Proto.verify|verify} messages.
     * @function encode
     * @memberof Chat_Proto
     * @static
     * @param {IChat_Proto} message Chat_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Chat_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.ChatLogonReq_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.ChatLogonRsp_CMD);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.ChatBackToLobbyReq_CMD);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.ChatNotify_CMD);
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.ChatChangeReq_CMD);
        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.ChatChangeRsp_CMD);
        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.LogonZhiBoReq_CMD);
        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.LogonZhiBoRsp_CMD);
        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.ZhiBoChatReq_CMD);
        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.ZhiBoChatRsp_CMD);
        writer.uint32(/* id 12, wireType 0 =*/96).int32(message.ClubChatAppKeyReq_CMD);
        writer.uint32(/* id 13, wireType 0 =*/104).int32(message.ClubChatAppKeyRsp_CMD);
        writer.uint32(/* id 14, wireType 0 =*/112).int32(message.ChatVedioLogonReq_CMD);
        writer.uint32(/* id 15, wireType 0 =*/120).int32(message.ChatVedioLogonRsp_CMD);
        return writer;
    };

    /**
     * Encodes the specified Chat_Proto message, length delimited. Does not implicitly {@link Chat_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Chat_Proto
     * @static
     * @param {IChat_Proto} message Chat_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Chat_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Chat_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Chat_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Chat_Proto} Chat_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Chat_Proto.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Chat_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.Main_CMD = reader.int32();
                    break;
                }
            case 2: {
                    message.ChatLogonReq_CMD = reader.int32();
                    break;
                }
            case 3: {
                    message.ChatLogonRsp_CMD = reader.int32();
                    break;
                }
            case 4: {
                    message.ChatBackToLobbyReq_CMD = reader.int32();
                    break;
                }
            case 5: {
                    message.ChatNotify_CMD = reader.int32();
                    break;
                }
            case 6: {
                    message.ChatChangeReq_CMD = reader.int32();
                    break;
                }
            case 7: {
                    message.ChatChangeRsp_CMD = reader.int32();
                    break;
                }
            case 8: {
                    message.LogonZhiBoReq_CMD = reader.int32();
                    break;
                }
            case 9: {
                    message.LogonZhiBoRsp_CMD = reader.int32();
                    break;
                }
            case 10: {
                    message.ZhiBoChatReq_CMD = reader.int32();
                    break;
                }
            case 11: {
                    message.ZhiBoChatRsp_CMD = reader.int32();
                    break;
                }
            case 12: {
                    message.ClubChatAppKeyReq_CMD = reader.int32();
                    break;
                }
            case 13: {
                    message.ClubChatAppKeyRsp_CMD = reader.int32();
                    break;
                }
            case 14: {
                    message.ChatVedioLogonReq_CMD = reader.int32();
                    break;
                }
            case 15: {
                    message.ChatVedioLogonRsp_CMD = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatLogonReq_CMD"))
            throw $util.ProtocolError("missing required 'ChatLogonReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatLogonRsp_CMD"))
            throw $util.ProtocolError("missing required 'ChatLogonRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatBackToLobbyReq_CMD"))
            throw $util.ProtocolError("missing required 'ChatBackToLobbyReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatNotify_CMD"))
            throw $util.ProtocolError("missing required 'ChatNotify_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatChangeReq_CMD"))
            throw $util.ProtocolError("missing required 'ChatChangeReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatChangeRsp_CMD"))
            throw $util.ProtocolError("missing required 'ChatChangeRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogonZhiBoReq_CMD"))
            throw $util.ProtocolError("missing required 'LogonZhiBoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogonZhiBoRsp_CMD"))
            throw $util.ProtocolError("missing required 'LogonZhiBoRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ZhiBoChatReq_CMD"))
            throw $util.ProtocolError("missing required 'ZhiBoChatReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ZhiBoChatRsp_CMD"))
            throw $util.ProtocolError("missing required 'ZhiBoChatRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubChatAppKeyReq_CMD"))
            throw $util.ProtocolError("missing required 'ClubChatAppKeyReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubChatAppKeyRsp_CMD"))
            throw $util.ProtocolError("missing required 'ClubChatAppKeyRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatVedioLogonReq_CMD"))
            throw $util.ProtocolError("missing required 'ChatVedioLogonReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ChatVedioLogonRsp_CMD"))
            throw $util.ProtocolError("missing required 'ChatVedioLogonRsp_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a Chat_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Chat_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Chat_Proto} Chat_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Chat_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Chat_Proto message.
     * @function verify
     * @memberof Chat_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Chat_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.ChatLogonReq_CMD))
            return "ChatLogonReq_CMD: integer expected";
        if (!$util.isInteger(message.ChatLogonRsp_CMD))
            return "ChatLogonRsp_CMD: integer expected";
        if (!$util.isInteger(message.ChatBackToLobbyReq_CMD))
            return "ChatBackToLobbyReq_CMD: integer expected";
        if (!$util.isInteger(message.ChatNotify_CMD))
            return "ChatNotify_CMD: integer expected";
        if (!$util.isInteger(message.ChatChangeReq_CMD))
            return "ChatChangeReq_CMD: integer expected";
        if (!$util.isInteger(message.ChatChangeRsp_CMD))
            return "ChatChangeRsp_CMD: integer expected";
        if (!$util.isInteger(message.LogonZhiBoReq_CMD))
            return "LogonZhiBoReq_CMD: integer expected";
        if (!$util.isInteger(message.LogonZhiBoRsp_CMD))
            return "LogonZhiBoRsp_CMD: integer expected";
        if (!$util.isInteger(message.ZhiBoChatReq_CMD))
            return "ZhiBoChatReq_CMD: integer expected";
        if (!$util.isInteger(message.ZhiBoChatRsp_CMD))
            return "ZhiBoChatRsp_CMD: integer expected";
        if (!$util.isInteger(message.ClubChatAppKeyReq_CMD))
            return "ClubChatAppKeyReq_CMD: integer expected";
        if (!$util.isInteger(message.ClubChatAppKeyRsp_CMD))
            return "ClubChatAppKeyRsp_CMD: integer expected";
        if (!$util.isInteger(message.ChatVedioLogonReq_CMD))
            return "ChatVedioLogonReq_CMD: integer expected";
        if (!$util.isInteger(message.ChatVedioLogonRsp_CMD))
            return "ChatVedioLogonRsp_CMD: integer expected";
        return null;
    };

    /**
     * Creates a Chat_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Chat_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Chat_Proto} Chat_Proto
     */
    Chat_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Chat_Proto)
            return object;
        var message = new $root.Chat_Proto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.ChatLogonReq_CMD != null)
            message.ChatLogonReq_CMD = object.ChatLogonReq_CMD | 0;
        if (object.ChatLogonRsp_CMD != null)
            message.ChatLogonRsp_CMD = object.ChatLogonRsp_CMD | 0;
        if (object.ChatBackToLobbyReq_CMD != null)
            message.ChatBackToLobbyReq_CMD = object.ChatBackToLobbyReq_CMD | 0;
        if (object.ChatNotify_CMD != null)
            message.ChatNotify_CMD = object.ChatNotify_CMD | 0;
        if (object.ChatChangeReq_CMD != null)
            message.ChatChangeReq_CMD = object.ChatChangeReq_CMD | 0;
        if (object.ChatChangeRsp_CMD != null)
            message.ChatChangeRsp_CMD = object.ChatChangeRsp_CMD | 0;
        if (object.LogonZhiBoReq_CMD != null)
            message.LogonZhiBoReq_CMD = object.LogonZhiBoReq_CMD | 0;
        if (object.LogonZhiBoRsp_CMD != null)
            message.LogonZhiBoRsp_CMD = object.LogonZhiBoRsp_CMD | 0;
        if (object.ZhiBoChatReq_CMD != null)
            message.ZhiBoChatReq_CMD = object.ZhiBoChatReq_CMD | 0;
        if (object.ZhiBoChatRsp_CMD != null)
            message.ZhiBoChatRsp_CMD = object.ZhiBoChatRsp_CMD | 0;
        if (object.ClubChatAppKeyReq_CMD != null)
            message.ClubChatAppKeyReq_CMD = object.ClubChatAppKeyReq_CMD | 0;
        if (object.ClubChatAppKeyRsp_CMD != null)
            message.ClubChatAppKeyRsp_CMD = object.ClubChatAppKeyRsp_CMD | 0;
        if (object.ChatVedioLogonReq_CMD != null)
            message.ChatVedioLogonReq_CMD = object.ChatVedioLogonReq_CMD | 0;
        if (object.ChatVedioLogonRsp_CMD != null)
            message.ChatVedioLogonRsp_CMD = object.ChatVedioLogonRsp_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a Chat_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Chat_Proto
     * @static
     * @param {Chat_Proto} message Chat_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Chat_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 110;
            object.ChatLogonReq_CMD = 2;
            object.ChatLogonRsp_CMD = 3;
            object.ChatBackToLobbyReq_CMD = 4;
            object.ChatNotify_CMD = 5;
            object.ChatChangeReq_CMD = 6;
            object.ChatChangeRsp_CMD = 7;
            object.LogonZhiBoReq_CMD = 8;
            object.LogonZhiBoRsp_CMD = 9;
            object.ZhiBoChatReq_CMD = 10;
            object.ZhiBoChatRsp_CMD = 11;
            object.ClubChatAppKeyReq_CMD = 12;
            object.ClubChatAppKeyRsp_CMD = 13;
            object.ChatVedioLogonReq_CMD = 14;
            object.ChatVedioLogonRsp_CMD = 15;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.ChatLogonReq_CMD != null && message.hasOwnProperty("ChatLogonReq_CMD"))
            object.ChatLogonReq_CMD = message.ChatLogonReq_CMD;
        if (message.ChatLogonRsp_CMD != null && message.hasOwnProperty("ChatLogonRsp_CMD"))
            object.ChatLogonRsp_CMD = message.ChatLogonRsp_CMD;
        if (message.ChatBackToLobbyReq_CMD != null && message.hasOwnProperty("ChatBackToLobbyReq_CMD"))
            object.ChatBackToLobbyReq_CMD = message.ChatBackToLobbyReq_CMD;
        if (message.ChatNotify_CMD != null && message.hasOwnProperty("ChatNotify_CMD"))
            object.ChatNotify_CMD = message.ChatNotify_CMD;
        if (message.ChatChangeReq_CMD != null && message.hasOwnProperty("ChatChangeReq_CMD"))
            object.ChatChangeReq_CMD = message.ChatChangeReq_CMD;
        if (message.ChatChangeRsp_CMD != null && message.hasOwnProperty("ChatChangeRsp_CMD"))
            object.ChatChangeRsp_CMD = message.ChatChangeRsp_CMD;
        if (message.LogonZhiBoReq_CMD != null && message.hasOwnProperty("LogonZhiBoReq_CMD"))
            object.LogonZhiBoReq_CMD = message.LogonZhiBoReq_CMD;
        if (message.LogonZhiBoRsp_CMD != null && message.hasOwnProperty("LogonZhiBoRsp_CMD"))
            object.LogonZhiBoRsp_CMD = message.LogonZhiBoRsp_CMD;
        if (message.ZhiBoChatReq_CMD != null && message.hasOwnProperty("ZhiBoChatReq_CMD"))
            object.ZhiBoChatReq_CMD = message.ZhiBoChatReq_CMD;
        if (message.ZhiBoChatRsp_CMD != null && message.hasOwnProperty("ZhiBoChatRsp_CMD"))
            object.ZhiBoChatRsp_CMD = message.ZhiBoChatRsp_CMD;
        if (message.ClubChatAppKeyReq_CMD != null && message.hasOwnProperty("ClubChatAppKeyReq_CMD"))
            object.ClubChatAppKeyReq_CMD = message.ClubChatAppKeyReq_CMD;
        if (message.ClubChatAppKeyRsp_CMD != null && message.hasOwnProperty("ClubChatAppKeyRsp_CMD"))
            object.ClubChatAppKeyRsp_CMD = message.ClubChatAppKeyRsp_CMD;
        if (message.ChatVedioLogonReq_CMD != null && message.hasOwnProperty("ChatVedioLogonReq_CMD"))
            object.ChatVedioLogonReq_CMD = message.ChatVedioLogonReq_CMD;
        if (message.ChatVedioLogonRsp_CMD != null && message.hasOwnProperty("ChatVedioLogonRsp_CMD"))
            object.ChatVedioLogonRsp_CMD = message.ChatVedioLogonRsp_CMD;
        return object;
    };

    /**
     * Converts this Chat_Proto to JSON.
     * @function toJSON
     * @memberof Chat_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Chat_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Chat_Proto
     * @function getTypeUrl
     * @memberof Chat_Proto
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Chat_Proto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Chat_Proto";
    };

    return Chat_Proto;
})();

$root.ChatLogonReq = (function() {

    /**
     * Properties of a ChatLogonReq.
     * @exports IChatLogonReq
     * @interface IChatLogonReq
     * @property {number|null} [nChatType] ChatLogonReq nChatType
     * @property {string|null} [sTableId] ChatLogonReq sTableId
     * @property {number|null} [nUserId] ChatLogonReq nUserId
     */

    /**
     * Constructs a new ChatLogonReq.
     * @exports ChatLogonReq
     * @classdesc Represents a ChatLogonReq.
     * @implements IChatLogonReq
     * @constructor
     * @param {IChatLogonReq=} [properties] Properties to set
     */
    function ChatLogonReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatLogonReq nChatType.
     * @member {number} nChatType
     * @memberof ChatLogonReq
     * @instance
     */
    ChatLogonReq.prototype.nChatType = 0;

    /**
     * ChatLogonReq sTableId.
     * @member {string} sTableId
     * @memberof ChatLogonReq
     * @instance
     */
    ChatLogonReq.prototype.sTableId = "";

    /**
     * ChatLogonReq nUserId.
     * @member {number} nUserId
     * @memberof ChatLogonReq
     * @instance
     */
    ChatLogonReq.prototype.nUserId = 0;

    /**
     * Creates a new ChatLogonReq instance using the specified properties.
     * @function create
     * @memberof ChatLogonReq
     * @static
     * @param {IChatLogonReq=} [properties] Properties to set
     * @returns {ChatLogonReq} ChatLogonReq instance
     */
    ChatLogonReq.create = function create(properties) {
        return new ChatLogonReq(properties);
    };

    /**
     * Encodes the specified ChatLogonReq message. Does not implicitly {@link ChatLogonReq.verify|verify} messages.
     * @function encode
     * @memberof ChatLogonReq
     * @static
     * @param {IChatLogonReq} message ChatLogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatLogonReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nChatType != null && Object.hasOwnProperty.call(message, "nChatType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nChatType);
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTableId);
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified ChatLogonReq message, length delimited. Does not implicitly {@link ChatLogonReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatLogonReq
     * @static
     * @param {IChatLogonReq} message ChatLogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatLogonReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatLogonReq message from the specified reader or buffer.
     * @function decode
     * @memberof ChatLogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatLogonReq} ChatLogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatLogonReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatLogonReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nChatType = reader.int32();
                    break;
                }
            case 2: {
                    message.sTableId = reader.string();
                    break;
                }
            case 3: {
                    message.nUserId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatLogonReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatLogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatLogonReq} ChatLogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatLogonReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatLogonReq message.
     * @function verify
     * @memberof ChatLogonReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatLogonReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            if (!$util.isInteger(message.nChatType))
                return "nChatType: integer expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a ChatLogonReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatLogonReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatLogonReq} ChatLogonReq
     */
    ChatLogonReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatLogonReq)
            return object;
        var message = new $root.ChatLogonReq();
        if (object.nChatType != null)
            message.nChatType = object.nChatType | 0;
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a ChatLogonReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatLogonReq
     * @static
     * @param {ChatLogonReq} message ChatLogonReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatLogonReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nChatType = 0;
            object.sTableId = "";
            object.nUserId = 0;
        }
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            object.nChatType = message.nChatType;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        return object;
    };

    /**
     * Converts this ChatLogonReq to JSON.
     * @function toJSON
     * @memberof ChatLogonReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatLogonReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatLogonReq
     * @function getTypeUrl
     * @memberof ChatLogonReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatLogonReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatLogonReq";
    };

    return ChatLogonReq;
})();

$root.ChatLogonRsp = (function() {

    /**
     * Properties of a ChatLogonRsp.
     * @exports IChatLogonRsp
     * @interface IChatLogonRsp
     * @property {number|null} [nChatType] ChatLogonRsp nChatType
     * @property {number} nRlt ChatLogonRsp nRlt
     * @property {string} accid ChatLogonRsp accid
     * @property {string} token ChatLogonRsp token
     * @property {string|null} [tid] ChatLogonRsp tid
     * @property {string|null} [sCfg] ChatLogonRsp sCfg
     */

    /**
     * Constructs a new ChatLogonRsp.
     * @exports ChatLogonRsp
     * @classdesc Represents a ChatLogonRsp.
     * @implements IChatLogonRsp
     * @constructor
     * @param {IChatLogonRsp=} [properties] Properties to set
     */
    function ChatLogonRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatLogonRsp nChatType.
     * @member {number} nChatType
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.nChatType = 0;

    /**
     * ChatLogonRsp nRlt.
     * @member {number} nRlt
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.nRlt = 0;

    /**
     * ChatLogonRsp accid.
     * @member {string} accid
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.accid = "";

    /**
     * ChatLogonRsp token.
     * @member {string} token
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.token = "";

    /**
     * ChatLogonRsp tid.
     * @member {string} tid
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.tid = "";

    /**
     * ChatLogonRsp sCfg.
     * @member {string} sCfg
     * @memberof ChatLogonRsp
     * @instance
     */
    ChatLogonRsp.prototype.sCfg = "";

    /**
     * Creates a new ChatLogonRsp instance using the specified properties.
     * @function create
     * @memberof ChatLogonRsp
     * @static
     * @param {IChatLogonRsp=} [properties] Properties to set
     * @returns {ChatLogonRsp} ChatLogonRsp instance
     */
    ChatLogonRsp.create = function create(properties) {
        return new ChatLogonRsp(properties);
    };

    /**
     * Encodes the specified ChatLogonRsp message. Does not implicitly {@link ChatLogonRsp.verify|verify} messages.
     * @function encode
     * @memberof ChatLogonRsp
     * @static
     * @param {IChatLogonRsp} message ChatLogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatLogonRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nChatType != null && Object.hasOwnProperty.call(message, "nChatType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nChatType);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRlt);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.accid);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.token);
        if (message.tid != null && Object.hasOwnProperty.call(message, "tid"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.tid);
        if (message.sCfg != null && Object.hasOwnProperty.call(message, "sCfg"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.sCfg);
        return writer;
    };

    /**
     * Encodes the specified ChatLogonRsp message, length delimited. Does not implicitly {@link ChatLogonRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatLogonRsp
     * @static
     * @param {IChatLogonRsp} message ChatLogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatLogonRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatLogonRsp message from the specified reader or buffer.
     * @function decode
     * @memberof ChatLogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatLogonRsp} ChatLogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatLogonRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatLogonRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nChatType = reader.int32();
                    break;
                }
            case 2: {
                    message.nRlt = reader.int32();
                    break;
                }
            case 3: {
                    message.accid = reader.string();
                    break;
                }
            case 4: {
                    message.token = reader.string();
                    break;
                }
            case 5: {
                    message.tid = reader.string();
                    break;
                }
            case 6: {
                    message.sCfg = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        if (!message.hasOwnProperty("accid"))
            throw $util.ProtocolError("missing required 'accid'", { instance: message });
        if (!message.hasOwnProperty("token"))
            throw $util.ProtocolError("missing required 'token'", { instance: message });
        return message;
    };

    /**
     * Decodes a ChatLogonRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatLogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatLogonRsp} ChatLogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatLogonRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatLogonRsp message.
     * @function verify
     * @memberof ChatLogonRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatLogonRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            if (!$util.isInteger(message.nChatType))
                return "nChatType: integer expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (!$util.isString(message.accid))
            return "accid: string expected";
        if (!$util.isString(message.token))
            return "token: string expected";
        if (message.tid != null && message.hasOwnProperty("tid"))
            if (!$util.isString(message.tid))
                return "tid: string expected";
        if (message.sCfg != null && message.hasOwnProperty("sCfg"))
            if (!$util.isString(message.sCfg))
                return "sCfg: string expected";
        return null;
    };

    /**
     * Creates a ChatLogonRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatLogonRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatLogonRsp} ChatLogonRsp
     */
    ChatLogonRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatLogonRsp)
            return object;
        var message = new $root.ChatLogonRsp();
        if (object.nChatType != null)
            message.nChatType = object.nChatType | 0;
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.accid != null)
            message.accid = String(object.accid);
        if (object.token != null)
            message.token = String(object.token);
        if (object.tid != null)
            message.tid = String(object.tid);
        if (object.sCfg != null)
            message.sCfg = String(object.sCfg);
        return message;
    };

    /**
     * Creates a plain object from a ChatLogonRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatLogonRsp
     * @static
     * @param {ChatLogonRsp} message ChatLogonRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatLogonRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nChatType = 0;
            object.nRlt = 0;
            object.accid = "";
            object.token = "";
            object.tid = "";
            object.sCfg = "";
        }
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            object.nChatType = message.nChatType;
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.accid != null && message.hasOwnProperty("accid"))
            object.accid = message.accid;
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        if (message.tid != null && message.hasOwnProperty("tid"))
            object.tid = message.tid;
        if (message.sCfg != null && message.hasOwnProperty("sCfg"))
            object.sCfg = message.sCfg;
        return object;
    };

    /**
     * Converts this ChatLogonRsp to JSON.
     * @function toJSON
     * @memberof ChatLogonRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatLogonRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatLogonRsp
     * @function getTypeUrl
     * @memberof ChatLogonRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatLogonRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatLogonRsp";
    };

    return ChatLogonRsp;
})();

$root.ChatBackToLobbyReq = (function() {

    /**
     * Properties of a ChatBackToLobbyReq.
     * @exports IChatBackToLobbyReq
     * @interface IChatBackToLobbyReq
     * @property {number|null} [nUserId] ChatBackToLobbyReq nUserId
     */

    /**
     * Constructs a new ChatBackToLobbyReq.
     * @exports ChatBackToLobbyReq
     * @classdesc Represents a ChatBackToLobbyReq.
     * @implements IChatBackToLobbyReq
     * @constructor
     * @param {IChatBackToLobbyReq=} [properties] Properties to set
     */
    function ChatBackToLobbyReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatBackToLobbyReq nUserId.
     * @member {number} nUserId
     * @memberof ChatBackToLobbyReq
     * @instance
     */
    ChatBackToLobbyReq.prototype.nUserId = 0;

    /**
     * Creates a new ChatBackToLobbyReq instance using the specified properties.
     * @function create
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {IChatBackToLobbyReq=} [properties] Properties to set
     * @returns {ChatBackToLobbyReq} ChatBackToLobbyReq instance
     */
    ChatBackToLobbyReq.create = function create(properties) {
        return new ChatBackToLobbyReq(properties);
    };

    /**
     * Encodes the specified ChatBackToLobbyReq message. Does not implicitly {@link ChatBackToLobbyReq.verify|verify} messages.
     * @function encode
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {IChatBackToLobbyReq} message ChatBackToLobbyReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatBackToLobbyReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified ChatBackToLobbyReq message, length delimited. Does not implicitly {@link ChatBackToLobbyReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {IChatBackToLobbyReq} message ChatBackToLobbyReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatBackToLobbyReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatBackToLobbyReq message from the specified reader or buffer.
     * @function decode
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatBackToLobbyReq} ChatBackToLobbyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatBackToLobbyReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatBackToLobbyReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatBackToLobbyReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatBackToLobbyReq} ChatBackToLobbyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatBackToLobbyReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatBackToLobbyReq message.
     * @function verify
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatBackToLobbyReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a ChatBackToLobbyReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatBackToLobbyReq} ChatBackToLobbyReq
     */
    ChatBackToLobbyReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatBackToLobbyReq)
            return object;
        var message = new $root.ChatBackToLobbyReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a ChatBackToLobbyReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {ChatBackToLobbyReq} message ChatBackToLobbyReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatBackToLobbyReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nUserId = 0;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        return object;
    };

    /**
     * Converts this ChatBackToLobbyReq to JSON.
     * @function toJSON
     * @memberof ChatBackToLobbyReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatBackToLobbyReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatBackToLobbyReq
     * @function getTypeUrl
     * @memberof ChatBackToLobbyReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatBackToLobbyReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatBackToLobbyReq";
    };

    return ChatBackToLobbyReq;
})();

$root.ChatChangeReq = (function() {

    /**
     * Properties of a ChatChangeReq.
     * @exports IChatChangeReq
     * @interface IChatChangeReq
     * @property {number|null} [nType] ChatChangeReq nType
     * @property {number|null} [nChatId] ChatChangeReq nChatId
     * @property {string|null} [sStr] ChatChangeReq sStr
     */

    /**
     * Constructs a new ChatChangeReq.
     * @exports ChatChangeReq
     * @classdesc Represents a ChatChangeReq.
     * @implements IChatChangeReq
     * @constructor
     * @param {IChatChangeReq=} [properties] Properties to set
     */
    function ChatChangeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatChangeReq nType.
     * @member {number} nType
     * @memberof ChatChangeReq
     * @instance
     */
    ChatChangeReq.prototype.nType = 0;

    /**
     * ChatChangeReq nChatId.
     * @member {number} nChatId
     * @memberof ChatChangeReq
     * @instance
     */
    ChatChangeReq.prototype.nChatId = 0;

    /**
     * ChatChangeReq sStr.
     * @member {string} sStr
     * @memberof ChatChangeReq
     * @instance
     */
    ChatChangeReq.prototype.sStr = "";

    /**
     * Creates a new ChatChangeReq instance using the specified properties.
     * @function create
     * @memberof ChatChangeReq
     * @static
     * @param {IChatChangeReq=} [properties] Properties to set
     * @returns {ChatChangeReq} ChatChangeReq instance
     */
    ChatChangeReq.create = function create(properties) {
        return new ChatChangeReq(properties);
    };

    /**
     * Encodes the specified ChatChangeReq message. Does not implicitly {@link ChatChangeReq.verify|verify} messages.
     * @function encode
     * @memberof ChatChangeReq
     * @static
     * @param {IChatChangeReq} message ChatChangeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatChangeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nType);
        if (message.nChatId != null && Object.hasOwnProperty.call(message, "nChatId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nChatId);
        if (message.sStr != null && Object.hasOwnProperty.call(message, "sStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sStr);
        return writer;
    };

    /**
     * Encodes the specified ChatChangeReq message, length delimited. Does not implicitly {@link ChatChangeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatChangeReq
     * @static
     * @param {IChatChangeReq} message ChatChangeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatChangeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatChangeReq message from the specified reader or buffer.
     * @function decode
     * @memberof ChatChangeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatChangeReq} ChatChangeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatChangeReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatChangeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nType = reader.int32();
                    break;
                }
            case 2: {
                    message.nChatId = reader.int32();
                    break;
                }
            case 3: {
                    message.sStr = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatChangeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatChangeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatChangeReq} ChatChangeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatChangeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatChangeReq message.
     * @function verify
     * @memberof ChatChangeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatChangeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (message.nChatId != null && message.hasOwnProperty("nChatId"))
            if (!$util.isInteger(message.nChatId))
                return "nChatId: integer expected";
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            if (!$util.isString(message.sStr))
                return "sStr: string expected";
        return null;
    };

    /**
     * Creates a ChatChangeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatChangeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatChangeReq} ChatChangeReq
     */
    ChatChangeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatChangeReq)
            return object;
        var message = new $root.ChatChangeReq();
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nChatId != null)
            message.nChatId = object.nChatId | 0;
        if (object.sStr != null)
            message.sStr = String(object.sStr);
        return message;
    };

    /**
     * Creates a plain object from a ChatChangeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatChangeReq
     * @static
     * @param {ChatChangeReq} message ChatChangeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatChangeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nType = 0;
            object.nChatId = 0;
            object.sStr = "";
        }
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nChatId != null && message.hasOwnProperty("nChatId"))
            object.nChatId = message.nChatId;
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            object.sStr = message.sStr;
        return object;
    };

    /**
     * Converts this ChatChangeReq to JSON.
     * @function toJSON
     * @memberof ChatChangeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatChangeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatChangeReq
     * @function getTypeUrl
     * @memberof ChatChangeReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatChangeReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatChangeReq";
    };

    return ChatChangeReq;
})();

$root.ChatChangeRsp = (function() {

    /**
     * Properties of a ChatChangeRsp.
     * @exports IChatChangeRsp
     * @interface IChatChangeRsp
     * @property {number|null} [nType] ChatChangeRsp nType
     * @property {number} nRlt ChatChangeRsp nRlt
     * @property {string|null} [sStr] ChatChangeRsp sStr
     */

    /**
     * Constructs a new ChatChangeRsp.
     * @exports ChatChangeRsp
     * @classdesc Represents a ChatChangeRsp.
     * @implements IChatChangeRsp
     * @constructor
     * @param {IChatChangeRsp=} [properties] Properties to set
     */
    function ChatChangeRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatChangeRsp nType.
     * @member {number} nType
     * @memberof ChatChangeRsp
     * @instance
     */
    ChatChangeRsp.prototype.nType = 0;

    /**
     * ChatChangeRsp nRlt.
     * @member {number} nRlt
     * @memberof ChatChangeRsp
     * @instance
     */
    ChatChangeRsp.prototype.nRlt = 0;

    /**
     * ChatChangeRsp sStr.
     * @member {string} sStr
     * @memberof ChatChangeRsp
     * @instance
     */
    ChatChangeRsp.prototype.sStr = "";

    /**
     * Creates a new ChatChangeRsp instance using the specified properties.
     * @function create
     * @memberof ChatChangeRsp
     * @static
     * @param {IChatChangeRsp=} [properties] Properties to set
     * @returns {ChatChangeRsp} ChatChangeRsp instance
     */
    ChatChangeRsp.create = function create(properties) {
        return new ChatChangeRsp(properties);
    };

    /**
     * Encodes the specified ChatChangeRsp message. Does not implicitly {@link ChatChangeRsp.verify|verify} messages.
     * @function encode
     * @memberof ChatChangeRsp
     * @static
     * @param {IChatChangeRsp} message ChatChangeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatChangeRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nType);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRlt);
        if (message.sStr != null && Object.hasOwnProperty.call(message, "sStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sStr);
        return writer;
    };

    /**
     * Encodes the specified ChatChangeRsp message, length delimited. Does not implicitly {@link ChatChangeRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatChangeRsp
     * @static
     * @param {IChatChangeRsp} message ChatChangeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatChangeRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatChangeRsp message from the specified reader or buffer.
     * @function decode
     * @memberof ChatChangeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatChangeRsp} ChatChangeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatChangeRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatChangeRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nType = reader.int32();
                    break;
                }
            case 2: {
                    message.nRlt = reader.int32();
                    break;
                }
            case 3: {
                    message.sStr = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        return message;
    };

    /**
     * Decodes a ChatChangeRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatChangeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatChangeRsp} ChatChangeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatChangeRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatChangeRsp message.
     * @function verify
     * @memberof ChatChangeRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatChangeRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            if (!$util.isString(message.sStr))
                return "sStr: string expected";
        return null;
    };

    /**
     * Creates a ChatChangeRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatChangeRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatChangeRsp} ChatChangeRsp
     */
    ChatChangeRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatChangeRsp)
            return object;
        var message = new $root.ChatChangeRsp();
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.sStr != null)
            message.sStr = String(object.sStr);
        return message;
    };

    /**
     * Creates a plain object from a ChatChangeRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatChangeRsp
     * @static
     * @param {ChatChangeRsp} message ChatChangeRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatChangeRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nType = 0;
            object.nRlt = 0;
            object.sStr = "";
        }
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            object.sStr = message.sStr;
        return object;
    };

    /**
     * Converts this ChatChangeRsp to JSON.
     * @function toJSON
     * @memberof ChatChangeRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatChangeRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatChangeRsp
     * @function getTypeUrl
     * @memberof ChatChangeRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatChangeRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatChangeRsp";
    };

    return ChatChangeRsp;
})();

$root.ClubChatAppKeyReq = (function() {

    /**
     * Properties of a ClubChatAppKeyReq.
     * @exports IClubChatAppKeyReq
     * @interface IClubChatAppKeyReq
     * @property {number|null} [nUserId] ClubChatAppKeyReq nUserId
     */

    /**
     * Constructs a new ClubChatAppKeyReq.
     * @exports ClubChatAppKeyReq
     * @classdesc Represents a ClubChatAppKeyReq.
     * @implements IClubChatAppKeyReq
     * @constructor
     * @param {IClubChatAppKeyReq=} [properties] Properties to set
     */
    function ClubChatAppKeyReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubChatAppKeyReq nUserId.
     * @member {number} nUserId
     * @memberof ClubChatAppKeyReq
     * @instance
     */
    ClubChatAppKeyReq.prototype.nUserId = 0;

    /**
     * Creates a new ClubChatAppKeyReq instance using the specified properties.
     * @function create
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {IClubChatAppKeyReq=} [properties] Properties to set
     * @returns {ClubChatAppKeyReq} ClubChatAppKeyReq instance
     */
    ClubChatAppKeyReq.create = function create(properties) {
        return new ClubChatAppKeyReq(properties);
    };

    /**
     * Encodes the specified ClubChatAppKeyReq message. Does not implicitly {@link ClubChatAppKeyReq.verify|verify} messages.
     * @function encode
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {IClubChatAppKeyReq} message ClubChatAppKeyReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubChatAppKeyReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified ClubChatAppKeyReq message, length delimited. Does not implicitly {@link ClubChatAppKeyReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {IClubChatAppKeyReq} message ClubChatAppKeyReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubChatAppKeyReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubChatAppKeyReq message from the specified reader or buffer.
     * @function decode
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubChatAppKeyReq} ClubChatAppKeyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubChatAppKeyReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubChatAppKeyReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClubChatAppKeyReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubChatAppKeyReq} ClubChatAppKeyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubChatAppKeyReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubChatAppKeyReq message.
     * @function verify
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubChatAppKeyReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a ClubChatAppKeyReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubChatAppKeyReq} ClubChatAppKeyReq
     */
    ClubChatAppKeyReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubChatAppKeyReq)
            return object;
        var message = new $root.ClubChatAppKeyReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubChatAppKeyReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {ClubChatAppKeyReq} message ClubChatAppKeyReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubChatAppKeyReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nUserId = 0;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        return object;
    };

    /**
     * Converts this ClubChatAppKeyReq to JSON.
     * @function toJSON
     * @memberof ClubChatAppKeyReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubChatAppKeyReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ClubChatAppKeyReq
     * @function getTypeUrl
     * @memberof ClubChatAppKeyReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ClubChatAppKeyReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ClubChatAppKeyReq";
    };

    return ClubChatAppKeyReq;
})();

$root.ClubChatAppKeyRsp = (function() {

    /**
     * Properties of a ClubChatAppKeyRsp.
     * @exports IClubChatAppKeyRsp
     * @interface IClubChatAppKeyRsp
     * @property {string} sAppKey ClubChatAppKeyRsp sAppKey
     */

    /**
     * Constructs a new ClubChatAppKeyRsp.
     * @exports ClubChatAppKeyRsp
     * @classdesc Represents a ClubChatAppKeyRsp.
     * @implements IClubChatAppKeyRsp
     * @constructor
     * @param {IClubChatAppKeyRsp=} [properties] Properties to set
     */
    function ClubChatAppKeyRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubChatAppKeyRsp sAppKey.
     * @member {string} sAppKey
     * @memberof ClubChatAppKeyRsp
     * @instance
     */
    ClubChatAppKeyRsp.prototype.sAppKey = "";

    /**
     * Creates a new ClubChatAppKeyRsp instance using the specified properties.
     * @function create
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {IClubChatAppKeyRsp=} [properties] Properties to set
     * @returns {ClubChatAppKeyRsp} ClubChatAppKeyRsp instance
     */
    ClubChatAppKeyRsp.create = function create(properties) {
        return new ClubChatAppKeyRsp(properties);
    };

    /**
     * Encodes the specified ClubChatAppKeyRsp message. Does not implicitly {@link ClubChatAppKeyRsp.verify|verify} messages.
     * @function encode
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {IClubChatAppKeyRsp} message ClubChatAppKeyRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubChatAppKeyRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sAppKey);
        return writer;
    };

    /**
     * Encodes the specified ClubChatAppKeyRsp message, length delimited. Does not implicitly {@link ClubChatAppKeyRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {IClubChatAppKeyRsp} message ClubChatAppKeyRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubChatAppKeyRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubChatAppKeyRsp message from the specified reader or buffer.
     * @function decode
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubChatAppKeyRsp} ClubChatAppKeyRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubChatAppKeyRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubChatAppKeyRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sAppKey = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sAppKey"))
            throw $util.ProtocolError("missing required 'sAppKey'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubChatAppKeyRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubChatAppKeyRsp} ClubChatAppKeyRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubChatAppKeyRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubChatAppKeyRsp message.
     * @function verify
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubChatAppKeyRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sAppKey))
            return "sAppKey: string expected";
        return null;
    };

    /**
     * Creates a ClubChatAppKeyRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubChatAppKeyRsp} ClubChatAppKeyRsp
     */
    ClubChatAppKeyRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubChatAppKeyRsp)
            return object;
        var message = new $root.ClubChatAppKeyRsp();
        if (object.sAppKey != null)
            message.sAppKey = String(object.sAppKey);
        return message;
    };

    /**
     * Creates a plain object from a ClubChatAppKeyRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {ClubChatAppKeyRsp} message ClubChatAppKeyRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubChatAppKeyRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sAppKey = "";
        if (message.sAppKey != null && message.hasOwnProperty("sAppKey"))
            object.sAppKey = message.sAppKey;
        return object;
    };

    /**
     * Converts this ClubChatAppKeyRsp to JSON.
     * @function toJSON
     * @memberof ClubChatAppKeyRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubChatAppKeyRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ClubChatAppKeyRsp
     * @function getTypeUrl
     * @memberof ClubChatAppKeyRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ClubChatAppKeyRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ClubChatAppKeyRsp";
    };

    return ClubChatAppKeyRsp;
})();

$root.LogonZhiBoReq = (function() {

    /**
     * Properties of a LogonZhiBoReq.
     * @exports ILogonZhiBoReq
     * @interface ILogonZhiBoReq
     * @property {string|null} [sTableId] LogonZhiBoReq sTableId
     * @property {number|null} [nUserId] LogonZhiBoReq nUserId
     */

    /**
     * Constructs a new LogonZhiBoReq.
     * @exports LogonZhiBoReq
     * @classdesc Represents a LogonZhiBoReq.
     * @implements ILogonZhiBoReq
     * @constructor
     * @param {ILogonZhiBoReq=} [properties] Properties to set
     */
    function LogonZhiBoReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogonZhiBoReq sTableId.
     * @member {string} sTableId
     * @memberof LogonZhiBoReq
     * @instance
     */
    LogonZhiBoReq.prototype.sTableId = "";

    /**
     * LogonZhiBoReq nUserId.
     * @member {number} nUserId
     * @memberof LogonZhiBoReq
     * @instance
     */
    LogonZhiBoReq.prototype.nUserId = 0;

    /**
     * Creates a new LogonZhiBoReq instance using the specified properties.
     * @function create
     * @memberof LogonZhiBoReq
     * @static
     * @param {ILogonZhiBoReq=} [properties] Properties to set
     * @returns {LogonZhiBoReq} LogonZhiBoReq instance
     */
    LogonZhiBoReq.create = function create(properties) {
        return new LogonZhiBoReq(properties);
    };

    /**
     * Encodes the specified LogonZhiBoReq message. Does not implicitly {@link LogonZhiBoReq.verify|verify} messages.
     * @function encode
     * @memberof LogonZhiBoReq
     * @static
     * @param {ILogonZhiBoReq} message LogonZhiBoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonZhiBoReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTableId);
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified LogonZhiBoReq message, length delimited. Does not implicitly {@link LogonZhiBoReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogonZhiBoReq
     * @static
     * @param {ILogonZhiBoReq} message LogonZhiBoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonZhiBoReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogonZhiBoReq message from the specified reader or buffer.
     * @function decode
     * @memberof LogonZhiBoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogonZhiBoReq} LogonZhiBoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonZhiBoReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonZhiBoReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sTableId = reader.string();
                    break;
                }
            case 2: {
                    message.nUserId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LogonZhiBoReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogonZhiBoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogonZhiBoReq} LogonZhiBoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonZhiBoReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogonZhiBoReq message.
     * @function verify
     * @memberof LogonZhiBoReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogonZhiBoReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a LogonZhiBoReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogonZhiBoReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogonZhiBoReq} LogonZhiBoReq
     */
    LogonZhiBoReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LogonZhiBoReq)
            return object;
        var message = new $root.LogonZhiBoReq();
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a LogonZhiBoReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogonZhiBoReq
     * @static
     * @param {LogonZhiBoReq} message LogonZhiBoReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogonZhiBoReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sTableId = "";
            object.nUserId = 0;
        }
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        return object;
    };

    /**
     * Converts this LogonZhiBoReq to JSON.
     * @function toJSON
     * @memberof LogonZhiBoReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogonZhiBoReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LogonZhiBoReq
     * @function getTypeUrl
     * @memberof LogonZhiBoReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LogonZhiBoReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LogonZhiBoReq";
    };

    return LogonZhiBoReq;
})();

$root.LogonZhiBoRsp = (function() {

    /**
     * Properties of a LogonZhiBoRsp.
     * @exports ILogonZhiBoRsp
     * @interface ILogonZhiBoRsp
     * @property {number} nRlt LogonZhiBoRsp nRlt
     * @property {Array.<IChatMatter>|null} [arrChatRecord] LogonZhiBoRsp arrChatRecord
     */

    /**
     * Constructs a new LogonZhiBoRsp.
     * @exports LogonZhiBoRsp
     * @classdesc Represents a LogonZhiBoRsp.
     * @implements ILogonZhiBoRsp
     * @constructor
     * @param {ILogonZhiBoRsp=} [properties] Properties to set
     */
    function LogonZhiBoRsp(properties) {
        this.arrChatRecord = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogonZhiBoRsp nRlt.
     * @member {number} nRlt
     * @memberof LogonZhiBoRsp
     * @instance
     */
    LogonZhiBoRsp.prototype.nRlt = 0;

    /**
     * LogonZhiBoRsp arrChatRecord.
     * @member {Array.<IChatMatter>} arrChatRecord
     * @memberof LogonZhiBoRsp
     * @instance
     */
    LogonZhiBoRsp.prototype.arrChatRecord = $util.emptyArray;

    /**
     * Creates a new LogonZhiBoRsp instance using the specified properties.
     * @function create
     * @memberof LogonZhiBoRsp
     * @static
     * @param {ILogonZhiBoRsp=} [properties] Properties to set
     * @returns {LogonZhiBoRsp} LogonZhiBoRsp instance
     */
    LogonZhiBoRsp.create = function create(properties) {
        return new LogonZhiBoRsp(properties);
    };

    /**
     * Encodes the specified LogonZhiBoRsp message. Does not implicitly {@link LogonZhiBoRsp.verify|verify} messages.
     * @function encode
     * @memberof LogonZhiBoRsp
     * @static
     * @param {ILogonZhiBoRsp} message LogonZhiBoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonZhiBoRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        if (message.arrChatRecord != null && message.arrChatRecord.length)
            for (var i = 0; i < message.arrChatRecord.length; ++i)
                $root.ChatMatter.encode(message.arrChatRecord[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified LogonZhiBoRsp message, length delimited. Does not implicitly {@link LogonZhiBoRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogonZhiBoRsp
     * @static
     * @param {ILogonZhiBoRsp} message LogonZhiBoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonZhiBoRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogonZhiBoRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LogonZhiBoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogonZhiBoRsp} LogonZhiBoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonZhiBoRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonZhiBoRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nRlt = reader.int32();
                    break;
                }
            case 2: {
                    if (!(message.arrChatRecord && message.arrChatRecord.length))
                        message.arrChatRecord = [];
                    message.arrChatRecord.push($root.ChatMatter.decode(reader, reader.uint32()));
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        return message;
    };

    /**
     * Decodes a LogonZhiBoRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogonZhiBoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogonZhiBoRsp} LogonZhiBoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonZhiBoRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogonZhiBoRsp message.
     * @function verify
     * @memberof LogonZhiBoRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogonZhiBoRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (message.arrChatRecord != null && message.hasOwnProperty("arrChatRecord")) {
            if (!Array.isArray(message.arrChatRecord))
                return "arrChatRecord: array expected";
            for (var i = 0; i < message.arrChatRecord.length; ++i) {
                var error = $root.ChatMatter.verify(message.arrChatRecord[i]);
                if (error)
                    return "arrChatRecord." + error;
            }
        }
        return null;
    };

    /**
     * Creates a LogonZhiBoRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogonZhiBoRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogonZhiBoRsp} LogonZhiBoRsp
     */
    LogonZhiBoRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LogonZhiBoRsp)
            return object;
        var message = new $root.LogonZhiBoRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.arrChatRecord) {
            if (!Array.isArray(object.arrChatRecord))
                throw TypeError(".LogonZhiBoRsp.arrChatRecord: array expected");
            message.arrChatRecord = [];
            for (var i = 0; i < object.arrChatRecord.length; ++i) {
                if (typeof object.arrChatRecord[i] !== "object")
                    throw TypeError(".LogonZhiBoRsp.arrChatRecord: object expected");
                message.arrChatRecord[i] = $root.ChatMatter.fromObject(object.arrChatRecord[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a LogonZhiBoRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogonZhiBoRsp
     * @static
     * @param {LogonZhiBoRsp} message LogonZhiBoRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogonZhiBoRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrChatRecord = [];
        if (options.defaults)
            object.nRlt = 0;
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.arrChatRecord && message.arrChatRecord.length) {
            object.arrChatRecord = [];
            for (var j = 0; j < message.arrChatRecord.length; ++j)
                object.arrChatRecord[j] = $root.ChatMatter.toObject(message.arrChatRecord[j], options);
        }
        return object;
    };

    /**
     * Converts this LogonZhiBoRsp to JSON.
     * @function toJSON
     * @memberof LogonZhiBoRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogonZhiBoRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LogonZhiBoRsp
     * @function getTypeUrl
     * @memberof LogonZhiBoRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LogonZhiBoRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LogonZhiBoRsp";
    };

    return LogonZhiBoRsp;
})();

$root.ZhiBoChatReq = (function() {

    /**
     * Properties of a ZhiBoChatReq.
     * @exports IZhiBoChatReq
     * @interface IZhiBoChatReq
     * @property {string|null} [sTableId] ZhiBoChatReq sTableId
     * @property {number|null} [nType] ZhiBoChatReq nType
     * @property {string|null} [sStr] ZhiBoChatReq sStr
     */

    /**
     * Constructs a new ZhiBoChatReq.
     * @exports ZhiBoChatReq
     * @classdesc Represents a ZhiBoChatReq.
     * @implements IZhiBoChatReq
     * @constructor
     * @param {IZhiBoChatReq=} [properties] Properties to set
     */
    function ZhiBoChatReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ZhiBoChatReq sTableId.
     * @member {string} sTableId
     * @memberof ZhiBoChatReq
     * @instance
     */
    ZhiBoChatReq.prototype.sTableId = "";

    /**
     * ZhiBoChatReq nType.
     * @member {number} nType
     * @memberof ZhiBoChatReq
     * @instance
     */
    ZhiBoChatReq.prototype.nType = 0;

    /**
     * ZhiBoChatReq sStr.
     * @member {string} sStr
     * @memberof ZhiBoChatReq
     * @instance
     */
    ZhiBoChatReq.prototype.sStr = "";

    /**
     * Creates a new ZhiBoChatReq instance using the specified properties.
     * @function create
     * @memberof ZhiBoChatReq
     * @static
     * @param {IZhiBoChatReq=} [properties] Properties to set
     * @returns {ZhiBoChatReq} ZhiBoChatReq instance
     */
    ZhiBoChatReq.create = function create(properties) {
        return new ZhiBoChatReq(properties);
    };

    /**
     * Encodes the specified ZhiBoChatReq message. Does not implicitly {@link ZhiBoChatReq.verify|verify} messages.
     * @function encode
     * @memberof ZhiBoChatReq
     * @static
     * @param {IZhiBoChatReq} message ZhiBoChatReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ZhiBoChatReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTableId);
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        if (message.sStr != null && Object.hasOwnProperty.call(message, "sStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sStr);
        return writer;
    };

    /**
     * Encodes the specified ZhiBoChatReq message, length delimited. Does not implicitly {@link ZhiBoChatReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ZhiBoChatReq
     * @static
     * @param {IZhiBoChatReq} message ZhiBoChatReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ZhiBoChatReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ZhiBoChatReq message from the specified reader or buffer.
     * @function decode
     * @memberof ZhiBoChatReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ZhiBoChatReq} ZhiBoChatReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ZhiBoChatReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ZhiBoChatReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sTableId = reader.string();
                    break;
                }
            case 2: {
                    message.nType = reader.int32();
                    break;
                }
            case 3: {
                    message.sStr = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ZhiBoChatReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ZhiBoChatReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ZhiBoChatReq} ZhiBoChatReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ZhiBoChatReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ZhiBoChatReq message.
     * @function verify
     * @memberof ZhiBoChatReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ZhiBoChatReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            if (!$util.isString(message.sStr))
                return "sStr: string expected";
        return null;
    };

    /**
     * Creates a ZhiBoChatReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ZhiBoChatReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ZhiBoChatReq} ZhiBoChatReq
     */
    ZhiBoChatReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ZhiBoChatReq)
            return object;
        var message = new $root.ZhiBoChatReq();
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.sStr != null)
            message.sStr = String(object.sStr);
        return message;
    };

    /**
     * Creates a plain object from a ZhiBoChatReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ZhiBoChatReq
     * @static
     * @param {ZhiBoChatReq} message ZhiBoChatReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ZhiBoChatReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sTableId = "";
            object.nType = 0;
            object.sStr = "";
        }
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            object.sStr = message.sStr;
        return object;
    };

    /**
     * Converts this ZhiBoChatReq to JSON.
     * @function toJSON
     * @memberof ZhiBoChatReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ZhiBoChatReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ZhiBoChatReq
     * @function getTypeUrl
     * @memberof ZhiBoChatReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ZhiBoChatReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ZhiBoChatReq";
    };

    return ZhiBoChatReq;
})();

$root.ZhiBoChatRsp = (function() {

    /**
     * Properties of a ZhiBoChatRsp.
     * @exports IZhiBoChatRsp
     * @interface IZhiBoChatRsp
     * @property {number} nRlt ZhiBoChatRsp nRlt
     */

    /**
     * Constructs a new ZhiBoChatRsp.
     * @exports ZhiBoChatRsp
     * @classdesc Represents a ZhiBoChatRsp.
     * @implements IZhiBoChatRsp
     * @constructor
     * @param {IZhiBoChatRsp=} [properties] Properties to set
     */
    function ZhiBoChatRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ZhiBoChatRsp nRlt.
     * @member {number} nRlt
     * @memberof ZhiBoChatRsp
     * @instance
     */
    ZhiBoChatRsp.prototype.nRlt = 0;

    /**
     * Creates a new ZhiBoChatRsp instance using the specified properties.
     * @function create
     * @memberof ZhiBoChatRsp
     * @static
     * @param {IZhiBoChatRsp=} [properties] Properties to set
     * @returns {ZhiBoChatRsp} ZhiBoChatRsp instance
     */
    ZhiBoChatRsp.create = function create(properties) {
        return new ZhiBoChatRsp(properties);
    };

    /**
     * Encodes the specified ZhiBoChatRsp message. Does not implicitly {@link ZhiBoChatRsp.verify|verify} messages.
     * @function encode
     * @memberof ZhiBoChatRsp
     * @static
     * @param {IZhiBoChatRsp} message ZhiBoChatRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ZhiBoChatRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        return writer;
    };

    /**
     * Encodes the specified ZhiBoChatRsp message, length delimited. Does not implicitly {@link ZhiBoChatRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ZhiBoChatRsp
     * @static
     * @param {IZhiBoChatRsp} message ZhiBoChatRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ZhiBoChatRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ZhiBoChatRsp message from the specified reader or buffer.
     * @function decode
     * @memberof ZhiBoChatRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ZhiBoChatRsp} ZhiBoChatRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ZhiBoChatRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ZhiBoChatRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nRlt = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        return message;
    };

    /**
     * Decodes a ZhiBoChatRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ZhiBoChatRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ZhiBoChatRsp} ZhiBoChatRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ZhiBoChatRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ZhiBoChatRsp message.
     * @function verify
     * @memberof ZhiBoChatRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ZhiBoChatRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        return null;
    };

    /**
     * Creates a ZhiBoChatRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ZhiBoChatRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ZhiBoChatRsp} ZhiBoChatRsp
     */
    ZhiBoChatRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.ZhiBoChatRsp)
            return object;
        var message = new $root.ZhiBoChatRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        return message;
    };

    /**
     * Creates a plain object from a ZhiBoChatRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ZhiBoChatRsp
     * @static
     * @param {ZhiBoChatRsp} message ZhiBoChatRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ZhiBoChatRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nRlt = 0;
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        return object;
    };

    /**
     * Converts this ZhiBoChatRsp to JSON.
     * @function toJSON
     * @memberof ZhiBoChatRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ZhiBoChatRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ZhiBoChatRsp
     * @function getTypeUrl
     * @memberof ZhiBoChatRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ZhiBoChatRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ZhiBoChatRsp";
    };

    return ZhiBoChatRsp;
})();

$root.ChatMatter = (function() {

    /**
     * Properties of a ChatMatter.
     * @exports IChatMatter
     * @interface IChatMatter
     * @property {number|null} [nUserId] ChatMatter nUserId
     * @property {string|null} [sName] ChatMatter sName
     * @property {string|null} [sFaceId] ChatMatter sFaceId
     * @property {number|null} [nType] ChatMatter nType
     * @property {string|null} [sStr] ChatMatter sStr
     */

    /**
     * Constructs a new ChatMatter.
     * @exports ChatMatter
     * @classdesc Represents a ChatMatter.
     * @implements IChatMatter
     * @constructor
     * @param {IChatMatter=} [properties] Properties to set
     */
    function ChatMatter(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatMatter nUserId.
     * @member {number} nUserId
     * @memberof ChatMatter
     * @instance
     */
    ChatMatter.prototype.nUserId = 0;

    /**
     * ChatMatter sName.
     * @member {string} sName
     * @memberof ChatMatter
     * @instance
     */
    ChatMatter.prototype.sName = "";

    /**
     * ChatMatter sFaceId.
     * @member {string} sFaceId
     * @memberof ChatMatter
     * @instance
     */
    ChatMatter.prototype.sFaceId = "";

    /**
     * ChatMatter nType.
     * @member {number} nType
     * @memberof ChatMatter
     * @instance
     */
    ChatMatter.prototype.nType = 0;

    /**
     * ChatMatter sStr.
     * @member {string} sStr
     * @memberof ChatMatter
     * @instance
     */
    ChatMatter.prototype.sStr = "";

    /**
     * Creates a new ChatMatter instance using the specified properties.
     * @function create
     * @memberof ChatMatter
     * @static
     * @param {IChatMatter=} [properties] Properties to set
     * @returns {ChatMatter} ChatMatter instance
     */
    ChatMatter.create = function create(properties) {
        return new ChatMatter(properties);
    };

    /**
     * Encodes the specified ChatMatter message. Does not implicitly {@link ChatMatter.verify|verify} messages.
     * @function encode
     * @memberof ChatMatter
     * @static
     * @param {IChatMatter} message ChatMatter message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatMatter.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        if (message.sName != null && Object.hasOwnProperty.call(message, "sName"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sName);
        if (message.sFaceId != null && Object.hasOwnProperty.call(message, "sFaceId"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sFaceId);
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nType);
        if (message.sStr != null && Object.hasOwnProperty.call(message, "sStr"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sStr);
        return writer;
    };

    /**
     * Encodes the specified ChatMatter message, length delimited. Does not implicitly {@link ChatMatter.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatMatter
     * @static
     * @param {IChatMatter} message ChatMatter message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatMatter.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatMatter message from the specified reader or buffer.
     * @function decode
     * @memberof ChatMatter
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatMatter} ChatMatter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatMatter.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatMatter();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserId = reader.int32();
                    break;
                }
            case 2: {
                    message.sName = reader.string();
                    break;
                }
            case 3: {
                    message.sFaceId = reader.string();
                    break;
                }
            case 4: {
                    message.nType = reader.int32();
                    break;
                }
            case 5: {
                    message.sStr = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatMatter message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatMatter
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatMatter} ChatMatter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatMatter.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatMatter message.
     * @function verify
     * @memberof ChatMatter
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatMatter.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        if (message.sName != null && message.hasOwnProperty("sName"))
            if (!$util.isString(message.sName))
                return "sName: string expected";
        if (message.sFaceId != null && message.hasOwnProperty("sFaceId"))
            if (!$util.isString(message.sFaceId))
                return "sFaceId: string expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            if (!$util.isString(message.sStr))
                return "sStr: string expected";
        return null;
    };

    /**
     * Creates a ChatMatter message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatMatter
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatMatter} ChatMatter
     */
    ChatMatter.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatMatter)
            return object;
        var message = new $root.ChatMatter();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.sName != null)
            message.sName = String(object.sName);
        if (object.sFaceId != null)
            message.sFaceId = String(object.sFaceId);
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.sStr != null)
            message.sStr = String(object.sStr);
        return message;
    };

    /**
     * Creates a plain object from a ChatMatter message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatMatter
     * @static
     * @param {ChatMatter} message ChatMatter
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatMatter.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.sName = "";
            object.sFaceId = "";
            object.nType = 0;
            object.sStr = "";
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.sName != null && message.hasOwnProperty("sName"))
            object.sName = message.sName;
        if (message.sFaceId != null && message.hasOwnProperty("sFaceId"))
            object.sFaceId = message.sFaceId;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.sStr != null && message.hasOwnProperty("sStr"))
            object.sStr = message.sStr;
        return object;
    };

    /**
     * Converts this ChatMatter to JSON.
     * @function toJSON
     * @memberof ChatMatter
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatMatter.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatMatter
     * @function getTypeUrl
     * @memberof ChatMatter
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatMatter.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatMatter";
    };

    return ChatMatter;
})();

$root.ChatNotify = (function() {

    /**
     * Properties of a ChatNotify.
     * @exports IChatNotify
     * @interface IChatNotify
     * @property {IChatMatter} tChatMatter ChatNotify tChatMatter
     */

    /**
     * Constructs a new ChatNotify.
     * @exports ChatNotify
     * @classdesc Represents a ChatNotify.
     * @implements IChatNotify
     * @constructor
     * @param {IChatNotify=} [properties] Properties to set
     */
    function ChatNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatNotify tChatMatter.
     * @member {IChatMatter} tChatMatter
     * @memberof ChatNotify
     * @instance
     */
    ChatNotify.prototype.tChatMatter = null;

    /**
     * Creates a new ChatNotify instance using the specified properties.
     * @function create
     * @memberof ChatNotify
     * @static
     * @param {IChatNotify=} [properties] Properties to set
     * @returns {ChatNotify} ChatNotify instance
     */
    ChatNotify.create = function create(properties) {
        return new ChatNotify(properties);
    };

    /**
     * Encodes the specified ChatNotify message. Does not implicitly {@link ChatNotify.verify|verify} messages.
     * @function encode
     * @memberof ChatNotify
     * @static
     * @param {IChatNotify} message ChatNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        $root.ChatMatter.encode(message.tChatMatter, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ChatNotify message, length delimited. Does not implicitly {@link ChatNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatNotify
     * @static
     * @param {IChatNotify} message ChatNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatNotify message from the specified reader or buffer.
     * @function decode
     * @memberof ChatNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatNotify} ChatNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatNotify.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.tChatMatter = $root.ChatMatter.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("tChatMatter"))
            throw $util.ProtocolError("missing required 'tChatMatter'", { instance: message });
        return message;
    };

    /**
     * Decodes a ChatNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatNotify} ChatNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatNotify message.
     * @function verify
     * @memberof ChatNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        {
            var error = $root.ChatMatter.verify(message.tChatMatter);
            if (error)
                return "tChatMatter." + error;
        }
        return null;
    };

    /**
     * Creates a ChatNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatNotify} ChatNotify
     */
    ChatNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatNotify)
            return object;
        var message = new $root.ChatNotify();
        if (object.tChatMatter != null) {
            if (typeof object.tChatMatter !== "object")
                throw TypeError(".ChatNotify.tChatMatter: object expected");
            message.tChatMatter = $root.ChatMatter.fromObject(object.tChatMatter);
        }
        return message;
    };

    /**
     * Creates a plain object from a ChatNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatNotify
     * @static
     * @param {ChatNotify} message ChatNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.tChatMatter = null;
        if (message.tChatMatter != null && message.hasOwnProperty("tChatMatter"))
            object.tChatMatter = $root.ChatMatter.toObject(message.tChatMatter, options);
        return object;
    };

    /**
     * Converts this ChatNotify to JSON.
     * @function toJSON
     * @memberof ChatNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatNotify
     * @function getTypeUrl
     * @memberof ChatNotify
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatNotify.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatNotify";
    };

    return ChatNotify;
})();

$root.ChatVedioLogonReq = (function() {

    /**
     * Properties of a ChatVedioLogonReq.
     * @exports IChatVedioLogonReq
     * @interface IChatVedioLogonReq
     * @property {number|null} [nChatType] ChatVedioLogonReq nChatType
     * @property {string|null} [sTableId] ChatVedioLogonReq sTableId
     * @property {number|null} [nUserId] ChatVedioLogonReq nUserId
     */

    /**
     * Constructs a new ChatVedioLogonReq.
     * @exports ChatVedioLogonReq
     * @classdesc Represents a ChatVedioLogonReq.
     * @implements IChatVedioLogonReq
     * @constructor
     * @param {IChatVedioLogonReq=} [properties] Properties to set
     */
    function ChatVedioLogonReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatVedioLogonReq nChatType.
     * @member {number} nChatType
     * @memberof ChatVedioLogonReq
     * @instance
     */
    ChatVedioLogonReq.prototype.nChatType = 0;

    /**
     * ChatVedioLogonReq sTableId.
     * @member {string} sTableId
     * @memberof ChatVedioLogonReq
     * @instance
     */
    ChatVedioLogonReq.prototype.sTableId = "";

    /**
     * ChatVedioLogonReq nUserId.
     * @member {number} nUserId
     * @memberof ChatVedioLogonReq
     * @instance
     */
    ChatVedioLogonReq.prototype.nUserId = 0;

    /**
     * Creates a new ChatVedioLogonReq instance using the specified properties.
     * @function create
     * @memberof ChatVedioLogonReq
     * @static
     * @param {IChatVedioLogonReq=} [properties] Properties to set
     * @returns {ChatVedioLogonReq} ChatVedioLogonReq instance
     */
    ChatVedioLogonReq.create = function create(properties) {
        return new ChatVedioLogonReq(properties);
    };

    /**
     * Encodes the specified ChatVedioLogonReq message. Does not implicitly {@link ChatVedioLogonReq.verify|verify} messages.
     * @function encode
     * @memberof ChatVedioLogonReq
     * @static
     * @param {IChatVedioLogonReq} message ChatVedioLogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatVedioLogonReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nChatType != null && Object.hasOwnProperty.call(message, "nChatType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nChatType);
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTableId);
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified ChatVedioLogonReq message, length delimited. Does not implicitly {@link ChatVedioLogonReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatVedioLogonReq
     * @static
     * @param {IChatVedioLogonReq} message ChatVedioLogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatVedioLogonReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatVedioLogonReq message from the specified reader or buffer.
     * @function decode
     * @memberof ChatVedioLogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatVedioLogonReq} ChatVedioLogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatVedioLogonReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatVedioLogonReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nChatType = reader.int32();
                    break;
                }
            case 2: {
                    message.sTableId = reader.string();
                    break;
                }
            case 3: {
                    message.nUserId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatVedioLogonReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatVedioLogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatVedioLogonReq} ChatVedioLogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatVedioLogonReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatVedioLogonReq message.
     * @function verify
     * @memberof ChatVedioLogonReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatVedioLogonReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            if (!$util.isInteger(message.nChatType))
                return "nChatType: integer expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a ChatVedioLogonReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatVedioLogonReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatVedioLogonReq} ChatVedioLogonReq
     */
    ChatVedioLogonReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatVedioLogonReq)
            return object;
        var message = new $root.ChatVedioLogonReq();
        if (object.nChatType != null)
            message.nChatType = object.nChatType | 0;
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a ChatVedioLogonReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatVedioLogonReq
     * @static
     * @param {ChatVedioLogonReq} message ChatVedioLogonReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatVedioLogonReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nChatType = 0;
            object.sTableId = "";
            object.nUserId = 0;
        }
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            object.nChatType = message.nChatType;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        return object;
    };

    /**
     * Converts this ChatVedioLogonReq to JSON.
     * @function toJSON
     * @memberof ChatVedioLogonReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatVedioLogonReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatVedioLogonReq
     * @function getTypeUrl
     * @memberof ChatVedioLogonReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatVedioLogonReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatVedioLogonReq";
    };

    return ChatVedioLogonReq;
})();

$root.ChatVedioLogonRsp = (function() {

    /**
     * Properties of a ChatVedioLogonRsp.
     * @exports IChatVedioLogonRsp
     * @interface IChatVedioLogonRsp
     * @property {number|null} [nChatType] ChatVedioLogonRsp nChatType
     * @property {number} nRlt ChatVedioLogonRsp nRlt
     * @property {string} token ChatVedioLogonRsp token
     * @property {string|null} [vTid] ChatVedioLogonRsp vTid
     */

    /**
     * Constructs a new ChatVedioLogonRsp.
     * @exports ChatVedioLogonRsp
     * @classdesc Represents a ChatVedioLogonRsp.
     * @implements IChatVedioLogonRsp
     * @constructor
     * @param {IChatVedioLogonRsp=} [properties] Properties to set
     */
    function ChatVedioLogonRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatVedioLogonRsp nChatType.
     * @member {number} nChatType
     * @memberof ChatVedioLogonRsp
     * @instance
     */
    ChatVedioLogonRsp.prototype.nChatType = 0;

    /**
     * ChatVedioLogonRsp nRlt.
     * @member {number} nRlt
     * @memberof ChatVedioLogonRsp
     * @instance
     */
    ChatVedioLogonRsp.prototype.nRlt = 0;

    /**
     * ChatVedioLogonRsp token.
     * @member {string} token
     * @memberof ChatVedioLogonRsp
     * @instance
     */
    ChatVedioLogonRsp.prototype.token = "";

    /**
     * ChatVedioLogonRsp vTid.
     * @member {string} vTid
     * @memberof ChatVedioLogonRsp
     * @instance
     */
    ChatVedioLogonRsp.prototype.vTid = "";

    /**
     * Creates a new ChatVedioLogonRsp instance using the specified properties.
     * @function create
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {IChatVedioLogonRsp=} [properties] Properties to set
     * @returns {ChatVedioLogonRsp} ChatVedioLogonRsp instance
     */
    ChatVedioLogonRsp.create = function create(properties) {
        return new ChatVedioLogonRsp(properties);
    };

    /**
     * Encodes the specified ChatVedioLogonRsp message. Does not implicitly {@link ChatVedioLogonRsp.verify|verify} messages.
     * @function encode
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {IChatVedioLogonRsp} message ChatVedioLogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatVedioLogonRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nChatType != null && Object.hasOwnProperty.call(message, "nChatType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nChatType);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRlt);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.token);
        if (message.vTid != null && Object.hasOwnProperty.call(message, "vTid"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.vTid);
        return writer;
    };

    /**
     * Encodes the specified ChatVedioLogonRsp message, length delimited. Does not implicitly {@link ChatVedioLogonRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {IChatVedioLogonRsp} message ChatVedioLogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatVedioLogonRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatVedioLogonRsp message from the specified reader or buffer.
     * @function decode
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatVedioLogonRsp} ChatVedioLogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatVedioLogonRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatVedioLogonRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nChatType = reader.int32();
                    break;
                }
            case 2: {
                    message.nRlt = reader.int32();
                    break;
                }
            case 3: {
                    message.token = reader.string();
                    break;
                }
            case 4: {
                    message.vTid = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        if (!message.hasOwnProperty("token"))
            throw $util.ProtocolError("missing required 'token'", { instance: message });
        return message;
    };

    /**
     * Decodes a ChatVedioLogonRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatVedioLogonRsp} ChatVedioLogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatVedioLogonRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatVedioLogonRsp message.
     * @function verify
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatVedioLogonRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            if (!$util.isInteger(message.nChatType))
                return "nChatType: integer expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (!$util.isString(message.token))
            return "token: string expected";
        if (message.vTid != null && message.hasOwnProperty("vTid"))
            if (!$util.isString(message.vTid))
                return "vTid: string expected";
        return null;
    };

    /**
     * Creates a ChatVedioLogonRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatVedioLogonRsp} ChatVedioLogonRsp
     */
    ChatVedioLogonRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatVedioLogonRsp)
            return object;
        var message = new $root.ChatVedioLogonRsp();
        if (object.nChatType != null)
            message.nChatType = object.nChatType | 0;
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.token != null)
            message.token = String(object.token);
        if (object.vTid != null)
            message.vTid = String(object.vTid);
        return message;
    };

    /**
     * Creates a plain object from a ChatVedioLogonRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {ChatVedioLogonRsp} message ChatVedioLogonRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatVedioLogonRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nChatType = 0;
            object.nRlt = 0;
            object.token = "";
            object.vTid = "";
        }
        if (message.nChatType != null && message.hasOwnProperty("nChatType"))
            object.nChatType = message.nChatType;
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        if (message.vTid != null && message.hasOwnProperty("vTid"))
            object.vTid = message.vTid;
        return object;
    };

    /**
     * Converts this ChatVedioLogonRsp to JSON.
     * @function toJSON
     * @memberof ChatVedioLogonRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatVedioLogonRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ChatVedioLogonRsp
     * @function getTypeUrl
     * @memberof ChatVedioLogonRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ChatVedioLogonRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ChatVedioLogonRsp";
    };

    return ChatVedioLogonRsp;
})();

module.exports = $root;
