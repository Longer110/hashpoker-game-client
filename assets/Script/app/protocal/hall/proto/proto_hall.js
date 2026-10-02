/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Lobby_Proto = (function() {

    /**
     * Properties of a Lobby_Proto.
     * @exports ILobby_Proto
     * @interface ILobby_Proto
     * @property {number} Main_CMD Lobby_Proto Main_CMD
     * @property {number} LogonReq_CMD Lobby_Proto LogonReq_CMD
     * @property {number} LogonRsp_CMD Lobby_Proto LogonRsp_CMD
     * @property {number} GameListNotify_CMD Lobby_Proto GameListNotify_CMD
     * @property {number} RoomListReq_CMD Lobby_Proto RoomListReq_CMD
     * @property {number} RoomListRsp_CMD Lobby_Proto RoomListRsp_CMD
     * @property {number} TreasureReq_CMD Lobby_Proto TreasureReq_CMD
     * @property {number} TreasureRsp_CMD Lobby_Proto TreasureRsp_CMD
     * @property {number} EnterBankReq_CMD Lobby_Proto EnterBankReq_CMD
     * @property {number} EnterBankRsp_CMD Lobby_Proto EnterBankRsp_CMD
     * @property {number} BankUnlockReq_CMD Lobby_Proto BankUnlockReq_CMD
     * @property {number} BankUnlockRsp_CMD Lobby_Proto BankUnlockRsp_CMD
     * @property {number} BankAccessReq_CMD Lobby_Proto BankAccessReq_CMD
     * @property {number} BankAccessRsp_CMD Lobby_Proto BankAccessRsp_CMD
     * @property {number} BankPasswordChangeReq_CMD Lobby_Proto BankPasswordChangeReq_CMD
     * @property {number} BankPasswordChangeRsp_CMD Lobby_Proto BankPasswordChangeRsp_CMD
     * @property {number} BankAccessDetailReq_CMD Lobby_Proto BankAccessDetailReq_CMD
     * @property {number} BankAccessDetailRsp_CMD Lobby_Proto BankAccessDetailRsp_CMD
     * @property {number} PaijuRecordReq_CMD Lobby_Proto PaijuRecordReq_CMD
     * @property {number} PaijuRecordRsp_CMD Lobby_Proto PaijuRecordRsp_CMD
     * @property {number} BeforeLoadScenceReq_CMD Lobby_Proto BeforeLoadScenceReq_CMD
     * @property {number} BeforeLoadScenceRsp_CMD Lobby_Proto BeforeLoadScenceRsp_CMD
     * @property {number} SUB_REQ_UPDATE_USERINFO Lobby_Proto SUB_REQ_UPDATE_USERINFO
     * @property {number} SUB_REP_UPDATE_USERINFO Lobby_Proto SUB_REP_UPDATE_USERINFO
     * @property {number} SUB_REQ_GET_USER_INFO Lobby_Proto SUB_REQ_GET_USER_INFO
     * @property {number} SUB_REP_GET_USER_INFO Lobby_Proto SUB_REP_GET_USER_INFO
     * @property {number} SUB_REQ_GET_ZBTABLEID Lobby_Proto SUB_REQ_GET_ZBTABLEID
     * @property {number} SUB_REP_GET_ZBTABLEID Lobby_Proto SUB_REP_GET_ZBTABLEID
     * @property {number} PaijuDetailReq_CMD Lobby_Proto PaijuDetailReq_CMD
     * @property {number} PaijuDetailRsp_CMD Lobby_Proto PaijuDetailRsp_CMD
     * @property {number} HelpInfoReq_CMD Lobby_Proto HelpInfoReq_CMD
     * @property {number} HelpInfoRsp_CMD Lobby_Proto HelpInfoRsp_CMD
     * @property {number} OnlinePeopleReq_CMD Lobby_Proto OnlinePeopleReq_CMD
     * @property {number} NoticeOnlinePeople_CMD Lobby_Proto NoticeOnlinePeople_CMD
     * @property {number} LobbyDeZhouRecordReq_CMD Lobby_Proto LobbyDeZhouRecordReq_CMD
     * @property {number} LobbyDeZhouRecordRsp_CMD Lobby_Proto LobbyDeZhouRecordRsp_CMD
     * @property {number} LobbyDeZhouRecordDetailReq_CMD Lobby_Proto LobbyDeZhouRecordDetailReq_CMD
     * @property {number} LobbyDeZhouRecordDetailRsp_CMD Lobby_Proto LobbyDeZhouRecordDetailRsp_CMD
     * @property {number} BrLiveGameRecordReq_CMD Lobby_Proto BrLiveGameRecordReq_CMD
     * @property {number} BrLiveGameRecordRsp_CMD Lobby_Proto BrLiveGameRecordRsp_CMD
     * @property {number} BrLiveGameDetailReq_CMD Lobby_Proto BrLiveGameDetailReq_CMD
     * @property {number} BrLiveGameDetailRsp_CMD Lobby_Proto BrLiveGameDetailRsp_CMD
     * @property {number} UserGoldLessStandardNotify_CMD Lobby_Proto UserGoldLessStandardNotify_CMD
     * @property {number} BlockChianListInfoReq_CMD Lobby_Proto BlockChianListInfoReq_CMD
     * @property {number} BlockChianListInfoRep_CMD Lobby_Proto BlockChianListInfoRep_CMD
     * @property {number} AccountCloseReq_CMD Lobby_Proto AccountCloseReq_CMD
     * @property {number} AccountCloseRsp_CMD Lobby_Proto AccountCloseRsp_CMD
     * @property {number} AccountPayURLReq_CMD Lobby_Proto AccountPayURLReq_CMD
     * @property {number} AccountPayURLRsp_CMD Lobby_Proto AccountPayURLRsp_CMD
     * @property {number} AccountPayInfoReq_CMD Lobby_Proto AccountPayInfoReq_CMD
     * @property {number} AccountPayInfoRsp_CMD Lobby_Proto AccountPayInfoRsp_CMD
     * @property {number} AccountWithdrawalReq_CMD Lobby_Proto AccountWithdrawalReq_CMD
     * @property {number} AccountWithdrawalRsp_CMD Lobby_Proto AccountWithdrawalRsp_CMD
     * @property {number} AccountWithdrawalViewReq_CMD Lobby_Proto AccountWithdrawalViewReq_CMD
     * @property {number} AccountWithdrawalViewRsp_CMD Lobby_Proto AccountWithdrawalViewRsp_CMD
     * @property {number} ClubSUserNoticeReq_CMD Lobby_Proto ClubSUserNoticeReq_CMD
     * @property {number} ClubSUserNoticeResp_CMD Lobby_Proto ClubSUserNoticeResp_CMD
     * @property {number} ClubSUserNoticeHandleReq_CMD Lobby_Proto ClubSUserNoticeHandleReq_CMD
     * @property {number} ClubSUserNoticeHandleResp_CMD Lobby_Proto ClubSUserNoticeHandleResp_CMD
     */

    /**
     * Constructs a new Lobby_Proto.
     * @exports Lobby_Proto
     * @classdesc Represents a Lobby_Proto.
     * @implements ILobby_Proto
     * @constructor
     * @param {ILobby_Proto=} [properties] Properties to set
     */
    function Lobby_Proto(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Lobby_Proto Main_CMD.
     * @member {number} Main_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.Main_CMD = 101;

    /**
     * Lobby_Proto LogonReq_CMD.
     * @member {number} LogonReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LogonReq_CMD = 1;

    /**
     * Lobby_Proto LogonRsp_CMD.
     * @member {number} LogonRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LogonRsp_CMD = 2;

    /**
     * Lobby_Proto GameListNotify_CMD.
     * @member {number} GameListNotify_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.GameListNotify_CMD = 3;

    /**
     * Lobby_Proto RoomListReq_CMD.
     * @member {number} RoomListReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.RoomListReq_CMD = 4;

    /**
     * Lobby_Proto RoomListRsp_CMD.
     * @member {number} RoomListRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.RoomListRsp_CMD = 5;

    /**
     * Lobby_Proto TreasureReq_CMD.
     * @member {number} TreasureReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.TreasureReq_CMD = 8;

    /**
     * Lobby_Proto TreasureRsp_CMD.
     * @member {number} TreasureRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.TreasureRsp_CMD = 9;

    /**
     * Lobby_Proto EnterBankReq_CMD.
     * @member {number} EnterBankReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.EnterBankReq_CMD = 10;

    /**
     * Lobby_Proto EnterBankRsp_CMD.
     * @member {number} EnterBankRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.EnterBankRsp_CMD = 11;

    /**
     * Lobby_Proto BankUnlockReq_CMD.
     * @member {number} BankUnlockReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankUnlockReq_CMD = 12;

    /**
     * Lobby_Proto BankUnlockRsp_CMD.
     * @member {number} BankUnlockRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankUnlockRsp_CMD = 13;

    /**
     * Lobby_Proto BankAccessReq_CMD.
     * @member {number} BankAccessReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankAccessReq_CMD = 14;

    /**
     * Lobby_Proto BankAccessRsp_CMD.
     * @member {number} BankAccessRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankAccessRsp_CMD = 15;

    /**
     * Lobby_Proto BankPasswordChangeReq_CMD.
     * @member {number} BankPasswordChangeReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankPasswordChangeReq_CMD = 16;

    /**
     * Lobby_Proto BankPasswordChangeRsp_CMD.
     * @member {number} BankPasswordChangeRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankPasswordChangeRsp_CMD = 17;

    /**
     * Lobby_Proto BankAccessDetailReq_CMD.
     * @member {number} BankAccessDetailReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankAccessDetailReq_CMD = 18;

    /**
     * Lobby_Proto BankAccessDetailRsp_CMD.
     * @member {number} BankAccessDetailRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BankAccessDetailRsp_CMD = 19;

    /**
     * Lobby_Proto PaijuRecordReq_CMD.
     * @member {number} PaijuRecordReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.PaijuRecordReq_CMD = 20;

    /**
     * Lobby_Proto PaijuRecordRsp_CMD.
     * @member {number} PaijuRecordRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.PaijuRecordRsp_CMD = 21;

    /**
     * Lobby_Proto BeforeLoadScenceReq_CMD.
     * @member {number} BeforeLoadScenceReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BeforeLoadScenceReq_CMD = 22;

    /**
     * Lobby_Proto BeforeLoadScenceRsp_CMD.
     * @member {number} BeforeLoadScenceRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BeforeLoadScenceRsp_CMD = 23;

    /**
     * Lobby_Proto SUB_REQ_UPDATE_USERINFO.
     * @member {number} SUB_REQ_UPDATE_USERINFO
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REQ_UPDATE_USERINFO = 25;

    /**
     * Lobby_Proto SUB_REP_UPDATE_USERINFO.
     * @member {number} SUB_REP_UPDATE_USERINFO
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REP_UPDATE_USERINFO = 26;

    /**
     * Lobby_Proto SUB_REQ_GET_USER_INFO.
     * @member {number} SUB_REQ_GET_USER_INFO
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REQ_GET_USER_INFO = 27;

    /**
     * Lobby_Proto SUB_REP_GET_USER_INFO.
     * @member {number} SUB_REP_GET_USER_INFO
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REP_GET_USER_INFO = 28;

    /**
     * Lobby_Proto SUB_REQ_GET_ZBTABLEID.
     * @member {number} SUB_REQ_GET_ZBTABLEID
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REQ_GET_ZBTABLEID = 29;

    /**
     * Lobby_Proto SUB_REP_GET_ZBTABLEID.
     * @member {number} SUB_REP_GET_ZBTABLEID
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.SUB_REP_GET_ZBTABLEID = 30;

    /**
     * Lobby_Proto PaijuDetailReq_CMD.
     * @member {number} PaijuDetailReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.PaijuDetailReq_CMD = 31;

    /**
     * Lobby_Proto PaijuDetailRsp_CMD.
     * @member {number} PaijuDetailRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.PaijuDetailRsp_CMD = 32;

    /**
     * Lobby_Proto HelpInfoReq_CMD.
     * @member {number} HelpInfoReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.HelpInfoReq_CMD = 33;

    /**
     * Lobby_Proto HelpInfoRsp_CMD.
     * @member {number} HelpInfoRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.HelpInfoRsp_CMD = 34;

    /**
     * Lobby_Proto OnlinePeopleReq_CMD.
     * @member {number} OnlinePeopleReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.OnlinePeopleReq_CMD = 35;

    /**
     * Lobby_Proto NoticeOnlinePeople_CMD.
     * @member {number} NoticeOnlinePeople_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.NoticeOnlinePeople_CMD = 36;

    /**
     * Lobby_Proto LobbyDeZhouRecordReq_CMD.
     * @member {number} LobbyDeZhouRecordReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LobbyDeZhouRecordReq_CMD = 37;

    /**
     * Lobby_Proto LobbyDeZhouRecordRsp_CMD.
     * @member {number} LobbyDeZhouRecordRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LobbyDeZhouRecordRsp_CMD = 38;

    /**
     * Lobby_Proto LobbyDeZhouRecordDetailReq_CMD.
     * @member {number} LobbyDeZhouRecordDetailReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LobbyDeZhouRecordDetailReq_CMD = 39;

    /**
     * Lobby_Proto LobbyDeZhouRecordDetailRsp_CMD.
     * @member {number} LobbyDeZhouRecordDetailRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.LobbyDeZhouRecordDetailRsp_CMD = 40;

    /**
     * Lobby_Proto BrLiveGameRecordReq_CMD.
     * @member {number} BrLiveGameRecordReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BrLiveGameRecordReq_CMD = 41;

    /**
     * Lobby_Proto BrLiveGameRecordRsp_CMD.
     * @member {number} BrLiveGameRecordRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BrLiveGameRecordRsp_CMD = 42;

    /**
     * Lobby_Proto BrLiveGameDetailReq_CMD.
     * @member {number} BrLiveGameDetailReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BrLiveGameDetailReq_CMD = 43;

    /**
     * Lobby_Proto BrLiveGameDetailRsp_CMD.
     * @member {number} BrLiveGameDetailRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BrLiveGameDetailRsp_CMD = 44;

    /**
     * Lobby_Proto UserGoldLessStandardNotify_CMD.
     * @member {number} UserGoldLessStandardNotify_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.UserGoldLessStandardNotify_CMD = 45;

    /**
     * Lobby_Proto BlockChianListInfoReq_CMD.
     * @member {number} BlockChianListInfoReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BlockChianListInfoReq_CMD = 46;

    /**
     * Lobby_Proto BlockChianListInfoRep_CMD.
     * @member {number} BlockChianListInfoRep_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.BlockChianListInfoRep_CMD = 47;

    /**
     * Lobby_Proto AccountCloseReq_CMD.
     * @member {number} AccountCloseReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountCloseReq_CMD = 48;

    /**
     * Lobby_Proto AccountCloseRsp_CMD.
     * @member {number} AccountCloseRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountCloseRsp_CMD = 49;

    /**
     * Lobby_Proto AccountPayURLReq_CMD.
     * @member {number} AccountPayURLReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountPayURLReq_CMD = 50;

    /**
     * Lobby_Proto AccountPayURLRsp_CMD.
     * @member {number} AccountPayURLRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountPayURLRsp_CMD = 51;

    /**
     * Lobby_Proto AccountPayInfoReq_CMD.
     * @member {number} AccountPayInfoReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountPayInfoReq_CMD = 52;

    /**
     * Lobby_Proto AccountPayInfoRsp_CMD.
     * @member {number} AccountPayInfoRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountPayInfoRsp_CMD = 53;

    /**
     * Lobby_Proto AccountWithdrawalReq_CMD.
     * @member {number} AccountWithdrawalReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountWithdrawalReq_CMD = 54;

    /**
     * Lobby_Proto AccountWithdrawalRsp_CMD.
     * @member {number} AccountWithdrawalRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountWithdrawalRsp_CMD = 55;

    /**
     * Lobby_Proto AccountWithdrawalViewReq_CMD.
     * @member {number} AccountWithdrawalViewReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountWithdrawalViewReq_CMD = 56;

    /**
     * Lobby_Proto AccountWithdrawalViewRsp_CMD.
     * @member {number} AccountWithdrawalViewRsp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.AccountWithdrawalViewRsp_CMD = 57;

    /**
     * Lobby_Proto ClubSUserNoticeReq_CMD.
     * @member {number} ClubSUserNoticeReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.ClubSUserNoticeReq_CMD = 58;

    /**
     * Lobby_Proto ClubSUserNoticeResp_CMD.
     * @member {number} ClubSUserNoticeResp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.ClubSUserNoticeResp_CMD = 59;

    /**
     * Lobby_Proto ClubSUserNoticeHandleReq_CMD.
     * @member {number} ClubSUserNoticeHandleReq_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.ClubSUserNoticeHandleReq_CMD = 60;

    /**
     * Lobby_Proto ClubSUserNoticeHandleResp_CMD.
     * @member {number} ClubSUserNoticeHandleResp_CMD
     * @memberof Lobby_Proto
     * @instance
     */
    Lobby_Proto.prototype.ClubSUserNoticeHandleResp_CMD = 61;

    /**
     * Creates a new Lobby_Proto instance using the specified properties.
     * @function create
     * @memberof Lobby_Proto
     * @static
     * @param {ILobby_Proto=} [properties] Properties to set
     * @returns {Lobby_Proto} Lobby_Proto instance
     */
    Lobby_Proto.create = function create(properties) {
        return new Lobby_Proto(properties);
    };

    /**
     * Encodes the specified Lobby_Proto message. Does not implicitly {@link Lobby_Proto.verify|verify} messages.
     * @function encode
     * @memberof Lobby_Proto
     * @static
     * @param {ILobby_Proto} message Lobby_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Lobby_Proto.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Main_CMD);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.LogonReq_CMD);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.LogonRsp_CMD);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.GameListNotify_CMD);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.RoomListReq_CMD);
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.RoomListRsp_CMD);
        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.TreasureReq_CMD);
        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.TreasureRsp_CMD);
        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.EnterBankReq_CMD);
        writer.uint32(/* id 12, wireType 0 =*/96).int32(message.EnterBankRsp_CMD);
        writer.uint32(/* id 13, wireType 0 =*/104).int32(message.BankUnlockReq_CMD);
        writer.uint32(/* id 14, wireType 0 =*/112).int32(message.BankUnlockRsp_CMD);
        writer.uint32(/* id 15, wireType 0 =*/120).int32(message.BankAccessReq_CMD);
        writer.uint32(/* id 16, wireType 0 =*/128).int32(message.BankAccessRsp_CMD);
        writer.uint32(/* id 17, wireType 0 =*/136).int32(message.BankPasswordChangeReq_CMD);
        writer.uint32(/* id 18, wireType 0 =*/144).int32(message.BankPasswordChangeRsp_CMD);
        writer.uint32(/* id 19, wireType 0 =*/152).int32(message.BankAccessDetailReq_CMD);
        writer.uint32(/* id 20, wireType 0 =*/160).int32(message.BankAccessDetailRsp_CMD);
        writer.uint32(/* id 21, wireType 0 =*/168).int32(message.PaijuRecordReq_CMD);
        writer.uint32(/* id 22, wireType 0 =*/176).int32(message.PaijuRecordRsp_CMD);
        writer.uint32(/* id 23, wireType 0 =*/184).int32(message.BeforeLoadScenceReq_CMD);
        writer.uint32(/* id 24, wireType 0 =*/192).int32(message.BeforeLoadScenceRsp_CMD);
        writer.uint32(/* id 25, wireType 0 =*/200).int32(message.SUB_REQ_UPDATE_USERINFO);
        writer.uint32(/* id 26, wireType 0 =*/208).int32(message.SUB_REP_UPDATE_USERINFO);
        writer.uint32(/* id 27, wireType 0 =*/216).int32(message.SUB_REQ_GET_USER_INFO);
        writer.uint32(/* id 28, wireType 0 =*/224).int32(message.SUB_REP_GET_USER_INFO);
        writer.uint32(/* id 29, wireType 0 =*/232).int32(message.SUB_REQ_GET_ZBTABLEID);
        writer.uint32(/* id 30, wireType 0 =*/240).int32(message.SUB_REP_GET_ZBTABLEID);
        writer.uint32(/* id 31, wireType 0 =*/248).int32(message.PaijuDetailReq_CMD);
        writer.uint32(/* id 32, wireType 0 =*/256).int32(message.PaijuDetailRsp_CMD);
        writer.uint32(/* id 33, wireType 0 =*/264).int32(message.HelpInfoReq_CMD);
        writer.uint32(/* id 34, wireType 0 =*/272).int32(message.HelpInfoRsp_CMD);
        writer.uint32(/* id 35, wireType 0 =*/280).int32(message.OnlinePeopleReq_CMD);
        writer.uint32(/* id 36, wireType 0 =*/288).int32(message.NoticeOnlinePeople_CMD);
        writer.uint32(/* id 37, wireType 0 =*/296).int32(message.LobbyDeZhouRecordReq_CMD);
        writer.uint32(/* id 38, wireType 0 =*/304).int32(message.LobbyDeZhouRecordRsp_CMD);
        writer.uint32(/* id 39, wireType 0 =*/312).int32(message.LobbyDeZhouRecordDetailReq_CMD);
        writer.uint32(/* id 40, wireType 0 =*/320).int32(message.LobbyDeZhouRecordDetailRsp_CMD);
        writer.uint32(/* id 41, wireType 0 =*/328).int32(message.BrLiveGameRecordReq_CMD);
        writer.uint32(/* id 42, wireType 0 =*/336).int32(message.BrLiveGameRecordRsp_CMD);
        writer.uint32(/* id 43, wireType 0 =*/344).int32(message.BrLiveGameDetailReq_CMD);
        writer.uint32(/* id 44, wireType 0 =*/352).int32(message.BrLiveGameDetailRsp_CMD);
        writer.uint32(/* id 45, wireType 0 =*/360).int32(message.UserGoldLessStandardNotify_CMD);
        writer.uint32(/* id 46, wireType 0 =*/368).int32(message.BlockChianListInfoReq_CMD);
        writer.uint32(/* id 47, wireType 0 =*/376).int32(message.BlockChianListInfoRep_CMD);
        writer.uint32(/* id 48, wireType 0 =*/384).int32(message.AccountCloseReq_CMD);
        writer.uint32(/* id 49, wireType 0 =*/392).int32(message.AccountCloseRsp_CMD);
        writer.uint32(/* id 50, wireType 0 =*/400).int32(message.AccountPayURLReq_CMD);
        writer.uint32(/* id 51, wireType 0 =*/408).int32(message.AccountPayURLRsp_CMD);
        writer.uint32(/* id 52, wireType 0 =*/416).int32(message.AccountPayInfoReq_CMD);
        writer.uint32(/* id 53, wireType 0 =*/424).int32(message.AccountPayInfoRsp_CMD);
        writer.uint32(/* id 54, wireType 0 =*/432).int32(message.AccountWithdrawalReq_CMD);
        writer.uint32(/* id 55, wireType 0 =*/440).int32(message.AccountWithdrawalRsp_CMD);
        writer.uint32(/* id 56, wireType 0 =*/448).int32(message.AccountWithdrawalViewReq_CMD);
        writer.uint32(/* id 57, wireType 0 =*/456).int32(message.AccountWithdrawalViewRsp_CMD);
        writer.uint32(/* id 58, wireType 0 =*/464).int32(message.ClubSUserNoticeReq_CMD);
        writer.uint32(/* id 59, wireType 0 =*/472).int32(message.ClubSUserNoticeResp_CMD);
        writer.uint32(/* id 60, wireType 0 =*/480).int32(message.ClubSUserNoticeHandleReq_CMD);
        writer.uint32(/* id 61, wireType 0 =*/488).int32(message.ClubSUserNoticeHandleResp_CMD);
        return writer;
    };

    /**
     * Encodes the specified Lobby_Proto message, length delimited. Does not implicitly {@link Lobby_Proto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Lobby_Proto
     * @static
     * @param {ILobby_Proto} message Lobby_Proto message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Lobby_Proto.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Lobby_Proto message from the specified reader or buffer.
     * @function decode
     * @memberof Lobby_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Lobby_Proto} Lobby_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Lobby_Proto.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Lobby_Proto();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.Main_CMD = reader.int32();
                break;
            case 2:
                message.LogonReq_CMD = reader.int32();
                break;
            case 3:
                message.LogonRsp_CMD = reader.int32();
                break;
            case 4:
                message.GameListNotify_CMD = reader.int32();
                break;
            case 5:
                message.RoomListReq_CMD = reader.int32();
                break;
            case 6:
                message.RoomListRsp_CMD = reader.int32();
                break;
            case 9:
                message.TreasureReq_CMD = reader.int32();
                break;
            case 10:
                message.TreasureRsp_CMD = reader.int32();
                break;
            case 11:
                message.EnterBankReq_CMD = reader.int32();
                break;
            case 12:
                message.EnterBankRsp_CMD = reader.int32();
                break;
            case 13:
                message.BankUnlockReq_CMD = reader.int32();
                break;
            case 14:
                message.BankUnlockRsp_CMD = reader.int32();
                break;
            case 15:
                message.BankAccessReq_CMD = reader.int32();
                break;
            case 16:
                message.BankAccessRsp_CMD = reader.int32();
                break;
            case 17:
                message.BankPasswordChangeReq_CMD = reader.int32();
                break;
            case 18:
                message.BankPasswordChangeRsp_CMD = reader.int32();
                break;
            case 19:
                message.BankAccessDetailReq_CMD = reader.int32();
                break;
            case 20:
                message.BankAccessDetailRsp_CMD = reader.int32();
                break;
            case 21:
                message.PaijuRecordReq_CMD = reader.int32();
                break;
            case 22:
                message.PaijuRecordRsp_CMD = reader.int32();
                break;
            case 23:
                message.BeforeLoadScenceReq_CMD = reader.int32();
                break;
            case 24:
                message.BeforeLoadScenceRsp_CMD = reader.int32();
                break;
            case 25:
                message.SUB_REQ_UPDATE_USERINFO = reader.int32();
                break;
            case 26:
                message.SUB_REP_UPDATE_USERINFO = reader.int32();
                break;
            case 27:
                message.SUB_REQ_GET_USER_INFO = reader.int32();
                break;
            case 28:
                message.SUB_REP_GET_USER_INFO = reader.int32();
                break;
            case 29:
                message.SUB_REQ_GET_ZBTABLEID = reader.int32();
                break;
            case 30:
                message.SUB_REP_GET_ZBTABLEID = reader.int32();
                break;
            case 31:
                message.PaijuDetailReq_CMD = reader.int32();
                break;
            case 32:
                message.PaijuDetailRsp_CMD = reader.int32();
                break;
            case 33:
                message.HelpInfoReq_CMD = reader.int32();
                break;
            case 34:
                message.HelpInfoRsp_CMD = reader.int32();
                break;
            case 35:
                message.OnlinePeopleReq_CMD = reader.int32();
                break;
            case 36:
                message.NoticeOnlinePeople_CMD = reader.int32();
                break;
            case 37:
                message.LobbyDeZhouRecordReq_CMD = reader.int32();
                break;
            case 38:
                message.LobbyDeZhouRecordRsp_CMD = reader.int32();
                break;
            case 39:
                message.LobbyDeZhouRecordDetailReq_CMD = reader.int32();
                break;
            case 40:
                message.LobbyDeZhouRecordDetailRsp_CMD = reader.int32();
                break;
            case 41:
                message.BrLiveGameRecordReq_CMD = reader.int32();
                break;
            case 42:
                message.BrLiveGameRecordRsp_CMD = reader.int32();
                break;
            case 43:
                message.BrLiveGameDetailReq_CMD = reader.int32();
                break;
            case 44:
                message.BrLiveGameDetailRsp_CMD = reader.int32();
                break;
            case 45:
                message.UserGoldLessStandardNotify_CMD = reader.int32();
                break;
            case 46:
                message.BlockChianListInfoReq_CMD = reader.int32();
                break;
            case 47:
                message.BlockChianListInfoRep_CMD = reader.int32();
                break;
            case 48:
                message.AccountCloseReq_CMD = reader.int32();
                break;
            case 49:
                message.AccountCloseRsp_CMD = reader.int32();
                break;
            case 50:
                message.AccountPayURLReq_CMD = reader.int32();
                break;
            case 51:
                message.AccountPayURLRsp_CMD = reader.int32();
                break;
            case 52:
                message.AccountPayInfoReq_CMD = reader.int32();
                break;
            case 53:
                message.AccountPayInfoRsp_CMD = reader.int32();
                break;
            case 54:
                message.AccountWithdrawalReq_CMD = reader.int32();
                break;
            case 55:
                message.AccountWithdrawalRsp_CMD = reader.int32();
                break;
            case 56:
                message.AccountWithdrawalViewReq_CMD = reader.int32();
                break;
            case 57:
                message.AccountWithdrawalViewRsp_CMD = reader.int32();
                break;
            case 58:
                message.ClubSUserNoticeReq_CMD = reader.int32();
                break;
            case 59:
                message.ClubSUserNoticeResp_CMD = reader.int32();
                break;
            case 60:
                message.ClubSUserNoticeHandleReq_CMD = reader.int32();
                break;
            case 61:
                message.ClubSUserNoticeHandleResp_CMD = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("Main_CMD"))
            throw $util.ProtocolError("missing required 'Main_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogonReq_CMD"))
            throw $util.ProtocolError("missing required 'LogonReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LogonRsp_CMD"))
            throw $util.ProtocolError("missing required 'LogonRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("GameListNotify_CMD"))
            throw $util.ProtocolError("missing required 'GameListNotify_CMD'", { instance: message });
        if (!message.hasOwnProperty("RoomListReq_CMD"))
            throw $util.ProtocolError("missing required 'RoomListReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("RoomListRsp_CMD"))
            throw $util.ProtocolError("missing required 'RoomListRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("TreasureReq_CMD"))
            throw $util.ProtocolError("missing required 'TreasureReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("TreasureRsp_CMD"))
            throw $util.ProtocolError("missing required 'TreasureRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("EnterBankReq_CMD"))
            throw $util.ProtocolError("missing required 'EnterBankReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("EnterBankRsp_CMD"))
            throw $util.ProtocolError("missing required 'EnterBankRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankUnlockReq_CMD"))
            throw $util.ProtocolError("missing required 'BankUnlockReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankUnlockRsp_CMD"))
            throw $util.ProtocolError("missing required 'BankUnlockRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankAccessReq_CMD"))
            throw $util.ProtocolError("missing required 'BankAccessReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankAccessRsp_CMD"))
            throw $util.ProtocolError("missing required 'BankAccessRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankPasswordChangeReq_CMD"))
            throw $util.ProtocolError("missing required 'BankPasswordChangeReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankPasswordChangeRsp_CMD"))
            throw $util.ProtocolError("missing required 'BankPasswordChangeRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankAccessDetailReq_CMD"))
            throw $util.ProtocolError("missing required 'BankAccessDetailReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BankAccessDetailRsp_CMD"))
            throw $util.ProtocolError("missing required 'BankAccessDetailRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("PaijuRecordReq_CMD"))
            throw $util.ProtocolError("missing required 'PaijuRecordReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("PaijuRecordRsp_CMD"))
            throw $util.ProtocolError("missing required 'PaijuRecordRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BeforeLoadScenceReq_CMD"))
            throw $util.ProtocolError("missing required 'BeforeLoadScenceReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BeforeLoadScenceRsp_CMD"))
            throw $util.ProtocolError("missing required 'BeforeLoadScenceRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_UPDATE_USERINFO"))
            throw $util.ProtocolError("missing required 'SUB_REQ_UPDATE_USERINFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_UPDATE_USERINFO"))
            throw $util.ProtocolError("missing required 'SUB_REP_UPDATE_USERINFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_GET_USER_INFO"))
            throw $util.ProtocolError("missing required 'SUB_REQ_GET_USER_INFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_GET_USER_INFO"))
            throw $util.ProtocolError("missing required 'SUB_REP_GET_USER_INFO'", { instance: message });
        if (!message.hasOwnProperty("SUB_REQ_GET_ZBTABLEID"))
            throw $util.ProtocolError("missing required 'SUB_REQ_GET_ZBTABLEID'", { instance: message });
        if (!message.hasOwnProperty("SUB_REP_GET_ZBTABLEID"))
            throw $util.ProtocolError("missing required 'SUB_REP_GET_ZBTABLEID'", { instance: message });
        if (!message.hasOwnProperty("PaijuDetailReq_CMD"))
            throw $util.ProtocolError("missing required 'PaijuDetailReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("PaijuDetailRsp_CMD"))
            throw $util.ProtocolError("missing required 'PaijuDetailRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("HelpInfoReq_CMD"))
            throw $util.ProtocolError("missing required 'HelpInfoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("HelpInfoRsp_CMD"))
            throw $util.ProtocolError("missing required 'HelpInfoRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("OnlinePeopleReq_CMD"))
            throw $util.ProtocolError("missing required 'OnlinePeopleReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("NoticeOnlinePeople_CMD"))
            throw $util.ProtocolError("missing required 'NoticeOnlinePeople_CMD'", { instance: message });
        if (!message.hasOwnProperty("LobbyDeZhouRecordReq_CMD"))
            throw $util.ProtocolError("missing required 'LobbyDeZhouRecordReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LobbyDeZhouRecordRsp_CMD"))
            throw $util.ProtocolError("missing required 'LobbyDeZhouRecordRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("LobbyDeZhouRecordDetailReq_CMD"))
            throw $util.ProtocolError("missing required 'LobbyDeZhouRecordDetailReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("LobbyDeZhouRecordDetailRsp_CMD"))
            throw $util.ProtocolError("missing required 'LobbyDeZhouRecordDetailRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BrLiveGameRecordReq_CMD"))
            throw $util.ProtocolError("missing required 'BrLiveGameRecordReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BrLiveGameRecordRsp_CMD"))
            throw $util.ProtocolError("missing required 'BrLiveGameRecordRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("BrLiveGameDetailReq_CMD"))
            throw $util.ProtocolError("missing required 'BrLiveGameDetailReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BrLiveGameDetailRsp_CMD"))
            throw $util.ProtocolError("missing required 'BrLiveGameDetailRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("UserGoldLessStandardNotify_CMD"))
            throw $util.ProtocolError("missing required 'UserGoldLessStandardNotify_CMD'", { instance: message });
        if (!message.hasOwnProperty("BlockChianListInfoReq_CMD"))
            throw $util.ProtocolError("missing required 'BlockChianListInfoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("BlockChianListInfoRep_CMD"))
            throw $util.ProtocolError("missing required 'BlockChianListInfoRep_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountCloseReq_CMD"))
            throw $util.ProtocolError("missing required 'AccountCloseReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountCloseRsp_CMD"))
            throw $util.ProtocolError("missing required 'AccountCloseRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountPayURLReq_CMD"))
            throw $util.ProtocolError("missing required 'AccountPayURLReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountPayURLRsp_CMD"))
            throw $util.ProtocolError("missing required 'AccountPayURLRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountPayInfoReq_CMD"))
            throw $util.ProtocolError("missing required 'AccountPayInfoReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountPayInfoRsp_CMD"))
            throw $util.ProtocolError("missing required 'AccountPayInfoRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountWithdrawalReq_CMD"))
            throw $util.ProtocolError("missing required 'AccountWithdrawalReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountWithdrawalRsp_CMD"))
            throw $util.ProtocolError("missing required 'AccountWithdrawalRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountWithdrawalViewReq_CMD"))
            throw $util.ProtocolError("missing required 'AccountWithdrawalViewReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("AccountWithdrawalViewRsp_CMD"))
            throw $util.ProtocolError("missing required 'AccountWithdrawalViewRsp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubSUserNoticeReq_CMD"))
            throw $util.ProtocolError("missing required 'ClubSUserNoticeReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubSUserNoticeResp_CMD"))
            throw $util.ProtocolError("missing required 'ClubSUserNoticeResp_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubSUserNoticeHandleReq_CMD"))
            throw $util.ProtocolError("missing required 'ClubSUserNoticeHandleReq_CMD'", { instance: message });
        if (!message.hasOwnProperty("ClubSUserNoticeHandleResp_CMD"))
            throw $util.ProtocolError("missing required 'ClubSUserNoticeHandleResp_CMD'", { instance: message });
        return message;
    };

    /**
     * Decodes a Lobby_Proto message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Lobby_Proto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Lobby_Proto} Lobby_Proto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Lobby_Proto.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Lobby_Proto message.
     * @function verify
     * @memberof Lobby_Proto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Lobby_Proto.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.Main_CMD))
            return "Main_CMD: integer expected";
        if (!$util.isInteger(message.LogonReq_CMD))
            return "LogonReq_CMD: integer expected";
        if (!$util.isInteger(message.LogonRsp_CMD))
            return "LogonRsp_CMD: integer expected";
        if (!$util.isInteger(message.GameListNotify_CMD))
            return "GameListNotify_CMD: integer expected";
        if (!$util.isInteger(message.RoomListReq_CMD))
            return "RoomListReq_CMD: integer expected";
        if (!$util.isInteger(message.RoomListRsp_CMD))
            return "RoomListRsp_CMD: integer expected";
        if (!$util.isInteger(message.TreasureReq_CMD))
            return "TreasureReq_CMD: integer expected";
        if (!$util.isInteger(message.TreasureRsp_CMD))
            return "TreasureRsp_CMD: integer expected";
        if (!$util.isInteger(message.EnterBankReq_CMD))
            return "EnterBankReq_CMD: integer expected";
        if (!$util.isInteger(message.EnterBankRsp_CMD))
            return "EnterBankRsp_CMD: integer expected";
        if (!$util.isInteger(message.BankUnlockReq_CMD))
            return "BankUnlockReq_CMD: integer expected";
        if (!$util.isInteger(message.BankUnlockRsp_CMD))
            return "BankUnlockRsp_CMD: integer expected";
        if (!$util.isInteger(message.BankAccessReq_CMD))
            return "BankAccessReq_CMD: integer expected";
        if (!$util.isInteger(message.BankAccessRsp_CMD))
            return "BankAccessRsp_CMD: integer expected";
        if (!$util.isInteger(message.BankPasswordChangeReq_CMD))
            return "BankPasswordChangeReq_CMD: integer expected";
        if (!$util.isInteger(message.BankPasswordChangeRsp_CMD))
            return "BankPasswordChangeRsp_CMD: integer expected";
        if (!$util.isInteger(message.BankAccessDetailReq_CMD))
            return "BankAccessDetailReq_CMD: integer expected";
        if (!$util.isInteger(message.BankAccessDetailRsp_CMD))
            return "BankAccessDetailRsp_CMD: integer expected";
        if (!$util.isInteger(message.PaijuRecordReq_CMD))
            return "PaijuRecordReq_CMD: integer expected";
        if (!$util.isInteger(message.PaijuRecordRsp_CMD))
            return "PaijuRecordRsp_CMD: integer expected";
        if (!$util.isInteger(message.BeforeLoadScenceReq_CMD))
            return "BeforeLoadScenceReq_CMD: integer expected";
        if (!$util.isInteger(message.BeforeLoadScenceRsp_CMD))
            return "BeforeLoadScenceRsp_CMD: integer expected";
        if (!$util.isInteger(message.SUB_REQ_UPDATE_USERINFO))
            return "SUB_REQ_UPDATE_USERINFO: integer expected";
        if (!$util.isInteger(message.SUB_REP_UPDATE_USERINFO))
            return "SUB_REP_UPDATE_USERINFO: integer expected";
        if (!$util.isInteger(message.SUB_REQ_GET_USER_INFO))
            return "SUB_REQ_GET_USER_INFO: integer expected";
        if (!$util.isInteger(message.SUB_REP_GET_USER_INFO))
            return "SUB_REP_GET_USER_INFO: integer expected";
        if (!$util.isInteger(message.SUB_REQ_GET_ZBTABLEID))
            return "SUB_REQ_GET_ZBTABLEID: integer expected";
        if (!$util.isInteger(message.SUB_REP_GET_ZBTABLEID))
            return "SUB_REP_GET_ZBTABLEID: integer expected";
        if (!$util.isInteger(message.PaijuDetailReq_CMD))
            return "PaijuDetailReq_CMD: integer expected";
        if (!$util.isInteger(message.PaijuDetailRsp_CMD))
            return "PaijuDetailRsp_CMD: integer expected";
        if (!$util.isInteger(message.HelpInfoReq_CMD))
            return "HelpInfoReq_CMD: integer expected";
        if (!$util.isInteger(message.HelpInfoRsp_CMD))
            return "HelpInfoRsp_CMD: integer expected";
        if (!$util.isInteger(message.OnlinePeopleReq_CMD))
            return "OnlinePeopleReq_CMD: integer expected";
        if (!$util.isInteger(message.NoticeOnlinePeople_CMD))
            return "NoticeOnlinePeople_CMD: integer expected";
        if (!$util.isInteger(message.LobbyDeZhouRecordReq_CMD))
            return "LobbyDeZhouRecordReq_CMD: integer expected";
        if (!$util.isInteger(message.LobbyDeZhouRecordRsp_CMD))
            return "LobbyDeZhouRecordRsp_CMD: integer expected";
        if (!$util.isInteger(message.LobbyDeZhouRecordDetailReq_CMD))
            return "LobbyDeZhouRecordDetailReq_CMD: integer expected";
        if (!$util.isInteger(message.LobbyDeZhouRecordDetailRsp_CMD))
            return "LobbyDeZhouRecordDetailRsp_CMD: integer expected";
        if (!$util.isInteger(message.BrLiveGameRecordReq_CMD))
            return "BrLiveGameRecordReq_CMD: integer expected";
        if (!$util.isInteger(message.BrLiveGameRecordRsp_CMD))
            return "BrLiveGameRecordRsp_CMD: integer expected";
        if (!$util.isInteger(message.BrLiveGameDetailReq_CMD))
            return "BrLiveGameDetailReq_CMD: integer expected";
        if (!$util.isInteger(message.BrLiveGameDetailRsp_CMD))
            return "BrLiveGameDetailRsp_CMD: integer expected";
        if (!$util.isInteger(message.UserGoldLessStandardNotify_CMD))
            return "UserGoldLessStandardNotify_CMD: integer expected";
        if (!$util.isInteger(message.BlockChianListInfoReq_CMD))
            return "BlockChianListInfoReq_CMD: integer expected";
        if (!$util.isInteger(message.BlockChianListInfoRep_CMD))
            return "BlockChianListInfoRep_CMD: integer expected";
        if (!$util.isInteger(message.AccountCloseReq_CMD))
            return "AccountCloseReq_CMD: integer expected";
        if (!$util.isInteger(message.AccountCloseRsp_CMD))
            return "AccountCloseRsp_CMD: integer expected";
        if (!$util.isInteger(message.AccountPayURLReq_CMD))
            return "AccountPayURLReq_CMD: integer expected";
        if (!$util.isInteger(message.AccountPayURLRsp_CMD))
            return "AccountPayURLRsp_CMD: integer expected";
        if (!$util.isInteger(message.AccountPayInfoReq_CMD))
            return "AccountPayInfoReq_CMD: integer expected";
        if (!$util.isInteger(message.AccountPayInfoRsp_CMD))
            return "AccountPayInfoRsp_CMD: integer expected";
        if (!$util.isInteger(message.AccountWithdrawalReq_CMD))
            return "AccountWithdrawalReq_CMD: integer expected";
        if (!$util.isInteger(message.AccountWithdrawalRsp_CMD))
            return "AccountWithdrawalRsp_CMD: integer expected";
        if (!$util.isInteger(message.AccountWithdrawalViewReq_CMD))
            return "AccountWithdrawalViewReq_CMD: integer expected";
        if (!$util.isInteger(message.AccountWithdrawalViewRsp_CMD))
            return "AccountWithdrawalViewRsp_CMD: integer expected";
        if (!$util.isInteger(message.ClubSUserNoticeReq_CMD))
            return "ClubSUserNoticeReq_CMD: integer expected";
        if (!$util.isInteger(message.ClubSUserNoticeResp_CMD))
            return "ClubSUserNoticeResp_CMD: integer expected";
        if (!$util.isInteger(message.ClubSUserNoticeHandleReq_CMD))
            return "ClubSUserNoticeHandleReq_CMD: integer expected";
        if (!$util.isInteger(message.ClubSUserNoticeHandleResp_CMD))
            return "ClubSUserNoticeHandleResp_CMD: integer expected";
        return null;
    };

    /**
     * Creates a Lobby_Proto message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Lobby_Proto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Lobby_Proto} Lobby_Proto
     */
    Lobby_Proto.fromObject = function fromObject(object) {
        if (object instanceof $root.Lobby_Proto)
            return object;
        var message = new $root.Lobby_Proto();
        if (object.Main_CMD != null)
            message.Main_CMD = object.Main_CMD | 0;
        if (object.LogonReq_CMD != null)
            message.LogonReq_CMD = object.LogonReq_CMD | 0;
        if (object.LogonRsp_CMD != null)
            message.LogonRsp_CMD = object.LogonRsp_CMD | 0;
        if (object.GameListNotify_CMD != null)
            message.GameListNotify_CMD = object.GameListNotify_CMD | 0;
        if (object.RoomListReq_CMD != null)
            message.RoomListReq_CMD = object.RoomListReq_CMD | 0;
        if (object.RoomListRsp_CMD != null)
            message.RoomListRsp_CMD = object.RoomListRsp_CMD | 0;
        if (object.TreasureReq_CMD != null)
            message.TreasureReq_CMD = object.TreasureReq_CMD | 0;
        if (object.TreasureRsp_CMD != null)
            message.TreasureRsp_CMD = object.TreasureRsp_CMD | 0;
        if (object.EnterBankReq_CMD != null)
            message.EnterBankReq_CMD = object.EnterBankReq_CMD | 0;
        if (object.EnterBankRsp_CMD != null)
            message.EnterBankRsp_CMD = object.EnterBankRsp_CMD | 0;
        if (object.BankUnlockReq_CMD != null)
            message.BankUnlockReq_CMD = object.BankUnlockReq_CMD | 0;
        if (object.BankUnlockRsp_CMD != null)
            message.BankUnlockRsp_CMD = object.BankUnlockRsp_CMD | 0;
        if (object.BankAccessReq_CMD != null)
            message.BankAccessReq_CMD = object.BankAccessReq_CMD | 0;
        if (object.BankAccessRsp_CMD != null)
            message.BankAccessRsp_CMD = object.BankAccessRsp_CMD | 0;
        if (object.BankPasswordChangeReq_CMD != null)
            message.BankPasswordChangeReq_CMD = object.BankPasswordChangeReq_CMD | 0;
        if (object.BankPasswordChangeRsp_CMD != null)
            message.BankPasswordChangeRsp_CMD = object.BankPasswordChangeRsp_CMD | 0;
        if (object.BankAccessDetailReq_CMD != null)
            message.BankAccessDetailReq_CMD = object.BankAccessDetailReq_CMD | 0;
        if (object.BankAccessDetailRsp_CMD != null)
            message.BankAccessDetailRsp_CMD = object.BankAccessDetailRsp_CMD | 0;
        if (object.PaijuRecordReq_CMD != null)
            message.PaijuRecordReq_CMD = object.PaijuRecordReq_CMD | 0;
        if (object.PaijuRecordRsp_CMD != null)
            message.PaijuRecordRsp_CMD = object.PaijuRecordRsp_CMD | 0;
        if (object.BeforeLoadScenceReq_CMD != null)
            message.BeforeLoadScenceReq_CMD = object.BeforeLoadScenceReq_CMD | 0;
        if (object.BeforeLoadScenceRsp_CMD != null)
            message.BeforeLoadScenceRsp_CMD = object.BeforeLoadScenceRsp_CMD | 0;
        if (object.SUB_REQ_UPDATE_USERINFO != null)
            message.SUB_REQ_UPDATE_USERINFO = object.SUB_REQ_UPDATE_USERINFO | 0;
        if (object.SUB_REP_UPDATE_USERINFO != null)
            message.SUB_REP_UPDATE_USERINFO = object.SUB_REP_UPDATE_USERINFO | 0;
        if (object.SUB_REQ_GET_USER_INFO != null)
            message.SUB_REQ_GET_USER_INFO = object.SUB_REQ_GET_USER_INFO | 0;
        if (object.SUB_REP_GET_USER_INFO != null)
            message.SUB_REP_GET_USER_INFO = object.SUB_REP_GET_USER_INFO | 0;
        if (object.SUB_REQ_GET_ZBTABLEID != null)
            message.SUB_REQ_GET_ZBTABLEID = object.SUB_REQ_GET_ZBTABLEID | 0;
        if (object.SUB_REP_GET_ZBTABLEID != null)
            message.SUB_REP_GET_ZBTABLEID = object.SUB_REP_GET_ZBTABLEID | 0;
        if (object.PaijuDetailReq_CMD != null)
            message.PaijuDetailReq_CMD = object.PaijuDetailReq_CMD | 0;
        if (object.PaijuDetailRsp_CMD != null)
            message.PaijuDetailRsp_CMD = object.PaijuDetailRsp_CMD | 0;
        if (object.HelpInfoReq_CMD != null)
            message.HelpInfoReq_CMD = object.HelpInfoReq_CMD | 0;
        if (object.HelpInfoRsp_CMD != null)
            message.HelpInfoRsp_CMD = object.HelpInfoRsp_CMD | 0;
        if (object.OnlinePeopleReq_CMD != null)
            message.OnlinePeopleReq_CMD = object.OnlinePeopleReq_CMD | 0;
        if (object.NoticeOnlinePeople_CMD != null)
            message.NoticeOnlinePeople_CMD = object.NoticeOnlinePeople_CMD | 0;
        if (object.LobbyDeZhouRecordReq_CMD != null)
            message.LobbyDeZhouRecordReq_CMD = object.LobbyDeZhouRecordReq_CMD | 0;
        if (object.LobbyDeZhouRecordRsp_CMD != null)
            message.LobbyDeZhouRecordRsp_CMD = object.LobbyDeZhouRecordRsp_CMD | 0;
        if (object.LobbyDeZhouRecordDetailReq_CMD != null)
            message.LobbyDeZhouRecordDetailReq_CMD = object.LobbyDeZhouRecordDetailReq_CMD | 0;
        if (object.LobbyDeZhouRecordDetailRsp_CMD != null)
            message.LobbyDeZhouRecordDetailRsp_CMD = object.LobbyDeZhouRecordDetailRsp_CMD | 0;
        if (object.BrLiveGameRecordReq_CMD != null)
            message.BrLiveGameRecordReq_CMD = object.BrLiveGameRecordReq_CMD | 0;
        if (object.BrLiveGameRecordRsp_CMD != null)
            message.BrLiveGameRecordRsp_CMD = object.BrLiveGameRecordRsp_CMD | 0;
        if (object.BrLiveGameDetailReq_CMD != null)
            message.BrLiveGameDetailReq_CMD = object.BrLiveGameDetailReq_CMD | 0;
        if (object.BrLiveGameDetailRsp_CMD != null)
            message.BrLiveGameDetailRsp_CMD = object.BrLiveGameDetailRsp_CMD | 0;
        if (object.UserGoldLessStandardNotify_CMD != null)
            message.UserGoldLessStandardNotify_CMD = object.UserGoldLessStandardNotify_CMD | 0;
        if (object.BlockChianListInfoReq_CMD != null)
            message.BlockChianListInfoReq_CMD = object.BlockChianListInfoReq_CMD | 0;
        if (object.BlockChianListInfoRep_CMD != null)
            message.BlockChianListInfoRep_CMD = object.BlockChianListInfoRep_CMD | 0;
        if (object.AccountCloseReq_CMD != null)
            message.AccountCloseReq_CMD = object.AccountCloseReq_CMD | 0;
        if (object.AccountCloseRsp_CMD != null)
            message.AccountCloseRsp_CMD = object.AccountCloseRsp_CMD | 0;
        if (object.AccountPayURLReq_CMD != null)
            message.AccountPayURLReq_CMD = object.AccountPayURLReq_CMD | 0;
        if (object.AccountPayURLRsp_CMD != null)
            message.AccountPayURLRsp_CMD = object.AccountPayURLRsp_CMD | 0;
        if (object.AccountPayInfoReq_CMD != null)
            message.AccountPayInfoReq_CMD = object.AccountPayInfoReq_CMD | 0;
        if (object.AccountPayInfoRsp_CMD != null)
            message.AccountPayInfoRsp_CMD = object.AccountPayInfoRsp_CMD | 0;
        if (object.AccountWithdrawalReq_CMD != null)
            message.AccountWithdrawalReq_CMD = object.AccountWithdrawalReq_CMD | 0;
        if (object.AccountWithdrawalRsp_CMD != null)
            message.AccountWithdrawalRsp_CMD = object.AccountWithdrawalRsp_CMD | 0;
        if (object.AccountWithdrawalViewReq_CMD != null)
            message.AccountWithdrawalViewReq_CMD = object.AccountWithdrawalViewReq_CMD | 0;
        if (object.AccountWithdrawalViewRsp_CMD != null)
            message.AccountWithdrawalViewRsp_CMD = object.AccountWithdrawalViewRsp_CMD | 0;
        if (object.ClubSUserNoticeReq_CMD != null)
            message.ClubSUserNoticeReq_CMD = object.ClubSUserNoticeReq_CMD | 0;
        if (object.ClubSUserNoticeResp_CMD != null)
            message.ClubSUserNoticeResp_CMD = object.ClubSUserNoticeResp_CMD | 0;
        if (object.ClubSUserNoticeHandleReq_CMD != null)
            message.ClubSUserNoticeHandleReq_CMD = object.ClubSUserNoticeHandleReq_CMD | 0;
        if (object.ClubSUserNoticeHandleResp_CMD != null)
            message.ClubSUserNoticeHandleResp_CMD = object.ClubSUserNoticeHandleResp_CMD | 0;
        return message;
    };

    /**
     * Creates a plain object from a Lobby_Proto message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Lobby_Proto
     * @static
     * @param {Lobby_Proto} message Lobby_Proto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Lobby_Proto.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Main_CMD = 101;
            object.LogonReq_CMD = 1;
            object.LogonRsp_CMD = 2;
            object.GameListNotify_CMD = 3;
            object.RoomListReq_CMD = 4;
            object.RoomListRsp_CMD = 5;
            object.TreasureReq_CMD = 8;
            object.TreasureRsp_CMD = 9;
            object.EnterBankReq_CMD = 10;
            object.EnterBankRsp_CMD = 11;
            object.BankUnlockReq_CMD = 12;
            object.BankUnlockRsp_CMD = 13;
            object.BankAccessReq_CMD = 14;
            object.BankAccessRsp_CMD = 15;
            object.BankPasswordChangeReq_CMD = 16;
            object.BankPasswordChangeRsp_CMD = 17;
            object.BankAccessDetailReq_CMD = 18;
            object.BankAccessDetailRsp_CMD = 19;
            object.PaijuRecordReq_CMD = 20;
            object.PaijuRecordRsp_CMD = 21;
            object.BeforeLoadScenceReq_CMD = 22;
            object.BeforeLoadScenceRsp_CMD = 23;
            object.SUB_REQ_UPDATE_USERINFO = 25;
            object.SUB_REP_UPDATE_USERINFO = 26;
            object.SUB_REQ_GET_USER_INFO = 27;
            object.SUB_REP_GET_USER_INFO = 28;
            object.SUB_REQ_GET_ZBTABLEID = 29;
            object.SUB_REP_GET_ZBTABLEID = 30;
            object.PaijuDetailReq_CMD = 31;
            object.PaijuDetailRsp_CMD = 32;
            object.HelpInfoReq_CMD = 33;
            object.HelpInfoRsp_CMD = 34;
            object.OnlinePeopleReq_CMD = 35;
            object.NoticeOnlinePeople_CMD = 36;
            object.LobbyDeZhouRecordReq_CMD = 37;
            object.LobbyDeZhouRecordRsp_CMD = 38;
            object.LobbyDeZhouRecordDetailReq_CMD = 39;
            object.LobbyDeZhouRecordDetailRsp_CMD = 40;
            object.BrLiveGameRecordReq_CMD = 41;
            object.BrLiveGameRecordRsp_CMD = 42;
            object.BrLiveGameDetailReq_CMD = 43;
            object.BrLiveGameDetailRsp_CMD = 44;
            object.UserGoldLessStandardNotify_CMD = 45;
            object.BlockChianListInfoReq_CMD = 46;
            object.BlockChianListInfoRep_CMD = 47;
            object.AccountCloseReq_CMD = 48;
            object.AccountCloseRsp_CMD = 49;
            object.AccountPayURLReq_CMD = 50;
            object.AccountPayURLRsp_CMD = 51;
            object.AccountPayInfoReq_CMD = 52;
            object.AccountPayInfoRsp_CMD = 53;
            object.AccountWithdrawalReq_CMD = 54;
            object.AccountWithdrawalRsp_CMD = 55;
            object.AccountWithdrawalViewReq_CMD = 56;
            object.AccountWithdrawalViewRsp_CMD = 57;
            object.ClubSUserNoticeReq_CMD = 58;
            object.ClubSUserNoticeResp_CMD = 59;
            object.ClubSUserNoticeHandleReq_CMD = 60;
            object.ClubSUserNoticeHandleResp_CMD = 61;
        }
        if (message.Main_CMD != null && message.hasOwnProperty("Main_CMD"))
            object.Main_CMD = message.Main_CMD;
        if (message.LogonReq_CMD != null && message.hasOwnProperty("LogonReq_CMD"))
            object.LogonReq_CMD = message.LogonReq_CMD;
        if (message.LogonRsp_CMD != null && message.hasOwnProperty("LogonRsp_CMD"))
            object.LogonRsp_CMD = message.LogonRsp_CMD;
        if (message.GameListNotify_CMD != null && message.hasOwnProperty("GameListNotify_CMD"))
            object.GameListNotify_CMD = message.GameListNotify_CMD;
        if (message.RoomListReq_CMD != null && message.hasOwnProperty("RoomListReq_CMD"))
            object.RoomListReq_CMD = message.RoomListReq_CMD;
        if (message.RoomListRsp_CMD != null && message.hasOwnProperty("RoomListRsp_CMD"))
            object.RoomListRsp_CMD = message.RoomListRsp_CMD;
        if (message.TreasureReq_CMD != null && message.hasOwnProperty("TreasureReq_CMD"))
            object.TreasureReq_CMD = message.TreasureReq_CMD;
        if (message.TreasureRsp_CMD != null && message.hasOwnProperty("TreasureRsp_CMD"))
            object.TreasureRsp_CMD = message.TreasureRsp_CMD;
        if (message.EnterBankReq_CMD != null && message.hasOwnProperty("EnterBankReq_CMD"))
            object.EnterBankReq_CMD = message.EnterBankReq_CMD;
        if (message.EnterBankRsp_CMD != null && message.hasOwnProperty("EnterBankRsp_CMD"))
            object.EnterBankRsp_CMD = message.EnterBankRsp_CMD;
        if (message.BankUnlockReq_CMD != null && message.hasOwnProperty("BankUnlockReq_CMD"))
            object.BankUnlockReq_CMD = message.BankUnlockReq_CMD;
        if (message.BankUnlockRsp_CMD != null && message.hasOwnProperty("BankUnlockRsp_CMD"))
            object.BankUnlockRsp_CMD = message.BankUnlockRsp_CMD;
        if (message.BankAccessReq_CMD != null && message.hasOwnProperty("BankAccessReq_CMD"))
            object.BankAccessReq_CMD = message.BankAccessReq_CMD;
        if (message.BankAccessRsp_CMD != null && message.hasOwnProperty("BankAccessRsp_CMD"))
            object.BankAccessRsp_CMD = message.BankAccessRsp_CMD;
        if (message.BankPasswordChangeReq_CMD != null && message.hasOwnProperty("BankPasswordChangeReq_CMD"))
            object.BankPasswordChangeReq_CMD = message.BankPasswordChangeReq_CMD;
        if (message.BankPasswordChangeRsp_CMD != null && message.hasOwnProperty("BankPasswordChangeRsp_CMD"))
            object.BankPasswordChangeRsp_CMD = message.BankPasswordChangeRsp_CMD;
        if (message.BankAccessDetailReq_CMD != null && message.hasOwnProperty("BankAccessDetailReq_CMD"))
            object.BankAccessDetailReq_CMD = message.BankAccessDetailReq_CMD;
        if (message.BankAccessDetailRsp_CMD != null && message.hasOwnProperty("BankAccessDetailRsp_CMD"))
            object.BankAccessDetailRsp_CMD = message.BankAccessDetailRsp_CMD;
        if (message.PaijuRecordReq_CMD != null && message.hasOwnProperty("PaijuRecordReq_CMD"))
            object.PaijuRecordReq_CMD = message.PaijuRecordReq_CMD;
        if (message.PaijuRecordRsp_CMD != null && message.hasOwnProperty("PaijuRecordRsp_CMD"))
            object.PaijuRecordRsp_CMD = message.PaijuRecordRsp_CMD;
        if (message.BeforeLoadScenceReq_CMD != null && message.hasOwnProperty("BeforeLoadScenceReq_CMD"))
            object.BeforeLoadScenceReq_CMD = message.BeforeLoadScenceReq_CMD;
        if (message.BeforeLoadScenceRsp_CMD != null && message.hasOwnProperty("BeforeLoadScenceRsp_CMD"))
            object.BeforeLoadScenceRsp_CMD = message.BeforeLoadScenceRsp_CMD;
        if (message.SUB_REQ_UPDATE_USERINFO != null && message.hasOwnProperty("SUB_REQ_UPDATE_USERINFO"))
            object.SUB_REQ_UPDATE_USERINFO = message.SUB_REQ_UPDATE_USERINFO;
        if (message.SUB_REP_UPDATE_USERINFO != null && message.hasOwnProperty("SUB_REP_UPDATE_USERINFO"))
            object.SUB_REP_UPDATE_USERINFO = message.SUB_REP_UPDATE_USERINFO;
        if (message.SUB_REQ_GET_USER_INFO != null && message.hasOwnProperty("SUB_REQ_GET_USER_INFO"))
            object.SUB_REQ_GET_USER_INFO = message.SUB_REQ_GET_USER_INFO;
        if (message.SUB_REP_GET_USER_INFO != null && message.hasOwnProperty("SUB_REP_GET_USER_INFO"))
            object.SUB_REP_GET_USER_INFO = message.SUB_REP_GET_USER_INFO;
        if (message.SUB_REQ_GET_ZBTABLEID != null && message.hasOwnProperty("SUB_REQ_GET_ZBTABLEID"))
            object.SUB_REQ_GET_ZBTABLEID = message.SUB_REQ_GET_ZBTABLEID;
        if (message.SUB_REP_GET_ZBTABLEID != null && message.hasOwnProperty("SUB_REP_GET_ZBTABLEID"))
            object.SUB_REP_GET_ZBTABLEID = message.SUB_REP_GET_ZBTABLEID;
        if (message.PaijuDetailReq_CMD != null && message.hasOwnProperty("PaijuDetailReq_CMD"))
            object.PaijuDetailReq_CMD = message.PaijuDetailReq_CMD;
        if (message.PaijuDetailRsp_CMD != null && message.hasOwnProperty("PaijuDetailRsp_CMD"))
            object.PaijuDetailRsp_CMD = message.PaijuDetailRsp_CMD;
        if (message.HelpInfoReq_CMD != null && message.hasOwnProperty("HelpInfoReq_CMD"))
            object.HelpInfoReq_CMD = message.HelpInfoReq_CMD;
        if (message.HelpInfoRsp_CMD != null && message.hasOwnProperty("HelpInfoRsp_CMD"))
            object.HelpInfoRsp_CMD = message.HelpInfoRsp_CMD;
        if (message.OnlinePeopleReq_CMD != null && message.hasOwnProperty("OnlinePeopleReq_CMD"))
            object.OnlinePeopleReq_CMD = message.OnlinePeopleReq_CMD;
        if (message.NoticeOnlinePeople_CMD != null && message.hasOwnProperty("NoticeOnlinePeople_CMD"))
            object.NoticeOnlinePeople_CMD = message.NoticeOnlinePeople_CMD;
        if (message.LobbyDeZhouRecordReq_CMD != null && message.hasOwnProperty("LobbyDeZhouRecordReq_CMD"))
            object.LobbyDeZhouRecordReq_CMD = message.LobbyDeZhouRecordReq_CMD;
        if (message.LobbyDeZhouRecordRsp_CMD != null && message.hasOwnProperty("LobbyDeZhouRecordRsp_CMD"))
            object.LobbyDeZhouRecordRsp_CMD = message.LobbyDeZhouRecordRsp_CMD;
        if (message.LobbyDeZhouRecordDetailReq_CMD != null && message.hasOwnProperty("LobbyDeZhouRecordDetailReq_CMD"))
            object.LobbyDeZhouRecordDetailReq_CMD = message.LobbyDeZhouRecordDetailReq_CMD;
        if (message.LobbyDeZhouRecordDetailRsp_CMD != null && message.hasOwnProperty("LobbyDeZhouRecordDetailRsp_CMD"))
            object.LobbyDeZhouRecordDetailRsp_CMD = message.LobbyDeZhouRecordDetailRsp_CMD;
        if (message.BrLiveGameRecordReq_CMD != null && message.hasOwnProperty("BrLiveGameRecordReq_CMD"))
            object.BrLiveGameRecordReq_CMD = message.BrLiveGameRecordReq_CMD;
        if (message.BrLiveGameRecordRsp_CMD != null && message.hasOwnProperty("BrLiveGameRecordRsp_CMD"))
            object.BrLiveGameRecordRsp_CMD = message.BrLiveGameRecordRsp_CMD;
        if (message.BrLiveGameDetailReq_CMD != null && message.hasOwnProperty("BrLiveGameDetailReq_CMD"))
            object.BrLiveGameDetailReq_CMD = message.BrLiveGameDetailReq_CMD;
        if (message.BrLiveGameDetailRsp_CMD != null && message.hasOwnProperty("BrLiveGameDetailRsp_CMD"))
            object.BrLiveGameDetailRsp_CMD = message.BrLiveGameDetailRsp_CMD;
        if (message.UserGoldLessStandardNotify_CMD != null && message.hasOwnProperty("UserGoldLessStandardNotify_CMD"))
            object.UserGoldLessStandardNotify_CMD = message.UserGoldLessStandardNotify_CMD;
        if (message.BlockChianListInfoReq_CMD != null && message.hasOwnProperty("BlockChianListInfoReq_CMD"))
            object.BlockChianListInfoReq_CMD = message.BlockChianListInfoReq_CMD;
        if (message.BlockChianListInfoRep_CMD != null && message.hasOwnProperty("BlockChianListInfoRep_CMD"))
            object.BlockChianListInfoRep_CMD = message.BlockChianListInfoRep_CMD;
        if (message.AccountCloseReq_CMD != null && message.hasOwnProperty("AccountCloseReq_CMD"))
            object.AccountCloseReq_CMD = message.AccountCloseReq_CMD;
        if (message.AccountCloseRsp_CMD != null && message.hasOwnProperty("AccountCloseRsp_CMD"))
            object.AccountCloseRsp_CMD = message.AccountCloseRsp_CMD;
        if (message.AccountPayURLReq_CMD != null && message.hasOwnProperty("AccountPayURLReq_CMD"))
            object.AccountPayURLReq_CMD = message.AccountPayURLReq_CMD;
        if (message.AccountPayURLRsp_CMD != null && message.hasOwnProperty("AccountPayURLRsp_CMD"))
            object.AccountPayURLRsp_CMD = message.AccountPayURLRsp_CMD;
        if (message.AccountPayInfoReq_CMD != null && message.hasOwnProperty("AccountPayInfoReq_CMD"))
            object.AccountPayInfoReq_CMD = message.AccountPayInfoReq_CMD;
        if (message.AccountPayInfoRsp_CMD != null && message.hasOwnProperty("AccountPayInfoRsp_CMD"))
            object.AccountPayInfoRsp_CMD = message.AccountPayInfoRsp_CMD;
        if (message.AccountWithdrawalReq_CMD != null && message.hasOwnProperty("AccountWithdrawalReq_CMD"))
            object.AccountWithdrawalReq_CMD = message.AccountWithdrawalReq_CMD;
        if (message.AccountWithdrawalRsp_CMD != null && message.hasOwnProperty("AccountWithdrawalRsp_CMD"))
            object.AccountWithdrawalRsp_CMD = message.AccountWithdrawalRsp_CMD;
        if (message.AccountWithdrawalViewReq_CMD != null && message.hasOwnProperty("AccountWithdrawalViewReq_CMD"))
            object.AccountWithdrawalViewReq_CMD = message.AccountWithdrawalViewReq_CMD;
        if (message.AccountWithdrawalViewRsp_CMD != null && message.hasOwnProperty("AccountWithdrawalViewRsp_CMD"))
            object.AccountWithdrawalViewRsp_CMD = message.AccountWithdrawalViewRsp_CMD;
        if (message.ClubSUserNoticeReq_CMD != null && message.hasOwnProperty("ClubSUserNoticeReq_CMD"))
            object.ClubSUserNoticeReq_CMD = message.ClubSUserNoticeReq_CMD;
        if (message.ClubSUserNoticeResp_CMD != null && message.hasOwnProperty("ClubSUserNoticeResp_CMD"))
            object.ClubSUserNoticeResp_CMD = message.ClubSUserNoticeResp_CMD;
        if (message.ClubSUserNoticeHandleReq_CMD != null && message.hasOwnProperty("ClubSUserNoticeHandleReq_CMD"))
            object.ClubSUserNoticeHandleReq_CMD = message.ClubSUserNoticeHandleReq_CMD;
        if (message.ClubSUserNoticeHandleResp_CMD != null && message.hasOwnProperty("ClubSUserNoticeHandleResp_CMD"))
            object.ClubSUserNoticeHandleResp_CMD = message.ClubSUserNoticeHandleResp_CMD;
        return object;
    };

    /**
     * Converts this Lobby_Proto to JSON.
     * @function toJSON
     * @memberof Lobby_Proto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Lobby_Proto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Lobby_Proto;
})();

$root.OnlinePeopleReq = (function() {

    /**
     * Properties of an OnlinePeopleReq.
     * @exports IOnlinePeopleReq
     * @interface IOnlinePeopleReq
     * @property {number|null} [nUserID] OnlinePeopleReq nUserID
     */

    /**
     * Constructs a new OnlinePeopleReq.
     * @exports OnlinePeopleReq
     * @classdesc Represents an OnlinePeopleReq.
     * @implements IOnlinePeopleReq
     * @constructor
     * @param {IOnlinePeopleReq=} [properties] Properties to set
     */
    function OnlinePeopleReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OnlinePeopleReq nUserID.
     * @member {number} nUserID
     * @memberof OnlinePeopleReq
     * @instance
     */
    OnlinePeopleReq.prototype.nUserID = 0;

    /**
     * Creates a new OnlinePeopleReq instance using the specified properties.
     * @function create
     * @memberof OnlinePeopleReq
     * @static
     * @param {IOnlinePeopleReq=} [properties] Properties to set
     * @returns {OnlinePeopleReq} OnlinePeopleReq instance
     */
    OnlinePeopleReq.create = function create(properties) {
        return new OnlinePeopleReq(properties);
    };

    /**
     * Encodes the specified OnlinePeopleReq message. Does not implicitly {@link OnlinePeopleReq.verify|verify} messages.
     * @function encode
     * @memberof OnlinePeopleReq
     * @static
     * @param {IOnlinePeopleReq} message OnlinePeopleReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OnlinePeopleReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nUserID != null && Object.hasOwnProperty.call(message, "nUserID"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        return writer;
    };

    /**
     * Encodes the specified OnlinePeopleReq message, length delimited. Does not implicitly {@link OnlinePeopleReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OnlinePeopleReq
     * @static
     * @param {IOnlinePeopleReq} message OnlinePeopleReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OnlinePeopleReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OnlinePeopleReq message from the specified reader or buffer.
     * @function decode
     * @memberof OnlinePeopleReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OnlinePeopleReq} OnlinePeopleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OnlinePeopleReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OnlinePeopleReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserID = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OnlinePeopleReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OnlinePeopleReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OnlinePeopleReq} OnlinePeopleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OnlinePeopleReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OnlinePeopleReq message.
     * @function verify
     * @memberof OnlinePeopleReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OnlinePeopleReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            if (!$util.isInteger(message.nUserID))
                return "nUserID: integer expected";
        return null;
    };

    /**
     * Creates an OnlinePeopleReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OnlinePeopleReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OnlinePeopleReq} OnlinePeopleReq
     */
    OnlinePeopleReq.fromObject = function fromObject(object) {
        if (object instanceof $root.OnlinePeopleReq)
            return object;
        var message = new $root.OnlinePeopleReq();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        return message;
    };

    /**
     * Creates a plain object from an OnlinePeopleReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OnlinePeopleReq
     * @static
     * @param {OnlinePeopleReq} message OnlinePeopleReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OnlinePeopleReq.toObject = function toObject(message, options) {
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
     * Converts this OnlinePeopleReq to JSON.
     * @function toJSON
     * @memberof OnlinePeopleReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OnlinePeopleReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return OnlinePeopleReq;
})();

$root.NoticeOnlinePeople = (function() {

    /**
     * Properties of a NoticeOnlinePeople.
     * @exports INoticeOnlinePeople
     * @interface INoticeOnlinePeople
     * @property {Array.<NoticeOnlinePeople.IgetOnLineItem>|null} [arrPeople] NoticeOnlinePeople arrPeople
     */

    /**
     * Constructs a new NoticeOnlinePeople.
     * @exports NoticeOnlinePeople
     * @classdesc Represents a NoticeOnlinePeople.
     * @implements INoticeOnlinePeople
     * @constructor
     * @param {INoticeOnlinePeople=} [properties] Properties to set
     */
    function NoticeOnlinePeople(properties) {
        this.arrPeople = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NoticeOnlinePeople arrPeople.
     * @member {Array.<NoticeOnlinePeople.IgetOnLineItem>} arrPeople
     * @memberof NoticeOnlinePeople
     * @instance
     */
    NoticeOnlinePeople.prototype.arrPeople = $util.emptyArray;

    /**
     * Creates a new NoticeOnlinePeople instance using the specified properties.
     * @function create
     * @memberof NoticeOnlinePeople
     * @static
     * @param {INoticeOnlinePeople=} [properties] Properties to set
     * @returns {NoticeOnlinePeople} NoticeOnlinePeople instance
     */
    NoticeOnlinePeople.create = function create(properties) {
        return new NoticeOnlinePeople(properties);
    };

    /**
     * Encodes the specified NoticeOnlinePeople message. Does not implicitly {@link NoticeOnlinePeople.verify|verify} messages.
     * @function encode
     * @memberof NoticeOnlinePeople
     * @static
     * @param {INoticeOnlinePeople} message NoticeOnlinePeople message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NoticeOnlinePeople.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrPeople != null && message.arrPeople.length)
            for (var i = 0; i < message.arrPeople.length; ++i)
                $root.NoticeOnlinePeople.getOnLineItem.encode(message.arrPeople[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NoticeOnlinePeople message, length delimited. Does not implicitly {@link NoticeOnlinePeople.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NoticeOnlinePeople
     * @static
     * @param {INoticeOnlinePeople} message NoticeOnlinePeople message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NoticeOnlinePeople.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NoticeOnlinePeople message from the specified reader or buffer.
     * @function decode
     * @memberof NoticeOnlinePeople
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NoticeOnlinePeople} NoticeOnlinePeople
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NoticeOnlinePeople.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NoticeOnlinePeople();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrPeople && message.arrPeople.length))
                    message.arrPeople = [];
                message.arrPeople.push($root.NoticeOnlinePeople.getOnLineItem.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NoticeOnlinePeople message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NoticeOnlinePeople
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NoticeOnlinePeople} NoticeOnlinePeople
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NoticeOnlinePeople.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NoticeOnlinePeople message.
     * @function verify
     * @memberof NoticeOnlinePeople
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NoticeOnlinePeople.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrPeople != null && message.hasOwnProperty("arrPeople")) {
            if (!Array.isArray(message.arrPeople))
                return "arrPeople: array expected";
            for (var i = 0; i < message.arrPeople.length; ++i) {
                var error = $root.NoticeOnlinePeople.getOnLineItem.verify(message.arrPeople[i]);
                if (error)
                    return "arrPeople." + error;
            }
        }
        return null;
    };

    /**
     * Creates a NoticeOnlinePeople message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NoticeOnlinePeople
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NoticeOnlinePeople} NoticeOnlinePeople
     */
    NoticeOnlinePeople.fromObject = function fromObject(object) {
        if (object instanceof $root.NoticeOnlinePeople)
            return object;
        var message = new $root.NoticeOnlinePeople();
        if (object.arrPeople) {
            if (!Array.isArray(object.arrPeople))
                throw TypeError(".NoticeOnlinePeople.arrPeople: array expected");
            message.arrPeople = [];
            for (var i = 0; i < object.arrPeople.length; ++i) {
                if (typeof object.arrPeople[i] !== "object")
                    throw TypeError(".NoticeOnlinePeople.arrPeople: object expected");
                message.arrPeople[i] = $root.NoticeOnlinePeople.getOnLineItem.fromObject(object.arrPeople[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a NoticeOnlinePeople message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NoticeOnlinePeople
     * @static
     * @param {NoticeOnlinePeople} message NoticeOnlinePeople
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NoticeOnlinePeople.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrPeople = [];
        if (message.arrPeople && message.arrPeople.length) {
            object.arrPeople = [];
            for (var j = 0; j < message.arrPeople.length; ++j)
                object.arrPeople[j] = $root.NoticeOnlinePeople.getOnLineItem.toObject(message.arrPeople[j], options);
        }
        return object;
    };

    /**
     * Converts this NoticeOnlinePeople to JSON.
     * @function toJSON
     * @memberof NoticeOnlinePeople
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NoticeOnlinePeople.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    NoticeOnlinePeople.getOnLineItem = (function() {

        /**
         * Properties of a getOnLineItem.
         * @memberof NoticeOnlinePeople
         * @interface IgetOnLineItem
         * @property {number|null} [nGameID] getOnLineItem nGameID
         * @property {number|null} [nPeople] getOnLineItem nPeople
         */

        /**
         * Constructs a new getOnLineItem.
         * @memberof NoticeOnlinePeople
         * @classdesc Represents a getOnLineItem.
         * @implements IgetOnLineItem
         * @constructor
         * @param {NoticeOnlinePeople.IgetOnLineItem=} [properties] Properties to set
         */
        function getOnLineItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * getOnLineItem nGameID.
         * @member {number} nGameID
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @instance
         */
        getOnLineItem.prototype.nGameID = 0;

        /**
         * getOnLineItem nPeople.
         * @member {number} nPeople
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @instance
         */
        getOnLineItem.prototype.nPeople = 0;

        /**
         * Creates a new getOnLineItem instance using the specified properties.
         * @function create
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {NoticeOnlinePeople.IgetOnLineItem=} [properties] Properties to set
         * @returns {NoticeOnlinePeople.getOnLineItem} getOnLineItem instance
         */
        getOnLineItem.create = function create(properties) {
            return new getOnLineItem(properties);
        };

        /**
         * Encodes the specified getOnLineItem message. Does not implicitly {@link NoticeOnlinePeople.getOnLineItem.verify|verify} messages.
         * @function encode
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {NoticeOnlinePeople.IgetOnLineItem} message getOnLineItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        getOnLineItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nGameID != null && Object.hasOwnProperty.call(message, "nGameID"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameID);
            if (message.nPeople != null && Object.hasOwnProperty.call(message, "nPeople"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nPeople);
            return writer;
        };

        /**
         * Encodes the specified getOnLineItem message, length delimited. Does not implicitly {@link NoticeOnlinePeople.getOnLineItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {NoticeOnlinePeople.IgetOnLineItem} message getOnLineItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        getOnLineItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a getOnLineItem message from the specified reader or buffer.
         * @function decode
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NoticeOnlinePeople.getOnLineItem} getOnLineItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        getOnLineItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NoticeOnlinePeople.getOnLineItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nGameID = reader.int32();
                    break;
                case 2:
                    message.nPeople = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a getOnLineItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NoticeOnlinePeople.getOnLineItem} getOnLineItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        getOnLineItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a getOnLineItem message.
         * @function verify
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        getOnLineItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nGameID != null && message.hasOwnProperty("nGameID"))
                if (!$util.isInteger(message.nGameID))
                    return "nGameID: integer expected";
            if (message.nPeople != null && message.hasOwnProperty("nPeople"))
                if (!$util.isInteger(message.nPeople))
                    return "nPeople: integer expected";
            return null;
        };

        /**
         * Creates a getOnLineItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NoticeOnlinePeople.getOnLineItem} getOnLineItem
         */
        getOnLineItem.fromObject = function fromObject(object) {
            if (object instanceof $root.NoticeOnlinePeople.getOnLineItem)
                return object;
            var message = new $root.NoticeOnlinePeople.getOnLineItem();
            if (object.nGameID != null)
                message.nGameID = object.nGameID | 0;
            if (object.nPeople != null)
                message.nPeople = object.nPeople | 0;
            return message;
        };

        /**
         * Creates a plain object from a getOnLineItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @static
         * @param {NoticeOnlinePeople.getOnLineItem} message getOnLineItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        getOnLineItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nGameID = 0;
                object.nPeople = 0;
            }
            if (message.nGameID != null && message.hasOwnProperty("nGameID"))
                object.nGameID = message.nGameID;
            if (message.nPeople != null && message.hasOwnProperty("nPeople"))
                object.nPeople = message.nPeople;
            return object;
        };

        /**
         * Converts this getOnLineItem to JSON.
         * @function toJSON
         * @memberof NoticeOnlinePeople.getOnLineItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        getOnLineItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return getOnLineItem;
    })();

    return NoticeOnlinePeople;
})();

$root.HelpInfoReq = (function() {

    /**
     * Properties of a HelpInfoReq.
     * @exports IHelpInfoReq
     * @interface IHelpInfoReq
     * @property {number} nUserID HelpInfoReq nUserID
     * @property {number|null} [nGameID] HelpInfoReq nGameID
     */

    /**
     * Constructs a new HelpInfoReq.
     * @exports HelpInfoReq
     * @classdesc Represents a HelpInfoReq.
     * @implements IHelpInfoReq
     * @constructor
     * @param {IHelpInfoReq=} [properties] Properties to set
     */
    function HelpInfoReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HelpInfoReq nUserID.
     * @member {number} nUserID
     * @memberof HelpInfoReq
     * @instance
     */
    HelpInfoReq.prototype.nUserID = 0;

    /**
     * HelpInfoReq nGameID.
     * @member {number} nGameID
     * @memberof HelpInfoReq
     * @instance
     */
    HelpInfoReq.prototype.nGameID = 0;

    /**
     * Creates a new HelpInfoReq instance using the specified properties.
     * @function create
     * @memberof HelpInfoReq
     * @static
     * @param {IHelpInfoReq=} [properties] Properties to set
     * @returns {HelpInfoReq} HelpInfoReq instance
     */
    HelpInfoReq.create = function create(properties) {
        return new HelpInfoReq(properties);
    };

    /**
     * Encodes the specified HelpInfoReq message. Does not implicitly {@link HelpInfoReq.verify|verify} messages.
     * @function encode
     * @memberof HelpInfoReq
     * @static
     * @param {IHelpInfoReq} message HelpInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelpInfoReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        if (message.nGameID != null && Object.hasOwnProperty.call(message, "nGameID"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nGameID);
        return writer;
    };

    /**
     * Encodes the specified HelpInfoReq message, length delimited. Does not implicitly {@link HelpInfoReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HelpInfoReq
     * @static
     * @param {IHelpInfoReq} message HelpInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelpInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HelpInfoReq message from the specified reader or buffer.
     * @function decode
     * @memberof HelpInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HelpInfoReq} HelpInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelpInfoReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HelpInfoReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserID = reader.int32();
                break;
            case 2:
                message.nGameID = reader.int32();
                break;
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
     * Decodes a HelpInfoReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HelpInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HelpInfoReq} HelpInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelpInfoReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HelpInfoReq message.
     * @function verify
     * @memberof HelpInfoReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HelpInfoReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        if (message.nGameID != null && message.hasOwnProperty("nGameID"))
            if (!$util.isInteger(message.nGameID))
                return "nGameID: integer expected";
        return null;
    };

    /**
     * Creates a HelpInfoReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HelpInfoReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HelpInfoReq} HelpInfoReq
     */
    HelpInfoReq.fromObject = function fromObject(object) {
        if (object instanceof $root.HelpInfoReq)
            return object;
        var message = new $root.HelpInfoReq();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        if (object.nGameID != null)
            message.nGameID = object.nGameID | 0;
        return message;
    };

    /**
     * Creates a plain object from a HelpInfoReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HelpInfoReq
     * @static
     * @param {HelpInfoReq} message HelpInfoReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HelpInfoReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserID = 0;
            object.nGameID = 0;
        }
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        if (message.nGameID != null && message.hasOwnProperty("nGameID"))
            object.nGameID = message.nGameID;
        return object;
    };

    /**
     * Converts this HelpInfoReq to JSON.
     * @function toJSON
     * @memberof HelpInfoReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HelpInfoReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return HelpInfoReq;
})();

$root.HelpInfoRsp = (function() {

    /**
     * Properties of a HelpInfoRsp.
     * @exports IHelpInfoRsp
     * @interface IHelpInfoRsp
     * @property {string|null} [sUiType] HelpInfoRsp sUiType
     * @property {string|null} [nInfoDetail] HelpInfoRsp nInfoDetail
     */

    /**
     * Constructs a new HelpInfoRsp.
     * @exports HelpInfoRsp
     * @classdesc Represents a HelpInfoRsp.
     * @implements IHelpInfoRsp
     * @constructor
     * @param {IHelpInfoRsp=} [properties] Properties to set
     */
    function HelpInfoRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HelpInfoRsp sUiType.
     * @member {string} sUiType
     * @memberof HelpInfoRsp
     * @instance
     */
    HelpInfoRsp.prototype.sUiType = "";

    /**
     * HelpInfoRsp nInfoDetail.
     * @member {string} nInfoDetail
     * @memberof HelpInfoRsp
     * @instance
     */
    HelpInfoRsp.prototype.nInfoDetail = "";

    /**
     * Creates a new HelpInfoRsp instance using the specified properties.
     * @function create
     * @memberof HelpInfoRsp
     * @static
     * @param {IHelpInfoRsp=} [properties] Properties to set
     * @returns {HelpInfoRsp} HelpInfoRsp instance
     */
    HelpInfoRsp.create = function create(properties) {
        return new HelpInfoRsp(properties);
    };

    /**
     * Encodes the specified HelpInfoRsp message. Does not implicitly {@link HelpInfoRsp.verify|verify} messages.
     * @function encode
     * @memberof HelpInfoRsp
     * @static
     * @param {IHelpInfoRsp} message HelpInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelpInfoRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sUiType != null && Object.hasOwnProperty.call(message, "sUiType"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sUiType);
        if (message.nInfoDetail != null && Object.hasOwnProperty.call(message, "nInfoDetail"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.nInfoDetail);
        return writer;
    };

    /**
     * Encodes the specified HelpInfoRsp message, length delimited. Does not implicitly {@link HelpInfoRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HelpInfoRsp
     * @static
     * @param {IHelpInfoRsp} message HelpInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelpInfoRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HelpInfoRsp message from the specified reader or buffer.
     * @function decode
     * @memberof HelpInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HelpInfoRsp} HelpInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelpInfoRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HelpInfoRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sUiType = reader.string();
                break;
            case 2:
                message.nInfoDetail = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HelpInfoRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HelpInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HelpInfoRsp} HelpInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelpInfoRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HelpInfoRsp message.
     * @function verify
     * @memberof HelpInfoRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HelpInfoRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            if (!$util.isString(message.sUiType))
                return "sUiType: string expected";
        if (message.nInfoDetail != null && message.hasOwnProperty("nInfoDetail"))
            if (!$util.isString(message.nInfoDetail))
                return "nInfoDetail: string expected";
        return null;
    };

    /**
     * Creates a HelpInfoRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HelpInfoRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HelpInfoRsp} HelpInfoRsp
     */
    HelpInfoRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.HelpInfoRsp)
            return object;
        var message = new $root.HelpInfoRsp();
        if (object.sUiType != null)
            message.sUiType = String(object.sUiType);
        if (object.nInfoDetail != null)
            message.nInfoDetail = String(object.nInfoDetail);
        return message;
    };

    /**
     * Creates a plain object from a HelpInfoRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HelpInfoRsp
     * @static
     * @param {HelpInfoRsp} message HelpInfoRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HelpInfoRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sUiType = "";
            object.nInfoDetail = "";
        }
        if (message.sUiType != null && message.hasOwnProperty("sUiType"))
            object.sUiType = message.sUiType;
        if (message.nInfoDetail != null && message.hasOwnProperty("nInfoDetail"))
            object.nInfoDetail = message.nInfoDetail;
        return object;
    };

    /**
     * Converts this HelpInfoRsp to JSON.
     * @function toJSON
     * @memberof HelpInfoRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HelpInfoRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return HelpInfoRsp;
})();

$root.LogonReq = (function() {

    /**
     * Properties of a LogonReq.
     * @exports ILogonReq
     * @interface ILogonReq
     * @property {number} nUserID LogonReq nUserID
     */

    /**
     * Constructs a new LogonReq.
     * @exports LogonReq
     * @classdesc Represents a LogonReq.
     * @implements ILogonReq
     * @constructor
     * @param {ILogonReq=} [properties] Properties to set
     */
    function LogonReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogonReq nUserID.
     * @member {number} nUserID
     * @memberof LogonReq
     * @instance
     */
    LogonReq.prototype.nUserID = 0;

    /**
     * Creates a new LogonReq instance using the specified properties.
     * @function create
     * @memberof LogonReq
     * @static
     * @param {ILogonReq=} [properties] Properties to set
     * @returns {LogonReq} LogonReq instance
     */
    LogonReq.create = function create(properties) {
        return new LogonReq(properties);
    };

    /**
     * Encodes the specified LogonReq message. Does not implicitly {@link LogonReq.verify|verify} messages.
     * @function encode
     * @memberof LogonReq
     * @static
     * @param {ILogonReq} message LogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        return writer;
    };

    /**
     * Encodes the specified LogonReq message, length delimited. Does not implicitly {@link LogonReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogonReq
     * @static
     * @param {ILogonReq} message LogonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogonReq message from the specified reader or buffer.
     * @function decode
     * @memberof LogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogonReq} LogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserID = reader.int32();
                break;
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
     * Decodes a LogonReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogonReq} LogonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogonReq message.
     * @function verify
     * @memberof LogonReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogonReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        return null;
    };

    /**
     * Creates a LogonReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogonReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogonReq} LogonReq
     */
    LogonReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LogonReq)
            return object;
        var message = new $root.LogonReq();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        return message;
    };

    /**
     * Creates a plain object from a LogonReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogonReq
     * @static
     * @param {LogonReq} message LogonReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogonReq.toObject = function toObject(message, options) {
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
     * Converts this LogonReq to JSON.
     * @function toJSON
     * @memberof LogonReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogonReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LogonReq;
})();

$root.LogonRsp = (function() {

    /**
     * Properties of a LogonRsp.
     * @exports ILogonRsp
     * @interface ILogonRsp
     * @property {number} nResult LogonRsp nResult
     * @property {LogonRsp.IUserInfo|null} [tUserInfo] LogonRsp tUserInfo
     * @property {IGameListNotify|null} [tGameList] LogonRsp tGameList
     * @property {LogonRsp.ICurrentPlaying|null} [tCurrentPlay] LogonRsp tCurrentPlay
     * @property {number|null} [nLastClubId] LogonRsp nLastClubId
     * @property {string|null} [tExtraConfigureInfo] LogonRsp tExtraConfigureInfo
     */

    /**
     * Constructs a new LogonRsp.
     * @exports LogonRsp
     * @classdesc Represents a LogonRsp.
     * @implements ILogonRsp
     * @constructor
     * @param {ILogonRsp=} [properties] Properties to set
     */
    function LogonRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LogonRsp nResult.
     * @member {number} nResult
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.nResult = 0;

    /**
     * LogonRsp tUserInfo.
     * @member {LogonRsp.IUserInfo|null|undefined} tUserInfo
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.tUserInfo = null;

    /**
     * LogonRsp tGameList.
     * @member {IGameListNotify|null|undefined} tGameList
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.tGameList = null;

    /**
     * LogonRsp tCurrentPlay.
     * @member {LogonRsp.ICurrentPlaying|null|undefined} tCurrentPlay
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.tCurrentPlay = null;

    /**
     * LogonRsp nLastClubId.
     * @member {number} nLastClubId
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.nLastClubId = 0;

    /**
     * LogonRsp tExtraConfigureInfo.
     * @member {string} tExtraConfigureInfo
     * @memberof LogonRsp
     * @instance
     */
    LogonRsp.prototype.tExtraConfigureInfo = "";

    /**
     * Creates a new LogonRsp instance using the specified properties.
     * @function create
     * @memberof LogonRsp
     * @static
     * @param {ILogonRsp=} [properties] Properties to set
     * @returns {LogonRsp} LogonRsp instance
     */
    LogonRsp.create = function create(properties) {
        return new LogonRsp(properties);
    };

    /**
     * Encodes the specified LogonRsp message. Does not implicitly {@link LogonRsp.verify|verify} messages.
     * @function encode
     * @memberof LogonRsp
     * @static
     * @param {ILogonRsp} message LogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.tUserInfo != null && Object.hasOwnProperty.call(message, "tUserInfo"))
            $root.LogonRsp.UserInfo.encode(message.tUserInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.tGameList != null && Object.hasOwnProperty.call(message, "tGameList"))
            $root.GameListNotify.encode(message.tGameList, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.tCurrentPlay != null && Object.hasOwnProperty.call(message, "tCurrentPlay"))
            $root.LogonRsp.CurrentPlaying.encode(message.tCurrentPlay, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.nLastClubId != null && Object.hasOwnProperty.call(message, "nLastClubId"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nLastClubId);
        if (message.tExtraConfigureInfo != null && Object.hasOwnProperty.call(message, "tExtraConfigureInfo"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.tExtraConfigureInfo);
        return writer;
    };

    /**
     * Encodes the specified LogonRsp message, length delimited. Does not implicitly {@link LogonRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LogonRsp
     * @static
     * @param {ILogonRsp} message LogonRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LogonRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LogonRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LogonRsp} LogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.tUserInfo = $root.LogonRsp.UserInfo.decode(reader, reader.uint32());
                break;
            case 3:
                message.tGameList = $root.GameListNotify.decode(reader, reader.uint32());
                break;
            case 4:
                message.tCurrentPlay = $root.LogonRsp.CurrentPlaying.decode(reader, reader.uint32());
                break;
            case 5:
                message.nLastClubId = reader.int32();
                break;
            case 6:
                message.tExtraConfigureInfo = reader.string();
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
     * Decodes a LogonRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LogonRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LogonRsp} LogonRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LogonRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LogonRsp message.
     * @function verify
     * @memberof LogonRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LogonRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.tUserInfo != null && message.hasOwnProperty("tUserInfo")) {
            var error = $root.LogonRsp.UserInfo.verify(message.tUserInfo);
            if (error)
                return "tUserInfo." + error;
        }
        if (message.tGameList != null && message.hasOwnProperty("tGameList")) {
            var error = $root.GameListNotify.verify(message.tGameList);
            if (error)
                return "tGameList." + error;
        }
        if (message.tCurrentPlay != null && message.hasOwnProperty("tCurrentPlay")) {
            var error = $root.LogonRsp.CurrentPlaying.verify(message.tCurrentPlay);
            if (error)
                return "tCurrentPlay." + error;
        }
        if (message.nLastClubId != null && message.hasOwnProperty("nLastClubId"))
            if (!$util.isInteger(message.nLastClubId))
                return "nLastClubId: integer expected";
        if (message.tExtraConfigureInfo != null && message.hasOwnProperty("tExtraConfigureInfo"))
            if (!$util.isString(message.tExtraConfigureInfo))
                return "tExtraConfigureInfo: string expected";
        return null;
    };

    /**
     * Creates a LogonRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LogonRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LogonRsp} LogonRsp
     */
    LogonRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LogonRsp)
            return object;
        var message = new $root.LogonRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.tUserInfo != null) {
            if (typeof object.tUserInfo !== "object")
                throw TypeError(".LogonRsp.tUserInfo: object expected");
            message.tUserInfo = $root.LogonRsp.UserInfo.fromObject(object.tUserInfo);
        }
        if (object.tGameList != null) {
            if (typeof object.tGameList !== "object")
                throw TypeError(".LogonRsp.tGameList: object expected");
            message.tGameList = $root.GameListNotify.fromObject(object.tGameList);
        }
        if (object.tCurrentPlay != null) {
            if (typeof object.tCurrentPlay !== "object")
                throw TypeError(".LogonRsp.tCurrentPlay: object expected");
            message.tCurrentPlay = $root.LogonRsp.CurrentPlaying.fromObject(object.tCurrentPlay);
        }
        if (object.nLastClubId != null)
            message.nLastClubId = object.nLastClubId | 0;
        if (object.tExtraConfigureInfo != null)
            message.tExtraConfigureInfo = String(object.tExtraConfigureInfo);
        return message;
    };

    /**
     * Creates a plain object from a LogonRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LogonRsp
     * @static
     * @param {LogonRsp} message LogonRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LogonRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.tUserInfo = null;
            object.tGameList = null;
            object.tCurrentPlay = null;
            object.nLastClubId = 0;
            object.tExtraConfigureInfo = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.tUserInfo != null && message.hasOwnProperty("tUserInfo"))
            object.tUserInfo = $root.LogonRsp.UserInfo.toObject(message.tUserInfo, options);
        if (message.tGameList != null && message.hasOwnProperty("tGameList"))
            object.tGameList = $root.GameListNotify.toObject(message.tGameList, options);
        if (message.tCurrentPlay != null && message.hasOwnProperty("tCurrentPlay"))
            object.tCurrentPlay = $root.LogonRsp.CurrentPlaying.toObject(message.tCurrentPlay, options);
        if (message.nLastClubId != null && message.hasOwnProperty("nLastClubId"))
            object.nLastClubId = message.nLastClubId;
        if (message.tExtraConfigureInfo != null && message.hasOwnProperty("tExtraConfigureInfo"))
            object.tExtraConfigureInfo = message.tExtraConfigureInfo;
        return object;
    };

    /**
     * Converts this LogonRsp to JSON.
     * @function toJSON
     * @memberof LogonRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LogonRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    LogonRsp.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof LogonRsp
         * @interface IUserInfo
         * @property {number} nUserID UserInfo nUserID
         * @property {number} nSex UserInfo nSex
         * @property {number} nGold UserInfo nGold
         * @property {string} sNickName UserInfo sNickName
         * @property {string} sFaceID UserInfo sFaceID
         * @property {number|null} [nVisitor] UserInfo nVisitor
         * @property {string|null} [sTime] UserInfo sTime
         */

        /**
         * Constructs a new UserInfo.
         * @memberof LogonRsp
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {LogonRsp.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo nUserID.
         * @member {number} nUserID
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.nUserID = 0;

        /**
         * UserInfo nSex.
         * @member {number} nSex
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.nSex = 0;

        /**
         * UserInfo nGold.
         * @member {number} nGold
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.nGold = 0;

        /**
         * UserInfo sNickName.
         * @member {string} sNickName
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.sNickName = "";

        /**
         * UserInfo sFaceID.
         * @member {string} sFaceID
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.sFaceID = "";

        /**
         * UserInfo nVisitor.
         * @member {number} nVisitor
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.nVisitor = 0;

        /**
         * UserInfo sTime.
         * @member {string} sTime
         * @memberof LogonRsp.UserInfo
         * @instance
         */
        UserInfo.prototype.sTime = "";

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {LogonRsp.IUserInfo=} [properties] Properties to set
         * @returns {LogonRsp.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link LogonRsp.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {LogonRsp.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nUserID);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nSex);
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.nGold);
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sNickName);
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.sFaceID);
            if (message.nVisitor != null && Object.hasOwnProperty.call(message, "nVisitor"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.nVisitor);
            if (message.sTime != null && Object.hasOwnProperty.call(message, "sTime"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.sTime);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link LogonRsp.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {LogonRsp.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LogonRsp.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonRsp.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.nUserID = reader.int32();
                    break;
                case 3:
                    message.nSex = reader.int32();
                    break;
                case 4:
                    message.nGold = reader.double();
                    break;
                case 5:
                    message.sNickName = reader.string();
                    break;
                case 6:
                    message.sFaceID = reader.string();
                    break;
                case 7:
                    message.nVisitor = reader.int32();
                    break;
                case 8:
                    message.sTime = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nUserID"))
                throw $util.ProtocolError("missing required 'nUserID'", { instance: message });
            if (!message.hasOwnProperty("nSex"))
                throw $util.ProtocolError("missing required 'nSex'", { instance: message });
            if (!message.hasOwnProperty("nGold"))
                throw $util.ProtocolError("missing required 'nGold'", { instance: message });
            if (!message.hasOwnProperty("sNickName"))
                throw $util.ProtocolError("missing required 'sNickName'", { instance: message });
            if (!message.hasOwnProperty("sFaceID"))
                throw $util.ProtocolError("missing required 'sFaceID'", { instance: message });
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {LogonRsp.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nUserID))
                return "nUserID: integer expected";
            if (!$util.isInteger(message.nSex))
                return "nSex: integer expected";
            if (typeof message.nGold !== "number")
                return "nGold: number expected";
            if (!$util.isString(message.sNickName))
                return "sNickName: string expected";
            if (!$util.isString(message.sFaceID))
                return "sFaceID: string expected";
            if (message.nVisitor != null && message.hasOwnProperty("nVisitor"))
                if (!$util.isInteger(message.nVisitor))
                    return "nVisitor: integer expected";
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                if (!$util.isString(message.sTime))
                    return "sTime: string expected";
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {LogonRsp.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.LogonRsp.UserInfo)
                return object;
            var message = new $root.LogonRsp.UserInfo();
            if (object.nUserID != null)
                message.nUserID = object.nUserID | 0;
            if (object.nSex != null)
                message.nSex = object.nSex | 0;
            if (object.nGold != null)
                message.nGold = Number(object.nGold);
            if (object.sNickName != null)
                message.sNickName = String(object.sNickName);
            if (object.sFaceID != null)
                message.sFaceID = String(object.sFaceID);
            if (object.nVisitor != null)
                message.nVisitor = object.nVisitor | 0;
            if (object.sTime != null)
                message.sTime = String(object.sTime);
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof LogonRsp.UserInfo
         * @static
         * @param {LogonRsp.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nUserID = 0;
                object.nSex = 0;
                object.nGold = 0;
                object.sNickName = "";
                object.sFaceID = "";
                object.nVisitor = 0;
                object.sTime = "";
            }
            if (message.nUserID != null && message.hasOwnProperty("nUserID"))
                object.nUserID = message.nUserID;
            if (message.nSex != null && message.hasOwnProperty("nSex"))
                object.nSex = message.nSex;
            if (message.nGold != null && message.hasOwnProperty("nGold"))
                object.nGold = options.json && !isFinite(message.nGold) ? String(message.nGold) : message.nGold;
            if (message.sNickName != null && message.hasOwnProperty("sNickName"))
                object.sNickName = message.sNickName;
            if (message.sFaceID != null && message.hasOwnProperty("sFaceID"))
                object.sFaceID = message.sFaceID;
            if (message.nVisitor != null && message.hasOwnProperty("nVisitor"))
                object.nVisitor = message.nVisitor;
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                object.sTime = message.sTime;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof LogonRsp.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserInfo;
    })();

    LogonRsp.CurrentPlaying = (function() {

        /**
         * Properties of a CurrentPlaying.
         * @memberof LogonRsp
         * @interface ICurrentPlaying
         * @property {number} nGameId CurrentPlaying nGameId
         * @property {number} nRoomId CurrentPlaying nRoomId
         * @property {string|null} [sTableId] CurrentPlaying sTableId
         * @property {number|null} [nClubId] CurrentPlaying nClubId
         */

        /**
         * Constructs a new CurrentPlaying.
         * @memberof LogonRsp
         * @classdesc Represents a CurrentPlaying.
         * @implements ICurrentPlaying
         * @constructor
         * @param {LogonRsp.ICurrentPlaying=} [properties] Properties to set
         */
        function CurrentPlaying(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CurrentPlaying nGameId.
         * @member {number} nGameId
         * @memberof LogonRsp.CurrentPlaying
         * @instance
         */
        CurrentPlaying.prototype.nGameId = 0;

        /**
         * CurrentPlaying nRoomId.
         * @member {number} nRoomId
         * @memberof LogonRsp.CurrentPlaying
         * @instance
         */
        CurrentPlaying.prototype.nRoomId = 0;

        /**
         * CurrentPlaying sTableId.
         * @member {string} sTableId
         * @memberof LogonRsp.CurrentPlaying
         * @instance
         */
        CurrentPlaying.prototype.sTableId = "";

        /**
         * CurrentPlaying nClubId.
         * @member {number} nClubId
         * @memberof LogonRsp.CurrentPlaying
         * @instance
         */
        CurrentPlaying.prototype.nClubId = 0;

        /**
         * Creates a new CurrentPlaying instance using the specified properties.
         * @function create
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {LogonRsp.ICurrentPlaying=} [properties] Properties to set
         * @returns {LogonRsp.CurrentPlaying} CurrentPlaying instance
         */
        CurrentPlaying.create = function create(properties) {
            return new CurrentPlaying(properties);
        };

        /**
         * Encodes the specified CurrentPlaying message. Does not implicitly {@link LogonRsp.CurrentPlaying.verify|verify} messages.
         * @function encode
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {LogonRsp.ICurrentPlaying} message CurrentPlaying message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CurrentPlaying.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRoomId);
            if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sTableId);
            if (message.nClubId != null && Object.hasOwnProperty.call(message, "nClubId"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nClubId);
            return writer;
        };

        /**
         * Encodes the specified CurrentPlaying message, length delimited. Does not implicitly {@link LogonRsp.CurrentPlaying.verify|verify} messages.
         * @function encodeDelimited
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {LogonRsp.ICurrentPlaying} message CurrentPlaying message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CurrentPlaying.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CurrentPlaying message from the specified reader or buffer.
         * @function decode
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LogonRsp.CurrentPlaying} CurrentPlaying
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CurrentPlaying.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LogonRsp.CurrentPlaying();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nGameId = reader.int32();
                    break;
                case 2:
                    message.nRoomId = reader.int32();
                    break;
                case 3:
                    message.sTableId = reader.string();
                    break;
                case 4:
                    message.nClubId = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nGameId"))
                throw $util.ProtocolError("missing required 'nGameId'", { instance: message });
            if (!message.hasOwnProperty("nRoomId"))
                throw $util.ProtocolError("missing required 'nRoomId'", { instance: message });
            return message;
        };

        /**
         * Decodes a CurrentPlaying message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {LogonRsp.CurrentPlaying} CurrentPlaying
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CurrentPlaying.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CurrentPlaying message.
         * @function verify
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CurrentPlaying.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nGameId))
                return "nGameId: integer expected";
            if (!$util.isInteger(message.nRoomId))
                return "nRoomId: integer expected";
            if (message.sTableId != null && message.hasOwnProperty("sTableId"))
                if (!$util.isString(message.sTableId))
                    return "sTableId: string expected";
            if (message.nClubId != null && message.hasOwnProperty("nClubId"))
                if (!$util.isInteger(message.nClubId))
                    return "nClubId: integer expected";
            return null;
        };

        /**
         * Creates a CurrentPlaying message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {LogonRsp.CurrentPlaying} CurrentPlaying
         */
        CurrentPlaying.fromObject = function fromObject(object) {
            if (object instanceof $root.LogonRsp.CurrentPlaying)
                return object;
            var message = new $root.LogonRsp.CurrentPlaying();
            if (object.nGameId != null)
                message.nGameId = object.nGameId | 0;
            if (object.nRoomId != null)
                message.nRoomId = object.nRoomId | 0;
            if (object.sTableId != null)
                message.sTableId = String(object.sTableId);
            if (object.nClubId != null)
                message.nClubId = object.nClubId | 0;
            return message;
        };

        /**
         * Creates a plain object from a CurrentPlaying message. Also converts values to other types if specified.
         * @function toObject
         * @memberof LogonRsp.CurrentPlaying
         * @static
         * @param {LogonRsp.CurrentPlaying} message CurrentPlaying
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CurrentPlaying.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nGameId = 0;
                object.nRoomId = 0;
                object.sTableId = "";
                object.nClubId = 0;
            }
            if (message.nGameId != null && message.hasOwnProperty("nGameId"))
                object.nGameId = message.nGameId;
            if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
                object.nRoomId = message.nRoomId;
            if (message.sTableId != null && message.hasOwnProperty("sTableId"))
                object.sTableId = message.sTableId;
            if (message.nClubId != null && message.hasOwnProperty("nClubId"))
                object.nClubId = message.nClubId;
            return object;
        };

        /**
         * Converts this CurrentPlaying to JSON.
         * @function toJSON
         * @memberof LogonRsp.CurrentPlaying
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CurrentPlaying.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CurrentPlaying;
    })();

    return LogonRsp;
})();

$root.GameListNotify = (function() {

    /**
     * Properties of a GameListNotify.
     * @exports IGameListNotify
     * @interface IGameListNotify
     * @property {Array.<GameListNotify.IGameItem>|null} [arrGameItems] GameListNotify arrGameItems
     * @property {number|null} [nErrCode] GameListNotify nErrCode
     * @property {string|null} [sErrStr] GameListNotify sErrStr
     */

    /**
     * Constructs a new GameListNotify.
     * @exports GameListNotify
     * @classdesc Represents a GameListNotify.
     * @implements IGameListNotify
     * @constructor
     * @param {IGameListNotify=} [properties] Properties to set
     */
    function GameListNotify(properties) {
        this.arrGameItems = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameListNotify arrGameItems.
     * @member {Array.<GameListNotify.IGameItem>} arrGameItems
     * @memberof GameListNotify
     * @instance
     */
    GameListNotify.prototype.arrGameItems = $util.emptyArray;

    /**
     * GameListNotify nErrCode.
     * @member {number} nErrCode
     * @memberof GameListNotify
     * @instance
     */
    GameListNotify.prototype.nErrCode = 0;

    /**
     * GameListNotify sErrStr.
     * @member {string} sErrStr
     * @memberof GameListNotify
     * @instance
     */
    GameListNotify.prototype.sErrStr = "";

    /**
     * Creates a new GameListNotify instance using the specified properties.
     * @function create
     * @memberof GameListNotify
     * @static
     * @param {IGameListNotify=} [properties] Properties to set
     * @returns {GameListNotify} GameListNotify instance
     */
    GameListNotify.create = function create(properties) {
        return new GameListNotify(properties);
    };

    /**
     * Encodes the specified GameListNotify message. Does not implicitly {@link GameListNotify.verify|verify} messages.
     * @function encode
     * @memberof GameListNotify
     * @static
     * @param {IGameListNotify} message GameListNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameListNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrGameItems != null && message.arrGameItems.length)
            for (var i = 0; i < message.arrGameItems.length; ++i)
                $root.GameListNotify.GameItem.encode(message.arrGameItems[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.nErrCode != null && Object.hasOwnProperty.call(message, "nErrCode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nErrCode);
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sErrStr);
        return writer;
    };

    /**
     * Encodes the specified GameListNotify message, length delimited. Does not implicitly {@link GameListNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameListNotify
     * @static
     * @param {IGameListNotify} message GameListNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameListNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameListNotify message from the specified reader or buffer.
     * @function decode
     * @memberof GameListNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameListNotify} GameListNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameListNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameListNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                if (!(message.arrGameItems && message.arrGameItems.length))
                    message.arrGameItems = [];
                message.arrGameItems.push($root.GameListNotify.GameItem.decode(reader, reader.uint32()));
                break;
            case 3:
                message.nErrCode = reader.int32();
                break;
            case 4:
                message.sErrStr = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameListNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameListNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameListNotify} GameListNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameListNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameListNotify message.
     * @function verify
     * @memberof GameListNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameListNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrGameItems != null && message.hasOwnProperty("arrGameItems")) {
            if (!Array.isArray(message.arrGameItems))
                return "arrGameItems: array expected";
            for (var i = 0; i < message.arrGameItems.length; ++i) {
                var error = $root.GameListNotify.GameItem.verify(message.arrGameItems[i]);
                if (error)
                    return "arrGameItems." + error;
            }
        }
        if (message.nErrCode != null && message.hasOwnProperty("nErrCode"))
            if (!$util.isInteger(message.nErrCode))
                return "nErrCode: integer expected";
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        return null;
    };

    /**
     * Creates a GameListNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameListNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameListNotify} GameListNotify
     */
    GameListNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.GameListNotify)
            return object;
        var message = new $root.GameListNotify();
        if (object.arrGameItems) {
            if (!Array.isArray(object.arrGameItems))
                throw TypeError(".GameListNotify.arrGameItems: array expected");
            message.arrGameItems = [];
            for (var i = 0; i < object.arrGameItems.length; ++i) {
                if (typeof object.arrGameItems[i] !== "object")
                    throw TypeError(".GameListNotify.arrGameItems: object expected");
                message.arrGameItems[i] = $root.GameListNotify.GameItem.fromObject(object.arrGameItems[i]);
            }
        }
        if (object.nErrCode != null)
            message.nErrCode = object.nErrCode | 0;
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        return message;
    };

    /**
     * Creates a plain object from a GameListNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameListNotify
     * @static
     * @param {GameListNotify} message GameListNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameListNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrGameItems = [];
        if (options.defaults) {
            object.nErrCode = 0;
            object.sErrStr = "";
        }
        if (message.arrGameItems && message.arrGameItems.length) {
            object.arrGameItems = [];
            for (var j = 0; j < message.arrGameItems.length; ++j)
                object.arrGameItems[j] = $root.GameListNotify.GameItem.toObject(message.arrGameItems[j], options);
        }
        if (message.nErrCode != null && message.hasOwnProperty("nErrCode"))
            object.nErrCode = message.nErrCode;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        return object;
    };

    /**
     * Converts this GameListNotify to JSON.
     * @function toJSON
     * @memberof GameListNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameListNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    GameListNotify.GameItem = (function() {

        /**
         * Properties of a GameItem.
         * @memberof GameListNotify
         * @interface IGameItem
         * @property {number} nGameId GameItem nGameId
         * @property {number} nGameOrder GameItem nGameOrder
         * @property {number} nGameStatus GameItem nGameStatus
         * @property {string} sIconUrl GameItem sIconUrl
         * @property {string} sGamePath GameItem sGamePath
         * @property {string} sVersion GameItem sVersion
         * @property {string} sZipFilePath GameItem sZipFilePath
         * @property {string} sMD5FilePath GameItem sMD5FilePath
         * @property {number|null} [nPeople] GameItem nPeople
         */

        /**
         * Constructs a new GameItem.
         * @memberof GameListNotify
         * @classdesc Represents a GameItem.
         * @implements IGameItem
         * @constructor
         * @param {GameListNotify.IGameItem=} [properties] Properties to set
         */
        function GameItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameItem nGameId.
         * @member {number} nGameId
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.nGameId = 0;

        /**
         * GameItem nGameOrder.
         * @member {number} nGameOrder
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.nGameOrder = 1;

        /**
         * GameItem nGameStatus.
         * @member {number} nGameStatus
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.nGameStatus = 0;

        /**
         * GameItem sIconUrl.
         * @member {string} sIconUrl
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.sIconUrl = "";

        /**
         * GameItem sGamePath.
         * @member {string} sGamePath
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.sGamePath = "";

        /**
         * GameItem sVersion.
         * @member {string} sVersion
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.sVersion = "";

        /**
         * GameItem sZipFilePath.
         * @member {string} sZipFilePath
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.sZipFilePath = "";

        /**
         * GameItem sMD5FilePath.
         * @member {string} sMD5FilePath
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.sMD5FilePath = "";

        /**
         * GameItem nPeople.
         * @member {number} nPeople
         * @memberof GameListNotify.GameItem
         * @instance
         */
        GameItem.prototype.nPeople = 0;

        /**
         * Creates a new GameItem instance using the specified properties.
         * @function create
         * @memberof GameListNotify.GameItem
         * @static
         * @param {GameListNotify.IGameItem=} [properties] Properties to set
         * @returns {GameListNotify.GameItem} GameItem instance
         */
        GameItem.create = function create(properties) {
            return new GameItem(properties);
        };

        /**
         * Encodes the specified GameItem message. Does not implicitly {@link GameListNotify.GameItem.verify|verify} messages.
         * @function encode
         * @memberof GameListNotify.GameItem
         * @static
         * @param {GameListNotify.IGameItem} message GameItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nGameOrder);
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nGameStatus);
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sIconUrl);
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.sGamePath);
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.sVersion);
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.sZipFilePath);
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.sMD5FilePath);
            if (message.nPeople != null && Object.hasOwnProperty.call(message, "nPeople"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.nPeople);
            return writer;
        };

        /**
         * Encodes the specified GameItem message, length delimited. Does not implicitly {@link GameListNotify.GameItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameListNotify.GameItem
         * @static
         * @param {GameListNotify.IGameItem} message GameItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameItem message from the specified reader or buffer.
         * @function decode
         * @memberof GameListNotify.GameItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameListNotify.GameItem} GameItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameListNotify.GameItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nGameId = reader.int32();
                    break;
                case 3:
                    message.nGameOrder = reader.int32();
                    break;
                case 4:
                    message.nGameStatus = reader.int32();
                    break;
                case 5:
                    message.sIconUrl = reader.string();
                    break;
                case 6:
                    message.sGamePath = reader.string();
                    break;
                case 7:
                    message.sVersion = reader.string();
                    break;
                case 8:
                    message.sZipFilePath = reader.string();
                    break;
                case 9:
                    message.sMD5FilePath = reader.string();
                    break;
                case 10:
                    message.nPeople = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nGameId"))
                throw $util.ProtocolError("missing required 'nGameId'", { instance: message });
            if (!message.hasOwnProperty("nGameOrder"))
                throw $util.ProtocolError("missing required 'nGameOrder'", { instance: message });
            if (!message.hasOwnProperty("nGameStatus"))
                throw $util.ProtocolError("missing required 'nGameStatus'", { instance: message });
            if (!message.hasOwnProperty("sIconUrl"))
                throw $util.ProtocolError("missing required 'sIconUrl'", { instance: message });
            if (!message.hasOwnProperty("sGamePath"))
                throw $util.ProtocolError("missing required 'sGamePath'", { instance: message });
            if (!message.hasOwnProperty("sVersion"))
                throw $util.ProtocolError("missing required 'sVersion'", { instance: message });
            if (!message.hasOwnProperty("sZipFilePath"))
                throw $util.ProtocolError("missing required 'sZipFilePath'", { instance: message });
            if (!message.hasOwnProperty("sMD5FilePath"))
                throw $util.ProtocolError("missing required 'sMD5FilePath'", { instance: message });
            return message;
        };

        /**
         * Decodes a GameItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameListNotify.GameItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameListNotify.GameItem} GameItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameItem message.
         * @function verify
         * @memberof GameListNotify.GameItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nGameId))
                return "nGameId: integer expected";
            if (!$util.isInteger(message.nGameOrder))
                return "nGameOrder: integer expected";
            if (!$util.isInteger(message.nGameStatus))
                return "nGameStatus: integer expected";
            if (!$util.isString(message.sIconUrl))
                return "sIconUrl: string expected";
            if (!$util.isString(message.sGamePath))
                return "sGamePath: string expected";
            if (!$util.isString(message.sVersion))
                return "sVersion: string expected";
            if (!$util.isString(message.sZipFilePath))
                return "sZipFilePath: string expected";
            if (!$util.isString(message.sMD5FilePath))
                return "sMD5FilePath: string expected";
            if (message.nPeople != null && message.hasOwnProperty("nPeople"))
                if (!$util.isInteger(message.nPeople))
                    return "nPeople: integer expected";
            return null;
        };

        /**
         * Creates a GameItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameListNotify.GameItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameListNotify.GameItem} GameItem
         */
        GameItem.fromObject = function fromObject(object) {
            if (object instanceof $root.GameListNotify.GameItem)
                return object;
            var message = new $root.GameListNotify.GameItem();
            if (object.nGameId != null)
                message.nGameId = object.nGameId | 0;
            if (object.nGameOrder != null)
                message.nGameOrder = object.nGameOrder | 0;
            if (object.nGameStatus != null)
                message.nGameStatus = object.nGameStatus | 0;
            if (object.sIconUrl != null)
                message.sIconUrl = String(object.sIconUrl);
            if (object.sGamePath != null)
                message.sGamePath = String(object.sGamePath);
            if (object.sVersion != null)
                message.sVersion = String(object.sVersion);
            if (object.sZipFilePath != null)
                message.sZipFilePath = String(object.sZipFilePath);
            if (object.sMD5FilePath != null)
                message.sMD5FilePath = String(object.sMD5FilePath);
            if (object.nPeople != null)
                message.nPeople = object.nPeople | 0;
            return message;
        };

        /**
         * Creates a plain object from a GameItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameListNotify.GameItem
         * @static
         * @param {GameListNotify.GameItem} message GameItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nGameId = 0;
                object.nGameOrder = 1;
                object.nGameStatus = 0;
                object.sIconUrl = "";
                object.sGamePath = "";
                object.sVersion = "";
                object.sZipFilePath = "";
                object.sMD5FilePath = "";
                object.nPeople = 0;
            }
            if (message.nGameId != null && message.hasOwnProperty("nGameId"))
                object.nGameId = message.nGameId;
            if (message.nGameOrder != null && message.hasOwnProperty("nGameOrder"))
                object.nGameOrder = message.nGameOrder;
            if (message.nGameStatus != null && message.hasOwnProperty("nGameStatus"))
                object.nGameStatus = message.nGameStatus;
            if (message.sIconUrl != null && message.hasOwnProperty("sIconUrl"))
                object.sIconUrl = message.sIconUrl;
            if (message.sGamePath != null && message.hasOwnProperty("sGamePath"))
                object.sGamePath = message.sGamePath;
            if (message.sVersion != null && message.hasOwnProperty("sVersion"))
                object.sVersion = message.sVersion;
            if (message.sZipFilePath != null && message.hasOwnProperty("sZipFilePath"))
                object.sZipFilePath = message.sZipFilePath;
            if (message.sMD5FilePath != null && message.hasOwnProperty("sMD5FilePath"))
                object.sMD5FilePath = message.sMD5FilePath;
            if (message.nPeople != null && message.hasOwnProperty("nPeople"))
                object.nPeople = message.nPeople;
            return object;
        };

        /**
         * Converts this GameItem to JSON.
         * @function toJSON
         * @memberof GameListNotify.GameItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameItem;
    })();

    return GameListNotify;
})();

$root.RoomListReq = (function() {

    /**
     * Properties of a RoomListReq.
     * @exports IRoomListReq
     * @interface IRoomListReq
     * @property {number} nGameId RoomListReq nGameId
     */

    /**
     * Constructs a new RoomListReq.
     * @exports RoomListReq
     * @classdesc Represents a RoomListReq.
     * @implements IRoomListReq
     * @constructor
     * @param {IRoomListReq=} [properties] Properties to set
     */
    function RoomListReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RoomListReq nGameId.
     * @member {number} nGameId
     * @memberof RoomListReq
     * @instance
     */
    RoomListReq.prototype.nGameId = 0;

    /**
     * Creates a new RoomListReq instance using the specified properties.
     * @function create
     * @memberof RoomListReq
     * @static
     * @param {IRoomListReq=} [properties] Properties to set
     * @returns {RoomListReq} RoomListReq instance
     */
    RoomListReq.create = function create(properties) {
        return new RoomListReq(properties);
    };

    /**
     * Encodes the specified RoomListReq message. Does not implicitly {@link RoomListReq.verify|verify} messages.
     * @function encode
     * @memberof RoomListReq
     * @static
     * @param {IRoomListReq} message RoomListReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomListReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        return writer;
    };

    /**
     * Encodes the specified RoomListReq message, length delimited. Does not implicitly {@link RoomListReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RoomListReq
     * @static
     * @param {IRoomListReq} message RoomListReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomListReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RoomListReq message from the specified reader or buffer.
     * @function decode
     * @memberof RoomListReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RoomListReq} RoomListReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomListReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RoomListReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGameId = reader.int32();
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
     * Decodes a RoomListReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RoomListReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RoomListReq} RoomListReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomListReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RoomListReq message.
     * @function verify
     * @memberof RoomListReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RoomListReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        return null;
    };

    /**
     * Creates a RoomListReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RoomListReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RoomListReq} RoomListReq
     */
    RoomListReq.fromObject = function fromObject(object) {
        if (object instanceof $root.RoomListReq)
            return object;
        var message = new $root.RoomListReq();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        return message;
    };

    /**
     * Creates a plain object from a RoomListReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RoomListReq
     * @static
     * @param {RoomListReq} message RoomListReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RoomListReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nGameId = 0;
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        return object;
    };

    /**
     * Converts this RoomListReq to JSON.
     * @function toJSON
     * @memberof RoomListReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RoomListReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RoomListReq;
})();

$root.RoomListRsp = (function() {

    /**
     * Properties of a RoomListRsp.
     * @exports IRoomListRsp
     * @interface IRoomListRsp
     * @property {number} nGameId RoomListRsp nGameId
     * @property {Array.<RoomListRsp.IRoomItem>|null} [arrRoomItems] RoomListRsp arrRoomItems
     * @property {string|null} [sErrStr] RoomListRsp sErrStr
     * @property {number|null} [nErrCode] RoomListRsp nErrCode
     */

    /**
     * Constructs a new RoomListRsp.
     * @exports RoomListRsp
     * @classdesc Represents a RoomListRsp.
     * @implements IRoomListRsp
     * @constructor
     * @param {IRoomListRsp=} [properties] Properties to set
     */
    function RoomListRsp(properties) {
        this.arrRoomItems = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RoomListRsp nGameId.
     * @member {number} nGameId
     * @memberof RoomListRsp
     * @instance
     */
    RoomListRsp.prototype.nGameId = 0;

    /**
     * RoomListRsp arrRoomItems.
     * @member {Array.<RoomListRsp.IRoomItem>} arrRoomItems
     * @memberof RoomListRsp
     * @instance
     */
    RoomListRsp.prototype.arrRoomItems = $util.emptyArray;

    /**
     * RoomListRsp sErrStr.
     * @member {string} sErrStr
     * @memberof RoomListRsp
     * @instance
     */
    RoomListRsp.prototype.sErrStr = "";

    /**
     * RoomListRsp nErrCode.
     * @member {number} nErrCode
     * @memberof RoomListRsp
     * @instance
     */
    RoomListRsp.prototype.nErrCode = 0;

    /**
     * Creates a new RoomListRsp instance using the specified properties.
     * @function create
     * @memberof RoomListRsp
     * @static
     * @param {IRoomListRsp=} [properties] Properties to set
     * @returns {RoomListRsp} RoomListRsp instance
     */
    RoomListRsp.create = function create(properties) {
        return new RoomListRsp(properties);
    };

    /**
     * Encodes the specified RoomListRsp message. Does not implicitly {@link RoomListRsp.verify|verify} messages.
     * @function encode
     * @memberof RoomListRsp
     * @static
     * @param {IRoomListRsp} message RoomListRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomListRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        if (message.arrRoomItems != null && message.arrRoomItems.length)
            for (var i = 0; i < message.arrRoomItems.length; ++i)
                $root.RoomListRsp.RoomItem.encode(message.arrRoomItems[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sErrStr);
        if (message.nErrCode != null && Object.hasOwnProperty.call(message, "nErrCode"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nErrCode);
        return writer;
    };

    /**
     * Encodes the specified RoomListRsp message, length delimited. Does not implicitly {@link RoomListRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RoomListRsp
     * @static
     * @param {IRoomListRsp} message RoomListRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomListRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RoomListRsp message from the specified reader or buffer.
     * @function decode
     * @memberof RoomListRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RoomListRsp} RoomListRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomListRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RoomListRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGameId = reader.int32();
                break;
            case 2:
                if (!(message.arrRoomItems && message.arrRoomItems.length))
                    message.arrRoomItems = [];
                message.arrRoomItems.push($root.RoomListRsp.RoomItem.decode(reader, reader.uint32()));
                break;
            case 3:
                message.sErrStr = reader.string();
                break;
            case 4:
                message.nErrCode = reader.int32();
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
     * Decodes a RoomListRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RoomListRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RoomListRsp} RoomListRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomListRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RoomListRsp message.
     * @function verify
     * @memberof RoomListRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RoomListRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        if (message.arrRoomItems != null && message.hasOwnProperty("arrRoomItems")) {
            if (!Array.isArray(message.arrRoomItems))
                return "arrRoomItems: array expected";
            for (var i = 0; i < message.arrRoomItems.length; ++i) {
                var error = $root.RoomListRsp.RoomItem.verify(message.arrRoomItems[i]);
                if (error)
                    return "arrRoomItems." + error;
            }
        }
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        if (message.nErrCode != null && message.hasOwnProperty("nErrCode"))
            if (!$util.isInteger(message.nErrCode))
                return "nErrCode: integer expected";
        return null;
    };

    /**
     * Creates a RoomListRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RoomListRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RoomListRsp} RoomListRsp
     */
    RoomListRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.RoomListRsp)
            return object;
        var message = new $root.RoomListRsp();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.arrRoomItems) {
            if (!Array.isArray(object.arrRoomItems))
                throw TypeError(".RoomListRsp.arrRoomItems: array expected");
            message.arrRoomItems = [];
            for (var i = 0; i < object.arrRoomItems.length; ++i) {
                if (typeof object.arrRoomItems[i] !== "object")
                    throw TypeError(".RoomListRsp.arrRoomItems: object expected");
                message.arrRoomItems[i] = $root.RoomListRsp.RoomItem.fromObject(object.arrRoomItems[i]);
            }
        }
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        if (object.nErrCode != null)
            message.nErrCode = object.nErrCode | 0;
        return message;
    };

    /**
     * Creates a plain object from a RoomListRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RoomListRsp
     * @static
     * @param {RoomListRsp} message RoomListRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RoomListRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrRoomItems = [];
        if (options.defaults) {
            object.nGameId = 0;
            object.sErrStr = "";
            object.nErrCode = 0;
        }
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.arrRoomItems && message.arrRoomItems.length) {
            object.arrRoomItems = [];
            for (var j = 0; j < message.arrRoomItems.length; ++j)
                object.arrRoomItems[j] = $root.RoomListRsp.RoomItem.toObject(message.arrRoomItems[j], options);
        }
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        if (message.nErrCode != null && message.hasOwnProperty("nErrCode"))
            object.nErrCode = message.nErrCode;
        return object;
    };

    /**
     * Converts this RoomListRsp to JSON.
     * @function toJSON
     * @memberof RoomListRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RoomListRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    RoomListRsp.RoomItem = (function() {

        /**
         * Properties of a RoomItem.
         * @memberof RoomListRsp
         * @interface IRoomItem
         * @property {number} nRoomId RoomItem nRoomId
         * @property {number} nPlayerCnt RoomItem nPlayerCnt
         * @property {number} nEnterFloorLimit RoomItem nEnterFloorLimit
         * @property {number|null} [nAnte] RoomItem nAnte
         */

        /**
         * Constructs a new RoomItem.
         * @memberof RoomListRsp
         * @classdesc Represents a RoomItem.
         * @implements IRoomItem
         * @constructor
         * @param {RoomListRsp.IRoomItem=} [properties] Properties to set
         */
        function RoomItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomItem nRoomId.
         * @member {number} nRoomId
         * @memberof RoomListRsp.RoomItem
         * @instance
         */
        RoomItem.prototype.nRoomId = 1;

        /**
         * RoomItem nPlayerCnt.
         * @member {number} nPlayerCnt
         * @memberof RoomListRsp.RoomItem
         * @instance
         */
        RoomItem.prototype.nPlayerCnt = 0;

        /**
         * RoomItem nEnterFloorLimit.
         * @member {number} nEnterFloorLimit
         * @memberof RoomListRsp.RoomItem
         * @instance
         */
        RoomItem.prototype.nEnterFloorLimit = 0;

        /**
         * RoomItem nAnte.
         * @member {number} nAnte
         * @memberof RoomListRsp.RoomItem
         * @instance
         */
        RoomItem.prototype.nAnte = 0;

        /**
         * Creates a new RoomItem instance using the specified properties.
         * @function create
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {RoomListRsp.IRoomItem=} [properties] Properties to set
         * @returns {RoomListRsp.RoomItem} RoomItem instance
         */
        RoomItem.create = function create(properties) {
            return new RoomItem(properties);
        };

        /**
         * Encodes the specified RoomItem message. Does not implicitly {@link RoomListRsp.RoomItem.verify|verify} messages.
         * @function encode
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {RoomListRsp.IRoomItem} message RoomItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRoomId);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nPlayerCnt);
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nEnterFloorLimit);
            if (message.nAnte != null && Object.hasOwnProperty.call(message, "nAnte"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.nAnte);
            return writer;
        };

        /**
         * Encodes the specified RoomItem message, length delimited. Does not implicitly {@link RoomListRsp.RoomItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {RoomListRsp.IRoomItem} message RoomItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomItem message from the specified reader or buffer.
         * @function decode
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RoomListRsp.RoomItem} RoomItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RoomListRsp.RoomItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nRoomId = reader.int32();
                    break;
                case 2:
                    message.nPlayerCnt = reader.int32();
                    break;
                case 4:
                    message.nEnterFloorLimit = reader.int32();
                    break;
                case 5:
                    message.nAnte = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nRoomId"))
                throw $util.ProtocolError("missing required 'nRoomId'", { instance: message });
            if (!message.hasOwnProperty("nPlayerCnt"))
                throw $util.ProtocolError("missing required 'nPlayerCnt'", { instance: message });
            if (!message.hasOwnProperty("nEnterFloorLimit"))
                throw $util.ProtocolError("missing required 'nEnterFloorLimit'", { instance: message });
            return message;
        };

        /**
         * Decodes a RoomItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RoomListRsp.RoomItem} RoomItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomItem message.
         * @function verify
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nRoomId))
                return "nRoomId: integer expected";
            if (!$util.isInteger(message.nPlayerCnt))
                return "nPlayerCnt: integer expected";
            if (!$util.isInteger(message.nEnterFloorLimit))
                return "nEnterFloorLimit: integer expected";
            if (message.nAnte != null && message.hasOwnProperty("nAnte"))
                if (typeof message.nAnte !== "number")
                    return "nAnte: number expected";
            return null;
        };

        /**
         * Creates a RoomItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RoomListRsp.RoomItem} RoomItem
         */
        RoomItem.fromObject = function fromObject(object) {
            if (object instanceof $root.RoomListRsp.RoomItem)
                return object;
            var message = new $root.RoomListRsp.RoomItem();
            if (object.nRoomId != null)
                message.nRoomId = object.nRoomId | 0;
            if (object.nPlayerCnt != null)
                message.nPlayerCnt = object.nPlayerCnt | 0;
            if (object.nEnterFloorLimit != null)
                message.nEnterFloorLimit = object.nEnterFloorLimit | 0;
            if (object.nAnte != null)
                message.nAnte = Number(object.nAnte);
            return message;
        };

        /**
         * Creates a plain object from a RoomItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RoomListRsp.RoomItem
         * @static
         * @param {RoomListRsp.RoomItem} message RoomItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nRoomId = 1;
                object.nPlayerCnt = 0;
                object.nEnterFloorLimit = 0;
                object.nAnte = 0;
            }
            if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
                object.nRoomId = message.nRoomId;
            if (message.nPlayerCnt != null && message.hasOwnProperty("nPlayerCnt"))
                object.nPlayerCnt = message.nPlayerCnt;
            if (message.nEnterFloorLimit != null && message.hasOwnProperty("nEnterFloorLimit"))
                object.nEnterFloorLimit = message.nEnterFloorLimit;
            if (message.nAnte != null && message.hasOwnProperty("nAnte"))
                object.nAnte = options.json && !isFinite(message.nAnte) ? String(message.nAnte) : message.nAnte;
            return object;
        };

        /**
         * Converts this RoomItem to JSON.
         * @function toJSON
         * @memberof RoomListRsp.RoomItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomItem;
    })();

    return RoomListRsp;
})();

$root.TreasureReq = (function() {

    /**
     * Properties of a TreasureReq.
     * @exports ITreasureReq
     * @interface ITreasureReq
     * @property {number|null} [nNoUse] TreasureReq nNoUse
     */

    /**
     * Constructs a new TreasureReq.
     * @exports TreasureReq
     * @classdesc Represents a TreasureReq.
     * @implements ITreasureReq
     * @constructor
     * @param {ITreasureReq=} [properties] Properties to set
     */
    function TreasureReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TreasureReq nNoUse.
     * @member {number} nNoUse
     * @memberof TreasureReq
     * @instance
     */
    TreasureReq.prototype.nNoUse = 0;

    /**
     * Creates a new TreasureReq instance using the specified properties.
     * @function create
     * @memberof TreasureReq
     * @static
     * @param {ITreasureReq=} [properties] Properties to set
     * @returns {TreasureReq} TreasureReq instance
     */
    TreasureReq.create = function create(properties) {
        return new TreasureReq(properties);
    };

    /**
     * Encodes the specified TreasureReq message. Does not implicitly {@link TreasureReq.verify|verify} messages.
     * @function encode
     * @memberof TreasureReq
     * @static
     * @param {ITreasureReq} message TreasureReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TreasureReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nNoUse != null && Object.hasOwnProperty.call(message, "nNoUse"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nNoUse);
        return writer;
    };

    /**
     * Encodes the specified TreasureReq message, length delimited. Does not implicitly {@link TreasureReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TreasureReq
     * @static
     * @param {ITreasureReq} message TreasureReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TreasureReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TreasureReq message from the specified reader or buffer.
     * @function decode
     * @memberof TreasureReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TreasureReq} TreasureReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TreasureReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TreasureReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nNoUse = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TreasureReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TreasureReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TreasureReq} TreasureReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TreasureReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TreasureReq message.
     * @function verify
     * @memberof TreasureReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TreasureReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            if (!$util.isInteger(message.nNoUse))
                return "nNoUse: integer expected";
        return null;
    };

    /**
     * Creates a TreasureReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TreasureReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TreasureReq} TreasureReq
     */
    TreasureReq.fromObject = function fromObject(object) {
        if (object instanceof $root.TreasureReq)
            return object;
        var message = new $root.TreasureReq();
        if (object.nNoUse != null)
            message.nNoUse = object.nNoUse | 0;
        return message;
    };

    /**
     * Creates a plain object from a TreasureReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TreasureReq
     * @static
     * @param {TreasureReq} message TreasureReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TreasureReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nNoUse = 0;
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            object.nNoUse = message.nNoUse;
        return object;
    };

    /**
     * Converts this TreasureReq to JSON.
     * @function toJSON
     * @memberof TreasureReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TreasureReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TreasureReq;
})();

$root.TreasureRsp = (function() {

    /**
     * Properties of a TreasureRsp.
     * @exports ITreasureRsp
     * @interface ITreasureRsp
     * @property {number} nResult TreasureRsp nResult
     * @property {number|null} [nGold] TreasureRsp nGold
     * @property {string|null} [sErrStr] TreasureRsp sErrStr
     */

    /**
     * Constructs a new TreasureRsp.
     * @exports TreasureRsp
     * @classdesc Represents a TreasureRsp.
     * @implements ITreasureRsp
     * @constructor
     * @param {ITreasureRsp=} [properties] Properties to set
     */
    function TreasureRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TreasureRsp nResult.
     * @member {number} nResult
     * @memberof TreasureRsp
     * @instance
     */
    TreasureRsp.prototype.nResult = 0;

    /**
     * TreasureRsp nGold.
     * @member {number} nGold
     * @memberof TreasureRsp
     * @instance
     */
    TreasureRsp.prototype.nGold = 0;

    /**
     * TreasureRsp sErrStr.
     * @member {string} sErrStr
     * @memberof TreasureRsp
     * @instance
     */
    TreasureRsp.prototype.sErrStr = "";

    /**
     * Creates a new TreasureRsp instance using the specified properties.
     * @function create
     * @memberof TreasureRsp
     * @static
     * @param {ITreasureRsp=} [properties] Properties to set
     * @returns {TreasureRsp} TreasureRsp instance
     */
    TreasureRsp.create = function create(properties) {
        return new TreasureRsp(properties);
    };

    /**
     * Encodes the specified TreasureRsp message. Does not implicitly {@link TreasureRsp.verify|verify} messages.
     * @function encode
     * @memberof TreasureRsp
     * @static
     * @param {ITreasureRsp} message TreasureRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TreasureRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.nGold != null && Object.hasOwnProperty.call(message, "nGold"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.nGold);
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sErrStr);
        return writer;
    };

    /**
     * Encodes the specified TreasureRsp message, length delimited. Does not implicitly {@link TreasureRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TreasureRsp
     * @static
     * @param {ITreasureRsp} message TreasureRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TreasureRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TreasureRsp message from the specified reader or buffer.
     * @function decode
     * @memberof TreasureRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TreasureRsp} TreasureRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TreasureRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TreasureRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.nGold = reader.double();
                break;
            case 3:
                message.sErrStr = reader.string();
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
     * Decodes a TreasureRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TreasureRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TreasureRsp} TreasureRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TreasureRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TreasureRsp message.
     * @function verify
     * @memberof TreasureRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TreasureRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            if (typeof message.nGold !== "number")
                return "nGold: number expected";
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        return null;
    };

    /**
     * Creates a TreasureRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TreasureRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TreasureRsp} TreasureRsp
     */
    TreasureRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.TreasureRsp)
            return object;
        var message = new $root.TreasureRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.nGold != null)
            message.nGold = Number(object.nGold);
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        return message;
    };

    /**
     * Creates a plain object from a TreasureRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TreasureRsp
     * @static
     * @param {TreasureRsp} message TreasureRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TreasureRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.nGold = 0;
            object.sErrStr = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = options.json && !isFinite(message.nGold) ? String(message.nGold) : message.nGold;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        return object;
    };

    /**
     * Converts this TreasureRsp to JSON.
     * @function toJSON
     * @memberof TreasureRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TreasureRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TreasureRsp;
})();

$root.Treasure = (function() {

    /**
     * Properties of a Treasure.
     * @exports ITreasure
     * @interface ITreasure
     * @property {number} nGold Treasure nGold
     */

    /**
     * Constructs a new Treasure.
     * @exports Treasure
     * @classdesc Represents a Treasure.
     * @implements ITreasure
     * @constructor
     * @param {ITreasure=} [properties] Properties to set
     */
    function Treasure(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Treasure nGold.
     * @member {number} nGold
     * @memberof Treasure
     * @instance
     */
    Treasure.prototype.nGold = 0;

    /**
     * Creates a new Treasure instance using the specified properties.
     * @function create
     * @memberof Treasure
     * @static
     * @param {ITreasure=} [properties] Properties to set
     * @returns {Treasure} Treasure instance
     */
    Treasure.create = function create(properties) {
        return new Treasure(properties);
    };

    /**
     * Encodes the specified Treasure message. Does not implicitly {@link Treasure.verify|verify} messages.
     * @function encode
     * @memberof Treasure
     * @static
     * @param {ITreasure} message Treasure message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Treasure.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGold);
        return writer;
    };

    /**
     * Encodes the specified Treasure message, length delimited. Does not implicitly {@link Treasure.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Treasure
     * @static
     * @param {ITreasure} message Treasure message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Treasure.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Treasure message from the specified reader or buffer.
     * @function decode
     * @memberof Treasure
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Treasure} Treasure
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Treasure.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Treasure();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGold = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nGold"))
            throw $util.ProtocolError("missing required 'nGold'", { instance: message });
        return message;
    };

    /**
     * Decodes a Treasure message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Treasure
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Treasure} Treasure
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Treasure.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Treasure message.
     * @function verify
     * @memberof Treasure
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Treasure.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGold))
            return "nGold: integer expected";
        return null;
    };

    /**
     * Creates a Treasure message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Treasure
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Treasure} Treasure
     */
    Treasure.fromObject = function fromObject(object) {
        if (object instanceof $root.Treasure)
            return object;
        var message = new $root.Treasure();
        if (object.nGold != null)
            message.nGold = object.nGold | 0;
        return message;
    };

    /**
     * Creates a plain object from a Treasure message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Treasure
     * @static
     * @param {Treasure} message Treasure
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Treasure.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nGold = 0;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = message.nGold;
        return object;
    };

    /**
     * Converts this Treasure to JSON.
     * @function toJSON
     * @memberof Treasure
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Treasure.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Treasure;
})();

$root.EnterBankReq = (function() {

    /**
     * Properties of an EnterBankReq.
     * @exports IEnterBankReq
     * @interface IEnterBankReq
     * @property {number|null} [nNoUse] EnterBankReq nNoUse
     */

    /**
     * Constructs a new EnterBankReq.
     * @exports EnterBankReq
     * @classdesc Represents an EnterBankReq.
     * @implements IEnterBankReq
     * @constructor
     * @param {IEnterBankReq=} [properties] Properties to set
     */
    function EnterBankReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * EnterBankReq nNoUse.
     * @member {number} nNoUse
     * @memberof EnterBankReq
     * @instance
     */
    EnterBankReq.prototype.nNoUse = 0;

    /**
     * Creates a new EnterBankReq instance using the specified properties.
     * @function create
     * @memberof EnterBankReq
     * @static
     * @param {IEnterBankReq=} [properties] Properties to set
     * @returns {EnterBankReq} EnterBankReq instance
     */
    EnterBankReq.create = function create(properties) {
        return new EnterBankReq(properties);
    };

    /**
     * Encodes the specified EnterBankReq message. Does not implicitly {@link EnterBankReq.verify|verify} messages.
     * @function encode
     * @memberof EnterBankReq
     * @static
     * @param {IEnterBankReq} message EnterBankReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnterBankReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nNoUse != null && Object.hasOwnProperty.call(message, "nNoUse"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nNoUse);
        return writer;
    };

    /**
     * Encodes the specified EnterBankReq message, length delimited. Does not implicitly {@link EnterBankReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof EnterBankReq
     * @static
     * @param {IEnterBankReq} message EnterBankReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnterBankReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EnterBankReq message from the specified reader or buffer.
     * @function decode
     * @memberof EnterBankReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {EnterBankReq} EnterBankReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnterBankReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EnterBankReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nNoUse = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an EnterBankReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof EnterBankReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {EnterBankReq} EnterBankReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnterBankReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EnterBankReq message.
     * @function verify
     * @memberof EnterBankReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EnterBankReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            if (!$util.isInteger(message.nNoUse))
                return "nNoUse: integer expected";
        return null;
    };

    /**
     * Creates an EnterBankReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof EnterBankReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {EnterBankReq} EnterBankReq
     */
    EnterBankReq.fromObject = function fromObject(object) {
        if (object instanceof $root.EnterBankReq)
            return object;
        var message = new $root.EnterBankReq();
        if (object.nNoUse != null)
            message.nNoUse = object.nNoUse | 0;
        return message;
    };

    /**
     * Creates a plain object from an EnterBankReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof EnterBankReq
     * @static
     * @param {EnterBankReq} message EnterBankReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EnterBankReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nNoUse = 0;
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            object.nNoUse = message.nNoUse;
        return object;
    };

    /**
     * Converts this EnterBankReq to JSON.
     * @function toJSON
     * @memberof EnterBankReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EnterBankReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EnterBankReq;
})();

$root.EnterBankRsp = (function() {

    /**
     * Properties of an EnterBankRsp.
     * @exports IEnterBankRsp
     * @interface IEnterBankRsp
     * @property {number} nResult EnterBankRsp nResult
     * @property {ITreasure|null} [tTreasure] EnterBankRsp tTreasure
     * @property {string|null} [sErrStr] EnterBankRsp sErrStr
     * @property {number|null} [nGameId] EnterBankRsp nGameId
     */

    /**
     * Constructs a new EnterBankRsp.
     * @exports EnterBankRsp
     * @classdesc Represents an EnterBankRsp.
     * @implements IEnterBankRsp
     * @constructor
     * @param {IEnterBankRsp=} [properties] Properties to set
     */
    function EnterBankRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * EnterBankRsp nResult.
     * @member {number} nResult
     * @memberof EnterBankRsp
     * @instance
     */
    EnterBankRsp.prototype.nResult = 0;

    /**
     * EnterBankRsp tTreasure.
     * @member {ITreasure|null|undefined} tTreasure
     * @memberof EnterBankRsp
     * @instance
     */
    EnterBankRsp.prototype.tTreasure = null;

    /**
     * EnterBankRsp sErrStr.
     * @member {string} sErrStr
     * @memberof EnterBankRsp
     * @instance
     */
    EnterBankRsp.prototype.sErrStr = "";

    /**
     * EnterBankRsp nGameId.
     * @member {number} nGameId
     * @memberof EnterBankRsp
     * @instance
     */
    EnterBankRsp.prototype.nGameId = 0;

    /**
     * Creates a new EnterBankRsp instance using the specified properties.
     * @function create
     * @memberof EnterBankRsp
     * @static
     * @param {IEnterBankRsp=} [properties] Properties to set
     * @returns {EnterBankRsp} EnterBankRsp instance
     */
    EnterBankRsp.create = function create(properties) {
        return new EnterBankRsp(properties);
    };

    /**
     * Encodes the specified EnterBankRsp message. Does not implicitly {@link EnterBankRsp.verify|verify} messages.
     * @function encode
     * @memberof EnterBankRsp
     * @static
     * @param {IEnterBankRsp} message EnterBankRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnterBankRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.tTreasure != null && Object.hasOwnProperty.call(message, "tTreasure"))
            $root.Treasure.encode(message.tTreasure, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sErrStr);
        if (message.nGameId != null && Object.hasOwnProperty.call(message, "nGameId"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nGameId);
        return writer;
    };

    /**
     * Encodes the specified EnterBankRsp message, length delimited. Does not implicitly {@link EnterBankRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof EnterBankRsp
     * @static
     * @param {IEnterBankRsp} message EnterBankRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnterBankRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EnterBankRsp message from the specified reader or buffer.
     * @function decode
     * @memberof EnterBankRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {EnterBankRsp} EnterBankRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnterBankRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EnterBankRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.tTreasure = $root.Treasure.decode(reader, reader.uint32());
                break;
            case 3:
                message.sErrStr = reader.string();
                break;
            case 4:
                message.nGameId = reader.int32();
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
     * Decodes an EnterBankRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof EnterBankRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {EnterBankRsp} EnterBankRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnterBankRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EnterBankRsp message.
     * @function verify
     * @memberof EnterBankRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EnterBankRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure")) {
            var error = $root.Treasure.verify(message.tTreasure);
            if (error)
                return "tTreasure." + error;
        }
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            if (!$util.isInteger(message.nGameId))
                return "nGameId: integer expected";
        return null;
    };

    /**
     * Creates an EnterBankRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof EnterBankRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {EnterBankRsp} EnterBankRsp
     */
    EnterBankRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.EnterBankRsp)
            return object;
        var message = new $root.EnterBankRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.tTreasure != null) {
            if (typeof object.tTreasure !== "object")
                throw TypeError(".EnterBankRsp.tTreasure: object expected");
            message.tTreasure = $root.Treasure.fromObject(object.tTreasure);
        }
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        return message;
    };

    /**
     * Creates a plain object from an EnterBankRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof EnterBankRsp
     * @static
     * @param {EnterBankRsp} message EnterBankRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EnterBankRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.tTreasure = null;
            object.sErrStr = "";
            object.nGameId = 0;
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure"))
            object.tTreasure = $root.Treasure.toObject(message.tTreasure, options);
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        return object;
    };

    /**
     * Converts this EnterBankRsp to JSON.
     * @function toJSON
     * @memberof EnterBankRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EnterBankRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EnterBankRsp;
})();

$root.BankUnlockReq = (function() {

    /**
     * Properties of a BankUnlockReq.
     * @exports IBankUnlockReq
     * @interface IBankUnlockReq
     * @property {string} sPassword BankUnlockReq sPassword
     */

    /**
     * Constructs a new BankUnlockReq.
     * @exports BankUnlockReq
     * @classdesc Represents a BankUnlockReq.
     * @implements IBankUnlockReq
     * @constructor
     * @param {IBankUnlockReq=} [properties] Properties to set
     */
    function BankUnlockReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankUnlockReq sPassword.
     * @member {string} sPassword
     * @memberof BankUnlockReq
     * @instance
     */
    BankUnlockReq.prototype.sPassword = "";

    /**
     * Creates a new BankUnlockReq instance using the specified properties.
     * @function create
     * @memberof BankUnlockReq
     * @static
     * @param {IBankUnlockReq=} [properties] Properties to set
     * @returns {BankUnlockReq} BankUnlockReq instance
     */
    BankUnlockReq.create = function create(properties) {
        return new BankUnlockReq(properties);
    };

    /**
     * Encodes the specified BankUnlockReq message. Does not implicitly {@link BankUnlockReq.verify|verify} messages.
     * @function encode
     * @memberof BankUnlockReq
     * @static
     * @param {IBankUnlockReq} message BankUnlockReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankUnlockReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPassword);
        return writer;
    };

    /**
     * Encodes the specified BankUnlockReq message, length delimited. Does not implicitly {@link BankUnlockReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankUnlockReq
     * @static
     * @param {IBankUnlockReq} message BankUnlockReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankUnlockReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankUnlockReq message from the specified reader or buffer.
     * @function decode
     * @memberof BankUnlockReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankUnlockReq} BankUnlockReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankUnlockReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankUnlockReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sPassword = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sPassword"))
            throw $util.ProtocolError("missing required 'sPassword'", { instance: message });
        return message;
    };

    /**
     * Decodes a BankUnlockReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankUnlockReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankUnlockReq} BankUnlockReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankUnlockReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankUnlockReq message.
     * @function verify
     * @memberof BankUnlockReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankUnlockReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sPassword))
            return "sPassword: string expected";
        return null;
    };

    /**
     * Creates a BankUnlockReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankUnlockReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankUnlockReq} BankUnlockReq
     */
    BankUnlockReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BankUnlockReq)
            return object;
        var message = new $root.BankUnlockReq();
        if (object.sPassword != null)
            message.sPassword = String(object.sPassword);
        return message;
    };

    /**
     * Creates a plain object from a BankUnlockReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankUnlockReq
     * @static
     * @param {BankUnlockReq} message BankUnlockReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankUnlockReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sPassword = "";
        if (message.sPassword != null && message.hasOwnProperty("sPassword"))
            object.sPassword = message.sPassword;
        return object;
    };

    /**
     * Converts this BankUnlockReq to JSON.
     * @function toJSON
     * @memberof BankUnlockReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankUnlockReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankUnlockReq;
})();

$root.BankUnlockRsp = (function() {

    /**
     * Properties of a BankUnlockRsp.
     * @exports IBankUnlockRsp
     * @interface IBankUnlockRsp
     * @property {number} nResult BankUnlockRsp nResult
     * @property {ITreasure|null} [tTreasure] BankUnlockRsp tTreasure
     * @property {string|null} [sErrStr] BankUnlockRsp sErrStr
     */

    /**
     * Constructs a new BankUnlockRsp.
     * @exports BankUnlockRsp
     * @classdesc Represents a BankUnlockRsp.
     * @implements IBankUnlockRsp
     * @constructor
     * @param {IBankUnlockRsp=} [properties] Properties to set
     */
    function BankUnlockRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankUnlockRsp nResult.
     * @member {number} nResult
     * @memberof BankUnlockRsp
     * @instance
     */
    BankUnlockRsp.prototype.nResult = 0;

    /**
     * BankUnlockRsp tTreasure.
     * @member {ITreasure|null|undefined} tTreasure
     * @memberof BankUnlockRsp
     * @instance
     */
    BankUnlockRsp.prototype.tTreasure = null;

    /**
     * BankUnlockRsp sErrStr.
     * @member {string} sErrStr
     * @memberof BankUnlockRsp
     * @instance
     */
    BankUnlockRsp.prototype.sErrStr = "";

    /**
     * Creates a new BankUnlockRsp instance using the specified properties.
     * @function create
     * @memberof BankUnlockRsp
     * @static
     * @param {IBankUnlockRsp=} [properties] Properties to set
     * @returns {BankUnlockRsp} BankUnlockRsp instance
     */
    BankUnlockRsp.create = function create(properties) {
        return new BankUnlockRsp(properties);
    };

    /**
     * Encodes the specified BankUnlockRsp message. Does not implicitly {@link BankUnlockRsp.verify|verify} messages.
     * @function encode
     * @memberof BankUnlockRsp
     * @static
     * @param {IBankUnlockRsp} message BankUnlockRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankUnlockRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.tTreasure != null && Object.hasOwnProperty.call(message, "tTreasure"))
            $root.Treasure.encode(message.tTreasure, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sErrStr);
        return writer;
    };

    /**
     * Encodes the specified BankUnlockRsp message, length delimited. Does not implicitly {@link BankUnlockRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankUnlockRsp
     * @static
     * @param {IBankUnlockRsp} message BankUnlockRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankUnlockRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankUnlockRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BankUnlockRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankUnlockRsp} BankUnlockRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankUnlockRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankUnlockRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.tTreasure = $root.Treasure.decode(reader, reader.uint32());
                break;
            case 3:
                message.sErrStr = reader.string();
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
     * Decodes a BankUnlockRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankUnlockRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankUnlockRsp} BankUnlockRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankUnlockRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankUnlockRsp message.
     * @function verify
     * @memberof BankUnlockRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankUnlockRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure")) {
            var error = $root.Treasure.verify(message.tTreasure);
            if (error)
                return "tTreasure." + error;
        }
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        return null;
    };

    /**
     * Creates a BankUnlockRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankUnlockRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankUnlockRsp} BankUnlockRsp
     */
    BankUnlockRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BankUnlockRsp)
            return object;
        var message = new $root.BankUnlockRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.tTreasure != null) {
            if (typeof object.tTreasure !== "object")
                throw TypeError(".BankUnlockRsp.tTreasure: object expected");
            message.tTreasure = $root.Treasure.fromObject(object.tTreasure);
        }
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        return message;
    };

    /**
     * Creates a plain object from a BankUnlockRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankUnlockRsp
     * @static
     * @param {BankUnlockRsp} message BankUnlockRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankUnlockRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.tTreasure = null;
            object.sErrStr = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure"))
            object.tTreasure = $root.Treasure.toObject(message.tTreasure, options);
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        return object;
    };

    /**
     * Converts this BankUnlockRsp to JSON.
     * @function toJSON
     * @memberof BankUnlockRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankUnlockRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankUnlockRsp;
})();

$root.BankAccessReq = (function() {

    /**
     * Properties of a BankAccessReq.
     * @exports IBankAccessReq
     * @interface IBankAccessReq
     * @property {number} nOperation BankAccessReq nOperation
     * @property {number} nGold BankAccessReq nGold
     */

    /**
     * Constructs a new BankAccessReq.
     * @exports BankAccessReq
     * @classdesc Represents a BankAccessReq.
     * @implements IBankAccessReq
     * @constructor
     * @param {IBankAccessReq=} [properties] Properties to set
     */
    function BankAccessReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankAccessReq nOperation.
     * @member {number} nOperation
     * @memberof BankAccessReq
     * @instance
     */
    BankAccessReq.prototype.nOperation = 0;

    /**
     * BankAccessReq nGold.
     * @member {number} nGold
     * @memberof BankAccessReq
     * @instance
     */
    BankAccessReq.prototype.nGold = 0;

    /**
     * Creates a new BankAccessReq instance using the specified properties.
     * @function create
     * @memberof BankAccessReq
     * @static
     * @param {IBankAccessReq=} [properties] Properties to set
     * @returns {BankAccessReq} BankAccessReq instance
     */
    BankAccessReq.create = function create(properties) {
        return new BankAccessReq(properties);
    };

    /**
     * Encodes the specified BankAccessReq message. Does not implicitly {@link BankAccessReq.verify|verify} messages.
     * @function encode
     * @memberof BankAccessReq
     * @static
     * @param {IBankAccessReq} message BankAccessReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nOperation);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nGold);
        return writer;
    };

    /**
     * Encodes the specified BankAccessReq message, length delimited. Does not implicitly {@link BankAccessReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankAccessReq
     * @static
     * @param {IBankAccessReq} message BankAccessReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankAccessReq message from the specified reader or buffer.
     * @function decode
     * @memberof BankAccessReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankAccessReq} BankAccessReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankAccessReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nOperation = reader.int32();
                break;
            case 2:
                message.nGold = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nOperation"))
            throw $util.ProtocolError("missing required 'nOperation'", { instance: message });
        if (!message.hasOwnProperty("nGold"))
            throw $util.ProtocolError("missing required 'nGold'", { instance: message });
        return message;
    };

    /**
     * Decodes a BankAccessReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankAccessReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankAccessReq} BankAccessReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankAccessReq message.
     * @function verify
     * @memberof BankAccessReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankAccessReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nOperation))
            return "nOperation: integer expected";
        if (!$util.isInteger(message.nGold))
            return "nGold: integer expected";
        return null;
    };

    /**
     * Creates a BankAccessReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankAccessReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankAccessReq} BankAccessReq
     */
    BankAccessReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BankAccessReq)
            return object;
        var message = new $root.BankAccessReq();
        if (object.nOperation != null)
            message.nOperation = object.nOperation | 0;
        if (object.nGold != null)
            message.nGold = object.nGold | 0;
        return message;
    };

    /**
     * Creates a plain object from a BankAccessReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankAccessReq
     * @static
     * @param {BankAccessReq} message BankAccessReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankAccessReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nOperation = 0;
            object.nGold = 0;
        }
        if (message.nOperation != null && message.hasOwnProperty("nOperation"))
            object.nOperation = message.nOperation;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = message.nGold;
        return object;
    };

    /**
     * Converts this BankAccessReq to JSON.
     * @function toJSON
     * @memberof BankAccessReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankAccessReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankAccessReq;
})();

$root.BankAccessRsp = (function() {

    /**
     * Properties of a BankAccessRsp.
     * @exports IBankAccessRsp
     * @interface IBankAccessRsp
     * @property {number} nResult BankAccessRsp nResult
     * @property {ITreasure|null} [tTreasure] BankAccessRsp tTreasure
     * @property {string|null} [sErrStr] BankAccessRsp sErrStr
     * @property {number} nOperation BankAccessRsp nOperation
     */

    /**
     * Constructs a new BankAccessRsp.
     * @exports BankAccessRsp
     * @classdesc Represents a BankAccessRsp.
     * @implements IBankAccessRsp
     * @constructor
     * @param {IBankAccessRsp=} [properties] Properties to set
     */
    function BankAccessRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankAccessRsp nResult.
     * @member {number} nResult
     * @memberof BankAccessRsp
     * @instance
     */
    BankAccessRsp.prototype.nResult = 0;

    /**
     * BankAccessRsp tTreasure.
     * @member {ITreasure|null|undefined} tTreasure
     * @memberof BankAccessRsp
     * @instance
     */
    BankAccessRsp.prototype.tTreasure = null;

    /**
     * BankAccessRsp sErrStr.
     * @member {string} sErrStr
     * @memberof BankAccessRsp
     * @instance
     */
    BankAccessRsp.prototype.sErrStr = "";

    /**
     * BankAccessRsp nOperation.
     * @member {number} nOperation
     * @memberof BankAccessRsp
     * @instance
     */
    BankAccessRsp.prototype.nOperation = 0;

    /**
     * Creates a new BankAccessRsp instance using the specified properties.
     * @function create
     * @memberof BankAccessRsp
     * @static
     * @param {IBankAccessRsp=} [properties] Properties to set
     * @returns {BankAccessRsp} BankAccessRsp instance
     */
    BankAccessRsp.create = function create(properties) {
        return new BankAccessRsp(properties);
    };

    /**
     * Encodes the specified BankAccessRsp message. Does not implicitly {@link BankAccessRsp.verify|verify} messages.
     * @function encode
     * @memberof BankAccessRsp
     * @static
     * @param {IBankAccessRsp} message BankAccessRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.tTreasure != null && Object.hasOwnProperty.call(message, "tTreasure"))
            $root.Treasure.encode(message.tTreasure, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sErrStr);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nOperation);
        return writer;
    };

    /**
     * Encodes the specified BankAccessRsp message, length delimited. Does not implicitly {@link BankAccessRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankAccessRsp
     * @static
     * @param {IBankAccessRsp} message BankAccessRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankAccessRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BankAccessRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankAccessRsp} BankAccessRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankAccessRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.tTreasure = $root.Treasure.decode(reader, reader.uint32());
                break;
            case 3:
                message.sErrStr = reader.string();
                break;
            case 4:
                message.nOperation = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nResult"))
            throw $util.ProtocolError("missing required 'nResult'", { instance: message });
        if (!message.hasOwnProperty("nOperation"))
            throw $util.ProtocolError("missing required 'nOperation'", { instance: message });
        return message;
    };

    /**
     * Decodes a BankAccessRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankAccessRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankAccessRsp} BankAccessRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankAccessRsp message.
     * @function verify
     * @memberof BankAccessRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankAccessRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure")) {
            var error = $root.Treasure.verify(message.tTreasure);
            if (error)
                return "tTreasure." + error;
        }
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        if (!$util.isInteger(message.nOperation))
            return "nOperation: integer expected";
        return null;
    };

    /**
     * Creates a BankAccessRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankAccessRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankAccessRsp} BankAccessRsp
     */
    BankAccessRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BankAccessRsp)
            return object;
        var message = new $root.BankAccessRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.tTreasure != null) {
            if (typeof object.tTreasure !== "object")
                throw TypeError(".BankAccessRsp.tTreasure: object expected");
            message.tTreasure = $root.Treasure.fromObject(object.tTreasure);
        }
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        if (object.nOperation != null)
            message.nOperation = object.nOperation | 0;
        return message;
    };

    /**
     * Creates a plain object from a BankAccessRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankAccessRsp
     * @static
     * @param {BankAccessRsp} message BankAccessRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankAccessRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.tTreasure = null;
            object.sErrStr = "";
            object.nOperation = 0;
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.tTreasure != null && message.hasOwnProperty("tTreasure"))
            object.tTreasure = $root.Treasure.toObject(message.tTreasure, options);
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        if (message.nOperation != null && message.hasOwnProperty("nOperation"))
            object.nOperation = message.nOperation;
        return object;
    };

    /**
     * Converts this BankAccessRsp to JSON.
     * @function toJSON
     * @memberof BankAccessRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankAccessRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankAccessRsp;
})();

$root.BankPasswordChangeReq = (function() {

    /**
     * Properties of a BankPasswordChangeReq.
     * @exports IBankPasswordChangeReq
     * @interface IBankPasswordChangeReq
     * @property {string} sOldPassword BankPasswordChangeReq sOldPassword
     * @property {string} sNewPassword BankPasswordChangeReq sNewPassword
     * @property {string} sOkPassword BankPasswordChangeReq sOkPassword
     */

    /**
     * Constructs a new BankPasswordChangeReq.
     * @exports BankPasswordChangeReq
     * @classdesc Represents a BankPasswordChangeReq.
     * @implements IBankPasswordChangeReq
     * @constructor
     * @param {IBankPasswordChangeReq=} [properties] Properties to set
     */
    function BankPasswordChangeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankPasswordChangeReq sOldPassword.
     * @member {string} sOldPassword
     * @memberof BankPasswordChangeReq
     * @instance
     */
    BankPasswordChangeReq.prototype.sOldPassword = "";

    /**
     * BankPasswordChangeReq sNewPassword.
     * @member {string} sNewPassword
     * @memberof BankPasswordChangeReq
     * @instance
     */
    BankPasswordChangeReq.prototype.sNewPassword = "";

    /**
     * BankPasswordChangeReq sOkPassword.
     * @member {string} sOkPassword
     * @memberof BankPasswordChangeReq
     * @instance
     */
    BankPasswordChangeReq.prototype.sOkPassword = "";

    /**
     * Creates a new BankPasswordChangeReq instance using the specified properties.
     * @function create
     * @memberof BankPasswordChangeReq
     * @static
     * @param {IBankPasswordChangeReq=} [properties] Properties to set
     * @returns {BankPasswordChangeReq} BankPasswordChangeReq instance
     */
    BankPasswordChangeReq.create = function create(properties) {
        return new BankPasswordChangeReq(properties);
    };

    /**
     * Encodes the specified BankPasswordChangeReq message. Does not implicitly {@link BankPasswordChangeReq.verify|verify} messages.
     * @function encode
     * @memberof BankPasswordChangeReq
     * @static
     * @param {IBankPasswordChangeReq} message BankPasswordChangeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankPasswordChangeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sOldPassword);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sNewPassword);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sOkPassword);
        return writer;
    };

    /**
     * Encodes the specified BankPasswordChangeReq message, length delimited. Does not implicitly {@link BankPasswordChangeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankPasswordChangeReq
     * @static
     * @param {IBankPasswordChangeReq} message BankPasswordChangeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankPasswordChangeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankPasswordChangeReq message from the specified reader or buffer.
     * @function decode
     * @memberof BankPasswordChangeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankPasswordChangeReq} BankPasswordChangeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankPasswordChangeReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankPasswordChangeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sOldPassword = reader.string();
                break;
            case 2:
                message.sNewPassword = reader.string();
                break;
            case 3:
                message.sOkPassword = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sOldPassword"))
            throw $util.ProtocolError("missing required 'sOldPassword'", { instance: message });
        if (!message.hasOwnProperty("sNewPassword"))
            throw $util.ProtocolError("missing required 'sNewPassword'", { instance: message });
        if (!message.hasOwnProperty("sOkPassword"))
            throw $util.ProtocolError("missing required 'sOkPassword'", { instance: message });
        return message;
    };

    /**
     * Decodes a BankPasswordChangeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankPasswordChangeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankPasswordChangeReq} BankPasswordChangeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankPasswordChangeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankPasswordChangeReq message.
     * @function verify
     * @memberof BankPasswordChangeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankPasswordChangeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sOldPassword))
            return "sOldPassword: string expected";
        if (!$util.isString(message.sNewPassword))
            return "sNewPassword: string expected";
        if (!$util.isString(message.sOkPassword))
            return "sOkPassword: string expected";
        return null;
    };

    /**
     * Creates a BankPasswordChangeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankPasswordChangeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankPasswordChangeReq} BankPasswordChangeReq
     */
    BankPasswordChangeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BankPasswordChangeReq)
            return object;
        var message = new $root.BankPasswordChangeReq();
        if (object.sOldPassword != null)
            message.sOldPassword = String(object.sOldPassword);
        if (object.sNewPassword != null)
            message.sNewPassword = String(object.sNewPassword);
        if (object.sOkPassword != null)
            message.sOkPassword = String(object.sOkPassword);
        return message;
    };

    /**
     * Creates a plain object from a BankPasswordChangeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankPasswordChangeReq
     * @static
     * @param {BankPasswordChangeReq} message BankPasswordChangeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankPasswordChangeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sOldPassword = "";
            object.sNewPassword = "";
            object.sOkPassword = "";
        }
        if (message.sOldPassword != null && message.hasOwnProperty("sOldPassword"))
            object.sOldPassword = message.sOldPassword;
        if (message.sNewPassword != null && message.hasOwnProperty("sNewPassword"))
            object.sNewPassword = message.sNewPassword;
        if (message.sOkPassword != null && message.hasOwnProperty("sOkPassword"))
            object.sOkPassword = message.sOkPassword;
        return object;
    };

    /**
     * Converts this BankPasswordChangeReq to JSON.
     * @function toJSON
     * @memberof BankPasswordChangeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankPasswordChangeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankPasswordChangeReq;
})();

$root.BankPasswordChangeRsp = (function() {

    /**
     * Properties of a BankPasswordChangeRsp.
     * @exports IBankPasswordChangeRsp
     * @interface IBankPasswordChangeRsp
     * @property {number} nResult BankPasswordChangeRsp nResult
     * @property {string|null} [sErrStr] BankPasswordChangeRsp sErrStr
     */

    /**
     * Constructs a new BankPasswordChangeRsp.
     * @exports BankPasswordChangeRsp
     * @classdesc Represents a BankPasswordChangeRsp.
     * @implements IBankPasswordChangeRsp
     * @constructor
     * @param {IBankPasswordChangeRsp=} [properties] Properties to set
     */
    function BankPasswordChangeRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankPasswordChangeRsp nResult.
     * @member {number} nResult
     * @memberof BankPasswordChangeRsp
     * @instance
     */
    BankPasswordChangeRsp.prototype.nResult = 0;

    /**
     * BankPasswordChangeRsp sErrStr.
     * @member {string} sErrStr
     * @memberof BankPasswordChangeRsp
     * @instance
     */
    BankPasswordChangeRsp.prototype.sErrStr = "";

    /**
     * Creates a new BankPasswordChangeRsp instance using the specified properties.
     * @function create
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {IBankPasswordChangeRsp=} [properties] Properties to set
     * @returns {BankPasswordChangeRsp} BankPasswordChangeRsp instance
     */
    BankPasswordChangeRsp.create = function create(properties) {
        return new BankPasswordChangeRsp(properties);
    };

    /**
     * Encodes the specified BankPasswordChangeRsp message. Does not implicitly {@link BankPasswordChangeRsp.verify|verify} messages.
     * @function encode
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {IBankPasswordChangeRsp} message BankPasswordChangeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankPasswordChangeRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sErrStr);
        return writer;
    };

    /**
     * Encodes the specified BankPasswordChangeRsp message, length delimited. Does not implicitly {@link BankPasswordChangeRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {IBankPasswordChangeRsp} message BankPasswordChangeRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankPasswordChangeRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankPasswordChangeRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankPasswordChangeRsp} BankPasswordChangeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankPasswordChangeRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankPasswordChangeRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.sErrStr = reader.string();
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
     * Decodes a BankPasswordChangeRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankPasswordChangeRsp} BankPasswordChangeRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankPasswordChangeRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankPasswordChangeRsp message.
     * @function verify
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankPasswordChangeRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        return null;
    };

    /**
     * Creates a BankPasswordChangeRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankPasswordChangeRsp} BankPasswordChangeRsp
     */
    BankPasswordChangeRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BankPasswordChangeRsp)
            return object;
        var message = new $root.BankPasswordChangeRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        return message;
    };

    /**
     * Creates a plain object from a BankPasswordChangeRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankPasswordChangeRsp
     * @static
     * @param {BankPasswordChangeRsp} message BankPasswordChangeRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankPasswordChangeRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.sErrStr = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        return object;
    };

    /**
     * Converts this BankPasswordChangeRsp to JSON.
     * @function toJSON
     * @memberof BankPasswordChangeRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankPasswordChangeRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankPasswordChangeRsp;
})();

$root.BankAccessDetailReq = (function() {

    /**
     * Properties of a BankAccessDetailReq.
     * @exports IBankAccessDetailReq
     * @interface IBankAccessDetailReq
     * @property {number|null} [nNoUse] BankAccessDetailReq nNoUse
     */

    /**
     * Constructs a new BankAccessDetailReq.
     * @exports BankAccessDetailReq
     * @classdesc Represents a BankAccessDetailReq.
     * @implements IBankAccessDetailReq
     * @constructor
     * @param {IBankAccessDetailReq=} [properties] Properties to set
     */
    function BankAccessDetailReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankAccessDetailReq nNoUse.
     * @member {number} nNoUse
     * @memberof BankAccessDetailReq
     * @instance
     */
    BankAccessDetailReq.prototype.nNoUse = 0;

    /**
     * Creates a new BankAccessDetailReq instance using the specified properties.
     * @function create
     * @memberof BankAccessDetailReq
     * @static
     * @param {IBankAccessDetailReq=} [properties] Properties to set
     * @returns {BankAccessDetailReq} BankAccessDetailReq instance
     */
    BankAccessDetailReq.create = function create(properties) {
        return new BankAccessDetailReq(properties);
    };

    /**
     * Encodes the specified BankAccessDetailReq message. Does not implicitly {@link BankAccessDetailReq.verify|verify} messages.
     * @function encode
     * @memberof BankAccessDetailReq
     * @static
     * @param {IBankAccessDetailReq} message BankAccessDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessDetailReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nNoUse != null && Object.hasOwnProperty.call(message, "nNoUse"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nNoUse);
        return writer;
    };

    /**
     * Encodes the specified BankAccessDetailReq message, length delimited. Does not implicitly {@link BankAccessDetailReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankAccessDetailReq
     * @static
     * @param {IBankAccessDetailReq} message BankAccessDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessDetailReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankAccessDetailReq message from the specified reader or buffer.
     * @function decode
     * @memberof BankAccessDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankAccessDetailReq} BankAccessDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessDetailReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankAccessDetailReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nNoUse = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BankAccessDetailReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankAccessDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankAccessDetailReq} BankAccessDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessDetailReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankAccessDetailReq message.
     * @function verify
     * @memberof BankAccessDetailReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankAccessDetailReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            if (!$util.isInteger(message.nNoUse))
                return "nNoUse: integer expected";
        return null;
    };

    /**
     * Creates a BankAccessDetailReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankAccessDetailReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankAccessDetailReq} BankAccessDetailReq
     */
    BankAccessDetailReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BankAccessDetailReq)
            return object;
        var message = new $root.BankAccessDetailReq();
        if (object.nNoUse != null)
            message.nNoUse = object.nNoUse | 0;
        return message;
    };

    /**
     * Creates a plain object from a BankAccessDetailReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankAccessDetailReq
     * @static
     * @param {BankAccessDetailReq} message BankAccessDetailReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankAccessDetailReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.nNoUse = 0;
        if (message.nNoUse != null && message.hasOwnProperty("nNoUse"))
            object.nNoUse = message.nNoUse;
        return object;
    };

    /**
     * Converts this BankAccessDetailReq to JSON.
     * @function toJSON
     * @memberof BankAccessDetailReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankAccessDetailReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BankAccessDetailReq;
})();

$root.BankAccessDetailRsp = (function() {

    /**
     * Properties of a BankAccessDetailRsp.
     * @exports IBankAccessDetailRsp
     * @interface IBankAccessDetailRsp
     * @property {number} nResult BankAccessDetailRsp nResult
     * @property {Array.<BankAccessDetailRsp.IItem>|null} [arrDetails] BankAccessDetailRsp arrDetails
     */

    /**
     * Constructs a new BankAccessDetailRsp.
     * @exports BankAccessDetailRsp
     * @classdesc Represents a BankAccessDetailRsp.
     * @implements IBankAccessDetailRsp
     * @constructor
     * @param {IBankAccessDetailRsp=} [properties] Properties to set
     */
    function BankAccessDetailRsp(properties) {
        this.arrDetails = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BankAccessDetailRsp nResult.
     * @member {number} nResult
     * @memberof BankAccessDetailRsp
     * @instance
     */
    BankAccessDetailRsp.prototype.nResult = 0;

    /**
     * BankAccessDetailRsp arrDetails.
     * @member {Array.<BankAccessDetailRsp.IItem>} arrDetails
     * @memberof BankAccessDetailRsp
     * @instance
     */
    BankAccessDetailRsp.prototype.arrDetails = $util.emptyArray;

    /**
     * Creates a new BankAccessDetailRsp instance using the specified properties.
     * @function create
     * @memberof BankAccessDetailRsp
     * @static
     * @param {IBankAccessDetailRsp=} [properties] Properties to set
     * @returns {BankAccessDetailRsp} BankAccessDetailRsp instance
     */
    BankAccessDetailRsp.create = function create(properties) {
        return new BankAccessDetailRsp(properties);
    };

    /**
     * Encodes the specified BankAccessDetailRsp message. Does not implicitly {@link BankAccessDetailRsp.verify|verify} messages.
     * @function encode
     * @memberof BankAccessDetailRsp
     * @static
     * @param {IBankAccessDetailRsp} message BankAccessDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessDetailRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.arrDetails != null && message.arrDetails.length)
            for (var i = 0; i < message.arrDetails.length; ++i)
                $root.BankAccessDetailRsp.Item.encode(message.arrDetails[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BankAccessDetailRsp message, length delimited. Does not implicitly {@link BankAccessDetailRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BankAccessDetailRsp
     * @static
     * @param {IBankAccessDetailRsp} message BankAccessDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BankAccessDetailRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BankAccessDetailRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BankAccessDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BankAccessDetailRsp} BankAccessDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessDetailRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankAccessDetailRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                if (!(message.arrDetails && message.arrDetails.length))
                    message.arrDetails = [];
                message.arrDetails.push($root.BankAccessDetailRsp.Item.decode(reader, reader.uint32()));
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
     * Decodes a BankAccessDetailRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BankAccessDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BankAccessDetailRsp} BankAccessDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BankAccessDetailRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BankAccessDetailRsp message.
     * @function verify
     * @memberof BankAccessDetailRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BankAccessDetailRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.arrDetails != null && message.hasOwnProperty("arrDetails")) {
            if (!Array.isArray(message.arrDetails))
                return "arrDetails: array expected";
            for (var i = 0; i < message.arrDetails.length; ++i) {
                var error = $root.BankAccessDetailRsp.Item.verify(message.arrDetails[i]);
                if (error)
                    return "arrDetails." + error;
            }
        }
        return null;
    };

    /**
     * Creates a BankAccessDetailRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BankAccessDetailRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BankAccessDetailRsp} BankAccessDetailRsp
     */
    BankAccessDetailRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BankAccessDetailRsp)
            return object;
        var message = new $root.BankAccessDetailRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.arrDetails) {
            if (!Array.isArray(object.arrDetails))
                throw TypeError(".BankAccessDetailRsp.arrDetails: array expected");
            message.arrDetails = [];
            for (var i = 0; i < object.arrDetails.length; ++i) {
                if (typeof object.arrDetails[i] !== "object")
                    throw TypeError(".BankAccessDetailRsp.arrDetails: object expected");
                message.arrDetails[i] = $root.BankAccessDetailRsp.Item.fromObject(object.arrDetails[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a BankAccessDetailRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BankAccessDetailRsp
     * @static
     * @param {BankAccessDetailRsp} message BankAccessDetailRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BankAccessDetailRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrDetails = [];
        if (options.defaults)
            object.nResult = 0;
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.arrDetails && message.arrDetails.length) {
            object.arrDetails = [];
            for (var j = 0; j < message.arrDetails.length; ++j)
                object.arrDetails[j] = $root.BankAccessDetailRsp.Item.toObject(message.arrDetails[j], options);
        }
        return object;
    };

    /**
     * Converts this BankAccessDetailRsp to JSON.
     * @function toJSON
     * @memberof BankAccessDetailRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BankAccessDetailRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    BankAccessDetailRsp.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof BankAccessDetailRsp
         * @interface IItem
         * @property {string} sTime Item sTime
         * @property {number} nOperation Item nOperation
         * @property {number} nGold Item nGold
         */

        /**
         * Constructs a new Item.
         * @memberof BankAccessDetailRsp
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {BankAccessDetailRsp.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item sTime.
         * @member {string} sTime
         * @memberof BankAccessDetailRsp.Item
         * @instance
         */
        Item.prototype.sTime = "";

        /**
         * Item nOperation.
         * @member {number} nOperation
         * @memberof BankAccessDetailRsp.Item
         * @instance
         */
        Item.prototype.nOperation = 0;

        /**
         * Item nGold.
         * @member {number} nGold
         * @memberof BankAccessDetailRsp.Item
         * @instance
         */
        Item.prototype.nGold = 0;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {BankAccessDetailRsp.IItem=} [properties] Properties to set
         * @returns {BankAccessDetailRsp.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link BankAccessDetailRsp.Item.verify|verify} messages.
         * @function encode
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {BankAccessDetailRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sTime);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nOperation);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nGold);
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link BankAccessDetailRsp.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {BankAccessDetailRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BankAccessDetailRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BankAccessDetailRsp.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sTime = reader.string();
                    break;
                case 2:
                    message.nOperation = reader.int32();
                    break;
                case 3:
                    message.nGold = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sTime"))
                throw $util.ProtocolError("missing required 'sTime'", { instance: message });
            if (!message.hasOwnProperty("nOperation"))
                throw $util.ProtocolError("missing required 'nOperation'", { instance: message });
            if (!message.hasOwnProperty("nGold"))
                throw $util.ProtocolError("missing required 'nGold'", { instance: message });
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BankAccessDetailRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sTime))
                return "sTime: string expected";
            if (!$util.isInteger(message.nOperation))
                return "nOperation: integer expected";
            if (!$util.isInteger(message.nGold))
                return "nGold: integer expected";
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BankAccessDetailRsp.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.BankAccessDetailRsp.Item)
                return object;
            var message = new $root.BankAccessDetailRsp.Item();
            if (object.sTime != null)
                message.sTime = String(object.sTime);
            if (object.nOperation != null)
                message.nOperation = object.nOperation | 0;
            if (object.nGold != null)
                message.nGold = object.nGold | 0;
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BankAccessDetailRsp.Item
         * @static
         * @param {BankAccessDetailRsp.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sTime = "";
                object.nOperation = 0;
                object.nGold = 0;
            }
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                object.sTime = message.sTime;
            if (message.nOperation != null && message.hasOwnProperty("nOperation"))
                object.nOperation = message.nOperation;
            if (message.nGold != null && message.hasOwnProperty("nGold"))
                object.nGold = message.nGold;
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof BankAccessDetailRsp.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    return BankAccessDetailRsp;
})();

$root.PaijuRecordReq = (function() {

    /**
     * Properties of a PaijuRecordReq.
     * @exports IPaijuRecordReq
     * @interface IPaijuRecordReq
     * @property {number|null} [nGameId] PaijuRecordReq nGameId
     * @property {number|null} [nPage] PaijuRecordReq nPage
     */

    /**
     * Constructs a new PaijuRecordReq.
     * @exports PaijuRecordReq
     * @classdesc Represents a PaijuRecordReq.
     * @implements IPaijuRecordReq
     * @constructor
     * @param {IPaijuRecordReq=} [properties] Properties to set
     */
    function PaijuRecordReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PaijuRecordReq nGameId.
     * @member {number} nGameId
     * @memberof PaijuRecordReq
     * @instance
     */
    PaijuRecordReq.prototype.nGameId = 0;

    /**
     * PaijuRecordReq nPage.
     * @member {number} nPage
     * @memberof PaijuRecordReq
     * @instance
     */
    PaijuRecordReq.prototype.nPage = 0;

    /**
     * Creates a new PaijuRecordReq instance using the specified properties.
     * @function create
     * @memberof PaijuRecordReq
     * @static
     * @param {IPaijuRecordReq=} [properties] Properties to set
     * @returns {PaijuRecordReq} PaijuRecordReq instance
     */
    PaijuRecordReq.create = function create(properties) {
        return new PaijuRecordReq(properties);
    };

    /**
     * Encodes the specified PaijuRecordReq message. Does not implicitly {@link PaijuRecordReq.verify|verify} messages.
     * @function encode
     * @memberof PaijuRecordReq
     * @static
     * @param {IPaijuRecordReq} message PaijuRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuRecordReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nGameId != null && Object.hasOwnProperty.call(message, "nGameId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        if (message.nPage != null && Object.hasOwnProperty.call(message, "nPage"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nPage);
        return writer;
    };

    /**
     * Encodes the specified PaijuRecordReq message, length delimited. Does not implicitly {@link PaijuRecordReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PaijuRecordReq
     * @static
     * @param {IPaijuRecordReq} message PaijuRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuRecordReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PaijuRecordReq message from the specified reader or buffer.
     * @function decode
     * @memberof PaijuRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PaijuRecordReq} PaijuRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuRecordReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaijuRecordReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGameId = reader.int32();
                break;
            case 2:
                message.nPage = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PaijuRecordReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PaijuRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PaijuRecordReq} PaijuRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuRecordReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PaijuRecordReq message.
     * @function verify
     * @memberof PaijuRecordReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PaijuRecordReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            if (!$util.isInteger(message.nGameId))
                return "nGameId: integer expected";
        if (message.nPage != null && message.hasOwnProperty("nPage"))
            if (!$util.isInteger(message.nPage))
                return "nPage: integer expected";
        return null;
    };

    /**
     * Creates a PaijuRecordReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PaijuRecordReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PaijuRecordReq} PaijuRecordReq
     */
    PaijuRecordReq.fromObject = function fromObject(object) {
        if (object instanceof $root.PaijuRecordReq)
            return object;
        var message = new $root.PaijuRecordReq();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nPage != null)
            message.nPage = object.nPage | 0;
        return message;
    };

    /**
     * Creates a plain object from a PaijuRecordReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PaijuRecordReq
     * @static
     * @param {PaijuRecordReq} message PaijuRecordReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PaijuRecordReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nGameId = 0;
            object.nPage = 0;
        }
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.nPage != null && message.hasOwnProperty("nPage"))
            object.nPage = message.nPage;
        return object;
    };

    /**
     * Converts this PaijuRecordReq to JSON.
     * @function toJSON
     * @memberof PaijuRecordReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PaijuRecordReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PaijuRecordReq;
})();

$root.PaijuRecordRsp = (function() {

    /**
     * Properties of a PaijuRecordRsp.
     * @exports IPaijuRecordRsp
     * @interface IPaijuRecordRsp
     * @property {number|null} [nSumPage] PaijuRecordRsp nSumPage
     * @property {Array.<PaijuRecordRsp.IItem>|null} [arrRecords] PaijuRecordRsp arrRecords
     */

    /**
     * Constructs a new PaijuRecordRsp.
     * @exports PaijuRecordRsp
     * @classdesc Represents a PaijuRecordRsp.
     * @implements IPaijuRecordRsp
     * @constructor
     * @param {IPaijuRecordRsp=} [properties] Properties to set
     */
    function PaijuRecordRsp(properties) {
        this.arrRecords = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PaijuRecordRsp nSumPage.
     * @member {number} nSumPage
     * @memberof PaijuRecordRsp
     * @instance
     */
    PaijuRecordRsp.prototype.nSumPage = 0;

    /**
     * PaijuRecordRsp arrRecords.
     * @member {Array.<PaijuRecordRsp.IItem>} arrRecords
     * @memberof PaijuRecordRsp
     * @instance
     */
    PaijuRecordRsp.prototype.arrRecords = $util.emptyArray;

    /**
     * Creates a new PaijuRecordRsp instance using the specified properties.
     * @function create
     * @memberof PaijuRecordRsp
     * @static
     * @param {IPaijuRecordRsp=} [properties] Properties to set
     * @returns {PaijuRecordRsp} PaijuRecordRsp instance
     */
    PaijuRecordRsp.create = function create(properties) {
        return new PaijuRecordRsp(properties);
    };

    /**
     * Encodes the specified PaijuRecordRsp message. Does not implicitly {@link PaijuRecordRsp.verify|verify} messages.
     * @function encode
     * @memberof PaijuRecordRsp
     * @static
     * @param {IPaijuRecordRsp} message PaijuRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuRecordRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nSumPage != null && Object.hasOwnProperty.call(message, "nSumPage"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nSumPage);
        if (message.arrRecords != null && message.arrRecords.length)
            for (var i = 0; i < message.arrRecords.length; ++i)
                $root.PaijuRecordRsp.Item.encode(message.arrRecords[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PaijuRecordRsp message, length delimited. Does not implicitly {@link PaijuRecordRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PaijuRecordRsp
     * @static
     * @param {IPaijuRecordRsp} message PaijuRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuRecordRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PaijuRecordRsp message from the specified reader or buffer.
     * @function decode
     * @memberof PaijuRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PaijuRecordRsp} PaijuRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuRecordRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaijuRecordRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nSumPage = reader.int32();
                break;
            case 2:
                if (!(message.arrRecords && message.arrRecords.length))
                    message.arrRecords = [];
                message.arrRecords.push($root.PaijuRecordRsp.Item.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PaijuRecordRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PaijuRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PaijuRecordRsp} PaijuRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuRecordRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PaijuRecordRsp message.
     * @function verify
     * @memberof PaijuRecordRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PaijuRecordRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nSumPage != null && message.hasOwnProperty("nSumPage"))
            if (!$util.isInteger(message.nSumPage))
                return "nSumPage: integer expected";
        if (message.arrRecords != null && message.hasOwnProperty("arrRecords")) {
            if (!Array.isArray(message.arrRecords))
                return "arrRecords: array expected";
            for (var i = 0; i < message.arrRecords.length; ++i) {
                var error = $root.PaijuRecordRsp.Item.verify(message.arrRecords[i]);
                if (error)
                    return "arrRecords." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PaijuRecordRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PaijuRecordRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PaijuRecordRsp} PaijuRecordRsp
     */
    PaijuRecordRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.PaijuRecordRsp)
            return object;
        var message = new $root.PaijuRecordRsp();
        if (object.nSumPage != null)
            message.nSumPage = object.nSumPage | 0;
        if (object.arrRecords) {
            if (!Array.isArray(object.arrRecords))
                throw TypeError(".PaijuRecordRsp.arrRecords: array expected");
            message.arrRecords = [];
            for (var i = 0; i < object.arrRecords.length; ++i) {
                if (typeof object.arrRecords[i] !== "object")
                    throw TypeError(".PaijuRecordRsp.arrRecords: object expected");
                message.arrRecords[i] = $root.PaijuRecordRsp.Item.fromObject(object.arrRecords[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PaijuRecordRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PaijuRecordRsp
     * @static
     * @param {PaijuRecordRsp} message PaijuRecordRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PaijuRecordRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrRecords = [];
        if (options.defaults)
            object.nSumPage = 0;
        if (message.nSumPage != null && message.hasOwnProperty("nSumPage"))
            object.nSumPage = message.nSumPage;
        if (message.arrRecords && message.arrRecords.length) {
            object.arrRecords = [];
            for (var j = 0; j < message.arrRecords.length; ++j)
                object.arrRecords[j] = $root.PaijuRecordRsp.Item.toObject(message.arrRecords[j], options);
        }
        return object;
    };

    /**
     * Converts this PaijuRecordRsp to JSON.
     * @function toJSON
     * @memberof PaijuRecordRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PaijuRecordRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    PaijuRecordRsp.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof PaijuRecordRsp
         * @interface IItem
         * @property {string} sPaiJuID Item sPaiJuID
         * @property {number} nRoomId Item nRoomId
         * @property {number} nProfit Item nProfit
         * @property {string} sTime Item sTime
         * @property {number} nType Item nType
         * @property {number|null} [nAnte] Item nAnte
         */

        /**
         * Constructs a new Item.
         * @memberof PaijuRecordRsp
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {PaijuRecordRsp.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item sPaiJuID.
         * @member {string} sPaiJuID
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.sPaiJuID = "";

        /**
         * Item nRoomId.
         * @member {number} nRoomId
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.nRoomId = 0;

        /**
         * Item nProfit.
         * @member {number} nProfit
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.nProfit = 0;

        /**
         * Item sTime.
         * @member {string} sTime
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.sTime = "";

        /**
         * Item nType.
         * @member {number} nType
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.nType = 0;

        /**
         * Item nAnte.
         * @member {number} nAnte
         * @memberof PaijuRecordRsp.Item
         * @instance
         */
        Item.prototype.nAnte = 0;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {PaijuRecordRsp.IItem=} [properties] Properties to set
         * @returns {PaijuRecordRsp.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link PaijuRecordRsp.Item.verify|verify} messages.
         * @function encode
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {PaijuRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPaiJuID);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRoomId);
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.nProfit);
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sTime);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nType);
            if (message.nAnte != null && Object.hasOwnProperty.call(message, "nAnte"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.nAnte);
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link PaijuRecordRsp.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {PaijuRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PaijuRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaijuRecordRsp.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sPaiJuID = reader.string();
                    break;
                case 2:
                    message.nRoomId = reader.int32();
                    break;
                case 3:
                    message.nProfit = reader.double();
                    break;
                case 4:
                    message.sTime = reader.string();
                    break;
                case 5:
                    message.nType = reader.int32();
                    break;
                case 6:
                    message.nAnte = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sPaiJuID"))
                throw $util.ProtocolError("missing required 'sPaiJuID'", { instance: message });
            if (!message.hasOwnProperty("nRoomId"))
                throw $util.ProtocolError("missing required 'nRoomId'", { instance: message });
            if (!message.hasOwnProperty("nProfit"))
                throw $util.ProtocolError("missing required 'nProfit'", { instance: message });
            if (!message.hasOwnProperty("sTime"))
                throw $util.ProtocolError("missing required 'sTime'", { instance: message });
            if (!message.hasOwnProperty("nType"))
                throw $util.ProtocolError("missing required 'nType'", { instance: message });
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PaijuRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sPaiJuID))
                return "sPaiJuID: string expected";
            if (!$util.isInteger(message.nRoomId))
                return "nRoomId: integer expected";
            if (typeof message.nProfit !== "number")
                return "nProfit: number expected";
            if (!$util.isString(message.sTime))
                return "sTime: string expected";
            if (!$util.isInteger(message.nType))
                return "nType: integer expected";
            if (message.nAnte != null && message.hasOwnProperty("nAnte"))
                if (typeof message.nAnte !== "number")
                    return "nAnte: number expected";
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PaijuRecordRsp.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.PaijuRecordRsp.Item)
                return object;
            var message = new $root.PaijuRecordRsp.Item();
            if (object.sPaiJuID != null)
                message.sPaiJuID = String(object.sPaiJuID);
            if (object.nRoomId != null)
                message.nRoomId = object.nRoomId | 0;
            if (object.nProfit != null)
                message.nProfit = Number(object.nProfit);
            if (object.sTime != null)
                message.sTime = String(object.sTime);
            if (object.nType != null)
                message.nType = object.nType | 0;
            if (object.nAnte != null)
                message.nAnte = Number(object.nAnte);
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PaijuRecordRsp.Item
         * @static
         * @param {PaijuRecordRsp.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sPaiJuID = "";
                object.nRoomId = 0;
                object.nProfit = 0;
                object.sTime = "";
                object.nType = 0;
                object.nAnte = 0;
            }
            if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
                object.sPaiJuID = message.sPaiJuID;
            if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
                object.nRoomId = message.nRoomId;
            if (message.nProfit != null && message.hasOwnProperty("nProfit"))
                object.nProfit = options.json && !isFinite(message.nProfit) ? String(message.nProfit) : message.nProfit;
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                object.sTime = message.sTime;
            if (message.nType != null && message.hasOwnProperty("nType"))
                object.nType = message.nType;
            if (message.nAnte != null && message.hasOwnProperty("nAnte"))
                object.nAnte = options.json && !isFinite(message.nAnte) ? String(message.nAnte) : message.nAnte;
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof PaijuRecordRsp.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    return PaijuRecordRsp;
})();

$root.PaijuDetailReq = (function() {

    /**
     * Properties of a PaijuDetailReq.
     * @exports IPaijuDetailReq
     * @interface IPaijuDetailReq
     * @property {string|null} [sPaiJuID] PaijuDetailReq sPaiJuID
     */

    /**
     * Constructs a new PaijuDetailReq.
     * @exports PaijuDetailReq
     * @classdesc Represents a PaijuDetailReq.
     * @implements IPaijuDetailReq
     * @constructor
     * @param {IPaijuDetailReq=} [properties] Properties to set
     */
    function PaijuDetailReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PaijuDetailReq sPaiJuID.
     * @member {string} sPaiJuID
     * @memberof PaijuDetailReq
     * @instance
     */
    PaijuDetailReq.prototype.sPaiJuID = "";

    /**
     * Creates a new PaijuDetailReq instance using the specified properties.
     * @function create
     * @memberof PaijuDetailReq
     * @static
     * @param {IPaijuDetailReq=} [properties] Properties to set
     * @returns {PaijuDetailReq} PaijuDetailReq instance
     */
    PaijuDetailReq.create = function create(properties) {
        return new PaijuDetailReq(properties);
    };

    /**
     * Encodes the specified PaijuDetailReq message. Does not implicitly {@link PaijuDetailReq.verify|verify} messages.
     * @function encode
     * @memberof PaijuDetailReq
     * @static
     * @param {IPaijuDetailReq} message PaijuDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuDetailReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sPaiJuID != null && Object.hasOwnProperty.call(message, "sPaiJuID"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPaiJuID);
        return writer;
    };

    /**
     * Encodes the specified PaijuDetailReq message, length delimited. Does not implicitly {@link PaijuDetailReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PaijuDetailReq
     * @static
     * @param {IPaijuDetailReq} message PaijuDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuDetailReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PaijuDetailReq message from the specified reader or buffer.
     * @function decode
     * @memberof PaijuDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PaijuDetailReq} PaijuDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuDetailReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaijuDetailReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sPaiJuID = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PaijuDetailReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PaijuDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PaijuDetailReq} PaijuDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuDetailReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PaijuDetailReq message.
     * @function verify
     * @memberof PaijuDetailReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PaijuDetailReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
            if (!$util.isString(message.sPaiJuID))
                return "sPaiJuID: string expected";
        return null;
    };

    /**
     * Creates a PaijuDetailReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PaijuDetailReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PaijuDetailReq} PaijuDetailReq
     */
    PaijuDetailReq.fromObject = function fromObject(object) {
        if (object instanceof $root.PaijuDetailReq)
            return object;
        var message = new $root.PaijuDetailReq();
        if (object.sPaiJuID != null)
            message.sPaiJuID = String(object.sPaiJuID);
        return message;
    };

    /**
     * Creates a plain object from a PaijuDetailReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PaijuDetailReq
     * @static
     * @param {PaijuDetailReq} message PaijuDetailReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PaijuDetailReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sPaiJuID = "";
        if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
            object.sPaiJuID = message.sPaiJuID;
        return object;
    };

    /**
     * Converts this PaijuDetailReq to JSON.
     * @function toJSON
     * @memberof PaijuDetailReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PaijuDetailReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PaijuDetailReq;
})();

$root.PaijuDetailRsp = (function() {

    /**
     * Properties of a PaijuDetailRsp.
     * @exports IPaijuDetailRsp
     * @interface IPaijuDetailRsp
     * @property {number|null} [GameId] PaijuDetailRsp GameId
     * @property {number|null} [nAnte] PaijuDetailRsp nAnte
     * @property {string|null} [tUsersInfo] PaijuDetailRsp tUsersInfo
     * @property {number|null} [nZhuang] PaijuDetailRsp nZhuang
     * @property {string|null} [tDealCardInfo] PaijuDetailRsp tDealCardInfo
     * @property {string|null} [tBetInfo] PaijuDetailRsp tBetInfo
     */

    /**
     * Constructs a new PaijuDetailRsp.
     * @exports PaijuDetailRsp
     * @classdesc Represents a PaijuDetailRsp.
     * @implements IPaijuDetailRsp
     * @constructor
     * @param {IPaijuDetailRsp=} [properties] Properties to set
     */
    function PaijuDetailRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PaijuDetailRsp GameId.
     * @member {number} GameId
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.GameId = 0;

    /**
     * PaijuDetailRsp nAnte.
     * @member {number} nAnte
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.nAnte = 0;

    /**
     * PaijuDetailRsp tUsersInfo.
     * @member {string} tUsersInfo
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.tUsersInfo = "";

    /**
     * PaijuDetailRsp nZhuang.
     * @member {number} nZhuang
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.nZhuang = 0;

    /**
     * PaijuDetailRsp tDealCardInfo.
     * @member {string} tDealCardInfo
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.tDealCardInfo = "";

    /**
     * PaijuDetailRsp tBetInfo.
     * @member {string} tBetInfo
     * @memberof PaijuDetailRsp
     * @instance
     */
    PaijuDetailRsp.prototype.tBetInfo = "";

    /**
     * Creates a new PaijuDetailRsp instance using the specified properties.
     * @function create
     * @memberof PaijuDetailRsp
     * @static
     * @param {IPaijuDetailRsp=} [properties] Properties to set
     * @returns {PaijuDetailRsp} PaijuDetailRsp instance
     */
    PaijuDetailRsp.create = function create(properties) {
        return new PaijuDetailRsp(properties);
    };

    /**
     * Encodes the specified PaijuDetailRsp message. Does not implicitly {@link PaijuDetailRsp.verify|verify} messages.
     * @function encode
     * @memberof PaijuDetailRsp
     * @static
     * @param {IPaijuDetailRsp} message PaijuDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuDetailRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.GameId != null && Object.hasOwnProperty.call(message, "GameId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.GameId);
        if (message.nAnte != null && Object.hasOwnProperty.call(message, "nAnte"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.nAnte);
        if (message.tUsersInfo != null && Object.hasOwnProperty.call(message, "tUsersInfo"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.tUsersInfo);
        if (message.nZhuang != null && Object.hasOwnProperty.call(message, "nZhuang"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nZhuang);
        if (message.tDealCardInfo != null && Object.hasOwnProperty.call(message, "tDealCardInfo"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.tDealCardInfo);
        if (message.tBetInfo != null && Object.hasOwnProperty.call(message, "tBetInfo"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.tBetInfo);
        return writer;
    };

    /**
     * Encodes the specified PaijuDetailRsp message, length delimited. Does not implicitly {@link PaijuDetailRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PaijuDetailRsp
     * @static
     * @param {IPaijuDetailRsp} message PaijuDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaijuDetailRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PaijuDetailRsp message from the specified reader or buffer.
     * @function decode
     * @memberof PaijuDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PaijuDetailRsp} PaijuDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuDetailRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaijuDetailRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.GameId = reader.int32();
                break;
            case 2:
                message.nAnte = reader.double();
                break;
            case 3:
                message.tUsersInfo = reader.string();
                break;
            case 4:
                message.nZhuang = reader.int32();
                break;
            case 5:
                message.tDealCardInfo = reader.string();
                break;
            case 6:
                message.tBetInfo = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PaijuDetailRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PaijuDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PaijuDetailRsp} PaijuDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaijuDetailRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PaijuDetailRsp message.
     * @function verify
     * @memberof PaijuDetailRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PaijuDetailRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.GameId != null && message.hasOwnProperty("GameId"))
            if (!$util.isInteger(message.GameId))
                return "GameId: integer expected";
        if (message.nAnte != null && message.hasOwnProperty("nAnte"))
            if (typeof message.nAnte !== "number")
                return "nAnte: number expected";
        if (message.tUsersInfo != null && message.hasOwnProperty("tUsersInfo"))
            if (!$util.isString(message.tUsersInfo))
                return "tUsersInfo: string expected";
        if (message.nZhuang != null && message.hasOwnProperty("nZhuang"))
            if (!$util.isInteger(message.nZhuang))
                return "nZhuang: integer expected";
        if (message.tDealCardInfo != null && message.hasOwnProperty("tDealCardInfo"))
            if (!$util.isString(message.tDealCardInfo))
                return "tDealCardInfo: string expected";
        if (message.tBetInfo != null && message.hasOwnProperty("tBetInfo"))
            if (!$util.isString(message.tBetInfo))
                return "tBetInfo: string expected";
        return null;
    };

    /**
     * Creates a PaijuDetailRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PaijuDetailRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PaijuDetailRsp} PaijuDetailRsp
     */
    PaijuDetailRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.PaijuDetailRsp)
            return object;
        var message = new $root.PaijuDetailRsp();
        if (object.GameId != null)
            message.GameId = object.GameId | 0;
        if (object.nAnte != null)
            message.nAnte = Number(object.nAnte);
        if (object.tUsersInfo != null)
            message.tUsersInfo = String(object.tUsersInfo);
        if (object.nZhuang != null)
            message.nZhuang = object.nZhuang | 0;
        if (object.tDealCardInfo != null)
            message.tDealCardInfo = String(object.tDealCardInfo);
        if (object.tBetInfo != null)
            message.tBetInfo = String(object.tBetInfo);
        return message;
    };

    /**
     * Creates a plain object from a PaijuDetailRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PaijuDetailRsp
     * @static
     * @param {PaijuDetailRsp} message PaijuDetailRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PaijuDetailRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.GameId = 0;
            object.nAnte = 0;
            object.tUsersInfo = "";
            object.nZhuang = 0;
            object.tDealCardInfo = "";
            object.tBetInfo = "";
        }
        if (message.GameId != null && message.hasOwnProperty("GameId"))
            object.GameId = message.GameId;
        if (message.nAnte != null && message.hasOwnProperty("nAnte"))
            object.nAnte = options.json && !isFinite(message.nAnte) ? String(message.nAnte) : message.nAnte;
        if (message.tUsersInfo != null && message.hasOwnProperty("tUsersInfo"))
            object.tUsersInfo = message.tUsersInfo;
        if (message.nZhuang != null && message.hasOwnProperty("nZhuang"))
            object.nZhuang = message.nZhuang;
        if (message.tDealCardInfo != null && message.hasOwnProperty("tDealCardInfo"))
            object.tDealCardInfo = message.tDealCardInfo;
        if (message.tBetInfo != null && message.hasOwnProperty("tBetInfo"))
            object.tBetInfo = message.tBetInfo;
        return object;
    };

    /**
     * Converts this PaijuDetailRsp to JSON.
     * @function toJSON
     * @memberof PaijuDetailRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PaijuDetailRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PaijuDetailRsp;
})();

$root.BeforeLoadScenceReq = (function() {

    /**
     * Properties of a BeforeLoadScenceReq.
     * @exports IBeforeLoadScenceReq
     * @interface IBeforeLoadScenceReq
     * @property {number} nGameId BeforeLoadScenceReq nGameId
     * @property {number|null} [nRoomId] BeforeLoadScenceReq nRoomId
     */

    /**
     * Constructs a new BeforeLoadScenceReq.
     * @exports BeforeLoadScenceReq
     * @classdesc Represents a BeforeLoadScenceReq.
     * @implements IBeforeLoadScenceReq
     * @constructor
     * @param {IBeforeLoadScenceReq=} [properties] Properties to set
     */
    function BeforeLoadScenceReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BeforeLoadScenceReq nGameId.
     * @member {number} nGameId
     * @memberof BeforeLoadScenceReq
     * @instance
     */
    BeforeLoadScenceReq.prototype.nGameId = 0;

    /**
     * BeforeLoadScenceReq nRoomId.
     * @member {number} nRoomId
     * @memberof BeforeLoadScenceReq
     * @instance
     */
    BeforeLoadScenceReq.prototype.nRoomId = 0;

    /**
     * Creates a new BeforeLoadScenceReq instance using the specified properties.
     * @function create
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {IBeforeLoadScenceReq=} [properties] Properties to set
     * @returns {BeforeLoadScenceReq} BeforeLoadScenceReq instance
     */
    BeforeLoadScenceReq.create = function create(properties) {
        return new BeforeLoadScenceReq(properties);
    };

    /**
     * Encodes the specified BeforeLoadScenceReq message. Does not implicitly {@link BeforeLoadScenceReq.verify|verify} messages.
     * @function encode
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {IBeforeLoadScenceReq} message BeforeLoadScenceReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BeforeLoadScenceReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameId);
        if (message.nRoomId != null && Object.hasOwnProperty.call(message, "nRoomId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nRoomId);
        return writer;
    };

    /**
     * Encodes the specified BeforeLoadScenceReq message, length delimited. Does not implicitly {@link BeforeLoadScenceReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {IBeforeLoadScenceReq} message BeforeLoadScenceReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BeforeLoadScenceReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BeforeLoadScenceReq message from the specified reader or buffer.
     * @function decode
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BeforeLoadScenceReq} BeforeLoadScenceReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BeforeLoadScenceReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BeforeLoadScenceReq();
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
     * Decodes a BeforeLoadScenceReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BeforeLoadScenceReq} BeforeLoadScenceReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BeforeLoadScenceReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BeforeLoadScenceReq message.
     * @function verify
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BeforeLoadScenceReq.verify = function verify(message) {
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
     * Creates a BeforeLoadScenceReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BeforeLoadScenceReq} BeforeLoadScenceReq
     */
    BeforeLoadScenceReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BeforeLoadScenceReq)
            return object;
        var message = new $root.BeforeLoadScenceReq();
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nRoomId != null)
            message.nRoomId = object.nRoomId | 0;
        return message;
    };

    /**
     * Creates a plain object from a BeforeLoadScenceReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BeforeLoadScenceReq
     * @static
     * @param {BeforeLoadScenceReq} message BeforeLoadScenceReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BeforeLoadScenceReq.toObject = function toObject(message, options) {
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
     * Converts this BeforeLoadScenceReq to JSON.
     * @function toJSON
     * @memberof BeforeLoadScenceReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BeforeLoadScenceReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BeforeLoadScenceReq;
})();

$root.BeforeLoadScenceRsp = (function() {

    /**
     * Properties of a BeforeLoadScenceRsp.
     * @exports IBeforeLoadScenceRsp
     * @interface IBeforeLoadScenceRsp
     * @property {number} nResult BeforeLoadScenceRsp nResult
     * @property {number|null} [nGameId] BeforeLoadScenceRsp nGameId
     * @property {number|null} [nRoomId] BeforeLoadScenceRsp nRoomId
     * @property {string|null} [sErrStr] BeforeLoadScenceRsp sErrStr
     * @property {string|null} [sTableId] BeforeLoadScenceRsp sTableId
     */

    /**
     * Constructs a new BeforeLoadScenceRsp.
     * @exports BeforeLoadScenceRsp
     * @classdesc Represents a BeforeLoadScenceRsp.
     * @implements IBeforeLoadScenceRsp
     * @constructor
     * @param {IBeforeLoadScenceRsp=} [properties] Properties to set
     */
    function BeforeLoadScenceRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BeforeLoadScenceRsp nResult.
     * @member {number} nResult
     * @memberof BeforeLoadScenceRsp
     * @instance
     */
    BeforeLoadScenceRsp.prototype.nResult = 0;

    /**
     * BeforeLoadScenceRsp nGameId.
     * @member {number} nGameId
     * @memberof BeforeLoadScenceRsp
     * @instance
     */
    BeforeLoadScenceRsp.prototype.nGameId = 0;

    /**
     * BeforeLoadScenceRsp nRoomId.
     * @member {number} nRoomId
     * @memberof BeforeLoadScenceRsp
     * @instance
     */
    BeforeLoadScenceRsp.prototype.nRoomId = 0;

    /**
     * BeforeLoadScenceRsp sErrStr.
     * @member {string} sErrStr
     * @memberof BeforeLoadScenceRsp
     * @instance
     */
    BeforeLoadScenceRsp.prototype.sErrStr = "";

    /**
     * BeforeLoadScenceRsp sTableId.
     * @member {string} sTableId
     * @memberof BeforeLoadScenceRsp
     * @instance
     */
    BeforeLoadScenceRsp.prototype.sTableId = "";

    /**
     * Creates a new BeforeLoadScenceRsp instance using the specified properties.
     * @function create
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {IBeforeLoadScenceRsp=} [properties] Properties to set
     * @returns {BeforeLoadScenceRsp} BeforeLoadScenceRsp instance
     */
    BeforeLoadScenceRsp.create = function create(properties) {
        return new BeforeLoadScenceRsp(properties);
    };

    /**
     * Encodes the specified BeforeLoadScenceRsp message. Does not implicitly {@link BeforeLoadScenceRsp.verify|verify} messages.
     * @function encode
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {IBeforeLoadScenceRsp} message BeforeLoadScenceRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BeforeLoadScenceRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        if (message.nGameId != null && Object.hasOwnProperty.call(message, "nGameId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nGameId);
        if (message.nRoomId != null && Object.hasOwnProperty.call(message, "nRoomId"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nRoomId);
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sErrStr);
        if (message.sTableId != null && Object.hasOwnProperty.call(message, "sTableId"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sTableId);
        return writer;
    };

    /**
     * Encodes the specified BeforeLoadScenceRsp message, length delimited. Does not implicitly {@link BeforeLoadScenceRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {IBeforeLoadScenceRsp} message BeforeLoadScenceRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BeforeLoadScenceRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BeforeLoadScenceRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BeforeLoadScenceRsp} BeforeLoadScenceRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BeforeLoadScenceRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BeforeLoadScenceRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.nGameId = reader.int32();
                break;
            case 3:
                message.nRoomId = reader.int32();
                break;
            case 4:
                message.sErrStr = reader.string();
                break;
            case 5:
                message.sTableId = reader.string();
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
     * Decodes a BeforeLoadScenceRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BeforeLoadScenceRsp} BeforeLoadScenceRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BeforeLoadScenceRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BeforeLoadScenceRsp message.
     * @function verify
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BeforeLoadScenceRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nResult))
            return "nResult: integer expected";
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            if (!$util.isInteger(message.nGameId))
                return "nGameId: integer expected";
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            if (!$util.isInteger(message.nRoomId))
                return "nRoomId: integer expected";
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            if (!$util.isString(message.sTableId))
                return "sTableId: string expected";
        return null;
    };

    /**
     * Creates a BeforeLoadScenceRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BeforeLoadScenceRsp} BeforeLoadScenceRsp
     */
    BeforeLoadScenceRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BeforeLoadScenceRsp)
            return object;
        var message = new $root.BeforeLoadScenceRsp();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nRoomId != null)
            message.nRoomId = object.nRoomId | 0;
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        return message;
    };

    /**
     * Creates a plain object from a BeforeLoadScenceRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BeforeLoadScenceRsp
     * @static
     * @param {BeforeLoadScenceRsp} message BeforeLoadScenceRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BeforeLoadScenceRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = 0;
            object.nGameId = 0;
            object.nRoomId = 0;
            object.sErrStr = "";
            object.sTableId = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.nRoomId != null && message.hasOwnProperty("nRoomId"))
            object.nRoomId = message.nRoomId;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        return object;
    };

    /**
     * Converts this BeforeLoadScenceRsp to JSON.
     * @function toJSON
     * @memberof BeforeLoadScenceRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BeforeLoadScenceRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BeforeLoadScenceRsp;
})();

$root.LobbyDeZhouRecordReq = (function() {

    /**
     * Properties of a LobbyDeZhouRecordReq.
     * @exports ILobbyDeZhouRecordReq
     * @interface ILobbyDeZhouRecordReq
     * @property {number} nQueryCnt LobbyDeZhouRecordReq nQueryCnt
     * @property {number} nMinId LobbyDeZhouRecordReq nMinId
     */

    /**
     * Constructs a new LobbyDeZhouRecordReq.
     * @exports LobbyDeZhouRecordReq
     * @classdesc Represents a LobbyDeZhouRecordReq.
     * @implements ILobbyDeZhouRecordReq
     * @constructor
     * @param {ILobbyDeZhouRecordReq=} [properties] Properties to set
     */
    function LobbyDeZhouRecordReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LobbyDeZhouRecordReq nQueryCnt.
     * @member {number} nQueryCnt
     * @memberof LobbyDeZhouRecordReq
     * @instance
     */
    LobbyDeZhouRecordReq.prototype.nQueryCnt = 10;

    /**
     * LobbyDeZhouRecordReq nMinId.
     * @member {number} nMinId
     * @memberof LobbyDeZhouRecordReq
     * @instance
     */
    LobbyDeZhouRecordReq.prototype.nMinId = 0;

    /**
     * Creates a new LobbyDeZhouRecordReq instance using the specified properties.
     * @function create
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {ILobbyDeZhouRecordReq=} [properties] Properties to set
     * @returns {LobbyDeZhouRecordReq} LobbyDeZhouRecordReq instance
     */
    LobbyDeZhouRecordReq.create = function create(properties) {
        return new LobbyDeZhouRecordReq(properties);
    };

    /**
     * Encodes the specified LobbyDeZhouRecordReq message. Does not implicitly {@link LobbyDeZhouRecordReq.verify|verify} messages.
     * @function encode
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {ILobbyDeZhouRecordReq} message LobbyDeZhouRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nQueryCnt);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nMinId);
        return writer;
    };

    /**
     * Encodes the specified LobbyDeZhouRecordReq message, length delimited. Does not implicitly {@link LobbyDeZhouRecordReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {ILobbyDeZhouRecordReq} message LobbyDeZhouRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LobbyDeZhouRecordReq message from the specified reader or buffer.
     * @function decode
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LobbyDeZhouRecordReq} LobbyDeZhouRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nQueryCnt = reader.int32();
                break;
            case 2:
                message.nMinId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nQueryCnt"))
            throw $util.ProtocolError("missing required 'nQueryCnt'", { instance: message });
        if (!message.hasOwnProperty("nMinId"))
            throw $util.ProtocolError("missing required 'nMinId'", { instance: message });
        return message;
    };

    /**
     * Decodes a LobbyDeZhouRecordReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LobbyDeZhouRecordReq} LobbyDeZhouRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LobbyDeZhouRecordReq message.
     * @function verify
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LobbyDeZhouRecordReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nQueryCnt))
            return "nQueryCnt: integer expected";
        if (!$util.isInteger(message.nMinId))
            return "nMinId: integer expected";
        return null;
    };

    /**
     * Creates a LobbyDeZhouRecordReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LobbyDeZhouRecordReq} LobbyDeZhouRecordReq
     */
    LobbyDeZhouRecordReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LobbyDeZhouRecordReq)
            return object;
        var message = new $root.LobbyDeZhouRecordReq();
        if (object.nQueryCnt != null)
            message.nQueryCnt = object.nQueryCnt | 0;
        if (object.nMinId != null)
            message.nMinId = object.nMinId | 0;
        return message;
    };

    /**
     * Creates a plain object from a LobbyDeZhouRecordReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LobbyDeZhouRecordReq
     * @static
     * @param {LobbyDeZhouRecordReq} message LobbyDeZhouRecordReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LobbyDeZhouRecordReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nQueryCnt = 10;
            object.nMinId = 0;
        }
        if (message.nQueryCnt != null && message.hasOwnProperty("nQueryCnt"))
            object.nQueryCnt = message.nQueryCnt;
        if (message.nMinId != null && message.hasOwnProperty("nMinId"))
            object.nMinId = message.nMinId;
        return object;
    };

    /**
     * Converts this LobbyDeZhouRecordReq to JSON.
     * @function toJSON
     * @memberof LobbyDeZhouRecordReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LobbyDeZhouRecordReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LobbyDeZhouRecordReq;
})();

$root.LobbyDeZhouRecordRsp = (function() {

    /**
     * Properties of a LobbyDeZhouRecordRsp.
     * @exports ILobbyDeZhouRecordRsp
     * @interface ILobbyDeZhouRecordRsp
     * @property {Array.<LobbyDeZhouRecordRsp.IItem>|null} [arrItem] LobbyDeZhouRecordRsp arrItem
     * @property {number} nMinId LobbyDeZhouRecordRsp nMinId
     */

    /**
     * Constructs a new LobbyDeZhouRecordRsp.
     * @exports LobbyDeZhouRecordRsp
     * @classdesc Represents a LobbyDeZhouRecordRsp.
     * @implements ILobbyDeZhouRecordRsp
     * @constructor
     * @param {ILobbyDeZhouRecordRsp=} [properties] Properties to set
     */
    function LobbyDeZhouRecordRsp(properties) {
        this.arrItem = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LobbyDeZhouRecordRsp arrItem.
     * @member {Array.<LobbyDeZhouRecordRsp.IItem>} arrItem
     * @memberof LobbyDeZhouRecordRsp
     * @instance
     */
    LobbyDeZhouRecordRsp.prototype.arrItem = $util.emptyArray;

    /**
     * LobbyDeZhouRecordRsp nMinId.
     * @member {number} nMinId
     * @memberof LobbyDeZhouRecordRsp
     * @instance
     */
    LobbyDeZhouRecordRsp.prototype.nMinId = 0;

    /**
     * Creates a new LobbyDeZhouRecordRsp instance using the specified properties.
     * @function create
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {ILobbyDeZhouRecordRsp=} [properties] Properties to set
     * @returns {LobbyDeZhouRecordRsp} LobbyDeZhouRecordRsp instance
     */
    LobbyDeZhouRecordRsp.create = function create(properties) {
        return new LobbyDeZhouRecordRsp(properties);
    };

    /**
     * Encodes the specified LobbyDeZhouRecordRsp message. Does not implicitly {@link LobbyDeZhouRecordRsp.verify|verify} messages.
     * @function encode
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {ILobbyDeZhouRecordRsp} message LobbyDeZhouRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrItem != null && message.arrItem.length)
            for (var i = 0; i < message.arrItem.length; ++i)
                $root.LobbyDeZhouRecordRsp.Item.encode(message.arrItem[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nMinId);
        return writer;
    };

    /**
     * Encodes the specified LobbyDeZhouRecordRsp message, length delimited. Does not implicitly {@link LobbyDeZhouRecordRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {ILobbyDeZhouRecordRsp} message LobbyDeZhouRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LobbyDeZhouRecordRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LobbyDeZhouRecordRsp} LobbyDeZhouRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrItem && message.arrItem.length))
                    message.arrItem = [];
                message.arrItem.push($root.LobbyDeZhouRecordRsp.Item.decode(reader, reader.uint32()));
                break;
            case 2:
                message.nMinId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nMinId"))
            throw $util.ProtocolError("missing required 'nMinId'", { instance: message });
        return message;
    };

    /**
     * Decodes a LobbyDeZhouRecordRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LobbyDeZhouRecordRsp} LobbyDeZhouRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LobbyDeZhouRecordRsp message.
     * @function verify
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LobbyDeZhouRecordRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrItem != null && message.hasOwnProperty("arrItem")) {
            if (!Array.isArray(message.arrItem))
                return "arrItem: array expected";
            for (var i = 0; i < message.arrItem.length; ++i) {
                var error = $root.LobbyDeZhouRecordRsp.Item.verify(message.arrItem[i]);
                if (error)
                    return "arrItem." + error;
            }
        }
        if (!$util.isInteger(message.nMinId))
            return "nMinId: integer expected";
        return null;
    };

    /**
     * Creates a LobbyDeZhouRecordRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LobbyDeZhouRecordRsp} LobbyDeZhouRecordRsp
     */
    LobbyDeZhouRecordRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LobbyDeZhouRecordRsp)
            return object;
        var message = new $root.LobbyDeZhouRecordRsp();
        if (object.arrItem) {
            if (!Array.isArray(object.arrItem))
                throw TypeError(".LobbyDeZhouRecordRsp.arrItem: array expected");
            message.arrItem = [];
            for (var i = 0; i < object.arrItem.length; ++i) {
                if (typeof object.arrItem[i] !== "object")
                    throw TypeError(".LobbyDeZhouRecordRsp.arrItem: object expected");
                message.arrItem[i] = $root.LobbyDeZhouRecordRsp.Item.fromObject(object.arrItem[i]);
            }
        }
        if (object.nMinId != null)
            message.nMinId = object.nMinId | 0;
        return message;
    };

    /**
     * Creates a plain object from a LobbyDeZhouRecordRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LobbyDeZhouRecordRsp
     * @static
     * @param {LobbyDeZhouRecordRsp} message LobbyDeZhouRecordRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LobbyDeZhouRecordRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrItem = [];
        if (options.defaults)
            object.nMinId = 0;
        if (message.arrItem && message.arrItem.length) {
            object.arrItem = [];
            for (var j = 0; j < message.arrItem.length; ++j)
                object.arrItem[j] = $root.LobbyDeZhouRecordRsp.Item.toObject(message.arrItem[j], options);
        }
        if (message.nMinId != null && message.hasOwnProperty("nMinId"))
            object.nMinId = message.nMinId;
        return object;
    };

    /**
     * Converts this LobbyDeZhouRecordRsp to JSON.
     * @function toJSON
     * @memberof LobbyDeZhouRecordRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LobbyDeZhouRecordRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    LobbyDeZhouRecordRsp.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof LobbyDeZhouRecordRsp
         * @interface IItem
         * @property {string} sSeriesNumber Item sSeriesNumber
         * @property {string} sTime Item sTime
         * @property {number} nBet Item nBet
         * @property {number} nWin Item nWin
         * @property {number} Id Item Id
         */

        /**
         * Constructs a new Item.
         * @memberof LobbyDeZhouRecordRsp
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {LobbyDeZhouRecordRsp.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item sSeriesNumber.
         * @member {string} sSeriesNumber
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         */
        Item.prototype.sSeriesNumber = "";

        /**
         * Item sTime.
         * @member {string} sTime
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         */
        Item.prototype.sTime = "";

        /**
         * Item nBet.
         * @member {number} nBet
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         */
        Item.prototype.nBet = 0;

        /**
         * Item nWin.
         * @member {number} nWin
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         */
        Item.prototype.nWin = 0;

        /**
         * Item Id.
         * @member {number} Id
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         */
        Item.prototype.Id = 0;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {LobbyDeZhouRecordRsp.IItem=} [properties] Properties to set
         * @returns {LobbyDeZhouRecordRsp.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link LobbyDeZhouRecordRsp.Item.verify|verify} messages.
         * @function encode
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {LobbyDeZhouRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSeriesNumber);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTime);
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.nBet);
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.nWin);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.Id);
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link LobbyDeZhouRecordRsp.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {LobbyDeZhouRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LobbyDeZhouRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordRsp.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sSeriesNumber = reader.string();
                    break;
                case 2:
                    message.sTime = reader.string();
                    break;
                case 3:
                    message.nBet = reader.double();
                    break;
                case 4:
                    message.nWin = reader.double();
                    break;
                case 5:
                    message.Id = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sSeriesNumber"))
                throw $util.ProtocolError("missing required 'sSeriesNumber'", { instance: message });
            if (!message.hasOwnProperty("sTime"))
                throw $util.ProtocolError("missing required 'sTime'", { instance: message });
            if (!message.hasOwnProperty("nBet"))
                throw $util.ProtocolError("missing required 'nBet'", { instance: message });
            if (!message.hasOwnProperty("nWin"))
                throw $util.ProtocolError("missing required 'nWin'", { instance: message });
            if (!message.hasOwnProperty("Id"))
                throw $util.ProtocolError("missing required 'Id'", { instance: message });
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {LobbyDeZhouRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sSeriesNumber))
                return "sSeriesNumber: string expected";
            if (!$util.isString(message.sTime))
                return "sTime: string expected";
            if (typeof message.nBet !== "number")
                return "nBet: number expected";
            if (typeof message.nWin !== "number")
                return "nWin: number expected";
            if (!$util.isInteger(message.Id))
                return "Id: integer expected";
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {LobbyDeZhouRecordRsp.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.LobbyDeZhouRecordRsp.Item)
                return object;
            var message = new $root.LobbyDeZhouRecordRsp.Item();
            if (object.sSeriesNumber != null)
                message.sSeriesNumber = String(object.sSeriesNumber);
            if (object.sTime != null)
                message.sTime = String(object.sTime);
            if (object.nBet != null)
                message.nBet = Number(object.nBet);
            if (object.nWin != null)
                message.nWin = Number(object.nWin);
            if (object.Id != null)
                message.Id = object.Id | 0;
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof LobbyDeZhouRecordRsp.Item
         * @static
         * @param {LobbyDeZhouRecordRsp.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sSeriesNumber = "";
                object.sTime = "";
                object.nBet = 0;
                object.nWin = 0;
                object.Id = 0;
            }
            if (message.sSeriesNumber != null && message.hasOwnProperty("sSeriesNumber"))
                object.sSeriesNumber = message.sSeriesNumber;
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                object.sTime = message.sTime;
            if (message.nBet != null && message.hasOwnProperty("nBet"))
                object.nBet = options.json && !isFinite(message.nBet) ? String(message.nBet) : message.nBet;
            if (message.nWin != null && message.hasOwnProperty("nWin"))
                object.nWin = options.json && !isFinite(message.nWin) ? String(message.nWin) : message.nWin;
            if (message.Id != null && message.hasOwnProperty("Id"))
                object.Id = message.Id;
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof LobbyDeZhouRecordRsp.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    return LobbyDeZhouRecordRsp;
})();

$root.LobbyDeZhouRecordDetailReq = (function() {

    /**
     * Properties of a LobbyDeZhouRecordDetailReq.
     * @exports ILobbyDeZhouRecordDetailReq
     * @interface ILobbyDeZhouRecordDetailReq
     * @property {string} sSeriesNumber LobbyDeZhouRecordDetailReq sSeriesNumber
     */

    /**
     * Constructs a new LobbyDeZhouRecordDetailReq.
     * @exports LobbyDeZhouRecordDetailReq
     * @classdesc Represents a LobbyDeZhouRecordDetailReq.
     * @implements ILobbyDeZhouRecordDetailReq
     * @constructor
     * @param {ILobbyDeZhouRecordDetailReq=} [properties] Properties to set
     */
    function LobbyDeZhouRecordDetailReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LobbyDeZhouRecordDetailReq sSeriesNumber.
     * @member {string} sSeriesNumber
     * @memberof LobbyDeZhouRecordDetailReq
     * @instance
     */
    LobbyDeZhouRecordDetailReq.prototype.sSeriesNumber = "";

    /**
     * Creates a new LobbyDeZhouRecordDetailReq instance using the specified properties.
     * @function create
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {ILobbyDeZhouRecordDetailReq=} [properties] Properties to set
     * @returns {LobbyDeZhouRecordDetailReq} LobbyDeZhouRecordDetailReq instance
     */
    LobbyDeZhouRecordDetailReq.create = function create(properties) {
        return new LobbyDeZhouRecordDetailReq(properties);
    };

    /**
     * Encodes the specified LobbyDeZhouRecordDetailReq message. Does not implicitly {@link LobbyDeZhouRecordDetailReq.verify|verify} messages.
     * @function encode
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {ILobbyDeZhouRecordDetailReq} message LobbyDeZhouRecordDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordDetailReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSeriesNumber);
        return writer;
    };

    /**
     * Encodes the specified LobbyDeZhouRecordDetailReq message, length delimited. Does not implicitly {@link LobbyDeZhouRecordDetailReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {ILobbyDeZhouRecordDetailReq} message LobbyDeZhouRecordDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordDetailReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LobbyDeZhouRecordDetailReq message from the specified reader or buffer.
     * @function decode
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LobbyDeZhouRecordDetailReq} LobbyDeZhouRecordDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordDetailReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordDetailReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sSeriesNumber = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sSeriesNumber"))
            throw $util.ProtocolError("missing required 'sSeriesNumber'", { instance: message });
        return message;
    };

    /**
     * Decodes a LobbyDeZhouRecordDetailReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LobbyDeZhouRecordDetailReq} LobbyDeZhouRecordDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordDetailReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LobbyDeZhouRecordDetailReq message.
     * @function verify
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LobbyDeZhouRecordDetailReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sSeriesNumber))
            return "sSeriesNumber: string expected";
        return null;
    };

    /**
     * Creates a LobbyDeZhouRecordDetailReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LobbyDeZhouRecordDetailReq} LobbyDeZhouRecordDetailReq
     */
    LobbyDeZhouRecordDetailReq.fromObject = function fromObject(object) {
        if (object instanceof $root.LobbyDeZhouRecordDetailReq)
            return object;
        var message = new $root.LobbyDeZhouRecordDetailReq();
        if (object.sSeriesNumber != null)
            message.sSeriesNumber = String(object.sSeriesNumber);
        return message;
    };

    /**
     * Creates a plain object from a LobbyDeZhouRecordDetailReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LobbyDeZhouRecordDetailReq
     * @static
     * @param {LobbyDeZhouRecordDetailReq} message LobbyDeZhouRecordDetailReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LobbyDeZhouRecordDetailReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sSeriesNumber = "";
        if (message.sSeriesNumber != null && message.hasOwnProperty("sSeriesNumber"))
            object.sSeriesNumber = message.sSeriesNumber;
        return object;
    };

    /**
     * Converts this LobbyDeZhouRecordDetailReq to JSON.
     * @function toJSON
     * @memberof LobbyDeZhouRecordDetailReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LobbyDeZhouRecordDetailReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LobbyDeZhouRecordDetailReq;
})();

$root.LobbyDeZhouRecordDetailRsp = (function() {

    /**
     * Properties of a LobbyDeZhouRecordDetailRsp.
     * @exports ILobbyDeZhouRecordDetailRsp
     * @interface ILobbyDeZhouRecordDetailRsp
     * @property {string} sSeriesNumber LobbyDeZhouRecordDetailRsp sSeriesNumber
     * @property {Array.<number>|null} [arrCommunityCards] LobbyDeZhouRecordDetailRsp arrCommunityCards
     * @property {Array.<LobbyDeZhouRecordDetailRsp.IItem>|null} [arrItem] LobbyDeZhouRecordDetailRsp arrItem
     */

    /**
     * Constructs a new LobbyDeZhouRecordDetailRsp.
     * @exports LobbyDeZhouRecordDetailRsp
     * @classdesc Represents a LobbyDeZhouRecordDetailRsp.
     * @implements ILobbyDeZhouRecordDetailRsp
     * @constructor
     * @param {ILobbyDeZhouRecordDetailRsp=} [properties] Properties to set
     */
    function LobbyDeZhouRecordDetailRsp(properties) {
        this.arrCommunityCards = [];
        this.arrItem = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LobbyDeZhouRecordDetailRsp sSeriesNumber.
     * @member {string} sSeriesNumber
     * @memberof LobbyDeZhouRecordDetailRsp
     * @instance
     */
    LobbyDeZhouRecordDetailRsp.prototype.sSeriesNumber = "";

    /**
     * LobbyDeZhouRecordDetailRsp arrCommunityCards.
     * @member {Array.<number>} arrCommunityCards
     * @memberof LobbyDeZhouRecordDetailRsp
     * @instance
     */
    LobbyDeZhouRecordDetailRsp.prototype.arrCommunityCards = $util.emptyArray;

    /**
     * LobbyDeZhouRecordDetailRsp arrItem.
     * @member {Array.<LobbyDeZhouRecordDetailRsp.IItem>} arrItem
     * @memberof LobbyDeZhouRecordDetailRsp
     * @instance
     */
    LobbyDeZhouRecordDetailRsp.prototype.arrItem = $util.emptyArray;

    /**
     * Creates a new LobbyDeZhouRecordDetailRsp instance using the specified properties.
     * @function create
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {ILobbyDeZhouRecordDetailRsp=} [properties] Properties to set
     * @returns {LobbyDeZhouRecordDetailRsp} LobbyDeZhouRecordDetailRsp instance
     */
    LobbyDeZhouRecordDetailRsp.create = function create(properties) {
        return new LobbyDeZhouRecordDetailRsp(properties);
    };

    /**
     * Encodes the specified LobbyDeZhouRecordDetailRsp message. Does not implicitly {@link LobbyDeZhouRecordDetailRsp.verify|verify} messages.
     * @function encode
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {ILobbyDeZhouRecordDetailRsp} message LobbyDeZhouRecordDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordDetailRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sSeriesNumber);
        if (message.arrCommunityCards != null && message.arrCommunityCards.length)
            for (var i = 0; i < message.arrCommunityCards.length; ++i)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.arrCommunityCards[i]);
        if (message.arrItem != null && message.arrItem.length)
            for (var i = 0; i < message.arrItem.length; ++i)
                $root.LobbyDeZhouRecordDetailRsp.Item.encode(message.arrItem[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified LobbyDeZhouRecordDetailRsp message, length delimited. Does not implicitly {@link LobbyDeZhouRecordDetailRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {ILobbyDeZhouRecordDetailRsp} message LobbyDeZhouRecordDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LobbyDeZhouRecordDetailRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LobbyDeZhouRecordDetailRsp message from the specified reader or buffer.
     * @function decode
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LobbyDeZhouRecordDetailRsp} LobbyDeZhouRecordDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordDetailRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordDetailRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sSeriesNumber = reader.string();
                break;
            case 2:
                if (!(message.arrCommunityCards && message.arrCommunityCards.length))
                    message.arrCommunityCards = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.arrCommunityCards.push(reader.int32());
                } else
                    message.arrCommunityCards.push(reader.int32());
                break;
            case 3:
                if (!(message.arrItem && message.arrItem.length))
                    message.arrItem = [];
                message.arrItem.push($root.LobbyDeZhouRecordDetailRsp.Item.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sSeriesNumber"))
            throw $util.ProtocolError("missing required 'sSeriesNumber'", { instance: message });
        return message;
    };

    /**
     * Decodes a LobbyDeZhouRecordDetailRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LobbyDeZhouRecordDetailRsp} LobbyDeZhouRecordDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LobbyDeZhouRecordDetailRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LobbyDeZhouRecordDetailRsp message.
     * @function verify
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LobbyDeZhouRecordDetailRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sSeriesNumber))
            return "sSeriesNumber: string expected";
        if (message.arrCommunityCards != null && message.hasOwnProperty("arrCommunityCards")) {
            if (!Array.isArray(message.arrCommunityCards))
                return "arrCommunityCards: array expected";
            for (var i = 0; i < message.arrCommunityCards.length; ++i)
                if (!$util.isInteger(message.arrCommunityCards[i]))
                    return "arrCommunityCards: integer[] expected";
        }
        if (message.arrItem != null && message.hasOwnProperty("arrItem")) {
            if (!Array.isArray(message.arrItem))
                return "arrItem: array expected";
            for (var i = 0; i < message.arrItem.length; ++i) {
                var error = $root.LobbyDeZhouRecordDetailRsp.Item.verify(message.arrItem[i]);
                if (error)
                    return "arrItem." + error;
            }
        }
        return null;
    };

    /**
     * Creates a LobbyDeZhouRecordDetailRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LobbyDeZhouRecordDetailRsp} LobbyDeZhouRecordDetailRsp
     */
    LobbyDeZhouRecordDetailRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.LobbyDeZhouRecordDetailRsp)
            return object;
        var message = new $root.LobbyDeZhouRecordDetailRsp();
        if (object.sSeriesNumber != null)
            message.sSeriesNumber = String(object.sSeriesNumber);
        if (object.arrCommunityCards) {
            if (!Array.isArray(object.arrCommunityCards))
                throw TypeError(".LobbyDeZhouRecordDetailRsp.arrCommunityCards: array expected");
            message.arrCommunityCards = [];
            for (var i = 0; i < object.arrCommunityCards.length; ++i)
                message.arrCommunityCards[i] = object.arrCommunityCards[i] | 0;
        }
        if (object.arrItem) {
            if (!Array.isArray(object.arrItem))
                throw TypeError(".LobbyDeZhouRecordDetailRsp.arrItem: array expected");
            message.arrItem = [];
            for (var i = 0; i < object.arrItem.length; ++i) {
                if (typeof object.arrItem[i] !== "object")
                    throw TypeError(".LobbyDeZhouRecordDetailRsp.arrItem: object expected");
                message.arrItem[i] = $root.LobbyDeZhouRecordDetailRsp.Item.fromObject(object.arrItem[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a LobbyDeZhouRecordDetailRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LobbyDeZhouRecordDetailRsp
     * @static
     * @param {LobbyDeZhouRecordDetailRsp} message LobbyDeZhouRecordDetailRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LobbyDeZhouRecordDetailRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.arrCommunityCards = [];
            object.arrItem = [];
        }
        if (options.defaults)
            object.sSeriesNumber = "";
        if (message.sSeriesNumber != null && message.hasOwnProperty("sSeriesNumber"))
            object.sSeriesNumber = message.sSeriesNumber;
        if (message.arrCommunityCards && message.arrCommunityCards.length) {
            object.arrCommunityCards = [];
            for (var j = 0; j < message.arrCommunityCards.length; ++j)
                object.arrCommunityCards[j] = message.arrCommunityCards[j];
        }
        if (message.arrItem && message.arrItem.length) {
            object.arrItem = [];
            for (var j = 0; j < message.arrItem.length; ++j)
                object.arrItem[j] = $root.LobbyDeZhouRecordDetailRsp.Item.toObject(message.arrItem[j], options);
        }
        return object;
    };

    /**
     * Converts this LobbyDeZhouRecordDetailRsp to JSON.
     * @function toJSON
     * @memberof LobbyDeZhouRecordDetailRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LobbyDeZhouRecordDetailRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    LobbyDeZhouRecordDetailRsp.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof LobbyDeZhouRecordDetailRsp
         * @interface IItem
         * @property {string} sName Item sName
         * @property {Array.<number>|null} [arrHoleCards] Item arrHoleCards
         * @property {number} nBet Item nBet
         * @property {number} nWin Item nWin
         * @property {number} nUserId Item nUserId
         * @property {boolean|null} [isFold] Item isFold
         */

        /**
         * Constructs a new Item.
         * @memberof LobbyDeZhouRecordDetailRsp
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {LobbyDeZhouRecordDetailRsp.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            this.arrHoleCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item sName.
         * @member {string} sName
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.sName = "";

        /**
         * Item arrHoleCards.
         * @member {Array.<number>} arrHoleCards
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.arrHoleCards = $util.emptyArray;

        /**
         * Item nBet.
         * @member {number} nBet
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.nBet = 0;

        /**
         * Item nWin.
         * @member {number} nWin
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.nWin = 0;

        /**
         * Item nUserId.
         * @member {number} nUserId
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.nUserId = 0;

        /**
         * Item isFold.
         * @member {boolean} isFold
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         */
        Item.prototype.isFold = false;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {LobbyDeZhouRecordDetailRsp.IItem=} [properties] Properties to set
         * @returns {LobbyDeZhouRecordDetailRsp.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link LobbyDeZhouRecordDetailRsp.Item.verify|verify} messages.
         * @function encode
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {LobbyDeZhouRecordDetailRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sName);
            if (message.arrHoleCards != null && message.arrHoleCards.length)
                for (var i = 0; i < message.arrHoleCards.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.arrHoleCards[i]);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nBet);
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.nWin);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nUserId);
            if (message.isFold != null && Object.hasOwnProperty.call(message, "isFold"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isFold);
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link LobbyDeZhouRecordDetailRsp.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {LobbyDeZhouRecordDetailRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LobbyDeZhouRecordDetailRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LobbyDeZhouRecordDetailRsp.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sName = reader.string();
                    break;
                case 2:
                    if (!(message.arrHoleCards && message.arrHoleCards.length))
                        message.arrHoleCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrHoleCards.push(reader.int32());
                    } else
                        message.arrHoleCards.push(reader.int32());
                    break;
                case 3:
                    message.nBet = reader.int32();
                    break;
                case 4:
                    message.nWin = reader.double();
                    break;
                case 5:
                    message.nUserId = reader.int32();
                    break;
                case 6:
                    message.isFold = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sName"))
                throw $util.ProtocolError("missing required 'sName'", { instance: message });
            if (!message.hasOwnProperty("nBet"))
                throw $util.ProtocolError("missing required 'nBet'", { instance: message });
            if (!message.hasOwnProperty("nWin"))
                throw $util.ProtocolError("missing required 'nWin'", { instance: message });
            if (!message.hasOwnProperty("nUserId"))
                throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {LobbyDeZhouRecordDetailRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sName))
                return "sName: string expected";
            if (message.arrHoleCards != null && message.hasOwnProperty("arrHoleCards")) {
                if (!Array.isArray(message.arrHoleCards))
                    return "arrHoleCards: array expected";
                for (var i = 0; i < message.arrHoleCards.length; ++i)
                    if (!$util.isInteger(message.arrHoleCards[i]))
                        return "arrHoleCards: integer[] expected";
            }
            if (!$util.isInteger(message.nBet))
                return "nBet: integer expected";
            if (typeof message.nWin !== "number")
                return "nWin: number expected";
            if (!$util.isInteger(message.nUserId))
                return "nUserId: integer expected";
            if (message.isFold != null && message.hasOwnProperty("isFold"))
                if (typeof message.isFold !== "boolean")
                    return "isFold: boolean expected";
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {LobbyDeZhouRecordDetailRsp.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.LobbyDeZhouRecordDetailRsp.Item)
                return object;
            var message = new $root.LobbyDeZhouRecordDetailRsp.Item();
            if (object.sName != null)
                message.sName = String(object.sName);
            if (object.arrHoleCards) {
                if (!Array.isArray(object.arrHoleCards))
                    throw TypeError(".LobbyDeZhouRecordDetailRsp.Item.arrHoleCards: array expected");
                message.arrHoleCards = [];
                for (var i = 0; i < object.arrHoleCards.length; ++i)
                    message.arrHoleCards[i] = object.arrHoleCards[i] | 0;
            }
            if (object.nBet != null)
                message.nBet = object.nBet | 0;
            if (object.nWin != null)
                message.nWin = Number(object.nWin);
            if (object.nUserId != null)
                message.nUserId = object.nUserId | 0;
            if (object.isFold != null)
                message.isFold = Boolean(object.isFold);
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @static
         * @param {LobbyDeZhouRecordDetailRsp.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.arrHoleCards = [];
            if (options.defaults) {
                object.sName = "";
                object.nBet = 0;
                object.nWin = 0;
                object.nUserId = 0;
                object.isFold = false;
            }
            if (message.sName != null && message.hasOwnProperty("sName"))
                object.sName = message.sName;
            if (message.arrHoleCards && message.arrHoleCards.length) {
                object.arrHoleCards = [];
                for (var j = 0; j < message.arrHoleCards.length; ++j)
                    object.arrHoleCards[j] = message.arrHoleCards[j];
            }
            if (message.nBet != null && message.hasOwnProperty("nBet"))
                object.nBet = message.nBet;
            if (message.nWin != null && message.hasOwnProperty("nWin"))
                object.nWin = options.json && !isFinite(message.nWin) ? String(message.nWin) : message.nWin;
            if (message.nUserId != null && message.hasOwnProperty("nUserId"))
                object.nUserId = message.nUserId;
            if (message.isFold != null && message.hasOwnProperty("isFold"))
                object.isFold = message.isFold;
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof LobbyDeZhouRecordDetailRsp.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    return LobbyDeZhouRecordDetailRsp;
})();

$root.Update_UserInfo_Q = (function() {

    /**
     * Properties of an Update_UserInfo_Q.
     * @exports IUpdate_UserInfo_Q
     * @interface IUpdate_UserInfo_Q
     * @property {number} nUserID Update_UserInfo_Q nUserID
     * @property {number} nType Update_UserInfo_Q nType
     * @property {string|null} [sContent] Update_UserInfo_Q sContent
     * @property {string|null} [Accounts] Update_UserInfo_Q Accounts
     * @property {string|null} [Password] Update_UserInfo_Q Password
     */

    /**
     * Constructs a new Update_UserInfo_Q.
     * @exports Update_UserInfo_Q
     * @classdesc Represents an Update_UserInfo_Q.
     * @implements IUpdate_UserInfo_Q
     * @constructor
     * @param {IUpdate_UserInfo_Q=} [properties] Properties to set
     */
    function Update_UserInfo_Q(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Update_UserInfo_Q nUserID.
     * @member {number} nUserID
     * @memberof Update_UserInfo_Q
     * @instance
     */
    Update_UserInfo_Q.prototype.nUserID = 0;

    /**
     * Update_UserInfo_Q nType.
     * @member {number} nType
     * @memberof Update_UserInfo_Q
     * @instance
     */
    Update_UserInfo_Q.prototype.nType = 0;

    /**
     * Update_UserInfo_Q sContent.
     * @member {string} sContent
     * @memberof Update_UserInfo_Q
     * @instance
     */
    Update_UserInfo_Q.prototype.sContent = "";

    /**
     * Update_UserInfo_Q Accounts.
     * @member {string} Accounts
     * @memberof Update_UserInfo_Q
     * @instance
     */
    Update_UserInfo_Q.prototype.Accounts = "";

    /**
     * Update_UserInfo_Q Password.
     * @member {string} Password
     * @memberof Update_UserInfo_Q
     * @instance
     */
    Update_UserInfo_Q.prototype.Password = "";

    /**
     * Creates a new Update_UserInfo_Q instance using the specified properties.
     * @function create
     * @memberof Update_UserInfo_Q
     * @static
     * @param {IUpdate_UserInfo_Q=} [properties] Properties to set
     * @returns {Update_UserInfo_Q} Update_UserInfo_Q instance
     */
    Update_UserInfo_Q.create = function create(properties) {
        return new Update_UserInfo_Q(properties);
    };

    /**
     * Encodes the specified Update_UserInfo_Q message. Does not implicitly {@link Update_UserInfo_Q.verify|verify} messages.
     * @function encode
     * @memberof Update_UserInfo_Q
     * @static
     * @param {IUpdate_UserInfo_Q} message Update_UserInfo_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Update_UserInfo_Q.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        if (message.sContent != null && Object.hasOwnProperty.call(message, "sContent"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sContent);
        if (message.Accounts != null && Object.hasOwnProperty.call(message, "Accounts"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.Accounts);
        if (message.Password != null && Object.hasOwnProperty.call(message, "Password"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.Password);
        return writer;
    };

    /**
     * Encodes the specified Update_UserInfo_Q message, length delimited. Does not implicitly {@link Update_UserInfo_Q.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Update_UserInfo_Q
     * @static
     * @param {IUpdate_UserInfo_Q} message Update_UserInfo_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Update_UserInfo_Q.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Update_UserInfo_Q message from the specified reader or buffer.
     * @function decode
     * @memberof Update_UserInfo_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Update_UserInfo_Q} Update_UserInfo_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Update_UserInfo_Q.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Update_UserInfo_Q();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserID = reader.int32();
                break;
            case 2:
                message.nType = reader.int32();
                break;
            case 3:
                message.sContent = reader.string();
                break;
            case 4:
                message.Accounts = reader.string();
                break;
            case 5:
                message.Password = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserID"))
            throw $util.ProtocolError("missing required 'nUserID'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        return message;
    };

    /**
     * Decodes an Update_UserInfo_Q message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Update_UserInfo_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Update_UserInfo_Q} Update_UserInfo_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Update_UserInfo_Q.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Update_UserInfo_Q message.
     * @function verify
     * @memberof Update_UserInfo_Q
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Update_UserInfo_Q.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserID))
            return "nUserID: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (message.sContent != null && message.hasOwnProperty("sContent"))
            if (!$util.isString(message.sContent))
                return "sContent: string expected";
        if (message.Accounts != null && message.hasOwnProperty("Accounts"))
            if (!$util.isString(message.Accounts))
                return "Accounts: string expected";
        if (message.Password != null && message.hasOwnProperty("Password"))
            if (!$util.isString(message.Password))
                return "Password: string expected";
        return null;
    };

    /**
     * Creates an Update_UserInfo_Q message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Update_UserInfo_Q
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Update_UserInfo_Q} Update_UserInfo_Q
     */
    Update_UserInfo_Q.fromObject = function fromObject(object) {
        if (object instanceof $root.Update_UserInfo_Q)
            return object;
        var message = new $root.Update_UserInfo_Q();
        if (object.nUserID != null)
            message.nUserID = object.nUserID | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.sContent != null)
            message.sContent = String(object.sContent);
        if (object.Accounts != null)
            message.Accounts = String(object.Accounts);
        if (object.Password != null)
            message.Password = String(object.Password);
        return message;
    };

    /**
     * Creates a plain object from an Update_UserInfo_Q message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Update_UserInfo_Q
     * @static
     * @param {Update_UserInfo_Q} message Update_UserInfo_Q
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Update_UserInfo_Q.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserID = 0;
            object.nType = 0;
            object.sContent = "";
            object.Accounts = "";
            object.Password = "";
        }
        if (message.nUserID != null && message.hasOwnProperty("nUserID"))
            object.nUserID = message.nUserID;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.sContent != null && message.hasOwnProperty("sContent"))
            object.sContent = message.sContent;
        if (message.Accounts != null && message.hasOwnProperty("Accounts"))
            object.Accounts = message.Accounts;
        if (message.Password != null && message.hasOwnProperty("Password"))
            object.Password = message.Password;
        return object;
    };

    /**
     * Converts this Update_UserInfo_Q to JSON.
     * @function toJSON
     * @memberof Update_UserInfo_Q
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Update_UserInfo_Q.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Update_UserInfo_Q;
})();

$root.Update_UserInfo_P = (function() {

    /**
     * Properties of an Update_UserInfo_P.
     * @exports IUpdate_UserInfo_P
     * @interface IUpdate_UserInfo_P
     * @property {number|null} [nResult] Update_UserInfo_P nResult
     * @property {number} nType Update_UserInfo_P nType
     * @property {string|null} [sContent] Update_UserInfo_P sContent
     */

    /**
     * Constructs a new Update_UserInfo_P.
     * @exports Update_UserInfo_P
     * @classdesc Represents an Update_UserInfo_P.
     * @implements IUpdate_UserInfo_P
     * @constructor
     * @param {IUpdate_UserInfo_P=} [properties] Properties to set
     */
    function Update_UserInfo_P(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Update_UserInfo_P nResult.
     * @member {number} nResult
     * @memberof Update_UserInfo_P
     * @instance
     */
    Update_UserInfo_P.prototype.nResult = -99;

    /**
     * Update_UserInfo_P nType.
     * @member {number} nType
     * @memberof Update_UserInfo_P
     * @instance
     */
    Update_UserInfo_P.prototype.nType = 0;

    /**
     * Update_UserInfo_P sContent.
     * @member {string} sContent
     * @memberof Update_UserInfo_P
     * @instance
     */
    Update_UserInfo_P.prototype.sContent = "";

    /**
     * Creates a new Update_UserInfo_P instance using the specified properties.
     * @function create
     * @memberof Update_UserInfo_P
     * @static
     * @param {IUpdate_UserInfo_P=} [properties] Properties to set
     * @returns {Update_UserInfo_P} Update_UserInfo_P instance
     */
    Update_UserInfo_P.create = function create(properties) {
        return new Update_UserInfo_P(properties);
    };

    /**
     * Encodes the specified Update_UserInfo_P message. Does not implicitly {@link Update_UserInfo_P.verify|verify} messages.
     * @function encode
     * @memberof Update_UserInfo_P
     * @static
     * @param {IUpdate_UserInfo_P} message Update_UserInfo_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Update_UserInfo_P.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nResult != null && Object.hasOwnProperty.call(message, "nResult"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nResult);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        if (message.sContent != null && Object.hasOwnProperty.call(message, "sContent"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sContent);
        return writer;
    };

    /**
     * Encodes the specified Update_UserInfo_P message, length delimited. Does not implicitly {@link Update_UserInfo_P.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Update_UserInfo_P
     * @static
     * @param {IUpdate_UserInfo_P} message Update_UserInfo_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Update_UserInfo_P.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Update_UserInfo_P message from the specified reader or buffer.
     * @function decode
     * @memberof Update_UserInfo_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Update_UserInfo_P} Update_UserInfo_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Update_UserInfo_P.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Update_UserInfo_P();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nResult = reader.int32();
                break;
            case 2:
                message.nType = reader.int32();
                break;
            case 3:
                message.sContent = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        return message;
    };

    /**
     * Decodes an Update_UserInfo_P message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Update_UserInfo_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Update_UserInfo_P} Update_UserInfo_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Update_UserInfo_P.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Update_UserInfo_P message.
     * @function verify
     * @memberof Update_UserInfo_P
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Update_UserInfo_P.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            if (!$util.isInteger(message.nResult))
                return "nResult: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (message.sContent != null && message.hasOwnProperty("sContent"))
            if (!$util.isString(message.sContent))
                return "sContent: string expected";
        return null;
    };

    /**
     * Creates an Update_UserInfo_P message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Update_UserInfo_P
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Update_UserInfo_P} Update_UserInfo_P
     */
    Update_UserInfo_P.fromObject = function fromObject(object) {
        if (object instanceof $root.Update_UserInfo_P)
            return object;
        var message = new $root.Update_UserInfo_P();
        if (object.nResult != null)
            message.nResult = object.nResult | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.sContent != null)
            message.sContent = String(object.sContent);
        return message;
    };

    /**
     * Creates a plain object from an Update_UserInfo_P message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Update_UserInfo_P
     * @static
     * @param {Update_UserInfo_P} message Update_UserInfo_P
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Update_UserInfo_P.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nResult = -99;
            object.nType = 0;
            object.sContent = "";
        }
        if (message.nResult != null && message.hasOwnProperty("nResult"))
            object.nResult = message.nResult;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.sContent != null && message.hasOwnProperty("sContent"))
            object.sContent = message.sContent;
        return object;
    };

    /**
     * Converts this Update_UserInfo_P to JSON.
     * @function toJSON
     * @memberof Update_UserInfo_P
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Update_UserInfo_P.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Update_UserInfo_P;
})();

$root.Get_UserInfo_Q = (function() {

    /**
     * Properties of a Get_UserInfo_Q.
     * @exports IGet_UserInfo_Q
     * @interface IGet_UserInfo_Q
     * @property {Array.<number>|null} [arrUserId] Get_UserInfo_Q arrUserId
     */

    /**
     * Constructs a new Get_UserInfo_Q.
     * @exports Get_UserInfo_Q
     * @classdesc Represents a Get_UserInfo_Q.
     * @implements IGet_UserInfo_Q
     * @constructor
     * @param {IGet_UserInfo_Q=} [properties] Properties to set
     */
    function Get_UserInfo_Q(properties) {
        this.arrUserId = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Get_UserInfo_Q arrUserId.
     * @member {Array.<number>} arrUserId
     * @memberof Get_UserInfo_Q
     * @instance
     */
    Get_UserInfo_Q.prototype.arrUserId = $util.emptyArray;

    /**
     * Creates a new Get_UserInfo_Q instance using the specified properties.
     * @function create
     * @memberof Get_UserInfo_Q
     * @static
     * @param {IGet_UserInfo_Q=} [properties] Properties to set
     * @returns {Get_UserInfo_Q} Get_UserInfo_Q instance
     */
    Get_UserInfo_Q.create = function create(properties) {
        return new Get_UserInfo_Q(properties);
    };

    /**
     * Encodes the specified Get_UserInfo_Q message. Does not implicitly {@link Get_UserInfo_Q.verify|verify} messages.
     * @function encode
     * @memberof Get_UserInfo_Q
     * @static
     * @param {IGet_UserInfo_Q} message Get_UserInfo_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_UserInfo_Q.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrUserId != null && message.arrUserId.length)
            for (var i = 0; i < message.arrUserId.length; ++i)
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrUserId[i]);
        return writer;
    };

    /**
     * Encodes the specified Get_UserInfo_Q message, length delimited. Does not implicitly {@link Get_UserInfo_Q.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Get_UserInfo_Q
     * @static
     * @param {IGet_UserInfo_Q} message Get_UserInfo_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_UserInfo_Q.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Get_UserInfo_Q message from the specified reader or buffer.
     * @function decode
     * @memberof Get_UserInfo_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Get_UserInfo_Q} Get_UserInfo_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_UserInfo_Q.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Get_UserInfo_Q();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrUserId && message.arrUserId.length))
                    message.arrUserId = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.arrUserId.push(reader.int32());
                } else
                    message.arrUserId.push(reader.int32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Get_UserInfo_Q message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Get_UserInfo_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Get_UserInfo_Q} Get_UserInfo_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_UserInfo_Q.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Get_UserInfo_Q message.
     * @function verify
     * @memberof Get_UserInfo_Q
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Get_UserInfo_Q.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrUserId != null && message.hasOwnProperty("arrUserId")) {
            if (!Array.isArray(message.arrUserId))
                return "arrUserId: array expected";
            for (var i = 0; i < message.arrUserId.length; ++i)
                if (!$util.isInteger(message.arrUserId[i]))
                    return "arrUserId: integer[] expected";
        }
        return null;
    };

    /**
     * Creates a Get_UserInfo_Q message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Get_UserInfo_Q
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Get_UserInfo_Q} Get_UserInfo_Q
     */
    Get_UserInfo_Q.fromObject = function fromObject(object) {
        if (object instanceof $root.Get_UserInfo_Q)
            return object;
        var message = new $root.Get_UserInfo_Q();
        if (object.arrUserId) {
            if (!Array.isArray(object.arrUserId))
                throw TypeError(".Get_UserInfo_Q.arrUserId: array expected");
            message.arrUserId = [];
            for (var i = 0; i < object.arrUserId.length; ++i)
                message.arrUserId[i] = object.arrUserId[i] | 0;
        }
        return message;
    };

    /**
     * Creates a plain object from a Get_UserInfo_Q message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Get_UserInfo_Q
     * @static
     * @param {Get_UserInfo_Q} message Get_UserInfo_Q
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Get_UserInfo_Q.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrUserId = [];
        if (message.arrUserId && message.arrUserId.length) {
            object.arrUserId = [];
            for (var j = 0; j < message.arrUserId.length; ++j)
                object.arrUserId[j] = message.arrUserId[j];
        }
        return object;
    };

    /**
     * Converts this Get_UserInfo_Q to JSON.
     * @function toJSON
     * @memberof Get_UserInfo_Q
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Get_UserInfo_Q.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Get_UserInfo_Q;
})();

$root.Get_UserInfo_P = (function() {

    /**
     * Properties of a Get_UserInfo_P.
     * @exports IGet_UserInfo_P
     * @interface IGet_UserInfo_P
     * @property {Array.<Get_UserInfo_P.IUser_GroupInfo>|null} [arrUserGroupInfo] Get_UserInfo_P arrUserGroupInfo
     */

    /**
     * Constructs a new Get_UserInfo_P.
     * @exports Get_UserInfo_P
     * @classdesc Represents a Get_UserInfo_P.
     * @implements IGet_UserInfo_P
     * @constructor
     * @param {IGet_UserInfo_P=} [properties] Properties to set
     */
    function Get_UserInfo_P(properties) {
        this.arrUserGroupInfo = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Get_UserInfo_P arrUserGroupInfo.
     * @member {Array.<Get_UserInfo_P.IUser_GroupInfo>} arrUserGroupInfo
     * @memberof Get_UserInfo_P
     * @instance
     */
    Get_UserInfo_P.prototype.arrUserGroupInfo = $util.emptyArray;

    /**
     * Creates a new Get_UserInfo_P instance using the specified properties.
     * @function create
     * @memberof Get_UserInfo_P
     * @static
     * @param {IGet_UserInfo_P=} [properties] Properties to set
     * @returns {Get_UserInfo_P} Get_UserInfo_P instance
     */
    Get_UserInfo_P.create = function create(properties) {
        return new Get_UserInfo_P(properties);
    };

    /**
     * Encodes the specified Get_UserInfo_P message. Does not implicitly {@link Get_UserInfo_P.verify|verify} messages.
     * @function encode
     * @memberof Get_UserInfo_P
     * @static
     * @param {IGet_UserInfo_P} message Get_UserInfo_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_UserInfo_P.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrUserGroupInfo != null && message.arrUserGroupInfo.length)
            for (var i = 0; i < message.arrUserGroupInfo.length; ++i)
                $root.Get_UserInfo_P.User_GroupInfo.encode(message.arrUserGroupInfo[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Get_UserInfo_P message, length delimited. Does not implicitly {@link Get_UserInfo_P.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Get_UserInfo_P
     * @static
     * @param {IGet_UserInfo_P} message Get_UserInfo_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_UserInfo_P.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Get_UserInfo_P message from the specified reader or buffer.
     * @function decode
     * @memberof Get_UserInfo_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Get_UserInfo_P} Get_UserInfo_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_UserInfo_P.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Get_UserInfo_P();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                if (!(message.arrUserGroupInfo && message.arrUserGroupInfo.length))
                    message.arrUserGroupInfo = [];
                message.arrUserGroupInfo.push($root.Get_UserInfo_P.User_GroupInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Get_UserInfo_P message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Get_UserInfo_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Get_UserInfo_P} Get_UserInfo_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_UserInfo_P.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Get_UserInfo_P message.
     * @function verify
     * @memberof Get_UserInfo_P
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Get_UserInfo_P.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrUserGroupInfo != null && message.hasOwnProperty("arrUserGroupInfo")) {
            if (!Array.isArray(message.arrUserGroupInfo))
                return "arrUserGroupInfo: array expected";
            for (var i = 0; i < message.arrUserGroupInfo.length; ++i) {
                var error = $root.Get_UserInfo_P.User_GroupInfo.verify(message.arrUserGroupInfo[i]);
                if (error)
                    return "arrUserGroupInfo." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Get_UserInfo_P message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Get_UserInfo_P
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Get_UserInfo_P} Get_UserInfo_P
     */
    Get_UserInfo_P.fromObject = function fromObject(object) {
        if (object instanceof $root.Get_UserInfo_P)
            return object;
        var message = new $root.Get_UserInfo_P();
        if (object.arrUserGroupInfo) {
            if (!Array.isArray(object.arrUserGroupInfo))
                throw TypeError(".Get_UserInfo_P.arrUserGroupInfo: array expected");
            message.arrUserGroupInfo = [];
            for (var i = 0; i < object.arrUserGroupInfo.length; ++i) {
                if (typeof object.arrUserGroupInfo[i] !== "object")
                    throw TypeError(".Get_UserInfo_P.arrUserGroupInfo: object expected");
                message.arrUserGroupInfo[i] = $root.Get_UserInfo_P.User_GroupInfo.fromObject(object.arrUserGroupInfo[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Get_UserInfo_P message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Get_UserInfo_P
     * @static
     * @param {Get_UserInfo_P} message Get_UserInfo_P
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Get_UserInfo_P.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrUserGroupInfo = [];
        if (message.arrUserGroupInfo && message.arrUserGroupInfo.length) {
            object.arrUserGroupInfo = [];
            for (var j = 0; j < message.arrUserGroupInfo.length; ++j)
                object.arrUserGroupInfo[j] = $root.Get_UserInfo_P.User_GroupInfo.toObject(message.arrUserGroupInfo[j], options);
        }
        return object;
    };

    /**
     * Converts this Get_UserInfo_P to JSON.
     * @function toJSON
     * @memberof Get_UserInfo_P
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Get_UserInfo_P.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    Get_UserInfo_P.User_GroupInfo = (function() {

        /**
         * Properties of a User_GroupInfo.
         * @memberof Get_UserInfo_P
         * @interface IUser_GroupInfo
         * @property {number|null} [nUserID] User_GroupInfo nUserID
         * @property {number|null} [nGroupId] User_GroupInfo nGroupId
         * @property {number|null} [nShoupId] User_GroupInfo nShoupId
         * @property {string|null} [sNickName] User_GroupInfo sNickName
         */

        /**
         * Constructs a new User_GroupInfo.
         * @memberof Get_UserInfo_P
         * @classdesc Represents a User_GroupInfo.
         * @implements IUser_GroupInfo
         * @constructor
         * @param {Get_UserInfo_P.IUser_GroupInfo=} [properties] Properties to set
         */
        function User_GroupInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * User_GroupInfo nUserID.
         * @member {number} nUserID
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @instance
         */
        User_GroupInfo.prototype.nUserID = -99;

        /**
         * User_GroupInfo nGroupId.
         * @member {number} nGroupId
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @instance
         */
        User_GroupInfo.prototype.nGroupId = -99;

        /**
         * User_GroupInfo nShoupId.
         * @member {number} nShoupId
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @instance
         */
        User_GroupInfo.prototype.nShoupId = -99;

        /**
         * User_GroupInfo sNickName.
         * @member {string} sNickName
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @instance
         */
        User_GroupInfo.prototype.sNickName = "";

        /**
         * Creates a new User_GroupInfo instance using the specified properties.
         * @function create
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Get_UserInfo_P.IUser_GroupInfo=} [properties] Properties to set
         * @returns {Get_UserInfo_P.User_GroupInfo} User_GroupInfo instance
         */
        User_GroupInfo.create = function create(properties) {
            return new User_GroupInfo(properties);
        };

        /**
         * Encodes the specified User_GroupInfo message. Does not implicitly {@link Get_UserInfo_P.User_GroupInfo.verify|verify} messages.
         * @function encode
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Get_UserInfo_P.IUser_GroupInfo} message User_GroupInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User_GroupInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nUserID != null && Object.hasOwnProperty.call(message, "nUserID"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserID);
            if (message.nGroupId != null && Object.hasOwnProperty.call(message, "nGroupId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nGroupId);
            if (message.nShoupId != null && Object.hasOwnProperty.call(message, "nShoupId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nShoupId);
            if (message.sNickName != null && Object.hasOwnProperty.call(message, "sNickName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.sNickName);
            return writer;
        };

        /**
         * Encodes the specified User_GroupInfo message, length delimited. Does not implicitly {@link Get_UserInfo_P.User_GroupInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Get_UserInfo_P.IUser_GroupInfo} message User_GroupInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User_GroupInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a User_GroupInfo message from the specified reader or buffer.
         * @function decode
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Get_UserInfo_P.User_GroupInfo} User_GroupInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User_GroupInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Get_UserInfo_P.User_GroupInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nUserID = reader.int32();
                    break;
                case 2:
                    message.nGroupId = reader.int32();
                    break;
                case 3:
                    message.nShoupId = reader.int32();
                    break;
                case 4:
                    message.sNickName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a User_GroupInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Get_UserInfo_P.User_GroupInfo} User_GroupInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User_GroupInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a User_GroupInfo message.
         * @function verify
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        User_GroupInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nUserID != null && message.hasOwnProperty("nUserID"))
                if (!$util.isInteger(message.nUserID))
                    return "nUserID: integer expected";
            if (message.nGroupId != null && message.hasOwnProperty("nGroupId"))
                if (!$util.isInteger(message.nGroupId))
                    return "nGroupId: integer expected";
            if (message.nShoupId != null && message.hasOwnProperty("nShoupId"))
                if (!$util.isInteger(message.nShoupId))
                    return "nShoupId: integer expected";
            if (message.sNickName != null && message.hasOwnProperty("sNickName"))
                if (!$util.isString(message.sNickName))
                    return "sNickName: string expected";
            return null;
        };

        /**
         * Creates a User_GroupInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Get_UserInfo_P.User_GroupInfo} User_GroupInfo
         */
        User_GroupInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.Get_UserInfo_P.User_GroupInfo)
                return object;
            var message = new $root.Get_UserInfo_P.User_GroupInfo();
            if (object.nUserID != null)
                message.nUserID = object.nUserID | 0;
            if (object.nGroupId != null)
                message.nGroupId = object.nGroupId | 0;
            if (object.nShoupId != null)
                message.nShoupId = object.nShoupId | 0;
            if (object.sNickName != null)
                message.sNickName = String(object.sNickName);
            return message;
        };

        /**
         * Creates a plain object from a User_GroupInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @static
         * @param {Get_UserInfo_P.User_GroupInfo} message User_GroupInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        User_GroupInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nUserID = -99;
                object.nGroupId = -99;
                object.nShoupId = -99;
                object.sNickName = "";
            }
            if (message.nUserID != null && message.hasOwnProperty("nUserID"))
                object.nUserID = message.nUserID;
            if (message.nGroupId != null && message.hasOwnProperty("nGroupId"))
                object.nGroupId = message.nGroupId;
            if (message.nShoupId != null && message.hasOwnProperty("nShoupId"))
                object.nShoupId = message.nShoupId;
            if (message.sNickName != null && message.hasOwnProperty("sNickName"))
                object.sNickName = message.sNickName;
            return object;
        };

        /**
         * Converts this User_GroupInfo to JSON.
         * @function toJSON
         * @memberof Get_UserInfo_P.User_GroupInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        User_GroupInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return User_GroupInfo;
    })();

    return Get_UserInfo_P;
})();

$root.Get_ZBTableID_Q = (function() {

    /**
     * Properties of a Get_ZBTableID_Q.
     * @exports IGet_ZBTableID_Q
     * @interface IGet_ZBTableID_Q
     * @property {string} sUrl Get_ZBTableID_Q sUrl
     */

    /**
     * Constructs a new Get_ZBTableID_Q.
     * @exports Get_ZBTableID_Q
     * @classdesc Represents a Get_ZBTableID_Q.
     * @implements IGet_ZBTableID_Q
     * @constructor
     * @param {IGet_ZBTableID_Q=} [properties] Properties to set
     */
    function Get_ZBTableID_Q(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Get_ZBTableID_Q sUrl.
     * @member {string} sUrl
     * @memberof Get_ZBTableID_Q
     * @instance
     */
    Get_ZBTableID_Q.prototype.sUrl = "";

    /**
     * Creates a new Get_ZBTableID_Q instance using the specified properties.
     * @function create
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {IGet_ZBTableID_Q=} [properties] Properties to set
     * @returns {Get_ZBTableID_Q} Get_ZBTableID_Q instance
     */
    Get_ZBTableID_Q.create = function create(properties) {
        return new Get_ZBTableID_Q(properties);
    };

    /**
     * Encodes the specified Get_ZBTableID_Q message. Does not implicitly {@link Get_ZBTableID_Q.verify|verify} messages.
     * @function encode
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {IGet_ZBTableID_Q} message Get_ZBTableID_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_ZBTableID_Q.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sUrl);
        return writer;
    };

    /**
     * Encodes the specified Get_ZBTableID_Q message, length delimited. Does not implicitly {@link Get_ZBTableID_Q.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {IGet_ZBTableID_Q} message Get_ZBTableID_Q message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_ZBTableID_Q.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Get_ZBTableID_Q message from the specified reader or buffer.
     * @function decode
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Get_ZBTableID_Q} Get_ZBTableID_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_ZBTableID_Q.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Get_ZBTableID_Q();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sUrl = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sUrl"))
            throw $util.ProtocolError("missing required 'sUrl'", { instance: message });
        return message;
    };

    /**
     * Decodes a Get_ZBTableID_Q message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Get_ZBTableID_Q} Get_ZBTableID_Q
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_ZBTableID_Q.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Get_ZBTableID_Q message.
     * @function verify
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Get_ZBTableID_Q.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sUrl))
            return "sUrl: string expected";
        return null;
    };

    /**
     * Creates a Get_ZBTableID_Q message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Get_ZBTableID_Q} Get_ZBTableID_Q
     */
    Get_ZBTableID_Q.fromObject = function fromObject(object) {
        if (object instanceof $root.Get_ZBTableID_Q)
            return object;
        var message = new $root.Get_ZBTableID_Q();
        if (object.sUrl != null)
            message.sUrl = String(object.sUrl);
        return message;
    };

    /**
     * Creates a plain object from a Get_ZBTableID_Q message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Get_ZBTableID_Q
     * @static
     * @param {Get_ZBTableID_Q} message Get_ZBTableID_Q
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Get_ZBTableID_Q.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sUrl = "";
        if (message.sUrl != null && message.hasOwnProperty("sUrl"))
            object.sUrl = message.sUrl;
        return object;
    };

    /**
     * Converts this Get_ZBTableID_Q to JSON.
     * @function toJSON
     * @memberof Get_ZBTableID_Q
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Get_ZBTableID_Q.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Get_ZBTableID_Q;
})();

$root.Get_ZBTableID_P = (function() {

    /**
     * Properties of a Get_ZBTableID_P.
     * @exports IGet_ZBTableID_P
     * @interface IGet_ZBTableID_P
     * @property {number} nStatus Get_ZBTableID_P nStatus
     * @property {string} sTableID Get_ZBTableID_P sTableID
     */

    /**
     * Constructs a new Get_ZBTableID_P.
     * @exports Get_ZBTableID_P
     * @classdesc Represents a Get_ZBTableID_P.
     * @implements IGet_ZBTableID_P
     * @constructor
     * @param {IGet_ZBTableID_P=} [properties] Properties to set
     */
    function Get_ZBTableID_P(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Get_ZBTableID_P nStatus.
     * @member {number} nStatus
     * @memberof Get_ZBTableID_P
     * @instance
     */
    Get_ZBTableID_P.prototype.nStatus = 0;

    /**
     * Get_ZBTableID_P sTableID.
     * @member {string} sTableID
     * @memberof Get_ZBTableID_P
     * @instance
     */
    Get_ZBTableID_P.prototype.sTableID = "";

    /**
     * Creates a new Get_ZBTableID_P instance using the specified properties.
     * @function create
     * @memberof Get_ZBTableID_P
     * @static
     * @param {IGet_ZBTableID_P=} [properties] Properties to set
     * @returns {Get_ZBTableID_P} Get_ZBTableID_P instance
     */
    Get_ZBTableID_P.create = function create(properties) {
        return new Get_ZBTableID_P(properties);
    };

    /**
     * Encodes the specified Get_ZBTableID_P message. Does not implicitly {@link Get_ZBTableID_P.verify|verify} messages.
     * @function encode
     * @memberof Get_ZBTableID_P
     * @static
     * @param {IGet_ZBTableID_P} message Get_ZBTableID_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_ZBTableID_P.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nStatus);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTableID);
        return writer;
    };

    /**
     * Encodes the specified Get_ZBTableID_P message, length delimited. Does not implicitly {@link Get_ZBTableID_P.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Get_ZBTableID_P
     * @static
     * @param {IGet_ZBTableID_P} message Get_ZBTableID_P message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Get_ZBTableID_P.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Get_ZBTableID_P message from the specified reader or buffer.
     * @function decode
     * @memberof Get_ZBTableID_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Get_ZBTableID_P} Get_ZBTableID_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_ZBTableID_P.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Get_ZBTableID_P();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nStatus = reader.int32();
                break;
            case 2:
                message.sTableID = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nStatus"))
            throw $util.ProtocolError("missing required 'nStatus'", { instance: message });
        if (!message.hasOwnProperty("sTableID"))
            throw $util.ProtocolError("missing required 'sTableID'", { instance: message });
        return message;
    };

    /**
     * Decodes a Get_ZBTableID_P message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Get_ZBTableID_P
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Get_ZBTableID_P} Get_ZBTableID_P
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Get_ZBTableID_P.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Get_ZBTableID_P message.
     * @function verify
     * @memberof Get_ZBTableID_P
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Get_ZBTableID_P.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nStatus))
            return "nStatus: integer expected";
        if (!$util.isString(message.sTableID))
            return "sTableID: string expected";
        return null;
    };

    /**
     * Creates a Get_ZBTableID_P message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Get_ZBTableID_P
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Get_ZBTableID_P} Get_ZBTableID_P
     */
    Get_ZBTableID_P.fromObject = function fromObject(object) {
        if (object instanceof $root.Get_ZBTableID_P)
            return object;
        var message = new $root.Get_ZBTableID_P();
        if (object.nStatus != null)
            message.nStatus = object.nStatus | 0;
        if (object.sTableID != null)
            message.sTableID = String(object.sTableID);
        return message;
    };

    /**
     * Creates a plain object from a Get_ZBTableID_P message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Get_ZBTableID_P
     * @static
     * @param {Get_ZBTableID_P} message Get_ZBTableID_P
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Get_ZBTableID_P.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nStatus = 0;
            object.sTableID = "";
        }
        if (message.nStatus != null && message.hasOwnProperty("nStatus"))
            object.nStatus = message.nStatus;
        if (message.sTableID != null && message.hasOwnProperty("sTableID"))
            object.sTableID = message.sTableID;
        return object;
    };

    /**
     * Converts this Get_ZBTableID_P to JSON.
     * @function toJSON
     * @memberof Get_ZBTableID_P
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Get_ZBTableID_P.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Get_ZBTableID_P;
})();

$root.BrLiveGameRecordReq = (function() {

    /**
     * Properties of a BrLiveGameRecordReq.
     * @exports IBrLiveGameRecordReq
     * @interface IBrLiveGameRecordReq
     * @property {number} nGameID BrLiveGameRecordReq nGameID
     * @property {number} nQueryCnt BrLiveGameRecordReq nQueryCnt
     * @property {number} nMinId BrLiveGameRecordReq nMinId
     * @property {string|null} [sStartTime] BrLiveGameRecordReq sStartTime
     * @property {string|null} [sEndTime] BrLiveGameRecordReq sEndTime
     */

    /**
     * Constructs a new BrLiveGameRecordReq.
     * @exports BrLiveGameRecordReq
     * @classdesc Represents a BrLiveGameRecordReq.
     * @implements IBrLiveGameRecordReq
     * @constructor
     * @param {IBrLiveGameRecordReq=} [properties] Properties to set
     */
    function BrLiveGameRecordReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BrLiveGameRecordReq nGameID.
     * @member {number} nGameID
     * @memberof BrLiveGameRecordReq
     * @instance
     */
    BrLiveGameRecordReq.prototype.nGameID = 0;

    /**
     * BrLiveGameRecordReq nQueryCnt.
     * @member {number} nQueryCnt
     * @memberof BrLiveGameRecordReq
     * @instance
     */
    BrLiveGameRecordReq.prototype.nQueryCnt = 10;

    /**
     * BrLiveGameRecordReq nMinId.
     * @member {number} nMinId
     * @memberof BrLiveGameRecordReq
     * @instance
     */
    BrLiveGameRecordReq.prototype.nMinId = 0;

    /**
     * BrLiveGameRecordReq sStartTime.
     * @member {string} sStartTime
     * @memberof BrLiveGameRecordReq
     * @instance
     */
    BrLiveGameRecordReq.prototype.sStartTime = "";

    /**
     * BrLiveGameRecordReq sEndTime.
     * @member {string} sEndTime
     * @memberof BrLiveGameRecordReq
     * @instance
     */
    BrLiveGameRecordReq.prototype.sEndTime = "";

    /**
     * Creates a new BrLiveGameRecordReq instance using the specified properties.
     * @function create
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {IBrLiveGameRecordReq=} [properties] Properties to set
     * @returns {BrLiveGameRecordReq} BrLiveGameRecordReq instance
     */
    BrLiveGameRecordReq.create = function create(properties) {
        return new BrLiveGameRecordReq(properties);
    };

    /**
     * Encodes the specified BrLiveGameRecordReq message. Does not implicitly {@link BrLiveGameRecordReq.verify|verify} messages.
     * @function encode
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {IBrLiveGameRecordReq} message BrLiveGameRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameRecordReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nGameID);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nQueryCnt);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nMinId);
        if (message.sStartTime != null && Object.hasOwnProperty.call(message, "sStartTime"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sStartTime);
        if (message.sEndTime != null && Object.hasOwnProperty.call(message, "sEndTime"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sEndTime);
        return writer;
    };

    /**
     * Encodes the specified BrLiveGameRecordReq message, length delimited. Does not implicitly {@link BrLiveGameRecordReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {IBrLiveGameRecordReq} message BrLiveGameRecordReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameRecordReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BrLiveGameRecordReq message from the specified reader or buffer.
     * @function decode
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BrLiveGameRecordReq} BrLiveGameRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameRecordReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameRecordReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nGameID = reader.int32();
                break;
            case 2:
                message.nQueryCnt = reader.int32();
                break;
            case 3:
                message.nMinId = reader.int32();
                break;
            case 4:
                message.sStartTime = reader.string();
                break;
            case 5:
                message.sEndTime = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nGameID"))
            throw $util.ProtocolError("missing required 'nGameID'", { instance: message });
        if (!message.hasOwnProperty("nQueryCnt"))
            throw $util.ProtocolError("missing required 'nQueryCnt'", { instance: message });
        if (!message.hasOwnProperty("nMinId"))
            throw $util.ProtocolError("missing required 'nMinId'", { instance: message });
        return message;
    };

    /**
     * Decodes a BrLiveGameRecordReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BrLiveGameRecordReq} BrLiveGameRecordReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameRecordReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BrLiveGameRecordReq message.
     * @function verify
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BrLiveGameRecordReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nGameID))
            return "nGameID: integer expected";
        if (!$util.isInteger(message.nQueryCnt))
            return "nQueryCnt: integer expected";
        if (!$util.isInteger(message.nMinId))
            return "nMinId: integer expected";
        if (message.sStartTime != null && message.hasOwnProperty("sStartTime"))
            if (!$util.isString(message.sStartTime))
                return "sStartTime: string expected";
        if (message.sEndTime != null && message.hasOwnProperty("sEndTime"))
            if (!$util.isString(message.sEndTime))
                return "sEndTime: string expected";
        return null;
    };

    /**
     * Creates a BrLiveGameRecordReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BrLiveGameRecordReq} BrLiveGameRecordReq
     */
    BrLiveGameRecordReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BrLiveGameRecordReq)
            return object;
        var message = new $root.BrLiveGameRecordReq();
        if (object.nGameID != null)
            message.nGameID = object.nGameID | 0;
        if (object.nQueryCnt != null)
            message.nQueryCnt = object.nQueryCnt | 0;
        if (object.nMinId != null)
            message.nMinId = object.nMinId | 0;
        if (object.sStartTime != null)
            message.sStartTime = String(object.sStartTime);
        if (object.sEndTime != null)
            message.sEndTime = String(object.sEndTime);
        return message;
    };

    /**
     * Creates a plain object from a BrLiveGameRecordReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BrLiveGameRecordReq
     * @static
     * @param {BrLiveGameRecordReq} message BrLiveGameRecordReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BrLiveGameRecordReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nGameID = 0;
            object.nQueryCnt = 10;
            object.nMinId = 0;
            object.sStartTime = "";
            object.sEndTime = "";
        }
        if (message.nGameID != null && message.hasOwnProperty("nGameID"))
            object.nGameID = message.nGameID;
        if (message.nQueryCnt != null && message.hasOwnProperty("nQueryCnt"))
            object.nQueryCnt = message.nQueryCnt;
        if (message.nMinId != null && message.hasOwnProperty("nMinId"))
            object.nMinId = message.nMinId;
        if (message.sStartTime != null && message.hasOwnProperty("sStartTime"))
            object.sStartTime = message.sStartTime;
        if (message.sEndTime != null && message.hasOwnProperty("sEndTime"))
            object.sEndTime = message.sEndTime;
        return object;
    };

    /**
     * Converts this BrLiveGameRecordReq to JSON.
     * @function toJSON
     * @memberof BrLiveGameRecordReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BrLiveGameRecordReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BrLiveGameRecordReq;
})();

$root.BrLiveGameRecordRsp = (function() {

    /**
     * Properties of a BrLiveGameRecordRsp.
     * @exports IBrLiveGameRecordRsp
     * @interface IBrLiveGameRecordRsp
     * @property {Array.<BrLiveGameRecordRsp.IItem>|null} [arrItem] BrLiveGameRecordRsp arrItem
     * @property {number} nMinId BrLiveGameRecordRsp nMinId
     * @property {number} nGameID BrLiveGameRecordRsp nGameID
     * @property {number|null} [nSumItem] BrLiveGameRecordRsp nSumItem
     * @property {string|null} [sData] BrLiveGameRecordRsp sData
     */

    /**
     * Constructs a new BrLiveGameRecordRsp.
     * @exports BrLiveGameRecordRsp
     * @classdesc Represents a BrLiveGameRecordRsp.
     * @implements IBrLiveGameRecordRsp
     * @constructor
     * @param {IBrLiveGameRecordRsp=} [properties] Properties to set
     */
    function BrLiveGameRecordRsp(properties) {
        this.arrItem = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BrLiveGameRecordRsp arrItem.
     * @member {Array.<BrLiveGameRecordRsp.IItem>} arrItem
     * @memberof BrLiveGameRecordRsp
     * @instance
     */
    BrLiveGameRecordRsp.prototype.arrItem = $util.emptyArray;

    /**
     * BrLiveGameRecordRsp nMinId.
     * @member {number} nMinId
     * @memberof BrLiveGameRecordRsp
     * @instance
     */
    BrLiveGameRecordRsp.prototype.nMinId = 0;

    /**
     * BrLiveGameRecordRsp nGameID.
     * @member {number} nGameID
     * @memberof BrLiveGameRecordRsp
     * @instance
     */
    BrLiveGameRecordRsp.prototype.nGameID = 0;

    /**
     * BrLiveGameRecordRsp nSumItem.
     * @member {number} nSumItem
     * @memberof BrLiveGameRecordRsp
     * @instance
     */
    BrLiveGameRecordRsp.prototype.nSumItem = 0;

    /**
     * BrLiveGameRecordRsp sData.
     * @member {string} sData
     * @memberof BrLiveGameRecordRsp
     * @instance
     */
    BrLiveGameRecordRsp.prototype.sData = "";

    /**
     * Creates a new BrLiveGameRecordRsp instance using the specified properties.
     * @function create
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {IBrLiveGameRecordRsp=} [properties] Properties to set
     * @returns {BrLiveGameRecordRsp} BrLiveGameRecordRsp instance
     */
    BrLiveGameRecordRsp.create = function create(properties) {
        return new BrLiveGameRecordRsp(properties);
    };

    /**
     * Encodes the specified BrLiveGameRecordRsp message. Does not implicitly {@link BrLiveGameRecordRsp.verify|verify} messages.
     * @function encode
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {IBrLiveGameRecordRsp} message BrLiveGameRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameRecordRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrItem != null && message.arrItem.length)
            for (var i = 0; i < message.arrItem.length; ++i)
                $root.BrLiveGameRecordRsp.Item.encode(message.arrItem[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nMinId);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nGameID);
        if (message.nSumItem != null && Object.hasOwnProperty.call(message, "nSumItem"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nSumItem);
        if (message.sData != null && Object.hasOwnProperty.call(message, "sData"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.sData);
        return writer;
    };

    /**
     * Encodes the specified BrLiveGameRecordRsp message, length delimited. Does not implicitly {@link BrLiveGameRecordRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {IBrLiveGameRecordRsp} message BrLiveGameRecordRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameRecordRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BrLiveGameRecordRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BrLiveGameRecordRsp} BrLiveGameRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameRecordRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameRecordRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrItem && message.arrItem.length))
                    message.arrItem = [];
                message.arrItem.push($root.BrLiveGameRecordRsp.Item.decode(reader, reader.uint32()));
                break;
            case 2:
                message.nMinId = reader.int32();
                break;
            case 3:
                message.nGameID = reader.int32();
                break;
            case 4:
                message.nSumItem = reader.int32();
                break;
            case 5:
                message.sData = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nMinId"))
            throw $util.ProtocolError("missing required 'nMinId'", { instance: message });
        if (!message.hasOwnProperty("nGameID"))
            throw $util.ProtocolError("missing required 'nGameID'", { instance: message });
        return message;
    };

    /**
     * Decodes a BrLiveGameRecordRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BrLiveGameRecordRsp} BrLiveGameRecordRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameRecordRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BrLiveGameRecordRsp message.
     * @function verify
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BrLiveGameRecordRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrItem != null && message.hasOwnProperty("arrItem")) {
            if (!Array.isArray(message.arrItem))
                return "arrItem: array expected";
            for (var i = 0; i < message.arrItem.length; ++i) {
                var error = $root.BrLiveGameRecordRsp.Item.verify(message.arrItem[i]);
                if (error)
                    return "arrItem." + error;
            }
        }
        if (!$util.isInteger(message.nMinId))
            return "nMinId: integer expected";
        if (!$util.isInteger(message.nGameID))
            return "nGameID: integer expected";
        if (message.nSumItem != null && message.hasOwnProperty("nSumItem"))
            if (!$util.isInteger(message.nSumItem))
                return "nSumItem: integer expected";
        if (message.sData != null && message.hasOwnProperty("sData"))
            if (!$util.isString(message.sData))
                return "sData: string expected";
        return null;
    };

    /**
     * Creates a BrLiveGameRecordRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BrLiveGameRecordRsp} BrLiveGameRecordRsp
     */
    BrLiveGameRecordRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BrLiveGameRecordRsp)
            return object;
        var message = new $root.BrLiveGameRecordRsp();
        if (object.arrItem) {
            if (!Array.isArray(object.arrItem))
                throw TypeError(".BrLiveGameRecordRsp.arrItem: array expected");
            message.arrItem = [];
            for (var i = 0; i < object.arrItem.length; ++i) {
                if (typeof object.arrItem[i] !== "object")
                    throw TypeError(".BrLiveGameRecordRsp.arrItem: object expected");
                message.arrItem[i] = $root.BrLiveGameRecordRsp.Item.fromObject(object.arrItem[i]);
            }
        }
        if (object.nMinId != null)
            message.nMinId = object.nMinId | 0;
        if (object.nGameID != null)
            message.nGameID = object.nGameID | 0;
        if (object.nSumItem != null)
            message.nSumItem = object.nSumItem | 0;
        if (object.sData != null)
            message.sData = String(object.sData);
        return message;
    };

    /**
     * Creates a plain object from a BrLiveGameRecordRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BrLiveGameRecordRsp
     * @static
     * @param {BrLiveGameRecordRsp} message BrLiveGameRecordRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BrLiveGameRecordRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrItem = [];
        if (options.defaults) {
            object.nMinId = 0;
            object.nGameID = 0;
            object.nSumItem = 0;
            object.sData = "";
        }
        if (message.arrItem && message.arrItem.length) {
            object.arrItem = [];
            for (var j = 0; j < message.arrItem.length; ++j)
                object.arrItem[j] = $root.BrLiveGameRecordRsp.Item.toObject(message.arrItem[j], options);
        }
        if (message.nMinId != null && message.hasOwnProperty("nMinId"))
            object.nMinId = message.nMinId;
        if (message.nGameID != null && message.hasOwnProperty("nGameID"))
            object.nGameID = message.nGameID;
        if (message.nSumItem != null && message.hasOwnProperty("nSumItem"))
            object.nSumItem = message.nSumItem;
        if (message.sData != null && message.hasOwnProperty("sData"))
            object.sData = message.sData;
        return object;
    };

    /**
     * Converts this BrLiveGameRecordRsp to JSON.
     * @function toJSON
     * @memberof BrLiveGameRecordRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BrLiveGameRecordRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    BrLiveGameRecordRsp.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof BrLiveGameRecordRsp
         * @interface IItem
         * @property {string} sPaiJuID Item sPaiJuID
         * @property {string} sTime Item sTime
         * @property {number} nBet Item nBet
         * @property {number} nProfit Item nProfit
         * @property {number} nId Item nId
         */

        /**
         * Constructs a new Item.
         * @memberof BrLiveGameRecordRsp
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {BrLiveGameRecordRsp.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item sPaiJuID.
         * @member {string} sPaiJuID
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         */
        Item.prototype.sPaiJuID = "";

        /**
         * Item sTime.
         * @member {string} sTime
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         */
        Item.prototype.sTime = "";

        /**
         * Item nBet.
         * @member {number} nBet
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         */
        Item.prototype.nBet = 0;

        /**
         * Item nProfit.
         * @member {number} nProfit
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         */
        Item.prototype.nProfit = 0;

        /**
         * Item nId.
         * @member {number} nId
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         */
        Item.prototype.nId = 0;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {BrLiveGameRecordRsp.IItem=} [properties] Properties to set
         * @returns {BrLiveGameRecordRsp.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link BrLiveGameRecordRsp.Item.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {BrLiveGameRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPaiJuID);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTime);
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.nBet);
            writer.uint32(/* id 4, wireType 1 =*/33).double(message.nProfit);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nId);
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link BrLiveGameRecordRsp.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {BrLiveGameRecordRsp.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameRecordRsp.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sPaiJuID = reader.string();
                    break;
                case 2:
                    message.sTime = reader.string();
                    break;
                case 3:
                    message.nBet = reader.double();
                    break;
                case 4:
                    message.nProfit = reader.double();
                    break;
                case 5:
                    message.nId = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("sPaiJuID"))
                throw $util.ProtocolError("missing required 'sPaiJuID'", { instance: message });
            if (!message.hasOwnProperty("sTime"))
                throw $util.ProtocolError("missing required 'sTime'", { instance: message });
            if (!message.hasOwnProperty("nBet"))
                throw $util.ProtocolError("missing required 'nBet'", { instance: message });
            if (!message.hasOwnProperty("nProfit"))
                throw $util.ProtocolError("missing required 'nProfit'", { instance: message });
            if (!message.hasOwnProperty("nId"))
                throw $util.ProtocolError("missing required 'nId'", { instance: message });
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameRecordRsp.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.sPaiJuID))
                return "sPaiJuID: string expected";
            if (!$util.isString(message.sTime))
                return "sTime: string expected";
            if (typeof message.nBet !== "number")
                return "nBet: number expected";
            if (typeof message.nProfit !== "number")
                return "nProfit: number expected";
            if (!$util.isInteger(message.nId))
                return "nId: integer expected";
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameRecordRsp.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameRecordRsp.Item)
                return object;
            var message = new $root.BrLiveGameRecordRsp.Item();
            if (object.sPaiJuID != null)
                message.sPaiJuID = String(object.sPaiJuID);
            if (object.sTime != null)
                message.sTime = String(object.sTime);
            if (object.nBet != null)
                message.nBet = Number(object.nBet);
            if (object.nProfit != null)
                message.nProfit = Number(object.nProfit);
            if (object.nId != null)
                message.nId = object.nId | 0;
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameRecordRsp.Item
         * @static
         * @param {BrLiveGameRecordRsp.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sPaiJuID = "";
                object.sTime = "";
                object.nBet = 0;
                object.nProfit = 0;
                object.nId = 0;
            }
            if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
                object.sPaiJuID = message.sPaiJuID;
            if (message.sTime != null && message.hasOwnProperty("sTime"))
                object.sTime = message.sTime;
            if (message.nBet != null && message.hasOwnProperty("nBet"))
                object.nBet = options.json && !isFinite(message.nBet) ? String(message.nBet) : message.nBet;
            if (message.nProfit != null && message.hasOwnProperty("nProfit"))
                object.nProfit = options.json && !isFinite(message.nProfit) ? String(message.nProfit) : message.nProfit;
            if (message.nId != null && message.hasOwnProperty("nId"))
                object.nId = message.nId;
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof BrLiveGameRecordRsp.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    return BrLiveGameRecordRsp;
})();

$root.BrLiveGameDetailReq = (function() {

    /**
     * Properties of a BrLiveGameDetailReq.
     * @exports IBrLiveGameDetailReq
     * @interface IBrLiveGameDetailReq
     * @property {string} sPaiJuID BrLiveGameDetailReq sPaiJuID
     */

    /**
     * Constructs a new BrLiveGameDetailReq.
     * @exports BrLiveGameDetailReq
     * @classdesc Represents a BrLiveGameDetailReq.
     * @implements IBrLiveGameDetailReq
     * @constructor
     * @param {IBrLiveGameDetailReq=} [properties] Properties to set
     */
    function BrLiveGameDetailReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BrLiveGameDetailReq sPaiJuID.
     * @member {string} sPaiJuID
     * @memberof BrLiveGameDetailReq
     * @instance
     */
    BrLiveGameDetailReq.prototype.sPaiJuID = "";

    /**
     * Creates a new BrLiveGameDetailReq instance using the specified properties.
     * @function create
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {IBrLiveGameDetailReq=} [properties] Properties to set
     * @returns {BrLiveGameDetailReq} BrLiveGameDetailReq instance
     */
    BrLiveGameDetailReq.create = function create(properties) {
        return new BrLiveGameDetailReq(properties);
    };

    /**
     * Encodes the specified BrLiveGameDetailReq message. Does not implicitly {@link BrLiveGameDetailReq.verify|verify} messages.
     * @function encode
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {IBrLiveGameDetailReq} message BrLiveGameDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameDetailReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPaiJuID);
        return writer;
    };

    /**
     * Encodes the specified BrLiveGameDetailReq message, length delimited. Does not implicitly {@link BrLiveGameDetailReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {IBrLiveGameDetailReq} message BrLiveGameDetailReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameDetailReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BrLiveGameDetailReq message from the specified reader or buffer.
     * @function decode
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BrLiveGameDetailReq} BrLiveGameDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameDetailReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sPaiJuID = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sPaiJuID"))
            throw $util.ProtocolError("missing required 'sPaiJuID'", { instance: message });
        return message;
    };

    /**
     * Decodes a BrLiveGameDetailReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BrLiveGameDetailReq} BrLiveGameDetailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameDetailReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BrLiveGameDetailReq message.
     * @function verify
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BrLiveGameDetailReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sPaiJuID))
            return "sPaiJuID: string expected";
        return null;
    };

    /**
     * Creates a BrLiveGameDetailReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BrLiveGameDetailReq} BrLiveGameDetailReq
     */
    BrLiveGameDetailReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BrLiveGameDetailReq)
            return object;
        var message = new $root.BrLiveGameDetailReq();
        if (object.sPaiJuID != null)
            message.sPaiJuID = String(object.sPaiJuID);
        return message;
    };

    /**
     * Creates a plain object from a BrLiveGameDetailReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BrLiveGameDetailReq
     * @static
     * @param {BrLiveGameDetailReq} message BrLiveGameDetailReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BrLiveGameDetailReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sPaiJuID = "";
        if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
            object.sPaiJuID = message.sPaiJuID;
        return object;
    };

    /**
     * Converts this BrLiveGameDetailReq to JSON.
     * @function toJSON
     * @memberof BrLiveGameDetailReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BrLiveGameDetailReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BrLiveGameDetailReq;
})();

$root.BrLiveGameDetailRsp = (function() {

    /**
     * Properties of a BrLiveGameDetailRsp.
     * @exports IBrLiveGameDetailRsp
     * @interface IBrLiveGameDetailRsp
     * @property {string} sPaiJuID BrLiveGameDetailRsp sPaiJuID
     * @property {string|null} [sTableNo] BrLiveGameDetailRsp sTableNo
     * @property {string|null} [sXueNo] BrLiveGameDetailRsp sXueNo
     * @property {string|null} [sRoundNo] BrLiveGameDetailRsp sRoundNo
     * @property {Array.<BrLiveGameDetailRsp.IAreaProfit>|null} [arrProfitDetail] BrLiveGameDetailRsp arrProfitDetail
     * @property {number} nGameID BrLiveGameDetailRsp nGameID
     * @property {BrLiveGameDetailRsp.IBaiJiaLeResult|null} [tBaiJiaLeResult] BrLiveGameDetailRsp tBaiJiaLeResult
     * @property {BrLiveGameDetailRsp.IYuXiaXieResult|null} [tYuXiaXieResult] BrLiveGameDetailRsp tYuXiaXieResult
     * @property {BrLiveGameDetailRsp.ISeDieResult|null} [tSeDieResult] BrLiveGameDetailRsp tSeDieResult
     * @property {BrLiveGameDetailRsp.ITouBaoResult|null} [tTouBaoResult] BrLiveGameDetailRsp tTouBaoResult
     * @property {number|null} [nWinLose] BrLiveGameDetailRsp nWinLose
     * @property {BrLiveGameDetailRsp.IFootBallResult|null} [tFootBallResult] BrLiveGameDetailRsp tFootBallResult
     * @property {BrLiveGameDetailRsp.ILongHuResult|null} [tLongHuResult] BrLiveGameDetailRsp tLongHuResult
     * @property {BrLiveGameDetailRsp.INiuNiuResult|null} [tNiuNiuResult] BrLiveGameDetailRsp tNiuNiuResult
     */

    /**
     * Constructs a new BrLiveGameDetailRsp.
     * @exports BrLiveGameDetailRsp
     * @classdesc Represents a BrLiveGameDetailRsp.
     * @implements IBrLiveGameDetailRsp
     * @constructor
     * @param {IBrLiveGameDetailRsp=} [properties] Properties to set
     */
    function BrLiveGameDetailRsp(properties) {
        this.arrProfitDetail = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BrLiveGameDetailRsp sPaiJuID.
     * @member {string} sPaiJuID
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.sPaiJuID = "";

    /**
     * BrLiveGameDetailRsp sTableNo.
     * @member {string} sTableNo
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.sTableNo = "";

    /**
     * BrLiveGameDetailRsp sXueNo.
     * @member {string} sXueNo
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.sXueNo = "";

    /**
     * BrLiveGameDetailRsp sRoundNo.
     * @member {string} sRoundNo
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.sRoundNo = "";

    /**
     * BrLiveGameDetailRsp arrProfitDetail.
     * @member {Array.<BrLiveGameDetailRsp.IAreaProfit>} arrProfitDetail
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.arrProfitDetail = $util.emptyArray;

    /**
     * BrLiveGameDetailRsp nGameID.
     * @member {number} nGameID
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.nGameID = 0;

    /**
     * BrLiveGameDetailRsp tBaiJiaLeResult.
     * @member {BrLiveGameDetailRsp.IBaiJiaLeResult|null|undefined} tBaiJiaLeResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tBaiJiaLeResult = null;

    /**
     * BrLiveGameDetailRsp tYuXiaXieResult.
     * @member {BrLiveGameDetailRsp.IYuXiaXieResult|null|undefined} tYuXiaXieResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tYuXiaXieResult = null;

    /**
     * BrLiveGameDetailRsp tSeDieResult.
     * @member {BrLiveGameDetailRsp.ISeDieResult|null|undefined} tSeDieResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tSeDieResult = null;

    /**
     * BrLiveGameDetailRsp tTouBaoResult.
     * @member {BrLiveGameDetailRsp.ITouBaoResult|null|undefined} tTouBaoResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tTouBaoResult = null;

    /**
     * BrLiveGameDetailRsp nWinLose.
     * @member {number} nWinLose
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.nWinLose = 0;

    /**
     * BrLiveGameDetailRsp tFootBallResult.
     * @member {BrLiveGameDetailRsp.IFootBallResult|null|undefined} tFootBallResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tFootBallResult = null;

    /**
     * BrLiveGameDetailRsp tLongHuResult.
     * @member {BrLiveGameDetailRsp.ILongHuResult|null|undefined} tLongHuResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tLongHuResult = null;

    /**
     * BrLiveGameDetailRsp tNiuNiuResult.
     * @member {BrLiveGameDetailRsp.INiuNiuResult|null|undefined} tNiuNiuResult
     * @memberof BrLiveGameDetailRsp
     * @instance
     */
    BrLiveGameDetailRsp.prototype.tNiuNiuResult = null;

    /**
     * Creates a new BrLiveGameDetailRsp instance using the specified properties.
     * @function create
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {IBrLiveGameDetailRsp=} [properties] Properties to set
     * @returns {BrLiveGameDetailRsp} BrLiveGameDetailRsp instance
     */
    BrLiveGameDetailRsp.create = function create(properties) {
        return new BrLiveGameDetailRsp(properties);
    };

    /**
     * Encodes the specified BrLiveGameDetailRsp message. Does not implicitly {@link BrLiveGameDetailRsp.verify|verify} messages.
     * @function encode
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {IBrLiveGameDetailRsp} message BrLiveGameDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameDetailRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sPaiJuID);
        if (message.sTableNo != null && Object.hasOwnProperty.call(message, "sTableNo"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sTableNo);
        if (message.sXueNo != null && Object.hasOwnProperty.call(message, "sXueNo"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.sXueNo);
        if (message.sRoundNo != null && Object.hasOwnProperty.call(message, "sRoundNo"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sRoundNo);
        if (message.arrProfitDetail != null && message.arrProfitDetail.length)
            for (var i = 0; i < message.arrProfitDetail.length; ++i)
                $root.BrLiveGameDetailRsp.AreaProfit.encode(message.arrProfitDetail[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.nGameID);
        if (message.tBaiJiaLeResult != null && Object.hasOwnProperty.call(message, "tBaiJiaLeResult"))
            $root.BrLiveGameDetailRsp.BaiJiaLeResult.encode(message.tBaiJiaLeResult, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.tYuXiaXieResult != null && Object.hasOwnProperty.call(message, "tYuXiaXieResult"))
            $root.BrLiveGameDetailRsp.YuXiaXieResult.encode(message.tYuXiaXieResult, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.tSeDieResult != null && Object.hasOwnProperty.call(message, "tSeDieResult"))
            $root.BrLiveGameDetailRsp.SeDieResult.encode(message.tSeDieResult, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.tTouBaoResult != null && Object.hasOwnProperty.call(message, "tTouBaoResult"))
            $root.BrLiveGameDetailRsp.TouBaoResult.encode(message.tTouBaoResult, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.nWinLose != null && Object.hasOwnProperty.call(message, "nWinLose"))
            writer.uint32(/* id 11, wireType 1 =*/89).double(message.nWinLose);
        if (message.tFootBallResult != null && Object.hasOwnProperty.call(message, "tFootBallResult"))
            $root.BrLiveGameDetailRsp.FootBallResult.encode(message.tFootBallResult, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.tLongHuResult != null && Object.hasOwnProperty.call(message, "tLongHuResult"))
            $root.BrLiveGameDetailRsp.LongHuResult.encode(message.tLongHuResult, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.tNiuNiuResult != null && Object.hasOwnProperty.call(message, "tNiuNiuResult"))
            $root.BrLiveGameDetailRsp.NiuNiuResult.encode(message.tNiuNiuResult, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BrLiveGameDetailRsp message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {IBrLiveGameDetailRsp} message BrLiveGameDetailRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BrLiveGameDetailRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BrLiveGameDetailRsp message from the specified reader or buffer.
     * @function decode
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BrLiveGameDetailRsp} BrLiveGameDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameDetailRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sPaiJuID = reader.string();
                break;
            case 2:
                message.sTableNo = reader.string();
                break;
            case 3:
                message.sXueNo = reader.string();
                break;
            case 4:
                message.sRoundNo = reader.string();
                break;
            case 5:
                if (!(message.arrProfitDetail && message.arrProfitDetail.length))
                    message.arrProfitDetail = [];
                message.arrProfitDetail.push($root.BrLiveGameDetailRsp.AreaProfit.decode(reader, reader.uint32()));
                break;
            case 6:
                message.nGameID = reader.int32();
                break;
            case 7:
                message.tBaiJiaLeResult = $root.BrLiveGameDetailRsp.BaiJiaLeResult.decode(reader, reader.uint32());
                break;
            case 8:
                message.tYuXiaXieResult = $root.BrLiveGameDetailRsp.YuXiaXieResult.decode(reader, reader.uint32());
                break;
            case 9:
                message.tSeDieResult = $root.BrLiveGameDetailRsp.SeDieResult.decode(reader, reader.uint32());
                break;
            case 10:
                message.tTouBaoResult = $root.BrLiveGameDetailRsp.TouBaoResult.decode(reader, reader.uint32());
                break;
            case 11:
                message.nWinLose = reader.double();
                break;
            case 12:
                message.tFootBallResult = $root.BrLiveGameDetailRsp.FootBallResult.decode(reader, reader.uint32());
                break;
            case 13:
                message.tLongHuResult = $root.BrLiveGameDetailRsp.LongHuResult.decode(reader, reader.uint32());
                break;
            case 14:
                message.tNiuNiuResult = $root.BrLiveGameDetailRsp.NiuNiuResult.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sPaiJuID"))
            throw $util.ProtocolError("missing required 'sPaiJuID'", { instance: message });
        if (!message.hasOwnProperty("nGameID"))
            throw $util.ProtocolError("missing required 'nGameID'", { instance: message });
        return message;
    };

    /**
     * Decodes a BrLiveGameDetailRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BrLiveGameDetailRsp} BrLiveGameDetailRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BrLiveGameDetailRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BrLiveGameDetailRsp message.
     * @function verify
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BrLiveGameDetailRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sPaiJuID))
            return "sPaiJuID: string expected";
        if (message.sTableNo != null && message.hasOwnProperty("sTableNo"))
            if (!$util.isString(message.sTableNo))
                return "sTableNo: string expected";
        if (message.sXueNo != null && message.hasOwnProperty("sXueNo"))
            if (!$util.isString(message.sXueNo))
                return "sXueNo: string expected";
        if (message.sRoundNo != null && message.hasOwnProperty("sRoundNo"))
            if (!$util.isString(message.sRoundNo))
                return "sRoundNo: string expected";
        if (message.arrProfitDetail != null && message.hasOwnProperty("arrProfitDetail")) {
            if (!Array.isArray(message.arrProfitDetail))
                return "arrProfitDetail: array expected";
            for (var i = 0; i < message.arrProfitDetail.length; ++i) {
                var error = $root.BrLiveGameDetailRsp.AreaProfit.verify(message.arrProfitDetail[i]);
                if (error)
                    return "arrProfitDetail." + error;
            }
        }
        if (!$util.isInteger(message.nGameID))
            return "nGameID: integer expected";
        if (message.tBaiJiaLeResult != null && message.hasOwnProperty("tBaiJiaLeResult")) {
            var error = $root.BrLiveGameDetailRsp.BaiJiaLeResult.verify(message.tBaiJiaLeResult);
            if (error)
                return "tBaiJiaLeResult." + error;
        }
        if (message.tYuXiaXieResult != null && message.hasOwnProperty("tYuXiaXieResult")) {
            var error = $root.BrLiveGameDetailRsp.YuXiaXieResult.verify(message.tYuXiaXieResult);
            if (error)
                return "tYuXiaXieResult." + error;
        }
        if (message.tSeDieResult != null && message.hasOwnProperty("tSeDieResult")) {
            var error = $root.BrLiveGameDetailRsp.SeDieResult.verify(message.tSeDieResult);
            if (error)
                return "tSeDieResult." + error;
        }
        if (message.tTouBaoResult != null && message.hasOwnProperty("tTouBaoResult")) {
            var error = $root.BrLiveGameDetailRsp.TouBaoResult.verify(message.tTouBaoResult);
            if (error)
                return "tTouBaoResult." + error;
        }
        if (message.nWinLose != null && message.hasOwnProperty("nWinLose"))
            if (typeof message.nWinLose !== "number")
                return "nWinLose: number expected";
        if (message.tFootBallResult != null && message.hasOwnProperty("tFootBallResult")) {
            var error = $root.BrLiveGameDetailRsp.FootBallResult.verify(message.tFootBallResult);
            if (error)
                return "tFootBallResult." + error;
        }
        if (message.tLongHuResult != null && message.hasOwnProperty("tLongHuResult")) {
            var error = $root.BrLiveGameDetailRsp.LongHuResult.verify(message.tLongHuResult);
            if (error)
                return "tLongHuResult." + error;
        }
        if (message.tNiuNiuResult != null && message.hasOwnProperty("tNiuNiuResult")) {
            var error = $root.BrLiveGameDetailRsp.NiuNiuResult.verify(message.tNiuNiuResult);
            if (error)
                return "tNiuNiuResult." + error;
        }
        return null;
    };

    /**
     * Creates a BrLiveGameDetailRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BrLiveGameDetailRsp} BrLiveGameDetailRsp
     */
    BrLiveGameDetailRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.BrLiveGameDetailRsp)
            return object;
        var message = new $root.BrLiveGameDetailRsp();
        if (object.sPaiJuID != null)
            message.sPaiJuID = String(object.sPaiJuID);
        if (object.sTableNo != null)
            message.sTableNo = String(object.sTableNo);
        if (object.sXueNo != null)
            message.sXueNo = String(object.sXueNo);
        if (object.sRoundNo != null)
            message.sRoundNo = String(object.sRoundNo);
        if (object.arrProfitDetail) {
            if (!Array.isArray(object.arrProfitDetail))
                throw TypeError(".BrLiveGameDetailRsp.arrProfitDetail: array expected");
            message.arrProfitDetail = [];
            for (var i = 0; i < object.arrProfitDetail.length; ++i) {
                if (typeof object.arrProfitDetail[i] !== "object")
                    throw TypeError(".BrLiveGameDetailRsp.arrProfitDetail: object expected");
                message.arrProfitDetail[i] = $root.BrLiveGameDetailRsp.AreaProfit.fromObject(object.arrProfitDetail[i]);
            }
        }
        if (object.nGameID != null)
            message.nGameID = object.nGameID | 0;
        if (object.tBaiJiaLeResult != null) {
            if (typeof object.tBaiJiaLeResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tBaiJiaLeResult: object expected");
            message.tBaiJiaLeResult = $root.BrLiveGameDetailRsp.BaiJiaLeResult.fromObject(object.tBaiJiaLeResult);
        }
        if (object.tYuXiaXieResult != null) {
            if (typeof object.tYuXiaXieResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tYuXiaXieResult: object expected");
            message.tYuXiaXieResult = $root.BrLiveGameDetailRsp.YuXiaXieResult.fromObject(object.tYuXiaXieResult);
        }
        if (object.tSeDieResult != null) {
            if (typeof object.tSeDieResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tSeDieResult: object expected");
            message.tSeDieResult = $root.BrLiveGameDetailRsp.SeDieResult.fromObject(object.tSeDieResult);
        }
        if (object.tTouBaoResult != null) {
            if (typeof object.tTouBaoResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tTouBaoResult: object expected");
            message.tTouBaoResult = $root.BrLiveGameDetailRsp.TouBaoResult.fromObject(object.tTouBaoResult);
        }
        if (object.nWinLose != null)
            message.nWinLose = Number(object.nWinLose);
        if (object.tFootBallResult != null) {
            if (typeof object.tFootBallResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tFootBallResult: object expected");
            message.tFootBallResult = $root.BrLiveGameDetailRsp.FootBallResult.fromObject(object.tFootBallResult);
        }
        if (object.tLongHuResult != null) {
            if (typeof object.tLongHuResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tLongHuResult: object expected");
            message.tLongHuResult = $root.BrLiveGameDetailRsp.LongHuResult.fromObject(object.tLongHuResult);
        }
        if (object.tNiuNiuResult != null) {
            if (typeof object.tNiuNiuResult !== "object")
                throw TypeError(".BrLiveGameDetailRsp.tNiuNiuResult: object expected");
            message.tNiuNiuResult = $root.BrLiveGameDetailRsp.NiuNiuResult.fromObject(object.tNiuNiuResult);
        }
        return message;
    };

    /**
     * Creates a plain object from a BrLiveGameDetailRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BrLiveGameDetailRsp
     * @static
     * @param {BrLiveGameDetailRsp} message BrLiveGameDetailRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BrLiveGameDetailRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrProfitDetail = [];
        if (options.defaults) {
            object.sPaiJuID = "";
            object.sTableNo = "";
            object.sXueNo = "";
            object.sRoundNo = "";
            object.nGameID = 0;
            object.tBaiJiaLeResult = null;
            object.tYuXiaXieResult = null;
            object.tSeDieResult = null;
            object.tTouBaoResult = null;
            object.nWinLose = 0;
            object.tFootBallResult = null;
            object.tLongHuResult = null;
            object.tNiuNiuResult = null;
        }
        if (message.sPaiJuID != null && message.hasOwnProperty("sPaiJuID"))
            object.sPaiJuID = message.sPaiJuID;
        if (message.sTableNo != null && message.hasOwnProperty("sTableNo"))
            object.sTableNo = message.sTableNo;
        if (message.sXueNo != null && message.hasOwnProperty("sXueNo"))
            object.sXueNo = message.sXueNo;
        if (message.sRoundNo != null && message.hasOwnProperty("sRoundNo"))
            object.sRoundNo = message.sRoundNo;
        if (message.arrProfitDetail && message.arrProfitDetail.length) {
            object.arrProfitDetail = [];
            for (var j = 0; j < message.arrProfitDetail.length; ++j)
                object.arrProfitDetail[j] = $root.BrLiveGameDetailRsp.AreaProfit.toObject(message.arrProfitDetail[j], options);
        }
        if (message.nGameID != null && message.hasOwnProperty("nGameID"))
            object.nGameID = message.nGameID;
        if (message.tBaiJiaLeResult != null && message.hasOwnProperty("tBaiJiaLeResult"))
            object.tBaiJiaLeResult = $root.BrLiveGameDetailRsp.BaiJiaLeResult.toObject(message.tBaiJiaLeResult, options);
        if (message.tYuXiaXieResult != null && message.hasOwnProperty("tYuXiaXieResult"))
            object.tYuXiaXieResult = $root.BrLiveGameDetailRsp.YuXiaXieResult.toObject(message.tYuXiaXieResult, options);
        if (message.tSeDieResult != null && message.hasOwnProperty("tSeDieResult"))
            object.tSeDieResult = $root.BrLiveGameDetailRsp.SeDieResult.toObject(message.tSeDieResult, options);
        if (message.tTouBaoResult != null && message.hasOwnProperty("tTouBaoResult"))
            object.tTouBaoResult = $root.BrLiveGameDetailRsp.TouBaoResult.toObject(message.tTouBaoResult, options);
        if (message.nWinLose != null && message.hasOwnProperty("nWinLose"))
            object.nWinLose = options.json && !isFinite(message.nWinLose) ? String(message.nWinLose) : message.nWinLose;
        if (message.tFootBallResult != null && message.hasOwnProperty("tFootBallResult"))
            object.tFootBallResult = $root.BrLiveGameDetailRsp.FootBallResult.toObject(message.tFootBallResult, options);
        if (message.tLongHuResult != null && message.hasOwnProperty("tLongHuResult"))
            object.tLongHuResult = $root.BrLiveGameDetailRsp.LongHuResult.toObject(message.tLongHuResult, options);
        if (message.tNiuNiuResult != null && message.hasOwnProperty("tNiuNiuResult"))
            object.tNiuNiuResult = $root.BrLiveGameDetailRsp.NiuNiuResult.toObject(message.tNiuNiuResult, options);
        return object;
    };

    /**
     * Converts this BrLiveGameDetailRsp to JSON.
     * @function toJSON
     * @memberof BrLiveGameDetailRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BrLiveGameDetailRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    BrLiveGameDetailRsp.AreaProfit = (function() {

        /**
         * Properties of an AreaProfit.
         * @memberof BrLiveGameDetailRsp
         * @interface IAreaProfit
         * @property {number} nAreaId AreaProfit nAreaId
         * @property {number} nProfit AreaProfit nProfit
         */

        /**
         * Constructs a new AreaProfit.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents an AreaProfit.
         * @implements IAreaProfit
         * @constructor
         * @param {BrLiveGameDetailRsp.IAreaProfit=} [properties] Properties to set
         */
        function AreaProfit(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AreaProfit nAreaId.
         * @member {number} nAreaId
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @instance
         */
        AreaProfit.prototype.nAreaId = 0;

        /**
         * AreaProfit nProfit.
         * @member {number} nProfit
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @instance
         */
        AreaProfit.prototype.nProfit = 0;

        /**
         * Creates a new AreaProfit instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {BrLiveGameDetailRsp.IAreaProfit=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.AreaProfit} AreaProfit instance
         */
        AreaProfit.create = function create(properties) {
            return new AreaProfit(properties);
        };

        /**
         * Encodes the specified AreaProfit message. Does not implicitly {@link BrLiveGameDetailRsp.AreaProfit.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {BrLiveGameDetailRsp.IAreaProfit} message AreaProfit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AreaProfit.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nAreaId);
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.nProfit);
            return writer;
        };

        /**
         * Encodes the specified AreaProfit message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.AreaProfit.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {BrLiveGameDetailRsp.IAreaProfit} message AreaProfit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AreaProfit.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AreaProfit message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.AreaProfit} AreaProfit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AreaProfit.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.AreaProfit();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nAreaId = reader.int32();
                    break;
                case 2:
                    message.nProfit = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nAreaId"))
                throw $util.ProtocolError("missing required 'nAreaId'", { instance: message });
            if (!message.hasOwnProperty("nProfit"))
                throw $util.ProtocolError("missing required 'nProfit'", { instance: message });
            return message;
        };

        /**
         * Decodes an AreaProfit message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.AreaProfit} AreaProfit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AreaProfit.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AreaProfit message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AreaProfit.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nAreaId))
                return "nAreaId: integer expected";
            if (typeof message.nProfit !== "number")
                return "nProfit: number expected";
            return null;
        };

        /**
         * Creates an AreaProfit message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.AreaProfit} AreaProfit
         */
        AreaProfit.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.AreaProfit)
                return object;
            var message = new $root.BrLiveGameDetailRsp.AreaProfit();
            if (object.nAreaId != null)
                message.nAreaId = object.nAreaId | 0;
            if (object.nProfit != null)
                message.nProfit = Number(object.nProfit);
            return message;
        };

        /**
         * Creates a plain object from an AreaProfit message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @static
         * @param {BrLiveGameDetailRsp.AreaProfit} message AreaProfit
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AreaProfit.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nAreaId = 0;
                object.nProfit = 0;
            }
            if (message.nAreaId != null && message.hasOwnProperty("nAreaId"))
                object.nAreaId = message.nAreaId;
            if (message.nProfit != null && message.hasOwnProperty("nProfit"))
                object.nProfit = options.json && !isFinite(message.nProfit) ? String(message.nProfit) : message.nProfit;
            return object;
        };

        /**
         * Converts this AreaProfit to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.AreaProfit
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AreaProfit.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AreaProfit;
    })();

    BrLiveGameDetailRsp.BaiJiaLeResult = (function() {

        /**
         * Properties of a BaiJiaLeResult.
         * @memberof BrLiveGameDetailRsp
         * @interface IBaiJiaLeResult
         * @property {Array.<number>|null} [arrCardsOfXian] BaiJiaLeResult arrCardsOfXian
         * @property {Array.<number>|null} [arrCardsOfZhuang] BaiJiaLeResult arrCardsOfZhuang
         * @property {number} nPointXian BaiJiaLeResult nPointXian
         * @property {number} nPointZhuang BaiJiaLeResult nPointZhuang
         * @property {number} nResult BaiJiaLeResult nResult
         */

        /**
         * Constructs a new BaiJiaLeResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a BaiJiaLeResult.
         * @implements IBaiJiaLeResult
         * @constructor
         * @param {BrLiveGameDetailRsp.IBaiJiaLeResult=} [properties] Properties to set
         */
        function BaiJiaLeResult(properties) {
            this.arrCardsOfXian = [];
            this.arrCardsOfZhuang = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BaiJiaLeResult arrCardsOfXian.
         * @member {Array.<number>} arrCardsOfXian
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         */
        BaiJiaLeResult.prototype.arrCardsOfXian = $util.emptyArray;

        /**
         * BaiJiaLeResult arrCardsOfZhuang.
         * @member {Array.<number>} arrCardsOfZhuang
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         */
        BaiJiaLeResult.prototype.arrCardsOfZhuang = $util.emptyArray;

        /**
         * BaiJiaLeResult nPointXian.
         * @member {number} nPointXian
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         */
        BaiJiaLeResult.prototype.nPointXian = 0;

        /**
         * BaiJiaLeResult nPointZhuang.
         * @member {number} nPointZhuang
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         */
        BaiJiaLeResult.prototype.nPointZhuang = 0;

        /**
         * BaiJiaLeResult nResult.
         * @member {number} nResult
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         */
        BaiJiaLeResult.prototype.nResult = 0;

        /**
         * Creates a new BaiJiaLeResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {BrLiveGameDetailRsp.IBaiJiaLeResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.BaiJiaLeResult} BaiJiaLeResult instance
         */
        BaiJiaLeResult.create = function create(properties) {
            return new BaiJiaLeResult(properties);
        };

        /**
         * Encodes the specified BaiJiaLeResult message. Does not implicitly {@link BrLiveGameDetailRsp.BaiJiaLeResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {BrLiveGameDetailRsp.IBaiJiaLeResult} message BaiJiaLeResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaiJiaLeResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCardsOfXian != null && message.arrCardsOfXian.length)
                for (var i = 0; i < message.arrCardsOfXian.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCardsOfXian[i]);
            if (message.arrCardsOfZhuang != null && message.arrCardsOfZhuang.length)
                for (var i = 0; i < message.arrCardsOfZhuang.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.arrCardsOfZhuang[i]);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nPointXian);
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nPointZhuang);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nResult);
            return writer;
        };

        /**
         * Encodes the specified BaiJiaLeResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.BaiJiaLeResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {BrLiveGameDetailRsp.IBaiJiaLeResult} message BaiJiaLeResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaiJiaLeResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BaiJiaLeResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.BaiJiaLeResult} BaiJiaLeResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaiJiaLeResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.BaiJiaLeResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCardsOfXian && message.arrCardsOfXian.length))
                        message.arrCardsOfXian = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfXian.push(reader.int32());
                    } else
                        message.arrCardsOfXian.push(reader.int32());
                    break;
                case 2:
                    if (!(message.arrCardsOfZhuang && message.arrCardsOfZhuang.length))
                        message.arrCardsOfZhuang = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfZhuang.push(reader.int32());
                    } else
                        message.arrCardsOfZhuang.push(reader.int32());
                    break;
                case 3:
                    message.nPointXian = reader.int32();
                    break;
                case 4:
                    message.nPointZhuang = reader.int32();
                    break;
                case 5:
                    message.nResult = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nPointXian"))
                throw $util.ProtocolError("missing required 'nPointXian'", { instance: message });
            if (!message.hasOwnProperty("nPointZhuang"))
                throw $util.ProtocolError("missing required 'nPointZhuang'", { instance: message });
            if (!message.hasOwnProperty("nResult"))
                throw $util.ProtocolError("missing required 'nResult'", { instance: message });
            return message;
        };

        /**
         * Decodes a BaiJiaLeResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.BaiJiaLeResult} BaiJiaLeResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaiJiaLeResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BaiJiaLeResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BaiJiaLeResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCardsOfXian != null && message.hasOwnProperty("arrCardsOfXian")) {
                if (!Array.isArray(message.arrCardsOfXian))
                    return "arrCardsOfXian: array expected";
                for (var i = 0; i < message.arrCardsOfXian.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfXian[i]))
                        return "arrCardsOfXian: integer[] expected";
            }
            if (message.arrCardsOfZhuang != null && message.hasOwnProperty("arrCardsOfZhuang")) {
                if (!Array.isArray(message.arrCardsOfZhuang))
                    return "arrCardsOfZhuang: array expected";
                for (var i = 0; i < message.arrCardsOfZhuang.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfZhuang[i]))
                        return "arrCardsOfZhuang: integer[] expected";
            }
            if (!$util.isInteger(message.nPointXian))
                return "nPointXian: integer expected";
            if (!$util.isInteger(message.nPointZhuang))
                return "nPointZhuang: integer expected";
            if (!$util.isInteger(message.nResult))
                return "nResult: integer expected";
            return null;
        };

        /**
         * Creates a BaiJiaLeResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.BaiJiaLeResult} BaiJiaLeResult
         */
        BaiJiaLeResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.BaiJiaLeResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.BaiJiaLeResult();
            if (object.arrCardsOfXian) {
                if (!Array.isArray(object.arrCardsOfXian))
                    throw TypeError(".BrLiveGameDetailRsp.BaiJiaLeResult.arrCardsOfXian: array expected");
                message.arrCardsOfXian = [];
                for (var i = 0; i < object.arrCardsOfXian.length; ++i)
                    message.arrCardsOfXian[i] = object.arrCardsOfXian[i] | 0;
            }
            if (object.arrCardsOfZhuang) {
                if (!Array.isArray(object.arrCardsOfZhuang))
                    throw TypeError(".BrLiveGameDetailRsp.BaiJiaLeResult.arrCardsOfZhuang: array expected");
                message.arrCardsOfZhuang = [];
                for (var i = 0; i < object.arrCardsOfZhuang.length; ++i)
                    message.arrCardsOfZhuang[i] = object.arrCardsOfZhuang[i] | 0;
            }
            if (object.nPointXian != null)
                message.nPointXian = object.nPointXian | 0;
            if (object.nPointZhuang != null)
                message.nPointZhuang = object.nPointZhuang | 0;
            if (object.nResult != null)
                message.nResult = object.nResult | 0;
            return message;
        };

        /**
         * Creates a plain object from a BaiJiaLeResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @static
         * @param {BrLiveGameDetailRsp.BaiJiaLeResult} message BaiJiaLeResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BaiJiaLeResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.arrCardsOfXian = [];
                object.arrCardsOfZhuang = [];
            }
            if (options.defaults) {
                object.nPointXian = 0;
                object.nPointZhuang = 0;
                object.nResult = 0;
            }
            if (message.arrCardsOfXian && message.arrCardsOfXian.length) {
                object.arrCardsOfXian = [];
                for (var j = 0; j < message.arrCardsOfXian.length; ++j)
                    object.arrCardsOfXian[j] = message.arrCardsOfXian[j];
            }
            if (message.arrCardsOfZhuang && message.arrCardsOfZhuang.length) {
                object.arrCardsOfZhuang = [];
                for (var j = 0; j < message.arrCardsOfZhuang.length; ++j)
                    object.arrCardsOfZhuang[j] = message.arrCardsOfZhuang[j];
            }
            if (message.nPointXian != null && message.hasOwnProperty("nPointXian"))
                object.nPointXian = message.nPointXian;
            if (message.nPointZhuang != null && message.hasOwnProperty("nPointZhuang"))
                object.nPointZhuang = message.nPointZhuang;
            if (message.nResult != null && message.hasOwnProperty("nResult"))
                object.nResult = message.nResult;
            return object;
        };

        /**
         * Converts this BaiJiaLeResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.BaiJiaLeResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BaiJiaLeResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BaiJiaLeResult;
    })();

    BrLiveGameDetailRsp.LongHuResult = (function() {

        /**
         * Properties of a LongHuResult.
         * @memberof BrLiveGameDetailRsp
         * @interface ILongHuResult
         * @property {number} nCardL LongHuResult nCardL
         * @property {number} nCardH LongHuResult nCardH
         * @property {number} nResult LongHuResult nResult
         */

        /**
         * Constructs a new LongHuResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a LongHuResult.
         * @implements ILongHuResult
         * @constructor
         * @param {BrLiveGameDetailRsp.ILongHuResult=} [properties] Properties to set
         */
        function LongHuResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LongHuResult nCardL.
         * @member {number} nCardL
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @instance
         */
        LongHuResult.prototype.nCardL = 0;

        /**
         * LongHuResult nCardH.
         * @member {number} nCardH
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @instance
         */
        LongHuResult.prototype.nCardH = 0;

        /**
         * LongHuResult nResult.
         * @member {number} nResult
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @instance
         */
        LongHuResult.prototype.nResult = 0;

        /**
         * Creates a new LongHuResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {BrLiveGameDetailRsp.ILongHuResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.LongHuResult} LongHuResult instance
         */
        LongHuResult.create = function create(properties) {
            return new LongHuResult(properties);
        };

        /**
         * Encodes the specified LongHuResult message. Does not implicitly {@link BrLiveGameDetailRsp.LongHuResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {BrLiveGameDetailRsp.ILongHuResult} message LongHuResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LongHuResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nCardL);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nCardH);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nResult);
            return writer;
        };

        /**
         * Encodes the specified LongHuResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.LongHuResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {BrLiveGameDetailRsp.ILongHuResult} message LongHuResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LongHuResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LongHuResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.LongHuResult} LongHuResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LongHuResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.LongHuResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nCardL = reader.int32();
                    break;
                case 2:
                    message.nCardH = reader.int32();
                    break;
                case 3:
                    message.nResult = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nCardL"))
                throw $util.ProtocolError("missing required 'nCardL'", { instance: message });
            if (!message.hasOwnProperty("nCardH"))
                throw $util.ProtocolError("missing required 'nCardH'", { instance: message });
            if (!message.hasOwnProperty("nResult"))
                throw $util.ProtocolError("missing required 'nResult'", { instance: message });
            return message;
        };

        /**
         * Decodes a LongHuResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.LongHuResult} LongHuResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LongHuResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LongHuResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LongHuResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.nCardL))
                return "nCardL: integer expected";
            if (!$util.isInteger(message.nCardH))
                return "nCardH: integer expected";
            if (!$util.isInteger(message.nResult))
                return "nResult: integer expected";
            return null;
        };

        /**
         * Creates a LongHuResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.LongHuResult} LongHuResult
         */
        LongHuResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.LongHuResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.LongHuResult();
            if (object.nCardL != null)
                message.nCardL = object.nCardL | 0;
            if (object.nCardH != null)
                message.nCardH = object.nCardH | 0;
            if (object.nResult != null)
                message.nResult = object.nResult | 0;
            return message;
        };

        /**
         * Creates a plain object from a LongHuResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @static
         * @param {BrLiveGameDetailRsp.LongHuResult} message LongHuResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LongHuResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nCardL = 0;
                object.nCardH = 0;
                object.nResult = 0;
            }
            if (message.nCardL != null && message.hasOwnProperty("nCardL"))
                object.nCardL = message.nCardL;
            if (message.nCardH != null && message.hasOwnProperty("nCardH"))
                object.nCardH = message.nCardH;
            if (message.nResult != null && message.hasOwnProperty("nResult"))
                object.nResult = message.nResult;
            return object;
        };

        /**
         * Converts this LongHuResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.LongHuResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LongHuResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LongHuResult;
    })();

    BrLiveGameDetailRsp.NiuNiuResult = (function() {

        /**
         * Properties of a NiuNiuResult.
         * @memberof BrLiveGameDetailRsp
         * @interface INiuNiuResult
         * @property {Array.<number>|null} [arrCardsOfZhuang] NiuNiuResult arrCardsOfZhuang
         * @property {Array.<number>|null} [arrCardsOfXian1] NiuNiuResult arrCardsOfXian1
         * @property {Array.<number>|null} [arrCardsOfXian2] NiuNiuResult arrCardsOfXian2
         * @property {Array.<number>|null} [arrCardsOfXian3] NiuNiuResult arrCardsOfXian3
         * @property {number} nZhuangNiuWhat NiuNiuResult nZhuangNiuWhat
         * @property {number} nXian1NiuWhat NiuNiuResult nXian1NiuWhat
         * @property {number} nXian2NiuWhat NiuNiuResult nXian2NiuWhat
         * @property {number} nXian3NiuWhat NiuNiuResult nXian3NiuWhat
         * @property {Array.<number>|null} [arrResult] NiuNiuResult arrResult
         */

        /**
         * Constructs a new NiuNiuResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a NiuNiuResult.
         * @implements INiuNiuResult
         * @constructor
         * @param {BrLiveGameDetailRsp.INiuNiuResult=} [properties] Properties to set
         */
        function NiuNiuResult(properties) {
            this.arrCardsOfZhuang = [];
            this.arrCardsOfXian1 = [];
            this.arrCardsOfXian2 = [];
            this.arrCardsOfXian3 = [];
            this.arrResult = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NiuNiuResult arrCardsOfZhuang.
         * @member {Array.<number>} arrCardsOfZhuang
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.arrCardsOfZhuang = $util.emptyArray;

        /**
         * NiuNiuResult arrCardsOfXian1.
         * @member {Array.<number>} arrCardsOfXian1
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.arrCardsOfXian1 = $util.emptyArray;

        /**
         * NiuNiuResult arrCardsOfXian2.
         * @member {Array.<number>} arrCardsOfXian2
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.arrCardsOfXian2 = $util.emptyArray;

        /**
         * NiuNiuResult arrCardsOfXian3.
         * @member {Array.<number>} arrCardsOfXian3
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.arrCardsOfXian3 = $util.emptyArray;

        /**
         * NiuNiuResult nZhuangNiuWhat.
         * @member {number} nZhuangNiuWhat
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.nZhuangNiuWhat = 0;

        /**
         * NiuNiuResult nXian1NiuWhat.
         * @member {number} nXian1NiuWhat
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.nXian1NiuWhat = 0;

        /**
         * NiuNiuResult nXian2NiuWhat.
         * @member {number} nXian2NiuWhat
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.nXian2NiuWhat = 0;

        /**
         * NiuNiuResult nXian3NiuWhat.
         * @member {number} nXian3NiuWhat
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.nXian3NiuWhat = 0;

        /**
         * NiuNiuResult arrResult.
         * @member {Array.<number>} arrResult
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         */
        NiuNiuResult.prototype.arrResult = $util.emptyArray;

        /**
         * Creates a new NiuNiuResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {BrLiveGameDetailRsp.INiuNiuResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.NiuNiuResult} NiuNiuResult instance
         */
        NiuNiuResult.create = function create(properties) {
            return new NiuNiuResult(properties);
        };

        /**
         * Encodes the specified NiuNiuResult message. Does not implicitly {@link BrLiveGameDetailRsp.NiuNiuResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {BrLiveGameDetailRsp.INiuNiuResult} message NiuNiuResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NiuNiuResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCardsOfZhuang != null && message.arrCardsOfZhuang.length)
                for (var i = 0; i < message.arrCardsOfZhuang.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCardsOfZhuang[i]);
            if (message.arrCardsOfXian1 != null && message.arrCardsOfXian1.length)
                for (var i = 0; i < message.arrCardsOfXian1.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.arrCardsOfXian1[i]);
            if (message.arrCardsOfXian2 != null && message.arrCardsOfXian2.length)
                for (var i = 0; i < message.arrCardsOfXian2.length; ++i)
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.arrCardsOfXian2[i]);
            if (message.arrCardsOfXian3 != null && message.arrCardsOfXian3.length)
                for (var i = 0; i < message.arrCardsOfXian3.length; ++i)
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.arrCardsOfXian3[i]);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nZhuangNiuWhat);
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.nXian1NiuWhat);
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.nXian2NiuWhat);
            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.nXian3NiuWhat);
            if (message.arrResult != null && message.arrResult.length)
                for (var i = 0; i < message.arrResult.length; ++i)
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.arrResult[i]);
            return writer;
        };

        /**
         * Encodes the specified NiuNiuResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.NiuNiuResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {BrLiveGameDetailRsp.INiuNiuResult} message NiuNiuResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NiuNiuResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NiuNiuResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.NiuNiuResult} NiuNiuResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NiuNiuResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.NiuNiuResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCardsOfZhuang && message.arrCardsOfZhuang.length))
                        message.arrCardsOfZhuang = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfZhuang.push(reader.int32());
                    } else
                        message.arrCardsOfZhuang.push(reader.int32());
                    break;
                case 2:
                    if (!(message.arrCardsOfXian1 && message.arrCardsOfXian1.length))
                        message.arrCardsOfXian1 = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfXian1.push(reader.int32());
                    } else
                        message.arrCardsOfXian1.push(reader.int32());
                    break;
                case 3:
                    if (!(message.arrCardsOfXian2 && message.arrCardsOfXian2.length))
                        message.arrCardsOfXian2 = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfXian2.push(reader.int32());
                    } else
                        message.arrCardsOfXian2.push(reader.int32());
                    break;
                case 4:
                    if (!(message.arrCardsOfXian3 && message.arrCardsOfXian3.length))
                        message.arrCardsOfXian3 = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCardsOfXian3.push(reader.int32());
                    } else
                        message.arrCardsOfXian3.push(reader.int32());
                    break;
                case 5:
                    message.nZhuangNiuWhat = reader.int32();
                    break;
                case 6:
                    message.nXian1NiuWhat = reader.int32();
                    break;
                case 7:
                    message.nXian2NiuWhat = reader.int32();
                    break;
                case 8:
                    message.nXian3NiuWhat = reader.int32();
                    break;
                case 9:
                    if (!(message.arrResult && message.arrResult.length))
                        message.arrResult = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrResult.push(reader.int32());
                    } else
                        message.arrResult.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("nZhuangNiuWhat"))
                throw $util.ProtocolError("missing required 'nZhuangNiuWhat'", { instance: message });
            if (!message.hasOwnProperty("nXian1NiuWhat"))
                throw $util.ProtocolError("missing required 'nXian1NiuWhat'", { instance: message });
            if (!message.hasOwnProperty("nXian2NiuWhat"))
                throw $util.ProtocolError("missing required 'nXian2NiuWhat'", { instance: message });
            if (!message.hasOwnProperty("nXian3NiuWhat"))
                throw $util.ProtocolError("missing required 'nXian3NiuWhat'", { instance: message });
            return message;
        };

        /**
         * Decodes a NiuNiuResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.NiuNiuResult} NiuNiuResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NiuNiuResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NiuNiuResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NiuNiuResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCardsOfZhuang != null && message.hasOwnProperty("arrCardsOfZhuang")) {
                if (!Array.isArray(message.arrCardsOfZhuang))
                    return "arrCardsOfZhuang: array expected";
                for (var i = 0; i < message.arrCardsOfZhuang.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfZhuang[i]))
                        return "arrCardsOfZhuang: integer[] expected";
            }
            if (message.arrCardsOfXian1 != null && message.hasOwnProperty("arrCardsOfXian1")) {
                if (!Array.isArray(message.arrCardsOfXian1))
                    return "arrCardsOfXian1: array expected";
                for (var i = 0; i < message.arrCardsOfXian1.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfXian1[i]))
                        return "arrCardsOfXian1: integer[] expected";
            }
            if (message.arrCardsOfXian2 != null && message.hasOwnProperty("arrCardsOfXian2")) {
                if (!Array.isArray(message.arrCardsOfXian2))
                    return "arrCardsOfXian2: array expected";
                for (var i = 0; i < message.arrCardsOfXian2.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfXian2[i]))
                        return "arrCardsOfXian2: integer[] expected";
            }
            if (message.arrCardsOfXian3 != null && message.hasOwnProperty("arrCardsOfXian3")) {
                if (!Array.isArray(message.arrCardsOfXian3))
                    return "arrCardsOfXian3: array expected";
                for (var i = 0; i < message.arrCardsOfXian3.length; ++i)
                    if (!$util.isInteger(message.arrCardsOfXian3[i]))
                        return "arrCardsOfXian3: integer[] expected";
            }
            if (!$util.isInteger(message.nZhuangNiuWhat))
                return "nZhuangNiuWhat: integer expected";
            if (!$util.isInteger(message.nXian1NiuWhat))
                return "nXian1NiuWhat: integer expected";
            if (!$util.isInteger(message.nXian2NiuWhat))
                return "nXian2NiuWhat: integer expected";
            if (!$util.isInteger(message.nXian3NiuWhat))
                return "nXian3NiuWhat: integer expected";
            if (message.arrResult != null && message.hasOwnProperty("arrResult")) {
                if (!Array.isArray(message.arrResult))
                    return "arrResult: array expected";
                for (var i = 0; i < message.arrResult.length; ++i)
                    if (!$util.isInteger(message.arrResult[i]))
                        return "arrResult: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a NiuNiuResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.NiuNiuResult} NiuNiuResult
         */
        NiuNiuResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.NiuNiuResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.NiuNiuResult();
            if (object.arrCardsOfZhuang) {
                if (!Array.isArray(object.arrCardsOfZhuang))
                    throw TypeError(".BrLiveGameDetailRsp.NiuNiuResult.arrCardsOfZhuang: array expected");
                message.arrCardsOfZhuang = [];
                for (var i = 0; i < object.arrCardsOfZhuang.length; ++i)
                    message.arrCardsOfZhuang[i] = object.arrCardsOfZhuang[i] | 0;
            }
            if (object.arrCardsOfXian1) {
                if (!Array.isArray(object.arrCardsOfXian1))
                    throw TypeError(".BrLiveGameDetailRsp.NiuNiuResult.arrCardsOfXian1: array expected");
                message.arrCardsOfXian1 = [];
                for (var i = 0; i < object.arrCardsOfXian1.length; ++i)
                    message.arrCardsOfXian1[i] = object.arrCardsOfXian1[i] | 0;
            }
            if (object.arrCardsOfXian2) {
                if (!Array.isArray(object.arrCardsOfXian2))
                    throw TypeError(".BrLiveGameDetailRsp.NiuNiuResult.arrCardsOfXian2: array expected");
                message.arrCardsOfXian2 = [];
                for (var i = 0; i < object.arrCardsOfXian2.length; ++i)
                    message.arrCardsOfXian2[i] = object.arrCardsOfXian2[i] | 0;
            }
            if (object.arrCardsOfXian3) {
                if (!Array.isArray(object.arrCardsOfXian3))
                    throw TypeError(".BrLiveGameDetailRsp.NiuNiuResult.arrCardsOfXian3: array expected");
                message.arrCardsOfXian3 = [];
                for (var i = 0; i < object.arrCardsOfXian3.length; ++i)
                    message.arrCardsOfXian3[i] = object.arrCardsOfXian3[i] | 0;
            }
            if (object.nZhuangNiuWhat != null)
                message.nZhuangNiuWhat = object.nZhuangNiuWhat | 0;
            if (object.nXian1NiuWhat != null)
                message.nXian1NiuWhat = object.nXian1NiuWhat | 0;
            if (object.nXian2NiuWhat != null)
                message.nXian2NiuWhat = object.nXian2NiuWhat | 0;
            if (object.nXian3NiuWhat != null)
                message.nXian3NiuWhat = object.nXian3NiuWhat | 0;
            if (object.arrResult) {
                if (!Array.isArray(object.arrResult))
                    throw TypeError(".BrLiveGameDetailRsp.NiuNiuResult.arrResult: array expected");
                message.arrResult = [];
                for (var i = 0; i < object.arrResult.length; ++i)
                    message.arrResult[i] = object.arrResult[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a NiuNiuResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @static
         * @param {BrLiveGameDetailRsp.NiuNiuResult} message NiuNiuResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NiuNiuResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.arrCardsOfZhuang = [];
                object.arrCardsOfXian1 = [];
                object.arrCardsOfXian2 = [];
                object.arrCardsOfXian3 = [];
                object.arrResult = [];
            }
            if (options.defaults) {
                object.nZhuangNiuWhat = 0;
                object.nXian1NiuWhat = 0;
                object.nXian2NiuWhat = 0;
                object.nXian3NiuWhat = 0;
            }
            if (message.arrCardsOfZhuang && message.arrCardsOfZhuang.length) {
                object.arrCardsOfZhuang = [];
                for (var j = 0; j < message.arrCardsOfZhuang.length; ++j)
                    object.arrCardsOfZhuang[j] = message.arrCardsOfZhuang[j];
            }
            if (message.arrCardsOfXian1 && message.arrCardsOfXian1.length) {
                object.arrCardsOfXian1 = [];
                for (var j = 0; j < message.arrCardsOfXian1.length; ++j)
                    object.arrCardsOfXian1[j] = message.arrCardsOfXian1[j];
            }
            if (message.arrCardsOfXian2 && message.arrCardsOfXian2.length) {
                object.arrCardsOfXian2 = [];
                for (var j = 0; j < message.arrCardsOfXian2.length; ++j)
                    object.arrCardsOfXian2[j] = message.arrCardsOfXian2[j];
            }
            if (message.arrCardsOfXian3 && message.arrCardsOfXian3.length) {
                object.arrCardsOfXian3 = [];
                for (var j = 0; j < message.arrCardsOfXian3.length; ++j)
                    object.arrCardsOfXian3[j] = message.arrCardsOfXian3[j];
            }
            if (message.nZhuangNiuWhat != null && message.hasOwnProperty("nZhuangNiuWhat"))
                object.nZhuangNiuWhat = message.nZhuangNiuWhat;
            if (message.nXian1NiuWhat != null && message.hasOwnProperty("nXian1NiuWhat"))
                object.nXian1NiuWhat = message.nXian1NiuWhat;
            if (message.nXian2NiuWhat != null && message.hasOwnProperty("nXian2NiuWhat"))
                object.nXian2NiuWhat = message.nXian2NiuWhat;
            if (message.nXian3NiuWhat != null && message.hasOwnProperty("nXian3NiuWhat"))
                object.nXian3NiuWhat = message.nXian3NiuWhat;
            if (message.arrResult && message.arrResult.length) {
                object.arrResult = [];
                for (var j = 0; j < message.arrResult.length; ++j)
                    object.arrResult[j] = message.arrResult[j];
            }
            return object;
        };

        /**
         * Converts this NiuNiuResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.NiuNiuResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NiuNiuResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NiuNiuResult;
    })();

    BrLiveGameDetailRsp.YuXiaXieResult = (function() {

        /**
         * Properties of a YuXiaXieResult.
         * @memberof BrLiveGameDetailRsp
         * @interface IYuXiaXieResult
         * @property {Array.<number>|null} [arrCards] YuXiaXieResult arrCards
         */

        /**
         * Constructs a new YuXiaXieResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a YuXiaXieResult.
         * @implements IYuXiaXieResult
         * @constructor
         * @param {BrLiveGameDetailRsp.IYuXiaXieResult=} [properties] Properties to set
         */
        function YuXiaXieResult(properties) {
            this.arrCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * YuXiaXieResult arrCards.
         * @member {Array.<number>} arrCards
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @instance
         */
        YuXiaXieResult.prototype.arrCards = $util.emptyArray;

        /**
         * Creates a new YuXiaXieResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {BrLiveGameDetailRsp.IYuXiaXieResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.YuXiaXieResult} YuXiaXieResult instance
         */
        YuXiaXieResult.create = function create(properties) {
            return new YuXiaXieResult(properties);
        };

        /**
         * Encodes the specified YuXiaXieResult message. Does not implicitly {@link BrLiveGameDetailRsp.YuXiaXieResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {BrLiveGameDetailRsp.IYuXiaXieResult} message YuXiaXieResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        YuXiaXieResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCards != null && message.arrCards.length)
                for (var i = 0; i < message.arrCards.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCards[i]);
            return writer;
        };

        /**
         * Encodes the specified YuXiaXieResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.YuXiaXieResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {BrLiveGameDetailRsp.IYuXiaXieResult} message YuXiaXieResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        YuXiaXieResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a YuXiaXieResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.YuXiaXieResult} YuXiaXieResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        YuXiaXieResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.YuXiaXieResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCards && message.arrCards.length))
                        message.arrCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCards.push(reader.int32());
                    } else
                        message.arrCards.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a YuXiaXieResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.YuXiaXieResult} YuXiaXieResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        YuXiaXieResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a YuXiaXieResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        YuXiaXieResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCards != null && message.hasOwnProperty("arrCards")) {
                if (!Array.isArray(message.arrCards))
                    return "arrCards: array expected";
                for (var i = 0; i < message.arrCards.length; ++i)
                    if (!$util.isInteger(message.arrCards[i]))
                        return "arrCards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a YuXiaXieResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.YuXiaXieResult} YuXiaXieResult
         */
        YuXiaXieResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.YuXiaXieResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.YuXiaXieResult();
            if (object.arrCards) {
                if (!Array.isArray(object.arrCards))
                    throw TypeError(".BrLiveGameDetailRsp.YuXiaXieResult.arrCards: array expected");
                message.arrCards = [];
                for (var i = 0; i < object.arrCards.length; ++i)
                    message.arrCards[i] = object.arrCards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a YuXiaXieResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @static
         * @param {BrLiveGameDetailRsp.YuXiaXieResult} message YuXiaXieResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        YuXiaXieResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.arrCards = [];
            if (message.arrCards && message.arrCards.length) {
                object.arrCards = [];
                for (var j = 0; j < message.arrCards.length; ++j)
                    object.arrCards[j] = message.arrCards[j];
            }
            return object;
        };

        /**
         * Converts this YuXiaXieResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.YuXiaXieResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        YuXiaXieResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return YuXiaXieResult;
    })();

    BrLiveGameDetailRsp.SeDieResult = (function() {

        /**
         * Properties of a SeDieResult.
         * @memberof BrLiveGameDetailRsp
         * @interface ISeDieResult
         * @property {Array.<number>|null} [arrCards] SeDieResult arrCards
         */

        /**
         * Constructs a new SeDieResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a SeDieResult.
         * @implements ISeDieResult
         * @constructor
         * @param {BrLiveGameDetailRsp.ISeDieResult=} [properties] Properties to set
         */
        function SeDieResult(properties) {
            this.arrCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SeDieResult arrCards.
         * @member {Array.<number>} arrCards
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @instance
         */
        SeDieResult.prototype.arrCards = $util.emptyArray;

        /**
         * Creates a new SeDieResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {BrLiveGameDetailRsp.ISeDieResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.SeDieResult} SeDieResult instance
         */
        SeDieResult.create = function create(properties) {
            return new SeDieResult(properties);
        };

        /**
         * Encodes the specified SeDieResult message. Does not implicitly {@link BrLiveGameDetailRsp.SeDieResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {BrLiveGameDetailRsp.ISeDieResult} message SeDieResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SeDieResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCards != null && message.arrCards.length)
                for (var i = 0; i < message.arrCards.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCards[i]);
            return writer;
        };

        /**
         * Encodes the specified SeDieResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.SeDieResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {BrLiveGameDetailRsp.ISeDieResult} message SeDieResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SeDieResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SeDieResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.SeDieResult} SeDieResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SeDieResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.SeDieResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCards && message.arrCards.length))
                        message.arrCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCards.push(reader.int32());
                    } else
                        message.arrCards.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SeDieResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.SeDieResult} SeDieResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SeDieResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SeDieResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SeDieResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCards != null && message.hasOwnProperty("arrCards")) {
                if (!Array.isArray(message.arrCards))
                    return "arrCards: array expected";
                for (var i = 0; i < message.arrCards.length; ++i)
                    if (!$util.isInteger(message.arrCards[i]))
                        return "arrCards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a SeDieResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.SeDieResult} SeDieResult
         */
        SeDieResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.SeDieResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.SeDieResult();
            if (object.arrCards) {
                if (!Array.isArray(object.arrCards))
                    throw TypeError(".BrLiveGameDetailRsp.SeDieResult.arrCards: array expected");
                message.arrCards = [];
                for (var i = 0; i < object.arrCards.length; ++i)
                    message.arrCards[i] = object.arrCards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a SeDieResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @static
         * @param {BrLiveGameDetailRsp.SeDieResult} message SeDieResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SeDieResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.arrCards = [];
            if (message.arrCards && message.arrCards.length) {
                object.arrCards = [];
                for (var j = 0; j < message.arrCards.length; ++j)
                    object.arrCards[j] = message.arrCards[j];
            }
            return object;
        };

        /**
         * Converts this SeDieResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.SeDieResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SeDieResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SeDieResult;
    })();

    BrLiveGameDetailRsp.TouBaoResult = (function() {

        /**
         * Properties of a TouBaoResult.
         * @memberof BrLiveGameDetailRsp
         * @interface ITouBaoResult
         * @property {Array.<number>|null} [arrCards] TouBaoResult arrCards
         */

        /**
         * Constructs a new TouBaoResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a TouBaoResult.
         * @implements ITouBaoResult
         * @constructor
         * @param {BrLiveGameDetailRsp.ITouBaoResult=} [properties] Properties to set
         */
        function TouBaoResult(properties) {
            this.arrCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TouBaoResult arrCards.
         * @member {Array.<number>} arrCards
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @instance
         */
        TouBaoResult.prototype.arrCards = $util.emptyArray;

        /**
         * Creates a new TouBaoResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {BrLiveGameDetailRsp.ITouBaoResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.TouBaoResult} TouBaoResult instance
         */
        TouBaoResult.create = function create(properties) {
            return new TouBaoResult(properties);
        };

        /**
         * Encodes the specified TouBaoResult message. Does not implicitly {@link BrLiveGameDetailRsp.TouBaoResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {BrLiveGameDetailRsp.ITouBaoResult} message TouBaoResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TouBaoResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCards != null && message.arrCards.length)
                for (var i = 0; i < message.arrCards.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCards[i]);
            return writer;
        };

        /**
         * Encodes the specified TouBaoResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.TouBaoResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {BrLiveGameDetailRsp.ITouBaoResult} message TouBaoResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TouBaoResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TouBaoResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.TouBaoResult} TouBaoResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TouBaoResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.TouBaoResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCards && message.arrCards.length))
                        message.arrCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCards.push(reader.int32());
                    } else
                        message.arrCards.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TouBaoResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.TouBaoResult} TouBaoResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TouBaoResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TouBaoResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TouBaoResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCards != null && message.hasOwnProperty("arrCards")) {
                if (!Array.isArray(message.arrCards))
                    return "arrCards: array expected";
                for (var i = 0; i < message.arrCards.length; ++i)
                    if (!$util.isInteger(message.arrCards[i]))
                        return "arrCards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a TouBaoResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.TouBaoResult} TouBaoResult
         */
        TouBaoResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.TouBaoResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.TouBaoResult();
            if (object.arrCards) {
                if (!Array.isArray(object.arrCards))
                    throw TypeError(".BrLiveGameDetailRsp.TouBaoResult.arrCards: array expected");
                message.arrCards = [];
                for (var i = 0; i < object.arrCards.length; ++i)
                    message.arrCards[i] = object.arrCards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a TouBaoResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @static
         * @param {BrLiveGameDetailRsp.TouBaoResult} message TouBaoResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TouBaoResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.arrCards = [];
            if (message.arrCards && message.arrCards.length) {
                object.arrCards = [];
                for (var j = 0; j < message.arrCards.length; ++j)
                    object.arrCards[j] = message.arrCards[j];
            }
            return object;
        };

        /**
         * Converts this TouBaoResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.TouBaoResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TouBaoResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TouBaoResult;
    })();

    BrLiveGameDetailRsp.FootBallResult = (function() {

        /**
         * Properties of a FootBallResult.
         * @memberof BrLiveGameDetailRsp
         * @interface IFootBallResult
         * @property {Array.<number>|null} [arrCards] FootBallResult arrCards
         */

        /**
         * Constructs a new FootBallResult.
         * @memberof BrLiveGameDetailRsp
         * @classdesc Represents a FootBallResult.
         * @implements IFootBallResult
         * @constructor
         * @param {BrLiveGameDetailRsp.IFootBallResult=} [properties] Properties to set
         */
        function FootBallResult(properties) {
            this.arrCards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FootBallResult arrCards.
         * @member {Array.<number>} arrCards
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @instance
         */
        FootBallResult.prototype.arrCards = $util.emptyArray;

        /**
         * Creates a new FootBallResult instance using the specified properties.
         * @function create
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {BrLiveGameDetailRsp.IFootBallResult=} [properties] Properties to set
         * @returns {BrLiveGameDetailRsp.FootBallResult} FootBallResult instance
         */
        FootBallResult.create = function create(properties) {
            return new FootBallResult(properties);
        };

        /**
         * Encodes the specified FootBallResult message. Does not implicitly {@link BrLiveGameDetailRsp.FootBallResult.verify|verify} messages.
         * @function encode
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {BrLiveGameDetailRsp.IFootBallResult} message FootBallResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FootBallResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.arrCards != null && message.arrCards.length)
                for (var i = 0; i < message.arrCards.length; ++i)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.arrCards[i]);
            return writer;
        };

        /**
         * Encodes the specified FootBallResult message, length delimited. Does not implicitly {@link BrLiveGameDetailRsp.FootBallResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {BrLiveGameDetailRsp.IFootBallResult} message FootBallResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FootBallResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FootBallResult message from the specified reader or buffer.
         * @function decode
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BrLiveGameDetailRsp.FootBallResult} FootBallResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FootBallResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BrLiveGameDetailRsp.FootBallResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.arrCards && message.arrCards.length))
                        message.arrCards = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.arrCards.push(reader.int32());
                    } else
                        message.arrCards.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FootBallResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BrLiveGameDetailRsp.FootBallResult} FootBallResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FootBallResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FootBallResult message.
         * @function verify
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FootBallResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.arrCards != null && message.hasOwnProperty("arrCards")) {
                if (!Array.isArray(message.arrCards))
                    return "arrCards: array expected";
                for (var i = 0; i < message.arrCards.length; ++i)
                    if (!$util.isInteger(message.arrCards[i]))
                        return "arrCards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a FootBallResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BrLiveGameDetailRsp.FootBallResult} FootBallResult
         */
        FootBallResult.fromObject = function fromObject(object) {
            if (object instanceof $root.BrLiveGameDetailRsp.FootBallResult)
                return object;
            var message = new $root.BrLiveGameDetailRsp.FootBallResult();
            if (object.arrCards) {
                if (!Array.isArray(object.arrCards))
                    throw TypeError(".BrLiveGameDetailRsp.FootBallResult.arrCards: array expected");
                message.arrCards = [];
                for (var i = 0; i < object.arrCards.length; ++i)
                    message.arrCards[i] = object.arrCards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a FootBallResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @static
         * @param {BrLiveGameDetailRsp.FootBallResult} message FootBallResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FootBallResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.arrCards = [];
            if (message.arrCards && message.arrCards.length) {
                object.arrCards = [];
                for (var j = 0; j < message.arrCards.length; ++j)
                    object.arrCards[j] = message.arrCards[j];
            }
            return object;
        };

        /**
         * Converts this FootBallResult to JSON.
         * @function toJSON
         * @memberof BrLiveGameDetailRsp.FootBallResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FootBallResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FootBallResult;
    })();

    return BrLiveGameDetailRsp;
})();

$root.UserGoldLessStandardNotify = (function() {

    /**
     * Properties of a UserGoldLessStandardNotify.
     * @exports IUserGoldLessStandardNotify
     * @interface IUserGoldLessStandardNotify
     * @property {number} nUserId UserGoldLessStandardNotify nUserId
     * @property {number} nGold UserGoldLessStandardNotify nGold
     * @property {number} nItemId UserGoldLessStandardNotify nItemId
     * @property {number} nStandard UserGoldLessStandardNotify nStandard
     */

    /**
     * Constructs a new UserGoldLessStandardNotify.
     * @exports UserGoldLessStandardNotify
     * @classdesc Represents a UserGoldLessStandardNotify.
     * @implements IUserGoldLessStandardNotify
     * @constructor
     * @param {IUserGoldLessStandardNotify=} [properties] Properties to set
     */
    function UserGoldLessStandardNotify(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserGoldLessStandardNotify nUserId.
     * @member {number} nUserId
     * @memberof UserGoldLessStandardNotify
     * @instance
     */
    UserGoldLessStandardNotify.prototype.nUserId = 0;

    /**
     * UserGoldLessStandardNotify nGold.
     * @member {number} nGold
     * @memberof UserGoldLessStandardNotify
     * @instance
     */
    UserGoldLessStandardNotify.prototype.nGold = 0;

    /**
     * UserGoldLessStandardNotify nItemId.
     * @member {number} nItemId
     * @memberof UserGoldLessStandardNotify
     * @instance
     */
    UserGoldLessStandardNotify.prototype.nItemId = 0;

    /**
     * UserGoldLessStandardNotify nStandard.
     * @member {number} nStandard
     * @memberof UserGoldLessStandardNotify
     * @instance
     */
    UserGoldLessStandardNotify.prototype.nStandard = 0;

    /**
     * Creates a new UserGoldLessStandardNotify instance using the specified properties.
     * @function create
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {IUserGoldLessStandardNotify=} [properties] Properties to set
     * @returns {UserGoldLessStandardNotify} UserGoldLessStandardNotify instance
     */
    UserGoldLessStandardNotify.create = function create(properties) {
        return new UserGoldLessStandardNotify(properties);
    };

    /**
     * Encodes the specified UserGoldLessStandardNotify message. Does not implicitly {@link UserGoldLessStandardNotify.verify|verify} messages.
     * @function encode
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {IUserGoldLessStandardNotify} message UserGoldLessStandardNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserGoldLessStandardNotify.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.nGold);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nItemId);
        writer.uint32(/* id 4, wireType 1 =*/33).double(message.nStandard);
        return writer;
    };

    /**
     * Encodes the specified UserGoldLessStandardNotify message, length delimited. Does not implicitly {@link UserGoldLessStandardNotify.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {IUserGoldLessStandardNotify} message UserGoldLessStandardNotify message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserGoldLessStandardNotify.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserGoldLessStandardNotify message from the specified reader or buffer.
     * @function decode
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserGoldLessStandardNotify} UserGoldLessStandardNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserGoldLessStandardNotify.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserGoldLessStandardNotify();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
            case 2:
                message.nGold = reader.double();
                break;
            case 3:
                message.nItemId = reader.int32();
                break;
            case 4:
                message.nStandard = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("nGold"))
            throw $util.ProtocolError("missing required 'nGold'", { instance: message });
        if (!message.hasOwnProperty("nItemId"))
            throw $util.ProtocolError("missing required 'nItemId'", { instance: message });
        if (!message.hasOwnProperty("nStandard"))
            throw $util.ProtocolError("missing required 'nStandard'", { instance: message });
        return message;
    };

    /**
     * Decodes a UserGoldLessStandardNotify message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserGoldLessStandardNotify} UserGoldLessStandardNotify
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserGoldLessStandardNotify.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserGoldLessStandardNotify message.
     * @function verify
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserGoldLessStandardNotify.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (typeof message.nGold !== "number")
            return "nGold: number expected";
        if (!$util.isInteger(message.nItemId))
            return "nItemId: integer expected";
        if (typeof message.nStandard !== "number")
            return "nStandard: number expected";
        return null;
    };

    /**
     * Creates a UserGoldLessStandardNotify message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserGoldLessStandardNotify} UserGoldLessStandardNotify
     */
    UserGoldLessStandardNotify.fromObject = function fromObject(object) {
        if (object instanceof $root.UserGoldLessStandardNotify)
            return object;
        var message = new $root.UserGoldLessStandardNotify();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nGold != null)
            message.nGold = Number(object.nGold);
        if (object.nItemId != null)
            message.nItemId = object.nItemId | 0;
        if (object.nStandard != null)
            message.nStandard = Number(object.nStandard);
        return message;
    };

    /**
     * Creates a plain object from a UserGoldLessStandardNotify message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserGoldLessStandardNotify
     * @static
     * @param {UserGoldLessStandardNotify} message UserGoldLessStandardNotify
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserGoldLessStandardNotify.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nGold = 0;
            object.nItemId = 0;
            object.nStandard = 0;
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nGold != null && message.hasOwnProperty("nGold"))
            object.nGold = options.json && !isFinite(message.nGold) ? String(message.nGold) : message.nGold;
        if (message.nItemId != null && message.hasOwnProperty("nItemId"))
            object.nItemId = message.nItemId;
        if (message.nStandard != null && message.hasOwnProperty("nStandard"))
            object.nStandard = options.json && !isFinite(message.nStandard) ? String(message.nStandard) : message.nStandard;
        return object;
    };

    /**
     * Converts this UserGoldLessStandardNotify to JSON.
     * @function toJSON
     * @memberof UserGoldLessStandardNotify
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserGoldLessStandardNotify.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserGoldLessStandardNotify;
})();

$root.BlockChianListInfoReq = (function() {

    /**
     * Properties of a BlockChianListInfoReq.
     * @exports IBlockChianListInfoReq
     * @interface IBlockChianListInfoReq
     * @property {number} nUserId BlockChianListInfoReq nUserId
     * @property {number} nGameId BlockChianListInfoReq nGameId
     * @property {number|null} [nBlockChian] BlockChianListInfoReq nBlockChian
     */

    /**
     * Constructs a new BlockChianListInfoReq.
     * @exports BlockChianListInfoReq
     * @classdesc Represents a BlockChianListInfoReq.
     * @implements IBlockChianListInfoReq
     * @constructor
     * @param {IBlockChianListInfoReq=} [properties] Properties to set
     */
    function BlockChianListInfoReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockChianListInfoReq nUserId.
     * @member {number} nUserId
     * @memberof BlockChianListInfoReq
     * @instance
     */
    BlockChianListInfoReq.prototype.nUserId = 0;

    /**
     * BlockChianListInfoReq nGameId.
     * @member {number} nGameId
     * @memberof BlockChianListInfoReq
     * @instance
     */
    BlockChianListInfoReq.prototype.nGameId = 0;

    /**
     * BlockChianListInfoReq nBlockChian.
     * @member {number} nBlockChian
     * @memberof BlockChianListInfoReq
     * @instance
     */
    BlockChianListInfoReq.prototype.nBlockChian = 1;

    /**
     * Creates a new BlockChianListInfoReq instance using the specified properties.
     * @function create
     * @memberof BlockChianListInfoReq
     * @static
     * @param {IBlockChianListInfoReq=} [properties] Properties to set
     * @returns {BlockChianListInfoReq} BlockChianListInfoReq instance
     */
    BlockChianListInfoReq.create = function create(properties) {
        return new BlockChianListInfoReq(properties);
    };

    /**
     * Encodes the specified BlockChianListInfoReq message. Does not implicitly {@link BlockChianListInfoReq.verify|verify} messages.
     * @function encode
     * @memberof BlockChianListInfoReq
     * @static
     * @param {IBlockChianListInfoReq} message BlockChianListInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockChianListInfoReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nGameId);
        if (message.nBlockChian != null && Object.hasOwnProperty.call(message, "nBlockChian"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nBlockChian);
        return writer;
    };

    /**
     * Encodes the specified BlockChianListInfoReq message, length delimited. Does not implicitly {@link BlockChianListInfoReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockChianListInfoReq
     * @static
     * @param {IBlockChianListInfoReq} message BlockChianListInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockChianListInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockChianListInfoReq message from the specified reader or buffer.
     * @function decode
     * @memberof BlockChianListInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockChianListInfoReq} BlockChianListInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockChianListInfoReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockChianListInfoReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
            case 2:
                message.nGameId = reader.int32();
                break;
            case 3:
                message.nBlockChian = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("nGameId"))
            throw $util.ProtocolError("missing required 'nGameId'", { instance: message });
        return message;
    };

    /**
     * Decodes a BlockChianListInfoReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockChianListInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockChianListInfoReq} BlockChianListInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockChianListInfoReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockChianListInfoReq message.
     * @function verify
     * @memberof BlockChianListInfoReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockChianListInfoReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (!$util.isInteger(message.nGameId))
            return "nGameId: integer expected";
        if (message.nBlockChian != null && message.hasOwnProperty("nBlockChian"))
            if (!$util.isInteger(message.nBlockChian))
                return "nBlockChian: integer expected";
        return null;
    };

    /**
     * Creates a BlockChianListInfoReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockChianListInfoReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockChianListInfoReq} BlockChianListInfoReq
     */
    BlockChianListInfoReq.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockChianListInfoReq)
            return object;
        var message = new $root.BlockChianListInfoReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.nGameId != null)
            message.nGameId = object.nGameId | 0;
        if (object.nBlockChian != null)
            message.nBlockChian = object.nBlockChian | 0;
        return message;
    };

    /**
     * Creates a plain object from a BlockChianListInfoReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockChianListInfoReq
     * @static
     * @param {BlockChianListInfoReq} message BlockChianListInfoReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockChianListInfoReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.nGameId = 0;
            object.nBlockChian = 1;
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.nGameId != null && message.hasOwnProperty("nGameId"))
            object.nGameId = message.nGameId;
        if (message.nBlockChian != null && message.hasOwnProperty("nBlockChian"))
            object.nBlockChian = message.nBlockChian;
        return object;
    };

    /**
     * Converts this BlockChianListInfoReq to JSON.
     * @function toJSON
     * @memberof BlockChianListInfoReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockChianListInfoReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockChianListInfoReq;
})();

$root.BlockChianListInfoRep = (function() {

    /**
     * Properties of a BlockChianListInfoRep.
     * @exports IBlockChianListInfoRep
     * @interface IBlockChianListInfoRep
     * @property {number} nPeople BlockChianListInfoRep nPeople
     * @property {number} nTableSum BlockChianListInfoRep nTableSum
     * @property {string} sTableId BlockChianListInfoRep sTableId
     */

    /**
     * Constructs a new BlockChianListInfoRep.
     * @exports BlockChianListInfoRep
     * @classdesc Represents a BlockChianListInfoRep.
     * @implements IBlockChianListInfoRep
     * @constructor
     * @param {IBlockChianListInfoRep=} [properties] Properties to set
     */
    function BlockChianListInfoRep(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockChianListInfoRep nPeople.
     * @member {number} nPeople
     * @memberof BlockChianListInfoRep
     * @instance
     */
    BlockChianListInfoRep.prototype.nPeople = 0;

    /**
     * BlockChianListInfoRep nTableSum.
     * @member {number} nTableSum
     * @memberof BlockChianListInfoRep
     * @instance
     */
    BlockChianListInfoRep.prototype.nTableSum = 0;

    /**
     * BlockChianListInfoRep sTableId.
     * @member {string} sTableId
     * @memberof BlockChianListInfoRep
     * @instance
     */
    BlockChianListInfoRep.prototype.sTableId = "";

    /**
     * Creates a new BlockChianListInfoRep instance using the specified properties.
     * @function create
     * @memberof BlockChianListInfoRep
     * @static
     * @param {IBlockChianListInfoRep=} [properties] Properties to set
     * @returns {BlockChianListInfoRep} BlockChianListInfoRep instance
     */
    BlockChianListInfoRep.create = function create(properties) {
        return new BlockChianListInfoRep(properties);
    };

    /**
     * Encodes the specified BlockChianListInfoRep message. Does not implicitly {@link BlockChianListInfoRep.verify|verify} messages.
     * @function encode
     * @memberof BlockChianListInfoRep
     * @static
     * @param {IBlockChianListInfoRep} message BlockChianListInfoRep message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockChianListInfoRep.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nPeople);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nTableSum);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sTableId);
        return writer;
    };

    /**
     * Encodes the specified BlockChianListInfoRep message, length delimited. Does not implicitly {@link BlockChianListInfoRep.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockChianListInfoRep
     * @static
     * @param {IBlockChianListInfoRep} message BlockChianListInfoRep message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockChianListInfoRep.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockChianListInfoRep message from the specified reader or buffer.
     * @function decode
     * @memberof BlockChianListInfoRep
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockChianListInfoRep} BlockChianListInfoRep
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockChianListInfoRep.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockChianListInfoRep();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nPeople = reader.int32();
                break;
            case 2:
                message.nTableSum = reader.int32();
                break;
            case 3:
                message.sTableId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nPeople"))
            throw $util.ProtocolError("missing required 'nPeople'", { instance: message });
        if (!message.hasOwnProperty("nTableSum"))
            throw $util.ProtocolError("missing required 'nTableSum'", { instance: message });
        if (!message.hasOwnProperty("sTableId"))
            throw $util.ProtocolError("missing required 'sTableId'", { instance: message });
        return message;
    };

    /**
     * Decodes a BlockChianListInfoRep message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockChianListInfoRep
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockChianListInfoRep} BlockChianListInfoRep
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockChianListInfoRep.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockChianListInfoRep message.
     * @function verify
     * @memberof BlockChianListInfoRep
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockChianListInfoRep.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nPeople))
            return "nPeople: integer expected";
        if (!$util.isInteger(message.nTableSum))
            return "nTableSum: integer expected";
        if (!$util.isString(message.sTableId))
            return "sTableId: string expected";
        return null;
    };

    /**
     * Creates a BlockChianListInfoRep message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockChianListInfoRep
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockChianListInfoRep} BlockChianListInfoRep
     */
    BlockChianListInfoRep.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockChianListInfoRep)
            return object;
        var message = new $root.BlockChianListInfoRep();
        if (object.nPeople != null)
            message.nPeople = object.nPeople | 0;
        if (object.nTableSum != null)
            message.nTableSum = object.nTableSum | 0;
        if (object.sTableId != null)
            message.sTableId = String(object.sTableId);
        return message;
    };

    /**
     * Creates a plain object from a BlockChianListInfoRep message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockChianListInfoRep
     * @static
     * @param {BlockChianListInfoRep} message BlockChianListInfoRep
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockChianListInfoRep.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nPeople = 0;
            object.nTableSum = 0;
            object.sTableId = "";
        }
        if (message.nPeople != null && message.hasOwnProperty("nPeople"))
            object.nPeople = message.nPeople;
        if (message.nTableSum != null && message.hasOwnProperty("nTableSum"))
            object.nTableSum = message.nTableSum;
        if (message.sTableId != null && message.hasOwnProperty("sTableId"))
            object.sTableId = message.sTableId;
        return object;
    };

    /**
     * Converts this BlockChianListInfoRep to JSON.
     * @function toJSON
     * @memberof BlockChianListInfoRep
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockChianListInfoRep.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockChianListInfoRep;
})();

$root.AccountCloseReq = (function() {

    /**
     * Properties of an AccountCloseReq.
     * @exports IAccountCloseReq
     * @interface IAccountCloseReq
     * @property {string} sAccounts AccountCloseReq sAccounts
     * @property {string} sPassword AccountCloseReq sPassword
     */

    /**
     * Constructs a new AccountCloseReq.
     * @exports AccountCloseReq
     * @classdesc Represents an AccountCloseReq.
     * @implements IAccountCloseReq
     * @constructor
     * @param {IAccountCloseReq=} [properties] Properties to set
     */
    function AccountCloseReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountCloseReq sAccounts.
     * @member {string} sAccounts
     * @memberof AccountCloseReq
     * @instance
     */
    AccountCloseReq.prototype.sAccounts = "";

    /**
     * AccountCloseReq sPassword.
     * @member {string} sPassword
     * @memberof AccountCloseReq
     * @instance
     */
    AccountCloseReq.prototype.sPassword = "";

    /**
     * Creates a new AccountCloseReq instance using the specified properties.
     * @function create
     * @memberof AccountCloseReq
     * @static
     * @param {IAccountCloseReq=} [properties] Properties to set
     * @returns {AccountCloseReq} AccountCloseReq instance
     */
    AccountCloseReq.create = function create(properties) {
        return new AccountCloseReq(properties);
    };

    /**
     * Encodes the specified AccountCloseReq message. Does not implicitly {@link AccountCloseReq.verify|verify} messages.
     * @function encode
     * @memberof AccountCloseReq
     * @static
     * @param {IAccountCloseReq} message AccountCloseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountCloseReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.sAccounts);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sPassword);
        return writer;
    };

    /**
     * Encodes the specified AccountCloseReq message, length delimited. Does not implicitly {@link AccountCloseReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountCloseReq
     * @static
     * @param {IAccountCloseReq} message AccountCloseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountCloseReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountCloseReq message from the specified reader or buffer.
     * @function decode
     * @memberof AccountCloseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountCloseReq} AccountCloseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountCloseReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountCloseReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sAccounts = reader.string();
                break;
            case 2:
                message.sPassword = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("sAccounts"))
            throw $util.ProtocolError("missing required 'sAccounts'", { instance: message });
        if (!message.hasOwnProperty("sPassword"))
            throw $util.ProtocolError("missing required 'sPassword'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountCloseReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountCloseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountCloseReq} AccountCloseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountCloseReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountCloseReq message.
     * @function verify
     * @memberof AccountCloseReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountCloseReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.sAccounts))
            return "sAccounts: string expected";
        if (!$util.isString(message.sPassword))
            return "sPassword: string expected";
        return null;
    };

    /**
     * Creates an AccountCloseReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountCloseReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountCloseReq} AccountCloseReq
     */
    AccountCloseReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountCloseReq)
            return object;
        var message = new $root.AccountCloseReq();
        if (object.sAccounts != null)
            message.sAccounts = String(object.sAccounts);
        if (object.sPassword != null)
            message.sPassword = String(object.sPassword);
        return message;
    };

    /**
     * Creates a plain object from an AccountCloseReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountCloseReq
     * @static
     * @param {AccountCloseReq} message AccountCloseReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountCloseReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.sAccounts = "";
            object.sPassword = "";
        }
        if (message.sAccounts != null && message.hasOwnProperty("sAccounts"))
            object.sAccounts = message.sAccounts;
        if (message.sPassword != null && message.hasOwnProperty("sPassword"))
            object.sPassword = message.sPassword;
        return object;
    };

    /**
     * Converts this AccountCloseReq to JSON.
     * @function toJSON
     * @memberof AccountCloseReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountCloseReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountCloseReq;
})();

$root.AccountCloseRsp = (function() {

    /**
     * Properties of an AccountCloseRsp.
     * @exports IAccountCloseRsp
     * @interface IAccountCloseRsp
     * @property {number} nCode AccountCloseRsp nCode
     * @property {string|null} [sErrStr] AccountCloseRsp sErrStr
     */

    /**
     * Constructs a new AccountCloseRsp.
     * @exports AccountCloseRsp
     * @classdesc Represents an AccountCloseRsp.
     * @implements IAccountCloseRsp
     * @constructor
     * @param {IAccountCloseRsp=} [properties] Properties to set
     */
    function AccountCloseRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountCloseRsp nCode.
     * @member {number} nCode
     * @memberof AccountCloseRsp
     * @instance
     */
    AccountCloseRsp.prototype.nCode = 0;

    /**
     * AccountCloseRsp sErrStr.
     * @member {string} sErrStr
     * @memberof AccountCloseRsp
     * @instance
     */
    AccountCloseRsp.prototype.sErrStr = "";

    /**
     * Creates a new AccountCloseRsp instance using the specified properties.
     * @function create
     * @memberof AccountCloseRsp
     * @static
     * @param {IAccountCloseRsp=} [properties] Properties to set
     * @returns {AccountCloseRsp} AccountCloseRsp instance
     */
    AccountCloseRsp.create = function create(properties) {
        return new AccountCloseRsp(properties);
    };

    /**
     * Encodes the specified AccountCloseRsp message. Does not implicitly {@link AccountCloseRsp.verify|verify} messages.
     * @function encode
     * @memberof AccountCloseRsp
     * @static
     * @param {IAccountCloseRsp} message AccountCloseRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountCloseRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nCode);
        if (message.sErrStr != null && Object.hasOwnProperty.call(message, "sErrStr"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sErrStr);
        return writer;
    };

    /**
     * Encodes the specified AccountCloseRsp message, length delimited. Does not implicitly {@link AccountCloseRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountCloseRsp
     * @static
     * @param {IAccountCloseRsp} message AccountCloseRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountCloseRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountCloseRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AccountCloseRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountCloseRsp} AccountCloseRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountCloseRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountCloseRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nCode = reader.int32();
                break;
            case 2:
                message.sErrStr = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nCode"))
            throw $util.ProtocolError("missing required 'nCode'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountCloseRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountCloseRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountCloseRsp} AccountCloseRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountCloseRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountCloseRsp message.
     * @function verify
     * @memberof AccountCloseRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountCloseRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nCode))
            return "nCode: integer expected";
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            if (!$util.isString(message.sErrStr))
                return "sErrStr: string expected";
        return null;
    };

    /**
     * Creates an AccountCloseRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountCloseRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountCloseRsp} AccountCloseRsp
     */
    AccountCloseRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountCloseRsp)
            return object;
        var message = new $root.AccountCloseRsp();
        if (object.nCode != null)
            message.nCode = object.nCode | 0;
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        return message;
    };

    /**
     * Creates a plain object from an AccountCloseRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountCloseRsp
     * @static
     * @param {AccountCloseRsp} message AccountCloseRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountCloseRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nCode = 0;
            object.sErrStr = "";
        }
        if (message.nCode != null && message.hasOwnProperty("nCode"))
            object.nCode = message.nCode;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        return object;
    };

    /**
     * Converts this AccountCloseRsp to JSON.
     * @function toJSON
     * @memberof AccountCloseRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountCloseRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountCloseRsp;
})();

$root.AccountPayURLReq = (function() {

    /**
     * Properties of an AccountPayURLReq.
     * @exports IAccountPayURLReq
     * @interface IAccountPayURLReq
     * @property {number} nUserId AccountPayURLReq nUserId
     * @property {string|null} [strDefault] AccountPayURLReq strDefault
     */

    /**
     * Constructs a new AccountPayURLReq.
     * @exports AccountPayURLReq
     * @classdesc Represents an AccountPayURLReq.
     * @implements IAccountPayURLReq
     * @constructor
     * @param {IAccountPayURLReq=} [properties] Properties to set
     */
    function AccountPayURLReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountPayURLReq nUserId.
     * @member {number} nUserId
     * @memberof AccountPayURLReq
     * @instance
     */
    AccountPayURLReq.prototype.nUserId = 0;

    /**
     * AccountPayURLReq strDefault.
     * @member {string} strDefault
     * @memberof AccountPayURLReq
     * @instance
     */
    AccountPayURLReq.prototype.strDefault = "";

    /**
     * Creates a new AccountPayURLReq instance using the specified properties.
     * @function create
     * @memberof AccountPayURLReq
     * @static
     * @param {IAccountPayURLReq=} [properties] Properties to set
     * @returns {AccountPayURLReq} AccountPayURLReq instance
     */
    AccountPayURLReq.create = function create(properties) {
        return new AccountPayURLReq(properties);
    };

    /**
     * Encodes the specified AccountPayURLReq message. Does not implicitly {@link AccountPayURLReq.verify|verify} messages.
     * @function encode
     * @memberof AccountPayURLReq
     * @static
     * @param {IAccountPayURLReq} message AccountPayURLReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayURLReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        if (message.strDefault != null && Object.hasOwnProperty.call(message, "strDefault"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.strDefault);
        return writer;
    };

    /**
     * Encodes the specified AccountPayURLReq message, length delimited. Does not implicitly {@link AccountPayURLReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountPayURLReq
     * @static
     * @param {IAccountPayURLReq} message AccountPayURLReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayURLReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountPayURLReq message from the specified reader or buffer.
     * @function decode
     * @memberof AccountPayURLReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountPayURLReq} AccountPayURLReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayURLReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountPayURLReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
            case 2:
                message.strDefault = reader.string();
                break;
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
     * Decodes an AccountPayURLReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountPayURLReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountPayURLReq} AccountPayURLReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayURLReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountPayURLReq message.
     * @function verify
     * @memberof AccountPayURLReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountPayURLReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (message.strDefault != null && message.hasOwnProperty("strDefault"))
            if (!$util.isString(message.strDefault))
                return "strDefault: string expected";
        return null;
    };

    /**
     * Creates an AccountPayURLReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountPayURLReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountPayURLReq} AccountPayURLReq
     */
    AccountPayURLReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountPayURLReq)
            return object;
        var message = new $root.AccountPayURLReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.strDefault != null)
            message.strDefault = String(object.strDefault);
        return message;
    };

    /**
     * Creates a plain object from an AccountPayURLReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountPayURLReq
     * @static
     * @param {AccountPayURLReq} message AccountPayURLReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountPayURLReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.strDefault = "";
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.strDefault != null && message.hasOwnProperty("strDefault"))
            object.strDefault = message.strDefault;
        return object;
    };

    /**
     * Converts this AccountPayURLReq to JSON.
     * @function toJSON
     * @memberof AccountPayURLReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountPayURLReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountPayURLReq;
})();

$root.AccountPayURLRsp = (function() {

    /**
     * Properties of an AccountPayURLRsp.
     * @exports IAccountPayURLRsp
     * @interface IAccountPayURLRsp
     * @property {number} nCode AccountPayURLRsp nCode
     * @property {string} strPayURL AccountPayURLRsp strPayURL
     * @property {Array.<AccountPayURLRsp.IOneAddressInfo>|null} [arrAddressList] AccountPayURLRsp arrAddressList
     */

    /**
     * Constructs a new AccountPayURLRsp.
     * @exports AccountPayURLRsp
     * @classdesc Represents an AccountPayURLRsp.
     * @implements IAccountPayURLRsp
     * @constructor
     * @param {IAccountPayURLRsp=} [properties] Properties to set
     */
    function AccountPayURLRsp(properties) {
        this.arrAddressList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountPayURLRsp nCode.
     * @member {number} nCode
     * @memberof AccountPayURLRsp
     * @instance
     */
    AccountPayURLRsp.prototype.nCode = 0;

    /**
     * AccountPayURLRsp strPayURL.
     * @member {string} strPayURL
     * @memberof AccountPayURLRsp
     * @instance
     */
    AccountPayURLRsp.prototype.strPayURL = "";

    /**
     * AccountPayURLRsp arrAddressList.
     * @member {Array.<AccountPayURLRsp.IOneAddressInfo>} arrAddressList
     * @memberof AccountPayURLRsp
     * @instance
     */
    AccountPayURLRsp.prototype.arrAddressList = $util.emptyArray;

    /**
     * Creates a new AccountPayURLRsp instance using the specified properties.
     * @function create
     * @memberof AccountPayURLRsp
     * @static
     * @param {IAccountPayURLRsp=} [properties] Properties to set
     * @returns {AccountPayURLRsp} AccountPayURLRsp instance
     */
    AccountPayURLRsp.create = function create(properties) {
        return new AccountPayURLRsp(properties);
    };

    /**
     * Encodes the specified AccountPayURLRsp message. Does not implicitly {@link AccountPayURLRsp.verify|verify} messages.
     * @function encode
     * @memberof AccountPayURLRsp
     * @static
     * @param {IAccountPayURLRsp} message AccountPayURLRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayURLRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nCode);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.strPayURL);
        if (message.arrAddressList != null && message.arrAddressList.length)
            for (var i = 0; i < message.arrAddressList.length; ++i)
                $root.AccountPayURLRsp.OneAddressInfo.encode(message.arrAddressList[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified AccountPayURLRsp message, length delimited. Does not implicitly {@link AccountPayURLRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountPayURLRsp
     * @static
     * @param {IAccountPayURLRsp} message AccountPayURLRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayURLRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountPayURLRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AccountPayURLRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountPayURLRsp} AccountPayURLRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayURLRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountPayURLRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nCode = reader.int32();
                break;
            case 2:
                message.strPayURL = reader.string();
                break;
            case 3:
                if (!(message.arrAddressList && message.arrAddressList.length))
                    message.arrAddressList = [];
                message.arrAddressList.push($root.AccountPayURLRsp.OneAddressInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nCode"))
            throw $util.ProtocolError("missing required 'nCode'", { instance: message });
        if (!message.hasOwnProperty("strPayURL"))
            throw $util.ProtocolError("missing required 'strPayURL'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountPayURLRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountPayURLRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountPayURLRsp} AccountPayURLRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayURLRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountPayURLRsp message.
     * @function verify
     * @memberof AccountPayURLRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountPayURLRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nCode))
            return "nCode: integer expected";
        if (!$util.isString(message.strPayURL))
            return "strPayURL: string expected";
        if (message.arrAddressList != null && message.hasOwnProperty("arrAddressList")) {
            if (!Array.isArray(message.arrAddressList))
                return "arrAddressList: array expected";
            for (var i = 0; i < message.arrAddressList.length; ++i) {
                var error = $root.AccountPayURLRsp.OneAddressInfo.verify(message.arrAddressList[i]);
                if (error)
                    return "arrAddressList." + error;
            }
        }
        return null;
    };

    /**
     * Creates an AccountPayURLRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountPayURLRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountPayURLRsp} AccountPayURLRsp
     */
    AccountPayURLRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountPayURLRsp)
            return object;
        var message = new $root.AccountPayURLRsp();
        if (object.nCode != null)
            message.nCode = object.nCode | 0;
        if (object.strPayURL != null)
            message.strPayURL = String(object.strPayURL);
        if (object.arrAddressList) {
            if (!Array.isArray(object.arrAddressList))
                throw TypeError(".AccountPayURLRsp.arrAddressList: array expected");
            message.arrAddressList = [];
            for (var i = 0; i < object.arrAddressList.length; ++i) {
                if (typeof object.arrAddressList[i] !== "object")
                    throw TypeError(".AccountPayURLRsp.arrAddressList: object expected");
                message.arrAddressList[i] = $root.AccountPayURLRsp.OneAddressInfo.fromObject(object.arrAddressList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an AccountPayURLRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountPayURLRsp
     * @static
     * @param {AccountPayURLRsp} message AccountPayURLRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountPayURLRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrAddressList = [];
        if (options.defaults) {
            object.nCode = 0;
            object.strPayURL = "";
        }
        if (message.nCode != null && message.hasOwnProperty("nCode"))
            object.nCode = message.nCode;
        if (message.strPayURL != null && message.hasOwnProperty("strPayURL"))
            object.strPayURL = message.strPayURL;
        if (message.arrAddressList && message.arrAddressList.length) {
            object.arrAddressList = [];
            for (var j = 0; j < message.arrAddressList.length; ++j)
                object.arrAddressList[j] = $root.AccountPayURLRsp.OneAddressInfo.toObject(message.arrAddressList[j], options);
        }
        return object;
    };

    /**
     * Converts this AccountPayURLRsp to JSON.
     * @function toJSON
     * @memberof AccountPayURLRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountPayURLRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    AccountPayURLRsp.OneAddressInfo = (function() {

        /**
         * Properties of an OneAddressInfo.
         * @memberof AccountPayURLRsp
         * @interface IOneAddressInfo
         * @property {string} strMainNet OneAddressInfo strMainNet
         * @property {string} strContractAddres OneAddressInfo strContractAddres
         * @property {number} nMinTopup OneAddressInfo nMinTopup
         * @property {number} nInputCompileTime OneAddressInfo nInputCompileTime
         * @property {number} nOutputCompileTime OneAddressInfo nOutputCompileTime
         */

        /**
         * Constructs a new OneAddressInfo.
         * @memberof AccountPayURLRsp
         * @classdesc Represents an OneAddressInfo.
         * @implements IOneAddressInfo
         * @constructor
         * @param {AccountPayURLRsp.IOneAddressInfo=} [properties] Properties to set
         */
        function OneAddressInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneAddressInfo strMainNet.
         * @member {string} strMainNet
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         */
        OneAddressInfo.prototype.strMainNet = "";

        /**
         * OneAddressInfo strContractAddres.
         * @member {string} strContractAddres
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         */
        OneAddressInfo.prototype.strContractAddres = "";

        /**
         * OneAddressInfo nMinTopup.
         * @member {number} nMinTopup
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         */
        OneAddressInfo.prototype.nMinTopup = 0;

        /**
         * OneAddressInfo nInputCompileTime.
         * @member {number} nInputCompileTime
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         */
        OneAddressInfo.prototype.nInputCompileTime = 0;

        /**
         * OneAddressInfo nOutputCompileTime.
         * @member {number} nOutputCompileTime
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         */
        OneAddressInfo.prototype.nOutputCompileTime = 0;

        /**
         * Creates a new OneAddressInfo instance using the specified properties.
         * @function create
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {AccountPayURLRsp.IOneAddressInfo=} [properties] Properties to set
         * @returns {AccountPayURLRsp.OneAddressInfo} OneAddressInfo instance
         */
        OneAddressInfo.create = function create(properties) {
            return new OneAddressInfo(properties);
        };

        /**
         * Encodes the specified OneAddressInfo message. Does not implicitly {@link AccountPayURLRsp.OneAddressInfo.verify|verify} messages.
         * @function encode
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {AccountPayURLRsp.IOneAddressInfo} message OneAddressInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneAddressInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.strMainNet);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.strContractAddres);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nMinTopup);
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nInputCompileTime);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nOutputCompileTime);
            return writer;
        };

        /**
         * Encodes the specified OneAddressInfo message, length delimited. Does not implicitly {@link AccountPayURLRsp.OneAddressInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {AccountPayURLRsp.IOneAddressInfo} message OneAddressInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneAddressInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneAddressInfo message from the specified reader or buffer.
         * @function decode
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AccountPayURLRsp.OneAddressInfo} OneAddressInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneAddressInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountPayURLRsp.OneAddressInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.strMainNet = reader.string();
                    break;
                case 2:
                    message.strContractAddres = reader.string();
                    break;
                case 3:
                    message.nMinTopup = reader.int32();
                    break;
                case 4:
                    message.nInputCompileTime = reader.int32();
                    break;
                case 5:
                    message.nOutputCompileTime = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("strMainNet"))
                throw $util.ProtocolError("missing required 'strMainNet'", { instance: message });
            if (!message.hasOwnProperty("strContractAddres"))
                throw $util.ProtocolError("missing required 'strContractAddres'", { instance: message });
            if (!message.hasOwnProperty("nMinTopup"))
                throw $util.ProtocolError("missing required 'nMinTopup'", { instance: message });
            if (!message.hasOwnProperty("nInputCompileTime"))
                throw $util.ProtocolError("missing required 'nInputCompileTime'", { instance: message });
            if (!message.hasOwnProperty("nOutputCompileTime"))
                throw $util.ProtocolError("missing required 'nOutputCompileTime'", { instance: message });
            return message;
        };

        /**
         * Decodes an OneAddressInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AccountPayURLRsp.OneAddressInfo} OneAddressInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneAddressInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneAddressInfo message.
         * @function verify
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneAddressInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.strMainNet))
                return "strMainNet: string expected";
            if (!$util.isString(message.strContractAddres))
                return "strContractAddres: string expected";
            if (!$util.isInteger(message.nMinTopup))
                return "nMinTopup: integer expected";
            if (!$util.isInteger(message.nInputCompileTime))
                return "nInputCompileTime: integer expected";
            if (!$util.isInteger(message.nOutputCompileTime))
                return "nOutputCompileTime: integer expected";
            return null;
        };

        /**
         * Creates an OneAddressInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AccountPayURLRsp.OneAddressInfo} OneAddressInfo
         */
        OneAddressInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.AccountPayURLRsp.OneAddressInfo)
                return object;
            var message = new $root.AccountPayURLRsp.OneAddressInfo();
            if (object.strMainNet != null)
                message.strMainNet = String(object.strMainNet);
            if (object.strContractAddres != null)
                message.strContractAddres = String(object.strContractAddres);
            if (object.nMinTopup != null)
                message.nMinTopup = object.nMinTopup | 0;
            if (object.nInputCompileTime != null)
                message.nInputCompileTime = object.nInputCompileTime | 0;
            if (object.nOutputCompileTime != null)
                message.nOutputCompileTime = object.nOutputCompileTime | 0;
            return message;
        };

        /**
         * Creates a plain object from an OneAddressInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @static
         * @param {AccountPayURLRsp.OneAddressInfo} message OneAddressInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneAddressInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.strMainNet = "";
                object.strContractAddres = "";
                object.nMinTopup = 0;
                object.nInputCompileTime = 0;
                object.nOutputCompileTime = 0;
            }
            if (message.strMainNet != null && message.hasOwnProperty("strMainNet"))
                object.strMainNet = message.strMainNet;
            if (message.strContractAddres != null && message.hasOwnProperty("strContractAddres"))
                object.strContractAddres = message.strContractAddres;
            if (message.nMinTopup != null && message.hasOwnProperty("nMinTopup"))
                object.nMinTopup = message.nMinTopup;
            if (message.nInputCompileTime != null && message.hasOwnProperty("nInputCompileTime"))
                object.nInputCompileTime = message.nInputCompileTime;
            if (message.nOutputCompileTime != null && message.hasOwnProperty("nOutputCompileTime"))
                object.nOutputCompileTime = message.nOutputCompileTime;
            return object;
        };

        /**
         * Converts this OneAddressInfo to JSON.
         * @function toJSON
         * @memberof AccountPayURLRsp.OneAddressInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneAddressInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OneAddressInfo;
    })();

    return AccountPayURLRsp;
})();

$root.AccountPayInfoReq = (function() {

    /**
     * Properties of an AccountPayInfoReq.
     * @exports IAccountPayInfoReq
     * @interface IAccountPayInfoReq
     * @property {number} nUserId AccountPayInfoReq nUserId
     * @property {number} fAmount AccountPayInfoReq fAmount
     * @property {string|null} [strSubject] AccountPayInfoReq strSubject
     */

    /**
     * Constructs a new AccountPayInfoReq.
     * @exports AccountPayInfoReq
     * @classdesc Represents an AccountPayInfoReq.
     * @implements IAccountPayInfoReq
     * @constructor
     * @param {IAccountPayInfoReq=} [properties] Properties to set
     */
    function AccountPayInfoReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountPayInfoReq nUserId.
     * @member {number} nUserId
     * @memberof AccountPayInfoReq
     * @instance
     */
    AccountPayInfoReq.prototype.nUserId = 0;

    /**
     * AccountPayInfoReq fAmount.
     * @member {number} fAmount
     * @memberof AccountPayInfoReq
     * @instance
     */
    AccountPayInfoReq.prototype.fAmount = 0;

    /**
     * AccountPayInfoReq strSubject.
     * @member {string} strSubject
     * @memberof AccountPayInfoReq
     * @instance
     */
    AccountPayInfoReq.prototype.strSubject = "";

    /**
     * Creates a new AccountPayInfoReq instance using the specified properties.
     * @function create
     * @memberof AccountPayInfoReq
     * @static
     * @param {IAccountPayInfoReq=} [properties] Properties to set
     * @returns {AccountPayInfoReq} AccountPayInfoReq instance
     */
    AccountPayInfoReq.create = function create(properties) {
        return new AccountPayInfoReq(properties);
    };

    /**
     * Encodes the specified AccountPayInfoReq message. Does not implicitly {@link AccountPayInfoReq.verify|verify} messages.
     * @function encode
     * @memberof AccountPayInfoReq
     * @static
     * @param {IAccountPayInfoReq} message AccountPayInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayInfoReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.fAmount);
        if (message.strSubject != null && Object.hasOwnProperty.call(message, "strSubject"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.strSubject);
        return writer;
    };

    /**
     * Encodes the specified AccountPayInfoReq message, length delimited. Does not implicitly {@link AccountPayInfoReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountPayInfoReq
     * @static
     * @param {IAccountPayInfoReq} message AccountPayInfoReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountPayInfoReq message from the specified reader or buffer.
     * @function decode
     * @memberof AccountPayInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountPayInfoReq} AccountPayInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayInfoReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountPayInfoReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
            case 2:
                message.fAmount = reader.double();
                break;
            case 3:
                message.strSubject = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("fAmount"))
            throw $util.ProtocolError("missing required 'fAmount'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountPayInfoReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountPayInfoReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountPayInfoReq} AccountPayInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayInfoReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountPayInfoReq message.
     * @function verify
     * @memberof AccountPayInfoReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountPayInfoReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (typeof message.fAmount !== "number")
            return "fAmount: number expected";
        if (message.strSubject != null && message.hasOwnProperty("strSubject"))
            if (!$util.isString(message.strSubject))
                return "strSubject: string expected";
        return null;
    };

    /**
     * Creates an AccountPayInfoReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountPayInfoReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountPayInfoReq} AccountPayInfoReq
     */
    AccountPayInfoReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountPayInfoReq)
            return object;
        var message = new $root.AccountPayInfoReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.fAmount != null)
            message.fAmount = Number(object.fAmount);
        if (object.strSubject != null)
            message.strSubject = String(object.strSubject);
        return message;
    };

    /**
     * Creates a plain object from an AccountPayInfoReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountPayInfoReq
     * @static
     * @param {AccountPayInfoReq} message AccountPayInfoReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountPayInfoReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.fAmount = 0;
            object.strSubject = "";
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.fAmount != null && message.hasOwnProperty("fAmount"))
            object.fAmount = options.json && !isFinite(message.fAmount) ? String(message.fAmount) : message.fAmount;
        if (message.strSubject != null && message.hasOwnProperty("strSubject"))
            object.strSubject = message.strSubject;
        return object;
    };

    /**
     * Converts this AccountPayInfoReq to JSON.
     * @function toJSON
     * @memberof AccountPayInfoReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountPayInfoReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountPayInfoReq;
})();

$root.AccountPayInfoRsp = (function() {

    /**
     * Properties of an AccountPayInfoRsp.
     * @exports IAccountPayInfoRsp
     * @interface IAccountPayInfoRsp
     * @property {number} nCode AccountPayInfoRsp nCode
     * @property {number} fAmount AccountPayInfoRsp fAmount
     * @property {string|null} [strRemark] AccountPayInfoRsp strRemark
     */

    /**
     * Constructs a new AccountPayInfoRsp.
     * @exports AccountPayInfoRsp
     * @classdesc Represents an AccountPayInfoRsp.
     * @implements IAccountPayInfoRsp
     * @constructor
     * @param {IAccountPayInfoRsp=} [properties] Properties to set
     */
    function AccountPayInfoRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountPayInfoRsp nCode.
     * @member {number} nCode
     * @memberof AccountPayInfoRsp
     * @instance
     */
    AccountPayInfoRsp.prototype.nCode = 0;

    /**
     * AccountPayInfoRsp fAmount.
     * @member {number} fAmount
     * @memberof AccountPayInfoRsp
     * @instance
     */
    AccountPayInfoRsp.prototype.fAmount = 0;

    /**
     * AccountPayInfoRsp strRemark.
     * @member {string} strRemark
     * @memberof AccountPayInfoRsp
     * @instance
     */
    AccountPayInfoRsp.prototype.strRemark = "";

    /**
     * Creates a new AccountPayInfoRsp instance using the specified properties.
     * @function create
     * @memberof AccountPayInfoRsp
     * @static
     * @param {IAccountPayInfoRsp=} [properties] Properties to set
     * @returns {AccountPayInfoRsp} AccountPayInfoRsp instance
     */
    AccountPayInfoRsp.create = function create(properties) {
        return new AccountPayInfoRsp(properties);
    };

    /**
     * Encodes the specified AccountPayInfoRsp message. Does not implicitly {@link AccountPayInfoRsp.verify|verify} messages.
     * @function encode
     * @memberof AccountPayInfoRsp
     * @static
     * @param {IAccountPayInfoRsp} message AccountPayInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayInfoRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nCode);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.fAmount);
        if (message.strRemark != null && Object.hasOwnProperty.call(message, "strRemark"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.strRemark);
        return writer;
    };

    /**
     * Encodes the specified AccountPayInfoRsp message, length delimited. Does not implicitly {@link AccountPayInfoRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountPayInfoRsp
     * @static
     * @param {IAccountPayInfoRsp} message AccountPayInfoRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountPayInfoRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountPayInfoRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AccountPayInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountPayInfoRsp} AccountPayInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayInfoRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountPayInfoRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nCode = reader.int32();
                break;
            case 2:
                message.fAmount = reader.double();
                break;
            case 3:
                message.strRemark = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nCode"))
            throw $util.ProtocolError("missing required 'nCode'", { instance: message });
        if (!message.hasOwnProperty("fAmount"))
            throw $util.ProtocolError("missing required 'fAmount'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountPayInfoRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountPayInfoRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountPayInfoRsp} AccountPayInfoRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountPayInfoRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountPayInfoRsp message.
     * @function verify
     * @memberof AccountPayInfoRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountPayInfoRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nCode))
            return "nCode: integer expected";
        if (typeof message.fAmount !== "number")
            return "fAmount: number expected";
        if (message.strRemark != null && message.hasOwnProperty("strRemark"))
            if (!$util.isString(message.strRemark))
                return "strRemark: string expected";
        return null;
    };

    /**
     * Creates an AccountPayInfoRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountPayInfoRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountPayInfoRsp} AccountPayInfoRsp
     */
    AccountPayInfoRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountPayInfoRsp)
            return object;
        var message = new $root.AccountPayInfoRsp();
        if (object.nCode != null)
            message.nCode = object.nCode | 0;
        if (object.fAmount != null)
            message.fAmount = Number(object.fAmount);
        if (object.strRemark != null)
            message.strRemark = String(object.strRemark);
        return message;
    };

    /**
     * Creates a plain object from an AccountPayInfoRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountPayInfoRsp
     * @static
     * @param {AccountPayInfoRsp} message AccountPayInfoRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountPayInfoRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nCode = 0;
            object.fAmount = 0;
            object.strRemark = "";
        }
        if (message.nCode != null && message.hasOwnProperty("nCode"))
            object.nCode = message.nCode;
        if (message.fAmount != null && message.hasOwnProperty("fAmount"))
            object.fAmount = options.json && !isFinite(message.fAmount) ? String(message.fAmount) : message.fAmount;
        if (message.strRemark != null && message.hasOwnProperty("strRemark"))
            object.strRemark = message.strRemark;
        return object;
    };

    /**
     * Converts this AccountPayInfoRsp to JSON.
     * @function toJSON
     * @memberof AccountPayInfoRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountPayInfoRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountPayInfoRsp;
})();

$root.AccountWithdrawalReq = (function() {

    /**
     * Properties of an AccountWithdrawalReq.
     * @exports IAccountWithdrawalReq
     * @interface IAccountWithdrawalReq
     * @property {number} nUserId AccountWithdrawalReq nUserId
     * @property {number} fAmount AccountWithdrawalReq fAmount
     * @property {string} strURL AccountWithdrawalReq strURL
     * @property {string} strPwd AccountWithdrawalReq strPwd
     * @property {string} strmainNet AccountWithdrawalReq strmainNet
     * @property {string|null} [remark] AccountWithdrawalReq remark
     */

    /**
     * Constructs a new AccountWithdrawalReq.
     * @exports AccountWithdrawalReq
     * @classdesc Represents an AccountWithdrawalReq.
     * @implements IAccountWithdrawalReq
     * @constructor
     * @param {IAccountWithdrawalReq=} [properties] Properties to set
     */
    function AccountWithdrawalReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountWithdrawalReq nUserId.
     * @member {number} nUserId
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.nUserId = 0;

    /**
     * AccountWithdrawalReq fAmount.
     * @member {number} fAmount
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.fAmount = 0;

    /**
     * AccountWithdrawalReq strURL.
     * @member {string} strURL
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.strURL = "";

    /**
     * AccountWithdrawalReq strPwd.
     * @member {string} strPwd
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.strPwd = "";

    /**
     * AccountWithdrawalReq strmainNet.
     * @member {string} strmainNet
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.strmainNet = "";

    /**
     * AccountWithdrawalReq remark.
     * @member {string} remark
     * @memberof AccountWithdrawalReq
     * @instance
     */
    AccountWithdrawalReq.prototype.remark = "";

    /**
     * Creates a new AccountWithdrawalReq instance using the specified properties.
     * @function create
     * @memberof AccountWithdrawalReq
     * @static
     * @param {IAccountWithdrawalReq=} [properties] Properties to set
     * @returns {AccountWithdrawalReq} AccountWithdrawalReq instance
     */
    AccountWithdrawalReq.create = function create(properties) {
        return new AccountWithdrawalReq(properties);
    };

    /**
     * Encodes the specified AccountWithdrawalReq message. Does not implicitly {@link AccountWithdrawalReq.verify|verify} messages.
     * @function encode
     * @memberof AccountWithdrawalReq
     * @static
     * @param {IAccountWithdrawalReq} message AccountWithdrawalReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.fAmount);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.strURL);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.strPwd);
        writer.uint32(/* id 5, wireType 2 =*/42).string(message.strmainNet);
        if (message.remark != null && Object.hasOwnProperty.call(message, "remark"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.remark);
        return writer;
    };

    /**
     * Encodes the specified AccountWithdrawalReq message, length delimited. Does not implicitly {@link AccountWithdrawalReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountWithdrawalReq
     * @static
     * @param {IAccountWithdrawalReq} message AccountWithdrawalReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountWithdrawalReq message from the specified reader or buffer.
     * @function decode
     * @memberof AccountWithdrawalReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountWithdrawalReq} AccountWithdrawalReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountWithdrawalReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
            case 2:
                message.fAmount = reader.double();
                break;
            case 3:
                message.strURL = reader.string();
                break;
            case 4:
                message.strPwd = reader.string();
                break;
            case 5:
                message.strmainNet = reader.string();
                break;
            case 6:
                message.remark = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nUserId"))
            throw $util.ProtocolError("missing required 'nUserId'", { instance: message });
        if (!message.hasOwnProperty("fAmount"))
            throw $util.ProtocolError("missing required 'fAmount'", { instance: message });
        if (!message.hasOwnProperty("strURL"))
            throw $util.ProtocolError("missing required 'strURL'", { instance: message });
        if (!message.hasOwnProperty("strPwd"))
            throw $util.ProtocolError("missing required 'strPwd'", { instance: message });
        if (!message.hasOwnProperty("strmainNet"))
            throw $util.ProtocolError("missing required 'strmainNet'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountWithdrawalReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountWithdrawalReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountWithdrawalReq} AccountWithdrawalReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountWithdrawalReq message.
     * @function verify
     * @memberof AccountWithdrawalReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountWithdrawalReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        if (typeof message.fAmount !== "number")
            return "fAmount: number expected";
        if (!$util.isString(message.strURL))
            return "strURL: string expected";
        if (!$util.isString(message.strPwd))
            return "strPwd: string expected";
        if (!$util.isString(message.strmainNet))
            return "strmainNet: string expected";
        if (message.remark != null && message.hasOwnProperty("remark"))
            if (!$util.isString(message.remark))
                return "remark: string expected";
        return null;
    };

    /**
     * Creates an AccountWithdrawalReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountWithdrawalReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountWithdrawalReq} AccountWithdrawalReq
     */
    AccountWithdrawalReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountWithdrawalReq)
            return object;
        var message = new $root.AccountWithdrawalReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        if (object.fAmount != null)
            message.fAmount = Number(object.fAmount);
        if (object.strURL != null)
            message.strURL = String(object.strURL);
        if (object.strPwd != null)
            message.strPwd = String(object.strPwd);
        if (object.strmainNet != null)
            message.strmainNet = String(object.strmainNet);
        if (object.remark != null)
            message.remark = String(object.remark);
        return message;
    };

    /**
     * Creates a plain object from an AccountWithdrawalReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountWithdrawalReq
     * @static
     * @param {AccountWithdrawalReq} message AccountWithdrawalReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountWithdrawalReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nUserId = 0;
            object.fAmount = 0;
            object.strURL = "";
            object.strPwd = "";
            object.strmainNet = "";
            object.remark = "";
        }
        if (message.nUserId != null && message.hasOwnProperty("nUserId"))
            object.nUserId = message.nUserId;
        if (message.fAmount != null && message.hasOwnProperty("fAmount"))
            object.fAmount = options.json && !isFinite(message.fAmount) ? String(message.fAmount) : message.fAmount;
        if (message.strURL != null && message.hasOwnProperty("strURL"))
            object.strURL = message.strURL;
        if (message.strPwd != null && message.hasOwnProperty("strPwd"))
            object.strPwd = message.strPwd;
        if (message.strmainNet != null && message.hasOwnProperty("strmainNet"))
            object.strmainNet = message.strmainNet;
        if (message.remark != null && message.hasOwnProperty("remark"))
            object.remark = message.remark;
        return object;
    };

    /**
     * Converts this AccountWithdrawalReq to JSON.
     * @function toJSON
     * @memberof AccountWithdrawalReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountWithdrawalReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountWithdrawalReq;
})();

$root.AccountWithdrawalRsp = (function() {

    /**
     * Properties of an AccountWithdrawalRsp.
     * @exports IAccountWithdrawalRsp
     * @interface IAccountWithdrawalRsp
     * @property {number} nCode AccountWithdrawalRsp nCode
     * @property {number} fAmount AccountWithdrawalRsp fAmount
     * @property {string|null} [strRemark] AccountWithdrawalRsp strRemark
     */

    /**
     * Constructs a new AccountWithdrawalRsp.
     * @exports AccountWithdrawalRsp
     * @classdesc Represents an AccountWithdrawalRsp.
     * @implements IAccountWithdrawalRsp
     * @constructor
     * @param {IAccountWithdrawalRsp=} [properties] Properties to set
     */
    function AccountWithdrawalRsp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountWithdrawalRsp nCode.
     * @member {number} nCode
     * @memberof AccountWithdrawalRsp
     * @instance
     */
    AccountWithdrawalRsp.prototype.nCode = 0;

    /**
     * AccountWithdrawalRsp fAmount.
     * @member {number} fAmount
     * @memberof AccountWithdrawalRsp
     * @instance
     */
    AccountWithdrawalRsp.prototype.fAmount = 0;

    /**
     * AccountWithdrawalRsp strRemark.
     * @member {string} strRemark
     * @memberof AccountWithdrawalRsp
     * @instance
     */
    AccountWithdrawalRsp.prototype.strRemark = "";

    /**
     * Creates a new AccountWithdrawalRsp instance using the specified properties.
     * @function create
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {IAccountWithdrawalRsp=} [properties] Properties to set
     * @returns {AccountWithdrawalRsp} AccountWithdrawalRsp instance
     */
    AccountWithdrawalRsp.create = function create(properties) {
        return new AccountWithdrawalRsp(properties);
    };

    /**
     * Encodes the specified AccountWithdrawalRsp message. Does not implicitly {@link AccountWithdrawalRsp.verify|verify} messages.
     * @function encode
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {IAccountWithdrawalRsp} message AccountWithdrawalRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nCode);
        writer.uint32(/* id 2, wireType 1 =*/17).double(message.fAmount);
        if (message.strRemark != null && Object.hasOwnProperty.call(message, "strRemark"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.strRemark);
        return writer;
    };

    /**
     * Encodes the specified AccountWithdrawalRsp message, length delimited. Does not implicitly {@link AccountWithdrawalRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {IAccountWithdrawalRsp} message AccountWithdrawalRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountWithdrawalRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountWithdrawalRsp} AccountWithdrawalRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountWithdrawalRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nCode = reader.int32();
                break;
            case 2:
                message.fAmount = reader.double();
                break;
            case 3:
                message.strRemark = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nCode"))
            throw $util.ProtocolError("missing required 'nCode'", { instance: message });
        if (!message.hasOwnProperty("fAmount"))
            throw $util.ProtocolError("missing required 'fAmount'", { instance: message });
        return message;
    };

    /**
     * Decodes an AccountWithdrawalRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountWithdrawalRsp} AccountWithdrawalRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountWithdrawalRsp message.
     * @function verify
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountWithdrawalRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nCode))
            return "nCode: integer expected";
        if (typeof message.fAmount !== "number")
            return "fAmount: number expected";
        if (message.strRemark != null && message.hasOwnProperty("strRemark"))
            if (!$util.isString(message.strRemark))
                return "strRemark: string expected";
        return null;
    };

    /**
     * Creates an AccountWithdrawalRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountWithdrawalRsp} AccountWithdrawalRsp
     */
    AccountWithdrawalRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountWithdrawalRsp)
            return object;
        var message = new $root.AccountWithdrawalRsp();
        if (object.nCode != null)
            message.nCode = object.nCode | 0;
        if (object.fAmount != null)
            message.fAmount = Number(object.fAmount);
        if (object.strRemark != null)
            message.strRemark = String(object.strRemark);
        return message;
    };

    /**
     * Creates a plain object from an AccountWithdrawalRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountWithdrawalRsp
     * @static
     * @param {AccountWithdrawalRsp} message AccountWithdrawalRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountWithdrawalRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nCode = 0;
            object.fAmount = 0;
            object.strRemark = "";
        }
        if (message.nCode != null && message.hasOwnProperty("nCode"))
            object.nCode = message.nCode;
        if (message.fAmount != null && message.hasOwnProperty("fAmount"))
            object.fAmount = options.json && !isFinite(message.fAmount) ? String(message.fAmount) : message.fAmount;
        if (message.strRemark != null && message.hasOwnProperty("strRemark"))
            object.strRemark = message.strRemark;
        return object;
    };

    /**
     * Converts this AccountWithdrawalRsp to JSON.
     * @function toJSON
     * @memberof AccountWithdrawalRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountWithdrawalRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountWithdrawalRsp;
})();

$root.AccountWithdrawalViewReq = (function() {

    /**
     * Properties of an AccountWithdrawalViewReq.
     * @exports IAccountWithdrawalViewReq
     * @interface IAccountWithdrawalViewReq
     * @property {number} nUserId AccountWithdrawalViewReq nUserId
     */

    /**
     * Constructs a new AccountWithdrawalViewReq.
     * @exports AccountWithdrawalViewReq
     * @classdesc Represents an AccountWithdrawalViewReq.
     * @implements IAccountWithdrawalViewReq
     * @constructor
     * @param {IAccountWithdrawalViewReq=} [properties] Properties to set
     */
    function AccountWithdrawalViewReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountWithdrawalViewReq nUserId.
     * @member {number} nUserId
     * @memberof AccountWithdrawalViewReq
     * @instance
     */
    AccountWithdrawalViewReq.prototype.nUserId = 0;

    /**
     * Creates a new AccountWithdrawalViewReq instance using the specified properties.
     * @function create
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {IAccountWithdrawalViewReq=} [properties] Properties to set
     * @returns {AccountWithdrawalViewReq} AccountWithdrawalViewReq instance
     */
    AccountWithdrawalViewReq.create = function create(properties) {
        return new AccountWithdrawalViewReq(properties);
    };

    /**
     * Encodes the specified AccountWithdrawalViewReq message. Does not implicitly {@link AccountWithdrawalViewReq.verify|verify} messages.
     * @function encode
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {IAccountWithdrawalViewReq} message AccountWithdrawalViewReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalViewReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nUserId);
        return writer;
    };

    /**
     * Encodes the specified AccountWithdrawalViewReq message, length delimited. Does not implicitly {@link AccountWithdrawalViewReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {IAccountWithdrawalViewReq} message AccountWithdrawalViewReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalViewReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountWithdrawalViewReq message from the specified reader or buffer.
     * @function decode
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountWithdrawalViewReq} AccountWithdrawalViewReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalViewReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountWithdrawalViewReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nUserId = reader.int32();
                break;
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
     * Decodes an AccountWithdrawalViewReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountWithdrawalViewReq} AccountWithdrawalViewReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalViewReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountWithdrawalViewReq message.
     * @function verify
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountWithdrawalViewReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nUserId))
            return "nUserId: integer expected";
        return null;
    };

    /**
     * Creates an AccountWithdrawalViewReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountWithdrawalViewReq} AccountWithdrawalViewReq
     */
    AccountWithdrawalViewReq.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountWithdrawalViewReq)
            return object;
        var message = new $root.AccountWithdrawalViewReq();
        if (object.nUserId != null)
            message.nUserId = object.nUserId | 0;
        return message;
    };

    /**
     * Creates a plain object from an AccountWithdrawalViewReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountWithdrawalViewReq
     * @static
     * @param {AccountWithdrawalViewReq} message AccountWithdrawalViewReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountWithdrawalViewReq.toObject = function toObject(message, options) {
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
     * Converts this AccountWithdrawalViewReq to JSON.
     * @function toJSON
     * @memberof AccountWithdrawalViewReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountWithdrawalViewReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccountWithdrawalViewReq;
})();

$root.AccountWithdrawalViewRsp = (function() {

    /**
     * Properties of an AccountWithdrawalViewRsp.
     * @exports IAccountWithdrawalViewRsp
     * @interface IAccountWithdrawalViewRsp
     * @property {Array.<AccountWithdrawalViewRsp.IOneWithdrawWViewInfo>|null} [arrWithdrawList] AccountWithdrawalViewRsp arrWithdrawList
     */

    /**
     * Constructs a new AccountWithdrawalViewRsp.
     * @exports AccountWithdrawalViewRsp
     * @classdesc Represents an AccountWithdrawalViewRsp.
     * @implements IAccountWithdrawalViewRsp
     * @constructor
     * @param {IAccountWithdrawalViewRsp=} [properties] Properties to set
     */
    function AccountWithdrawalViewRsp(properties) {
        this.arrWithdrawList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccountWithdrawalViewRsp arrWithdrawList.
     * @member {Array.<AccountWithdrawalViewRsp.IOneWithdrawWViewInfo>} arrWithdrawList
     * @memberof AccountWithdrawalViewRsp
     * @instance
     */
    AccountWithdrawalViewRsp.prototype.arrWithdrawList = $util.emptyArray;

    /**
     * Creates a new AccountWithdrawalViewRsp instance using the specified properties.
     * @function create
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {IAccountWithdrawalViewRsp=} [properties] Properties to set
     * @returns {AccountWithdrawalViewRsp} AccountWithdrawalViewRsp instance
     */
    AccountWithdrawalViewRsp.create = function create(properties) {
        return new AccountWithdrawalViewRsp(properties);
    };

    /**
     * Encodes the specified AccountWithdrawalViewRsp message. Does not implicitly {@link AccountWithdrawalViewRsp.verify|verify} messages.
     * @function encode
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {IAccountWithdrawalViewRsp} message AccountWithdrawalViewRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalViewRsp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrWithdrawList != null && message.arrWithdrawList.length)
            for (var i = 0; i < message.arrWithdrawList.length; ++i)
                $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo.encode(message.arrWithdrawList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified AccountWithdrawalViewRsp message, length delimited. Does not implicitly {@link AccountWithdrawalViewRsp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {IAccountWithdrawalViewRsp} message AccountWithdrawalViewRsp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccountWithdrawalViewRsp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccountWithdrawalViewRsp message from the specified reader or buffer.
     * @function decode
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccountWithdrawalViewRsp} AccountWithdrawalViewRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalViewRsp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountWithdrawalViewRsp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrWithdrawList && message.arrWithdrawList.length))
                    message.arrWithdrawList = [];
                message.arrWithdrawList.push($root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AccountWithdrawalViewRsp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccountWithdrawalViewRsp} AccountWithdrawalViewRsp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccountWithdrawalViewRsp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccountWithdrawalViewRsp message.
     * @function verify
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccountWithdrawalViewRsp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrWithdrawList != null && message.hasOwnProperty("arrWithdrawList")) {
            if (!Array.isArray(message.arrWithdrawList))
                return "arrWithdrawList: array expected";
            for (var i = 0; i < message.arrWithdrawList.length; ++i) {
                var error = $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo.verify(message.arrWithdrawList[i]);
                if (error)
                    return "arrWithdrawList." + error;
            }
        }
        return null;
    };

    /**
     * Creates an AccountWithdrawalViewRsp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccountWithdrawalViewRsp} AccountWithdrawalViewRsp
     */
    AccountWithdrawalViewRsp.fromObject = function fromObject(object) {
        if (object instanceof $root.AccountWithdrawalViewRsp)
            return object;
        var message = new $root.AccountWithdrawalViewRsp();
        if (object.arrWithdrawList) {
            if (!Array.isArray(object.arrWithdrawList))
                throw TypeError(".AccountWithdrawalViewRsp.arrWithdrawList: array expected");
            message.arrWithdrawList = [];
            for (var i = 0; i < object.arrWithdrawList.length; ++i) {
                if (typeof object.arrWithdrawList[i] !== "object")
                    throw TypeError(".AccountWithdrawalViewRsp.arrWithdrawList: object expected");
                message.arrWithdrawList[i] = $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo.fromObject(object.arrWithdrawList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an AccountWithdrawalViewRsp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccountWithdrawalViewRsp
     * @static
     * @param {AccountWithdrawalViewRsp} message AccountWithdrawalViewRsp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccountWithdrawalViewRsp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.arrWithdrawList = [];
        if (message.arrWithdrawList && message.arrWithdrawList.length) {
            object.arrWithdrawList = [];
            for (var j = 0; j < message.arrWithdrawList.length; ++j)
                object.arrWithdrawList[j] = $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo.toObject(message.arrWithdrawList[j], options);
        }
        return object;
    };

    /**
     * Converts this AccountWithdrawalViewRsp to JSON.
     * @function toJSON
     * @memberof AccountWithdrawalViewRsp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccountWithdrawalViewRsp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    AccountWithdrawalViewRsp.OneWithdrawWViewInfo = (function() {

        /**
         * Properties of an OneWithdrawWViewInfo.
         * @memberof AccountWithdrawalViewRsp
         * @interface IOneWithdrawWViewInfo
         * @property {string} strMainNet OneWithdrawWViewInfo strMainNet
         * @property {string} strRate OneWithdrawWViewInfo strRate
         * @property {number} nMinTopupMoney OneWithdrawWViewInfo nMinTopupMoney
         * @property {string} strTime OneWithdrawWViewInfo strTime
         */

        /**
         * Constructs a new OneWithdrawWViewInfo.
         * @memberof AccountWithdrawalViewRsp
         * @classdesc Represents an OneWithdrawWViewInfo.
         * @implements IOneWithdrawWViewInfo
         * @constructor
         * @param {AccountWithdrawalViewRsp.IOneWithdrawWViewInfo=} [properties] Properties to set
         */
        function OneWithdrawWViewInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneWithdrawWViewInfo strMainNet.
         * @member {string} strMainNet
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @instance
         */
        OneWithdrawWViewInfo.prototype.strMainNet = "";

        /**
         * OneWithdrawWViewInfo strRate.
         * @member {string} strRate
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @instance
         */
        OneWithdrawWViewInfo.prototype.strRate = "";

        /**
         * OneWithdrawWViewInfo nMinTopupMoney.
         * @member {number} nMinTopupMoney
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @instance
         */
        OneWithdrawWViewInfo.prototype.nMinTopupMoney = 0;

        /**
         * OneWithdrawWViewInfo strTime.
         * @member {string} strTime
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @instance
         */
        OneWithdrawWViewInfo.prototype.strTime = "";

        /**
         * Creates a new OneWithdrawWViewInfo instance using the specified properties.
         * @function create
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {AccountWithdrawalViewRsp.IOneWithdrawWViewInfo=} [properties] Properties to set
         * @returns {AccountWithdrawalViewRsp.OneWithdrawWViewInfo} OneWithdrawWViewInfo instance
         */
        OneWithdrawWViewInfo.create = function create(properties) {
            return new OneWithdrawWViewInfo(properties);
        };

        /**
         * Encodes the specified OneWithdrawWViewInfo message. Does not implicitly {@link AccountWithdrawalViewRsp.OneWithdrawWViewInfo.verify|verify} messages.
         * @function encode
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {AccountWithdrawalViewRsp.IOneWithdrawWViewInfo} message OneWithdrawWViewInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneWithdrawWViewInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.strMainNet);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.strRate);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nMinTopupMoney);
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.strTime);
            return writer;
        };

        /**
         * Encodes the specified OneWithdrawWViewInfo message, length delimited. Does not implicitly {@link AccountWithdrawalViewRsp.OneWithdrawWViewInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {AccountWithdrawalViewRsp.IOneWithdrawWViewInfo} message OneWithdrawWViewInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneWithdrawWViewInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneWithdrawWViewInfo message from the specified reader or buffer.
         * @function decode
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AccountWithdrawalViewRsp.OneWithdrawWViewInfo} OneWithdrawWViewInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneWithdrawWViewInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.strMainNet = reader.string();
                    break;
                case 2:
                    message.strRate = reader.string();
                    break;
                case 3:
                    message.nMinTopupMoney = reader.int32();
                    break;
                case 4:
                    message.strTime = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("strMainNet"))
                throw $util.ProtocolError("missing required 'strMainNet'", { instance: message });
            if (!message.hasOwnProperty("strRate"))
                throw $util.ProtocolError("missing required 'strRate'", { instance: message });
            if (!message.hasOwnProperty("nMinTopupMoney"))
                throw $util.ProtocolError("missing required 'nMinTopupMoney'", { instance: message });
            if (!message.hasOwnProperty("strTime"))
                throw $util.ProtocolError("missing required 'strTime'", { instance: message });
            return message;
        };

        /**
         * Decodes an OneWithdrawWViewInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AccountWithdrawalViewRsp.OneWithdrawWViewInfo} OneWithdrawWViewInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneWithdrawWViewInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneWithdrawWViewInfo message.
         * @function verify
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneWithdrawWViewInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.strMainNet))
                return "strMainNet: string expected";
            if (!$util.isString(message.strRate))
                return "strRate: string expected";
            if (!$util.isInteger(message.nMinTopupMoney))
                return "nMinTopupMoney: integer expected";
            if (!$util.isString(message.strTime))
                return "strTime: string expected";
            return null;
        };

        /**
         * Creates an OneWithdrawWViewInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AccountWithdrawalViewRsp.OneWithdrawWViewInfo} OneWithdrawWViewInfo
         */
        OneWithdrawWViewInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo)
                return object;
            var message = new $root.AccountWithdrawalViewRsp.OneWithdrawWViewInfo();
            if (object.strMainNet != null)
                message.strMainNet = String(object.strMainNet);
            if (object.strRate != null)
                message.strRate = String(object.strRate);
            if (object.nMinTopupMoney != null)
                message.nMinTopupMoney = object.nMinTopupMoney | 0;
            if (object.strTime != null)
                message.strTime = String(object.strTime);
            return message;
        };

        /**
         * Creates a plain object from an OneWithdrawWViewInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @static
         * @param {AccountWithdrawalViewRsp.OneWithdrawWViewInfo} message OneWithdrawWViewInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneWithdrawWViewInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.strMainNet = "";
                object.strRate = "";
                object.nMinTopupMoney = 0;
                object.strTime = "";
            }
            if (message.strMainNet != null && message.hasOwnProperty("strMainNet"))
                object.strMainNet = message.strMainNet;
            if (message.strRate != null && message.hasOwnProperty("strRate"))
                object.strRate = message.strRate;
            if (message.nMinTopupMoney != null && message.hasOwnProperty("nMinTopupMoney"))
                object.nMinTopupMoney = message.nMinTopupMoney;
            if (message.strTime != null && message.hasOwnProperty("strTime"))
                object.strTime = message.strTime;
            return object;
        };

        /**
         * Converts this OneWithdrawWViewInfo to JSON.
         * @function toJSON
         * @memberof AccountWithdrawalViewRsp.OneWithdrawWViewInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneWithdrawWViewInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OneWithdrawWViewInfo;
    })();

    return AccountWithdrawalViewRsp;
})();

$root.ClubSUserNoticeReq = (function() {

    /**
     * Properties of a ClubSUserNoticeReq.
     * @exports IClubSUserNoticeReq
     * @interface IClubSUserNoticeReq
     * @property {number} nIdOfStart ClubSUserNoticeReq nIdOfStart
     * @property {number} nCnt ClubSUserNoticeReq nCnt
     * @property {number} nType ClubSUserNoticeReq nType
     */

    /**
     * Constructs a new ClubSUserNoticeReq.
     * @exports ClubSUserNoticeReq
     * @classdesc Represents a ClubSUserNoticeReq.
     * @implements IClubSUserNoticeReq
     * @constructor
     * @param {IClubSUserNoticeReq=} [properties] Properties to set
     */
    function ClubSUserNoticeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubSUserNoticeReq nIdOfStart.
     * @member {number} nIdOfStart
     * @memberof ClubSUserNoticeReq
     * @instance
     */
    ClubSUserNoticeReq.prototype.nIdOfStart = 0;

    /**
     * ClubSUserNoticeReq nCnt.
     * @member {number} nCnt
     * @memberof ClubSUserNoticeReq
     * @instance
     */
    ClubSUserNoticeReq.prototype.nCnt = 10;

    /**
     * ClubSUserNoticeReq nType.
     * @member {number} nType
     * @memberof ClubSUserNoticeReq
     * @instance
     */
    ClubSUserNoticeReq.prototype.nType = 0;

    /**
     * Creates a new ClubSUserNoticeReq instance using the specified properties.
     * @function create
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {IClubSUserNoticeReq=} [properties] Properties to set
     * @returns {ClubSUserNoticeReq} ClubSUserNoticeReq instance
     */
    ClubSUserNoticeReq.create = function create(properties) {
        return new ClubSUserNoticeReq(properties);
    };

    /**
     * Encodes the specified ClubSUserNoticeReq message. Does not implicitly {@link ClubSUserNoticeReq.verify|verify} messages.
     * @function encode
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {IClubSUserNoticeReq} message ClubSUserNoticeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nIdOfStart);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nCnt);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nType);
        return writer;
    };

    /**
     * Encodes the specified ClubSUserNoticeReq message, length delimited. Does not implicitly {@link ClubSUserNoticeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {IClubSUserNoticeReq} message ClubSUserNoticeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSUserNoticeReq message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSUserNoticeReq} ClubSUserNoticeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSUserNoticeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nIdOfStart = reader.int32();
                break;
            case 2:
                message.nCnt = reader.int32();
                break;
            case 3:
                message.nType = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nIdOfStart"))
            throw $util.ProtocolError("missing required 'nIdOfStart'", { instance: message });
        if (!message.hasOwnProperty("nCnt"))
            throw $util.ProtocolError("missing required 'nCnt'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSUserNoticeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSUserNoticeReq} ClubSUserNoticeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSUserNoticeReq message.
     * @function verify
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSUserNoticeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nIdOfStart))
            return "nIdOfStart: integer expected";
        if (!$util.isInteger(message.nCnt))
            return "nCnt: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        return null;
    };

    /**
     * Creates a ClubSUserNoticeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSUserNoticeReq} ClubSUserNoticeReq
     */
    ClubSUserNoticeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSUserNoticeReq)
            return object;
        var message = new $root.ClubSUserNoticeReq();
        if (object.nIdOfStart != null)
            message.nIdOfStart = object.nIdOfStart | 0;
        if (object.nCnt != null)
            message.nCnt = object.nCnt | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubSUserNoticeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSUserNoticeReq
     * @static
     * @param {ClubSUserNoticeReq} message ClubSUserNoticeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSUserNoticeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nIdOfStart = 0;
            object.nCnt = 10;
            object.nType = 0;
        }
        if (message.nIdOfStart != null && message.hasOwnProperty("nIdOfStart"))
            object.nIdOfStart = message.nIdOfStart;
        if (message.nCnt != null && message.hasOwnProperty("nCnt"))
            object.nCnt = message.nCnt;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        return object;
    };

    /**
     * Converts this ClubSUserNoticeReq to JSON.
     * @function toJSON
     * @memberof ClubSUserNoticeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSUserNoticeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSUserNoticeReq;
})();

$root.ClubSUserNoticeResp = (function() {

    /**
     * Properties of a ClubSUserNoticeResp.
     * @exports IClubSUserNoticeResp
     * @interface IClubSUserNoticeResp
     * @property {Array.<IClubSNoticesItem>|null} [arrNotices] nType=1或者nType=2才有
     * @property {number} nAllCnt ClubSUserNoticeResp nAllCnt
     * @property {number} nType ClubSUserNoticeResp nType
     * @property {Array.<IClubSPersonApply>|null} [arrApplyList] ClubSUserNoticeResp arrApplyList
     * @property {number|null} [nUnReadCnt] ClubSUserNoticeResp nUnReadCnt
     */

    /**
     * Constructs a new ClubSUserNoticeResp.
     * @exports ClubSUserNoticeResp
     * @classdesc Represents a ClubSUserNoticeResp.
     * @implements IClubSUserNoticeResp
     * @constructor
     * @param {IClubSUserNoticeResp=} [properties] Properties to set
     */
    function ClubSUserNoticeResp(properties) {
        this.arrNotices = [];
        this.arrApplyList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * nType=1或者nType=2才有
     * @member {Array.<IClubSNoticesItem>} arrNotices
     * @memberof ClubSUserNoticeResp
     * @instance
     */
    ClubSUserNoticeResp.prototype.arrNotices = $util.emptyArray;

    /**
     * ClubSUserNoticeResp nAllCnt.
     * @member {number} nAllCnt
     * @memberof ClubSUserNoticeResp
     * @instance
     */
    ClubSUserNoticeResp.prototype.nAllCnt = 0;

    /**
     * ClubSUserNoticeResp nType.
     * @member {number} nType
     * @memberof ClubSUserNoticeResp
     * @instance
     */
    ClubSUserNoticeResp.prototype.nType = 0;

    /**
     * ClubSUserNoticeResp arrApplyList.
     * @member {Array.<IClubSPersonApply>} arrApplyList
     * @memberof ClubSUserNoticeResp
     * @instance
     */
    ClubSUserNoticeResp.prototype.arrApplyList = $util.emptyArray;

    /**
     * ClubSUserNoticeResp nUnReadCnt.
     * @member {number} nUnReadCnt
     * @memberof ClubSUserNoticeResp
     * @instance
     */
    ClubSUserNoticeResp.prototype.nUnReadCnt = 0;

    /**
     * Creates a new ClubSUserNoticeResp instance using the specified properties.
     * @function create
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {IClubSUserNoticeResp=} [properties] Properties to set
     * @returns {ClubSUserNoticeResp} ClubSUserNoticeResp instance
     */
    ClubSUserNoticeResp.create = function create(properties) {
        return new ClubSUserNoticeResp(properties);
    };

    /**
     * Encodes the specified ClubSUserNoticeResp message. Does not implicitly {@link ClubSUserNoticeResp.verify|verify} messages.
     * @function encode
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {IClubSUserNoticeResp} message ClubSUserNoticeResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.arrNotices != null && message.arrNotices.length)
            for (var i = 0; i < message.arrNotices.length; ++i)
                $root.ClubSNoticesItem.encode(message.arrNotices[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nAllCnt);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nType);
        if (message.arrApplyList != null && message.arrApplyList.length)
            for (var i = 0; i < message.arrApplyList.length; ++i)
                $root.ClubSPersonApply.encode(message.arrApplyList[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.nUnReadCnt != null && Object.hasOwnProperty.call(message, "nUnReadCnt"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nUnReadCnt);
        return writer;
    };

    /**
     * Encodes the specified ClubSUserNoticeResp message, length delimited. Does not implicitly {@link ClubSUserNoticeResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {IClubSUserNoticeResp} message ClubSUserNoticeResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSUserNoticeResp message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSUserNoticeResp} ClubSUserNoticeResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSUserNoticeResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.arrNotices && message.arrNotices.length))
                    message.arrNotices = [];
                message.arrNotices.push($root.ClubSNoticesItem.decode(reader, reader.uint32()));
                break;
            case 2:
                message.nAllCnt = reader.int32();
                break;
            case 3:
                message.nType = reader.int32();
                break;
            case 4:
                if (!(message.arrApplyList && message.arrApplyList.length))
                    message.arrApplyList = [];
                message.arrApplyList.push($root.ClubSPersonApply.decode(reader, reader.uint32()));
                break;
            case 5:
                message.nUnReadCnt = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nAllCnt"))
            throw $util.ProtocolError("missing required 'nAllCnt'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSUserNoticeResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSUserNoticeResp} ClubSUserNoticeResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSUserNoticeResp message.
     * @function verify
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSUserNoticeResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.arrNotices != null && message.hasOwnProperty("arrNotices")) {
            if (!Array.isArray(message.arrNotices))
                return "arrNotices: array expected";
            for (var i = 0; i < message.arrNotices.length; ++i) {
                var error = $root.ClubSNoticesItem.verify(message.arrNotices[i]);
                if (error)
                    return "arrNotices." + error;
            }
        }
        if (!$util.isInteger(message.nAllCnt))
            return "nAllCnt: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (message.arrApplyList != null && message.hasOwnProperty("arrApplyList")) {
            if (!Array.isArray(message.arrApplyList))
                return "arrApplyList: array expected";
            for (var i = 0; i < message.arrApplyList.length; ++i) {
                var error = $root.ClubSPersonApply.verify(message.arrApplyList[i]);
                if (error)
                    return "arrApplyList." + error;
            }
        }
        if (message.nUnReadCnt != null && message.hasOwnProperty("nUnReadCnt"))
            if (!$util.isInteger(message.nUnReadCnt))
                return "nUnReadCnt: integer expected";
        return null;
    };

    /**
     * Creates a ClubSUserNoticeResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSUserNoticeResp} ClubSUserNoticeResp
     */
    ClubSUserNoticeResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSUserNoticeResp)
            return object;
        var message = new $root.ClubSUserNoticeResp();
        if (object.arrNotices) {
            if (!Array.isArray(object.arrNotices))
                throw TypeError(".ClubSUserNoticeResp.arrNotices: array expected");
            message.arrNotices = [];
            for (var i = 0; i < object.arrNotices.length; ++i) {
                if (typeof object.arrNotices[i] !== "object")
                    throw TypeError(".ClubSUserNoticeResp.arrNotices: object expected");
                message.arrNotices[i] = $root.ClubSNoticesItem.fromObject(object.arrNotices[i]);
            }
        }
        if (object.nAllCnt != null)
            message.nAllCnt = object.nAllCnt | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.arrApplyList) {
            if (!Array.isArray(object.arrApplyList))
                throw TypeError(".ClubSUserNoticeResp.arrApplyList: array expected");
            message.arrApplyList = [];
            for (var i = 0; i < object.arrApplyList.length; ++i) {
                if (typeof object.arrApplyList[i] !== "object")
                    throw TypeError(".ClubSUserNoticeResp.arrApplyList: object expected");
                message.arrApplyList[i] = $root.ClubSPersonApply.fromObject(object.arrApplyList[i]);
            }
        }
        if (object.nUnReadCnt != null)
            message.nUnReadCnt = object.nUnReadCnt | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubSUserNoticeResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSUserNoticeResp
     * @static
     * @param {ClubSUserNoticeResp} message ClubSUserNoticeResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSUserNoticeResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.arrNotices = [];
            object.arrApplyList = [];
        }
        if (options.defaults) {
            object.nAllCnt = 0;
            object.nType = 0;
            object.nUnReadCnt = 0;
        }
        if (message.arrNotices && message.arrNotices.length) {
            object.arrNotices = [];
            for (var j = 0; j < message.arrNotices.length; ++j)
                object.arrNotices[j] = $root.ClubSNoticesItem.toObject(message.arrNotices[j], options);
        }
        if (message.nAllCnt != null && message.hasOwnProperty("nAllCnt"))
            object.nAllCnt = message.nAllCnt;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.arrApplyList && message.arrApplyList.length) {
            object.arrApplyList = [];
            for (var j = 0; j < message.arrApplyList.length; ++j)
                object.arrApplyList[j] = $root.ClubSPersonApply.toObject(message.arrApplyList[j], options);
        }
        if (message.nUnReadCnt != null && message.hasOwnProperty("nUnReadCnt"))
            object.nUnReadCnt = message.nUnReadCnt;
        return object;
    };

    /**
     * Converts this ClubSUserNoticeResp to JSON.
     * @function toJSON
     * @memberof ClubSUserNoticeResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSUserNoticeResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSUserNoticeResp;
})();

$root.ClubSPersonApply = (function() {

    /**
     * Properties of a ClubSPersonApply.
     * @exports IClubSPersonApply
     * @interface IClubSPersonApply
     * @property {number} nId ClubSPersonApply nId
     * @property {number} nClubId ClubSPersonApply nClubId
     * @property {string} sClubName ClubSPersonApply sClubName
     * @property {string} sTime ClubSPersonApply sTime
     * @property {number} nType ClubSPersonApply nType
     * @property {number} nStatus ClubSPersonApply nStatus
     * @property {number|null} [nChange] ClubSPersonApply nChange
     */

    /**
     * Constructs a new ClubSPersonApply.
     * @exports ClubSPersonApply
     * @classdesc Represents a ClubSPersonApply.
     * @implements IClubSPersonApply
     * @constructor
     * @param {IClubSPersonApply=} [properties] Properties to set
     */
    function ClubSPersonApply(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubSPersonApply nId.
     * @member {number} nId
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.nId = 0;

    /**
     * ClubSPersonApply nClubId.
     * @member {number} nClubId
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.nClubId = 0;

    /**
     * ClubSPersonApply sClubName.
     * @member {string} sClubName
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.sClubName = "";

    /**
     * ClubSPersonApply sTime.
     * @member {string} sTime
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.sTime = "";

    /**
     * ClubSPersonApply nType.
     * @member {number} nType
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.nType = 0;

    /**
     * ClubSPersonApply nStatus.
     * @member {number} nStatus
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.nStatus = 0;

    /**
     * ClubSPersonApply nChange.
     * @member {number} nChange
     * @memberof ClubSPersonApply
     * @instance
     */
    ClubSPersonApply.prototype.nChange = 0;

    /**
     * Creates a new ClubSPersonApply instance using the specified properties.
     * @function create
     * @memberof ClubSPersonApply
     * @static
     * @param {IClubSPersonApply=} [properties] Properties to set
     * @returns {ClubSPersonApply} ClubSPersonApply instance
     */
    ClubSPersonApply.create = function create(properties) {
        return new ClubSPersonApply(properties);
    };

    /**
     * Encodes the specified ClubSPersonApply message. Does not implicitly {@link ClubSPersonApply.verify|verify} messages.
     * @function encode
     * @memberof ClubSPersonApply
     * @static
     * @param {IClubSPersonApply} message ClubSPersonApply message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSPersonApply.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nId);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nClubId);
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sClubName);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.sTime);
        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nType);
        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.nStatus);
        if (message.nChange != null && Object.hasOwnProperty.call(message, "nChange"))
            writer.uint32(/* id 7, wireType 1 =*/57).double(message.nChange);
        return writer;
    };

    /**
     * Encodes the specified ClubSPersonApply message, length delimited. Does not implicitly {@link ClubSPersonApply.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSPersonApply
     * @static
     * @param {IClubSPersonApply} message ClubSPersonApply message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSPersonApply.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSPersonApply message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSPersonApply
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSPersonApply} ClubSPersonApply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSPersonApply.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSPersonApply();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nId = reader.int32();
                break;
            case 2:
                message.nClubId = reader.int32();
                break;
            case 3:
                message.sClubName = reader.string();
                break;
            case 4:
                message.sTime = reader.string();
                break;
            case 5:
                message.nType = reader.int32();
                break;
            case 6:
                message.nStatus = reader.int32();
                break;
            case 7:
                message.nChange = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nId"))
            throw $util.ProtocolError("missing required 'nId'", { instance: message });
        if (!message.hasOwnProperty("nClubId"))
            throw $util.ProtocolError("missing required 'nClubId'", { instance: message });
        if (!message.hasOwnProperty("sClubName"))
            throw $util.ProtocolError("missing required 'sClubName'", { instance: message });
        if (!message.hasOwnProperty("sTime"))
            throw $util.ProtocolError("missing required 'sTime'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        if (!message.hasOwnProperty("nStatus"))
            throw $util.ProtocolError("missing required 'nStatus'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSPersonApply message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSPersonApply
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSPersonApply} ClubSPersonApply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSPersonApply.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSPersonApply message.
     * @function verify
     * @memberof ClubSPersonApply
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSPersonApply.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nId))
            return "nId: integer expected";
        if (!$util.isInteger(message.nClubId))
            return "nClubId: integer expected";
        if (!$util.isString(message.sClubName))
            return "sClubName: string expected";
        if (!$util.isString(message.sTime))
            return "sTime: string expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (!$util.isInteger(message.nStatus))
            return "nStatus: integer expected";
        if (message.nChange != null && message.hasOwnProperty("nChange"))
            if (typeof message.nChange !== "number")
                return "nChange: number expected";
        return null;
    };

    /**
     * Creates a ClubSPersonApply message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSPersonApply
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSPersonApply} ClubSPersonApply
     */
    ClubSPersonApply.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSPersonApply)
            return object;
        var message = new $root.ClubSPersonApply();
        if (object.nId != null)
            message.nId = object.nId | 0;
        if (object.nClubId != null)
            message.nClubId = object.nClubId | 0;
        if (object.sClubName != null)
            message.sClubName = String(object.sClubName);
        if (object.sTime != null)
            message.sTime = String(object.sTime);
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nStatus != null)
            message.nStatus = object.nStatus | 0;
        if (object.nChange != null)
            message.nChange = Number(object.nChange);
        return message;
    };

    /**
     * Creates a plain object from a ClubSPersonApply message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSPersonApply
     * @static
     * @param {ClubSPersonApply} message ClubSPersonApply
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSPersonApply.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nId = 0;
            object.nClubId = 0;
            object.sClubName = "";
            object.sTime = "";
            object.nType = 0;
            object.nStatus = 0;
            object.nChange = 0;
        }
        if (message.nId != null && message.hasOwnProperty("nId"))
            object.nId = message.nId;
        if (message.nClubId != null && message.hasOwnProperty("nClubId"))
            object.nClubId = message.nClubId;
        if (message.sClubName != null && message.hasOwnProperty("sClubName"))
            object.sClubName = message.sClubName;
        if (message.sTime != null && message.hasOwnProperty("sTime"))
            object.sTime = message.sTime;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nStatus != null && message.hasOwnProperty("nStatus"))
            object.nStatus = message.nStatus;
        if (message.nChange != null && message.hasOwnProperty("nChange"))
            object.nChange = options.json && !isFinite(message.nChange) ? String(message.nChange) : message.nChange;
        return object;
    };

    /**
     * Converts this ClubSPersonApply to JSON.
     * @function toJSON
     * @memberof ClubSPersonApply
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSPersonApply.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSPersonApply;
})();

$root.ClubSNoticesItem = (function() {

    /**
     * Properties of a ClubSNoticesItem.
     * @exports IClubSNoticesItem
     * @interface IClubSNoticesItem
     * @property {number} nId ClubSNoticesItem nId
     * @property {number} nType ClubSNoticesItem nType
     * @property {number} nStatus ClubSNoticesItem nStatus
     * @property {string} sTime ClubSNoticesItem sTime
     * @property {string} sData ClubSNoticesItem sData
     * @property {number|null} [nHadRead] ClubSNoticesItem nHadRead
     */

    /**
     * Constructs a new ClubSNoticesItem.
     * @exports ClubSNoticesItem
     * @classdesc Represents a ClubSNoticesItem.
     * @implements IClubSNoticesItem
     * @constructor
     * @param {IClubSNoticesItem=} [properties] Properties to set
     */
    function ClubSNoticesItem(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubSNoticesItem nId.
     * @member {number} nId
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.nId = 0;

    /**
     * ClubSNoticesItem nType.
     * @member {number} nType
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.nType = 0;

    /**
     * ClubSNoticesItem nStatus.
     * @member {number} nStatus
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.nStatus = 0;

    /**
     * ClubSNoticesItem sTime.
     * @member {string} sTime
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.sTime = "";

    /**
     * ClubSNoticesItem sData.
     * @member {string} sData
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.sData = "";

    /**
     * ClubSNoticesItem nHadRead.
     * @member {number} nHadRead
     * @memberof ClubSNoticesItem
     * @instance
     */
    ClubSNoticesItem.prototype.nHadRead = 0;

    /**
     * Creates a new ClubSNoticesItem instance using the specified properties.
     * @function create
     * @memberof ClubSNoticesItem
     * @static
     * @param {IClubSNoticesItem=} [properties] Properties to set
     * @returns {ClubSNoticesItem} ClubSNoticesItem instance
     */
    ClubSNoticesItem.create = function create(properties) {
        return new ClubSNoticesItem(properties);
    };

    /**
     * Encodes the specified ClubSNoticesItem message. Does not implicitly {@link ClubSNoticesItem.verify|verify} messages.
     * @function encode
     * @memberof ClubSNoticesItem
     * @static
     * @param {IClubSNoticesItem} message ClubSNoticesItem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSNoticesItem.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nId);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nType);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nStatus);
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.sTime);
        writer.uint32(/* id 5, wireType 2 =*/42).string(message.sData);
        if (message.nHadRead != null && Object.hasOwnProperty.call(message, "nHadRead"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.nHadRead);
        return writer;
    };

    /**
     * Encodes the specified ClubSNoticesItem message, length delimited. Does not implicitly {@link ClubSNoticesItem.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSNoticesItem
     * @static
     * @param {IClubSNoticesItem} message ClubSNoticesItem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSNoticesItem.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSNoticesItem message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSNoticesItem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSNoticesItem} ClubSNoticesItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSNoticesItem.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSNoticesItem();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nId = reader.int32();
                break;
            case 2:
                message.nType = reader.int32();
                break;
            case 3:
                message.nStatus = reader.int32();
                break;
            case 4:
                message.sTime = reader.string();
                break;
            case 5:
                message.sData = reader.string();
                break;
            case 6:
                message.nHadRead = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nId"))
            throw $util.ProtocolError("missing required 'nId'", { instance: message });
        if (!message.hasOwnProperty("nType"))
            throw $util.ProtocolError("missing required 'nType'", { instance: message });
        if (!message.hasOwnProperty("nStatus"))
            throw $util.ProtocolError("missing required 'nStatus'", { instance: message });
        if (!message.hasOwnProperty("sTime"))
            throw $util.ProtocolError("missing required 'sTime'", { instance: message });
        if (!message.hasOwnProperty("sData"))
            throw $util.ProtocolError("missing required 'sData'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSNoticesItem message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSNoticesItem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSNoticesItem} ClubSNoticesItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSNoticesItem.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSNoticesItem message.
     * @function verify
     * @memberof ClubSNoticesItem
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSNoticesItem.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nId))
            return "nId: integer expected";
        if (!$util.isInteger(message.nType))
            return "nType: integer expected";
        if (!$util.isInteger(message.nStatus))
            return "nStatus: integer expected";
        if (!$util.isString(message.sTime))
            return "sTime: string expected";
        if (!$util.isString(message.sData))
            return "sData: string expected";
        if (message.nHadRead != null && message.hasOwnProperty("nHadRead"))
            if (!$util.isInteger(message.nHadRead))
                return "nHadRead: integer expected";
        return null;
    };

    /**
     * Creates a ClubSNoticesItem message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSNoticesItem
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSNoticesItem} ClubSNoticesItem
     */
    ClubSNoticesItem.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSNoticesItem)
            return object;
        var message = new $root.ClubSNoticesItem();
        if (object.nId != null)
            message.nId = object.nId | 0;
        if (object.nType != null)
            message.nType = object.nType | 0;
        if (object.nStatus != null)
            message.nStatus = object.nStatus | 0;
        if (object.sTime != null)
            message.sTime = String(object.sTime);
        if (object.sData != null)
            message.sData = String(object.sData);
        if (object.nHadRead != null)
            message.nHadRead = object.nHadRead | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubSNoticesItem message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSNoticesItem
     * @static
     * @param {ClubSNoticesItem} message ClubSNoticesItem
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSNoticesItem.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nId = 0;
            object.nType = 0;
            object.nStatus = 0;
            object.sTime = "";
            object.sData = "";
            object.nHadRead = 0;
        }
        if (message.nId != null && message.hasOwnProperty("nId"))
            object.nId = message.nId;
        if (message.nType != null && message.hasOwnProperty("nType"))
            object.nType = message.nType;
        if (message.nStatus != null && message.hasOwnProperty("nStatus"))
            object.nStatus = message.nStatus;
        if (message.sTime != null && message.hasOwnProperty("sTime"))
            object.sTime = message.sTime;
        if (message.sData != null && message.hasOwnProperty("sData"))
            object.sData = message.sData;
        if (message.nHadRead != null && message.hasOwnProperty("nHadRead"))
            object.nHadRead = message.nHadRead;
        return object;
    };

    /**
     * Converts this ClubSNoticesItem to JSON.
     * @function toJSON
     * @memberof ClubSNoticesItem
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSNoticesItem.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSNoticesItem;
})();

$root.ClubSUserNoticeHandleReq = (function() {

    /**
     * Properties of a ClubSUserNoticeHandleReq.
     * @exports IClubSUserNoticeHandleReq
     * @interface IClubSUserNoticeHandleReq
     * @property {number} nId ClubSUserNoticeHandleReq nId
     * @property {number} nOpType ClubSUserNoticeHandleReq nOpType
     */

    /**
     * Constructs a new ClubSUserNoticeHandleReq.
     * @exports ClubSUserNoticeHandleReq
     * @classdesc Represents a ClubSUserNoticeHandleReq.
     * @implements IClubSUserNoticeHandleReq
     * @constructor
     * @param {IClubSUserNoticeHandleReq=} [properties] Properties to set
     */
    function ClubSUserNoticeHandleReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubSUserNoticeHandleReq nId.
     * @member {number} nId
     * @memberof ClubSUserNoticeHandleReq
     * @instance
     */
    ClubSUserNoticeHandleReq.prototype.nId = 0;

    /**
     * ClubSUserNoticeHandleReq nOpType.
     * @member {number} nOpType
     * @memberof ClubSUserNoticeHandleReq
     * @instance
     */
    ClubSUserNoticeHandleReq.prototype.nOpType = 0;

    /**
     * Creates a new ClubSUserNoticeHandleReq instance using the specified properties.
     * @function create
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {IClubSUserNoticeHandleReq=} [properties] Properties to set
     * @returns {ClubSUserNoticeHandleReq} ClubSUserNoticeHandleReq instance
     */
    ClubSUserNoticeHandleReq.create = function create(properties) {
        return new ClubSUserNoticeHandleReq(properties);
    };

    /**
     * Encodes the specified ClubSUserNoticeHandleReq message. Does not implicitly {@link ClubSUserNoticeHandleReq.verify|verify} messages.
     * @function encode
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {IClubSUserNoticeHandleReq} message ClubSUserNoticeHandleReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeHandleReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nId);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nOpType);
        return writer;
    };

    /**
     * Encodes the specified ClubSUserNoticeHandleReq message, length delimited. Does not implicitly {@link ClubSUserNoticeHandleReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {IClubSUserNoticeHandleReq} message ClubSUserNoticeHandleReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeHandleReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSUserNoticeHandleReq message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSUserNoticeHandleReq} ClubSUserNoticeHandleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeHandleReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSUserNoticeHandleReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nId = reader.int32();
                break;
            case 2:
                message.nOpType = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nId"))
            throw $util.ProtocolError("missing required 'nId'", { instance: message });
        if (!message.hasOwnProperty("nOpType"))
            throw $util.ProtocolError("missing required 'nOpType'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSUserNoticeHandleReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSUserNoticeHandleReq} ClubSUserNoticeHandleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeHandleReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSUserNoticeHandleReq message.
     * @function verify
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSUserNoticeHandleReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nId))
            return "nId: integer expected";
        if (!$util.isInteger(message.nOpType))
            return "nOpType: integer expected";
        return null;
    };

    /**
     * Creates a ClubSUserNoticeHandleReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSUserNoticeHandleReq} ClubSUserNoticeHandleReq
     */
    ClubSUserNoticeHandleReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSUserNoticeHandleReq)
            return object;
        var message = new $root.ClubSUserNoticeHandleReq();
        if (object.nId != null)
            message.nId = object.nId | 0;
        if (object.nOpType != null)
            message.nOpType = object.nOpType | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubSUserNoticeHandleReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSUserNoticeHandleReq
     * @static
     * @param {ClubSUserNoticeHandleReq} message ClubSUserNoticeHandleReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSUserNoticeHandleReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nId = 0;
            object.nOpType = 0;
        }
        if (message.nId != null && message.hasOwnProperty("nId"))
            object.nId = message.nId;
        if (message.nOpType != null && message.hasOwnProperty("nOpType"))
            object.nOpType = message.nOpType;
        return object;
    };

    /**
     * Converts this ClubSUserNoticeHandleReq to JSON.
     * @function toJSON
     * @memberof ClubSUserNoticeHandleReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSUserNoticeHandleReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSUserNoticeHandleReq;
})();

$root.ClubSUserNoticeHandleResp = (function() {

    /**
     * Properties of a ClubSUserNoticeHandleResp.
     * @exports IClubSUserNoticeHandleResp
     * @interface IClubSUserNoticeHandleResp
     * @property {number} nRlt ClubSUserNoticeHandleResp nRlt
     * @property {string} sErrStr ClubSUserNoticeHandleResp sErrStr
     * @property {number} nId ClubSUserNoticeHandleResp nId
     * @property {number} nOpType ClubSUserNoticeHandleResp nOpType
     */

    /**
     * Constructs a new ClubSUserNoticeHandleResp.
     * @exports ClubSUserNoticeHandleResp
     * @classdesc Represents a ClubSUserNoticeHandleResp.
     * @implements IClubSUserNoticeHandleResp
     * @constructor
     * @param {IClubSUserNoticeHandleResp=} [properties] Properties to set
     */
    function ClubSUserNoticeHandleResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClubSUserNoticeHandleResp nRlt.
     * @member {number} nRlt
     * @memberof ClubSUserNoticeHandleResp
     * @instance
     */
    ClubSUserNoticeHandleResp.prototype.nRlt = 0;

    /**
     * ClubSUserNoticeHandleResp sErrStr.
     * @member {string} sErrStr
     * @memberof ClubSUserNoticeHandleResp
     * @instance
     */
    ClubSUserNoticeHandleResp.prototype.sErrStr = "";

    /**
     * ClubSUserNoticeHandleResp nId.
     * @member {number} nId
     * @memberof ClubSUserNoticeHandleResp
     * @instance
     */
    ClubSUserNoticeHandleResp.prototype.nId = 0;

    /**
     * ClubSUserNoticeHandleResp nOpType.
     * @member {number} nOpType
     * @memberof ClubSUserNoticeHandleResp
     * @instance
     */
    ClubSUserNoticeHandleResp.prototype.nOpType = 0;

    /**
     * Creates a new ClubSUserNoticeHandleResp instance using the specified properties.
     * @function create
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {IClubSUserNoticeHandleResp=} [properties] Properties to set
     * @returns {ClubSUserNoticeHandleResp} ClubSUserNoticeHandleResp instance
     */
    ClubSUserNoticeHandleResp.create = function create(properties) {
        return new ClubSUserNoticeHandleResp(properties);
    };

    /**
     * Encodes the specified ClubSUserNoticeHandleResp message. Does not implicitly {@link ClubSUserNoticeHandleResp.verify|verify} messages.
     * @function encode
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {IClubSUserNoticeHandleResp} message ClubSUserNoticeHandleResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeHandleResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nRlt);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sErrStr);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.nId);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.nOpType);
        return writer;
    };

    /**
     * Encodes the specified ClubSUserNoticeHandleResp message, length delimited. Does not implicitly {@link ClubSUserNoticeHandleResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {IClubSUserNoticeHandleResp} message ClubSUserNoticeHandleResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClubSUserNoticeHandleResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClubSUserNoticeHandleResp message from the specified reader or buffer.
     * @function decode
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClubSUserNoticeHandleResp} ClubSUserNoticeHandleResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeHandleResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClubSUserNoticeHandleResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nRlt = reader.int32();
                break;
            case 2:
                message.sErrStr = reader.string();
                break;
            case 3:
                message.nId = reader.int32();
                break;
            case 4:
                message.nOpType = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("nRlt"))
            throw $util.ProtocolError("missing required 'nRlt'", { instance: message });
        if (!message.hasOwnProperty("sErrStr"))
            throw $util.ProtocolError("missing required 'sErrStr'", { instance: message });
        if (!message.hasOwnProperty("nId"))
            throw $util.ProtocolError("missing required 'nId'", { instance: message });
        if (!message.hasOwnProperty("nOpType"))
            throw $util.ProtocolError("missing required 'nOpType'", { instance: message });
        return message;
    };

    /**
     * Decodes a ClubSUserNoticeHandleResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClubSUserNoticeHandleResp} ClubSUserNoticeHandleResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClubSUserNoticeHandleResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClubSUserNoticeHandleResp message.
     * @function verify
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClubSUserNoticeHandleResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isInteger(message.nRlt))
            return "nRlt: integer expected";
        if (!$util.isString(message.sErrStr))
            return "sErrStr: string expected";
        if (!$util.isInteger(message.nId))
            return "nId: integer expected";
        if (!$util.isInteger(message.nOpType))
            return "nOpType: integer expected";
        return null;
    };

    /**
     * Creates a ClubSUserNoticeHandleResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClubSUserNoticeHandleResp} ClubSUserNoticeHandleResp
     */
    ClubSUserNoticeHandleResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ClubSUserNoticeHandleResp)
            return object;
        var message = new $root.ClubSUserNoticeHandleResp();
        if (object.nRlt != null)
            message.nRlt = object.nRlt | 0;
        if (object.sErrStr != null)
            message.sErrStr = String(object.sErrStr);
        if (object.nId != null)
            message.nId = object.nId | 0;
        if (object.nOpType != null)
            message.nOpType = object.nOpType | 0;
        return message;
    };

    /**
     * Creates a plain object from a ClubSUserNoticeHandleResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClubSUserNoticeHandleResp
     * @static
     * @param {ClubSUserNoticeHandleResp} message ClubSUserNoticeHandleResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClubSUserNoticeHandleResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.nRlt = 0;
            object.sErrStr = "";
            object.nId = 0;
            object.nOpType = 0;
        }
        if (message.nRlt != null && message.hasOwnProperty("nRlt"))
            object.nRlt = message.nRlt;
        if (message.sErrStr != null && message.hasOwnProperty("sErrStr"))
            object.sErrStr = message.sErrStr;
        if (message.nId != null && message.hasOwnProperty("nId"))
            object.nId = message.nId;
        if (message.nOpType != null && message.hasOwnProperty("nOpType"))
            object.nOpType = message.nOpType;
        return object;
    };

    /**
     * Converts this ClubSUserNoticeHandleResp to JSON.
     * @function toJSON
     * @memberof ClubSUserNoticeHandleResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClubSUserNoticeHandleResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClubSUserNoticeHandleResp;
})();

module.exports = $root;
