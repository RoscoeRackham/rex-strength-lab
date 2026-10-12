import json
BS='https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf'
TRL='https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf'
LUKAS='https://rosap.ntl.bts.gov/view/dot/68405/dot_68405_DS1.pdf'
GEC1='https://rosap.ntl.bts.gov/view/dot/40768/dot_40768_DS1.pdf'
LAUZON='https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf'
CALT='https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf'
SS='https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf'
COL='https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf'
TRID='https://trid.trb.org/View/1101903'
OCR='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599&rettype=abstract&retmode=text'
EKI='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16938964&rettype=abstract&retmode=text'
ARXEL='https://arxiv.org/pdf/2406.05140'
USGS='https://pubs.usgs.gov/of/1997/0501/report.pdf'
TURK='https://iisee.kenken.go.jp/net/seismic_design_code/turkey/table-turkey3.htm'
KOH='https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0DAA1D118D8BC16DA025F8B300C442EA/S0022143000023467a.pdf/the-temperature-dependence-of-seismic-waves-in-ice.pdf'
YORK='https://northeastfc.uk/Infrastructure/projects/north-east/york-potash-harbour-facilities-order/TR030002-000493-Section%2014%20App%2014.1%20Construction%20vibration%20calculations.pdf'
S=lambda t,u:{'title':t,'url':u}
sBS=S('BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)',BS)
sTRL=S('Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)',TRL)
sLUK=S('Lukas (1986) Dynamic Compaction for Highway Construction, Vol. 1: Design and Construction Guidelines, FHWA/RD-86/133 (USDOT ROSAP scan)',LUKAS)
sGEC=S('Lukas (1995) Geotechnical Engineering Circular No. 1: Dynamic Compaction, FHWA-SA-95-037 (USDOT ROSAP scan)',GEC1)
sLAU=S('Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)',LAUZON)
sCAL=S('Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)',CALT)
sSS=S('Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)',SS)
sCOL=S('Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)',COL)
sTRID=S('Auersch & Said (2010) Attenuation of ground vibrations due to different technical sources, Earthquake Engineering and Engineering Vibration 9(3):337-344 (TRID abstract)',TRID)
sOCR=S("O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant vocalizations and locomotion, J Acoust Soc Am 108(6):3066-72 (PubMed abstract, PMID 11144599, via NCBI E-utilities)",OCR)
sEKI=S('Ekimov & Sabatier (2006) Vibration and sound signatures of human footsteps in buildings, J Acoust Soc Am 120(2):762-8 (PubMed abstract, PMID 16938964, via NCBI E-utilities)',EKI)
sARX=S('Towards Long Range Detection of Elephants Using Seismic Signals; A Geophone-Sensor Interface for Embedded Systems (arXiv:2406.05140, 2024), Section III, citing O\'Connell-Rodwell et al. 2000',ARXEL)
sUSGS=S('USGS Open-File Report 97-501 (NEHRP soil profile types by Vs30)',USGS)
sTURK=S('Turkish seismic code (Ministry of Public Works and Settlement, Specification for Structures to be Built in Disaster Areas), Table 12.1 Soil Groups, as hosted by IISEE/BRI Japan',TURK)
sKOH=S('Kohnen (1974) The temperature dependence of seismic waves in ice, Journal of Glaciology 13(67):144-147',KOH)
F=[]
def add(**k):
    k.setdefault('category','attenuation'); F.append(k)
