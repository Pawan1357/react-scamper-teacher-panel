import React, { useEffect, useState } from 'react';

import { Button, Col, Form, Radio, Row, Typography } from 'antd';

import { showToaster } from 'utils/functions';

import { classroomHooks } from 'services/classroom';

import CommonModal from 'components/common/Modal/components/CommonModal';

import {
  CreateClassModalStyles,
  CreateClassModalWrapper,
  RadioOptionWrapper
} from './CreateClassModal.styled';

const { Text } = Typography;

export interface ICreateClassModalProps {
  open: boolean;
  onCancel: () => void;
  onSelectOption: (option: 'google' | 'excel') => void;
}

const CreateClassModal: React.FC<ICreateClassModalProps> = ({ open, onCancel, onSelectOption }) => {
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState<'google' | 'excel' | null>(null);

  const { mutate: getGoogleAuthUrl, isPending: isGoogleLoading } =
    classroomHooks.useGetGoogleClassroomAuthUrl({
      onSuccess: (response) => {
        // Handle different possible response structures
        // Based on IApiSuccess<{ auth_url: string }>, response should be { data: { auth_url: string } }
        const authUrl = response?.data?.auth_url;

        if (authUrl && typeof authUrl === 'string') {
          window.location.href = authUrl;
          sessionStorage.removeItem('GOOGLE_IMPORT_USED');
        } else {
          showToaster('error', 'Failed to get authentication URL');
        }
      },
      onError: (error) => {
        const errorMessage = error?.message || 'Failed to get authentication URL';
        showToaster('error', errorMessage);
      }
    });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      // Clear all form data and selections when modal closes
      form.resetFields();
      setSelectedOption(null);
    }
  }, [open, form]);

  const handleCancel = () => {
    // Clear all form data and selections
    form.resetFields();
    setSelectedOption(null);
    onCancel();
  };

  const handleOptionChange = (e: any) => {
    const value = e.target.value;
    setSelectedOption(value);
    form.setFieldsValue({ option: value });
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      if (values.option) {
        if (values.option === 'google') {
          // Call API to get Google Classroom auth URL using React Query mutation
          getGoogleAuthUrl();
        } else {
          // For Excel option, use the existing flow
          onSelectOption(values.option);
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleCreate ~ error:', error);
      // Form validation failed
    }
  };

  return (
    <CreateClassModalWrapper>
      <CreateClassModalStyles />
      <CommonModal
        open={open}
        onCancel={handleCancel}
        centered
        className="create-class-modal"
        closable={true}
        maskClosable={true}
        width={600}
        title="Create a Class"
        footer={
          <Row justify="end" className="flex-gap-20 m-0-imp">
            <Col className="p-0-imp">
              <Button
                onClick={handleCancel}
                size="middle"
                className="border-lg"
                type="default"
                htmlType="button"
                disabled={isGoogleLoading}
              >
                Cancel
              </Button>
            </Col>
            <Col className="p-0-imp">
              <Button
                type="primary"
                className="border-lg"
                size="middle"
                onClick={handleCreate}
                disabled={!selectedOption || isGoogleLoading}
                loading={isGoogleLoading}
              >
                Create
              </Button>
            </Col>
          </Row>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="option"
            rules={[
              {
                required: true,
                message: 'Please select an option'
              }
            ]}
          >
            <Radio.Group value={selectedOption} onChange={handleOptionChange}>
              <RadioOptionWrapper>
                <Radio value="google">
                  <div className="radio-content">
                    <Text strong className="radio-title">
                      Google Workspace for Education:
                    </Text>
                    <Text className="radio-description">
                      Do all students have Google accounts provided by your school? If they use
                      Google apps such as Gmail, Slides and Docs with their school email, then this
                      option will work.
                    </Text>
                  </div>
                </Radio>
              </RadioOptionWrapper>
              <RadioOptionWrapper>
                <Radio value="excel">
                  <div className="radio-content">
                    <Text strong className="radio-title">
                      Upload an Excel with Account Information:
                    </Text>
                    <Text className="radio-description">
                      As the teacher, you will need to enter in student information.
                    </Text>
                  </div>
                </Radio>
              </RadioOptionWrapper>
            </Radio.Group>
          </Form.Item>
        </Form>
      </CommonModal>
    </CreateClassModalWrapper>
  );
};

export default CreateClassModal;
