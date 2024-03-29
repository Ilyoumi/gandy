import React, {useEffect} from "react";
import {
  Input,
  Button,
  Form,
  Select, DatePicker
} from "antd";
import moment from "moment";
const { Option } = Select;

const UpdateRdv= ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
      // Convert date string to moment object
      const formattedInitialValues = {
          ...initialValues,
          date: moment(initialValues.date),
      };
      form.setFieldsValue(formattedInitialValues);
  }, [initialValues, form]);
  const handleSubmit = async () => {
      try {
          const values = await form.validateFields();
          onSubmit(values);
      } catch (errorInfo) {
          console.log("Failed:", errorInfo);
      }
  };

  return (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
              label="Nom"
              name="name"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Société"
              name="societe"
              rules={[{ required: true, message: "Veuillez entrer la société" }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Tél"
              name="tel"
              rules={[{ required: true, message: "Veuillez entrer le téléphone" }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Gsm"
              name="gsm"
              rules={[{ required: true, message: "Veuillez entrer le portable" }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              label="Heure de début - Heure de fin"
              style={{ marginBottom: 0 }}
          >
              <Form.Item
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                  name="startTime"
                  rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de début !' }]}
              >
                  <DatePicker showTime />
              </Form.Item>
              <span style={{ display: 'inline-block', width: '16px', textAlign: 'center' }}>-</span>
              <Form.Item
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                  name="endTime"
                  rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de fin !' }]}
              >
                  <DatePicker showTime />
              </Form.Item>
          </Form.Item>
          <Form.Item
              label="Agent"
              name="agent"
              rules={[{ required: true, message: "Veuillez sélectionner l'agent" }]}
          >
              <Select>
                  <Option value="agent1">Agent 1</Option>
                  <Option value="agent2">Agent 2</Option>
                  <Option value="agent3">Agent 3</Option>
                  {/* Add more options as needed */}
              </Select>
          </Form.Item>
          <Form.Item
              label="Agenda"
              name="agenda"
              rules={[{ required: true, message: "Veuillez sélectionner l'agenda" }]}
          >
              <Select>
                  <Option value="agenda1">Agenda 1</Option>
                  <Option value="agenda2">Agenda 2</Option>
                  <Option value="agenda3">Agenda 3</Option>
                  {/* Add more options as needed */}
              </Select>
          </Form.Item>
          <Form.Item>
              <Button type="primary" htmlType="submit">
                  Mettre à jour
              </Button>
          </Form.Item>
      </Form>
  );
};
export default UpdateRdv