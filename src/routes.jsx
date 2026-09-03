import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import { useMunicipality } from './context/MunicipalityContext.jsx';
import RegionSelect from './screens/RegionSelect.jsx';
import Home from './screens/Home.jsx';
import MapScreen from './screens/MapScreen.jsx';
import CalendarScreen from './screens/CalendarScreen.jsx';
import EventDetail from './screens/EventDetail.jsx';
import Disaster from './screens/Disaster.jsx';
import Notices from './screens/Notices.jsx';
import MyPage from './screens/MyPage.jsx';

export default function AppRoutes() {
  const { municipalityId, ready } = useMunicipality();
  if (!ready) return null;

  return (
    <Routes>
      <Route path="/onboarding/region" element={<RegionSelect />} />
      <Route path="/settings/region" element={<RegionSelect mode="change" />} />
      {!municipalityId ? (
        <Route path="*" element={<Navigate to="/onboarding/region" replace />} />
      ) : (
        <>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/disaster" element={<Disaster />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
