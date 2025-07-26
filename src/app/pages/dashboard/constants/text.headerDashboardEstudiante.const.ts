import { headerDasboardType } from '../../../core/shared/types/dashboard/dashboard.type';

export function headerDasboard(rol: string): headerDasboardType {
  return {
    title: 'Sistema de Auto-Matricula',
    periodo: '2025-2',
    subtitle: `portal del ${rol} - peridodo academico`,
  };
}
