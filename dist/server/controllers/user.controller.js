"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveSchema = exports.saveSchema = exports.verifyUser = exports.userRegistration = exports.createUser = exports.findUser = void 0;
const index_1 = __importDefault(require("../logger/index"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 5;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// find user via email
const findUser = async (email) => {
    index_1.default.info('Finding user (helper function)');
    const queryStr = 'SELECT * FROM users WHERE email = ?';
    return userModel_1.default.query(queryStr, [email]);
};
exports.findUser = findUser;
// Creating user via Google OAuth
const createUser = async (user) => {
    index_1.default.info('Creating user (helper function)');
    const queryStr = 'INSERT IGNORE INTO users (sub, full_name, email, picture) VALUES (?, ?, ?, ?)';
    userModel_1.default
        .query(queryStr, user)
        .then(() => index_1.default.info('createUser: successfully created User'))
        .catch((err) => {
        index_1.default.error("This is the error in createUser: ", err);
        throw new Error('Error on createUser: Could not create new user on DB.');
    });
};
exports.createUser = createUser;
// Register w/o OAuth
const userRegistration = async (req, res, next) => {
    index_1.default.info('Registering user (middleware)');
    const foundUser = (await (0, exports.findUser)(req.body.email));
    if (foundUser[0].length)
        return res.status(403).json({ err: 'Email already in use' });
    const { full_name, email, password } = req.body;
    // console.log(typeof full_name, typeof email, typeof password)
    if (typeof full_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string')
        return next({
            log: 'Error in user.controller.userRegistration',
            status: 400,
            message: 'err: User data must be strings',
        });
    const hashedPw = await bcrypt_1.default.hash(password, saltRounds);
    const queryStr = 'INSERT IGNORE INTO users (full_name, email, password) VALUES (?, ?, ?)';
    userModel_1.default
        .query(queryStr, [full_name, email, hashedPw])
        .then(() => {
        index_1.default.info(`${email} successfully registered`);
        return res.redirect(200, '/');
    })
        .catch((err) => next(err));
};
exports.userRegistration = userRegistration;
const verifyUser = async (req, res, next) => {
    index_1.default.info('Verifying user (middleware)');
    //check if login is from Oauth2 and add to database
    if (typeof req.body.code === 'string') {
        if (res.locals.userInfo.type === 'google') { //for Google
            const { id, email, verified_email, name, picture, type } = res.locals.userInfo;
            const queryStr = 'INSERT IGNORE INTO users (full_name, email , password , picture, type) VALUES (?,?,?,?,?)';
            const hashedPw = id.toString();
            if (verified_email) {
                const addUser = await userModel_1.default.query(queryStr, [name, email, hashedPw, picture, type]);
                index_1.default.info('verified or added Oauth User');
                const foundUser = (await (0, exports.findUser)(email));
                index_1.default.info('found user');
                res.locals.user = foundUser[0][0];
                console.log(res.locals.user);
                return res.status(200).json(res.locals.user);
            }
            else {
                index_1.default.error('Error in verifyUser OAUTH');
                next(`Email not verified`);
            }
        }
        else { // for GITHUB
            const { login, id, url, avatar_url, type } = res.locals.userInfo;
            const queryStr = 'INSERT IGNORE INTO users (full_name, email , password , picture, type) VALUES (?,?,?,?,?)';
            let hashedPw;
            //fix bcrypt bug
            if (id) {
                hashedPw = id.toString();
            }
            else {
                hashedPw = 'default';
            }
            ;
            console.log(hashedPw);
            const addUser = await userModel_1.default.query(queryStr, [login, url, hashedPw, avatar_url, type]);
            index_1.default.info('verified or added Oauth User');
            const foundUser = (await (0, exports.findUser)(url));
            index_1.default.info('found user');
            res.locals.user = foundUser[0][0];
            console.log(res.locals.user);
            return res.status(200).json(res.locals.user);
        }
    }
    //other use regular login  methods
    else {
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string')
            return next({
                log: 'Error in user.controller.userRegistration',
                status: 400,
                message: 'err: User data must be strings',
            });
        // foundUser structure: [[RowDataPackets], [metadata]]
        const foundUser = (await (0, exports.findUser)(req.body.email));
        // verify user exists in db
        if (!foundUser[0][0]) {
            index_1.default.error('Email address not found');
            return res.status(401).json({ err: 'Email address not found' });
        }
        // check for pw match
        const hashedPW = foundUser[0][0]?.password;
        const match = await bcrypt_1.default.compare(req.body.password, hashedPW);
        if (match) {
            index_1.default.info('Username/Password confirmed');
            res.locals.user = foundUser[0][0];
            console.log(res.locals.user);
            return res.status(200).json(res.locals.user);
        }
        else {
            index_1.default.error('Incorrect password');
            return res.redirect(401, '/login');
        }
    }
};
exports.verifyUser = verifyUser;
// Save currentSchema into database
const saveSchema = async (req, res, next) => {
    index_1.default.info(`Saving user's schema (middleware)`);
    if (typeof req.body.email !== 'string' || typeof req.body.schema !== 'string')
        return next({
            log: 'Error in user.controller.userRegistration',
            status: 400,
            message: 'err: User data must be strings',
        });
    const updateColQuery = `UPDATE users SET pg_schema = '${req.body.schema}' WHERE email = '${req.body.email}';`;
    userModel_1.default
        .query(updateColQuery)
        .then(() => {
        index_1.default.info('schema saved');
        return res.sendStatus(200);
    })
        .catch((err) => next(err));
};
exports.saveSchema = saveSchema;
// Retrieve saved schema
const retrieveSchema = async (req, res, next) => {
    index_1.default.info(`Retrieving saved user's saved schema (middleware)`);
    try {
        const updateColQuery = `SELECT pg_schema FROM users WHERE email = '${req.params.email}';`;
        const data = (await userModel_1.default.query(updateColQuery));
        if (data[0][0]) {
            if (data[0][0].pg_schema)
                return res.status(200).json(data[0][0].pg_schema);
        }
        else
            return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
};
exports.retrieveSchema = retrieveSchema;
//# sourceMappingURL=user.controller.js.map