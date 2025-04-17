import React from 'react';

export default function DeleteDbModal({
  closeDeleteDbModal,
  nameArr,
}: {
  nameArr: string[];
  closeDeleteDbModal: (input?: string) => void;
}) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const selectedItems = form.elements.namedItem('selectedItems') as HTMLSelectElement;
    const selectedOptionsValues = selectedItems.value; // Directly access the value of the selected option
    if (confirmDeletion()) {
      closeDeleteDbModal(selectedOptionsValues); // Close the modal after submission
    }
  }
  function confirmDeletion(): boolean {
    // Display the confirmation dialog
    return window.confirm(
      'Are you sure you want to delete this database? This action cannot be undone.'
    );
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
          className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Delete
        </button>
        <button
          id="cancel"
          type="button"
          onClick={() => closeDeleteDbModal()}
          className="modalButton ml-5 text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
