<?php

namespace Getwid;

class AssetsOptimization {

	/**
	 * @var AssetsOptimization
	 */
	private static $instance = null;

    /**
     * Flag to indicate if CSS is already minified
     *
     * @var bool
     */
    private $alreadyoptimized = false;

	/**
     * @return AssetsOptimization
     */
    public static function getInstance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

	/**
	 * AssetsOptimization constructor.
	*/
	public function __construct() {

		getwid_maybe_add_option( 'getwid_load_assets_on_demand', false, true );
		getwid_maybe_add_option( 'getwid_move_css_to_head', false, true );

		if ( FALSE == $this->load_assets_on_demand() ||
			FALSE == $this->move_css_to_head() ) {
			return;
		}

		add_action( 'template_redirect', array( $this, 'buffer_start' ), 1 );

		add_filter( 'getwid/html/output', array( $this, 'filter_css' ) );
		add_filter( 'getwid/html/output', array( $this, 'filter_test' ) );

		// Filter Autoptimize plugin output
		add_filter( 'autoptimize_filter_html_before_minify', array( $this, 'filter_css' ) );

		//TODO: add support for other plugins?

	}

    /**
     * Setup output buffering if needed.
     *
     * @return void
     */
	public function buffer_start() {

		if ( $this->should_buffer() ) {
			ob_start( array( $this, 'buffer_end' ) );
		}
	}

    /**
     * Processes/optimizes the output-buffered content and returns it.
     * If the content is not processable, it is returned unmodified.
     *
     * @param string $html Buffered content.
     *
     * @return string
     */
	public function buffer_end( $html ) {

		// Bail early without modifying anything if we can't handle the content.
        if ( ! $this->is_valid_buffer( $html ) ) {
            return $html;
        }

		// Apply any filters to the final output
		$html = apply_filters( 'getwid/html/output', $html );

		return $html;
	}

	/*
	 * Test replacement
     *
     * @param string $html Buffered content.
     *
     * @return string
	 */
	public function filter_test( $html ) {

		if ( $this->alreadyoptimized ) {
			$html .= PHP_EOL . '<!-- getwid optimized -->';
		}

		return $html;
	}

	/*
	 * Find stylesheets of our blocks in original HTML and move them to Header
     *
     * @param string $html Buffered content.
     *
     * @return string
	 *
	 * Source \plugins\autoptimize\classes\autoptimizeStyles.php
	 */
	public function filter_css( $html ) {

		if ( $this->alreadyoptimized ) {
			return $html;
		}

		$css = array();

		$blocks = getwid()->blocksManager()->getBlocks();
		//var_dump($blocks);exit;

		$optimize_more = apply_filters( 'getwid/optimize/assets', [] );

		/*
		 * Blocks array example:
		 * ["getwid/anchor"] => object(Getwid\Blocks\Anchor) {}
		 *
		 * Style tag example:
		 * <link rel='stylesheet' id='getwid/banner-css'  href='https://.../wp-content/plugins/getwid/assets/blocks/banner/style.css' type='text/css' media='all' />
		 */

		// Find stylesheets in original html
		if ( preg_match_all( '#(<link[^>]*stylesheet[^>]*>)#Usmi', $html, $tag_matches ) ) {

            foreach ( $tag_matches[0] as $tag ) {

				if ( preg_match( '#<link.*id=("|\')(.*)-css("|\')#Usmi', $tag, $link_matches ) ) {

					$link_id = $link_matches[2];
					//var_dump($link_id);

					// Check if this is a stylesheet of our block
					if (
						array_key_exists( $link_id, $blocks ) ||
						in_array( $link_id, $optimize_more )
					) {
						//var_dump($link_id);

						// Save tag for next steps
						$css[ $link_id ] = $tag;

						// Clear tag in original html
						$html = str_replace( $tag, '<!-- #' . $link_id .' -->', $html );
					}
				}
			}
		}

		// Process stylesheets if we found ones
		if ( ! empty( $css ) ) {

			// move stylesheet to a new positon
			$replace_tag = array( '</title>', 'after' );

			// Debug
			$css_scope = PHP_EOL . '<!-- getwid styles -->' . PHP_EOL . "\t";

			// Print stylesheets
			$css_scope .= implode( PHP_EOL . "\t", $css );

			// Debug
			$css_scope .= PHP_EOL . '<!-- /getwid styles -->' . PHP_EOL;

			//var_dump($css_scope);exit;
			$html = $this->inject_in_html( $css_scope, $replace_tag, $html );

			// Mark as optimized
			$this->alreadyoptimized = true;
		}

		return $html;
	}

