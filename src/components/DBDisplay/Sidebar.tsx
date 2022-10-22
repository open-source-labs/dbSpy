// React & React Router & React Query Modules;
import React, {useState} from 'react';
import axios from 'axios';

// Components Imported;
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import createInitialEdges from '../../components/ReactFlow/Edges';
import createInitialNodes from '../../components/ReactFlow/Nodes';

const Sidebar = (props:any) => {
//STATE DECLARATION (dbSpy3.0)
  const setDbCredentials = useCredentialsStore((state)=> state.setDbCredentials);
  const setSchemaStore = useSchemaStore((state) => state.setSchemaStore);
  const setEdges = useFlowStore((state) => state.setEdges);
  const setNodes = useFlowStore((state) => state.setNodes);
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
      .then((res) => res.data)
      .catch((err)=>console.log('getSchema error', err));
    //update schemaStore
    setSchemaStore(dbSchema);
    const initialEdges = createInitialEdges(dbSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(dbSchema, initialEdges);
    setNodes(initialNodes);
    props.closeNav();
  };

  //END: HELPER FUNCTIONS

  //form state hooks
  const [formValues, setFormValues] = useState({});

  return (        
      <div id='dbconnect' className='bg-[#fbf3de] dark:bg-slate-700'>
        <label className='dark:text-white'><h3>Connect to Database</h3></label>
        <span className='form-item'>
        <label htmlFor="db_type" className='dark:text-white'>Database Type</label>
        <select className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75' id='db_type' name='db_type' onChange={(e)=>setFormValues({...formValues, db_type: e.target.value})} >
          <option value='PostgreSQL'>PostgreSQL</option>
          <option value='MySQL'>MySQL</option>
        </select>
        </span>
        <br></br>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="database_link">Full Database Link</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='database_link 'name='database_link'  onChange={(e)=>setFormValues({...formValues, database_link: e.target.value})} />
        </span>
        <div className='form-item dark:text-[#f8f4eb]'>
          <p className="">OR</p>
        </div>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="hostname">Host</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='hostname' name='hostname'  onChange={(e)=>setFormValues({...formValues, hostname: e.target.value})} />
        </span>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="port">Port</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='port' name='port'  onChange={(e)=>setFormValues({...formValues, port: e.target.value})} />
        </span>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="username">Database Username</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='username' name='username'  onChange={(e)=>setFormValues({...formValues, username: e.target.value})} />
        </span>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="password">Database Password</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='password' name='password'  onChange={(e)=>setFormValues({...formValues, password: e.target.value})} />
        </span>
        <span className='form-item dark:text-[#f8f4eb]'>
        <label htmlFor="database_name">Database Name</label>
        <input className='form-box rounded bg-[#f8f4eb] focus:shadow-inner focus:shadow-[#eae7dd]/75 hover:shadow-sm' type='text' id='database_name 'name='database_name'  onChange={(e)=>setFormValues({...formValues, database_name: e.target.value})} />
        </span>
        <button className='form-button rounded border py-2 px-4 bg-[#f8f4eb] hover:shadow-sm' id='submit' onClick={((e)=>handleSubmit(e))} >Connect</button>
      </div>
  )

};

export default Sidebar;
