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

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 24px;
    }
  }
`;

export const ActivityDetailsHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    color: #0f1b53;
    font-size: 20px;
    font-weight: 700;
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
    display: flex;
    gap: 24px;
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

  .ant-tabs-nav {
    margin: 0;
    padding: 20px 36px 0;
  }

  .ant-tabs-nav-wrap {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(39, 152, 205, 0.3) transparent;
    padding-right: 20px;
    margin-right: -20px;

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
  }

  .ant-tabs-nav-list {
    flex-wrap: nowrap;
    min-width: max-content;
    padding-right: 20px;
  }

  .ant-tabs-content-holder {
    // padding: 24px;
  }

  .ant-tabs-tab {
    font-weight: 600;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #2798cd;
  }

  .ant-tabs-ink-bar {
    background: #2798cd;
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

  @media (max-width: 768px) {
    .ant-tabs-nav {
      padding: 16px 16px 0;
    }

    .ant-tabs-nav-wrap {
      padding-bottom: 4px;
      padding-right: 16px;
      margin-right: -16px;
    }

    .ant-tabs-nav-list {
      padding-right: 16px;
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 8px 12px;
    }

    .ant-tabs-content-holder {
      // padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .ant-tabs-nav-wrap {
      padding-right: 12px;
      margin-right: -12px;
    }

    .ant-tabs-nav-list {
      padding-right: 12px;
    }

    .ant-tabs-tab {
      font-size: 12px;
      padding: 6px 10px;
    }
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
  $isPairItem?: boolean;
}>`
  display: flex;
  align-items: center;
  flex: ${(props) => (props.$isPairItem ? '1' : 'max-content')};
  gap: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  img {
    flex-shrink: 0;
  }

  .text {
    flex: 1;
    white-space: normal;
    word-break: break-word;
  }
  border-radius: 16px;
  background: ${(props) => {
    if (props.$isPairItem) return '#ffffff';
    if (props.$isCorrect) return '#f2fff3';
    if (props.$isIncorrect) return '#fff1f0';
    return '#f0f2f5';
  }};
  border: ${(props) => {
    if (props.$isPairItem) {
      return '2px solid rgba(0, 0, 0, 0.06)';
    }
    if (props.$isCorrect) return '1px solid #68A729';
    if (props.$isIncorrect) return '1px solid #FF4D4F';
    if (props.$isSelected) return '1px solid #1d3c63';
    return 'none';
  }};
  transition: all 0.2s;

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
    color: ${(props) => (props.$isPairItem ? '#000000' : 'inherit')};
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

export const PairMatchingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const PairColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PairItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.06);

  .pair-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #f0f0f0;
    flex-shrink: 0;
  }

  .pair-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .pair-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .pair-item-content-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    // background: #f0f0f0;
    background: red;
  }
`;

export const DragDropGridBox = styled.div<{ rows: number; cols: number }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(p) => Math.max(1, p.cols || 1)}, 1fr);
  grid-template-rows: repeat(${(p) => Math.max(1, p.rows || 1)}, auto);
  background: #f7faff;
  padding: 10px;
  border: 2px dashed #c8c8c8;
  border-radius: 16px;
  position: relative;
  gap: 0;
  min-height: 200px;
  margin-left: 0;

  /* Vertical interior borders - add border-right to all cells except those in the last column */
  ${(p) => {
    const cols = Math.max(1, p.cols || 1);
    if (cols <= 1) return '';

    // Add border-right to cells that are NOT in the last column
    // Last column cells are: cols, 2*cols, 3*cols, etc.
    return `
      > *:not(:nth-child(${cols}n)) {
        border-right: 1px dashed #c8c8c8;
      }
    `;
  }}

  /* Horizontal interior borders - add border-bottom to all cells except those in the last row */
  ${(p) => {
    const rows = Math.max(1, p.rows || 1);
    const cols = Math.max(1, p.cols || 1);
    if (rows <= 1) return '';

    const totalCells = rows * cols;
    const lastRowStart = totalCells - cols + 1;

    // Add border-bottom to cells that are NOT in the last row
    return `
      > *:not(:nth-child(n + ${lastRowStart})) {
        border-bottom: 1px dashed #c8c8c8;
      }
    `;
  }}
`;

export const DragDropContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 36px;
  width: 100%;
  padding: 20px 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;

  /* Desktop (>992px): Blue section takes more space (60%), Cards take less (40%) */
  > div:first-child {
    width: 65%;
    flex: 0 0 65%;
    margin-left: 0;
    margin-right: 0;
    padding-right: 0;
  }

  > div:last-child {
    width: 35%;
    flex: 0 0 35%;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: 0;
    margin-right: 0;
    padding-right: 0 !important;
    padding-left: 0;
    position: relative;
    right: 0;
  }

  /* Tablet and below (<992px): stack vertically - cards below blue section */
  @media (max-width: 991px) {
    flex-direction: column;
    gap: 36px;
    justify-content: flex-start;

    > div:first-child {
      width: 100%;
      flex: 0 0 auto;
      margin-left: 0;
      margin-right: 0;
      padding-right: 0;
    }

    > div:last-child {
      width: 100%;
      flex: 0 0 auto;
      max-height: none;
      overflow: visible;
      margin-left: 0;
      margin-right: 0;
      padding-right: 0;
      padding-left: 0;
    }
  }

  /* Mobile: smaller gap */
  @media (max-width: 600px) {
    gap: 24px;
  }
`;

export const DragDropTargets = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DragDropTarget = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 140px;
  background: #f7faff;
  box-sizing: border-box;

  .image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100px;
  }

  .base-img {
    max-width: 100%;
    max-height: 200px;
    width: auto;
    height: auto;
    border-radius: 12px;
    object-fit: contain;
  }

  .target-label {
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 400;
    text-align: center;
    font-size: 15px;
    line-height: 22px;
    flex-shrink: 0;
    width: 100%;
  }

  .empty-target {
    width: 100%;
    height: 100%;
    min-height: 100px;
  }
`;

export const DraggableItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 36px;
  align-content: flex-start;
  padding: 12px 0 8px 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;

  /* Desktop (>992px): Scroll only in cards area, not main window */
  @media (min-width: 992px) {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Ensure cards don't get too wide on larger screens */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(158px, 200px));
  }

  /* Tablet (768px-991px): Cards below blue section, no scroll needed */
  @media (min-width: 768px) and (max-width: 991px) {
    grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
    max-height: none;
    overflow: visible;
  }

  /* Mobile (<768px): Single column, no scroll needed */
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 12px 0 8px 0;
    max-height: none;
    overflow: visible;
  }

  /* Custom scrollbar styling - only for desktop */
  @media (min-width: 992px) {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c8c8c8;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  }
`;

export const DraggableItem = styled.div`
  width: 100%;
  min-width: 158px;
  max-width: 200px;
  background: #f0f2f5;
  border-radius: 18px;
  padding: 30px 12px 25px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  img {
    width: 100%;
    max-width: 110px;
    height: 75px;
    object-fit: contain;
    border-radius: 14px;
  }
  .correct-option-badge {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: flex-end;
    .correct-option {
      background-color: #1d3c63;
      padding: 6px 12px;
      display: flex;
      justify-content: flex-end;
      border-radius: 30px;
      /* margin-bottom: 9px; */
      div {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
      }
    }
  }

  .draggable-label {
    font-size: 15px;
    font-weight: 600;
    color: #222;
  }

  /* Mobile: full width */
  @media (max-width: 600px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const PointsBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 10;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const DraggableIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f0f0f0;
`;
