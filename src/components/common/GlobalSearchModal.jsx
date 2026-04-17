import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './GlobalSearchModal.css';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ leads: [], conversions: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults({ leads: [], conversions: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const searchData = async () => {
      if (!query.trim()) {
        setResults({ leads: [], conversions: [] });
        return;
      }

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Tìm Leads
        const { data: leads } = await supabase
          .from('leads')
          .select('id, name, phone, email, notes, created_at')
          .eq('affiliate_id', user.id)
          .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(3);

        // Tìm Đơn Hàng (Conversions)
        const { data: conversions } = await supabase
          .from('conversions')
          .select('id, customer_name, product_name, sale_amount, status, created_at')
          .eq('affiliate_id', user.id)
          .or(`customer_name.ilike.%${query}%,product_name.ilike.%${query}%`)
          .limit(3);

        setResults({
          leads: leads || [],
          conversions: conversions || []
        });
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    };

    const debounceId = setTimeout(searchData, 300);
    return () => clearTimeout(debounceId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header Search Input */}
        <div className="gl-search-header">
          <Search size={20} className="gl-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm theo Tên khách, Số điện thoại hoặc Tên khóa học..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="gl-search-close" onClick={onClose}>
            Hủy
          </button>
        </div>

        {/* Search Results */}
        <div className="gl-search-results">
          {!query.trim() && (
            <div className="gl-search-empty text-muted">
              Nhập từ khóa bất kỳ để truy xuất kho dữ liệu của bạn...
            </div>
          )}

          {query.trim() && loading && (
            <div className="gl-search-empty text-muted">Đang tìm kiếm...</div>
          )}

          {query.trim() && !loading && results.leads.length === 0 && results.conversions.length === 0 && (
            <div className="gl-search-empty text-muted">
              Không tìm thấy kết quả nào phù hợp với "{query}".
            </div>
          )}

          {results.leads.length > 0 && (
            <div className="gl-search-group">
              <div className="gl-search-group-title">Khách Hàng (Leads)</div>
              {results.leads.map(lead => (
                <div className="gl-search-item" key={lead.id} onClick={() => handleNavigate('/portal/customers')}>
                  <div className="gl-item-icon blue"><User size={16} /></div>
                  <div className="gl-item-info">
                    <div className="font-bold">{lead.name} <span className="text-muted" style={{fontWeight: 400}}>• {lead.phone}</span></div>
                    <div className="gl-item-sub">Quan tâm: {lead.notes?.replace('Đăng ký từ khóa học: ', '') || 'Chưa rõ'}</div>
                  </div>
                  <ArrowRight size={14} className="gl-arrow text-muted" />
                </div>
              ))}
            </div>
          )}

          {results.conversions.length > 0 && (
            <div className="gl-search-group">
              <div className="gl-search-group-title">Đơn Hàng & Doanh Thu</div>
              {results.conversions.map(conv => (
                <div className="gl-search-item" key={conv.id} onClick={() => handleNavigate('/portal/customers')}>
                  <div className={`gl-item-icon ${conv.status === 'approved' ? 'green' : 'orange'}`}>
                    <ShoppingBag size={16} />
                  </div>
                  <div className="gl-item-info">
                    <div className="font-bold">{conv.customer_name} <span className="text-muted" style={{fontWeight: 400}}>• {conv.product_name}</span></div>
                    <div className="gl-item-sub">
                      Trị giá: <strong style={{color: '#10B981'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(conv.sale_amount)}</strong> 
                      <span style={{marginLeft: 8, display: 'inline-block', padding: '2px 6px', background: conv.status === 'approved' ? '#D1FAE5' : '#FEF3C7', color: conv.status === 'approved' ? '#065F46' : '#92400E', borderRadius: 4, fontSize: 11}}>
                        {conv.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="gl-arrow text-muted" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
