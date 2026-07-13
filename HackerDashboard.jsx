import React, { useEffect, useRef, useState } from "react";

export default function HackerDashboard() {
  const canvasRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [stats, setStats] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [typed, setTyped] = useState("");

  const bootSequence = [
    "root@arihant:~# initiating breach...",
    "> decrypting credentials...",
    "> access granted.",
    "> identity confirmed: FOUNDER",
    "> pulling live signal from github.com/arihantsharma51",
  ];

  // matrix rain background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = "01アリハントΣΞΠABCDEF$#@";

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FF41";
      ctx.font = fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // boot sequence typing
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      for (const line of bootSequence) {
        if (cancelled) return;
        let current = "";
        for (const ch of line) {
          if (cancelled) return;
          current += ch;
          setTyped(current);
          await new Promise((r) => setTimeout(r, 12));
        }
        setLines((prev) => [...prev, line]);
        setTyped("");
        await new Promise((r) => setTimeout(r, 250));
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // live GitHub polling — real, genuine live data
  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("https://api.github.com/users/arihantsharma51");
        const data = await res.json();
        if (!cancelled) {
          setStats({
            followers: data.followers,
            following: data.following,
            public_repos: data.public_repos,
            updated_at: new Date().toLocaleTimeString(),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setStats((prev) => prev || { error: true });
        }
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // real live polling every 15s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "600px", background: "#000", borderRadius: "8px", overflow: "hidden", border: "1px solid #00FF41", fontFamily: "'Courier New', monospace" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} />

      <div style={{ position: "relative", zIndex: 10, padding: "24px", color: "#00FF41" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #00FF41", paddingBottom: "10px" }}>
          <span style={{ fontWeight: "bold", letterSpacing: "2px" }}>ARIHANT_SHARMA // TERMINAL</span>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>{clock.toLocaleTimeString()}</span>
        </div>

        <div style={{ minHeight: "140px", marginBottom: "20px", fontSize: "14px", lineHeight: "1.8" }}>
          {lines.map((l, i) => (
            <div key={i}>
              <span style={{ opacity: 0.6 }}>$</span> {l}
            </div>
          ))}
          {typed && (
            <div>
              <span style={{ opacity: 0.6 }}>$</span> {typed}
              <span style={{ animation: "blink 1s step-start infinite" }}>▋</span>
            </div>
          )}
        </div>

        <div style={{ border: "1px solid #00FF41", padding: "16px", borderRadius: "4px", background: "rgba(0,255,65,0.03)" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "10px" }}>
            [ LIVE GITHUB SIGNAL — polls api.github.com every 15s ]
          </div>
          {!stats && <div style={{ fontSize: "14px" }}>establishing connection...</div>}
          {stats && stats.error && (
            <div style={{ fontSize: "14px", color: "#ff4444" }}>
              signal lost — rate-limited or offline. retrying...
            </div>
          )}
          {stats && !stats.error && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", fontSize: "14px" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.public_repos}</div>
                <div style={{ opacity: 0.7, fontSize: "11px" }}>PUBLIC_REPOS</div>
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.followers}</div>
                <div style={{ opacity: 0.7, fontSize: "11px" }}>FOLLOWERS</div>
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.following}</div>
                <div style={{ opacity: 0.7, fontSize: "11px" }}>FOLLOWING</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>last sync</div>
                <div style={{ fontSize: "12px" }}>{stats.updated_at}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", fontSize: "11px", opacity: 0.5, textAlign: "center" }}>
          this pane updates live — but only here, not on github.com/arihantsharma51 (GitHub doesn't run JS in READMEs)
        </div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
