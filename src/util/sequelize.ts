import {Sequelize} from 'sequelize-typescript';
import { config } from '../config/config';


const c = config.dev

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host":     c.host,

  dialect: 'postgres',
  storage: ':memory:',
  define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true
  }
});

