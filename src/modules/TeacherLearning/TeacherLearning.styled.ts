import styled from 'styled-components';

export const TeacherLearningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const OverviewBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: 35px;

  .learning-details-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  p {
    margin: 0;
    color: #01132a;
    line-height: 24px;
  }
`;

export const LearningDetailsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 70px;
  row-gap: 35px;

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .detail-label {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
    }

    .detail-value {
      font-size: 16px;
      font-weight: 400;
      color: #01132a;
    }

    .view-link-btn {
      width: fit-content;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LessonListWrapper = styled.div`
  padding: 40px 73px !important;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
