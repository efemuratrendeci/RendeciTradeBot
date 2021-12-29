//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const mongoose = require("mongoose");
const AppInfo = require('../../app/AppInfo');
const connection = mongoose.createConnection(AppInfo.DB_URI, AppInfo.MONGODB_OPTIONS);
const Schema = mongoose.Schema;
// ────────────────────────────────────────────────────────────────────────────────

const Model = connection.model(
    "balance",
    new Schema({
        coin_name: {
            type: String,
            index: {
                unique: true,
            },
        },
        coin_amount: String,
        usdt_amount: String
    }, { strict: false }, "balance"));

module.exports = Model;