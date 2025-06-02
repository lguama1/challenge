'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRquuid } from '@context/RquuidContext';
import { UserService } from '@services/user.service';
import { OPTIONS_ROL } from '@utils/constants';
import { ToastService } from '@utils/services/toast.service';
import { Validations } from '@utils/validations';
import '@styles/createUser.css';

export const CreateUser: React.FC = () => {
    const { rquuid } = useRquuid();

    const inputNameRef = useRef<HTMLSpAtInputElement | null>(null);
    const inputEmailRef = useRef<HTMLSpAtInputElement | null>(null);
    const inputAreaRef = useRef<HTMLSpAtInputElement | null>(null);
    const dropdownRoleRef = useRef<HTMLSpAtDropdownElement | null>(null);

    const [isFormValidCreateUser, setIsFormValidCreateUser] = useState(false);
    const [formDataCreateUser, setFormDataCreateUser] = useState({
        name: '',
        email: '',
        area: '',
        role: ''
    });

    useEffect(() => {
      return setIsFormValidCreateUser(
        Validations.isValidName(formDataCreateUser.name) &&
        formDataCreateUser.role !== '' &&
        Validations.isValidEmail(formDataCreateUser.email) &&
        Validations.isValidArea(formDataCreateUser.area)
      );
    }, [formDataCreateUser]);

    const handleInputChange = (field: string) => (event: any) => {
      setFormDataCreateUser(prev => ({ ...prev, [field]: event.detail.value || '' }));
    };

    const handleDropdownRoleChange = (event: any) => {
      setFormDataCreateUser(prev => ({ ...prev, role: event.detail.text ?? '' }));
    };

    const clearData = () => {
      const inputName = inputNameRef.current;
      const inputEmail = inputEmailRef.current;
      const inputArea = inputAreaRef.current;
      const dropdownRole = dropdownRoleRef.current;

      inputName?.restartValue();
      inputArea?.restartValue();
      dropdownRole?.reset();
      inputEmail?.restartValue();

      setFormDataCreateUser({
        name: '',
        email: '',
        area: '',
        role: ''
      });
    }

    const handleSubmitUser =  async () => {
      try {
        await UserService.postUser(formDataCreateUser, rquuid );
        clearData();
        ToastService.setToast('SUCCESS','Solicitud enviada exitosamente','');
      } catch {
        clearData();
        ToastService.setToast('ERROR',
        'Hubo un problema al enviar los datos.',
        'Por favor, vuelve a intentarlo en un momento.');
      }
    };

    useEffect(() => {
        const inputName = inputNameRef.current;
        const inputEmail = inputEmailRef.current;
        const inputArea = inputAreaRef.current;
        const dropdownRole = dropdownRoleRef.current;

        if (inputName) inputName.addEventListener('atInputChanged', handleInputChange('name'));
        if (inputArea) inputArea.addEventListener('atInputChanged', handleInputChange('area'));
        if (dropdownRole) dropdownRole.addEventListener('elementSelectedAtom', handleDropdownRoleChange);
        if (inputEmail) inputEmail.addEventListener('atInputChanged', handleInputChange('email'));
    }, []);

    return (
    <div style={{ paddingBottom:'120px' }}>
        <div className='sp-text-heading-5 title-form'>
            Registrar nuevo colaborador
        </div>
        <div className="container-form">
            <div className="container-labels-form">
            <sp-at-input ref={inputNameRef}
                id='name'
                label="Nombre completo"
                message="Ingresa el nombre completo del colaborador (nombre y apellido)."
                placeholder="Ejemplo: Juan Peréz"
                type="TEXT"
                status="ENABLED"
                required={true}
                name="Name"
                minlength='3'
                maxlength='120'
                regex={/^\s*([A-Za-zÁÉÍÓÚáéíóúÑñ']+\x20+)+[A-Za-zÁÉÍÓÚáéíóúÑñ']+\s*$/}
                view-mode
            ></sp-at-input>
            <sp-at-input ref={inputEmailRef}
                id="emailCreateUSer"
                label="Correo electrónico"
                message="Ingresa el correo electronico del colaborador."
                placeholder="Ejemplo: user@bancodebogota.com.co"
                type="EMAIL"
                name="emailCreateUSer"
                status="ENABLED"
                required={true}
                minlength='23'
                maxlength='50'
                autoComplete={true}
                regex={/^[a-zA-Z0-9._%+-]+@bancodebogota\.com\.co$/}
                view-mode
            >
            </sp-at-input>
            <sp-at-input ref={inputAreaRef}
                id='area'
                label="Area"
                message="Ingresa el area del colaborador."
                placeholder="Ejemplo: Estrategia Digital"
                type="TEXT"
                status="ENABLED"
                required={true}
                name="Area"
                minlength='3'
                maxlength='80'
                regex={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/}
                view-mode
            ></sp-at-input>
            <sp-at-dropdown ref={dropdownRoleRef}
                label="Rol del colaborador"
                status="ENABLED"
                placeholder="Selecciona"
                message='Selecciona el tipo de rol que tendra el colaborador.'
                options={JSON.stringify(OPTIONS_ROL)}
            ></sp-at-dropdown>
            </div>
            <button className="sp-at-btn sp-at-btn--primary sp-at-btn--lg button-form"
            disabled={!isFormValidCreateUser}
            onClick={handleSubmitUser}>
            Crear usuario
            </button>
        </div>
    </div>
    );
};