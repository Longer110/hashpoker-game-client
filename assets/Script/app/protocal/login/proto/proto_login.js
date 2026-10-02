/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Gateway_Proto = (function() {

    /**
     * Properties of a Gateway_Proto.
     * @exports IGateway_Proto
     * @interface IGateway_Proto
     * @property {number} GATEWAY Gateway_Proto GATEWAY
     */

    /**
     * Constructs a new Gateway_Proto.
     * @exports Gateway_Proto
     * @classdesc Represents a Gateway_Proto.
     * @implements IGateway_Proto
     * @constructor
     * @param {IGateway_Proto=} [properties] Properties to set
     */
    function Gateway_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Gateway_Proto GATEWAY.
     * @member {number} GATEWAY
     * @memberof Gateway_Proto
     * @instance
     */
    Gateway_Proto.prototype.GATEWAY = 1000;

    /**
     * Creates a new Gateway_Proto instance using the specified properties.
     * @function create
     * @memberof Gateway_Proto
     * @static
     * @param {IGateway_Proto=} [properties] Properties to set
     * @returns {Gateway_Proto} Gateway_Proto instance
     */
    Gateway_Proto.create = function create(properties) {
        return new Gateway_Proto(properties);
    };

    /**
     * Encodes the specified Gateway_Proto message. Does not implicitly {@link Gateway_Proto.verify|verify} messages.
     * @function encode
     * @memberof Gateway_Proto
     * @static
     * @param {IGateway_Proto} message Gateway_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Gateway_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.GATEWAY);
        return writer;
    };

    /**
     * Encodes the specified Gateway_Proto message, length delimited. Does not implicitly {@link Gateway_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Gateway_Proto
     * @static
     * @param {IGateway_Proto} message Gateway_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Gateway_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Gateway_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Gateway_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Gateway_Proto} Gateway_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Gateway_Proto.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Gateway_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.GATEWAY = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("GATEWAY"))
            throw $util.ProtocolError("missing required 'GATEWAY'", { instance: message });
        return message;
    };

    /**
     * Decodes a Gateway_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Gateway_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Gateway_Proto} Gateway_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Gateway_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Gateway_Proto message.
     * @function verify
     * @memberof Gateway_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Gateway_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.GATEWAY))
            return "GATEWAY: integer expected";
        return null;
    };

    /**
     * Creates a Gateway_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Gateway_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Gateway_Proto} Gateway_Proto
     */
    Gateway_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Gateway_Proto)
            return object;
        var message = new $root.Gateway_Proto();
        if (object.GATEWAY != null)
            message.GATEWAY = object.GATEWAY | 0;
        return message;
    };

    /**
     * Creates a plain object from a Gateway_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Gateway_Proto
     * @static
     * @param {Gateway_Proto} message Gateway_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Gateway_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.GATEWAY = 1000;
        if (message.GATEWAY != null && message.hasOwnProperty("GATEWAY"))
            object.GATEWAY = message.GATEWAY;
        return object;
    };

    /**
     * Converts this Gateway_Proto to JSON.
     * @function toJSON
     * @memberof Gateway_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Gateway_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Gateway_Proto
     * @function getTypeUrl
     * @memberof Gateway_Proto
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Gateway_Proto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Gateway_Proto";
    };

    return Gateway_Proto;
})();

$root.Sub_GateWay = (function() {

    /**
     * Properties of a Sub_GateWay.
     * @exports ISub_GateWay
     * @interface ISub_GateWay
     * @property {number} SUB_GATEWAY_CLIENT_CLOSE Sub_GateWay SUB_GATEWAY_CLIENT_CLOSE
     * @property {number} SUB_GATEWAY_STOP_SERVER_MAINTAIN Sub_GateWay SUB_GATEWAY_STOP_SERVER_MAINTAIN
     * @property {number} SUB_REP_WEB_CONFIG_UPDATE Sub_GateWay SUB_REP_WEB_CONFIG_UPDATE
     * @property {number} SUB_GATEWAY_REBOOT Sub_GateWay SUB_GATEWAY_REBOOT
     * @property {number} SUB_GATEWAY_REQUEST_VERSION Sub_GateWay SUB_GATEWAY_REQUEST_VERSION
     * @property {number} SUB_REQ_DB_USER_IP Sub_GateWay SUB_REQ_DB_USER_IP
     * @property {number} SUB_REQ_VERSION_INFO Sub_GateWay SUB_REQ_VERSION_INFO
     * @property {number} SUB_REP_VERSION_INFO Sub_GateWay SUB_REP_VERSION_INFO
     * @property {number} SUB_REQ_PHONE_UPDATE Sub_GateWay SUB_REQ_PHONE_UPDATE
     * @property {number} SUB_REQ_GAMESRV_SWICTHCONN Sub_GateWay SUB_REQ_GAMESRV_SWICTHCONN
     * @property {number} SUB_GATEWAY_NOTICE Sub_GateWay SUB_GATEWAY_NOTICE
     * @property {number} SUB_GATEWEY_USERGAME Sub_GateWay SUB_GATEWEY_USERGAME
     * @property {number} SUB_GATEWEY_BROAD Sub_GateWay SUB_GATEWEY_BROAD
     * @property {number} SUB_REQ_QUICKSEND Sub_GateWay SUB_REQ_QUICKSEND
     * @property {number} SUB_CORR_CAPITAL Sub_GateWay SUB_CORR_CAPITAL
     * @property {number} SUB_REP_TableSettleInfo Sub_GateWay SUB_REP_TableSettleInfo
     * @property {number} SUB_REQ_CHECKOFFICIAL Sub_GateWay SUB_REQ_CHECKOFFICIAL
     * @property {number} SUB_REP_CHECKOFFICIAL Sub_GateWay SUB_REP_CHECKOFFICIAL
     * @property {number} SUB_NOTICE_MSG Sub_GateWay SUB_NOTICE_MSG
     */

    /**
     * Constructs a new Sub_GateWay.
     * @exports Sub_GateWay
     * @classdesc Represents a Sub_GateWay.
     * @implements ISub_GateWay
     * @constructor
     * @param {ISub_GateWay=} [properties] Properties to set
     */
    function Sub_GateWay(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Sub_GateWay SUB_GATEWAY_CLIENT_CLOSE.
     * @member {number} SUB_GATEWAY_CLIENT_CLOSE
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWAY_CLIENT_CLOSE = 1;

    /**
     * Sub_GateWay SUB_GATEWAY_STOP_SERVER_MAINTAIN.
     * @member {number} SUB_GATEWAY_STOP_SERVER_MAINTAIN
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWAY_STOP_SERVER_MAINTAIN = 3;

    /**
     * Sub_GateWay SUB_REP_WEB_CONFIG_UPDATE.
     * @member {number} SUB_REP_WEB_CONFIG_UPDATE
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REP_WEB_CONFIG_UPDATE = 4;

    /**
     * Sub_GateWay SUB_GATEWAY_REBOOT.
     * @member {number} SUB_GATEWAY_REBOOT
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWAY_REBOOT = 5;

    /**
     * Sub_GateWay SUB_GATEWAY_REQUEST_VERSION.
     * @member {number} SUB_GATEWAY_REQUEST_VERSION
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWAY_REQUEST_VERSION = 6;

    /**
     * Sub_GateWay SUB_REQ_DB_USER_IP.
     * @member {number} SUB_REQ_DB_USER_IP
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_DB_USER_IP = 7;

    /**
     * Sub_GateWay SUB_REQ_VERSION_INFO.
     * @member {number} SUB_REQ_VERSION_INFO
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_VERSION_INFO = 8;

    /**
     * Sub_GateWay SUB_REP_VERSION_INFO.
     * @member {number} SUB_REP_VERSION_INFO
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REP_VERSION_INFO = 9;

    /**
     * Sub_GateWay SUB_REQ_PHONE_UPDATE.
     * @member {number} SUB_REQ_PHONE_UPDATE
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_PHONE_UPDATE = 10;

    /**
     * Sub_GateWay SUB_REQ_GAMESRV_SWICTHCONN.
     * @member {number} SUB_REQ_GAMESRV_SWICTHCONN
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_GAMESRV_SWICTHCONN = 11;

    /**
     * Sub_GateWay SUB_GATEWAY_NOTICE.
     * @member {number} SUB_GATEWAY_NOTICE
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWAY_NOTICE = 12;

    /**
     * Sub_GateWay SUB_GATEWEY_USERGAME.
     * @member {number} SUB_GATEWEY_USERGAME
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWEY_USERGAME = 15;

    /**
     * Sub_GateWay SUB_GATEWEY_BROAD.
     * @member {number} SUB_GATEWEY_BROAD
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_GATEWEY_BROAD = 16;

    /**
     * Sub_GateWay SUB_REQ_QUICKSEND.
     * @member {number} SUB_REQ_QUICKSEND
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_QUICKSEND = 17;

    /**
     * Sub_GateWay SUB_CORR_CAPITAL.
     * @member {number} SUB_CORR_CAPITAL
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_CORR_CAPITAL = 18;

    /**
     * Sub_GateWay SUB_REP_TableSettleInfo.
     * @member {number} SUB_REP_TableSettleInfo
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REP_TableSettleInfo = 19;

    /**
     * Sub_GateWay SUB_REQ_CHECKOFFICIAL.
     * @member {number} SUB_REQ_CHECKOFFICIAL
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REQ_CHECKOFFICIAL = 20;

    /**
     * Sub_GateWay SUB_REP_CHECKOFFICIAL.
     * @member {number} SUB_REP_CHECKOFFICIAL
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_REP_CHECKOFFICIAL = 21;

    /**
     * Sub_GateWay SUB_NOTICE_MSG.
     * @member {number} SUB_NOTICE_MSG
     * @memberof Sub_GateWay
     * @instance
     */
    Sub_GateWay.prototype.SUB_NOTICE_MSG = 26;

    /**
     * Creates a new Sub_GateWay instance using the specified properties.
     * @function create
     * @memberof Sub_GateWay
     * @static
     * @param {ISub_GateWay=} [properties] Properties to set
     * @returns {Sub_GateWay} Sub_GateWay instance
     */
    Sub_GateWay.create = function create(properties) {
        return new Sub_GateWay(properties);
    };

    /**
     * Encodes the specified Sub_GateWay message. Does not implicitly {@link Sub_GateWay.verify|verify} messages.
     * @function encode
     * @memberof Sub_GateWay
     * @static
     * @param {ISub_GateWay} message Sub_GateWay message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sub_GateWay.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.SUB_GATEWAY_CLIENT_CLOSE);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.SUB_GATEWAY_STOP_SERVER_MAINTAIN);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.SUB_REP_WEB_CONFIG_UPDATE);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.SUB_GATEWAY_REBOOT);
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.SUB_GATEWAY_REQUEST_VERSION);
        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.SUB_REQ_DB_USER_IP);
        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.SUB_REQ_VERSION_INFO);
        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.SUB_REP_VERSION_INFO);
        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.SUB_REQ_PHONE_UPDATE);
        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.SUB_REQ_GAMESRV_SWICTHCONN);
        writer.uint32(/* id 12, wireType 0 =*/96).int32(message.SUB_GATEWAY_NOTICE);
        writer.uint32(/* id 15, wireType 0 =*/120).int32(message.SUB_GATEWEY_USERGAME);
        writer.uint32(/* id 16, wireType 0 =*/128).int32(message.SUB_GATEWEY_BROAD);
        writer.uint32(/* id 17, wireType 0 =*/136).int32(message.SUB_REQ_QUICKSEND);
        writer.uint32(/* id 18, wireType 0 =*/144).int32(message.SUB_CORR_CAPITAL);
        writer.uint32(/* id 19, wireType 0 =*/152).int32(message.SUB_REP_TableSettleInfo);
        writer.uint32(/* id 20, wireType 0 =*/160).int32(message.SUB_REQ_CHECKOFFICIAL);
        writer.uint32(/* id 21, wireType 0 =*/168).int32(message.SUB_REP_CHECKOFFICIAL);
        writer.uint32(/* id 26, wireType 0 =*/208).int32(message.SUB_NOTICE_MSG);
        return writer;
    };

    /**
     * Encodes the specified Sub_GateWay message, length delimited. Does not implicitly {@link Sub_GateWay.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Sub_GateWay
     * @static
     * @param {ISub_GateWay} message Sub_GateWay message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sub_GateWay.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Sub_GateWay message from the specified reader or buffer.
     * @function decode
     * @memberof Sub_GateWay
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Sub_GateWay} Sub_GateWay
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sub_GateWay.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Sub_GateWay();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 2: {
                    message.SUB_GATEWAY_CLIENT_CLOSE = reader.int32();
                    break;
                }
            case 3: {
                    message.SUB_GATEWAY_STOP_SERVER_MAINTAIN = reader.int32();
                    break;
                }
            case 4: {
                    message.SUB_REP_WEB_CONFIG_UPDATE = reader.int32();
                    break;
                }
            case 5: {
                    message.SUB_GATEWAY_REBOOT = reader.int32();
                    break;
                }
            case 6: {
                    message.SUB_GATEWAY_REQUEST_VERSION = reader.int32();
                    break;
                }
            case 7: {
                    message.SUB_REQ_DB_USER_IP = reader.int32();
                    break;
                }
            case 8: {
                    message.SUB_REQ_VERSION_INFO = reader.int32();
                    break;
                }
            case 9: {
                    message.SUB_REP_VERSION_INFO = reader.int32();
                    break;
                }
            case 10: {
                    message.SUB_REQ_PHONE_UPDATE = reader.int32();
                    break;
                }
            case 11: {
                    message.SUB_REQ_GAMESRV_SWICTHCONN = reader.int32();
                    break;
                }
            case 12: {
                    message.SUB_GATEWAY_NOTICE = reader.int32();
                    break;
                }
            case 15: {
                    message.SUB_GATEWEY_USERGAME = reader.int32();
                    break;
                }
            case 16: {
                    message.SUB_GATEWEY_BROAD = reader.int32();
                    break;
                }
            case 17: {
                    message.SUB_REQ_QUICKSEND = reader.int32();
                    break;
                }
            case 18: {
                    message.SUB_CORR_CAPITAL = reader.int32();
                    break;
                }
            case 19: {
                    message.SUB_REP_TableSettleInfo = reader.int32();
                    break;
                }
            case 20: {
                    message.SUB_REQ_CHECKOFFICIAL = reader.int32();
                    break;
                }
            case 21: {
                    message.SUB_REP_CHECKOFFICIAL = reader.int32();
                    break;
                }
            case 26: {
                    message.SUB_NOTICE_MSG = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("SUB_GATEWAY_CLIENT_CLOSE"))
            throw $util.ProtocolError("missing required 'SUB_GATEWAY_CLIENT_CLOSE'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWAY_STOP_SERVER_MAINTAIN"))
            throw $util.ProtocolError("missing required 'SUB_GATEWAY_STOP_SERVER_MAINTAIN'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_WEB_CONFIG_UPDATE"))
            throw $util.ProtocolError("missing required 'SUB_REP_WEB_CONFIG_UPDATE'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWAY_REBOOT"))
            throw $util.ProtocolError("missing required 'SUB_GATEWAY_REBOOT'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWAY_REQUEST_VERSION"))
            throw $util.ProtocolError("missing required 'SUB_GATEWAY_REQUEST_VERSION'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_DB_USER_IP"))
            throw $util.ProtocolError("missing required 'SUB_REQ_DB_USER_IP'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_VERSION_INFO"))
            throw $util.ProtocolError("missing required 'SUB_REQ_VERSION_INFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_VERSION_INFO"))
            throw $util.ProtocolError("missing required 'SUB_REP_VERSION_INFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_PHONE_UPDATE"))
            throw $util.ProtocolError("missing required 'SUB_REQ_PHONE_UPDATE'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_GAMESRV_SWICTHCONN"))
            throw $util.ProtocolError("missing required 'SUB_REQ_GAMESRV_SWICTHCONN'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWAY_NOTICE"))
            throw $util.ProtocolError("missing required 'SUB_GATEWAY_NOTICE'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWEY_USERGAME"))
            throw $util.ProtocolError("missing required 'SUB_GATEWEY_USERGAME'", { instance: message });
        if (!message.hasOwnProperty("SUB_GATEWEY_BROAD"))
            throw $util.ProtocolError("missing required 'SUB_GATEWEY_BROAD'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_QUICKSEND"))
            throw $util.ProtocolError("missing required 'SUB_REQ_QUICKSEND'", { instance: message });
        if (!message.hasOwnProperty("SUB_CORR_CAPITAL"))
            throw $util.ProtocolError("missing required 'SUB_CORR_CAPITAL'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_TableSettleInfo"))
            throw $util.ProtocolError("missing required 'SUB_REP_TableSettleInfo'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_CHECKOFFICIAL"))
            throw $util.ProtocolError("missing required 'SUB_REQ_CHECKOFFICIAL'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_CHECKOFFICIAL"))
            throw $util.ProtocolError("missing required 'SUB_REP_CHECKOFFICIAL'", { instance: message });
        if (!message.hasOwnProperty("SUB_NOTICE_MSG"))
            throw $util.ProtocolError("missing required 'SUB_NOTICE_MSG'", { instance: message });
        return message;
    };

    /**
     * Decodes a Sub_GateWay message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Sub_GateWay
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Sub_GateWay} Sub_GateWay
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sub_GateWay.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Sub_GateWay message.
     * @function verify
     * @memberof Sub_GateWay
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Sub_GateWay.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.SUB_GATEWAY_CLIENT_CLOSE))
            return "SUB_GATEWAY_CLIENT_CLOSE: integer expected";
        if (!$util.isInteger(message.SUB_GATEWAY_STOP_SERVER_MAINTAIN))
            return "SUB_GATEWAY_STOP_SERVER_MAINTAIN: integer expected";
        if (!$util.isInteger(message.SUB_REP_WEB_CONFIG_UPDATE))
            return "SUB_REP_WEB_CONFIG_UPDATE: integer expected";
        if (!$util.isInteger(message.SUB_GATEWAY_REBOOT))
            return "SUB_GATEWAY_REBOOT: integer expected";
        if (!$util.isInteger(message.SUB_GATEWAY_REQUEST_VERSION))
            return "SUB_GATEWAY_REQUEST_VERSION: integer expected";
        if (!$util.isInteger(message.SUB_REQ_DB_USER_IP))
            return "SUB_REQ_DB_USER_IP: integer expected";
        if (!$util.isInteger(message.SUB_REQ_VERSION_INFO))
            return "SUB_REQ_VERSION_INFO: integer expected";
        if (!$util.isInteger(message.SUB_REP_VERSION_INFO))
            return "SUB_REP_VERSION_INFO: integer expected";
        if (!$util.isInteger(message.SUB_REQ_PHONE_UPDATE))
            return "SUB_REQ_PHONE_UPDATE: integer expected";
        if (!$util.isInteger(message.SUB_REQ_GAMESRV_SWICTHCONN))
            return "SUB_REQ_GAMESRV_SWICTHCONN: integer expected";
        if (!$util.isInteger(message.SUB_GATEWAY_NOTICE))
            return "SUB_GATEWAY_NOTICE: integer expected";
        if (!$util.isInteger(message.SUB_GATEWEY_USERGAME))
            return "SUB_GATEWEY_USERGAME: integer expected";
        if (!$util.isInteger(message.SUB_GATEWEY_BROAD))
            return "SUB_GATEWEY_BROAD: integer expected";
        if (!$util.isInteger(message.SUB_REQ_QUICKSEND))
            return "SUB_REQ_QUICKSEND: integer expected";
        if (!$util.isInteger(message.SUB_CORR_CAPITAL))
            return "SUB_CORR_CAPITAL: integer expected";
        if (!$util.isInteger(message.SUB_REP_TableSettleInfo))
            return "SUB_REP_TableSettleInfo: integer expected";
        if (!$util.isInteger(message.SUB_REQ_CHECKOFFICIAL))
            return "SUB_REQ_CHECKOFFICIAL: integer expected";
        if (!$util.isInteger(message.SUB_REP_CHECKOFFICIAL))
            return "SUB_REP_CHECKOFFICIAL: integer expected";
        if (!$util.isInteger(message.SUB_NOTICE_MSG))
            return "SUB_NOTICE_MSG: integer expected";
        return null;
    };

    /**
     * Creates a Sub_GateWay message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Sub_GateWay
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Sub_GateWay} Sub_GateWay
     */
    Sub_GateWay.fromObject = function fromObject(object) {
        if (object instanceof $root.Sub_GateWay)
            return object;
        var message = new $root.Sub_GateWay();
        if (object.SUB_GATEWAY_CLIENT_CLOSE != null)
            message.SUB_GATEWAY_CLIENT_CLOSE = object.SUB_GATEWAY_CLIENT_CLOSE | 0;
        if (object.SUB_GATEWAY_STOP_SERVER_MAINTAIN != null)
            message.SUB_GATEWAY_STOP_SERVER_MAINTAIN = object.SUB_GATEWAY_STOP_SERVER_MAINTAIN | 0;
        if (object.SUB_REP_WEB_CONFIG_UPDATE != null)
            message.SUB_REP_WEB_CONFIG_UPDATE = object.SUB_REP_WEB_CONFIG_UPDATE | 0;
        if (object.SUB_GATEWAY_REBOOT != null)
            message.SUB_GATEWAY_REBOOT = object.SUB_GATEWAY_REBOOT | 0;
        if (object.SUB_GATEWAY_REQUEST_VERSION != null)
            message.SUB_GATEWAY_REQUEST_VERSION = object.SUB_GATEWAY_REQUEST_VERSION | 0;
        if (object.SUB_REQ_DB_USER_IP != null)
            message.SUB_REQ_DB_USER_IP = object.SUB_REQ_DB_USER_IP | 0;
        if (object.SUB_REQ_VERSION_INFO != null)
            message.SUB_REQ_VERSION_INFO = object.SUB_REQ_VERSION_INFO | 0;
        if (object.SUB_REP_VERSION_INFO != null)
            message.SUB_REP_VERSION_INFO = object.SUB_REP_VERSION_INFO | 0;
        if (object.SUB_REQ_PHONE_UPDATE != null)
            message.SUB_REQ_PHONE_UPDATE = object.SUB_REQ_PHONE_UPDATE | 0;
        if (object.SUB_REQ_GAMESRV_SWICTHCONN != null)
            message.SUB_REQ_GAMESRV_SWICTHCONN = object.SUB_REQ_GAMESRV_SWICTHCONN | 0;
        if (object.SUB_GATEWAY_NOTICE != null)
            message.SUB_GATEWAY_NOTICE = object.SUB_GATEWAY_NOTICE | 0;
        if (object.SUB_GATEWEY_USERGAME != null)
            message.SUB_GATEWEY_USERGAME = object.SUB_GATEWEY_USERGAME | 0;
        if (object.SUB_GATEWEY_BROAD != null)
            message.SUB_GATEWEY_BROAD = object.SUB_GATEWEY_BROAD | 0;
        if (object.SUB_REQ_QUICKSEND != null)
            message.SUB_REQ_QUICKSEND = object.SUB_REQ_QUICKSEND | 0;
        if (object.SUB_CORR_CAPITAL != null)
            message.SUB_CORR_CAPITAL = object.SUB_CORR_CAPITAL | 0;
        if (object.SUB_REP_TableSettleInfo != null)
            message.SUB_REP_TableSettleInfo = object.SUB_REP_TableSettleInfo | 0;
        if (object.SUB_REQ_CHECKOFFICIAL != null)
            message.SUB_REQ_CHECKOFFICIAL = object.SUB_REQ_CHECKOFFICIAL | 0;
        if (object.SUB_REP_CHECKOFFICIAL != null)
            message.SUB_REP_CHECKOFFICIAL = object.SUB_REP_CHECKOFFICIAL | 0;
        if (object.SUB_NOTICE_MSG != null)
            message.SUB_NOTICE_MSG = object.SUB_NOTICE_MSG | 0;
        return message;
    };

    /**
     * Creates a plain object from a Sub_GateWay message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Sub_GateWay
     * @static
     * @param {Sub_GateWay} message Sub_GateWay
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Sub_GateWay.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.SUB_GATEWAY_CLIENT_CLOSE = 1;
            object.SUB_GATEWAY_STOP_SERVER_MAINTAIN = 3;
            object.SUB_REP_WEB_CONFIG_UPDATE = 4;
            object.SUB_GATEWAY_REBOOT = 5;
            object.SUB_GATEWAY_REQUEST_VERSION = 6;
            object.SUB_REQ_DB_USER_IP = 7;
            object.SUB_REQ_VERSION_INFO = 8;
            object.SUB_REP_VERSION_INFO = 9;
            object.SUB_REQ_PHONE_UPDATE = 10;
            object.SUB_REQ_GAMESRV_SWICTHCONN = 11;
            object.SUB_GATEWAY_NOTICE = 12;
            object.SUB_GATEWEY_USERGAME = 15;
            object.SUB_GATEWEY_BROAD = 16;
            object.SUB_REQ_QUICKSEND = 17;
            object.SUB_CORR_CAPITAL = 18;
            object.SUB_REP_TableSettleInfo = 19;
            object.SUB_REQ_CHECKOFFICIAL = 20;
            object.SUB_REP_CHECKOFFICIAL = 21;
            object.SUB_NOTICE_MSG = 26;
        }
        if (message.SUB_GATEWAY_CLIENT_CLOSE != null && message.hasOwnProperty("SUB_GATEWAY_CLIENT_CLOSE"))
            object.SUB_GATEWAY_CLIENT_CLOSE = message.SUB_GATEWAY_CLIENT_CLOSE;
        if (message.SUB_GATEWAY_STOP_SERVER_MAINTAIN != null && message.hasOwnProperty("SUB_GATEWAY_STOP_SERVER_MAINTAIN"))
            object.SUB_GATEWAY_STOP_SERVER_MAINTAIN = message.SUB_GATEWAY_STOP_SERVER_MAINTAIN;
        if (message.SUB_REP_WEB_CONFIG_UPDATE != null && message.hasOwnProperty("SUB_REP_WEB_CONFIG_UPDATE"))
            object.SUB_REP_WEB_CONFIG_UPDATE = message.SUB_REP_WEB_CONFIG_UPDATE;
        if (message.SUB_GATEWAY_REBOOT != null && message.hasOwnProperty("SUB_GATEWAY_REBOOT"))
            object.SUB_GATEWAY_REBOOT = message.SUB_GATEWAY_REBOOT;
        if (message.SUB_GATEWAY_REQUEST_VERSION != null && message.hasOwnProperty("SUB_GATEWAY_REQUEST_VERSION"))
            object.SUB_GATEWAY_REQUEST_VERSION = message.SUB_GATEWAY_REQUEST_VERSION;
        if (message.SUB_REQ_DB_USER_IP != null && message.hasOwnProperty("SUB_REQ_DB_USER_IP"))
            object.SUB_REQ_DB_USER_IP = message.SUB_REQ_DB_USER_IP;
        if (message.SUB_REQ_VERSION_INFO != null && message.hasOwnProperty("SUB_REQ_VERSION_INFO"))
            object.SUB_REQ_VERSION_INFO = message.SUB_REQ_VERSION_INFO;
        if (message.SUB_REP_VERSION_INFO != null && message.hasOwnProperty("SUB_REP_VERSION_INFO"))
            object.SUB_REP_VERSION_INFO = message.SUB_REP_VERSION_INFO;
        if (message.SUB_REQ_PHONE_UPDATE != null && message.hasOwnProperty("SUB_REQ_PHONE_UPDATE"))
            object.SUB_REQ_PHONE_UPDATE = message.SUB_REQ_PHONE_UPDATE;
        if (message.SUB_REQ_GAMESRV_SWICTHCONN != null && message.hasOwnProperty("SUB_REQ_GAMESRV_SWICTHCONN"))
            object.SUB_REQ_GAMESRV_SWICTHCONN = message.SUB_REQ_GAMESRV_SWICTHCONN;
        if (message.SUB_GATEWAY_NOTICE != null && message.hasOwnProperty("SUB_GATEWAY_NOTICE"))
            object.SUB_GATEWAY_NOTICE = message.SUB_GATEWAY_NOTICE;
        if (message.SUB_GATEWEY_USERGAME != null && message.hasOwnProperty("SUB_GATEWEY_USERGAME"))
            object.SUB_GATEWEY_USERGAME = message.SUB_GATEWEY_USERGAME;
        if (message.SUB_GATEWEY_BROAD != null && message.hasOwnProperty("SUB_GATEWEY_BROAD"))
            object.SUB_GATEWEY_BROAD = message.SUB_GATEWEY_BROAD;
        if (message.SUB_REQ_QUICKSEND != null && message.hasOwnProperty("SUB_REQ_QUICKSEND"))
            object.SUB_REQ_QUICKSEND = message.SUB_REQ_QUICKSEND;
        if (message.SUB_CORR_CAPITAL != null && message.hasOwnProperty("SUB_CORR_CAPITAL"))
            object.SUB_CORR_CAPITAL = message.SUB_CORR_CAPITAL;
        if (message.SUB_REP_TableSettleInfo != null && message.hasOwnProperty("SUB_REP_TableSettleInfo"))
            object.SUB_REP_TableSettleInfo = message.SUB_REP_TableSettleInfo;
        if (message.SUB_REQ_CHECKOFFICIAL != null && message.hasOwnProperty("SUB_REQ_CHECKOFFICIAL"))
            object.SUB_REQ_CHECKOFFICIAL = message.SUB_REQ_CHECKOFFICIAL;
        if (message.SUB_REP_CHECKOFFICIAL != null && message.hasOwnProperty("SUB_REP_CHECKOFFICIAL"))
            object.SUB_REP_CHECKOFFICIAL = message.SUB_REP_CHECKOFFICIAL;
        if (message.SUB_NOTICE_MSG != null && message.hasOwnProperty("SUB_NOTICE_MSG"))
            object.SUB_NOTICE_MSG = message.SUB_NOTICE_MSG;
        return object;
    };

    /**
     * Converts this Sub_GateWay to JSON.
     * @function toJSON
     * @memberof Sub_GateWay
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Sub_GateWay.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Sub_GateWay
     * @function getTypeUrl
     * @memberof Sub_GateWay
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Sub_GateWay.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Sub_GateWay";
    };

    return Sub_GateWay;
})();

$root.RUQ_SwicthConn = (function() {

    /**
     * Properties of a RUQ_SwicthConn.
     * @exports IRUQ_SwicthConn
     * @interface IRUQ_SwicthConn
     * @property {number} nUserID RUQ_SwicthConn nUserID
     */

    /**
     * Constructs a new RUQ_SwicthConn.
     * @exports RUQ_SwicthConn
     * @classdesc Represents a RUQ_SwicthConn.
     * @implements IRUQ_SwicthConn
     * @constructor
     * @param {IRUQ_SwicthConn=} [properties] Properties to set
     */
    function RUQ_SwicthConn(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_SwicthConn nUserID.
     * @member {number} nUserID
     * @memberof RUQ_SwicthConn
     * @instance
     */
    RUQ_SwicthConn.prototype.nUserID = 0;

    /**
     * Creates a new RUQ_SwicthConn instance using the specified properties.
     * @function create
     * @memberof RUQ_SwicthConn
     * @static
     * @param {IRUQ_SwicthConn=} [properties] Properties to set
     * @returns {RUQ_SwicthConn} RUQ_SwicthConn instance
     */
    RUQ_SwicthConn.create = function create(properties) {
        return new RUQ_SwicthConn(properties);
    };

    /**
     * Encodes the specified RUQ_SwicthConn message. Does not implicitly {@link RUQ_SwicthConn.verify|verify} messages.
     * @function encode
     * @memberof RUQ_SwicthConn
     * @static
     * @param {IRUQ_SwicthConn} message RUQ_SwicthConn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_SwicthConn.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        return writer;
    };

    /**
     * Encodes the specified RUQ_SwicthConn message, length delimited. Does not implicitly {@link RUQ_SwicthConn.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_SwicthConn
     * @static
     * @param {IRUQ_SwicthConn} message RUQ_SwicthConn message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_SwicthConn.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_SwicthConn message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_SwicthConn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_SwicthConn} RUQ_SwicthConn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_SwicthConn.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_SwicthConn();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserID = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserID"))
            throw $util.ProtocolError("missing required 'nUserID'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUQ_SwicthConn message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_SwicthConn
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_SwicthConn} RUQ_SwicthConn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_SwicthConn.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_SwicthConn message.
     * @function verify
     * @memberof RUQ_SwicthConn
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_SwicthConn.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        return null;
    };

    /**
     * Creates a RUQ_SwicthConn message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_SwicthConn
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_SwicthConn} RUQ_SwicthConn
     */
    RUQ_SwicthConn.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_SwicthConn)
            return object;
        var message = new $root.RUQ_SwicthConn();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        return message;
    };

    /**
     * Creates a plain object from a RUQ_SwicthConn message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_SwicthConn
     * @static
     * @param {RUQ_SwicthConn} message RUQ_SwicthConn
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_SwicthConn.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nUserID = 0;
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        return object;
    };

    /**
     * Converts this RUQ_SwicthConn to JSON.
     * @function toJSON
     * @memberof RUQ_SwicthConn
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_SwicthConn.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_SwicthConn
     * @function getTypeUrl
     * @memberof RUQ_SwicthConn
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_SwicthConn.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_SwicthConn";
    };

    return RUQ_SwicthConn;
})();

$root.RUQ_User_Line = (function() {

    /**
     * Properties of a RUQ_User_Line.
     * @exports IRUQ_User_Line
     * @interface IRUQ_User_Line
     * @property {number|null} [nUserID] RUQ_User_Line nUserID
     * @property {string|null} [ClientID] RUQ_User_Line ClientID
     */

    /**
     * Constructs a new RUQ_User_Line.
     * @exports RUQ_User_Line
     * @classdesc Represents a RUQ_User_Line.
     * @implements IRUQ_User_Line
     * @constructor
     * @param {IRUQ_User_Line=} [properties] Properties to set
     */
    function RUQ_User_Line(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_User_Line nUserID.
     * @member {number} nUserID
     * @memberof RUQ_User_Line
     * @instance
     */
    RUQ_User_Line.prototype.nUserID = 0;

    /**
     * RUQ_User_Line ClientID.
     * @member {string} ClientID
     * @memberof RUQ_User_Line
     * @instance
     */
    RUQ_User_Line.prototype.ClientID = "";

    /**
     * Creates a new RUQ_User_Line instance using the specified properties.
     * @function create
     * @memberof RUQ_User_Line
     * @static
     * @param {IRUQ_User_Line=} [properties] Properties to set
     * @returns {RUQ_User_Line} RUQ_User_Line instance
     */
    RUQ_User_Line.create = function create(properties) {
        return new RUQ_User_Line(properties);
    };

    /**
     * Encodes the specified RUQ_User_Line message. Does not implicitly {@link RUQ_User_Line.verify|verify} messages.
     * @function encode
     * @memberof RUQ_User_Line
     * @static
     * @param {IRUQ_User_Line} message RUQ_User_Line message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_User_Line.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserID != null && Object.hasOwnProperty.call(message, "nUserID"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        if (message.ClientID != null && Object.hasOwnProperty.call(message, "ClientID"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.ClientID);
        return writer;
    };

    /**
     * Encodes the specified RUQ_User_Line message, length delimited. Does not implicitly {@link RUQ_User_Line.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_User_Line
     * @static
     * @param {IRUQ_User_Line} message RUQ_User_Line message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_User_Line.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_User_Line message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_User_Line
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_User_Line} RUQ_User_Line
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_User_Line.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_User_Line();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserID = reader.int32();
                    break;
                }
            case 2: {
                    message.ClientID = reader.string();
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
     * Decodes a RUQ_User_Line message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_User_Line
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_User_Line} RUQ_User_Line
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_User_Line.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_User_Line message.
     * @function verify
     * @memberof RUQ_User_Line
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_User_Line.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            if (!$util.isInteger(message.nUserID))
                return "nUserID: integer expected";
        if (message.ClientID != null && message.hasOwnProperty("ClientID"))
            if (!$util.isString(message.ClientID))
                return "ClientID: string expected";
        return null;
    };

    /**
     * Creates a RUQ_User_Line message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_User_Line
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_User_Line} RUQ_User_Line
     */
    RUQ_User_Line.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_User_Line)
            return object;
        var message = new $root.RUQ_User_Line();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        if (object.ClientID != null)
            message.ClientID = String(object.ClientID);
        return message;
    };

    /**
     * Creates a plain object from a RUQ_User_Line message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_User_Line
     * @static
     * @param {RUQ_User_Line} message RUQ_User_Line
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_User_Line.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserID = 0;
            object.ClientID = "";
        }
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        if (message.ClientID != null && message.hasOwnProperty("ClientID"))
            object.ClientID = message.ClientID;
        return object;
    };

    /**
     * Converts this RUQ_User_Line to JSON.
     * @function toJSON
     * @memberof RUQ_User_Line
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_User_Line.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_User_Line
     * @function getTypeUrl
     * @memberof RUQ_User_Line
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_User_Line.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_User_Line";
    };

    return RUQ_User_Line;
})();

$root.RUQ_FilterIpCfg = (function() {

    /**
     * Properties of a RUQ_FilterIpCfg.
     * @exports IRUQ_FilterIpCfg
     * @interface IRUQ_FilterIpCfg
     * @property {string|null} [sSql] RUQ_FilterIpCfg sSql
     */

    /**
     * Constructs a new RUQ_FilterIpCfg.
     * @exports RUQ_FilterIpCfg
     * @classdesc Represents a RUQ_FilterIpCfg.
     * @implements IRUQ_FilterIpCfg
     * @constructor
     * @param {IRUQ_FilterIpCfg=} [properties] Properties to set
     */
    function RUQ_FilterIpCfg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_FilterIpCfg sSql.
     * @member {string} sSql
     * @memberof RUQ_FilterIpCfg
     * @instance
     */
    RUQ_FilterIpCfg.prototype.sSql = "";

    /**
     * Creates a new RUQ_FilterIpCfg instance using the specified properties.
     * @function create
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {IRUQ_FilterIpCfg=} [properties] Properties to set
     * @returns {RUQ_FilterIpCfg} RUQ_FilterIpCfg instance
     */
    RUQ_FilterIpCfg.create = function create(properties) {
        return new RUQ_FilterIpCfg(properties);
    };

    /**
     * Encodes the specified RUQ_FilterIpCfg message. Does not implicitly {@link RUQ_FilterIpCfg.verify|verify} messages.
     * @function encode
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {IRUQ_FilterIpCfg} message RUQ_FilterIpCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_FilterIpCfg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sSql != null && Object.hasOwnProperty.call(message, "sSql"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSql);
        return writer;
    };

    /**
     * Encodes the specified RUQ_FilterIpCfg message, length delimited. Does not implicitly {@link RUQ_FilterIpCfg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {IRUQ_FilterIpCfg} message RUQ_FilterIpCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_FilterIpCfg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_FilterIpCfg message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_FilterIpCfg} RUQ_FilterIpCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_FilterIpCfg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_FilterIpCfg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sSql = reader.string();
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
     * Decodes a RUQ_FilterIpCfg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_FilterIpCfg} RUQ_FilterIpCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_FilterIpCfg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_FilterIpCfg message.
     * @function verify
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_FilterIpCfg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            if (!$util.isString(message.sSql))
                return "sSql: string expected";
        return null;
    };

    /**
     * Creates a RUQ_FilterIpCfg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_FilterIpCfg} RUQ_FilterIpCfg
     */
    RUQ_FilterIpCfg.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_FilterIpCfg)
            return object;
        var message = new $root.RUQ_FilterIpCfg();
        if (object.sSql != null)
            message.sSql = String(object.sSql);
        return message;
    };

    /**
     * Creates a plain object from a RUQ_FilterIpCfg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {RUQ_FilterIpCfg} message RUQ_FilterIpCfg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_FilterIpCfg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sSql = "";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            object.sSql = message.sSql;
        return object;
    };

    /**
     * Converts this RUQ_FilterIpCfg to JSON.
     * @function toJSON
     * @memberof RUQ_FilterIpCfg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_FilterIpCfg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_FilterIpCfg
     * @function getTypeUrl
     * @memberof RUQ_FilterIpCfg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_FilterIpCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_FilterIpCfg";
    };

    return RUQ_FilterIpCfg;
})();

$root.RUQ_VersionCfg = (function() {

    /**
     * Properties of a RUQ_VersionCfg.
     * @exports IRUQ_VersionCfg
     * @interface IRUQ_VersionCfg
     * @property {string|null} [sSql] RUQ_VersionCfg sSql
     */

    /**
     * Constructs a new RUQ_VersionCfg.
     * @exports RUQ_VersionCfg
     * @classdesc Represents a RUQ_VersionCfg.
     * @implements IRUQ_VersionCfg
     * @constructor
     * @param {IRUQ_VersionCfg=} [properties] Properties to set
     */
    function RUQ_VersionCfg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_VersionCfg sSql.
     * @member {string} sSql
     * @memberof RUQ_VersionCfg
     * @instance
     */
    RUQ_VersionCfg.prototype.sSql = "";

    /**
     * Creates a new RUQ_VersionCfg instance using the specified properties.
     * @function create
     * @memberof RUQ_VersionCfg
     * @static
     * @param {IRUQ_VersionCfg=} [properties] Properties to set
     * @returns {RUQ_VersionCfg} RUQ_VersionCfg instance
     */
    RUQ_VersionCfg.create = function create(properties) {
        return new RUQ_VersionCfg(properties);
    };

    /**
     * Encodes the specified RUQ_VersionCfg message. Does not implicitly {@link RUQ_VersionCfg.verify|verify} messages.
     * @function encode
     * @memberof RUQ_VersionCfg
     * @static
     * @param {IRUQ_VersionCfg} message RUQ_VersionCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_VersionCfg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sSql != null && Object.hasOwnProperty.call(message, "sSql"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSql);
        return writer;
    };

    /**
     * Encodes the specified RUQ_VersionCfg message, length delimited. Does not implicitly {@link RUQ_VersionCfg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_VersionCfg
     * @static
     * @param {IRUQ_VersionCfg} message RUQ_VersionCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_VersionCfg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_VersionCfg message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_VersionCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_VersionCfg} RUQ_VersionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_VersionCfg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_VersionCfg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sSql = reader.string();
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
     * Decodes a RUQ_VersionCfg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_VersionCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_VersionCfg} RUQ_VersionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_VersionCfg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_VersionCfg message.
     * @function verify
     * @memberof RUQ_VersionCfg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_VersionCfg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            if (!$util.isString(message.sSql))
                return "sSql: string expected";
        return null;
    };

    /**
     * Creates a RUQ_VersionCfg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_VersionCfg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_VersionCfg} RUQ_VersionCfg
     */
    RUQ_VersionCfg.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_VersionCfg)
            return object;
        var message = new $root.RUQ_VersionCfg();
        if (object.sSql != null)
            message.sSql = String(object.sSql);
        return message;
    };

    /**
     * Creates a plain object from a RUQ_VersionCfg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_VersionCfg
     * @static
     * @param {RUQ_VersionCfg} message RUQ_VersionCfg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_VersionCfg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sSql = "";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            object.sSql = message.sSql;
        return object;
    };

    /**
     * Converts this RUQ_VersionCfg to JSON.
     * @function toJSON
     * @memberof RUQ_VersionCfg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_VersionCfg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_VersionCfg
     * @function getTypeUrl
     * @memberof RUQ_VersionCfg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_VersionCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_VersionCfg";
    };

    return RUQ_VersionCfg;
})();

$root.RUP_VersionCfg = (function() {

    /**
     * Properties of a RUP_VersionCfg.
     * @exports IRUP_VersionCfg
     * @interface IRUP_VersionCfg
     * @property {string} sReturnKey RUP_VersionCfg sReturnKey
     * @property {number} nIndex RUP_VersionCfg nIndex
     * @property {Array.<RUP_VersionCfg.ITableVersionCfg>|null} [tVersion] RUP_VersionCfg tVersion
     */

    /**
     * Constructs a new RUP_VersionCfg.
     * @exports RUP_VersionCfg
     * @classdesc Represents a RUP_VersionCfg.
     * @implements IRUP_VersionCfg
     * @constructor
     * @param {IRUP_VersionCfg=} [properties] Properties to set
     */
    function RUP_VersionCfg(properties) {
        this.tVersion = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUP_VersionCfg sReturnKey.
     * @member {string} sReturnKey
     * @memberof RUP_VersionCfg
     * @instance
     */
    RUP_VersionCfg.prototype.sReturnKey = "";

    /**
     * RUP_VersionCfg nIndex.
     * @member {number} nIndex
     * @memberof RUP_VersionCfg
     * @instance
     */
    RUP_VersionCfg.prototype.nIndex = 0;

    /**
     * RUP_VersionCfg tVersion.
     * @member {Array.<RUP_VersionCfg.ITableVersionCfg>} tVersion
     * @memberof RUP_VersionCfg
     * @instance
     */
    RUP_VersionCfg.prototype.tVersion = $util.emptyArray;

    /**
     * Creates a new RUP_VersionCfg instance using the specified properties.
     * @function create
     * @memberof RUP_VersionCfg
     * @static
     * @param {IRUP_VersionCfg=} [properties] Properties to set
     * @returns {RUP_VersionCfg} RUP_VersionCfg instance
     */
    RUP_VersionCfg.create = function create(properties) {
        return new RUP_VersionCfg(properties);
    };

    /**
     * Encodes the specified RUP_VersionCfg message. Does not implicitly {@link RUP_VersionCfg.verify|verify} messages.
     * @function encode
     * @memberof RUP_VersionCfg
     * @static
     * @param {IRUP_VersionCfg} message RUP_VersionCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_VersionCfg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sReturnKey);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nIndex);
        if (message.tVersion != null && message.tVersion.length)
            for (var i = 0; i < message.tVersion.length; ++i)
                $root.RUP_VersionCfg.TableVersionCfg.encode(message.tVersion[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RUP_VersionCfg message, length delimited. Does not implicitly {@link RUP_VersionCfg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUP_VersionCfg
     * @static
     * @param {IRUP_VersionCfg} message RUP_VersionCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_VersionCfg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUP_VersionCfg message from the specified reader or buffer.
     * @function decode
     * @memberof RUP_VersionCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUP_VersionCfg} RUP_VersionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_VersionCfg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_VersionCfg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sReturnKey = reader.string();
                    break;
                }
            case 2: {
                    message.nIndex = reader.int32();
                    break;
                }
            case 3: {
                    if (!(message.tVersion && message.tVersion.length))
                        message.tVersion = [];
                    message.tVersion.push($root.RUP_VersionCfg.TableVersionCfg.decode(reader, reader.uint32()));
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sReturnKey"))
            throw $util.ProtocolError("missing required 'sReturnKey'", { instance: message });
        if (!message.hasOwnProperty("nIndex"))
            throw $util.ProtocolError("missing required 'nIndex'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUP_VersionCfg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUP_VersionCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUP_VersionCfg} RUP_VersionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_VersionCfg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUP_VersionCfg message.
     * @function verify
     * @memberof RUP_VersionCfg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUP_VersionCfg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sReturnKey))
            return "sReturnKey: string expected";
        if (!$util.isInteger(message.nIndex))
            return "nIndex: integer expected";
        if (message.tVersion != null && message.hasOwnProperty("tVersion")) {
            if (!Array.isArray(message.tVersion))
                return "tVersion: array expected";
            for (var i = 0; i < message.tVersion.length; ++i) {
                var error = $root.RUP_VersionCfg.TableVersionCfg.verify(message.tVersion[i]);
                if (error)
                    return "tVersion." + error;
            }
        }
        return null;
    };

    /**
     * Creates a RUP_VersionCfg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUP_VersionCfg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUP_VersionCfg} RUP_VersionCfg
     */
    RUP_VersionCfg.fromObject = function fromObject(object) {
        if (object instanceof $root.RUP_VersionCfg)
            return object;
        var message = new $root.RUP_VersionCfg();
        if (object.sReturnKey != null)
            message.sReturnKey = String(object.sReturnKey);
        if (object.nIndex != null)
            message.nIndex = object.nIndex | 0;
        if (object.tVersion) {
            if (!Array.isArray(object.tVersion))
                throw TypeError(".RUP_VersionCfg.tVersion: array expected");
            message.tVersion = [];
            for (var i = 0; i < object.tVersion.length; ++i) {
                if (typeof object.tVersion[i] !== "object")
                    throw TypeError(".RUP_VersionCfg.tVersion: object expected");
                message.tVersion[i] = $root.RUP_VersionCfg.TableVersionCfg.fromObject(object.tVersion[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a RUP_VersionCfg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUP_VersionCfg
     * @static
     * @param {RUP_VersionCfg} message RUP_VersionCfg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUP_VersionCfg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.tVersion = [];
        if (options.defaults) {
            object.sReturnKey = "";
            object.nIndex = 0;
        }
        if (message.sReturnKey != null && message.hasOwnProperty("sReturnKey"))
            object.sReturnKey = message.sReturnKey;
        if (message.nIndex != null && message.hasOwnProperty("nIndex"))
            object.nIndex = message.nIndex;
        if (message.tVersion && message.tVersion.length) {
            object.tVersion = [];
            for (var j = 0; j < message.tVersion.length; ++j)
                object.tVersion[j] = $root.RUP_VersionCfg.TableVersionCfg.toObject(message.tVersion[j], options);
        }
        return object;
    };

    /**
     * Converts this RUP_VersionCfg to JSON.
     * @function toJSON
     * @memberof RUP_VersionCfg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUP_VersionCfg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUP_VersionCfg
     * @function getTypeUrl
     * @memberof RUP_VersionCfg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUP_VersionCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUP_VersionCfg";
    };

    RUP_VersionCfg.TableVersionCfg = (function() {

        /**
         * Properties of a TableVersionCfg.
         * @memberof RUP_VersionCfg
         * @interface ITableVersionCfg
         * @property {string|null} [uVersionData] TableVersionCfg uVersionData
         */

        /**
         * Constructs a new TableVersionCfg.
         * @memberof RUP_VersionCfg
         * @classdesc Represents a TableVersionCfg.
         * @implements ITableVersionCfg
         * @constructor
         * @param {RUP_VersionCfg.ITableVersionCfg=} [properties] Properties to set
         */
        function TableVersionCfg(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TableVersionCfg uVersionData.
         * @member {string} uVersionData
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @instance
         */
        TableVersionCfg.prototype.uVersionData = "";

        /**
         * Creates a new TableVersionCfg instance using the specified properties.
         * @function create
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {RUP_VersionCfg.ITableVersionCfg=} [properties] Properties to set
         * @returns {RUP_VersionCfg.TableVersionCfg} TableVersionCfg instance
         */
        TableVersionCfg.create = function create(properties) {
            return new TableVersionCfg(properties);
        };

        /**
         * Encodes the specified TableVersionCfg message. Does not implicitly {@link RUP_VersionCfg.TableVersionCfg.verify|verify} messages.
         * @function encode
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {RUP_VersionCfg.ITableVersionCfg} message TableVersionCfg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TableVersionCfg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uVersionData != null && Object.hasOwnProperty.call(message, "uVersionData"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uVersionData);
            return writer;
        };

        /**
         * Encodes the specified TableVersionCfg message, length delimited. Does not implicitly {@link RUP_VersionCfg.TableVersionCfg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {RUP_VersionCfg.ITableVersionCfg} message TableVersionCfg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TableVersionCfg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TableVersionCfg message from the specified reader or buffer.
         * @function decode
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RUP_VersionCfg.TableVersionCfg} TableVersionCfg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TableVersionCfg.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_VersionCfg.TableVersionCfg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.uVersionData = reader.string();
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
         * Decodes a TableVersionCfg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RUP_VersionCfg.TableVersionCfg} TableVersionCfg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TableVersionCfg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TableVersionCfg message.
         * @function verify
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TableVersionCfg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uVersionData != null && message.hasOwnProperty("uVersionData"))
                if (!$util.isString(message.uVersionData))
                    return "uVersionData: string expected";
            return null;
        };

        /**
         * Creates a TableVersionCfg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RUP_VersionCfg.TableVersionCfg} TableVersionCfg
         */
        TableVersionCfg.fromObject = function fromObject(object) {
            if (object instanceof $root.RUP_VersionCfg.TableVersionCfg)
                return object;
            var message = new $root.RUP_VersionCfg.TableVersionCfg();
            if (object.uVersionData != null)
                message.uVersionData = String(object.uVersionData);
            return message;
        };

        /**
         * Creates a plain object from a TableVersionCfg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {RUP_VersionCfg.TableVersionCfg} message TableVersionCfg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TableVersionCfg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.uVersionData = "";
            if (message.uVersionData != null && message.hasOwnProperty("uVersionData"))
                object.uVersionData = message.uVersionData;
            return object;
        };

        /**
         * Converts this TableVersionCfg to JSON.
         * @function toJSON
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TableVersionCfg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TableVersionCfg
         * @function getTypeUrl
         * @memberof RUP_VersionCfg.TableVersionCfg
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TableVersionCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/RUP_VersionCfg.TableVersionCfg";
        };

        return TableVersionCfg;
    })();

    return RUP_VersionCfg;
})();

$root.RUP_STOP_Server = (function() {

    /**
     * Properties of a RUP_STOP_Server.
     * @exports IRUP_STOP_Server
     * @interface IRUP_STOP_Server
     * @property {number} cStat RUP_STOP_Server cStat
     * @property {string|null} [nSTime] RUP_STOP_Server nSTime
     * @property {string|null} [nETime] RUP_STOP_Server nETime
     */

    /**
     * Constructs a new RUP_STOP_Server.
     * @exports RUP_STOP_Server
     * @classdesc Represents a RUP_STOP_Server.
     * @implements IRUP_STOP_Server
     * @constructor
     * @param {IRUP_STOP_Server=} [properties] Properties to set
     */
    function RUP_STOP_Server(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUP_STOP_Server cStat.
     * @member {number} cStat
     * @memberof RUP_STOP_Server
     * @instance
     */
    RUP_STOP_Server.prototype.cStat = 0;

    /**
     * RUP_STOP_Server nSTime.
     * @member {string} nSTime
     * @memberof RUP_STOP_Server
     * @instance
     */
    RUP_STOP_Server.prototype.nSTime = "";

    /**
     * RUP_STOP_Server nETime.
     * @member {string} nETime
     * @memberof RUP_STOP_Server
     * @instance
     */
    RUP_STOP_Server.prototype.nETime = "";

    /**
     * Creates a new RUP_STOP_Server instance using the specified properties.
     * @function create
     * @memberof RUP_STOP_Server
     * @static
     * @param {IRUP_STOP_Server=} [properties] Properties to set
     * @returns {RUP_STOP_Server} RUP_STOP_Server instance
     */
    RUP_STOP_Server.create = function create(properties) {
        return new RUP_STOP_Server(properties);
    };

    /**
     * Encodes the specified RUP_STOP_Server message. Does not implicitly {@link RUP_STOP_Server.verify|verify} messages.
     * @function encode
     * @memberof RUP_STOP_Server
     * @static
     * @param {IRUP_STOP_Server} message RUP_STOP_Server message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_STOP_Server.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cStat);
        if (message.nSTime != null && Object.hasOwnProperty.call(message, "nSTime"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.nSTime);
        if (message.nETime != null && Object.hasOwnProperty.call(message, "nETime"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.nETime);
        return writer;
    };

    /**
     * Encodes the specified RUP_STOP_Server message, length delimited. Does not implicitly {@link RUP_STOP_Server.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUP_STOP_Server
     * @static
     * @param {IRUP_STOP_Server} message RUP_STOP_Server message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_STOP_Server.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUP_STOP_Server message from the specified reader or buffer.
     * @function decode
     * @memberof RUP_STOP_Server
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUP_STOP_Server} RUP_STOP_Server
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_STOP_Server.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_STOP_Server();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.cStat = reader.int32();
                    break;
                }
            case 2: {
                    message.nSTime = reader.string();
                    break;
                }
            case 3: {
                    message.nETime = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("cStat"))
            throw $util.ProtocolError("missing required 'cStat'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUP_STOP_Server message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUP_STOP_Server
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUP_STOP_Server} RUP_STOP_Server
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_STOP_Server.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUP_STOP_Server message.
     * @function verify
     * @memberof RUP_STOP_Server
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUP_STOP_Server.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.cStat))
            return "cStat: integer expected";
        if (message.nSTime != null && message.hasOwnProperty("nSTime"))
            if (!$util.isString(message.nSTime))
                return "nSTime: string expected";
        if (message.nETime != null && message.hasOwnProperty("nETime"))
            if (!$util.isString(message.nETime))
                return "nETime: string expected";
        return null;
    };

    /**
     * Creates a RUP_STOP_Server message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUP_STOP_Server
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUP_STOP_Server} RUP_STOP_Server
     */
    RUP_STOP_Server.fromObject = function fromObject(object) {
        if (object instanceof $root.RUP_STOP_Server)
            return object;
        var message = new $root.RUP_STOP_Server();
        if (object.cStat != null)
            message.cStat = object.cStat | 0;
        if (object.nSTime != null)
            message.nSTime = String(object.nSTime);
        if (object.nETime != null)
            message.nETime = String(object.nETime);
        return message;
    };

    /**
     * Creates a plain object from a RUP_STOP_Server message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUP_STOP_Server
     * @static
     * @param {RUP_STOP_Server} message RUP_STOP_Server
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUP_STOP_Server.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.cStat = 0;
            object.nSTime = "";
            object.nETime = "";
        }
        if (message.cStat != null && message.hasOwnProperty("cStat"))
            object.cStat = message.cStat;
        if (message.nSTime != null && message.hasOwnProperty("nSTime"))
            object.nSTime = message.nSTime;
        if (message.nETime != null && message.hasOwnProperty("nETime"))
            object.nETime = message.nETime;
        return object;
    };

    /**
     * Converts this RUP_STOP_Server to JSON.
     * @function toJSON
     * @memberof RUP_STOP_Server
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUP_STOP_Server.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUP_STOP_Server
     * @function getTypeUrl
     * @memberof RUP_STOP_Server
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUP_STOP_Server.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUP_STOP_Server";
    };

    return RUP_STOP_Server;
})();

$root.RUQ_AppleCfg = (function() {

    /**
     * Properties of a RUQ_AppleCfg.
     * @exports IRUQ_AppleCfg
     * @interface IRUQ_AppleCfg
     * @property {string|null} [sSql] RUQ_AppleCfg sSql
     */

    /**
     * Constructs a new RUQ_AppleCfg.
     * @exports RUQ_AppleCfg
     * @classdesc Represents a RUQ_AppleCfg.
     * @implements IRUQ_AppleCfg
     * @constructor
     * @param {IRUQ_AppleCfg=} [properties] Properties to set
     */
    function RUQ_AppleCfg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_AppleCfg sSql.
     * @member {string} sSql
     * @memberof RUQ_AppleCfg
     * @instance
     */
    RUQ_AppleCfg.prototype.sSql = "";

    /**
     * Creates a new RUQ_AppleCfg instance using the specified properties.
     * @function create
     * @memberof RUQ_AppleCfg
     * @static
     * @param {IRUQ_AppleCfg=} [properties] Properties to set
     * @returns {RUQ_AppleCfg} RUQ_AppleCfg instance
     */
    RUQ_AppleCfg.create = function create(properties) {
        return new RUQ_AppleCfg(properties);
    };

    /**
     * Encodes the specified RUQ_AppleCfg message. Does not implicitly {@link RUQ_AppleCfg.verify|verify} messages.
     * @function encode
     * @memberof RUQ_AppleCfg
     * @static
     * @param {IRUQ_AppleCfg} message RUQ_AppleCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_AppleCfg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sSql != null && Object.hasOwnProperty.call(message, "sSql"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSql);
        return writer;
    };

    /**
     * Encodes the specified RUQ_AppleCfg message, length delimited. Does not implicitly {@link RUQ_AppleCfg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_AppleCfg
     * @static
     * @param {IRUQ_AppleCfg} message RUQ_AppleCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_AppleCfg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_AppleCfg message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_AppleCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_AppleCfg} RUQ_AppleCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_AppleCfg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_AppleCfg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sSql = reader.string();
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
     * Decodes a RUQ_AppleCfg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_AppleCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_AppleCfg} RUQ_AppleCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_AppleCfg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_AppleCfg message.
     * @function verify
     * @memberof RUQ_AppleCfg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_AppleCfg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            if (!$util.isString(message.sSql))
                return "sSql: string expected";
        return null;
    };

    /**
     * Creates a RUQ_AppleCfg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_AppleCfg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_AppleCfg} RUQ_AppleCfg
     */
    RUQ_AppleCfg.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_AppleCfg)
            return object;
        var message = new $root.RUQ_AppleCfg();
        if (object.sSql != null)
            message.sSql = String(object.sSql);
        return message;
    };

    /**
     * Creates a plain object from a RUQ_AppleCfg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_AppleCfg
     * @static
     * @param {RUQ_AppleCfg} message RUQ_AppleCfg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_AppleCfg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sSql = "";
        if (message.sSql != null && message.hasOwnProperty("sSql"))
            object.sSql = message.sSql;
        return object;
    };

    /**
     * Converts this RUQ_AppleCfg to JSON.
     * @function toJSON
     * @memberof RUQ_AppleCfg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_AppleCfg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_AppleCfg
     * @function getTypeUrl
     * @memberof RUQ_AppleCfg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_AppleCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_AppleCfg";
    };

    return RUQ_AppleCfg;
})();

$root.RUP_AppleCfg = (function() {

    /**
     * Properties of a RUP_AppleCfg.
     * @exports IRUP_AppleCfg
     * @interface IRUP_AppleCfg
     * @property {number|null} [nIndex] RUP_AppleCfg nIndex
     * @property {Array.<RUP_AppleCfg.ITableApplePhoneCfg>|null} [tApplecfg] RUP_AppleCfg tApplecfg
     */

    /**
     * Constructs a new RUP_AppleCfg.
     * @exports RUP_AppleCfg
     * @classdesc Represents a RUP_AppleCfg.
     * @implements IRUP_AppleCfg
     * @constructor
     * @param {IRUP_AppleCfg=} [properties] Properties to set
     */
    function RUP_AppleCfg(properties) {
        this.tApplecfg = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUP_AppleCfg nIndex.
     * @member {number} nIndex
     * @memberof RUP_AppleCfg
     * @instance
     */
    RUP_AppleCfg.prototype.nIndex = 0;

    /**
     * RUP_AppleCfg tApplecfg.
     * @member {Array.<RUP_AppleCfg.ITableApplePhoneCfg>} tApplecfg
     * @memberof RUP_AppleCfg
     * @instance
     */
    RUP_AppleCfg.prototype.tApplecfg = $util.emptyArray;

    /**
     * Creates a new RUP_AppleCfg instance using the specified properties.
     * @function create
     * @memberof RUP_AppleCfg
     * @static
     * @param {IRUP_AppleCfg=} [properties] Properties to set
     * @returns {RUP_AppleCfg} RUP_AppleCfg instance
     */
    RUP_AppleCfg.create = function create(properties) {
        return new RUP_AppleCfg(properties);
    };

    /**
     * Encodes the specified RUP_AppleCfg message. Does not implicitly {@link RUP_AppleCfg.verify|verify} messages.
     * @function encode
     * @memberof RUP_AppleCfg
     * @static
     * @param {IRUP_AppleCfg} message RUP_AppleCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_AppleCfg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nIndex != null && Object.hasOwnProperty.call(message, "nIndex"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nIndex);
        if (message.tApplecfg != null && message.tApplecfg.length)
            for (var i = 0; i < message.tApplecfg.length; ++i)
                $root.RUP_AppleCfg.TableApplePhoneCfg.encode(message.tApplecfg[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RUP_AppleCfg message, length delimited. Does not implicitly {@link RUP_AppleCfg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUP_AppleCfg
     * @static
     * @param {IRUP_AppleCfg} message RUP_AppleCfg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_AppleCfg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUP_AppleCfg message from the specified reader or buffer.
     * @function decode
     * @memberof RUP_AppleCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUP_AppleCfg} RUP_AppleCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_AppleCfg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_AppleCfg();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nIndex = reader.int32();
                    break;
                }
            case 2: {
                    if (!(message.tApplecfg && message.tApplecfg.length))
                        message.tApplecfg = [];
                    message.tApplecfg.push($root.RUP_AppleCfg.TableApplePhoneCfg.decode(reader, reader.uint32()));
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
     * Decodes a RUP_AppleCfg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUP_AppleCfg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUP_AppleCfg} RUP_AppleCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_AppleCfg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUP_AppleCfg message.
     * @function verify
     * @memberof RUP_AppleCfg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUP_AppleCfg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nIndex != null && message.hasOwnProperty("nIndex"))
            if (!$util.isInteger(message.nIndex))
                return "nIndex: integer expected";
        if (message.tApplecfg != null && message.hasOwnProperty("tApplecfg")) {
            if (!Array.isArray(message.tApplecfg))
                return "tApplecfg: array expected";
            for (var i = 0; i < message.tApplecfg.length; ++i) {
                var error = $root.RUP_AppleCfg.TableApplePhoneCfg.verify(message.tApplecfg[i]);
                if (error)
                    return "tApplecfg." + error;
            }
        }
        return null;
    };

    /**
     * Creates a RUP_AppleCfg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUP_AppleCfg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUP_AppleCfg} RUP_AppleCfg
     */
    RUP_AppleCfg.fromObject = function fromObject(object) {
        if (object instanceof $root.RUP_AppleCfg)
            return object;
        var message = new $root.RUP_AppleCfg();
        if (object.nIndex != null)
            message.nIndex = object.nIndex | 0;
        if (object.tApplecfg) {
            if (!Array.isArray(object.tApplecfg))
                throw TypeError(".RUP_AppleCfg.tApplecfg: array expected");
            message.tApplecfg = [];
            for (var i = 0; i < object.tApplecfg.length; ++i) {
                if (typeof object.tApplecfg[i] !== "object")
                    throw TypeError(".RUP_AppleCfg.tApplecfg: object expected");
                message.tApplecfg[i] = $root.RUP_AppleCfg.TableApplePhoneCfg.fromObject(object.tApplecfg[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a RUP_AppleCfg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUP_AppleCfg
     * @static
     * @param {RUP_AppleCfg} message RUP_AppleCfg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUP_AppleCfg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.tApplecfg = [];
        if (options.defaults)
            object.nIndex = 0;
        if (message.nIndex != null && message.hasOwnProperty("nIndex"))
            object.nIndex = message.nIndex;
        if (message.tApplecfg && message.tApplecfg.length) {
            object.tApplecfg = [];
            for (var j = 0; j < message.tApplecfg.length; ++j)
                object.tApplecfg[j] = $root.RUP_AppleCfg.TableApplePhoneCfg.toObject(message.tApplecfg[j], options);
        }
        return object;
    };

    /**
     * Converts this RUP_AppleCfg to JSON.
     * @function toJSON
     * @memberof RUP_AppleCfg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUP_AppleCfg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUP_AppleCfg
     * @function getTypeUrl
     * @memberof RUP_AppleCfg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUP_AppleCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUP_AppleCfg";
    };

    RUP_AppleCfg.TableApplePhoneCfg = (function() {

        /**
         * Properties of a TableApplePhoneCfg.
         * @memberof RUP_AppleCfg
         * @interface ITableApplePhoneCfg
         * @property {string|null} [uApplecfgData] TableApplePhoneCfg uApplecfgData
         */

        /**
         * Constructs a new TableApplePhoneCfg.
         * @memberof RUP_AppleCfg
         * @classdesc Represents a TableApplePhoneCfg.
         * @implements ITableApplePhoneCfg
         * @constructor
         * @param {RUP_AppleCfg.ITableApplePhoneCfg=} [properties] Properties to set
         */
        function TableApplePhoneCfg(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TableApplePhoneCfg uApplecfgData.
         * @member {string} uApplecfgData
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @instance
         */
        TableApplePhoneCfg.prototype.uApplecfgData = "";

        /**
         * Creates a new TableApplePhoneCfg instance using the specified properties.
         * @function create
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {RUP_AppleCfg.ITableApplePhoneCfg=} [properties] Properties to set
         * @returns {RUP_AppleCfg.TableApplePhoneCfg} TableApplePhoneCfg instance
         */
        TableApplePhoneCfg.create = function create(properties) {
            return new TableApplePhoneCfg(properties);
        };

        /**
         * Encodes the specified TableApplePhoneCfg message. Does not implicitly {@link RUP_AppleCfg.TableApplePhoneCfg.verify|verify} messages.
         * @function encode
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {RUP_AppleCfg.ITableApplePhoneCfg} message TableApplePhoneCfg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TableApplePhoneCfg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uApplecfgData != null && Object.hasOwnProperty.call(message, "uApplecfgData"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uApplecfgData);
            return writer;
        };

        /**
         * Encodes the specified TableApplePhoneCfg message, length delimited. Does not implicitly {@link RUP_AppleCfg.TableApplePhoneCfg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {RUP_AppleCfg.ITableApplePhoneCfg} message TableApplePhoneCfg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TableApplePhoneCfg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TableApplePhoneCfg message from the specified reader or buffer.
         * @function decode
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RUP_AppleCfg.TableApplePhoneCfg} TableApplePhoneCfg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TableApplePhoneCfg.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_AppleCfg.TableApplePhoneCfg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.uApplecfgData = reader.string();
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
         * Decodes a TableApplePhoneCfg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RUP_AppleCfg.TableApplePhoneCfg} TableApplePhoneCfg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TableApplePhoneCfg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TableApplePhoneCfg message.
         * @function verify
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TableApplePhoneCfg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uApplecfgData != null && message.hasOwnProperty("uApplecfgData"))
                if (!$util.isString(message.uApplecfgData))
                    return "uApplecfgData: string expected";
            return null;
        };

        /**
         * Creates a TableApplePhoneCfg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RUP_AppleCfg.TableApplePhoneCfg} TableApplePhoneCfg
         */
        TableApplePhoneCfg.fromObject = function fromObject(object) {
            if (object instanceof $root.RUP_AppleCfg.TableApplePhoneCfg)
                return object;
            var message = new $root.RUP_AppleCfg.TableApplePhoneCfg();
            if (object.uApplecfgData != null)
                message.uApplecfgData = String(object.uApplecfgData);
            return message;
        };

        /**
         * Creates a plain object from a TableApplePhoneCfg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {RUP_AppleCfg.TableApplePhoneCfg} message TableApplePhoneCfg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TableApplePhoneCfg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.uApplecfgData = "";
            if (message.uApplecfgData != null && message.hasOwnProperty("uApplecfgData"))
                object.uApplecfgData = message.uApplecfgData;
            return object;
        };

        /**
         * Converts this TableApplePhoneCfg to JSON.
         * @function toJSON
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TableApplePhoneCfg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TableApplePhoneCfg
         * @function getTypeUrl
         * @memberof RUP_AppleCfg.TableApplePhoneCfg
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TableApplePhoneCfg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/RUP_AppleCfg.TableApplePhoneCfg";
        };

        return TableApplePhoneCfg;
    })();

    return RUP_AppleCfg;
})();

$root.AdNoticeNoteRep = (function() {

    /**
     * Properties of an AdNoticeNoteRep.
     * @exports IAdNoticeNoteRep
     * @interface IAdNoticeNoteRep
     * @property {number} nScope AdNoticeNoteRep nScope
     * @property {string} sChannel AdNoticeNoteRep sChannel
     * @property {string} sStartTime AdNoticeNoteRep sStartTime
     * @property {string} sEndTime AdNoticeNoteRep sEndTime
     * @property {string} sDetails AdNoticeNoteRep sDetails
     */

    /**
     * Constructs a new AdNoticeNoteRep.
     * @exports AdNoticeNoteRep
     * @classdesc Represents an AdNoticeNoteRep.
     * @implements IAdNoticeNoteRep
     * @constructor
     * @param {IAdNoticeNoteRep=} [properties] Properties to set
     */
    function AdNoticeNoteRep(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AdNoticeNoteRep nScope.
     * @member {number} nScope
     * @memberof AdNoticeNoteRep
     * @instance
     */
    AdNoticeNoteRep.prototype.nScope = 0;

    /**
     * AdNoticeNoteRep sChannel.
     * @member {string} sChannel
     * @memberof AdNoticeNoteRep
     * @instance
     */
    AdNoticeNoteRep.prototype.sChannel = "";

    /**
     * AdNoticeNoteRep sStartTime.
     * @member {string} sStartTime
     * @memberof AdNoticeNoteRep
     * @instance
     */
    AdNoticeNoteRep.prototype.sStartTime = "";

    /**
     * AdNoticeNoteRep sEndTime.
     * @member {string} sEndTime
     * @memberof AdNoticeNoteRep
     * @instance
     */
    AdNoticeNoteRep.prototype.sEndTime = "";

    /**
     * AdNoticeNoteRep sDetails.
     * @member {string} sDetails
     * @memberof AdNoticeNoteRep
     * @instance
     */
    AdNoticeNoteRep.prototype.sDetails = "";

    /**
     * Creates a new AdNoticeNoteRep instance using the specified properties.
     * @function create
     * @memberof AdNoticeNoteRep
     * @static
     * @param {IAdNoticeNoteRep=} [properties] Properties to set
     * @returns {AdNoticeNoteRep} AdNoticeNoteRep instance
     */
    AdNoticeNoteRep.create = function create(properties) {
        return new AdNoticeNoteRep(properties);
    };

    /**
     * Encodes the specified AdNoticeNoteRep message. Does not implicitly {@link AdNoticeNoteRep.verify|verify} messages.
     * @function encode
     * @memberof AdNoticeNoteRep
     * @static
     * @param {IAdNoticeNoteRep} message AdNoticeNoteRep message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AdNoticeNoteRep.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nScope);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sChannel);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sStartTime);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.sEndTime);
        writer.uint32(/* id 5, wireType 2 =*/42).string(message.sDetails);
        return writer;
    };

    /**
     * Encodes the specified AdNoticeNoteRep message, length delimited. Does not implicitly {@link AdNoticeNoteRep.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AdNoticeNoteRep
     * @static
     * @param {IAdNoticeNoteRep} message AdNoticeNoteRep message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AdNoticeNoteRep.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AdNoticeNoteRep message from the specified reader or buffer.
     * @function decode
     * @memberof AdNoticeNoteRep
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AdNoticeNoteRep} AdNoticeNoteRep
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AdNoticeNoteRep.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AdNoticeNoteRep();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nScope = reader.int32();
                    break;
                }
            case 2: {
                    message.sChannel = reader.string();
                    break;
                }
            case 3: {
                    message.sStartTime = reader.string();
                    break;
                }
            case 4: {
                    message.sEndTime = reader.string();
                    break;
                }
            case 5: {
                    message.sDetails = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nScope"))
            throw $util.ProtocolError("missing required 'nScope'", { instance: message });
        if (!message.hasOwnProperty("sChannel"))
            throw $util.ProtocolError("missing required 'sChannel'", { instance: message });
        if (!message.hasOwnProperty("sStartTime"))
            throw $util.ProtocolError("missing required 'sStartTime'", { instance: message });
        if (!message.hasOwnProperty("sEndTime"))
            throw $util.ProtocolError("missing required 'sEndTime'", { instance: message });
        if (!message.hasOwnProperty("sDetails"))
            throw $util.ProtocolError("missing required 'sDetails'", { instance: message });
        return message;
    };

    /**
     * Decodes an AdNoticeNoteRep message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AdNoticeNoteRep
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AdNoticeNoteRep} AdNoticeNoteRep
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AdNoticeNoteRep.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AdNoticeNoteRep message.
     * @function verify
     * @memberof AdNoticeNoteRep
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AdNoticeNoteRep.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nScope))
            return "nScope: integer expected";
        if (!$util.isString(message.sChannel))
            return "sChannel: string expected";
        if (!$util.isString(message.sStartTime))
            return "sStartTime: string expected";
        if (!$util.isString(message.sEndTime))
            return "sEndTime: string expected";
        if (!$util.isString(message.sDetails))
            return "sDetails: string expected";
        return null;
    };

    /**
     * Creates an AdNoticeNoteRep message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AdNoticeNoteRep
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AdNoticeNoteRep} AdNoticeNoteRep
     */
    AdNoticeNoteRep.fromObject = function fromObject(object) {
        if (object instanceof $root.AdNoticeNoteRep)
            return object;
        var message = new $root.AdNoticeNoteRep();
        if (object.nScope != null)
            message.nScope = object.nScope | 0;
        if (object.sChannel != null)
            message.sChannel = String(object.sChannel);
        if (object.sStartTime != null)
            message.sStartTime = String(object.sStartTime);
        if (object.sEndTime != null)
            message.sEndTime = String(object.sEndTime);
        if (object.sDetails != null)
            message.sDetails = String(object.sDetails);
        return message;
    };

    /**
     * Creates a plain object from an AdNoticeNoteRep message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AdNoticeNoteRep
     * @static
     * @param {AdNoticeNoteRep} message AdNoticeNoteRep
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AdNoticeNoteRep.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nScope = 0;
            object.sChannel = "";
            object.sStartTime = "";
            object.sEndTime = "";
            object.sDetails = "";
        }
        if (message.nScope != null && message.hasOwnProperty("nScope"))
            object.nScope = message.nScope;
        if (message.sChannel != null && message.hasOwnProperty("sChannel"))
            object.sChannel = message.sChannel;
        if (message.sStartTime != null && message.hasOwnProperty("sStartTime"))
            object.sStartTime = message.sStartTime;
        if (message.sEndTime != null && message.hasOwnProperty("sEndTime"))
            object.sEndTime = message.sEndTime;
        if (message.sDetails != null && message.hasOwnProperty("sDetails"))
            object.sDetails = message.sDetails;
        return object;
    };

    /**
     * Converts this AdNoticeNoteRep to JSON.
     * @function toJSON
     * @memberof AdNoticeNoteRep
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AdNoticeNoteRep.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AdNoticeNoteRep
     * @function getTypeUrl
     * @memberof AdNoticeNoteRep
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AdNoticeNoteRep.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AdNoticeNoteRep";
    };

    return AdNoticeNoteRep;
})();

$root.SendGateWeyUserGame = (function() {

    /**
     * Properties of a SendGateWeyUserGame.
     * @exports ISendGateWeyUserGame
     * @interface ISendGateWeyUserGame
     * @property {number} nUserId SendGateWeyUserGame nUserId
     * @property {number} nType SendGateWeyUserGame nType
     * @property {number} nGameId SendGateWeyUserGame nGameId
     * @property {number} nRoomId SendGateWeyUserGame nRoomId
     * @property {number} nID SendGateWeyUserGame nID
     * @property {number} nTableId SendGateWeyUserGame nTableId
     */

    /**
     * Constructs a new SendGateWeyUserGame.
     * @exports SendGateWeyUserGame
     * @classdesc Represents a SendGateWeyUserGame.
     * @implements ISendGateWeyUserGame
     * @constructor
     * @param {ISendGateWeyUserGame=} [properties] Properties to set
     */
    function SendGateWeyUserGame(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SendGateWeyUserGame nUserId.
     * @member {number} nUserId
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nUserId = 0;

    /**
     * SendGateWeyUserGame nType.
     * @member {number} nType
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nType = 0;

    /**
     * SendGateWeyUserGame nGameId.
     * @member {number} nGameId
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nGameId = 0;

    /**
     * SendGateWeyUserGame nRoomId.
     * @member {number} nRoomId
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nRoomId = 0;

    /**
     * SendGateWeyUserGame nID.
     * @member {number} nID
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nID = 0;

    /**
     * SendGateWeyUserGame nTableId.
     * @member {number} nTableId
     * @memberof SendGateWeyUserGame
     * @instance
     */
    SendGateWeyUserGame.prototype.nTableId = 0;

    /**
     * Creates a new SendGateWeyUserGame instance using the specified properties.
     * @function create
     * @memberof SendGateWeyUserGame
     * @static
     * @param {ISendGateWeyUserGame=} [properties] Properties to set
     * @returns {SendGateWeyUserGame} SendGateWeyUserGame instance
     */
    SendGateWeyUserGame.create = function create(properties) {
        return new SendGateWeyUserGame(properties);
    };

    /**
     * Encodes the specified SendGateWeyUserGame message. Does not implicitly {@link SendGateWeyUserGame.verify|verify} messages.
     * @function encode
     * @memberof SendGateWeyUserGame
     * @static
     * @param {ISendGateWeyUserGame} message SendGateWeyUserGame message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendGateWeyUserGame.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nGameId);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nRoomId);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nID);
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.nTableId);
        return writer;
    };

    /**
     * Encodes the specified SendGateWeyUserGame message, length delimited. Does not implicitly {@link SendGateWeyUserGame.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SendGateWeyUserGame
     * @static
     * @param {ISendGateWeyUserGame} message SendGateWeyUserGame message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendGateWeyUserGame.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SendGateWeyUserGame message from the specified reader or buffer.
     * @function decode
     * @memberof SendGateWeyUserGame
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SendGateWeyUserGame} SendGateWeyUserGame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendGateWeyUserGame.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SendGateWeyUserGame();
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
                    message.nType = reader.int32();
                    break;
                }
            case 3: {
                    message.nGameId = reader.int32();
                    break;
                }
            case 4: {
                    message.nRoomId = reader.int32();
                    break;
                }
            case 5: {
                    message.nID = reader.int32();
                    break;
                }
            case 6: {
                    message.nTableId = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        if (!message.hasOwnProperty("nGameId"))
            throw $util.ProtocolError("missing required 'nGameId'", { instance: message });
        if (!message.hasOwnProperty("nRoomId"))
            throw $util.ProtocolError("missing required 'nRoomId'", { instance: message });
        if (!message.hasOwnProperty("nID"))
            throw $util.ProtocolError("missing required 'nID'", { instance: message });
        if (!message.hasOwnProperty("nTableId"))
            throw $util.ProtocolError("missing required 'nTableId'", { instance: message });
        return message;
    };

    /**
     * Decodes a SendGateWeyUserGame message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SendGateWeyUserGame
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SendGateWeyUserGame} SendGateWeyUserGame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendGateWeyUserGame.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SendGateWeyUserGame message.
     * @function verify
     * @memberof SendGateWeyUserGame
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SendGateWeyUserGame.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        if (!$util.isInteger(message.nRoomId))
            return "nRoomId: integer expected";
        if (!$util.isInteger(message.nID))
            return "nID: integer expected";
        if (!$util.isInteger(message.nTableId))
            return "nTableId: integer expected";
        return null;
    };

    /**
     * Creates a SendGateWeyUserGame message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SendGateWeyUserGame
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SendGateWeyUserGame} SendGateWeyUserGame
     */
    SendGateWeyUserGame.fromObject = function fromObject(object) {
        if (object instanceof $root.SendGateWeyUserGame)
            return object;
        var message = new $root.SendGateWeyUserGame();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nRoomId != null)
            message.nRoomId = object.nRoomId | 0;
        if (object.nID != null)
            message.nID = object.nID | 0;
        if (object.nTableId != null)
            message.nTableId = object.nTableId | 0;
        return message;
    };

    /**
     * Creates a plain object from a SendGateWeyUserGame message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SendGateWeyUserGame
     * @static
     * @param {SendGateWeyUserGame} message SendGateWeyUserGame
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SendGateWeyUserGame.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nType = 0;
            object.nGameId = 0;
            object.nRoomId = 0;
            object.nID = 0;
            object.nTableId = 0;
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            object.nRoomId = message.nRoomId;
        if (message.nID != null && message.hasOwnProperty("nID"))
            object.nID = message.nID;
        if (message.nTableId != null && message.hasOwnProperty("nTableId"))
            object.nTableId = message.nTableId;
        return object;
    };

    /**
     * Converts this SendGateWeyUserGame to JSON.
     * @function toJSON
     * @memberof SendGateWeyUserGame
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SendGateWeyUserGame.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for SendGateWeyUserGame
     * @function getTypeUrl
     * @memberof SendGateWeyUserGame
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    SendGateWeyUserGame.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/SendGateWeyUserGame";
    };

    return SendGateWeyUserGame;
})();

$root.SendGateWeyBroad = (function() {

    /**
     * Properties of a SendGateWeyBroad.
     * @exports ISendGateWeyBroad
     * @interface ISendGateWeyBroad
     * @property {string} AddBuff SendGateWeyBroad AddBuff
     * @property {number} nCount SendGateWeyBroad nCount
     * @property {number} nSendSize SendGateWeyBroad nSendSize
     */

    /**
     * Constructs a new SendGateWeyBroad.
     * @exports SendGateWeyBroad
     * @classdesc Represents a SendGateWeyBroad.
     * @implements ISendGateWeyBroad
     * @constructor
     * @param {ISendGateWeyBroad=} [properties] Properties to set
     */
    function SendGateWeyBroad(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SendGateWeyBroad AddBuff.
     * @member {string} AddBuff
     * @memberof SendGateWeyBroad
     * @instance
     */
    SendGateWeyBroad.prototype.AddBuff = "";

    /**
     * SendGateWeyBroad nCount.
     * @member {number} nCount
     * @memberof SendGateWeyBroad
     * @instance
     */
    SendGateWeyBroad.prototype.nCount = 0;

    /**
     * SendGateWeyBroad nSendSize.
     * @member {number} nSendSize
     * @memberof SendGateWeyBroad
     * @instance
     */
    SendGateWeyBroad.prototype.nSendSize = 0;

    /**
     * Creates a new SendGateWeyBroad instance using the specified properties.
     * @function create
     * @memberof SendGateWeyBroad
     * @static
     * @param {ISendGateWeyBroad=} [properties] Properties to set
     * @returns {SendGateWeyBroad} SendGateWeyBroad instance
     */
    SendGateWeyBroad.create = function create(properties) {
        return new SendGateWeyBroad(properties);
    };

    /**
     * Encodes the specified SendGateWeyBroad message. Does not implicitly {@link SendGateWeyBroad.verify|verify} messages.
     * @function encode
     * @memberof SendGateWeyBroad
     * @static
     * @param {ISendGateWeyBroad} message SendGateWeyBroad message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendGateWeyBroad.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.AddBuff);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nCount);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nSendSize);
        return writer;
    };

    /**
     * Encodes the specified SendGateWeyBroad message, length delimited. Does not implicitly {@link SendGateWeyBroad.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SendGateWeyBroad
     * @static
     * @param {ISendGateWeyBroad} message SendGateWeyBroad message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendGateWeyBroad.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SendGateWeyBroad message from the specified reader or buffer.
     * @function decode
     * @memberof SendGateWeyBroad
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SendGateWeyBroad} SendGateWeyBroad
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendGateWeyBroad.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SendGateWeyBroad();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.AddBuff = reader.string();
                    break;
                }
            case 2: {
                    message.nCount = reader.int32();
                    break;
                }
            case 3: {
                    message.nSendSize = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("AddBuff"))
            throw $util.ProtocolError("missing required 'AddBuff'", { instance: message });
        if (!message.hasOwnProperty("nCount"))
            throw $util.ProtocolError("missing required 'nCount'", { instance: message });
        if (!message.hasOwnProperty("nSendSize"))
            throw $util.ProtocolError("missing required 'nSendSize'", { instance: message });
        return message;
    };

    /**
     * Decodes a SendGateWeyBroad message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SendGateWeyBroad
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SendGateWeyBroad} SendGateWeyBroad
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendGateWeyBroad.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SendGateWeyBroad message.
     * @function verify
     * @memberof SendGateWeyBroad
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SendGateWeyBroad.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.AddBuff))
            return "AddBuff: string expected";
        if (!$util.isInteger(message.nCount))
            return "nCount: integer expected";
        if (!$util.isInteger(message.nSendSize))
            return "nSendSize: integer expected";
        return null;
    };

    /**
     * Creates a SendGateWeyBroad message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SendGateWeyBroad
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SendGateWeyBroad} SendGateWeyBroad
     */
    SendGateWeyBroad.fromObject = function fromObject(object) {
        if (object instanceof $root.SendGateWeyBroad)
            return object;
        var message = new $root.SendGateWeyBroad();
        if (object.AddBuff != null)
            message.AddBuff = String(object.AddBuff);
        if (object.nCount != null)
            message.nCount = object.nCount | 0;
        if (object.nSendSize != null)
            message.nSendSize = object.nSendSize | 0;
        return message;
    };

    /**
     * Creates a plain object from a SendGateWeyBroad message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SendGateWeyBroad
     * @static
     * @param {SendGateWeyBroad} message SendGateWeyBroad
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SendGateWeyBroad.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.AddBuff = "";
            object.nCount = 0;
            object.nSendSize = 0;
        }
        if (message.AddBuff != null && message.hasOwnProperty("AddBuff"))
            object.AddBuff = message.AddBuff;
        if (message.nCount != null && message.hasOwnProperty("nCount"))
            object.nCount = message.nCount;
        if (message.nSendSize != null && message.hasOwnProperty("nSendSize"))
            object.nSendSize = message.nSendSize;
        return object;
    };

    /**
     * Converts this SendGateWeyBroad to JSON.
     * @function toJSON
     * @memberof SendGateWeyBroad
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SendGateWeyBroad.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for SendGateWeyBroad
     * @function getTypeUrl
     * @memberof SendGateWeyBroad
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    SendGateWeyBroad.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/SendGateWeyBroad";
    };

    return SendGateWeyBroad;
})();

$root.CorrCapital = (function() {

    /**
     * Properties of a CorrCapital.
     * @exports ICorrCapital
     * @interface ICorrCapital
     * @property {number|null} [nUserId] CorrCapital nUserId
     * @property {number|null} [nGold] CorrCapital nGold
     * @property {boolean|null} [isAndroid] CorrCapital isAndroid
     * @property {string|null} [sTableId] CorrCapital sTableId
     * @property {number|null} [nItemId] CorrCapital nItemId
     * @property {number|null} [nChange] CorrCapital nChange
     */

    /**
     * Constructs a new CorrCapital.
     * @exports CorrCapital
     * @classdesc Represents a CorrCapital.
     * @implements ICorrCapital
     * @constructor
     * @param {ICorrCapital=} [properties] Properties to set
     */
    function CorrCapital(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CorrCapital nUserId.
     * @member {number} nUserId
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.nUserId = 0;

    /**
     * CorrCapital nGold.
     * @member {number} nGold
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.nGold = 0;

    /**
     * CorrCapital isAndroid.
     * @member {boolean} isAndroid
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.isAndroid = false;

    /**
     * CorrCapital sTableId.
     * @member {string} sTableId
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.sTableId = "";

    /**
     * CorrCapital nItemId.
     * @member {number} nItemId
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.nItemId = 0;

    /**
     * CorrCapital nChange.
     * @member {number} nChange
     * @memberof CorrCapital
     * @instance
     */
    CorrCapital.prototype.nChange = 0;

    /**
     * Creates a new CorrCapital instance using the specified properties.
     * @function create
     * @memberof CorrCapital
     * @static
     * @param {ICorrCapital=} [properties] Properties to set
     * @returns {CorrCapital} CorrCapital instance
     */
    CorrCapital.create = function create(properties) {
        return new CorrCapital(properties);
    };

    /**
     * Encodes the specified CorrCapital message. Does not implicitly {@link CorrCapital.verify|verify} messages.
     * @function encode
     * @memberof CorrCapital
     * @static
     * @param {ICorrCapital} message CorrCapital message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CorrCapital.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        if (message.nGold != null && Object.hasOwnProperty.call(message, "nGold"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.nGold);
        if (message.isAndroid != null && Object.hasOwnProperty.call(message, "isAndroid"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isAndroid);
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sTableId);
        if (message.nItemId != null && Object.hasOwnProperty.call(message, "nItemId"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nItemId);
        if (message.nChange != null && Object.hasOwnProperty.call(message, "nChange"))
            writer.uint32(/* id 6, wireType 1 =*/49).double(message.nChange);
        return writer;
    };

    /**
     * Encodes the specified CorrCapital message, length delimited. Does not implicitly {@link CorrCapital.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CorrCapital
     * @static
     * @param {ICorrCapital} message CorrCapital message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CorrCapital.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CorrCapital message from the specified reader or buffer.
     * @function decode
     * @memberof CorrCapital
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CorrCapital} CorrCapital
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CorrCapital.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CorrCapital();
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
                    message.nGold = reader.double();
                    break;
                }
            case 3: {
                    message.isAndroid = reader.bool();
                    break;
                }
            case 4: {
                    message.sTableId = reader.string();
                    break;
                }
            case 5: {
                    message.nItemId = reader.int32();
                    break;
                }
            case 6: {
                    message.nChange = reader.double();
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
     * Decodes a CorrCapital message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CorrCapital
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CorrCapital} CorrCapital
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CorrCapital.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CorrCapital message.
     * @function verify
     * @memberof CorrCapital
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CorrCapital.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            if (typeof message.nGold !== "number")
                return "nGold: number expected";
        if (message.isAndroid != null && message.hasOwnProperty("isAndroid"))
            if (typeof message.isAndroid !== "boolean")
                return "isAndroid: boolean expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        if (message.nItemId != null && message.hasOwnProperty("nItemId"))
            if (!$util.isInteger(message.nItemId))
                return "nItemId: integer expected";
        if (message.nChange != null && message.hasOwnProperty("nChange"))
            if (typeof message.nChange !== "number")
                return "nChange: number expected";
        return null;
    };

    /**
     * Creates a CorrCapital message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CorrCapital
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CorrCapital} CorrCapital
     */
    CorrCapital.fromObject = function fromObject(object) {
        if (object instanceof $root.CorrCapital)
            return object;
        var message = new $root.CorrCapital();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nGold != null)
            message.nGold = Number(object.nGold);
        if (object.isAndroid != null)
            message.isAndroid = Boolean(object.isAndroid);
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.nItemId != null)
            message.nItemId = object.nItemId | 0;
        if (object.nChange != null)
            message.nChange = Number(object.nChange);
        return message;
    };

    /**
     * Creates a plain object from a CorrCapital message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CorrCapital
     * @static
     * @param {CorrCapital} message CorrCapital
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CorrCapital.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nGold = 0;
            object.isAndroid = false;
            object.sTableId = "";
            object.nItemId = 0;
            object.nChange = 0;
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = options.json && !isFinite(message.nGold) ? String(message.nGold) : message.nGold;
        if (message.isAndroid != null && message.hasOwnProperty("isAndroid"))
            object.isAndroid = message.isAndroid;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.nItemId != null && message.hasOwnProperty("nItemId"))
            object.nItemId = message.nItemId;
        if (message.nChange != null && message.hasOwnProperty("nChange"))
            object.nChange = options.json && !isFinite(message.nChange) ? String(message.nChange) : message.nChange;
        return object;
    };

    /**
     * Converts this CorrCapital to JSON.
     * @function toJSON
     * @memberof CorrCapital
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CorrCapital.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CorrCapital
     * @function getTypeUrl
     * @memberof CorrCapital
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CorrCapital.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CorrCapital";
    };

    return CorrCapital;
})();

$root.TableSettleInfo = (function() {

    /**
     * Properties of a TableSettleInfo.
     * @exports ITableSettleInfo
     * @interface ITableSettleInfo
     * @property {number} nUserId TableSettleInfo nUserId
     * @property {number} nGold TableSettleInfo nGold
     * @property {string} sTableId TableSettleInfo sTableId
     * @property {string} sTableName TableSettleInfo sTableName
     * @property {number} nBetSum TableSettleInfo nBetSum
     * @property {number} nWinLose TableSettleInfo nWinLose
     */

    /**
     * Constructs a new TableSettleInfo.
     * @exports TableSettleInfo
     * @classdesc Represents a TableSettleInfo.
     * @implements ITableSettleInfo
     * @constructor
     * @param {ITableSettleInfo=} [properties] Properties to set
     */
    function TableSettleInfo(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TableSettleInfo nUserId.
     * @member {number} nUserId
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.nUserId = 0;

    /**
     * TableSettleInfo nGold.
     * @member {number} nGold
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.nGold = 0;

    /**
     * TableSettleInfo sTableId.
     * @member {string} sTableId
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.sTableId = "";

    /**
     * TableSettleInfo sTableName.
     * @member {string} sTableName
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.sTableName = "";

    /**
     * TableSettleInfo nBetSum.
     * @member {number} nBetSum
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.nBetSum = 0;

    /**
     * TableSettleInfo nWinLose.
     * @member {number} nWinLose
     * @memberof TableSettleInfo
     * @instance
     */
    TableSettleInfo.prototype.nWinLose = 0;

    /**
     * Creates a new TableSettleInfo instance using the specified properties.
     * @function create
     * @memberof TableSettleInfo
     * @static
     * @param {ITableSettleInfo=} [properties] Properties to set
     * @returns {TableSettleInfo} TableSettleInfo instance
     */
    TableSettleInfo.create = function create(properties) {
        return new TableSettleInfo(properties);
    };

    /**
     * Encodes the specified TableSettleInfo message. Does not implicitly {@link TableSettleInfo.verify|verify} messages.
     * @function encode
     * @memberof TableSettleInfo
     * @static
     * @param {ITableSettleInfo} message TableSettleInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TableSettleInfo.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.nGold);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sTableId);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.sTableName);
        writer.uint32(/* id 5, wireType 1 =*/41).double(message.nBetSum);
        writer.uint32(/* id 6, wireType 1 =*/49).double(message.nWinLose);
        return writer;
    };

    /**
     * Encodes the specified TableSettleInfo message, length delimited. Does not implicitly {@link TableSettleInfo.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TableSettleInfo
     * @static
     * @param {ITableSettleInfo} message TableSettleInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TableSettleInfo.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TableSettleInfo message from the specified reader or buffer.
     * @function decode
     * @memberof TableSettleInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TableSettleInfo} TableSettleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TableSettleInfo.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TableSettleInfo();
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
                    message.nGold = reader.double();
                    break;
                }
            case 3: {
                    message.sTableId = reader.string();
                    break;
                }
            case 4: {
                    message.sTableName = reader.string();
                    break;
                }
            case 5: {
                    message.nBetSum = reader.double();
                    break;
                }
            case 6: {
                    message.nWinLose = reader.double();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("nGold"))
            throw $util.ProtocolError("missing required 'nGold'", { instance: message });
        if (!message.hasOwnProperty("sTableId"))
            throw $util.ProtocolError("missing required 'sTableId'", { instance: message });
        if (!message.hasOwnProperty("sTableName"))
            throw $util.ProtocolError("missing required 'sTableName'", { instance: message });
        if (!message.hasOwnProperty("nBetSum"))
            throw $util.ProtocolError("missing required 'nBetSum'", { instance: message });
        if (!message.hasOwnProperty("nWinLose"))
            throw $util.ProtocolError("missing required 'nWinLose'", { instance: message });
        return message;
    };

    /**
     * Decodes a TableSettleInfo message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TableSettleInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TableSettleInfo} TableSettleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TableSettleInfo.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TableSettleInfo message.
     * @function verify
     * @memberof TableSettleInfo
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TableSettleInfo.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (typeof message.nGold !== "number")
            return "nGold: number expected";
        if (!$util.isString(message.sTableId))
            return "sTableId: string expected";
        if (!$util.isString(message.sTableName))
            return "sTableName: string expected";
        if (typeof message.nBetSum !== "number")
            return "nBetSum: number expected";
        if (typeof message.nWinLose !== "number")
            return "nWinLose: number expected";
        return null;
    };

    /**
     * Creates a TableSettleInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TableSettleInfo
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TableSettleInfo} TableSettleInfo
     */
    TableSettleInfo.fromObject = function fromObject(object) {
        if (object instanceof $root.TableSettleInfo)
            return object;
        var message = new $root.TableSettleInfo();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nGold != null)
            message.nGold = Number(object.nGold);
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.sTableName != null)
            message.sTableName = String(object.sTableName);
        if (object.nBetSum != null)
            message.nBetSum = Number(object.nBetSum);
        if (object.nWinLose != null)
            message.nWinLose = Number(object.nWinLose);
        return message;
    };

    /**
     * Creates a plain object from a TableSettleInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TableSettleInfo
     * @static
     * @param {TableSettleInfo} message TableSettleInfo
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TableSettleInfo.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nGold = 0;
            object.sTableId = "";
            object.sTableName = "";
            object.nBetSum = 0;
            object.nWinLose = 0;
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = options.json && !isFinite(message.nGold) ? String(message.nGold) : message.nGold;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.sTableName != null && message.hasOwnProperty("sTableName"))
            object.sTableName = message.sTableName;
        if (message.nBetSum != null && message.hasOwnProperty("nBetSum"))
            object.nBetSum = options.json && !isFinite(message.nBetSum) ? String(message.nBetSum) : message.nBetSum;
        if (message.nWinLose != null && message.hasOwnProperty("nWinLose"))
            object.nWinLose = options.json && !isFinite(message.nWinLose) ? String(message.nWinLose) : message.nWinLose;
        return object;
    };

    /**
     * Converts this TableSettleInfo to JSON.
     * @function toJSON
     * @memberof TableSettleInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TableSettleInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for TableSettleInfo
     * @function getTypeUrl
     * @memberof TableSettleInfo
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    TableSettleInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/TableSettleInfo";
    };

    return TableSettleInfo;
})();

$root.RUQ_CheckOffical = (function() {

    /**
     * Properties of a RUQ_CheckOffical.
     * @exports IRUQ_CheckOffical
     * @interface IRUQ_CheckOffical
     * @property {string} sTableId RUQ_CheckOffical sTableId
     */

    /**
     * Constructs a new RUQ_CheckOffical.
     * @exports RUQ_CheckOffical
     * @classdesc Represents a RUQ_CheckOffical.
     * @implements IRUQ_CheckOffical
     * @constructor
     * @param {IRUQ_CheckOffical=} [properties] Properties to set
     */
    function RUQ_CheckOffical(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUQ_CheckOffical sTableId.
     * @member {string} sTableId
     * @memberof RUQ_CheckOffical
     * @instance
     */
    RUQ_CheckOffical.prototype.sTableId = "";

    /**
     * Creates a new RUQ_CheckOffical instance using the specified properties.
     * @function create
     * @memberof RUQ_CheckOffical
     * @static
     * @param {IRUQ_CheckOffical=} [properties] Properties to set
     * @returns {RUQ_CheckOffical} RUQ_CheckOffical instance
     */
    RUQ_CheckOffical.create = function create(properties) {
        return new RUQ_CheckOffical(properties);
    };

    /**
     * Encodes the specified RUQ_CheckOffical message. Does not implicitly {@link RUQ_CheckOffical.verify|verify} messages.
     * @function encode
     * @memberof RUQ_CheckOffical
     * @static
     * @param {IRUQ_CheckOffical} message RUQ_CheckOffical message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_CheckOffical.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTableId);
        return writer;
    };

    /**
     * Encodes the specified RUQ_CheckOffical message, length delimited. Does not implicitly {@link RUQ_CheckOffical.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUQ_CheckOffical
     * @static
     * @param {IRUQ_CheckOffical} message RUQ_CheckOffical message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUQ_CheckOffical.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUQ_CheckOffical message from the specified reader or buffer.
     * @function decode
     * @memberof RUQ_CheckOffical
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUQ_CheckOffical} RUQ_CheckOffical
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_CheckOffical.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUQ_CheckOffical();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sTableId = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sTableId"))
            throw $util.ProtocolError("missing required 'sTableId'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUQ_CheckOffical message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUQ_CheckOffical
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUQ_CheckOffical} RUQ_CheckOffical
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUQ_CheckOffical.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUQ_CheckOffical message.
     * @function verify
     * @memberof RUQ_CheckOffical
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUQ_CheckOffical.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sTableId))
            return "sTableId: string expected";
        return null;
    };

    /**
     * Creates a RUQ_CheckOffical message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUQ_CheckOffical
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUQ_CheckOffical} RUQ_CheckOffical
     */
    RUQ_CheckOffical.fromObject = function fromObject(object) {
        if (object instanceof $root.RUQ_CheckOffical)
            return object;
        var message = new $root.RUQ_CheckOffical();
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        return message;
    };

    /**
     * Creates a plain object from a RUQ_CheckOffical message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUQ_CheckOffical
     * @static
     * @param {RUQ_CheckOffical} message RUQ_CheckOffical
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUQ_CheckOffical.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sTableId = "";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        return object;
    };

    /**
     * Converts this RUQ_CheckOffical to JSON.
     * @function toJSON
     * @memberof RUQ_CheckOffical
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUQ_CheckOffical.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUQ_CheckOffical
     * @function getTypeUrl
     * @memberof RUQ_CheckOffical
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUQ_CheckOffical.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUQ_CheckOffical";
    };

    return RUQ_CheckOffical;
})();

$root.RUP_CheckOffical = (function() {

    /**
     * Properties of a RUP_CheckOffical.
     * @exports IRUP_CheckOffical
     * @interface IRUP_CheckOffical
     * @property {string} sTableId RUP_CheckOffical sTableId
     * @property {boolean} IsOffical RUP_CheckOffical IsOffical
     * @property {number} nTableType RUP_CheckOffical nTableType
     */

    /**
     * Constructs a new RUP_CheckOffical.
     * @exports RUP_CheckOffical
     * @classdesc Represents a RUP_CheckOffical.
     * @implements IRUP_CheckOffical
     * @constructor
     * @param {IRUP_CheckOffical=} [properties] Properties to set
     */
    function RUP_CheckOffical(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUP_CheckOffical sTableId.
     * @member {string} sTableId
     * @memberof RUP_CheckOffical
     * @instance
     */
    RUP_CheckOffical.prototype.sTableId = "";

    /**
     * RUP_CheckOffical IsOffical.
     * @member {boolean} IsOffical
     * @memberof RUP_CheckOffical
     * @instance
     */
    RUP_CheckOffical.prototype.IsOffical = false;

    /**
     * RUP_CheckOffical nTableType.
     * @member {number} nTableType
     * @memberof RUP_CheckOffical
     * @instance
     */
    RUP_CheckOffical.prototype.nTableType = 0;

    /**
     * Creates a new RUP_CheckOffical instance using the specified properties.
     * @function create
     * @memberof RUP_CheckOffical
     * @static
     * @param {IRUP_CheckOffical=} [properties] Properties to set
     * @returns {RUP_CheckOffical} RUP_CheckOffical instance
     */
    RUP_CheckOffical.create = function create(properties) {
        return new RUP_CheckOffical(properties);
    };

    /**
     * Encodes the specified RUP_CheckOffical message. Does not implicitly {@link RUP_CheckOffical.verify|verify} messages.
     * @function encode
     * @memberof RUP_CheckOffical
     * @static
     * @param {IRUP_CheckOffical} message RUP_CheckOffical message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_CheckOffical.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTableId);
        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.IsOffical);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nTableType);
        return writer;
    };

    /**
     * Encodes the specified RUP_CheckOffical message, length delimited. Does not implicitly {@link RUP_CheckOffical.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUP_CheckOffical
     * @static
     * @param {IRUP_CheckOffical} message RUP_CheckOffical message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_CheckOffical.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUP_CheckOffical message from the specified reader or buffer.
     * @function decode
     * @memberof RUP_CheckOffical
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUP_CheckOffical} RUP_CheckOffical
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_CheckOffical.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_CheckOffical();
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
                    message.IsOffical = reader.bool();
                    break;
                }
            case 3: {
                    message.nTableType = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sTableId"))
            throw $util.ProtocolError("missing required 'sTableId'", { instance: message });
        if (!message.hasOwnProperty("IsOffical"))
            throw $util.ProtocolError("missing required 'IsOffical'", { instance: message });
        if (!message.hasOwnProperty("nTableType"))
            throw $util.ProtocolError("missing required 'nTableType'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUP_CheckOffical message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUP_CheckOffical
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUP_CheckOffical} RUP_CheckOffical
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_CheckOffical.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUP_CheckOffical message.
     * @function verify
     * @memberof RUP_CheckOffical
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUP_CheckOffical.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sTableId))
            return "sTableId: string expected";
        if (typeof message.IsOffical !== "boolean")
            return "IsOffical: boolean expected";
        if (!$util.isInteger(message.nTableType))
            return "nTableType: integer expected";
        return null;
    };

    /**
     * Creates a RUP_CheckOffical message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUP_CheckOffical
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUP_CheckOffical} RUP_CheckOffical
     */
    RUP_CheckOffical.fromObject = function fromObject(object) {
        if (object instanceof $root.RUP_CheckOffical)
            return object;
        var message = new $root.RUP_CheckOffical();
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        if (object.IsOffical != null)
            message.IsOffical = Boolean(object.IsOffical);
        if (object.nTableType != null)
            message.nTableType = object.nTableType | 0;
        return message;
    };

    /**
     * Creates a plain object from a RUP_CheckOffical message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUP_CheckOffical
     * @static
     * @param {RUP_CheckOffical} message RUP_CheckOffical
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUP_CheckOffical.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sTableId = "";
            object.IsOffical = false;
            object.nTableType = 0;
        }
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        if (message.IsOffical != null && message.hasOwnProperty("IsOffical"))
            object.IsOffical = message.IsOffical;
        if (message.nTableType != null && message.hasOwnProperty("nTableType"))
            object.nTableType = message.nTableType;
        return object;
    };

    /**
     * Converts this RUP_CheckOffical to JSON.
     * @function toJSON
     * @memberof RUP_CheckOffical
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUP_CheckOffical.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUP_CheckOffical
     * @function getTypeUrl
     * @memberof RUP_CheckOffical
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUP_CheckOffical.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUP_CheckOffical";
    };

    return RUP_CheckOffical;
})();

$root.NoticeMsg = (function() {

    /**
     * Properties of a NoticeMsg.
     * @exports INoticeMsg
     * @interface INoticeMsg
     * @property {number|null} [nUserId] NoticeMsg nUserId
     * @property {number|null} [nType] NoticeMsg nType
     * @property {string|null} [nMsg] NoticeMsg nMsg
     */

    /**
     * Constructs a new NoticeMsg.
     * @exports NoticeMsg
     * @classdesc Represents a NoticeMsg.
     * @implements INoticeMsg
     * @constructor
     * @param {INoticeMsg=} [properties] Properties to set
     */
    function NoticeMsg(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NoticeMsg nUserId.
     * @member {number} nUserId
     * @memberof NoticeMsg
     * @instance
     */
    NoticeMsg.prototype.nUserId = 0;

    /**
     * NoticeMsg nType.
     * @member {number} nType
     * @memberof NoticeMsg
     * @instance
     */
    NoticeMsg.prototype.nType = 0;

    /**
     * NoticeMsg nMsg.
     * @member {string} nMsg
     * @memberof NoticeMsg
     * @instance
     */
    NoticeMsg.prototype.nMsg = "";

    /**
     * Creates a new NoticeMsg instance using the specified properties.
     * @function create
     * @memberof NoticeMsg
     * @static
     * @param {INoticeMsg=} [properties] Properties to set
     * @returns {NoticeMsg} NoticeMsg instance
     */
    NoticeMsg.create = function create(properties) {
        return new NoticeMsg(properties);
    };

    /**
     * Encodes the specified NoticeMsg message. Does not implicitly {@link NoticeMsg.verify|verify} messages.
     * @function encode
     * @memberof NoticeMsg
     * @static
     * @param {INoticeMsg} message NoticeMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NoticeMsg.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserId != null && Object.hasOwnProperty.call(message, "nUserId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        if (message.nType != null && Object.hasOwnProperty.call(message, "nType"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        if (message.nMsg != null && Object.hasOwnProperty.call(message, "nMsg"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.nMsg);
        return writer;
    };

    /**
     * Encodes the specified NoticeMsg message, length delimited. Does not implicitly {@link NoticeMsg.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NoticeMsg
     * @static
     * @param {INoticeMsg} message NoticeMsg message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NoticeMsg.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NoticeMsg message from the specified reader or buffer.
     * @function decode
     * @memberof NoticeMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NoticeMsg} NoticeMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NoticeMsg.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NoticeMsg();
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
                    message.nType = reader.int32();
                    break;
                }
            case 3: {
                    message.nMsg = reader.string();
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
     * Decodes a NoticeMsg message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NoticeMsg
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NoticeMsg} NoticeMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NoticeMsg.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NoticeMsg message.
     * @function verify
     * @memberof NoticeMsg
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NoticeMsg.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
        if (message.nType != null && message.hasOwnProperty("nType"))
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
        if (message.nMsg != null && message.hasOwnProperty("nMsg"))
            if (!$util.isString(message.nMsg))
                return "nMsg: string expected";
        return null;
    };

    /**
     * Creates a NoticeMsg message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NoticeMsg
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NoticeMsg} NoticeMsg
     */
    NoticeMsg.fromObject = function fromObject(object) {
        if (object instanceof $root.NoticeMsg)
            return object;
        var message = new $root.NoticeMsg();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nMsg != null)
            message.nMsg = String(object.nMsg);
        return message;
    };

    /**
     * Creates a plain object from a NoticeMsg message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NoticeMsg
     * @static
     * @param {NoticeMsg} message NoticeMsg
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NoticeMsg.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nType = 0;
            object.nMsg = "";
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nMsg != null && message.hasOwnProperty("nMsg"))
            object.nMsg = message.nMsg;
        return object;
    };

    /**
     * Converts this NoticeMsg to JSON.
     * @function toJSON
     * @memberof NoticeMsg
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NoticeMsg.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for NoticeMsg
     * @function getTypeUrl
     * @memberof NoticeMsg
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    NoticeMsg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/NoticeMsg";
    };

    return NoticeMsg;
})();

$root.Logon_Proto = (function() {

    /**
     * Properties of a Logon_Proto.
     * @exports ILogon_Proto
     * @interface ILogon_Proto
     * @property {number} LOGON_MAIN Logon_Proto LOGON_MAIN
     * @property {number} SUB_REQ_LOGON Logon_Proto SUB_REQ_LOGON
     * @property {number} SUB_REQ_REGISTER Logon_Proto SUB_REQ_REGISTER
     * @property {number} SUB_REQ_LOGON_TENCENT Logon_Proto SUB_REQ_LOGON_TENCENT
     * @property {number} SUB_REP_LOGON_RESULT Logon_Proto SUB_REP_LOGON_RESULT
     * @property {number} SUB_REP_REGISTER_RESULT Logon_Proto SUB_REP_REGISTER_RESULT
     * @property {number} SUB_REP_RECONNECT Logon_Proto SUB_REP_RECONNECT
     * @property {number} SUB_REQ_ADDR Logon_Proto SUB_REQ_ADDR
     * @property {number} SUB_REP_ADDR Logon_Proto SUB_REP_ADDR
     * @property {number} CurrentGameQuerryReq_CMD Logon_Proto CurrentGameQuerryReq_CMD
     * @property {number} CurrentGameQuerryRsp_CMD Logon_Proto CurrentGameQuerryRsp_CMD
     * @property {number} VeriCodeReq_CMD Logon_Proto VeriCodeReq_CMD
     * @property {number} VeriCodeRsp_CMD Logon_Proto VeriCodeRsp_CMD
     * @property {number} BindQuerryReq_CMD Logon_Proto BindQuerryReq_CMD
     * @property {number} BindQuerryRsp_CMD Logon_Proto BindQuerryRsp_CMD
     * @property {number} PasswordResetReq_CMD Logon_Proto PasswordResetReq_CMD
     * @property {number} PasswordResetRsp_CMD Logon_Proto PasswordResetRsp_CMD
     */

    /**
     * Constructs a new Logon_Proto.
     * @exports Logon_Proto
     * @classdesc Represents a Logon_Proto.
     * @implements ILogon_Proto
     * @constructor
     * @param {ILogon_Proto=} [properties] Properties to set
     */
    function Logon_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Logon_Proto LOGON_MAIN.
     * @member {number} LOGON_MAIN
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.LOGON_MAIN = 1;

    /**
     * Logon_Proto SUB_REQ_LOGON.
     * @member {number} SUB_REQ_LOGON
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REQ_LOGON = 100;

    /**
     * Logon_Proto SUB_REQ_REGISTER.
     * @member {number} SUB_REQ_REGISTER
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REQ_REGISTER = 2;

    /**
     * Logon_Proto SUB_REQ_LOGON_TENCENT.
     * @member {number} SUB_REQ_LOGON_TENCENT
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REQ_LOGON_TENCENT = 3;

    /**
     * Logon_Proto SUB_REP_LOGON_RESULT.
     * @member {number} SUB_REP_LOGON_RESULT
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REP_LOGON_RESULT = 100;

    /**
     * Logon_Proto SUB_REP_REGISTER_RESULT.
     * @member {number} SUB_REP_REGISTER_RESULT
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REP_REGISTER_RESULT = 101;

    /**
     * Logon_Proto SUB_REP_RECONNECT.
     * @member {number} SUB_REP_RECONNECT
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REP_RECONNECT = 102;

    /**
     * Logon_Proto SUB_REQ_ADDR.
     * @member {number} SUB_REQ_ADDR
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REQ_ADDR = 103;

    /**
     * Logon_Proto SUB_REP_ADDR.
     * @member {number} SUB_REP_ADDR
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.SUB_REP_ADDR = 104;

    /**
     * Logon_Proto CurrentGameQuerryReq_CMD.
     * @member {number} CurrentGameQuerryReq_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.CurrentGameQuerryReq_CMD = 29;

    /**
     * Logon_Proto CurrentGameQuerryRsp_CMD.
     * @member {number} CurrentGameQuerryRsp_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.CurrentGameQuerryRsp_CMD = 30;

    /**
     * Logon_Proto VeriCodeReq_CMD.
     * @member {number} VeriCodeReq_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.VeriCodeReq_CMD = 31;

    /**
     * Logon_Proto VeriCodeRsp_CMD.
     * @member {number} VeriCodeRsp_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.VeriCodeRsp_CMD = 32;

    /**
     * Logon_Proto BindQuerryReq_CMD.
     * @member {number} BindQuerryReq_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.BindQuerryReq_CMD = 33;

    /**
     * Logon_Proto BindQuerryRsp_CMD.
     * @member {number} BindQuerryRsp_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.BindQuerryRsp_CMD = 34;

    /**
     * Logon_Proto PasswordResetReq_CMD.
     * @member {number} PasswordResetReq_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.PasswordResetReq_CMD = 35;

    /**
     * Logon_Proto PasswordResetRsp_CMD.
     * @member {number} PasswordResetRsp_CMD
     * @memberof Logon_Proto
     * @instance
     */
    Logon_Proto.prototype.PasswordResetRsp_CMD = 36;

    /**
     * Creates a new Logon_Proto instance using the specified properties.
     * @function create
     * @memberof Logon_Proto
     * @static
     * @param {ILogon_Proto=} [properties] Properties to set
     * @returns {Logon_Proto} Logon_Proto instance
     */
    Logon_Proto.create = function create(properties) {
        return new Logon_Proto(properties);
    };

    /**
     * Encodes the specified Logon_Proto message. Does not implicitly {@link Logon_Proto.verify|verify} messages.
     * @function encode
     * @memberof Logon_Proto
     * @static
     * @param {ILogon_Proto} message Logon_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Logon_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.LOGON_MAIN);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.SUB_REQ_LOGON);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.SUB_REQ_REGISTER);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.SUB_REQ_LOGON_TENCENT);
        writer.uint32(/* id 29, wireType 0 =*/232).int32(message.CurrentGameQuerryReq_CMD);
        writer.uint32(/* id 30, wireType 0 =*/240).int32(message.CurrentGameQuerryRsp_CMD);
        writer.uint32(/* id 31, wireType 0 =*/248).int32(message.VeriCodeReq_CMD);
        writer.uint32(/* id 32, wireType 0 =*/256).int32(message.VeriCodeRsp_CMD);
        writer.uint32(/* id 33, wireType 0 =*/264).int32(message.BindQuerryReq_CMD);
        writer.uint32(/* id 34, wireType 0 =*/272).int32(message.BindQuerryRsp_CMD);
        writer.uint32(/* id 35, wireType 0 =*/280).int32(message.PasswordResetReq_CMD);
        writer.uint32(/* id 36, wireType 0 =*/288).int32(message.PasswordResetRsp_CMD);
        writer.uint32(/* id 100, wireType 0 =*/800).int32(message.SUB_REP_LOGON_RESULT);
        writer.uint32(/* id 101, wireType 0 =*/808).int32(message.SUB_REP_REGISTER_RESULT);
        writer.uint32(/* id 102, wireType 0 =*/816).int32(message.SUB_REP_RECONNECT);
        writer.uint32(/* id 103, wireType 0 =*/824).int32(message.SUB_REQ_ADDR);
        writer.uint32(/* id 104, wireType 0 =*/832).int32(message.SUB_REP_ADDR);
        return writer;
    };

    /**
     * Encodes the specified Logon_Proto message, length delimited. Does not implicitly {@link Logon_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Logon_Proto
     * @static
     * @param {ILogon_Proto} message Logon_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Logon_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Logon_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Logon_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Logon_Proto} Logon_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Logon_Proto.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Logon_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.LOGON_MAIN = reader.int32();
                    break;
                }
            case 2: {
                    message.SUB_REQ_LOGON = reader.int32();
                    break;
                }
            case 3: {
                    message.SUB_REQ_REGISTER = reader.int32();
                    break;
                }
            case 4: {
                    message.SUB_REQ_LOGON_TENCENT = reader.int32();
                    break;
                }
            case 100: {
                    message.SUB_REP_LOGON_RESULT = reader.int32();
                    break;
                }
            case 101: {
                    message.SUB_REP_REGISTER_RESULT = reader.int32();
                    break;
                }
            case 102: {
                    message.SUB_REP_RECONNECT = reader.int32();
                    break;
                }
            case 103: {
                    message.SUB_REQ_ADDR = reader.int32();
                    break;
                }
            case 104: {
                    message.SUB_REP_ADDR = reader.int32();
                    break;
                }
            case 29: {
                    message.CurrentGameQuerryReq_CMD = reader.int32();
                    break;
                }
            case 30: {
                    message.CurrentGameQuerryRsp_CMD = reader.int32();
                    break;
                }
            case 31: {
                    message.VeriCodeReq_CMD = reader.int32();
                    break;
                }
            case 32: {
                    message.VeriCodeRsp_CMD = reader.int32();
                    break;
                }
            case 33: {
                    message.BindQuerryReq_CMD = reader.int32();
                    break;
                }
            case 34: {
                    message.BindQuerryRsp_CMD = reader.int32();
                    break;
                }
            case 35: {
                    message.PasswordResetReq_CMD = reader.int32();
                    break;
                }
            case 36: {
                    message.PasswordResetRsp_CMD = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("LOGON_MAIN"))
            throw $util.ProtocolError("missing required 'LOGON_MAIN'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_LOGON"))
            throw $util.ProtocolError("missing required 'SUB_REQ_LOGON'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_REGISTER"))
            throw $util.ProtocolError("missing required 'SUB_REQ_REGISTER'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_LOGON_TENCENT"))
            throw $util.ProtocolError("missing required 'SUB_REQ_LOGON_TENCENT'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_LOGON_RESULT"))
            throw $util.ProtocolError("missing required 'SUB_REP_LOGON_RESULT'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_REGISTER_RESULT"))
            throw $util.ProtocolError("missing required 'SUB_REP_REGISTER_RESULT'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_RECONNECT"))
            throw $util.ProtocolError("missing required 'SUB_REP_RECONNECT'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_ADDR"))
            throw $util.ProtocolError("missing required 'SUB_REQ_ADDR'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_ADDR"))
            throw $util.ProtocolError("missing required 'SUB_REP_ADDR'", { instance: message });
        if (!message.hasOwnProperty("CurrentGameQuerryReq_CMD"))
            throw $util.ProtocolError("missing required 'CurrentGameQuerryReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("CurrentGameQuerryRsp_CMD"))
            throw $util.ProtocolError("missing required 'CurrentGameQuerryRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("VeriCodeReq_CMD"))
            throw $util.ProtocolError("missing required 'VeriCodeReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("VeriCodeRsp_CMD"))
            throw $util.ProtocolError("missing required 'VeriCodeRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BindQuerryReq_CMD"))
            throw $util.ProtocolError("missing required 'BindQuerryReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BindQuerryRsp_CMD"))
            throw $util.ProtocolError("missing required 'BindQuerryRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("PasswordResetReq_CMD"))
            throw $util.ProtocolError("missing required 'PasswordResetReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("PasswordResetRsp_CMD"))
            throw $util.ProtocolError("missing required 'PasswordResetRsp_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a Logon_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Logon_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Logon_Proto} Logon_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Logon_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Logon_Proto message.
     * @function verify
     * @memberof Logon_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Logon_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.LOGON_MAIN))
            return "LOGON_MAIN: integer expected";
        if (!$util.isInteger(message.SUB_REQ_LOGON))
            return "SUB_REQ_LOGON: integer expected";
        if (!$util.isInteger(message.SUB_REQ_REGISTER))
            return "SUB_REQ_REGISTER: integer expected";
        if (!$util.isInteger(message.SUB_REQ_LOGON_TENCENT))
            return "SUB_REQ_LOGON_TENCENT: integer expected";
        if (!$util.isInteger(message.SUB_REP_LOGON_RESULT))
            return "SUB_REP_LOGON_RESULT: integer expected";
        if (!$util.isInteger(message.SUB_REP_REGISTER_RESULT))
            return "SUB_REP_REGISTER_RESULT: integer expected";
        if (!$util.isInteger(message.SUB_REP_RECONNECT))
            return "SUB_REP_RECONNECT: integer expected";
        if (!$util.isInteger(message.SUB_REQ_ADDR))
            return "SUB_REQ_ADDR: integer expected";
        if (!$util.isInteger(message.SUB_REP_ADDR))
            return "SUB_REP_ADDR: integer expected";
        if (!$util.isInteger(message.CurrentGameQuerryReq_CMD))
            return "CurrentGameQuerryReq_CMD: integer expected";
        if (!$util.isInteger(message.CurrentGameQuerryRsp_CMD))
            return "CurrentGameQuerryRsp_CMD: integer expected";
        if (!$util.isInteger(message.VeriCodeReq_CMD))
            return "VeriCodeReq_CMD: integer expected";
        if (!$util.isInteger(message.VeriCodeRsp_CMD))
            return "VeriCodeRsp_CMD: integer expected";
        if (!$util.isInteger(message.BindQuerryReq_CMD))
            return "BindQuerryReq_CMD: integer expected";
        if (!$util.isInteger(message.BindQuerryRsp_CMD))
            return "BindQuerryRsp_CMD: integer expected";
        if (!$util.isInteger(message.PasswordResetReq_CMD))
            return "PasswordResetReq_CMD: integer expected";
        if (!$util.isInteger(message.PasswordResetRsp_CMD))
            return "PasswordResetRsp_CMD: integer expected";
        return null;
    };

    /**
     * Creates a Logon_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Logon_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Logon_Proto} Logon_Proto
     */
    Logon_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Logon_Proto)
            return object;
        var message = new $root.Logon_Proto();
        if (object.LOGON_MAIN != null)
            message.LOGON_MAIN = object.LOGON_MAIN | 0;
        if (object.SUB_REQ_LOGON != null)
            message.SUB_REQ_LOGON = object.SUB_REQ_LOGON | 0;
        if (object.SUB_REQ_REGISTER != null)
            message.SUB_REQ_REGISTER = object.SUB_REQ_REGISTER | 0;
        if (object.SUB_REQ_LOGON_TENCENT != null)
            message.SUB_REQ_LOGON_TENCENT = object.SUB_REQ_LOGON_TENCENT | 0;
        if (object.SUB_REP_LOGON_RESULT != null)
            message.SUB_REP_LOGON_RESULT = object.SUB_REP_LOGON_RESULT | 0;
        if (object.SUB_REP_REGISTER_RESULT != null)
            message.SUB_REP_REGISTER_RESULT = object.SUB_REP_REGISTER_RESULT | 0;
        if (object.SUB_REP_RECONNECT != null)
            message.SUB_REP_RECONNECT = object.SUB_REP_RECONNECT | 0;
        if (object.SUB_REQ_ADDR != null)
            message.SUB_REQ_ADDR = object.SUB_REQ_ADDR | 0;
        if (object.SUB_REP_ADDR != null)
            message.SUB_REP_ADDR = object.SUB_REP_ADDR | 0;
        if (object.CurrentGameQuerryReq_CMD != null)
            message.CurrentGameQuerryReq_CMD = object.CurrentGameQuerryReq_CMD | 0;
        if (object.CurrentGameQuerryRsp_CMD != null)
            message.CurrentGameQuerryRsp_CMD = object.CurrentGameQuerryRsp_CMD | 0;
        if (object.VeriCodeReq_CMD != null)
            message.VeriCodeReq_CMD = object.VeriCodeReq_CMD | 0;
        if (object.VeriCodeRsp_CMD != null)
            message.VeriCodeRsp_CMD = object.VeriCodeRsp_CMD | 0;
        if (object.BindQuerryReq_CMD != null)
            message.BindQuerryReq_CMD = object.BindQuerryReq_CMD | 0;
        if (object.BindQuerryRsp_CMD != null)
            message.BindQuerryRsp_CMD = object.BindQuerryRsp_CMD | 0;
        if (object.PasswordResetReq_CMD != null)
            message.PasswordResetReq_CMD = object.PasswordResetReq_CMD | 0;
        if (object.PasswordResetRsp_CMD != null)
            message.PasswordResetRsp_CMD = object.PasswordResetRsp_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a Logon_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Logon_Proto
     * @static
     * @param {Logon_Proto} message Logon_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Logon_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.LOGON_MAIN = 1;
            object.SUB_REQ_LOGON = 100;
            object.SUB_REQ_REGISTER = 2;
            object.SUB_REQ_LOGON_TENCENT = 3;
            object.CurrentGameQuerryReq_CMD = 29;
            object.CurrentGameQuerryRsp_CMD = 30;
            object.VeriCodeReq_CMD = 31;
            object.VeriCodeRsp_CMD = 32;
            object.BindQuerryReq_CMD = 33;
            object.BindQuerryRsp_CMD = 34;
            object.PasswordResetReq_CMD = 35;
            object.PasswordResetRsp_CMD = 36;
            object.SUB_REP_LOGON_RESULT = 100;
            object.SUB_REP_REGISTER_RESULT = 101;
            object.SUB_REP_RECONNECT = 102;
            object.SUB_REQ_ADDR = 103;
            object.SUB_REP_ADDR = 104;
        }
        if (message.LOGON_MAIN != null && message.hasOwnProperty("LOGON_MAIN"))
            object.LOGON_MAIN = message.LOGON_MAIN;
        if (message.SUB_REQ_LOGON != null && message.hasOwnProperty("SUB_REQ_LOGON"))
            object.SUB_REQ_LOGON = message.SUB_REQ_LOGON;
        if (message.SUB_REQ_REGISTER != null && message.hasOwnProperty("SUB_REQ_REGISTER"))
            object.SUB_REQ_REGISTER = message.SUB_REQ_REGISTER;
        if (message.SUB_REQ_LOGON_TENCENT != null && message.hasOwnProperty("SUB_REQ_LOGON_TENCENT"))
            object.SUB_REQ_LOGON_TENCENT = message.SUB_REQ_LOGON_TENCENT;
        if (message.CurrentGameQuerryReq_CMD != null && message.hasOwnProperty("CurrentGameQuerryReq_CMD"))
            object.CurrentGameQuerryReq_CMD = message.CurrentGameQuerryReq_CMD;
        if (message.CurrentGameQuerryRsp_CMD != null && message.hasOwnProperty("CurrentGameQuerryRsp_CMD"))
            object.CurrentGameQuerryRsp_CMD = message.CurrentGameQuerryRsp_CMD;
        if (message.VeriCodeReq_CMD != null && message.hasOwnProperty("VeriCodeReq_CMD"))
            object.VeriCodeReq_CMD = message.VeriCodeReq_CMD;
        if (message.VeriCodeRsp_CMD != null && message.hasOwnProperty("VeriCodeRsp_CMD"))
            object.VeriCodeRsp_CMD = message.VeriCodeRsp_CMD;
        if (message.BindQuerryReq_CMD != null && message.hasOwnProperty("BindQuerryReq_CMD"))
            object.BindQuerryReq_CMD = message.BindQuerryReq_CMD;
        if (message.BindQuerryRsp_CMD != null && message.hasOwnProperty("BindQuerryRsp_CMD"))
            object.BindQuerryRsp_CMD = message.BindQuerryRsp_CMD;
        if (message.PasswordResetReq_CMD != null && message.hasOwnProperty("PasswordResetReq_CMD"))
            object.PasswordResetReq_CMD = message.PasswordResetReq_CMD;
        if (message.PasswordResetRsp_CMD != null && message.hasOwnProperty("PasswordResetRsp_CMD"))
            object.PasswordResetRsp_CMD = message.PasswordResetRsp_CMD;
        if (message.SUB_REP_LOGON_RESULT != null && message.hasOwnProperty("SUB_REP_LOGON_RESULT"))
            object.SUB_REP_LOGON_RESULT = message.SUB_REP_LOGON_RESULT;
        if (message.SUB_REP_REGISTER_RESULT != null && message.hasOwnProperty("SUB_REP_REGISTER_RESULT"))
            object.SUB_REP_REGISTER_RESULT = message.SUB_REP_REGISTER_RESULT;
        if (message.SUB_REP_RECONNECT != null && message.hasOwnProperty("SUB_REP_RECONNECT"))
            object.SUB_REP_RECONNECT = message.SUB_REP_RECONNECT;
        if (message.SUB_REQ_ADDR != null && message.hasOwnProperty("SUB_REQ_ADDR"))
            object.SUB_REQ_ADDR = message.SUB_REQ_ADDR;
        if (message.SUB_REP_ADDR != null && message.hasOwnProperty("SUB_REP_ADDR"))
            object.SUB_REP_ADDR = message.SUB_REP_ADDR;
        return object;
    };

    /**
     * Converts this Logon_Proto to JSON.
     * @function toJSON
     * @memberof Logon_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Logon_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Logon_Proto
     * @function getTypeUrl
     * @memberof Logon_Proto
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Logon_Proto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Logon_Proto";
    };

    return Logon_Proto;
})();

$root.AddressesReq = (function() {

    /**
     * Properties of an AddressesReq.
     * @exports IAddressesReq
     * @interface IAddressesReq
     * @property {string} sChannel AddressesReq sChannel
     * @property {string} sPlatform AddressesReq sPlatform
     * @property {number|null} [nScoketType] AddressesReq nScoketType
     */

    /**
     * Constructs a new AddressesReq.
     * @exports AddressesReq
     * @classdesc Represents an AddressesReq.
     * @implements IAddressesReq
     * @constructor
     * @param {IAddressesReq=} [properties] Properties to set
     */
    function AddressesReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AddressesReq sChannel.
     * @member {string} sChannel
     * @memberof AddressesReq
     * @instance
     */
    AddressesReq.prototype.sChannel = "";

    /**
     * AddressesReq sPlatform.
     * @member {string} sPlatform
     * @memberof AddressesReq
     * @instance
     */
    AddressesReq.prototype.sPlatform = "";

    /**
     * AddressesReq nScoketType.
     * @member {number} nScoketType
     * @memberof AddressesReq
     * @instance
     */
    AddressesReq.prototype.nScoketType = 0;

    /**
     * Creates a new AddressesReq instance using the specified properties.
     * @function create
     * @memberof AddressesReq
     * @static
     * @param {IAddressesReq=} [properties] Properties to set
     * @returns {AddressesReq} AddressesReq instance
     */
    AddressesReq.create = function create(properties) {
        return new AddressesReq(properties);
    };

    /**
     * Encodes the specified AddressesReq message. Does not implicitly {@link AddressesReq.verify|verify} messages.
     * @function encode
     * @memberof AddressesReq
     * @static
     * @param {IAddressesReq} message AddressesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AddressesReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sChannel);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sPlatform);
        if (message.nScoketType != null && Object.hasOwnProperty.call(message, "nScoketType"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nScoketType);
        return writer;
    };

    /**
     * Encodes the specified AddressesReq message, length delimited. Does not implicitly {@link AddressesReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AddressesReq
     * @static
     * @param {IAddressesReq} message AddressesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AddressesReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AddressesReq message from the specified reader or buffer.
     * @function decode
     * @memberof AddressesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AddressesReq} AddressesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AddressesReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AddressesReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sChannel = reader.string();
                    break;
                }
            case 2: {
                    message.sPlatform = reader.string();
                    break;
                }
            case 3: {
                    message.nScoketType = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sChannel"))
            throw $util.ProtocolError("missing required 'sChannel'", { instance: message });
        if (!message.hasOwnProperty("sPlatform"))
            throw $util.ProtocolError("missing required 'sPlatform'", { instance: message });
        return message;
    };

    /**
     * Decodes an AddressesReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AddressesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AddressesReq} AddressesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AddressesReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AddressesReq message.
     * @function verify
     * @memberof AddressesReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AddressesReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sChannel))
            return "sChannel: string expected";
        if (!$util.isString(message.sPlatform))
            return "sPlatform: string expected";
        if (message.nScoketType != null && message.hasOwnProperty("nScoketType"))
            if (!$util.isInteger(message.nScoketType))
                return "nScoketType: integer expected";
        return null;
    };

    /**
     * Creates an AddressesReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AddressesReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AddressesReq} AddressesReq
     */
    AddressesReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AddressesReq)
            return object;
        var message = new $root.AddressesReq();
        if (object.sChannel != null)
            message.sChannel = String(object.sChannel);
        if (object.sPlatform != null)
            message.sPlatform = String(object.sPlatform);
        if (object.nScoketType != null)
            message.nScoketType = object.nScoketType | 0;
        return message;
    };

    /**
     * Creates a plain object from an AddressesReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AddressesReq
     * @static
     * @param {AddressesReq} message AddressesReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AddressesReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sChannel = "";
            object.sPlatform = "";
            object.nScoketType = 0;
        }
        if (message.sChannel != null && message.hasOwnProperty("sChannel"))
            object.sChannel = message.sChannel;
        if (message.sPlatform != null && message.hasOwnProperty("sPlatform"))
            object.sPlatform = message.sPlatform;
        if (message.nScoketType != null && message.hasOwnProperty("nScoketType"))
            object.nScoketType = message.nScoketType;
        return object;
    };

    /**
     * Converts this AddressesReq to JSON.
     * @function toJSON
     * @memberof AddressesReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AddressesReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AddressesReq
     * @function getTypeUrl
     * @memberof AddressesReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AddressesReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AddressesReq";
    };

    return AddressesReq;
})();

$root.AddressesRsp = (function() {

    /**
     * Properties of an AddressesRsp.
     * @exports IAddressesRsp
     * @interface IAddressesRsp
     * @property {number} nRlt AddressesRsp nRlt
     * @property {string|null} [sIp] AddressesRsp sIp
     * @property {number|null} [nPort] AddressesRsp nPort
     * @property {string|null} [sFailTip] AddressesRsp sFailTip
     */

    /**
     * Constructs a new AddressesRsp.
     * @exports AddressesRsp
     * @classdesc Represents an AddressesRsp.
     * @implements IAddressesRsp
     * @constructor
     * @param {IAddressesRsp=} [properties] Properties to set
     */
    function AddressesRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AddressesRsp nRlt.
     * @member {number} nRlt
     * @memberof AddressesRsp
     * @instance
     */
    AddressesRsp.prototype.nRlt = 0;

    /**
     * AddressesRsp sIp.
     * @member {string} sIp
     * @memberof AddressesRsp
     * @instance
     */
    AddressesRsp.prototype.sIp = "";

    /**
     * AddressesRsp nPort.
     * @member {number} nPort
     * @memberof AddressesRsp
     * @instance
     */
    AddressesRsp.prototype.nPort = 0;

    /**
     * AddressesRsp sFailTip.
     * @member {string} sFailTip
     * @memberof AddressesRsp
     * @instance
     */
    AddressesRsp.prototype.sFailTip = "";

    /**
     * Creates a new AddressesRsp instance using the specified properties.
     * @function create
     * @memberof AddressesRsp
     * @static
     * @param {IAddressesRsp=} [properties] Properties to set
     * @returns {AddressesRsp} AddressesRsp instance
     */
    AddressesRsp.create = function create(properties) {
        return new AddressesRsp(properties);
    };

    /**
     * Encodes the specified AddressesRsp message. Does not implicitly {@link AddressesRsp.verify|verify} messages.
     * @function encode
     * @memberof AddressesRsp
     * @static
     * @param {IAddressesRsp} message AddressesRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AddressesRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        if (message.sIp != null && Object.hasOwnProperty.call(message, "sIp"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sIp);
        if (message.nPort != null && Object.hasOwnProperty.call(message, "nPort"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nPort);
        if (message.sFailTip != null && Object.hasOwnProperty.call(message, "sFailTip"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sFailTip);
        return writer;
    };

    /**
     * Encodes the specified AddressesRsp message, length delimited. Does not implicitly {@link AddressesRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AddressesRsp
     * @static
     * @param {IAddressesRsp} message AddressesRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AddressesRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AddressesRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AddressesRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AddressesRsp} AddressesRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AddressesRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AddressesRsp();
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
                    message.sIp = reader.string();
                    break;
                }
            case 3: {
                    message.nPort = reader.int32();
                    break;
                }
            case 4: {
                    message.sFailTip = reader.string();
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
     * Decodes an AddressesRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AddressesRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AddressesRsp} AddressesRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AddressesRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AddressesRsp message.
     * @function verify
     * @memberof AddressesRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AddressesRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (message.sIp != null && message.hasOwnProperty("sIp"))
            if (!$util.isString(message.sIp))
                return "sIp: string expected";
        if (message.nPort != null && message.hasOwnProperty("nPort"))
            if (!$util.isInteger(message.nPort))
                return "nPort: integer expected";
        if (message.sFailTip != null && message.hasOwnProperty("sFailTip"))
            if (!$util.isString(message.sFailTip))
                return "sFailTip: string expected";
        return null;
    };

    /**
     * Creates an AddressesRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AddressesRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AddressesRsp} AddressesRsp
     */
    AddressesRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AddressesRsp)
            return object;
        var message = new $root.AddressesRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.sIp != null)
            message.sIp = String(object.sIp);
        if (object.nPort != null)
            message.nPort = object.nPort | 0;
        if (object.sFailTip != null)
            message.sFailTip = String(object.sFailTip);
        return message;
    };

    /**
     * Creates a plain object from an AddressesRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AddressesRsp
     * @static
     * @param {AddressesRsp} message AddressesRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AddressesRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nRlt = 0;
            object.sIp = "";
            object.nPort = 0;
            object.sFailTip = "";
        }
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.sIp != null && message.hasOwnProperty("sIp"))
            object.sIp = message.sIp;
        if (message.nPort != null && message.hasOwnProperty("nPort"))
            object.nPort = message.nPort;
        if (message.sFailTip != null && message.hasOwnProperty("sFailTip"))
            object.sFailTip = message.sFailTip;
        return object;
    };

    /**
     * Converts this AddressesRsp to JSON.
     * @function toJSON
     * @memberof AddressesRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AddressesRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AddressesRsp
     * @function getTypeUrl
     * @memberof AddressesRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AddressesRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AddressesRsp";
    };

    return AddressesRsp;
})();

$root.Ruq_Logon = (function() {

    /**
     * Properties of a Ruq_Logon.
     * @exports IRuq_Logon
     * @interface IRuq_Logon
     * @property {string} Accounts Ruq_Logon Accounts
     * @property {string} Password Ruq_Logon Password
     * @property {number} Type Ruq_Logon Type
     * @property {string} SysVersion Ruq_Logon SysVersion
     * @property {string} Models Ruq_Logon Models
     * @property {string} Channel Ruq_Logon Channel
     * @property {string} sPlatform Ruq_Logon sPlatform
     * @property {string} sVersions Ruq_Logon sVersions
     * @property {string} Location Ruq_Logon Location
     * @property {string|null} [sToken] Ruq_Logon sToken
     * @property {number|null} [nShopId] Ruq_Logon nShopId
     * @property {string|null} [sDeviceModel] Ruq_Logon sDeviceModel
     * @property {string|null} [sGps] Ruq_Logon sGps
     */

    /**
     * Constructs a new Ruq_Logon.
     * @exports Ruq_Logon
     * @classdesc Represents a Ruq_Logon.
     * @implements IRuq_Logon
     * @constructor
     * @param {IRuq_Logon=} [properties] Properties to set
     */
    function Ruq_Logon(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Ruq_Logon Accounts.
     * @member {string} Accounts
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Accounts = "";

    /**
     * Ruq_Logon Password.
     * @member {string} Password
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Password = "";

    /**
     * Ruq_Logon Type.
     * @member {number} Type
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Type = 1;

    /**
     * Ruq_Logon SysVersion.
     * @member {string} SysVersion
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.SysVersion = "";

    /**
     * Ruq_Logon Models.
     * @member {string} Models
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Models = "";

    /**
     * Ruq_Logon Channel.
     * @member {string} Channel
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Channel = "";

    /**
     * Ruq_Logon sPlatform.
     * @member {string} sPlatform
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.sPlatform = "";

    /**
     * Ruq_Logon sVersions.
     * @member {string} sVersions
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.sVersions = "";

    /**
     * Ruq_Logon Location.
     * @member {string} Location
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.Location = "";

    /**
     * Ruq_Logon sToken.
     * @member {string} sToken
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.sToken = "";

    /**
     * Ruq_Logon nShopId.
     * @member {number} nShopId
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.nShopId = 0;

    /**
     * Ruq_Logon sDeviceModel.
     * @member {string} sDeviceModel
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.sDeviceModel = "";

    /**
     * Ruq_Logon sGps.
     * @member {string} sGps
     * @memberof Ruq_Logon
     * @instance
     */
    Ruq_Logon.prototype.sGps = "";

    /**
     * Creates a new Ruq_Logon instance using the specified properties.
     * @function create
     * @memberof Ruq_Logon
     * @static
     * @param {IRuq_Logon=} [properties] Properties to set
     * @returns {Ruq_Logon} Ruq_Logon instance
     */
    Ruq_Logon.create = function create(properties) {
        return new Ruq_Logon(properties);
    };

    /**
     * Encodes the specified Ruq_Logon message. Does not implicitly {@link Ruq_Logon.verify|verify} messages.
     * @function encode
     * @memberof Ruq_Logon
     * @static
     * @param {IRuq_Logon} message Ruq_Logon message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ruq_Logon.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.Accounts);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.Password);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.Type);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.SysVersion);
        writer.uint32(/* id 5, wireType 2 =*/42).string(message.Models);
        writer.uint32(/* id 6, wireType 2 =*/50).string(message.Channel);
        writer.uint32(/* id 7, wireType 2 =*/58).string(message.sPlatform);
        writer.uint32(/* id 8, wireType 2 =*/66).string(message.sVersions);
        writer.uint32(/* id 9, wireType 2 =*/74).string(message.Location);
        if (message.sToken != null && Object.hasOwnProperty.call(message, "sToken"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.sToken);
        if (message.nShopId != null && Object.hasOwnProperty.call(message, "nShopId"))
            writer.uint32(/* id 13, wireType 0 =*/104).int32(message.nShopId);
        if (message.sDeviceModel != null && Object.hasOwnProperty.call(message, "sDeviceModel"))
            writer.uint32(/* id 14, wireType 2 =*/114).string(message.sDeviceModel);
        if (message.sGps != null && Object.hasOwnProperty.call(message, "sGps"))
            writer.uint32(/* id 15, wireType 2 =*/122).string(message.sGps);
        return writer;
    };

    /**
     * Encodes the specified Ruq_Logon message, length delimited. Does not implicitly {@link Ruq_Logon.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Ruq_Logon
     * @static
     * @param {IRuq_Logon} message Ruq_Logon message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ruq_Logon.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Ruq_Logon message from the specified reader or buffer.
     * @function decode
     * @memberof Ruq_Logon
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Ruq_Logon} Ruq_Logon
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ruq_Logon.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Ruq_Logon();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.Accounts = reader.string();
                    break;
                }
            case 2: {
                    message.Password = reader.string();
                    break;
                }
            case 3: {
                    message.Type = reader.int32();
                    break;
                }
            case 4: {
                    message.SysVersion = reader.string();
                    break;
                }
            case 5: {
                    message.Models = reader.string();
                    break;
                }
            case 6: {
                    message.Channel = reader.string();
                    break;
                }
            case 7: {
                    message.sPlatform = reader.string();
                    break;
                }
            case 8: {
                    message.sVersions = reader.string();
                    break;
                }
            case 9: {
                    message.Location = reader.string();
                    break;
                }
            case 10: {
                    message.sToken = reader.string();
                    break;
                }
            case 13: {
                    message.nShopId = reader.int32();
                    break;
                }
            case 14: {
                    message.sDeviceModel = reader.string();
                    break;
                }
            case 15: {
                    message.sGps = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Accounts"))
            throw $util.ProtocolError("missing required 'Accounts'", { instance: message });
        if (!message.hasOwnProperty("Password"))
            throw $util.ProtocolError("missing required 'Password'", { instance: message });
        if (!message.hasOwnProperty("Type"))
            throw $util.ProtocolError("missing required 'Type'", { instance: message });
        if (!message.hasOwnProperty("SysVersion"))
            throw $util.ProtocolError("missing required 'SysVersion'", { instance: message });
        if (!message.hasOwnProperty("Models"))
            throw $util.ProtocolError("missing required 'Models'", { instance: message });
        if (!message.hasOwnProperty("Channel"))
            throw $util.ProtocolError("missing required 'Channel'", { instance: message });
        if (!message.hasOwnProperty("sPlatform"))
            throw $util.ProtocolError("missing required 'sPlatform'", { instance: message });
        if (!message.hasOwnProperty("sVersions"))
            throw $util.ProtocolError("missing required 'sVersions'", { instance: message });
        if (!message.hasOwnProperty("Location"))
            throw $util.ProtocolError("missing required 'Location'", { instance: message });
        return message;
    };

    /**
     * Decodes a Ruq_Logon message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Ruq_Logon
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Ruq_Logon} Ruq_Logon
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ruq_Logon.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Ruq_Logon message.
     * @function verify
     * @memberof Ruq_Logon
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Ruq_Logon.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.Accounts))
            return "Accounts: string expected";
        if (!$util.isString(message.Password))
            return "Password: string expected";
        if (!$util.isInteger(message.Type))
            return "Type: integer expected";
        if (!$util.isString(message.SysVersion))
            return "SysVersion: string expected";
        if (!$util.isString(message.Models))
            return "Models: string expected";
        if (!$util.isString(message.Channel))
            return "Channel: string expected";
        if (!$util.isString(message.sPlatform))
            return "sPlatform: string expected";
        if (!$util.isString(message.sVersions))
            return "sVersions: string expected";
        if (!$util.isString(message.Location))
            return "Location: string expected";
        if (message.sToken != null && message.hasOwnProperty("sToken"))
            if (!$util.isString(message.sToken))
                return "sToken: string expected";
        if (message.nShopId != null && message.hasOwnProperty("nShopId"))
            if (!$util.isInteger(message.nShopId))
                return "nShopId: integer expected";
        if (message.sDeviceModel != null && message.hasOwnProperty("sDeviceModel"))
            if (!$util.isString(message.sDeviceModel))
                return "sDeviceModel: string expected";
        if (message.sGps != null && message.hasOwnProperty("sGps"))
            if (!$util.isString(message.sGps))
                return "sGps: string expected";
        return null;
    };

    /**
     * Creates a Ruq_Logon message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Ruq_Logon
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Ruq_Logon} Ruq_Logon
     */
    Ruq_Logon.fromObject = function fromObject(object) {
        if (object instanceof $root.Ruq_Logon)
            return object;
        var message = new $root.Ruq_Logon();
        if (object.Accounts != null)
            message.Accounts = String(object.Accounts);
        if (object.Password != null)
            message.Password = String(object.Password);
        if (object.Type != null)
            message.Type = object.Type | 0;
        if (object.SysVersion != null)
            message.SysVersion = String(object.SysVersion);
        if (object.Models != null)
            message.Models = String(object.Models);
        if (object.Channel != null)
            message.Channel = String(object.Channel);
        if (object.sPlatform != null)
            message.sPlatform = String(object.sPlatform);
        if (object.sVersions != null)
            message.sVersions = String(object.sVersions);
        if (object.Location != null)
            message.Location = String(object.Location);
        if (object.sToken != null)
            message.sToken = String(object.sToken);
        if (object.nShopId != null)
            message.nShopId = object.nShopId | 0;
        if (object.sDeviceModel != null)
            message.sDeviceModel = String(object.sDeviceModel);
        if (object.sGps != null)
            message.sGps = String(object.sGps);
        return message;
    };

    /**
     * Creates a plain object from a Ruq_Logon message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Ruq_Logon
     * @static
     * @param {Ruq_Logon} message Ruq_Logon
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Ruq_Logon.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Accounts = "";
            object.Password = "";
            object.Type = 1;
            object.SysVersion = "";
            object.Models = "";
            object.Channel = "";
            object.sPlatform = "";
            object.sVersions = "";
            object.Location = "";
            object.sToken = "";
            object.nShopId = 0;
            object.sDeviceModel = "";
            object.sGps = "";
        }
        if (message.Accounts != null && message.hasOwnProperty("Accounts"))
            object.Accounts = message.Accounts;
        if (message.Password != null && message.hasOwnProperty("Password"))
            object.Password = message.Password;
        if (message.Type != null && message.hasOwnProperty("Type"))
            object.Type = message.Type;
        if (message.SysVersion != null && message.hasOwnProperty("SysVersion"))
            object.SysVersion = message.SysVersion;
        if (message.Models != null && message.hasOwnProperty("Models"))
            object.Models = message.Models;
        if (message.Channel != null && message.hasOwnProperty("Channel"))
            object.Channel = message.Channel;
        if (message.sPlatform != null && message.hasOwnProperty("sPlatform"))
            object.sPlatform = message.sPlatform;
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            object.sVersions = message.sVersions;
        if (message.Location != null && message.hasOwnProperty("Location"))
            object.Location = message.Location;
        if (message.sToken != null && message.hasOwnProperty("sToken"))
            object.sToken = message.sToken;
        if (message.nShopId != null && message.hasOwnProperty("nShopId"))
            object.nShopId = message.nShopId;
        if (message.sDeviceModel != null && message.hasOwnProperty("sDeviceModel"))
            object.sDeviceModel = message.sDeviceModel;
        if (message.sGps != null && message.hasOwnProperty("sGps"))
            object.sGps = message.sGps;
        return object;
    };

    /**
     * Converts this Ruq_Logon to JSON.
     * @function toJSON
     * @memberof Ruq_Logon
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Ruq_Logon.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Ruq_Logon
     * @function getTypeUrl
     * @memberof Ruq_Logon
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Ruq_Logon.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Ruq_Logon";
    };

    return Ruq_Logon;
})();

$root.Rup_Logon = (function() {

    /**
     * Properties of a Rup_Logon.
     * @exports IRup_Logon
     * @interface IRup_Logon
     * @property {number} nUserID Rup_Logon nUserID
     * @property {number} nError Rup_Logon nError
     * @property {string|null} [sConfineTime] Rup_Logon sConfineTime
     * @property {string|null} [sToken] Rup_Logon sToken
     * @property {string|null} [sSkin] Rup_Logon sSkin
     * @property {string|null} [sUiType] Rup_Logon sUiType
     * @property {string|null} [sVersions] Rup_Logon sVersions
     * @property {number|null} [nLoginCount] Rup_Logon nLoginCount
     */

    /**
     * Constructs a new Rup_Logon.
     * @exports Rup_Logon
     * @classdesc Represents a Rup_Logon.
     * @implements IRup_Logon
     * @constructor
     * @param {IRup_Logon=} [properties] Properties to set
     */
    function Rup_Logon(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Rup_Logon nUserID.
     * @member {number} nUserID
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.nUserID = 0;

    /**
     * Rup_Logon nError.
     * @member {number} nError
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.nError = 0;

    /**
     * Rup_Logon sConfineTime.
     * @member {string} sConfineTime
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.sConfineTime = "";

    /**
     * Rup_Logon sToken.
     * @member {string} sToken
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.sToken = "";

    /**
     * Rup_Logon sSkin.
     * @member {string} sSkin
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.sSkin = "";

    /**
     * Rup_Logon sUiType.
     * @member {string} sUiType
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.sUiType = "";

    /**
     * Rup_Logon sVersions.
     * @member {string} sVersions
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.sVersions = "";

    /**
     * Rup_Logon nLoginCount.
     * @member {number} nLoginCount
     * @memberof Rup_Logon
     * @instance
     */
    Rup_Logon.prototype.nLoginCount = 0;

    /**
     * Creates a new Rup_Logon instance using the specified properties.
     * @function create
     * @memberof Rup_Logon
     * @static
     * @param {IRup_Logon=} [properties] Properties to set
     * @returns {Rup_Logon} Rup_Logon instance
     */
    Rup_Logon.create = function create(properties) {
        return new Rup_Logon(properties);
    };

    /**
     * Encodes the specified Rup_Logon message. Does not implicitly {@link Rup_Logon.verify|verify} messages.
     * @function encode
     * @memberof Rup_Logon
     * @static
     * @param {IRup_Logon} message Rup_Logon message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rup_Logon.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nError);
        if (message.sConfineTime != null && Object.hasOwnProperty.call(message, "sConfineTime"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sConfineTime);
        if (message.sToken != null && Object.hasOwnProperty.call(message, "sToken"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sToken);
        if (message.sSkin != null && Object.hasOwnProperty.call(message, "sSkin"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sSkin);
        if (message.sUiType != null && Object.hasOwnProperty.call(message, "sUiType"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.sUiType);
        if (message.sVersions != null && Object.hasOwnProperty.call(message, "sVersions"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.sVersions);
        if (message.nLoginCount != null && Object.hasOwnProperty.call(message, "nLoginCount"))
            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.nLoginCount);
        return writer;
    };

    /**
     * Encodes the specified Rup_Logon message, length delimited. Does not implicitly {@link Rup_Logon.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Rup_Logon
     * @static
     * @param {IRup_Logon} message Rup_Logon message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rup_Logon.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Rup_Logon message from the specified reader or buffer.
     * @function decode
     * @memberof Rup_Logon
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Rup_Logon} Rup_Logon
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rup_Logon.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Rup_Logon();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserID = reader.int32();
                    break;
                }
            case 2: {
                    message.nError = reader.int32();
                    break;
                }
            case 3: {
                    message.sConfineTime = reader.string();
                    break;
                }
            case 4: {
                    message.sToken = reader.string();
                    break;
                }
            case 5: {
                    message.sSkin = reader.string();
                    break;
                }
            case 6: {
                    message.sUiType = reader.string();
                    break;
                }
            case 7: {
                    message.sVersions = reader.string();
                    break;
                }
            case 8: {
                    message.nLoginCount = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserID"))
            throw $util.ProtocolError("missing required 'nUserID'", { instance: message });
        if (!message.hasOwnProperty("nError"))
            throw $util.ProtocolError("missing required 'nError'", { instance: message });
        return message;
    };

    /**
     * Decodes a Rup_Logon message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Rup_Logon
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Rup_Logon} Rup_Logon
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rup_Logon.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Rup_Logon message.
     * @function verify
     * @memberof Rup_Logon
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Rup_Logon.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        if (!$util.isInteger(message.nError))
            return "nError: integer expected";
        if (message.sConfineTime != null && message.hasOwnProperty("sConfineTime"))
            if (!$util.isString(message.sConfineTime))
                return "sConfineTime: string expected";
        if (message.sToken != null && message.hasOwnProperty("sToken"))
            if (!$util.isString(message.sToken))
                return "sToken: string expected";
        if (message.sSkin != null && message.hasOwnProperty("sSkin"))
            if (!$util.isString(message.sSkin))
                return "sSkin: string expected";
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            if (!$util.isString(message.sUiType))
                return "sUiType: string expected";
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            if (!$util.isString(message.sVersions))
                return "sVersions: string expected";
        if (message.nLoginCount != null && message.hasOwnProperty("nLoginCount"))
            if (!$util.isInteger(message.nLoginCount))
                return "nLoginCount: integer expected";
        return null;
    };

    /**
     * Creates a Rup_Logon message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Rup_Logon
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Rup_Logon} Rup_Logon
     */
    Rup_Logon.fromObject = function fromObject(object) {
        if (object instanceof $root.Rup_Logon)
            return object;
        var message = new $root.Rup_Logon();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        if (object.nError != null)
            message.nError = object.nError | 0;
        if (object.sConfineTime != null)
            message.sConfineTime = String(object.sConfineTime);
        if (object.sToken != null)
            message.sToken = String(object.sToken);
        if (object.sSkin != null)
            message.sSkin = String(object.sSkin);
        if (object.sUiType != null)
            message.sUiType = String(object.sUiType);
        if (object.sVersions != null)
            message.sVersions = String(object.sVersions);
        if (object.nLoginCount != null)
            message.nLoginCount = object.nLoginCount | 0;
        return message;
    };

    /**
     * Creates a plain object from a Rup_Logon message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Rup_Logon
     * @static
     * @param {Rup_Logon} message Rup_Logon
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Rup_Logon.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserID = 0;
            object.nError = 0;
            object.sConfineTime = "";
            object.sToken = "";
            object.sSkin = "";
            object.sUiType = "";
            object.sVersions = "";
            object.nLoginCount = 0;
        }
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        if (message.nError != null && message.hasOwnProperty("nError"))
            object.nError = message.nError;
        if (message.sConfineTime != null && message.hasOwnProperty("sConfineTime"))
            object.sConfineTime = message.sConfineTime;
        if (message.sToken != null && message.hasOwnProperty("sToken"))
            object.sToken = message.sToken;
        if (message.sSkin != null && message.hasOwnProperty("sSkin"))
            object.sSkin = message.sSkin;
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            object.sUiType = message.sUiType;
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            object.sVersions = message.sVersions;
        if (message.nLoginCount != null && message.hasOwnProperty("nLoginCount"))
            object.nLoginCount = message.nLoginCount;
        return object;
    };

    /**
     * Converts this Rup_Logon to JSON.
     * @function toJSON
     * @memberof Rup_Logon
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Rup_Logon.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Rup_Logon
     * @function getTypeUrl
     * @memberof Rup_Logon
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Rup_Logon.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Rup_Logon";
    };

    return Rup_Logon;
})();

$root.Ruq_Regist = (function() {

    /**
     * Properties of a Ruq_Regist.
     * @exports IRuq_Regist
     * @interface IRuq_Regist
     * @property {string} Accounts Ruq_Regist Accounts
     * @property {string} Password Ruq_Regist Password
     * @property {string} NickName Ruq_Regist NickName
     * @property {number} Sex Ruq_Regist Sex
     * @property {string} SysVersion Ruq_Regist SysVersion
     * @property {string} Models Ruq_Regist Models
     * @property {string} Channel Ruq_Regist Channel
     * @property {string} IP Ruq_Regist IP
     * @property {string} PhoneType Ruq_Regist PhoneType
     * @property {string} sPlatform Ruq_Regist sPlatform
     * @property {string} sVersions Ruq_Regist sVersions
     * @property {string} Location Ruq_Regist Location
     * @property {number|null} [nShopId] Ruq_Regist nShopId
     * @property {string|null} [sFaceID] Ruq_Regist sFaceID
     * @property {number|null} [nRegistWay] Ruq_Regist nRegistWay
     * @property {string|null} [sVeriCode] Ruq_Regist sVeriCode
     */

    /**
     * Constructs a new Ruq_Regist.
     * @exports Ruq_Regist
     * @classdesc Represents a Ruq_Regist.
     * @implements IRuq_Regist
     * @constructor
     * @param {IRuq_Regist=} [properties] Properties to set
     */
    function Ruq_Regist(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Ruq_Regist Accounts.
     * @member {string} Accounts
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Accounts = "";

    /**
     * Ruq_Regist Password.
     * @member {string} Password
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Password = "";

    /**
     * Ruq_Regist NickName.
     * @member {string} NickName
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.NickName = "";

    /**
     * Ruq_Regist Sex.
     * @member {number} Sex
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Sex = 0;

    /**
     * Ruq_Regist SysVersion.
     * @member {string} SysVersion
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.SysVersion = "";

    /**
     * Ruq_Regist Models.
     * @member {string} Models
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Models = "";

    /**
     * Ruq_Regist Channel.
     * @member {string} Channel
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Channel = "";

    /**
     * Ruq_Regist IP.
     * @member {string} IP
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.IP = "";

    /**
     * Ruq_Regist PhoneType.
     * @member {string} PhoneType
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.PhoneType = "";

    /**
     * Ruq_Regist sPlatform.
     * @member {string} sPlatform
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.sPlatform = "";

    /**
     * Ruq_Regist sVersions.
     * @member {string} sVersions
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.sVersions = "";

    /**
     * Ruq_Regist Location.
     * @member {string} Location
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.Location = "";

    /**
     * Ruq_Regist nShopId.
     * @member {number} nShopId
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.nShopId = 0;

    /**
     * Ruq_Regist sFaceID.
     * @member {string} sFaceID
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.sFaceID = "1";

    /**
     * Ruq_Regist nRegistWay.
     * @member {number} nRegistWay
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.nRegistWay = 1;

    /**
     * Ruq_Regist sVeriCode.
     * @member {string} sVeriCode
     * @memberof Ruq_Regist
     * @instance
     */
    Ruq_Regist.prototype.sVeriCode = "";

    /**
     * Creates a new Ruq_Regist instance using the specified properties.
     * @function create
     * @memberof Ruq_Regist
     * @static
     * @param {IRuq_Regist=} [properties] Properties to set
     * @returns {Ruq_Regist} Ruq_Regist instance
     */
    Ruq_Regist.create = function create(properties) {
        return new Ruq_Regist(properties);
    };

    /**
     * Encodes the specified Ruq_Regist message. Does not implicitly {@link Ruq_Regist.verify|verify} messages.
     * @function encode
     * @memberof Ruq_Regist
     * @static
     * @param {IRuq_Regist} message Ruq_Regist message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ruq_Regist.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.Accounts);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.Password);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.NickName);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.Sex);
        writer.uint32(/* id 5, wireType 2 =*/42).string(message.SysVersion);
        writer.uint32(/* id 6, wireType 2 =*/50).string(message.Models);
        writer.uint32(/* id 7, wireType 2 =*/58).string(message.Channel);
        writer.uint32(/* id 8, wireType 2 =*/66).string(message.IP);
        writer.uint32(/* id 9, wireType 2 =*/74).string(message.PhoneType);
        writer.uint32(/* id 10, wireType 2 =*/82).string(message.sPlatform);
        writer.uint32(/* id 11, wireType 2 =*/90).string(message.sVersions);
        writer.uint32(/* id 12, wireType 2 =*/98).string(message.Location);
        if (message.nShopId != null && Object.hasOwnProperty.call(message, "nShopId"))
            writer.uint32(/* id 13, wireType 0 =*/104).int32(message.nShopId);
        if (message.sFaceID != null && Object.hasOwnProperty.call(message, "sFaceID"))
            writer.uint32(/* id 14, wireType 2 =*/114).string(message.sFaceID);
        if (message.nRegistWay != null && Object.hasOwnProperty.call(message, "nRegistWay"))
            writer.uint32(/* id 15, wireType 0 =*/120).int32(message.nRegistWay);
        if (message.sVeriCode != null && Object.hasOwnProperty.call(message, "sVeriCode"))
            writer.uint32(/* id 16, wireType 2 =*/130).string(message.sVeriCode);
        return writer;
    };

    /**
     * Encodes the specified Ruq_Regist message, length delimited. Does not implicitly {@link Ruq_Regist.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Ruq_Regist
     * @static
     * @param {IRuq_Regist} message Ruq_Regist message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Ruq_Regist.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Ruq_Regist message from the specified reader or buffer.
     * @function decode
     * @memberof Ruq_Regist
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Ruq_Regist} Ruq_Regist
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ruq_Regist.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Ruq_Regist();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.Accounts = reader.string();
                    break;
                }
            case 2: {
                    message.Password = reader.string();
                    break;
                }
            case 3: {
                    message.NickName = reader.string();
                    break;
                }
            case 4: {
                    message.Sex = reader.int32();
                    break;
                }
            case 5: {
                    message.SysVersion = reader.string();
                    break;
                }
            case 6: {
                    message.Models = reader.string();
                    break;
                }
            case 7: {
                    message.Channel = reader.string();
                    break;
                }
            case 8: {
                    message.IP = reader.string();
                    break;
                }
            case 9: {
                    message.PhoneType = reader.string();
                    break;
                }
            case 10: {
                    message.sPlatform = reader.string();
                    break;
                }
            case 11: {
                    message.sVersions = reader.string();
                    break;
                }
            case 12: {
                    message.Location = reader.string();
                    break;
                }
            case 13: {
                    message.nShopId = reader.int32();
                    break;
                }
            case 14: {
                    message.sFaceID = reader.string();
                    break;
                }
            case 15: {
                    message.nRegistWay = reader.int32();
                    break;
                }
            case 16: {
                    message.sVeriCode = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Accounts"))
            throw $util.ProtocolError("missing required 'Accounts'", { instance: message });
        if (!message.hasOwnProperty("Password"))
            throw $util.ProtocolError("missing required 'Password'", { instance: message });
        if (!message.hasOwnProperty("NickName"))
            throw $util.ProtocolError("missing required 'NickName'", { instance: message });
        if (!message.hasOwnProperty("Sex"))
            throw $util.ProtocolError("missing required 'Sex'", { instance: message });
        if (!message.hasOwnProperty("SysVersion"))
            throw $util.ProtocolError("missing required 'SysVersion'", { instance: message });
        if (!message.hasOwnProperty("Models"))
            throw $util.ProtocolError("missing required 'Models'", { instance: message });
        if (!message.hasOwnProperty("Channel"))
            throw $util.ProtocolError("missing required 'Channel'", { instance: message });
        if (!message.hasOwnProperty("IP"))
            throw $util.ProtocolError("missing required 'IP'", { instance: message });
        if (!message.hasOwnProperty("PhoneType"))
            throw $util.ProtocolError("missing required 'PhoneType'", { instance: message });
        if (!message.hasOwnProperty("sPlatform"))
            throw $util.ProtocolError("missing required 'sPlatform'", { instance: message });
        if (!message.hasOwnProperty("sVersions"))
            throw $util.ProtocolError("missing required 'sVersions'", { instance: message });
        if (!message.hasOwnProperty("Location"))
            throw $util.ProtocolError("missing required 'Location'", { instance: message });
        return message;
    };

    /**
     * Decodes a Ruq_Regist message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Ruq_Regist
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Ruq_Regist} Ruq_Regist
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Ruq_Regist.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Ruq_Regist message.
     * @function verify
     * @memberof Ruq_Regist
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Ruq_Regist.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.Accounts))
            return "Accounts: string expected";
        if (!$util.isString(message.Password))
            return "Password: string expected";
        if (!$util.isString(message.NickName))
            return "NickName: string expected";
        if (!$util.isInteger(message.Sex))
            return "Sex: integer expected";
        if (!$util.isString(message.SysVersion))
            return "SysVersion: string expected";
        if (!$util.isString(message.Models))
            return "Models: string expected";
        if (!$util.isString(message.Channel))
            return "Channel: string expected";
        if (!$util.isString(message.IP))
            return "IP: string expected";
        if (!$util.isString(message.PhoneType))
            return "PhoneType: string expected";
        if (!$util.isString(message.sPlatform))
            return "sPlatform: string expected";
        if (!$util.isString(message.sVersions))
            return "sVersions: string expected";
        if (!$util.isString(message.Location))
            return "Location: string expected";
        if (message.nShopId != null && message.hasOwnProperty("nShopId"))
            if (!$util.isInteger(message.nShopId))
                return "nShopId: integer expected";
        if (message.sFaceID != null && message.hasOwnProperty("sFaceID"))
            if (!$util.isString(message.sFaceID))
                return "sFaceID: string expected";
        if (message.nRegistWay != null && message.hasOwnProperty("nRegistWay"))
            if (!$util.isInteger(message.nRegistWay))
                return "nRegistWay: integer expected";
        if (message.sVeriCode != null && message.hasOwnProperty("sVeriCode"))
            if (!$util.isString(message.sVeriCode))
                return "sVeriCode: string expected";
        return null;
    };

    /**
     * Creates a Ruq_Regist message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Ruq_Regist
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Ruq_Regist} Ruq_Regist
     */
    Ruq_Regist.fromObject = function fromObject(object) {
        if (object instanceof $root.Ruq_Regist)
            return object;
        var message = new $root.Ruq_Regist();
        if (object.Accounts != null)
            message.Accounts = String(object.Accounts);
        if (object.Password != null)
            message.Password = String(object.Password);
        if (object.NickName != null)
            message.NickName = String(object.NickName);
        if (object.Sex != null)
            message.Sex = object.Sex | 0;
        if (object.SysVersion != null)
            message.SysVersion = String(object.SysVersion);
        if (object.Models != null)
            message.Models = String(object.Models);
        if (object.Channel != null)
            message.Channel = String(object.Channel);
        if (object.IP != null)
            message.IP = String(object.IP);
        if (object.PhoneType != null)
            message.PhoneType = String(object.PhoneType);
        if (object.sPlatform != null)
            message.sPlatform = String(object.sPlatform);
        if (object.sVersions != null)
            message.sVersions = String(object.sVersions);
        if (object.Location != null)
            message.Location = String(object.Location);
        if (object.nShopId != null)
            message.nShopId = object.nShopId | 0;
        if (object.sFaceID != null)
            message.sFaceID = String(object.sFaceID);
        if (object.nRegistWay != null)
            message.nRegistWay = object.nRegistWay | 0;
        if (object.sVeriCode != null)
            message.sVeriCode = String(object.sVeriCode);
        return message;
    };

    /**
     * Creates a plain object from a Ruq_Regist message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Ruq_Regist
     * @static
     * @param {Ruq_Regist} message Ruq_Regist
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Ruq_Regist.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Accounts = "";
            object.Password = "";
            object.NickName = "";
            object.Sex = 0;
            object.SysVersion = "";
            object.Models = "";
            object.Channel = "";
            object.IP = "";
            object.PhoneType = "";
            object.sPlatform = "";
            object.sVersions = "";
            object.Location = "";
            object.nShopId = 0;
            object.sFaceID = "1";
            object.nRegistWay = 1;
            object.sVeriCode = "";
        }
        if (message.Accounts != null && message.hasOwnProperty("Accounts"))
            object.Accounts = message.Accounts;
        if (message.Password != null && message.hasOwnProperty("Password"))
            object.Password = message.Password;
        if (message.NickName != null && message.hasOwnProperty("NickName"))
            object.NickName = message.NickName;
        if (message.Sex != null && message.hasOwnProperty("Sex"))
            object.Sex = message.Sex;
        if (message.SysVersion != null && message.hasOwnProperty("SysVersion"))
            object.SysVersion = message.SysVersion;
        if (message.Models != null && message.hasOwnProperty("Models"))
            object.Models = message.Models;
        if (message.Channel != null && message.hasOwnProperty("Channel"))
            object.Channel = message.Channel;
        if (message.IP != null && message.hasOwnProperty("IP"))
            object.IP = message.IP;
        if (message.PhoneType != null && message.hasOwnProperty("PhoneType"))
            object.PhoneType = message.PhoneType;
        if (message.sPlatform != null && message.hasOwnProperty("sPlatform"))
            object.sPlatform = message.sPlatform;
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            object.sVersions = message.sVersions;
        if (message.Location != null && message.hasOwnProperty("Location"))
            object.Location = message.Location;
        if (message.nShopId != null && message.hasOwnProperty("nShopId"))
            object.nShopId = message.nShopId;
        if (message.sFaceID != null && message.hasOwnProperty("sFaceID"))
            object.sFaceID = message.sFaceID;
        if (message.nRegistWay != null && message.hasOwnProperty("nRegistWay"))
            object.nRegistWay = message.nRegistWay;
        if (message.sVeriCode != null && message.hasOwnProperty("sVeriCode"))
            object.sVeriCode = message.sVeriCode;
        return object;
    };

    /**
     * Converts this Ruq_Regist to JSON.
     * @function toJSON
     * @memberof Ruq_Regist
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Ruq_Regist.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Ruq_Regist
     * @function getTypeUrl
     * @memberof Ruq_Regist
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Ruq_Regist.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Ruq_Regist";
    };

    return Ruq_Regist;
})();

$root.Rup_Regist = (function() {

    /**
     * Properties of a Rup_Regist.
     * @exports IRup_Regist
     * @interface IRup_Regist
     * @property {number} nUserID Rup_Regist nUserID
     * @property {number} nError Rup_Regist nError
     * @property {string|null} [sSkin] Rup_Regist sSkin
     * @property {string|null} [sUiType] Rup_Regist sUiType
     * @property {string|null} [sVersions] Rup_Regist sVersions
     */

    /**
     * Constructs a new Rup_Regist.
     * @exports Rup_Regist
     * @classdesc Represents a Rup_Regist.
     * @implements IRup_Regist
     * @constructor
     * @param {IRup_Regist=} [properties] Properties to set
     */
    function Rup_Regist(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Rup_Regist nUserID.
     * @member {number} nUserID
     * @memberof Rup_Regist
     * @instance
     */
    Rup_Regist.prototype.nUserID = 0;

    /**
     * Rup_Regist nError.
     * @member {number} nError
     * @memberof Rup_Regist
     * @instance
     */
    Rup_Regist.prototype.nError = 0;

    /**
     * Rup_Regist sSkin.
     * @member {string} sSkin
     * @memberof Rup_Regist
     * @instance
     */
    Rup_Regist.prototype.sSkin = "";

    /**
     * Rup_Regist sUiType.
     * @member {string} sUiType
     * @memberof Rup_Regist
     * @instance
     */
    Rup_Regist.prototype.sUiType = "";

    /**
     * Rup_Regist sVersions.
     * @member {string} sVersions
     * @memberof Rup_Regist
     * @instance
     */
    Rup_Regist.prototype.sVersions = "";

    /**
     * Creates a new Rup_Regist instance using the specified properties.
     * @function create
     * @memberof Rup_Regist
     * @static
     * @param {IRup_Regist=} [properties] Properties to set
     * @returns {Rup_Regist} Rup_Regist instance
     */
    Rup_Regist.create = function create(properties) {
        return new Rup_Regist(properties);
    };

    /**
     * Encodes the specified Rup_Regist message. Does not implicitly {@link Rup_Regist.verify|verify} messages.
     * @function encode
     * @memberof Rup_Regist
     * @static
     * @param {IRup_Regist} message Rup_Regist message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rup_Regist.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nError);
        if (message.sSkin != null && Object.hasOwnProperty.call(message, "sSkin"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sSkin);
        if (message.sUiType != null && Object.hasOwnProperty.call(message, "sUiType"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sUiType);
        if (message.sVersions != null && Object.hasOwnProperty.call(message, "sVersions"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sVersions);
        return writer;
    };

    /**
     * Encodes the specified Rup_Regist message, length delimited. Does not implicitly {@link Rup_Regist.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Rup_Regist
     * @static
     * @param {IRup_Regist} message Rup_Regist message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rup_Regist.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Rup_Regist message from the specified reader or buffer.
     * @function decode
     * @memberof Rup_Regist
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Rup_Regist} Rup_Regist
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rup_Regist.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Rup_Regist();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nUserID = reader.int32();
                    break;
                }
            case 2: {
                    message.nError = reader.int32();
                    break;
                }
            case 3: {
                    message.sSkin = reader.string();
                    break;
                }
            case 4: {
                    message.sUiType = reader.string();
                    break;
                }
            case 5: {
                    message.sVersions = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserID"))
            throw $util.ProtocolError("missing required 'nUserID'", { instance: message });
        if (!message.hasOwnProperty("nError"))
            throw $util.ProtocolError("missing required 'nError'", { instance: message });
        return message;
    };

    /**
     * Decodes a Rup_Regist message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Rup_Regist
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Rup_Regist} Rup_Regist
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rup_Regist.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Rup_Regist message.
     * @function verify
     * @memberof Rup_Regist
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Rup_Regist.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        if (!$util.isInteger(message.nError))
            return "nError: integer expected";
        if (message.sSkin != null && message.hasOwnProperty("sSkin"))
            if (!$util.isString(message.sSkin))
                return "sSkin: string expected";
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            if (!$util.isString(message.sUiType))
                return "sUiType: string expected";
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            if (!$util.isString(message.sVersions))
                return "sVersions: string expected";
        return null;
    };

    /**
     * Creates a Rup_Regist message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Rup_Regist
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Rup_Regist} Rup_Regist
     */
    Rup_Regist.fromObject = function fromObject(object) {
        if (object instanceof $root.Rup_Regist)
            return object;
        var message = new $root.Rup_Regist();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        if (object.nError != null)
            message.nError = object.nError | 0;
        if (object.sSkin != null)
            message.sSkin = String(object.sSkin);
        if (object.sUiType != null)
            message.sUiType = String(object.sUiType);
        if (object.sVersions != null)
            message.sVersions = String(object.sVersions);
        return message;
    };

    /**
     * Creates a plain object from a Rup_Regist message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Rup_Regist
     * @static
     * @param {Rup_Regist} message Rup_Regist
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Rup_Regist.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserID = 0;
            object.nError = 0;
            object.sSkin = "";
            object.sUiType = "";
            object.sVersions = "";
        }
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        if (message.nError != null && message.hasOwnProperty("nError"))
            object.nError = message.nError;
        if (message.sSkin != null && message.hasOwnProperty("sSkin"))
            object.sSkin = message.sSkin;
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            object.sUiType = message.sUiType;
        if (message.sVersions != null && message.hasOwnProperty("sVersions"))
            object.sVersions = message.sVersions;
        return object;
    };

    /**
     * Converts this Rup_Regist to JSON.
     * @function toJSON
     * @memberof Rup_Regist
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Rup_Regist.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Rup_Regist
     * @function getTypeUrl
     * @memberof Rup_Regist
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Rup_Regist.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Rup_Regist";
    };

    return Rup_Regist;
})();

$root.RUP_Reconnect = (function() {

    /**
     * Properties of a RUP_Reconnect.
     * @exports IRUP_Reconnect
     * @interface IRUP_Reconnect
     * @property {string} sIp RUP_Reconnect sIp
     * @property {number} nPort RUP_Reconnect nPort
     */

    /**
     * Constructs a new RUP_Reconnect.
     * @exports RUP_Reconnect
     * @classdesc Represents a RUP_Reconnect.
     * @implements IRUP_Reconnect
     * @constructor
     * @param {IRUP_Reconnect=} [properties] Properties to set
     */
    function RUP_Reconnect(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RUP_Reconnect sIp.
     * @member {string} sIp
     * @memberof RUP_Reconnect
     * @instance
     */
    RUP_Reconnect.prototype.sIp = "";

    /**
     * RUP_Reconnect nPort.
     * @member {number} nPort
     * @memberof RUP_Reconnect
     * @instance
     */
    RUP_Reconnect.prototype.nPort = 0;

    /**
     * Creates a new RUP_Reconnect instance using the specified properties.
     * @function create
     * @memberof RUP_Reconnect
     * @static
     * @param {IRUP_Reconnect=} [properties] Properties to set
     * @returns {RUP_Reconnect} RUP_Reconnect instance
     */
    RUP_Reconnect.create = function create(properties) {
        return new RUP_Reconnect(properties);
    };

    /**
     * Encodes the specified RUP_Reconnect message. Does not implicitly {@link RUP_Reconnect.verify|verify} messages.
     * @function encode
     * @memberof RUP_Reconnect
     * @static
     * @param {IRUP_Reconnect} message RUP_Reconnect message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_Reconnect.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sIp);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nPort);
        return writer;
    };

    /**
     * Encodes the specified RUP_Reconnect message, length delimited. Does not implicitly {@link RUP_Reconnect.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RUP_Reconnect
     * @static
     * @param {IRUP_Reconnect} message RUP_Reconnect message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RUP_Reconnect.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RUP_Reconnect message from the specified reader or buffer.
     * @function decode
     * @memberof RUP_Reconnect
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RUP_Reconnect} RUP_Reconnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_Reconnect.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RUP_Reconnect();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sIp = reader.string();
                    break;
                }
            case 2: {
                    message.nPort = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sIp"))
            throw $util.ProtocolError("missing required 'sIp'", { instance: message });
        if (!message.hasOwnProperty("nPort"))
            throw $util.ProtocolError("missing required 'nPort'", { instance: message });
        return message;
    };

    /**
     * Decodes a RUP_Reconnect message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RUP_Reconnect
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RUP_Reconnect} RUP_Reconnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RUP_Reconnect.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RUP_Reconnect message.
     * @function verify
     * @memberof RUP_Reconnect
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RUP_Reconnect.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sIp))
            return "sIp: string expected";
        if (!$util.isInteger(message.nPort))
            return "nPort: integer expected";
        return null;
    };

    /**
     * Creates a RUP_Reconnect message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RUP_Reconnect
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RUP_Reconnect} RUP_Reconnect
     */
    RUP_Reconnect.fromObject = function fromObject(object) {
        if (object instanceof $root.RUP_Reconnect)
            return object;
        var message = new $root.RUP_Reconnect();
        if (object.sIp != null)
            message.sIp = String(object.sIp);
        if (object.nPort != null)
            message.nPort = object.nPort | 0;
        return message;
    };

    /**
     * Creates a plain object from a RUP_Reconnect message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RUP_Reconnect
     * @static
     * @param {RUP_Reconnect} message RUP_Reconnect
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RUP_Reconnect.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sIp = "";
            object.nPort = 0;
        }
        if (message.sIp != null && message.hasOwnProperty("sIp"))
            object.sIp = message.sIp;
        if (message.nPort != null && message.hasOwnProperty("nPort"))
            object.nPort = message.nPort;
        return object;
    };

    /**
     * Converts this RUP_Reconnect to JSON.
     * @function toJSON
     * @memberof RUP_Reconnect
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RUP_Reconnect.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RUP_Reconnect
     * @function getTypeUrl
     * @memberof RUP_Reconnect
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RUP_Reconnect.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/RUP_Reconnect";
    };

    return RUP_Reconnect;
})();

$root.CurrentGameQuerryReq = (function() {

    /**
     * Properties of a CurrentGameQuerryReq.
     * @exports ICurrentGameQuerryReq
     * @interface ICurrentGameQuerryReq
     * @property {number} nUserId CurrentGameQuerryReq nUserId
     */

    /**
     * Constructs a new CurrentGameQuerryReq.
     * @exports CurrentGameQuerryReq
     * @classdesc Represents a CurrentGameQuerryReq.
     * @implements ICurrentGameQuerryReq
     * @constructor
     * @param {ICurrentGameQuerryReq=} [properties] Properties to set
     */
    function CurrentGameQuerryReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CurrentGameQuerryReq nUserId.
     * @member {number} nUserId
     * @memberof CurrentGameQuerryReq
     * @instance
     */
    CurrentGameQuerryReq.prototype.nUserId = 0;

    /**
     * Creates a new CurrentGameQuerryReq instance using the specified properties.
     * @function create
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {ICurrentGameQuerryReq=} [properties] Properties to set
     * @returns {CurrentGameQuerryReq} CurrentGameQuerryReq instance
     */
    CurrentGameQuerryReq.create = function create(properties) {
        return new CurrentGameQuerryReq(properties);
    };

    /**
     * Encodes the specified CurrentGameQuerryReq message. Does not implicitly {@link CurrentGameQuerryReq.verify|verify} messages.
     * @function encode
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {ICurrentGameQuerryReq} message CurrentGameQuerryReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CurrentGameQuerryReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified CurrentGameQuerryReq message, length delimited. Does not implicitly {@link CurrentGameQuerryReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {ICurrentGameQuerryReq} message CurrentGameQuerryReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CurrentGameQuerryReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CurrentGameQuerryReq message from the specified reader or buffer.
     * @function decode
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CurrentGameQuerryReq} CurrentGameQuerryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CurrentGameQuerryReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CurrentGameQuerryReq();
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
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        return message;
    };

    /**
     * Decodes a CurrentGameQuerryReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CurrentGameQuerryReq} CurrentGameQuerryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CurrentGameQuerryReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CurrentGameQuerryReq message.
     * @function verify
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CurrentGameQuerryReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates a CurrentGameQuerryReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CurrentGameQuerryReq} CurrentGameQuerryReq
     */
    CurrentGameQuerryReq.fromObject = function fromObject(object) {
        if (object instanceof $root.CurrentGameQuerryReq)
            return object;
        var message = new $root.CurrentGameQuerryReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from a CurrentGameQuerryReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {CurrentGameQuerryReq} message CurrentGameQuerryReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CurrentGameQuerryReq.toObject = function toObject(message, options) {
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
     * Converts this CurrentGameQuerryReq to JSON.
     * @function toJSON
     * @memberof CurrentGameQuerryReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CurrentGameQuerryReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CurrentGameQuerryReq
     * @function getTypeUrl
     * @memberof CurrentGameQuerryReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CurrentGameQuerryReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CurrentGameQuerryReq";
    };

    return CurrentGameQuerryReq;
})();

$root.CurrentGameQuerryRsp = (function() {

    /**
     * Properties of a CurrentGameQuerryRsp.
     * @exports ICurrentGameQuerryRsp
     * @interface ICurrentGameQuerryRsp
     * @property {number} nGameId CurrentGameQuerryRsp nGameId
     * @property {string|null} [sTableId] CurrentGameQuerryRsp sTableId
     */

    /**
     * Constructs a new CurrentGameQuerryRsp.
     * @exports CurrentGameQuerryRsp
     * @classdesc Represents a CurrentGameQuerryRsp.
     * @implements ICurrentGameQuerryRsp
     * @constructor
     * @param {ICurrentGameQuerryRsp=} [properties] Properties to set
     */
    function CurrentGameQuerryRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CurrentGameQuerryRsp nGameId.
     * @member {number} nGameId
     * @memberof CurrentGameQuerryRsp
     * @instance
     */
    CurrentGameQuerryRsp.prototype.nGameId = 0;

    /**
     * CurrentGameQuerryRsp sTableId.
     * @member {string} sTableId
     * @memberof CurrentGameQuerryRsp
     * @instance
     */
    CurrentGameQuerryRsp.prototype.sTableId = "";

    /**
     * Creates a new CurrentGameQuerryRsp instance using the specified properties.
     * @function create
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {ICurrentGameQuerryRsp=} [properties] Properties to set
     * @returns {CurrentGameQuerryRsp} CurrentGameQuerryRsp instance
     */
    CurrentGameQuerryRsp.create = function create(properties) {
        return new CurrentGameQuerryRsp(properties);
    };

    /**
     * Encodes the specified CurrentGameQuerryRsp message. Does not implicitly {@link CurrentGameQuerryRsp.verify|verify} messages.
     * @function encode
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {ICurrentGameQuerryRsp} message CurrentGameQuerryRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CurrentGameQuerryRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTableId);
        return writer;
    };

    /**
     * Encodes the specified CurrentGameQuerryRsp message, length delimited. Does not implicitly {@link CurrentGameQuerryRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {ICurrentGameQuerryRsp} message CurrentGameQuerryRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CurrentGameQuerryRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CurrentGameQuerryRsp message from the specified reader or buffer.
     * @function decode
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CurrentGameQuerryRsp} CurrentGameQuerryRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CurrentGameQuerryRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CurrentGameQuerryRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nGameId = reader.int32();
                    break;
                }
            case 2: {
                    message.sTableId = reader.string();
                    break;
                }
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
     * Decodes a CurrentGameQuerryRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CurrentGameQuerryRsp} CurrentGameQuerryRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CurrentGameQuerryRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CurrentGameQuerryRsp message.
     * @function verify
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CurrentGameQuerryRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        return null;
    };

    /**
     * Creates a CurrentGameQuerryRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CurrentGameQuerryRsp} CurrentGameQuerryRsp
     */
    CurrentGameQuerryRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.CurrentGameQuerryRsp)
            return object;
        var message = new $root.CurrentGameQuerryRsp();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        return message;
    };

    /**
     * Creates a plain object from a CurrentGameQuerryRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {CurrentGameQuerryRsp} message CurrentGameQuerryRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CurrentGameQuerryRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nGameId = 0;
            object.sTableId = "";
        }
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        return object;
    };

    /**
     * Converts this CurrentGameQuerryRsp to JSON.
     * @function toJSON
     * @memberof CurrentGameQuerryRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CurrentGameQuerryRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CurrentGameQuerryRsp
     * @function getTypeUrl
     * @memberof CurrentGameQuerryRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CurrentGameQuerryRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CurrentGameQuerryRsp";
    };

    return CurrentGameQuerryRsp;
})();

$root.VeriCodeReq = (function() {

    /**
     * Properties of a VeriCodeReq.
     * @exports IVeriCodeReq
     * @interface IVeriCodeReq
     * @property {number} nWay VeriCodeReq nWay
     * @property {string} sWayAddr VeriCodeReq sWayAddr
     * @property {number|null} [nPurpose] VeriCodeReq nPurpose
     * @property {string|null} [sAcc] VeriCodeReq sAcc
     */

    /**
     * Constructs a new VeriCodeReq.
     * @exports VeriCodeReq
     * @classdesc Represents a VeriCodeReq.
     * @implements IVeriCodeReq
     * @constructor
     * @param {IVeriCodeReq=} [properties] Properties to set
     */
    function VeriCodeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * VeriCodeReq nWay.
     * @member {number} nWay
     * @memberof VeriCodeReq
     * @instance
     */
    VeriCodeReq.prototype.nWay = 0;

    /**
     * VeriCodeReq sWayAddr.
     * @member {string} sWayAddr
     * @memberof VeriCodeReq
     * @instance
     */
    VeriCodeReq.prototype.sWayAddr = "";

    /**
     * VeriCodeReq nPurpose.
     * @member {number} nPurpose
     * @memberof VeriCodeReq
     * @instance
     */
    VeriCodeReq.prototype.nPurpose = 0;

    /**
     * VeriCodeReq sAcc.
     * @member {string} sAcc
     * @memberof VeriCodeReq
     * @instance
     */
    VeriCodeReq.prototype.sAcc = "";

    /**
     * Creates a new VeriCodeReq instance using the specified properties.
     * @function create
     * @memberof VeriCodeReq
     * @static
     * @param {IVeriCodeReq=} [properties] Properties to set
     * @returns {VeriCodeReq} VeriCodeReq instance
     */
    VeriCodeReq.create = function create(properties) {
        return new VeriCodeReq(properties);
    };

    /**
     * Encodes the specified VeriCodeReq message. Does not implicitly {@link VeriCodeReq.verify|verify} messages.
     * @function encode
     * @memberof VeriCodeReq
     * @static
     * @param {IVeriCodeReq} message VeriCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VeriCodeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nWay);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sWayAddr);
        if (message.nPurpose != null && Object.hasOwnProperty.call(message, "nPurpose"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nPurpose);
        if (message.sAcc != null && Object.hasOwnProperty.call(message, "sAcc"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sAcc);
        return writer;
    };

    /**
     * Encodes the specified VeriCodeReq message, length delimited. Does not implicitly {@link VeriCodeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof VeriCodeReq
     * @static
     * @param {IVeriCodeReq} message VeriCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VeriCodeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a VeriCodeReq message from the specified reader or buffer.
     * @function decode
     * @memberof VeriCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {VeriCodeReq} VeriCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VeriCodeReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VeriCodeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nWay = reader.int32();
                    break;
                }
            case 2: {
                    message.sWayAddr = reader.string();
                    break;
                }
            case 3: {
                    message.nPurpose = reader.int32();
                    break;
                }
            case 4: {
                    message.sAcc = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nWay"))
            throw $util.ProtocolError("missing required 'nWay'", { instance: message });
        if (!message.hasOwnProperty("sWayAddr"))
            throw $util.ProtocolError("missing required 'sWayAddr'", { instance: message });
        return message;
    };

    /**
     * Decodes a VeriCodeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof VeriCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {VeriCodeReq} VeriCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VeriCodeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a VeriCodeReq message.
     * @function verify
     * @memberof VeriCodeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    VeriCodeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nWay))
            return "nWay: integer expected";
        if (!$util.isString(message.sWayAddr))
            return "sWayAddr: string expected";
        if (message.nPurpose != null && message.hasOwnProperty("nPurpose"))
            if (!$util.isInteger(message.nPurpose))
                return "nPurpose: integer expected";
        if (message.sAcc != null && message.hasOwnProperty("sAcc"))
            if (!$util.isString(message.sAcc))
                return "sAcc: string expected";
        return null;
    };

    /**
     * Creates a VeriCodeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof VeriCodeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {VeriCodeReq} VeriCodeReq
     */
    VeriCodeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.VeriCodeReq)
            return object;
        var message = new $root.VeriCodeReq();
        if (object.nWay != null)
            message.nWay = object.nWay | 0;
        if (object.sWayAddr != null)
            message.sWayAddr = String(object.sWayAddr);
        if (object.nPurpose != null)
            message.nPurpose = object.nPurpose | 0;
        if (object.sAcc != null)
            message.sAcc = String(object.sAcc);
        return message;
    };

    /**
     * Creates a plain object from a VeriCodeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof VeriCodeReq
     * @static
     * @param {VeriCodeReq} message VeriCodeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    VeriCodeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nWay = 0;
            object.sWayAddr = "";
            object.nPurpose = 0;
            object.sAcc = "";
        }
        if (message.nWay != null && message.hasOwnProperty("nWay"))
            object.nWay = message.nWay;
        if (message.sWayAddr != null && message.hasOwnProperty("sWayAddr"))
            object.sWayAddr = message.sWayAddr;
        if (message.nPurpose != null && message.hasOwnProperty("nPurpose"))
            object.nPurpose = message.nPurpose;
        if (message.sAcc != null && message.hasOwnProperty("sAcc"))
            object.sAcc = message.sAcc;
        return object;
    };

    /**
     * Converts this VeriCodeReq to JSON.
     * @function toJSON
     * @memberof VeriCodeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    VeriCodeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for VeriCodeReq
     * @function getTypeUrl
     * @memberof VeriCodeReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    VeriCodeReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/VeriCodeReq";
    };

    return VeriCodeReq;
})();

$root.VeriCodeRsp = (function() {

    /**
     * Properties of a VeriCodeRsp.
     * @exports IVeriCodeRsp
     * @interface IVeriCodeRsp
     * @property {number} nRlt VeriCodeRsp nRlt
     * @property {number|null} [nWay] VeriCodeRsp nWay
     */

    /**
     * Constructs a new VeriCodeRsp.
     * @exports VeriCodeRsp
     * @classdesc Represents a VeriCodeRsp.
     * @implements IVeriCodeRsp
     * @constructor
     * @param {IVeriCodeRsp=} [properties] Properties to set
     */
    function VeriCodeRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * VeriCodeRsp nRlt.
     * @member {number} nRlt
     * @memberof VeriCodeRsp
     * @instance
     */
    VeriCodeRsp.prototype.nRlt = 0;

    /**
     * VeriCodeRsp nWay.
     * @member {number} nWay
     * @memberof VeriCodeRsp
     * @instance
     */
    VeriCodeRsp.prototype.nWay = 0;

    /**
     * Creates a new VeriCodeRsp instance using the specified properties.
     * @function create
     * @memberof VeriCodeRsp
     * @static
     * @param {IVeriCodeRsp=} [properties] Properties to set
     * @returns {VeriCodeRsp} VeriCodeRsp instance
     */
    VeriCodeRsp.create = function create(properties) {
        return new VeriCodeRsp(properties);
    };

    /**
     * Encodes the specified VeriCodeRsp message. Does not implicitly {@link VeriCodeRsp.verify|verify} messages.
     * @function encode
     * @memberof VeriCodeRsp
     * @static
     * @param {IVeriCodeRsp} message VeriCodeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VeriCodeRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        if (message.nWay != null && Object.hasOwnProperty.call(message, "nWay"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nWay);
        return writer;
    };

    /**
     * Encodes the specified VeriCodeRsp message, length delimited. Does not implicitly {@link VeriCodeRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof VeriCodeRsp
     * @static
     * @param {IVeriCodeRsp} message VeriCodeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VeriCodeRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a VeriCodeRsp message from the specified reader or buffer.
     * @function decode
     * @memberof VeriCodeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {VeriCodeRsp} VeriCodeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VeriCodeRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VeriCodeRsp();
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
                    message.nWay = reader.int32();
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
     * Decodes a VeriCodeRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof VeriCodeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {VeriCodeRsp} VeriCodeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VeriCodeRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a VeriCodeRsp message.
     * @function verify
     * @memberof VeriCodeRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    VeriCodeRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (message.nWay != null && message.hasOwnProperty("nWay"))
            if (!$util.isInteger(message.nWay))
                return "nWay: integer expected";
        return null;
    };

    /**
     * Creates a VeriCodeRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof VeriCodeRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {VeriCodeRsp} VeriCodeRsp
     */
    VeriCodeRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.VeriCodeRsp)
            return object;
        var message = new $root.VeriCodeRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.nWay != null)
            message.nWay = object.nWay | 0;
        return message;
    };

    /**
     * Creates a plain object from a VeriCodeRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof VeriCodeRsp
     * @static
     * @param {VeriCodeRsp} message VeriCodeRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    VeriCodeRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nRlt = 0;
            object.nWay = 0;
        }
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.nWay != null && message.hasOwnProperty("nWay"))
            object.nWay = message.nWay;
        return object;
    };

    /**
     * Converts this VeriCodeRsp to JSON.
     * @function toJSON
     * @memberof VeriCodeRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    VeriCodeRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for VeriCodeRsp
     * @function getTypeUrl
     * @memberof VeriCodeRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    VeriCodeRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/VeriCodeRsp";
    };

    return VeriCodeRsp;
})();

$root.BindQuerryReq = (function() {

    /**
     * Properties of a BindQuerryReq.
     * @exports IBindQuerryReq
     * @interface IBindQuerryReq
     * @property {string} sAcc BindQuerryReq sAcc
     */

    /**
     * Constructs a new BindQuerryReq.
     * @exports BindQuerryReq
     * @classdesc Represents a BindQuerryReq.
     * @implements IBindQuerryReq
     * @constructor
     * @param {IBindQuerryReq=} [properties] Properties to set
     */
    function BindQuerryReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BindQuerryReq sAcc.
     * @member {string} sAcc
     * @memberof BindQuerryReq
     * @instance
     */
    BindQuerryReq.prototype.sAcc = "";

    /**
     * Creates a new BindQuerryReq instance using the specified properties.
     * @function create
     * @memberof BindQuerryReq
     * @static
     * @param {IBindQuerryReq=} [properties] Properties to set
     * @returns {BindQuerryReq} BindQuerryReq instance
     */
    BindQuerryReq.create = function create(properties) {
        return new BindQuerryReq(properties);
    };

    /**
     * Encodes the specified BindQuerryReq message. Does not implicitly {@link BindQuerryReq.verify|verify} messages.
     * @function encode
     * @memberof BindQuerryReq
     * @static
     * @param {IBindQuerryReq} message BindQuerryReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BindQuerryReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sAcc);
        return writer;
    };

    /**
     * Encodes the specified BindQuerryReq message, length delimited. Does not implicitly {@link BindQuerryReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BindQuerryReq
     * @static
     * @param {IBindQuerryReq} message BindQuerryReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BindQuerryReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BindQuerryReq message from the specified reader or buffer.
     * @function decode
     * @memberof BindQuerryReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BindQuerryReq} BindQuerryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BindQuerryReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BindQuerryReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.sAcc = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sAcc"))
            throw $util.ProtocolError("missing required 'sAcc'", { instance: message });
        return message;
    };

    /**
     * Decodes a BindQuerryReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BindQuerryReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BindQuerryReq} BindQuerryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BindQuerryReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BindQuerryReq message.
     * @function verify
     * @memberof BindQuerryReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BindQuerryReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sAcc))
            return "sAcc: string expected";
        return null;
    };

    /**
     * Creates a BindQuerryReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BindQuerryReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BindQuerryReq} BindQuerryReq
     */
    BindQuerryReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BindQuerryReq)
            return object;
        var message = new $root.BindQuerryReq();
        if (object.sAcc != null)
            message.sAcc = String(object.sAcc);
        return message;
    };

    /**
     * Creates a plain object from a BindQuerryReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BindQuerryReq
     * @static
     * @param {BindQuerryReq} message BindQuerryReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BindQuerryReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sAcc = "";
        if (message.sAcc != null && message.hasOwnProperty("sAcc"))
            object.sAcc = message.sAcc;
        return object;
    };

    /**
     * Converts this BindQuerryReq to JSON.
     * @function toJSON
     * @memberof BindQuerryReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BindQuerryReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for BindQuerryReq
     * @function getTypeUrl
     * @memberof BindQuerryReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BindQuerryReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BindQuerryReq";
    };

    return BindQuerryReq;
})();

$root.BindQuerryRsp = (function() {

    /**
     * Properties of a BindQuerryRsp.
     * @exports IBindQuerryRsp
     * @interface IBindQuerryRsp
     * @property {number} nRlt BindQuerryRsp nRlt
     */

    /**
     * Constructs a new BindQuerryRsp.
     * @exports BindQuerryRsp
     * @classdesc Represents a BindQuerryRsp.
     * @implements IBindQuerryRsp
     * @constructor
     * @param {IBindQuerryRsp=} [properties] Properties to set
     */
    function BindQuerryRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BindQuerryRsp nRlt.
     * @member {number} nRlt
     * @memberof BindQuerryRsp
     * @instance
     */
    BindQuerryRsp.prototype.nRlt = 0;

    /**
     * Creates a new BindQuerryRsp instance using the specified properties.
     * @function create
     * @memberof BindQuerryRsp
     * @static
     * @param {IBindQuerryRsp=} [properties] Properties to set
     * @returns {BindQuerryRsp} BindQuerryRsp instance
     */
    BindQuerryRsp.create = function create(properties) {
        return new BindQuerryRsp(properties);
    };

    /**
     * Encodes the specified BindQuerryRsp message. Does not implicitly {@link BindQuerryRsp.verify|verify} messages.
     * @function encode
     * @memberof BindQuerryRsp
     * @static
     * @param {IBindQuerryRsp} message BindQuerryRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BindQuerryRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        return writer;
    };

    /**
     * Encodes the specified BindQuerryRsp message, length delimited. Does not implicitly {@link BindQuerryRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BindQuerryRsp
     * @static
     * @param {IBindQuerryRsp} message BindQuerryRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BindQuerryRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BindQuerryRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BindQuerryRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BindQuerryRsp} BindQuerryRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BindQuerryRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BindQuerryRsp();
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
     * Decodes a BindQuerryRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BindQuerryRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BindQuerryRsp} BindQuerryRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BindQuerryRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BindQuerryRsp message.
     * @function verify
     * @memberof BindQuerryRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BindQuerryRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        return null;
    };

    /**
     * Creates a BindQuerryRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BindQuerryRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BindQuerryRsp} BindQuerryRsp
     */
    BindQuerryRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BindQuerryRsp)
            return object;
        var message = new $root.BindQuerryRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        return message;
    };

    /**
     * Creates a plain object from a BindQuerryRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BindQuerryRsp
     * @static
     * @param {BindQuerryRsp} message BindQuerryRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BindQuerryRsp.toObject = function toObject(message, options) {
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
     * Converts this BindQuerryRsp to JSON.
     * @function toJSON
     * @memberof BindQuerryRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BindQuerryRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for BindQuerryRsp
     * @function getTypeUrl
     * @memberof BindQuerryRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BindQuerryRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BindQuerryRsp";
    };

    return BindQuerryRsp;
})();

$root.PasswordResetReq = (function() {

    /**
     * Properties of a PasswordResetReq.
     * @exports IPasswordResetReq
     * @interface IPasswordResetReq
     * @property {number} nWay PasswordResetReq nWay
     * @property {string} sAddrNew PasswordResetReq sAddrNew
     * @property {string} sVeriCode PasswordResetReq sVeriCode
     * @property {string} sPasswordNew PasswordResetReq sPasswordNew
     */

    /**
     * Constructs a new PasswordResetReq.
     * @exports PasswordResetReq
     * @classdesc Represents a PasswordResetReq.
     * @implements IPasswordResetReq
     * @constructor
     * @param {IPasswordResetReq=} [properties] Properties to set
     */
    function PasswordResetReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PasswordResetReq nWay.
     * @member {number} nWay
     * @memberof PasswordResetReq
     * @instance
     */
    PasswordResetReq.prototype.nWay = 0;

    /**
     * PasswordResetReq sAddrNew.
     * @member {string} sAddrNew
     * @memberof PasswordResetReq
     * @instance
     */
    PasswordResetReq.prototype.sAddrNew = "";

    /**
     * PasswordResetReq sVeriCode.
     * @member {string} sVeriCode
     * @memberof PasswordResetReq
     * @instance
     */
    PasswordResetReq.prototype.sVeriCode = "";

    /**
     * PasswordResetReq sPasswordNew.
     * @member {string} sPasswordNew
     * @memberof PasswordResetReq
     * @instance
     */
    PasswordResetReq.prototype.sPasswordNew = "";

    /**
     * Creates a new PasswordResetReq instance using the specified properties.
     * @function create
     * @memberof PasswordResetReq
     * @static
     * @param {IPasswordResetReq=} [properties] Properties to set
     * @returns {PasswordResetReq} PasswordResetReq instance
     */
    PasswordResetReq.create = function create(properties) {
        return new PasswordResetReq(properties);
    };

    /**
     * Encodes the specified PasswordResetReq message. Does not implicitly {@link PasswordResetReq.verify|verify} messages.
     * @function encode
     * @memberof PasswordResetReq
     * @static
     * @param {IPasswordResetReq} message PasswordResetReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordResetReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nWay);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sAddrNew);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sVeriCode);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.sPasswordNew);
        return writer;
    };

    /**
     * Encodes the specified PasswordResetReq message, length delimited. Does not implicitly {@link PasswordResetReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PasswordResetReq
     * @static
     * @param {IPasswordResetReq} message PasswordResetReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordResetReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PasswordResetReq message from the specified reader or buffer.
     * @function decode
     * @memberof PasswordResetReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PasswordResetReq} PasswordResetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordResetReq.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PasswordResetReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.nWay = reader.int32();
                    break;
                }
            case 2: {
                    message.sAddrNew = reader.string();
                    break;
                }
            case 3: {
                    message.sVeriCode = reader.string();
                    break;
                }
            case 4: {
                    message.sPasswordNew = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nWay"))
            throw $util.ProtocolError("missing required 'nWay'", { instance: message });
        if (!message.hasOwnProperty("sAddrNew"))
            throw $util.ProtocolError("missing required 'sAddrNew'", { instance: message });
        if (!message.hasOwnProperty("sVeriCode"))
            throw $util.ProtocolError("missing required 'sVeriCode'", { instance: message });
        if (!message.hasOwnProperty("sPasswordNew"))
            throw $util.ProtocolError("missing required 'sPasswordNew'", { instance: message });
        return message;
    };

    /**
     * Decodes a PasswordResetReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PasswordResetReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PasswordResetReq} PasswordResetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordResetReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PasswordResetReq message.
     * @function verify
     * @memberof PasswordResetReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PasswordResetReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nWay))
            return "nWay: integer expected";
        if (!$util.isString(message.sAddrNew))
            return "sAddrNew: string expected";
        if (!$util.isString(message.sVeriCode))
            return "sVeriCode: string expected";
        if (!$util.isString(message.sPasswordNew))
            return "sPasswordNew: string expected";
        return null;
    };

    /**
     * Creates a PasswordResetReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PasswordResetReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PasswordResetReq} PasswordResetReq
     */
    PasswordResetReq.fromObject = function fromObject(object) {
        if (object instanceof $root.PasswordResetReq)
            return object;
        var message = new $root.PasswordResetReq();
        if (object.nWay != null)
            message.nWay = object.nWay | 0;
        if (object.sAddrNew != null)
            message.sAddrNew = String(object.sAddrNew);
        if (object.sVeriCode != null)
            message.sVeriCode = String(object.sVeriCode);
        if (object.sPasswordNew != null)
            message.sPasswordNew = String(object.sPasswordNew);
        return message;
    };

    /**
     * Creates a plain object from a PasswordResetReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PasswordResetReq
     * @static
     * @param {PasswordResetReq} message PasswordResetReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PasswordResetReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nWay = 0;
            object.sAddrNew = "";
            object.sVeriCode = "";
            object.sPasswordNew = "";
        }
        if (message.nWay != null && message.hasOwnProperty("nWay"))
            object.nWay = message.nWay;
        if (message.sAddrNew != null && message.hasOwnProperty("sAddrNew"))
            object.sAddrNew = message.sAddrNew;
        if (message.sVeriCode != null && message.hasOwnProperty("sVeriCode"))
            object.sVeriCode = message.sVeriCode;
        if (message.sPasswordNew != null && message.hasOwnProperty("sPasswordNew"))
            object.sPasswordNew = message.sPasswordNew;
        return object;
    };

    /**
     * Converts this PasswordResetReq to JSON.
     * @function toJSON
     * @memberof PasswordResetReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PasswordResetReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PasswordResetReq
     * @function getTypeUrl
     * @memberof PasswordResetReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PasswordResetReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PasswordResetReq";
    };

    return PasswordResetReq;
})();

$root.PasswordResetRsp = (function() {

    /**
     * Properties of a PasswordResetRsp.
     * @exports IPasswordResetRsp
     * @interface IPasswordResetRsp
     * @property {number} nRlt PasswordResetRsp nRlt
     */

    /**
     * Constructs a new PasswordResetRsp.
     * @exports PasswordResetRsp
     * @classdesc Represents a PasswordResetRsp.
     * @implements IPasswordResetRsp
     * @constructor
     * @param {IPasswordResetRsp=} [properties] Properties to set
     */
    function PasswordResetRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PasswordResetRsp nRlt.
     * @member {number} nRlt
     * @memberof PasswordResetRsp
     * @instance
     */
    PasswordResetRsp.prototype.nRlt = 0;

    /**
     * Creates a new PasswordResetRsp instance using the specified properties.
     * @function create
     * @memberof PasswordResetRsp
     * @static
     * @param {IPasswordResetRsp=} [properties] Properties to set
     * @returns {PasswordResetRsp} PasswordResetRsp instance
     */
    PasswordResetRsp.create = function create(properties) {
        return new PasswordResetRsp(properties);
    };

    /**
     * Encodes the specified PasswordResetRsp message. Does not implicitly {@link PasswordResetRsp.verify|verify} messages.
     * @function encode
     * @memberof PasswordResetRsp
     * @static
     * @param {IPasswordResetRsp} message PasswordResetRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordResetRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        return writer;
    };

    /**
     * Encodes the specified PasswordResetRsp message, length delimited. Does not implicitly {@link PasswordResetRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PasswordResetRsp
     * @static
     * @param {IPasswordResetRsp} message PasswordResetRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordResetRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PasswordResetRsp message from the specified reader or buffer.
     * @function decode
     * @memberof PasswordResetRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PasswordResetRsp} PasswordResetRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordResetRsp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PasswordResetRsp();
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
     * Decodes a PasswordResetRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PasswordResetRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PasswordResetRsp} PasswordResetRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordResetRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PasswordResetRsp message.
     * @function verify
     * @memberof PasswordResetRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PasswordResetRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        return null;
    };

    /**
     * Creates a PasswordResetRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PasswordResetRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PasswordResetRsp} PasswordResetRsp
     */
    PasswordResetRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.PasswordResetRsp)
            return object;
        var message = new $root.PasswordResetRsp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        return message;
    };

    /**
     * Creates a plain object from a PasswordResetRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PasswordResetRsp
     * @static
     * @param {PasswordResetRsp} message PasswordResetRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PasswordResetRsp.toObject = function toObject(message, options) {
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
     * Converts this PasswordResetRsp to JSON.
     * @function toJSON
     * @memberof PasswordResetRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PasswordResetRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PasswordResetRsp
     * @function getTypeUrl
     * @memberof PasswordResetRsp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PasswordResetRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PasswordResetRsp";
    };

    return PasswordResetRsp;
})();

module.exports = $root;
