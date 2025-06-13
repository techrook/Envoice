declare class EnvironmentVariables {
    PORT: string;
    APP_NAME: string;
    VERSION: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export declare const configuration: () => {
    port: number;
    appName: string;
    appRoot: string;
    version: string;
    host: string;
    FRONTEND_URL: string;
    Queue: {
        url: string;
        port: string;
        host: string;
        user: string;
        pass: string;
        db: string;
    };
    Twitter: {
        consumerKey: string;
        consumerSecret: string;
        callbackURL: string;
    };
};
export {};
