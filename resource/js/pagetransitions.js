var PageTransitions = (function() {

	var $main = $( '#pt-main' ),  //主要部分，包含各个page
		$pages = $main.children( 'div.pt-page' ),
		$previousButton = $( '#previous' ),  //切换页面按钮
		$nextButton = $('#next'),
		animcursor = 1,//用于控制页面切换效果：1-->向右移动 2-->向左移动
		pagesCount = $pages.length,//一个有多少页
		current = 0,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],  //animation end event name, 在chrome运行时animEndEventName = "animationend"
		support = Modernizr.cssanimations;  //support css animations, Detects whether or not elements can be animated using CSS  在chrome运行时support = true
	
	function init() {

		//设置每个'div.pt-page'的originalClassList属性设置为当前的class="***"中的内容
		$pages.each( function(index) {
			var $page = $( this ); //$page是一个包含了当前对象的jquery元素
			$page.data( 'originalClassList', $page.attr( 'class' ) ); //originalClassList在函数changePage中用到
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );//eq()函数用于获取当前jQuery对象所匹配的元素中指定索引的元素，current一开始是0
		//.pt-page的visibility属性是hidden，pt-page-current的visibility是visible，即需要通过上述语句来实现pt-page元素的可见

		var mode;//在nextPage参数中用于区分“上一页”和“下一页”
		//************页面切换按钮被点击时的处理函数，这里需要修改为两个：“上一题”按钮和“下一题”按钮****************
		$previousButton.on( 'click', function() {
			//************这里到时候需要进行修改，用于到达最后一题时的处理*************************************
			animcursor = 2;
			mode = 1;
			nextPage( animcursor,mode );
			--animcursor;
		} );

		$nextButton.on('click',function () {
			animcursor = 1;
			mode = 2;
			nextPage( animcursor,mode );
			++animcursor;
		})

	}

	//nextPage当按钮被点击之后由监听器触发
	//***********这里要修改为：两个函数参数，一个是切换页的页数（上一页，下一页，题目列表），一个是向左滑动还是向右滑动切换**************
	function nextPage(options,mode ) {
		var animation =  options;
		var $currPage = $pages.eq( current );
		if(mode == 1){ //上一页
			if(current>0){
				--current;
			}
			else {
				alert('已经是第一题')
			}
		}
		else{ //下一页
			if( current < pagesCount ) {
				++current;
			}
			else {
				alert('已经是最后一题')
			}
		}


		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),//定位到下一页，使其从“隐藏”到“可见”
			outClass = '', inClass = '';

        //*********** 这里以后需要设置好，上一题是case1，下一题是case2  *************
		switch( animation ) {
			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
		}

		//在chrome浏览器中，animEndEventName= "animationend" ,animationend 事件会在一个 CSS 动画完成时触发
		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );//off()移除一个事件处理函数
			changePage($currPage,$nextPage)
		} );

		$nextPage.addClass( inClass );

		//support = Modernizr.cssanimations; 用于判断浏览器是否支持CSS动画
		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function changePage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();
	return { 
		init : init,
		nextPage : nextPage
	};

})();