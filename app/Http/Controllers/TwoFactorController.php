<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    /**
     * Show the 2FA settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/TwoFactor', [
            'enabled' => $user->two_factor_secret !== null,
        ]);
    }

    /**
     * Generate a TOTP secret and show recovery codes.
     * Stores them temporarily in session until verified via confirm().
     */
    public function enable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $secret = $this->generateBase32Secret();
        $recoveryCodes = collect(range(1, 8))->map(fn () => bin2hex(random_bytes(5)))->toArray();

        // Store temporarily in session until verified
        session([
            'pending_2fa_secret' => $secret,
            'pending_2fa_recovery_codes' => $recoveryCodes,
        ]);

        return back()->with([
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => $recoveryCodes,
            'two_factor_qr_url' => sprintf(
                'otpauth://totp/%s:%s?secret=%s&issuer=%s',
                rawurlencode(config('app.name')),
                $request->user()->email,
                $secret,
                rawurlencode(config('app.name'))
            ),
        ]);
    }

    /**
     * Confirm 2FA by verifying a TOTP code from the authenticator app.
     * On success, permanently stores the secret and hashed recovery codes.
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $secret = session('pending_2fa_secret');
        $recoveryCodes = session('pending_2fa_recovery_codes');

        if (! $secret || ! $recoveryCodes) {
            return back()->with('error', 'Please start the 2FA setup process first.');
        }

        if (! $this->verifyTOTP($secret, $request->code)) {
            return back()->with('error', 'Invalid verification code. Please try again.');
        }

        $request->user()->update([
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => collect($recoveryCodes)->map(fn (string $code) => bcrypt($code))->toArray(),
        ]);

        session()->forget(['pending_2fa_secret', 'pending_2fa_recovery_codes']);

        return back()->with([
            'success' => 'Two-factor authentication has been enabled.',
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA after confirming the user's password.
     */
    public function disable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $request->user()->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
        ]);

        return back()->with('success', 'Two-factor authentication disabled.');
    }

    /**
     * Generate a base32-encoded random secret (20 bytes -> 32 chars).
     */
    private function generateBase32Secret(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        $bytes = random_bytes(20);

        for ($i = 0; $i < 32; $i++) {
            $secret .= $chars[ord($bytes[$i]) & 0x1F];
        }

        return $secret;
    }

    /**
     * Decode a base32-encoded string back to raw bytes.
     */
    private function base32Decode(string $input): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $input = strtoupper($input);
        $output = '';
        $buffer = 0;
        $bitsLeft = 0;

        for ($i = 0; $i < strlen($input); $i++) {
            $pos = strpos($alphabet, $input[$i]);
            if ($pos === false) {
                continue;
            }

            $buffer = ($buffer << 5) | $pos;
            $bitsLeft += 5;

            if ($bitsLeft >= 8) {
                $output .= chr(($buffer >> ($bitsLeft - 8)) & 0xFF);
                $bitsLeft -= 8;
            }
        }

        return $output;
    }

    /**
     * Verify a TOTP code against the secret.
     * Checks the current, previous, and next 30-second windows for clock skew.
     */
    private function verifyTOTP(string $secret, string $code): bool
    {
        $decoded = $this->base32Decode($secret);
        $timeSlice = (int) floor(time() / 30);

        // Check current and adjacent time slices for clock skew
        for ($i = -1; $i <= 1; $i++) {
            $hmac = hash_hmac('sha1', pack('J', $timeSlice + $i), $decoded, true);
            $offset = ord($hmac[19]) & 0xf;

            $truncated = ((ord($hmac[$offset]) & 0x7f) << 24) |
                ((ord($hmac[$offset + 1]) & 0xff) << 16) |
                ((ord($hmac[$offset + 2]) & 0xff) << 8) |
                (ord($hmac[$offset + 3]) & 0xff);

            $otp = $truncated % 1000000;

            if (str_pad((string) $otp, 6, '0', STR_PAD_LEFT) === $code) {
                return true;
            }
        }

        return false;
    }
}
