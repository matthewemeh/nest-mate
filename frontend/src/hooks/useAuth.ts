import { useAppSelector } from './useRootStorage';

const useAuth = (): boolean => {
  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { role } = useAppSelector(state => state.userStore.currentUser);

  return isAuthenticated && role !== 'USER';
};

export default useAuth;
