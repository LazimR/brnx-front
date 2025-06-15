import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import { get, post } from "../../services/request/Index";
import "./ManageDemands.css";
import DemandsTable from "../../components/demandTable/DemandTable";
import Button from "../../components/button/Button";
import ManageActions from "../manageActions/ManageActions";

interface FormData {
    status: string;
    title: string;
    description: string;
    type: string;
}

const ManageDemandsPage = () => {
    const navigate = useNavigate();
    const [demands, setDemands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        status: "",
        title: "",
        description: "",
        type: "",
    });
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const params = useParams();
    const providerId = params.providerId;

    useEffect(() => {
        if (providerId) {
            get(`/demands/provider/${providerId}`).then((result) => {
                if (result.statusCode === 200) {
                    setDemands(result.responseBody);
                } else {
                    alert(result.responseBody);
                }
            });
        }
    }, [providerId]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ status: "", title: "", description: "", type: "" });
        setFormErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof FormData]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};
        if (!formData.status.trim()) errors.status = "Status é obrigatório";
        if (!formData.title.trim()) errors.title = "Título é obrigatório";
        if (!formData.description.trim()) errors.description = "Descrição é obrigatória";
        if (!formData.type.trim()) errors.type = "Tipo é obrigatório";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !providerId) return;

        try {
            const response = await post("/demands", {
                id_provider: providerId,
                ...formData,
            });
            if (response.statusCode === 201) {
                const updatedDemands = await get(`/demands/provider/${providerId}`);
                setDemands(updatedDemands.responseBody);
                closeModal();
            } else {
                console.error("Erro ao adicionar demanda:", response.responseBody);
                setFormErrors({ title: "Erro ao cadastrar demanda" });
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setFormErrors({ title: "Erro ao conectar com o servidor" });
        }
    };

    return (
        <div className="manage-demands">
            <DemandsTable demands={demands} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                }}
            >
                <Button onClick={() => navigate(-1)}>Voltar</Button>
                <Button onClick={openModal}>Adicionar Demandas</Button>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Adicionar Demanda</h2>
                        <form onSubmit={handleSubmit} className="demand-form">
                            <div className="form-group">
                            <label htmlFor="tipo">Tipo</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className={formErrors.type ? "input-error" : ""}
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Diagnóstico">Diagnóstico</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Configuração">Configuração</option>
                                    <option value="Instalação">Instalação</option>
                                    <option value="Outro">Outro</option>
                            </select>
                            {formErrors.type && <span className="error">{formErrors.type}</span>}
                        </div>
                            <div className="form-group">
                                <label htmlFor="title">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={formErrors.title ? "input-error" : ""}
                                />
                                {formErrors.title && <span className="error">{formErrors.title}</span>}
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
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={formErrors.status ? "input-error" : ""}
                                >
                                    <option value="">Selecione o Status</option>
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Concluido">Concluido</option>
                                </select>
                                {formErrors.status && <span className="error">{formErrors.status}</span>}
                            </div>
                            <div className="form-actions">
                                <Button type="submit">Salvar</Button>
                                <Button type="button" onClick={closeModal}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageDemands = () => {
    return (
        <Routes>
            <Route path="/*" element={<ManageDemandsPage />} />
            <Route path="/acoes/:demand_id" element={<ManageActions />} />
        </Routes>
    );
};

export default ManageDemands;