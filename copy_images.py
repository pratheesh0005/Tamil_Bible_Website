import os
import shutil
import math

src_dir = r"C:\Users\Bala\.gemini\antigravity-ide\brain\37b6134a-eef3-401b-819f-32ea55c7a805"
dst_dir = r"c:\FlutterProjects\Tamil_Bible_website\assets"
app_icon_src = r"c:\FlutterProjects\tamil_bible_new\web\icons\Icon-512.png"

os.makedirs(dst_dir, exist_ok=True)

mapping = {
    "media__1784904049491.png": "screen_home.png",
    "media__1784904109703.jpg": "screen_features.jpg",
    "media__1784904123970.png": "screen_books.png",
    "media__1784904134276.png": "screen_word_study.png",
    "media__1784904195996.png": "screen_drawer.png",
}

for src_name, dst_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dst_path)
        print(f"Copied: {dst_name}")

if os.path.exists(app_icon_src):
    try:
        from PIL import Image
        img = Image.open(app_icon_src).convert("RGBA")
        width, height = img.size
        center_x, center_y = width / 2.0, height / 2.0
        radius = min(width, height) / 2.0

        # Sample exact outer edge color of icon background
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
            EXACT_BG = (avg_r, avg_g, avg_b, 255)
        else:
            EXACT_BG = (5, 8, 22, 255)

        pixels = img.load()
        for y in range(height):
            for x in range(width):
                dx = x - center_x + 0.5
                dy = y - center_y + 0.5
                dist = math.sqrt(dx * dx + dy * dy)
                r, g, b, a = pixels[x, y]
                if dist >= radius - 2 or (r < 15 and g < 15 and b < 15):
                    pixels[x, y] = EXACT_BG

        img.save(os.path.join(dst_dir, "app_icon.png"), "PNG")
        img.save(os.path.join(dst_dir, "favicon.png"), "PNG")
        img.save(os.path.join(dst_dir, "apple-icon.png"), "PNG")
        img.save(r"c:\FlutterProjects\Tamil_Bible_website\favicon.png", "PNG")
        img.resize((64, 64), Image.Resampling.LANCZOS).save(r"c:\FlutterProjects\Tamil_Bible_website\favicon.ico", "ICO")
        print(f"Processed icon: replaced 4 black corners with exact icon background color RGB{EXACT_BG[:3]}!")
    except Exception as e:
        shutil.copy(app_icon_src, os.path.join(dst_dir, "app_icon.png"))
        shutil.copy(app_icon_src, os.path.join(dst_dir, "favicon.png"))
        print(f"Copied icon: {e}")

print("\nAll screenshot assets & updated icon/favicon saved successfully!")
