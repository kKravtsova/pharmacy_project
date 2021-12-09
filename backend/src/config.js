export default {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: Number(process.env.PG_PORT) || 5432,
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD || 'qwerty',
  PG_DATABASE: process.env.PG_DATABASE || 'postgres',
};
