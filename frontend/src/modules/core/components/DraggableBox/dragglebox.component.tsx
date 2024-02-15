/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Rnd, DraggableData, ResizableDelta, Position } from 'react-rnd';
import { Box, Direction } from '../../interfaces/editor.interface';

type Props = {
  onDragStop: (e: any, componentId: number, direction: DraggableData) => void,
  onResizeStop: (id: number, e: any, direction: Direction, ref:React.ElementRef<'div'>, d: ResizableDelta, position: Position) => void,
  inCanvas: boolean,
  canvasWidth: () => number,
  key: number,
  id: number,
  box: Box,
  resizingStatusChanged: (status: boolean) => void,
  draggingStatusChanged: (status: boolean) => void,
}
const NO_OF_GRIDS = 43;

export const DraggableBox = React.memo<Props>(
  ({
    onResizeStop,
    onDragStop,
    inCanvas,
    canvasWidth,
    key,
    id,
    box,
    resizingStatusChanged,
    draggingStatusChanged
  }) => {
    const [isResizing, setResizing] = useState(false);
    const [isDragging2, setDragging] = useState(false);
    const [canDrag, setCanDrag] = useState(true);
    
    const gridWidth = Number(canvasWidth) / NO_OF_GRIDS;
    
    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: 'Box',
        item: {
          id,
          canvasWidth,
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [id, parent, canvasWidth]
    );


    return (
            <Rnd
              style={{
                display: 'inline-block',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0px',
                border: '1px solid black'
              }}
              maxWidth={canvasWidth()}
              onDragStop={(e, direction) => {
                setDragging(false);
                onDragStop(e, Number(id), direction);
              }}
              onResizeStop={(e, direction, ref, d, position) => {
                setResizing(false);
                onResizeStop(Number(id), e, direction, ref, d, position);
              }}
              position={{
                x: box ? (box.left * canvasWidth()) / 100 : 0,
                y: box ? box.top : 0,
              }}
              onResize={() => setResizing(true)}
              onDrag={(e) => {
                e.preventDefault();
                if (!isDragging2) {
                  setDragging(true);
                }
              }}
              size={{
                width: box.width,
                height: box.height,
              }}
            >
              {box.title}
            </Rnd>
      )
  });

