<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Ajoutez l'en-tête Content-Security-Policy ici
        $response->headers->set('Content-Security-Policy', "frame-ancestors 'self' https://accounts.google.com");


        return $response;
    }
}
