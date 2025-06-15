import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider } from '../../constants/Interfaces';
import Button from '../button/Button';

interface ProvidersTableProps {
    providers: Provider[];
}

const ProvidersTable: React.FC<ProvidersTableProps> = ({ providers = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="table">
            {providers.length === 0 ? (
                <h1>Sem provedores cadastrados</h1>
            ) : (
                providers.map((provider) => (
                    <div key={provider.id} className="card">
                        <div className="card-content">
                            <h3>{provider.name}</h3>
                            {/* Adicione outros campos do provider conforme necessário */}
                        </div>
                        <div className="card-actions">
                            <Button onClick={() => navigate(`/demanda/${provider.id}`)}>
                                Gerenciar Demandas
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProvidersTable;