//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const mongoose = require("mongoose");
const AppInfo = require('../../app/AppInfo');
const connection = mongoose.createConnection(AppInfo.DB_URI, AppInfo.MONGODB_OPTIONS);
const Schema = mongoose.Schema;
// ────────────────────────────────────────────────────────────────────────────────

const Model = connection.model(
    "user_preference",
    new Schema({
        coin_name: {
            type: String,
            default: 'AVAX',
            index: {
                unique: true,
            },
        },
        lose_risk_rate: String,
        min_win_rate: String,
    }, { strict: false }, "user_preference"));

module.exports = Model;