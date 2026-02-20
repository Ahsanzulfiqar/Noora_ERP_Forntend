import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { useLoginMutation } from '@/services/publicendpoint/login';
import { useState } from 'react';

const useSignIn = () => {
  const navigate = useNavigate();
  const {
    saveSession
  } = useAuthContext();
  const [searchParams] = useSearchParams();
  const {
    showNotification
  } = useNotificationContext();

  const [errorMessage, setErrorMessage] = useState('');

  const [loginMutation, { isLoading: loading,
    data,
    error,
    isSuccess,
    isError
  }] = useLoginMutation();

  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });

  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema)
  });

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink); else navigate('/dashboard');
  };

  const login = handleSubmit(async values => {
    setErrorMessage(''); // Clear previous e
    // rror
    try {
      const res = await loginMutation(values).unwrap();
      if (res?.token) {
        saveSession({
          user: res.user,
          token: res.token
        });
        redirectUser();
        showNotification({
          message: 'Successfully logged in. Redirecting....',
          variant: 'success'
        });
      }

    } catch (e) {
      const msg = e?.message || e?.data?.errors?.[0]?.message || 'Invalid email or password';
      setErrorMessage(msg);
      showNotification({
        title: 'Login Error',
        message: msg,
        variant: 'danger'
      });
    }
  });

  return {
    loading,
    login,
    control,
    errorMessage
  };
};

export default useSignIn;