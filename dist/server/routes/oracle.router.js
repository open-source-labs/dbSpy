"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oracleRouter = void 0;
const express_1 = require("express");
const oracleData_controller_1 = __importDefault(require("../controllers/oracleData.controller"));
const oracleRouter = (0, express_1.Router)();
exports.oracleRouter = oracleRouter;
// Retrieve Oracle SQL schema and data from REMOTE db
oracleRouter.get('/schema', oracleData_controller_1.default.oracleQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
oracleRouter.post('/addRow', oracleData_controller_1.default.oracleAddNewRow, (_req, res) => {
    return res.sendStatus(200);
});
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
oracleRouter.patch('/updateRow', oracleData_controller_1.default.oracleUpdateRow, (_req, res) => {
    return res.sendStatus(200);
});
//----------------DELETE ROW---------------------------------------------------------------------------------------------------- 
oracleRouter.delete('/deleteRow', oracleData_controller_1.default.oracleDeleteRow, (_req, res) => {
    return res.sendStatus(200);
});
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
oracleRouter.post('/addColumn', oracleData_controller_1.default.oracleAddNewColumn, (_req, res) => {
    return res.status(200).json(res.locals.newColumn);
});
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
oracleRouter.patch('/updateColumn', oracleData_controller_1.default.oracleUpdateColumn, (_req, res) => {
    return res.sendStatus(200);
});
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteColumn', oracleData_controller_1.default.oracleDeleteColumn, (_req, res) => {
    return res.sendStatus(200);
});
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
oracleRouter.post('/saveNewTable', oracleData_controller_1.default.oracleAddNewTable, oracleData_controller_1.default.oracleQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//--------------GET ALL TABLE NAMES---------------------------------------------------------------------------------------------------
oracleRouter.get('/tableNames', oracleData_controller_1.default.oracleGetTableNames, (_req, res) => {
    return res.status(200).json(res.locals.tableNames);
});
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
oracleRouter.delete('/deleteTable', oracleData_controller_1.default.oracleDeleteTable, oracleData_controller_1.default.oracleQuery, (_req, res) => {
    return res.status(200).json(res.locals);
});
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
oracleRouter.put('/addForeignKey', oracleData_controller_1.default.oracleAddForeignKey, (_req, res) => {
    return res.sendStatus(200);
});
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
oracleRouter.delete('/removeForeignKey', oracleData_controller_1.default.oracleRemoveForeignKey, (_req, res) => {
    return res.status(200).json(res.locals.deletedRow);
});
//# sourceMappingURL=oracle.router.js.map