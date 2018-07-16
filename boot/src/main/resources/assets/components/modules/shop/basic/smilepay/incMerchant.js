var ediDate;
var merchantKey;
var payActionUrl;

function setPayActionUrl(x) {
	payActionUrl = x;
}

/**
 * 지불방법에 따른 UI 분류 
 */
function goUI(payType) {	
	var orderFormNm = document.orderForm;
	if(payType == '0') { // 전체
		orderFormNm.payType.value	= '0';
	} else if(payType == '1') { // 신용카드
		orderFormNm.payType.value	= '1';
	} else if(payType == '2') { 
		orderFormNm.payType.value	= '2';
	} else if(payType == '3') {
		orderFormNm.payType.value	= '3';
	} else if(payType == '4') {
		orderFormNm.payType.value	= '4';
	} else if(payType == '5') {
		orderFormNm.payType.value	= '5';
	} else if(payType == '6') { // 계좌이체
		orderFormNm.payType.value	= '6';
	} else if(payType == '7') { // 가상계좌
		orderFormNm.payType.value	= '7';
	} else if(payType == '8') { // 신용카드 + 계좌이체
		orderFormNm.payType.value	= '8';
	} else if(payType == '9') { //휴대폰결제
		orderFormNm.payType.value	= '9';
	}
}


/**
 * 카드결제
 */
function goSelectCard() {
	var smilepayFormNm	= document.smilepayForm;
	smilepayFormNm.PayMethod.value = "CARD";
	
	// 결제수단
	goUI('1');	
	// 결제 전송
	goPay();
}

/**
 * 실시간 계좌이체
 */
function goSelectBank() {
	var smilepayFormNm	= document.smilepayForm;
	smilepayFormNm.PayMethod.value = "BANK";
	
	// 결제수단 
	goUI('6');
	// 결제 전송
	goPay();
}

/**
 * 가상계좌
 */
function goSelectVBank() {
	var smilepayFormNm	= document.smilepayForm;
	smilepayFormNm.PayMethod.value = "VBANK";
	
	// 결제수단
	goUI('7');
	// 결제 전송
	goPay();
}

/**
 * 결제 전송
 */
function goPay() {
	var realPaymentAmount = parseInt($('.payment-price').text());
	if($('input[name=pointUse]').length > 0) {
		realPaymentAmount = realPaymentAmount - $('input[name=pointUse]').val();
	}
	
	//EncryptData 가져오기
	$.ajax({
        type: 'GET',
        url: '/site/module/shop/smilepay/getEncryptData.json',
        dataType: 'json',
        data:{ paymentAmount : realPaymentAmount },
        success: function (responseData) {
            if (responseData.success && responseData.data) {
            	var encryptData = responseData.data.encryptData;
            	var ediDate = responseData.data.ediDate;
                //var totalPoint = responseData.totalPoint;
            	var orderFormNm		= document.orderForm;
            	var smilepayFormNm	= document.smilepayForm;
            	
            	if( navigator.appName.indexOf("Microsoft") > -1 ) {
            		if( navigator.appVersion.indexOf("MSIE 7") > -1 ) {
            			BrowserType = "MSIE 7";
            		}
            		else if( navigator.appVersion.indexOf(navigator.appVersion.indexOf( "MSIE 6" ) > -1) ) {
            			BrowserType = "MSIE 6";
            		}
            	}
            	//console.log(responseData);
            	smilepayFormNm.EncryptData.value	= encryptData;
            	smilepayFormNm.ediDate.value	= ediDate;
            	smilepayFormNm.Amt.value			= realPaymentAmount;
            	smilepayFormNm.BuyerName.value		= orderFormNm.cusName.value;
            	smilepayFormNm.BuyerTel.value		= orderFormNm.cusPhone1.value+"-"+orderFormNm.cusPhone2.value+"-"+orderFormNm.cusPhone3.value;
            	smilepayFormNm.BuyerEmail.value		= orderFormNm.cusEmail1.value+"@"+orderFormNm.cusEmail2.value;
            	smilepayFormNm.action = payActionUrl + '/interfaceURL.jsp';
            	
            	//CharterSet Setting ----------------------------
            	var encodingType = "UTF-8";//UTF-8 || EUC-KR
            	if(getVersionOfIE() != 'N/A')
            		document.charset = encodingType;//ie
            	else
            		smilepayFormNm.charset = encodingType;//else
            	//-----------------------------------------------
            	  	  
            	if(smilepayFormNm.FORWARD.value == 'Y'){
            		var left = (screen.Width - 545)/2;
            		var top = (screen.Height - 573)/2;
            		var winopts= "left="+left+",top="+top+",width=545,height=573,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,resizable=no";
            		var win =  window.open("", "payWindow", winopts);	
            		smilepayFormNm.target = "payWindow";
            		smilepayFormNm.submit();
            		
            	}else{
            		smilepayFormNm.target = "payFrame";
            		smilepayFormNm.submit();
            		//smilepayFormNm.PayMethod.value = "";
            		//smilepayFormNm.payType.value = "";
            	}
            } else {
                siteApp.alertMessage('서버 에러가 발생했습니다. 관리자에게 문의 바랍니다.');
            }
        },
        error: function () {
            siteApp.alertMessage('서버 에러가 발생했습니다. 관리자에게 문의 바랍니다.');
        }
    });
}

