import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useRequireAuth = () => {
  const navigate = useNavigate();
    const accessToken = useSelector(state => state.user.currentUser?.accessToken);
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate, accessToken]);
};