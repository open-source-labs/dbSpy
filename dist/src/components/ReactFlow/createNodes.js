"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//hard-coded xy positioning of each node in the canvas
function createNodes(schemaObject, edges) {
    const nodePositions = [
        { x: 1000, y: 400 },
        { x: 1000, y: 0 },
        { x: 0, y: 600 },
        { x: 0, y: 0 },
        { x: 2500, y: 200 },
        { x: 0, y: 200 },
        { x: 2000, y: 800 },
        { x: 0, y: 400 },
        { x: 0, y: 800 },
        { x: 1000, y: 800 },
        { x: 0, y: 1050 },
    ];
    // renders each table on the React Flow canvas
    const nodes = [];
    let i = 0;
    for (const tableKey in schemaObject) {
        const columnData = schemaObject[tableKey];
        nodes.push({
            id: tableKey,
            type: 'table',
            position: nodePositions[i],
            data: { table: [tableKey, columnData], edges },
        });
        i = (i + 1) % 17;
    }
    return nodes;
}
exports.default = createNodes;
//# sourceMappingURL=createNodes.js.map