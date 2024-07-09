import { useAppSelector } from './useRootStorage';

const useAdmin = (): boolean => {
  const { role } = useAppSelector(state => state.userStore.currentUser);

  return role !== 'USER';
};

export default useAdmin;
