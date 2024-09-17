@component('mail::message')
# Réinitialisation de mot de passe

Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe.

@component('mail::button', ['url' => $url])
Réinitialiser le mot de passe
@endcomponent

Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune autre action n'est requise.

Merci,<br>
{{ config('app.name') }}
@endcomponent
