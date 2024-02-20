import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Flex } from 'antd';
import { useDrop } from 'react-dnd';
import { produce } from 'immer';
import { Position, ResizableDelta } from 'react-rnd';

import { Box, Direction, DraggableData } from '../../interfaces/editor.interface';
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import { v4 as uuidv4 } from 'uuid';
import { componentTypes } from '../WidgetManager/widgetsComponents';
import { cloneDeep } from 'lodash';
import { update } from "immutability-helper"

type Props = {
  canvasWidth: number;
};

type DraggableBoxPropsType = {
  onDragStop?: (e: any, componentId: number, direction: DraggableData) => void;
  onResizeStop?: (
    id: number,
    e: any,
    direction: Direction,
    ref: React.ElementRef<'div'>,
    d: ResizableDelta,
    position: Position
  ) => void;
  inCanvas?: boolean;
  canvasWidth?: number;
  component?: any,
  key?: number;
  id?: number;
  box?: Box;
  resizingStatusChanged?: (status: boolean) => void;
  draggingStatusChanged?: (status: boolean) => void;
};

const NO_OF_GRIDS = 43;

const Container: React.FC<Props> = ({ canvasWidth }) => {
  const [boxes, setBoxes] = useState<{ [id: string]: Box }>({});
  const canvasRef = useRef(null);
  const focusedParentIdRef = useRef(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isContainerFocused, setContainerFocus] = useState(false);
  const gridWidth = Number(canvasWidth) / NO_OF_GRIDS;

  useEffect(() => {
    const handleClick = (e) => {
      if (canvasRef.current.contains(e.target) || document.getElementById('modal-container')?.contains(e.target)) {
        const elem = e.target.closest('.real-canvas').getAttribute('id');
        if (elem === 'real-canvas') {
          focusedParentIdRef.current = undefined;
        } else {
          const parentId = elem.split('canvas-')[1];
          focusedParentIdRef.current = parentId;
        }
        if (!isContainerFocused) {
          setContainerFocus(true);
        }
      } else if (isContainerFocused) {
        setContainerFocus(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isContainerFocused, canvasRef]);

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
      // const currentTopOffset = boxes[componentId].layouts[currentLayout].top;
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

      const boundingRect = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
      const canvasWidth = boundingRect?.width;

      //round the width to nearest multiple of gridwidth before converting to %
      // const currentWidth = (canvasWidth * boxWidth) / NO_OF_GRIDS;
      let newWidth = boxWidth + deltaWidth;
      // newWidth = Math.round(newWidth / gridWidth) * gridWidth;
      // boxWidth = (newWidth * NO_OF_GRIDS) / canvasWidth;

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
  // function snapToGrid(canvasWidth, x, y) {
  //   const gridX = canvasWidth / 43;
  
  //   const snappedX = Math.round(x / gridX) * gridX;
  //   const snappedY = Math.round(y / 10) * 10;
  //   return [snappedX, snappedY];
  // }
  function computeComponentName(componentType, currentComponents) {
    const currentComponentsForKind = Object.values(currentComponents).filter(
      (box) => box.component.component === componentType
    );
    let found = false;
    let componentName = '';
    let currentNumber = currentComponentsForKind.length + 1;
  
    while (!found) {
      componentName = `${componentType.toLowerCase()}${currentNumber}`;
      if (
        Object.values(currentComponents).find((box) => box.component.name === componentName) === undefined
      ) {
        found = true;
      }
      currentNumber = currentNumber + 1;
    }
  
    return componentName;
  }

  const addNewWidgetToTheEditor = (
    componentMeta,
    eventMonitorObject,
    currentComponents,
    canvasBoundingRect,
    isInSubContainer = false,
    addingDefault = false
  ) => {
    const componentMetaData = cloneDeep(componentMeta);
    const componentData = cloneDeep(componentMetaData);
    console.log(componentMetaData)
  
    const defaultWidth = isInSubContainer
      ? (componentMetaData.defaultSize.width * 100) / 43
      : componentMetaData.defaultSize.width;
    const defaultHeight = componentMetaData.defaultSize.height;
  
    componentData.name = computeComponentName(componentData.component, currentComponents);
  
    let left = 0;
    let top = 0;
  
    // if (isInSubContainer && addingDefault) {
    //   const newComponent = {
    //     id: uuidv4(),
    //     component: componentData,
    //         top: top,
    //         left: left,
    //         width: defaultWidth,
    //         height: defaultHeight,
    //     },
    //   };
  
    //   return newComponent;
    // }
  
    const offsetFromTopOfWindow = canvasBoundingRect.top;
    const offsetFromLeftOfWindow = canvasBoundingRect.left;
    const currentOffset = eventMonitorObject.getSourceClientOffset();
    // const initialClientOffset = eventMonitorObject.getInitialClientOffset();
    // const delta = eventMonitorObject.getDifferenceFromInitialOffset();
    const subContainerWidth = canvasBoundingRect.width;
  
    left = Math.round(currentOffset?.x - offsetFromLeftOfWindow);
    top = Math.round(
      // initialClientOffset?.y - 10 + delta.y + initialClientOffset?.y  - offsetFromTopOfWindow
      currentOffset.y - offsetFromTopOfWindow
    );
  
    // if (shouldSnapToGrid) {
    //   [left, top] = snapToGrid(subContainerWidth, left, top);
    // }
  
    left = (left * 100) / subContainerWidth;
  
    // if (currentLayout === 'mobile') {
    //   componentData.definition.others.showOnDesktop.value = false;
    //   componentData.definition.others.showOnMobile.value = true;
    // }
  
    // const widgetsWithDefaultComponents = ['Listview', 'Tabs', 'Form', 'Kanban'];
  
    // const nonActiveLayout = currentLayout === 'desktop' ? 'mobile' : 'desktop';
    let newComponent = {
      id: uuidv4(),
      component: componentData,
      top: top,
      left: left,
      width: defaultWidth,
      height: defaultHeight,
    }
  
    return newComponent;
  };

  const moveBox = useCallback(
    (id, layouts) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { layouts },
          },
        })
      );
    },
    [boxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ['box'],
      async drop(item:any, monitor) {
        // if (item.parent) {
        //   return;
        // }

        // if (item.name === 'comment') {
        //   const canvasBoundingRect = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
        //   const offsetFromTopOfWindow = canvasBoundingRect.top;
        //   const offsetFromLeftOfWindow = canvasBoundingRect.left;
        //   const currentOffset = monitor.getSourceClientOffset();

        //   const xOffset = Math.round(currentOffset.x + currentOffset.x * (1 - zoomLevel) - offsetFromLeftOfWindow);
        //   const y = Math.round(currentOffset.y + currentOffset.y * (1 - zoomLevel) - offsetFromTopOfWindow);

        //   const x = (xOffset * 100) / canvasWidth;

        //   const element = document.getElementById(`thread-${item.threadId}`);
        //   element.style.transform = `translate(${xOffset}px, ${y}px)`;
        //   commentsService.updateThread(item.threadId, { x, y });
        //   return undefined;
        // }

        const canvasBoundingRect = document.getElementsByClassName('real-canvas')[0].getBoundingClientRect();
        const componentMeta = cloneDeep(componentTypes.find((component) => component.component === item.component.component));

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
      className="flex items-center real-canvas relative h-full w-full bg-slate-200"
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
          key: box.key,
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
