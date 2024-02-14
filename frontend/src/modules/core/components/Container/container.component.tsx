import { Flex } from 'antd';
import React, { useCallback, useState } from 'react';
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import { RndDragCallback } from 'react-rnd';
import { produce } from 'immer';

type Props = {

}

type Box = {
    id: string;
    title: string;
    component: string;
    zoomLevel: number;
    parent: string;
    layouts: string[];
    canvasWidth: number;
    top: number;
    left: number;
}

const Container: React.FC<Props> = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  function convertXToPercentage(x: number, canvasWidth: number) {
    return (x * 100) / canvasWidth;
  }
  const onDragStop: RndDragCallback = useCallback(
    (e, componentId, direction) => {
      // const id = componentId ? componentId : uuidv4();

      // Get the width of the canvas
      const canvasBounds = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
      const canvasWidth = canvasBounds?.width;
      const nodeBounds = direction.node.getBoundingClientRect();

      // Computing the left offset
      const leftOffset = nodeBounds.x - canvasBounds.x;
      const currentLeftOffset = boxes[componentId]?.left;
      const leftDiff = currentLeftOffset - convertXToPercentage(leftOffset, canvasWidth);

      // Computing the top offset
      // const currentTopOffset = boxes[componentId].layouts[currentLayout].top;
      const topDiff = boxes[componentId].top - (nodeBounds.y - canvasBounds.y);

      let newBoxes = { ...boxes };

        newBoxes = produce(newBoxes, (draft:any) => {
          if (draft[componentId]) {
            const topOffset = draft[componentId].top;
            const leftOffset = draft[componentId].left;

            draft[componentId].top = topOffset - topDiff;
            draft[componentId].left = leftOffset - leftDiff;
          }
        });

      setBoxes(newBoxes);
    },
    [boxes, setBoxes]
  );

  return (
    <Flex className="bg-slate-400 w-full">
      <div></div>
      {Object.keys(boxes).map((key) => {
        const box = boxes[key];

          return (
            <DraggableBox
              onDragStop={onDragStop}
              onResizeStop={onResizeStop}
            />
          );
      })
    }
      {Object.keys(boxes).length === 0 && !isDragging && (
        <div style={{ paddingTop: '10%' }}>
          <div className="mx-auto w-50 p-5 bg-light no-components-box">
              You haven&apos;t added any components yet. Drag components from the right sidebar and drop here.
          </div>
        </div>
      )}
    </Flex>
  )
}

export default Container;