# Testing Guide for Lost & Found Project

## 🚀 Quick Start

### Option 1: Use Quick Test Script (Recommended)

**Linux/Mac:**
```bash
chmod +x quick_test.sh
./quick_test.sh
```

**Windows:**
```bash
quick_test.bat
```

### Option 2: Manual Commands

**Reset database and seed:**
```bash
python manage.py reset_database
```

**Seed data only:**
```bash
python manage.py seed_data
```

**Setup test images:**
```bash
python setup_test_images.py
```

---

## 📁 File Setup

### 1. Management Commands Location
Place these files in their respective locations:

```
lostandfound/
├── items/
│   └── management/
│       └── commands/
│           ├── __init__.py          (create if missing)
│           ├── seed_data.py         ← Place seed_data.py here
│           └── reset_database.py    ← Place reset_database.py here
├── setup_test_images.py             ← Place in project root
├── quick_test.sh                    ← Place in project root (Linux/Mac)
└── quick_test.bat                   ← Place in project root (Windows)
```

### 2. Create __init__.py if missing
If `items/management/commands/` doesn't exist:
```bash
mkdir -p items/management/commands
touch items/management/__init__.py
touch items/management/commands/__init__.py
```

---

## 🎯 What Each Script Does

### 1. seed_data.py
**Purpose:** Populates database with 10 diverse test items

**Creates:**
- 10 items across all categories (electronics, clothing, bags, etc.)
- Items with varied dates (from today to 15 days ago)
- Different statuses (reported, unclaimed, claimed, verified, rejected)
- 4 test user accounts (3 students + 1 teacher)
- 1 admin account

**Test Data Includes:**
- Blue Water Bottle (personal, 2 days ago)
- Black Backpack (bags, 5 days ago)
- iPhone 13 (electronics, 1 day ago)
- Red Hoodie (clothing, 7 days ago)
- Graphing Calculator (supplies, 3 days ago)
- Student ID Card (keys, today)
- Silver Necklace (accessories, 10 days ago)
- Basketball (equipment, 4 days ago)
- Wireless Earbuds (electronics, 15 days ago)
- Chemistry Textbook (supplies, 8 days ago)

**Usage:**
```bash
python manage.py seed_data
```

### 2. reset_database.py
**Purpose:** Completely resets database to clean state

**Does:**
1. Deletes all claims
2. Deletes all items
3. Deletes all users (except superusers)
4. Runs migrations
5. Seeds with test data (unless --no-seed flag used)
6. Creates superuser if none exists

**Usage:**
```bash
# Reset and seed
python manage.py reset_database

# Reset without seeding
python manage.py reset_database --no-seed
```

### 3. setup_test_images.py
**Purpose:** Creates test images at different sizes for upload testing

**Creates:**
- `test_valid_small.jpg` - 2MB (should pass validation)
- `test_valid_large.jpg` - 4.5MB (should pass validation)
- `test_invalid_toolarge.jpg` - 6MB (should FAIL validation)

**Output Location:** `test_images/` folder

**Usage:**
```bash
python setup_test_images.py
```

**Requirements:**
```bash
pip install Pillow
```

### 4. quick_test.sh / quick_test.bat
**Purpose:** Interactive menu for all testing tasks

**Features:**
- Reset database with/without seeding
- Seed data only
- Setup test images
- Run development server
- Create superuser
- Show test account credentials

---

## 👥 Test Accounts

After running `reset_database` or `seed_data`, these accounts are available:

| Role | Username | Password | Status |
|------|----------|----------|--------|
| Admin | admin | admin123 | Superuser |
| Teacher | teacher1 | password123 | Approved |
| Student | student1 | password123 | Approved |
| Student | student2 | password123 | Approved |
| Student | student3 | password123 | Approved |

---

## 🧪 Testing Workflows

### Workflow 1: Fresh Start Testing
```bash
# 1. Reset everything
python manage.py reset_database

# 2. Setup test images
python setup_test_images.py

# 3. Run server
python manage.py runserver

# 4. Login and test features
```

### Workflow 2: Quick Practice Run
```bash
# Just reset database (keeps test images)
python manage.py reset_database

# Run server
python manage.py runserver
```

