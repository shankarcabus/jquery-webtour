# jQuery Webtour

Are you needing a tour for your site?
jQuery Webtour is what you need.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Helielson/jquery-webtour/master/dist/jquery-webtour.min.js
[max]: https://raw.github.com/Helielson/jquery-webtour/master/dist/jquery-webtour.js

In your web page:

```html
<script src="js/libs/jquery/jquery.js"></script>
<script src="src/jquery.webtour.min.js"></script>
<link rel="stylesheet" type="text/css" href="css/jquery.webt   
our.css">

<style type="text/css">
  body {
    background: #eee;
  }

  #step1, #step2 {
    margin: 50px 90px;
    padding: 20px;
    display: inline-block;
  }
</style>

<a href="#" id="step1">Step 1</a>
<a href="#" id="step2">Step 2</a>


<script type="text/javascript">
  $('#step1').tour({
    'text': 'The <b>first</b> step appears here',
  });

  // All defaults properties
  $('#step2').tour({
    'text': 'Lorem Ipsum', // Text of tour
    'button': {
      'clss': 'btn btn-primary', // Button class
      'text': 'Ok, got it' // Button text
    }
  });
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
