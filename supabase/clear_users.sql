-- DB 초기화 스크립트 (기존 유저 정보 제거)
-- ⚠️ 경고: 이 스크립트는 개발 및 테스트 환경 전용입니다! ⚠️
-- 프로덕션 환경에서는 절대 실행하지 마십시오. TRUNCATE CASCADE는 연관된 모든 데이터를 삭제합니다.

DO $$ 
DECLARE
  -- 안전 장치: 이 값을 true로 변경해야만 삭제가 진행됩니다. (개발 전용)
  confirm_clear BOOLEAN := false; 
BEGIN
  IF confirm_clear THEN
    -- 1. 관련된 Auth 사용자 데이터 삭제 (필요한 경우)
    -- auth.users 데이터 삭제가 필요하면 아래 TRUNCATE 실행 전에 주석을 해제하고 실행하세요.
    -- (보통 슈퍼베이스 대시보드에서 처리하는 것을 권장합니다)
    -- DELETE FROM auth.users WHERE id IN (SELECT auth_id FROM public.medical_staff);

    -- 2. 기존 가입된 의료진 데이터 삭제
    TRUNCATE TABLE public.medical_staff CASCADE;

    RAISE NOTICE '데이터가 성공적으로 초기화되었습니다.';
  ELSE
    RAISE NOTICE '안전 장치가 활성화되어 있습니다. 삭제를 진행하려면 confirm_clear 변수를 true로 변경하세요.';
  END IF;
END $$;
