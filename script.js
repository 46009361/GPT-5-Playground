// test commit

const messages = document.forms.messages;
messages.addEventListener("submit", async function(event) {
    event.preventDefault();
    const s = document.querySelector("#s");
    s.disabled = true;
    s.innerText = "▶ Running…";
    const arr = [];
    Array.from(messages).forEach(element => {
        if (!element.disabled && element.name) {
            const obj = {};
            obj.role = element.name;
            obj.content = element.value;
            arr.push(obj);
        }
    });
    const response = await fetch("/letschat/",
        {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({model: "openai/gpt-5-mini-2025-08-07", messages: arr})
        }
    );
    try {
        const json = await response.json();
        // in case a future model has a name with two slashes
        document.querySelector("#model").innerText = `The current model is: ${json.data.model.split(/\//)[1]}`;
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
        s.innerText = "▶ Run";
        s.disabled = false;
        return true;
    }
});
