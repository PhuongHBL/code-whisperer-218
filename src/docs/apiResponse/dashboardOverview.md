curl 'https://ai.webapp01.hblab.dev/dashboard/overview' \
 -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
 -H 'Cache-Control: no-cache' \
 -H 'Connection: keep-alive' \
 -H 'Content-Type: application/json' \
 -H 'Origin: https://ai.webapp01.hblab.dev/' \
 -H 'Pragma: no-cache' \
 -H 'Referer: https://ai.webapp01.hblab.dev/docs' \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
 -H 'accept: application/json' \
 --data-raw $'{\n "location": "Sydney Airport",\n "car_category": "Economy",\n "pickup_date": "2026-04-15",\n "rental_duration": 3,\n "calendar_days": 7\n}' \
 --insecure
payload:
{
"location": "Adelaide",
"car_category": "Compact",
"pickup_date": "2026-04-03",
"rental_duration": 3,
"currency": "AUD",
"model_used": "ADL (location-specific)",
"summary": {
"avg_daily_rate": 149.93,
"lowest_rate": {
"price": 130.1,
"competitor": "East Coast Rentals"
},
"highest_rate": {
"price": 198.24,
"competitor": "Avis"
},
"competitor_count": 21,
"total_vehicles_analyzed": 1863,
"top_demand_hub": "TSV"
},
"calendar": [
{
"date": "2026-03-31",
"is_selected": false,
"cheapest_price": 99.45,
"cheapest_company": "Green Motion",
"highest_price": 167.16,
"highest_company": "Bargain Car Rentals",
"our_suggested_price": 92.49,
"vs_cheapest_pct": -7
},
{
"date": "2026-04-01",
"is_selected": false,
"cheapest_price": 90.49,
"cheapest_company": "Green Motion",
"highest_price": 172.3,
"highest_company": "Bargain Car Rentals",
"our_suggested_price": 84.16,
"vs_cheapest_pct": -7
},
{
"date": "2026-04-02",
"is_selected": false,
"cheapest_price": 90.49,
"cheapest_company": "Green Motion",
"highest_price": 170.44,
"highest_company": "Bargain Car Rentals",
"our_suggested_price": 84.16,
"vs_cheapest_pct": -7
},
{
"date": "2026-04-03",
"is_selected": true,
"cheapest_price": 167.36,
"cheapest_company": "Green Motion",
"highest_price": 277.72,
"highest_company": "Keddy By Europcar",
"our_suggested_price": 155.64,
"vs_cheapest_pct": -7
},
{
"date": "2026-04-04",
"is_selected": false,
"cheapest_price": 159.04,
"cheapest_company": "East Coast Rentals",
"highest_price": 213.17,
"highest_company": "Simba Car Hire",
"our_suggested_price": 150.48,
"vs_cheapest_pct": -5.4
},
{
"date": "2026-04-05",
"is_selected": false,
"cheapest_price": 160.2,
"cheapest_company": "Green Motion",
"highest_price": 262.86,
"highest_company": "Simba Car Hire",
"our_suggested_price": 148.99,
"vs_cheapest_pct": -7
},
{
"date": "2026-04-06",
"is_selected": false,
"cheapest_price": 126.8,
"cheapest_company": "Yesaway",
"highest_price": 221.58,
"highest_company": "Avis",
"our_suggested_price": 137.11,
"vs_cheapest_pct": 8.1
}
],
"competitors": [
{
"channel": "Booking.com",
"competitor": "East Coast Rentals",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 130.1,
"total_rate": 390.3,
"confidence": {
"interval": {
"low": 144.3,
"high": 196.52
},
"interval_width": 52.22,
"confidence_score": 0.8,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Green Motion",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Ace Rental Cars",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Crazy Clark's Car Rentals",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Alpha",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Alamo",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Ezi Car Rental",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Snap Rentals",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Jucy",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "GO Rentals",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Thrifty",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Autounion",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Dollar",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Enterprise",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 134.45,
"total_rate": 403.35,
"confidence": {
"interval": {
"low": 109.59,
"high": 208.24
},
"interval_width": 98.65,
"confidence_score": 0.59,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Yesaway",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 159.33,
"total_rate": 477.99,
"confidence": {
"interval": {
"low": 120.22,
"high": 212.65
},
"interval_width": 92.43,
"confidence_score": 0.63,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Europcar",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 175.48,
"total_rate": 526.44,
"confidence": {
"interval": {
"low": 174.63,
"high": 259.94
},
"interval_width": 85.31,
"confidence_score": 0.74,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Bargain Car Rentals",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 180.37,
"total_rate": 541.11,
"confidence": {
"interval": {
"low": 151.98,
"high": 239.11
},
"interval_width": 87.13,
"confidence_score": 0.7,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Sixt",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 182.76,
"total_rate": 548.28,
"confidence": {
"interval": {
"low": 167.11,
"high": 245.36
},
"interval_width": 78.25,
"confidence_score": 0.75,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Keddy By Europcar",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 184.68,
"total_rate": 554.04,
"confidence": {
"interval": {
"low": 164.38,
"high": 259.27
},
"interval_width": 94.89,
"confidence_score": 0.7,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Simba Car Hire",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 189.64,
"total_rate": 568.92,
"confidence": {
"interval": {
"low": 159.49,
"high": 264.69
},
"interval_width": 105.2,
"confidence_score": 0.67,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Avis",
"category": "Compact",
"location": "Adelaide",
"date": "03/04/2026 to 06/04/2026",
"price_per_day": 198.24,
"total_rate": 594.72,
"confidence": {
"interval": {
"low": 155.2,
"high": 243.66
},
"interval_width": 88.46,
"confidence_score": 0.7,
"confidence_label": "high"
}
}
],
"context": {
"weather": {
"source": "forecast",
"temp_max_c": 20.9,
"precip_mm": 0,
"condition": "Overcast",
"condition_type": "cloudy",
"season": null,
"summary": "Overcast, 20.9°C, 0mm rain"
},
"events": {
"count": 1,
"impact_level": "low",
"summary": "1 event: Rd 4: Adelaide Crows v Fremantle",
"sources": {
"unknown": 1
},
"events": [
{
"name": "Rd 4: Adelaide Crows v Fremantle",
"category": "Other",
"date": "2026-04-03",
"venue": "Adelaide Oval",
"expected_impact": null,
"source": null,
"url": null
}
]
},
"public_holidays": [
{
"date": "03/04/2026",
"name": "Good Friday"
},
{
"date": "06/04/2026",
"name": "Easter Monday"
}
],
"demand_drivers": [
"Public holiday"
]
}
}
