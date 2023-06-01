export type Props = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export interface TableProps {
  tableInfo: {
    [key: string]: {
      IsForeignKey: boolean;
      IsPrimaryKey: boolean;
      Name: string;
      References: Array<object>;
      TableName: string;
      Value: string | number;
      additional_constraints: string | null;
      data_type: string;
      field_name: string;
    };
  };
  tableId?: string | undefined;
  setId?: any;
  id: string;
  setFetchedData: (fetchedData: CanvasProps/* originally any */) => void;
  setSqlOpen: (sqlOpen: boolean) => void;
  fetchedData: CanvasProps/* originally any */;
  sqlOpen: boolean;
  
}

export interface RowProps {
  id: string;
  column: string;
  constraint: string;
  fk: boolean;
  pk: boolean;
  type: string;
  reference: {}[];
}

export interface CanvasProps {
  fetchedData: {
    [key: string]: {
      [key: string]: {
        IsForeignKey: boolean;
        IsPrimaryKey: boolean;
        Name: string;
        References: any[];
        TableName: string;
        Value: string | boolean | number; //originally any, check if value works
        additional_constraints: string | null;
        data_type: string;
        field_name: string;
      };
    };
  };
  tableId?: string; //originally any, check if value works
  isLoadingProps: boolean;
  isErrorProps: boolean;
  setFetchedData: (fetchedData: object) => void;
  setSideBarOpened: (param: boolean) => void;
  reference: any;
  setSqlOpen: (sqlOpen: boolean) => void;
  sqlOpen: boolean;
}

//from displayheader.tsx
export interface DisplayHeaderProps {
  menuPopUpOpened: boolean;
  name: string | null;
  picture: string | null | undefined;
  setMenuPopUpOpened: (opened: boolean) => void;
  setUser: (user: object /*originally any */) => void;
}

//from featuretab.tsx
export interface FeatureTabProps {
  setTablename: (e: string) => void;
  fetchedData: {};
  setFetchedData: (e: {}) => void;
  setSideBarOpened: (param: boolean) => void;
  screenshot: any;
}

//from menupopup.tsx
export interface MenuPopUpProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

//from sidebar.tsx
export interface SideBarProps {
  isLoadingProps: boolean;
  isErrorProps: boolean;
  mutate: (data: object) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
}

// from homeloggedinnavbar.tsx
export interface HomeLoggedInNavbarProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setUser: (user: object /*originally any */) => void;
}