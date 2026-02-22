-- 🏥 Realtime Dashboard Database Schema
-- Initial Migration synchronized from backend/app/db/schema.sql

-- 1. 의료진 테이블 (Supabase Anonymous Auth 연동)
CREATE TABLE IF NOT EXISTS medical_staff (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    qr_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_staff_email ON medical_staff(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_staff_qr_hash ON medical_staff(qr_hash);

-- 의료진 테이블 권한 및 RLS(Row Level Security) 설정
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE medical_staff TO anon, authenticated;

CREATE POLICY "Allow users to insert their own profile" 
ON medical_staff FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to read their own profile" 
ON medical_staff FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
ON medical_staff FOR UPDATE 
USING (auth.uid() = id);

-- 2. 환자 테이블
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'stable' CHECK (status IN ('stable', 'warning', 'critical')),
    diagnosis TEXT,
    admission_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, bed_number)
);

-- 3. 담당 배정 테이블
CREATE TABLE IF NOT EXISTS staff_patients (
    staff_id UUID REFERENCES medical_staff(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (staff_id, patient_id)
);

-- 4. 생체 신호 로그 테이블
CREATE TABLE IF NOT EXISTS vitals_log (
    id BIGSERIAL PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    heart_rate NUMERIC CHECK (heart_rate >= 0 AND heart_rate <= 300),
    blood_pressure_sys NUMERIC CHECK (blood_pressure_sys >= 30 AND blood_pressure_sys <= 300),
    blood_pressure_dia NUMERIC CHECK (blood_pressure_dia >= 10 AND blood_pressure_dia <= 200),
    oxygen_level NUMERIC CHECK (oxygen_level >= 0 AND oxygen_level <= 100),
    temperature NUMERIC CHECK (temperature >= 30 AND temperature <= 45),
    status TEXT CHECK (status IN ('normal', 'abnormal', 'critical')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vitals_patient_time ON vitals_log(patient_id, recorded_at DESC);

-- 초기 데이터 샘플 (Seeding)
INSERT INTO medical_staff (name, email, department, qr_hash) 
VALUES ('윤지우', 'jiwoo@example.com', '순환기내과', 'staff_qr_dev_01')
ON CONFLICT (qr_hash) DO NOTHING;

INSERT INTO patients (name, age, gender, bed_number, status) 
VALUES 
('김철수', 45, 'M', '101-A', 'stable'),
('박영희', 68, 'F', '202-B', 'warning'),
('박지성', 43, 'M', '707-A', 'stable')
ON CONFLICT (name, bed_number) DO NOTHING;
