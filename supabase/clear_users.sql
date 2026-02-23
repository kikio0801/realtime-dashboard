-- DB 초기화 스크립트 (기존 유저 정보 제거)

DO $$ 
DECLARE
  -- 안전 장치: 이 값을 true로 변경해야만 삭제가 진행됩니다.
  confirm_clear BOOLEAN := false; 
BEGIN
  IF confirm_clear THEN
    -- 1. 기존 가입된 의료진 데이터 삭제
    TRUNCATE TABLE public.medical_staff CASCADE;

    -- 2. 관련된 Auth 사용자 데이터 삭제 (필요한 경우)
    -- auth.users 테이블의 데이터도 날릴 수 있지만 보통 슈퍼베이스 대시보드에서 처리하는 것을 권장합니다.
    -- DELETE FROM auth.users WHERE id IN (SELECT auth_id FROM public.medical_staff);

    RAISE NOTICE '데이터가 성공적으로 초기화되었습니다.';
  ELSE
    RAISE NOTICE '안전 장치가 활성화되어 있습니다. 삭제를 진행하려면 confirm_clear 변수를 true로 변경하세요.';
  END IF;
END $$;
