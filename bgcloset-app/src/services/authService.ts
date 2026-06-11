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
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  },
};