import { useEffect, useState, useCallback } from 'react';
import { FiltroUsuarios, Usuario, Modo, ErroresFiltro } from '@/lib/types';

export function tieneCriterios(filtro: FiltroUsuarios): boolean {
  return !!(
    filtro.registradosDespuesDe ||
    filtro.registradosAntesDe ||
    filtro.minimoUsos !== undefined ||
    filtro.maximoUsos !== undefined
  );
}

export function tieneEspecificos(filtro: FiltroUsuarios): boolean {
  return !!(filtro.idsEspecificos && filtro.idsEspecificos.length > 0);
}

function detectarModo(value: FiltroUsuarios | null): Modo {
  if (!value) return 'todos';
  if (value.idsEspecificos && value.idsEspecificos.length > 0) return 'especificos';
  return 'filtros';
}

const erroresIniciales: ErroresFiltro = { despues: '', antes: '', usos: '' };

type Props = {
  value: FiltroUsuarios | null;
  onChange: (filtro: FiltroUsuarios | null) => void;
  onError: (hayError: boolean) => void;
};

export function useFiltroUsuarios({ value, onChange, onError }: Props) {
  const [modo, setModo] = useState<Modo>(() => detectarModo(value));
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [filtro, setFiltro] = useState<FiltroUsuarios>(value ?? {});
  const [confirmando, setConfirmando] = useState<Modo | null>(null);
  const [errores, setErrores] = useState<ErroresFiltro>(erroresIniciales);

  const fetchUsuarios = useCallback((q: string, page: number) => {
    setLoadingUsuarios(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set('q', q);
    fetch(`/api/cp/clientes?${params}`)
      .then((res) => res.json())
      .then((json) => {
        const data: Usuario[] = (json.items || []).map((c: { id_clerk: string; nombre: string; apellido: string }) => ({
          id: c.id_clerk,
          nombre: `${c.nombre} ${c.apellido}`,
          fechaRegistro: '',
        }));
        setUsuarios(data);
        setTotalPaginas(json.totalPages ?? 1);
      })
      .finally(() => setLoadingUsuarios(false));
  }, []);

  useEffect(() => {
    if (modo === 'especificos') {
      fetchUsuarios(busqueda, pagina);
    }
  }, [modo, busqueda, pagina, fetchUsuarios]);

  // Resetear página al cambiar búsqueda
  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  useEffect(() => {
    if (modo === 'todos') { onError(false); return; }
    const hayErroresInternos = Object.values(errores).some((e) => e !== '');
    if (modo === 'filtros') { onError(hayErroresInternos || !tieneCriterios(filtro)); return; }
    if (modo === 'especificos') { onError(hayErroresInternos || !tieneEspecificos(filtro)); }
  }, [modo, filtro, errores]);

  const actualizarErrores = (nuevos: Partial<ErroresFiltro>) =>
    setErrores((prev) => ({ ...prev, ...nuevos }));

  const actualizar = (cambios: Partial<FiltroUsuarios>) => {
    const nuevo = { ...filtro, ...cambios };
    setFiltro(nuevo);
    onChange(nuevo);
  };

  const toggleUsuario = (id: string) => {
    const ids = filtro.idsEspecificos ?? [];
    const nuevo = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
    actualizar({ idsEspecificos: nuevo.length > 0 ? nuevo : undefined });
  };

  const aplicarCambioModo = (nuevoModo: Modo) => {
    setModo(nuevoModo);
    setFiltro({});
    setBusqueda('');
    setPagina(1);
    setConfirmando(null);
    setErrores(erroresIniciales);
    onChange(nuevoModo === 'todos' ? null : {});
  };

  const handleModo = (nuevoModo: Modo) => {
    if (nuevoModo === modo) return;
    const hayDatos =
      (modo === 'filtros' && tieneCriterios(filtro)) ||
      (modo === 'especificos' && tieneEspecificos(filtro));
    if (hayDatos) { setConfirmando(nuevoModo); return; }
    aplicarCambioModo(nuevoModo);
  };

  const mensajeConfirmacion = () => {
    if (modo === 'filtros') return 'Tenés filtros cargados. Si cambiás de opción se van a perder.';
    if (modo === 'especificos') {
      const cant = filtro.idsEspecificos?.length ?? 0;
      return `Tenés ${cant} usuario${cant !== 1 ? 's' : ''} seleccionado${cant !== 1 ? 's' : ''}. Si cambiás de opción se va a perder la selección.`;
    }
    return '';
  };

  return {
    modo,
    usuarios,
    loadingUsuarios,
    busqueda,
    setBusqueda,
    pagina,
    setPagina,
    totalPaginas,
    filtro,
    confirmando,
    errores,
    handleModo,
    aplicarCambioModo,
    cancelarConfirmacion: () => setConfirmando(null),
    actualizar,
    actualizarErrores,
    toggleUsuario,
    mensajeConfirmacion,
  };
}