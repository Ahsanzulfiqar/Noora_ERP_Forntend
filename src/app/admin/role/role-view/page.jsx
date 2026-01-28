import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '@/services/authenticateendpoint/users';
import UserDetails from './components/UserDetails';
import PageTItle from '@/components/PageTItle';

const RoleViewPage = () => {
    const { roleId } = useParams();
    const { data: userData, isLoading, isError, error } = useGetUserByIdQuery(roleId);

    if (isLoading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading user details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3">
                Error loading user details: {error?.message || 'Unknown error'}
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="alert alert-warning m-3">
                User not found
            </div>
        );
    }

    return (
        <>
            <PageTItle title="User Details" />
            <UserDetails user={userData} />
        </>
    );
};

export default RoleViewPage;
