# Django ORM (Object-Relational Mapping) Guide

## What is ORM?

**ORM (Object-Relational Mapping)** is a programming technique that lets you interact with your database using Python code instead of writing raw SQL queries.

Django's ORM acts as a bridge between your Python objects and database tables, automatically translating your Python operations into SQL.

---

## Key Concepts

### Models = Database Tables

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        return self.title
```

This Python class automatically creates a database table with columns for each field.

---

## Creating Records

### Method 1: Create and Save
```python
book = Book(
    title="Django for Beginners",
    author="William Vincent",
    published_date="2023-01-15",
    price=39.99
)
book.save()  # Saves to database
```

### Method 2: Using create() (saves automatically)
```python
book = Book.objects.create(
    title="Django for Beginners",
    author="William Vincent",
    published_date="2023-01-15",
    price=39.99
)
```

### Method 3: Bulk Create (efficient for multiple records)
```python
books = [
    Book(title="Book 1", author="Author 1", published_date="2023-01-01", price=29.99),
    Book(title="Book 2", author="Author 2", published_date="2023-02-01", price=34.99),
    Book(title="Book 3", author="Author 3", published_date="2023-03-01", price=39.99),
]
Book.objects.bulk_create(books)
```

---

## Reading/Querying Records

### Get All Records
```python
all_books = Book.objects.all()
```

### Filter Records (returns QuerySet)
```python
# Single condition
books = Book.objects.filter(author="William Vincent")

# Multiple conditions (AND)
books = Book.objects.filter(author="William Vincent", price__lt=50)

# OR conditions
from django.db.models import Q
books = Book.objects.filter(Q(author="Author 1") | Q(author="Author 2"))
```

### Get Single Record
```python
# Get by primary key
book = Book.objects.get(id=1)
book = Book.objects.get(pk=1)  # pk is alias for primary key

# Get by unique field
book = Book.objects.get(title="Django for Beginners")

# Raises DoesNotExist exception if not found
# Raises MultipleObjectsReturned if more than one found
```

### Get or Create
```python
book, created = Book.objects.get_or_create(
    title="Django Guide",
    defaults={
        'author': 'Jane Doe',
        'published_date': '2023-01-01',
        'price': 29.99
    }
)
# created is True if new, False if existed
```

### First and Last
```python
first_book = Book.objects.first()
last_book = Book.objects.last()
```

### Check if Exists
```python
exists = Book.objects.filter(author="William Vincent").exists()
```

### Count Records
```python
count = Book.objects.count()
count = Book.objects.filter(price__gt=30).count()
```

---

## Field Lookups (Filters)

### Exact Match
```python
Book.objects.filter(author="William Vincent")
Book.objects.filter(author__exact="William Vincent")  # Same as above
```

### Case-Insensitive Match
```python
Book.objects.filter(author__iexact="william vincent")
```

### Contains
```python
Book.objects.filter(title__contains="Django")
Book.objects.filter(title__icontains="django")  # Case-insensitive
```

### Starts With / Ends With
```python
Book.objects.filter(title__startswith="Django")
Book.objects.filter(title__endswith="Guide")
```

### Comparisons
```python
# Greater than
Book.objects.filter(price__gt=30)

# Greater than or equal
Book.objects.filter(price__gte=30)

# Less than
Book.objects.filter(price__lt=50)

# Less than or equal
Book.objects.filter(price__lte=50)
```

### In List
```python
Book.objects.filter(author__in=["Author 1", "Author 2", "Author 3"])
```

### Range
```python
from datetime import date
Book.objects.filter(published_date__range=["2023-01-01", "2023-12-31"])
```

### Date Lookups
```python
Book.objects.filter(published_date__year=2023)
Book.objects.filter(published_date__month=1)
Book.objects.filter(published_date__day=15)
```

### Null Checks
```python
Book.objects.filter(author__isnull=True)
Book.objects.filter(author__isnull=False)
```

---

## Updating Records

### Method 1: Get, Modify, Save
```python
book = Book.objects.get(id=1)
book.price = 44.99
book.save()  # Updates the database
```

### Method 2: Update Multiple Records
```python
# Update all books by an author
Book.objects.filter(author="William Vincent").update(price=35.99)

