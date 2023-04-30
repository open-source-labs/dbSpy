"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysqlData_controller_1 = require("../controllers/mysqlData.controller");
const mysqlRouter = (0, express_1.Router)();
mysqlRouter.get('/schema', mysqlData_controller_1.mysqlQuery, (_req, res) => {
    console.log('Returned to the mysql router with data');
    res.status(200).json(res.locals);
});
exports.default = mysqlRouter;
//# sourceMappingURL=mysql.router.js.map