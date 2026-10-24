# เปิดใช้งานฟีเจอร์ "+" เพิ่มรูป

ปุ่ม "+" ในหน้า **Our firsts** และ **A tiny museum of us** ทำให้คนที่เข้าเว็บ
สามารถเพิ่มรูป + คำบรรยายได้เลยจากเบราว์เซอร์ ซึ่งต้องมีที่เก็บรูปกับข้อมูล
ไว้ที่ไหนสักที่ — โปรเจกต์นี้ใช้ [Supabase](https://supabase.com)
(ฟรี ไม่ต้องผูกบัตรเครดิต)

## 1. สร้างโปรเจกต์ Supabase

1. ไปที่ https://supabase.com → สมัคร/ล็อกอิน → **New project**
2. ตั้งชื่ออะไรก็ได้ (เช่น "poyjeen-site") ตั้งรหัสผ่านฐานข้อมูล (เก็บไว้
   เผื่อใช้ภายหลัง) และเลือก region แล้วกดสร้าง ใช้เวลาประมาณ 1 นาที

## 2. สร้าง storage bucket (ที่เก็บรูป)

1. แถบซ้าย: **Storage** → **New bucket**
2. ตั้งชื่อเป็น `gallery` (ต้องตรงตัวนี้เป๊ะ)
3. เปิดสวิตช์ **Public bucket** ไว้ (เพื่อให้รูปโชว์บนเว็บได้โดยไม่ต้อง
   ล็อกอิน)
4. กดสร้าง

**สำคัญ:** การเปิด "Public bucket" ทำให้แค่ *อ่าน* รูปผ่าน URL ได้โดยไม่ต้อง
ล็อกอิน แต่การ *อัปโหลด* รูปเข้า bucket ยังต้องมี policy อนุญาตแยกต่างหาก
(เหมือนตารางฐานข้อมูล) — ไปที่ **SQL Editor** → **New query** แล้วรันอันนี้
เพิ่มด้วย:

```sql
create policy "public can upload to gallery"
on storage.objects for insert
to public
with check (bucket_id = 'gallery');

create policy "public can read gallery"
on storage.objects for select
to public
using (bucket_id = 'gallery');
```

## 3. สร้างตารางฐานข้อมูล

1. แถบซ้าย: **SQL Editor** → **New query**
2. แปะโค้ดนี้แล้วกด **Run**:

```sql
create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('timeline', 'sillyUs', 'favoritePhotosOfYou')),
  image_url text not null,
  caption text not null default '',
  date_label text,
  title_label text,
  created_at timestamptz not null default now()
);

alter table gallery_items enable row level security;

create policy "anyone can read" on gallery_items
  for select using (true);

create policy "anyone can add" on gallery_items
  for insert with check (true);
```

โค้ดนี้ทำให้ใครก็ตามที่มีลิงก์เว็บ "อ่าน" และ "เพิ่ม" ข้อมูลได้ แต่แก้ไข/ลบ
ของเดิมไม่ได้ (ไม่มี policy สำหรับ update/delete) ถ้าอยากจำกัดสิทธิ์เพิ่มใน
ภายหลัง กลับมาแก้ไฟล์นี้ได้

## 3.5 ตารางสำหรับปุ่ม "+" ใน Little reminders of you

หน้า **Little reminders of you** มีปุ่ม "+" แยกต่างหาก ให้เพิ่มได้ทั้งรูป /
เพลง / หนัง / ข้อความ (คนละดีไซน์การ์ดกัน) — ใช้ storage bucket `gallery`
เดิมร่วมกัน (ไม่ต้องสร้าง bucket ใหม่) แต่ต้องสร้างตารางใหม่อีกตัว ไปที่
**SQL Editor** → **New query** แปะโค้ดนี้แล้วกด **Run**:

```sql
create table board_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('photo', 'song', 'movie', 'text')),
  image_url text,
  title text,
  subtitle text,
  message text,
  url text,
  created_at timestamptz not null default now()
);

alter table board_items enable row level security;

create policy "anyone can read" on board_items
  for select using (true);

create policy "anyone can add" on board_items
  for insert with check (true);
```

ไม่ต้องรัน policy ของ storage ซ้ำ (ขั้นตอนที่ 2 ครอบคลุม bucket `gallery`
ทั้งก้อนอยู่แล้ว ไม่ว่าจะอัปโหลดเข้าไปจากฟีเจอร์ไหนก็ใช้ policy เดียวกัน)

## 3.6 ตาราง content_items (รูป/วิดีโอ/เพลง/โปสเตอร์ที่เคยฝังในโค้ด)

รูป timeline, รูปใน museum (sillyUs / favoritePhotosOfYou), ปกเพลง, และ
โปสเตอร์หนัง ที่แต่ก่อนฝังเป็นไฟล์ในโค้ด ตอนนี้ย้ายมาอยู่ในตาราง
`content_items` แทนแล้ว (ดูวิธีสร้างตารางนี้ใน `supabase/content_items.sql`
— รันครั้งเดียวใน SQL Editor เหมือนตารางอื่น ๆ) ใช้ bucket `gallery` เดิม
ร่วมกัน ไม่ต้องสร้าง bucket ใหม่

จะแก้ caption/เพิ่มรูปใน timeline หรือ museum ตอนนี้ต้องแก้ที่ตารางนี้ใน
Supabase โดยตรง (ไม่ใช่ไฟล์ `src/data/relationship.ts` อีกต่อไป)

## 4. เอา API key มา

1. แถบซ้าย: **Project Settings** → **API**
2. ต้องใช้ 2 ค่า: **Project URL** กับ **anon public** key

## 5. ใส่ค่าเข้าโปรเจกต์

1. คัดลอกไฟล์ `.env.example` เป็นไฟล์ใหม่ชื่อ `.env` ที่ root ของโปรเจกต์
2. ใส่ค่า 2 ตัวนั้นลงไป:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. ถ้า `npm run dev` รันอยู่ ให้ปิดแล้วรันใหม่ (Vite อ่านไฟล์ `.env` แค่
   ตอนเริ่มรัน)

anon key ถูกออกแบบมาให้เป็น public อยู่แล้ว (ยังไงมันก็ติดไปกับไฟล์ JS ของเว็บ
อยู่ดี) — สิ่งที่ควบคุมว่าใครทำอะไรได้บ้างจริง ๆ คือ policy ในขั้นตอนที่ 3
ไม่ใช่การปิดบัง key

## 6. ตอนจะ deploy เว็บจริง (Vercel)

ไฟล์ `.env` จะไม่ถูก commit/push ขึ้น git (อยู่ใน .gitignore แล้ว) ต้องไปใส่
ค่าเดียวกัน 2 ตัวไว้ที่ Vercel เองด้วย:

1. push repo นี้ขึ้น GitHub ก่อน แล้วไปที่ vercel.com → **Add New** →
   **Project** → เลือก repo นี้ (Vercel จะ detect ว่าเป็น Vite ให้เอง —
   build command/output directory ไม่ต้องแก้)
2. ก่อนกด Deploy (หรือกลับมาแก้ทีหลังก็ได้ที่ **Settings** →
   **Environment Variables**): ใส่ 2 ตัวนี้ ค่าคัดลอกมาจากไฟล์ `.env`
   ในเครื่อง — ให้ติ๊ก Production, Preview, Development ทั้ง 3 อัน
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```
3. กด **Deploy** ถ้าใส่ env var เพิ่ม/แก้ทีหลัง ต้อง **Redeploy** ใหม่
   (Vercel ไม่ดึงค่าที่เพิ่งเปลี่ยนเข้า build เก่าให้อัตโนมัติ)

ขั้นตอนเดียวกันนี้ใช้ได้กับ host อื่นด้วย (Netlify, Cloudflare Pages ฯลฯ)
แค่หน้าตา settings ต่างกัน

## หมายเหตุ

- รูปจะถูกย่อขนาดในเบราว์เซอร์ก่อนอัปโหลด (เหลือกว้างประมาณ 1200px) เพื่อไม่ให้
  โควต้าฟรีของ Supabase หมดเร็วเกินไป
- รองรับแค่รูปภาพ (jpg/png ฯลฯ) ยังไม่รองรับวิดีโอ — วิดีโอยังต้องส่งไฟล์มาให้
  ฉันช่วยทำแบบเดิม
- ตอนนี้ใครก็ตามที่มีลิงก์เว็บสามารถกดเพิ่มรูปได้เลย ไม่มีรหัสผ่านกั้น เพราะ
  เป็นลิงก์ส่วนตัวที่จะส่งให้พจน์จีนคนเดียว น่าจะโอเค แต่ถ้าอยากให้มี PIN
  ก่อนกดปุ่ม "+" ได้ บอกได้เลย
