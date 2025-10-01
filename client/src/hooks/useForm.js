import { useState } from 'react';
import { toast } from '../components/ui';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Gestion des différents types de champs
    const newValue = type === 'checkbox' 
      ? checked 
      : type === 'file' 
        ? files[0] 
        : value;

    setValues({
      ...values,
      [name]: newValue,
    });

    // Validation en temps réel (optionnel)
    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: newValue,
      });
      setErrors({
        ...errors,
        [name]: validationErrors[name],
      });
    }
  };

  const handleSubmit = async (callback) => {
    try {
      setIsSubmitting(true);
      
      // Validation avant soumission
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
          toast.error('Veuillez corriger les erreurs dans le formulaire');
          return;
        }
      }
      
      await callback(values);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setErrors,
  };
};

export const useFormField = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return {
    value,
    error,
    onChange,
    setError,
    setValue,
    bind: {
      value,
      onChange,
    },
  };
};
