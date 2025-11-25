import { useState } from 'react';
import { PortMasterListPage } from './PortMasterListPage';
import { PortMasterFormPage } from './PortMasterFormPage';

type ViewMode = 'list' | 'form';
type FormMode = 'add' | 'edit' | 'view';

export const PortMasterPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedPortId, setSelectedPortId] = useState<string | undefined>();

  const handleNavigateToForm = (mode: FormMode, portId?: string) => {
    setFormMode(mode);
    setSelectedPortId(portId);
    setViewMode('form');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPortId(undefined);
  };

  if (viewMode === 'form') {
    return (
      <PortMasterFormPage
        mode={formMode}
        portId={selectedPortId}
        onBack={handleBackToList}
      />
    );
  }

  return <PortMasterListPage onNavigateToForm={handleNavigateToForm} />;
};
