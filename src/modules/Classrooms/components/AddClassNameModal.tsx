import React, { useEffect, useRef, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import { ROUTES } from 'utils/constants/routes';
import { showToaster } from 'utils/functions';
import { REGEX } from 'utils/regex';

import { RenderTextInput } from 'components/common/FormField';
import CommonModal from 'components/common/Modal/components/CommonModal';

import {
  AddClassNameModalStyles,
  AddClassNameModalWrapper,
  FileDisplayWrapper
} from './AddClassNameModal.styled';

const { Text } = Typography;

export interface IAddClassNameModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  downloadTemplatePath?: string;
  initialClassName?: string;
}

const AddClassNameModal: React.FC<IAddClassNameModalProps> = ({
  open,
  onCancel,
  onSubmit,
  downloadTemplatePath,
  initialClassName = ''
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      form.setFieldsValue({ className: initialClassName });
    } else {
      // Clear all form data, selections, and file when modal closes
      form.resetFields();
      setSelectedFile(null);
      setIsLoading(false);
      setIsSubmitLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, form, initialClassName]);

  const handleCancel = () => {
    // Prevent closing during loading/upload
    if (isLoading || isSubmitLoading) return;

    // Clear all form data, selections, and file
    form.resetFields();
    setSelectedFile(null);
    setIsLoading(false);
    setIsSubmitLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - only Excel files
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12' // .xlsm
    ];

    const validExtensions = ['.xlsx', '.xls', '.xlsm'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      showToaster('error', 'Please upload only Excel files (.xlsx, .xls, .xlsm)');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Set loading state immediately
    setIsLoading(true);

    // Use setTimeout to ensure React has time to render the loading state
    setTimeout(async () => {
      try {
        // Parse and validate that the file has at least one record and required columns
        const { data: parsedData, headers } = await parseExcelFile(file);

        // Validate columns using actual headers from worksheet
        const columnValidation = validateColumns(parsedData, headers);
        if (!columnValidation.isValid) {
          showToaster('error', columnValidation.errorMessage || 'Invalid file format.');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setIsLoading(false);
          return;
        }

        // Store file locally only if validation passes
        setSelectedFile(file);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        showToaster('error', 'Failed to parse Excel file. Please check the file format.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsLoading(false);
      }
    }, 500);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setIsLoading(false);
    setIsSubmitLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseExcelFile = (file: File): Promise<{ data: any[]; headers: string[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Get column headers directly from the first row of the worksheet
          const rawData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
          }) as any[][];

          // Extract headers from the first row
          const headers: string[] =
            rawData.length > 0 ? rawData[0].map((h) => String(h || '').trim()) : [];

          // Parse the data normally
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          resolve({ data: jsonData, headers: headers.filter((h) => h !== '') });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsBinaryString(file);
    });
  };

  const validateColumns = (
    parsedData: any[],
    headers: string[]
  ): { isValid: boolean; errorMessage?: string } => {
    // Check if file has no data rows at all
    if (!parsedData || parsedData.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Please upload file with at least one record.'
      };
    }

    const columnNames = headers;

    // Define primary required columns (exact case-sensitive match required)
    const primaryColumns = ['First Name', 'Last Name', 'Email'];

    // Check which primary columns are present (case-sensitive exact match)
    const missingColumns: string[] = [];
    console.log('🚀 ~ validateColumns ~ missingColumns:', missingColumns);

    primaryColumns.forEach((col) => {
      if (!columnNames.includes(col)) {
        missingColumns.push(col);
      }
    });

    // If no primary columns are found at all, suggest downloading sample file
    if (missingColumns.length === primaryColumns.length) {
      return {
        isValid: false,
        errorMessage: 'Invalid file format. Please upload a file using the sample template.'
      };
    }

    // If any primary column is missing, show error
    if (missingColumns.length > 0) {
      return {
        isValid: false,
        errorMessage: `The following required columns are missing: ${missingColumns.join(', ')} (case-sensitive).`
      };
    }

    return { isValid: true };
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const className = values?.className;

      if (!selectedFile) {
        showToaster('error', 'Please upload an Excel file.');
        return;
      }

      // Set loading state immediately
      setIsSubmitLoading(true);

      // Use setTimeout to ensure React has time to render the loading state
      setTimeout(async () => {
        try {
          // Parse the file again to get fresh data for sessionStorage
          const { data: parsedData } = await parseExcelFile(selectedFile);

          // Store parsed data in sessionStorage for ImportSummary to access
          sessionStorage.setItem('studentImportData', JSON.stringify(parsedData));
          sessionStorage.setItem('studentImportClassName', className);

          // Store file in sessionStorage as base64 for API call
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            sessionStorage.setItem('studentImportFile', base64);
            sessionStorage.setItem('studentImportFileName', selectedFile.name);
            setIsSubmitLoading(false);

            // Navigate to import summary page
            const fileName = encodeURIComponent(selectedFile.name);
            navigate(ROUTES.classroom.importSummary(fileName));

            // Call onSubmit callback if provided
            if (onSubmit) {
              onSubmit();
            }
          };
          reader.onerror = () => {
            setIsSubmitLoading(false);
            showToaster('error', 'Failed to read file. Please try again.');
          };
          reader.readAsDataURL(selectedFile);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          showToaster('error', 'Failed to parse Excel file. Please check the file format.');
          setIsSubmitLoading(false);
        }
      }, 500);
    } catch (error) {
      // Form validation failed
    }
  };

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadTemplatePath) {
      window.open(downloadTemplatePath, '_blank');
    }
  };

  return (
    <AddClassNameModalWrapper>
      <AddClassNameModalStyles />
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.xlsm"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <CommonModal
        open={open}
        onCancel={handleCancel}
        closable={!isLoading && !isSubmitLoading}
        maskClosable={false}
        centered={true}
        width={600}
        title="Add Class Name"
        className="add-class-name-modal"
        footer={
          selectedFile ? (
            <Row justify="end" className="flex-gap-20 m-0-imp">
              <Col className="p-0-imp">
                <Button
                  onClick={handleCancel}
                  size="middle"
                  className="border-lg"
                  type="default"
                  htmlType="button"
                  disabled={isLoading || isSubmitLoading}
                >
                  Cancel
                </Button>
              </Col>
              <Col className="p-0-imp">
                <Button
                  type="primary"
                  className="border-lg"
                  size="middle"
                  onClick={handleSubmit}
                  loading={isSubmitLoading}
                  disabled={isLoading || isSubmitLoading}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          ) : null
        }
      >
        <div className="w-100 flex-gap-20 flex-column align-items-center justify-content-center">
          <Form form={form} layout="vertical" className="w-100">
            <RenderTextInput
              formItemProps={{
                name: 'className',
                label: 'Class Name',
                required: true,
                rules: [
                  {
                    required: true,
                    message: 'Please enter class name.'
                  },
                  {
                    pattern: REGEX.BLANK_SPACE,
                    message: 'Please enter valid class name.'
                  }
                ]
              }}
              inputProps={{
                maxLength: 50,
                placeholder: 'Enter class name',
                size: 'large',
                style: { width: '100%' }
              }}
            />
          </Form>

          {!selectedFile ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                marginTop: '16px'
              }}
            >
              {downloadTemplatePath && (
                <Button
                  type="default"
                  className="cta-btn cancel-btn"
                  onClick={handleDownloadTemplate}
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  Download Sample Template
                </Button>
              )}
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <Button
                  type="default"
                  className="cta-btn cancel-btn"
                  onClick={handleCancel}
                  style={{ flex: 1 }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="cta-btn ok-btn"
                  onClick={handleUploadClick}
                  style={{ flex: 1 }}
                  loading={isLoading}
                >
                  Upload File
                </Button>
              </div>
            </div>
          ) : (
            <FileDisplayWrapper>
              <Text
                strong
                style={{
                  fontSize: '14px',
                  color: 'var(--dark-color)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginRight: '12px'
                }}
              >
                {selectedFile.name}
              </Text>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemove}
                size="small"
                style={{
                  flexShrink: 0
                }}
              />
            </FileDisplayWrapper>
          )}
        </div>
      </CommonModal>
    </AddClassNameModalWrapper>
  );
};

export default AddClassNameModal;
