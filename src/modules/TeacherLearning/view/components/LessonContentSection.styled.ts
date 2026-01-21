import styled from 'styled-components';

export const LessonTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;

  .lesson-title {
    font-size: 22px;
    font-weight: 600;
  }

  .lesson-description {
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    white-space: pre-wrap; /* Preserve whitespace from editor */
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
`;
