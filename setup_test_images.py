"""
Script to create test images at different sizes for testing file upload validation
Run with: python setup_test_images.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_test_image(filename, size_mb, dimensions=(800, 600)):
    """
    Create a test image of specified size
    
    Args:
        filename: Output filename
        size_mb: Target size in megabytes
        dimensions: Image dimensions (width, height)
    """
    # Create a new image with a colored background
    img = Image.new('RGB', dimensions, color=(65, 105, 225))  # Royal blue
    draw = ImageDraw.Draw(img)
    
    # Add some text to the image
    try:
        # Try to use a default font
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        # Fall back to default font if arial not available
        font = ImageFont.load_default()
    
    # Draw text on the image
    text = f"Test Image\n{size_mb}MB\n{dimensions[0]}x{dimensions[1]}"
    
    # Get text size for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((dimensions[0] - text_width) // 2, (dimensions[1] - text_height) // 2)
    
    # Draw white text with black outline
    draw.text(position, text, fill=(255, 255, 255), font=font, align='center')
    
    # Save with appropriate quality to hit target size
    quality = 95
    img.save(filename, 'JPEG', quality=quality)
    
    # Check file size and adjust if needed
    actual_size = os.path.getsize(filename) / (1024 * 1024)  # Size in MB
    print(f"Created {filename}: {actual_size:.2f}MB (target: {size_mb}MB)")
    
    return actual_size

def main():
    # Create output directory if it doesn't exist
    output_dir = 'test_images'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print("Creating test images...")
    print("-" * 50)
    
    # Test Image 1: Small valid image (under 5MB)
    create_test_image(
        os.path.join(output_dir, 'test_valid_small.jpg'),
        size_mb=2,
        dimensions=(1920, 1080)
    )
    
    # Test Image 2: Large valid image (just under 5MB limit)
    create_test_image(
        os.path.join(output_dir, 'test_valid_large.jpg'),
        size_mb=4.5,
        dimensions=(3840, 2160)
    )
    
    # Test Image 3: Too large (over 5MB limit) - for testing validation
    create_test_image(
        os.path.join(output_dir, 'test_invalid_toolarge.jpg'),
        size_mb=6,
        dimensions=(4800, 3600)
    )
    
    print("-" * 50)
    print("✅ Test images created successfully!")
    print(f"\nImages saved to: {os.path.abspath(output_dir)}/")
    print("\nUsage:")
    print("  • test_valid_small.jpg - Valid upload (should work)")
    print("  • test_valid_large.jpg - Valid upload at max size (should work)")
    print("  • test_invalid_toolarge.jpg - Invalid upload (should be rejected)")

if __name__ == '__main__':
    main()