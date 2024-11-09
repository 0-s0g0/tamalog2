///////////////////////////////////////////
// 現在状態管理カード
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from '../style.module.css'; 


// Props型定義
interface Props {
  latestEntry: {
    bodyWater: string;
    protein: string;
    minerals: string;
  };
  previousEntry: {
    bodyWater: string;
    protein: string;
    minerals: string;
  };
}
const CardNow: React.FC<Props> = ({ latestEntry, previousEntry }) => {
    // 変化量を計算する関数
const calculateChange = (latest: string, previous: string) => {
    const latestValue = parseFloat(latest);
    const previousValue = parseFloat(previous);
    const change = latestValue - previousValue;

    if (change > 0) {
      return { change: change.toFixed(2), sign: <span className={styles.changeINIndicator}>▲+</span>, color: 'increase' };
    } else if (change < 0) {
      return { change: (-change).toFixed(2), sign: <span className={styles.changeOUTIndicator}>▼-</span>, color: 'decrease' };
    } else {
      return { change: '--', sign: '', color: 'noChange' };
    }
  };
  
  const bodyWaterChange = calculateChange(latestEntry.bodyWater, previousEntry.bodyWater);
  const proteinChange = calculateChange(latestEntry.protein, previousEntry.protein);
  const mineralsChange = calculateChange(latestEntry.minerals, previousEntry.minerals);


  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>Water</div>
      <div className={styles.metricValue}>
        {parseFloat(latestEntry.bodyWater).toFixed(2)} kg
      </div>
      <span className={`${styles.changeIndicator} ${bodyWaterChange.color}`}>
        {bodyWaterChange.sign}{bodyWaterChange.change} kg
      </span>
    </div>
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>Protein</div>
      <div className={styles.metricValue}>
        {parseFloat(latestEntry.protein).toFixed(2)} kg
      </div>
      <span className={`${styles.changeIndicator} ${proteinChange.color}`}>
        {proteinChange.sign}{proteinChange.change} kg
      </span>
    </div>
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>Minerals</div>
      <div className={styles.metricValue}>
        {parseFloat(latestEntry.minerals).toFixed(2)} kg
      </div>
      <span className={`${styles.changeIndicator} ${mineralsChange.color}`}>
        {mineralsChange.sign}{mineralsChange.change} kg
      </span>
    </div>
  </div>
  );
};

export default CardNow;
