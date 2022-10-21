import React from 'react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton() {
  const onClick = () => {
    toPng(document.querySelector('.react-flow'), {
      filter: (node) => {
        // we don't want to add the minimap and the controls to the image
        if (
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls')
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  return (
    <button className="download-btn" onClick={onClick}>
      Download Image
    </button>
  );
}

export default DownloadButton;