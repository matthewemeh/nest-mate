import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { PATHS } from 'routes/PathConstants';
import { useRegisterMutation } from 'services/apis/userApi/userStoreApi';

import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';
import { addClass, handleReduxQueryError, removeClass } from 'utils';

import Constants from 'Constants';
import RiUser3Line from 'assets/ri-user-3-line.svg';

const Register = () => {
  const { LOGIN, VERIFY_OTP } = PATHS;
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const profileImagePreviewRef = useRef<HTMLImageElement>(null);
  const [register, { error: error, isError: isError, isLoading: isLoading, isSuccess: isSuccess }] =
    useRegisterMutation();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const name: string = nameRef.current!.value;
    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;
    const profileImage: File | undefined = profileImageRef.current!.files?.[0];

    register({ email, password, name, profileImage });
  };

  const updatePreviewImage = (imageFile?: File | null) => {
    const imageTag: HTMLImageElement = profileImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
        removeClass(imageTag, 'p-1.5');
      });
    } else {
      imageTag.src = RiUser3Line;
      addClass(imageTag, 'p-1.5');
    }
  };

  useEffect(() => {
    if (isSuccess) navigate(VERIFY_OTP);
  }, [isSuccess]);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

  return (
    <section className='flex flex-col h-full items-center justify-center'>
      <label htmlFor='profile-image' className='cursor-pointer'>
        <img
          alt=''
          src={RiUser3Line}
          ref={profileImagePreviewRef}
          className='w-[100px] h-[100px] text-current rounded-half bg-swan-white border-2 p-1.5'
        />
      </label>
      <h1 className='text-2xl font-semibold text-woodsmoke'>Get Started</h1>

      <form onSubmit={handleRegister} className='flex flex-col text-woodsmoke'>
        <FormInput
          required
          autoFocus
          type='text'
          label='Full Name'
          inputRef={nameRef}
          spellCheck={false}
          inputID='full-name'
          inputName='full-name'
          autoComplete='full-name'
          extraLabelClassNames='mt-8'
        />

        <FormInput
          required
          type='email'
          label='Email'
          inputID='email'
          inputName='email'
          spellCheck={false}
          inputRef={emailRef}
          autoComplete='username'
          extraLabelClassNames='mt-[15px]'
        />

        <FormInput
          required
          type='password'
          label='Password'
          inputID='password'
          inputName='password'
          inputRef={passwordRef}
          extraLabelClassNames='mt-[15px]'
        />

        <FormInput
          type='file'
          label='Profile Image'
          inputID='profile-image'
          onChange={e => {
            const imageFile: File | undefined = e.target.files?.[0];
            updatePreviewImage(imageFile);
          }}
          inputName='profile-image'
          inputRef={profileImageRef}
          accept={ACCEPTED_IMAGE_TYPES}
          extraLabelClassNames='mt-[15px]'
        />

        <AuthButton type='submit' title='Register' disabled={isLoading} isLoading={isLoading} />
        <span className='text-[15px] leading-5 text-center mt-2'>
          Already have an account?
          <Link to={LOGIN} className='ml-1.5 text-lightning-yellow-800 underline'>
            Sign in
          </Link>
        </span>
      </form>
    </section>
  );
};

export default Register;
