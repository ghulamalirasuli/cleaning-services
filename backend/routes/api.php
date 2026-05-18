<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CmsBlockController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SiteSettingController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/cities', [CityController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);
Route::get('/settings', [SiteSettingController::class, 'show']);
Route::get('/cms/blocks', [CmsBlockController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/quotes', [QuoteController::class, 'store']);

// Stripe Webhook (no auth)
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Customer (auth required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::put('/me', [UserController::class, 'update']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{reference}', [BookingController::class, 'show']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{id}/request-correction', [BookingController::class, 'requestCorrection']);
    Route::post('/bookings/{id}/pay-balance', [PaymentController::class, 'payBalance']);

    Route::post('/reviews', [ReviewController::class, 'store']);
});

// Admin
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/settings', [Admin\SiteSettingController::class, 'show']);
    Route::put('/settings', [Admin\SiteSettingController::class, 'update']);

    Route::get('/backup/download', [Admin\BackupController::class, 'download']);

    foreach (['cities', 'cleaners', 'quotes', 'bookings', 'testimonials', 'cms-blocks'] as $resource) {
        $controller = match ($resource) {
            'cities' => Admin\CityController::class,
            'cleaners' => Admin\CleanerController::class,
            'quotes' => Admin\QuoteController::class,
            'bookings' => Admin\BookingController::class,
            'testimonials' => Admin\TestimonialController::class,
            'cms-blocks' => Admin\CmsBlockController::class,
        };
        Route::post("/{$resource}/{id}/restore", [$controller, 'restore'])->whereNumber('id');
        Route::delete("/{$resource}/{id}/force", [$controller, 'forceDestroy'])->whereNumber('id');
    }

    Route::post('/services/{id}/restore', [Admin\ServiceController::class, 'restore'])->whereNumber('id');
    Route::delete('/services/{id}/force', [Admin\ServiceController::class, 'forceDestroy'])->whereNumber('id');
    Route::post('/service-extras/{id}/restore', [Admin\ServiceExtraController::class, 'restore'])->whereNumber('id');
    Route::delete('/service-extras/{id}/force', [Admin\ServiceExtraController::class, 'forceDestroy'])->whereNumber('id');

    Route::apiResource('cleaners', Admin\CleanerController::class);
    Route::apiResource('bookings', Admin\BookingController::class)->except(['store']);
    Route::apiResource('quotes', Admin\QuoteController::class)->except(['store']);
    Route::apiResource('cities', Admin\CityController::class);
    Route::apiResource('services', Admin\ServiceController::class);
    Route::apiResource('service-extras', Admin\ServiceExtraController::class);
    Route::apiResource('testimonials', Admin\TestimonialController::class);
    Route::apiResource('cms-blocks', Admin\CmsBlockController::class);
    Route::post('/bookings/{id}/assign-cleaner', [Admin\BookingController::class, 'assignCleaner']);
    Route::post('/bookings/{id}/complete', [Admin\BookingController::class, 'complete']);
});
