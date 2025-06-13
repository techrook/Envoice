"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategyType = exports.SortDirection = exports.ResponseMessage = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHERS"] = "others";
})(Gender || (exports.Gender = Gender = {}));
var ResponseMessage;
(function (ResponseMessage) {
    ResponseMessage["SUCCESS"] = "Request Successful!";
    ResponseMessage["FAILED"] = "Request Failed!";
})(ResponseMessage || (exports.ResponseMessage = ResponseMessage = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "asc";
    SortDirection["DESC"] = "desc";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
var AuthStrategyType;
(function (AuthStrategyType) {
    AuthStrategyType["JWT"] = "jwt";
    AuthStrategyType["HTTP_BEARER"] = "http-bearer";
    AuthStrategyType["PUBLIC"] = "public";
})(AuthStrategyType || (exports.AuthStrategyType = AuthStrategyType = {}));
//# sourceMappingURL=index.js.map