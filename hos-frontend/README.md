# HOS Driver Log System

A Full Stack web application for tracking truck driver Hours of Service (HOS) logs, built in compliance with FMCSA regulations.

## Tech Stack
- **Backend:** Python, Django, Django REST Framework
- **Frontend:** React (Vite), JavaScript
- **Database:** SQLite3

## Features
- Create and manage driver daily logs
- Add duty status entries (Off Duty, Sleeper Berth, Driving, On Duty)
- Visual 24-hour HOS grid display
- FMCSA compliant tracking
- REST API backend

## How to Run

### Backend
```bash
cd hos_project
env\Scripts\activate
python manage.py runserver

## Frontend
cd hos_project\hos-frontend npm run dev

API Endpoints
GET /api/logs/ — List all driver logs
POST /api/logs/ — Create new log
POST /api/logs/{id}/add_duty_entry/ — Add duty entry
GET /api/logs/{id}/hos_summary/ — Get HOS summary
Screenshots
App running at http://localhost:5173
API running at http://127.0.0.1