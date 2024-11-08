///////////////////////////////////////////
// テーブルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from '../style.module.css'; 
import { Entry } from './type'; 


interface MetricsGoalProps {
  latestEntry: { bodyWater: string; protein: string; minerals: string };
  previousEntry: { bodyWater: string; protein: string; minerals: string };
}

const MetricsGoal: React.FC<MetricsGoalProps> = ({ latestEntry, previousEntry }) => {
  // 最新と前回のエントリーがundefinedまたはnullの場合にデフォルト値を設定
  const safeLatestEntry = latestEntry || { bodyWater: '0', protein: '0', minerals: '0' };
  const safePreviousEntry = previousEntry || { bodyWater: '0', protein: '0', minerals: '0' };

  // calculateChange関数をMetricsGrid内に統合
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

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {/* Water Metric */}
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Water</div>
        <div className={styles.metricValue}>
          {parseFloat(safeLatestEntry.bodyWater).toFixed(2)} kg
        </div>
        <span className={`${styles.changeIndicator} ${calculateChange(safeLatestEntry.bodyWater, safePreviousEntry.bodyWater).color}`}>
          {calculateChange(safeLatestEntry.bodyWater, safePreviousEntry.bodyWater).sign}
          {calculateChange(safeLatestEntry.bodyWater, safePreviousEntry.bodyWater).change} kg
        </span>
      </div>

      {/* Protein Metric */}
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Protein</div>
        <div className={styles.metricValue}>
          {parseFloat(safeLatestEntry.protein).toFixed(2)} kg
        </div>
        <span className={`${styles.changeIndicator} ${calculateChange(safeLatestEntry.protein, safePreviousEntry.protein).color}`}>
          {calculateChange(safeLatestEntry.protein, safePreviousEntry.protein).sign}
          {calculateChange(safeLatestEntry.protein, safePreviousEntry.protein).change} kg
        </span>
      </div>

      {/* Minerals Metric */}
      <div className={styles.metricCard}>
        <div className={styles.metricLabel}>Minerals</div>
        <div className={styles.metricValue}>
          {parseFloat(safeLatestEntry.minerals).toFixed(2)} kg
        </div>
        <span className={`${styles.changeIndicator} ${calculateChange(safeLatestEntry.minerals, safePreviousEntry.minerals).color}`}>
          {calculateChange(safeLatestEntry.minerals, safePreviousEntry.minerals).sign}
          {calculateChange(safeLatestEntry.minerals, safePreviousEntry.minerals).change} kg
        </span>
      </div>
    </div>
  );
};

export default MetricsGoal;
