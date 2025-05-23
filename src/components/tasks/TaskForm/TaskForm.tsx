import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Task, TaskStatus } from '@/models/task.model';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Select, SelectOption } from '@/components/ui/Select/Select';
import { Button } from '@/components/ui/Button/Button';
import { isFuture, parseISO, format, startOfToday } from 'date-fns';
import styles from './TaskForm.module.css';


export interface TaskFormData {
  title: string;
  description?: string;
  dueDate: string; 
  status: TaskStatus;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>; 
  onCancel: () => void;
  initialData?: Task; 
  isEditing?: boolean;
  isLoading?: boolean; 
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }, 
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'), 
      status: TaskStatus.ToDo,
    },
  });

  
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        
        dueDate: initialData.dueDate ? format(parseISO(initialData.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        status: initialData.status,
      });
    } else {
      
      reset({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        status: TaskStatus.ToDo,
      });
    }
  }, [initialData, reset]);

  const statusOptions: SelectOption[] = Object.values(TaskStatus).map(s => ({
    value: s,
    label: s,
  }));

  const handleFormSubmit: SubmitHandler<TaskFormData> = async (data) => {
    await onSubmit(data);
    if (!isEditing) { 
      reset(); 
    }
  };

  const today = startOfToday();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.taskForm} noValidate>
      <Input
        label="Titre de la tâche"
        id="title"
        {...register('title', { required: 'Le titre est requis.' })}
        errorMessage={errors.title?.message}
        disabled={isLoading || isSubmitting}
      />

      <Textarea
        label="Description (optionnel)"
        id="description"
        {...register('description')}
        rows={4}
        disabled={isLoading || isSubmitting}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{
          required: "La date d'échéance est requise.",
          validate: (value) => {
            const selectedDate = parseISO(value); 
            return isFuture(selectedDate) || format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') || "La date d'échéance doit être aujourd'hui ou dans le futur.";
          }
        }}
        render={({ field }) => (
          <Input
            label="Date d'échéance"
            id="dueDate"
            type="date"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.dueDate?.message}
            disabled={isLoading || isSubmitting}
            min={format(new Date(), 'yyyy-MM-dd')} 
          />
        )}
      />

      {isEditing && ( 
        <Controller
          name="status"
          control={control}
          rules={{ required: 'Le statut est requis.' }}
          render={({ field }) => (
            <Select
              label="Statut"
              id="status"
              options={statusOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.status?.message}
              disabled={isLoading || isSubmitting}
            />
          )}
        />
      )}
      <div className={styles.formActions}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading || isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading || isSubmitting} disabled={isLoading || isSubmitting}>
          {isEditing ? 'Mettre à jour' : 'Enregistrer la tâche'}
        </Button>
      </div>
    </form>
  );
};