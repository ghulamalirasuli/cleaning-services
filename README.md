<img width="1912" height="843" alt="4" src="https://github.com/user-attachments/assets/5fb561a7-2e56-4898-9db4-a79ffb708292" />
<img width="1918" height="847" alt="5" src="https://github.com/user-attachments/assets/84bb289d-0bad-4aea-80cb-18b1e3dfb946" />
<img width="1896" height="841" alt="6" src="https://github.com/user-attachments/assets/1f4e5b2c-3171-41cf-b7fa-4dbb3a4d6694" />
<img width="1912" height="867" alt="1" src="https://github.com/user-attachments/assets/1f685b4f-95f5-4823-937f-5a241256b5e2" />
<img width="1891" height="913" alt="2" src="https://github.com/user-attachments/assets/ee8aecd0-a2e9-4ef2-9e06-1053b6e2ba93" />
<img width="1918" height="970" alt="3" src="https://github.com/user-attachments/assets/3da71b9b-4e29-4a54-9c4f-309246eb6e49" />
# 🧹 Cleaning Services Platform

A two-sided marketplace for booking verified home and office cleaners.

## Stack
- **Backend:** Laravel 12 (REST API) + Sanctum + Stripe
- **Frontend:** React 19 + Tailwind CSS + Zustand
- **Languages:** English 🇬🇧 & German 🇩🇪

## Features
- Multi-step booking wizard with Stripe deposit payment
- Service catalogue (one-time, regular, deep clean, move-in/out, office)
- Customer account dashboard & booking management
- Admin panel (cleaners, bookings, quotes)
- Deposit-first model — balance auto-charged 48h after service

## Quick Start

**Backend**
```bash
cd backend
composer install
cp .env.example .env
php artisan migrate --seed
php artisan serve
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Booking Flow
1. Choose service → 2. Location → 3. Date/time → 4. Extras → 5. Pay deposit

## License
MIT
