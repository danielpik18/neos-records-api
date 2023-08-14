import db from "../database/db.js";
import { DataTypes } from "sequelize";

const NewsPostModel = db.define('news', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
    synopsis: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default NewsPostModel;