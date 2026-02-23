-- DB 초기화 스크립트 (기존 유저 정보 제거)

-- 1. 기존 가입된 의료진 데이터 삭제
TRUNCATE TABLE public.medical_staff CASCADE;

-- 2. 관련된 Auth 사용자 데이터 삭제 (필요한 경우)
-- auth.users 테이블의 데이터도 날릴 수 있지만 보통 슈퍼베이스 대시보드에서 처리하는 것을 권장합니다.
-- DELETE FROM auth.users WHERE id IN (SELECT auth_id FROM public.medical_staff);
