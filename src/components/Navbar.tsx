import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import logo from "../assets/newLogoWhite.png";
import login from "../assets/right-to-bracket-solid.svg";
import default_pfp from "../assets/default_pfp.svg";
import axios from 'axios';
import useSchemaStore from '../store/schemaStore';
import useSettingsStore from '../store/settingsStore';
const linkbtn = "mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"


function Navbar() {
  //STATE DECLARATION (dbSpy3.0)
  const [theme, setTheme] = useState('Dark');
  const { user, setUser } = useCredentialsStore((state): any => state);
  //TODO: Move to feature
  const { setWelcome } = useSettingsStore((state) => state);

  const { schemaStore, setSchemaStore } = useSchemaStore((state): any => state)
  //END: STATE DECLARATION

  // Clears session + reset store
  const logoutSession = async () => {
    await fetch(`http://localhost:8080/api/logout`);
    window.open('http://localhost:8080/', '_self')
    setSchemaStore({});
    setUser(null);

  }

  // Temp
  const saveSchema = (): void => {
    console.log('fire saveSchema')
    console.log('Curr SchemaStore:', schemaStore)
    const postBody = {
      email: user.email,
      schema: JSON.stringify(schemaStore)
    }
    axios.post('/api/saveSchema', postBody)
    .then(data => console.log(data))
    .catch(err => console.log('err', err))

  }

  const loadSchema = (): void => {
    console.log('loading schema')
    // const testSchema = {
    //   'table': [
    //     'untitled_tabledgs',
    //     {
    //       'id': {
    //         'Name': 'id',
    //         'Value': null,
    //         'TableName': 'untitled_tabledgs',
    //         'References': [
    //           {
    //             'PrimaryKeyName': '',
    //             'PrimaryKeyTableName': 'untitled_tabledgs',
    //             'ReferencesPropertyName': '',
    //             'ReferencesTableName': '',
    //             'IsDestination': false,
    //             'constraintName': ''
    //           }
    //         ],
    //         'IsPrimaryKey': true,
    //         'IsForeignKey': false,
    //         'field_name': 'id',
    //         'data_type': 'AUTOINCREMENT',
    //         'additional_constraints': 'NOT NULL'
    //       },
    //       'created_at': {
    //         'Name': 'created_at',
    //         'Value': 'NOW()',
    //         'TableName': 'untitled_tabledgs',
    //         'References': [
    //           {
    //             'PrimaryKeyName': '',
    //             'PrimaryKeyTableName': 'untitled_tabledgs',
    //             'ReferencesPropertyName': '',
    //             'ReferencesTableName': '',
    //             'IsDestination': false,
    //             'constraintName': ''
    //           }
    //         ],
    //         'IsPrimaryKey': false,
    //         'IsForeignKey': false,
    //         'field_name': 'created_at',
    //         'data_type': 'TIMESTAMP',
    //         'additional_constraints': 'NOT NULL'
    //       }
    //     }
    //   ],
    //   'edges': []
    // }
    fetch(`/api/retrieveSchema/${user.email}`)
    .then(data => {
      console.log('data', data)
      setWelcome(false)
      return data.json()
    })
    .then(res => {
      console.log('res', JSON.parse(res))
      setSchemaStore(JSON.parse(res))
    })
    .catch(err => console.log('err retrieve', err))
  }

  //this is a function to toggle class between light and dark using vanilla DOM manipulation and local state.
  //FOR FUTURE DEVS: there's probably a more elegant way to do this with settings store and sharing that state globally but tailwind cascades dark mode from the top element so this works
  const toggleClass = (): void => {
    const page = document.getElementById("body");
    page!.classList.toggle('dark');
    theme === 'Dark' ? setTheme('Light') : setTheme('Dark');
  }
  console.log(user)
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-sky-800 p-6 fixed top-0 w-full">
        <div className='text-base navItems'>
          <img className="fill-current mr-5 h-[45] inline-block" src={logo} />
          <NavLink to='/' className={linkbtn}>Home</NavLink>
          <NavLink to='/display' className={linkbtn}>Display</NavLink>
          <button className='text-blue-200 hover:text-[#f8f4eb]' onClick={toggleClass}>{theme} Mode</button>
        </div>
        <div>
          {user
            ? (<>
              <button className='text-blue-200 hover:text-[#f8f4eb]' onClick={() => logoutSession()}>Log Out</button>
              <img className="ml-2 mr-2 h-[25] rounded-full invert inline-block" src={default_pfp} />
            </>)
            : (<div>
              <NavLink to='/login' className='mt-1 inline-block lg:mt-0 text-blue-200 shadow-2xl hover:text-white'>Login</NavLink>
              <img className="mr-3 ml-3 h-[20] invert inline-block" src={login} />
            </div>)
          }
        </div>
        <button onClick={() => saveSchema()}>Save Schema</button>
        <button onClick={() => loadSchema()}>Load Schema</button>
      </nav>
      <div className='h-[64px]'>
      </div>
    </>
  )
}

export default Navbar;