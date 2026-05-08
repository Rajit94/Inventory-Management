const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <h3>{title}</h3>
      {children}
    </div>
  </div>
);

export default Modal;