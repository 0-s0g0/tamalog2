///////////////////////////////////////////
// 折れ線グラフデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './charts_Line.module.css'; 
import { Entry } from '../type'; 

//関数をインポート
import { getLineChartData, donutChartOptions } from './charts'; 

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

const charts_Line: React.FC<ChartsUIProps> = ({
  entries,
  latestEntry,
  bodyFatPercentage,
}) => {

  // 折れ線グラフのデータ
  const lineChartData = getLineChartData(entries);
 

  // UIコンポーネント
  return (
    <div className="col-span-4">
      {/* 体重履歴 */}
      <div className={styles.graphCard}>
        <div className={styles.graphTitle}>Weight History</div>
        <Line data={lineChartData} />
      </div>
    </div>
  );
};

export default charts_Line;
