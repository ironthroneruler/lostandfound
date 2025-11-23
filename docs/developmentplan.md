# Lost and Found Website - Development Plan

## Project Overview
**Team:** 3 Developers  
**Timeline:** Nov 23, 2025 → Feb 28, 2025 (14 weeks)  
**Tech Stack:** Django + PostgreSQL + Bootstrap  

---

## Team Roles

**Developer 1 (Backend):** Models, Views, Business Logic  
**Developer 2 (Frontend):** Templates, CSS, JavaScript, UI/UX  
**Developer 3 (Integration):** Files, Forms, Admin, Testing  

---

## Required Features (Priority Order)

### ✅ Core Requirements
1. **Home page** with navigation and layout
2. **Submission form** for reporting found items + photo upload
3. **Searchable listing** of all found items
4. **Claim form** for requesting/claiming items
5. **Admin backend** to review, approve, manage items

---

## Database Models

### User (Django default + extensions)
```python
- username, email, password
- user_type: Student/Teacher/Admin
- StudentProfile: student_id, grade
```

### Item
```python
- name, category, description
- location_found, date_found
- photo (ImageField)
- status: Available/Claimed/Returned
- submitted_by (ForeignKey User)
```

### Claim
```python
- item (ForeignKey)
- claimant (ForeignKey User)
- message (min 20 chars)
- status: Pending/Approved/Rejected
- admin_notes
```

---

## 14-Week Timeline

### 🔴 PHASE 1: CORE FEATURES (Weeks 1-8)

#### Week 1-2: Setup + Authentication
**Goal:** Working project with user system

**Dev 1:**
- Django project setup
- User model + Student/Teacher profiles
- Registration views (2 types)
- Login/logout

**Dev 2:**
- Base template + navigation
- Registration forms (student/teacher)
- Login page design
- Homepage layout

**Dev 3:**
- Git repo setup
- Environment config
- Form validation
- Test auth flow

**Deliverable:** Users can register and login

---

#### Week 3-4: Item Submission
**Goal:** Report found items with photos

**Dev 1:**
- Item model
- Create item view (teachers only)
- Item list view
- Item detail view

**Dev 2:**
- Report item form design
- Item list page (grid layout)
- Item detail page
- Photo display

**Dev 3:**
- Photo upload (Pillow)
- Image validation (5MB, types)
- "My Items" page
- Test item creation

**Deliverable:** Teachers can report items with photos

---

#### Week 4-5: Search & Browse
**Goal:** Students can find items

**Dev 1:**
- Search functionality (keyword)
- Filter by category, location, date
- Pagination
- Sorting options

**Dev 2:**
- Search page UI
- Filter sidebar
- Search results layout
- Pagination controls

**Dev 3:**
- Query optimization
- Test search edge cases
- Category browsing
- No results handling

**Deliverable:** Functional search system

---

#### Week 6-7: Claims System
**Goal:** Students can claim items

**Dev 1:**
- Claim model
- Submit claim view
- Claim validation (one per item/user)
- "My Claims" view

**Dev 2:**
- Claim form design
- "Claim This Item" button
- "My Claims" page
- Status badges

**Dev 3:**
- Form validation (20 char min)
- Duplicate prevention
- Test claim flow
- Error handling

**Deliverable:** Claims system working

---

#### Week 8: Admin Dashboard
**Goal:** Admin can manage everything

**Dev 1:**
- Admin dashboard view
- Review claims view
- Approve/reject actions
- Item management (edit/delete)

**Dev 2:**
- Dashboard layout
- Claim review interface
- Approve/reject buttons
- Admin statistics cards

**Dev 3:**
- Admin permissions
- Action logging
- Test admin workflows
- Confirmation dialogs

**Deliverable:** Full admin system

---

### 🟡 PHASE 2: POLISH (Weeks 9-11)

#### Week 9: UI/UX Enhancement
- Responsive design (mobile/tablet)
- Improve forms and validation
- Loading states
- Better error messages
- Image preview on upload

#### Week 10: Testing
- Unit tests (models)
- Integration tests (flows)
- Cross-browser testing
- Security testing
- Bug fixes

#### Week 11: Optimization
- Database query optimization
- Image compression
- Page load speed
- Code cleanup
- Documentation

**Deliverable:** Polished, tested application

---

### 🟢 PHASE 3: DEPLOYMENT (Weeks 12-13)

#### Week 12: Deployment Prep
- Production settings
- PostgreSQL setup
- Static file configuration
- Security hardening
- Environment variables

#### Week 13: Go Live
- Deploy to hosting (Heroku/AWS/DigitalOcean)
- Domain + SSL setup
- Final testing on production
- Monitor for issues
- Quick fixes

**Deliverable:** Live website

---

### ⭐ PHASE 4: OPTIONAL FEATURES (Week 14)

**Only if time permits:**

#### Email Notifications
- Claim submitted notification
- Claim approved/rejected emails
- Email templates (HTML)

#### Advanced Features
- Password reset
- Email verification
- CSV export
- Activity logs
- Statistics dashboard
- Item archival (90-day policy)
- Bulk actions

**Buffer week for delays/polish**

---

## URL Structure

