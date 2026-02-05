import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const LedgerTitleWrapper = styled.span`
  font-size: 24px;
  font-weight: 600;
  display: block;
`;

// Global style to override modal title
export const LedgerModalGlobalStyle = createGlobalStyle`
  .ledger-modal {
    .ant-modal {
      max-width: 1000px;
    }

    .ant-modal-content {
      box-shadow: 0px 10px 15px -3px #00000014;
      border-radius: 16px;

      @media (max-width: 768px) {
        padding: 20px 16px !important;
      }

      @media (max-width: 480px) {
        padding: 16px 12px !important;
      }
    }

    .ant-modal-header {
      margin-bottom: 50px;
      
      .ant-modal-title {
        font-size: 24px !important;
        font-weight: 600 !important;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        margin-bottom: 30px;
        
        .ant-modal-title {
          font-size: 20px !important;
        }
      }

      @media (max-width: 480px) {
        margin-bottom: 24px;
        
        .ant-modal-title {
          font-size: 18px !important;
        }
      }
    }

    .ant-modal-close {
      &:hover {
        background-color: transparent;
      }
    }
  }
`;

export const LedgerLegendWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const LedgerLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .color-box {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    flex-shrink: 0;
    box-shadow: 0px 4px 6px -2px #0000000a;
  }

  .legend-text {
    font-weight: 500;
    font-size: 16px;
    color: #0f1b53;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    gap: 14px;

    .color-box {
      width: 40px;
      height: 40px;
    }

    .legend-text {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;

    .color-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }

    .legend-text {
      font-size: 14px;
      white-space: normal;
    }
  }
`;
