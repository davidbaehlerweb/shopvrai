<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    //
    public function verify($user_id, Request $request){
        if(!$request->hasValidSignature()){
            return response()->json(['msg'=>'Invalid/Expired url provided'],401);
        }
        $user=User::findOrFail($user_id);

        if(!$user->hasVerifiedEmail()){
            $user->markEmailAsVerified();
        }else{
            return response()->json([
                'status'=>400,
                'message'=>'Email already verified'
            ],400);
        }
        return response()->json([
            'status'=>200,
            'message'=>"Your email $user->email successfully verified"
        ],200);
    }
}
