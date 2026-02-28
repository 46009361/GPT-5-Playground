const messages = document.forms.messages;
messages.addEventListener("submit", async function(event) {
    event.preventDefault();
    const s = document.querySelector("#s");
    s.disabled = true;
    s.innerText = "▶️ Running…";
    const arr = [];
    Array.from(messages).forEach(element => {
        if (!element.disabled && element.name) {
            const obj = {};
            obj.role = element.name;
            obj.content = element.value;
            arr.push(obj);
        }
    });
    // let's deplete my school's resources!
    const response = await fetch("https://corsproxy.io/?url=https://wcln-ai.twostoryapps.com/letschat&key=🍪🍪🍪🍪",
        {
            headers: {
                "content-type": "application/json",
                host: "wcln-ai.twostoryapps.com"
            },
            method: "POST",
            body: JSON.stringify({messages: arr})
        }
    );
    try {
        const json = await response.json();
        if (json.success) {
            messages.assistant.value = json?.data?.choices[0]?.message?.content;
            messages.assistant.placeholder = "If you see this, the AI returned a blank response";
        } else {
            throw new SyntaxError("success is missing or not true");
        }
    }
    catch (error) {
        alert(error);
    }
    finally {
        s.innerText = "▶️ Run";
        s.disabled = false;
        return true;
    }
});