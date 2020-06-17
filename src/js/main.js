$(document).ready(function ()
{
	// *** header
	$(window).on('scroll', function ()
	{
		$('.c-header')[$(window).scrollTop() >= $('.c-header').height() ? 'addClass' : 'removeClass']('sticky');
	})
	.scroll();

	// *** scroll
	function scrollTo(el)
	{
		$('html, body').stop().animate({ scrollTop: el.offset().top - ($('.c-header').height() + 10) }, 500);
	}
	
	$(document).on('click', '.js-scroll', function(e) {
		e.preventDefault();
		scrollTo($($(this).attr('href')));
	});

	// *** tabs
	$(document).on('click', '.js-tab-btn',function()
	{
		var tab = $(this).attr('data-tab');
		
		$('.js-tab, .js-tab-btn').removeClass('active');
		$('.js-tab[data-tab="' + tab + '"], .js-tab-btn[data-tab="' + tab + '"]').addClass('active');
		
		if($(window).width() <= 819) scrollTo($(this));
	});

	// *** sameheight
	function sameHeight(parent, item)
	{
		$(parent).each(function () {
			var maxHeight = 0,
				pp = this;

			$(item, this).each(function () {
				$(this).css({ 'height': '' });
				maxHeight = Math.max(maxHeight, $(this).height());
			}).height(maxHeight);

			if ($(window).width() <= 768) $(item, pp).css({ 'height': '' });
		});
	}

	$(window).on('load resize', function ()
	{
		sameHeight('.tab-content', '.title');
		sameHeight('.tab-content', '.desc');
	}).resize();

});