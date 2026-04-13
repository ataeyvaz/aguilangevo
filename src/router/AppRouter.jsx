import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProfileSelect from '../pages/ProfileSelect'
import LanguageSelect from '../pages/LanguageSelect'
import CategorySelect from '../pages/CategorySelect'
import FlashCards from '../pages/FlashCards'
import Dashboard from '../pages/Dashboard'

const ParentPanel = () => <div className="p-8 text-2xl font-heading">Ebeveyn Paneli</div>

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfileSelect />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/categories" element={<CategorySelect />} />
        <Route path="/learn" element={<FlashCards />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parent" element={<ParentPanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}