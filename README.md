# System Auto — Student Billing Manager

Software to manage student charges (messing, washing, laundry, etc.) for **NS, GC, PC, AES** categories with **Boarder** and **Day Scholar** types.

## Features

- **Dashboard** — Overview of students, billing totals, recent uploads
- **Excel Upload** — Auto-detect and import 3 sheet types:
  - Student Master (S/No, Cat, Reg No, Name, Father's Name...)
  - Monthly Billing (CMS ID, charges, Total Bill, Paid, Balance...)
  - Invoice/Voucher (Invoice No, Head 1-10, Amounts, Due Date...)
- **Add Charges** — Manual entry for mess/washing staff
- **Student Lookup** — Search by CMS ID, view complete profile
- **Categories** — NS, GC, PC, AES with charge heads

## Project Structure

```
System Auto/
├── backend/          # Express + MongoDB API (module-wise)
│   └── src/modules/
│       ├── student/  # student.model.js, .controller.js, .service.js, .routes.js, .utils.js
│       ├── billing/
│       ├── invoice/
│       ├── charge/
│       ├── category/
│       ├── upload/
│       └── dashboard/
└── frontend/         # Next.js dashboard
    ├── app/          # Pages
    ├── components/   # UI components
    └── lib/          # API client & types
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | API server port |
| MONGODB_URI | mongodb://127.0.0.1:27017/system-auto | MongoDB connection |
| CORS_ORIGIN | http://localhost:3000 | Frontend URL |
| MAX_FILE_SIZE_MB | 10 | Max Excel upload size |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:5000/api | Backend API URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/dashboard/student/:cmsId | Full student profile |
| GET | /api/students | List/search students |
| POST | /api/charges | Add manual charge entry |
| POST | /api/upload/excel | Upload Excel file |
| POST | /api/upload/preview | Preview Excel before upload |
| GET | /api/categories | List categories |

## Excel Sheet Types

1. **Student Master** — Basic student info (Cat, Reg No, Name, Father's Name, Contact...)
2. **Monthly Billing** — Month-wise charges (Messing, Washing/Dhobi, Laundry, Total Bill, Paid, Balance)
3. **Invoice** — Voucher with Head 1-10 and amounts

The upload system auto-detects sheet type from column headers, or you can select manually.
