import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useFormValidation } from 'hooks/useFormValidation';
import { useNavigate, useParams } from 'react-router-dom';

import { IMAGE_URL } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';
import { capitalizeFirstLetterWhileTyping, showToaster } from 'utils/functions';

import { classroomQueryKeys } from 'services/classroom';
import { commonHooks } from 'services/common';
import { IUploadImageReq } from 'services/common/types';
import { manageStudentHooks, manageStudentQueryKeys } from 'services/manageStudent';
import { ICreateStudentReq, IUpdateStudentReq } from 'services/manageStudent/types';

interface UseStudentFormProps {
  isEditMode?: boolean;
}

export const useStudentForm = ({ isEditMode = false }: UseStudentFormProps = {}) => {
  const { classroomId, studentId } = useParams<{ classroomId: string; studentId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageName, setImageName] = useState<string>('');
  const [imageShow, setImageShow] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const { isFormValid, onFieldsChange } = useFormValidation(form);

  // Edit mode: fetch student data (only when in edit mode and studentId exists)
  const { data, isLoading, isError, error } = manageStudentHooks.useGetStudentById(
    studentId ? studentId : ''
  );

  // Mutations
  const { mutate: mutateCreateStudent, isPending: isCreatePending } =
    manageStudentHooks.useCreateStudent();
  const { mutate: mutateUpdateStudent, isPending: isUpdatePending } =
    manageStudentHooks.useUpdateStudent();
  const { mutate: mutateImageUpload, isPending: isProfilePicUploadPending } =
    commonHooks.useImageUpload();

  const isPending = isEditMode ? isUpdatePending : isCreatePending;

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message);
    }
  }, [isError, error]);

  // Load student data into form (edit mode only)
  useEffect(() => {
    if (isEditMode && data && !isLoading) {
      // Handle nested data structure if present
      const student = data?.data;

      // Set profile photo
      if (student?.profile_photo) {
        const imgUrl = `${IMAGE_URL}scamper/${ImageTypeEnum.STUDENT}/${student?.profile_photo}`;
        setImageShow(imgUrl);
        setImageName(student?.profile_photo);
      } else {
        setImageShow('');
        setImageName('');
      }

      // Set form values - preserve original case for display
      form.setFieldsValue({
        first_name: student?.first_name || '',
        last_name: student?.last_name || '',
        email: student?.email || '',
        school_id: student?.student_school_id || ''
      });
    }
  }, [data, isLoading, form, isEditMode]);

  const handleCapitalizedChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const capitalized = capitalizeFirstLetterWhileTyping(e.target.value);
      form.setFieldsValue({ [fieldName]: capitalized });
    };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (selectedFile: File) => {
    const payload: IUploadImageReq = {
      files: selectedFile,
      moduleName: ImageTypeEnum.STUDENT
    };

    mutateImageUpload(payload, {
      onSuccess: (response) => {
        const imgUrl = `${IMAGE_URL}tmp-scamper/${ImageTypeEnum.STUDENT}/${response?.data?.[0]?.name}`;
        setImageShow(imgUrl);
        setImageName(response?.data?.[0]?.name);
      },
      onError: (error) => {
        const errMessage = error as any;
        showToaster(
          'error',
          errMessage?.message || 'An error occurred while uploading the profile image.'
        );
      }
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (!validTypes.includes(selectedFile.type)) {
      showToaster('error', 'Only JPG, JPEG, or PNG files are allowed.');
      return;
    }

    if (selectedFile.size > maxSizeInBytes) {
      showToaster('error', 'File size should not exceed 5 MB.');
      return;
    }
    handleImageUpload(selectedFile);
  };

  const onSubmit = (values: any) => {
    if (isEditMode) {
      // Update student
      const payload: IUpdateStudentReq = {
        student_id: studentId ? Number(studentId) : 0,
        first_name: values?.first_name?.trim(),
        last_name: values?.last_name?.trim() || '',
        student_school_id: values?.school_id?.trim() || '',
        profile_photo: imageName || undefined
      };

      mutateUpdateStudent(payload, {
        onSuccess: (response) => {
          showToaster('success', response.message || 'Student updated successfully');
          queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
          navigate(-1);
        },
        onError: (error) => {
          showToaster('error', error.message || 'Failed to update student');
        }
      });
    } else {
      // Create student
      const payload: ICreateStudentReq = {
        classroom_id: classroomId ? Number(classroomId) : 0,
        first_name: values?.first_name?.trim(),
        last_name: values?.last_name?.trim() || '',
        email: values?.email?.trim(),
        student_school_id: values?.school_id?.trim() || '',
        profile_photo: imageName || undefined
      };

      mutateCreateStudent(payload, {
        onSuccess: (response) => {
          showToaster('success', response.message || 'Student added successfully');
          queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
          navigate(-1);
        },
        onError: (error) => {
          showToaster('error', error.message || 'Failed to add student');
        }
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Show loader while fetching student data in edit mode
  if (isEditMode && isLoading) {
    return { isLoading: true };
  }

  return {
    navigate,
    form,
    isPending,
    isLoading: false,
    isFormValid,
    onFieldsChange,
    onSubmit,
    handleCapitalizedChange,
    handleFileChange,
    handleAvatarClick,
    fileInputRef,
    imageShow,
    isProfilePicUploadPending,
    isPreviewVisible,
    setIsPreviewVisible,
    handleCancel
  };
};
