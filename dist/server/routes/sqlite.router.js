"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqliteRouter = void 0;
const express_1 = require("express");
const sqliteData_controller_1 = __importDefault(require("../controllers/sqliteData.controller"));
const sqliteRouter = (0, express_1.Router)();
exports.sqliteRouter = sqliteRouter;
// Retrieve SQLite schema and data from LOCAL db
sqliteRouter.get('/schema', sqliteData_controller_1.default.sqliteQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
sqliteRouter.post('/addRow', sqliteData_controller_1.default.sqliteAddNewRow, (_req, res) => {
    return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateRow', sqliteData_controller_1.default.sqliteUpdateRow, (_req, res) => {
    return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
sqliteRouter.delete('/deleteRow', sqliteData_controller_1.default.sqliteDeleteRow, (_req, res) => {
    return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
sqliteRouter.post('/addColumn', sqliteData_controller_1.default.sqliteAddNewColumn, (_req, res) => {
    return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
sqliteRouter.patch('/updateColumn', sqliteData_controller_1.default.sqliteUpdateColumn, (_req, res) => {
    return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteColumn', sqliteData_controller_1.default.sqliteDeleteColumn, (_req, res) => {
    return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
sqliteRouter.post('/saveNewTable', sqliteData_controller_1.default.sqliteAddNewTable, (_req, res) => {
    return res.status(200).json(res.locals.newTable);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
sqliteRouter.get('/tableNames', sqliteData_controller_1.default.sqliteGetTableNames, (_req, res) => {
    return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
sqliteRouter.delete('/deleteTable', sqliteData_controller_1.default.sqliteDeleteTable, sqliteData_controller_1.default.sqliteQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
sqliteRouter.put('/addForeignKey', sqliteData_controller_1.default.sqliteAddForeignKey, (_req, res) => {
    return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
sqliteRouter.delete('/removeForeignKey', sqliteData_controller_1.default.sqliteRemoveForeignKey, (_req, res) => {
    return res.status(200).json(res.locals.deletedRow);
});
//# sourceMappingURL=sqlite.router.js.map