import { Switch } from 'antd';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const ToggleSwitch: React.FC = () => <Switch className="h-full w-full" defaultChecked onChange={onChange} />;

export default ToggleSwitch;