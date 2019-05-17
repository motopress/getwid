<?php
/**
 * The template for displaying all single posts and attachments
 */
$backEnd = $extra_attr['back_end'];

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
$slide_container_style = trim($slide_container_style);

//Wrapper Slide style
$slide_wrapper_style = '';
if ( isset( $attributes['contentMaxWidth'] ) ) {
    $slide_wrapper_style .= 'max-width: '.$attributes['contentMaxWidth'].'px;';
}
$slide_wrapper_style = trim($slide_wrapper_style);

//Media Slide style & class
$slide_media_style = '';
$slide_media_class = $extra_attr['block_name'].'__slide-media-overlay';
if (isset( $attributes['backgroundColor']) || isset( $attributes['customBackgroundColor'] )){
    preg_match('/^#/', $attributes['backgroundColor'], $matches);
    //HEX
    $backgroundColorHEX = '';
    if (isset($matches[0])){
        $backgroundColorHEX = $attributes['backgroundColor'];
    }
    //String
    else {
        $get_colors = get_theme_support('editor-color-palette')[0];
        foreach ($get_colors as $key => $value) {
            if ($value['slug'] == $attributes['backgroundColor']){
                $backgroundColorHEX =  $value['color'];
            }
        }        
    }

    if ($backEnd){
        $slide_media_style .= 'background-color: '.(isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : $backgroundColorHEX).';';
    } else {
        if (isset($attributes['customBackgroundColor'])){
            $slide_media_style .= 'background-color: '.$attributes['customBackgroundColor'].';';
        } else {
            $slide_media_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
        }
    } 
}

if ( isset( $attributes['overlayOpacity']) ) {
    $slide_media_style .= 'opacity: '.($attributes['overlayOpacity']/100).';';
}  

//Content Slide style & class
$slide_content_style = '';
$slide_content_class = $extra_attr['block_name'].'__slide-content';
if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
    preg_match('/^#/', $attributes['textColor'], $matches);
    //HEX
    $textColorHEX = '';
    if (isset($matches[0])){
        $textColorHEX = $attributes['textColor'];
    }
    //String
    else {
        $get_colors = get_theme_support('editor-color-palette')[0];
        foreach ($get_colors as $key => $value) {
            if ($value['slug'] == $attributes['textColor']){
                $textColorHEX =  $value['color'];
            }
        }        
    }

    if ($backEnd){
        $slide_content_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
    } else {
        if (isset($attributes['customTextColor'])){
            $slide_content_style .= 'color: '.$attributes['customTextColor'].';';
        } else {
            $slide_content_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
        }
    }
}

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');
?>

<article <?php echo (!empty($slide_style) ? 'style="'.esc_attr($slide_style).'"' : '');?> id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__slide');?>">
    <div <?php echo (!empty($slide_container_style) ? 'style="'.esc_attr($slide_container_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-container');?>">
        <div <?php echo (!empty($slide_wrapper_style) ? 'style="'.esc_attr($slide_wrapper_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-wrapper');?>">        
            <figure class="<?php echo esc_attr($extra_attr['block_name'].'__slide-media');?>">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));?></a>
                <div <?php echo (!empty($slide_media_style) ? 'style="'.esc_attr($slide_media_style).'"' : '');?> <?php echo (!empty($slide_media_class) ? 'class="'.esc_attr($slide_media_class).'"' : '');?>></div>    
            </figure>
            <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_content_style).'"' : '');?> <?php echo (!empty($slide_content_class) ? 'class="'.esc_attr($slide_content_class).'"' : '');?>>
                <div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content-wrapper');?>">
                <?php the_title( '<'.esc_attr($attributes['titleTag']).'><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                    <div><?php echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );?></div>
                </div> 
            </div> 
        </div>
    </div>
</article>