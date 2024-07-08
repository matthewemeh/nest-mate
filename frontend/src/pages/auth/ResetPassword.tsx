import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocalLibrary } from 'react-icons/md';

import { PATHS } from 'routes/PathConstants';

import { showAlert } from 'utils';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import axios from 'services/axios';
import Endpoints from 'services/Endpoints';
import { updateUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { useUpdateUserMutation } from 'services/apis/userApi/userStoreApi';

const ResetPassword = () => {
  const { USERS } = Endpoints;
  const { LOGIN, REGISTER, HOME } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);

  const { email } = useAppSelector(state => state.userStore.currentUser);
  const { isOtpVerified, isAuthenticated } = useAppSelector(state => state.userData);
  const [updateUser, { error, isError, isLoading, isSuccess }] = useUpdateUserMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const password: string = passwordRef.current!.value;
    const confirmPassword: string = confirmPasswordRef.current!.value;

    if (password !== confirmPassword) {
      confirmPasswordRef.current?.focus();
      return showAlert({ msg: 'Passwords must match!' });
    }
    setPasswordSubmitted(true);

    axios
      .get(`${USERS}/id`, { params: { email } })
      .then(res => {
        setPasswordSubmitted(false);
        const user = res.data as User | null;
        if (user) {
          updateUser({ _id: user._id, userID: user._id, password });
        } else {
          showAlert({ msg: `The account with email: ${email} does not exist` });
          navigate(REGISTER);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        setPasswordSubmitted(false);
        showAlert({ msg: 'An error has occured' });
      });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateUserData({ isOtpVerified: false }));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  useEffect(() => {
    if (!email || !isOtpVerified) {
      isAuthenticated ? navigate(HOME) : navigate(LOGIN);
    }
  }, [email, isAuthenticated, isOtpVerified]);

  return (
    <section className='flex flex-col h-full items-center justify-center'>
      <MdLocalLibrary className='w-[100px] h-[100px] text-current' />
      <h1 className='text-2xl font-semibold'>Reset Password</h1>

      <form onSubmit={handleSubmit} className='flex flex-col'>
        <FormInput
          readOnly
          type='email'
          label='Email'
          value={email}
          inputID='email'
          inputName='email'
          spellCheck={false}
          autoComplete='username'
          extraLabelClassNames='mt-[15px] hidden'
        />

        <FormInput
          required
          type='password'
          label='Password'
          inputID='password'
          inputName='password'
          inputRef={passwordRef}
          placeholder='Enter your new password'
          extraLabelClassNames='mt-[15px]'
        />

        <FormInput
          required
          type='password'
          label='Confirm Password'
          inputID='confirm-password'
          inputName='confirm-password'
          inputRef={confirmPasswordRef}
          placeholder='Confirm your new password'
          extraLabelClassNames='mt-[15px]'
        />

        <AuthButton
          type='submit'
          title='Submit'
          disabled={isLoading || passwordSubmitted}
          isLoading={isLoading || passwordSubmitted}
        />
      </form>
    </section>
  );
};

export default ResetPassword;
