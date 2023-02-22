if (typeof jQuery == 'undefined') {
    alert('jquery is required.')
}
// variables

let base_promt = `The following is a conversation with an AI assistant. 
                The assistant is helpful, creative, clever, and very friendly. 
                AI must ask questions to human`;

let conversion = '';
let depts = ['Accounting', 'HR', 'Admin', 'Sales', 'Marketing', 'Operations', 'Customer Service']
let hr = [
    'Recruitment', 'On-Boarding', 'Policies', 'Appraisal', 'Leave Management'
]
let skills = ['python', 'full-stack', 'java', 'dev-ops']
let exp = ['0-3', '3-6', '6-10', '10+']
let np = ['immediate', '0-15 days', '1 month', '2 months']
let hr_Actions = ['Generate JD', 'Post Job', 'Search CV']


let summary = 'Here is summary below.</br>';

//functions 

$(document).ready(function () {
    bootstrapChatbox();
    initiateChat();

    $("#query").keyup(function (e) {
        //enable 'enter' key on chat message to send the message.
        if (e.which == 13) {
            send();
        }
    });
    // insertTabs();
});


function bootstrapChatbox() {
    let dt = new Date().toLocaleString().replace(',', '')
    let css = `  
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">    
    `
    $('head').append(css);

    let html = `
                <div class="wrapper btm">
                <div id="chatboxhead" class="title">Chatbot</div>
                <div id="chatbox">
                
                    <div class="box"> 
                    <div class="text-center">${dt}</div>
                        <div class="item">            
                        </div>
                    </div>
                    <div class="typing-area">
                        <div class="input-field">
                            <input type="text" id="query" placeholder="Type your message" required>
                            <button onclick="send()"><i class="fa fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
                </div>            
                `
    $('body').append(html);
    toggleChatboxHeader();

}

function toggleChatboxHeader() {
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

function send() {
    let message = $('#query').val();
    conversion += '\nHuman:' + message;
    $('#query').val('');
    sendMessage(message);
    connectAI();

}

function initiateChat() {
    let message = 'Hi there. How can I help you? Choose your domain from below options.'
    conversion += base_promt + '\nAI:' + message;
    recieveMessage(message);
    enableTabs(depts);

}

function showTypingEffect(flag) {
    let content = `<div class="item left" id="temp">
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

function connectAI() {

    showTypingEffect(true);
    $('.box').scrollTop($('.box')[0].scrollHeight);
    const data = {
        model: "text-davinci-003",
        prompt: conversion,
        temperature: 0,
        max_tokens: 1050,
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
                "Bearer your-key",
        },
    })
        .then((response) => response.json())
        .then((data) => {

            result = (String(data.choices[0].text)).replace('\nAI:', '');
            showTypingEffect(false);
            if (result) {
                conversion += data.choices[0].text;
                console.log('latest promt:' + conversion);
                recieveMessage(result);
            }

        })
        .catch((error) => {
            showTypingEffect(false);
            console.log(error)
            let content = `<div class="item left">
                        <div class="icon">
                            <i class="fa fa-user"></i>
                        </div>
                        <div class="msg text-danger">
                        <p>We are facing technical issue. We will get back to you shorty.</p>
                        </div>
                        </div>`
            $('.box').append(content);
            $('.box').scrollTop($('.box')[0].scrollHeight);
        });
    ;
}


function insertTabs(ele) {
    //console.log($(ele).children("p").get(0).innerHTML);
    if ($(ele).attr('class') == 'tabiffy') {

        sendMessage($(ele).children("p").get(0).innerHTML)
    }
    $(ele).toggleClass("tab-disabled")


}

function enableTabs(collection) {

    let items = '';
    collection.forEach(element => {
        items += `<div class="tabiffy" onclick="insertTabs(this)"><p>${element}</p></div>`
    });

    let content = `
                <div class="item wrap">
                ${items}
                </div>`
    $('.box').append(content);
    $('.box').scrollTop($('.box')[0].scrollHeight);
}


function recieveMessage(message) {

    let content = `<div class="item left">
                    <div class="icon1">
                    <img src="https://cdn-icons-png.flaticon.com/512/5148/5148614.png " width="40" height="40" alt="" title="" class="img-small">
                    </div>
                    <div class="msg">
                    <p>${message}</p>
                    </div>
                    </div>`
    $('.box').append(content);
    $('.box').scrollTop($('.box')[0].scrollHeight);
}

function sendMessage(message) {
    let content = `<br clear="both">
    <div class="item right">
        <div class="msg">
            <p>${message}</p>
        </div>
    </div>`

    $('.box').append(content);
    $('.box').scrollTop($('.box')[0].scrollHeight);

    // temp for HR simulation.
    if (message == 'HR') {
        recieveMessage('Choose desired process.')
        //insertTabs();
        enableTabs(hr);
    }

    if (message == 'Recruitment') {
        recieveMessage('Choose tech-stack.')
        //insertTabs();
        enableTabs(skills);
    }

    if (skills.includes(message)) {
        summary += '</br> Skill(s):' + message
        recieveMessage('Choose experience range.')
        enableTabs(exp);
    }

    if (exp.includes(message)) {
        summary += '</br> Experience:' + message +' year(s)'
        recieveMessage('Choose notice period.')
        enableTabs(np);

    }

    if (np.includes(message)) {
        summary += '</br> Notice period:' + message
        recieveMessage(summary);
        recieveMessage('What action you would like to perform with above summary?')
        enableTabs(hr_Actions);

    }

    if (message==hr_Actions[0]) {
        summary += '</br> Notice period:' + message
       conversion=`generate job description from below details.\n  ${summary}`
       connectAI();
       
    }

    
}