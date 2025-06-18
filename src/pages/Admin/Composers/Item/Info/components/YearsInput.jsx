import { Col, Form, Input } from "antd";

const YearsInput = ({ isEditMode }) => (
  <Col span={24}>
    <Form.Item name="years" label="Годы жизни">
      <Input disabled={!isEditMode} />
    </Form.Item>
  </Col>
);
export default YearsInput;
