import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trophy, Users, TrendingUp, Medal, ChevronDown, Crown } from 'lucide-react';
import './LeaderboardWidget.css';

const RANK_STYLES = [
  { rank: 1, bg: 'linear-gradient(135deg, #F59E0B, #D97706)',     color: '#fff', icon: <Crown size={18} />, shadow: '0 8px 25px rgba(245,158,11,0.5)' },
  { rank: 2, bg: 'linear-gradient(135deg, #94A3B8, #64748B)',     color: '#fff', icon: <Medal size={16} />, shadow: '0 4px 15px rgba(148,163,184,0.4)' },
  { rank: 3, bg: 'linear-gradient(135deg, #D97706, #92400E)',     color: '#fff', icon: <Medal size={16} />, shadow: '0 4px 15px rgba(217,119,6,0.3)' },
];

const LeaderboardWidget = ({ currentUserId }) => {
  const [tab, setTab] = useState('revenue'); // 'revenue' | 'leads'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const rpcName = tab === 'revenue' ? 'get_leaderboard_revenue' : 'get_leaderboard_leads';
      const { data: result, error } = await supabase.rpc(rpcName, {
        p_month: month,
        p_year: year,
        p_limit: 10
      });

      if (error) {
        console.error('Leaderboard RPC error:', error);
        setData([]);
      } else {
        setData(result || []);
        // Tìm xếp hạng bản thân
        const me = result?.find(r => r.affiliate_id === currentUserId);
        setMyRank(me || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (item) => {
    if (tab === 'revenue') {
      return new Intl.NumberFormat('vi-VN').format(item.total_revenue || 0);
    }
    return `${item.total_leads || 0} leads`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Reorder for podium: [Rank 2, Rank 1, Rank 3]
  const top3 = data.slice(0, 3);
  let podiumOrder = [];
  if (top3.length === 1) podiumOrder = [null, top3[0], null];
  else if (top3.length === 2) podiumOrder = [top3[1], top3[0], null];
  else if (top3.length === 3) podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="lb-widget">
      <div className="lb-header">
        <div className="lb-title">
          <Trophy size={20} className="lb-trophy-icon" />
          <h3>Bảng Vàng Tháng {month}/{year}</h3>
        </div>
        <div className="lb-tabs">
          <button 
            className={`lb-tab ${tab === 'revenue' ? 'active' : ''}`} 
            onClick={() => setTab('revenue')}
          >
            <TrendingUp size={14} /> Doanh Số
          </button>
          <button 
            className={`lb-tab ${tab === 'leads' ? 'active' : ''}`} 
            onClick={() => setTab('leads')}
          >
            <Users size={14} /> Leads
          </button>
        </div>
      </div>

      {loading ? (
        <div className="lb-loading">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="lb-skeleton-row">
              <div className="lb-skeleton lb-sk-rank"></div>
              <div className="lb-skeleton lb-sk-avatar"></div>
              <div className="lb-skeleton lb-sk-name"></div>
              <div className="lb-skeleton lb-sk-value"></div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="lb-empty">
          <Medal size={40} strokeWidth={1.5} />
          <p>Chưa có chiến binh nào lập thành tích trong tháng này.</p>
          <span>Hãy là người đầu tiên chinh phục Bảng Vàng!</span>
        </div>
      ) : (
        <>
          {/* TOP 3 PODIUM */}
          <div className="lb-podium">
            {podiumOrder.map((item, idx) => {
              // original rank index: index 0 -> rank 2, index 1 -> rank 1, index 2 -> rank 3
              const styleIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2; 
              
              if (!item) {
                return <div key={`empty-${idx}`} className="lb-podium-card-empty"></div>;
              }
              
              return (
                <div key={item.affiliate_id} className={`lb-podium-card rank-${styleIdx + 1}`} style={{ boxShadow: RANK_STYLES[styleIdx]?.shadow }}>
                  <div className={`lb-podium-rank r-${styleIdx+1}`} style={{ background: RANK_STYLES[styleIdx]?.bg, color: RANK_STYLES[styleIdx]?.color }}>
                    {RANK_STYLES[styleIdx]?.icon}
                  </div>
                  <div className={`lb-podium-avatar a-${styleIdx+1}`} style={{ background: RANK_STYLES[styleIdx]?.bg }}>
                    {getInitials(item.full_name)}
                  </div>
                  <div className="lb-podium-name">{item.full_name || 'Ẩn danh'}</div>
                  <div className="lb-podium-value">{formatValue(item)}{tab === 'revenue' && ' đ'}</div>
                  <div className="lb-podium-tier">{item.tier?.toUpperCase() || 'STARTER'}</div>
                </div>
              );
            })}
          </div>

          {/* REST OF LIST */}
          {data.length > 3 && (
            <div className="lb-list">
              {data.slice(3).map((item) => (
                <div 
                  key={item.affiliate_id} 
                  className={`lb-row ${item.affiliate_id === currentUserId ? 'lb-row-me' : ''}`}
                >
                  <span className="lb-row-rank">#{item.rank}</span>
                  <div className="lb-row-avatar">{getInitials(item.full_name)}</div>
                  <div className="lb-row-info">
                    <span className="lb-row-name">
                      {item.full_name || 'Ẩn danh'}
                      {item.affiliate_id === currentUserId && <span className="lb-you-badge">BẠN</span>}
                    </span>
                    <span className="lb-row-tier">{item.tier?.toUpperCase()}</span>
                  </div>
                  <span className="lb-row-value">{formatValue(item)}</span>
                </div>
              ))}
            </div>
          )}

          {/* MY RANK FOOTER */}
          {myRank && (
            <div className="lb-my-rank">
              <Medal size={16} />
              <span>Hạng <strong>#{myRank.rank}</strong> — Bạn đang ở vị trí này. Cố lên!</span>
            </div>
          )}
          {!myRank && currentUserId && (
            <div className="lb-my-rank lb-unranked">
              <span>Bạn chưa lọt BXH tháng này. Hãy chốt đơn đầu tiên!</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardWidget;