```
/                           # Home
/register/student/          # Student registration
/register/teacher/          # Teacher registration  
/login/                     # Login
/logout/                    # Logout

/items/                     # All items
/items/search/              # Search
/items/<id>/                # Item detail
/items/report/              # Report item (teachers)
/items/my-items/            # My items (teachers)

/claims/submit/<id>/        # Submit claim
/claims/my-claims/          # My claims (students)

/admin-dashboard/           # Admin home
/admin-dashboard/claims/    # Review claims
/admin-dashboard/items/     # Manage items
```

---

## Daily Workflow

### Standup (10 min/day)
- Yesterday's progress
- Today's plan
- Blockers

### Development Time
- **Weekdays:** 2-3 hours/day
- **Weekends:** 4-6 hours/day
- **Total:** ~25 hours/week per person

### Git Workflow
1. Feature branches for each task
2. Commit often with clear messages
3. Pull request + code review
4. Merge to main after approval

---

## Feature Checklist

### ✅ Required (Must Complete)
- [ ] Home page with navigation
- [ ] User registration (student/teacher)
- [ ] User login/logout
- [ ] Report found items
- [ ] Photo upload
- [ ] Item listing (all items)
- [ ] Search items
- [ ] Item detail page
- [ ] Claim form
- [ ] Admin dashboard
- [ ] Review claims (approve/reject)
- [ ] Manage items (edit/delete)

### 🎯 Important (Should Complete)
- [ ] My Items page
- [ ] My Claims page
- [ ] Search filters (category, location, date)
- [ ] Pagination
- [ ] Responsive design
- [ ] Form validation
- [ ] Status tracking
- [ ] Admin notes on claims

### ⭐ Nice to Have (If Time)
- [ ] Email notifications
- [ ] Password reset
- [ ] Statistics
- [ ] CSV export
- [ ] Image optimization
- [ ] Activity logs

---

## Tech Stack Details

### Backend
```python
Django==5.0
Pillow==10.0
psycopg2-binary==2.9
python-decouple==3.8
```

### Frontend
```html
Bootstrap 5 (CSS framework)
Vanilla JavaScript (no jQuery needed)
Font Awesome (icons)
```

### Database
- **Development:** SQLite
- **Production:** PostgreSQL

---

## Testing Strategy

### Quick Test Checklist
- [ ] Registration works (student + teacher)
- [ ] Login/logout works
- [ ] Report item with photo
- [ ] View item list
- [ ] Search returns results
- [ ] Submit claim
- [ ] Admin can approve/reject
- [ ] Edit/delete items
- [ ] Mobile responsive
- [ ] No console errors

---

## Deployment Checklist

### Before Deploy
- [ ] All tests passing
- [ ] No critical bugs
- [ ] SECRET_KEY changed
- [ ] DEBUG = False
- [ ] ALLOWED_HOSTS set
- [ ] Static files collected
- [ ] Database migrated

### Deploy Steps
1. Create Heroku/AWS account
2. Setup PostgreSQL database
3. Configure environment variables
4. Push code to production
5. Run migrations
6. Collect static files
7. Test thoroughly

---

## Risk Management

### If Behind Schedule
**Priority Order:**
1. Authentication (register/login)
2. Item reporting + viewing
3. Basic search
4. Claims submission
5. Admin review
6. Everything else is optional

### Holidays & Breaks
- Christmas week (Dec 21-27): Light work
- New Year (Dec 28-Jan 3): Light work
- Plan for ~50% productivity during holidays

---

## Minimal Viable Product (MVP)

**If pressed for time, these features ONLY:**

1. ✅ User registration + login
2. ✅ Report item form (with photo)
3. ✅ View all items (simple list)
4. ✅ Basic search (keyword only)
5. ✅ Claim form (simple text)
6. ✅ Admin view to approve claims

**This MVP = Passing grade**

---

## Success Metrics

### Week 4 Checkpoint
- User system working
- Items can be reported
- Items display properly

### Week 8 Checkpoint
- Search functional
- Claims system complete
- Admin dashboard working

### Week 12 Checkpoint
- Application polished
- All tests passing
- Ready to deploy

### Week 14 Final
- Live website
- All required features
- Optional features (if time)

---

## Communication

### Tools
- **Code:** GitHub
- **Chat:** Discord/Slack
- **Tasks:** GitHub Projects/Trello
- **Docs:** Google Docs

### Meetings
- **Daily:** 10 min standup (async OK)
- **Weekly:** 30 min review (Sundays)
- **As needed:** Pair programming sessions

---

## Quick Start Commands

```bash
# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install django pillow
django-admin startproject lostandfound
cd lostandfound
python manage.py startapp items
python manage.py startapp accounts

# Development
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Deploy
python manage.py collectstatic
python manage.py migrate --run-syncdb
```

---

## Remember

1. **Code from scratch** ✅ (Required)
2. **Focus on functionality** over fancy design
3. **Test as you build** - don't wait until end
4. **Start simple** - can add complexity later
5. **Communication** - update team daily
6. **Document** - comment your code
7. **Git commits** - small and frequent
8. **Ask for help** - don't get stuck
9. **MVP first** - then add features
10. **Have fun!** 🚀

---

**Last Updated:** November 23, 2025  
**Next Review:** November 30, 2025  
**Status:** Ready to Start

**"Perfect is the enemy of done. Ship the MVP!"**
