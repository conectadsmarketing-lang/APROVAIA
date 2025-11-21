
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { EditalPage } from './pages/Edital';
import { ProfessorIA } from './pages/ProfessorIA';
import { Ranking } from './pages/Ranking';
import { Plans } from './pages/Plans';
import { PaymentPage } from './pages/Payment';
import { CronogramaPage } from './pages/Cronograma';
import { SimuladosPage } from './pages/Simulados';
import { FlashcardsPage } from './pages/Flashcards';
import { AchievementsPage } from './pages/Achievements';
import { InglesPage } from './pages/Ingles';
import { PredictivePage } from './pages/Predictive';
import { QuestionLabPage } from './pages/QuestionLab';
import { DuelsPage } from './pages/Duels';
import { CareerPage } from './pages/Career';
import { MentalHealthPage } from './pages/MentalHealth';
import { StorePage } from './pages/Store';
import { SubjectDetail } from './pages/SubjectDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminConfig } from './pages/admin/AdminConfig';
import { AdminAI } from './pages/admin/AdminAI';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* ADMIN ROUTES (ACCESSED VIA SHORTCUT) */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/config" element={<AdminLayout><AdminConfig /></AdminLayout>} />
        <Route path="/admin/ai" element={<AdminLayout><AdminAI /></AdminLayout>} />

        {/* MAIN ROUTES (PUBLIC FOR MVP) */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/plans" element={<Layout><Plans /></Layout>} />
        <Route path="/payment" element={<Layout><PaymentPage /></Layout>} />
        <Route path="/editais" element={<Layout><EditalPage /></Layout>} />
        <Route path="/subject/:editalId/:subjectId" element={<Layout><SubjectDetail /></Layout>} />
        <Route path="/professor" element={<Layout><ProfessorIA /></Layout>} />
        <Route path="/cronograma" element={<Layout><CronogramaPage /></Layout>} />
        <Route path="/simulados" element={<Layout><SimuladosPage /></Layout>} />
        <Route path="/flashcards" element={<Layout><FlashcardsPage /></Layout>} />
        <Route path="/ranking" element={<Layout><Ranking /></Layout>} />
        <Route path="/ingles" element={<Layout><InglesPage /></Layout>} />
        <Route path="/predictive" element={<Layout><PredictivePage /></Layout>} />
        <Route path="/lab" element={<Layout><QuestionLabPage /></Layout>} />
        <Route path="/duels" element={<Layout><DuelsPage /></Layout>} />
        <Route path="/career" element={<Layout><CareerPage /></Layout>} />
        <Route path="/health" element={<Layout><MentalHealthPage /></Layout>} />
        <Route path="/store" element={<Layout><StorePage /></Layout>} />
        <Route path="/conquistas" element={<Layout><AchievementsPage /></Layout>} />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </HashRouter>
  );
}
