import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UserModel = db.define('users', {
    name: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    }
});

export default UserModel;