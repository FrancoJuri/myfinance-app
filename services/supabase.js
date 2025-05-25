import { supabase } from '../lib/supabase.js';

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const fetchCategories = async ({ userId, setCategories, setLoading }) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .eq('user_id', userId)
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return
    }

    setCategories(data)
    setLoading(false)
  } catch (error) {
    console.error('Error:', error)
    setLoading(false)
  }
}

export const createCategory = async ({ userId, name, color }) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          color: color
        }
      ])
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating category:', error)
    return { data: null, error }
  }
}

export const deleteCategory = async ({ categoryId }) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error }
  }
}

export const createTransaction = async ({ userId, amount, categoryId, note }) => {
  try {
    // Convertir la coma a punto decimal y asegurar que sea un número con 2 decimales
    const cleanAmount = amount.toString().replace(',', '.');
    const numericAmount = parseFloat(parseFloat(cleanAmount).toFixed(2));

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          amount: numericAmount,
          category_id: categoryId,
          note: note?.trim() || null,
          type: 'expense'
        }
      ])
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { data: null, error }
  }
}

export const fetchTransactions = async ({ userId }) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          name,
          color
        )
      `)
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
}

export default supabase; 