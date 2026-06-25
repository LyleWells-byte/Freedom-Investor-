from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, json
# args: outfile, json facts
out=sys.argv[1]
facts=json.loads(sys.argv[2])
W,H=1080,1920
img=Image.new("RGBA",(W,H),(0,0,0,0))
d=ImageDraw.Draw(img)
def F(sz,bold=True):
    p="/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf"%("-Bold" if bold else "")
    return ImageFont.truetype(p,sz)
# bottom scrim gradient
scrim=Image.new("RGBA",(W,420),(0,0,0,0))
sd=ImageDraw.Draw(scrim)
for i in range(420):
    a=int(200*(i/420)**1.3)
    sd.line([(0,i),(W,i)],fill=(8,10,14,a))
img.alpha_composite(scrim,(0,H-420))
gold=(212,175,110,255); white=(255,255,255,255); soft=(225,228,235,255)
x0=70; base=H-300
price=facts.get("price")
if price:
    d.text((x0,base),price,font=F(86),fill=white)
    base+=110
else:
    d.text((x0,base),"FOR SALE",font=F(54),fill=gold)
    base+=78
# gold rule
d.rectangle([x0,base,x0+170,base+5],fill=gold); base+=26
# address
d.text((x0,base),facts["addr1"],font=F(50),fill=white); base+=64
d.text((x0,base),facts["addr2"],font=F(38,bold=False),fill=soft); base+=58
# stats line
stats=facts.get("stats")
if stats:
    d.text((x0,base),stats,font=F(40),fill=gold)
img.save(out)
print("wrote",out)
