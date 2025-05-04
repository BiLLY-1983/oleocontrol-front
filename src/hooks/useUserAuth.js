import { useContext } from 'react';
import { UserContext } from '@context/UserContext';

/**
 * Hook que proporciona funcionalidades relacionadas con la autenticación y los roles de usuario.
 * 
 * Utiliza el contexto de usuario (`UserContext`) para obtener los datos del usuario y proporciona
 * funciones para verificar el rol y el departamento del usuario.
 *
 * @hook
 * @returns {Object} Un objeto que contiene:
 *   - `hasRole`: Función que verifica si el usuario tiene un rol específico.
 *   - `hasDepartment`: Función que verifica si el usuario pertenece a un departamento específico.
 *
 * @example
 * const { hasRole, hasDepartment } = useUserAuth();
 * if (hasRole("admin")) {
 *   console.log("El usuario es administrador");
 * }
 * if (hasDepartment("ventas")) {
 *   console.log("El usuario pertenece al departamento de ventas");
 * }
 */
export default function useUserAuth() {
    
    const { userData } = useContext(UserContext);

    const userRoles = userData?.user?.roles || [];
    const userDepartment = userData?.user?.employee?.department;

    /**
     * Verifica si el usuario tiene un rol específico.
     * 
     * @function
     * 
     * @param {string} roleName El nombre del rol que se desea verificar.
     * @returns {boolean} `true` si el usuario tiene el rol, `false` en caso contrario.
     */
    const hasRole = (roleName) => userRoles.some(role => role.name === roleName);

    /**
     * Verifica si el usuario pertenece a un departamento específico.
     * 
     * @function
     * 
     * @param {string} departmentName El nombre del departamento que se desea verificar.
     * @returns {boolean} `true` si el usuario pertenece al departamento, `false` en caso contrario.
     */
    const hasDepartment = (departmentName) => userDepartment === departmentName;

    return { hasRole, hasDepartment };
}
