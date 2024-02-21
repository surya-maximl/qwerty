import { itemType } from "../interfaces/dashboard.interface";
import { Typography } from "antd";

export const items: itemType[] = [
  {
    key: '1',
    label: (<Typography>Rename app</Typography>),
  },
  {
    key: '2',
    label: (<Typography>Change icon</Typography>),
  },
  {
    key: '3',
    label: (<Typography className='text-[#ff0000]'>Delete app</Typography>),
  },
];