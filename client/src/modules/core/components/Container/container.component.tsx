import { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Skeleton, Spin } from 'antd';
import axios from 'axios';
import { produce } from 'immer';
import update from 'immutability-helper';
import { cloneDeep } from 'lodash';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { Position, ResizableDelta } from 'react-rnd';
import { useParams } from 'react-router-dom';

import {
  useCreateComponentMutation,
  useDeleteComponentMutation,
  useFetchComponentsQuery,
  useUpdateComponentsMutation
} from '../../../shared/apis/componentApi';
import { Box, DraggableBoxPropsType } from '../../interfaces/container.interface';
import { Direction, DraggableData } from '../../interfaces/editor.interface';
import { getCookie } from '../../utils/authUtils';
import { DraggableBox } from '../DraggableBox/dragglebox.component';
import { componentTypes } from '../Editor/WidgetManager/widgetsComponents';

const NO_OF_GRIDS = 43;

const Container: React.FC<{ canvasWidth: number }> = ({ canvasWidth }) => {
  // const [boxes, setBoxes] = useState<{ [id: string]: Box }>({});
  // useEffect(() => console.log('boxes: ', boxes), [boxes]);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const gridWidth = Number(canvasWidth) / NO_OF_GRIDS;
  const { id } = useParams();
  const [updateComponents, { isLoading: isUpdateComponentLoading }] = useUpdateComponentsMutation();
  const [createComponent, { isLoading: isCreateComponentLoading }] = useCreateComponentMutation();
  const [deleteComponentMutation, { isLoading: isDeleteComponentLoading }] =
    useDeleteComponentMutation();

  const {
    data: boxes = {},
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess
  } = useFetchComponentsQuery(id);

  // useEffect(() => setBoxes(data), [data]);

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
      // Get the width of the canvas
      const canvasBounds = document
        .getElementsByClassName('real-canvas')[0]
        .getBoundingClientRect();
      const canvasWidth = canvasBounds?.width;
      console.log('from drag stop:', canvasWidth);
      const nodeBounds = direction.node.getBoundingClientRect();

      // Computing the left offset
      const leftOffset = nodeBounds.x - canvasBounds.x;
      const currentLeftOffset = boxes[componentId]?.left;
      const leftDiff = currentLeftOffset - convertXToPercentage(leftOffset, canvasWidth);

      // Computing the top offset
      const topDiff = boxes[componentId]?.top - (nodeBounds.y - canvasBounds.y);

      updateComponents({
        id,
        componentId,
        data: {
          top: boxes[componentId].top - topDiff,
          left: boxes[componentId].left - leftDiff
        }
      });
    },
    [boxes]
  );

  const onResizeStop = useCallback(
    (
      componentId: string,
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
      } = boxes[componentId] || defaultData;

      const boundingRect = document
        .getElementsByClassName('real-canvas')[0]
        .getBoundingClientRect();
      const canvasWidth = boundingRect?.width;
      let newWidth = boxWidth + deltaWidth;

      boxHeight = boxHeight + deltaHeight;
      if (boxHeight < boxes[componentId].defaultSize.height)
        boxHeight = boxes[componentId].defaultSize.height;
      if (newWidth < boxes[componentId].defaultSize.width)
        newWidth = boxes[componentId].defaultSize.width;

      boxTop = y;
      boxLeft = (x * 100) / canvasWidth;

      updateComponents({
        id,
        componentId,
        data: {
          top: boxTop,
          left: boxLeft,
          width: newWidth,
          height: boxHeight
        }
      });
    },
    [boxes, gridWidth]
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
    const defaultHeight = componentMetaData.defaultSize.height + 30;
    componentData.defaultSize.height = defaultHeight;

    componentData.name = computeComponentName(componentData.component, currentComponents);

    let left = 0;
    let top = 0;

    const offsetFromTopOfWindow = canvasBoundingRect.top;
    const offsetFromLeftOfWindow = canvasBoundingRect.left;
    const currentOffset = eventMonitorObject.getSourceClientOffset();
    const subContainerWidth = canvasBoundingRect.width;

    left = Math.round(currentOffset?.x - offsetFromLeftOfWindow);
    top = Math.round(currentOffset?.y - offsetFromTopOfWindow);

    left = (left * 100) / subContainerWidth;
    let newComponent = {
      top: top,
      left: left,
      width: defaultWidth,
      height: defaultHeight,
      ...componentData
    };

    return newComponent;
  };

  const moveBox = useCallback(
    (id: string, layouts: Box) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { ...layouts }
          }
        })
      );
    },
    [boxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ['box'],
      async drop(item: any, monitor: DropTargetMonitor) {
        const canvasBoundingRect = document
          .getElementsByClassName('real-canvas')[0]
          .getBoundingClientRect();
        const componentMeta = cloneDeep(
          componentTypes.find((component) => component.component === item.component.component)
        );

        const newComponent = addNewWidgetToTheEditor(
          componentMeta,
          monitor,
          boxes,
          canvasBoundingRect
        );

        createComponent({
          id,
          data: newComponent
        });
      }
    }),
    [moveBox]
  );

  const isOverlayVisible =
    isLoading ||
    isFetching ||
    isUpdateComponentLoading ||
    isCreateComponentLoading ||
    isDeleteComponentLoading;

  function deleteComponent(componentId: string) {
    deleteComponentMutation({
      id,
      componentId
    });
  }

  return (
    <div className="relative w-full h-full">
      {isOverlayVisible && (
        <div className="absolute top-0 left-0 w-full h-full z-20 !bg-secondary p-10 flex items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      )}
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
            draggingStatusChanged,
            deleteComponent
          };
          return <DraggableBox {...DraggableBoxProps} />;
        })}
        {Object.keys(boxes).length === 0 && !isDragging && (
          <div className="flex items-center justify-center mx-auto p-5 border-1 border-dotted h-1/3 bg-slate-400">
            You haven&apos;t added any components yet. Drag components from the right sidebar and
            drop here.
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
