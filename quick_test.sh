#!/bin/bash

# Quick Test Script for Lost & Found Django Project
# Makes testing and resetting easy!

echo "🧪 Lost & Found Testing Utility"
echo "================================"
echo ""
echo "What would you like to do?"
echo ""
echo "1) Reset database and seed test data"
echo "2) Seed test data only (keep existing data)"
echo "3) Reset database without seeding"
echo "4) Setup test images"
echo "5) Full reset (database + test images)"
echo "6) Run development server"
echo "7) Create superuser"
echo "8) Show test accounts"
echo ""
read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        echo ""
        echo "🔄 Resetting database and seeding..."
        python manage.py reset_database
        ;;
    2)
        echo ""
        echo "🌱 Seeding test data..."
        python manage.py seed_data
        ;;
    3)
        echo ""
        echo "🔄 Resetting database only..."
        python manage.py reset_database --no-seed
        ;;
    4)
        echo ""
        echo "🖼️  Setting up test images..."
        python setup_test_images.py
        ;;
    5)
        echo ""
        echo "🔄 Full reset..."
        python manage.py reset_database
        echo ""
        echo "🖼️  Setting up test images..."
        python setup_test_images.py
        ;;
    6)
        echo ""
        echo "🚀 Starting development server..."
        python manage.py runserver
        ;;
    7)
        echo ""
        echo "👤 Creating superuser..."
        python manage.py createsuperuser
        ;;
    8)
        echo ""
        echo "📋 Test Accounts:"
        echo "================================"
        echo "Admin:    username=admin,    password=admin123"
        echo "Teacher:  username=teacher1, password=password123"
        echo "Student:  username=student1, password=password123"
        echo "Student:  username=student2, password=password123"
        echo "Student:  username=student3, password=password123"
        echo ""
        ;;
    *)
        echo ""
        echo "❌ Invalid choice!"
        ;;
esac

echo ""
echo "✅ Done!"