# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

단체/협회 관리 Admin System. Berry React Admin Template 기반으로 12개 모듈을 구현한 풀스택 웹앱.
- Frontend: `vite/` (React + MUI)
- Backend: `backend/` (FastAPI + SQLite)

## Commands

### Frontend (`vite/` 디렉토리)
```bash
npm start          # Dev server at http://localhost:3000/free
npm run build      # Production build
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
```

### Backend (`backend/` 디렉토리)
```bash
# 가상환경 활성화 후
venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000
# API 문서: http://localhost:8000/docs
```

## Tech Stack

**Frontend**: React 19, Vite 7, React Router 7, MUI v7 + Emotion, ApexCharts, react-big-calendar, @xyflow/react, SWR, Context API, Yup

**Backend**: FastAPI 0.115, Python 3.12, SQLAlchemy 2.0 (async), Pydantic 2.9, Alembic, SQLite (aiosqlite)

**Auth**: JWT (python-jose), bcrypt, OAuth2 Bearer, RBAC 4단계 (SUPER_ADMIN > STAFF > CLUB_LEADER > MEMBER)

## Architecture

### Frontend

**Routing**: `src/routes/index.jsx` → `createBrowserRouter()`. MainRoutes (AuthGuard 래핑) + AuthenticationRoutes. 모든 페이지 lazy-loaded via `Loadable()`. Base path: `/free`.

**Layout**: MainLayout (AppBar + Sidebar + content), MinimalLayout (auth pages), AuthLayout (AuthProvider wrapper).

**State**: AuthContext (JWT/사용자), ConfigContext (테마설정+localStorage), SWR (메뉴 ��태).

**Menu**: `src/menu-items/` — 6 그룹: 대시보드, 회원, 교육, 커뮤니티, 조직(서브메뉴), 설정. 모든 텍스트 한국어.

### 12 Modules

| 모듈 | 경로 | 주요 파일 |
|------|------|----------|
| Dashboard | `/dashboard` | `views/dashboard/index.jsx` |
| Members | `/members` | `views/members/index.jsx` |
| Cohorts | `/cohorts`, `/cohorts/:id` | `views/cohorts/index.jsx`, `CohortDetail.jsx` |
| Sessions | `/sessions`, `/sessions/instructors` | `views/sessions/index.jsx`, `Instructors.jsx` |
| Attendance | `/attendance` | `views/attendance/index.jsx` |
| Board | `/board` | `views/board/index.jsx` |
| Finance | `/finance` | `views/finance/index.jsx` |
| Clubs | `/clubs`, `/clubs/:id` | `views/clubs/index.jsx`, `ClubDetail.jsx` |
| Events | `/events`, `/events/:id` | `views/events/index.jsx`, `EventDetail.jsx` |
| Organization | `/organization/*` | `views/organization/OrgChart.jsx`, `Executives.jsx`, `Committee.jsx`, `ExecutiveBoard.jsx` |
| Settings | `/settings` | `views/settings/index.jsx` |
| Auth | `/pages/login`, `/pages/register` | `views/pages/authentication/`, `contexts/AuthContext.jsx` |

### Mock Data

`src/mock-data/` — 9개 JS 파일. 회원 25명, 기수 3개, 세션 12개, 동호회 4개, 행사 6개 등. 모�� 모듈이 mock data 기반으로 동작.

### Backend

`backend/app/main.py` — FastAPI app, CORS(localhost:3000), lifespan으로 DB 자동 초기화.
`backend/app/auth.py` — JWT 생성/검증, bcrypt 패스워드 해싱.
`backend/app/routes/auth.py` — register, login, me, forgot-password 엔드포인트.
`backend/app/models/user.py` — User 모델 + UserRole enum.

### Key Conventions

- MUI Grid import: `import Grid from '@mui/material/Grid'` (Grid2 아님)
- Absolute imports from `src/` via `vite-jsconfig-paths`
- 모든 UI 텍스트 한국어
- 금액: `toLocaleString() + '원'`, 날짜: `YYYY.MM.DD`, 전화: `010-0000-0000`
- 공통 컴포넌트: `MainCard`, `SubCard` from `ui-component/cards/`
- 상수: `gridSpacing=3`, `drawerWidth=260`
