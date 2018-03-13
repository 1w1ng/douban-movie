//模块化代码
var app = {
	init:function(){
    this.$tabs = $('#tabs div')
    this.$panels = $('section')
    this.bind()
    this.start()
  },
  bind:function(){
    var _this = this
    this.$tabs.on('click',function(){
      $(this).addClass('active').siblings().removeClass('active')
      _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
    })
  },
  start:function(){
    top250.init()
    usBox.init()
    searchMovie.init()
  }
}

var top250 = {
  init:function(){
    this.$wrap = $('.rank')
    this.$element = $('#top250')
    this.isLoading = false
    this.index = 0
    this.getData()
    this.bind()
  },
  getData:function(){
    var _this = this
    if(this.isLoading) return;
    if (!(this.index >= 0 && this.index <= 250)) return
    this.isLoading = true
    $('.loading').show()
    $.ajax({
      url: 'https://api.douban.com/v2/movie/top250',
      type: 'GET',
      data: {
        start: _this.index,
        count:20
      },
      dataType: 'jsonp'
    }).done(function(data){
      console.log(data)
      _this.index += 20
      _this.render(data)
      _this.isLoading = false
      $('.loading').hide()
    }).fail(function(){
      console.log('error ...')
      $('.loading').hide()
      _this.isLoading = false
    })
  },
  bind:function(){
    let _this = this
    this.$wrap.scroll(function(){
      if(_this.$element.height() <= _this.$wrap.height() + _this.$wrap.scrollTop() + 10){
        _this.getData()
      }
    })
  },
  render:function(data){
    var _this = this
    data.subjects.forEach(function(movie){
      _this.$element.append(createNode.Node(movie))
    })
  }
}

//海外票房
var usBox = {
  init:function(){
    console.log('usBox ok')
    this.$usRank = $('.us-rank')
    this.getData()
  },
  getData:function(){
    var _this = this
    $('.loading').show()
    $.ajax({
      url:'https://api.douban.com/v2/movie/us_box',
      type:'GET',
      dataType:'jsonp',
    }).done(function(data){
      console.log(data)
      _this.render(data)
      $('.loading').hide()
    }).fail(function(){
      console.log('error')
      $('.loading').hide()
    })
  },
  render:function(data){
    var _this = this
    data.subjects.forEach(function(movie){
      _this.$usRank.append(createNode.Node(movie.subject))
    })
  }
}

//搜索电影
var searchMovie = {
  init:function(){
    this.$searchBtn = $('.search-btn')
    this.$searchIpt = $('.search-box')
    this.$searchPage = $('.us-ct')
    this.bind()
  },
  getData:function(){
    var _this = this
    if(_this.$searchPage.children().length > 0){
      _this.$searchPage.empty()
    }
    $('.loading').show()
    $.ajax({
      url:"https://api.douban.com/v2/movie/search?q={text}",
      type:'GET',
      data:{
        tag:_this.$searchIpt.val(),
        q:_this.$searchIpt.val()
      },
      dataType:'jsonp'
    }).done(function(data){
      $('.loading').hide()
      console.log(data)
      _this.render(data)
    })
  },
  bind:function(){
    var _this = this
    this.$searchBtn.click(function(){
      _this.getData()
    })
  },
  render:function(data){
    var _this = this
    if(data.total === 0){
      return this.$searchPage.html('<h2 style=text-align:center;margin-top:50px;>未搜索到相关结果~请换个关键词</h2>')
    }
    data.subjects.forEach(function(movie){
      _this.$searchPage.append(createNode.Node(movie))
    })
  }
}

