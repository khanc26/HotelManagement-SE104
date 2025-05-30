export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3001,
  database: {
    port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  session_secret_key: process.env.SESSION_SECRET_KEY,
  access_token_life: process.env.ACCESS_TOKEN_LIFE,
  refresh_token_life: process.env.REFRESH_TOKEN_LIFE,
  origin_fe_url: process.env.ORIGIN_FE_URL,
  redis: {
    url: process.env.REDIS_URL,
  },
  vnpay: {
    tmn_code: process.env.VNPAY_TMN_CODE,
    secure_secret: process.env.VNPAY_SECURE_SECRET,
    host: process.env.VNPAY_HOST,
    return_url: process.env.VNPAY_RETURN_URL,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT ?? '587', 10),
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});
