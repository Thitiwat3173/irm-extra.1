'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_LABELS } from '@/lib/utils';

export default function UpdateStatusForm({
  applicationId,
  currentStatus,
}: {
  applicationId: number;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId, new_status: status, note }),
    });

    const data = await res.json();
    const flash = data.emailSent || status === 'pending' || status === 'reviewing'
      ? 'status_updated'
      : 'status_updated_no_email';

    router.push(`/admin/applicant?id=${applicationId}&flash=${flash}`);
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="status-form">
      <select value={status} onChange={e => setStatus(e.target.value)} required>
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <textarea
        rows={2}
        placeholder="บันทึกภายใน (ถ้ามี)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button type="submit" className="btn accept" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'กำลังอัปเดต...' : 'อัปเดตสถานะ'}
      </button>
    </form>
  );
}
