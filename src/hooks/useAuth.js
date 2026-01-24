import { useAuthContext } from '@/context/useAuthContext';

/**
 * Custom hook to access authentication data and user details.
 * Provides easy access to role, email, and helpful role-check functions.
 */
export const useAuth = () => {
    const { user, isAuthenticated, saveSession, removeSession } = useAuthContext();

    // Extracting user details from the session object
    // Based on saveSession({ user: res.user, token: res.token }) in useSignIn.js
    const userData = user?.user;
    const token = user?.token;

    const role = userData?.role;
    const email = userData?.email;
    const name = userData?.name;
    const id = userData?._id;

    // Helper getters for common roles
    const isAdmin = role === 'admin';
    const isUser = role === 'user'; // Adjust based on your available roles

    /**
     * Check if the current user has a specific role or one of the specified roles.
     * @param {string | string[]} requiredRole - A single role string or an array of role strings.
     * @returns {boolean}
     */
    const hasRole = (requiredRole) => {
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(role);
        }
        return role === requiredRole;
    };

    return {
        user: userData,
        token,
        role,
        email,
        name,
        id,
        isAuthenticated,
        isAdmin,
        isUser,
        hasRole,
        saveSession,
        removeSession,
    };
};

export default useAuth;
