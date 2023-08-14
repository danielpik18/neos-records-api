import { Sequelize } from "sequelize";
const db = new Sequelize('neos_records', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});
export default db;