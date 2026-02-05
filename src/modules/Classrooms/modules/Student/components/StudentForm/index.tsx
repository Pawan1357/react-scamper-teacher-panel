import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Image, Row, Spin } from 'antd';

import { INPUTS, MAX_TEXT_LENGTH, VALIDATION_MESSAGES } from 'utils/constants';
import { REGEX } from 'utils/regex';

import { RenderTextInput } from 'components/common/FormField';
import { Loader } from 'components/common/Loader';

import { useStudentForm } from '../../hooks/useStudentForm';
import { AddStudentWrapper } from './style';

interface StudentFormProps {
  isEditMode?: boolean;
}

const StudentForm = ({ isEditMode = false }: StudentFormProps) => {
  const hook = useStudentForm({ isEditMode });

  // Show loader while fetching student data in edit mode
  if (hook.isLoading) {
    return <Loader />;
  }

  const {
    form,
    onFieldsChange,
    onSubmit,
    isPending,
    handleCapitalizedChange,
    handleFileChange,
    handleAvatarClick,
    fileInputRef,
    imageShow,
    isProfilePicUploadPending,
    isPreviewVisible,
    setIsPreviewVisible,
    handleCancel
  } = hook;

  return (
    <AddStudentWrapper className="mt-20">
      <div className="shadow-paper mt-0-imp card-padding">
        <Form onFieldsChange={onFieldsChange} onFinish={onSubmit} form={form} autoComplete="off">
          <div className="flex-gap-24 flex-column">
            <div className="relative inline-block text-center profile-pic-spin-wrapper">
              <Spin spinning={isProfilePicUploadPending}>
                {imageShow ? (
                  <Image
                    className="border-full"
                    wrapperClassName="image-container"
                    src={imageShow}
                    preview={{
                      visible: isPreviewVisible,
                      onVisibleChange: (visible) => setIsPreviewVisible(visible)
                    }}
                  />
                ) : (
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className="border-4 border-white shadow-lg cursor-pointer"
                  />
                )}
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<EditOutlined />}
                  style={{
                    position: 'relative',
                    right: 30,
                    bottom: -40,
                    boxShadow: 'none'
                  }}
                  htmlType="button"
                  onClick={handleAvatarClick}
                />
              </Spin>
              <input
                id="profile-upload"
                name="profile_photo"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <Row gutter={[34, 34]}>
              <RenderTextInput
                colProps={{ md: 12, xs: 24 }}
                formItemProps={{
                  name: 'first_name',
                  label: INPUTS.LABEL.FIRST_NAME,
                  required: true,
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: VALIDATION_MESSAGES.FIRST_NAME.REQUIRED
                    },
                    {
                      pattern: REGEX.BLANK_SPACE,
                      message: 'Please enter valid first name.'
                    },
                    {
                      max: MAX_TEXT_LENGTH.FIRST_NAME,
                      message: VALIDATION_MESSAGES.MAX_LENGTH.FIRST_NAME
                    }
                  ]
                }}
                inputProps={{
                  size: 'large',
                  placeholder: INPUTS.PLACEHOLDER.COMMON.FIRST_NAME,
                  disabled: isPending,
                  onChange: handleCapitalizedChange?.('first_name')
                }}
              />

              <RenderTextInput
                colProps={{ md: 12, xs: 24 }}
                formItemProps={{
                  name: 'last_name',
                  label: INPUTS.LABEL.LAST_NAME,
                  validateFirst: true,
                  rules: [
                    {
                      pattern: REGEX.BLANK_SPACE,
                      message: 'Please enter valid last name.'
                    },
                    {
                      max: MAX_TEXT_LENGTH.LAST_NAME,
                      message: VALIDATION_MESSAGES.MAX_LENGTH.LAST_NAME
                    }
                  ]
                }}
                inputProps={{
                  size: 'large',
                  placeholder: INPUTS.PLACEHOLDER.COMMON.LAST_NAME,
                  disabled: isPending,
                  onChange: handleCapitalizedChange?.('last_name')
                }}
              />

              <RenderTextInput
                colProps={{ md: 12, xs: 24 }}
                formItemProps={{
                  name: 'email',
                  label: INPUTS.LABEL.EMAIL,
                  required: true,
                  rules: [
                    {
                      required: true,
                      message: VALIDATION_MESSAGES.EMAIL.REQUIRED
                    },
                    {
                      type: 'email',
                      message: VALIDATION_MESSAGES.EMAIL.INVALID.MESSAGE
                    }
                  ]
                }}
                inputProps={{
                  size: 'large',
                  placeholder: INPUTS.PLACEHOLDER.COMMON.EMAIL,
                  disabled: isPending || isEditMode,
                  onChange: (e) => {
                    if (form) {
                      form.setFieldsValue({ email: e.target.value });
                    }
                  }
                }}
              />

              <RenderTextInput
                colProps={{ md: 12, xs: 24 }}
                formItemProps={{
                  name: 'school_id',
                  label: INPUTS.LABEL.SCHOOL_ID,
                  required: false,
                  validateFirst: true,
                  rules: [
                    {
                      pattern: REGEX.BLANK_SPACE,
                      message: 'Please enter school id.'
                    },
                    {
                      max: 50,
                      message: 'Please enter valid school id.'
                    }
                  ]
                }}
                inputProps={{
                  size: 'large',
                  placeholder: INPUTS.PLACEHOLDER.SCHOOL_ID,
                  disabled: isPending
                }}
              />
            </Row>
          </div>

          <Row className="form-btn-wrapper" justify="end">
            <Button
              className="border-md pt-12 pb-12"
              type="default"
              size="large"
              htmlType="button"
              onClick={handleCancel}
              disabled={isPending || isProfilePicUploadPending}
            >
              Cancel
            </Button>
            <Button
              className="border-md pt-12 pb-12"
              type="primary"
              size="large"
              htmlType="submit"
              disabled={isPending || isProfilePicUploadPending}
              loading={isPending}
            >
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Row>
        </Form>
      </div>
    </AddStudentWrapper>
  );
};

export default StudentForm;
