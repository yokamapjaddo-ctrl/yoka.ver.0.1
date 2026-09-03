import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { municipalityService } from '../services/municipalityService.js';

const KEY = 'yoka.municipality.v1';
const Ctx = createContext(null);

export function MunicipalityProvider({ children }) {
  const [municipalityId, setMunicipalityId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [municipality, setMunicipality] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { /* noop */ }
    setMunicipalityId(saved?.municipalityId || null);
    setAreaId(saved?.areaId || null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!municipalityId) { setMunicipality(null); return; }
    municipalityService.get(municipalityId).then(setMunicipality);
  }, [municipalityId]);

  const value = useMemo(() => ({
    ready, municipalityId, municipality, areaId,
    areaName: municipality?.garbage_areas?.find((a) => a.id === areaId)?.name || '',
    select(id, area = null) {
      setMunicipalityId(id);
      setAreaId(area);
      localStorage.setItem(KEY, JSON.stringify({ municipalityId: id, areaId: area }));
    },
  }), [ready, municipalityId, municipality, areaId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMunicipality = () => useContext(Ctx);
