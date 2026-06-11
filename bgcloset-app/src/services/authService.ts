import api from "./api";

export const authService = {
  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const response = await api.post("/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    
    return response.data;
  },

  getUsuarioLogado: () => {
    try {
      const token = localStorage.getItem("@BG_Token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      // Verifica se o token está expirado (o payload.exp vem em segundos)
      if (payload.exp && payload.exp < Date.now() / 1000) {
        localStorage.removeItem("@BG_Token");
        return null;
      }
      
      return payload;
    } catch {
      return null;
    }
  },
};