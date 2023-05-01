"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDataEdges(dataObject) {
    console.log("inside createDataEdges file");
    const edges = [];
    console.log('dataObject', dataObject);
    for (const tableKey in dataObject) {
        const arrOfRowObj = dataObject[tableKey]; //arr of row obj
        for (const columnKey in arrOfRowObj[0]) {
            // const column = arrOfRowObj[columnKey]; //double check from here
            if (columnKey.IsForeignKey) {
                console.log('here??', columnKey.References[0]);
                edges.push({
                    id: `${columnKey.References[0].ReferencesTableName}-to-${columnKey.References[0].PrimaryKeyTableName}`,
                    source: columnKey.References[0].ReferencesTableName,
                    sourceHandle: columnKey.References[0].ReferencesPropertyName,
                    target: columnKey.References[0].PrimaryKeyTableName,
                    targetHandle: columnKey.References[0].PrimaryKeyName,
                    animated: true,
                    label: `${columnKey.References[0].ReferencesPropertyName}-to-${columnKey.References[0].PrimaryKeyName}`,
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
    return edges;
}
exports.default = createDataEdges;
//# sourceMappingURL=createDataEdges.js.map