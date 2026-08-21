'use client';

import Link from 'next/link';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav?: 'dashboard' | 'applicants';
  title: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, activeNav, title, actions }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-body-app">
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      <div
        className={`overlay${sidebarOpen ? ' show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar${sidebarOpen ? ' show' : ''}`} id="sidebar">
        <div className="logo">
          <h2>IRM <span>Extra</span></h2>
        </div>
        <div className="menu">
          <Link
            href="/admin/dashboard"
            className={activeNav === 'dashboard' ? 'active' : ''}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/applicants"
            className={activeNav === 'applicants' ? 'active' : ''}
            onClick={() => setSidebarOpen(false)}
          >
            ผู้สมัครงาน
          </Link>
          <Link href="/admin/logout" onClick={() => setSidebarOpen(false)}>
            ออกจากระบบ
          </Link>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <h1>{title}</h1>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
