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
    return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
mysqlRouter.post('/addRow', mysqlData_controller_1.default.mysqlAddNewRow, (_req, res) => {
    return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateRow', mysqlData_controller_1.default.mysqlUpdateRow, (_req, res) => {
    return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
mysqlRouter.delete('/deleteRow', mysqlData_controller_1.default.mysqlDeleteRow, (_req, res) => {
    return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
mysqlRouter.post('/addColumn', mysqlData_controller_1.default.mysqlAddNewColumn, (_req, res) => {
    return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
mysqlRouter.patch('/updateColumn', mysqlData_controller_1.default.mysqlUpdateColumn, (_req, res) => {
    return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteColumn', mysqlData_controller_1.default.mysqlDeleteColumn, (_req, res) => {
    return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
mysqlRouter.post('/saveNewTable', mysqlData_controller_1.default.mysqlAddNewTable, (_req, res) => {
    return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
mysqlRouter.get('/tableNames', mysqlData_controller_1.default.mysqlGetTableNames, (_req, res) => {
    return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
mysqlRouter.delete('/deleteTable', mysqlData_controller_1.default.mysqlDeleteTable, mysqlData_controller_1.default.mysqlQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
mysqlRouter.put('/addForeignKey', mysqlData_controller_1.default.mysqlAddForeignKey, (_req, res) => {
    return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
mysqlRouter.delete('/removeForeignKey', mysqlData_controller_1.default.mysqlRemoveForeignKey, (_req, res) => {
    return res.status(200).json(res.locals.deletedRow);
});
//# sourceMappingURL=mysql.router.js.map