function field_focus(field, inputUrl)
{
  if(field.value == inputUrl)
  {
    field.value = '';
  }
}

function field_blur(field, inputUrl)
{
  if(field.value == '')
  {
    field.value = inputUrl;
  }
}

//Fade in dashboard box
$(document).ready(function(){
  $('.box').hide().fadeIn(1000);
  });

//Stop click event
$('a').click(function(event){
  event.preventDefault(); 
  });