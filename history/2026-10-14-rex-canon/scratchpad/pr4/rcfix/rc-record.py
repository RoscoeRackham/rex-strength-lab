# Writes research/reviews/canon-4-round3-recheck.json from the re-check's raw result (pr4/recheck-raw.json), the
# reverts (rc-results.json) and the close-out's test line (line/*.log).
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, '..', 'recheck-raw.json')
OUT = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/canon-4-round3-recheck.json'
L = os.path.join(HERE, 'line')
st = {}
for ln in open(os.path.join(L, 'status.log')):
    m = re.match(r'(\S+) exit (\d+) elapsed (\d+) s', ln)
    if m: st[m.group(1)] = (int(m.group(2)), int(m.group(3)))
assert all(st[k][0] == 0 for k in st), st
def log(n): return open(os.path.join(L, n + '.log'), encoding='utf-8').read()
cal = log('1-calibration'); assert cal.rstrip().endswith('all checks passed'); calN = len(re.findall(r'^ok ', cal, re.M))
pre = re.search(r'(\d+) checks, all checks passed', log('2-presence')).group(1)
sh = log('3-shots'); shOk = len(re.findall(r'^ok ', sh, re.M)); shProb = len(re.findall(r'PROBLEM', sh)); assert shProb == 0
assert re.search(r'^ok   pull request 4: ', sh, re.M)
pw = re.search(r'(\d+)/(\d+) passed', log('4-powers')); assert pw.group(1) == pw.group(2)
ld = re.search(r'(\d+)/(\d+) passed', log('5-ladder')); assert ld.group(1) == ld.group(2)
sw = re.search(r'contexts (\d+) ms \d+ problems (\d+)', log('6-sweep')); assert sw.group(2) == '0'
F = dict(cal=calN, cal_s=st['1-calibration'][1], pre=pre, pre_s=st['2-presence'][1], sh=shOk, sh_s=st['3-shots'][1],
         pw=pw.group(1), pw_s=st['4-powers'][1], ld=ld.group(1), ld_s=st['5-ladder'][1], sw='{:,}'.format(int(sw.group(1))), sw_s=st['6-sweep'][1])
RES = json.load(open(os.path.join(HERE, 'rc-results.json'), encoding='utf-8'))
assert RES['C0-control'] == {'new-r1': [], 'old-r1': [], 'new-r3': [], 'old-r3': []}
assert len(RES['RC1-arm-torn-winner-text']['new-r3']) == 1 and RES['RC1-arm-torn-winner-text']['old-r3'] == []
assert len(RES['RC2-preset-ceiling-those-do']['new-r1']) == 1 and RES['RC2-preset-ceiling-those-do']['old-r1'] == []
raw = json.load(open(RAW, encoding='utf-8'))[0]
LINE = ('calibration.js {cal} checks, all passed ({cal_s} s); presence.js {pre} checks, all passed ({pre_s} s); shots.js {sh} ok lines and 0 problems ({sh_s} s), '
        'with no sideways scroll, page error or broken text at 390 and 1280 px, light and dark (its pull request 4 block, 70 checks, is one of them); '
        'powers.js {pw} of {pw} ({pw_s} s); ladder.js {ld} of {ld} ({ld_s} s); sweep.js {sw} contexts with no NaN or negative output ({sw_s} s)').format(**F)
