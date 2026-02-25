import React from 'react';

import CommonModal from 'components/common/Modal/components/CommonModal';

import {
  LedgerLegendItem,
  LedgerLegendWrapper,
  LedgerModalGlobalStyle,
  LedgerTitleWrapper
} from './LedgerModal.styled';

interface LedgerModalProps {
  open: boolean;
  onCancel: () => void;
}

const LEGEND_ITEMS = [
  { color: '#B4B4B4', label: 'Assigned' },
  { color: '#FFEF44', label: 'Work in progress' },
  { color: '#EA3323', label: 'Need Attention' },
  { color: '#0066C5', label: 'Rubrics Added' },
  { color: '#68A729', label: 'Completed' }
];

export const LedgerModal: React.FC<LedgerModalProps> = ({ open, onCancel }) => {
  return (
    <>
      <LedgerModalGlobalStyle />
      <CommonModal
        open={open}
        onCancel={onCancel}
        title={<LedgerTitleWrapper>Ledger</LedgerTitleWrapper>}
        width="90%"
        style={{ maxWidth: 1000 }}
        footer={null}
        centered
        className="ledger-modal"
      >
        <LedgerLegendWrapper>
          {LEGEND_ITEMS.map((item, index) => (
            <LedgerLegendItem key={index}>
              <div className="color-box" style={{ backgroundColor: item.color }} />
              <span className="legend-text">{item.label}</span>
            </LedgerLegendItem>
          ))}
        </LedgerLegendWrapper>
      </CommonModal>
    </>
  );
};
