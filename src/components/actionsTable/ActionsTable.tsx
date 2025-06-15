import React, { useState } from 'react';
import { Actions } from '../../constants/Interfaces';
import Button from '../button/Button'; // Ajuste o caminho conforme sua estrutura
import './ActionsTable.css';
import convertTime from '../../utils/convertTime';

interface ActionsTableProps {
  actions: Actions[];
}

const ActionsTable: React.FC<ActionsTableProps> = ({ actions }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Actions | null>(null);

  const openDescriptionModal = (action: Actions) => {
    setSelectedAction(action);
    setIsDescriptionModalOpen(true);
  };

  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedAction(null);
  };

  return (
    <div className="table">
      <div className="card">
        <div className="card-content">
          <p>Nome do Técnico</p>
          <p>Data de Criação</p>
          <p>Ações</p>
        </div>
      </div>
      {actions.map((action) => (
        <div key={action.id} className="card">
          <div className="card-content">
            <p>{action.technician_name}</p>
            <p>{convertTime(action.creation_date)}</p>
            <div className="card-actions">
              <Button onClick={() => openDescriptionModal(action)}>Ver Descrição</Button>
            </div>
          </div>
        </div>
      ))}
      {isDescriptionModalOpen && (
        <div className="modal-overlay" onClick={closeDescriptionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Descrição da Ação {selectedAction?.id}</h2>
            <p className="description-text">{selectedAction?.description || 'Sem descrição disponível'}</p>
            <Button onClick={closeDescriptionModal}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsTable;