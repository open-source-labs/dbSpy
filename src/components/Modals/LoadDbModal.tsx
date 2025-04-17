import React, { useState } from 'react';
import useSettingsStore from '../../store/settingsStore';
export default function LoadDbModal({
  closeLoadDbModal,
  nameArr,
}: {
  nameArr: string[];
  closeLoadDbModal: (input?: string) => void;
}) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const selectedItems = form.elements.namedItem('selectedItems') as HTMLSelectElement;
    const selectedOptionsValues = selectedItems.value; // Directly access the value of the selected option
    closeLoadDbModal(selectedOptionsValues); // Close the modal after submission
  }

  // handleclose from FeatureTab to toggle this modal off
  return (
    <div className="modal" id="loadDbModal" style={{ display: 'block', zIndex: '100' }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <form
        onSubmit={handleFormSubmit}
        className="modal-content relative z-10 w-96 rounded-md bg-opacity-80 bg-gradient-to-b from-[#f8f4eb] to-transparent shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:from-accent dark:shadow-[0px_5px_10px_#1e293b]"
      >
        <div className="menu-box ml-0 mt-5" style={{ marginBottom: '20px' }}>
          <label
            htmlFor="selectItems"
            className="ml-0 mt-0  text-slate-900 dark:text-[#f8f4eb]"
          >
            Select database:
          </label>
          <select id="selectItems" name="selectedItems" className="ml-5">
            {nameArr.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </select>
        </div>
        <button
          id="confirm"
          type="submit"
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Confirm
        </button>
        <button
          id="cancel"
          type="button"
          onClick={() => closeLoadDbModal()}
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Cancel
        </button>
      </form>
      {/* {<DBDisplay/>} */}
    </div>
  );
}
