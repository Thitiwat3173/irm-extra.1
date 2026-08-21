// lib/utils.ts — Shared utility functions
// Replaces e(), validate_required(), validate_email_field() from functions.php

export function e(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateRequired(
  data: Record<string, string | undefined>,
  fields: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, label] of Object.entries(fields)) {
    if (!data[field] || data[field]!.trim() === '') {
      errors[field] = `${label} is required.`;
    }
  }
  return errors;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear() + 543; // Convert to Buddhist Era (Thai)
  return `${day}/${month}/${year}`;
}

export function padApplicationId(id: number): string {
  return String(id).padStart(4, '0');
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'รอพิจารณา',
  reviewing: 'กำลังพิจารณา',
  selected: 'ผ่านการคัดเลือก',
  rejected: 'ไม่ผ่านการคัดเลือก',
};

export const MILITARY_LABELS: Record<string, string> = {
  exempted: 'ได้รับการยกเว้น',
  drafted: 'จับได้ใบดำ',
  rd_completed: 'ผ่านนักศึกษาวิชาทหาร (รด.)',
  other: 'อื่นๆ',
};

export const MARITAL_LABELS: Record<string, string> = {
  single: 'โสด',
  married: 'แต่งงาน',
  widowed: 'หม้าย',
  divorced: 'หย่าร้าง',
};
