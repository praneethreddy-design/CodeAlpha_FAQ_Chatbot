const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");


async function sendMessage() {

    const question = userInput.value.trim();

    if (question === "") {
        return;
    }


    // User message
    chatBox.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;


    userInput.value = "";


    // Bot thinking message
    let loading = document.createElement("div");
    loading.className = "bot-message";
    loading.innerHTML = "Typing...";
    chatBox.appendChild(loading);


    chatBox.scrollTop = chatBox.scrollHeight;


    // Send to Flask
    const response = await fetch("/get_answer", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            question: question
        })

    });


    const data = await response.json();


    // Remove typing
    loading.remove();


    // Bot answer
    chatBox.innerHTML += `
        <div class="bot-message">
            ${data.answer}
        </div>
    `;


    chatBox.scrollTop = chatBox.scrollHeight;

}



// Button click
sendButton.addEventListener("click", sendMessage);


// Enter key
userInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        sendMessage();
    }

});