import React from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import DataTypeOptions from './DataTypeOptions';
import { useState } from 'react';
import useCredentialsStore from '../../store/credentialsStore';

type ColumnInputProps = {
  index: number;
  deleteColumn: (index: number) => void;
  handleColumnChange: (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => void;
  name: string;
  type: SQLDataType;
  isNullable: boolean;
  isPrimary: boolean;
  defaultValue: string | null;
  columnCount: number;
  mode: 'table' | 'column';
};

function ColumnInput({
  index,
  deleteColumn,
  handleColumnChange,
  name,
  type,
  isNullable,
  isPrimary,
  defaultValue,
  columnCount,
  mode,
}: ColumnInputProps) {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState('');
  const { dbCredentials } = useCredentialsStore((state) => state);

  let maxConstraintNameLength: number;
  switch (dbCredentials.db_type) {
    case 'mysql':
      maxConstraintNameLength = 64;
    case 'mssql':
      maxConstraintNameLength = 128;
    case 'oracle':
      maxConstraintNameLength = 30;
    case 'sqlite':
      maxConstraintNameLength = 255;
    default:
      maxConstraintNameLength = 63; //Postgres
  }

  const sendNewColumnToBackend = (): void => {
    console.log('cN', columnName);
    console.log('cT', columnType);
  };

  return (
    <div className="column-input mb-4 flex gap-1">
      <div>
        <label
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-name`}
        >
          Name
        </label>
        <input
          type="text"
          id={`column-${index}-name`}
          required
          maxLength={maxConstraintNameLength}
          value={name}
          onChange={(e) => {
            setColumnName(e.target.value);
            handleColumnChange(index, 'name', e.target.value.trim());
          }}
        />
      </div>

      <div>
        <label
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-type`}
        >
          Type
        </label>
        <select
          id={`column-${index}-type`}
          defaultValue={type}
          onChange={(e) => {
            setColumnType(e.target.value);
            handleColumnChange(index, 'type', e.target.value);
          }}
        >
          <DataTypeOptions />
        </select>
      </div>

      <div>
        <label
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-isNullable`}
        >
          Nullable
        </label>
        <input
          type="checkbox"
          id={`column-${index}-isNullable`}
          checked={isNullable}
          onChange={() => handleColumnChange(index, 'isNullable', !isNullable)}
        />
      </div>

      <div>
        <label
          className="w-[100px] text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-default-val`}
        >
          Default Value
        </label>
        <input
          type="text"
          id={`column-${index}-default-val`}
          maxLength={63}
          placeholder="(NULL)"
          value={defaultValue || ''}
          onChange={(e) => handleColumnChange(index, 'defaultValue', e.target.value)}
        />
      </div>

      {mode === 'table' && (
        <div>
          <label
            className="w-[90px] text-center text-slate-900 dark:text-[#f8f4eb]"
            htmlFor={`column-${index}-primary`}
          >
            Primary Key
          </label>
          <input
            type="checkbox"
            id={`column-${index}-primary`}
            checked={isPrimary}
            onChange={() => handleColumnChange(index, 'isPrimary', !isPrimary)}
          />
        </div>
      )}

      {columnCount > 1 && (
        <button
          type="button"
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          onClick={() => deleteColumn(index)}
        >
          {/* TODO: ADD X SVG */}X
        </button>
      )}
    </div>
  );
}

export default ColumnInput;
