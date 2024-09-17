<?php

namespace App\Http\Controllers;

use App\Models\panier;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    //

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'user_id' => 'required|exists:users,id',
        'produit_id' => 'required|exists:produits,id',
        'quantite' => 'required|integer|min:1',
    ]);

    $panier = Panier::create([
        'user_id' => 1,  // Testez avec un ID d'utilisateur fixe
        'produit_id' => 1,  // Testez avec un ID de produit fixe
        'quantite' => 1,
    ]);

    return response()->json($panier, 201);
}




}
