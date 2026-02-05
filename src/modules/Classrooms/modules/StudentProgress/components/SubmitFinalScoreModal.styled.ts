import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const ModalTitleWrapper = styled.span`
  font-size: 24px;
  font-weight: 600;
  display: block;
`;

// Global style to override modal title
export const SubmitFinalScoreModalGlobalStyle = createGlobalStyle`
  .submit-final-score-modal {
    .ant-modal {
      max-width: 1200px;
    }

    .ant-modal-content {
      @media (max-width: 768px) {
        padding: 20px 16px !important;
      }

      @media (max-width: 480px) {
        padding: 16px 12px !important;
      }
    }

    .ant-modal-header {
      margin-bottom: 24px;
      
      .ant-modal-title {
        font-size: 24px !important;
        font-weight: 600 !important;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        margin-bottom: 16px;
        
        .ant-modal-title {
          font-size: 20px !important;
        }
      }

      @media (max-width: 480px) {
        margin-bottom: 12px;
        
        .ant-modal-title {
          font-size: 18px !important;
        }
      }
    }
  }
`;

export const ModalRubricTableWrapper = styled.section`
  overflow-x: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  -webkit-overflow-scrolling: touch;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
  }

  th,
  td {
    padding: 18px 16px;
    text-align: center;
    border: 1px solid rgba(41, 57, 128, 0.08);
    vertical-align: top;
  }

  thead th {
    font-weight: 700;
    color: #ffffff;
  }

  thead th:nth-child(1) {
    background: #fcb21d;
    color: #ffffff;
  }

  thead th:nth-child(2) {
    background: #a0d867;
    color: #ffffff;
  }

  thead th:nth-child(3) {
    background: #87b8dc;
    color: #ffffff;
  }

  thead th:nth-child(4) {
    background: #9a5fda;
    color: #ffffff;
  }

  thead th:nth-child(5) {
    background: #e61e9a;
    color: #ffffff;
  }

  thead th:nth-child(6) {
    background: #1d3c63;
    color: #ffffff;
  }

  thead th:nth-child(7) {
    background: #1d3c63;
    color: #ffffff;
  }

  thead tr:nth-child(2) {
    td {
      background: rgba(15, 27, 83, 0.05);
      font-weight: 600;
      color: #0f1b53;
      border-top: 1px solid rgba(41, 57, 128, 0.08);
    }

    td:nth-child(1),
    td:nth-child(7) {
      background: rgba(15, 27, 83, 0.05);
    }
  }

  tbody th {
    background: rgba(31, 59, 179, 0.08);
    font-weight: 600;
  }

  tbody td {
    .ant-select {
      .ant-select-selector {
        border-radius: 8px;
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 16px;
    margin-bottom: 16px;

    table {
      min-width: 800px;
      border-radius: 12px;
    }

    th,
    td {
      padding: 12px 10px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    margin-top: 12px;
    margin-bottom: 12px;

    table {
      min-width: 700px;
      border-radius: 8px;
    }

    th,
    td {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

export const TotalScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  color: #0f1b53;

  .score-box {
    background: #1d3c63;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    min-width: 120px;
    text-align: center;
  }

  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: wrap;

    .score-box {
      padding: 10px 20px;
      min-width: 100px;
      font-size: 14px;
    }

    span {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .score-box {
      padding: 8px 16px;
      min-width: 80px;
      font-size: 12px;
    }

    span {
      font-size: 12px;
    }
  }
`;

export const ModalFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 24px;

  .buttons-wrapper {
    display: flex;
    gap: 12px;
  }

  .ant-btn {
    min-width: 248px;
    border-radius: 8px;
    font-weight: 500;

    &:first-child {
      background: transparent;
      border: 1px solid rgba(15, 27, 83, 0.2);
      color: #0f1b53;

      &:hover {
        border-color: rgba(15, 27, 83, 0.4);
      }
    }

    &:last-child {
      background: #1d3c63;
      border-color: #1d3c63;
      color: #ffffff;

      &:hover {
        background: #2a4f7a;
        border-color: #2a4f7a;
      }
    }
  }

  @media (max-width: 840px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-top: 20px;

    .buttons-wrapper {
      flex-direction: column;
      width: 100%;
      gap: 12px;
    }

    .ant-btn {
      min-width: unset;
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 16px;

    .buttons-wrapper {
      gap: 10px;
    }
  }
`;
