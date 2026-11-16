"""Top 5 Strongest Hindu Gods (cartoon): score, sound effects and the user's narration → out/mix.wav (48 kHz stereo).
Score: tanpura-style drone, synthesised tabla (dayan + bayan) in a teental-like groove at 100 bpm, and sitar phrases
(Karplus-Strong 'shamisen' preset, whose bridge buzz is close to a sitar's jawari). Effects follow the page's events."""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, f'{LIB}/core/audio')
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, crash, whoosh, rumble, ding, pop, compress, limit, add
import pluck as P

HERE = os.path.dirname(os.path.abspath(__file__))
EVJ = json.load(open(f'{HERE}/events.json')); DUR = EVJ['dur']; EV = EVJ['ev']
N = int(DUR * SR) + SR
rng = np.random.default_rng(5)
os.makedirs(f'{HERE}/out', exist_ok=True)

# ---- voice, unchanged apart from compression
wav = f'{HERE}/out/voice.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{HERE}/narration.mp3', '-ar', str(SR), '-ac', '1', wav], check=True)
v, _ = sf.read(wav, dtype='float32'); v = compress(norm(v, .9), thr=.3, ratio=3)
VO = np.zeros((N, 2)); add(VO, v, 0.0, 1.0)

# ---- instruments
def drone(f, d, v=1.0):
    tt = t_(d); ph = 2 * np.pi * f * np.cumsum(1 + .003 * np.sin(2 * np.pi * 4.5 * tt)) / SR
    x = sum(np.sin(k * ph) / k ** 1.2 for k in range(1, 10)); x = lp(x, 1400) * (1 + .2 * np.sin(2 * np.pi * .3 * tt))
    return norm(x) * np.minimum(1, tt / 1.5) * np.minimum(1, (d - tt) / 1.2) * v
def dayan(v=1.0, f=293.7, d=.5):                       # tabla right drum: pitched ring + slap
    tt = t_(d); x = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (.18 / r)) for r, a in ((1, 1), (2, .6), (3, .4), (4, .25), (5, .15)))
    return norm(x + hp(noise(d), 2500) * env_exp(d, .006) * .5) * v
def bayan(v=1.0, d=.6, glide=1.0):                     # tabla left drum: low boom with a rising wrist glide
    tt = t_(d); f = 82 * (1 + .25 * glide * np.minimum(1, tt / .25)); ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(np.sin(ph) * np.exp(-tt / .22) + lp(noise(d), 300) * env_exp(d, .02) * .3) * v
def gong(v=1.0, d=5.0):
    tt = t_(d); fs = [74, 113, 157, 201, 266, 333, 418]
    return norm(sum(np.sin(2 * np.pi * f * tt + i) * np.exp(-tt / (2.2 - i * .2)) for i, f in enumerate(fs)) + bp(noise(d), 300, 2500) * np.exp(-tt / 1.2) * .3) * v
def bell(f, v=1.0, d=2.0):
    tt = t_(d); return norm(sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (1.2 / r)) for r, a in ((1, 1), (2.4, .5), (3.9, .3), (5.4, .15)))) * v
def conch(d=1.6, v=1.0):                               # shankha: a reedy horn with a slow swell
    tt = t_(d); f = 233 * (1 + .01 * np.sin(2 * np.pi * 5 * tt)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 8)); return norm(lp(x, 1600)) * np.minimum(1, tt / .35) * np.minimum(1, (d - tt) / .4) * v
def sitar(note, d=1.2, v=.7, bend=None):
    return P.pluck('shamisen', note, d, vel=v, bend=bend)

MUS = np.zeros((N, 2))
BEAT = 60 / 100
# sections: (start, end, energy) — energy 0 = drone only, 1 = light tabla, 2 = full groove
SECS = [(0, 5.6, 1), (5.6, 18.4, 2), (18.4, 30.56, 2), (30.56, 45.2, 2), (45.2, 58.4, 2), (58.96, 70.56, 2), (70.56, DUR, 1)]
for a, b, e in SECS:
    add(MUS, drone(73.42, b - a + .8, .2), a, 1, -.25); add(MUS, drone(110.0, b - a + .8, .13), a, 1, .25)
# teental-like groove: dha dhin dhin dha | dha dhin dhin dha | dha tin tin ta | ta dhin dhin dha  (eighth notes)
BOL = 'dha dhin dhin dha dha dhin dhin dha dha tin tin ta ta dhin dhin dha'.split()
for a, b, e in SECS:
    if e == 0: continue
    k = 0; t = a
    while t < b - .05:
        bol = BOL[k % 16]; acc = 1.0 if k % 4 == 0 else .7
        if e == 1 and k % 2: k += 1; t += BEAT / 2; continue
        if bol in ('dha', 'dhin'): add(MUS, bayan(.55 * acc, glide=1 if bol == 'dhin' else .3), t, 1, -.15)
        add(MUS, dayan((.5 if bol in ('tin', 'ta') else .42) * acc, f=293.7 if bol != 'ta' else 330), t, 1, .2)
        k += 1; t += BEAT / 2
# sitar phrases at each section (D major pentatonic / Bilawal colour), a rising figure into each rank
PHR = [['D4', 'E4', 'F#4', 'A4', 'B4', 'A4'], ['A4', 'B4', 'D5', 'B4', 'A4', 'F#4'], ['D5', 'B4', 'A4', 'F#4', 'E4', 'D4'], ['F#4', 'A4', 'B4', 'D5', 'E5', 'D5']]
for i, (a, b, e) in enumerate(SECS):
    for rep in range(2 if b - a > 8 else 1):
        st = a + .3 + rep * (b - a) / 2
        for j, nt in enumerate(PHR[(i + rep) % 4]):
            add(MUS, sitar(nt, 1.0, .65, bend=[(.0, -1), (.12, 0)] if j == 0 else None), st + j * BEAT / 2, .9, -.35 + .1 * j)
# the final chord of the film
add(MUS, sitar('D4', 3, .8), 77.0, .9, -.2); add(MUS, sitar('A4', 3, .7), 77.05, .9, .2); add(MUS, sitar('D5', 3, .7), 77.1, .9, 0)
s0, s1 = int(58.35 * SR), int(58.96 * SR); MUS[s0:s1] *= np.linspace(1, 0, s1 - s0)[:, None] ** 3   # a breath before #1
MUS[s1:int(59.2 * SR)] *= np.linspace(0, 1, int(59.2 * SR) - s1)[:, None]

