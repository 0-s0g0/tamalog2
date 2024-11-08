import React, { useState } from 'react';

const ImageInputModal = ({ setImagePreview, setIsTextInputModalOpen, updateFormValues }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreviewState] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreviewState(URL.createObjectURL(file)); // 画像プレビュー表示

      // 画像をバックエンドに送信して処理する
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch('/upload_image', { // サーバーに画像を送信
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          const imageUrl = data.imageUrl;
          const numbers = await fetchDetectedData(imageUrl);
          updateFormValues(numbers);
          setIsTextfromINAGEModalOpen(true); // テキスト入力モーダルを表示
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const fetchDetectedData = async (imageUrl) => {
    const response = await fetch('/process_image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });
    const data = await response.json();
    return data.numbers;
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleImageUpload} />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
    </div>
  );
};

export default ImageInputModal;
