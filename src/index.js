import $ from 'jquery';
import './style.scss';

let count = 0;
$('#main>h1').html('Here we go!');
$('#Counter').html(`${count}`);
setInterval(() => {
  count += 1;
  $('#Counter').html(`${count}`);
}, 1000);
