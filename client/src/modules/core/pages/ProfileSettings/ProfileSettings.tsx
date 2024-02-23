import { Avatar, Button, Card, Col, Flex, Row, Select } from 'antd';

import { type AuthState } from '../../../authentication/interfaces';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';

const ProfilePage = () => {
  const authState: AuthState = useAppSelector((state) => state.auth);
  return (
    <Flex vertical gap={10} style={{ padding: '20px' }}>
      <Card className="bg-slate-800">
        <Row gutter={16}>
          <Col span={3}>
            <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size={100}>
              <span className="text-3xl">{authState.user.username[0]}</span>
            </Avatar>
          </Col>
          <Col span={13} className="text-white">
            <h2>{authState.user.username}</h2>
            <p>Email: {authState.user.email}</p>
            <p>
              Location: {authState.user.city}, {authState.user.country}
            </p>
            {/* Add more user details here */}
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Flex vertical gap={20}>
              <Flex vertical gap={10}>
                <h3 className="text-lg text-">Locale</h3>
                <Select
                  defaultValue={authState.user.settings.locale}
                  options={[
                    { value: 'en_US', label: 'en_US' },
                    { value: 'fr_FR', label: 'fr_FR' },
                    { value: 'pt_BR', label: 'pt_BR' },
                    { value: 'pt_PT', label: 'pt_PT' }
                  ]}
                ></Select>
              </Flex>
              <Flex vertical gap={10}>
                <h3 className="text-lg text-">Language</h3>
                <Select
                  defaultValue={authState.user.settings.language}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'it', label: 'Italiano' },
                    { value: 'es', label: 'Espanol' },
                    { value: 'fr', label: 'French' }
                  ]}
                ></Select>
              </Flex>
              <Flex vertical gap={10}>
                <h3 className="text-lg text-">Time Zone</h3>
                <Select
                  defaultValue={authState.user.settings.timezone}
                  options={[
                    { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
                    { value: 'America/Cambridge_Bay', label: 'America/Cambridge_Bay' },
                    { value: 'America/Yellowknife', label: 'America/Yellowknife' }
                  ]}
                ></Select>
              </Flex>
              <Button type="primary" className="w-32 h-12">
                Save
              </Button>
            </Flex>
          </Col>
        </Row>
      </Card>
    </Flex>
  );
};

export default ProfilePage;
