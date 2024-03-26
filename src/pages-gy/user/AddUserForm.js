import React, { useState,useRef } from "react";
import { Form, Input, Button, Col, Row, Upload, message,Avatar ,Table,Typography,Space} from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    VerticalAlignTopOutlined,
    SearchOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";
import face4 from "../../assets/images/face-4.jpg";
import face5 from "../../assets/images/face-5.jpeg";
import face6 from "../../assets/images/face-6.jpeg";

const { Dragger } = Upload;
const { Title } = Typography;

const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
    },
};
const { Search } = Input;



const AddUserForm = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
    });
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInputRef = useRef(null);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                    handleSearch(selectedKeys, confirm, dataIndex)
                }
                style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered) => (
        <SearchOutlined
            style={{ color: filtered ? "#1890ff" : undefined }}
        />
    ),
    onFilter: (value, record) =>
        record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInputRef.current && searchInputRef.current.select(), 100);

        }
    },
    render: (text) =>
        searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ) : (
            text
        ),
  });
  const deletebtn = [
    <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
            fill="#111827"
            className="fill-danger"
        ></path>
    </svg>,
  ];
  const pencil = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
        <path
            d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
            className="fill-gray-7"
        ></path>
        <path
            d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
            className="fill-gray-7"
        ></path>
    </svg>,
  ];
  const columns = [
    {
        title: "NOM",
        dataIndex: "name",
        key: "name",
        width: "32%",
        ...getColumnSearchProps("name"),
    },
    {
        title: "EMAIL",
        dataIndex: "email",
        key: "societe",
        ...getColumnSearchProps("email"),
    },
    {
        title: "ROLE",
        key: "role",
        dataIndex: "role",
        ...getColumnSearchProps("tel"),
    },
    {
      title: "ACTION",
      key: "action",
      dataIndex: "action",
      ...getColumnSearchProps("action"),
  },

  ];

  const data = [
    {
        key: "1",
        name: (
            <>
                <Avatar.Group>
                    <Avatar
                        className="shape-avatar"
                        shape="square"
                        size={40}
                        src={face}
                    ></Avatar>
                    <div className="avatar-info">
                        <Title level={5}>Michael John</Title>
                        <p>michael@mail.com</p>
                    </div>
                </Avatar.Group>{" "}
            </>
        ),
        email: (
            <>
                <div className="author-info">
                    <Title level={5}>michael@mail.com</Title>
                </div>
            </>
        ),
        role: (
            <>
                <Button style={{ backgroundColor:"#F9B572", border:"none" , width:"150px", color:"white" }} className="tag-primary">
                    Admin
                </Button>
            </>
        ),
        action: (
            <>
                <div className="ant-employed">
                    <div className="col-action">
                        <Button type="link" danger>
                            {deletebtn}
                        </Button>
                        <Button type="link" className="darkbtn">
                            {pencil}
                        </Button>
                    </div>
                </div>
            </>
        ),
    },
    {
        key: "1",
        name: (
            <>
                <Avatar.Group>
                    <Avatar
                        className="shape-avatar"
                        shape="square"
                        size={40}
                        src={face6}
                    ></Avatar>
                    <div className="avatar-info">
                        <Title level={5}>Michael John</Title>
                        <p>michael@mail.com</p>
                    </div>
                </Avatar.Group>{" "}
            </>
        ),
        email: (
            <>
                <div className="author-info">
                    <Title level={5}>michael@mail.com</Title>
                </div>
            </>
        ),
        role: (
            <>
                <Button style={{ backgroundColor:"#A1EEBD", border:"none" , width:"150px", color:"white" }} className="tag-primary">
                    Agent
                </Button>
            </>
        ),


        action: (
            <>
                <div className="ant-employed">
                    <div className="col-action">
                        <Button type="link" danger>
                            {deletebtn}
                        </Button>
                        <Button type="link" className="darkbtn">
                            {pencil}
                        </Button>
                    </div>
                </div>
            </>
        ),
    },
    {
        key: "1",
        name: (
            <>
                <Avatar.Group>
                    <Avatar
                        className="shape-avatar"
                        shape="square"
                        size={40}
                        src={face3}
                    ></Avatar>
                    <div className="avatar-info">
                        <Title level={5}>Michael John</Title>
                        <p>michael@mail.com</p>
                    </div>
                </Avatar.Group>{" "}
            </>
        ),
        email: (
          <>
              <div className="author-info">
                  <Title level={5}>michael@mail.com</Title>
              </div>
          </>
      ),
        role: (
            <>
                <Button style={{ backgroundColor:"#FF9B9B", border:"none" , width:"150px", color:"white" }} className="tag-primary">
                    Superviseur
                </Button>
            </>
        ),


        action: (
            <>
                <div className="ant-employed">
                    <div className="col-action">
                        <Button type="link" danger>
                            {deletebtn}
                        </Button>
                        <Button type="link" className="darkbtn">
                            {pencil}
                        </Button>
                    </div>
                </div>
            </>
        ),
    },
    {
        key: "1",
        name: (
            <>
                <Avatar.Group>
                    <Avatar
                        className="shape-avatar"
                        shape="square"
                        size={40}
                        src={face2}
                    ></Avatar>
                    <div className="avatar-info">
                        <Title level={5}>Michael John</Title>
                        <p>michael@mail.com</p>
                    </div>
                </Avatar.Group>{" "}
            </>
        ),
        email: (
          <>
              <div className="author-info">
                  <Title level={5}>michael@mail.com</Title>
              </div>
          </>
      ),

      role: (
        <>
            <Button className="tag-primary" style={{ backgroundColor:"#7BD3EA", border:"none" , width:"150px", color:"white" }}>
                Agent Commercial
            </Button>
        </>
    ),
        action: (
            <>
                <div className="ant-employed">
                    <div className="col-action">
                        <Button type="link" danger>
                            {deletebtn}
                        </Button>
                        <Button type="link" className="darkbtn">
                            {pencil}
                        </Button>
                    </div>
                </div>
            </>
        ),
    },

  ];

    const handleChange = (changedValues) => {
        setFormData({
            ...formData,
            ...changedValues,
        });
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={handleChange}
                onFinish={handleSubmit}
                style={{
                    padding: "30px 80px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0px 20px 27px #0000000d",
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8}>
                        <Form.Item>
                            <Dragger
                                {...props}
                                style={{
                                    marginTop: "30px",
                                    padding: "20px 0px",
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <VerticalAlignTopOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Upload profile pictute
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="nom"
                                    label="Nom"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez entrer votre nom!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nom"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez entrer votre email!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        type="email"
                                        placeholder="Email"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="password"
                                    label="Mot de passe"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez entrer votre mot de passe!",
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Mot de passe"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    dependencies={["password"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez confirmer votre mot de passe!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "password"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "Les deux mots de passe ne correspondent pas!"
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Confirmer le mot de passe"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>

                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit">
                            Ajouter
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div style={{

                    marginTop:"20px",
                    marginBottom:"20px"
                }}>
            <Input
            className="header-search mb-2 mt-2"
            style={{ width:"20%", padding:"0px 11px", borderRadius:"6px" }}
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
            <Table
                columns={columns}
                dataSource={data}
                style={{
                    boxShadow: "0px 20px 27px #0000000d",
                    padding: "10px 1px",

                }}
            />
        </div>
        </div>
    );
};

export default AddUserForm;
