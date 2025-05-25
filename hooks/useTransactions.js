import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setTransactions } from '../redux/slices/transactionsSlice';
import { fetchTransactions } from '../services/supabase';

export const useTransactions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { movements, loading, error } = useSelector((state) => state.transactions);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id) return;
      
      // Si ya tenemos transacciones, no las volvemos a cargar
      if (movements.length > 0) return;
      
      dispatch(setLoading(true));
      const { data, error } = await fetchTransactions({ userId: user.id });
      
      if (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return;
      }
      
      dispatch(setTransactions(data));
      dispatch(setLoading(false));
    };

    loadTransactions();
  }, [user?.id, dispatch, movements.length]);

  return { movements, loading, error };
}; 