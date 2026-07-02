<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="ColorID - AI-Powered Room Color Visualization. Upload a photo, pick a color, and see your walls in any color before you paint.">
        <meta name="theme-color" content="#4f46e5">

        <meta property="og:title" content="{{ config('app.name', 'ColorID') }} - AI Room Color Visualization">
        <meta property="og:description" content="See your walls in any color before you paint. AI-powered room visualization.">
        <meta property="og:type" content="website">

        <title inertia>{{ config('app.name', 'ColorID') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700,800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

        @env('local')
            <script type="module">
                import RefreshRuntime from 'http://localhost:5173/@react-refresh'
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
            </script>
        @endenv

        @routes
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
