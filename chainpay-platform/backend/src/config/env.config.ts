const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const config = {
  node_env: getEnv("NODE_ENV", "development"),
  port: getEnv("PORT", "5000"),

  firebase: {
    projectId: getEnv("FIREBASE_PROJECT_ID"),
    clientEmail: getEnv("FIREBASE_CLIENT_EMAIL"),
    privateKey: getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },

  database: {
    url: getEnv("DATABASE_URL"),
  },

  circle: {
    apiKey: getEnv("CIRCLE_API_KEY"),
    environment: getEnv("CIRCLE_ENVIRONMENT", "sandbox"),
    entitySecret: getEnv("ENTITY_SECRET"),
  },
};
