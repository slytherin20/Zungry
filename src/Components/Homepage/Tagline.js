import { useEffect, useState } from "react";

export default function Tagline() {
  let taglines = [
    "Dinner Time?",
    "Match Today?",
    "Working Late?",
    "On a Diet?",
    "Quick Breakfast?",
    "Hungry?",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval = setInterval(
      () => setIndex((prevIndex) => (prevIndex + 1) % 5),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl  font-medium text-gray-950">{taglines[index]}</h1>
  );
}