### Workflow 3: Add More Test Data
```bash
# Seed without deleting existing data
python manage.py seed_data

# This adds 10 more items to database
```

---

## 📸 Testing Image Upload

### Test Case 1: Valid Small Image
1. Go to Report Item page
2. Upload `test_images/test_valid_small.jpg`
3. ✅ Should upload successfully

### Test Case 2: Valid Large Image
1. Go to Report Item page
2. Upload `test_images/test_valid_large.jpg`
3. ✅ Should upload successfully (just under 5MB limit)

### Test Case 3: Invalid Too Large
1. Go to Report Item page
2. Upload `test_images/test_invalid_toolarge.jpg`
3. ❌ Should show error: "Image file size cannot exceed 5MB"

### Test Case 4: Invalid File Type
1. Create a .txt file and rename it to .jpg
2. Try to upload it
3. ❌ Should show error: "Only JPG, PNG, GIF, and WEBP files allowed"

---

## 🔍 Verifying Seed Data

### Check Items in Admin Panel
1. Login as admin (admin / admin123)
2. Go to Admin → Manage Reports, Claims, & Inquiries
3. Switch to "All" tab
4. Should see 10 test items

### Check Different Statuses
- **Pending Approval** tab: Should show iPhone 13
- **All other tabs**: Should show items in various statuses

### Check Date Diversity
Items should have varied "Date Found":
- Some from today
- Some from 1-3 days ago
- Some from 1-2 weeks ago

### Check Category Diversity
Items should span all categories:
- Electronics (2 items)
- Clothing (1 item)
- Bags (1 item)
- Supplies (2 items)
- Keys (1 item)
- Accessories (1 item)
- Equipment (1 item)
- Personal (1 item)

---

## 🛠️ Troubleshooting

### "No module named 'PIL'"
```bash
pip install Pillow
```

### "Permission denied" on .sh file
```bash
chmod +x quick_test.sh
```

### Management command not found
Make sure `__init__.py` files exist in:
- `items/management/__init__.py`
- `items/management/commands/__init__.py`

### Database locked error
Close any open Django shells or database connections, then try again.

### Test images not created
Check that you have write permissions in the project directory.

---

## 📊 Quick Reference

### Before Each Practice Run
```bash
python manage.py reset_database
python manage.py runserver
```

### To Add More Test Data
```bash
python manage.py seed_data
```

### To Test File Upload Validation
```bash
python setup_test_images.py
# Then upload test_images/*.jpg files
```

### To View Test Account Credentials
```bash
./quick_test.sh   # Select option 8
# OR
python manage.py seed_data  # Shows credentials at end
```

---

## ✅ Testing Checklist

- [ ] Database reset works
- [ ] Seed data creates 10 items
- [ ] Test accounts can login
- [ ] Images at different sizes
- [ ] Valid images upload successfully
- [ ] Large images (>5MB) are rejected
- [ ] Wrong file types are rejected
- [ ] Items appear in correct status tabs
- [ ] Dates are diverse
- [ ] Categories are diverse
- [ ] Admin workflow works
- [ ] Student workflow works
- [ ] Teacher workflow works

---

## 💡 Pro Tips

1. **Keep test_images folder:** After first setup, you don't need to recreate test images each time
2. **Use quick_test script:** Much faster than typing commands
3. **Reset before demos:** Always start with fresh data for presentations
4. **Test edge cases:** Use the "too large" image to verify validation works
5. **Multiple browsers:** Test with different user accounts in different browsers

---

## 🎓 Common Testing Scenarios

### Scenario 1: Student Reports Item
1. Login as student1
2. Report item with test_valid_small.jpg
3. Logout

### Scenario 2: Admin Approves Item
1. Login as admin
2. Go to Manage Reports, Claims, & Inquiries
3. Click Pending Approval tab
4. Approve the reported item

### Scenario 3: Student Claims Item
1. Login as student2 (different student)
2. Search for items
3. Submit claim for approved item

### Scenario 4: Admin Verifies and Returns
1. Login as admin
2. Review claim
3. Verify claim
4. Mark as returned

---

Need more test data? Just run `python manage.py seed_data` again!