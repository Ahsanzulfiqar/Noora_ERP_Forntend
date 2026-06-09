import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetUserByIdQuery } from '@/services/authenticateendpoint/users';
import UserDetails from './components/UserDetails';
import PageTItle from '@/components/PageTItle';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const RoleViewPage = () => {
    const { roleId } = useParams();
    const { data: userData, isLoading, isError, error, refetch } = useGetUserByIdQuery(roleId);

    useEffect(() => {
        if (error) toast.error(extractApiErrorMessage(error));
    }, [error]);

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
        return null;
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
