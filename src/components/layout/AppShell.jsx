import { Outlet } from 'react-router-dom';
import TabBar from './TabBar.jsx';

export default function AppShell() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
      <TabBar />
    </div>
  );
}
