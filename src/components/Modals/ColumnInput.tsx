import React, { useEffect, useRef } from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import DataTypeOptions from './DataTypeOptions';

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
  return (
    <div className="column-input">
      <div>
        <label
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-name`}
        >
          Column Name
        </label>
        <input
          type="text"
          id={`column-${index}-name`}
          required
          maxLength={63}
          value={name}
          onChange={(e) => {
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
          onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
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
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
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
            className=" text-center text-slate-900 dark:text-[#f8f4eb]"
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
