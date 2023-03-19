import db from "../database/db.js";
import { DataTypes } from "sequelize";

const NewsPostModel = db.define('news', {
    title: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    image_path: {
        type: DataTypes.STRING
    },
});

export default NewsPostModel;