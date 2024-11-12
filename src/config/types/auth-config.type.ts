export type AuthConfig = {
  kakao: {
    apiKey: string;
    redirectUri: string;
  };
  jwt: {
    secret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  cookie: {
    secret: string;
  };
};
