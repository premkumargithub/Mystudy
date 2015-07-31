<?php
$url = "https://test-heidelpay.hpcgw.net/sgw/xml";

$xmlRequest='<?xml version="1.0"?>
<Request version="1.0">
  <Header>
    <Security sender="31HA07BC8124AD82A9E96D9A35FAFD2A"/>
  </Header>
  <Query entity="31HA07BC8124AD82A9E96D9A35FAFD2A" level="MERCHANT" mode="CONNECTOR_TEST" type="STANDARD">
    <User login="31ha07bc8124ad82a9e96d486d19edaa" pwd="password"/>
    <Period from="2014-01-31" to="2014-01-31"/>
    <Methods>
      <Method code="DD"/>
    </Methods>
    <Types>
      <Type code="DB"/>
    </Types>
  </Query>
</Request>';

$urlencodeXML            = 'load='.urlencode($xmlRequest);
//$pathToCa                 = 'C:/wamp/bin/cert/cacert.crt';

$cpt = curl_init();

curl_setopt($cpt, CURLOPT_URL, $url.'?'.$urlencodeXML);

curl_setopt($cpt, CURLOPT_USERAGENT, "php ctpepost");
curl_setopt($cpt, CURLOPT_RETURNTRANSFER, 1);

//curl_setopt($cpt, CURLOPT_CAINFO, $pathToCa);

curl_setopt($cpt, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($cpt, CURLOPT_SSL_VERIFYPEER, 0);

$curlresultURL = curl_exec($cpt);
$curlerror = curl_error($cpt);
$curlinfo = curl_getinfo($cpt);
curl_close($cpt);

echo htmlspecialchars($curlresultURL);

print_r($curlerror);


?>
