///////////////////////////////////////////
// テーブルデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './Datatables.module.css'; 
import { Entry } from '../type'; 

//親コンポーネントから受け取るプロパティの型の指定
interface DatatableProps {
  entries: Entry[]; // エントリーのデータ
  handleEdit: (id: string) => void; // 編集ボタンを押したときの処理
  handleDelete: (id: string) => void; // 削除ボタンを押したときの処理
}

// UIコンポーネント
const Datatable_UI: React.FC<DatatableProps> = ({ entries, handleEdit, handleDelete }) => {
  return (
    <div className="mt-1">
      {/* テーブルをラップするカードのスタイル */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* テーブルヘッダー: 各列の名前 */}
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
            {/* entries 配列の各エントリーをテーブルの行として描画 */}
            {entries.map((entry) => (
              <tr key={entry.id}>
                {/* 各列に対応するデータ */}
                <td>{entry.date}</td>
                <td>{entry.bodyWater}</td>
                <td>{entry.protein}</td>
                <td>{entry.minerals}</td>
                <td>{entry.bodyFat}</td>
                <td>{entry.totalWeight.toFixed(2)}</td>
                <td>
                  {/* 編集ボタン */}
                  <button onClick={() => handleEdit(entry.id)} className={styles.actionEditButton}>
                    Edit
                  </button>
                  {/* 削除ボタン */}
                  <button onClick={() => handleDelete(entry.id)} className={styles.actionDeleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Datatable_UI; // 他のコンポーネントで使えるようにエクスポート
