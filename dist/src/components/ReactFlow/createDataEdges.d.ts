import { DataStore } from '../../store/dataStore';
export type Edge = {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    animated: boolean;
    label: string;
    style: {
        strokeWidth: number;
        stroke: string;
    };
    markerEnd: {
        type: string;
        orient: string;
        width: number;
        height: number;
        color: string;
    };
};
export default function createDataEdges(dataObject: DataStore): Edge[];
//# sourceMappingURL=createDataEdges.d.ts.map