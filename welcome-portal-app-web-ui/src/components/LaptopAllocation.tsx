'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AssignLaptop } from './AssignLaptop';
import { LaptopInventory } from './LaptopInventory';
import { TABS_LAPTOPS_ALLOCATION } from '@utils/constants';

export const LaptopAllocation: React.FC = () => {

  const tabsLaptopRef = useRef<HTMLSpMlSecondtabsElement | null>(null);
  const [activeTap, setActiveTap] = useState<string>('');

  const handleTabChange = (event: any) => {
    const item = event.detail.slotName;
    if (item) setActiveTap(item);
  };

  useEffect(() => {
      const tabsLaptop = tabsLaptopRef.current;
      if (tabsLaptop) tabsLaptop.addEventListener('mlTabsChanged', handleTabChange)
  }, []);

  const renderContent = () => {
    switch (activeTap) {
      case 'tableLaptopInventary':
        return <LaptopInventory />
      case 'formLaptopAllocation':
        return <AssignLaptop />;
      default:
        return <AssignLaptop />;
    }
  };

  return (
    <div style={{ paddingBottom:'120px' }}>
      <sp-ml-secondtabs
        ref={tabsLaptopRef}
        position="center"
        proportional-width={true}
        tabs={JSON.stringify(TABS_LAPTOPS_ALLOCATION)}
      ></sp-ml-secondtabs>
      <div slot="slot-content-laptop">{renderContent()}</div>
    </div>
  );
};