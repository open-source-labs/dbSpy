import { FlowState } from '@/Types';
declare const useFlowStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<FlowState>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: FlowState, previousSelectedState: FlowState) => void): () => void;
        <U>(selector: (state: FlowState) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: FlowState | Partial<FlowState> | ((state: FlowState) => FlowState | Partial<FlowState>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useFlowStore;
//# sourceMappingURL=flowStore.d.ts.map