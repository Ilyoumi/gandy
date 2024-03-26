import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Form, Input, Button, DatePicker, Select, Radio, message } from 'antd';

const { Option } = Select;

const CalendarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleFormSubmit = (values) => {
    const { title, description, startTime, endTime } = values;
    const color = getRandomColor();
    const newAppointment = {
      title,
      description,
      start: startTime.toDate(),
      end: endTime.toDate(),
      color
    };
    setAppointments([...appointments, newAppointment]);
    message.success('Rendez-vous ajouté avec succès !');
    handleCloseModal();
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        events={appointments} // Display appointments on the calendar
        eventDisplay="block" // Display events as blocks
        eventBackgroundColor="#52c41a" // Custom color for added appointments
        eventBorderColor="#87d068" // Custom border color for added appointments
      />
      <Modal
        visible={showModal}
        title="Ajouter un rendez-vous"
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Titre"
            name="title"
            rules={[{ required: true, message: 'Veuillez entrer le titre !' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Heure de début"
            name="startTime"
            rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de début !' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Heure de fin"
            name="endTime"
            rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de fin !' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez entrer votre nom !' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Prénom"
            name="prenom"
            rules={[{ required: true, message: 'Veuillez entrer votre prénom !' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TVA"
            name="tva"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Téléphone"
            name="tel"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="GSM"
            name="gsm"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fournisseur Actuel"
            name="fournisseur"
            rules={[{ required: true, message: 'Veuillez sélectionner votre fournisseur actuel !' }]}
          >
            <Select>
              <Option value="fournisseur1">Fournisseur 1</Option>
              <Option value="fournisseur2">Fournisseur 2</Option>
              <Option value="fournisseur3">Fournisseur 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Nombre de Compteurs Électriques"
            name="compteurElectrique"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombre de Compteurs Gaz"
            name="compteurGaz"
            rules={[{ required: true, message: 'Veuillez sélectionner le nombre de compteurs de gaz !' }]}
          >
            <Select>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="+4">+4</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Tarif Social"
            name="tarifSocial"
            rules={[{ required: true, message: 'Veuillez sélectionner si vous avez un tarif social ou non !' }]}
          >
            <Radio.Group>
              <Radio value={true}>Oui</Radio>
              <Radio value={false}>Non</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Haute Tension"
            name="hauteTension"
            rules={[{ required: true, message: 'Veuillez sélectionner si vous êtes en haute tension ou non !' }]}
          >
            <Radio.Group>
              <Radio value={true}>Oui</Radio>
              <Radio value={false}>Non</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="PPV"
            name="ppv"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tarification"
            name="tarification"
            rules={[{ required: true, message: 'Veuillez sélectionner votre type de tarification !' }]}
          >
            <Radio.Group>
              <Radio value="fixe">Fixe</Radio>
              <Radio value="variable">Variable</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Commentaire"
            name="commentaire"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ajouter un rendez-vous
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarComponent;

