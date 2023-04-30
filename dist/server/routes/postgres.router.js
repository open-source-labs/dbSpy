"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresRouter = void 0;
const express_1 = require("express");
const postgresData_controller_1 = require("../controllers/postgresData.controller");
const postgresRouter = (0, express_1.Router)();
exports.postgresRouter = postgresRouter;
// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresData_controller_1.postgresQuery, (_req, res) => {
    console.log('Returned to the postgres router with data');
    return res.status(200).json(res.locals);
});
//# sourceMappingURL=postgres.router.js.map