	/**
     * Injects/replaces the given payload markup into `$html`
     * at the specified location.
     * If the specified tag cannot be found, the payload is appended into
     * $html along with a warning wrapped inside <!--noptimize--> tags.
     *
     * @param string $payload Markup to inject.
     * @param array  $where   Array specifying the tag name and method of injection.
     *                        Index 0 is the tag name (i.e., `</body>`).
     *                        Index 1 specifies ?'before', 'after' or 'replace'. Defaults to 'before'.
     *
     * @return void
     */
    protected function inject_in_html( $payload, $where, $html )
    {
        $warned   = false;
        $position = $this->strpos( $html, $where[0] );
        if ( false !== $position ) {
            // Found the tag, setup content/injection as specified.
            if ( 'after' === $where[1] ) {
                $content = $where[0] . $payload;
            } elseif ( 'replace' === $where[1] ) {
                $content = $payload;
            } else {
                $content = $payload . $where[0];
            }
            // Place where specified.
            $html = $this->substr_replace(
                $html,
                $content,
                $position,
                // Using plain strlen() should be safe here for now, since
                // we're not searching for multibyte chars here still...
                strlen( $where[0] )
            );
        } else {
            // Couldn't find what was specified, just append and add a warning.
            $html .= $payload;
            if ( ! $warned ) {
                $tag_display    = str_replace( array( '<', '>' ), '', $where[0] );
                $html .= '<!--noptimize--><!-- We found a problem with the HTML in your Theme, tag `' . $tag_display . '` missing --><!--/noptimize-->';
                $warned         = true;
            }
        }

		return $html;
    }

    /**
     * Returns true if all the conditions to start output buffering are satisfied.
     *
     * @return bool
     */
    public function should_buffer() {

		$do_buffering = false;

		// Check for site being previewed in the Customizer (available since WP 4.0).
		$is_customize_preview = false;
		if ( function_exists( 'is_customize_preview' ) && is_customize_preview() ) {
			$is_customize_preview = is_customize_preview();
		}

		/**
		 * We only buffer the frontend requests (and then only if not a feed
		 * and not turned off explicitly and not when being previewed in Customizer)!
		 */
		$do_buffering = ( ! is_admin() && ! is_feed() && ! is_embed() && ! $is_customize_preview );

        return $do_buffering;
    }

    /**
     * Returns true if given markup is considered valid/processable/optimizable.
     *
     * @param string $content Markup.
     *
     * @return bool
     */
    public function is_valid_buffer( $content )
    {
        // Defaults to true.
        $valid = true;

		//TODO

        return $valid;
    }

    /**
     * Multibyte-capable strpos() if support is available on the server.
     * If not, it falls back to using \strpos().
     *
     * @param string      $haystack Haystack.
     * @param string      $needle   Needle.
     * @param int         $offset   Offset.
     * @param string|null $encoding Encoding. Default null.
     *
     * @return int|false
     */
    public function strpos( $haystack, $needle, $offset = 0, $encoding = null )
    {
        if ( $this->mbstring_available() ) {
            return ( null === $encoding ) ? \mb_strpos( $haystack, $needle, $offset ) : \mb_strpos( $haystack, $needle, $offset, $encoding );
        } else {
            return \strpos( $haystack, $needle, $offset );
        }
    }

    /**
     * Our wrapper around implementations of \substr_replace()
     * that attempts to not break things horribly if at all possible.
     * Uses mbstring if available, before falling back to regular
     * substr_replace() (which works just fine in the majority of cases).
     *
     * @param string      $string      String.
     * @param string      $replacement Replacement.
     * @param int         $start       Start offset.
     * @param int|null    $length      Length.
     * @param string|null $encoding    Encoding.
     *
     * @return string
     */
    public function substr_replace( $string, $replacement, $start, $length = null, $encoding = null )
    {
        if ( $this->mbstring_available() ) {
            $strlen = $this->strlen( $string, $encoding );

            if ( $start < 0 ) {
                if ( -$start < $strlen ) {
                    $start = $strlen + $start;
                } else {
                    $start = 0;
                }
            } elseif ( $start > $strlen ) {
                $start = $strlen;
            }

            if ( null === $length || '' === $length ) {
                $start2 = $strlen;
            } elseif ( $length < 0 ) {
                $start2 = $strlen + $length;
                if ( $start2 < $start ) {
                    $start2 = $start;
                }
            } else {
                $start2 = $start + $length;
            }

            if ( null === $encoding ) {
                $leader  = $start ? \mb_substr( $string, 0, $start ) : '';
                $trailer = ( $start2 < $strlen ) ? \mb_substr( $string, $start2, null ) : '';
            } else {
                $leader  = $start ? \mb_substr( $string, 0, $start, $encoding ) : '';
                $trailer = ( $start2 < $strlen ) ? \mb_substr( $string, $start2, null, $encoding ) : '';
            }

            return "{$leader}{$replacement}{$trailer}";
        }

        return ( null === $length ) ? \substr_replace( $string, $replacement, $start ) : \substr_replace( $string, $replacement, $start, $length );
    }

    /**
     * Attempts to return the number of characters in the given $string if
     * mbstring is available. Returns the number of bytes
     * (instead of characters) as fallback.
     *
     * @param string      $string   String.
     * @param string|null $encoding Encoding.
     *
     * @return int Number of characters or bytes in given $string
     *             (characters if/when supported, bytes otherwise).
     */
    public function strlen( $string, $encoding = null )
    {
        if ( $this->mbstring_available() ) {
            return ( null === $encoding ) ? \mb_strlen( $string ) : \mb_strlen( $string, $encoding );
        } else {
            return \strlen( $string );
        }
    }

    /**
     * Returns true when mbstring is available.
     *
     * @param bool|null $override Allows overriding the decision.
     *
     * @return bool
     */
    public function mbstring_available()
    {

		$available = \extension_loaded( 'mbstring' );

        return $available;
    }

    public function load_assets_on_demand()
	{
    	return get_option( 'getwid_load_assets_on_demand', false );
	}

    public function move_css_to_head()
	{
    	return get_option( 'getwid_move_css_to_head', false );
	}

}
