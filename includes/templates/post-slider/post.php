<?php
/**
 * The template for displaying all single posts and attachments
 */
$backEnd = $extra_attr['back_end'];

$imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');
$showTitle = isset( $attributes['showTitle'] ) && $attributes['showTitle'];
$showContent = isset( $attributes['showContent'] ) && $attributes['showContent'] !='none' ? true : false;
$contentLength = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;

//Slide style
$slide_style = '';
if ( isset( $attributes['minHeight'] ) ) {
    $slide_style .= 'min-height: '.$attributes['minHeight'].';';
}
$slide_style = trim($slide_style);

//Content Slide style
$slide_container_style = '';
//Padding
$slide_container_class = $extra_attr['block_name'].'__slide-container';

$slide_container_class .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] != 'custom') ? " getwid-padding-top-".esc_attr($attributes['paddingTop']) : '';
$slide_container_class .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] != 'custom') ? " getwid-padding-bottom-".esc_attr($attributes['paddingBottom']) : '';
$slide_container_class .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] != 'custom') ? " getwid-padding-left-".esc_attr($attributes['paddingLeft']) : '';
$slide_container_class .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] != 'custom') ? " getwid-padding-right-".esc_attr($attributes['paddingRight']) : '';

$slide_container_class .= (isset($attributes['paddingTopTablet']) && $attributes['paddingTopTablet'] !='' && $attributes['paddingTopTablet'] != 'custom') ? " getwid-padding-tablet-top-".esc_attr($attributes['paddingTopTablet']) : '';
$slide_container_class .= (isset($attributes['paddingBottomTablet']) && $attributes['paddingBottomTablet'] !='' && $attributes['paddingBottomTablet'] != 'custom') ? " getwid-padding-tablet-bottom-".esc_attr($attributes['paddingBottomTablet']) : '';
$slide_container_class .= (isset($attributes['paddingLeftTablet']) && $attributes['paddingLeftTablet'] !='' && $attributes['paddingLeftTablet'] != 'custom') ? " getwid-padding-tablet-left-".esc_attr($attributes['paddingLeftTablet']) : '';
$slide_container_class .= (isset($attributes['paddingRightTablet']) && $attributes['paddingRightTablet'] !='' && $attributes['paddingRightTablet'] != 'custom') ? " getwid-padding-tablet-right-".esc_attr($attributes['paddingRightTablet']) : '';

$slide_container_class .= (isset($attributes['paddingTopMobile']) && $attributes['paddingTopMobile'] !='' && $attributes['paddingTopMobile'] != 'custom') ? " getwid-padding-mobile-top-".esc_attr($attributes['paddingTopMobile']) : '';
$slide_container_class .= (isset($attributes['paddingBottomMobile']) && $attributes['paddingBottomMobile'] !='' && $attributes['paddingBottomMobile'] != 'custom') ? " getwid-padding-mobile-bottom-".esc_attr($attributes['paddingBottomMobile']) : '';
$slide_container_class .= (isset($attributes['paddingLeftMobile']) && $attributes['paddingLeftMobile'] !='' && $attributes['paddingLeftMobile'] != 'custom') ? " getwid-padding-mobile-left-".esc_attr($attributes['paddingLeftMobile']) : '';
$slide_container_class .= (isset($attributes['paddingRightMobile']) && $attributes['paddingRightMobile'] !='' && $attributes['paddingRightMobile'] != 'custom') ? " getwid-padding-mobile-right-".esc_attr($attributes['paddingRightMobile']) : '';

$slide_container_style .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] == 'custom') ? "padding-top:".esc_attr($attributes['paddingTopValue']).";" : '';
$slide_container_style .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] == 'custom') ? "padding-bottom:".esc_attr($attributes['paddingBottomValue']).";" : '';
$slide_container_style .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] == 'custom') ? "padding-left:".esc_attr($attributes['paddingLeftValue']).";" : '';
$slide_container_style .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] == 'custom') ? "padding-right:".esc_attr($attributes['paddingRightValue']).";" : '';

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
    <div <?php echo (!empty($slide_container_style) ? 'style="'.esc_attr($slide_container_style).'"' : '');?> class="<?php echo esc_attr($slide_container_class);?>">
        <div <?php echo (!empty($slide_wrapper_style) ? 'style="'.esc_attr($slide_wrapper_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-wrapper');?>">        
            <figure class="<?php echo esc_attr($extra_attr['block_name'].'__slide-media');?>">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));?></a>
                <div <?php echo (!empty($slide_media_style) ? 'style="'.esc_attr($slide_media_style).'"' : '');?> <?php echo (!empty($slide_media_class) ? 'class="'.esc_attr($slide_media_class).'"' : '');?>></div>    
            </figure>
            <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_content_style).'"' : '');?> <?php echo (!empty($slide_content_class) ? 'class="'.esc_attr($slide_content_class).'"' : '');?>>
                <div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content-wrapper');?>">
                    <?php if ( $showTitle ) { ?>
                        <?php the_title( '<'.esc_attr($attributes['titleTag']).'><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                    <?php } ?>

                    <?php if ( $showContent ) { ?>
                        <div><?php echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );?></div>
                    <?php } ?>
                </div> 
            </div> 
        </div>
    </div>
</article>