OUTC = {
 'fixes-arm-torn-winner-text-unchecked':
  "Fixed as the verdict's better fix. test/shots.js, the round 3 block of pull request 4 (between '---- review round 3 of pull request 4' and the block's end): the check 'review round 3: arm wrestling standing, a bolted wrestler whose rock tears out is held by his feet alone' now also loads Rex bolted on real rock at a 10^7 kg dial against Ollie at 10^6.4 kg ({duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, anchor: 'bolted', logKg: 7}, then ollieKg(6.4) and pick('allout')), and requires the verdict 'he pins Ollie in … ms, dragging him along as he goes. The rock around Rex’s bolts tears out (it takes about 697 kN), and from then on only his feet hold him (17.7 kN), less than Ollie’s press, so Rex’s feet slide too.' with no '∞ N' in it. The chip is not asserted: as the skeptic found, it reads the same with the branch reverted. The label is unchanged, so round 3's record still names it. "
  "Revert (scratchpad pr4/rcfix/revert-rc.py, RC1-arm-torn-winner-text: bayArm's winner branch `(tornOf(sideW) ? capital(tornLine(sideW)) + …` replaced by `(false ? '' : L + '’s press is more than '`, rebuilt in a scratch tree, run through blk3.js on the round 3 block): the extended check fails, and it is the block's only failure; ad1aa9c's version of the check passes on the same tree, as the review found. The reverted page reads '… dragging him along as he goes. Ollie’s press is more than Rex’s feet hold (∞ N), so Rex’s feet slide too.'; the fixed page '… The rock around Rex’s bolts tears out (it takes about 697 kN), and from then on only his feet hold him (17.7 kN), less than Ollie’s press, so Rex’s feet slide too.' (rcfix/probe-rc.log). A control tree with no revert passes the round 1 and round 3 blocks with both versions of the check, and the real tree passes the whole shots.js (below). No page or engine change.",
 'fixes-takeoff-preset-ceiling-unchecked':
  "Fixed as the verdict's better fix. test/shots.js, round 1's check 'review round 1: the paradox is never called harmless, and the canon case isn't two settings that can't both hold' now also requires, on the windows preset view of Collide into a bolted Rex (ep1), 'Courtesy ceiling: none that the lab can judge. … Even all-out, the charge does no harm with the nearest people and buildings 5 m away.', and forbids 'those do' (which also catches 'those don’t') on the all-out and preset views (ep0 and ep1). The round 3 jump check, a case with a take-off where 'those' is right, is unchanged. "
  "Revert (scratchpad pr4/rcfix/revert-rc.py, RC2-preset-ceiling-those-do: the preset view's courtesy-ceiling line in duoEffortBox, `' Even all-out, ' + judgedDo(fCn) + ' no harm`, back to `' Even all-out, those do no harm`, rebuilt in a scratch tree, run through blk3.js on the round 1 block): the extended check fails, and it is the block's only failure; ad1aa9c's version passes on the same tree, as the review found. The reverted page ends '… it judges only the charge (its speed against sound). Even all-out, those do no harm with the nearest people and buildings 5 m away.'; the fixed page '… Even all-out, the charge does no harm with the nearest people and buildings 5 m away.' (rcfix/probe-rc.log). The control tree and the real tree pass. No page or engine change.",
 'fixes-pr-body-takeoff-stale':
  "Fixed in the draft, scratchpad pr4/pr-body.md, which the session lead posts at close-out (this session doesn't edit GitHub). What changed › Collide, the charge now reads '… the effort box says the lab can't judge the hit's harm: it judges only the charge (its speed against sound) and, for a jump or a stomp-launch, the charger's take-off (review rounds 1 and 3: a sprint or a set speed has no take-off), at an unlimited dial too (review round 2).', as README decision 3 and the page say. Found on the way and fixed the same way: the README's review-history line for round 1 said the page 'judges only the charge and its take-off'; it now says '… the charge and, for a jump or a stomp-launch, its take-off; review round 3'. The description's 'How it was tested' gives the full test line after these fixes, and its 'Review rounds' adds this re-check and says the review rounds are complete. No page or engine change, so nothing to revert.",
 'fixes-readme-test-times-stale':
  "Fixed with the verdict's better fix, the figures taken from this close-out's run. README.md, ## Test: calibration.js 'about 2 min' (was 'about 80 s'), powers.js 'about 4 min' (was 'about 3 min'), sweep.js 'about 11 min' (was 'about 9 min'); shots.js's measured time (14 min, now this run's {sh_s} s) and the sentence under the block (about 21 min in all: shots.js 14 min, powers.js 4, calibration.js 2, presence.js 1; sweep.js, run after it, 11 min, added) give this run, one test at a time in the 4-CPU cloud sandbox after the re-check's fixes: calibration.js {cal_s} s, presence.js {pre_s} s, shots.js {sh_s} s, powers.js {pw_s} s, ladder.js {ld_s} s, sweep.js {sw_s} s. Each per-test figure now agrees with the sentence and with the run. A documentation fix: no test reads the README's times, so there is no check to revert.".format(**F),
}
for f in raw['findings']:
    assert f['verdict']['real'] is True
    f['outcome'] = OUTC[f['id']]
