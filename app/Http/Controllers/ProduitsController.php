<?php

namespace App\Http\Controllers;

use App\Models\Produits;
use Illuminate\Http\Request;
use Validator;

class ProduitsController extends Controller
{
    //

    

    public function index()
    {
        return response()->json(Produits::all());
    }

    public function update(Request $request, $id)
    {
        // Valider les données entrantes
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,webp,png,avif,jpg,gif,jfif,svg|max:2048',
        ]);

        // Trouver le produit par ID
        $product = Produits::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        // Mise à jour des champs du produit
        $product->nom = $validated['nom'];
        $product->description = $validated['description'];
        $product->prix = $validated['prix'];

        // Si une nouvelle image est envoyée, on la stocke et on met à jour le chemin de l'image
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
        }

        // Enregistrer les modifications
        $product->save();

        return response()->json($product, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,jfif,webp,png,avif,jpg,gif,jfif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        $product = Produits::create($validated);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $produit = Produits::find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        return response()->json($produit);
    }

    public function destroy($id)
{
    // Trouver le produit par ID
    $product = Produits::find($id);

    if (!$product) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    // Supprimer le produit
    $product->delete();

    return response()->json(['message' => 'Produit supprimé avec succès'], 200);
}

public function search(Request $request)
    {
        $query = $request->input('query');

        // Recherche les produits par nom ou description
        $produits = Produits::where('nom', 'LIKE', "%$query%")
                            ->orWhere('description', 'LIKE', "%$query%")
                            ->get();

        return response()->json($produits);
    }

}
