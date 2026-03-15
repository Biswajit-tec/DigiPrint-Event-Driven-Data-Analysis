# 🚀 Quick Start Guide - DigiPrint Platform

## ✅ What's Already Done
- ✅ All 70+ files created
- ✅ Frontend dependencies installed (React, Tailwind, Framer Motion, Recharts, Socket.IO)
- ✅ Backend dependencies installed (Express, Socket.IO, PostgreSQL driver)
- ✅ Environment files created

## 📋 Next Steps to Run the App

### Step 1: Set Up PostgreSQL Database (Required for Live Mode)

**Option A: Neon.tech (Recommended)**
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string
4. Run the schema files:
```bash
psql "your_connection_string" -f database/schema.sql
psql "your_connection_string" -f database/triggers.sql
psql "your_connection_string" -f database/views.sql
psql "your_connection_string" -f database/procedures.sql
psql "your_connection_string" -f database/indexes.sql
```

**Option B: Supabase**
1. Go to https://supabase.com and create account
2. Create new project
3. Go to Database → SQL Editor
4. Paste and run each .sql file content

### Step 2: Configure Database Connection

Edit `backend/.env` and replace the DATABASE_URL:
```env
DATABASE_URL=your_actual_connection_string_here
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will start on http://localhost:5000

**Terminal 2 - Frontend (Run from Project Root):**
```bash
npm run dev
```
The frontend will start on http://localhost:5173

### Step 4: Open in Browser

Navigate to: **http://localhost:5173**

## 🎮 Demo Mode (No Database Required)

If you don't want to set up a database yet:
1. Just start both servers (steps above)
2. The app will work in **Demo Mode** with synthetic data
3. Toggle the "Demo Mode" / "Live Mode" switch in the top right

## 🧪 Testing the Application

Once running, test these features:

1. **Landing Page**
   - Check parallax animations
   - Click "Enter Dashboard"

2. **Dashboard**
   - View animated stat cards with count-up effects
   - Toggle Demo/Live mode
   - Watch recent events update

3. **Live Stream**
   - See events streaming in real-time
   - Test pause/resume
   - Filter by event type

4. **Analytics**
   - View Recharts visualizations
   - Check event frequency timeline
   - See peak activity hours

5. **Query Playground**
   - Execute all 8 predefined SQL queries
   - View results in formatted tables
   - Check execution times

6. **Architecture**
   - Review ASCII system diagram

7. **Case Study**
   - Review ER diagram with cardinalities
   - Check 3NF documentation
   - Review database design decisions

## 🐛 Troubleshooting

**Backend won't start:**
- Check if PORT 5000 is available
- Verify DATABASE_URL in backend/.env (or comment it out for demo mode)
- Check `cd backend && npm run dev` shows no errors

**Frontend won't start:**
- Check if PORT 5173 is available
- Verify .env has `VITE_API_URL=http://localhost:5000`
- Run `npm run dev` from project root

**No real-time updates:**
- Ensure backend is running on port 5000
- Check browser console for Socket.IO connection errors
- Verify CORS is working (no console errors)

**Database errors:**
- Verify DATABASE_URL is correct
- Ensure all 5 SQL files were run in order
- Check PostgreSQL is accepting connections

## 📦 Project Structure

```
DigiPrint/
├── database/           # 7 SQL files
├── backend/            # Express + Socket.IO server
│   ├── config/         # Database configuration
│   ├── routes/         # API routes (events, analytics, queries)
│   ├── services/       # Business logic
│   └── server.js       # Entry point
├── src/                # React frontend
│   ├── components/     # UI components (11 components)
│   │   └── ui/         # Design system
│   ├── pages/          # 11 application pages
│   ├── services/       # API & Socket clients
│   └── utils/          # Animations & helpers
└── docs/               # Documentation
```

## 🎯 What You Have

✅ Event-driven digital footprint platform  
✅ Real-time Socket.IO updates  
✅ PostgreSQL with triggers, views, procedures, indexes  
✅ 8 predefined SQL queries (safe, read-only)  
✅ Z-score anomaly detection  
✅ Premium cyber-intelligence UI  
✅ Glassmorphism design system  
✅ Framer Motion animations  
✅ Full DBMS concept demonstration  
✅ Academic-ready documentation  

## 🚀 Ready to Deploy?

See the main [README.md](../README.md) for deployment instructions to:
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: Neon.tech or Supabase

---

**Need help?** Check [walkthrough.md](../../.gemini/antigravity/brain/49a76f98-e3da-4aba-9e93-f6451e0c8453/walkthrough.md) for detailed documentation!
