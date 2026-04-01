const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  MONGO_URI: str(),
  JWT_SECRET: str(),
  CLOUD_NAME: str(),
  API_KEY: str(),
  API_SECRET: str(),
  PORT: port({ default: 5000 }),
});

module.exports = env;