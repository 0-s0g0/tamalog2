///////////////////////////////////////////
// 折れ線グラフデータ
///////////////////////////////////////////

//共通インポート
import React, { useState } from 'react';
import styles from './charts_Line.module.css'; 
import { Entry } from '../type'; 

//関数をインポート
import { getLineChartData, donutChartOptions } from './charts'; 

// Chart.js関連のインポート
import { Line } from 'react-chartjs-2';
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

const Charts_Line: React.FC<ChartsUIProps> = ({
  entries,
  latestEntry,
  bodyFatPercentage,
}) => {

  // State for the selected metric
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'totalMuscle'>('weight');

  // Function to toggle metric
  const handleMetricChange = (metric: 'weight' | 'bodyFat' | 'totalMuscle') => {
    setSelectedMetric(metric);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchEnd = (metric: 'weight' | 'bodyFat' | 'totalMuscle') => (e: React.TouchEvent) => {
    e.preventDefault();
    handleMetricChange(metric);
  };

  // Data for the selected chart
  const chartData = (() => {
    switch (selectedMetric) {
      case 'bodyFat':
        return getLineChartData(entries, 'bodyFat');
      case 'totalMuscle':
        return getLineChartData(entries, 'totalMuscle');
      default:
        return getLineChartData(entries, 'totalWeight');
    }
  })();

  // UIコンポーネント
  return (
    <div className="col-span-4">
      {/* Metric Selection Buttons */}
      <div className={styles.buttonGroup}>
  <button
    onClick={() => handleMetricChange('weight')}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd('weight')}
    style={{
      color: selectedMetric === 'weight' ? '#d3d3d3' : 'rgba(75, 192, 192, 1)', // Weight (Green)
      backgroundColor: selectedMetric === 'weight' ? 'rgba(75, 192, 192, 1)' : '#d3d3d3'
    }}
    className={selectedMetric === 'weight' ? styles.activeButton : ''}
  >
    Weight
  </button>
  
  <button
    onClick={() => handleMetricChange('bodyFat')}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd('bodyFat')}
    style={{
      color: selectedMetric === 'bodyFat' ? '#d3d3d3' : 'rgba(255, 99, 132, 1)', // Body Fat (Red)
      backgroundColor: selectedMetric === 'bodyFat' ? 'rgba(255, 99, 132, 1)' : '#d3d3d3'
    }}
    className={selectedMetric === 'bodyFat' ? styles.activeButton : ''}
  >
    BodyFat
  </button>
  
  <button
    onClick={() => handleMetricChange('totalMuscle')}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd('totalMuscle')}
    style={{
      color: selectedMetric === 'totalMuscle' ? '#d3d3d3' : 'rgba(54, 162, 235, 1)', // Total Muscle (Blue)
      backgroundColor: selectedMetric === 'totalMuscle' ? 'rgba(54, 162, 235, 1)' : '#d3d3d3'
    }}
    className={selectedMetric === 'totalMuscle' ? styles.activeButton : ''}
  >
    Muscle
  </button>
</div>


      {/* Display Selected Metric's Graph */}
      <div className={styles.graphCard}>
        <div className={styles.graphTitle}>
          {selectedMetric === 'weight' ? 'Weight History' : selectedMetric === 'bodyFat' ? 'Body Fat History' : 'Total Muscle History'}
        </div>
        <Line data={chartData} style={{fontFamily: 'KraftMincho'}}/>
      </div>
    </div>
  );
};

export default Charts_Line;
