'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRquuid } from '@context/RquuidContext';
import { UserService } from '@services/user.service';
import { UserAccessService } from '@services/userAccess.service';
import { OPTIONS_ACCESS_ROLE } from '@utils/constants';
import { IUserOptionAccess } from '@utils/models/IUser';
import { ToastService } from '@utils/services/toast.service';
import { Validations } from '@utils/validations';

export const AccessRequest: React.FC = () => {
    const { rquuid } = useRquuid();

    const autocompleteEmailAccessRef = useRef<HTMLSpAtAutocompleteElement | null>(null);
    const checkboxRefs = useRef<Map<number, HTMLSpAtCheckButtonElement>>(new Map());

    const [options, setOptions] = useState<IUserOptionAccess[]>([]);
    const [users, setusers] = useState<any[]>([]);
    const [userFound, setUserFound] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        requestedAccess: [] as string[]
    });

    useEffect(() => {
        return setIsFormValid(
        Validations.isValidEmail(formData.email) && userFound &&
        Validations.isValidOptionsAccess(formData.requestedAccess)
        );
    }, [formData]);

    const loadCheckbox  = (role: string) =>  {
        const options = OPTIONS_ACCESS_ROLE[role as keyof typeof OPTIONS_ACCESS_ROLE];
        if(options){
            const formattedOptions: IUserOptionAccess[] = options.map((value, index) => {
                return {
                    label: value,
                    value: (index + 1).toString(),
                    isChecked: 'false'
                };
            });
            setOptions(formattedOptions);
        }
    }

    const handleEmailChange = (field: string, users: any[]) => (event: any) => {
      const keyEmail = event.detail.value;
      const user = users.find(u => u.value === keyEmail);
      setFormData(prev => ({ ...prev, [field]: user.text.toLowerCase() || '' }));
      loadCheckbox(user.shortText)
    };

    const handleEmailQueryChange = (field: string, users: any[]) => (event: any) => {
        console.log('event',event)
        const emailUser = event.detail.text.toLowerCase();
        const user = users.find(u => u.text === emailUser);
        setFormData(prev => ({ ...prev, [field]: event.detail.text.toLowerCase() || '' }));

       if (Validations.isValidEmail(emailUser)) {
            loadCheckbox(user.shortText);
        } else {
            setOptions([]);
        }
    };

    const handleCheckBoxChange = (label: string, isChecked: string ) =>  {
        setFormData(prev => {
            let updated: string[];
            if (isChecked === 'true') {
                updated = prev.requestedAccess.includes(label)
                    ? prev.requestedAccess
                    : [...prev.requestedAccess, label];
            } else {
                updated = prev.requestedAccess.filter(item => item !== label);
            }
            return { ...prev, requestedAccess: updated };
        });
    }

    const clearDataAccess = () => {
      const autocompleteEmailAccess = autocompleteEmailAccessRef.current;
      autocompleteEmailAccess?.setValue('');

      setFormData({
        email: '',
        requestedAccess: []
      });
      setUserFound(true);
      setOptions([])
    }

    const handleSubmitAccess = async () => {
        try {
            await UserAccessService.postUserAccess(formData, rquuid );
            clearDataAccess();
            ToastService.setToast('SUCCESS','Solicitud enviada exitosamente','');
        } catch {
            clearDataAccess();
            ToastService.setToast('ERROR',
            'Hubo un problema al enviar los datos.',
            'Por favor, vuelve a intentarlo en un momento.');
        }
    };

    useEffect(() => {
        checkboxRefs.current.forEach((checkbox, index) => {
            if (checkbox) {
                const listener = (e: CustomEvent) => {
                    const isChecked = e.detail[0].isChecked;
                    const label = e.detail[0].label;
                    handleCheckBoxChange(label, isChecked);
                };
                checkbox.addEventListener('checkEmitter', listener);
            }
        });
    }, [options]);

    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
              const response = await UserService.getUser();
              if (response.length === 0) setUserFound(false)
              setusers(response);

              const autocompleteEmailAccess = autocompleteEmailAccessRef.current;
              if (autocompleteEmailAccess)
                autocompleteEmailAccess.addEventListener('eventOptionSelected', handleEmailChange('email', response));
              if (autocompleteEmailAccess)
                autocompleteEmailAccess.addEventListener('eventQueryChanged', handleEmailQueryChange('email', response));
            } catch (error) {
                console.error('Error al obtener a los colaboradores:', error);
            }
        };
        fetchDataUsers();
    }, []);

    return (
    <div style={{ paddingBottom:'120px' }}>
        <div className='sp-text-heading-5 title-form'>
            Asignar accesos
        </div>
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
                {options.length > 0 && ( <div className='container-labels-form'>
                    <div className='sp-text-label-1'>
                        Aplicaciones a las que requiere acceso:
                    </div>
                    <div className='access-grid'>
                        {options.map((option, index) => (
                            <sp-at-check-button
                                ref={el => {
                                    if (el) {
                                        checkboxRefs.current.set(index, el);
                                    }
                                }}
                                key={option.label}
                                id={`check-${index}`}
                                className="access-check-button"
                                is-horizontal={true}
                                values-to-check={JSON.stringify([option])}
                            ></sp-at-check-button>
                        ))}
                    </div>
                </div> )}
            </div>
            <button id="submitButton" className="sp-at-btn sp-at-btn--primary sp-at-btn--lg button-form"
            disabled={!isFormValid}
            onClick={handleSubmitAccess}>
            Solicitar accesos
            </button>
        </div>
    </div>
    );
};