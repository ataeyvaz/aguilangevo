import json, os, sys

cats = [
  'animals','colors','numbers','fruits','vegetables','body','family',
  'school','food','greetings','questions','clothing','home','transport',
  'time','jobs','sports','places','adjectives','verbs'
]

base = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
all_words = {}
for cat in cats:
    path = os.path.join(base, f'{cat}-a1.json')
    with open(path, encoding='utf-8-sig') as f:
        d = json.load(f)
    en = d['translations']['en']['words']
    all_words[cat] = [{'id': w['id'], 'word': w['word'], 'emoji': w.get('emoji',''), 'pron': w.get('pron','')} for w in en]

out_path = os.path.join(os.path.dirname(__file__), '..', '_word_inventory.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_words, f, ensure_ascii=False, indent=2)

total = sum(len(v) for v in all_words.values())
print(f'OK: {len(all_words)} categories, {total} words total')
for cat, words in all_words.items():
    print(f'  {cat} ({len(words)}): {[w["id"] for w in words]}')
