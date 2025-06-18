import { Col, Form, Input } from "antd";

const LocalizedInput = ({ language, isEditMode }) => (
  <Col span={24}>
    <Form.Item
      name={`${language}Name`}
      label={`Имя (${language.toUpperCase()})`}
    >
      <Input disabled={!isEditMode} />
    </Form.Item>
  </Col>
);
export default LocalizedInput;
