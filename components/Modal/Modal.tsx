import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, onConfirm }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-md shadow-md relative w-2/3 max-w-3xl">
                <button
                    className="absolute top-4 right-4 text-white bg-[#46A358] rounded-full p-2 hover:bg-[#46A358] transition duration-200"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-[#46A358]">{title}</h2>
                <div className="text-lg mb-6">
                    {message}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-[#46A358] text-white py-2 px-4 rounded hover:bg-[#46A358] transition duration-200"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
