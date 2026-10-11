import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)

# ---------- HTML: density field replaces the plain mass field
R("""        <div class="field">
          <label for="mass">Mass (kg)</label>
          <div class="inline-num"><input id="mass" type="number" min="0.1" step="1" value="180"></div>
          <span class="hint">Changing height rescales mass (same density). Edit mass after.</span>
        </div>""","""        <div class="field">
          <label for="density">Density</label>
          <div class="dens-read"><b id="density-big">1,000 kg/m³</b><span id="density-cmp"></span></div>
          <input type="range" id="density" min="1" max="30" step="0.01" value="3" aria-describedby="density-cmp">
          <div class="chips" id="density-chips" role="group" aria-label="Density presets"></div>
        </div>
        <div class="field">
          <label for="mass">Mass (kg)</label>
          <div class="inline-num"><input id="mass" type="number" min="0" step="any" value="180"></div>
          <span class="hint">Mass and density move together. Changing height keeps his density.</span>
        </div>""")
# ---------- HTML: Ollie panel after the settings panel
R("""            <option value="bolted">Bolted to the planet (comic)</option>
          </select>
        </div>
      </details>
    </aside>""","""            <option value="bolted">Bolted to the planet (comic)</option>
          </select>
        </div>
      </details>

      <details class="setup" id="ollie-setup">
        <summary><span>Ollie</span> <span class="muted" id="ollie-sum" style="font-weight:400;font-size:.85rem"></span></summary>
        <img class="duo-img" src="__DUO_IMG__" alt="Ollie and Rex side by side: Ollie is a plush bull with horns, a nose ring, a leather vest and boots; Rex is a dark scaly kaiju with orange spines in a black tank top.">
        <p class="hint" style="margin-top:8px">Rex’s boyfriend, just as indestructible. He joins the two-player tests. He stands on the same ground with the same muscle setting.</p>
        <div class="field">
          <span class="lbl" id="o-str-lbl">Ollie’s strength</span>
          <div class="seg" role="group" aria-labelledby="o-str-lbl">
            <button type="button" id="o-same" aria-pressed="true">Same as Rex</button>
            <button type="button" id="o-own" aria-pressed="false">His own</button>
          </div>
          <div id="o-dial" class="o-dial" hidden>
            <div class="o-big" id="o-big">Lifts 90.7 t</div>
            <label for="o-strength" style="position:absolute;left:-9999px">Ollie’s strength, log scale</label>
            <input type="range" id="o-strength" min="1" max="34" step="0.01" value="4.96">
            <div class="scale-ends"><span>10 kg</span><span>10³⁴ kg</span></div>
            <label class="check" style="margin-top:4px"><input type="checkbox" id="o-inf"><span>Unlimited (∞)</span></label>
          </div>
        </div>
        <div class="field">
          <label for="o-height">Ollie’s height (m)</label>
          <div class="inline-num"><input id="o-height" type="number" min="0.1" max="500" step="0.1" value="2"></div>
        </div>
        <div class="field">
          <label for="o-density">Ollie’s density</label>
          <div class="dens-read"><b id="o-density-big">1,000 kg/m³</b><span id="o-density-cmp"></span></div>
          <input type="range" id="o-density" min="1" max="30" step="0.01" value="3" aria-describedby="o-density-cmp">
          <div class="chips" id="o-density-chips" role="group" aria-label="Ollie’s density presets"></div>
        </div>
        <div class="field">
          <label for="o-mass">Ollie’s mass (kg)</label>
          <div class="inline-num"><input id="o-mass" type="number" min="0" step="any" value="180"></div>
        </div>
        <div class="field">
          <label for="o-anchor">How Ollie holds his ground</label>
          <select id="o-anchor">
            <option value="friction">Just standing (friction only)</option>
            <option value="braced">Boots dug in (ground shear)</option>
            <option value="bolted">Bolted to the planet (comic)</option>
          </select>
        </div>
      </details>
    </aside>""")
# ---------- HTML: group switch above the tabs
R("""      <div class="tabs" role="tablist" id="tabs" aria-label="Moves"></div>""",
  """      <div class="seg group-seg" role="group" aria-label="Who is in the test">
        <button type="button" id="grp-solo" aria-pressed="true">Rex alone</button>
        <button type="button" id="grp-duo" aria-pressed="false">Rex + Ollie</button>
      </div>
      <div class="tabs" role="tablist" id="tabs" aria-label="Moves"></div>""")
# ---------- CSS
R(""".tabs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }""",
  """.group-seg { margin: 0 0 12px; }
.group-seg button { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; letter-spacing: 0.03em; text-transform: uppercase; padding: 8px; }
.tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.tabs.n4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.dens-read { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; }
.dens-read b { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; line-height: 1.1; }
.dens-read span { font-size: 0.85rem; color: var(--ink-2); }
.dens-read + input[type=range] { margin-top: 4px; }
.duo-img { display: block; width: 100%; max-width: 100%; aspect-ratio: 720 / 470; object-fit: cover; border-radius: 8px; margin-top: 12px; background: var(--surface-2); }
.o-dial { margin-top: 10px; }
.o-big { font-family: var(--font-display); font-weight: 800; font-size: 1.6rem; line-height: 1.1; }
.hint { font-size: 0.85rem; color: var(--ink-3); }""")
open(p,'w').write(s); print('ok')
