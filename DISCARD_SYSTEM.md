# Item Discard System Documentation

## Overview

The Lost and Found system includes a comprehensive item discard/donation tracking system with both manual and automatic discard capabilities.

## Features

### 1. Manual Discard (Admin/Teacher)

Admins and teachers can manually discard items from two places:

#### From Item Detail Page
- Navigate to any item's detail page
- Click the **"Discard"** button (visible only to admins/teachers)
- Select a discard reason from dropdown
- Add optional notes about disposal/donation
- Confirm the discard action

#### From Claim Review Page
- When reviewing a claim, use the **"Discard / Donate"** button
- Select a discard reason from the dropdown field
- The system will track who discarded it and when

### 2. Automatic Discard (Time-Based)

Items can be automatically discarded after a specified period using a management command.

#### Running the Auto-Discard Command

**Dry Run** (see what would be discarded without actually discarding):
```bash
python manage.py auto_discard_items --dry-run --days 90
```

**Actual Discard** (default 90 days):
```bash
python manage.py auto_discard_items --days 90
```

**Custom Time Period**:
```bash
python manage.py auto_discard_items --days 30  # Discard items older than 30 days
```

#### Scheduling Auto-Discard

You can schedule this command to run automatically:

**Windows (Task Scheduler)**:
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., weekly on Sunday at 2 AM)
4. Action: Start a Program
5. Program: `python`
6. Arguments: `manage.py auto_discard_items --days 90`
7. Start in: `C:\Users\harsh\OneDrive\Desktop\fbla\lostandfound`

**Linux/Mac (Cron)**:
```bash
# Add to crontab (run every Sunday at 2 AM)
0 2 * * 0 cd /path/to/lostandfound && python manage.py auto_discard_items --days 90
```

## Discard Tracking

When an item is discarded, the system tracks:

- **Discard Date**: Timestamp when the item was discarded
- **Discard Reason**: Why it was discarded (from predefined list or custom)
- **Discard Notes**: Optional additional details (e.g., "Donated to Goodwill", "Disposed - broken")
- **Discarded By**: Which staff member performed the discard action

## Discard Reasons

Available discard reasons include:

### Manual Discard
- Unclaimed for extended period
- Damaged or unusable
- Low value item
- Donated to charity
- Multiple failed claims
- Other

### Claim Review Discard
- Item not worth claiming
- Damaged or broken
- Multiple failed claims
- Low value item
- Other

### Auto-Discard
- Auto-discarded: Unclaimed for [X]+ days

## Item Eligibility for Auto-Discard

An item is eligible for automatic discard when:
1. Status is `unclaimed` or `rejected` (rejected claims)
2. Item has been in the system for the threshold number of days (default: 90)

Items that are `claimed`, `verified`, or `returned` will NOT be auto-discarded.

## Viewing Discarded Items

### Public View
- Discarded items do NOT appear in public search results
- Students cannot claim discarded items

### Admin View
- Admins can still view discarded items by direct URL
- Item detail page shows:
  - Discard reason
  - Discard date and time
  - Who discarded it (staff only)
  - Discard notes (staff only)

## Status Flow with Discard

```
Unclaimed → [Manual/Auto Discard] → Discarded
    ↓
Claimed → Rejected → [Manual/Auto Discard] → Discarded
    ↓
Verified → Returned (cannot be discarded)
```

## Best Practices

1. **Regular Review**: Run auto-discard monthly or quarterly to clean up old items
2. **Document Donations**: Use the discard notes field to record where items were donated
3. **Low-Value Items**: Manually discard damaged or low-value items immediately
4. **Record Keeping**: Keep discarded items in the database for historical tracking
5. **Physical Disposal**: Match your physical disposal process with the system actions

## Database Model

The Item model includes these discard-related fields:

```python
discard_date = DateTimeField          # When it was discarded
discard_reason = CharField            # Why it was discarded
discard_notes = TextField             # Additional disposal notes
discarded_by = ForeignKey(User)       # Staff member who discarded it
```

## Example Usage Scenarios

### Scenario 1: End of School Year Cleanup
```bash
# Discard all items unclaimed for 60+ days
python manage.py auto_discard_items --days 60
```

### Scenario 2: Broken Item During Claim Review
1. Admin reviews claim for a damaged phone
2. Realizes phone is broken and not worth claiming
3. Selects "Damaged or broken" as discard reason
4. Adds note: "Screen shattered, battery swollen - disposed safely"
5. Clicks "Discard / Donate"

### Scenario 3: Donation Drive
1. Admin navigates to old unclaimed items
2. Manually discards each with reason "Donated to charity"
3. Adds notes: "Donated to Goodwill on [date]"
4. Physical items removed from lost & found

## Troubleshooting

**Command not found**: Ensure you're in the correct directory with `manage.py`

**No items discarded**: Check that items meet eligibility criteria (status and days)

**Permission denied**: Ensure only admin/teacher accounts attempt to discard

**Discard button not visible**: Verify user has teacher or admin role
