"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const html_to_image_1 = require("html-to-image");
const bs_1 = require("react-icons/bs");
// this creates the custom button in the React Flow Controls panel 
// that allows you to take a screenshot and download it to your machine
function downloadImage(dataUrl) {
    const a = document.createElement('a');
    a.setAttribute('download', 'dbSpy-reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}
function DownloadButton() {
    const onClick = () => {
        (0, html_to_image_1.toPng)(document.querySelector('.react-flow'), {
            filter: (node) => {
                // we don't want to add the minimap and the controls to the image
                if (node?.classList?.contains('react-flow__minimap') ||
                    node?.classList?.contains('react-flow__controls') ||
                    node?.classList?.contains('download-btn')) {
                    return false;
                }
                return true;
            },
        }).then(downloadImage);
    };
    return (react_1.default.createElement("span", { className: "download-btn", onClick: onClick, title: "screenshot", "aria-label": "screenshot" },
        react_1.default.createElement("span", null,
            react_1.default.createElement(bs_1.BsFillCameraFill, null))));
}
exports.default = DownloadButton;
//# sourceMappingURL=DownloadButton.js.map