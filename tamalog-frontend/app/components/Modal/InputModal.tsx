///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './01Modal.module.css'; 
import { Keyboard, TrayArrowUp} from "@phosphor-icons/react";
interface InputModalProps {
  isInputModalOpen: boolean;
  setIsInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImageInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InputModal: React.FC<InputModalProps> = ({
    isInputModalOpen,
    setIsInputModalOpen,
    setIsTextInputModalOpen,
    setIsImageInputModalOpen,
}) => {

    // textModalへ
    const textinduction = () => {
        setIsInputModalOpen(false);
        setIsTextInputModalOpen(true);
    };
    // textModalへ
    const imageinduction = () => {
        setIsInputModalOpen(false);
        setIsImageInputModalOpen(true);
    };

    const closeModal = () => {
        setIsInputModalOpen(false);
    };

  return (
    <>
      {isInputModalOpen && (
        <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
          <div style={{display:'flex' , alignItems:'center', justifyContent:'center',gap:'40px' }}>
          <div style={{display:'flex' , flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div>てきすと</div>
            <button  onClick={textinduction} className={styles.modalButton} >
                <Keyboard size={50} color="#4f2f2f" weight="duotone" />
            </button>
          </div>
            <div >
              <div>いめーじ</div>
              <button  onClick={imageinduction} className={styles.modalButton}>
                  <TrayArrowUp size={50} color="#4f2f2f" weight="duotone" />
              </button>
            </div>
          </div>
            <button onClick={() => closeModal()} className={styles.modalButtonclose}>とじる</button>
          </div>
          
      </div>
      )}
    </>
  );
};

export default InputModal;

