import React, { useState, useEffect } from 'react';
import styles from './ProfileModale.module.css';
import { EntryAC } from '../type';
import { saveEntryACToFirestore, getEntryACNFromFirestore } from '../../../firebase/saveDataFunctions';

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isProfileModalOpen, setIsProfileModalOpen }) => {
  const [entryAC, setEntryAC] = useState<EntryAC | null>(null);
  const [editingField, setEditingField] = useState<keyof EntryAC | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [calculatedFat, setCalculatedFat] = useState<number | null>(null);
  const [calculatedLean, setCalculatedLean] = useState<number | null>(null);

  useEffect(() => {
    if (isProfileModalOpen) {
      getEntryACNFromFirestore(setEntryAC); // Firestoreからデータを取得
    }
  }, [isProfileModalOpen]);

  const handleSave = async () => {
    if (entryAC) {
      await saveEntryACToFirestore(entryAC); // Firestoreにデータを保存
      setEditingField(null); // 保存後、編集モードを終了
    }
  };

  const handleChange = (field: keyof EntryAC, value: string) => {
    if (entryAC) {
      setEntryAC({ ...entryAC, [field]: value });
    }
  };

  const handleEdit = (field: keyof EntryAC) => {
    setEditingField(field); // 編集モードに切り替え
  };

  // 計算処理
  const calculateTargets = () => {
    if (entryAC?.height && entryAC?.sex) {
      const heightInMeters = parseFloat(entryAC.height) / 100; // 身長をメートル単位に変換
      const standardBMI = entryAC.sex === 'male' ? 22 : 21;
      const idealFatRate = entryAC.sex === 'male' ? 0.15 : 0.23;
      const idealLeanRate = entryAC.sex === 'male' ? 0.85 : 0.77;

      // 標準体重 = 身長(m) × 身長(m) × 標準BMI
      const standardWeight = heightInMeters * heightInMeters * standardBMI;

      // 標準体脂肪量 = 標準体重 × 理想体脂肪率
      const standardFat = standardWeight * idealFatRate;

      // 標準除脂肪量 = 標準体重 × 理想除脂肪率
      const standardLean = standardWeight * idealLeanRate;

      setCalculatedWeight(standardWeight);
      setCalculatedFat(standardFat);
      setCalculatedLean(standardLean);
    }
  };

  if (!isProfileModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
        <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Profile Information</h2>
        {entryAC ? (
          <>
            {/* Nickname */}
            <div className="mb-4">
              <strong>Nickname:</strong>
              {editingField === 'nickname' ? (
                <>
                  <input 
                    type="text" 
                    value={entryAC.nickname} 
                    onChange={(e) => handleChange('nickname', e.target.value)} 
                  />
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.nickname}</span>
                  <button onClick={() => handleEdit('nickname')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* Goal Weight */}
            <div className="mb-4">
              <strong>Goal Weight:</strong>
              {editingField === 'goalWeight' ? (
                <>
                  <input 
                    type="number" 
                    value={entryAC.goalWeight} 
                    onChange={(e) => handleChange('goalWeight', e.target.value)} 
                  />
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.goalWeight} kg</span>
                  <button onClick={() => handleEdit('goalWeight')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* Goal Fat */}
            <div className="mb-4">
              <strong>Goal Fat:</strong>
              {editingField === 'goalFat' ? (
                <>
                  <input 
                    type="number" 
                    value={entryAC.goalFat} 
                    onChange={(e) => handleChange('goalFat', e.target.value)} 
                  />
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.goalFat}%</span>
                  <button onClick={() => handleEdit('goalFat')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* Goal Muscle */}
            <div className="mb-4">
              <strong>Goal Muscle:</strong>
              {editingField === 'goalMuscle' ? (
                <>
                  <input 
                    type="number" 
                    value={entryAC.goalMuscle} 
                    onChange={(e) => handleChange('goalMuscle', e.target.value)} 
                  />
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.goalMuscle} kg</span>
                  <button onClick={() => handleEdit('goalMuscle')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* Height */}
            <div className="mb-4">
              <strong>Height:</strong>
              {editingField === 'height' ? (
                <>
                  <input 
                    type="number" 
                    value={entryAC.height} 
                    onChange={(e) => handleChange('height', e.target.value)} 
                  />
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.height} cm</span>
                  <button onClick={() => handleEdit('height')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* Sex */}
            <div className="mb-4">
              <strong>Sex:</strong>
              {editingField === 'sex' ? (
                <>
                  <select 
                    value={entryAC.sex} 
                    onChange={(e) => handleChange('sex', e.target.value)} 
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <button onClick={handleSave} className={styles.modalButton}>Save</button>
                </>
              ) : (
                <>
                  <span>{entryAC.sex}</span>
                  <button onClick={() => handleEdit('sex')} className={styles.modalButton}>Edit</button>
                </>
              )}
            </div>

            {/* 目標体重の目安 */}
            <div className="mb-4">
              <h3>あなたの目標体重の目安</h3>
              <button 
                onClick={calculateTargets} 
                className={styles.modalButton} 
                disabled={!entryAC.height || !entryAC.sex}
              >
                計算する
              </button>
              {calculatedWeight && calculatedFat && calculatedLean && (
                <div>
                  <p><strong>標準体重：</strong>{calculatedWeight.toFixed(2)} kg</p>
                  <p><strong>標準体脂肪量：</strong>{calculatedFat.toFixed(2)} kg</p>
                  <p><strong>標準除脂肪量：</strong>{calculatedLean.toFixed(2)} kg</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>No profile data available. Please set up your profile.</p>
        )}

        <button onClick={() => setIsProfileModalOpen(false)} className={styles.modalButtonclose}>Close</button>
      </div>
    </div>
    </div>
  );
};

export default ProfileModal;
