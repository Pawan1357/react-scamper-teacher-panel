import { createGlobalStyle, styled } from 'styled-components';

export const AddClassNameModalWrapper = styled.div``;

export const AddClassNameModalStyles = createGlobalStyle`
  .ant-modal.common-modal.add-class-name-modal {
    .ant-modal-content {
      .ant-modal-header {
        border-bottom: 1px solid #f0f0f0 !important;
        padding-bottom: 16px !important;
        margin-bottom: 24px !important;

        .ant-modal-title {
          text-align: left !important;
          font-weight: 700 !important;
        }
      }
    }

   
  }
`;

export const DownloadTemplateLink = styled.a`
  display: inline-block;
  margin-top: 16px;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
`;

export const FileDisplayWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fafafa;
  margin-bottom: 24px;
`;
