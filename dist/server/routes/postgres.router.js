"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresRouter = void 0;
const express_1 = require("express");
const postgresData_controller_1 = __importDefault(require("../controllers/postgresData.controller"));
const postgresRouter = (0, express_1.Router)();
exports.postgresRouter = postgresRouter;
// Retrieve Postgres schema and data from REMOTE db
postgresRouter.get('/schema', postgresData_controller_1.default.postgresQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
postgresRouter.post('/addRow', postgresData_controller_1.default.postgresAddNewRow, (_req, res) => {
    return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
postgresRouter.patch('/updateRow', postgresData_controller_1.default.postgresUpdateRow, (_req, res) => {
    return res.sendStatus(200);
});
//----------------DELETE ROW----------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteRow', postgresData_controller_1.default.postgresDeleteRow, (_req, res) => {
    return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
postgresRouter.post('/addColumn', postgresData_controller_1.default.postgresAddNewColumn, (_req, res) => {
    return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
postgresRouter.patch('/updateColumn', postgresData_controller_1.default.postgresUpdateColumn, (_req, res) => {
    return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteColumn', postgresData_controller_1.default.postgresDeleteColumn, (_req, res) => {
    return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
postgresRouter.post('/saveNewTable', postgresData_controller_1.default.postgresAddNewTable, postgresData_controller_1.default.postgresQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
postgresRouter.get('/tableNames', postgresData_controller_1.default.postgresGetTableNames, (_req, res) => {
    return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
postgresRouter.delete('/deleteTable', postgresData_controller_1.default.postgresDeleteTable, postgresData_controller_1.default.postgresQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
postgresRouter.put('/addForeignKey', postgresData_controller_1.default.postgresAddForeignKey, (_req, res) => {
    return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
postgresRouter.delete('/removeForeignKey', postgresData_controller_1.default.postgresRemoveForeignKey, (_req, res) => {
    return res.status(200).json(res.locals.deletedRow);
});
//# sourceMappingURL=postgres.router.js.map