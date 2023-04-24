import { SchemaStore } from '../../store/schemaStore';
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
export default function createEdges(schemaObject: SchemaStore): Edge[];
//# sourceMappingURL=createEdges.d.ts.map