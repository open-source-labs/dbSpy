import ReactTooltip from 'react-tooltip';
import informationIcon from '../../../images/informationIcon.png';

interface TooltipLinkProps {
  tooltipText: string;
}

function TooltipLink({ tooltipText }: TooltipLinkProps) {
  const imageUrl = `data:image/png;base64,${informationIcon}`;

  return (
    <div>
      <a href="#" data-tip={tooltipText}>
        <img src={imageUrl} alt="Icon" />
      </a>
      <ReactTooltip effect="solid" />
    </div>
  );
}

export default TooltipLink;
