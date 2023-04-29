"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createEdges(schemaObject) {
    //console.log("i am in createEages file")
    const edges = [];
    for (const tableKey in schemaObject) {
        const table = schemaObject[tableKey];
        //console.log('const table', table)
        //console.log('what is this',)
        for (const rowKey in table) {
            const row = table[rowKey];
            //console.log("row", row)
            if (row.IsForeignKey) {
                //console.log("references", row.References[0][0])
                // edges.push({key:'hi'})
                edges.push({
                    id: `${row.References[0][0].ReferencesTableName}-to-${row.References[0][0].PrimaryKeyTableName}`,
                    source: row.References[0][0].ReferencesTableName,
                    sourceHandle: row.References[0][0].ReferencesPropertyName,
                    target: row.References[0][0].PrimaryKeyTableName,
                    targetHandle: row.References[0][0].PrimaryKeyName,
                    animated: true,
                    label: `${row.References[0][0].ReferencesPropertyName}-to-${row.References[0][0].PrimaryKeyName}`,
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
    //console.log('edges',edges)
    return edges;
}
exports.default = createEdges;
//# sourceMappingURL=createEdges.js.map