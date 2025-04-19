import React, { useState } from 'react';

//Input modal for saving a new or existing database.
export default function DbNameInputModal({closeSaveDbNameModal}: {closeSaveDbNameModal: (input?: string) => void;}) {

  function handleFormSubmit(event: any) {
    event.preventDefault(); // Prevent default form submission behavior
    //Target save button's id to indentify which button is clicked.
    const isSaveButton = event.nativeEvent.submitter && event.nativeEvent.submitter.id === 'dbNameInput';
    if(isSaveButton){
      const inputValue: string = event.target.elements.inputDbName.value;
      closeSaveDbNameModal(inputValue);
    }else{
      closeSaveDbNameModal();
    }
  }
  // handleclose from FeatureTab to toggle this modal off
  return (
    <div
      className="modal"
      id="dbNameInputModal"
      style={{ display: 'block', zIndex: '100' }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <form
        onSubmit={handleFormSubmit}
        className="modal-content relative z-10 w-96 rounded-md bg-opacity-80 bg-gradient-to-b from-[#f8f4eb] to-transparent shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:from-accent dark:shadow-[0px_5px_10px_#1e293b]"
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
          id="cancel"
          type="button"
          onClick={handleFormSubmit}
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
