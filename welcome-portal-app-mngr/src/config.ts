export default {
    API_PATH: process.env.API_PATH ?? '/',
    PORT: process.env.PORT ?? '3000',
    leadUserTableName: 'CME-POTENTIAL-CUSTOMERS',
    REGION: process.env.REGION ?? 'us-east-1',
    ENV: process.env.NODE_ENV ?? 'LOCAL',
};
