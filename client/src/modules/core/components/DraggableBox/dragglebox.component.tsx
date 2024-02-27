/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { BsTextareaResize } from 'react-icons/bs';
import { FaToggleOn } from 'react-icons/fa';
import { IoIosCheckbox, IoIosRadioButtonOn } from 'react-icons/io';
import { IoTextOutline } from 'react-icons/io5';
import { MdOutlinePassword } from 'react-icons/md';
import { PiNumberOneFill } from 'react-icons/pi';
import { RxButton, RxInput } from 'react-icons/rx';
import { Rnd } from 'react-rnd';

import { DraggableBoxPropsType } from '../../interfaces/container.interface';
import BoxComponent from './Box.component';
import BoxOptions from './BoxOptions.component';

const AllIcons = {
  Button: RxButton,
  Text: IoTextOutline,
  TextInput: RxInput,
  NumberInput: PiNumberOneFill,
  PasswordInput: MdOutlinePassword,
  Checkbox: IoIosCheckbox,
  RadioButton: IoIosRadioButtonOn,
  ToggleSwitch: FaToggleOn,
  TextArea: BsTextareaResize
};

export const DraggableBox = memo<DraggableBoxPropsType>(
  ({
    onResizeStop,
    onDragStop,
    inCanvas,
    canvasWidth,
    key,
    id,
    component,
    box,
    resizingStatusChanged,
    draggingStatusChanged,
    deleteComponent
  }) => {
    const [isResizing, setResizing] = useState(false);
    const [isDragging2, setDragging] = useState(false);

    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: 'box',
        item: {
          ...box,
          parent,
          canvasWidth,
          id,
          component
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        })
      }),
      [id, parent, canvasWidth]
    );

    useEffect(() => {
      if (resizingStatusChanged) {
        resizingStatusChanged(isResizing);
      }
    }, [isResizing]);

    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, [isDragging]);

    useEffect(() => {
      if (draggingStatusChanged) {
        draggingStatusChanged(isDragging2);
      }
    }, [isDragging2]);

    const IconToRender = AllIcons[component?.component];

    return (
      <>
        {inCanvas ? (
          <Rnd
            key={key}
            className={`absolute flex flex-col p-0`}
            maxWidth={canvasWidth}
            onDragStop={(e, direction) => {
              setDragging(false);
              onDragStop(e, id, direction);
            }}
            onResizeStop={(e, direction, ref, d, position) => {
              setResizing(false);
              onResizeStop(id, e, direction, ref, d, position);
            }}
            position={{
              x: box ? (box.left * canvasWidth) / 100 : 0,
              y: box ? box.top : 0
            }}
            onResize={() => setResizing(true)}
            onDrag={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDragging2) {
                setDragging(true);
              }
            }}
            size={{
              width: box?.width,
              height: box?.height
            }}
            bounds="parent"
          >
            <div className="w-full" ref={preview}>
              <BoxOptions name={box.name} deleteComponent={deleteComponent} id={box.id} />
              <BoxComponent box={box} />
            </div>
          </Rnd>
        ) : (
          <div
            className="flex h-[4.5rem] w-[4.5rem] cursor-grab flex-col items-center"
            ref={drag}
            role="DraggableBox"
          >
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-xl">
              {<IconToRender className="text-2xl text-[#0958d9]/75"></IconToRender>}
            </div>
            <p className="mt-1 text-[.6rem] text-primary">{component.displayName}</p>
          </div>
        )}
      </>
    );
  }
);
