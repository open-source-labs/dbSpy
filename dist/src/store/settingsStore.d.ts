declare const useSettingsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<{
    darkMode: boolean;
    setDarkMode: () => any;
    sidebarDisplayState: boolean;
    welcome: boolean;
    setWelcome: (input: any) => any;
    currentTable: string;
    currentColumn: string;
    editRefMode: boolean;
    setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
    inputModalState: {
        isOpen: boolean;
        mode: string;
    };
    setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
}>, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: {
        darkMode: boolean;
        setDarkMode: () => any;
        sidebarDisplayState: boolean;
        welcome: boolean;
        setWelcome: (input: any) => any;
        currentTable: string;
        currentColumn: string;
        editRefMode: boolean;
        setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
        inputModalState: {
            isOpen: boolean;
            mode: string;
        };
        setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    } | Partial<{
        darkMode: boolean;
        setDarkMode: () => any;
        sidebarDisplayState: boolean;
        welcome: boolean;
        setWelcome: (input: any) => any;
        currentTable: string;
        currentColumn: string;
        editRefMode: boolean;
        setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
        inputModalState: {
            isOpen: boolean;
            mode: string;
        };
        setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    }> | ((state: {
        darkMode: boolean;
        setDarkMode: () => any;
        sidebarDisplayState: boolean;
        welcome: boolean;
        setWelcome: (input: any) => any;
        currentTable: string;
        currentColumn: string;
        editRefMode: boolean;
        setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
        inputModalState: {
            isOpen: boolean;
            mode: string;
        };
        setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    }) => {
        darkMode: boolean;
        setDarkMode: () => any;
        sidebarDisplayState: boolean;
        welcome: boolean;
        setWelcome: (input: any) => any;
        currentTable: string;
        currentColumn: string;
        editRefMode: boolean;
        setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
        inputModalState: {
            isOpen: boolean;
            mode: string;
        };
        setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    } | Partial<{
        darkMode: boolean;
        setDarkMode: () => any;
        sidebarDisplayState: boolean;
        welcome: boolean;
        setWelcome: (input: any) => any;
        currentTable: string;
        currentColumn: string;
        editRefMode: boolean;
        setEditRefMode: (isEditRefMode: boolean, table?: string, col?: string) => any;
        inputModalState: {
            isOpen: boolean;
            mode: string;
        };
        setInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    }>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useSettingsStore;
//# sourceMappingURL=settingsStore.d.ts.map