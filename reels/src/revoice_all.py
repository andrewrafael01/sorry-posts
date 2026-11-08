"""Re-voice every what-if reel to the approved format: 'Holy shit. What if <premise>?' + one-to-three-word labels. Beat lengths are kept (MIN_DURS) so each scene's timing still works."""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
S = "/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/t3"
R = {
 "591_whatif_everyone_shits_v4": ("every human took a shit at the same time", ["Eight billion people.", "One million tonnes.", "Twenty nine centimeters.", "Flies.", "Every bush.", "Not me."]),
 "593_whatif_jerk_doubling_v4": ("you jerked off twice as fast every time", ["One per second.", "Eight.", "Sixty four.", "Twelve hundred.", "Fire.", "A billion.", "Still going."]),
 "603_whatif_fart_rocket_v3": ("every fart was twice as strong as the last", ["Fart one.", "Fart six.", "Fart ten.", "Fart seventeen.", "Fart twenty.", "Fart twenty five.", "Orbit."]),
 "604_whatif_everyone_pees_ocean_v3": ("every human peed in the ocean at the same time", ["Eleven billion liters.", "Forty six hundred pools.", "Zero point zero zero zero three millimeters.", "Warm.", "Hot tub.", "Yellow."]),
 "605_whatif_aura_doubles_v3": ("your aura doubled every minute", ["Minute one.", "Minute four.", "Minute eight.", "Minute twelve.", "Minute sixteen.", "Minute twenty.", "Minute twenty four."]),
 "606_whatif_farts_visible_v3": ("every fart was visible", ["Hot pink.", "Purple.", "Green.", "Brown.", "Regret.", "Grandma."]),
 "607_whatif_shit_when_name_said_v3": ("you had to shit every time someone said your name", ["Dave.", "Dave again.", "Dave Chappelle.", "Three million Daves.", "Dave day.", "Chad."]),
 "608_nonut_november_royale_v3": ("a hundred guys entered No Nut November", ["Day one.", "Day four.", "Day fifteen.", "Day twenty two.", "Day twenty nine.", "Day thirty.", "December first."]),
 "609_whatif_egypt_one_phone_v3": ("the Ancient Egyptians had one phone", ["Dropped.", "Pharaoh.", "Three workers.", "The overseer.", "Four thousand.", "Everyone.", "Zero percent."]),
 "610_whatif_rizz_doubles_v3": ("your rizz doubled every hour", ["Hour one.", "Hour four.", "Hour eight.", "Hour twelve.", "Hour sixteen.", "Hour twenty.", "Hour twenty four."]),
 "611_whatif_cringe_doubles_v3": ("your cringe doubled every minute", ["Minute one.", "Minute four.", "Minute eight.", "Minute twelve.", "Minute sixteen.", "Minute twenty.", "Minute twenty four."]),
 "612_whatif_drake_president_v3": ("Drake became president", ["Denied.", "Fourteen pages.", "Approved.", "Coffee shop.", "Five thirty five crying.", "Owl.", "Canada."]),
 "613_whatif_balls_double_daily_v3": ("your balls doubled in size every day", ["Day one.", "Day three.", "Day seven.", "Day ten.", "Day fourteen.", "Day twenty.", "Day thirty."]),
 "614_whatif_goon_town_sign_v3": ("there was a town with a sign that counted how many times you gooned", ["Fourteen.", "Four hundred.", "Zero.", "Error.", "Statues.", "Eight.", "Ohio."]),
 "615_whatif_scroll_loses_iq_v3": ("every scroll cost you one IQ point", ["One twenty.", "Ninety.", "Seventy.", "Forty.", "Ten.", "Zero.", "Grass."]),
 "616_whatif_everyone_npc_v3": ("everyone in your town was an NPC", ["Monday.", "Tuesday.", "Wednesday.", "Thursday.", "Friday.", "Saturday.", "Run."]),
 "617_whatif_bro_ages_teacher_v3": ("every time you said bro, your teacher aged a year", ["Thirty one.", "Forty five.", "Seventy.", "A hundred.", "A hundred and forty.", "Dust.", "Detention."]),
 "618_whatif_drake_substitute_v3": ("Drake became your substitute teacher", ["Attendance.", "Homework.", "Pop quiz.", "Detention.", "Principal.", "Dylan."]),
 "619_whatif_ramsay_lunch_lady_v3": ("Gordon Ramsay became your school lunch lady", ["Raw.", "Ketchup.", "Nuggets.", "Kitchen.", "Inspector.", "Risotto."]),
 "620_whatif_shrek_mayor_ohio_v3": ("Shrek became the mayor of Ohio", ["Onions.", "Swamp.", "Donkey.", "Election.", "Welcome.", "Parking."]),
 "621_whatif_spiderman_rent_webs_v3": ("Spider-Man paid his rent in webs", ["January.", "March.", "May.", "July.", "September.", "December."]),
 "622_whatif_drake_crossing_guard_v3": ("Drake became your school crossing guard", ["Sorry.", "Minivan.", "One kid.", "The cop.", "Twenty thirty one.", "Still sorry."]),
 "623_whatif_drake_jury_duty_v3": ("Drake got called for jury duty", ["Eleven minutes.", "Photo.", "Todd.", "Confession.", "Draw.", "Separate case."]),
 "624_whatif_drake_delivery_driver_v3": ("Drake became your delivery driver", ["Doorbell.", "Toothbrush.", "Wrong house.", "Owl.", "Fired.", "Karen."]),
 "625_whatif_2am_thoughts_loudspeaker_v3": ("your two AM thoughts played on a loudspeaker", ["Two oh three.", "Two seventeen.", "Two forty one.", "Three twelve.", "Three fifty eight.", "Morning."]),
 "626_whatif_dating_bios_come_true_v3": ("every dating app bio came true", ["Chad.", "Jessica.", "Dave.", "Brad.", "Kyle.", "Drama."]),
 "627_whatif_announce_crush_morning_v3": ("you had to announce your crush on the morning announcements", ["Monday.", "Tuesday.", "Wednesday.", "Thursday.", "Friday.", "Yearbook."]),
 "629_whatif_burp_doubles_v3": ("every burp was twice as loud as the last", ["Burp one.", "Burp five.", "Burp nine.", "Burp thirteen.", "Burp seventeen.", "Burp twenty one.", "Burp twenty five."]),
 "630_whatif_toe_stub_scream_v3": ("every toe stub screamed twice as loud", ["Stub one.", "Stub three.", "Stub six.", "Stub ten.", "Stub fourteen.", "Stub eighteen.", "Stub twenty."]),
 "631_whatif_butt_horizontal_v3": ("your butt cheeks were horizontal", ["Load capacity.", "Fourteen kilograms.", "Ninety kilograms.", "Four hundred kilograms."]),
 "632_whatif_knees_backwards_v3": ("your knees bent backwards", ["Walking.", "Stairs.", "Soccer.", "Running."]),
 "633_whatif_eyes_on_hands_v3": ("your eyes were on your hands", ["Waving.", "Clapping.", "High five.", "Nose."]),
 "637_whatif_stroke_beard_fast_v3": ("every time you stroked your beard, you went twice as fast", ["Stroke one.", "Stroke four.", "Stroke eight.", "Stroke twelve.", "Stroke sixteen."]),
 "638_whatif_pet_cat_fast_v3": ("every time you pet a cat, you went twice as fast", ["Pet one.", "Pet four.", "Pet eight.", "Pet twelve.", "Pet sixteen."]),
 "639_whatif_pet_goat_fast_v3": ("every time you stroked a goat, you went twice as fast", ["Stroke one.", "Stroke four.", "Stroke eight.", "Stroke twelve.", "Stroke sixteen."]),
}
def run(item):
    k, (prem, labels) = item
    old = json.load(open(f"{S}/{k}.json")); durs = [b["dur"] for b in old["beats"]]
    if len(durs) != len(labels) + 1: return f"SKIP {k}: beats {len(durs)} vs labels {len(labels)}"
    num = int(k[:3]); narrs = [f"Holy shit. What if {prem}?"] + labels
    out = f"{S}/{k}_hs.tmp"; os.makedirs(out, exist_ok=True)
    env = dict(os.environ, MIN_DURS=json.dumps([round(d, 2) for d in durs]))
    r = subprocess.run(["python3", "tl3d.py", k + "_hs", str(num), "cine", ".35", out] + narrs, env=env, capture_output=True, text=True)
    return f"{k}: {r.stdout.strip()[-30:]} {r.stderr.strip()[-80:]}"
if __name__ == "__main__":
    only = sys.argv[1:]; items = [(k, v) for k, v in R.items() if not only or k[:3] in only]
    with ThreadPoolExecutor(3) as ex:
        for line in ex.map(run, items): print(line, flush=True)
