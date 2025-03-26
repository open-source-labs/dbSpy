import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import log from '../logger/index';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
// // Connect to SQL db and create users table
if (!process.env.USER_DB_URL) {
  console.info('We are in the first error');
  throw new Error('USER_DB_URL not found');
}
const connection = mysql.createConnection(process.env.USER_DB_URL);

const loadData = async () => {
  console.info('we are in loadData');
  console.log(process.env.USER_DB_URL);
  console.log('Connected to database:', connection.config.database);

  const createUserTable: string = `CREATE TABLE
  \`users\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`full_name\` varchar(240) NOT NULL,
      \`sub\` varchar(40) DEFAULT NULL,
      \`email\` varchar(240) NOT NULL,
      \`picture\` varchar(240) DEFAULT NULL,
      \`pg_schema\` text,
      \`password\` varchar(240) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`;
  try {
    console.log('🔹 Executing SQL Query...');
    await connection.promise().query(createUserTable);
    console.log('data seeded!!');
  } catch (err) {
    log.info(err);
  } finally {
    connection.end(); // Close connection after execution
  }
};

loadData();

const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.USER_DB_URL,
  port: 3306,
  username: process.env.USER_DB_USER,
  password: process.env.USER_DB_PW,
  database: 'dbspy',
  entities: [User],
});

// TODO - do we still need this? Prevented db from seeding
// process.exit(0);
