

// Replace with your actual backend endpoint on Vercel
const backendUrl = "https://registration-for-serverless.vercel.app/api/register";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    document.getElementById("message").textContent = result.message;
  } catch (error) {
    document.getElementById("message").textContent = "Error registering user.";
  }
});
