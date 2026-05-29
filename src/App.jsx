import React, { useEffect, useMemo, useState } from "react";

const CAMPOS = [
  "Equipo",
  "Tipo",
  "Area",
  "Criticidad",
  "Rpm motor",
  "kW",
  "Hp",
  "Ø Polea 1",
  "Ø Polea 2",
  "Tipo correa",
  "Longitud correa",
  "Cantidad correa",
  "Tipo de chumacera 1",
  "Tipo de chumacera 2",
  "# chumacera 1",
  "# chumacera 2",
  "kW reductor",
  "(i) reductor",
  "Cadena redler",
  "Tamaño Sprocket 1",
  "Tamaño Sprocket 2",
  "Cantidad de dientes 1",
  "Cantidad de dientes 2"
];

const crearModeloInicial = () => {
  return CAMPOS.reduce((acumulador, campo) => {
    acumulador[campo] = "";
    return acumulador;
  }, {});
};

const obtenerDatosLocales = () => {
  try {
    const datos = localStorage.getItem("equipos-industriales");

    if (!datos) {
      return [];
    }

    return JSON.parse(datos);
  } catch (error) {
    console.error("Error leyendo datos locales:", error);
    return [];
  }
};

export default function App() {
  const [equipos, setEquipos] = useState([]);
  const [formulario, setFormulario] = useState(crearModeloInicial());
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(true);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const datos = obtenerDatosLocales();
    setEquipos(datos);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "equipos-industriales",
        JSON.stringify(equipos)
      );
    } catch (error) {
      console.error("Error guardando datos:", error);
    }
  }, [equipos]);

  const manejarCambio = (campo, valor) => {
    setFormulario((anterior) => {
      return {
        ...anterior,
        [campo]: valor
      };
    });
  };

  const limpiarFormulario = () => {
    setFormulario(crearModeloInicial());
    setModoEdicion(null);
  };

  const guardarEquipo = () => {
    if (!formulario.Equipo.trim()) {
      alert("Debe ingresar el nombre del equipo");
      return;
    }

    setCargando(true);

    setTimeout(() => {
      if (modoEdicion !== null) {
        const nuevosEquipos = equipos.map((equipo, indice) => {
          if (indice === modoEdicion) {
            return {
              ...formulario,
              id: equipo.id
            };
          }

          return equipo;
        });

        setEquipos(nuevosEquipos);
      } else {
        const nuevoEquipo = {
          ...formulario,
          id: Date.now()
        };

        setEquipos((anterior) => {
          return [nuevoEquipo].concat(anterior);
        });
      }

      limpiarFormulario();
      setCargando(false);
    }, 300);
  };

  const editarEquipo = (indice) => {
    const equipo = equipos[indice];

    if (!equipo) {
      return;
    }

    setFormulario(equipo);
    setModoEdicion(indice);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const eliminarEquipo = (indice) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar este registro?"
    );

    if (!confirmar) {
      return;
    }

    const nuevosEquipos = equipos.filter((_, index) => {
      return index !== indice;
    });

    setEquipos(nuevosEquipos);
  };

  const equiposFiltrados = useMemo(() => {
    return equipos.filter((equipo) => {
      return Object.values(equipo).some((valor) => {
        return String(valor)
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      });
    });
  }, [equipos, busqueda]);

  const estadisticas = useMemo(() => {
    const criticos = equipos.filter((equipo) => {
      return String(equipo.Criticidad)
        .toLowerCase()
        .includes("alta");
    }).length;

    const motores = equipos.filter((equipo) => {
      return String(equipo.Tipo)
        .toLowerCase()
        .includes("motor");
    }).length;

    return {
      total: equipos.length,
      criticos,
      motores
    };
  }, [equipos]);

  return (
    <div
      className={
        modoOscuro
          ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-6"
          : "min-h-screen bg-slate-100 text-slate-900 p-4 md:p-6"
      }
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Sistema de Gestión Industrial
            </h1>

            <p className="text-base md:text-lg opacity-80">
              Base de datos editable para equipos industriales
            </p>
          </div>

          <button
            onClick={() => {
              setModoOscuro(!modoOscuro);
            }}
            className="bg-cyan-600 hover:bg-cyan-500 transition px-6 py-3 rounded-2xl font-bold"
          >
            {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-cyan-600 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-2">
              Equipos
            </h2>

            <p className="text-4xl font-bold">
              {estadisticas.total}
            </p>
          </div>

          <div className="bg-red-600 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-2">
              Críticos
            </h2>

            <p className="text-4xl font-bold">
              {estadisticas.criticos}
            </p>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-2">
              Motores
            </h2>

            <p className="text-4xl font-bold">
              {estadisticas.motores}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 mb-8 backdrop-blur-lg">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">
              {modoEdicion !== null
                ? "Editar Equipo"
                : "Nuevo Equipo"}
            </h2>

            <button
              onClick={limpiarFormulario}
              className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-2xl font-medium"
            >
              Limpiar formulario
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CAMPOS.map((campo) => {
              return (
                <div
                  key={campo}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-medium opacity-80">
                    {campo}
                  </label>

                  <input
                    type="text"
                    value={formulario[campo] || ""}
                    onChange={(evento) => {
                      manejarCambio(campo, evento.target.value);
                    }}
                    placeholder={`Ingrese ${campo}`}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              onClick={guardarEquipo}
              disabled={cargando}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              {cargando
                ? "Procesando..."
                : modoEdicion !== null
                ? "Actualizar Equipo"
                : "Guardar Equipo"}
            </button>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 backdrop-blur-lg">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold">
              Registros Guardados
              ({equiposFiltrados.length})
            </h2>

            <input
              type="text"
              value={busqueda}
              onChange={(evento) => {
                setBusqueda(evento.target.value);
              }}
              placeholder="Buscar equipo, área o tipo"
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="overflow-auto border border-slate-700 rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 sticky top-0 z-10">
                <tr>
                  {CAMPOS.map((campo) => {
                    return (
                      <th
                        key={campo}
                        className="px-4 py-4 text-left whitespace-nowrap border-b border-slate-700"
                      >
                        {campo}
                      </th>
                    );
                  })}

                  <th className="px-4 py-4 text-center whitespace-nowrap border-b border-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {equiposFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={CAMPOS.length + 1}
                      className="text-center py-10 opacity-70"
                    >
                      No existen registros
                    </td>
                  </tr>
                ) : (
                  equiposFiltrados.map((equipo, indice) => {
                    return (
                      <tr
                        key={equipo.id}
                        className="border-b border-slate-800 hover:bg-slate-700/40 transition"
                      >
                        {CAMPOS.map((campo) => {
                          return (
                            <td
                              key={campo}
                              className="px-4 py-3 whitespace-nowrap"
                            >
                              {equipo[campo] || "-"}
                            </td>
                          );
                        })}

                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                editarEquipo(indice);
                              }}
                              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-xl transition"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => {
                                eliminarEquipo(indice);
                              }}
                              className="bg-red-600 hover:bg-red-500 font-semibold px-4 py-2 rounded-xl transition"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm opacity-70 mt-8">
          Sistema industrial • Compatible con tablets • Datos guardados localmente
        </div>
      </div>
    </div>
  );
}
