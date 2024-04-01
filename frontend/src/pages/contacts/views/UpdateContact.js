import React, { useState } from "react";

import {
  Input,
  Button,
  Modal,
  Select,
  Form,
  Upload,
  message
} from "antd";
import {UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpdateContactModal = ({ visible, onCancel, onUpdate, userData }) => {
  const [form] = Form.useForm();
  const [agenda, setAgenda] = useState(userData ? userData.agenda : undefined);

  const handleAgendaChange = (value) => {
      setAgenda(value);
  };
  const handleImageChange = (info) => {
      if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
      } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
      }
  };

  const handleSubmit = () => {
      form
          .validateFields()
          .then((values) => {
              form.resetFields();
              onUpdate({ ...values, agenda });
          })
          .catch((info) => {
              console.log("Validate Failed:", info);
          });
  };

  return (
      <Modal
          visible={visible}
          title="Modifier Utilisateur"
          okText="Modifier"
          onCancel={onCancel}
          onOk={handleSubmit}
      >
          <Form
              form={form}
              initialValues={{
                  name: userData ? userData.name : "",
                  email: userData ? userData.email : "",
                  agenda: userData ? userData.agenda : undefined,
              }}
          >
              <Form.Item
                  name="image"
                  label="Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                          return e;
                      }
                      return e && e.fileList;
                  }}
                  style={{ marginBottom: 20 }}
              >
                  <Upload
                      name="image"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture"
                      maxCount={1}
                      onChange={handleImageChange}
                      style={{ width: "100%" }}
                  >
                      <Button icon={<UploadOutlined />}>Uploader</Button>
                  </Upload>
              </Form.Item>
              <Form.Item
                  name="name"
                  label="Nom"
                  rules={[{ required: true, message: "Veuillez entrer le nom!" }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Veuillez entrer l'email!" }]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  name="agenda"
                  label="Agenda"
                  rules={[{ required: true, message: "Veuillez sélectionner l'agenda!" }]}
              >
                  <Select onChange={handleAgendaChange}>
                      <Option value="agenda1">Agenda 1</Option>
                      <Option value="agenda2">Agenda 2</Option>
                      <Option value="agenda3">Agenda 3</Option>
                  </Select>
              </Form.Item>
          </Form>
      </Modal>
  );
};

export default UpdateContactModal