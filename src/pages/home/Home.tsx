import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { get, post } from "../../services/request/Index";
import "./Home.css";
import ManageDemands from "../manageDemands/ManageDemands";
import ProvidersTable from "../../components/providerTable/ProviderTable";
import { Provider } from "../../constants/Interfaces";
import { RootState } from "../../store/Store";
import Button from "../../components/button/Button";

interface FormData {
  name: string;
  responsible_name: string;
  email: string;
}

const HomePage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    responsible_name: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
    }
    get("/providers").then((result) => {
      const data = Array.isArray(result.responseBody) ? result.responseBody : [];
      setProviders(data);
    });
  }, [user,navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", responsible_name: "", email: "" });
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.responsible_name.trim()) errors.responsible_name = "Nome do responsável é obrigatório";
    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await post("/providers", formData);
      if (response.statusCode === 201) {
        const updatedProviders = await get("/providers");
        setProviders(updatedProviders.responseBody);
        closeModal();
      } else {
        console.error("Erro ao adicionar provedor:", response.responseBody);
        setFormErrors({ email: "Erro ao cadastrar provedor" });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setFormErrors({ email: "Erro ao conectar com o servidor" });
    }
  };

  return (
    <div className="main">
      <ProvidersTable providers={providers} />
      <Button onClick={openModal}>Adicionar Provedor</Button>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Provedor</h2>
            <form onSubmit={handleSubmit} className="provider-form">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && <span className="error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="responsible_name">Nome do Responsável</label>
                <input
                  type="text"
                  id="responsible_name"
                  name="responsible_name"
                  value={formData.responsible_name}
                  onChange={handleInputChange}
                  className={formErrors.responsible_name ? "input-error" : ""}
                />
                {formErrors.responsible_name && (
                  <span className="error">{formErrors.responsible_name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "input-error" : ""}
                />
                {formErrors.email && <span className="error">{formErrors.email}</span>}
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

const Home = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/demanda/:providerId/*" element={<ManageDemands />} />
    </Routes>
  );
};

export default Home;