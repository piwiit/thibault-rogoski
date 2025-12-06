"use client";

export default function TestFacebook() {
  async function sendPost() {
    const res = await fetch("/api/facebook/post", {
      method: "POST"
    });

    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Publication Facebook</h1>
      <button
        onClick={sendPost}
        style={{
          padding: "12px 20px",
          background: "green",
          color: "white",
          borderRadius: 8
        }}
      >
        Publier sur Facebook
      </button>
    </div>
  );
}
