import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Card,
  ConfigProvider,
  Select,
  Radio,
  message,
  Alert,
} from "antd";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import { axiosClient } from "../../../api/axios";
import SaveButton from "../../../constants/SaveButton";

const { Option } = Select;

const AddAppointment = ({ onFormSubmit, agendaId, selectedDate }) => {
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    nom: "",
    prenom: "",
    nom_ste: "",
    postal: "",
    adresse: "",
    tva: "",
    tel: "",
    gsm: "",
    fournisseur: "",
    pro: false,
    nbr_comp_elect: "",
    nbr_comp_gaz: "",
    ppv: false,
    tarif: false,
    haute_tension: false,
    tarification: "",
    commentaire: "",
    note: "",
    appointment_date: selectedDate
      ? [
        new Date(selectedDate.date),
        new Date(selectedDate.date.getTime() + 3600000),
      ]
      : null,
  });

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const fetchUserData = async () => {
    try {
      // Check if the user is logged in
      const authToken = localStorage.getItem("auth_token");
      if (!authToken) {
        // User is not logged in, do nothing
        return;
      }

      // User is logged in, fetch user data
      const response = await axiosClient.get("/api/user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { id } = response.data;
      setUserId(id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFormSubmit = async () => {
    setLoading(true);


    let startDate, endDate;

    if (!formData.appointment_date) {
      // Use the default selected date from the calendar if an appointment date is not selected
      startDate = selectedDate.date;
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    } else {
      startDate = formData.appointment_date[0]
      endDate = formData.appointment_date[1]
    }



    const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);


    try {
      const [nom, prenom] = formData.nom_prenom ? formData.nom_prenom.split(' ') : ['', ''];


      const formDataToSend = {
        ...formData,
        nom: nom,
        prenom: prenom,
        start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
        end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
        id_agent: userId,
        id_agenda: agendaId,
        tarification: formData.tarif ? "Variable" : "Fixe",
        note: formData.note,
        commentaire: formData.commentaire,
      };


      const submissionResponse = await axiosClient.post(
        "/api/rdvs",
        formDataToSend
      );

      const newAppointment = {
        ...submissionResponse.data,
        id: submissionResponse.data.id,
      };

      setLoading(false);
      onFormSubmit({ ...submissionResponse.data, newAppointment });
      message.success("Rendez-vous ajouté avec succès !");
      setShowAlert(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setShowAlert(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      console.error("Error adding appointment:", error);

    }
  };




  return (
    <Form
      layout="vertical"
      onFinish={handleFormSubmit}
    >
      {showAlert && (
        <Alert
          message="La date sélectionnée est déjà réservée."
          type="warning"
          showIcon
          closable
          onClose={() => setShowAlert(false)}
        />
      )}
      <Card style={{ marginBottom: "10px" }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={18}>
            <ConfigProvider locale={frFR}>
              <DatePicker.RangePicker
                rules={[
                  {
                    required: true,
                    message:
                      "Veuillez sélectionner une date de rendez-vous !",
                  },
                ]}
                value={
                  selectedDate
                    ? [
                      moment(selectedDate.date).utcOffset("+0100"),

                      moment(selectedDate.date)
                        .add(1, "hour")
                        .utcOffset("+0100"),
                    ]
                    : null
                }
                showTime={{
                  format: "HH:mm",
                  minuteStep: 15,
                  disabledHours: () => {
                    const disabledHours = [];
                    for (let i = 0; i < 9; i++) {
                      disabledHours.push(i);
                    }
                    for (let i = 20; i < 24; i++) {
                      disabledHours.push(i);
                    }
                    return disabledHours;
                  },
                }}
                format="YYYY-MM-DD HH:mm"
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    setFormData({
                      ...formData,
                      appointment_date: dates,
                    });
                  } else {
                    setFormData({
                      ...formData,
                      appointment_date: null,
                    });
                  }
                }}
              />
            </ConfigProvider>
          </Col>
          <Col span={4}>
            <SaveButton
              onClick={handleClick}
              loading={loading}
              buttonText="Enregistrer"
            />
          </Col>
        </Row>
      </Card>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Êtes-vous un professionnel ?"
                      name="pro"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez sélectionner votre statut professionnel !",
                        },
                      ]}
                    >
                      <Radio.Group
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pro: e.target.value,
                          })
                        }
                      >
                        <Radio value={true}>Oui</Radio>
                        <Radio value={false}>Non</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Nom et Prénom"
                      name="nom_prenom"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre nom et prénom !",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nom_prenom: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>

                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {formData.pro && (
                    <>
                      <Col span={24}>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                              label="Nom de Société"
                              name="nom_ste"

                            >
                              <Input
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    nom_ste: e.target.value,
                                  })
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                              label="TVA"
                              name="tva"
                              rules={[

                                {
                                  validator: (_, value) => {
                                    const regex = /^\d{9}$/;
                                    if (value && !regex.test(value)) {
                                      return Promise.reject(
                                        'Le numéro de TVA doit commencer par "BE0" suivi de 9 chiffres.'
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <Input
                                addonBefore="BE0"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    tva: e.target.value,
                                  })
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                      label="Adresse"
                      name="adresse"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez entrer votre adresse !",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adresse: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                      label="Code Postal"
                      name="postal"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez entrer votre code postal !",
                        },
                        {
                          pattern: /^\d{4}$/,
                          message:
                            "Veuillez entrer un code postal valide (4 chiffres).",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postal: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                      name="tel"
                      label="Téléphone"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez saisir votre numéro de téléphone!",
                        },
                        {
                          pattern: /^\d{8}$/,
                          message:
                            "Veuillez saisir un numéro de téléphone valide de 8 chiffres (ex: +32123456789).",
                        },
                      ]}
                    >
                      <Input
                        addonBefore={
                          <span
                            style={{
                              padding: "0 8px",
                            }}
                          >
                            +32
                          </span>
                        }
                        style={{ width: "100%" }}
                        defaultValue=""
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tel: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={12}>
                    <Form.Item
                      label="GSM"
                      name="gsm"
                      rules={[

                        {
                          pattern: /^\d{8}$/,
                          message:
                            "Veuillez saisir un numéro de GSM valide de 8 chiffres(ex: +32412345678).",
                        },
                      ]}
                    >
                      <Input
                        addonBefore={
                          <span
                            style={{
                              padding: "0 8px",
                            }}
                          >
                            +324
                          </span>
                        }
                        style={{ width: "100%" }}
                        defaultValue=""
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gsm: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Nombre de Compteurs Électriques"
                      name="nbr_comp_elect"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez sélectionner le nombre de compteurs Électriques !",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            nbr_comp_elect: value,
                          })
                        }
                        placeholder="Sélectionner le nombre de compteurs électriques"
                      >
                        <Select.Option value="0">
                          0
                        </Select.Option>
                        <Select.Option value="1">
                          1
                        </Select.Option>
                        <Select.Option value="2">
                          2
                        </Select.Option>
                        <Select.Option value="3">
                          3
                        </Select.Option>
                        <Select.Option value="4">
                          4
                        </Select.Option>
                        <Select.Option value="+4">
                          +4
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Nombre de Compteurs Gaz"
                      name="nbr_comp_gaz"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez sélectionner le nombre de compteurs de gaz !",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            nbr_comp_gaz: value,
                          })
                        }
                        placeholder="Sélectionner le nombre de compteurs gaz"
                      >
                        <Select.Option value="0">
                          0
                        </Select.Option>
                        <Select.Option value="1">
                          1
                        </Select.Option>
                        <Select.Option value="2">
                          2
                        </Select.Option>
                        <Select.Option value="3">
                          3
                        </Select.Option>
                        <Select.Option value="4">
                          4
                        </Select.Option>
                        <Select.Option value="+4">
                          +4
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Commentaire"
                      name="commentaire"

                    >
                      <Input.TextArea rows={3} onChange={(e) =>
                        setFormData({
                          ...formData,
                          commentaire: e.target.value,
                        })} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="fournisseur"
                  label="Fournisseur"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez sélectionner votre fournisseur actuel!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Sélectionner votre fournisseur"
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        fournisseur: value,
                      })
                    }
                  >
                    {[
                      "Luminus",
                      "Mega",
                      "OCTA+",
                      "Eneco",
                      "TotalEnergies",
                      "Aspiravi Energy",
                      "Bolt",
                      "COCITER",
                      "DATS 24",
                      "EBEM",
                      "Ecopower",
                      "Elegant",
                      "Energie.be",
                      "Frank Energie",
                      "Trevion",
                      "Wind voor A",
                    ].map((fournisseur, index) => (
                      <Option
                        key={index}
                        value={fournisseur}
                      >
                        {fournisseur}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="PPV"
                  name="ppv"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez sélectionner Oui ou Non pour PPV !",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tarif: e.target.value,
                      })
                    }
                  >
                    <Radio value={true}>Oui</Radio>
                    <Radio value={false}>Non</Radio>
                  </Radio.Group>
                </Form.Item>

                {showAdditionalInput && (
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Additional Input"
                        name="additionalInput"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Tarif Social"
                  name="tarif"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez sélectionner si vous avez un tarif social ou non !",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tarif: e.target.value,
                      })
                    }
                  >
                    <Radio value={true}>Oui</Radio>
                    <Radio value={false}>Non</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Haute Tension"
                  name="haute_tension"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez sélectionner si vous êtes en haute tension ou non !",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tarif: e.target.value,
                      })
                    }
                  >
                    <Radio value={true}>Oui</Radio>
                    <Radio value={false}>Non</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Tarification"
                  name="tarification"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez sélectionner votre type de tarification !",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tarif: e.target.value,
                      })
                    }
                  >
                    <Radio value={true}>Variable</Radio>
                    <Radio value={false}>Fixe</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Note" name="note" >
                  <Input.TextArea rows={3} onChange={(e) =>
                    setFormData({
                      ...formData,
                      note: e.target.value,
                    })
                  } />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default AddAppointment;
