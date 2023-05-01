"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresRouter = void 0;
const express_1 = require("express");
const postgresData_controller_1 = require("../controllers/postgresData.controller");
const postgresRouter = (0, express_1.Router)();
exports.postgresRouter = postgresRouter;
// Retrieve Postgres schema from remote db
postgresRouter.get('/schema', postgresData_controller_1.getSchema, (_req, res) => {
    return res.status(200).json(res.locals.data);
});
//# sourceMappingURL=postgres.router.js.map