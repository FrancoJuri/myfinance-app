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

export default supabase; 