# Update all records
Book.objects.all().update(price=29.99)
```

### Update or Create
```python
book, created = Book.objects.update_or_create(
    title="Django Guide",
    defaults={
        'author': 'Jane Doe',
        'price': 34.99
    }
)
```

---

## Deleting Records

### Delete Single Record
```python
book = Book.objects.get(id=1)
book.delete()
```

### Delete Multiple Records
```python
# Delete filtered records
Book.objects.filter(price__lt=20).delete()

# Delete all records (be careful!)
Book.objects.all().delete()
```

---

## Ordering Results

```python
# Ascending order
books = Book.objects.order_by('price')

# Descending order
books = Book.objects.order_by('-price')

# Multiple fields
books = Book.objects.order_by('author', '-published_date')

# Random order
books = Book.objects.order_by('?')
```

---

## Limiting Results

```python
# First 5 books
books = Book.objects.all()[:5]

# Skip first 5, get next 5
books = Book.objects.all()[5:10]

# Get 10th book (zero-indexed)
book = Book.objects.all()[9]
```

---

## Relationships

### ForeignKey (One-to-Many)

```python
class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published_date = models.DateField()
```

**Usage:**
```python
# Create author
author = Author.objects.create(name="William Vincent", email="william@example.com")

# Create book with author
book = Book.objects.create(
    title="Django for Beginners",
    author=author,
    published_date="2023-01-15"
)

# Access related objects
books_by_author = author.book_set.all()  # All books by this author

# Filter by related field
books = Book.objects.filter(author__name="William Vincent")
```

### OneToOneField (One-to-One)

```python
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
    birth_date = models.DateField()
    website = models.URLField()
```

**Usage:**
```python
# Create profile for user
profile = UserProfile.objects.create(
    user=user,
    bio="Django developer",
    birth_date="1990-01-01",
    website="https://example.com"
)

# Access from either side
profile = user.userprofile  # Access profile from user
user = profile.user  # Access user from profile
```

### ManyToManyField (Many-to-Many)

```python
class Tag(models.Model):
    name = models.CharField(max_length=50)

class Article(models.Model):
    title = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag)
```

**Usage:**
```python
# Create tags
tag1 = Tag.objects.create(name="Django")
tag2 = Tag.objects.create(name="Python")

# Create article
article = Article.objects.create(title="Django ORM Guide")

# Add tags
article.tags.add(tag1, tag2)

# Add by ID
article.tags.add(1, 2, 3)

# Set tags (replaces all existing)
article.tags.set([tag1, tag2])

# Remove tags
article.tags.remove(tag1)

# Clear all tags
article.tags.clear()

# Get all tags for article
tags = article.tags.all()

# Get all articles with a tag
articles = tag1.article_set.all()
```

---

## Advanced Queries

### Select Related (for ForeignKey and OneToOne)
Reduces queries by joining tables in a single SQL query.

```python
# Without select_related (N+1 queries problem)
books = Book.objects.all()
for book in books:
    print(book.author.name)  # Queries database for each author

# With select_related (single query with JOIN)
books = Book.objects.select_related('author').all()
for book in books:
    print(book.author.name)  # No additional queries
```

### Prefetch Related (for ManyToMany and reverse ForeignKey)
Reduces queries by fetching related objects in separate queries.

```python
# With prefetch_related
articles = Article.objects.prefetch_related('tags').all()
for article in articles:
    for tag in article.tags.all():  # No additional queries
        print(tag.name)
```

### Annotate and Aggregate

```python
from django.db.models import Count, Avg, Max, Min, Sum

# Count books per author
authors = Author.objects.annotate(book_count=Count('book'))
for author in authors:
    print(f"{author.name}: {author.book_count} books")

# Aggregate functions
stats = Book.objects.aggregate(
    avg_price=Avg('price'),
    max_price=Max('price'),
    min_price=Min('price'),
    total_books=Count('id')
)
```

### F Expressions (for field comparisons and updates)

```python
from django.db.models import F

# Compare fields
books = Book.objects.filter(price__gt=F('discount_price'))

# Update based on current value
Book.objects.all().update(price=F('price') * 1.1)  # 10% increase
```

### Q Objects (for complex queries)

```python
from django.db.models import Q

# OR condition
books = Book.objects.filter(Q(author="Author 1") | Q(price__lt=30))

