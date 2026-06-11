import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import * as S from "./styles";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Novo estado para controlar o erro
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("@BG_Token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMsg(""); // Limpa o erro anterior toda vez que tentar logar

    try {
      const data = await authService.login(email, password);
      
      localStorage.setItem("@BG_Token", data.access_token);
      
      navigate("/");
      
    } catch (error) {
      // Em vez do alert, salvamos a mensagem no estado para o React renderizar
      setErrorMsg("Usuário ou senha incorretos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <S.LoginBox>
        <S.Title>BG Closet - Acesso</S.Title>
        
        <S.Form onSubmit={handleLogin}>
          <Input 
            label="Usuário / E-mail" 
            type="text" 
            placeholder="Digite seu usuário" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Senha" 
            type="password" 
            placeholder="******" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Se existir algum erro, a mensagem vermelha aparece aqui */}
          {errorMsg && <S.ErrorMessage>{errorMsg}</S.ErrorMessage>}
          
          <Button type="submit" variant="success" fullWidth disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar no Sistema"}
          </Button>
        </S.Form>
      </S.LoginBox>
    </S.Container>
  );
}