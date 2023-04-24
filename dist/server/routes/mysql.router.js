"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysqlData_controller_1 = require("../controllers/mysqlData.controller");
const mysqlRouter = (0, express_1.Router)();
mysqlRouter.get('/schema', mysqlData_controller_1.getSchema, mysqlData_controller_1.objSchema, (_req, res) => {
    res.status(200).json(res.locals.data);
});
exports.default = mysqlRouter;
//# sourceMappingURL=mysql.router.js.map