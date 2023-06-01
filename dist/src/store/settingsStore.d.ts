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
    inputDataModalState: {
        isOpen: boolean;
        mode: string;
    };
    setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
    deleteTableModalState: {
        isOpen: boolean;
    };
    setDeleteTableModalState: (isOpen: boolean) => void;
    isSchema: boolean;
    setTableMode: (input: any) => any;
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
        inputDataModalState: {
            isOpen: boolean;
            mode: string;
        };
        setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
        deleteTableModalState: {
            isOpen: boolean;
        };
        setDeleteTableModalState: (isOpen: boolean) => void;
        isSchema: boolean;
        setTableMode: (input: any) => any;
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
        inputDataModalState: {
            isOpen: boolean;
            mode: string;
        };
        setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
        deleteTableModalState: {
            isOpen: boolean;
        };
        setDeleteTableModalState: (isOpen: boolean) => void;
        isSchema: boolean;
        setTableMode: (input: any) => any;
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
        inputDataModalState: {
            isOpen: boolean;
            mode: string;
        };
        setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
        deleteTableModalState: {
            isOpen: boolean;
        };
        setDeleteTableModalState: (isOpen: boolean) => void;
        isSchema: boolean;
        setTableMode: (input: any) => any;
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
        inputDataModalState: {
            isOpen: boolean;
            mode: string;
        };
        setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
        deleteTableModalState: {
            isOpen: boolean;
        };
        setDeleteTableModalState: (isOpen: boolean) => void;
        isSchema: boolean;
        setTableMode: (input: any) => any;
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
        inputDataModalState: {
            isOpen: boolean;
            mode: string;
        };
        setDataInputModalState: (isOpen: boolean, mode?: string, currentTable?: string) => void;
        deleteTableModalState: {
            isOpen: boolean;
        };
        setDeleteTableModalState: (isOpen: boolean) => void;
        isSchema: boolean;
        setTableMode: (input: any) => any;
    }>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useSettingsStore;
//# sourceMappingURL=settingsStore.d.ts.map