import json
import os
import glob

SENTENCES = {
  'dog': {
    'de': [
      {'text': 'Ich habe einen Hund.', 'tr': 'Bir köpeğim var.', 'words': ['Ich', 'habe', 'einen', 'Hund']},
      {'text': 'Der Hund ist groß.', 'tr': 'Köpek büyük.', 'words': ['Der', 'Hund', 'ist', 'groß']},
    ],
    'es': [
      {'text': 'Tengo un perro.', 'tr': 'Bir köpeğim var.', 'words': ['Tengo', 'un', 'perro']},
      {'text': 'El perro es grande.', 'tr': 'Köpek büyük.', 'words': ['El', 'perro', 'es', 'grande']},
    ],
  },
  'cat': {
    'de': [
      {'text': 'Die Katze ist klein.', 'tr': 'Kedi küçük.', 'words': ['Die', 'Katze', 'ist', 'klein']},
      {'text': 'Ich liebe meine Katze.', 'tr': 'Kedimi seviyorum.', 'words': ['Ich', 'liebe', 'meine', 'Katze']},
    ],
    'es': [
      {'text': 'El gato es pequeño.', 'tr': 'Kedi küçük.', 'words': ['El', 'gato', 'es', 'pequeño']},
      {'text': 'Amo a mi gato.', 'tr': 'Kedimi seviyorum.', 'words': ['Amo', 'a', 'mi', 'gato']},
    ],
  },
  'fish': {
    'de': [
      {'text': 'Der Fisch ist im Wasser.', 'tr': 'Balık suda.', 'words': ['Der', 'Fisch', 'ist', 'im', 'Wasser']},
      {'text': 'Ich habe einen Fisch.', 'tr': 'Bir balığım var.', 'words': ['Ich', 'habe', 'einen', 'Fisch']},
    ],
    'es': [
      {'text': 'El pez está en el agua.', 'tr': 'Balık suda.', 'words': ['El', 'pez', 'está', 'en', 'el', 'agua']},
      {'text': 'Tengo un pez.', 'tr': 'Bir balığım var.', 'words': ['Tengo', 'un', 'pez']},
    ],
  },
  'bird': {
    'de': [
      {'text': 'Der Vogel kann fliegen.', 'tr': 'Kuş uçabilir.', 'words': ['Der', 'Vogel', 'kann', 'fliegen']},
      {'text': 'Ich sehe einen Vogel.', 'tr': 'Bir kuş görüyorum.', 'words': ['Ich', 'sehe', 'einen', 'Vogel']},
    ],
    'es': [
      {'text': 'El pájaro puede volar.', 'tr': 'Kuş uçabilir.', 'words': ['El', 'pájaro', 'puede', 'volar']},
      {'text': 'Veo un pájaro.', 'tr': 'Bir kuş görüyorum.', 'words': ['Veo', 'un', 'pájaro']},
    ],
  },
  'rabbit': {
    'de': [
      {'text': 'Der Hase ist weiß.', 'tr': 'Tavşan beyaz.', 'words': ['Der', 'Hase', 'ist', 'weiß']},
      {'text': 'Ich habe einen Hasen.', 'tr': 'Bir tavşanım var.', 'words': ['Ich', 'habe', 'einen', 'Hasen']},
    ],
    'es': [
      {'text': 'El conejo es blanco.', 'tr': 'Tavşan beyaz.', 'words': ['El', 'conejo', 'es', 'blanco']},
      {'text': 'Tengo un conejo.', 'tr': 'Bir tavşanım var.', 'words': ['Tengo', 'un', 'conejo']},
    ],
  },
  'lion': {
    'de': [
      {'text': 'Der Löwe ist stark.', 'tr': 'Aslan güçlü.', 'words': ['Der', 'Löwe', 'ist', 'stark']},
      {'text': 'Ich sehe einen Löwen.', 'tr': 'Bir aslan görüyorum.', 'words': ['Ich', 'sehe', 'einen', 'Löwen']},
    ],
    'es': [
      {'text': 'El león es fuerte.', 'tr': 'Aslan güçlü.', 'words': ['El', 'león', 'es', 'fuerte']},
      {'text': 'Veo un león.', 'tr': 'Bir aslan görüyorum.', 'words': ['Veo', 'un', 'león']},
    ],
  },
  'elephant': {
    'de': [
      {'text': 'Der Elefant ist groß.', 'tr': 'Fil büyük.', 'words': ['Der', 'Elefant', 'ist', 'groß']},
      {'text': 'Ich liebe Elefanten.', 'tr': 'Filleri seviyorum.', 'words': ['Ich', 'liebe', 'Elefanten']},
    ],
    'es': [
      {'text': 'El elefante es grande.', 'tr': 'Fil büyük.', 'words': ['El', 'elefante', 'es', 'grande']},
      {'text': 'Me encantan los elefantes.', 'tr': 'Filleri seviyorum.', 'words': ['Me', 'encantan', 'los', 'elefantes']},
    ],
  },
  'red': {
    'de': [
      {'text': 'Der Apfel ist rot.', 'tr': 'Elma kırmızı.', 'words': ['Der', 'Apfel', 'ist', 'rot']},
      {'text': 'Ich mag Rot.', 'tr': 'Kırmızıyı severim.', 'words': ['Ich', 'mag', 'Rot']},
    ],
    'es': [
      {'text': 'La manzana es roja.', 'tr': 'Elma kırmızı.', 'words': ['La', 'manzana', 'es', 'roja']},
      {'text': 'Me gusta el rojo.', 'tr': 'Kırmızıyı severim.', 'words': ['Me', 'gusta', 'el', 'rojo']},
    ],
  },
  'blue': {
    'de': [
      {'text': 'Der Himmel ist blau.', 'tr': 'Gökyüzü mavi.', 'words': ['Der', 'Himmel', 'ist', 'blau']},
      {'text': 'Ich mag Blau.', 'tr': 'Maviyi severim.', 'words': ['Ich', 'mag', 'Blau']},
    ],
    'es': [
      {'text': 'El cielo es azul.', 'tr': 'Gökyüzü mavi.', 'words': ['El', 'cielo', 'es', 'azul']},
      {'text': 'Me gusta el azul.', 'tr': 'Maviyi severim.', 'words': ['Me', 'gusta', 'el', 'azul']},
    ],
  },
  'green': {
    'de': [
      {'text': 'Der Baum ist grün.', 'tr': 'Ağaç yeşil.', 'words': ['Der', 'Baum', 'ist', 'grün']},
      {'text': 'Ich mag Grün.', 'tr': 'Yeşili severim.', 'words': ['Ich', 'mag', 'Grün']},
    ],
    'es': [
      {'text': 'El árbol es verde.', 'tr': 'Ağaç yeşil.', 'words': ['El', 'árbol', 'es', 'verde']},
      {'text': 'Me gusta el verde.', 'tr': 'Yeşili severim.', 'words': ['Me', 'gusta', 'el', 'verde']},
    ],
  },
  'apple': {
    'de': [
      {'text': 'Der Apfel ist rot.', 'tr': 'Elma kırmızı.', 'words': ['Der', 'Apfel', 'ist', 'rot']},
      {'text': 'Ich esse einen Apfel.', 'tr': 'Bir elma yiyorum.', 'words': ['Ich', 'esse', 'einen', 'Apfel']},
    ],
    'es': [
      {'text': 'La manzana es roja.', 'tr': 'Elma kırmızı.', 'words': ['La', 'manzana', 'es', 'roja']},
      {'text': 'Como una manzana.', 'tr': 'Bir elma yiyorum.', 'words': ['Como', 'una', 'manzana']},
    ],
  },
  'mother': {
    'de': [
      {'text': 'Meine Mutter ist nett.', 'tr': 'Annem nazik.', 'words': ['Meine', 'Mutter', 'ist', 'nett']},
      {'text': 'Ich liebe meine Mutter.', 'tr': 'Annemi seviyorum.', 'words': ['Ich', 'liebe', 'meine', 'Mutter']},
    ],
    'es': [
      {'text': 'Mi madre es amable.', 'tr': 'Annem nazik.', 'words': ['Mi', 'madre', 'es', 'amable']},
      {'text': 'Amo a mi madre.', 'tr': 'Annemi seviyorum.', 'words': ['Amo', 'a', 'mi', 'madre']},
    ],
  },
  'father': {
    'de': [
      {'text': 'Mein Vater ist stark.', 'tr': 'Babam güçlü.', 'words': ['Mein', 'Vater', 'ist', 'stark']},
      {'text': 'Ich liebe meinen Vater.', 'tr': 'Babamı seviyorum.', 'words': ['Ich', 'liebe', 'meinen', 'Vater']},
    ],
    'es': [
      {'text': 'Mi padre es fuerte.', 'tr': 'Babam güçlü.', 'words': ['Mi', 'padre', 'es', 'fuerte']},
      {'text': 'Amo a mi padre.', 'tr': 'Babamı seviyorum.', 'words': ['Amo', 'a', 'mi', 'padre']},
    ],
  },
  'school': {
    'de': [
      {'text': 'Ich gehe zur Schule.', 'tr': 'Okula gidiyorum.', 'words': ['Ich', 'gehe', 'zur', 'Schule']},
      {'text': 'Die Schule macht Spaß.', 'tr': 'Okul eğlenceli.', 'words': ['Die', 'Schule', 'macht', 'Spaß']},
    ],
    'es': [
      {'text': 'Voy a la escuela.', 'tr': 'Okula gidiyorum.', 'words': ['Voy', 'a', 'la', 'escuela']},
      {'text': 'La escuela es divertida.', 'tr': 'Okul eğlenceli.', 'words': ['La', 'escuela', 'es', 'divertida']},
    ],
  },
  'book': {
    'de': [
      {'text': 'Ich lese ein Buch.', 'tr': 'Bir kitap okuyorum.', 'words': ['Ich', 'lese', 'ein', 'Buch']},
      {'text': 'Das Buch ist groß.', 'tr': 'Kitap büyük.', 'words': ['Das', 'Buch', 'ist', 'groß']},
    ],
    'es': [
      {'text': 'Leo un libro.', 'tr': 'Bir kitap okuyorum.', 'words': ['Leo', 'un', 'libro']},
      {'text': 'El libro es grande.', 'tr': 'Kitap büyük.', 'words': ['El', 'libro', 'es', 'grande']},
    ],
  },
  'water': {
    'de': [
      {'text': 'Ich trinke Wasser.', 'tr': 'Su içiyorum.', 'words': ['Ich', 'trinke', 'Wasser']},
      {'text': 'Das Wasser ist sauber.', 'tr': 'Su temiz.', 'words': ['Das', 'Wasser', 'ist', 'sauber']},
    ],
    'es': [
      {'text': 'Bebo agua.', 'tr': 'Su içiyorum.', 'words': ['Bebo', 'agua']},
      {'text': 'El agua está limpia.', 'tr': 'Su temiz.', 'words': ['El', 'agua', 'está', 'limpia']},
    ],
  },
  'milk': {
    'de': [
      {'text': 'Ich trinke Milch.', 'tr': 'Süt içiyorum.', 'words': ['Ich', 'trinke', 'Milch']},
      {'text': 'Die Milch ist weiß.', 'tr': 'Süt beyaz.', 'words': ['Die', 'Milch', 'ist', 'weiß']},
    ],
    'es': [
      {'text': 'Bebo leche.', 'tr': 'Süt içiyorum.', 'words': ['Bebo', 'leche']},
      {'text': 'La leche es blanca.', 'tr': 'Süt beyaz.', 'words': ['La', 'leche', 'es', 'blanca']},
    ],
  },
  'bread': {
    'de': [
      {'text': 'Ich esse Brot.', 'tr': 'Ekmek yiyorum.', 'words': ['Ich', 'esse', 'Brot']},
      {'text': 'Das Brot ist frisch.', 'tr': 'Ekmek taze.', 'words': ['Das', 'Brot', 'ist', 'frisch']},
    ],
    'es': [
      {'text': 'Como pan.', 'tr': 'Ekmek yiyorum.', 'words': ['Como', 'pan']},
      {'text': 'El pan está fresco.', 'tr': 'Ekmek taze.', 'words': ['El', 'pan', 'está', 'fresco']},
    ],
  },
}

DATA_DIR = '../src/data'

def add_sentences():
    files = glob.glob(f'{DATA_DIR}/*-a1.json')
    total_updated = 0

    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        updated = False
        translations = data.get('translations', {})

        for lang in ['de', 'es']:
            if lang not in translations:
                continue
            for word in translations[lang].get('words', []):
                word_id = word.get('id', '').lower()
                if word_id in SENTENCES and lang in SENTENCES[word_id]:
                    # Her zaman güncelle (üzerine yaz)
                    word['sentences'] = SENTENCES[word_id][lang]
                    updated = True
                    total_updated += 1

        if updated:
            with open(file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f'✅ {os.path.basename(file)} güncellendi')

    print(f'\n🎉 Toplam {total_updated} kelimeye DE/ES cümle eklendi!')

if __name__ == '__main__':
    add_sentences()