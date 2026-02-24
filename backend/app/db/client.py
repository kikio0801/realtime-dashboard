import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 환경 변수 로드 (.env 파일이 있으면 읽어옴, 없으면 시스템 환경 변수 사용)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.")

# 싱글톤으로 사용할 수 있는 Supabase 클라이언트 인스턴스 생성
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
