import React from 'react';
import useSchemaStore from '../../store/schemaStore';
import queryGen from '../../queryGen';
import { SchemaObject } from './Types'

export default function QueryModal ({closeQueryModal} : {closeQueryModal : () => void}) {

  // read from schemaStore, then run queryGen 
  const { schemaStore } = useSchemaStore((state) => state);
  const queryObj = queryGen(schemaStore as unknown as SchemaObject);


  // handleclose from FeatureTab to toggle this modal off
  // renders a div that has variable visibility
  return (
    <div className="modal" id='queryModal' style={{display: 'block', zIndex: '100'}}>
      <div className='modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]'>
        <div>Queries to build your database schema: </div>
        <div className='mb-4 mt-4 bg-sky-100 rounded-lg p-2'>{queryObj.create} {queryObj.alter}</div>
        <button
          onClick={closeQueryModal}
          id='closeQueryModal'
          className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
        >
          Return
        </button>
      </div>

    </div>
  )

}