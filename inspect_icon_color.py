from PIL import Image

icon_path = r"c:\FlutterProjects\tamil_bible_new\web\icons\Icon-512.png"
img = Image.open(icon_path).convert("RGBA")
width, height = img.size

# Sample pixels around radius 0.7 * (width/2) to find the icon background color
center_x = width / 2.0
center_y = height / 2.0

# Collect colors near the outer portion of the icon inner circle (e.g. at angle 45 deg, radius 0.65)
import math
samples = []
for angle in range(0, 360, 15):
    rad = math.radians(angle)
    r_dist = (width / 2.0) * 0.75
    x = int(center_x + r_dist * math.cos(rad))
    y = int(center_y + r_dist * math.sin(rad))
    samples.append(img.getpixel((x, y)))

print("Sampled background colors around icon circle:", samples[:5])
# Let's inspect the corner pixels vs inner circle pixels
corner_pixel = img.getpixel((0, 0))
print("Corner pixel at (0,0):", corner_pixel)
print("Inner background pixel at (width//2, 40):", img.getpixel((width // 2, 40)))
print("Inner background pixel at (width//2, 80):", img.getpixel((width // 2, 80)))
