import { IMAGE_URL } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';

import {
  DragDropContainer,
  DragDropGridBox,
  DragDropTarget,
  DraggableItem,
  DraggableItems,
  PointsBadge
} from '../ActivityView.styled';

function parsePosition(pos: string) {
  const colMatch = pos.match(/C(\d+)/);
  const rowMatch = pos.match(/R(\d+)/);

  const col = Number(colMatch?.[1] ?? 0);
  const row = Number(rowMatch?.[1] ?? 0);

  return { row, col };
}

function buildGrid(targets: any[], rows: number, cols: number) {
  const grid: any[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

  targets?.forEach((t) => {
    const { row, col } = parsePosition(t.position);
    grid[row - 1][col - 1] = t; // place target in correct cell
  });

  return grid;
}

export const DragDropArea = ({ targets, draggableItems, rows, cols }: any) => {
  const grid = buildGrid(targets, rows, cols);

  return (
    <DragDropContainer>
      {/* LEFT SIDE – TARGET GRID */}
      <DragDropGridBox rows={rows} cols={cols}>
        {grid?.flat()?.map((cell, index) => (
          <DragDropTarget key={index}>
            {cell ? (
              <>
                <div className="target-label">{cell?.base_text}</div>
                {cell?.base_image && (
                  <div className="image-container">
                    <img
                      src={`${IMAGE_URL}scamper/${ImageTypeEnum.QUESTION}/${cell.base_image}`}
                      className="base-img"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="empty-target"></div>
            )}
          </DragDropTarget>
        ))}
      </DragDropGridBox>

      {/* RIGHT SIDE – DRAGGABLE ITEMS */}
      <DraggableItems>
        {draggableItems?.map((item: any) => (
          <DraggableItem key={item.id}>
            <PointsBadge>{item.total_points} POINTS</PointsBadge>
            {item?.option_image && (
              <img
                src={`${IMAGE_URL}scamper/${ImageTypeEnum.QUESTION}/${item.option_image}`}
                width={60}
                height={60}
                style={{ borderRadius: 8 }}
              />
            )}
            <div className="draggable-label">{item?.option_text}</div>

            {item?.correct_positions?.length
              ? item?.correct_positions?.map((value: any, idx: number) => {
                  // Handle both string and object formats
                  const position = typeof value === 'string' ? value : value?.position || '';
                  return <div key={idx}>{position}</div>;
                })
              : null}
          </DraggableItem>
        ))}
      </DraggableItems>
    </DragDropContainer>
  );
};
