import React, { useState } from "react";
import axios from "axios";
import styles from "./01Modal.module.css";

interface ImageInputModalProps {
  isImageInputModalOpen: boolean;
  setIsImageInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextfromIMAGEModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTextfromIMAGEModalOpen: boolean;
  imageProcessingResults: number[]; // 親コンポーネントから渡された結果
  setImageProcessingResults: React.Dispatch<React.SetStateAction<number[]>>; // 結果を更新するための関数
}

const ImageInputModal: React.FC<ImageInputModalProps> = ({
  isImageInputModalOpen, 
  setIsImageInputModalOpen,
  setIsTextfromIMAGEModalOpen,
  isTextfromIMAGEModalOpen,
  imageProcessingResults,
  setImageProcessingResults,
  
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      try {
        const response = await axios.post(`http://127.0.0.1:5001/backend/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        // 画像処理結果を取得
        const result = response.data;
        setImageProcessingResults(result);  // 結果を状態に保存
        setIsTextfromIMAGEModalOpen(true);  // モーダルを開く
  
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          // Axios固有のエラーの場合
          if (error.response) {
            // サーバーがエラーを返した場合（4xx, 5xx）
            const statusCode = error.response.status;
            if (statusCode >= 400 && statusCode < 500) {
              alert(`クライアントエラーが発生しました: ${statusCode} - ${error.response.data.error || '不明なエラー'}`);
            } else if (statusCode >= 500) {
              alert(`サーバーエラーが発生しました: ${statusCode} - サーバーが正常に処理できませんでした`);
            }
          } else if (error.request) {
            // サーバーからのレスポンスがなかった場合（ネットワークエラーなど）
            alert('ネットワークエラーが発生しました。サーバーに接続できませんでした。');
          }
        } else {
          // その他のエラー（一般的なJavaScriptエラーなど）
          console.error('エラー詳細:', error);
          alert('画像アップロード中にエラーが発生しました');
        }
      }
    }
  };

  if (!isImageInputModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2 className={styles.modaltitle}>がぞうよみとり</h2>
        <form onSubmit={handleImageSubmit}>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 w-full"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="w-full h-auto mb-2" />
            </div>
          )}
          <button type="submit" className={styles.modalButton}>
            そうしん
          </button>
          <button type="button" onClick={() => setIsImageInputModalOpen(false)} className={styles.modalButtonClose}>
            とじる
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageInputModal;
