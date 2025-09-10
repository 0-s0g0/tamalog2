import React from 'react';
import styles from './01Modal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entryDate?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entryDate,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>削除確認</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p>本当にこのエントリーを削除しますか？</p>
          {entryDate && <p><strong>対象日付:</strong> {entryDate}</p>}
          <p><strong>この操作は取り消せません。</strong></p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            onClick={onClose} 
            className={`${styles.actionButton} ${styles.cancelButton}`}
          >
            キャンセル
          </button>
          <button 
            onClick={handleConfirm}
            className={`${styles.actionButton} ${styles.deleteButton}`}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;