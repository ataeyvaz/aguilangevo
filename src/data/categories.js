import animalsData     from './animals-a1.json'
import colorsData      from './colors-a1.json'
import numbersData     from './numbers-a1.json'
import fruitsData      from './fruits-a1.json'
import bodyData        from './body-a1.json'
import familyData      from './family-a1.json'
import schoolData      from './school-a1.json'
import foodData        from './food-a1.json'
import greetingsData   from './greetings-a1.json'
import questionsData   from './questions-a1.json'
import vegetablesData  from './vegetables-a1.json'
import clothingData    from './clothing-a1.json'
import homeData        from './home-a1.json'
import transportData   from './transport-a1.json'
import timeData        from './time-a1.json'
import jobsData        from './jobs-a1.json'
import sportsData      from './sports-a1.json'
import placesData      from './places-a1.json'
import adjectivesData  from './adjectives-a1.json'
import verbsData       from './verbs-a1.json'

export const CATEGORIES = [
  {
    id: 'animals', icon: '🐾', label: 'Hayvanlar', color: 'bg-green-100 border-green-400', data: animalsData,
    grammarNote: {
      sentences: ['I have a dog.', 'I see a cat.'],
      tip: '"I have" ile sahipliğini, "I see" ile gördüğünü ifade edersin.',
    },
  },
  {
    id: 'colors', icon: '🎨', label: 'Renkler', color: 'bg-pink-100 border-pink-400', data: colorsData,
    grammarNote: {
      sentences: ['The sky is blue.', 'My bag is red.'],
      tip: '"The/My ... is + renk" kalıbıyla renk tanımlaması yaparsın.',
    },
  },
  {
    id: 'numbers', icon: '🔢', label: 'Sayılar', color: 'bg-blue-100 border-blue-400', data: numbersData,
    grammarNote: {
      sentences: ['I have two cats.', 'There are five books.'],
      tip: '"I have + sayı" ile kaç tane olduğunu, "There are + sayı" ile sayı belirtirsin.',
    },
  },
  {
    id: 'fruits', icon: '🍎', label: 'Meyveler', color: 'bg-red-100 border-red-400', data: fruitsData,
    grammarNote: {
      sentences: ['I eat an apple.', 'She likes oranges.'],
      tip: 'Tekil meyve için "a/an", çoğul için "-s" ekini kullanırsın.',
    },
  },
  {
    id: 'vegetables', icon: '🥕', label: 'Sebzeler', color: 'bg-lime-100 border-lime-400', data: vegetablesData,
    grammarNote: {
      sentences: ['I like carrots.', 'We eat vegetables every day.'],
      tip: '"I like + çoğul isim" ile sevdiklerini ifade edersin.',
    },
  },
  {
    id: 'body', icon: '🫀', label: 'Vücut', color: 'bg-orange-100 border-orange-400', data: bodyData,
    grammarNote: {
      sentences: ['I have two eyes.', 'My hands are small.'],
      tip: '"I have" ile vücudunu tanımla, "My ... is/are" ile özellik belirt.',
    },
  },
  {
    id: 'family', icon: '👨‍👩‍👧', label: 'Aile', color: 'bg-purple-100 border-purple-400', data: familyData,
    grammarNote: {
      sentences: ['I have a sister.', 'My mother is kind.'],
      tip: '"My + aile üyesi + is" kalıbıyla aile bireylerini tanıtırsın.',
    },
  },
  {
    id: 'school', icon: '🏫', label: 'Okul', color: 'bg-yellow-100 border-yellow-400', data: schoolData,
    grammarNote: {
      sentences: ['I go to school every day.', 'I have a pencil.'],
      tip: '"I go to + yer" ile nereye gittiğini, "I have" ile ne taşıdığını söylersin.',
    },
  },
  {
    id: 'food', icon: '🍕', label: 'Yiyecekler', color: 'bg-amber-100 border-amber-400', data: foodData,
    grammarNote: {
      sentences: ['I eat pizza for lunch.', 'She drinks water.'],
      tip: '"I eat / I drink" kalıplarıyla ne yiyip içtiğini anlatırsın.',
    },
  },
  {
    id: 'greetings', icon: '👋', label: 'Selamlaşma', color: 'bg-teal-100 border-teal-400', data: greetingsData,
    grammarNote: {
      sentences: ['Hello! How are you?', 'I am fine, thank you.'],
      tip: '"How are you?" sorusuna "I am fine / I am good" ile yanıt verirsin.',
    },
  },
  {
    id: 'questions', icon: '❓', label: 'Sorular', color: 'bg-indigo-100 border-indigo-400', data: questionsData,
    grammarNote: {
      sentences: ['What is this?', 'Where are you?'],
      tip: 'Soru kelimeleri (What, Where, Who) cümlenin başına gelir.',
    },
  },
  {
    id: 'clothing', icon: '👗', label: 'Kıyafetler', color: 'bg-violet-100 border-violet-400', data: clothingData,
    grammarNote: {
      sentences: ['I wear a blue shirt.', 'She has a red dress.'],
      tip: '"I wear" ile ne giydiğini, "I have" ile ne sahip olduğunu söylersin.',
    },
  },
  {
    id: 'home', icon: '🏠', label: 'Ev', color: 'bg-stone-100 border-stone-400', data: homeData,
    grammarNote: {
      sentences: ['I live in a house.', 'There is a table in the kitchen.'],
      tip: '"There is/are" kalıbıyla bir yerde ne olduğunu anlatırsın.',
    },
  },
  {
    id: 'transport', icon: '🚗', label: 'Ulaşım', color: 'bg-sky-100 border-sky-400', data: transportData,
    grammarNote: {
      sentences: ['I take the bus to school.', 'She drives a car.'],
      tip: '"I take the + taşıt" ile toplu taşıma, "I drive" ile araç kullanmayı ifade edersin.',
    },
  },
  {
    id: 'time', icon: '⏰', label: 'Zaman', color: 'bg-cyan-100 border-cyan-400', data: timeData,
    grammarNote: {
      sentences: ['It is seven o\'clock.', 'Today is Monday.'],
      tip: '"It is + saat" ile saati, "Today is + gün" ile günü söylersin.',
    },
  },
  {
    id: 'jobs', icon: '👷', label: 'Meslekler', color: 'bg-emerald-100 border-emerald-400', data: jobsData,
    grammarNote: {
      sentences: ['He is a doctor.', 'She is a teacher.'],
      tip: '"He/She is a + meslek" kalıbıyla başkasının mesleğini anlatırsın.',
    },
  },
  {
    id: 'sports', icon: '⚽', label: 'Sporlar', color: 'bg-rose-100 border-rose-400', data: sportsData,
    grammarNote: {
      sentences: ['I play football.', 'She swims every day.'],
      tip: '"I play + spor" ile takım sporları, "I swim/run" ile bireysel sporları ifade edersin.',
    },
  },
  {
    id: 'places', icon: '🏙️', label: 'Yerler', color: 'bg-fuchsia-100 border-fuchsia-400', data: placesData,
    grammarNote: {
      sentences: ['I go to the park.', 'She is at school.'],
      tip: '"I go to the + yer" ile gidişi, "I am at the + yer" ile bulunduğun yeri söylersin.',
    },
  },
  {
    id: 'adjectives', icon: '🌈', label: 'Sıfatlar', color: 'bg-orange-100 border-orange-400', data: adjectivesData,
    grammarNote: {
      sentences: ['The cat is small.', 'My room is clean and bright.'],
      tip: 'Sıfatlar isimden önce veya "is/are" sonrası gelir: "a small cat" ya da "the cat is small".',
    },
  },
  {
    id: 'verbs', icon: '⚡', label: 'Fiiller', color: 'bg-red-100 border-red-400', data: verbsData,
    grammarNote: {
      sentences: ['I run fast every morning.', 'She reads a book at night.'],
      tip: 'Simple Present\'ta "I/You/We/They + fiil", "He/She/It + fiil + s" kullanırsın.',
    },
  },
]

export function getCategoryData(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId)?.data ?? animalsData
}
