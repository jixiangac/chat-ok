// 行程列表组件
import React, { useState } from 'react';
import { Trip } from '../../types';
import TripCard from './TripCard';
import styles from './styles.module.css';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onCreateTrip: () => void;
  onShowTripDetail?: (trip: Trip) => void;
}

// 图标组件
const PlusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TripList: React.FC<TripListProps> = ({
  trips,
  onSelectTrip,
  onDeleteTrip,
  onCreateTrip,
  onShowTripDetail,
}) => {
  const handleShowDetail = (trip: Trip) => {
    if (onShowTripDetail) {
      onShowTripDetail(trip);
    } else {
      onSelectTrip(trip.id);
    }
  };

  return (
    <div>
      {/* 标题 */}
      <div className={styles.title}>
        <h2 className={styles.titleText}>我的行程</h2>
      </div>

      {/* 行程列表 */}
      <div className={styles.container}>
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onSelect={() => onSelectTrip(trip.id)}
            onDelete={() => onDeleteTrip(trip.id)}
            onShowDetail={() => handleShowDetail(trip)}
          />
        ))}

        {/* 创建新行程按钮 */}
        <div className={styles.createBtn} onClick={onCreateTrip}>
          <div className={styles.createIcon}>
            <PlusIcon />
          </div>
          <span className={styles.createText}>创建新行程</span>
        </div>

        {/* 空状态提示 */}
        {trips.length === 0 && <div className={styles.empty}>点击上方创建你的第一个旅行行程</div>}
      </div>
    </div>
  );
};

export default TripList;
