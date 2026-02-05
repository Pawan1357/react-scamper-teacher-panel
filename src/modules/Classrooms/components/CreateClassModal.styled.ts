import { createGlobalStyle, styled } from 'styled-components';

export const CreateClassModalWrapper = styled.div``;

export const CreateClassModalStyles = createGlobalStyle`
  .ant-modal.common-modal.create-class-modal {
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

    .ant-radio-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
`;

export const RadioOptionWrapper = styled.div`
  .ant-radio-wrapper {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    transition: all 0.3s;
    width: 100%;
    margin: 0;
    background-color: #ffffff;

    &:hover {
      border-color: #40a9ff;
    }

    &.ant-radio-wrapper-checked {
      border-color: #1890ff;
      background-color: #f0f8ff;
    }

    .ant-radio {
      margin-top: 6px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .radio-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .radio-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--dark-color);
        line-height: 24px;
        margin: 0;
      }

      .radio-description {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        margin: 0;
      }
    }
  }

  .ant-radio-wrapper .ant-radio {
    align-self: flex-start;
  }
`;
