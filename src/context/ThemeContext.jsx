import { createContext, useContext, useState, useEffect } from "react";

/**
 * Contexto que almacena el tema actual de la aplicación (oscuro o claro).
 * Proporciona el valor del tema y la función para actualizarlo.
 *
 * @constant {React.Context} ThemeContext
 */
const ThemeContext = createContext();

/**
 * Proveedor del contexto del tema.
 * Gestiona el estado del tema y proporciona una función para actualizarlo.
 *
 * @param {Object} props - Propiedades del componente, incluyendo `children`.
 * @returns {JSX.Element} El proveedor del contexto que envuelve los componentes hijos.
 */
export function ThemeProvider({ children }) {
  /**
   * Estado que contiene el tema actual de la aplicación.
   * Se inicializa desde localStorage o como cadena vacía si no hay valor guardado.
   *
   * @state {string} theme
   */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "";
  });

  /**
   * Función para aplicar un tema seleccionado a la aplicación.
   * Esta función agrega o elimina clases del elemento raíz (`html`) para cambiar el tema.
   *
   * @param {string} selectedTheme - El tema seleccionado ('dark', 'light' o vacío para predeterminado).
   */
  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (selectedTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("dark", "light");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    }

    // Guardar el tema en localStorage
    localStorage.setItem("theme", selectedTheme);
    setTheme(selectedTheme);
  };

  /**
   * Efecto secundario que se ejecuta para aplicar el tema seleccionado al cargarse el componente.
   * Dependiendo del estado `theme`, se aplica el tema correspondiente.
   *
   * @effect
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto del tema.
 * Permite que los componentes obtengan y actualicen el tema de manera sencilla.
 *
 * @returns {Object} El valor del contexto que incluye `theme` y `setTheme`.
 */
export function useTheme() {
  return useContext(ThemeContext);
}
