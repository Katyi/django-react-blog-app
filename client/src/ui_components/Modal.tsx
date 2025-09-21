interface ModalProps {
  children: React.ReactNode;
  toggleModal: () => void;
}

const Modal = ({ children, toggleModal }: ModalProps) => {
  function handleToggleModal(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLDivElement).id === 'modal') {
      toggleModal();
    }
  }

  return (
    <div
      id="modal"
      onClick={handleToggleModal}
      className="fixed inset-0 bg-[#FFFFFF] dark:bg-[#181A2A] bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 h-s"
    >
      {children}
    </div>
  );
};

export default Modal;
