import { createContext } from "react";

/**
 * Contexto para gestionar los datos del usuario.
 * 
 * Proporciona acceso global a la información del usuario autenticado, como el token y los datos del perfil.
 * Este contexto se utiliza junto con el `UserProvider` para manejar la autenticación y el estado del usuario.
 *
 * @constant {React.Context} UserContext
 */
export const UserContext = createContext();