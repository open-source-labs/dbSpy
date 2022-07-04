import { NavigateBeforeRounded } from "@mui/icons-material";
import axios from "axios";
import React, {useEffect ,useState } from "react";
import { useMutation } from "react-query";
import Canvas from "../components/DBDisplay/Canvas";
import DisplayHeader from "../components/DBDisplay/DisplayHeader";
import Sidebar from "../components/DBDisplay/Sidebar";
import { Header, AppShell } from "@mantine/core";
import DisplaySidebar from "../components/DBDisplay/DisplaySidebar";
import { Navigate, useNavigate } from "react-router-dom";

interface stateChangeProps {
 user : {
 email: string | null, 
 id: string | null, 
 name: string | null, 
 picture: string | null, 
 }

}





export default function DBDisplay({user}:stateChangeProps) {
  console.log('in DB Display', user);
  const navigate = useNavigate();

  /*
  useEffect(() => {

    // declare the async data fetching function
    const fetchData = async () => {
      const data = await fetch('/protected');
      // convert data to json
      const result = await data.json();
     
      if (result == null)
      {
        navigate('/login');
      }
    
    }
  
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(err=> {
        console.error
        navigate('/login')
      });
  
  },[])
*/





  const [fetchedData, setFetchedData] = useState([{}]);
  const [opened, setOpened] = useState(false);
  const { isLoading, isError, mutate } = useMutation((dataToSend: object) => {
    console.log("logging data", dataToSend);
    console.log("Time start to load database", Date.now());
    return axios.post("/api/getSchema", dataToSend).then((res) => {
      setFetchedData(res.data);
      console.log("Time Done to Load Database", Date.now());
    });
  });

  return (
    <AppShell
      padding="md"
      header={<DisplayHeader name={user.name} opened={opened} setOpened={setOpened} />}
      // navbarOffsetBreakpoint="sm"
      // navbar={<DisplaySidebar opened={opened} setOpened={setOpened} />}
      styles={(theme) => ({
        root: { height: "100%" },
        body: { height: "100%" },
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Sidebar isLoading={isLoading} isError={isError} mutate={mutate} />
      <Canvas fetchedData={fetchedData} setFetchedData={setFetchedData} />
    </AppShell>
  );
}
