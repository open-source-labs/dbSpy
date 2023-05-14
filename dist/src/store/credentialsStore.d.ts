declare const useCredentialsStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<{
    user: null;
    setUser: (userObject: any) => any;
    dbCredentials: any;
    setDbCredentials: (dbFormInput: any) => any;
}>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<{
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }, {
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: {
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }) => void) => () => void;
        onFinishHydration: (fn: (state: {
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<{
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }, {
            user: null;
            setUser: (userObject: any) => any;
            dbCredentials: any;
            setDbCredentials: (dbFormInput: any) => any;
        }>>;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: {
        user: null;
        setUser: (userObject: any) => any;
        dbCredentials: any;
        setDbCredentials: (dbFormInput: any) => any;
    } | Partial<{
        user: null;
        setUser: (userObject: any) => any;
        dbCredentials: any;
        setDbCredentials: (dbFormInput: any) => any;
    }> | ((state: {
        user: null;
        setUser: (userObject: any) => any;
        dbCredentials: any;
        setDbCredentials: (dbFormInput: any) => any;
    }) => {
        user: null;
        setUser: (userObject: any) => any;
        dbCredentials: any;
        setDbCredentials: (dbFormInput: any) => any;
    } | Partial<{
        user: null;
        setUser: (userObject: any) => any;
        dbCredentials: any;
        setDbCredentials: (dbFormInput: any) => any;
    }>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useCredentialsStore;
//# sourceMappingURL=credentialsStore.d.ts.map