# Complex combinations
books = Book.objects.filter(
    Q(author="Author 1") | Q(author="Author 2"),
    Q(price__lt=50)
)

# NOT condition
books = Book.objects.filter(~Q(author="Author 1"))
```

---

## When to Use .save()

### Use `.save()` when:

1. **Creating with constructor:**
```python
book = Book(title="Django Guide", author="Jane Doe")
book.save()  # Must call save()
```

2. **Modifying existing objects:**
```python
book = Book.objects.get(id=1)
book.title = "Updated Title"
book.save()  # Must call save()
```

3. **Working with forms:**
```python
form = BookForm(request.POST)
if form.is_valid():
    book = form.save()
```

### Don't need `.save()` with:

```python
# create() saves automatically
Book.objects.create(title="Django Guide")

# update() saves automatically
Book.objects.filter(author="Jane").update(price=29.99)

# get_or_create() saves automatically
book, created = Book.objects.get_or_create(title="Django Guide")

# bulk_create() saves automatically
Book.objects.bulk_create([book1, book2, book3])
```

---

## on_delete Options for Relationships

When defining ForeignKey or OneToOneField, specify what happens when the referenced object is deleted:

```python
class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
```

**Options:**

- **CASCADE**: Delete this object when referenced object is deleted
- **PROTECT**: Prevent deletion of referenced object
- **SET_NULL**: Set field to NULL (requires null=True)
- **SET_DEFAULT**: Set to default value (requires default value)
- **SET()**: Set to a specific value
- **DO_NOTHING**: Do nothing (can cause database errors)

---

## Common Field Types

```python
# Text fields
title = models.CharField(max_length=200)  # Short text
description = models.TextField()  # Long text
slug = models.SlugField()  # URL-friendly text

# Numeric fields
price = models.DecimalField(max_digits=6, decimal_places=2)
quantity = models.IntegerField()
rating = models.FloatField()

# Date/Time fields
published_date = models.DateField()
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)

# Boolean
is_published = models.BooleanField(default=False)

# Email and URL
email = models.EmailField()
website = models.URLField()

# File fields
image = models.ImageField(upload_to='images/')
document = models.FileField(upload_to='documents/')

# Choice field
STATUS_CHOICES = [
    ('draft', 'Draft'),
    ('published', 'Published'),
]
status = models.CharField(max_length=10, choices=STATUS_CHOICES)
```

---

## Common Field Options

```python
# Required vs Optional
title = models.CharField(max_length=200)  # Required by default
subtitle = models.CharField(max_length=200, blank=True, null=True)  # Optional

# Unique
email = models.EmailField(unique=True)

# Default value
is_active = models.BooleanField(default=True)

# Database index
isbn = models.CharField(max_length=13, db_index=True)

# Help text
price = models.DecimalField(
    max_digits=6,
    decimal_places=2,
    help_text="Price in USD"
)
```

---

## Best Practices

1. **Use `select_related()` and `prefetch_related()`** to avoid N+1 query problems
2. **Use `bulk_create()`** when creating many objects at once
3. **Use `.update()`** instead of looping through `.save()` for bulk updates
4. **Use `.exists()`** instead of `.count()` when checking if records exist
5. **Use `.only()` and `.defer()`** to limit fields loaded from database
6. **Add database indexes** on frequently queried fields
7. **Use transactions** for operations that must succeed or fail together
8. **Avoid using `.all()` in templates** - filter in views instead

---

## Transaction Example

```python
from django.db import transaction

@transaction.atomic
def transfer_money(from_account, to_account, amount):
    from_account.balance -= amount
    from_account.save()
    
    to_account.balance += amount
    to_account.save()
    # Both save or neither saves
```

---

## Raw SQL (when needed)

```python
# Execute raw SQL query
books = Book.objects.raw('SELECT * FROM myapp_book WHERE price > %s', [30])

# Direct SQL execution
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("SELECT * FROM myapp_book WHERE price > %s", [30])
    rows = cursor.fetchall()
```

---

## Resources

- [Django ORM Official Documentation](https://docs.djangoproject.com/en/stable/topics/db/)
- [QuerySet API Reference](https://docs.djangoproject.com/en/stable/ref/models/querysets/)
- [Model Field Reference](https://docs.djangoproject.com/en/stable/ref/models/fields/)
