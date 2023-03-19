import db from "../database/db.js";
import { DataTypes } from "sequelize";

const RefreshTokenModel = db.define('refresh_tokens', {
    token: {
        type: DataTypes.STRING
    }
});

export default RefreshTokenModel;