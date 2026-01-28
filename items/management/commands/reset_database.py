"""
Management command to reset the database for testing
Usage: python manage.py reset_database
"""
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model
from items.models import Item
from claims.models import Claim
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Resets the database and optionally seeds with test data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-seed',
            action='store_true',
            help='Reset database without seeding test data',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('⚠️  WARNING: This will delete ALL data in the database!'))
        
        # Confirmation prompt
        confirm = input('Type "yes" to confirm: ')
        if confirm.lower() != 'yes':
            self.stdout.write(self.style.ERROR('Database reset cancelled.'))
            return

        self.stdout.write(self.style.SUCCESS('\n🔄 Starting database reset...'))

        # Step 1: Delete all data
        self.stdout.write('  → Deleting claims...')
        Claim.objects.all().delete()
        
        self.stdout.write('  → Deleting items...')
        Item.objects.all().delete()
        
        self.stdout.write('  → Deleting users (except superusers)...')
        User.objects.filter(is_superuser=False).delete()
        
        self.stdout.write(self.style.SUCCESS('  ✓ All data deleted'))

        # Step 2: Reset migrations (optional - be careful with this)
        # Uncomment if you want to reset migrations too
        # self.stdout.write('  → Resetting migrations...')
        # call_command('migrate', '--fake', 'items', 'zero')
        # call_command('migrate', '--fake', 'claims', 'zero')
        # call_command('migrate', '--fake', 'accounts', 'zero')

        # Step 3: Run migrations
        self.stdout.write('  → Running migrations...')
        call_command('migrate', '--no-input')
        self.stdout.write(self.style.SUCCESS('  ✓ Migrations complete'))

        # Step 4: Seed database (unless --no-seed flag is used)
        if not options['no_seed']:
            self.stdout.write('\n  → Seeding database with test data...')
            call_command('seed_data')
        else:
            self.stdout.write(self.style.WARNING('\n  ⊗ Skipping seed data (--no-seed flag used)'))

        # Step 5: Create superuser if none exists
        if not User.objects.filter(is_superuser=True).exists():
            self.stdout.write('\n  → Creating superuser...')
            User.objects.create_superuser(
                username='admin',
                email='admin@test.com',
                password='admin123',
                first_name='Super',
                last_name='Admin'
            )
            self.stdout.write(self.style.SUCCESS('  ✓ Superuser created (username: admin, password: admin123)'))

        self.stdout.write(self.style.SUCCESS('\n✅ Database reset complete!'))
        self.stdout.write(self.style.SUCCESS('\n📋 Test Accounts Created:'))
        self.stdout.write('  Admin:    username=admin,    password=admin123')
        self.stdout.write('  Teacher:  username=teacher1, password=password123')
        self.stdout.write('  Student:  username=student1, password=password123')
        self.stdout.write('  Student:  username=student2, password=password123')
        self.stdout.write('  Student:  username=student3, password=password123')