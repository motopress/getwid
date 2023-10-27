<?php

namespace Getwid;

final class StringEncryption {

    private $cipher = 'aes-256-ctr';
    private $salt;
    private $passphrase;

    public function __construct() {
        $this->salt = $this->get_salt();
        $this->passphrase = $this->get_passphrase();
    }

    public function encrypt( $string_to_encrypt ) {

        if ( ! $this->can_encrypt() ) {
            return $string_to_encrypt;
        }

        $ivlen = openssl_cipher_iv_length( $this->cipher );
        $iv = openssl_random_pseudo_bytes( $ivlen );

        $encrypted_string = openssl_encrypt(
            $string_to_encrypt . $this->salt,
            $this->cipher,
            $this->passphrase,
            0,
            $iv
        );

        return base64_encode( $iv . $encrypted_string );
    }

    public function decrypt( $string_to_decrypt ) {

        if ( ! $this->can_encrypt() ) {
            return $string_to_decrypt;
        }

        $encrypted_string = base64_decode( $string_to_decrypt, true );

        $ivlen = openssl_cipher_iv_length( $this->cipher );
        $iv = substr( $encrypted_string, 0, $ivlen );

        $encrypted_string = substr( $encrypted_string, $ivlen );

        $decrypted_string = openssl_decrypt(
            $encrypted_string,
            $this->cipher,
            $this->passphrase,
            0,
            $iv
        );

        if ( ! $decrypted_string || substr( $decrypted_string, - strlen( $this->salt ) ) !== $this->salt ) {
            return $string_to_decrypt;
        }

        return substr( $decrypted_string, 0, - strlen( $this->salt ) );
    }

    private function can_encrypt() {

        if ( ! function_exists( 'openssl_encrypt' ) ) {
            return false;
        }

        if ( ! in_array( $this->cipher, openssl_get_cipher_methods() ) ) {
            return false;
        }

        return true;
    }

    private function get_passphrase() {

        if ( function_exists('wp_salt') && wp_salt() ) {
            return wp_salt();
        }

        return 'getwid_non_secret_passphrase';
    }

    private function get_salt() {
        return 'getwid_non_secret_salt';
    }

}
