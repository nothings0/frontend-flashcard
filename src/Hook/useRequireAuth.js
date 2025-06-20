import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate, accessToken]);
};