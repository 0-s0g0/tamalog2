///////////////////////////////////////////
//  円グラフデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './charts_Dounut.module.css'; 
import { Entry } from '../type';


//関数をインポート
import { getDonutChartData, donutChartOptions } from './charts'; 

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

const Charts_Dounut: React.FC<ChartsUIProps> = ({
  entries,
  latestEntry,
  bodyFatPercentage,
}) => {

  // ドーナツチャートのデータ
  const donutChartData = getDonutChartData(latestEntry);

  // UIコンポーネント
  return (
      <div>
      {/* 体組成分析 */}

        {/* 左側の円グラフ */}
        
        <div className={`${styles.graphCard} ${styles.donutChart}`}>
          <div className={styles.graphTitle1}>体組成</div>
          <div className={styles.chartWrapper}>
            <div className={styles.graphTitle2}>
              {bodyFatPercentage.toFixed(2)}%
            </div>
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
        </div>

          </div>

  );
};

export default Charts_Dounut;
