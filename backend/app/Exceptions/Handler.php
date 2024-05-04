<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response;

class Handler extends ExceptionHandler
{
    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        // Check if the request expects JSON response
        if ($request->expectsJson()) {
            // Create an error response
            $response = [
                'error' => 'Something went wrong.',
            ];

            // If the exception has a message, add it to the response
            if ($exception->getMessage()) {
                $response['message'] = $exception->getMessage();
            }

            // Return the JSON response with an error status code
            return Response::json($response, JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return parent::render($request, $exception);
    }
}
