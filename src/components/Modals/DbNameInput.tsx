import React, { useState } from 'react';
import useSchemaStore from '../../store/schemaStore';
import queryGen from '../../queryGen';
import { SchemaObject } from '../../Types';

export default function DbNameInputModal({
  closeSaveDbNameModal,
  pureCloseSaveDbNameModal,
}: {
  closeSaveDbNameModal: (input: string) => void;
  pureCloseSaveDbNameModal: () => void;
}) {
  // read from schemaStore, then run queryGen
  const { schemaStore, system } = useSchemaStore((state) => state);
  const queryObj = queryGen(schemaStore as unknown as SchemaObject, system as string);

  function handleFormSubmit(event: any) {
    event.preventDefault(); // Prevent default form submission behavior
    const inputValue: string = event.target.elements.inputDbName.value;
    // Add your logic to send the inputValue to the database here
    closeSaveDbNameModal(inputValue); // Close the modal after submission
  }
  // handleclose from FeatureTab to toggle this modal off
  return (
    <div
      className="modal"
      id="dbNameInputModal"
      style={{ display: 'block', zIndex: '100' }}
    >
      <form
        onSubmit={handleFormSubmit}
        className="modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <input placeholder="Enter file name." required name="inputDbName"></input>
        <button
          id="dbNameInput"
          type="submit"
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Save
        </button>
        <button
          type="button"
          onClick={pureCloseSaveDbNameModal}
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
