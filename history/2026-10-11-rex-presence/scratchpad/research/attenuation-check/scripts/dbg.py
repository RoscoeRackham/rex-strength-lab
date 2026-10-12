import numpy as np
src=open('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/attenuation-check/scripts/pekeris.py').read().split("xs=[")[0]
exec(src)
for ns in (2000,4000):
  for x in (0.5,1.0,1.3):
    print(ns,x,ppv(x,'hann',ns=ns))
