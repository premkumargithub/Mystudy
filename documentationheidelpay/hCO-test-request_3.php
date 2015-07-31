<?php

//URL fuer Testsystem
$url = "https://test-heidelpay.hpcgw.net/sgw/gtw";

////////////////////////////////////
// Standard Testdaten für Testshop -- Mit 3D
// Doku heidelpay-Integration Basics_en.pdf -- Seite 27
//
$parameters['SECURITY.SENDER'] = "31HA07BC8124AD82A9E96D9A35FAFD2A";
$parameters['USER.LOGIN'] = "31ha07bc8124ad82a9e96d486d19edaa";
$parameters['USER.PWD'] = "password";
// Channel für CC, OT Sofort, DC, DD, PayPal
$parameters['TRANSACTION.CHANNEL'] = "31HA07BC81A71E2A47DA94B6ADC524D8";
// Channel für Giropay
//$parameters['TRANSACTION.CHANNEL'] = "31HA07BC81A71E2A47DA662C5EDD1112";
// Channel für iDeal
//$parameters['TRANSACTION.CHANNEL'] = "31HA07BC81A71E2A47DA804F6CABDC59";
////////////////////////////////////

////////////////////////////////////
// Standard Testdaten für Testshop -- ohne 3D
// Doku heidelpay-Integration Basics_en.pdf -- Seite 27
//
//$parameters['SECURITY.SENDER'] = "31HA07BC810C91F08643A5D477BDD7C0";
//$parameters['USER.LOGIN'] = "31ha07bc810c91f086431f7471d042d6";
//$parameters['USER.PWD'] = "password";
// Channel für CC, OT Sofort, DC, DD, PayPal
//$parameters['TRANSACTION.CHANNEL'] = "31HA07BC810C91F086433734258F6628";
// Channel für Giropay
//$parameters['TRANSACTION.CHANNEL'] = "31HA07BC810C91F086430EA18CE5E0BF";
// Channel für iDeal
//$parameters['TRANSACTION.CHANNEL'] = "31HA07BC810C91F0864355310BA6BD4C";
////////////////////////////////////

$parameters['ACCOUNT.HOLDER'] = "";
$parameters['ACCOUNT.NUMBER'] = "";
//$parameters['ACCOUNT.BRAND'] = "PAYPAL";
$parameters['ACCOUNT.BRAND'] = "";
$parameters['ACCOUNT.EXPIRY_MONTH'] = "";
$parameters['ACCOUNT.EXPIRY_YEAR'] = "";
$parameters['ACCOUNT.VERIFICATION'] = "";

//Payment Code -- Auswahl Bezahlmethode und Typ
//$parameters['PAYMENT.CODE'] = "DD.RG";  // Registrierung Lastschrift
//$parameters['PAYMENT.CODE'] = "CC.RG";  // Registrierung Kreditkarte
$parameters['PAYMENT.CODE'] = "CC.DB";  // Direkte Belastung
//$parameters['PAYMENT.CODE'] = "CC.PA";  // Reservierende Buchung
//$parameters['PAYMENT.CODE'] = "OT.PA";  // Sofortüberweisung, giropay
//$parameters['PAYMENT.CODE'] = "VA.DB";  // Paypal
$parameters['PRESENTATION.CURRENCY'] = "EUR";

//Response URL angeben
$parameters['FRONTEND.RESPONSE_URL'] = "http://jonas.heidelpay.de/response/response.php";

//CSS- und/oder Jscript-Datei angeben
$parameters['FRONTEND.CSS_PATH'] = "http://127.0.0.1/Testskripte/onlycarddetails_new.css";
//$parameters['FRONTEND.JSCRIPT_PATH'] = "http://127.0.0.1/wpf/wpfui.js";

$parameters['PRESENTATION.AMOUNT'] = round('1.'.mt_rand(1,99),2);
//$parameters['PRESENTATION.AMOUNT'] = '5.2';
$parameters['IDENTIFICATION.TRANSACTIONID'] = 'Heidelpay Testtransaktion vom: '.date("d.m.y - H:i:s");
$parameters['PRESENTATION.USAGE'] = 'Testtransaktion vom '.date("d.m.Y");


$parameters['FRONTEND.MODE'] = "DEFAULT";
//$parameters['FRONTEND.MODE'] = "WPF_LIGHT";

// Modus auswählen
//$parameters['TRANSACTION.MODE'] = "LIVE";
//$parameters['TRANSACTION.MODE'] = "INTEGRATOR_TEST";
$parameters['TRANSACTION.MODE'] = "CONNECTOR_TEST";


$parameters['FRONTEND.ENABLED'] = "true";
$parameters['FRONTEND.POPUP'] = "false";
//$parameters['FRONTEND.SHOP_NAME'] = '';
$parameters['FRONTEND.REDIRECT_TIME'] = "0";


$parameters['FRONTEND.LANGUAGE_SELECTOR'] = "true";
$parameters['FRONTEND.LANGUAGE'] = "de";

$parameters['REQUEST.VERSION'] = "1.0";

/*
$parameters['NAME.GIVEN'] = "";
$parameters['NAME.FAMILY'] = "";
*/

$parameters['NAME.GIVEN'] = "Markus";
$parameters['NAME.FAMILY'] = "Mustermann";
$parameters['ADDRESS.STREET'] = "Musterstrasse 1";
$parameters['ADDRESS.ZIP'] = "12345";
$parameters['ADDRESS.CITY'] = "Musterstadt";
$parameters['ADDRESS.COUNTRY'] = "DE";
//$parameters['ADDRESS.STATE'] = "";
$parameters['CONTACT.EMAIL'] = "test@example.com";

//building the postparameter string to send into the WPF

$result = '';
foreach ($parameters AS $key => $value)
$result .= strtoupper($key).'='.urlencode($value).'&';
$strPOST = stripslashes($result);

//echo $strPOST;

//open the request url for the Web Payment Frontend

$cpt = curl_init();
curl_setopt($cpt, CURLOPT_URL, $url);
curl_setopt($cpt, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($cpt, CURLOPT_USERAGENT, "php ctpepost");
curl_setopt($cpt, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($cpt, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($cpt, CURLOPT_POST, 1);
curl_setopt($cpt, CURLOPT_POSTFIELDS, $strPOST);
$curlresultURL = curl_exec($cpt);
$curlerror = curl_error($cpt);
$curlinfo = curl_getinfo($cpt);
curl_close($cpt);


// here you can get all variables returned from the ctpe server (see post integration transactions documentation for help)
//print $strPOST;
// parse results

$r_arr=explode("&",$curlresultURL);
foreach($r_arr AS $buf)
{
$temp=urldecode($buf);
$temp=split("=",$temp,2);
$postatt=$temp[0];
$postvar=$temp[1];
$returnvalue[$postatt]=$postvar;
//print "<br>var: $postatt - value: $postvar<br>";
}

$processingresult=$returnvalue['POST.VALIDATION'];

$redirectURL=$returnvalue['FRONTEND.REDIRECT_URL'];

// everything ok, redirect to the WPF,
if ($processingresult=="ACK")
{
	if (strstr($redirectURL,"http")) // redirect url is returned ==> everything ok
{
		header("Location: $redirectURL");
}
	else // error-code is returned ... failure
{
		//header("Location: http://127.0.0.1/livesystem/error.php");
		print_r($returnvalue);
}
}// there is a connection-problem to the ctpe server ... redirect to error page (change the URL to YOUR error page)
	else
{
		// header("Location: http://127.0.0.1/livesystem/connection.php");
		print_r($returnvalue);
		//print_r($returnvalue);
}
?>
