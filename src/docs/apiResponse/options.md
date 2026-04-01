curl 'https://ai.webapp01.hblab.dev/options' \
 -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
 -H 'Cache-Control: no-cache' \
 -H 'Connection: keep-alive' \
 -H 'Pragma: no-cache' \
 -H 'Referer: https://ai.webapp01.hblab.dev/docs' \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
 -H 'accept: application/json' \
 --insecure

{
"status": "ok",
"options": {
"location": [
"Adelaide Airport",
"Auckland Airport",
"Brisbane Airport",
"Cairns Airport",
"Christchurch Airport",
"Melbourne Airport",
"Perth Airport",
"Sydney Airport"
],
"competitor": [
"Ace Rental Cars",
"Alpha",
"Avis",
"Bargain Car Rentals",
"Crazy Clark's Car Rentals",
"East Coast Rentals",
"Europcar",
"Green Motion",
"Keddy By Europcar",
"Simba Car Hire",
"Sixt",
"Yesaway"
],
"car_category": [
"Compact",
"Economy",
"Luxury",
"Van"
],
"car_brand": [
"audi",
"bmw",
"ford",
"honda",
"hyundai",
"kia",
"mazda",
"mercedes",
"mg",
"mitsubishi",
"nissan",
"other",
"subaru",
"suzuki",
"toyota",
"volkswagen"
],
"fuel_type": [
"DIESEL",
"ELECTRIC",
"HYBRID",
"N/A",
"PETROL"
],
"transmission": [
"AUTOMATIC",
"MANUAL"
],
"mileage_type": [
"LIMITED",
"UNLIMITED"
],
"pay_when": [
"PAY_NOW"
],
"rental_duration": {
"min": 1,
"max": 30,
"default": 3
}
}
}
