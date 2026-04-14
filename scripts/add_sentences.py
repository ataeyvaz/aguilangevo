import json
import os
import glob

# Her kelime için örnek cümleler
# Format: { "kelime_id": [ {"en": "...", "tr": "...", "words": [...]} ] }

SENTENCES = {
  # HAYVANLAR
  "dog":      [{"en": "I have a dog.", "tr": "Bir köpeğim var.", "words": ["I", "have", "a", "dog"]},
               {"en": "The dog is big.", "tr": "Köpek büyük.", "words": ["The", "dog", "is", "big"]}],
  "cat":      [{"en": "The cat is small.", "tr": "Kedi küçük.", "words": ["The", "cat", "is", "small"]},
               {"en": "I love my cat.", "tr": "Kedimi seviyorum.", "words": ["I", "love", "my", "cat"]}],
  "bird":     [{"en": "The bird can fly.", "tr": "Kuş uçabilir.", "words": ["The", "bird", "can", "fly"]},
               {"en": "I see a bird.", "tr": "Bir kuş görüyorum.", "words": ["I", "see", "a", "bird"]}],
  "fish":     [{"en": "The fish is in water.", "tr": "Balık suda.", "words": ["The", "fish", "is", "in", "water"]},
               {"en": "I have a fish.", "tr": "Bir balığım var.", "words": ["I", "have", "a", "fish"]}],
  "rabbit":   [{"en": "The rabbit is white.", "tr": "Tavşan beyaz.", "words": ["The", "rabbit", "is", "white"]},
               {"en": "I have a rabbit.", "tr": "Bir tavşanım var.", "words": ["I", "have", "a", "rabbit"]}],
  "lion":     [{"en": "The lion is strong.", "tr": "Aslan güçlü.", "words": ["The", "lion", "is", "strong"]},
               {"en": "I see a lion.", "tr": "Bir aslan görüyorum.", "words": ["I", "see", "a", "lion"]}],
  "elephant": [{"en": "The elephant is big.", "tr": "Fil büyük.", "words": ["The", "elephant", "is", "big"]},
               {"en": "I love elephants.", "tr": "Filleri seviyorum.", "words": ["I", "love", "elephants"]}],
  "horse":    [{"en": "The horse runs fast.", "tr": "At hızlı koşar.", "words": ["The", "horse", "runs", "fast"]},
               {"en": "I ride a horse.", "tr": "Ata biniyorum.", "words": ["I", "ride", "a", "horse"]}],
  "cow":      [{"en": "The cow gives milk.", "tr": "İnek süt verir.", "words": ["The", "cow", "gives", "milk"]},
               {"en": "I see a cow.", "tr": "Bir inek görüyorum.", "words": ["I", "see", "a", "cow"]}],
  "sheep":    [{"en": "The sheep is white.", "tr": "Koyun beyaz.", "words": ["The", "sheep", "is", "white"]},
               {"en": "I see a sheep.", "tr": "Bir koyun görüyorum.", "words": ["I", "see", "a", "sheep"]}],

  # RENKLER
  "red":      [{"en": "The apple is red.", "tr": "Elma kırmızı.", "words": ["The", "apple", "is", "red"]},
               {"en": "I like red.", "tr": "Kırmızıyı severim.", "words": ["I", "like", "red"]}],
  "blue":     [{"en": "The sky is blue.", "tr": "Gökyüzü mavi.", "words": ["The", "sky", "is", "blue"]},
               {"en": "I like blue.", "tr": "Maviyi severim.", "words": ["I", "like", "blue"]}],
  "green":    [{"en": "The tree is green.", "tr": "Ağaç yeşil.", "words": ["The", "tree", "is", "green"]},
               {"en": "I like green.", "tr": "Yeşili severim.", "words": ["I", "like", "green"]}],
  "yellow":   [{"en": "The sun is yellow.", "tr": "Güneş sarı.", "words": ["The", "sun", "is", "yellow"]},
               {"en": "I like yellow.", "tr": "Sarıyı severim.", "words": ["I", "like", "yellow"]}],
  "white":    [{"en": "Snow is white.", "tr": "Kar beyaz.", "words": ["Snow", "is", "white"]},
               {"en": "I like white.", "tr": "Beyazı severim.", "words": ["I", "like", "white"]}],
  "black":    [{"en": "The night is black.", "tr": "Gece siyah.", "words": ["The", "night", "is", "black"]},
               {"en": "I like black.", "tr": "Siyahı severim.", "words": ["I", "like", "black"]}],

  # SAYILAR
  "one":      [{"en": "I have one cat.", "tr": "Bir kedim var.", "words": ["I", "have", "one", "cat"]},
               {"en": "One plus one is two.", "tr": "Bir artı bir iki.", "words": ["One", "plus", "one", "is", "two"]}],
  "two":      [{"en": "I have two dogs.", "tr": "İki köpeğim var.", "words": ["I", "have", "two", "dogs"]},
               {"en": "Two plus two is four.", "tr": "İki artı iki dört.", "words": ["Two", "plus", "two", "is", "four"]}],
  "three":    [{"en": "I have three books.", "tr": "Üç kitabım var.", "words": ["I", "have", "three", "books"]},
               {"en": "Three birds are flying.", "tr": "Üç kuş uçuyor.", "words": ["Three", "birds", "are", "flying"]}],
  "four":     [{"en": "I have four apples.", "tr": "Dört elmam var.", "words": ["I", "have", "four", "apples"]},
               {"en": "Four plus one is five.", "tr": "Dört artı bir beş.", "words": ["Four", "plus", "one", "is", "five"]}],
  "five":     [{"en": "I have five cats.", "tr": "Beş kedim var.", "words": ["I", "have", "five", "cats"]},
               {"en": "Five birds are singing.", "tr": "Beş kuş şarkı söylüyor.", "words": ["Five", "birds", "are", "singing"]}],

  # MEYVELER
  "apple":    [{"en": "The apple is red.", "tr": "Elma kırmızı.", "words": ["The", "apple", "is", "red"]},
               {"en": "I eat an apple.", "tr": "Bir elma yiyorum.", "words": ["I", "eat", "an", "apple"]}],
  "banana":   [{"en": "The banana is yellow.", "tr": "Muz sarı.", "words": ["The", "banana", "is", "yellow"]},
               {"en": "I like bananas.", "tr": "Muzları severim.", "words": ["I", "like", "bananas"]}],
  "orange":   [{"en": "The orange is sweet.", "tr": "Portakal tatlı.", "words": ["The", "orange", "is", "sweet"]},
               {"en": "I drink orange juice.", "tr": "Portakal suyu içiyorum.", "words": ["I", "drink", "orange", "juice"]}],
  "grape":    [{"en": "The grapes are purple.", "tr": "Üzümler mor.", "words": ["The", "grapes", "are", "purple"]},
               {"en": "I eat grapes.", "tr": "Üzüm yiyorum.", "words": ["I", "eat", "grapes"]}],
  "strawberry":[{"en": "The strawberry is red.", "tr": "Çilek kırmızı.", "words": ["The", "strawberry", "is", "red"]},
               {"en": "I love strawberries.", "tr": "Çilekleri seviyorum.", "words": ["I", "love", "strawberries"]}],

  # AİLE
  "mother":   [{"en": "My mother is kind.", "tr": "Annem nazik.", "words": ["My", "mother", "is", "kind"]},
               {"en": "I love my mother.", "tr": "Annemi seviyorum.", "words": ["I", "love", "my", "mother"]}],
  "father":   [{"en": "My father is strong.", "tr": "Babam güçlü.", "words": ["My", "father", "is", "strong"]},
               {"en": "I love my father.", "tr": "Babamı seviyorum.", "words": ["I", "love", "my", "father"]}],
  "sister":   [{"en": "My sister is young.", "tr": "Kız kardeşim genç.", "words": ["My", "sister", "is", "young"]},
               {"en": "I have a sister.", "tr": "Bir kız kardeşim var.", "words": ["I", "have", "a", "sister"]}],
  "brother":  [{"en": "My brother is tall.", "tr": "Erkek kardeşim uzun.", "words": ["My", "brother", "is", "tall"]},
               {"en": "I have a brother.", "tr": "Bir erkek kardeşim var.", "words": ["I", "have", "a", "brother"]}],

  # OKUL
  "school":   [{"en": "I go to school.", "tr": "Okula gidiyorum.", "words": ["I", "go", "to", "school"]},
               {"en": "School is fun.", "tr": "Okul eğlenceli.", "words": ["School", "is", "fun"]}],
  "book":     [{"en": "I read a book.", "tr": "Bir kitap okuyorum.", "words": ["I", "read", "a", "book"]},
               {"en": "The book is big.", "tr": "Kitap büyük.", "words": ["The", "book", "is", "big"]}],
  "pen":      [{"en": "I write with a pen.", "tr": "Kalemle yazıyorum.", "words": ["I", "write", "with", "a", "pen"]},
               {"en": "The pen is blue.", "tr": "Kalem mavi.", "words": ["The", "pen", "is", "blue"]}],
  "teacher":  [{"en": "My teacher is kind.", "tr": "Öğretmenim nazik.", "words": ["My", "teacher", "is", "kind"]},
               {"en": "I like my teacher.", "tr": "Öğretmenimden hoşlanıyorum.", "words": ["I", "like", "my", "teacher"]}],

  # SELAMLAMA
  "hello":    [{"en": "Hello, how are you?", "tr": "Merhaba, nasılsın?", "words": ["Hello", "how", "are", "you"]},
               {"en": "I say hello.", "tr": "Merhaba derim.", "words": ["I", "say", "hello"]}],
  "goodbye":  [{"en": "Goodbye, see you soon.", "tr": "Hoşçakal, görüşürüz.", "words": ["Goodbye", "see", "you", "soon"]},
               {"en": "I say goodbye.", "tr": "Hoşçakal derim.", "words": ["I", "say", "goodbye"]}],
  "thanks":   [{"en": "Thank you very much.", "tr": "Çok teşekkür ederim.", "words": ["Thank", "you", "very", "much"]},
               {"en": "I say thanks.", "tr": "Teşekkür ederim.", "words": ["I", "say", "thanks"]}],

  # YİYECEKLER
  "bread":    [{"en": "I eat bread.", "tr": "Ekmek yiyorum.", "words": ["I", "eat", "bread"]},
               {"en": "The bread is fresh.", "tr": "Ekmek taze.", "words": ["The", "bread", "is", "fresh"]}],
  "milk":     [{"en": "I drink milk.", "tr": "Süt içiyorum.", "words": ["I", "drink", "milk"]},
               {"en": "Milk is white.", "tr": "Süt beyaz.", "words": ["Milk", "is", "white"]}],
  "water":    [{"en": "I drink water.", "tr": "Su içiyorum.", "words": ["I", "drink", "water"]},
               {"en": "Water is clean.", "tr": "Su temiz.", "words": ["Water", "is", "clean"]}],
  "egg":      [{"en": "I eat an egg.", "tr": "Bir yumurta yiyorum.", "words": ["I", "eat", "an", "egg"]},
               {"en": "The egg is white.", "tr": "Yumurta beyaz.", "words": ["The", "egg", "is", "white"]}],
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

        for lang, info in translations.items():
            for word in info.get('words', []):
                word_id = word.get('id', '').lower()
                word_text = word.get('word', '').lower()

                key = word_id if word_id in SENTENCES else (word_text if word_text in SENTENCES else None)

                if key and 'sentences' not in word:
                    word['sentences'] = SENTENCES[key]
                    updated = True
                    total_updated += 1

        if updated:
            with open(file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f'✅ {os.path.basename(file)} güncellendi')

    print(f'\n🎉 Toplam {total_updated} kelimeye cümle eklendi!')

if __name__ == '__main__':
    add_sentences()