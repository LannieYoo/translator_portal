# Speaking to Text - Multilingual Site

OpenAPI Whisper를 이용한 다국어 사이트입니다. 음성 인식, 텍스트 변환, 번역 등의 기능을 제공합니다.

## 기능

- **번역기**: LLM 기반 번역 기능
- **사전찾기**: 한영, 한중, 중영 사전 검색
- **Text to Speech**: 텍스트를 음성으로 변환
- **Speech to Text**: 음성을 텍스트로 실시간 변환 (Whisper 사용)
- **음성 녹음**: 음성 녹음 및 저장
- **번역**: 다양한 영어 방언과 중국어 간체 번역

## 기술 스택

- **Frontend**: React.js, Vite, ES6
- **Whisper**: OpenAI Whisper (로컬 실행)
- **스타일링**: CSS (반응형 디자인)

## 설치 및 실행

### 1. Frontend 설정

```bash
cd frontend
npm install
npm run dev
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

### 2. Whisper 서버 설정 (Speech to Text 기능 사용 시 필요)

```bash
# Python 패키지 설치
pip install -r scripts/requirements_whisper.txt

# FFmpeg 설치 필요 (Whisper 사용을 위해)
# Windows: https://ffmpeg.org/download.html
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg

# Whisper 서버 실행
python scripts/whisper_server.py
```

Whisper 서버는 `http://localhost:8001`에서 실행됩니다.

자세한 설정 방법은 `scripts/README_WHISPER.md`를 참고하세요.

## 프로젝트 구조

```
SpeakingToText/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 공통 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── styles/        # 스타일 파일
│   └── package.json
├── scripts/           # 유틸리티 스크립트
│   ├── whisper_server.py      # Whisper 로컬 서버
│   └── requirements_whisper.txt
└── doc/              # 문서
    └── introduction.md
```

## 주요 기능 설명

### Speech to Text
- 실시간 음성 인식
- 다양한 영어 방언 지원 (캐나다, 미국, 영국, 인도)
- 자동 언어 인식 또는 수동 선택
- 텍스트 파일 자동 저장

### Text to Speech
- 브라우저 내장 Web Speech API 사용
- 한국어, 영어, 중국어 간체 지원

### 번역기
- LLM 기반 번역 (무료 API 사용)
- 한국어, 영어, 중국어 간체 지원

## 개발 가이드

### 환경 변수
- Frontend `.env` 파일은 Git에 업로드하지 않습니다.
- 필요시 `.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

### 코드 구조
- **데이터**: `/data` 폴더
- **디자인**: 별도 CSS 파일
- **컨텐츠**: React 컴포넌트

### 반응형 디자인
- 1400px 이하: 모바일/태블릿용 햄버거 메뉴
- 기본 폰트 크기: 14~15px

## 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 개발자

- **이름**: Lannie (HyeRan Yoo)
- **GitHub**: [LannieYoo](https://github.com/LannieYoo)

