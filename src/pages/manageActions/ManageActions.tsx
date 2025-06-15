import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./ManageActions.css";
import { get, post, getReport } from "../../services/request/Index";
import ActionsTable from "../../components/actionsTable/ActionsTable";
import Button from "../../components/button/Button";

interface FormData {
    technician_name: string;
    description: string;
}

const ManageActions = () => {
    const [actions, setActions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        technician_name: "",
        description: "",
    });
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const navigate = useNavigate();
    const params = useParams();
    const demandId = params.demand_id;

    useEffect(() => {
        if (demandId) {
            get(`/actions/demand/${demandId}`).then((result) => {
                if (result.statusCode === 200) {
                    setActions(result.responseBody);
                } else if (result.statusCode === 500) {
                    alert("Nenhuma ação foi encontrada!");
                } else {
                    alert(result.responseBody.error);
                }
            });
        }
    }, [demandId]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ technician_name: "", description: "" });
        setFormErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof FormData]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};
        if (!formData.technician_name.trim()) errors.technician_name = "Nome do técnico é obrigatório";
        if (!formData.description.trim()) errors.description = "Descrição é obrigatória";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !demandId) return;

        try {
            const response = await post("/actions", {
                id_demand: demandId,
                ...formData,
            });
            if (response.statusCode === 201) {
                const updatedActions = await get(`/actions/demand/${demandId}`);
                setActions(updatedActions.responseBody);
                closeModal();
            } else {
                console.error("Erro ao adicionar ação:", response.responseBody);
                setFormErrors({ description: "Erro ao cadastrar ação" });
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setFormErrors({ description: "Erro ao conectar com o servidor" });
        }
    };

    const handleGenerateReport = () => {
        if (!demandId) {
            alert("ID da demanda não encontrado!");
            return;
        }
        try {
            getReport(`/report/${demandId}`).then((response) => {
            if (response.statusCode === 200 && response.responseBody instanceof Blob) {
                // Cria um link temporário para download
                const url = window.URL.createObjectURL(response.responseBody);
                const link = document.createElement('a');
                link.href = url;
                link.download = `relatorio_demanda_${demandId}.pdf`; // Nome do arquivo
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Libera memória
            } else {
                alert("Erro ao gerar o relatório: resposta inválida");
                console.error("Resposta do relatório:", response);
            }
            });
        } catch (error) {
            console.error("Erro ao baixar o relatório:", error);
            alert("Erro ao baixar o relatório. Tente novamente.");
        }
    };

    return (
        <div className="manage-actions">
            <ActionsTable actions={actions} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                }}
            >
                <Button onClick={() => navigate(-1)}>Voltar</Button>
                <Button onClick={openModal}>Adicionar Ação</Button>
                <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Adicionar Ação</h2>
                        <form onSubmit={handleSubmit} className="action-form">
                            <div className="form-group">
                                <label htmlFor="technician_name">Nome do Técnico</label>
                                <input
                                    type="text"
                                    id="technician_name"
                                    name="technician_name"
                                    value={formData.technician_name}
                                    onChange={handleInputChange}
                                    className={formErrors.technician_name ? "input-error" : ""}
                                />
                                {formErrors.technician_name && (
                                    <span className="error">{formErrors.technician_name}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Descrição</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={formErrors.description ? "input-error" : ""}
                                    rows={4}
                                />
                                {formErrors.description && (
                                    <span className="error">{formErrors.description}</span>
                                )}
                            </div>
                            <div className="form-actions">
                                <Button type="button" onClick={closeModal}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Salvar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageActions;