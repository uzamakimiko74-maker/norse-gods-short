"""Top 5 Strongest Hindu Gods: score, foley and the user's narration → out/mix.wav (48 kHz stereo).
Everything but the voice is synthesised here (no sample libraries). Reads events.json from the page."""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, f'{LIB}/core/audio')
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, crash, whoosh, rumble, compress, limit, add

HERE = os.path.dirname(os.path.abspath(__file__))
EVJ = json.load(open(f'{HERE}/events.json')); DUR = EVJ['dur']; EV = EVJ['ev']
N = int(DUR * SR) + SR
rng = np.random.default_rng(11)

# ---- voice: the user's recording, unchanged apart from compression
wav = f'{HERE}/out/voice.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{HERE}/take1.mp3', '-ar', str(SR), '-ac', '1', wav], check=True)
v, _ = sf.read(wav, dtype='float32')
v = compress(norm(v, .9), thr=.3, ratio=3)
VO = np.zeros((N, 2)); add(VO, v, 0.0, 1.0)

# ---- instruments
def modal(f, parts=((1, 1), (2.76, .5), (5.4, .3), (8.93, .15)), d=3.0, tau=1.2, v=1.0):
    tt = t_(d); x = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (tau / (1 + .6 * r))) for r, a in parts)
    return norm(x + bp(noise(d), f * 2, min(f * 8, 20000)) * env_exp(d, .01) * .4) * v
def tamtam(v=1.0, d=6.0):
    tt = t_(d); fs = [62, 97, 141, 188, 233, 301, 379, 455]
    x = sum(np.sin(2 * np.pi * f * tt + rng.random() * 6) * np.exp(-tt / (2.5 - i * .2)) for i, f in enumerate(fs))
    swell = bp(noise(d), 300, 3000) * np.minimum(1, tt / .8) * np.exp(-tt / 2.2)
    return norm(x * .6 + swell * .5) * v
def drum(f=95, v=1.0, d=.6):                       # frame drum / log drum
    tt = t_(d); x = np.sin(2 * np.pi * f * tt * (1 + .4 * np.exp(-tt / .02))) * np.exp(-tt / .14)
    return norm(x + bp(noise(d), 800, 4000) * env_exp(d, .008) * .35) * v
def timp(f=55, v=1.0, d=2.2):
    tt = t_(d); x = sum(a * np.sin(2 * np.pi * f * r * tt) for r, a in ((1, 1), (1.5, .5), (1.99, .35), (2.44, .2))) * np.exp(-tt / .7)
    return norm(x + lp(noise(d), 400) * env_exp(d, .03) * .5) * v
def pizz(f, v=1.0, d=.8):
    tt = t_(d); x = sum(np.sin(2 * np.pi * f * k * tt) / k ** 1.3 for k in range(1, 7)) * np.exp(-tt / .22)
    return norm(lp(x, 1800)) * v
def drone(f, d, v=1.0):                           # bowed low string: saw-ish with slow vibrato, filtered
    tt = t_(d); vib = 1 + .004 * np.sin(2 * np.pi * 4.8 * tt)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    x = lp(x, 900) * (1 + .15 * np.sin(2 * np.pi * .23 * tt))
    e = np.minimum(1, tt / 1.2) * np.minimum(1, (d - tt) / 1.0)
    return norm(x) * e * v

MUS = np.zeros((N, 2))
D2, A2, E3, D3 = 73.42, 110.0, 164.81, 146.83
def bed(t0, t1, fs, v):
    for i, f in enumerate(fs): add(MUS, drone(f, t1 - t0, v), t0, 1, (-.3, .3, 0, .15)[i % 4])
bed(0, 58.15, [D2, D3], .22)
bed(44.23, 58.15, [A2, E3], .16)                   # opens out a fifth for Vishnu
bed(58.81, DUR, [D2, D3, A2], .24)
add(MUS, tamtam(.5), 3.6)                          # into the title pull
BEAT = 60 / 96
def grid(t0, t1, every, fn, start=0):
    k = start
    while t0 + k * BEAT * every < t1: yield k, t0 + k * BEAT * every; k += 1
for k, t in grid(7.7, 17.43, 2, None): add(MUS, drum(95, .55), t, 1, -.25)
for k, t in grid(7.7, 14.4, 1, None):
    add(MUS, pizz([D2, D2, A2 / 2 * 2, D2][k % 4], .35), t, 1, .2)
for i in range(16): add(MUS, timp(55, .15 + i * .03, 1.0), 13.6 + i * .055)     # roll into the lift
add(MUS, timp(55, .9), 14.44)
for k, t in grid(19.9, 24.6, 1, None): add(MUS, drum([180, 240, 180, 135][k % 4], .4, .35), t, 1, (-.4, .4)[k % 2])
for k, t in grid(25.08, 29.59, 1, None): add(MUS, drum([180, 240][k % 2], .35, .35), t, 1, .3)
add(MUS, modal(220, v=.6, d=4), 25.08, 1, .2); add(MUS, timp(49, 1.0), 25.08)
for k, t in grid(32.2, 44.2, 4, None): add(MUS, thump(.7, 50), t)        # gran cassa every bar
for i in range(10): add(MUS, modal(330 * 2 ** (i / 12 * 1.0), v=.45, d=2.0, tau=.8), 40.14 + i * .27, 1, (-.6 + i * .13))
add(MUS, timp(49, 1.0), 43.39); add(MUS, tamtam(.4), 43.39)
for t in (52.63, 54.2, 55.78): add(MUS, timp(46, .8), t)
add(MUS, tamtam(.9, 7), 58.81)                     # the first sound after the silence
for i in range(22):                                # damaru-like rolls accelerating into the third eye
    t = 59.4 + 2.7 * (1 - (1 - i / 22) ** 1.8); add(MUS, drum(160, .25 + i * .02, .3), t, 1, (-.3, .3)[i % 2])
add(MUS, timp(46, 1.0), 62.11); add(MUS, modal(146.8, v=.7, d=5, tau=2), 62.11)
for k, t in grid(66.71, 70.45, 1, None): add(MUS, drum([120, 160, 120, 200][k % 4], .4, .35), t, 1, (-.3, .3)[k % 2])
add(MUS, drum(95, .7, .9), 77.2)

# ---- foley from the page's events
FOL = np.zeros((N, 2))
def carve(d):
    x = np.zeros(int(d * SR)); k = 0
    while k < len(x) - 2400:
        L = int(rng.uniform(.05, .18) * SR); g = bp(noise(L / SR), 1800, 7000) * np.hanning(L) * rng.uniform(.4, 1)
        x[k:k + L] += g[:len(x) - k]; k += L + int(rng.uniform(.0, .05) * SR)
    return norm(x) * .5
def paper(d=.7):
    tt = t_(d); return norm(hp(noise(d), 1500) * (np.sin(np.pi * tt / d) ** 2) * (1 + .6 * (rng.random(len(tt)) > .97))) * .5
def water(d, v=1):
    tt = t_(d); x = bp(noise(d), 300, 2500) * (1 + .4 * np.sin(2 * np.pi * 3 * tt)); return norm(x) * np.minimum(1, tt / .3) * np.minimum(1, (d - tt) / .4) * v * .45
def fire(d, v=1):
    tt = t_(d); x = lp(brown(d), 600) * .6 + hp(noise(d), 2500) * (rng.random(len(tt)) > .993) * 4
    return norm(x) * np.minimum(1, tt / .4) * np.minimum(1, (d - tt) / .5) * v * .5
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'carve': add(FOL, carve(e['d']), t, .55, .25)
    elif ty == 'peel': add(FOL, paper(.75), t, .7, -.2)
    elif ty == 'impression': add(FOL, thump(.35, 110), t, .5); add(FOL, paper(.25), t, .25, .15)
    elif ty == 'rumble': add(FOL, rumble(e['d'], 1), t, .9)
    elif ty == 'water': add(FOL, water(e['d'], e.get('v', 1)), t, .7, .1)
    elif ty == 'thunder': add(FOL, crash(1), t, .9, .35); add(FOL, rumble(2.5, 1), t, .8)
    elif ty == 'swell': d = e['d']; tt = t_(d); add(FOL, norm(bp(noise(d), 400, 3000)) * (tt / d) ** 2 * .4, t, .6)
    elif ty == 'ring': add(FOL, modal(880 + 60 * e['i'], v=.3, d=1.2, tau=.4), t, .5, -.5 + e['i'] * .11)
    elif ty == 'growl': d = 1.6; tt = t_(d); add(FOL, norm(lp(brown(d), 250)) * np.sin(np.pi * tt / d) * (1 + .5 * np.sin(2 * np.pi * 18 * tt)) * .6, t, .7, -.4)
    elif ty == 'fall': add(FOL, thump(1, 60), t, 1); add(FOL, crash(.5), t + .05, .4)
    elif ty == 'stride': add(FOL, thump(1, 45), t, 1); add(FOL, rumble(1.2, .6), t, .5)
    elif ty == 'eye': add(FOL, carve(.35), t, .9); add(FOL, whoosh(.5, 1), t + .2, .6)
    elif ty == 'fire': add(FOL, fire(e['d'], e.get('v', 1)), t, .7)
    elif ty == 'sheet': add(FOL, paper(.35), t, .5, -.4 + e['t'] % 1)
AMB = np.zeros((N, 2)); add(AMB, norm(lp(brown(DUR), 300)) * .05, 0)    # room tone

# ---- mix: music −8 dB and foley −4 dB under the voice
env = np.abs(VO[:, 0]); from scipy.ndimage import uniform_filter1d
env = uniform_filter1d(env, int(.12 * SR)); vk = np.clip(env / (env.max() * .25), 0, 1)
vk = uniform_filter1d(vk, int(.25 * SR))
gm = 10 ** (-8 * vk / 20)[:, None]; gf = 10 ** (-4 * vk / 20)[:, None]
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)
MUS *= (rms(VO) / rms(MUS)) * 10 ** (-10 / 20)      # voice ~10 dB above the music
mix = VO + MUS * gm + FOL * gf * .5 + AMB
s0, s1 = int(58.15 * SR), int(58.81 * SR); mix[s0:s1] = 0    # true digital silence before Shiva
fade = int(.03 * SR); mix[s0 - fade:s0] *= np.linspace(1, 0, fade)[:, None]
mix = mix[:int(DUR * SR)]
mix = np.stack([limit(mix[:, 0] / np.abs(mix).max() * .9), limit(mix[:, 1] / np.abs(mix).max() * .9)], 1)
sf.write(f'{HERE}/out/mix.wav', mix.astype(np.float32), SR, subtype='PCM_24')
print('mix', mix.shape[0] / SR, 's')
