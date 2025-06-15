import React, { useState, FormEvent } from 'react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { post } from '../../services/request/Index'
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/User';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/auth/login", { name:name, password:password }).then((result) => {
            const { id, name } = result.responseBody
            dispatch(setUser({id:id, name:name}))
            navigate("/")
        })
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ width: '300px' }}>
                <h2>Login</h2>
                
                <Input 
                    id="name" 
                    label="Nome" 
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
