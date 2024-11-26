///////////////////////////////////////////
// モーダルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import { useState, useEffect } from 'react';
import styles from './01Modal.module.css'; 
import { UserCircle, Keyboard, TrayArrowUp, Footprints, ClipboardText, DeviceMobileCamera, CalendarCheck } from "@phosphor-icons/react";
import { Entry } from '../type';
import { getFirestore, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebase'

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

  return (
    <>
      {isInputModalOpen && (
        <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
            <button  onClick={textinduction} className={styles.modalButtonclose} >
                <Keyboard size={50} color="#4f2f2f" weight="duotone" />
            </button>
            <button  onClick={imageinduction} className={styles.modalButton}>
                <TrayArrowUp size={50} color="#4f2f2f" weight="duotone" />
            </button>
          </div>
      </div>
      )}
    </>
  );
};

export default InputModal;

