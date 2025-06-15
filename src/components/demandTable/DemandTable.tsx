import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Demand } from '../../constants/Interfaces';
import Button from '../button/Button';
import './DemandTable.css';
import convertTime from '../../utils/convertTime';
import { getReport, put } from '../../services/request/Index';

interface DemandTableProps {
  demands: Demand[];
}

const DemandsTable: React.FC<DemandTableProps> = ({ demands }) => {
  const navigate = useNavigate();
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [status, setStatus] = useState("")

  const openActionsModal = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsActionsModalOpen(true);
  };

  const closeActionsModal = () => {
    setIsActionsModalOpen(false);
    setSelectedDemand(null);
  };
  

  const openDescriptionModal = () => {
    setIsActionsModalOpen(false);
    setIsDescriptionModalOpen(true); 
  };

  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedDemand(null);
  };

  const openStatusModal = () => {
    setIsActionsModalOpen(false);
    setIsStatusModalOpen(true); 
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedDemand(null);
  };

  const handleViewDescription = () => {
    if (selectedDemand) {
      openDescriptionModal();
    }
  };

  const handleAlterStatus = () => {
    if (selectedDemand) {
      if (status !== "") {
        put(`/demands/${selectedDemand.id}`, { status: status })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
  };

  const handleManageActions = () => {
    if (selectedDemand) {
      navigate(`acoes/${selectedDemand.id}`)
    }
    closeActionsModal();
  };

  const handleGenerateReport = () => {
          if (!selectedDemand) {
              alert("ID da demanda não encontrado!");
              return;
          }
          try {
              getReport(`/report/${selectedDemand.id}`).then((response) => {
              if (response.statusCode === 200 && response.responseBody instanceof Blob) {
                  // Cria um link temporário para download
                  const url = window.URL.createObjectURL(response.responseBody);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `relatorio_demanda_${selectedDemand.id}.pdf`; // Nome do arquivo
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url); // Libera memória
              } else {
                  alert("Erro ao gerar o relatório: resposta inválida");
                  console.error("Resposta do relatório:", response);
              }
              });
              closeActionsModal()
          } catch (error) {
              console.error("Erro ao baixar o relatório:", error);
              alert("Erro ao baixar o relatório. Tente novamente.");
          }
      };

  return (
    <div className="table">
      <div className="card">
        <div className="card-content">
          <p>Título</p>
          <p>Tipo</p>
          <p>Status</p>
          <p>Ações</p>
        </div>
      </div>
      {demands.map((demand) => (
        <div key={demand.id} className="card">
          <div className="card-content">
            <p>{demand.title}</p>
            <p>{demand.type}</p>
            <p>{demand.status}</p>
            <div className="card-actions">
              <Button onClick={() => openActionsModal(demand)}>Ações</Button>
            </div>
          </div>
        </div>
      ))}
      {isActionsModalOpen && (
        <div className="modal-overlay" onClick={closeActionsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ações para {selectedDemand?.title}</h2>
            <Button onClick={handleViewDescription}>Ver Descrição</Button>
            <Button onClick={openStatusModal}>Alterar Status</Button>
            <Button onClick={handleManageActions}>Gerenciar Ações</Button>
            <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
            <Button onClick={closeActionsModal}>Fechar</Button>
          </div>
        </div>
      )}
      {isDescriptionModalOpen && (
        <div className="modal-overlay" onClick={closeDescriptionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Descrição de {selectedDemand?.title}</h2>
            <p className="description-text">{selectedDemand?.description || 'Sem descrição disponível'}</p>
            <p>Demanda criada em {convertTime(selectedDemand?.creation_date ? selectedDemand.creation_date : "")}</p>
            <Button onClick={closeDescriptionModal}>Fechar</Button>
          </div>
        </div>
      )}
      {isStatusModalOpen && (
        <div className="modal-overlay" onClick={closeStatusModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Alterar o status da demanda</h2>
            <p className="description-text">Status Atual: {selectedDemand?.status}</p>
            <select
              value={status || selectedDemand?.status || ""}
              onChange={e => setStatus(e.target.value)}
            >
              <option value={selectedDemand?.status}>{selectedDemand?.status}</option>
              <option value="Concluida">Concluida</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <Button onClick={handleAlterStatus}>Alterar Status</Button>
            <Button onClick={closeStatusModal}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandsTable;