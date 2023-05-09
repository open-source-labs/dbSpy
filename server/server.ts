import express from 'express';
import log from './logger/index'
import dotenv from 'dotenv'
import routes from './routes'
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser'
// import { DataSource } from 'typeorm';
// import { User, UserPost } from './entities/user.entity'
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

//----------------------------------------------------------------------------
// export const MysqlDataSource = new DataSource({
//     type: "mysql",
//     host: process.env.USER_DB_URL_MYSQL,
//     port: 3306,
//     username: process.env.USER_DB_USER_MYSQL,
//     password: process.env.USER_DB_PW_MYSQL,
//     database: 'dbSpy',
//     entities: [ User ],
// });

// const mysqlQuery = async () => {
//     try {
//       await MysqlDataSource.initialize();
//       console.log('Data Source has been initialized');
//       const userInfo = MysqlDataSource.getRepository(User)
//       const users = await userInfo.find();
//       console.log('users: ', users);
//     } catch (err) {
//       console.log('Error during Data Source: ', err);
//     }
//   }
  
//   //mysqlQuery();

//   export const PostgresDataSource = new DataSource({
//     type: "postgres",
//     host: process.env.USER_DB_URL_POSTGRES,
//     port: 5432,
//     username: process.env.USER_DB_USER_POSTGRES,
//     password: process.env.USER_DB_PW_POSTGRES,
//     synchronize: true,
//     logging: true,
//     entities: [ UserPost ],
// });

// const postgresQuery = async () => {
//     try {
//         await PostgresDataSource.initialize();
//         console.log('Data Source has been initialized');
//         const userInfo = PostgresDataSource.getRepository(UserPost);
//         console.log('userInfo.target: ', userInfo);
//         const tables = await userInfo.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
//         console.log('tables: ', tables);
//         for (const table of tables) {
//           const tableName = table.tablename;
//           const data = await userInfo.query(`SELECT * FROM ${tableName}`);
//           console.log(`Data from ${tableName}:`, data);
//         }
//     } catch (err) {
//       console.log('Error during Data Source: ', err);
//     }
//   }

// //   postgresQuery();
  
//----------------------------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(session({
    secret: Math.floor(Math.random() * 1000000).toString(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
         httpOnly: true,
         path: '/',
         sameSite: true,
         expires: undefined 
        }, 
  }));


app.listen(3000, () => {
    log.info(`Securely Running at ${port}`);
    routes(app);
});

export default app;