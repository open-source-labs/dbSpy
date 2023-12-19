import React, { useState } from 'react';
import useSchemaStore from '../../store/schemaStore';
import queryGen from '../../queryGen';
import { SchemaObject } from '../../Types';

export default function DbNameInputModal({
  closeSaveDbNameModal,
}: {
  closeSaveDbNameModal: () => void;
}) {
  // read from schemaStore, then run queryGen
  const { schemaStore, system } = useSchemaStore((state) => state);
  const queryObj = queryGen(schemaStore as unknown as SchemaObject, system as string);

  // handleclose from FeatureTab to toggle this modal off
  return (
    <div
      className="modal"
      id="dbNameInputModal"
      style={{ display: 'block', zIndex: '100' }}
    >
      <div className="modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]">
        <span className="flex justify-between"></span>
        <input placeholder="Enter file name."></input>
        <button
          onClick={closeSaveDbNameModal}
          id="closeSaveDbNameModal"
          className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Save
        </button>
        <button
          onClick={closeSaveDbNameModal}
          id="closeSaveDbNameModal"
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
