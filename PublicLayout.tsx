import Navbar from './Navbar';

export default function PublicLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <>
      <Navbar />
      <main className="section-container" style={{ paddingTop: '110px' }}>
        {children}
      </main>
      <footer>
        IRM EXTRA &copy; {new Date().getFullYear()} Premium Property Management Service
      </footer>
    </>
  );
}
