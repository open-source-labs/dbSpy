import React from 'react';

import useQueryStore from '../../store/queryStore';


// currently unused. ideally this will keep track of actions done on active tables/columns
// this might be used for showing the user what their interactions look like as queries, for learning
export default function QueryGenerator() {
  const { queries } = useQueryStore((state) => state);
  const queryElements = queries.map((query) => <div>{query}</div>);

  return (
    <div id="QueryGenerator">
      {/* <h1>Query Generator</h1> */}
      {queryElements}
    </div>
  );
}
