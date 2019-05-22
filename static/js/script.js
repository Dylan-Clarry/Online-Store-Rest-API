// show email sent message, but not on reload


if (performance.navigation.type == 1) {
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
}

var messageSentTag = document.getElementById('message-sent');

if(window.location.search.split('?')[1]) {
    messageSentTag.classList.remove('hide-tag');
    setTimeout(() => {
       messageSentTag.classList.add('hide-tag');
    }, 4000);
}



// grid animations
const products = document.getElementsByClassName('fade-in');

// iterate through each product
for(var i = 0; i < products.length; i++) {
    
    // variable for each product to deal with scoping i
    const product = products[i]

    // set timeout
    setTimeout(() => {
        
        // add class to each product
        product.classList.add('is-visible');
    }, 200 * i);
}

const body = document.getElementsByTagName('body')[0];

// modal event listeners
document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    // if target has a modal toggle
    if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {

        // remove default event
        e.preventDefault();

        // check if on correct target modal
        if (target.hasAttribute('data-target')) {
            var m_ID = target.getAttribute('data-target');
            
            // open modal
            document.getElementById(m_ID).classList.add('open');
            
            // hide body overflow
            body.classList.add('hide-overflow');
        }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modal')) {
        var modal = document.querySelector('[class="modal open"]');
        
        // close modal
        modal.classList.remove('open');
        
        // show body overflow
        body.classList.remove('hide-overflow');
    }
}, false);

// hamburger menu
(function() {

	var hamburger = {
		navToggle: document.querySelector('.nav-toggle'),
		nav: document.querySelector('nav'),

        // toggle hamburger menu
		doToggle: function(e) {
			e.preventDefault();
			this.navToggle.classList.toggle('expanded');
			this.nav.classList.toggle('expanded');
		}
	};

	hamburger.navToggle.addEventListener('click', function(e) { hamburger.doToggle(e); });
}());