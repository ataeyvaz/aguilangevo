import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const Database = require('better-sqlite3')
const DB_PATH = join(__dirname, '..', 'data', 'aguilangevo.db')
const db = new Database(DB_PATH)
db.pragma('foreign_keys = ON')

const packs = JSON.parse(
  readFileSync(join(__dirname, 'scenario_packs_es.json'), 'utf8')
)

let inserted = 0
let skipped = 0

const getPack = db.prepare(
  'SELECT id FROM conversation_packs WHERE word = ? AND difficulty = ? AND bot_language = ?'
)

const insertPack = db.prepare(`
  INSERT OR IGNORE INTO conversation_packs
    (word, difficulty, bot_language, level, context)
  VALUES
    (@word, @difficulty, @bot_language, @level, @context)
`)

const insertExchange = db.prepare(`
  INSERT OR IGNORE INTO conversation_exchanges
    (pack_id, exchange_order, bot_message, options, correct_index, points)
  VALUES
    (@pack_id, @exchange_order, @bot_message, @options, @correct_index, @points)
`)

for (const item of packs) {
  const p = item.pack
  const word = p.word || p.scenario

  const existing = getPack.get(word, p.difficulty, p.bot_language)
  if (existing) {
    console.log('⏭️  Skipped: ' + p.title + ' (already exists)')
    skipped++
    continue
  }

  const result = insertPack.run({
    word,
    difficulty: p.difficulty,
    bot_language: p.bot_language,
    level: p.level || 'a1',
    context: p.title,
  })

  const packId = result.lastInsertRowid

  for (const ex of item.exchanges) {
    insertExchange.run({
      pack_id: packId,
      exchange_order: ex.order || 1,
      bot_message: ex.bot,
      options: JSON.stringify(ex.options.slice(0, 3)),
      correct_index: ex.correct,
      points: ex.points || 10,
    })
  }

  console.log('✅ Inserted: ' + p.title + ' (' + item.exchanges.length + ' exchanges)')
  inserted++
}

console.log('\n📊 Done: ' + inserted + ' inserted, ' + skipped + ' skipped')
db.close()