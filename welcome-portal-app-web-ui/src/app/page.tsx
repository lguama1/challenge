'use client';
import { useEffect, useRef, useState } from 'react';
import {
  applyPolyfills,
  defineCustomElements
} from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';
import '@styles/bbog-dig-dt-sherpa-lib.css';
import { Record } from '@components/Record';
import { CreateUser } from '@components/CreateUser';
import { SIDERBAR_LIST } from '@utils/constants';
import { AccessRequest } from '@components/AccessRequest';
import { LaptopAllocation } from '@components/LaptopAllocation';

export default function Page() {

  const dashboardRef = useRef<HTMLSpTpDashboardElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    applyPolyfills().then(() => {
      defineCustomElements(window);
    });
  }, []);

  const handleOptionSelect = () => (event: any) => {
    const item = event.detail.item?.label;
    if (item) setActiveSection(item);
  };

  useEffect(() => {
    const dashboard = dashboardRef.current;
    if (dashboard) dashboard.addEventListener('sidebarEmitter', handleOptionSelect());
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'Historial':
        return <Record />;
      case 'Creación de usuario':
        return <CreateUser />
      case 'Solicitud de accesos':
        return <AccessRequest />
      case 'Asignación de laptop':
        return <LaptopAllocation />
      default:
        return <Record />;
    }
  };

  return (
    <>
    <sp-at-toast id="toastSaved"></sp-at-toast>
    <sp-tp-dashboard ref={dashboardRef}
      header-title="Gestión de ingresos y recursos para colaboradores"
      back-button={false}
      close-button={true}
      items-sidebar={JSON.stringify(SIDERBAR_LIST)}
      ><div slot="slot-content">{renderContent()}</div>
    </sp-tp-dashboard>
    </>
  );
}
