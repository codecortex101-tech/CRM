# CRM Dashboard - Complete Documentation

A modern, full-featured CRM (Customer Relationship Management) system built for small to medium teams to efficiently manage leads, track activities, and streamline sales processes.

## ✅ Application Status: **FULLY FUNCTIONAL**

The application is production-ready with all core features implemented and tested.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation (5 minutes)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CRM-Client-Management-Brand-Product
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create Backend Environment File**
   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/crm-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

4. **Seed Demo Data** (Optional but recommended)
   ```bash
   npm run seed
   ```
   This creates:
   - 1 admin user
   - 2 regular users
   - 15 sample leads

5. **Start Backend Server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

6. **Frontend Setup** (New Terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

7. **Access the Application**
   - Open browser: `http://localhost:3000`
   - Login with demo credentials (see below)

---

## 👤 Demo Credentials

### Admin Account
- **Email**: `admin@crm.com`
- **Password**: `admin123`
- **Access**: Full system access

### User Accounts
- **Email**: `john@crm.com` | **Password**: `user123`
- **Email**: `jane@crm.com` | **Password**: `user123`
- **Access**: Assigned leads only

---

## 📖 User Guide

### How to Use the Application

#### 1. **Login/Registration**
- Go to `http://localhost:3000`
- Click "Sign up" to create a new account
- Or use demo credentials to login
- Password must be at least 6 characters

#### 2. **Dashboard Overview**
- View statistics cards (Total, New, Contacted, Qualified, Closed, High Priority)
- See all leads in table or card view
- Use search bar to find specific leads
- Apply filters (Status, Source, Priority)
- Sort leads by different criteria

#### 3. **Adding a New Lead** (Admin Only)
1. Click the **"Add Lead"** button (top right)
2. Fill in the form:
   - **Name** (required)
   - **Email** (required)
   - **Phone** (required)
   - **Company** (optional)
   - **Source** (Website, Referral, Social Media, etc.)
   - **Priority** (High, Medium, Low)
   - **Status** (New, Contacted, Qualified, Closed)
   - **Assign To** (select a user)
3. Click **"Save Lead"**

#### 4. **Viewing Lead Details**
- Click **"View"** on any lead
- See complete lead information
- View activity timeline
- Read and add notes
- Update status

#### 5. **Editing a Lead**
- Click **"Edit"** on any lead you have permission to edit
- Modify any field
- Click **"Save Lead"**

#### 6. **Updating Lead Status**
- Quick update: Use status dropdown in the table
- Or edit the lead and change status
- Status flow: New → Contacted → Qualified → Closed

#### 7. **Adding Notes to a Lead**
1. Click **"View"** on a lead
2. Scroll to **"Notes"** section
3. Type your note in the text area
4. Click **"Add Note"**
5. Notes are timestamped and show who created them

#### 8. **Filtering Leads**
- **Status Filter**: Filter by New, Contacted, Qualified, Closed, or All
- **Source Filter**: Filter by lead source (Website, Referral, etc.)
- **Priority Filter**: Filter by High, Medium, Low, or All
- **Search**: Type in search bar to find by name, email, or company

#### 9. **Sorting Leads**
- Use **"Sort by"** dropdown to choose:
  - Date Created
  - Name
  - Status
  - Priority
- Click sort order button to toggle Ascending/Descending

#### 10. **Exporting Leads**
- Click **"Export CSV"** button
- File downloads automatically
- Includes all filtered leads

#### 11. **Dark Mode**
- Click the dark mode toggle (top right)
- Preference is saved automatically
- Works across all pages

#### 12. **Mobile Navigation**
- On mobile devices, click hamburger menu (☰)
- Access navigation and logout
- Full mobile-responsive design

---

## 🎯 MVP Features

### Core Features ✅
- ✅ **User Authentication** - Secure login/registration with JWT
- ✅ **Role-Based Access Control** - Admin and User roles
- ✅ **Lead Management** - Full CRUD operations
- ✅ **Lead Assignment** - Assign leads to team members
- ✅ **Status Tracking** - Track lead progression
- ✅ **Search & Filter** - Find leads quickly
- ✅ **CSV Export** - Export data for reporting

### Advanced Features ✅
- ✅ **Lead Notes** - Add comments and notes to leads
- ✅ **Activity Timeline** - Track all lead activities
- ✅ **Lead Source Tracking** - Track where leads come from
- ✅ **Priority Levels** - High, Medium, Low priority
- ✅ **Company Field** - Store company information
- ✅ **Lead Details Page** - Comprehensive lead view
- ✅ **Advanced Filtering** - Filter by Status, Source, Priority
- ✅ **Sorting** - Sort by multiple criteria
- ✅ **Pagination** - Navigate through large lists
- ✅ **Table/Card View** - Toggle between views
- ✅ **Dark Mode** - Modern dark theme
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Mobile Navigation** - Hamburger menu for mobile

### UI/UX Features ✅
- ✅ **Modern Design** - Gradient backgrounds, smooth animations
- ✅ **Loading States** - Skeleton loaders
- ✅ **Toast Notifications** - User feedback
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessibility** - Keyboard navigation, ARIA labels

---

## 🔐 Role Permissions

### Admin Role
- ✅ View all leads (regardless of assignment)
- ✅ Create new leads
- ✅ Edit any lead
- ✅ Delete leads
- ✅ Assign leads to users
- ✅ Update any lead status
- ✅ Export all leads
- ✅ View all users
- ✅ Add notes to any lead

### User Role
- ✅ View only assigned leads
- ✅ Edit own assigned leads
- ✅ Update status of own leads
- ✅ Export own leads
- ✅ Add notes to own leads
- ❌ Cannot create leads
- ❌ Cannot delete leads
- ❌ Cannot assign leads
- ❌ Cannot view unassigned leads

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **json2csv** - CSV export

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

---

## 📁 Project Structure

```
CRM-Client-Management-Brand-Product/
│
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Lead.js            # Lead model (with notes, activities)
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── lead.routes.js    # Lead management routes
│   │   ├── user.routes.js    # User routes
│   │   └── csv.routes.js     # CSV routes
│   ├── controllers/
│   │   ├── auth.controller.js # Auth logic
│   │   ├── lead.controller.js # Lead CRUD operations
│   ├── middleware/
│   │   ├── authmiddleware.js  # JWT authentication
│   │   ├── role.middleware.js # Role-based access
│   ├── utils/
│   │   └── seedData.js        # Database seeding
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js        # Auth API calls
│   │   │   ├── stats.js        # Stats API calls
│   │   │   ├── user.js        # User API calls
│   │   │   └── leads.js       # Lead API calls
│   │   ├── components/
│   │   │   ├── LeadCard.jsx  # Lead 
│   │   │   ├── StatCard.jsx # Stat
│   │   │   ├── Filters.jsx  # Filters
│   │   │   └── TopBar.jsx # Top Bar
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Leads.jsx       # Leads page
│   │   │   ├── Register.jsx       # Register page
│   │   │   ├── AddLead.jsx       # Add lead page
│   │   │   ├── Analytics.jsx       # Analytics page
│   │   │   ├── AssignLead.jsx       # Assign lead page
│   │   │   ├── Settings.jsx       # Settings page
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   └── LeadDetails.jsx # Lead details page
│   │   ├── utils/
│   │   │   ├── auth.js        # Auth utilities
│   │   │   ├── api.js         # Axios instance
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Lead Endpoints

#### Get All Leads
```http
GET /leads?status=New&source=Website&priority=High&search=john&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### Get Single Lead
```http
GET /leads/:id
Authorization: Bearer <token>
```

#### Create Lead (Admin Only)
```http
POST /leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "source": "Website",
  "priority": "High",
  "status": "New",
  "assignedTo": "user_id_here"
}
```

#### Update Lead
```http
PUT /leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "email": "jane.new@example.com",
  // ... other fields
}
```

#### Update Lead Status
```http
PATCH /leads/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Contacted"
}
```

#### Add Note to Lead
```http
POST /leads/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Called client, interested in premium package"
}
```

#### Delete Lead (Admin Only)
```http
DELETE /leads/:id
Authorization: Bearer <token>
```

#### Export Leads as CSV
```http
GET /leads/export/csv?status=New&source=Website
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>
```

---

## 🎨 Lead Status Flow

```
New → Contacted → Qualified → Closed
```

- **New**: Lead just created, not yet contacted
- **Contacted**: Initial contact made with lead
- **Qualified**: Lead meets criteria and is interested
- **Closed**: Lead converted or closed (won/lost)

---

## 🚢 Deployment

### Backend Deployment

1. Set environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crm
   JWT_SECRET=your-production-secret-key
   NODE_ENV=production
   ```

2. Install dependencies:
   ```bash
   npm install --production
   ```

3. Start server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Update API URL in `src/utils/api.js`:
   ```javascript
   baseURL: 'https://your-api-domain.com/api'
   ```

3. Serve `dist` folder with:
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running locally
- Or update `MONGODB_URI` in `.env` with Atlas connection string
- Check network connectivity

**Port Already in Use**
- Change `PORT` in `.env` file
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**JWT Secret Error**
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random secret in production

### Frontend Issues

**Cannot Connect to Backend**
- Check backend is running on port 5000
- Verify CORS settings in `backend/server.js`
- Check `vite.config.js` proxy settings

**Blank Page**
- Open browser console (F12) for errors
- Check if API calls are failing
- Verify authentication token is valid

**Module Not Found**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

## 📝 Development

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd backend
npm run dev
```

**Frontend (with hot reload):**
```bash
cd frontend
npm run dev
```

### Adding New Features

1. **Backend**: Add routes in `routes/`, controllers in `controllers/`
2. **Frontend**: Add pages in `pages/`, components in `components/`
3. **API**: Update `frontend/src/api/` files for new endpoints

---

## 📄 License

This project is available as a template for client projects.

---

## 🤝 Support

For questions or issues:
1. Check this documentation
2. Review troubleshooting section
3. Check browser console for errors
4. Check backend terminal for server errors

---

**Built with ❤️ for efficient lead management**
