import { useMemo, useState } from 'react';

import { Button, Select } from 'antd';
import type { RubricRow } from 'modules/ManageChapter/Modules/view/types';

import CommonModal from 'components/common/Modal/components/CommonModal';

import {
  ModalFooterWrapper,
  ModalRubricTableWrapper,
  ModalTitleWrapper,
  SubmitFinalScoreModalGlobalStyle,
  TotalScoreWrapper
} from './SubmitFinalScoreModal.styled';

interface SubmitFinalScoreModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (scores: Record<number, string>) => void;
  rubrics: RubricRow[];
  studentName?: string;
}

type ScoreLevel = 'Exemplary' | 'Effective' | 'Acceptable' | 'Developing' | 'Incomplete';

const POINT_VALUES: Record<ScoreLevel, number> = {
  Exemplary: 100,
  Effective: 80,
  Acceptable: 60,
  Developing: 40,
  Incomplete: 20
};

export const SubmitFinalScoreModal: React.FC<SubmitFinalScoreModalProps> = ({
  open,
  onCancel,
  onSave,
  rubrics
}) => {
  const [selectedScores, setSelectedScores] = useState<Record<number, ScoreLevel>>({});

  const totalScore = useMemo(() => {
    return Object.values(selectedScores).reduce((sum, level) => {
      return sum + (POINT_VALUES[level] || 0);
    }, 0);
  }, [selectedScores]);

  const maxScore = useMemo(() => {
    return rubrics.length * 100; // Assuming max score per rubric is 100
  }, [rubrics.length]);

  const handleScoreChange = (rubricId: number, value: ScoreLevel) => {
    setSelectedScores((prev) => ({
      ...prev,
      [rubricId]: value
    }));
  };

  const handleSave = () => {
    onSave(selectedScores);
  };

  const handleCancel = () => {
    setSelectedScores({});
    onCancel();
  };

  const scoreOptions: { label: string; value: ScoreLevel }[] = [
    { label: 'Exemplary', value: 'Exemplary' },
    { label: 'Effective', value: 'Effective' },
    { label: 'Acceptable', value: 'Acceptable' },
    { label: 'Developing', value: 'Developing' },
    { label: 'Incomplete', value: 'Incomplete' }
  ];

  return (
    <>
      <SubmitFinalScoreModalGlobalStyle />
      <CommonModal
        open={open}
        onCancel={handleCancel}
        title={<ModalTitleWrapper>Add Rubrics</ModalTitleWrapper>}
        width="90%"
        style={{ maxWidth: 1200 }}
        footer={null}
        centered
        className="submit-final-score-modal"
      >
        <ModalRubricTableWrapper>
          <table role="grid">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Exemplary</th>
                <th scope="col">Effective</th>
                <th scope="col">Acceptable</th>
                <th scope="col">Developing</th>
                <th scope="col">Incomplete</th>
                <th scope="col">Points</th>
              </tr>
              <tr>
                <td>-</td>
                <td>100</td>
                <td>80</td>
                <td>60</td>
                <td>40</td>
                <td>20</td>
                <td>-</td>
              </tr>
            </thead>
            <tbody>
              {rubrics.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.parameter || '-'}</th>
                  <td>{row.exemplary || '-'}</td>
                  <td>{row.effective || '-'}</td>
                  <td>{row.acceptable || '-'}</td>
                  <td>{row.developing || '-'}</td>
                  <td>{row.incomplete || '-'}</td>
                  <td>
                    <Select
                      style={{ width: '100%', minWidth: 120 }}
                      placeholder="Select"
                      value={selectedScores[row.id]}
                      onChange={(value) => handleScoreChange(row.id, value as ScoreLevel)}
                      options={scoreOptions}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalRubricTableWrapper>

        <ModalFooterWrapper>
          <TotalScoreWrapper>
            <span>Total Score:</span>
            <div className="score-box">
              {totalScore} / {maxScore}
            </div>
          </TotalScoreWrapper>
          <div className="buttons-wrapper">
            <Button onClick={handleCancel} className="border-md">
              Cancel
            </Button>
            <Button type="primary" className="border-md" onClick={handleSave}>
              Save
            </Button>
          </div>
        </ModalFooterWrapper>
      </CommonModal>
    </>
  );
};
