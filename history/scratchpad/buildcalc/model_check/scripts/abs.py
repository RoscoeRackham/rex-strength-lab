import json, sys, re, glob
for f in sorted(sys.argv[1:]):
    d = json.load(open(f))
    rs = d.get("resultList",{}).get("result",[])
    if not rs: print(f, "NO RESULT"); continue
    r = rs[0]
    a = re.sub(r"<[^>]+>","", r.get("abstractText","(no abstract)"))
    print("=== ", f, "|", r.get("title"), "|", r.get("journalInfo",{}).get("journal",{}).get("title"), r.get("pubYear"))
    print(a); print()