/**
 * IE버전 확인
 */
function getVersionOfIE() 
{ 
	 var word; 
	 var version = "N/A"; 

	 var agent = navigator.userAgent.toLowerCase(); 
	 var name = navigator.appName; 

	 // IE old version ( IE 10 or Lower ) 
	 if ( name == "Microsoft Internet Explorer" ) 
	 {
		 word = "msie "; 
	 }
	 else 
	 { 
		 // IE 11 
		 if ( agent.search("trident") > -1 ) word = "trident/.*rv:"; 

		 // IE 12  ( Microsoft Edge ) 
		 else if ( agent.search("edge/") > -1 ) word = "edge/"; 
	 } 

	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 

	 if ( reg.exec( agent ) != null  ) 
		 version = RegExp.$1 + RegExp.$2; 

	 return version; 
}

/**
 * 연동페이지
 * 1.상점별 결제수단 파악해서 쿠키에 넣어줄지 결정
 */
function goInterface() {
		
    var selectType = selectedBoxValue(document.tranMgr.selectType);
	var smilepayFormNm	= document.smilepayForm;
	smilepayFormNm.PayMethod.value = selectType;

	if(selectType == '') { // 전체
		goUI('0');
	} else if(selectType == 'CARD') {
	    goUI('1');
	} else if(selectType == 'BANK') {
	    goUI('6');
	} else if(selectType == 'VBANK') {
	    goUI('7');
	} else if(selectType == 'CARD+BANK') {
	    goUI('8');
	    smilepayFormNm.PayMethod.value = 'CARD';
	} else if(selectType == 'CELLPHONE'){
		goUI('9');
		 smilepayFormNm.PayMethod.value = 'CELLPHONE';
	} else if(selectType == 'KEYIN'){
		goUI('4');
		 smilepayFormNm.PayMethod.value = 'KEYIN';
	}
	
    
	// 결제수단
	goPay();
	
	return false;
}

/****************************************************************************************
 * objName		- select box Object
 * description	- select box 값 얻어오기
 ****************************************************************************************/
function selectedBoxValue(objName) {
	return objName[objName.selectedIndex].value;
}

/****************************************************************************************
 * 특수 문자 체크
 ****************************************************************************************/
function isSpecial(checkStr) {
	var checkOK = "~`':;{}[]<>,.!@#$%^&*()_+|\\/?";

	for (i = 0;  i < checkStr.length;  i++)	{
		ch = checkStr.charAt(i);
		for (j = 0;  j < checkOK.length;  j++) {
			if (ch == checkOK.charAt(j)) {return true; break;}
		}
	}
	return false;
}

/****************************************************************************************
 * Email Check
 ****************************************************************************************/
function EmailCheck(arg_v) {
	var	vValue = "";

	if(arg_v.indexOf("@") < 0) return false;

	for(var i = 0; i < arg_v.length; i++) {
		vValue = arg_v.charAt(i);

		if (AlphaCheck(vValue) == false  && NumberCheck(vValue) == false && EmailSpecialCheck(vValue) == false )
			return false;
	}
	return true;
}

/****************************************************************************************
 * 영문 판별
 ****************************************************************************************/
function AlphaCheck(arg_v) {
	var alphaStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	if ( alphaStr.indexOf(arg_v) < 0 )
		return false;
	else
		return true;
}

/****************************************************************************************
 * 숫자 판별
 ****************************************************************************************/
function NumberCheck(arg_v) {
	var numStr = "0123456789";

	if ( numStr.indexOf(arg_v) < 0 )
		return false;
	else
		return true;
}

/****************************************************************************************
 * Email 특수 문자 체크
 ****************************************************************************************/
