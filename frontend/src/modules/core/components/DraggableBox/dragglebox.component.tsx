/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, memo } from 'react';
import { useDrag } from 'react-dnd';
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { BoxProps, Direction } from '../../interfaces/editor.interface';
import IconsMapping from '../IconsMapping/iconsMapping.component';
import Box from './Box.component';
import { RxButton, RxInput } from "react-icons/rx";
import { IoTextOutline } from "react-icons/io5";
import { PiNumberOneFill } from "react-icons/pi";
import { MdOutlinePassword } from "react-icons/md";
import { IoIosCheckbox } from "react-icons/io";
import { IoIosRadioButtonOn } from "react-icons/io";
import { FaToggleOn } from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";

const AllIcons = {
  "Button": RxButton,
  "Text": IoTextOutline,
  "TextInput": RxInput,
  "NumberInput": PiNumberOneFill ,
  "PasswordInput": MdOutlinePassword,
  "Checkbox": IoIosCheckbox ,
  "RadioButton": IoIosRadioButtonOn ,
  "ToggleSwitch": FaToggleOn ,
  "TextArea": BsTextareaResize
}

type Props = {
  onDragStop: (e: any, componentId: any, direction: DraggableData) => void;
  onResizeStop: (
    id: any,
    e: any,
    direction: Direction,
    ref: React.ElementRef<'div'>,
    d: ResizableDelta,
    position: Position
  ) => void;
  inCanvas: boolean;
  canvasWidth: number;
  key: number;
  id: number;
  component: any,
  box: BoxProps;
  index?: any,
  resizingStatusChanged: (status: boolean) => void;
  draggingStatusChanged: (status: boolean) => void;
};

export const DraggableBox = memo<Props>(
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
    draggingStatusChanged
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
          component,
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
              style={{
                display: 'inline-block',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0px',
                border: '1px solid black',
                position: 'absolute'
              }}
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
              <div className="w-full h-full" ref={preview}>
                <Box box={box}/>
              </div>
            </Rnd>
        ) : <div className='h-[4.5rem] w-[4.5rem] flex flex-col items-center' ref={drag} role="DraggableBox">
            <div className='w-full h-full flex items-center justify-center bg-slate-200 rounded-lg text-xl'>
              {<IconToRender></IconToRender>}
              </div>
            <p className='text-[.65rem] font-thin mt-1'>{component.displayName}</p>
          </div>}
      </>
    );
  }
);
