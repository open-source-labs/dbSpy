"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftQuery = void 0;
//import { MicrosoftTableColumns, MicrosoftTableSchema } from '@/Types';
const datasource_1 = require("../datasource");
//import { microsoftFormatTableSchema } from './helperFunctions/mysql.functions';
const microsoftQuery = async (_req, _res, next) => {
    try {
        await datasource_1.MicrosoftDataSource.initialize();
        console.log('Data Source has been initialized');
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.microsoftQuery = microsoftQuery;
//# sourceMappingURL=microsoftData.controller.js.map