export type PostgresConfig = {
  type?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  synchronize?: boolean;
};
