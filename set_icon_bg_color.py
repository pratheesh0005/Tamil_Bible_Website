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

# Exact app dark background color (RGB: 5, 8, 22 -> #050816)
BG_COLOR = (5, 8, 22, 255)

# Sample actual edge color from near the outer circle of the icon to ensure 100% exact match
edge_samples = []
for angle in range(0, 360, 10):
    rad = math.radians(angle)
    r_dist = (width / 2.0) * 0.88
    x = int(center_x + r_dist * math.cos(rad))
    y = int(center_y + r_dist * math.sin(rad))
    edge_samples.append(img.getpixel((x, y)))

if edge_samples:
    avg_r = int(sum(s[0] for s in edge_samples) / len(edge_samples))
    avg_g = int(sum(s[1] for s in edge_samples) / len(edge_samples))
    avg_b = int(sum(s[2] for s in edge_samples) / len(edge_samples))
    EXACT_BG_COLOR = (avg_r, avg_g, avg_b, 255)
else:
    EXACT_BG_COLOR = BG_COLOR

print(f"Sampled exact icon background color: RGB{EXACT_BG_COLOR[:3]}")

# Fill the 4 outer corners with the exact icon background color instead of black or transparent
pixels = img.load()
for y in range(height):
    for x in range(width):
        dx = x - center_x + 0.5
        dy = y - center_y + 0.5
        dist = math.sqrt(dx * dx + dy * dy)
        r, g, b, a = pixels[x, y]
        
        # Replace black corners (R,G,B near 0 and outside or near circle boundary)
        if dist >= radius - 2 or (r < 15 and g < 15 and b < 15):
            pixels[x, y] = EXACT_BG_COLOR

assets_dir = r"c:\FlutterProjects\Tamil_Bible_website\assets"
os.makedirs(assets_dir, exist_ok=True)

app_icon_out = os.path.join(assets_dir, "app_icon.png")
favicon_out = os.path.join(assets_dir, "favicon.png")
apple_icon_out = os.path.join(assets_dir, "apple-icon.png")

img.save(app_icon_out, "PNG")
img.save(favicon_out, "PNG")
img.save(apple_icon_out, "PNG")

# Also save root favicon.ico / favicon.png for browser defaults
img.resize((64, 64), Image.Resampling.LANCZOS).save(r"c:\FlutterProjects\Tamil_Bible_website\favicon.ico", "ICO")
img.save(r"c:\FlutterProjects\Tamil_Bible_website\favicon.png", "PNG")

print(f"Successfully replaced 4 black corners with exact background color {EXACT_BG_COLOR[:3]}!")
