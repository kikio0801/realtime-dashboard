-- 🏥 Realtime Dashboard Database Schema

-- 1. 의료진 테이블
CREATE TABLE IF NOT EXISTS medical_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    qr_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_staff_email ON medical_staff(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_staff_qr_hash ON medical_staff(qr_hash);

-- 2. 환자 테이블
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'stable' CHECK (status IN ('stable', 'warning', 'critical')),
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
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    heart_rate INTEGER CHECK (heart_rate > 0 AND heart_rate <= 300),
    blood_pressure_sys INTEGER CHECK (blood_pressure_sys >= 30 AND blood_pressure_sys <= 300),
    blood_pressure_dia INTEGER CHECK (blood_pressure_dia >= 10 AND blood_pressure_dia <= 200),
    oxygen_level INTEGER CHECK (oxygen_level >= 0 AND oxygen_level <= 100),
    status TEXT,
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
