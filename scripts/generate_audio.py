import asyncio
import edge_tts
import json
import os
import glob

VOICES = {
    'en': 'en-GB-SoniaNeural',
    'de': 'de-DE-KatjaNeural',
    'es': 'es-ES-ElviraNeural',
    'it': 'it-IT-ElsaNeural',
}

DATA_DIR = '../src/data'
OUT_DIR  = '../public/audio'

async def generate(text, voice, path):
    if os.path.exists(path):
        return
    try:
        tts = edge_tts.Communicate(text, voice=voice)
        await tts.save(path)
        print(f'✅ {path}')
    except Exception as e:
        print(f'❌ {path} — {e}')

async def main():
    files = glob.glob(f'{DATA_DIR}/*-a1.json')
    tasks = []

    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        translations = data.get('translations', {})
        for lang, info in translations.items():
            if lang not in VOICES:
                continue
            voice = VOICES[lang]
            out_dir = f'{OUT_DIR}/{lang}'
            os.makedirs(out_dir, exist_ok=True)

            for word in info.get('words', []):
                text = word.get('word', '')
                word_id = word.get('id', text)
                if not text:
                    continue
                path = f'{out_dir}/{word_id}.mp3'
                tasks.append(generate(text, voice, path))

    print(f'Toplam {len(tasks)} ses dosyası üretilecek...')

    # 10'arlı gruplar halinde çalıştır
    for i in range(0, len(tasks), 10):
        await asyncio.gather(*tasks[i:i+10])

    print('🎉 Tamamlandı!')

if __name__ == '__main__':
    asyncio.run(main())