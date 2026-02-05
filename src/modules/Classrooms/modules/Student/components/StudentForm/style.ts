import styled from 'styled-components';

export const AddStudentWrapper = styled.div`
  .image-container {
    .border-full {
      border-radius: 50%;
      width: 120px;
      height: 120px;
      object-fit: contain;
    }
  }

  .border-full {
    border-radius: 50%;
  }

  .edit-avatar-btn {
    position: relative;
    right: -30px;
    bottom: -40px;
    box-shadow: none;
  }

  .profile-pic-spin-wrapper {
    .ant-spin-nested-loading > div > .ant-spin {
      .ant-spin-dot {
        position: absolute;
        inset-inline-start: 50% !important;
      }
    }
  }

  .form-btn-wrapper {
    display: flex;
    gap: 15px;
    margin-top: 24px;
    justify-content: flex-end;

    button {
      min-width: 172px;
      max-width: 200px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
      button {
        min-width: 100%;
        max-width: 100%;
      }
    }
  }
`;
