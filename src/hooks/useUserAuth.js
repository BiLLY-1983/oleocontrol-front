import { useContext } from 'react';
import { UserContext } from '@context/UserContext';

export default function useUserAuth() {
    
    const { userData } = useContext(UserContext);

    const userRoles = userData?.user?.roles || [];
    const userDepartment = userData?.user?.employee?.department;

    const hasRole = (roleName) => userRoles.some(role => role.name === roleName);
    const hasDepartment = (departmentName) => userDepartment === departmentName;

    return { hasRole, hasDepartment };
}
