import React, { useEffect, useRef } from 'react';
import { SQLDataType } from '../../Types';
import DataTypeArr from '../../utils/DataTypeArr';
import { ColumnData } from './TableModal';
import { nanoid } from 'nanoid';

type RowInputProps = {
  index: number;
  deleteRow: (index: number) => void;
  onRowChange: (
    index: number,
    property: keyof ColumnData,
    value: string | boolean
  ) => void;
  name: string;
  type: SQLDataType;
  isNullable: boolean;
  isPrimary: boolean;
  defaultValue?: string;
};

function RowInput({
  index,
  deleteRow,
  onRowChange,
  name,
  type,
  isNullable,
  isPrimary,
  defaultValue,
}: RowInputProps) {
  const dataTypeOptions = DataTypeArr.map((dataType) => (
    // populate the options for data type
    // `selected` attribute will default select the type that matches props.type
    <option key={nanoid()} value={dataType}>
      {dataType}
    </option>
  ));
  return (
    <div className="row-input">
      <label
        className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        htmlFor={`row-${index}-name`}
      >
        Row Name
      </label>
      <input
        type="text"
        id={`row-${index}-name`}
        className="mb-4 w-[300px]"
        value={name}
        onChange={(e) => {
          onRowChange(index, 'name', e.target.value);
        }}
      />

      <label
        className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        htmlFor={`row-${index}-type`}
      >
        Type
      </label>
      <select
        id={`row-${index}-type`}
        className="mb-4 w-[300px]"
        defaultValue={type}
        onChange={(e) => onRowChange(index, 'type', e.target.value)}
      >
        {dataTypeOptions}
      </select>

      <label
        className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        htmlFor={`row-${index}-isNullable`}
      >
        isNullable
      </label>
      <input
        type="checkbox"
        id={`row-${index}-isNullable`}
        className="mb-4 w-[300px]"
        checked={isNullable}
        onChange={() => onRowChange(index, 'isNullable', !isNullable)}
      />

      <label
        className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        htmlFor={`row-${index}-default-val`}
      >
        Default Value
      </label>
      <input
        type="text"
        id={`row-${index}-default-val`}
        className="mb-4 w-[300px]"
        value={defaultValue}
        onChange={(e) => onRowChange(index, 'defaultValue', e.target.value)}
      />

      <label
        className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]"
        htmlFor={`row-${index}-primary`}
      >
        Primary Key
      </label>
      <input
        type="checkbox"
        id={`row-${index}-primary`}
        className="mb-4 w-[300px]"
        checked={isPrimary}
        onChange={() => onRowChange(index, 'isPrimary', !isPrimary)}
      />

      <button type="button" onClick={() => deleteRow(index)}>
        {/* TODO: ADD X SVG */}X
      </button>
    </div>
  );
}

export default RowInput;
