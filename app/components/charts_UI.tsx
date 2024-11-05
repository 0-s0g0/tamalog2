///////////////////////////////////////////
// 10. グラフデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from '../style.module.css'; 
import { Entry } from '../type'; 

//関数をインポート
import { getLineChartData, getDonutChartData, donutChartOptions } from './charts'; 

// Chart.js関連のインポート
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';

// Chart.jsコンポーネントの登録
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
  );

interface ChartsUIProps {
  entries: Entry[];  // Entry型の配列
  latestEntry: Entry; // 最新のエントリ
  bodyFatPercentage: number; // 体脂肪率
}

const ChartsUI: React.FC<ChartsUIProps> = ({
  entries,
  latestEntry,
  bodyFatPercentage,
}) => {


  // 折れ線グラフのデータ
  const lineChartData = getLineChartData(entries);
  // ドーナツチャートのデータ
  const donutChartData = getDonutChartData(latestEntry);

  // UIコンポーネント
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {/* 体重履歴 */}
      <div className={`${styles.graphCard} ${styles.lineChart}`}>
        <div className={styles.graphTitle}>Weight History</div>
        <Line data={lineChartData} />
      </div>

      {/* 体組成分析 */}
      <div className={`${styles.graphCard} ${styles.donutChart}`}>
        <div className={styles.graphTitle}>Body Composition Analysis</div>
        <Doughnut data={donutChartData} options={donutChartOptions} />
        <div className={styles.donutCenterLabel}>
          {bodyFatPercentage.toFixed(2)}
          <span className={styles.donutCenterLabel2}>%</span>
        </div>
      </div>
    </div>
  );
};

export default ChartsUI;
