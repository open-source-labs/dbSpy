"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftRouter = void 0;
const express_1 = require("express");
const microsoftData_controller_1 = require("../controllers/microsoftData.controller");
const microsoftRouter = (0, express_1.Router)();
exports.microsoftRouter = microsoftRouter;
microsoftRouter.get('/schema', microsoftData_controller_1.microsoftQuery, (_req, res) => {
    console.log('Returned to the microsoft router with data');
    res.status(200).json(res.locals);
});
//# sourceMappingURL=microsoft.router.js.map