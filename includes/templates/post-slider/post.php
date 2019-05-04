<?php
/**
 * The template for displaying all single posts and attachments
 */
$imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');
$contentLength = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;

//Slide style
$slide_style = '';
if ( isset( $attributes['minHeight'] ) ) {
    $slide_style .= 'min-height: '.$attributes['minHeight'].';';
}
$slide_style = trim($slide_style);

//Content Slide style
$slide_container_style = '';
if ( isset( $attributes['minHeight'] ) ) {
    $slide_container_style .= 'min-height: '.$attributes['minHeight'].';';
}
if ( isset( $attributes['verticalAlign'] ) ) {
    if ($attributes['verticalAlign'] == 'top'){
        $slide_container_style .= 'align-items: flex-start;';
    } elseif ($attributes['verticalAlign'] == 'center'){
        $slide_container_style .= 'align-items: center;';        
    } elseif ($attributes['verticalAlign'] == 'bottom'){
        $slide_container_style .= 'align-items: flex-end;';        
    }
}

if ( isset( $attributes['horizontalAlign'] ) ) {
    if ($attributes['horizontalAlign'] == 'left'){
        $slide_container_style .= 'justify-content: flex-start;';
    } elseif ($attributes['horizontalAlign'] == 'center'){
        $slide_container_style .= 'justify-content: center;';        
    } elseif ($attributes['horizontalAlign'] == 'right'){
        $slide_container_style .= 'justify-content: flex-end;';        
    }
}
$slide_content_style = trim($slide_content_style);

//Wrapper Slide style
$slide_wrapper_style = '';
if ( isset( $attributes['contentMaxWidth'] ) ) {
    $slide_wrapper_style .= 'max-width: '.$attributes['contentMaxWidth'].'px;';
}
$slide_wrapper_style = trim($slide_wrapper_style);

//Media Slide style
$slide_media_style = '';
if ( isset( $attributes['overlayColor'] ) ) {
    $slide_media_style .= 'background-color: '.$attributes['overlayColor'].';';
}
if ( isset( $attributes['overlayColor']) && isset( $attributes['overlayOpacity']) ) {
    $slide_media_style .= 'opacity: '.($attributes['overlayOpacity']/100).';';
}
$slide_media_style = trim($slide_media_style);

//Content Slide style
$slide_content_style = '';
if ( isset( $attributes['textColor'] ) ) {
    $slide_content_style .= 'color: '.$attributes['textColor'].';';
}
$slide_content_style = trim($slide_content_style);

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');

?>

<article <?php echo (!empty($slide_style) ? 'style="'.esc_attr($slide_style).'"' : '');?> id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__slide');?>">
    <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_container_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-container');?>">
        <div <?php echo (!empty($slide_wrapper_style) ? 'style="'.esc_attr($slide_wrapper_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-wrapper');?>">        
            <figure class="<?php echo esc_attr($extra_attr['block_name'].'__slide-media');?>">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));?></a>
                <div <?php echo (!empty($slide_media_style) ? 'style="'.esc_attr($slide_media_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-media-overlay');?>"></div>    
            </figure>
            <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_content_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content');?>">
                <div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content-wrapper');?>">
                <?php the_title( '<'.esc_attr($attributes['titleTag']).'><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                    <div><?php echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );?></div>
                </div> 
            </div> 
        </div>
    </div>
</article>