import * as mock from './sources/mockSource.js';
import * as supabaseSource from './sources/supabaseSource.js';

const SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock';

export const source = SOURCE === 'supabase' ? supabaseSource : mock;
export const dataSourceName = SOURCE;
