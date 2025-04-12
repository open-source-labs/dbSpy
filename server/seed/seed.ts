import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import log from '../logger/index';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
// Connect to SQL db and create users table
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
      \`type\` varchar(40) DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`FOREIGN\` (\`email\`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`;
  try {
    console.log('🔹 Seeding createUserTable...');
    await connection.promise().query(createUserTable);
    console.log('🌱 users table seeded!');
  } catch (err) {
    log.info(err);
  }

  const createQueriesTable: string = `CREATE TABLE 
  \`queries\` (
    \`id\` int unsigned NOT NULL AUTO_INCREMENT,
    \`email\` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`query\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`db_link\` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`db_name\` varchar(40) NOT NULL,
    \`exec_time\` double NOT NULL,
    \`query_date\` date DEFAULT NULL,
    \`name\` varchar(40) DEFAULT NULL,
    \`planning_time\` double NOT NULL,
    \`total_cost\` double NOT NULL,
    \`actual_total_time\` double NOT NULL,
    \`node_type\` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`relation_name\` varchar(240) NOT NULL,
    \`plan_rows\` int NOT NULL,
    \`actual_rows\` int NOT NULL,
    \`shared_hit_blocks\` int NOT NULL,
    \`shared_read_blocks\` int NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`email_queries\` (\`email\`),
  CONSTRAINT \`email_queries\` FOREIGN KEY (\`email\`) REFERENCES \`users\` (\`email\`))`;
  try {
    console.log('🔹 Seeding createSaveQueriesTable...');
    await connection.promise().query(createQueriesTable);
    console.log('🌱 save queries table seeded!');
  } catch (err) {
    log.info(err);
  }

  const createSavedDbTable: string = `CREATE TABLE 
  \`saveddb\` (
    \`id\` int unsigned NOT NULL AUTO_INCREMENT,
    \`SaveName\` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`email\` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`SaveData\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    \`TableData\` text,
  PRIMARY KEY (\`id\`),
  KEY \`email\` (\`email\`),
  CONSTRAINT \`email\` FOREIGN KEY (\`email\`) REFERENCES \`users\` (\`email\`))`;
  try {
    console.log('🔹 Seeding createSavedDbTable...');
    await connection.promise().query(createSavedDbTable);
    console.log('🌱 saveddb table seeded!');
  } catch (err) {
    log.info(err);
  } finally {
    connection.end(); // close connection after execution
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
