import { useState, ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

function Modal(props: ModalProps) {
    const [isOpen, setIsOpen] = useState(true);
  
    const handleClose = () => {
      setIsOpen(false);
      props.onClose();
    };
  
    return (
      <div>
        {isOpen && (
          <div className="modal">
            {props.children}
            <button onClick={handleClose}>Close</button>
          </div>
        )}
      </div>
    );
}

export default Modal;