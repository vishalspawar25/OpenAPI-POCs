var language = '';
var result;
var question;
var api_base_url='your_api_url'
const UserFeedback = new Object();

function Search() {
   document.getElementById("result").innerHTML = ''
   question = document.getElementById("question").value;
   if (question == '') {
      alert('Please write your question ');
      return;
   }
   if (language == '') {
      alert('Please select the language ');
      return;
   }
   $("#spinner").show();
   question = document.getElementById("question").value + ' in ' + language;
   console.log(question);
   const data = {
      "model": "text-davinci-003",
      "prompt": question,
      "temperature": 0,
      "max_tokens": 1256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
   };
   fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer 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'
      }
   }).then(response => response.json()).then((data) => {

      result = data.choices[0].text
      var formattedResult = result.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      document.getElementById("result").innerHTML = formattedResult;
      $("#actionbtns").show();
      $("#spinner").hide();
      hljs.highlightAll();
   });

   // hljs.highlightAll();  
}

function CopyToClipboard() {

   var range = document.createRange();
   range.selectNode(document.getElementById("result"));
   window.getSelection().removeAllRanges(); // clear current selection
   window.getSelection().addRange(range); // to select text
   document.execCommand("copy");
   window.getSelection().removeAllRanges();// to deselect

}

$(document).ready(function () {
   $("#actionbtns").hide();
   $(".dropdown-menu li a").click(function () {
      var selText = $(this).text();
      console.log(selText);
      if (selText != 'Select Language')
         language = selText;
      else
         language = ''

      $(this).parents('.form-inline').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
   })
   $("#spinner").hide();
   $.getJSON("http://jsonip.com", function (data) {
      console.log(data.ip);
      UserFeedback.Ip=data.ip;
   });
});

function CaptureFeedback(action) {
   UserFeedback.Question = question;
   UserFeedback.Answer = result;
   UserFeedback.Action = action;

   fetch(api_base_url+'capture', {
      method: 'POST',
      body: JSON.stringify(UserFeedback),
      headers: {
         'Content-Type': 'application/json'
      }
   }).then(response => response.json()).then((data) => {
      console.log('returning feedback from python')
      console.log(data)
   }
   );
   

}

function runSpeechRecognition() {
		        
   var output = document.getElementById("output");
   
   var action = document.getElementById("action");
    
     var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
     var recognition = new SpeechRecognition();
 
  
     recognition.onstart = function() {
         action.innerHTML = "<small>listening, please speak...</small>";
     };
     
     recognition.onspeechend = function() {
         action.innerHTML = "<small>stopped listening, hope you are done...</small>";
         recognition.stop();
     }
   
   
     recognition.onresult = function(event) {
         var transcript = event.results[0][0].transcript;
        // console.log(transcript);
        // var confidence = event.results[0][0].confidence;
       //  output.innerHTML = "<b>Text:</b> " + transcript ;
        // output.classList.remove("hide");
        action.innerHTML = "";
        
         $('#question').val(transcript);
     };
   
      
      recognition.start();
}
function ClearText()
{
   $('#question').val('')
}
