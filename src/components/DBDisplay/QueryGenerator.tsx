import React from 'react';

import useQueryStore from '../../store/queryStore';

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
