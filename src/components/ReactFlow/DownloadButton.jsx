import React from 'react';
import { toPng } from 'html-to-image';
import { BsFillCameraFill } from 'react-icons/bs';

//this creates the button in the React Flow canvas that allows you to take a screenshot and download it to your machine

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'dbSpy-reactflow.png');
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
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('download-btn')
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  return (
    <span
      className="download-btn"
      onClick={onClick}
      title="screenshot"
      aria-label="screenshot"
    >
      <span>
        <BsFillCameraFill />
      </span>
    </span>
  );
}

export default DownloadButton;