# ---- effects from the page's events
FX = np.zeros((N, 2))
def swell(d, lo=300, hi=3000):
    tt = t_(d); return norm(bp(noise(d), lo, hi)) * (tt / d) ** 2
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'whoosh': add(FX, whoosh(.4, 1), t - .12, .3)
    elif ty == 'tick': add(FX, hp(noise(.06), 1800) * env_exp(.06, .01), t, .12)
    elif ty == 'gong': add(MUS, gong(.8), t, .55); add(FX, conch(1.4, .5), t + .05, .35)
    elif ty == 'stamp': add(FX, thump(.6, 120), t, .5); add(FX, hp(noise(.1), 1500) * env_exp(.1, .02), t, .3)
    elif ty == 'pow': add(FX, thump(.8, 90), t, .55); add(FX, crash(.4), t, .25)
    elif ty == 'sparkle': [add(FX, bell(f, .25, 1), t + i * .07, .4, -.3 + i * .2) for i, f in enumerate((1568, 1976, 2349, 3136))]
    elif ty == 'pop': add(FX, pop(.7), t, .4, -.4 + .2 * e.get('i', 2))
    elif ty == 'fly': add(FX, whoosh(.9, 1), t, .6)
    elif ty == 'chime': add(FX, bell(1760, .5, 1.6), t, .45, .3)
    elif ty == 'rumble': add(FX, rumble(2.4, 1), t, .9)
    elif ty == 'hiss': add(FX, norm(bp(noise(1.4), 3000, 9000)) * np.sin(np.pi * t_(1.4) / 1.4), t, .3, .3)
    elif ty == 'gulp': tt = t_(.4); add(FX, np.sin(2 * np.pi * 240 * tt * (1 - tt)) * np.exp(-tt / .12), t, .55)
    elif ty == 'thunderFar': add(FX, rumble(1.8, .6), t, .4)
    elif ty == 'thunder': add(FX, crash(1), t, .8, .3); add(FX, rumble(2.4, 1), t, .8)
    elif ty == 'water': d = 2.0; tt = t_(d); add(FX, norm(bp(noise(d), 300, 2400)) * np.minimum(1, tt / .2) * np.minimum(1, (d - tt) / .5), t, .4)
    elif ty == 'roar': d = 1.6; tt = t_(d); add(FX, norm(lp(brown(d), 300) * (1 + .6 * np.sin(2 * np.pi * 22 * tt))) * np.sin(np.pi * tt / d), t, .75)
    elif ty == 'swell': add(FX, swell(2.4), t, .5)
    elif ty == 'fanfare': [add(FX, conch(1.0, .5), t + i * .18, .3, -.2 + .2 * i) for i in range(3)]; add(FX, bell(587, .6, 2.4), t, .5)
    elif ty == 'ring': add(FX, bell(880 * 2 ** (e['i'] / 12 * 2), .4, 1.2), t, .3, -.6 + .15 * e['i'])
    elif ty == 'lion': d = 1.3; tt = t_(d); add(FX, norm(lp(brown(d), 500) * (1 + .5 * np.sin(2 * np.pi * 30 * tt))) * np.sin(np.pi * tt / d), t, .8, -.3)
    elif ty == 'thud': add(FX, thump(1, 55), t, 1); add(FX, crash(.5), t + .03, .4)
    elif ty == 'rise': add(FX, swell(2.8, 200, 4000), t, .55)
    elif ty == 'stride': add(FX, thump(1, 45), t, 1); add(FX, bell(392, .5, 2.5), t, .4)
    elif ty == 'eye': add(FX, swell(.6, 1500, 8000), t - .55, .5); add(FX, bell(1175, .6, 1.5), t, .45)
    elif ty == 'beam': d = .9; tt = t_(d); add(FX, norm(np.sin(2 * np.pi * 330 * tt + 6 * np.sin(2 * np.pi * 9 * tt))) * np.exp(-tt / .5), t, .3)
    elif ty == 'poof': add(FX, norm(lp(noise(.7), 1800)) * env_exp(.7, .18), t, .7)
    elif ty == 'tamtam': add(MUS, gong(.9, 6), t, .6)
    elif ty == 'damaru': [add(FX, dayan(.45, 440, .2), t + j * .07, .5, (-.3, .3)[j % 2]) for j in range(3)]

# ---- mix: music −8 dB and effects −4 dB under the voice; voice ~10 dB above the music
from scipy.ndimage import uniform_filter1d
env = uniform_filter1d(np.abs(VO[:, 0]), int(.12 * SR)); vk = uniform_filter1d(np.clip(env / (env.max() * .25), 0, 1), int(.25 * SR))
gm = 10 ** (-8 * vk / 20)[:, None]; gf = 10 ** (-4 * vk / 20)[:, None]
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
MUS *= rms(VO) / rms(MUS) * 10 ** (-7 / 20); FX *= rms(VO) / rms(FX) * 10 ** (-12 / 20)
mix = (VO + MUS * gm + FX * gf)[:int(DUR * SR)]
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
pk = np.abs(mix).max(); mix = np.stack([limit(mix[:, 0] / pk * .9), limit(mix[:, 1] / pk * .9)], 1)
sf.write(f'{HERE}/out/mix.wav', mix.astype(np.float32), SR, subtype='PCM_24')
print('mix', round(mix.shape[0] / SR, 2), 's')
