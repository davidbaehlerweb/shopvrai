<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Mail\UserVerification;
use App\Models\User;
use Auth;
use Cookie;
use Exception;
use Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;
use Log;
use Mail;
use Password;
use Str;
use Symfony\Component\HttpFoundation\Response;


class AuthController extends Controller
{
    //
    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    if (Auth::attempt($request->only('email', 'password'))) {
        $user = Auth::user();
        $token = $user->createToken('YourAppName')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 200);
    }

    return response()->json(['error' => 'Unauthorized'], 401);
}


    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email', // Assurez-vous que cela est présent
        'password' => 'required|string|min:6|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // Déclenchement de l'événement Registered pour envoyer l'email de vérification
    event(new Registered($user));

    return response()->json(['message' => 'Compte créé avec succès. Un email de vérification a été envoyé.']);
}


public function checkEmail(Request $request)
    {
        // Valider la requête pour s'assurer que l'email est présent
        $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier si l'email existe déjà dans la base de données
        $emailExists = User::where('email', $request->email)->exists();

        // Retourner une réponse JSON
        return response()->json(['available' => !$emailExists]);
    }


    public function logout(Request $request)
{
    // Récupère l'utilisateur authentifié
    $user = Auth::user();
    
    // Révoque tous les tokens de l'utilisateur
    $user->tokens()->delete();

    // Retourne une réponse de succès
    return response()->json(['message' => 'Déconnexion réussie'], 200);
}

public function getUser(Request $request)
{
    return response()->json([
        'user' => Auth::user(),
    ]);
}


    

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }
    
    public function handleGoogleCallback()
{
    try {
        $user = Socialite::driver('google')->user();
        $localUser = User::updateOrCreate(
            ['email' => $user->getEmail()],
            [
                'name' => $user->getName(),
                'password' => Hash::make(Str::random(24)), // Génère un mot de passe aléatoire
            ]
        );

        Auth::login($localUser);

        // Rediriger l'utilisateur vers la page d'accueil
        return redirect('/home'); 
    } catch (Exception $e) {
        return redirect('/login')->withErrors('Échec de la connexion avec Google.');
    }
}


public function googleLogin(Request $request)
{
    try {
        $googleUser = Socialite::driver('google')->userFromToken($request->input('token'));
        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'password' => Hash::make(Str::random(24))  // Juste un mot de passe aléatoire, non utilisé pour les utilisateurs Google
            ]
        );

        Auth::login($user);
        $token = $user->createToken('YourAppName')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    } catch (Exception $e) {
        return response()->json(['error' => 'Google login failed: ' . $e->getMessage()], 401);
    }
}



public function updatePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    $user = Auth::user();

    // Vérifie si le mot de passe actuel est correct
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['error' => 'Mot de passe actuel incorrect'], 422);
    }

    // Met à jour le mot de passe de l'utilisateur
    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
}



public function updateUser(Request $request)
{
    // Valider les données entrées par l'utilisateur
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
    ]);

    // Retourner une réponse avec les erreurs de validation, s'il y en a
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Récupérer l'utilisateur connecté
    $user = Auth::user();

    // Mettre à jour le nom et l'email
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();

    // Retourner une réponse de succès
    return response()->json(['message' => 'Informations mises à jour avec succès']);
} 

public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);

    try {
        Log::info('Envoi de la requête de réinitialisation pour : ' . $request->email);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        Log::info('Statut de l\'envoi de l\'e-mail de réinitialisation : ' . $status);

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Email de réinitialisation envoyé.'])
            : response()->json(['error' => 'Erreur lors de l\'envoi de l\'email. L\'adresse e-mail peut ne pas être enregistrée.'], 422);
    } catch (Exception $e) {
        Log::error('Erreur lors de l\'envoi de l\'email de réinitialisation: ' . $e->getMessage());
        return response()->json(['error' => 'Erreur interne du serveur. Veuillez réessayer plus tard.'], 500);
    }
}






    // Méthode pour réinitialiser le mot de passe
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['message' => 'Mot de passe réinitialisé avec succès.'])
                    : response()->json(['error' => 'Erreur lors de la réinitialisation du mot de passe.'], 422);
    }

    public function deleteAccount(Request $request)
{
    try {
        $user = $request->user(); // Obtenir l'utilisateur authentifié

        // Supprimez l'utilisateur
        $user->delete();

        return response()->json(['message' => 'Compte supprimé avec succès.'], 200);
    } catch (Exception $e) {
        return response()->json(['error' => 'Erreur lors de la suppression du compte : ' . $e->getMessage()], 500);
    }
}



}
