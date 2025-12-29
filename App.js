import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "iPhone 12", price: 500 },
  { id: 2, name: "Samsung Galaxy S21", price: 450 },
  { id: 3, name: "Google Pixel 6", price: 400 },
  { id: 4, name: "iPhone 14 Pro", price: 900 },
];

function App() {
  const [query, setQuery] = useState("");
  const [recommended, setRecommended] = useState(PRODUCTS);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!query) return alert("Enter preference");

    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer sk-or-v1-78107388097ecec4a08251445c65a651ad855e3a44520bc51e28028bacdbec",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Product Recommender Demo",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              {
                role: "system",
                content:
                  "You are a product recommender. Only reply with product names from the list.",
              },
              {
                role: "user",
                content: `User wants: "${query}"
Products: ${PRODUCTS.map(p => `${p.name} ($${p.price})`).join(", ")}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("AI RESPONSE:", data);

      if (!data.choices) {
        alert("AI error or free credits exhausted");
        setLoading(false);
        return;
      }

      const aiText = data.choices[0].message.content.toLowerCase();

      const filtered = PRODUCTS.filter(p =>
        aiText.includes(p.name.toLowerCase())
      );

      setRecommended(filtered.length ? filtered : PRODUCTS);
    } catch (err) {
      console.error(err);
      alert("Network error");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>🛒 Product Recommendation (OpenRouter)</h2>

      <input
        placeholder="I want a phone under $500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: 320 }}
      />

      <button onClick={getRecommendations} style={{ marginLeft: 10 }}>
        {loading ? "Thinking..." : "Recommend"}
      </button>

      <ul style={{ marginTop: 20 }}>
        {recommended.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



