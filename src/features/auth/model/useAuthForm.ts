import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/shared/lib';
import { useLoginMutation, useRegisterMutation } from '../api/authApi';
import { setCredentials } from './authSlice';
import { useAuth } from './selectors';

export type AuthMode = 'login' | 'register';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validate = (values: FormValues, mode: AuthMode) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  const email = mode === 'login' ? values.username : values.email;
  if (!email.trim()) errors[mode === 'login' ? 'username' : 'email'] = 'Укажите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors[mode === 'login' ? 'username' : 'email'] = 'Некорректный email';
  if (mode === 'register' && values.username.trim().length < 3)
    errors.username = 'Минимум 3 символа';
  else if (mode === 'register' && !/^[\p{L}\d]+$/u.test(values.username.trim()))
    errors.username = 'Используйте только буквы и цифры';
  if (values.password.length < 8) errors.password = 'Пароль должен содержать не менее 8 символов';
  else if (
    mode === 'register' &&
    (!/[A-ZА-ЯЁ]/.test(values.password) ||
      !/\d/.test(values.password) ||
      !/[^\p{L}\d\s]/u.test(values.password))
  )
    errors.password = 'Добавьте заглавную букву, цифру и специальный символ';
  if (mode === 'register' && values.password !== values.confirmPassword)
    errors.confirmPassword = 'Пароли не совпадают';
  return errors;
};

export const useAuthForm = (mode: AuthMode) => {
  const [values, setValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [serverError, setServerError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(true);
  const [mailingAccepted, setMailingAccepted] = useState(true);
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSessionValid } = useAuth();
  const isLogin = mode === 'login';
  const requestedRoute = (location.state as { from?: string } | null)?.from;

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || (!isLogin && !privacyAccepted)) return;

    try {
      const response = isLogin
        ? await login({ username: values.username, password: values.password }).unwrap()
        : await register({
            username: values.username,
            email: values.email,
            password: values.password,
          }).unwrap();
      dispatch(setCredentials(response));
      navigate(requestedRoute || '/dashboard', { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  return {
    confirmPasswordVisible,
    errors,
    isLogin,
    isSessionValid,
    isSubmitting: loginState.isLoading || registerState.isLoading,
    mailingAccepted,
    offerAccepted,
    passwordVisible,
    privacyAccepted,
    requestedRoute,
    serverError,
    setConfirmPasswordVisible,
    setMailingAccepted,
    setOfferAccepted,
    setPasswordVisible,
    setPrivacyAccepted,
    submit,
    update,
    values,
  };
};
