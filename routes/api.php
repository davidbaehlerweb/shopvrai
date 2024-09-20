<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProduitsController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\VerificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Auth::routes(['verify' => true]);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);


Route::middleware('auth:sanctum')->post('/update-password', [AuthController::class, 'updatePassword']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/update-user', [AuthController::class, 'updateUser']); // Remplacez par PUT
Route::get('/products', [ProduitsController::class, 'index']);
Route::post('/products', [ProduitsController::class, 'store']);
Route::get('/products/{id}', [ProduitsController::class, 'show']);
Route::post('/products/{id}', [ProduitsController::class, 'update']);


Route::delete('/products/{id}', [ProduitsController::class, 'destroy']);









Route::middleware('auth:sanctum')->post('/panier', [PanierController::class, 'store']);

Route::get('/search', [ProduitsController::class, 'search']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::middleware('auth:sanctum')->post('/add-to-cart', [ShopController::class, 'addToCart']);
Route::middleware('auth:sanctum')->get('/get-cart', [ShopController::class, 'getCart']);
Route::middleware('auth:sanctum')->get('/get-commande', [ShopController::class, 'getCommande']);
Route::middleware('auth:sanctum')->delete('/remove-from-cart/{id}', [ShopController::class, 'removeFromCart']);

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/'); // Redirige vers une page spécifique après vérification
})->middleware(['auth', 'signed'])->name('verification.verify');




Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('api.password.email');

// Route pour réinitialiser le mot de passe
// Route pour réinitialiser le mot de passe via l'API
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('api.password.update');



// Route pour rediriger vers votre application React au lieu de Blade
Route::get('/reset-password/{token}', function ($token) {
    return redirect()->away('http://localhost:5173/reset-password/' . $token);
})->name('api.password.reset');


// Route pour afficher le formulaire de réinitialisation de mot de passe
//Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');

// Route pour réinitialiser le mot de passe
//Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');



Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Email de vérification envoyé !');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::post('payer',[ShopController::class,'payer']);
Route::middleware('auth:sanctum')->post('/update-payment-status', [ShopController::class, 'updatePaymentStatus']);

Route::middleware('auth:sanctum')->delete('/delete-account', [AuthController::class, 'deleteAccount']);









