// import React, {memo} from 'react';
// import {Handle} from 'reactflow';
import {useCallback} from 'react';
import {Handle, Position, Node} from 'reactflow';

const handleStyle: {
    left: number;
} = {
    left: 10
};


import React from 'react'
import { Target } from 'tabler-icons-react';

function TableFlow({data}:any) {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
    }, []);
  return (
   <div>
    <Handle type="target" position={Position.Top}></Handle>
    <div>
        <label htmlFor='text'>Text:</label>
        <input id='text' name='text' onChange={onChange}/>
    </div>
    <Handle type="source" position={Position.Bottom} id="a" style={handleStyle}></Handle>
    <Handle type="source" position={Position.Bottom} id="b" style={handleStyle}></Handle>
   </div>
  );
}

export default TableFlow