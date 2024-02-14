/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import {RndResizeCallback, RndDragCallback }  from 'react-rnd';

const NO_OF_GRIDS = 43;

export const DraggableBox = React.memo(
  ({
    onResizeStop: RndResizeCallback,
    onDragStop: RndDragCallback 
    
  }) => {
    const [isResizing, setResizing] = useState(false);
    const [isDragging2, setDragging] = useState(false);
    const [canDrag, setCanDrag] = useState(true);
    
    const gridWidth = canvasWidth / NO_OF_GRIDS;
    
    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: 'box',
        item: {
          id,
          title,
          component,
          zoomLevel,
          parent,
          layouts,
          canvasWidth,
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [id, title, component, index, zoomLevel, parent, layouts, canvasWidth]
    );


    return (
            <Rnd
              maxWidth={canvasWidth}
              onDragStop={(e, direction) => {
                setDragging(false);
                onDragStop(e, id, direction);
              }}
              onResizeStop={(e, direction, ref, d, position) => {
                setResizing(false);
                onResizeStop(id, e, direction, ref, d, position);
              }}
            >
            </Rnd>
      )
  });

