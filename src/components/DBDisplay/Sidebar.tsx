// React & React Router & React Query Modules;
import React, {useState} from 'react';
import axios from 'axios';

// Components Imported;
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import useSettingsStore from '../../store/settingsStore';
import createInitialEdges from '../../components/ReactFlow/Edges';
import createInitialNodes from '../../components/ReactFlow/Nodes';

const Sidebar = (props:any) => {
//STATE DECLARATION (dbSpy3.0)
  const setDbCredentials = useCredentialsStore((state)=> state.setDbCredentials);
  const setSchemaStore = useSchemaStore((state) => state.setSchemaStore);
  const {setEdges, setNodes} = useFlowStore((state) => state);
  const {setWelcome} = useSettingsStore((state) => state);

  const [connectPressed, setConnectPressed] = useState(false);
  //END: STATE DECLARATION

  //HELPER FUNCTIONS
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const values:any = formValues;
    if (values.database_link){
                const fullLink = values.database_link;
                const splitURI = fullLink.split('/');
                const name = splitURI[3];
                const internalLinkArray = splitURI[2].split(':')[1].split('@');
                values.hostname = internalLinkArray[1];
                values.username = name;
                values.password = internalLinkArray[0];
                values.port = '5432';
                values.database_name = name;
              }
    //update dbCredentials
    setDbCredentials(values);
    setConnectPressed(true);

    //check db_type
    let endpoint: string = '/api/getSchema';
      //check if postgres or mySQL
      switch (values.db_type) {
        case 'PostgreSQL':
          endpoint = '/api/getSchema';
          break;
        case 'MySQL':
          endpoint = '/apimysql/getSchema';
          break;
      }
    console.log('endpoint', endpoint, '&values', values);
    //api call
    const dbSchema = await axios.post(endpoint, values)
      .then((res) => {
        setConnectPressed(false);
        return res.data;
      })
      .catch((err)=>{
        console.log('getSchema error', err);
        alert('An error occurred while trying to connect your database.');
        setConnectPressed(false);
      });
    //update schemaStore
    setSchemaStore(dbSchema);
    const initialEdges = createInitialEdges(dbSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(dbSchema, initialEdges);
    setNodes(initialNodes);
    setWelcome(false);
    props.closeNav();
  };
  //END: HELPER FUNCTIONS

  //form state hooks
  const [formValues, setFormValues] = useState({});

  return (        
      <div id='dbconnect' className='bg-[#fbf3de] dark:bg-slate-700'>
        <label className='dark:text-[#f8f4eb]'><h3>Connect to Database</h3></label>
        <span className='form-item'>
          <label htmlFor="db_type" className='dark:text-white'>Database Type</label>
          <select className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' id='db_type' name='db_type' onChange={(e)=>setFormValues({...formValues, db_type: e.target.value})} >
            <option value='PostgreSQL'>PostgreSQL</option>
            <option value='MySQL'>MySQL</option>
          </select>
        </span>
        <br></br>
        <span className='form-item'>
          <label htmlFor="database_link" className='dark:text-[#f8f4eb]'>Full Database Link</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='database_link 'name='database_link'  onChange={(e)=>setFormValues({...formValues, database_link: e.target.value})} />
        </span>
        <div className='form-item dark:text-[#f8f4eb]'>
          <p className="">OR</p>
        </div>
        <span className='form-item'>
          <label htmlFor="hostname" className='dark:text-[#f8f4eb]' >Host</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='hostname' name='hostname'  onChange={(e)=>setFormValues({...formValues, hostname: e.target.value})} />
        </span>
        <span className='form-item'>
          <label htmlFor="port" className='dark:text-[#f8f4eb]'>Port</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='port' name='port'  onChange={(e)=>setFormValues({...formValues, port: e.target.value})} />
        </span>
        <span className='form-item'>
          <label htmlFor="username" className='dark:text-[#f8f4eb]'>Database Username</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='username' name='username'  onChange={(e)=>setFormValues({...formValues, username: e.target.value})} />
        </span>
        <span className='form-item'>
          <label htmlFor="password" className='dark:text-[#f8f4eb]'>Database Password</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='password' name='password'  onChange={(e)=>setFormValues({...formValues, password: e.target.value})} />
        </span>
        <span className='form-item'>
          <label htmlFor="database_name" className='dark:text-[#f8f4eb]'>Database Name</label>
          <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm dark:hover:shadow-[#f8f4eb]' type='text' id='database_name 'name='database_name'  onChange={(e)=>setFormValues({...formValues, database_name: e.target.value})} />
        </span>
        <br></br>
        <button className='form-button rounded border py-2 px-4 bg-[#f8f4eb] dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] hover:shadow-inner dark:hover:shadow-lg' id='submit' onClick={((e)=>handleSubmit(e))} >Connect</button>

        {!connectPressed ? <div className='h-[58px]'></div> : <div className="flex items-center justify-center w-full h-full">
          <div className="flex justify-center items-center space-x-1 dark:text-[#f8f4eb]">
            <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
              <path clip-rule='evenodd'
                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                fill='currentColor' fill-rule='evenodd' />
            </svg>
            <p>Loading...</p>
	        </div>
        </div>
      }
      </div>
  )

};

export default Sidebar;
