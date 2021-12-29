class AppInfo {
    static PORT = process.env.APPLICATION_MODE === 'prod' ? process.env.PROD_PORT : process.env.DEV_PORT || 8080;
    static DB_URI = process.env.APPLICATION_MODE === 'prod' ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;
    static DB_LOG_URI = process.env.APPLICATION_MODE === 'prod' ? process.env.PROD_LOG_DB_URI : process.env.DEV_LOG_DB_URI;
    static MONGODB_OPTIONS = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = AppInfo;