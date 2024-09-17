<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
{
    if ($request->expectsJson()) {
        return null; // Ne redirige pas si c'est une requête AJAX ou API
    }
    // Retourner l'URL de la page de login seulement pour les requêtes web normales
    return url('http://localhost:5173/login'); 
}




public function handle($request, Closure $next, ...$guards)
{
    if ($jwt = $request->cookie('jwt')) {
        $request->headers->set('Authorization', 'Bearer ' . $jwt);
    }

    $this->authenticate($request, $guards);

    return $next($request);
}


    
}
