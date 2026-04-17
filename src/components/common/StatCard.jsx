import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="cf-card stat-card">
      <div className="stat-card-header">
        <h3 className="stat-title">{title}</h3>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <div className="stat-value">
        {typeof value === 'string' && (value.includes('₫') || value.includes('đ')) ? (
          <>
            {value.replace(/[₫đ]/g, '').trim()}
            <span className="currency-symbol"> ₫</span>
          </>
        ) : (
          value
        )}
      </div>
      {(subtitle || trend) && (
        <div className="stat-footer">
          {trend && (
            <span className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
