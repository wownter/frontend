
const form = document.getElementById("sendForm");
const input = document.getElementById("message");
const result = document.getElementById("result");
const button = document.getElementById("sendButton");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) {
        result.textContent = "Введите текст!";
        result.className = "error";
        return;
    }

    button.disabled = true;
    result.textContent = "Отправка...";
    result.className = "";

    try {
        const response = await fetch(
            "http://127.0.0.1:5001/save",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: text })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Ошибка сервера");
        }

        result.textContent = data.message;
        result.className = "success";
        input.value = "";

    } catch (error) {
        result.textContent = "Ошибка: " + error.message;
        result.className = "error";
    } finally {
        button.disabled = false;
    }
});
