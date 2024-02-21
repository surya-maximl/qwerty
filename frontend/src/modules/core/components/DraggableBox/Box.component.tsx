import ButtonElement from "../WidgetElements/ButtonElement.component";
import TextInput from "../WidgetElements/TextInput.component";
import Text from "../WidgetElements/Text.component";
import NumberInput from "../WidgetElements/NumberInput.component";
import PasswordInput from "../WidgetElements/PasswordInput.component";
import Checkbox from "antd/es/checkbox/Checkbox";
import RadioButton from "../WidgetElements/RadioButton.component";
import ToggleSwitch from "../WidgetElements/ToggleSwitch.component";
import TextAreaElement from "../WidgetElements/TextAreaElement.component";
import { Box } from "../../interfaces/container.interface";

const AllComponents = {
  "Button": ButtonElement,
  TextInput,
  Text,
  NumberInput,
  PasswordInput,
  Checkbox,
  RadioButton,
  ToggleSwitch,
  "TextArea": TextAreaElement
}

const BoxComponent: React.FC<{ box: Box }> = ({ box }) => {
  const ComponentToRender = AllComponents[box.component];

  return (
    <div className="real-box w-full h-full" ><ComponentToRender></ComponentToRender></div>
  )
}

export default BoxComponent;