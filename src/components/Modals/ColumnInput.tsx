import React, { useEffect, useRef } from 'react';
import { SQLDataType, ColumnData } from '../../Types';
import DataTypeArr from '../../utils/DataTypeArr';

type ColumnInputProps = {
  index: number;
  deleteColumn: (index: number) => void;
  onColumnChange: (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => void;
  name: string;
  type: SQLDataType;
  isNullable: boolean;
  isPrimary: boolean;
  defaultValue: string | null;
};

function ColumnInput({
  index,
  deleteColumn,
  onColumnChange,
  name,
  type,
  isNullable,
  isPrimary,
  defaultValue,
}: ColumnInputProps) {
  const dataTypeOptions = DataTypeArr.map((dataType) => (
    // populate the options for data type
    // `selected` attribute will default select the type that matches props.type
    <option key={dataType} value={dataType}>
      {dataType}
    </option>
  ));
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
          value={name}
          onChange={(e) => {
            onColumnChange(index, 'name', e.target.value.trim());
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
          onChange={(e) => onColumnChange(index, 'type', e.target.value)}
        >
          {dataTypeOptions}
        </select>
      </div>

      <div>
        <label
          className=" text-center text-slate-900 dark:text-[#f8f4eb]"
          htmlFor={`column-${index}-isNullable`}
        >
          isNullable
        </label>
        <input
          type="checkbox"
          id={`column-${index}-isNullable`}
          checked={isNullable}
          onChange={() => onColumnChange(index, 'isNullable', !isNullable)}
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
          placeholder="(NULL)"
          value={defaultValue || ''}
          onChange={(e) => onColumnChange(index, 'defaultValue', e.target.value)}
        />
      </div>

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
          onChange={() => onColumnChange(index, 'isPrimary', !isPrimary)}
        />
      </div>

      <button
        type="button"
        className=" text-center text-slate-900 dark:text-[#f8f4eb]"
        onClick={() => deleteColumn(index)}
      >
        {/* TODO: ADD X SVG */}X
      </button>
    </div>
  );
}

export default ColumnInput;
