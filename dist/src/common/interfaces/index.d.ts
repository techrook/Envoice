import { Request } from 'express';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHERS = "others"
}
export declare enum ResponseMessage {
    SUCCESS = "Request Successful!",
    FAILED = "Request Failed!"
}
export declare enum SortDirection {
    ASC = "asc",
    DESC = "desc"
}
export interface RequestUser extends Request {
    user: JwtPayload;
}
export interface JwtPayload {
    sub: string;
    userId: string;
    username: string;
    iat: number;
    exp: number;
}
export declare enum AuthStrategyType {
    JWT = "jwt",
    HTTP_BEARER = "http-bearer",
    PUBLIC = "public"
}
export interface RequestWithUser extends Request {
    user: JwtPayload;
}
export interface SessionOptions {
    sessionType?: string;
    userId?: string;
}
