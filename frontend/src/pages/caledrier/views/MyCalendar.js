import React from 'react';
import FullCalendar from '@fullcalendar/react'; // import the React wrapper
import dayGridPlugin from '@fullcalendar/daygrid'; // import the DayGrid plugin
import timeGridPlugin from '@fullcalendar/timegrid'; // import the TimeGrid plugin
import interactionPlugin from '@fullcalendar/interaction'; // import the interaction plugin
import frLocale from '@fullcalendar/core/locales/fr'; // import French locale
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Select } from "antd";

const { Option } = Select;

function MyCalendar() {
    const handleDropdownChange = (value) => {
        console.log(`Selected option: ${value}`);
        // Faire quelque chose avec la valeur sélectionnée
    };
    const handleDropdownItemClick = (item) => {
        console.log(`Selected option: ${item}`);
        // Faire quelque chose avec l'élément sélectionné
    };
    return (
        <div style={{ marginBottom:"30px" }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
                initialView="dayGridMonth"
                locale={frLocale}
                events={[
                // vos événements ici
                ]}
                headerToolbar={{
                    left: 'myDropdown',
                    center: 'title',
                    right: 'today prev,next dayGridMonth,timeGridWeek,timeGridDay',
                }}
                customButtons={{
                    myDropdown: {
                        text: 'Dropdown',
                        click: () => {
                            // Cette fonction sera appelée lors du clic sur le bouton Dropdown
                            const dropdownItems = ['Contact 1', 'Contact 2', 'Contact 3'];
                            const selectedItem = window.prompt('Select an option:\n' + dropdownItems.join('\n'));
                            if (selectedItem) {
                                handleDropdownItemClick(selectedItem);
                            }
                        }
                    }
                }}
                buttonText={{
                    today:    'Aujourd\'hui',
                    month:    'Mois',
                    week:     'Semaine',
                    day:      'Jour',
                    list:     'Liste'
                }}
                slotDuration={'00:30:00'}
                handleWindowResize={true}
            />
          
        </div>
    );
}

export default MyCalendar;