rec = {
 'round': '3-recheck',
 'what': ("A focused re-check of review round 3's fixes for pull request 4 of BRIEF-canon.md (contests, and the two Never knocked back switches), reviewed at ad1aa9c. One lens, 'fixes': each round 3 fix reverted on its own in a scratch copy (its hunks of git diff f25f9b4..ad1aa9c, or exact string edits), rebuilt and run against test/powers.js section 8 and the shots.js pull request 4 block; round 3's figures re-derived; the round 3 block's new waits raced (every two-player redraw delayed 800 ms, or every two-player engine call slowed) and diffed against f25f9b4 for dropped or loosened checks (none); the CI figures checked with gh; the README and the pull request's live description read against the page. "
          "What the reviewer verified (verified_ok, kept as written): the build leaves git status clean; the full test line passes at ad1aa9c (calibration 117 checks, 128 s; presence 383, 57 s; shots 84 ok lines, 0 problems, 849 s; powers 181/181, 249 s; ladder 562/562, 1 s; sweep 7,776 contexts, 0 problems, 651 s); `node test/shots.js --pr4` passes in 179 and 176 s; the block keeps all 70 checks with their assertions and no fixed waits remain; the waits hold under both races; the CI run on #34 took 15 min 12 s and the job's timeout is 30 minutes; every round 3 fix fails its named check when reverted, except the parts found here; round 2's surviving mutants each fail an extended check; the README and pull request figures re-derive. "
          "4 findings, each reproduced by a skeptic with its own script; all 4 confirmed (minor) and fixed. Two are checks that missed part of a round 3 fix (the bolted winner's torn-rock verdict in arm wrestling; the preset view's courtesy-ceiling line in Collide's paradox): each was extended with the skeptic's better fix, and in a scratch copy (scratchpad pr4/rcfix/revert-rc.py; results in rc-results.json) each extended check fails with that part of the fix reverted on its own, ad1aa9c's version of it passes there, and a control tree with no revert passes both versions. Two are copy: the pull request's description still named the take-off for a sprint (fixed in the draft body, and the same clause in the README's round 1 history line), and the README's per-test times disagreed with its measured ones (now this run's). No page or engine change in this re-check. "
          "After the fixes, the build (build-data.py and build.js) leaves only the intended files changed, and the full test line, one test at a time in the 4-CPU cloud sandbox, passes: " + LINE + ". The review rounds of pull request 4 are complete."),
 'script': "workflow canon-review, its re-check of round 3 (one lens, fixes; working files in scratchpad review-pr4-r3-recheck/); kept in history at the end of the run. Fixes and their checks: scratchpad pr4/rcfix/ (revert-rc.py and revert-rc.log: the two reverts and a control, each against today's and ad1aa9c's shots.js, through blk3.js on the round 1 and round 3 blocks; probe-page.js and probe-rc.log: the page text at each; line.sh and line/: the close-out's test line; rc-record.py: this record). The review's readme63.py and lists.py are in scratchpad pr4/r3fix/js/.",
 'counts': {'findings': len(raw['findings']), 'confirmed': sum(1 for f in raw['findings'] if f['verdict']['real']), 'refuted': [], 'no_verdict': []},
 'lenses': [{'lens': raw['lens'], 'verified_ok': raw['verified_ok'], 'findings': raw['findings']}],
}
json.dump(rec, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
open(OUT, 'a', encoding='utf-8').write('\n')
print(json.dumps(F)); print('wrote', OUT)
