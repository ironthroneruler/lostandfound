"""
Management command to seed the database with test data
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
from items.models import Item

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with test items in diverse categories and dates'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # Get or create test users
        admin_user = self.get_or_create_admin()
        test_users = self.get_or_create_test_users()

        # Clear existing test items (optional - comment out if you want to keep existing data)
        # Item.objects.all().delete()
        # self.stdout.write(self.style.WARNING('Cleared existing items'))

        # Create test items
        items_data = [
            {
                'name': 'Blue Water Bottle',
                'category': 'personal',
                'description': 'Stainless steel water bottle with a dent on the bottom. Blue color with white cap.',
                'location_found': 'Cafeteria',
                'days_ago': 2,
                'status': 'unclaimed'
            },
            {
                'name': 'Black Backpack',
                'category': 'bags',
                'description': 'Medium-sized black backpack with Nike logo. Contains math textbook.',
                'location_found': 'Gym',
                'days_ago': 5,
                'status': 'unclaimed'
            },
            {
                'name': 'iPhone 13',
                'category': 'electronics',
                'description': 'White iPhone 13 with cracked screen protector. Pink case.',
                'location_found': 'Room 204',
                'days_ago': 1,
                'status': 'reported'
            },
            {
                'name': 'Red Hoodie',
                'category': 'clothing',
                'description': 'Large red hoodie with "STATE CHAMPIONS 2024" printed on back.',
                'location_found': 'Library',
                'days_ago': 7,
                'status': 'unclaimed'
            },
            {
                'name': 'Graphing Calculator',
                'category': 'supplies',
                'description': 'TI-84 Plus graphing calculator. Name "Sarah M." written inside battery compartment.',
                'location_found': 'Math Lab',
                'days_ago': 3,
                'status': 'claimed'
            },
            {
                'name': 'Student ID Card',
                'category': 'keys',
                'description': 'Student ID card for John Smith, Student #12345. Expires 2025.',
                'location_found': 'Main Office',
                'days_ago': 0,
                'status': 'unclaimed'
            },
            {
                'name': 'Silver Necklace',
                'category': 'accessories',
                'description': 'Silver chain necklace with heart-shaped pendant. Engraved with initials "M.L."',
                'location_found': 'Girls Locker Room',
                'days_ago': 10,
                'status': 'verified'
            },
            {
                'name': 'Basketball',
                'category': 'equipment',
                'description': 'Spalding basketball, slightly deflated. Has signature in permanent marker.',
                'location_found': 'Basketball Court',
                'days_ago': 4,
                'status': 'unclaimed'
            },
            {
                'name': 'Wireless Earbuds',
                'category': 'electronics',
                'description': 'Apple AirPods Pro with charging case. Left earbud missing.',
                'location_found': 'Parking Lot',
                'days_ago': 15,
                'status': 'rejected'
            },
            {
                'name': 'Chemistry Textbook',
                'category': 'supplies',
                'description': 'AP Chemistry textbook, 2023 edition. Name written on inside cover.',
                'location_found': 'Room 312',
                'days_ago': 8,
                'status': 'unclaimed'
            }
        ]

        created_count = 0
        for item_data in items_data:
            # Calculate date found
            days_ago = item_data.pop('days_ago')
            date_found = (timezone.now() - timedelta(days=days_ago)).date()
            
            # Random user who submitted
            submitted_by = random.choice(test_users)
            
            # Create item
            item = Item.objects.create(
                name=item_data['name'],
                category=item_data['category'],
                description=item_data['description'],
                location_found=item_data['location_found'],
                date_found=date_found,
                status=item_data['status'],
                submitted_by=submitted_by,
                photo='items/default.jpg'  # Using default image
            )
            
            # If item is approved status, set approval info
            if item_data['status'] in ['unclaimed', 'verified', 'claimed', 'rejected']:
                item.approved_by = admin_user
                item.approval_date = timezone.now() - timedelta(days=days_ago-1)
                item.approval_notes = 'Approved during seeding'
                item.save()
            
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {item.name}'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} test items!'))
        self.stdout.write(self.style.SUCCESS('Database seeding complete!'))

    def get_or_create_admin(self):
        """Get or create admin user for testing"""
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@test.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
                'user_type': 'admin',
                'approval_status': 'approved'
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('  ✓ Created admin user (username: admin, password: admin123)'))
        return admin

    def get_or_create_test_users(self):
        """Get or create test student/teacher users"""
        users = []
        
        # Create test students
        test_students = [
            {'username': 'student1', 'first_name': 'Alice', 'last_name': 'Johnson'},
            {'username': 'student2', 'first_name': 'Bob', 'last_name': 'Smith'},
            {'username': 'student3', 'first_name': 'Charlie', 'last_name': 'Davis'},
        ]
        
        for student_data in test_students:
            user, created = User.objects.get_or_create(
                username=student_data['username'],
                defaults={
                    'email': f"{student_data['username']}@test.com",
                    'first_name': student_data['first_name'],
                    'last_name': student_data['last_name'],
                    'user_type': 'student',
                    'approval_status': 'approved'
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created test user: {user.username}'))
            users.append(user)
        
        # Create test teacher
        teacher, created = User.objects.get_or_create(
            username='teacher1',
            defaults={
                'email': 'teacher1@test.com',
                'first_name': 'Mr.',
                'last_name': 'Anderson',
                'user_type': 'teacher',
                'approval_status': 'approved'
            }
        )
        if created:
            teacher.set_password('password123')
            teacher.save()
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created test teacher: {teacher.username}'))
        users.append(teacher)
        
        return users