import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { produce } from 'immer';
import { Position, ResizableDelta } from 'react-rnd';

import { Direction, DraggableData } from '../../interfaces/editor.interface';
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import { v4 as uuidv4 } from 'uuid';
import { componentTypes } from '../WidgetManager/widgetsComponents';
import { cloneDeep } from 'lodash';
import update  from "immutability-helper"
import { DraggableBoxPropsType, Box } from '../../interfaces/container.interface';

const NO_OF_GRIDS = 43;

const Container: React.FC<{ canvasWidth: number }> = ({ canvasWidth }) => {
  const [boxes, setBoxes] = useState<{ [id: string]: Box }>({});
  useEffect(() => console.log(boxes), [boxes])
  const canvasRef = useRef(null);
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
        console.log("On Drag Stop called")
      // Get the width of the canvas
      const canvasBounds = document
        .getElementsByClassName('real-canvas')[0]
        .getBoundingClientRect();
      const canvasWidth = canvasBounds?.width;
      console.log("from drag stop:", canvasWidth);
      const nodeBounds = direction.node.getBoundingClientRect();

      // Computing the left offset
      const leftOffset = nodeBounds.x - canvasBounds.x;
      const currentLeftOffset = boxes[componentId]?.left;
      const leftDiff = currentLeftOffset - convertXToPercentage(leftOffset, canvasWidth);

      // Computing the top offset
      const topDiff = boxes[componentId]?.top - (nodeBounds.y - canvasBounds.y);

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
      id: string,
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

      const boundingRect = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
      const canvasWidth = boundingRect?.width;
      let newWidth = boxWidth + deltaWidth;

      boxHeight = boxHeight + deltaHeight;

      boxTop = y;
      boxLeft = (x * 100) / canvasWidth;

      let newBoxes = {
        ...boxes,
        [id]: {
          ...boxes[id],
            width: newWidth,
            height: boxHeight,
            left: boxLeft,
            top: boxTop
          }
        };

      setBoxes(newBoxes);
    },
    [setBoxes, boxes, gridWidth]
  );

  function computeComponentName(componentType: string, currentComponents: { [id: string]: Box }) {
    const currentComponentsForKind = Object.values(currentComponents).filter(
      (box) => box.component === componentType
    );
    let found = false;
    let componentName = '';
    let currentNumber = currentComponentsForKind.length + 1;
  
    while (!found) {
      componentName = `${componentType.toLowerCase()}${currentNumber}`;
      if (
        Object.values(currentComponents).find((box) => box.name === componentName) === undefined
      ) {
        found = true;
      }
      currentNumber = currentNumber + 1;
    }
  
    return componentName;
  }

  const addNewWidgetToTheEditor = (
    componentMeta: any,
    eventMonitorObject: DropTargetMonitor,
    currentComponents: { [id: string]: Box },
    canvasBoundingRect: DOMRect
  ) => {
    const componentMetaData = cloneDeep(componentMeta);
    const componentData = cloneDeep(componentMetaData);
  
    const defaultWidth = componentMetaData.defaultSize.width;
    const defaultHeight = componentMetaData.defaultSize.height;
  
    componentData.name = computeComponentName(componentData.component, currentComponents);
  
    let left = 0;
    let top = 0;
  
    const offsetFromTopOfWindow = canvasBoundingRect.top;
    const offsetFromLeftOfWindow = canvasBoundingRect.left;
    const currentOffset = eventMonitorObject.getSourceClientOffset();
    const subContainerWidth = canvasBoundingRect.width;
  
    left = Math.round(currentOffset?.x - offsetFromLeftOfWindow);
    top = Math.round(
      currentOffset?.y - offsetFromTopOfWindow
    );
  
    left = (left * 100) / subContainerWidth;
    let newComponent = {
      id: uuidv4(),
      top: top,
      left: left,
      width: defaultWidth,
      height: defaultHeight,
      ...componentData
    }
  
    return newComponent;
  };

  const moveBox = useCallback(
    (id: string, layouts: Box) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { ...layouts },
          },
        })
      );
    },
    [boxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ['box'],
      async drop(item: any, monitor: DropTargetMonitor) {
        const canvasBoundingRect = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
        const componentMeta = cloneDeep(componentTypes.find((component) => component.component === item.component.component));
        console.log("componentMeta", componentMeta)

        const newComponent = addNewWidgetToTheEditor(
          componentMeta,
          monitor,
          boxes,
          canvasBoundingRect
        );

        const newBoxes = {
          ...boxes,
          [newComponent.id]: {
            ...newComponent
          },
        };

        setBoxes(newBoxes);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <>
    <div 
    id="real-canvas"
      className="flex items-center real-canvas relative h-full w-full bg-secondary"
      ref={(el) => {
        canvasRef.current = el;
        drop(el);
      }}
      >
      {Object.keys(boxes).map((key) => {
        const box = boxes[key];
        const DraggableBoxProps: DraggableBoxPropsType = {
          onDragStop,
          onResizeStop,
          inCanvas: true,
          canvasWidth,
          id: box.id,
          box,
          resizingStatusChanged,
          draggingStatusChanged
        };
        return <DraggableBox {...DraggableBoxProps} />;
      })}
      {Object.keys(boxes).length === 0 && !isDragging && (
          <div className="flex items-center justify-center mx-auto p-5 border-1 border-solid h-1/3">
            You haven&apos;t added any components yet. Drag components from the right sidebar and
            drop here.
          </div>
      )}
      </div>
    </>
  );
};

export default Container;