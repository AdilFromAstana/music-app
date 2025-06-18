import { Col, Form, Input } from "antd";

const LocalizedTextarea = ({ language, isEditMode }) => (
  <Col span={24}>
    <Form.Item
      name={`${language}Bio`}
      label={`Биография (${language.toUpperCase()})`}
    >
      <Input.TextArea rows={8} disabled={!isEditMode} />
    </Form.Item>
  </Col>
);
export default LocalizedTextarea;
