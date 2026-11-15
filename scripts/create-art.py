"""Original pixel prototype assets. No source images. Pillow 13; seed 108."""
from PIL import Image, ImageDraw
import random, pathlib
out=pathlib.Path('public/assets');out.mkdir(exist_ok=True)
r=random.Random(108)
def save(im,n): im.save(out/(n+'.png'))
# Detailed diamond terrain with side faces, deterministic hand-authored palette.
for name,pal in {'plain':['#778b49','#879a51','#697e3d','#93a35b'],'forest':['#496c40','#557946','#61814b','#3e6238'],'road':['#b5a079','#c2ae87','#9d8b68','#cab791'],'river':['#357b87','#3d8d98','#4b9da5','#306c7a'],'rock':['#777c69','#8a8f78','#626b5e','#a0a18a'],'hill':['#708447','#81904e','#65743d','#99a05d']}.items():
 im=Image.new('RGBA',(64,50));d=ImageDraw.Draw(im);d.polygon([(0,16),(32,32),(32,49),(0,33)],fill='#4c5140');d.polygon([(32,32),(63,16),(63,33),(32,49)],fill='#353f36');d.polygon([(0,16),(32,0),(63,16),(32,32)],fill=pal[0])
 for _ in range(180):
  x,y=r.randrange(64),r.randrange(33)
  if abs(x-32)/32+abs(y-16)/16<.96:
   d.line((x,y,min(63,x+r.randrange(1,4)),y),fill=r.choice(pal))
 if name=='river':
  for x,y in [(21,12),(37,21),(43,10)]: d.line((x,y,x+8,y),fill='#80bdbe')
 save(im,name)
def tree(d,x,y,s=1):
 d.rectangle((x-1,y-12,x+1,y),fill='#655039')
 for dx,dy,rad,col in [(0,-21,11,'#243f31'),(-5,-22,8,'#365735'),(4,-26,9,'#496b3c'),(-2,-29,7,'#648146'),(-5,-31,3,'#8a9950')]:
  d.ellipse((x+dx-rad,y+dy-rad,x+dx+rad,y+dy+rad),fill=col)
im=Image.new('RGBA',(64,82));d=ImageDraw.Draw(im);d.ellipse((8,57,56,75),fill=(10,30,20,65));tree(d,34,69);tree(d,16,61);save(im,'tree')
for name in ['headquarters','housing','tavern','market','barracks','training-ground','fishery','farmland','fence','bridge']:
 im=Image.new('RGBA',(128,128));d=ImageDraw.Draw(im)
 d.ellipse((8,91,121,120),fill=(15,24,19,55))
 if name=='farmland':
  d.polygon([(6,91),(65,61),(123,91),(64,121)],fill='#6f5834')
  for j in range(8):
   for k in range(9):
    x=17+k*6+j*6;y=91-k*3+j*3
    d.line((x,y,x,y-6),fill='#b6ac51');d.point((x-1,y-5),fill='#dfcf6b');d.line((x,y-2,x+2,y-4),fill='#7e9542')
 elif name in ['bridge','fence']:
  for j in range(15):
   x=15+j*6;y=100-j*3
   d.polygon([(x,y),(x+21,y+10),(x+26,y+8),(x+5,y-3)],fill=['#a4865b','#96764d'][j%2])
  for x,y in [(16,101),(101,58),(37,112),(122,69)]:d.rectangle((x,y-22,x+3,y+2),fill='#6a5037')
  d.line((16,81,101,38),fill='#be9c63',width=3);d.line((37,92,122,49),fill='#be9c63',width=3)
 elif name=='training-ground':
  d.polygon([(7,87),(65,58),(120,86),(63,115)],fill='#af9765')
  for x,y in [(29,86),(52,73),(76,87),(55,100)]:
   d.line((x,y,x,y-20),fill='#66503a',width=3);d.ellipse((x-6,y-21,x+6,y-9),fill='#b4ab83',outline='#574a36');d.ellipse((x-2,y-17,x+2,y-13),fill='#963f32')
 else:
  if name=='fishery':
   d.polygon([(5,94),(70,60),(125,90),(61,123)],fill='#8a7050')
   for j in range(9):d.line((12+j*6,97+j*3,77+j*5,64+j*3),fill='#b4986b')
  scale=.7 if name=='housing' else 1
  # walls, shuttered windows, doorway, stepped foundation
  d.polygon([(26,73),(65,92),(105,72),(105,99),(65,121),(26,101)],fill='#665b45')
  d.polygon([(28,65),(64,84),(64,113),(28,94)],fill='#a58b60');d.polygon([(64,84),(102,65),(102,94),(64,113)],fill='#c0a978')
  for x,y in [(34,83),(48,90),(76,91),(90,83)]:
   d.rectangle((x,y-7,x+7,y+3),fill='#39443d');d.line((x+3,y-6,x+3,y+3),fill='#c6ad79')
  d.polygon([(57,97),(64,101),(71,97),(71,114),(64,117),(57,113)],fill='#393c31')
  # multi-layer grey-blue tile roof and ochre edge
  d.polygon([(13,65),(61,32),(115,61),(66,88)],fill='#273a3b')
  for j in range(8):
   d.line((16+j*6,65-j*4,67+j*5,86-j*3),fill=['#61706a','#4b5c58'][j%2],width=2)
  d.line((13,65,66,89,115,62),fill='#c3a16b',width=3);d.line((61,32,114,60),fill='#9b8e6b',width=3)
  d.line((13,65,9,60),fill='#c7ab72',width=3);d.line((115,62,120,55),fill='#c7ab72',width=3)
  if name=='headquarters':
   d.polygon([(39,45),(62,27),(88,42),(64,57)],fill='#344b4b');d.line((39,45,64,57,88,42),fill='#d1af6c',width=2)
   d.line((104,63,104,20),fill='#a88d60',width=2);d.polygon([(105,21),(122,25),(117,40),(105,35)],fill='#9d4436')
  if name in ['market','tavern']:
   for x,y in [(17,91),(86,105)]:
    d.rectangle((x,y,x+20,y+10),fill='#77583b');d.polygon([(x-3,y),(x+10,y-10),(x+25,y),(x+12,y+5)],fill='#a96749' if name=='tavern' else '#d3b675')
  if name=='barracks':
   for x in [17,112]:d.line((x,99,x,48),fill='#796445',width=2);d.polygon([(x,48),(x+12,53),(x,66)],fill='#994838')
  if name=='housing':im=im.resize((96,96),Image.Resampling.NEAREST)
 save(im,name)
for i,col in enumerate(['#9a4c40','#4b7586','#b59a50','#687a48','#825c7c','#a87547','#4e8c7a','#63728b']):
 im=Image.new('RGBA',(24,40));d=ImageDraw.Draw(im);d.ellipse((3,32,21,38),fill=(0,0,0,65));d.rectangle((8,27,11,35),fill='#303b38');d.rectangle((14,27,17,35),fill='#303b38');d.polygon([(7,15),(17,15),(21,29),(4,29)],fill=col);d.line((12,17,12,28),fill='#d2b883',width=2);d.rectangle((8,7,17,16),fill='#cfac79');d.rectangle((7,5,18,9),fill='#263b39');d.rectangle((10,2,15,5),fill='#263b39');d.point((15,12),fill='#303b38');save(im,'hero-'+str(i))
print('Original prototype sprites generated')
