"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlRouter = void 0;
const express_1 = require("express");
const mysqlData_controller_1 = __importDefault(require("../controllers/mysqlData.controller"));
const mysqlRouter = (0, express_1.Router)();
exports.mysqlRouter = mysqlRouter;
// Retrieve MySQL schema and data from REMOTE db
mysqlRouter.get('/schema', mysqlData_controller_1.default.mysqlQuery, (_req, res) => {
    console.log('Returned to the mysql router with data');
    return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
mysqlRouter.post('/data', mysqlData_controller_1.default.mysqlAddNewRow, (_req, res) => {
    console.log('Returned to the mysql router after adding a new row');
    return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateRow', mysqlData_controller_1.default.mysqlUpdateRow, (_req, res) => {
    console.log('Returned to the mysql router after updating a row');
    return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
mysqlRouter.delete('/deleteRow', mysqlData_controller_1.default.mysqlDeleteRow, (_req, res) => {
    console.log('Returned to the mysql router after deleting a row');
    return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
mysqlRouter.post('/addColumn', mysqlData_controller_1.default.mysqlAddNewColumn, (_req, res) => {
    console.log('Returned to the mysql router after adding a new column');
    return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateColumn', mysqlData_controller_1.default.mysqlUpdateColumn, (_req, res) => {
    console.log('Returned to the mysql router after updating a column');
    return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteColumn', mysqlData_controller_1.default.mysqlDeleteColumn, (_req, res) => {
    console.log('Returned to the mysql router after deleting a column');
    return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
mysqlRouter.post('/saveNewTable', mysqlData_controller_1.default.mysqlAddNewTable, (_req, res) => {
    console.log('Returned to the mysql router after adding a new table');
    return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
mysqlRouter.get('/tableNames', mysqlData_controller_1.default.mysqlGetTableNames, (_req, res) => {
    console.log('Returned to the mysql router after getting all the table names');
    return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteTable', mysqlData_controller_1.default.mysqlDeleteTable, mysqlData_controller_1.default.mysqlQuery, (_req, res) => {
    console.log('Returned to the mysql router after deleting a table');
    return res.status(200).json(res.locals);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
mysqlRouter.put('/addForeignKey', mysqlData_controller_1.default.mysqlAddForeignKey, (_req, res) => {
    console.log('Returned to the mysql router after adding a foreign key');
    return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
mysqlRouter.delete('/removeForeignKey', mysqlData_controller_1.default.mysqlRemoveForeignKey, (_req, res) => {
    console.log('Returned to the mysql router after removing a foreign key');
    return res.status(200).json(res.locals.deletedRow);
});
//# sourceMappingURL=mysql.router.js.map