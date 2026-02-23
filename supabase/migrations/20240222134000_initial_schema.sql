-- 🏥 Realtime Dashboard Database Schema
-- Initial Migration synchronized from backend/app/db/schema.sql

-- 1. 의료진 테이블 (Supabase Anonymous Auth 연동)
CREATE TABLE IF NOT EXISTS medical_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    qr_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, phone_number)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_staff_qr_hash ON medical_staff(qr_hash);

-- 의료진 테이블 권한 및 RLS(Row Level Security) 설정
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE medical_staff TO anon, authenticated;

CREATE POLICY "Allow users to insert their own profile" 
ON medical_staff FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Allow users to read their own profile" 
ON medical_staff FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Allow users to update their own profile" 
ON medical_staff FOR UPDATE 
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Allow users to delete their own profile" 
ON medical_staff FOR DELETE 
USING (auth.uid() = auth_id);

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

ALTER TABLE staff_patients ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE staff_patients TO anon, authenticated;

CREATE POLICY "Allow staff to manage their own assignments"
ON staff_patients FOR ALL
USING ( staff_id IN (SELECT id FROM medical_staff WHERE auth_id = auth.uid()) )
WITH CHECK ( staff_id IN (SELECT id FROM medical_staff WHERE auth_id = auth.uid()) );

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
-- 의료진 정보는 QR 로그인 시 자동 생성되므로 수동 시드를 생략합니다.

INSERT INTO patients (name, age, gender, bed_number, status) 
VALUES 
('김철수', 45, 'M', '101-A', 'stable'),
('박영희', 68, 'F', '202-B', 'warning'),
('박지성', 43, 'M', '707-A', 'stable')
ON CONFLICT (name, bed_number) DO NOTHING;

-- 5. 계정 연동 RPC 함수 (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION register_or_link_anonymous_session(
    p_auth_id UUID,
    p_name TEXT,
    p_phone_number TEXT,
    p_qr_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_staff_id UUID;
    v_result JSONB;
BEGIN
    -- 원자적 INSERT 시도 (경쟁 상태 방지)
    INSERT INTO medical_staff (auth_id, name, phone_number, qr_hash, created_at)
    VALUES (p_auth_id, p_name, p_phone_number, p_qr_hash, NOW())
    ON CONFLICT (name, phone_number) DO NOTHING
    RETURNING id INTO v_staff_id;

    IF v_staff_id IS NOT NULL THEN
        -- Insert 성공: 신규 프로필
        v_result := jsonb_build_object('status', 'new', 'staff_id', v_staff_id);
    ELSE
        -- Insert 실패: 기존 프로필 존재, 세션 연동(Update)
        UPDATE medical_staff 
        SET auth_id = p_auth_id, qr_hash = p_qr_hash
        WHERE name = p_name AND phone_number = p_phone_number
        RETURNING id INTO v_staff_id;

        v_result := jsonb_build_object('status', 'linked', 'staff_id', v_staff_id);
    END IF;

    RETURN v_result;
END;
$$;
