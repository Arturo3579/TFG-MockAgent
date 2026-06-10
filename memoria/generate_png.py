import sys
sys.path.append('C:\\Users\\sungr\\OneDrive\\Escritorio\\TFG_MockAgent\\memoria\\venv\\Lib\\site-packages')

from PIL import Image, ImageDraw, ImageFont
import os

# Crear imagen 512x512
img = Image.new('RGBA', (512, 512), color='#0a0a1e')
draw = ImageDraw.Draw(img)

# Dibujar rectángulo redondeado (simulando el SVG)
# Usar un rectángulo con esquinas redondeadas
# rx=20 en SVG de 100x100 → en 512x512 sería rx=102

# Dibujar fondo redondeado
x0, y0, x1, y1 = 0, 0, 512, 512
radius = 102  # 20% de 512

# Dibujar 4 círculos para las esquinas
# Superior izquierda
draw.ellipse([x0, y0, x0 + radius * 2, y0 + radius * 2], fill='#0a0a1e')
# Superior derecha
draw.ellipse([x1 - radius * 2, y0, x1, y0 + radius * 2], fill='#0a0a1e')
# Inferior izquierda
draw.ellipse([x0, y1 - radius * 2, x0 + radius * 2, y1], fill='#0a0a1e')
# Inferior derecha
draw.ellipse([x1 - radius * 2, y1 - radius * 2, x1, y1], fill='#0a0a1e')

# Dibujar rectángulos centrales
draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill='#0a0a1e')
draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill='#0a0a1e')

# Intentar usar fuente Arial
font = None
font_paths = [
    "C:\\Windows\\Fonts\\arial.ttf",
    "C:\\Windows\\Fonts\\Arial.ttf",
    "C:\\Windows\\Fonts\\ARIAL.ttf",
    "arial.ttf",
    "Arial.ttf"
]

for path in font_paths:
    if os.path.exists(path):
        try:
            font = ImageFont.truetype(path, 280)
            break
        except:
            continue

if font is None:
    font = ImageFont.load_default()

# Dibujar letra M
import textwrap
text = "M"

# Calcular posición centrada
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (512 - text_width) // 2
y = (512 - text_height) // 2 - 10

# Dibujar con outline para mejor visibilidad
# Outline negro
for dx in [-2, 2]:
    for dy in [-2, 2]:
        draw.text((x + dx, y + dy), text, font=font, fill='#0a0a1e')

# Texto principal dorado
draw.text((x, y), text, font=font, fill='#C9A96E')

# Guardar
output_path = 'C:\\Users\\sungr\\OneDrive\\Escritorio\\TFG_MockAgent\\memoria\\logo-mockagent.png'
img.save(output_path)
print("PNG generado exitosamente!")
print(f"Archivo: {output_path}")
print(f"Tamaño: 512x512px")
print(f"Tamaño de archivo: {os.path.getsize(output_path) / 1024:.1f} KB")
print("Listo para usar como foto de perfil de Google!")
