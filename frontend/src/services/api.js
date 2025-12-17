const API_URL = "https://finance-dashboard-3juc.onrender.com/api";

// token header helper
export const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: "Bearer " + token } : {};
};

// GET helper
export const getData = async (endpoint) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
  });
  return res.json();
};

// POST helper
export const postData = async (endpoint, data = {}) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
};

// NEW FUNCTION: fetch portfolio with latest NAV
export const getPortfolioWithCurrentNav = async () => {
  const portfolio = await getData("portfolio/user");
  if (!portfolio || portfolio.length === 0) return [];

  const updatedPortfolio = await Promise.all(
    portfolio.map(async (f) => {
      if (!f.schemeCode) return f;
      try {
        const res = await fetch(`${API_URL}/nav/latest?code=${f.schemeCode}`, {
          headers: { "Content-Type": "application/json", ...getTokenHeader() },
        });
        const data = await res.json();
        return {
          ...f,
          currentNav: data.nav, // attach latest NAV
        };
      } catch (err) {
        console.error("Failed to fetch NAV for", f.schemeCode, err);
        return f;
      }
    })
  );

  return updatedPortfolio;
};
