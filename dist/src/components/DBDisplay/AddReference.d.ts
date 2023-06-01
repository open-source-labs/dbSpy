import React from 'react';
interface CustomJSXElements {
    [key: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
declare namespace JSX {
    interface IntrinsicElements extends CustomJSXElements {
    }
}
declare const AddReference: JSX.IntrinsicElements;
export default AddReference;
//# sourceMappingURL=AddReference.d.ts.map