#!/bin/sh
# Re-run the source checks for the five srcmid findings (downloads already in dl/)
D=$(dirname "$0")
echo "== Hoover: EIA-923 means"; python3 -I $D/hoover_eia.py $D/dl/hoover/eia.json | tail -5
python3 -I -c "
y=[3.682,3.615,3.642,3.965,3.87,3.789,3.65,3.567,3.392,3.541,3.332,3.449,3.51,3.167,2.705,2.943,2.735]
print('long-run 1947-2025 mean (USBR 4.2 x 62 yrs + EIA 2009-2025):', round((4.2*62+sum(y))/79,2),'TWh')"
echo "== Beirut: Pilger sets the 0.5 kt figure aside"; grep -o "we estimate a yield of about 0.5 kt.\{0,330\}" $D/dl/beirut/pilger.txt
grep -o "Yield for AFTAC method.\{0,160\}" $D/dl/beirut/pilger.txt
echo "== Krakatoa: air wave 100-150 Mt only"; grep -n "100-150 megatons" $D/dl/krak/hp1967.txt; grep -n -B1 "200 megatons" $D/dl/krak/choi.txt
echo "== Lobanovsky ref 38"; sed -n 660,662p $D/dl/lob/lob.txt
echo "== arXiv authors"; for id in 1510.07674 1605.09788; do echo $id; grep -o '<meta name="citation_\(title\|doi\)" content="[^"]*"' $D/dl/sun/$id.html; grep -o '<meta name="citation_author" content="[^"]*"' $D/dl/sun/$id.html | head -1; done
