import React, { useState } from 'react';
import useSchemaStore from '../../store/schemaStore';
import queryGen from '../../queryGen';
import { SchemaObject } from '../../Types'
import { FaCopy } from 'react-icons/fa';
import copy from "copy-to-clipboard";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function QueryModal ({closeQueryModal} : {closeQueryModal : () => void}) {

  // read from schemaStore, then run queryGen 
  const { schemaStore, system } = useSchemaStore((state) => state);
  const queryObj = queryGen(schemaStore as unknown as SchemaObject, system as string);
  const [tooltipVisible, setTooltipVisible] = useState(false);


  const copyText = () => {
    const textToCopy = document.getElementById("queryModalCreateAlter")!.innerText;
    copy(textToCopy);

    setTooltipVisible(true);
    setTimeout(() => {
      setTooltipVisible(false);
    }, 3000);
  };


  // handleclose from FeatureTab to toggle this modal off
  return (
    <div className="modal" id='queryModal' style={{display: 'block', zIndex: '100'}}>
      <div className='modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]'>
        <span className="flex justify-between">
          <p className="text-slate-900 dark:text-[#f8f4eb]">Queries to build your database schema: </p>
          <Tippy 
            content='The query has been copied to your clipboard' 
            offset={[20, 10]} 
            trigger="click" 
            arrow={false}
            visible={tooltipVisible}
            delay={250} 
            duration={[null, 750]} 
          >
            <button onClick={copyText}>
              <FaCopy className="hover:opacity-60" />
            </button>
          </Tippy>
        </span>
        <div 
          id="queryModalCreateAlter"
          className='mb-4 mt-4 bg-sky-100 rounded-lg p-2'>{queryObj.create} {queryObj.alter}</div>
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