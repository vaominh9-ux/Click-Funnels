import React, { useEffect, useState } from 'react';
import './style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { PlayCircle, XCircle, CheckSquare, ArrowRight, ArrowDown, AlertTriangle, ShieldCheck } from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-1'];

const Course1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hook theo dõi ref
  useFunnelTracking();

  return (
    <div className="hormozi-container">
      {/* ─── VSL HERO SECTION ─── */}
      <section className="hz-hero">
        <div className="wrapper">
          <div className="hz-eyebrow">
            <AlertTriangle size={18} strokeWidth={3} />
            CHÚ Ý: DÀNH RIÊNG CHO CHỦ DOANH NGHIỆP, CEO VÀ FOUNDER B2B
          </div>
          
          <h1 className="hz-headline">
            Làm Thế Nào Để Gắn Thêm <span>1 Hệ Thống "Sale AI" Chạm Trán</span> Chốt Khách 24/7 Mà KHÔNG Cần Trả Lương & Đẩy Doanh Thu Lên Gấp 3 Lần Trong 30 Ngày Tới?
          </h1>
          
          <p className="hz-subheadline">
            ...Ngay cả khi bạn "mù tịt" công nghệ, và đội ngũ Sales hiện tại của bạn đang kêu trời vì Lead rác quá nhiều!
          </p>

          <div className="hz-video-wrapper">
            <div className="hz-video-placeholder">
              <PlayCircle className="hz-play-icon" size={64} />
              <div className="hz-video-text">BẤM VÀO ĐỂ XEM BÍ MẬT 12 PHÚT NÀY</div>
            </div>
            <div className="hz-video-shadow"></div>
          </div>

          <div className="hz-cta-container">
            <button className="hz-btn hz-btn-main" onClick={() => setIsModalOpen(true)}>
              YES! TÔI MUỐN TỰ ĐỘNG HÓA DOANH NGHIỆP NGAY <ArrowRight size={24} strokeWidth={3} />
            </button>
            <p className="hz-urgency">🔥 Lưu ý: Miễn phí truy cập giới hạn. Giá sẽ TĂNG GẤP ĐÔI vào ngày mai!</p>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM: THE OLD WAY ─── */}
      <section className="hz-section bg-gray">
        <div className="wrapper-narrow">
          <h2 className="hz-section-title">THE OLD WAY IS DEAD.</h2>
          <p className="hz-lead-text">Hãy thành thật đi. Đội ngũ bán hàng của bạn đang lãng phí hàng trăm triệu đồng mỗi tháng vì những lỗi ngớ ngẩn này:</p>
          
          <ul className="hz-pain-list">
            <li>
              <div className="hz-icon-red"><XCircle size={24} /></div>
              <span><strong>Mất Khách Vì Rep Chậm:</strong> Khách nhắn tin lúc 10h đêm, Sale của bạn thì đang ngủ khò khò. Khách sang mua của đối thủ.</span>
            </li>
            <li>
              <div className="hz-icon-red"><XCircle size={24} /></div>
              <span><strong>Đốt Tiền Marketing Vào Lead Rác:</strong> Đổ tiền chạy Ads nhưng Sale gọi thì tò tí te hoặc "Em bấm nhầm".</span>
            </li>
            <li>
              <div className="hz-icon-red"><XCircle size={24} /></div>
              <span><strong>Phụ Thuộc Cảm Xúc Nhân Viên:</strong> Sale vui thì chốt nhiệt tình, Sale chia tay người yêu thì bỏ bê mỏ rác khách hàng.</span>
            </li>
          </ul>

          <div className="hz-down-arrow"><ArrowDown size={40} /></div>

          <h2 className="hz-section-title">THE NEW WAY: AI AUTOMATION.</h2>
          <ul className="hz-benefit-list">
            <li>
              <div className="hz-icon-green"><CheckSquare size={24} /></div>
              <span><strong>Tự Động Trả Lời & Xin Số Trong 3 Giây:</strong> Dù là 3h sáng mùng 1 Tết, hệ thống AI vẫn nhiệt tình tư vấn khách.</span>
            </li>
            <li>
              <div className="hz-icon-green"><CheckSquare size={24} /></div>
              <span><strong>Lọc Tạp Khách Rác Tự Động:</strong> Phễu AI sẽ tự động mồi kịch bản để chỉ lọc lại KHÁCH VIP đưa cho Sale ruột chốt.</span>
            </li>
            <li>
              <div className="hz-icon-green"><CheckSquare size={24} /></div>
              <span><strong>Bám Đuổi Khách Tới Chết:</strong> Tự động Zalo ZNS, Zalo cá nhân, Email bám đuổi theo quy trình được thiết kế sẵn.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── THE STACK (OFFER) ─── */}
      <section className="hz-section bg-dark">
        <div className="wrapper-narrow">
          <h2 className="hz-section-title text-white">BẠN SẼ NHẬN ĐƯỢC GÌ HÔM NAY?</h2>
          
          <div className="hz-stack-box">
            <h3 className="hz-stack-header">THE B2B AI AUTOMATION STACK</h3>
            
            <ul className="hz-stack-items">
              <li>
                <div className="stack-name">Module 1: Hệ Thống Lead-Gen Ma Trận</div>
                <div className="stack-value">(Trị giá: 5,000,000đ)</div>
              </li>
              <li>
                <div className="stack-name">Module 2: Nhân Bản AI Chatbot Nuôi Khách</div>
                <div className="stack-value">(Trị giá: 7,500,000đ)</div>
              </li>
              <li>
                <div className="stack-name">Module 3: Đồng Bộ CRM Dành Cho Doanh Nghiệp</div>
                <div className="stack-value">(Trị giá: 4,000,000đ)</div>
              </li>
              <li className="stack-bonus">
                <div className="stack-name">✅ BONUS #1: Kịch bản Chốt Sales B2B Mẫu (Ngành Xây Dựng, Thẩm Mỹ, Dịch Vụ)</div>
                <div className="stack-value">(Trị giá: 3,000,000đ)</div>
              </li>
              <li className="stack-bonus">
                <div className="stack-name">✅ BONUS #2: Support Kèm Cặp Setup Zoom 1-1 Chống Trượt</div>
                <div className="stack-value">(VÔ GIÁ)</div>
              </li>
            </ul>

            <div className="hz-stack-total">
              TỔNG GIÁ TRỊ: <span className="strike">19,500,000đ</span>
            </div>
            
            <div className="hz-stack-today">
              GIÁ DUY NHẤT HÔM NAY: <span>{COURSE_INFO.price.toLocaleString('vi-VN')} đ</span>
            </div>

            <button className="hz-btn hz-btn-main wide" onClick={() => setIsModalOpen(true)}>
              NHẬN TOÀN BỘ HỆ THỐNG NÀY TRƯỚC KHI ĐÓNG CỬA
            </button>
          </div>
        </div>
      </section>

      {/* ─── CRAZY GUARANTEE ─── */}
      <section className="hz-section bg-white">
        <div className="wrapper-narrow">
          <div className="hz-guarantee-box">
            <ShieldCheck size={64} className="hz-g-icon" />
            <h2>BẢO HÀNH ĐIÊN RỒ: 100% NO B.S. GUARANTEE</h2>
            <p>
              Tôi tự tin đến mức sẽ đưa ra lời thề này: Nếu bạn học xong, ráp thử vào doanh nghiệp trong vòng 14 Ngày mà cảm thấy **chẳng có tích sự mẹ gì cả**... 
              Hãy nhắn ngay cho trợ lý của tôi. Chúng tôi sẽ **HOÀN TIỀN LẠI 100% CHO BẠN**. Không hỏi lằng nhằng. Không thủ tục rườm rà. Bạn giữ lại luôn cả mớ TÀI LIỆU BONUS kia như một lời xin lỗi vì tôi đã lãng phí thời gian của bạn. 
              <br/><br/>
              <strong>Bạn CÓ TẤT CẢ ĐỂ ĐƯỢC VÀ CHẲNG CÓ GÌ ĐỂ MẤT CẢ!</strong>
            </p>
          </div>
          
          <div className="hz-final-cta text-center mt-10">
            <button className="hz-btn hz-btn-main" onClick={() => setIsModalOpen(true)}>
              CHO TÔI VÀO BÊN TRONG NGAY BÂY GIỜ!
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} 
        courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course1;
