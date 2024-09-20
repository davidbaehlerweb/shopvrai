<?php

namespace App\Http\Controllers;

use App\Models\Produits;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Str;
use Stripe\StripeClient;

class ShopController extends Controller
{
    // Méthode pour ajouter un produit au panier
    public function addToCart(Request $request)
{
    \Log::info('Entering addToCart Method');

    try {
        $user = Auth::user();
        if (!$user) {
            \Log::info('User not authenticated');
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $productId = $request->input('product_id');
        $product = Produits::find($productId);
        if (!$product) {
            \Log::info('Product not found with ID: ' . $productId);
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        $shop = Shop::create([
            'user_id' => $user->id,
            'produit_id' => $productId,
            'status' => 'pas payer',
            'unique_instance_id' => Str::uuid(), // Ajoutez un identifiant unique pour chaque instance du produit
        ]);

        \Log::info('Product added to cart successfully');
        return response()->json(['message' => 'Produit ajouté au panier avec succès', 'shop' => $shop], 201);
    } catch (\Exception $e) {
        \Log::error("Erreur lors de l'ajout au panier: " . $e->getMessage());
        return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
    }
}



    // Méthode pour récupérer les produits du panier de l'utilisateur
    public function getCart()
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }

    // Récupère les produits du panier pour l'utilisateur connecté
    $cartItems = Shop::where('user_id', $user->id)
        ->where('status', 'pas payer') // Filtrer par statut "pas payer"
        ->with('produit') // Charger les informations des produits associés
        ->get(); // Exécuter la requête et obtenir les résultats

    return response()->json(['cartItems' => $cartItems], 200);
}


public function getCommande()
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }

    // Récupère les produits du panier pour l'utilisateur connecté avec statut "payé"
    $cartItems = Shop::where('user_id', $user->id)
        ->where('status', 'payer') // Filtrer par statut "payé"
        ->with('produit') // Charger les informations des produits associés
        ->get(); // Exécuter la requête et obtenir les résultats

    return response()->json(['cartItems' => $cartItems], 200);
}


    // Méthode pour supprimer un produit du panier
    public function removeFromCart($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $cartItem = Shop::where('user_id', $user->id)->where('id', $id)->first();
        if (!$cartItem) {
            return response()->json(['message' => 'Produit non trouvé dans le panier'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Produit supprimé du panier avec succès'], 200);
    }
    public function payer(){
        $stripe = new StripeClient(env('VITE_STRIPE_SECRET_KEY')); // Utilisez env() pour récupérer la clé en toute sécurité


        try {

            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);


            $res = $stripe->paymentIntents->create([
                'amount' => $jsonObj->items->amount,
                'currency' => 'chf',
                'automatic_payment_methods' => [
                'enabled' => true,
                ],
            ]);
            $output = [
                'clientSecret' =>  $res->client_secret,
            ];

            echo json_encode($output);
        } catch (\Error $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    

    public function updatePaymentStatus(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        \Log::error('Utilisateur non authentifié lors de la mise à jour du statut de paiement.');
        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }

    $uniqueInstanceId = $request->input('unique_instance_id');

    if (!$uniqueInstanceId) {
        \Log::error('ID unique manquant pour la mise à jour.');
        return response()->json(['message' => 'ID unique manquant pour la mise à jour.'], 400);
    }

    // Vérifiez que vous mettez à jour toutes les instances correspondant à l'identifiant unique
    $cartItems = Shop::where('user_id', $user->id)
                     ->where('unique_instance_id', $uniqueInstanceId)
                     ->get();

    if ($cartItems->isEmpty()) {
        \Log::error('Produit non trouvé dans le panier pour mise à jour du statut.');
        return response()->json(['message' => 'Produit non trouvé dans le panier'], 404);
    }

    foreach ($cartItems as $cartItem) {
        $cartItem->status = 'payer';
        $cartItem->save();
        \Log::info('Statut du produit mis à jour à "payer" pour l\'instance du produit avec ID unique : ' . $uniqueInstanceId);
    }

    return response()->json(['message' => 'Statut des produits mis à jour à "payé"'], 200);
}












}
