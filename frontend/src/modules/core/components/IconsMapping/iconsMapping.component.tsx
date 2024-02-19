import { RxButton, RxInput } from "react-icons/rx";
import { IoTextOutline } from "react-icons/io5";
import { PiNumberOneFill } from "react-icons/pi";
import { MdOutlinePassword } from "react-icons/md";
import { IoIosCheckbox } from "react-icons/io";
import { IoIosRadioButtonOn } from "react-icons/io";
import { FaToggleOn } from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";
import { IconsMappingProps } from "../../interfaces/iconsMapping.interface";

const IconsMapping: React.FC<IconsMappingProps> = ({ name }) => {
  let icon;
  if(name==="Button") icon = <RxButton/>;
  else if(name==="Text") icon = <IoTextOutline />;
  else if(name==="TextInput") icon = <RxInput />;
  else if(name==="NumberInput") icon = <PiNumberOneFill />;
  else if(name==="PasswordInput") icon = <MdOutlinePassword />
  else if(name==="Checkbox") icon = <IoIosCheckbox />;
  else if(name==="RadioButton") icon = <IoIosRadioButtonOn />;
  else if(name==="ToggleSwitch") icon = <FaToggleOn />;
  else if(name==="TextArea") icon = <BsTextareaResize />
  else return null;

  return (
    <>{icon}</>
  )
}

export default IconsMapping;