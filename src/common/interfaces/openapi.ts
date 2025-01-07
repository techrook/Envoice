type AppApiTag = {
  [key: string]: {
    path: string;
    description: string;
  };
};
export enum ApiTag {
  AUTH = 'Auth',
}
export const AppApiTags: AppApiTag = {
  [ApiTag.AUTH]: { path: 'auth', description: 'All things authentication' },
};
