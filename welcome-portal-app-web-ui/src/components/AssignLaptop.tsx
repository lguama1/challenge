'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRquuid } from '@context/RquuidContext';
import { AssingLaptopService } from '@services/assingLaptop.service';
import { UserService } from '@services/user.service';
import { OPTIONS_LAPTOP } from '@utils/constants';
import { ToastService } from '@utils/services/toast.service';
import { Validations } from '@utils/validations';

export const AssignLaptop: React.FC = () => {
    const { rquuid } = useRquuid();

    const autocompleteEmailAccessRef = useRef<HTMLSpAtAutocompleteElement | null>(null);
    const dropdownLaptopRef = useRef<HTMLSpAtDropdownElement | null>(null);

    const [users, setusers] = useState<any[]>([]);
    const [userFound, setUserFound] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        requestedSystem: ''
    });

    useEffect(() => {
        return setIsFormValid(
        Validations.isValidEmail(formData.email) && userFound &&
        formData.requestedSystem !== ''
        );
    }, [formData]);

    const handleEmailChange = (field: string, users: any[]) => (event: any) => {
      const keyEmail = event.detail.value;
      const user = users.find(u => u.value === keyEmail);
      setFormData(prev => ({ ...prev, [field]: user.text.toLowerCase() || '' }));
    };

    const handleDropdownLaptopChange = (event: any) => {
      setFormData(prev => ({ ...prev, requestedSystem: event.detail.text ?? '' }));
    };

    const clearDataAssignLaptop = () => {
        const autocompleteEmailAccess = autocompleteEmailAccessRef.current;
        const dropdownLaptop = dropdownLaptopRef.current;

        autocompleteEmailAccess?.setValue('');
        dropdownLaptop?.reset();

        setFormData({
            email: '',
            requestedSystem: ''
        });
        setUserFound(true)
    }

    const handleSubmitAssignLaptop = async () => {
        try {
            await AssingLaptopService.assingLaptop(formData, rquuid );
            clearDataAssignLaptop();
            ToastService.setToast('SUCCESS','Solicitud enviada exitosamente','');
        } catch {
            clearDataAssignLaptop();
            ToastService.setToast('ERROR',
            'Hubo un problema al enviar los datos.',
            'Por favor, vuelve a intentarlo en un momento.');
        }
    };

    useEffect(() => {
        const dropdownLaptop = dropdownLaptopRef.current;
        if (dropdownLaptop) dropdownLaptop.addEventListener('elementSelectedAtom', handleDropdownLaptopChange);
    }, []);

    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
              const response = await UserService.getUser();
              if (response.length === 0) setUserFound(false)
              setusers(response);

              const autocompleteEmailAccess = autocompleteEmailAccessRef.current;
              if (autocompleteEmailAccess)
                autocompleteEmailAccess.addEventListener('eventOptionSelected', handleEmailChange('email', response));
            } catch (error) {
                console.error('Error al obtener a los colaboradores:', error);
            }
        };
        fetchDataUsers();
    }, []);

    return (
    <div style={{ paddingBottom:'120px', paddingTop:'45px' }}>
        <div className="container-form">
            <div className="container-labels-form">
            <sp-at-autocomplete ref={autocompleteEmailAccessRef}
                id="email"
                required={true}
                options={JSON.stringify(users)}
                label="Correo electrónico del colaborador que recibirá los accesos."
                placeholder="Ejemplo: user@bancodebogota.com.co"
                status="ENABLED"
                message="Selecciona el correo electronico del colaborador.">
            </sp-at-autocomplete>
            <sp-at-dropdown ref={dropdownLaptopRef}
                label="Tipo de laptop"
                status="ENABLED"
                placeholder="Selecciona"
                message='Selecciona el sistema operativo de la laptop que tendra el colaborador.'
                options={JSON.stringify(OPTIONS_LAPTOP)}
            ></sp-at-dropdown>
            </div>
            <button id="submitButton" className="sp-at-btn sp-at-btn--primary sp-at-btn--lg button-form"
            disabled={!isFormValid}
            onClick={handleSubmitAssignLaptop}>
            Asignar laptop
            </button>
        </div>
    </div>
    );
};