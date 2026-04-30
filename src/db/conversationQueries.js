/**
 * conversationQueries.js — SQLite conversation sorguları (Node.js only)
 *
 * Browser/WebView içinde import ETMEYİN.
 * React tarafı → src/services/conversationService.js kullanır.
 */

import { getDb } from './db.js'

const today = () => new Date().toISOString().split('T')[0]

/**
 * Bir kelimenin packlerini döner.
 * @param {number} wordId
 * @param {'easy'|'medium'|'hard'} difficulty
 */
export function getPacksForWord(wordId, difficulty = 'easy') {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM conversation_packs
    WHERE word_id = ? AND difficulty = ?
    ORDER BY id
  `).all(wordId, difficulty)
}

/**
 * Pack'e ait exchange'leri döner (options JSON parse edilmiş).
 * @param {number} packId
 */
export function getExchanges(packId) {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM conversation_exchanges
    WHERE pack_id = ?
    ORDER BY exchange_order
  `).all(packId).map(ex => ({
    ...ex,
    options: JSON.parse(ex.options),
  }))
}

/**
 * Kullanıcının pack ilerlemesini kaydeder / günceller.
 * @param {number} profileId
 * @param {number} packId
 * @param {number} score      — bu turda kazanılan puan
 */
export function saveProgress(profileId, packId, score) {
  const db = getDb()
  db.prepare(`
    INSERT INTO user_conversation_progress
      (profile_id, pack_id, score, completed, attempts, last_played_at)
    VALUES (?, ?, ?, 1, 1, datetime('now'))
    ON CONFLICT(profile_id, pack_id) DO UPDATE SET
      score          = MAX(excluded.score, score),
      completed      = 1,
      attempts       = attempts + 1,
      last_played_at = excluded.last_played_at
  `).run(profileId, packId, score)
}

/**
 * Bugün çalışılması gereken conversation packlerini döner:
 *   user_progress'te 'learning'/'review' statüsündeki
 *   word_id'lere ait, henüz tamamlanmamış veya 3 günden eski packler.
 * @param {number} profileId
 * @param {number} limit
 */
export function getTodaysPractice(profileId, limit = 5) {
  const db = getDb()
  return db.prepare(`
    SELECT cp.*
    FROM conversation_packs cp
    JOIN user_progress up
      ON up.word_id = cp.word_id
    LEFT JOIN user_conversation_progress ucp
      ON ucp.profile_id = ? AND ucp.pack_id = cp.id
    WHERE up.profile_id = ?
      AND up.status IN ('learning', 'review')
      AND up.next_review_date <= ?
      AND (
        ucp.id IS NULL
        OR ucp.completed = 0
        OR ucp.last_played_at < date('now', '-3 days')
      )
    ORDER BY up.next_review_date ASC
    LIMIT ?
  `).all(profileId, profileId, today(), limit)
}
