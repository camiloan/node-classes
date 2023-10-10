import { Sequelize } from 'sequelize';

const db = new Sequelize('node', 'root', 'Mok.1053347', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
