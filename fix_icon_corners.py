import os
import math

try:
    from PIL import Image
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

icon_path = r"c:\FlutterProjects\Tamil_Bible_website\assets\app_icon.png"
if not os.path.exists(icon_path):
    icon_path = r"c:\FlutterProjects\tamil_bible_new\web\icons\Icon-512.png"

img = Image.open(icon_path).convert("RGBA")
width, height = img.size
center_x = width / 2.0
center_y = height / 2.0
radius = min(width, height) / 2.0

# Create a smooth circular mask to remove the black 4 outer corners
pixels = img.load()
for y in range(height):
    for x in range(width):
        dx = x - center_x + 0.5
        dy = y - center_y + 0.5
        dist = math.sqrt(dx * dx + dy * dy)
        
        # Check if the pixel is outside the circular icon boundary
        if dist >= radius - 2:
            r, g, b, a = pixels[x, y]
            # Anti-aliased edge smoothing for outer boundary
            if dist >= radius:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                alpha_factor = (radius - dist) / 2.0
                new_a = int(a * alpha_factor)
                pixels[x, y] = (r, g, b, new_a)

assets_dir = r"c:\FlutterProjects\Tamil_Bible_website\assets"
os.makedirs(assets_dir, exist_ok=True)

app_icon_out = os.path.join(assets_dir, "app_icon.png")
favicon_out = os.path.join(assets_dir, "favicon.png")
apple_icon_out = os.path.join(assets_dir, "apple-icon.png")

img.save(app_icon_out, "PNG")
img.save(favicon_out, "PNG")
img.save(apple_icon_out, "PNG")

print(f"Successfully processed icon ({width}x{height}): removed black corners, saved transparent PNGs!")
