import React, { useState, FormEvent } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { post } from '../../services/request/Index'

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Name:', name);
        console.log('Password:', password);
        const user = post("/login", {name: name, password: password})
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ width: '300px' }}>
                <h2>Login</h2>
                
                <Input 
                    id="name" 
                    label="Name" 
                    type="name" 
                    value={name} 
                    onChange={(e:any) => setName(e.target.value)} 
                    required 
                />

                <Input 
                    id="password" 
                    label="Senha" 
                    type="password" 
                    value={password} 
                    onChange={(e:any) => setPassword(e.target.value)} 
                    required 
                />

                <Button type="submit">Entrar</Button>
            </form>
        </div>
    );
};

export default Login;
