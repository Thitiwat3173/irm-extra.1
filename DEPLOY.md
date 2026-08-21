# IRM Extra — Cloudflare Pages Deployment Guide

## สิ่งที่ต้องมีก่อน

1. Cloudflare account
2. GitHub account (สำหรับ push โค้ด)
3. Node.js 18+ ในเครื่อง

---

## ขั้นตอนที่ 1: สร้าง D1 Database

```bash
npx wrangler d1 create irm-extra-db
```

Copy `database_id` ที่ได้มาใส่ใน `wrangler.toml`

---

## ขั้นตอนที่ 2: Import Schema ลง D1

```bash
npx wrangler d1 execute irm-extra-db --file=sql/schema.sql
```

---

## ขั้นตอนที่ 3: สร้าง R2 Bucket

```bash
npx wrangler r2 bucket create irm-extra-uploads
```

---

## ขั้นตอนที่ 4: ตั้งค่า wrangler.toml

แก้ไขไฟล์ `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "irm-extra-db"
database_id = "YOUR_D1_DATABASE_ID"  # ← ใส่จากขั้นตอนที่ 1

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "irm-extra-uploads"

[vars]
APP_ENV = "production"
APP_URL = "https://yourdomain.com"
SESSION_SECRET = "your-long-random-string-min-32-chars"
RESEND_API_KEY = "re_xxxxxxxxxxxxxxxxxx"
MAIL_FROM_ADDRESS = "noreply@yourdomain.com"
MAIL_FROM_NAME = "IRM Extra"
```

---

## ขั้นตอนที่ 5: Push ขึ้น GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/irm-extra.git
git push -u origin main
```

---

## ขั้นตอนที่ 6: Connect Cloudflare Pages กับ GitHub

1. ไปที่ Cloudflare Dashboard → Workers & Pages → Create
2. เลือก **Pages** → Connect to Git
3. เลือก repo `irm-extra`
4. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
5. ตั้งค่า Environment Variables ตาม `wrangler.toml`
6. กด **Save and Deploy**

---

## ขั้นตอนที่ 7: สร้าง Admin Account ครั้งแรก

เปิด `https://yourdomain.com/admin/setup` แล้วสร้างบัญชีแอดมิน

> ⚠️ ลบหน้านี้ออกหลังจากสร้างบัญชีแล้ว หรือ route protection จะจัดการให้อัตโนมัติ

---

## ขั้นตอนที่ 8: ตรวจสอบระบบ

เปิด `https://yourdomain.com/admin/system-check` เพื่อตรวจสอบว่าทุกอย่างทำงานถูกต้อง

---

## ขั้นตอนที่ 9: ตั้งค่า Resend Domain

1. ไปที่ [resend.com/domains](https://resend.com/domains)
2. เพิ่ม domain ของคุณ
3. ตั้งค่า DNS ตามที่ Resend บอก
4. อัปเดต `MAIL_FROM_ADDRESS` ใน wrangler.toml เป็น `noreply@yourdomain.com`

---

## Admin Guide

- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Applicants**: `/admin/applicants`
- **View Applicant**: `/admin/applicant?id=X`
- **Print**: `/admin/print?id=X`
- **System Check**: `/admin/system-check`
