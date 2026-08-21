import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="section-container">
        <section className="hero">
          <h1>IRM Extra Property Management</h1>
          <p>บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด (IRM Extra Co., Ltd.) บริษัทในเครือ IRM ให้บริการด้านบริหารทรัพย์สินโดยทีมงานมืออาชีพ ครอบคลุมพื้นที่ภาคอีสานและภาคเหนือ</p>
          <Link href="/jobs" className="btn">ร่วมงานกับเรา</Link>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Welcome</h2>
          <p>บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด ก่อตั้งขึ้นเมื่อวันที่ 20 กรกฎาคม 2554 เป็นบริษัทในเครือ IRM ที่ให้บริการด้านบริหารทรัพย์สินอย่างครบวงจร ตั้งแต่งานบริหารอาคาร งานกฎหมาย งานบัญชีการเงิน ไปจนถึงงานวิศวกรรมและซ่อมบำรุง โดยมุ่งเน้นการให้บริการในพื้นที่ภาคอีสานและภาคเหนือ</p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>จุดเด่นของเรา</h2>
          <div className="card-grid">
            {[
              { title: '30+ ปี', desc: 'ประสบการณ์ของผู้บริหาร' },
              { title: 'Professional Team', desc: 'ทีมงานมืออาชีพ' },
              { title: 'Legal & Engineering', desc: 'ทีมกฎหมายและวิศวกรรม' },
              { title: 'Accounting System', desc: 'ระบบบัญชีและการเงิน' },
              { title: 'Fast Response', desc: 'ศูนย์รับเรื่องร้องเรียนและแก้ไขปัญหา' },
            ].map((item) => (
              <div key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-box" style={{ textAlign: 'center' }}>
          <h2>ผลงานของเรา</h2>
          <p>ดูโครงการที่เราดูแลอยู่ในพื้นที่นครราชสีมาและเขาใหญ่</p>
          <Link href="/projects" className="btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>ดูผลงานทั้งหมด</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
