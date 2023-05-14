"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createEdges(schemaObject) {
    const edges = [];
    for (const tableKey in schemaObject) {
        const table = schemaObject[tableKey];
        for (const rowKey in table) {
            const row = table[rowKey];
            if (row.IsForeignKey) {
                edges.push({
                    id: `${row.References[0].PrimaryKeyTableNameReferencesTableName}-to-${row.References[0].ReferencesTableName}`,
                    source: row.References[0].ReferencesTableName,
                    sourceHandle: row.References[0].ReferencesPropertyName,
                    target: row.References[0].PrimaryKeyTableName,
                    targetHandle: row.References[0].PrimaryKeyName,
                    animated: true,
                    label: `${row.References[0].ReferencesPropertyName}-to-${row.References[0].PrimaryKeyName}`,
                    style: {
                        strokeWidth: 2,
                        stroke: '#085c84',
                    },
                    markerEnd: {
                        type: 'arrowclosed',
                        orient: 'auto',
                        width: 20,
                        height: 20,
                        color: '#085c84',
                    },
                });
            }
        }
    }
    //console.log('edges: ', edges)
    return edges;
}
exports.default = createEdges;
//# sourceMappingURL=createEdges.js.map