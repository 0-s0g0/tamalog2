"use client";

import Link from 'next/link';
import Image from 'next/image';
import sample_img from '@/public/image01.png';
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './style.module.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface Entry {
  
  id: string;
  date: string;
  bodyWater: string;
  protein: string;
  minerals: string;
  bodyFat: string;
  totalWeight: number;
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState('');
  const [bodyWater, setBodyWater] = useState('');
  const [protein, setProtein] = useState('');
  const [minerals, setMinerals] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await fetch('/api/post');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !bodyWater || !protein || !minerals || !bodyFat) {
      alert('全てのフィールドに入力してください');
      return;
    }
    const totalWeight = parseFloat(bodyWater) + parseFloat(protein) + parseFloat(minerals) + parseFloat(bodyFat);
    const newEntry: Entry = { id: editingId || Date.now().toString(), date, bodyWater, protein, minerals, bodyFat, totalWeight };

    if (editingId) {
      await fetch('/api/post', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      setEntries(entries.map(entry => (entry.id === editingId ? newEntry : entry)));
    } else {
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      setEntries([...entries, newEntry]);
    }

    setDate('');
    setBodyWater('');
    setProtein('');
    setMinerals('');
    setBodyFat('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setDate(entry.date);
      setBodyWater(entry.bodyWater);
      setProtein(entry.protein);
      setMinerals(entry.minerals);
      setBodyFat(entry.bodyFat);
      setEditingId(entry.id);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      await fetch('/api/post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const latestEntry = entries[entries.length - 1] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };

  const previousEntry = entries[entries.length - 2] || {
    bodyWater: '0',
    protein: '0',
    minerals: '0',
    bodyFat: '0'
  };

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

  const lineChartData = {
    labels: entries.map(entry => entry.date),
    datasets: [
      {
        label: '体重',
        data: entries.map(entry => entry.totalWeight),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const calculateBodyFatPercentage = (bodyFat: number, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    return (bodyFat / totalWeight) * 100;
  };

  const bodyFatPercentage = calculateBodyFatPercentage(parseFloat(latestEntry.bodyFat), latestEntry.totalWeight);

  const donutChartData = {
    labels: ['体水分', 'タンパク質', 'ミネラル', '体脂肪'],
    datasets: [
      {
        data: [parseFloat(latestEntry.bodyWater), parseFloat(latestEntry.protein), parseFloat(latestEntry.minerals), parseFloat(latestEntry.bodyFat)],
        backgroundColor: ['#99CCFF', '#9EFFCE', '#FFFF9E', '#FF9E9E'],
        borderWidth: 1,
      },
    ],
  };

  const donutChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kg`;
          }
        }
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        formatter: (value: number) => value.toFixed(2),
        color: '#fff',
        font: {
          weight: 'bold',
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', display: 'flex' }} className="flex">
      <aside className={styles.sidebar}>
        <button onClick={() => setIsModalOpen(true)} className={styles.sidebarButton}>📝</button>
        {/* 他のアイコンを追加する場合はここに */}
      </aside>

      <div className="flex-1 p-24">
        <h1 className="text-2xl font-bold mb-4">Home Page!</h1>
        <Link href='/create-post'>Move Create Post Page</Link>
        <Image
          src={sample_img}
          alt="Sample image"
          width={200}
          height={300}
        />

        {/* 最新のメトリクス表示 */}
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

        {/* グラフ表示 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${styles.graphCard} ${styles.lineChart}`}>
            <div className={styles.graphTitle}>Weight History</div>
            <Line data={lineChartData} />
          </div>
          <div className={`${styles.graphCard} ${styles.donutChart}`}>
            <div className={styles.graphTitle}>Body Composition Analysis</div>
            <Doughnut data={donutChartData} options={donutChartOptions} />
            <div className={styles.donutCenterLabel}>
              {bodyFatPercentage.toFixed(2)}<span className={styles.donutCenterLabel2}>%</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>Body Water</th>
                  <th>Protein</th>
                  <th>Mineral</th>
                  <th>Body Fat</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.bodyWater}</td>
                    <td>{entry.protein}</td>
                    <td>{entry.minerals}</td>
                    <td>{entry.bodyFat}</td>
                    <td>{entry.totalWeight.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEdit(entry.id)} className={styles.actionEditButton}>Edit</button>
                      <button onClick={() => handleDelete(entry.id)} className={styles.actionDeleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Data' : 'Add Data'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Body Water:</label>
                <input
                  type="number"
                  step="any"
                  value={bodyWater}
                  onChange={(e) => setBodyWater(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Protein:</label>
                <input
                  type="number"
                  step="any"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Minerals:</label>
                <input
                  type="number"
                  step="any"
                  value={minerals}
                  onChange={(e) => setMinerals(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Body Fat:</label>
                <input
                  type="number"
                  step="any"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <button type="submit" className={styles.modalButton}>{editingId ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className={styles.modalButtonclose}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
