import "./game-ambient.css";

const SPECKS = [
  { left: "8%", delay: "0s", dur: "14s", size: 3 },
  { left: "22%", delay: "2s", dur: "18s", size: 2 },
  { left: "41%", delay: "4s", dur: "16s", size: 4 },
  { left: "57%", delay: "1s", dur: "20s", size: 2 },
  { left: "73%", delay: "3s", dur: "15s", size: 3 },
  { left: "88%", delay: "5s", dur: "17s", size: 2 },
  { left: "33%", delay: "6s", dur: "19s", size: 2 },
  { left: "66%", delay: "7s", dur: "13s", size: 3 },
];

export function GameAmbient() {
  return (
    <div className="game-ambient" aria-hidden>
      {SPECKS.map((speck, index) => (
        <span
          key={index}
          className="game-ambient__speck"
          style={{
            left: speck.left,
            animationDelay: speck.delay,
            animationDuration: speck.dur,
            width: speck.size,
            height: speck.size,
          }}
        />
      ))}
    </div>
  );
}
