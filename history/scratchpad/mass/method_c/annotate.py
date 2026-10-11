"""Draw every Method C pixel reading on the picture so it can be checked (method_c_measurements.png)."""
from PIL import Image, ImageDraw
im = Image.open('/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg').convert('RGB')
d = ImageDraw.Draw(im)
Y = (255, 230, 0); C = (0, 255, 255); M = (255, 0, 255); G = (0, 255, 0)
def hbar(x0, x1, y, col, lab=''):
    d.line([(x0, y), (x1, y)], fill=col, width=2); d.line([(x0, y - 5), (x0, y + 5)], fill=col, width=2); d.line([(x1, y - 5), (x1, y + 5)], fill=col, width=2)
    if lab: d.text((x1 + 3, y - 6), lab, fill=col)
def lvl(x0, x1, y, lab):
    d.line([(x0, y), (x1, y)], fill=G, width=1); d.text((x1 + 2, y - 6), lab, fill=G)
# ---- Rex landmarks
for y, lab in [(8.5, 'crest top'), (42, 'skull top'), (130, 'jaw'), (140, 'C7'), (170, 'SUPR'), (265, 'XYPH'), (365, 'OMPH'),
               (510, 'hip jc'), (545, 'crotch'), (592, 'knee'), (720, 'ankle'), (800.5, 'ground')]:
    lvl(700, 760 if y < 300 else 1000, y, lab)
hbar(695, 990, 240, Y, 'chest 295 (vis. 275)'); hbar(729, 966, 345, Y, 'waist 237'); hbar(690, 1005, 480, Y, 'hip 315')
hbar(624, 1100, 205, M, 'bideltoid 476')
hbar(609, 715, 290, C, '105'); hbar(970, 1135, 280, C, '165 (upper arms)')
hbar(588, 717, 365, C, '129'); hbar(1006, 1156, 358, C, '150 fore')
hbar(685, 835, 552, C, 'thigh 150'); hbar(681, 846, 645, C, 'calf 165'); hbar(690, 806, 712, C, '116')
hbar(615, 809, 785, C, 'foot 170-195')
# tail profile points
for (x, y) in [(1060, 600), (1085, 640), (1115, 675), (1150, 700), (1185, 712), (1215, 708), (1238, 690), (1244, 665), (1238, 640), (1236, 622)]:
    d.ellipse([x - 3, y - 3, x + 3, y + 3], outline=M, width=2)
# ---- Ollie landmarks
for y, lab in [(13.5, 'horn'), (24.5, 'hair'), (34.5, 'skull'), (130, 'chin'), (120, 'C7'), (150, 'SUPR'), (255, 'XYPH'), (343, 'OMPH'),
               (505, 'hip jc'), (547, 'crotch'), (610, 'knee'), (757, 'ankle'), (807.5, 'ground')]:
    lvl(20, 90, y, lab)
hbar(258, 548, 235, Y, 'chest 290'); hbar(232, 552, 345, Y, 'waist 320'); hbar(205, 575, 475, Y, 'hip 370')
hbar(145, 600, 165, M, 'bideltoid ~455')
d.line([(232, 175), (90, 297)], fill=C, width=2); d.text((120, 200), 'u.arm 185', fill=C)
d.line([(90, 300), (222, 398)], fill=C, width=2); d.text((110, 345), 'forearm 165', fill=C)
hbar(214, 377, 560, C, '164'); hbar(401, 565, 560, C, 'thigh'); hbar(172, 343, 632, C, '172'); hbar(399, 575, 632, C, 'calf')
hbar(177, 281, 725, C, '104'); hbar(442, 556, 725, C, 'boot shaft')
im.save('method_c_measurements.png')
print('ok')
