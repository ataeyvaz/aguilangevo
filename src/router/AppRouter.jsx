import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/layout/AppLayout'

import ProfileSetup   from '../pages/ProfileSetup'
import LanguageSelect from '../pages/LanguageSelect'
import CategorySelect from '../pages/CategorySelect'
import FlashCards     from '../pages/FlashCards'
import Dashboard      from '../pages/Dashboard'
import QuizScreen     from '../pages/QuizScreen'
import ParentGate     from '../pages/parent/ParentGate'
import ParentPanel    from '../pages/parent/ParentPanel'
import LearnedWords   from '../pages/LearnedWords'
import StatsPage      from '../pages/StatsPage'
import DialogueScreen from '../pages/DialogueScreen'
import ProfilePage    from '../pages/ProfilePage'
import PlayPage       from '../pages/PlayPage'
import GrammarPage    from '../pages/GrammarPage'
import GrammarLessonPage from '../pages/GrammarLessonPage'
import LearnHub       from '../pages/LearnHub'
import ListenGame     from '../pages/games/ListenGame'
import MemoryGame     from '../pages/games/MemoryGame'
import TrueFalseGame  from '../pages/games/TrueFalseGame'
import SpeedGame      from '../pages/games/SpeedGame'
import SentenceGame   from '../pages/games/SentenceGame'
import VoiceGame      from '../pages/games/VoiceGame'
import PuzzleGame     from '../pages/games/PuzzleGame'
import FarManGame     from '../pages/games/FarManGame'
import DictionaryPage from '../pages/DictionaryPage'
import LevelsPage     from '../pages/LevelsPage'
import PlacementTest  from '../components/PlacementTest'
import Study          from '../pages/Study'
import Practice       from '../pages/Practice'

// ── Akıllı yönlendirme (root "/") ────────────────────────
function SmartRoot() {
  const { profile } = useApp()
  if (!profile)                  return <Navigate to="/setup"           replace />
  if (!profile.placement_done)   return <Navigate to="/placement-test"  replace />
  return                                <Navigate to="/dashboard"        replace />
}

// ── Router ───────────────────────────────────────────────
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → akıllı yönlendirme */}
        <Route path="/" element={<SmartRoot />} />

        {/* Standalone — layout yok */}
        <Route path="/setup"           element={<ProfileSetup />} />
        <Route path="/placement-test"  element={<PlacementTest />} />
        <Route path="/study"           element={<Study />} />
        <Route path="/practice"        element={<Practice />} />
        <Route path="/language"        element={<LanguageSelect />} />
        <Route path="/settings"          element={<ParentGate />} />
        <Route path="/settings/panel"  element={<ParentPanel />} />

        {/* Layout içinde — sidebar + bottomnav var */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/categories"  element={<CategorySelect />} />
          <Route path="/learn"       element={<FlashCards />} />
          <Route path="/quiz"        element={<QuizScreen />} />
          <Route path="/play"        element={<PlayPage />} />
          <Route path="/learn-hub"   element={<LearnHub />} />
          <Route path="/grammar"     element={<GrammarPage />} />
          <Route path="/grammar/:lessonId" element={<GrammarLessonPage />} />
          <Route path="/dialogue"    element={<DialogueScreen />} />
          <Route path="/profile"     element={<ProfilePage />} />
          <Route path="/learned"     element={<LearnedWords />} />
          <Route path="/stats"       element={<StatsPage />} />
          <Route path="/dictionary"  element={<DictionaryPage />} />
          <Route path="/levels"      element={<LevelsPage />} />
          {/* Games */}
          <Route path="/games/listen"    element={<ListenGame />} />
          <Route path="/games/memory"    element={<MemoryGame />} />
          <Route path="/games/truefalse" element={<TrueFalseGame />} />
          <Route path="/games/speed"     element={<SpeedGame />} />
          <Route path="/games/sentence"  element={<SentenceGame />} />
          <Route path="/games/voice"     element={<VoiceGame />} />
          <Route path="/games/puzzle"    element={<PuzzleGame />} />
          <Route path="/games/farman"    element={<FarManGame />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
