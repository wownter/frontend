
const API_URL = "http://127.0.0.1:5001";

// Элементы отправки данных
const form = document.getElementById("sendForm");
const input = document.getElementById("message");
const result = document.getElementById("result");
const sendButton = document.getElementById("sendButton");

// Элементы чтения данных
const searchInput = document.getElementById("searchQuery");
const readButton = document.getElementById("readButton");
const savedData = document.getElementById("savedData");
const readStatus = document.getElementById("readStatus");


// Отправка текста на сервер
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) {
        result.textContent = "Введите текст!";
        result.className = "error";
        return;
    }

    sendButton.disabled = true;
    result.textContent = "Отправка...";
    result.className = "";

    try {
        const response = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

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
        sendButton.disabled = false;
    }
});


// Получение сохранённых данных
readButton.addEventListener("click", async () => {
    readButton.disabled = true;
    readStatus.textContent = "Загрузка данных...";
    readStatus.className = "";

    try {
        const response = await fetch(`${API_URL}/read`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.content !== "string") {
            throw new Error("Неверный ответ сервера");
        }

        const search = searchInput.value.trim().toLowerCase();
        let content = data.content;

        // Необязательная фильтрация записей
        if (search) {
            content = content
                .split(/\r?\n/)
                .filter(line =>
                    line.toLowerCase().includes(search)
                )
                .join("\n");
        }

        savedData.value = content;

        if (content) {
            readStatus.textContent = "Данные успешно загружены";
        } else {
            readStatus.textContent = search
                ? "Совпадений не найдено"
                : "Файл пуст";
        }

        readStatus.className = "success";

    } catch (error) {
        savedData.value = "";
        readStatus.textContent = "Ошибка: " + error.message;
        readStatus.className = "error";
    } finally {
        readButton.disabled = false;
    }
});