//拼接字符串
var createNode = {
  Node:function(movie){
    var template =
      `<div class="item clearfix">
	         <a href="#">
	           <div class="cover">
	             <img src="" alt="">
	           </div>
	           <div class="detail">
	             <h2></h2>
			         <div class="extra"><span class="score"></span>分 / <span class="collect"></span>人评价</div>
			         <div class="extra"><span class="year"></span> / <span class="type"></span></div>
			         <div class="extra">导演: <span class="director"></span></div>
			         <div class="extra">主演: <span class="actor"></span></div>
	           </div>
	         </a>
         </div>`

    var $node = $(template)
    var actor = ''
    movie.casts.forEach(function(act){
      actor += act.name + '、'
      return actor
    })

    $node.find('.cover img').attr('src', movie.images.medium)
    $node.find('.detail h2').text(movie.title)
    $node.find('.score').text(movie.rating.average)
    $node.find('.collect').text(movie.collect_count)
    $node.find('.year').text(movie.year)
    $node.find('.type').text(movie.genres.join(' / '))
    $node.find('.actor').text(actor.slice(0, -1))
    $node.find('.director').text(function(){
      if(movie.directors[0] !== undefined){
        return movie.directors[0].name
      }else{
        return '未知'
      }
    })
    return $node
  }
}
app.init()













// //获取数据
// var index = 0
// var isLoading = false //状态锁

// start()

// //发送ajax请求获取数据，一次20条
// function start(){
//   if (isLoading) return
//   isLoading = true
//   $('.loading').show()
//   $.ajax({
//     url: 'https://api.douban.com/v2/movie/top250',
//     type: 'GET',
//     data: {
//     start: index,
//     count: 20
//   },
//   dataType: 'jsonp'
//   }).done(function(ret){
//     isLoading = false
//     setData(ret)
//     index += 20
//     $('.loading').hide()
//   }).fail(function () {
//     console.log('error ...')
//   }).always(function () {
//     isLoading = false
//     $('.loading').hide()
//   })
// }

// //tab按钮切换样式
// $('#tabs div').click(function () {
// 	var index = $(this).index()
// 	$('section').eq(index).fadeIn().siblings().hide()
// 	$(this).addClass('active').siblings().removeClass('active')
// })

// function startBeimei() {
// if (isLoadingBeimei) return
// isLoading = true
// $('.loading').show()
// $.ajax({
// 	url: 'https://api.douban.com/v2/movie/us_box',
// 	type: 'GET',
// 	data: {
// 			start: index,
// 			count: 20
// 	},
// 	dataType: 'jsonp'
// }).done(function (ret) {
// 	console.log(ret)	
// 	setData(ret)
// 	index += 20
// }).fail(function () {
// 	console.log('error ...')
// }).always(function () {
// 	isLoading = false
// 	$('.loading').hide()
// })
// }

// $('main').scroll(function(){
// 	if($('section').eq(0).height() - 10 <= $('main').scrollTop() + $('main').height()){
// 		start()
// 	}
// })

// //内容拼接展示
// function setData(data) {
//   data.subjects.forEach(function (movie) {
//   var template = 
//    `<div class="item">
// 	    <a href="#">
// 	      <div class="cover">
// 	        <img src="" alt="">
// 	      </div>
// 	      <div class="detail">
// 	        <h2></h2>
// 			    <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
// 			    <div class="extra"><span class="year"></span> / <span class="type"></span></div>
// 			    <div class="extra">导演: <span class="director"></span></div>
// 			    <div class="extra">主演: <span class="actor"></span></div>
// 	      </div>
// 	    </a>
//     </div>`

// 	var $node = $(template)
// 	$node.find('.cover img')
// 			.attr('src', movie.images.medium)
// 	$node.find('.detail h2').text(movie.title)
// 	$node.find('.score').text(movie.rating.average)
// 	$node.find('.collect').text(movie.collect_count)
// 	$node.find('.year').text(movie.year)
// 	$node.find('.type').text(movie.genres.join(' / '))
// 	$node.find('.director').text(function(){
// 	  var directorsArr = []
// 		movie.directors.forEach(function(item){
// 		  directorsArr.push(item.name)
// 		})
// 		return directorsArr.join('、')
// 	})
// 	$node.find('.actor').text(function () {
// 		var actorArr = []
// 		movie.casts.forEach(function (item) {
// 		  actorArr.push(item.name)
// 		})
// 	  return actorArr.join('、')
// 	})

// 	$('#top250').append($node)

// })
// }

// //判断是否滚动到底部+懒加载
// var clock
// $('main').scroll(function () {
// 	if (clock) {
// 		clearTimeout(clock)
// 	}
// 	clock = setTimeout(function () {
// 		if ($('section').eq(0).height() - 10 <= $('main').scrollTop() + $('main').height()) {
// 			start()
// 		}
// 	}, 300)

// })