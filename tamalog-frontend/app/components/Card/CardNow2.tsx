// CardNow2.tsx - 修正版
import React from 'react';
import styles from './CardNow2.module.css';
import Image from 'next/image';
import NowWater_img from '../../public/NowWater.png';
import NowMineral_img from '../../public/NowMinerals.png';
import NowPritein_img from '../../public/NowPritein.png';

// Chart.js関連のインポート
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  bodyFatPercentage: number;
  donutChartData: any; // Chart.jsのデータ型
  donutChartOptions: any; // Chart.jsのオプション型
}

const CardNow2: React.FC<Props> = ({ 
  latestEntry, 
  previousEntry, 
  bodyFatPercentage,
  donutChartData,
  donutChartOptions 
}) => {
  // 変化量を計算する関数
  const calculateChange = (latest: string, previous: string) => {
    const latestValue = parseFloat(latest);
    const previousValue = parseFloat(previous);
    const change = latestValue - previousValue;

    if (change > 0) {
      return { 
        change: change.toFixed(2), 
        sign: <span className={styles.changeINIndicator}>▲+</span>, 
        color: 'increase' 
      };
    } else if (change < 0) {
      return { 
        change: (-change).toFixed(2), 
        sign: <span className={styles.changeOUTIndicator}>▼-</span>, 
        color: 'decrease' 
      };
    } else {
      return { change: '--', sign: '', color: 'noChange' };
    }
  };

  const bodyWaterChange = calculateChange(latestEntry.bodyWater, previousEntry.bodyWater);
  const proteinChange = calculateChange(latestEntry.protein, previousEntry.protein);
  const mineralsChange = calculateChange(latestEntry.minerals, previousEntry.minerals);

  // プログレスバーの計算（仮の最大値を使用）
  const getProgressPercentage = (value: string, maxValue: number) => {
    return (parseFloat(value) / maxValue) * 100;
  };

  return (
    <div className={styles.container}>
      {/* 上部の統合されたカード */}
      <div className={styles.mainCard}>
        {/* 左側：ドーナツチャート */}
        <div className={styles.chartSection}>
          <div className={styles.graphTitle}>体組成</div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartCenter}>
              {bodyFatPercentage.toFixed(2)}%
            </div>
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
        </div>

        {/* 右側：プログレスバー */}
        <div className={styles.progressSection}>
          {/* 体水分 */}
          <div className={styles.progressItem}>
            <div className={styles.changeValue}>
              {bodyWaterChange.sign}{bodyWaterChange.change}kg
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.waterProgress}`}
                style={{ width: `${getProgressPercentage(latestEntry.bodyWater, 40)}%` }}
              ></div>
            </div>
          </div>

          {/* タンパク質 */}
          <div className={styles.progressItem}>
            <div className={styles.changeValue}>
              {proteinChange.sign}{proteinChange.change}kg
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.proteinProgress}`}
                style={{ width: `${getProgressPercentage(latestEntry.protein, 15)}%` }}
              ></div>
            </div>
          </div>

          {/* ミネラル */}
          <div className={styles.progressItem}>
            <div className={styles.changeValue}>
              {mineralsChange.sign}{mineralsChange.change}kg
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.mineralProgress}`}
                style={{ width: `${getProgressPercentage(latestEntry.minerals, 5)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 下部の4つのカード */}
      <div className={styles.bottomCards}>
        {/* タンパク質カード */}
        <div className={styles.smallCard}>
          <div className={styles.smallIconWrapper}>
            <Image src={NowPritein_img} alt='NowProtein' width={30} height={30} />
          </div>
          <div className={styles.smallCardValue}>
            {parseFloat(latestEntry.protein).toFixed(2)}kg
          </div>
        </div>

        {/* 体水分カード */}
        <div className={styles.smallCard}>
          <div className={styles.smallIconWrapper}>
            <Image src={NowWater_img} alt='NowWater' width={30} height={30} />
          </div>
          <div className={styles.smallCardValue}>
            {parseFloat(latestEntry.bodyWater).toFixed(2)}kg
          </div>
        </div>

        {/* ミネラルカード（左下） */}
        <div className={styles.smallCard}>
          <div className={styles.smallIconWrapper}>
            <Image src={NowMineral_img} alt='NowMinerals' width={30} height={30} />
          </div>
          <div className={styles.smallCardValue}>
            {parseFloat(latestEntry.minerals).toFixed(2)}kg
          </div>
        </div>

        {/* 体脂肪率カード（右下） */}
        <div className={styles.smallCard}>
          <div className={styles.smallIconWrapper}>
            <span style={{ fontSize: '20px' }}>⭐</span>
          </div>
          <div className={styles.smallCardValue}>
            {bodyFatPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNow2;