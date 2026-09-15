export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1117",
          fontFamily: "system-ui, sans-serif",
          color: "#f1f5f9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "6rem", fontWeight: 800, margin: 0, color: "#6366f1" }}>404</h1>
          <p style={{ fontSize: "1.25rem", color: "#94a3b8", marginTop: "0.5rem" }}>
            Page not found
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.6rem 1.5rem",
              background: "#6366f1",
              color: "#fff",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
