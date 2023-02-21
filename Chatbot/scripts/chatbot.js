if (typeof jQuery == 'undefined') {

    alert('jquery is required.')

}

const questions = [
    "What are your top business priorities right now?",
    "How would you describe the problem you’re trying to solve?",
    "How much does the problem cost you and your company?",
    "Is there anything else about the situation that worries or frustrates you?",
    "If there is a current supplier, why are you considering an alternative?"
];

let base_promt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. AI must ask questions to human'

let conversion = '';
function appendMessage() {
    let message = $('#query').val();
    conversion += '\nHuman:' + message;
    $('#query').val('');
    let content = `<br clear="both">
                    <div class="item right">
                        <div class="msg">
                            <p>${message}</p>
                        </div>
                    </div>`

    $('.box').append(content);
    ConnectAI();
    
}

function generateRamdomQuestion() {
    let message = 'How can I help you?'
    //questions[Math.floor(Math.random() * 5)]
    conversion += base_promt + '\nAI:' + message;
    let content = `<div class="item">
                    <div class="icon">
                        <i class="fa fa-user"></i>
                    </div>
                    <div class="msg">
                    <p>${message}</p>
                    </div>
                    </div>`
    $('.box').append(content);

}

function ShowTypingEffect(flag) {
    let content = `<div class="item" id="temp">
                    <div class="icon">
                    <i class="fa fa-user"></i>
                    </div>                    
                    <div class="msg">
                    <p>typing...</p>
                    </div>
                    </div>`


    if (flag == true) {
        $('.box').append(content);
    }
    else {
        $('#temp').remove();
    }
}

$(document).ready(function () {
    bootstrapChatbox();
    generateRamdomQuestion();
    $("#query").keyup(function(e) {
        
        if (e.which == 13) {
            appendMessage();
        }
    });
});

function bootstrapChatbox() {

    let css = `    
  
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">    
    `
    $('head').append(css);
    //document.getElementsByTagName('head')[0].innerHTML += css;


    let html = `
    <div class="wrapper btm">
    <div id="chatboxhead" class="title">Chatbot</div>
    <div id="chatbox">
        <div class="box">
        </div>

        <div class="typing-area">
            <div class="input-field">
                <input type="text" id="query" placeholder="Type your message" required>
                <button onclick="appendMessage()"><i class="fa fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    </div>            
    `
    $('body').append(html);
    // document.getElementsByTagName('body')[0].innerHTML += html;

    $("#chatboxhead").on("click", function () {

        var isActive = $(this).hasClass("active");
        $('#chatboxhead').removeClass('active')
        if (!isActive) {
            $(this).toggleClass('active');
        }

        $(this).next().slideToggle(200);
        $('#chatbox').show();
    });


}



function ConnectAI() {
    // question = document.getElementById("question").value + " in " + language;
    ShowTypingEffect(true);
    $('.box').scrollTop($('.box')[0].scrollHeight);
    const data = {
        model: "text-davinci-003",
        prompt: conversion,
        temperature: 0,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: [" Human:", " AI:"]
    };
    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Bearer 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",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            result = (String(data.choices[0].text)).replace('\nAI:', '');
            ShowTypingEffect(false);
            if (result) {
            conversion += data.choices[0].text;
            console.log('latest promt:' + conversion);
           
            let content = `<div class="item">
                        <div class="icon">
                            <i class="fa fa-user"></i>
                        </div>
                        <div class="msg">
                        <p>${result}</p>
                        </div>
                        </div>`
            $('.box').append(content);
            $('.box').scrollTop($('.box')[0].scrollHeight);
            }
            
        });
}

