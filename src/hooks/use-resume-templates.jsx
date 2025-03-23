import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useResumeTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('resume_templates')
          .select('*')
          .or(`is_public.eq.true${user ? ',created_by.eq.' + user.id : ''}`);
          
        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setTemplates(data || []);
      } catch (err) {
        console.error('Error fetching resume templates:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const createTemplate = async (template) => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      setTemplates(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating resume template:', err);
      throw err;
    }
  };

  const updateTemplate = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTemplates(prev => prev.map(t => (t.id === id ? data : t)));
      return data;
    } catch (err) {
      console.error('Error updating resume template:', err);
      throw err;
    }
  };

  const deleteTemplate = async (id) => {
    try {
      const { error } = await supabase
        .from('resume_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting resume template:', err);
      throw err;
    }
  };

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}