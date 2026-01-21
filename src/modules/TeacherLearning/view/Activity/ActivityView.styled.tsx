import { Card, Tag } from 'antd';
import { theme } from 'style/Theme';

import styled from 'styled-components';

export const ContentSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ActivityDetailsCard = styled(Card)`
  border-radius: 20px;

  .ant-card-body {
    padding: 32px 36px 36px;
  }

  .ant-collapse {
    border: none;
    background: transparent;
  }

  .ant-collapse-item {
    border: none;
    border-bottom: none;
  }

  .ant-collapse-header {
    padding: 0 !important;
    display: flex !important;
    flex-direction: row-reverse !important;
    align-items: center !important;
  }

  .ant-collapse-header-text {
    flex: 1;
    text-align: left;
  }

  .ant-collapse-expand-icon {
    margin-left: 0 !important;
    margin-right: 12px !important;
  }

  .ant-collapse-content {
    border-top: none;
  }

  .ant-collapse-content-box {
    padding: 0;
    padding-top: 24px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 24px;
    }
  }
`;

export const ActivityDetailsBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  p {
    font-size: 15px;
    line-height: 24px;
  }
`;

export const ActivityInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 50px;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  .info-item-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 1200px) {
    .info-item-wrapper {
      grid-template-columns: repeat(2, 1fr);
      column-gap: 34px;
      row-gap: 24px;
    }
  }

  @media (max-width: 768px) {
    .info-item-wrapper {
      grid-template-columns: repeat(1, 1fr);
      column-gap: 34px;
      row-gap: 24px;
    }
  }

  .info-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .info-label {
    font-size: 14px;
    line-height: 20px;
    color: #6d7bad;
    font-weight: 500;
  }

  .info-value {
    font-size: 16px;
    font-weight: 600;
  }

  .ant-tag {
    width: fit-content;
  }

  .type-tag {
    color: ${theme.color.primary};
  }
`;

export const CarouselContainer = styled.div`
  position: relative;
  margin: 16px 0;

  .slick-slide {
    width: fit-content !important;
  }

  .slick-slider {
    padding-bottom: 12px;
  }

  .slick-list {
    margin: 0 -12px;
  }

  .slick-dots li button {
    background: rgba(31, 59, 179, 0.25);
  }

  .slick-dots li.slick-active button {
    background: #1f3bb3;
  }
`;

export const CarouselImageCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  margin: 0 12px;

  .ant-image {
    width: 218px;
    height: 218px;
  }

  .ant-image-img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const QuestionSectionCard = styled(Card)`
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(37, 56, 115, 0.08);

  .ant-card-body {
    padding: 0;
  }

  .question-card-content {
    background: #c8eaf2;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 36px;
    border-radius: 10px;
    align-items: center;
  }
`;

export const QuestionCardWrapper = styled(Card)`
  border-radius: 12px;
  border: none;
  margin-bottom: 24px;

  .ant-card-body {
    padding: 40px 73px;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
`;

export const QuestionTitle = styled.h4`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  vertical-align: middle;
`;

export const QuestionDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const QuestionDescription = styled.p`
  text-align: center;
  vertical-align: middle;

  font-weight: 500;
  font-size: 17px;
  line-height: 28px;
  text-align: center;
  vertical-align: middle;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .mcq-option-item {
    width: 100%;
    display: flex;
    gap: 22px;
    align-items: center;
  }
`;

export const OptionItem = styled.div<{
  $isSelected?: boolean;
  $isCorrect?: boolean;
  $isIncorrect?: boolean;
}>`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: ${(props) => {
    if (props.$isCorrect) return '#f2fff3';
    if (props.$isIncorrect) return '#fff1f0';
    return '#f0f2f5';
  }};
  border: ${(props) => {
    if (props.$isCorrect) return '1px solid #68A729';
    if (props.$isIncorrect) return '1px solid #FF4D4F';
    if (props.$isSelected) return '1px solid #1d3c63';
    return 'none';
  }};
  transition: all 0.2s;

  img {
    flex-shrink: 0;
  }

  .text {
    flex: 1;
    white-space: normal;
    word-break: break-word;
  }

  .option-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #f0f0f0;
    flex-shrink: 0;
  }

  .option-image {
    flex-shrink: 0;
    border-radius: 8px;

    .ant-image-img {
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .option-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .ant-radio-wrapper {
    .ant-radio {
      .ant-radio-inner {
        width: 14px;
        height: 14px;
        border-width: 1px;
      }
    }

    .ant-radio-checked .ant-radio-inner {
      border-color: ${(props) => {
        if (props.$isCorrect) return '#68A729';
        if (props.$isIncorrect) return '#FF4D4F';
        return '#1d3c63';
      }};
      background-color: ${(props) => {
        if (props.$isCorrect) return '#F2FFF3';
        if (props.$isIncorrect) return '#FFF2F2';
        return '#f0f2f5';
      }};

      &::after {
        background-color: ${(props) => {
          if (props.$isCorrect) return '#68A729';
          if (props.$isIncorrect) return '#fd0101';
          return '#1d3c63';
        }};
      }
    }
  }
`;

export const PointsTagContainer = styled(Tag)<{ $points: number }>`
  padding: 4px 16px;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0px 2px 8px 0px #0000004a inset;
  border-radius: 30px;
  background: #4f9af5;
  color: #ffffff;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
`;

export const ProgressIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(39, 152, 205, 0.3) transparent;
  width: 100%;
  max-width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(39, 152, 205, 0.3);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(39, 152, 205, 0.5);
  }

  @media (max-width: 768px) {
    padding: 16px;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  /* Ensure content doesn't shrink when scrolling */
  > * {
    flex-shrink: 0;
  }
`;

export const ProgressMarker = styled.div<{
  $isCompleted: boolean;
  $isActive: boolean;
  $isPast: boolean;
  $isClickable?: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$isCompleted || props.$isPast || props.$isActive ? '#2798cd' : 'transparent'};
  border: ${(props) =>
    props.$isCompleted || props.$isPast || props.$isActive ? 'none' : '2px solid #2798cd'};
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.$isClickable ? 'pointer' : 'default')};

  ${(props) =>
    props.$isClickable &&
    `
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(39, 152, 205, 0.3);
    }
  `}

  .anticon {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;

    .anticon {
      font-size: 12px;
    }
  }
`;

export const ProgressLine = styled.div<{
  $isCompleted: boolean;
  $isActive: boolean;
}>`
  height: 3px;
  flex: 1;
  min-width: 40px;
  background: ${(props) => (props.$isCompleted ? '#2798cd' : 'rgba(39, 152, 205, 0.3)')};
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  flex-shrink: 0;

  @media (max-width: 768px) {
    min-width: 30px;
  }

  @media (max-width: 480px) {
    min-width: 20px;
  }
`;

export const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    min-width: 120px;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
  }
`;
