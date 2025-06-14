export interface User{
    id: number;
    name: string;
}

export interface Provider {
    id: string;
    name: string;
    responsible_name: string;
    email: string;
}

export interface Demand {
    id: string;
    id_provider: string;
    status: string;
    title: string;
    description: string;
    type: string;
    creation_date: string;
}

export interface Actions {
    id: string;
    id_demand: string;
    technician_name: string;
    description: string;
    creation_date: string;
}