function EmailSpecialCheck(arg_v) {
	var SpecialStr = "_-@.";

	if ( SpecialStr.indexOf(arg_v) < 0 )
		return false;
	else
		return true;
}

/****************************************************************************************
 * objName		- 라디오버튼 Object
 * description	- 라디오버튼 값 얻어오기
 ****************************************************************************************/
function checkedRadioButtonValue(objName) {
	var radioVal = '';
	var radioObj = document.all(objName);
	
	if(radioObj.length == null) {
		if(radioObj.checked){
			radioVal = radioObj.value;
		}
	}
	else {
		for(i = 0; i < radioObj.length; i++) {
			if(radioObj[i].checked) {
				radioVal = radioObj[i].value;
				break;
			}
		}
	}
	return radioVal;
}

/****************************************************************************************
 * 입력필드(사용자가 키보드를 처서 입력하는)의 입력값이 숫자만 들어가도록 할 때 사용된다.
 * 사용예 : <input type="text" name="text" onKeyUp="javascript:numOnly(this,document.frm,true);">
 * 여기서 this는 오브젝트를 뜻하므로 그냥 사용하면 되고, document 다음의 frm 대신에
 * 자신이 사용한 form 이름을 적어준다.
 * 마지막 파라미터로 true,false 를 줄 수 있는데 true로 주면 금액등에 쓰이는 3자리마다 콤마를
 * false 로 주면 그냥 숫자만 입력하게 한다.
 ****************************************************************************************/
function numOnly(obj, frm, isCash) {
	if (event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39) return;
	var returnValue = "";
	for (var i = 0; i < obj.value.length; i++){
		if (obj.value.charAt(i) >= "0" && obj.value.charAt(i) <= "9"){
			returnValue += obj.value.charAt(i);
		}else{
			returnValue += "";
		}
	}

	if (isCash){
		obj.value = cashReturn(returnValue);
		return;
	}
	obj.focus();
	obj.value = returnValue;
}

/****************************************************************************************
 * 금액을 위한 함수, 코더들은 이 function을 직접 부를 필요 없다. numOnly함수에 마지막
 * 파라미터를 true로 주고 numOnly를 부른다.
 ****************************************************************************************/
function cashReturn(numValue) {
	var cashReturn = "";
	for (var i = numValue.length-1; i >= 0; i--){
		cashReturn = numValue.charAt(i) + cashReturn;
		if (i != 0 && i%3 == numValue.length%3) cashReturn = "," + cashReturn;
	}

	return cashReturn;
}

/****************************************************************************************
 * 사업자등록번호 체크
 ****************************************************************************************/
function isBusiNoByValue(strNo) { 

	var sum = 0;
	var getlist =new Array(10);
	var chkvalue =new Array("1","3","7","1","3","7","1","3","5"); 

	for ( var i = 0; i < 10; i++ ) {
		getlist[i] = strNo.substring(i, i+1); 
	}

	for ( var i = 0; i < 9; i++ ) {
		sum += getlist[i]*chkvalue[i];
	}
	
	sum = sum + parseInt((getlist[8]*5)/10); 
	sidliy = sum%10;
	sidchk = 0;

	if ( sidliy != 0 ) {
		sidchk = 10 - sidliy; 
	}
	else {
		sidchk = 0; 
	}
	
	if ( sidchk != getlist[9] ) { 
		return false;
	}
		return true;
}

/****************************************************************************************
 * 주민번호 정합성 체크
 ****************************************************************************************/
function isJuminNo(juminNo1, juminNo2) {
	var f1 = juminNo1.substring(0, 1);
	var f2 = juminNo1.substring(1, 2);
	var f3 = juminNo1.substring(2, 3);
	var f4 = juminNo1.substring(3, 4);
	var f5 = juminNo1.substring(4, 5);
	var f6 = juminNo1.substring(5, 6);	
	
	var l1 = juminNo2.substring(0, 1);
	var l2 = juminNo2.substring(1, 2);
	var l3 = juminNo2.substring(2, 3);
	var l4 = juminNo2.substring(3, 4);
	var l5 = juminNo2.substring(4, 5);
	var l6 = juminNo2.substring(5, 6);
	var l7 = juminNo2.substring(6, 7);
	
	var sum = f1 * 2 + f2 * 3 + f3 * 4 + f4 * 5 + f5 * 6 + f6 * 7;
	sum = sum + l1 * 8 + l2 * 9 + l3 * 2 + l4 * 3 + l5 * 4 + l6 * 5;
	sum = sum % 11;
	sum = 11 - sum;
	sum = sum % 10;
	
	if (sum != l7) {return false;}
	
	return true;
}
