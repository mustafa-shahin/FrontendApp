import { useReducer, useCallback } from 'react';

export interface FormField<T = unknown> {
  value: T;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: unknown }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; error: string }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof T; touched: boolean }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> }
  | { type: 'SET_DATA'; data: T }
  | { type: 'SET_SUBMITTING'; submitting: boolean }
  | { type: 'RESET_FORM'; initialData?: T }
  | { type: 'VALIDATE_FORM' };

export interface ValidationRule<T> {
  field: keyof T;
  validator: (value: T[keyof T], formData: T) => string | undefined;
}

export interface UseEntityFormOptions<T> {
  initialData: T;
  validationRules?: ValidationRule<T>[];
  onSubmit?: (data: T) => Promise<void> | void;
}

function createFormReducer<T>() {
  return function formReducer(
    state: FormState<T>,
    action: FormAction<T>
  ): FormState<T> {
    switch (action.type) {
      case 'SET_FIELD':
        return {
          ...state,
          data: { ...state.data, [action.field]: action.value },
          touched: { ...state.touched, [action.field]: true },
          isDirty: true,
        };

      case 'SET_FIELD_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.field]: action.error },
        };

      case 'SET_FIELD_TOUCHED':
        return {
          ...state,
          touched: { ...state.touched, [action.field]: action.touched },
        };

      case 'SET_ERRORS':
        return {
          ...state,
          errors: action.errors,
          isValid: Object.keys(action.errors).length === 0,
        };

      case 'SET_DATA':
        return {
          ...state,
          data: action.data,
          isDirty: false,
        };

      case 'SET_SUBMITTING':
        return {
          ...state,
          isSubmitting: action.submitting,
        };

      case 'RESET_FORM':
        return {
          data: action.initialData || state.data,
          errors: {},
          touched: {},
          isValid: true,
          isDirty: false,
          isSubmitting: false,
        };

      case 'VALIDATE_FORM':
        // Validation will be handled by the hook
        return state;

      default:
        return state;
    }
  };
}

export function useEntityForm<T extends Record<string, unknown>>(
  options: UseEntityFormOptions<T>
): {
  formState: FormState<T>;
  setField: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setData: (data: T) => void;
  resetForm: (newData?: T) => void;
  validateForm: () => boolean;
  handleSubmit: () => Promise<void>;
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    error?: string;
    touched?: boolean;
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
  };
} {
  const { initialData, validationRules = [], onSubmit } = options;

  const initialState: FormState<T> = {
    data: initialData,
    errors: {},
    touched: {},
    isValid: true,
    isDirty: false,
    isSubmitting: false,
  };

  const formReducer = createFormReducer<T>();
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const rule = validationRules.find((r) => r.field === field);
      if (rule) {
        return rule.validator(value, formState.data);
      }
      return undefined;
    },
    [validationRules, formState.data]
  );

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof T, string>> = {};

    validationRules.forEach((rule) => {
      const error = rule.validator(formState.data[rule.field], formState.data);
      if (error) {
        errors[rule.field] = error;
      }
    });

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  }, [validationRules, formState.data]);

  const setField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      dispatch({ type: 'SET_FIELD', field, value });

      // Validate field on change if it was previously touched
      if (formState.touched[field]) {
        const error = validateField(field, value);
        if (error) {
          dispatch({ type: 'SET_FIELD_ERROR', field, error });
        } else {
          dispatch({ type: 'SET_FIELD_ERROR', field, error: '' });
        }
      }
    },
    [formState.touched, validateField]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  }, []);

  const setData = useCallback((data: T) => {
    dispatch({ type: 'SET_DATA', data });
  }, []);

  const resetForm = useCallback((newData?: T) => {
    dispatch({ type: 'RESET_FORM', initialData: newData });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;

    const isValid = validateForm();
    if (!isValid) return;

    dispatch({ type: 'SET_SUBMITTING', submitting: true });

    try {
      await onSubmit(formState.data);
    } catch (error) {
      // Handle submission error
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', submitting: false });
    }
  }, [onSubmit, formState.data, validateForm]);

  const getFieldProps = useCallback(
    (field: keyof T) => {
      return {
        value: formState.data[field],
        error: formState.errors[field],
        touched: formState.touched[field],
        onChange: (value: T[keyof T]) => setField(field, value),
        onBlur: () => {
          dispatch({ type: 'SET_FIELD_TOUCHED', field, touched: true });
          const error = validateField(field, formState.data[field]);
          if (error) {
            dispatch({ type: 'SET_FIELD_ERROR', field, error });
          }
        },
      };
    },
    [formState, setField, validateField]
  );

  return {
    formState,
    setField,
    setFieldError,
    setData,
    resetForm,
    validateForm,
    handleSubmit,
    getFieldProps,
  };
}
