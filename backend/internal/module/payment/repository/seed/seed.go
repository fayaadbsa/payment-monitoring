package seed

type MockPayment struct {
	PaymentID string
	Merchant  string
	Status    string
	Amount    string
	CreatedAt string
}

var SeedPayments = []MockPayment{
	// 3 Failed
	{"PAY-9041-A1B2", "Amazon Web Services", "failed", "1420.50", "2026-06-28T09:12:00Z"},
	{"PAY-1102-K3L4", "Google Workspace", "failed", "120.00", "2026-06-27T16:45:00Z"},
	{"PAY-8821-M5N6", "Steam Games", "failed", "59.99", "2026-06-25T21:30:00Z"},
	// 7 Processing
	{"PAY-4032-B2C3", "Dupay Escrow", "processing", "2500.00", "2026-06-28T15:20:00Z"},
	{"PAY-8054-X7Y8", "Shopify Inc", "processing", "399.00", "2026-06-28T14:10:00Z"},
	{"PAY-7023-W2Q1", "Netflix Premium", "processing", "15.99", "2026-06-28T11:05:00Z"},
	{"PAY-3049-T9R8", "Tokopedia", "processing", "125.50", "2026-06-28T08:50:00Z"},
	{"PAY-5542-E4F5", "Grab Indonesia", "processing", "24.00", "2026-06-27T19:35:00Z"},
	{"PAY-9921-U8I9", "Gojek Food", "processing", "18.20", "2026-06-27T11:15:00Z"},
	{"PAY-2291-C8D9", "Spotify Premium", "processing", "9.99", "2026-06-26T14:40:00Z"},
	// 40 Completed
	{"PAY-1001-F3A1", "Google Store", "completed", "899.00", "2026-06-28T16:00:00Z"},
	{"PAY-1002-H4B2", "Apple App Store", "completed", "4.99", "2026-06-28T13:45:00Z"},
	{"PAY-1003-J5C3", "Microsoft Azure", "completed", "1250.00", "2026-06-28T10:30:00Z"},
	{"PAY-1004-L6D4", "Amazon India", "completed", "85.20", "2026-06-28T07:15:00Z"},
	{"PAY-1005-N7E5", "GitHub Pro", "completed", "4.00", "2026-06-28T02:00:00Z"},
	{"PAY-1006-P8F6", "Vercel Hosting", "completed", "20.00", "2026-06-27T23:50:00Z"},
	{"PAY-1007-R9G7", "Dupay Merchant", "completed", "1500.00", "2026-06-27T22:10:00Z"},
	{"PAY-1008-T1H8", "Figma Professional", "completed", "15.00", "2026-06-27T20:00:00Z"},
	{"PAY-1009-V2I9", "Slack Technologies", "completed", "72.00", "2026-06-27T18:30:00Z"},
	{"PAY-1010-X3J0", "DigitalOcean LLC", "completed", "24.00", "2026-06-27T15:20:00Z"},
	{"PAY-1011-Z4K1", "Uber Rides", "completed", "32.50", "2026-06-27T12:00:00Z"},
	{"PAY-1012-B5L2", "Airbnb Booking", "completed", "340.00", "2026-06-27T09:45:00Z"},
	{"PAY-1013-D6M3", "Starbucks Coffee", "completed", "12.80", "2026-06-27T08:15:00Z"},
	{"PAY-1014-F7N4", "Zoom Video", "completed", "14.99", "2026-06-27T05:30:00Z"},
	{"PAY-1015-H8O5", "Adobe Creative Cloud", "completed", "54.99", "2026-06-27T01:10:00Z"},
	{"PAY-1016-J9P6", "Grab Indonesia", "completed", "18.50", "2026-06-26T23:45:00Z"},
	{"PAY-1017-L0Q7", "Tokopedia Wallet", "completed", "250.00", "2026-06-26T21:30:00Z"},
	{"PAY-1018-N1R8", "Netflix Premium", "completed", "15.99", "2026-06-26T19:15:00Z"},
	{"PAY-1019-P2S9", "Steam Store", "completed", "49.99", "2026-06-26T17:00:00Z"},
	{"PAY-1020-R3T0", "Nike Online", "completed", "120.00", "2026-06-26T14:20:00Z"},
	{"PAY-1021-T4U1", "AWS Cloud Services", "completed", "450.70", "2026-06-26T11:10:00Z"},
	{"PAY-1022-V5V2", "Google Cloud", "completed", "89.10", "2026-06-26T08:50:00Z"},
	{"PAY-1023-X6W3", "Mailchimp", "completed", "30.00", "2026-06-26T06:30:00Z"},
	{"PAY-1024-Z7X4", "GitHub Copilot", "completed", "10.00", "2026-06-26T02:00:00Z"},
	{"PAY-1025-B8Y5", "Intercom Inc", "completed", "150.00", "2026-06-25T23:55:00Z"},
	{"PAY-1026-D9Z6", "Cloudflare Pro", "completed", "20.00", "2026-06-25T21:40:00Z"},
	{"PAY-1027-F0A7", "Linktree Pro", "completed", "9.00", "2026-06-25T19:20:00Z"},
	{"PAY-1028-H1B8", "Canva Premium", "completed", "12.99", "2026-06-25T17:15:00Z"},
	{"PAY-1029-J2C9", "OpenAI API", "completed", "25.00", "2026-06-25T13:20:00Z"},
	{"PAY-1030-L3D0", "Tailwind UI", "completed", "249.00", "2026-06-25T11:00:00Z"},
	{"PAY-1031-N4E1", "Linear App", "completed", "8.00", "2026-06-25T08:30:00Z"},
	{"PAY-1032-P5F2", "Notion Personal", "completed", "48.00", "2026-06-25T05:20:00Z"},
	{"PAY-1033-R6G3", "JetBrains Toolbox", "completed", "24.90", "2026-06-25T01:45:00Z"},
	{"PAY-1034-T7H4", "Apple iCloud", "completed", "2.99", "2026-06-24T22:30:00Z"},
	{"PAY-1035-V8I5", "Fastly CDN", "completed", "75.00", "2026-06-24T20:15:00Z"},
	{"PAY-1036-X9J6", "Sentry.io", "completed", "29.00", "2026-06-24T18:00:00Z"},
	{"PAY-1037-Z0K7", "Twilio API", "completed", "45.20", "2026-06-24T15:30:00Z"},
	{"PAY-1038-B1L8", "Datadog Monitoring", "completed", "180.00", "2026-06-24T12:00:00Z"},
	{"PAY-1039-D2M9", "Stripe Fees", "completed", "35.50", "2026-06-24T09:45:00Z"},
	{"PAY-1040-F3N0", "Gojek Food", "completed", "14.30", "2026-06-24T08:10:00Z"},
}
