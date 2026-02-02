import { useAuthContext } from '@/context/useAuthContext';

const useUserRole = () => {
    const { user } = useAuthContext();
    // The user object in context contains the session data including the user profile
    // structure: { token: '...', user: { role: '...', ... } }
    return user?.user?.role;
};

export default useUserRole;
