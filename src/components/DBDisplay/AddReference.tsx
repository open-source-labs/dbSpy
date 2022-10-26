// React & React Router & React Query Modules;
import React, {useState, useRef} from 'react';

// Components Imported;
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';

const AddReference = () => {
//STATE DECLARATION (dbSpy3.0)
  const {reference, setReference} = useSchemaStore(state=>state);
  const {setEditRefMode} = useSettingsStore(state=>state);
  //END: STATE DECLARATION

  //form state hooks
  const [formValues, setFormValues] = useState({});
  //useRef's for form elements
  const PrimaryKeyName = useRef();
  const ReferencesPropertyName = useRef();
  const PrimaryKeyTableName = useRef();
  const ReferencesTableName = useRef();
  const IsDestination = useRef() ;
  const constrainName = useRef();

  //HELPER FUNCTIONS
  const onSave = (e:any) => {
    e.preventDefault();
    setReference([formValues]);
    setEditRefMode(false);
  };
  
  //END: HELPER FUNCTIONS
  
  return (        
    <div id='addReference' className='bg-[#fbf3de] dark:bg-slate-700'>
      <label className='dark:text-[#f8f4eb]'><h3>Foreign Key References</h3></label>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Primary Key Name</label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='pkeyname' 
          name='pkeyname'  
          defaultValue={reference[0].PrimaryKeyName}
          onChange={(e)=>setFormValues({...formValues, PrimaryKeyName: e.target.value})} />
      </span>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Reference Key Name </label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='refkeyname' 
          name='refkeyname'  
          defaultValue={reference[0].ReferencesPropertyName}
          onChange={(e)=>setFormValues({...formValues, ReferencesPropertyName: e.target.value})} />
      </span>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Primary Table Name</label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='ptablename' 
          name='ptablename' 
          defaultValue={reference[0].PrimaryKeyTableName}
          onChange={(e)=>setFormValues({...formValues, PrimaryKeyTableName: e.target.value})} />
      </span>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Reference Table Name</label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='reftablename' 
          name='reftablename'  
          defaultValue={reference[0].ReferencesTableName}
          onChange={(e)=>setFormValues({...formValues, ReferencesTableName: e.target.value})} />
      </span>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>IsDestination</label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='isdestination' 
          name='isdestination'  
          defaultValue={reference[0].IsDestination}
          onChange={(e)=>setFormValues({...formValues, IsDestination: e.target.value})} />
      </span>
      <br></br>
      <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Constraint Name</label>
        <input 
          className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' 
          type='text' 
          id='constraintname' 
          name='constraintname'  
          defaultValue={reference[0].constrainName}
          onChange={(e)=>setFormValues({...formValues, constrainName: e.target.value})} />
      </span>
      <br></br>
      <button 
        className='form-button rounded border py-2 px-4 bg-[#f8f4eb] dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] hover:shadow-inner dark:hover:shadow-lg' 
        id='save' 
        onClick={((e)=>onSave(e))} >Save</button>
      <br></br>
        <button 
        className='form-button rounded border py-2 px-4 bg-[#f8f4eb] dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] hover:shadow-inner dark:hover:shadow-lg' 
        id='cancel' 
        onClick={()=>setEditRefMode(false)} >Cancel</button>
      <br></br>
    </div>
  )

};

export default AddReference;
