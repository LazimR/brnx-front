import React from 'react';
import { Provider } from '../../constants/Interfaces';
import Button from '../button/Button'; // Ajuste o caminho conforme sua estrutura

interface ProvidersTableProps {
  providers: Provider[];
  onManageDemands: (providerId: string) => void;
}

const ProvidersTable: React.FC<ProvidersTableProps> = ({ providers, onManageDemands }) => {
  return (
    <div className="table">
      {providers.map((provider) => (
        <div key={provider.id} className="card">
          <div className="card-content">
            <h3>{provider.name}</h3>
            {/* Adicione outros campos do provider conforme necessário */}
          </div>
          <div className="card-actions">
            <Button 
              onClick={() => onManageDemands(provider.id)}
            >
              Gerenciar Demandas
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProvidersTable;