import { FiltroUsuarios, Usuario } from '@/lib/types';
import { tieneEspecificos } from '../useFiltroUsuarios';

type Props = {
  filtro: FiltroUsuarios;
  usuarios: Usuario[];
  loadingUsuarios: boolean;
  busqueda: string;
  pagina: number;
  totalPaginas: number;
  onBusqueda: (valor: string) => void;
  onToggleUsuario: (id: string) => void;
  onPagina: (pagina: number) => void;
};

export function FiltroEspecificos({
  filtro,
  usuarios,
  loadingUsuarios,
  busqueda,
  pagina,
  totalPaginas,
  onBusqueda,
  onToggleUsuario,
  onPagina,
}: Props) {
  const seleccionados = filtro.idsEspecificos?.length ?? 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#271033] rounded-xl border border-[#8D62A5]">
      {!tieneEspecificos(filtro) && (
        <p className="text-red-400 text-xs">Tenés que seleccionar al menos un usuario.</p>
      )}

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D62A5]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          className="w-full bg-[#1b0422] border border-[#8D62A5] rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#F500F1]"
        />
      </div>

      {seleccionados > 0 && (
        <p className="text-[#F500F1] text-xs font-semibold">
          {seleccionados} usuario{seleccionados !== 1 ? 's' : ''} seleccionado{seleccionados !== 1 ? 's' : ''}
        </p>
      )}

      <div className="flex flex-col gap-1 min-h-24 h-52 overflow-y-auto pr-1">
        {loadingUsuarios ? (
          <p className="text-[#8D62A5] text-sm">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-[#8D62A5] text-sm">No se encontraron usuarios.</p>
        ) : (
          usuarios.map((u) => (
            <label
              key={u.id}
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                filtro.idsEspecificos?.includes(u.id)
                  ? 'bg-[#1b0422] border border-[#F500F1]'
                  : 'hover:bg-[#1b0422] border border-transparent'
              }`}
            >
              <input
                type="checkbox"
                checked={filtro.idsEspecificos?.includes(u.id) ?? false}
                onChange={() => onToggleUsuario(u.id)}
                className="w-4 h-4 accent-[#F500F1]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{u.nombre}</p>
              </div>
            </label>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => onPagina(pagina - 1)}
            disabled={pagina === 1}
            className="px-3 py-1 rounded-lg text-xs bg-[#1b0422] border border-[#8D62A5] text-[#FBDAF9] disabled:opacity-40 hover:border-[#F500F1] transition-colors"
          >
            Anterior
          </button>
          <span className="text-[#8D62A5] text-xs">{pagina} / {totalPaginas}</span>
          <button
            type="button"
            onClick={() => onPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="px-3 py-1 rounded-lg text-xs bg-[#1b0422] border border-[#8D62A5] text-[#FBDAF9] disabled:opacity-40 hover:border-[#F500F1] transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}