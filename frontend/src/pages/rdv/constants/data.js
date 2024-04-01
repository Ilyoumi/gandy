import face from "../../../assets/images/face-1.jpg";
import { Avatar, Typography, Button } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";
const { Title } = Typography;

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
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
                      src={face}
                  ></Avatar>
                  <div className="avatar-info">
                      <Title level={5}>Michael John</Title>
                      <p>michael@mail.com</p>
                  </div>
              </Avatar.Group>{" "}
          </>
      ),
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
                      src={face}
                  ></Avatar>
                  <div className="avatar-info">
                      <Title level={5}>Michael John</Title>
                      <p>michael@mail.com</p>
                  </div>
              </Avatar.Group>{" "}
          </>
      ),
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
                      src={face}
                  ></Avatar>
                  <div className="avatar-info">
                      <Title level={5}>Michael John</Title>
                      <p>michael@mail.com</p>
                  </div>
              </Avatar.Group>{" "}
          </>
      ),
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
                      src={face}
                  ></Avatar>
                  <div className="avatar-info">
                      <Title level={5}>Michael John</Title>
                      <p>michael@mail.com</p>
                  </div>
              </Avatar.Group>{" "}
          </>
      ),
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
                      src={face}
                  ></Avatar>
                  <div className="avatar-info">
                      <Title level={5}>Michael John</Title>
                      <p>michael@mail.com</p>
                  </div>
              </Avatar.Group>{" "}
          </>
      ),
      societe: (
          <>
              <div className="author-info">
                  <Title level={5}>BlueTech Solutions</Title>
                  <p>Organization</p>
              </div>
          </>
      ),
      tel: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 123-4567
              </Button>
          </>
      ),
      gsm: (
          <>
              <Button type="primary" className="tag-primary">
                  +1 (555) 987-6543
              </Button>
          </>
      ),
      date: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
          </>
      ),
      agent: (
          <>
              <div className="ant-employed">
                  <span>Jennifer Smith</span>
              </div>
          </>
      ),
      agenda: (
          <>
              <div className="ant-employed">
                  <span>23/04/18</span>
              </div>
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
export default data