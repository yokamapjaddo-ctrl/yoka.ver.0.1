import { MunicipalityProvider } from './context/MunicipalityContext.jsx';
import AppRoutes from './routes.jsx';

export default function App() {
  return (
    <MunicipalityProvider>
      <AppRoutes />
    </MunicipalityProvider>
  );
}
