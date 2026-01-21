import styled from 'styled-components';

export const ActivityTableWrapper = styled.div`
  .ant-table {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #f0f0f0 !important;
  }

  .ant-table-thead > tr > th {
    background: #fafbfc;
    font-weight: 600;
    color: #01132a;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #e5e7eb;
  }
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8faff;
  }

  .learning-action-btn {
    color: #ffffff;
    background: #2798cd;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    border-radius: 12px;

    &:hover {
      background: rgb(36, 145, 196) !important;
    }
  }
`;
