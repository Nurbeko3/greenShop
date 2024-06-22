import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    message: string;
}

const Modal: React.FC<ModalProps> = ({ message }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">{message}</h2>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
