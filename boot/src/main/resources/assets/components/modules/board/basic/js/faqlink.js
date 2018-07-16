$(document).ready(function(){
	var obj = $('.s_dev_faqlist');
	var $link = $("dl > dt > .title a", obj);
	var $dt = null, $dd = null, $old_dt = null, $old_dd = null;

	$link.click(function(){
		$dt = $(this).parents("dt"), $dd = $dt.next();
		if($old_dt != null){
			if($dt.attr("class") == "select"){
				$dt.attr("class","");
				$dd.attr("class","");
			}else{
				$old_dt.attr("class","");
				$old_dd.attr("class","");
				$dt.attr("class","select");
				$dd.attr("class","select");
			}
		}else{
			$dt.attr("class","select");
			$dd.attr("class","select");
		}
		$old_dt = $dt;
		$old_dd = $dd;

		// Should call it in case content is too long. See bug: #4085
		//Pinetree.page.syncContentHeight();
		return false;
	});
});