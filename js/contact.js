document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#project-form");
  const messageBox = document.querySelector("#form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("_replyto").trim();
    const message = formData.get("message").trim();

    // ✅ Reset previous message
    messageBox.textContent = "";
    messageBox.style.color = "";

    if (!name || !email || !message) {
      messageBox.textContent = "⚠️ Please fill in all fields before submitting.";
      messageBox.style.color = "red";
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        messageBox.textContent = `✅ Thank you, ${name}! Your message has been sent.`;
        messageBox.style.color = "green";
        form.reset();
      } else {
        messageBox.textContent = "❌ Oops! Something went wrong. Please try again later.";
        messageBox.style.color = "red";
      }
    } catch (error) {
      messageBox.textContent = "❌ Error submitting form. Please check your connection.";
      messageBox.style.color = "red";
    }
  });
});
