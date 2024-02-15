import React, { useCallback, useState } from 'react';
import { Flex } from 'antd';
import { produce } from 'immer';
import { Position, ResizableDelta } from 'react-rnd';

import { Box, Direction, DraggableData } from '../../interfaces/editor.interface';
import { DraggableBox } from '../DraggableBox/dragglebox.component';

type Props = {
  canvasWidth: () => any;
};

type DraggableBoxPropsType = {
  onDragStop: (e: any, componentId: number, direction: DraggableData) => void;
  onResizeStop: (
    id: number,
    e: any,
    direction: Direction,
    ref: React.ElementRef<'div'>,
    d: ResizableDelta,
    position: Position
  ) => void;
  inCanvas: boolean;
  canvasWidth: () => number;
  key: number;
  id: number;
  box: Box;
  resizingStatusChanged: (status: boolean) => void;
  draggingStatusChanged: (status: boolean) => void;
};

const NO_OF_GRIDS = 43;

const Container: React.FC<Props> = ({ canvasWidth }) => {
  const [boxes, setBoxes] = useState<{ [id: string]: Box }>({
    1: {key: 1, id: 1, title: "button 1", component: "button", zoomLevel: 1, parent: "div", canvasWidth: canvasWidth(), top: 100, left: 0, height: 100, width: 100}
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const gridWidth = Number(canvasWidth) / NO_OF_GRIDS;

  const defaultData: { top: number; left: number; width: number; height: number } = {
    top: 100,
    left: 0,
    width: 445,
    height: 500
  };

  function convertXToPercentage(x: number, canvasWidth: number) {
    return (x * 100) / canvasWidth;
  }

  const resizingStatusChanged = useCallback(
    (status: boolean) => {
      setIsResizing(status);
    },
    [setIsResizing]
  );

  const draggingStatusChanged = useCallback(
    (status: boolean) => {
      setIsDragging(status);
    },
    [setIsDragging]
  );

  const onDragStop = useCallback(
    (e: any, componentId: number, direction: DraggableData) => {
      // const id = componentId ? componentId : uuidv4();

      // Get the width of the canvas
      const canvasBounds = document
        .getElementsByClassName('real-canvas')[0]
        .getBoundingClientRect();
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

      newBoxes = produce(newBoxes, (draft: any) => {
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

  const onResizeStop = useCallback(
    (
      id: number,
      e: any,
      direction: Direction,
      ref: React.ElementRef<'div'>,
      d: ResizableDelta,
      position: Position
    ) => {
      const deltaWidth = Math.round(d.width / gridWidth) * gridWidth; //rounding of width of element to nearest multiple of gridWidth
      const deltaHeight = d.height;

      if (deltaWidth === 0 && deltaHeight === 0) {
        return;
      }

      let { x, y } = position;
      x = Math.round(x / gridWidth) * gridWidth;

      let {
        left: boxLeft,
        top: boxTop,
        width: boxWidth,
        height: boxHeight
      } = boxes[id] || defaultData;

      const boundingRect = document
        .getElementsByClassName('canvas-area')[0]
        .getBoundingClientRect();
      const canvasWidth = boundingRect?.width;

      //round the width to nearest multiple of gridwidth before converting to %
      const currentWidth = (canvasWidth * boxWidth) / NO_OF_GRIDS;
      let newWidth = currentWidth + deltaWidth;
      newWidth = Math.round(newWidth / gridWidth) * gridWidth;
      boxWidth = (newWidth * NO_OF_GRIDS) / canvasWidth;

      boxHeight = boxHeight + deltaHeight;

      boxTop = y;
      boxLeft = (x * 100) / canvasWidth;

      let newBoxes = {
        ...boxes,
        [id]: {
          ...boxes[id],
            width: boxWidth,
            height: boxHeight,
            left: boxLeft,
            top: boxTop
          }
        };

      setBoxes(newBoxes);
    },
    [setBoxes, boxes, gridWidth]
  );

  return (
    <Flex className="bg-slate-400 w-full">
      <div>

      {Object.keys(boxes).map((key) => {
        const box = boxes[key];
        const DraggableBoxProps: DraggableBoxPropsType = {
          onDragStop,
          onResizeStop,
          inCanvas: true,
          canvasWidth,
          key: box.key, // Pass the key here
          id: box.id,
          box,
          resizingStatusChanged,
          draggingStatusChanged
        };
        return <DraggableBox {...DraggableBoxProps} />;
      })}
      </div>
      {Object.keys(boxes).length === 0 && !isDragging && (
        <div style={{ paddingTop: '10%' }}>
          <div className="mx-auto w-50 p-5 bg-light no-components-box">
            You haven&apos;t added any components yet. Drag components from the right sidebar and
            drop here.
          </div>
        </div>
      )}
    </Flex>
  );
};

export default Container;
