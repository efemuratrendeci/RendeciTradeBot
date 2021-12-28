//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const mongoose = require("mongoose");
const AppInfo = require('../../app/AppInfo');
const connection = mongoose.createConnection(AppInfo.DB_URI, AppInfo.MONGODB_OPTIONS);
const Schema = mongoose.Schema;
// ────────────────────────────────────────────────────────────────────────────────

const Model = connection.model(
    "transaction",
    new Schema({
        coin_name: String,
        coin_amount: String,
        cash_amount: String,
        currency: String,
        is_sold: Boolean
    }, { strict: false }, "transaction"));

module.exports = Model;