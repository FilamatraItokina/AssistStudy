import { useEffect, useState } from "react";

function Motivation() {
  const [quote, setQuote] = useState("");
  useEffect(() => {
    const quotes = [
      "Le succès appartient à ceux qui persévèrent.",
      "Chaque jour est une nouvelle chance d’apprendre.",
      "Crois en toi et avance.",
      "La discipline est la clé de la réussite.",
      "N’abandonne jamais tes rêves.",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  return (
    <div className="card">
      <h2>Citation de motivation</h2>
      <blockquote style={{ fontStyle: "italic" }}>{quote}</blockquote>
    </div>
  );
}

export default Motivation;
