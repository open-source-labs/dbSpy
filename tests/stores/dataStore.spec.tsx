import useDataStore, { DataObj, DataState } from '../../src/store/dataStore';
import { act, renderHook } from '@testing-library/react';
import { DataStore } from '@/Types';
import { mock } from 'node:test';

describe('Unit testing dataStore', () => {
  let result: any;
  let setDataStore: any;
  let setSystem: any;
  let deleteTableData: any;
  let addtableData: any;
  let setReferencesStore: any;

  beforeEach(() => {
    result = renderHook(useDataStore).result;
    setDataStore = result.current.setDataStore;
    setSystem = result.current.setSystem;
    deleteTableData = result.current.deleteTableData;
    addtableData = result.current.addTableData;
    setReferencesStore = result.current.setReferencesStore;
  });

  afterEach(() => {
    act(() => {
      setSystem('PostgreSQL');
      setDataStore({});
    });
  });

  describe('dataStore shape', () => {
    it('matches the snapshot', () => {
      const dataStore = renderHook(useDataStore).result.current as DataStore;
      expect(dataStore).toMatchSnapshot();
    });
  });

  describe('dataStore state changes', () => {
    it('should initialize with default state', () => {
      const { dataStore, system } = result.current;
      expect(dataStore).toEqual({});
      expect(system).toEqual('PostgreSQL');
    });
    
    it('should set dataStore state', () => {
      act(() => {
        setDataStore({ table1: {} });
      });
        
      expect(result.current.dataStore).toEqual({ table1: {} });
    });

    it('should delete table data', () => {
      act(() => {
        setDataStore({ table1: {}, table2: {} });
        deleteTableData('table1');
      });

      expect(result.current.dataStore).toEqual({ table2: {} });
    });

    
    it ('should add table data', () => {
      act(() => {
        addtableData('table1', [{ key: 'test' }]);
      });

      expect(result.current.dataStore.table1).toEqual({ table1: { key: 'test' } });
    });

    it('should handle empty newRow array', () => {
      const testTable = 'test';
      const newRow: DataObj[] = [];
      const initialDataStore: DataStore = {
        [testTable]: [{ column1: 'test', column2: 'data' }]
      };

      act(() => {
        setDataStore(initialDataStore);
      });

      act(() => {
        result.current._addRow(result.current.dataStore, testTable, newRow);
      });

      expect(result.current.dataStore[testTable]).toEqual([{ column1: 'test', column2: 'data' }]);
    });
  });

  // System should be able to be set to any of the specified SQL systems
  describe('System setting', () => {
    const systems = [ 'PostgreSQL', 'MySQL', 'Microsoft SQL', 'Oracle SQL', 'SQLite' ]

    // Reduces verbosity of writing tests for each system
    systems.forEach(system => {
      it(`should set system to ${system}`, () => {
        act(() => {
          setSystem(system);
        });
    
        expect(result.current.system).toEqual(system);
      });
    });
  });
  
  describe('References store setting', () => {
    it('should update referenceStore state', () => {
      const mockReferenceStore = {
        table1: [{ column1: 'test', column2: 'data' }]
      };

      act(() => {
        setReferencesStore(mockReferenceStore);
      });
      
      expect(result.current.referenceStore).toEqual(mockReferenceStore);
    });
  });
});